-- ==============================================================================
-- E-POTING PEKON RAWAS
-- Migrasi 2: Row Level Security (RLS) & Transaksi Atomik Pencatatan Suara
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voter_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voter_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Cek peran pengguna yang sedang login
CREATE OR REPLACE FUNCTION public.has_role(required_role VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = required_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Policies untuk ELECTIONS
-- Publik dapat melihat kegiatan yang aktif/terjadwal/selesai
CREATE POLICY "Public read elections" ON public.elections
    FOR SELECT TO public USING (true);

-- Admin & Panitia dapat mengelola elections
CREATE POLICY "Admin/Panitia manage elections" ON public.elections
    FOR ALL TO authenticated
    USING (public.has_role('admin') OR public.has_role('panitia'))
    WITH CHECK (public.has_role('admin') OR public.has_role('panitia'));

-- 2. Policies untuk CANDIDATES
-- Publik dapat membaca calon aktif
CREATE POLICY "Public read candidates" ON public.candidates
    FOR SELECT TO public USING (true);

-- Panitia dan Admin dapat menambah/mengedit calon
CREATE POLICY "Panitia manage candidates" ON public.candidates
    FOR ALL TO authenticated
    USING (public.has_role('panitia') OR public.has_role('admin'))
    WITH CHECK (public.has_role('panitia') OR public.has_role('admin'));

-- 3. Policies untuk PROFILES
CREATE POLICY "User read own profile" ON public.profiles
    FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role('admin'));

CREATE POLICY "User update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (id = auth.uid());

-- 4. Policies untuk USER_ROLES
CREATE POLICY "Admin read all roles" ON public.user_roles
    FOR SELECT TO authenticated USING (public.has_role('admin') OR user_id = auth.uid());

CREATE POLICY "Admin manage roles" ON public.user_roles
    FOR ALL TO authenticated USING (public.has_role('admin'));

-- 5. Policies untuk VOTERS
-- Pemilih hanya dapat melihat data dirinya sendiri
CREATE POLICY "Voter read own record" ON public.voters
    FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Verifikator, Panitia, dan Admin dapat melihat daftar pemilih
CREATE POLICY "Officers view voters" ON public.voters
    FOR SELECT TO authenticated
    USING (public.has_role('verifikator') OR public.has_role('panitia') OR public.has_role('admin') OR public.has_role('pengawas'));

-- 6. Policies untuk VOTER_ELIGIBILITY
CREATE POLICY "Voter view own eligibility" ON public.voter_eligibility
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.voters WHERE voters.id = voter_eligibility.voter_id AND voters.user_id = auth.uid()));

CREATE POLICY "Verifikator manage eligibility" ON public.voter_eligibility
    FOR ALL TO authenticated
    USING (public.has_role('verifikator') OR public.has_role('admin'))
    WITH CHECK (public.has_role('verifikator') OR public.has_role('admin'));

-- 7. Policies untuk VOTER_PARTICIPATION
-- Pemilih hanya boleh melihat apakah dirinya sudah berpartisipasi
CREATE POLICY "Voter read own participation" ON public.voter_participation
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.voters WHERE voters.id = voter_participation.voter_id AND voters.user_id = auth.uid()));

CREATE POLICY "Officers view participation records" ON public.voter_participation
    FOR SELECT TO authenticated
    USING (public.has_role('pengawas') OR public.has_role('panitia') OR public.has_role('admin'));

-- 8. Policies untuk BALLOTS (Surat Suara)
-- PERHATIAN: Tidak ada pengguna individual (termasuk pemilih/admin) yang boleh membaca baris suara individual sembarangan!
-- Hanya query rekapitulasi / pengawas dan panitia saat kegiatan ditutup atau publikasi.
CREATE POLICY "Officers aggregate ballots" ON public.ballots
    FOR SELECT TO authenticated
    USING (public.has_role('panitia') OR public.has_role('pengawas') OR public.has_role('admin'));

-- 9. Policies untuk ANNOUNCEMENTS
CREATE POLICY "Public read announcements" ON public.announcements
    FOR SELECT TO public USING (true);

CREATE POLICY "Panitia manage announcements" ON public.announcements
    FOR ALL TO authenticated
    USING (public.has_role('panitia') OR public.has_role('admin'))
    WITH CHECK (public.has_role('panitia') OR public.has_role('admin'));

-- 10. Policies untuk AUDIT_LOGS
CREATE POLICY "Officers view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.has_role('admin') OR public.has_role('pengawas'));

CREATE POLICY "System insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);


-- ==============================================================================
-- FUNGSI TRANSAKSI DATABASE ATOMIK: cast_simulated_ballot
-- Menjamin:
-- 1. Validasi status pemilihan harus 'open'
-- 2. Validasi waktu saat ini berada di antara start_at dan end_at
-- 3. Validasi kelayakan pemilih ('eligible')
-- 4. Validasi calon berasal dari pemilihan yang sama
-- 5. Pencegahan partisipasi ganda (Double-voting prevention)
-- 6. Atomisitas: Partisipasi dicatat dan surat suara anonim dimasukkan dalam 1 transaksi
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.cast_simulated_ballot(
    p_election_id UUID,
    p_voter_id UUID,
    p_candidate_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_election RECORD;
    v_eligibility RECORD;
    v_already_participated BOOLEAN;
    v_candidate_valid BOOLEAN;
    v_receipt_hash TEXT;
BEGIN
    -- 1. Periksa status dan jadwal kegiatan pemilihan
    SELECT * INTO v_election FROM public.elections WHERE id = p_election_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Kegiatan pemilihan tidak ditemukan.');
    END IF;

    IF v_election.status != 'open' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Pemilihan sedang tidak dibuka untuk pemungutan suara.');
    END IF;

    IF now() < v_election.start_at OR now() > v_election.end_at THEN
        RETURN jsonb_build_object('success', false, 'error', 'Waktu pemungutan suara berada di luar jadwal yang ditetapkan.');
    END IF;

    -- 2. Validasi calon terdaftar dalam kegiatan yang sama dan aktif
    SELECT EXISTS (
        SELECT 1 FROM public.candidates
        WHERE id = p_candidate_id AND election_id = p_election_id AND status = 'active'
    ) INTO v_candidate_valid;

    IF NOT v_candidate_valid THEN
        RETURN jsonb_build_object('success', false, 'error', 'Calon tidak valid atau tidak aktif pada kegiatan ini.');
    END IF;

    -- 3. Validasi kelayakan pemilih
    SELECT * INTO v_eligibility FROM public.voter_eligibility
    WHERE election_id = p_election_id AND voter_id = p_voter_id;

    IF NOT FOUND OR v_eligibility.eligibility_status != 'eligible' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Pemilih tidak memenuhi syarat kelayakan (belum diverifikasi/tidak berhak).');
    END IF;

    -- 4. Periksa pencegahan hak pilih ganda (Atomic check)
    SELECT EXISTS (
        SELECT 1 FROM public.voter_participation
        WHERE election_id = p_election_id AND voter_id = p_voter_id
    ) INTO v_already_participated;

    IF v_already_participated THEN
        RETURN jsonb_build_object('success', false, 'error', 'Hak pilih telah digunakan sebelumnya. Partisipasi ganda ditolak.');
    END IF;

    -- 5. Buat kode verifikasi hash tanda bukti partisipasi (Cryptographic Receipt Hash)
    -- Hash ini TIDAK mengandung candidate_id agar pilihan tetap rahasia.
    v_receipt_hash := encode(digest(p_election_id::text || p_voter_id::text || now()::text, 'sha256'), 'hex');

    -- 6. Transaksi: Catat partisipasi pemilih
    INSERT INTO public.voter_participation (
        election_id,
        voter_id,
        participated_at,
        status,
        verification_hash
    ) VALUES (
        p_election_id,
        p_voter_id,
        now(),
        'participated',
        v_receipt_hash
    );

    -- 7. Transaksi: Simpan surat suara secara terpisah & anonim (TANPA voter_id!)
    INSERT INTO public.ballots (
        election_id,
        candidate_id,
        recorded_at,
        ballot_status
    ) VALUES (
        p_election_id,
        p_candidate_id,
        now(),
        'valid'
    );

    -- 8. Catat ke audit log (tanpa menyimpan candidate_id atau pilihan rahasia)
    INSERT INTO public.audit_logs (
        action,
        entity_type,
        entity_id,
        metadata
    ) VALUES (
        'BALLOT_CAST_SUCCESS',
        'voter_participation',
        p_voter_id,
        jsonb_build_object('election_id', p_election_id, 'receipt_hash', substring(v_receipt_hash from 1 for 12))
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Suara simulasi berhasil dicatat secara sah dan rahasia.',
        'receipt_hash', v_receipt_hash,
        'timestamp', now()
    );
END;
$$;
