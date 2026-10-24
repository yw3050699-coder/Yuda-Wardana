-- ==============================================================================
-- E-POTING PEKON RAWAS
-- Migrasi Awal: Tabel 'elections' & 'profiles'
-- Wilayah: Pekon Rawas, Kabupaten Pesisir Barat, Provinsi Lampung
-- ==============================================================================

-- 1. Ekstensi UUID & Kriptografi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabel 'elections' (Kegiatan Pemilihan Peratin / Simulasi)
-- Menggunakan UUID sebagai Primary Key sesuai spesifikasi teknis
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

-- 3. Tabel 'profiles' (Profil Pengguna Terkait auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    account_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Kebijakan RLS (Security Policies)
-- Public read untuk tabel elections
CREATE POLICY "Public read elections" ON public.elections
    FOR SELECT TO public USING (true);

-- Authenticated update untuk profil sendiri
CREATE POLICY "User read own profile" ON public.profiles
    FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "User update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (id = auth.uid());

-- Trigger otomatis untuk memperbarui kolom 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_elections_updated_at
    BEFORE UPDATE ON public.elections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_elections_status ON public.elections(status);
CREATE INDEX IF NOT EXISTS idx_elections_dates ON public.elections(start_at, end_at);
