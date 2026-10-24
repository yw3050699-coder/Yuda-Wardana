import React from 'react';
import { UserCheck, FileCheck, Vote, ShieldCheck, ArrowRight } from 'lucide-react';

interface GuideQuickSectionProps {
  onNavigate: (tab: string) => void;
  onOpenVoting: () => void;
}

export const GuideQuickSection: React.FC<GuideQuickSectionProps> = ({ onNavigate, onOpenVoting }) => {
  const steps = [
    {
      num: '1',
      icon: UserCheck,
      title: 'Pemeriksaan Status DPT',
      desc: 'Pastikan nama Anda tercantum dalam Daftar Pemilih Sementara (DPS) dan telah diverifikasi berkas KTP-el Pekon Rawas.',
    },
    {
      num: '2',
      icon: FileCheck,
      title: 'Kaji Profil & Visi Misi',
      desc: 'Buka informasi 3 Calon Peratin Tetap, pelajari program kerja unggulan untuk kemajuan desa secara seksama.',
    },
    {
      num: '3',
      icon: Vote,
      title: 'Pemberian Suara di Bilik Simulasi',
      desc: 'Masuk ke bilik suara digital, tentukan satu calon pilihan Anda, dan lakukan konfirmasi dua langkah yang aman.',
    },
    {
      num: '4',
      icon: ShieldCheck,
      title: 'Simpan Bukti Verifikasi Digital',
      desc: 'Dapatkan kode resi partisipasi unik. Pilihan Anda dienkripsi anonim dan tidak dapat dibuka oleh siapapun.',
    },
  ];

  return (
    <section className="py-16 bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
              Petunjuk Bagi Masyarakat
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              4 Langkah Mudah Berpartisipasi
            </h2>
            <p className="text-sm text-emerald-100/80 mt-2">
              Sistem e-Poting dirancang sederhana agar mudah diakses melalui ponsel cerdas maupun komputer oleh seluruh kalangan warga.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('panduan')}
              className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl border border-emerald-700 transition-colors cursor-pointer"
            >
              Lihat Panduan Lengkap
            </button>
            <button
              onClick={onOpenVoting}
              className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Mulai Simulasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-emerald-950/40 p-6 rounded-2xl border border-emerald-800/60 relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center mb-4 text-emerald-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 mb-1">
                  Langkah {st.num}
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {st.title}
                </h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
