-- ==============================================================================
-- E-POTING PEKON RAWAS
-- Migrasi 3: Data Awal Simulasi & Akun Petugas Demo
-- ==============================================================================

-- 1. Inisialisasi Kegiatan Simulasi
INSERT INTO public.elections (
    id,
    name,
    region_name,
    description,
    start_at,
    end_at,
    status,
    is_demo,
    created_at,
    updated_at
) VALUES (
    'b0000000-0000-0000-0000-000000000001'::uuid,
    'Simulasi Pemilihan Peratin Pekon Rawas Periode 2026-2032',
    'Pekon Rawas, Kabupaten Pesisir Barat',
    'Simulasi pemungutan suara elektronik untuk menguji kesiapan sistem informasi, verifikasi DPT pemilih, dan transparansi penghitungan suara berbasis standar integritas pemilu.',
    now() - interval '2 days',
    now() + interval '5 days',
    'open',
    true,
    now() - interval '2 days',
    now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Inisialisasi Calon Demo
INSERT INTO public.candidates (
    id,
    election_id,
    ballot_number,
    full_name,
    photo_path,
    profile,
    vision,
    mission,
    status
) VALUES 
(
    'c0000000-0000-0000-0000-000000000001'::uuid,
    'b0000000-0000-0000-0000-000000000001'::uuid,
    1,
    'Ahmad Fauzi, S.Pd.',
    '/src/assets/images/candidate_fauzi_1792855861315.jpg',
    'Tokoh pendidik dan penggerak masyarakat Pekon Rawas yang berpengalaman lebih dari 15 tahun dalam pemberdayaan pemuda dan penguatan sarana pendidikan desa.',
    'Mewujudkan Pekon Rawas yang Berdaya, Berakhlak, dan Mandiri Berbasis Potensi Maritim dan Pertanian Berkelanjutan.',
    '["Peningkatan transparansi tata kelola anggaran pekon", "Optimalisasi sarana jalan pertanian dan nelayan", "Pengembangan beasiswa prestasi", "Penguatan peran BUMDes"]'::jsonb,
    'active'
),
(
    'c0000000-0000-0000-0000-000000000002'::uuid,
    'b0000000-0000-0000-0000-000000000001'::uuid,
    2,
    'Siti Rahmawati, S.E.',
    '/src/assets/images/candidate_rahma_1792855862550.jpg',
    'Praktisi ekonomi kerakyatan dan ketua koperasi wanita pekon, fokus pada hilirisasi produk UMKM olahan damar, kopi, dan kerajinan tapis Pesisir Barat.',
    'Pekon Rawas Maju, Tangguh, dan Inklusif Melalui Penguatan Ekonomi Kreatif dan Kesejahteraan Keluarga.',
    '["Pemberian modal bergulir dan pelatihan UMKM", "Peningkatan mutu Posyandu dan pencegahan stunting", "Perbaikan sanitasi lingkungan", "Pusat kreasi adat Saibatin"]'::jsonb,
    'active'
),
(
    'c0000000-0000-0000-0000-000000000003'::uuid,
    'b0000000-0000-0000-0000-000000000001'::uuid,
    3,
    'Hendra Saputra',
    '/src/assets/images/candidate_hendra_1792855861742.jpg',
    'Pemuda pelopor agraria dan inovator agrowisata pesisir, aktif memperjuangkan perlindungan ekosistem pesisir dan modernisasi alat tangkap nelayan tradisional.',
    'Revitalisasi Desa Pesisir: Kolaborasi Antar-Generasi Menuju Pekon Rawas Modern dan Lestari.',
    '["Modernisasi rantai dingin nelayan", "Pengembangan wisata bahari surfing Krui", "Pelayanan administrasi 1 hari selesai", "Konservasi pesisir dan mitigasi abrasi"]'::jsonb,
    'active'
) ON CONFLICT (id) DO NOTHING;

-- 3. Pengumuman Awal
INSERT INTO public.announcements (
    id,
    election_id,
    title,
    content,
    category,
    created_by
) VALUES (
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'b0000000-0000-0000-0000-000000000001'::uuid,
    'Pembukaan Akses Simulasi Bilik Suara Elektronik Pekon Rawas',
    'Panitia Pemilihan Peratin membuka masa uji coba simulasi pemungutan suara bagi seluruh warga yang telah terdaftar dalam Daftar Pemilih Sementara (DPS). Uji coba ini murni simulasi.',
    'pengumuman',
    'Panitia Pemilihan Peratin Rawas'
) ON CONFLICT (id) DO NOTHING;
