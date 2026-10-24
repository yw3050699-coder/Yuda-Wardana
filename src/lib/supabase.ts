/**
 * E-POTING PEKON RAWAS
 * Konfigurasi & Inisialisasi Klien Supabase (Next.js & Vite Compatible)
 * Wilayah: Pekon Rawas, Kabupaten Pesisir Barat, Lampung
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ambil URL dan Anon Key dari environment variabel (.env.local / .env)
const getEnvVar = (viteKey: string, nextKey: string, fallback: string = ''): string => {
  // Vite env
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
      return import.meta.env[viteKey];
    }
  } catch {}

  // Node.js / Next.js process.env
  try {
    if (typeof process !== 'undefined' && process.env && process.env[nextKey]) {
      return process.env[nextKey] as string;
    }
  } catch {}

  return fallback;
};

export const SUPABASE_URL = getEnvVar(
  'VITE_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'https://yorqdmvraixqopdyggtt.supabase.co'
);

export const SUPABASE_ANON_KEY = getEnvVar(
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'sb_publishable_8SBDBp_fFnMkchXOHJdN-A_7_ieoqv5'
);

// Inisialisasi instance klien Supabase tunggal (Singleton)
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Memeriksa status konektivitas aktif ke server Supabase PostgreSQL
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  url: string;
  hasAnonKey: boolean;
}> {
  try {
    const { data, error } = await supabase.from('elections').select('id, name, status').limit(1);

    if (error) {
      return {
        connected: false,
        url: SUPABASE_URL,
        hasAnonKey: Boolean(SUPABASE_ANON_KEY),
        message: `Endpoint Supabase merespons: "${error.message}". Silakan jalankan file SQL migrasi di tab 'Portal Petugas > Panduan & Migrasi SQL' pada Supabase Dashboard.`,
      };
    }

    return {
      connected: true,
      url: SUPABASE_URL,
      hasAnonKey: Boolean(SUPABASE_ANON_KEY),
      message: `Terhubung aktif ke database Supabase PostgreSQL Pekon Rawas (${SUPABASE_URL}). Data 'elections' terbaca: ${data?.length || 0} baris.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      url: SUPABASE_URL,
      hasAnonKey: Boolean(SUPABASE_ANON_KEY),
      message: `Gagal menjangkau host Supabase: ${msg}`,
    };
  }
}
