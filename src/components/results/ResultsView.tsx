import React, { useState } from 'react';
import { ElectionResultsSummary, Election } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import { DemoUser } from '../../lib/constants';
import { SimulationBanner } from '../common/SimulationBanner';
import {
  BarChart3,
  Users,
  Vote,
  Printer,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

interface ResultsViewProps {
  election: Election;
  results: ElectionResultsSummary;
  currentUser: DemoUser;
  onRefreshData: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  election,
  results,
  currentUser,
  onRefreshData,
}) => {
  const repo = SimulationRepository.getInstance();
  const [printMode, setPrintMode] = useState(false);

  const isOfficer = ['admin', 'panitia', 'verifikator', 'pengawas'].includes(currentUser.role);
  const canPublish = currentUser.role === 'admin' || currentUser.role === 'panitia';

  // Toggle publish
  const handleTogglePublish = (publish: boolean) => {
    repo.toggleResultsPublish(publish);
    onRefreshData();
  };

  const handlePrint = () => {
    window.print();
  };

  // Find candidate with highest votes
  const sortedResults = [...results.results].sort((a, b) => b.vote_count - a.vote_count);
  const leadingCandidate = sortedResults[0]?.vote_count > 0 ? sortedResults[0] : null;

  return (
    <div className="py-10 bg-slate-50 min-h-[calc(100vh-64px)]">
      {/* Banner Disclaimer Wajib */}
      <SimulationBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 no-print">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Rekapitulasi Suara Sah (Simulasi)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Laporan Hasil Pemilihan Peratin
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Perhitungan matematis surat suara sah yang tercatat di tabel ballots secara real-time untuk Pekon Rawas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canPublish && (
              <button
                onClick={() => handleTogglePublish(!results.is_published)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  results.is_published
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800'
                }`}
              >
                {results.is_published ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Tarik Publikasi Hasil</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Publikasikan Hasil ke Publik</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Berita Acara (BAP)</span>
            </button>
          </div>
        </div>

        {/* Publication Status Notice */}
        <div className="no-print mb-8">
          {results.is_published ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold">STATUS: TELAH DIPUBLIKASIKAN RESMI (SIMULASI).</span> Hasil rekapitulasi dapat diakses oleh publik dan seluruh pemilih Pekon Rawas.
                </div>
              </div>
              <span className="text-[11px] text-emerald-700 whitespace-nowrap shrink-0">
                Dipublikasikan: {new Date(results.published_at || Date.now()).toLocaleString('id-ID')}
              </span>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">STATUS: DRAFT REKAPITULASI PANITIA.</span> Hasil masih dalam proses verifikasi internal pengawas & panitia. Belum diumumkan ke publik secara luas.
                </div>
              </div>
              <span className="text-[11px] text-amber-800 whitespace-nowrap shrink-0">
                Akses Khusus Petugas & Pengawas
              </span>
            </div>
          )}
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 no-print">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
              <Vote className="w-4 h-4 text-emerald-600" />
              <span>Total Suara Sah Masuk</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {results.total_valid_ballots} <span className="text-xs text-slate-500 font-sans font-normal">Surat Suara</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium">
              100% Sah Terverifikasi Kripto
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>DPT Terverifikasi</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {results.total_verified_voters} <span className="text-xs text-slate-500 font-sans font-normal">Warga</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Dari total {results.total_registered_voters} pemilih terdaftar
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <span>Tingkat Partisipasi (Turnout)</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {results.turnout_percentage}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {results.total_participated_voters} hadir · {results.total_unparticipated_voters} belum hadir
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Waktu Penghitungan</span>
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {new Date(results.calculated_at).toLocaleTimeString('id-ID')} WIB
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {new Date(results.calculated_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
            </div>
          </div>
        </div>

        {/* Candidate Vote Breakdown Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-10 no-print">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Perolehan Suara Calon Peratin Pekon Rawas
          </h2>

          <div className="space-y-6">
            {results.results.map((c) => {
              const isLead = leadingCandidate?.candidate_id === c.candidate_id;
              return (
                <div key={c.candidate_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-4">
                      {/* Photo Thumbnail */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-xs">
                        <img
                          src={c.photo_path}
                          alt={c.full_name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-0 left-0 bg-slate-900 text-amber-400 text-[10px] font-mono font-bold px-1 rounded-br">
                          0{c.ballot_number}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Nomor Urut 0{c.ballot_number}</div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <span>{c.full_name}</span>
                          {isLead && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Suara Terbanyak
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                        {c.vote_count} <span className="text-xs font-normal text-slate-500 font-sans">suara</span>
                      </div>
                      <div className="text-xs font-bold text-emerald-700 font-mono tabular-nums">
                        {c.vote_percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLead ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      style={{ width: `${c.vote_percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Printable Berita Acara Rekapitulasi (BAP) */}
        <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-md print:border-none print:shadow-none print:p-0">
          <div className="text-center pb-6 border-b-2 border-slate-900 mb-8">
            <h2 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-wider text-slate-900">
              BERITA ACARA REKAPITULASI HASIL SIMULASI PEMILIHAN PERATIN
            </h2>
            <h3 className="text-sm font-semibold uppercase text-slate-700 mt-1">
              PEKON RAWAS, KECAMATAN PESISIR TENGAH, KABUPATEN PESISIR BARAT
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              NOMOR: 270 / BAP-SIM / PAN-RAWAS / X / 2026
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 mb-8">
            <p>
              Pada hari ini, <strong>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>, bertempat di Balai Pekon Rawas, Panitia Pemilihan Peratin bersama Pengawas dan Saksi Calon telah melaksanakan rekapitulasi data hasil simulasi pemungutan suara elektronik (E-POTING) dengan rincian data sebagai berikut:
            </p>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5 text-left">No. Urut</th>
                    <th className="p-2.5 text-left">Nama Calon Peratin</th>
                    <th className="p-2.5 text-right">Perolehan Suara</th>
                    <th className="p-2.5 text-right">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.results.map((c) => (
                    <tr key={c.candidate_id}>
                      <td className="p-2.5 font-mono font-bold">0{c.ballot_number}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{c.full_name}</td>
                      <td className="p-2.5 text-right font-mono font-bold tabular-nums">{c.vote_count} Suara</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-800 tabular-nums">{c.vote_percentage}%</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td colSpan={2} className="p-2.5 text-slate-900">TOTAL SUARA SAH</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">{results.total_valid_ballots} Suara</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">100.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-700">
              <div>Total DPT Terdaftar: <strong>{results.total_registered_voters} Orang</strong></div>
              <div>Pemilih Hadir / Berpartisipasi: <strong>{results.total_participated_voters} Orang</strong></div>
              <div>Total DPT Terverifikasi: <strong>{results.total_verified_voters} Orang</strong></div>
              <div>Tingkat Partisipasi Pemilih: <strong>{results.turnout_percentage}%</strong></div>
            </div>

            <p className="text-[11px] text-slate-600 italic pt-2">
              *Catatan Integritas: Rekapitulasi ini merupakan hasil kegiatan simulasi dan edukasi. Setiap surat suara tercatat secara anonim tanpa identitas pemilih untuk menjamin asas kerahasiaan.
            </p>
          </div>

          {/* Signature Blocks */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-800">
            <div>
              <p className="font-semibold text-slate-600 mb-14">Ketua Panitia Pemilihan</p>
              <p className="font-bold border-b border-slate-400 pb-1 max-w-[160px] mx-auto">Zulkifli, S.H.</p>
              <p className="text-[10px] text-slate-500 mt-0.5">NIP/SK Panitia Pekon Rawas</p>
            </div>

            <div>
              <p className="font-semibold text-slate-600 mb-14">Pengawas Independen / BPD</p>
              <p className="font-bold border-b border-slate-400 pb-1 max-w-[160px] mx-auto">Drs. Suparman</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ketua BPD Pekon Rawas</p>
            </div>

            <div>
              <p className="font-semibold text-slate-600 mb-14">Administrator Sistem IT</p>
              <p className="font-bold border-b border-slate-400 pb-1 max-w-[160px] mx-auto">Bahrudin</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Admin E-Poting Pekon Rawas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
