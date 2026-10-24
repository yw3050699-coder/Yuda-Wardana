import React, { useState } from 'react';
import { SimulationRepository } from '../../lib/storage';
import { Search, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck, MapPin, ArrowRight } from 'lucide-react';

interface PublicDptCheckProps {
  onOpenVoting: () => void;
  onNavigateToGuide: () => void;
}

export const PublicDptCheck: React.FC<PublicDptCheckProps> = ({ onOpenVoting, onNavigateToGuide }) => {
  const repo = SimulationRepository.getInstance();

  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<{
    searched: boolean;
    found: boolean;
    voter?: any;
    message: string;
  }>({ searched: false, found: false, message: '' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const res = repo.checkDptPublic(keyword);
    setResult({
      searched: true,
      found: res.found,
      voter: res.voter,
      message: res.message,
    });
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Layanan Publik Masyarakat Pekon Rawas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cek Daftar Pemilih Tetap (DPT) Online
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Periksa status pendaftaran Anda dalam Daftar Pemilih Tetap (DPT) Pemilihan Peratin Pekon Rawas secara cepat, mandiri, dan terlindungi.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Masukkan Nomor Induk Kependudukan (NIK) atau Kode Referensi DPT:
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 180401... atau RWAS-2026-001"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-mono transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500">
                *Privasi Terjamin: NIK dimasking dan tidak disimpan dalam riwayat pencarian.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Periksa Data DPT Sekarang</span>
              </button>
            </div>
          </form>
        </div>

        {/* Result Area */}
        {result.searched && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            {result.found && result.voter ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500/30 p-6 sm:p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      TERDAFTAR DALAM DPT RESMI
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      Data Pemilih Ditemukan
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pekon Rawas, Kecamatan Pesisir Tengah, Kabupaten Pesisir Barat
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block mb-1">Nomor Referensi DPT:</span>
                    <span className="text-sm font-bold text-slate-900">{result.voter.voter_reference}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block mb-1">NIK Terdaftar (Masked):</span>
                    <span className="text-sm font-bold text-slate-900">{result.voter.nik_masked}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block mb-1">Wilayah Dusun / RT:</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1 font-sans">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>{result.voter.dusun}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block mb-1">Status Hak Suara:</span>
                    <span className="text-sm font-bold text-emerald-800 font-sans">
                      {result.voter.eligibility_status === 'eligible' ? 'Memenuhi Syarat (Eligible)' : 'Dalam Proses Verifikasi'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-600">
                    {result.voter.has_participated ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Anda telah menggunakan hak pilih pada simulasi ini.</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 font-medium">
                        Anda belum memberikan suara. Bilik simulasi saat ini sedang dibuka.
                      </span>
                    )}
                  </div>

                  {!result.voter.has_participated && (
                    <button
                      onClick={onOpenVoting}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Masuk ke Bilik Suara</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Data Belum Ditemukan di DPT
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {result.message}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2 mb-6">
                  <div className="font-bold">Langkah yang dapat Anda lakukan:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Pastikan Anda memasukkan 16 digit NIK atau kode referensi DPT dengan tepat.</li>
                    <li>Warga baru atau pemilih pemula Pekon Rawas dapat mendatangi Sekretariat Panitia di Balai Pekon dengan membawa KTP-el dan Kartu Keluarga asli.</li>
                    <li>Atau hubungi Petugas Verifikator DPT pada jam kerja operasional.</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={onNavigateToGuide}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Buka Panduan Pendaftaran DPT &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
