import React from 'react';
import { ArrowRight, ShieldCheck, Users, Vote, Calendar, CheckCircle } from 'lucide-react';
import { IMAGES, REGION_FULL, DemoUser } from '../../lib/constants';
import { Election, ElectionResultsSummary } from '../../types/database';

interface HeroSectionProps {
  election: Election;
  results: ElectionResultsSummary;
  currentUser: DemoUser;
  onNavigate: (tab: string) => void;
  onOpenVoting: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  election,
  results,
  currentUser,
  onNavigate,
  onOpenVoting,
}) => {
  const isVoter = currentUser.role === 'voter';

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Pemandangan Pesisir Barat Pekon Rawas Lampung"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-3xl">
          {/* Unboxed Metadata Header */}
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide uppercase mb-3">
            <span>Pemerintahan Desa / Pekon</span>
            <span aria-hidden="true">·</span>
            <span>Kabupaten Pesisir Barat</span>
            <span aria-hidden="true">·</span>
            <span>Provinsi Lampung</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight mb-4">
            Sistem Informasi & Simulasi Pemilihan Peratin Pekon Rawas
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            Wadah edukasi warga untuk mengenal profil calon pemimpin pekon, memantau transparansi tahapan, serta menguji simulasi pemberian suara secara online yang aman, rahasia, dan akuntabel.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenVoting}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Vote className="w-4 h-4 text-emerald-200" />
              <span>{isVoter ? 'Masuk ke Bilik Suara Simulasi' : 'Uji Coba Bilik Suara'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('calon')}
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 font-medium text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Lihat 3 Calon Peratin
            </button>

            <button
              onClick={() => onNavigate('hasil')}
              className="px-4 py-3.5 text-slate-300 hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Pantau Rekapitulasi Suara &rarr;
            </button>
          </div>
        </div>

        {/* Operational Utility Ribbon - Full Width Strip Below Hero Content */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Status Kegiatan</span>
            </div>
            <div className="text-base font-bold text-white flex items-center gap-1.5">
              <span className="capitalize">{election.status === 'open' ? 'Simulasi Dibuka' : election.status}</span>
              <span className="text-xs text-emerald-400 font-normal">· Periode Uji Coba</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Daftar Pemilih (DPS Demo)</span>
            </div>
            <div className="text-base font-bold text-white tabular-nums">
              {results.total_registered_voters} Warga <span className="text-xs text-slate-400 font-normal">({results.total_verified_voters} Terverifikasi)</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5 text-amber-400" />
              <span>Partisipasi Simulasi</span>
            </div>
            <div className="text-base font-bold text-white tabular-nums">
              {results.turnout_percentage}% <span className="text-xs text-slate-400 font-normal">({results.total_participated_voters} Suara Masuk)</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Integritas Surat Suara</span>
            </div>
            <div className="text-base font-bold text-emerald-400 text-sm">
              Terkunci LUBER & JURDIL
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Surat suara terpisah tanpa voter_id</p>
          </div>
        </div>
      </div>
    </section>
  );
};
