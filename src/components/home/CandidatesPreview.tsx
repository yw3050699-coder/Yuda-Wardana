import React from 'react';
import { Candidate } from '../../types/database';
import { ArrowRight, UserCheck } from 'lucide-react';

interface CandidatesPreviewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onNavigate: (tab: string) => void;
}

export const CandidatesPreview: React.FC<CandidatesPreviewProps> = ({
  candidates,
  onSelectCandidate,
  onNavigate,
}) => {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Profil Pemimpin Pekon Rawas
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Daftar Calon Peratin Tetap (Simulasi)
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Mengenal visi, misi, dan latar belakang para calon yang telah lolos verifikasi berkas oleh Panitia Pemilihan Pekon Rawas.
            </p>
          </div>
          <button
            onClick={() => onNavigate('calon')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Halaman Calon Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Grid for Candidates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-md"
            >
              <div>
                {/* Photo & Number Header */}
                <div className="relative aspect-4/3 bg-slate-200 overflow-hidden">
                  <img
                    src={cand.photo_path}
                    alt={cand.full_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-300"
                  />
                  {/* Clean unboxed ballot badge */}
                  <div className="absolute top-3 left-3 bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Nomor</span>
                    <span className="text-lg font-extrabold text-amber-400 font-mono">0{cand.ballot_number}</span>
                  </div>
                </div>

                {/* Candidate Information */}
                <div className="p-6">
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                    <span>Calon Peratin</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">Lolos Verifikasi</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {cand.full_name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {cand.profile}
                  </p>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                      Visi Utama:
                    </span>
                    <p className="text-xs text-slate-800 italic line-clamp-2 leading-relaxed font-serif">
                      &ldquo;{cand.vision}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectCandidate(cand)}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Lihat Profil & Visi Misi Lengkap</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
