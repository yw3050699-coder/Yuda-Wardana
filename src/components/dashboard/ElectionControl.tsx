import React, { useState } from 'react';
import { Election, ElectionStatus } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import { CheckCircle2, AlertTriangle, Calendar, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface ElectionControlProps {
  election: Election;
  onRefreshData: () => void;
}

export const ElectionControl: React.FC<ElectionControlProps> = ({ election, onRefreshData }) => {
  const repo = SimulationRepository.getInstance();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const statuses: { value: ElectionStatus; label: string; desc: string }[] = [
    { value: 'draft', label: '1. Draft (Penyusunan)', desc: 'Persiapan awal panitia, bilik suara tertutup.' },
    { value: 'scheduled', label: '2. Terjadwal (Scheduled)', desc: 'Menunggu waktu buka yang telah ditetapkan.' },
    { value: 'open', label: '3. Simulasi Dibuka (Open)', desc: 'Pemilih terverifikasi dapat memberikan suara pada bilik simulasi.' },
    { value: 'closed', label: '4. Ditutup (Closed)', desc: 'Pemungutan suara berakhir, sistem mengunci suara masuk.' },
    { value: 'completed', label: '5. Selesai (Completed)', desc: 'Pleno rekapitulasi selesai dan siap diarsipkan.' },
  ];

  const handleStatusChange = (newStatus: ElectionStatus) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = repo.updateElectionStatus(newStatus);
    if (res.success) {
      setSuccessMsg(res.message);
      onRefreshData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetData = () => {
    if (window.confirm('PERHATIAN: Apakah Anda yakin ingin mereset seluruh data simulasi pemungutan suara kembali ke kondisi awal?')) {
      repo.resetToInitial();
      onRefreshData();
      setSuccessMsg('Data simulasi berhasil direset ke status default awal.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleTogglePublish = () => {
    const isPub = Boolean(election.results_published_at);
    const res = repo.toggleResultsPublish(!isPub);
    if (res.success) {
      setSuccessMsg(res.message);
      onRefreshData();
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">
          Kontrol Status Kegiatan & Siklus Simulasi
        </h2>
        <p className="text-xs text-slate-500">
          Dikelola oleh Panitia dan Administrator Sistem Pekon Rawas. Transisi status divalidasi server-side.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Current Status Indicator */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-xs text-slate-500 mb-1">Status Kegiatan Saat Ini:</div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-black text-slate-900 uppercase font-mono">
            {election.status}
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
            {election.status === 'open' ? 'Bilik Suara Terbuka' : 'Bilik Suara Terkunci'}
          </span>
        </div>

        {/* Status Transition Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {statuses.map((st) => {
            const isCurrent = election.status === st.value;
            return (
              <button
                key={st.value}
                onClick={() => handleStatusChange(st.value)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`text-xs font-bold mb-1 ${isCurrent ? 'text-amber-400' : 'text-slate-900'}`}>
                  {st.label}
                </div>
                <div className={`text-[11px] leading-tight ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Publication & Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Operational Mode Toggle Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">
              Mode Operasional Website
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              !election.is_demo ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}>
              {!election.is_demo ? 'WEB ASLI (RESMI)' : 'MODE SIMULASI'}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {!election.is_demo
              ? 'Sistem sedang berjalan dalam Mode Resmi. Berita Acara Model C1-KWK dan kop definitif aktif.'
              : 'Sistem sedang berjalan dalam Mode Simulasi. Seluruh pemilih dan perolehan suara berlabel edukasi.'}
          </p>
          <button
            onClick={() => {
              const target = election.is_demo; // toggle to opposite
              const res = repo.setOfficialMode(target);
              setSuccessMsg(res.message);
              onRefreshData();
              setTimeout(() => setSuccessMsg(null), 4000);
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              !election.is_demo
                ? 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {!election.is_demo ? 'Beralih ke Mode Simulasi' : 'Aktifkan Web Asli (Mode Resmi)'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Publikasi Hasil ke Halaman Publik
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Mengatur apakah rekapitulasi suara sah dapat dilihat oleh umum di menu &ldquo;Hasil {!election.is_demo ? 'Pemilihan' : 'Simulasi'}&rdquo; atau hanya internal panitia.
          </p>
          <button
            onClick={handleTogglePublish}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              election.results_published_at
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {election.results_published_at ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Tarik Publikasi (Kembalikan ke Mode Draft)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Publikasikan Hasil Sekarang</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2 text-red-700">
            Reset Data ({!election.is_demo ? 'Mode Resmi' : 'Mode Simulasi'})
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Sesuai tata kelola, fasilitas reset hanya berlaku pada mode demo/pengujian untuk memudahkan simulasi berulang.
          </p>
          <button
            onClick={handleResetData}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Data ke Kondisi Awal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
