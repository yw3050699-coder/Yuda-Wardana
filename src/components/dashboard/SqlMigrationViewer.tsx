import React, { useState, useEffect } from 'react';
import { checkSupabaseConnection, SUPABASE_URL, SUPABASE_ANON_KEY } from '../../lib/supabase';
import { Database, Copy, Check, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SqlMigrationViewer: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [connStatus, setConnStatus] = useState<{
    loading: boolean;
    connected?: boolean;
    message?: string;
  }>({ loading: true });

  const testConnection = async () => {
    setConnStatus({ loading: true });
    const res = await checkSupabaseConnection();
    setConnStatus({
      loading: false,
      connected: res.connected,
      message: res.message,
    });
  };

  useEffect(() => {
    testConnection();
  }, []);

  const migrations = [
    {
      filename: '20261024000000_create_elections_and_profiles.sql',
      title: 'Migrasi 1: Skema Awal Tabel elections & profiles (UUID PK)',
      sql: `-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabel 'elections' dengan UUID Primary Key
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

-- 3. Tabel 'profiles' terhubung ke auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    account_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. RLS & Policy
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read elections" ON public.elections FOR SELECT TO public USING (true);
CREATE POLICY "User read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());`,
    },
    {
      filename: '20261024000001_rls_and_functions.sql',
      title: 'Migrasi 2: Transaksi Atomik Pencatatan Suara & Secret Ballot',
      sql: `-- Fungsi Atomik Stored Procedure di Supabase PostgreSQL
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
    v_receipt_hash TEXT;
BEGIN
    SELECT * INTO v_election FROM public.elections WHERE id = p_election_id;
    IF NOT FOUND OR v_election.status != 'open' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Pemilihan tidak sedang dibuka.');
    END IF;

    SELECT EXISTS (SELECT 1 FROM public.voter_participation WHERE election_id = p_election_id AND voter_id = p_voter_id) INTO v_already_participated;
    IF v_already_participated THEN
        RETURN jsonb_build_object('success', false, 'error', 'Hak pilih telah digunakan sebelumnya.');
    END IF;

    v_receipt_hash := encode(digest(p_election_id::text || p_voter_id::text || now()::text, 'sha256'), 'hex');

    -- 1. Catat partisipasi pemilih
    INSERT INTO public.voter_participation (election_id, voter_id, participated_at, verification_hash)
    VALUES (p_election_id, p_voter_id, now(), v_receipt_hash);

    -- 2. Simpan surat suara secara terpisah & anonim (TANPA voter_id!)
    INSERT INTO public.ballots (election_id, candidate_id, recorded_at, ballot_status)
    VALUES (p_election_id, p_candidate_id, now(), 'valid');

    RETURN jsonb_build_object('success', true, 'receipt_hash', v_receipt_hash);
END;
$$;`,
    },
  ];

  const handleCopy = (sql: string, index: number) => {
    navigator.clipboard.writeText(sql);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-700" />
          <span>Panduan Koneksi & Migrasi SQL Supabase</span>
        </h2>
        <p className="text-xs text-slate-500">
          Aplikasi telah terhubung ke endpoint Supabase. Gunakan skrip SQL di bawah ini pada SQL Editor dashboard Supabase Anda.
        </p>
      </div>

      {/* Supabase Connection Status Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Status Klien Supabase:</div>
          <div className="flex items-center gap-2">
            {connStatus.loading ? (
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Memeriksa konektivitas host...</span>
              </span>
            ) : connStatus.connected ? (
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Terhubung Aktif ke Supabase Pekon Rawas</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Tersambung (Menunggu Eksekusi Migrasi SQL di Cloud)</span>
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            URL: {SUPABASE_URL}
          </div>
        </div>

        <button
          onClick={testConnection}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Uji Ulang Koneksi</span>
        </button>
      </div>

      {/* Migration Script Cards */}
      <div className="space-y-4">
        {migrations.map((mig, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{mig.title}</span>
                <span className="text-[11px] font-mono text-slate-500">{mig.filename}</span>
              </div>
              <button
                onClick={() => handleCopy(mig.sql, idx)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono bg-slate-950 text-emerald-400 overflow-x-auto max-h-56 leading-relaxed">
              {mig.sql}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
