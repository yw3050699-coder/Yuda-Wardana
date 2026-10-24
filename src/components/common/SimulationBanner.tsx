import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Landmark, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { SimulationRepository } from '../../lib/storage';
import { SIMULATION_DISCLAIMER } from '../../lib/constants';

interface SimulationBannerProps {
  compact?: boolean;
  onModeChanged?: (isOfficial: boolean) => void;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({
  compact = false,
  onModeChanged,
}) => {
  const repo = SimulationRepository.getInstance();
  const [isOfficial, setIsOfficial] = useState(() => repo.getIsOfficialMode());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<boolean>(false);

  const handleToggleClick = (targetOfficial: boolean) => {
    setPendingTarget(targetOfficial);
    setShowConfirmModal(true);
  };

  const handleConfirmSwitch = () => {
    const result = repo.setOfficialMode(pendingTarget);
    setIsOfficial(pendingTarget);
    setShowConfirmModal(false);
    if (onModeChanged) {
      onModeChanged(pendingTarget);
    }
  };

  return (
    <>
      {isOfficial ? (
        // BANNER MODE RESMI (WEB ASLI)
        <div className={`bg-emerald-900 text-emerald-50 px-4 ${compact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'} shadow-md border-b border-emerald-800`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-800 text-amber-300 shrink-0">
                <Landmark className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
              </div>
              <span className="font-extrabold tracking-wide uppercase text-amber-300">
                SISTEM PEMILIHAN RESMI (WEB ASLI)
              </span>
              <span className="hidden md:inline text-emerald-100 font-normal">
                — Pemilihan Peratin Definitif Pekon Rawas, Pesisir Barat. Sesuai Perbup & Tata Tertib Panitia.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-800/80 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Status: Pemilihan Definitif</span>
              </div>
              <button
                onClick={() => handleToggleClick(false)}
                className="text-xs bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-medium px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer border border-emerald-700"
                title="Beralih ke mode simulasi / edukasi"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Beralih ke Mode Simulasi</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // BANNER MODE SIMULASI (DEFAULT BAGIAN 1)
        <div className={`bg-amber-500 text-slate-950 font-medium px-4 ${compact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'} shadow-sm border-b border-amber-600/30`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} shrink-0 text-slate-950`} />
              <span className="font-extrabold tracking-wide uppercase">{SIMULATION_DISCLAIMER}</span>
              <span className="hidden md:inline text-slate-900 font-normal">
                — Media edukasi dan uji coba teknis pemungutan suara online Pekon Rawas.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold bg-amber-600/30 px-2.5 py-0.5 rounded-full border border-amber-600/40 text-slate-950">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>Uji Coba Terisolasi</span>
              </div>
              <button
                onClick={() => handleToggleClick(true)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 font-medium px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                title="Beralih ke web asli pemilihan resmi"
              >
                <ArrowRightLeft className="w-3 h-3 text-amber-300" />
                <span>Beralih ke Web Asli (Resmi)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Switch Mode */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pendingTarget ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                {pendingTarget ? <Landmark className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {pendingTarget ? 'Aktifkan Web Asli (Mode Resmi)?' : 'Kembali ke Mode Simulasi?'}
                </h3>
                <p className="text-xs text-slate-500">
                  Konfirmasi pengalihan status operasional sistem E-Poting
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {pendingTarget ? (
                <>
                  <p>
                    Anda akan mengaktifkan <strong>Mode Resmi (Web Asli)</strong>. Pada mode ini:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                    <li>Label simulasi akan digantikan dengan kop resmi Berita Acara Model C1.</li>
                    <li>Surat suara dicatat sebagai dokumen pemilihan definitif Pekon Rawas.</li>
                    <li>Hanya pemilih yang terdaftar di DPT Terverifikasi yang sah mencoblos.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    Anda akan kembali ke <strong>Mode Simulasi</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                    <li>Label &ldquo;MODE SIMULASI — BUKAN PEMILIHAN RESMI&rdquo; ditampilkan di semua halaman.</li>
                    <li>Seluruh pemungutan suara berstatus uji coba dan edukasi publik.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSwitch}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  pendingTarget ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Aktifkan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
