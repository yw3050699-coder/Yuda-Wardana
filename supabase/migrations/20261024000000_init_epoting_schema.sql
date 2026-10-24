-- ==============================================================================
-- E-POTING PEKON RAWAS
-- Migrasi 1: Inisialisasi Struktur Tabel Relasional (PostgreSQL / Supabase)
-- Wilayah: Pekon Rawas, Kabupaten Pesisir Barat, Provinsi Lampung
-- ==============================================================================

-- 1. Tabel ELECTIONS
CREATE TABLE IF NOT EXISTS public.elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region_name VARCHAR(255) NOT NULL DEFAULT 'Pekon Rawas, Kabupaten Pesisir Barat',
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'open', 'closed', 'completed')),
    is_demo BOOLEAN NOT NULL DEFAULT true,
    results_published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Tabel CANDIDATES
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    ballot_number INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    photo_path TEXT,
    profile TEXT,
    vision TEXT,
    mission JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'disqualified')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_election_ballot_number UNIQUE (election_id, ballot_number)
);

-- 3. Tabel PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    account_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabel USER_ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'panitia', 'verifikator', 'pengawas', 'voter')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- 5. Tabel VOTERS
CREATE TABLE IF NOT EXISTS public.voters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    voter_reference VARCHAR(100) NOT NULL UNIQUE,
    dusun VARCHAR(100),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Tabel VOTER_ELIGIBILITY
CREATE TABLE IF NOT EXISTS public.voter_eligibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
    eligibility_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (eligibility_status IN ('eligible', 'ineligible', 'pending')),
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_election_voter_eligibility UNIQUE (election_id, voter_id)
);

-- 7. Tabel VOTER_PARTICIPATION
-- Mencatat penggunaan hak pilih tanpa menyimpan pilihan calon.
CREATE TABLE IF NOT EXISTS public.voter_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
    participated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status VARCHAR(50) NOT NULL DEFAULT 'participated',
    verification_hash VARCHAR(255) NOT NULL,
    CONSTRAINT uq_election_voter_participation UNIQUE (election_id, voter_id)
);

-- 8. Tabel BALLOTS (Surat Suara Rahasia)
-- PERHATIAN: Kolom voter_id, user_id, NIK, atau identitas pribadi sama sekali TIDAK BOLEH
-- ada di tabel ini demi menjaga asas LUBER (Langsung, Umum, Bebas, Rahasia).
CREATE TABLE IF NOT EXISTS public.ballots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE RESTRICT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ballot_status VARCHAR(50) NOT NULL DEFAULT 'valid' CHECK (ballot_status IN ('valid', 'invalid', 'provisional'))
);

-- 9. Tabel ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'pengumuman',
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Tabel AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing untuk optimasi query
CREATE INDEX IF NOT EXISTS idx_candidates_election ON public.candidates(election_id);
CREATE INDEX IF NOT EXISTS idx_voter_eligibility_election ON public.voter_eligibility(election_id, voter_id);
CREATE INDEX IF NOT EXISTS idx_ballots_election ON public.ballots(election_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
