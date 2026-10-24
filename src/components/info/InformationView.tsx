import React from 'react';
import { Election, Announcement } from '../../types/database';
import { REGION_FULL } from '../../lib/constants';
import {
  Info,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  FileText,
  Clock,
  Scale,
} from 'lucide-react';

interface InformationViewProps {
  election: Election;
  announcements: Announcement[];
  onNavigate: (tab: string) => void;
  onOpenVoting: () => void;
}

export const InformationView: React.FC<InformationViewProps> = ({
  election,
  announcements,
  onNavigate,
  onOpenVoting,
}) => {
  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>Pusat Informasi Resmi Pekon Rawas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Informasi Pemilihan Peratin
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Rangkuman lengkap penyelenggaraan kegiatan pemilihan Peratin (Kepala Desa), dasar regulasi, susunan panitia pelaksana, dan status operasional sistem.
          </p>
        </div>

        {/* Core Election Factsheet */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
            Fakta & Parameter Kegiatan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-4">
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Nama Kegiatan:</span>
                <span className="font-bold text-slate-900">{election.name}</span>
              </div>

              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Wilayah Pemilihan:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{REGION_FULL}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Status Kegiatan Sistem:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-md font-bold text-xs uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>{election.status === 'open' ? 'Simulasi Terbuka' : election.status}</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Periode Pemungutan Simulasi:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    {new Date(election.start_at).toLocaleDateString('id-ID', { dateStyle: 'long' })} s/d {new Date(election.end_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Penetapan Hasil & Publikasi:</span>
                <span className="text-slate-700">
                  {election.results_published_at
                    ? new Date(election.results_published_at).toLocaleDateString('id-ID', { dateStyle: 'long' })
                    : 'Menunggu Pleno Penutupan Panitia'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Klasifikasi Sistem:</span>
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                  Lingkungan Simulasi & Edukasi Terisolasi (is_demo = true)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Struktur Penyelenggara */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200 flex items-center justify-between">
            <span>Struktur Pelaksana & Pengawasan</span>
            <span className="text-xs text-slate-500 font-normal">SK Panitia Pekon Rawas</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Panitia Pemilihan Peratin
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Bertanggung jawab memimpin seluruh tahapan pemilihan, penetapan daftar calon tetap, dan penerbitan pengumuman.
              </p>
              <div className="text-xs font-semibold text-slate-800 border-t border-slate-200 pt-2">
                Ketua: Zulkifli, S.H.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Tim Verifikator Berkas & DPT
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Memverifikasi keabsahan identitas domisili, KTP-el, serta menerbitkan persetujuan kelayakan pemilih di tiap dusun.
              </p>
              <div className="text-xs font-semibold text-slate-800 border-t border-slate-200 pt-2">
                Koordinator: Nurhasanah
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Pengawas Independen (BPD)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Badan Permusyawaratan Desa (BPD) mengawasi independensi dan kepatuhan sistem audit trail tanpa memihak calon manapun.
              </p>
              <div className="text-xs font-semibold text-slate-800 border-t border-slate-200 pt-2">
                Pengawas: Drs. Suparman
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Formal Governance Notice */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Scale className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-base font-bold text-white mb-2">
                Ketentuan Hukum & Status Pemilihan Resmi
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Sesuai peraturan yang berlaku di Kabupaten Pesisir Barat, pemungutan suara elektronik untuk pemilihan Peratin resmi wajib melalui verifikasi teknis Kominfo/instansi berwenang, persetujuan Bupati/Dinas Pemberdayaan Masyarakat dan Desa (DPMD), audit keamanan siber independen, serta penetapan peraturan pekon setempat. Selama persyaratan resmi tersebut belum terpenuhi, aplikasi ini tetap beroperasi dalam <strong>MODE SIMULASI & EDUKASI</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
