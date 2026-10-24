import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Candidate, Election, Voter, VoterParticipation } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import { DemoUser } from '../../lib/constants';
import { SimulationBanner } from '../common/SimulationBanner';
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Printer,
  Calendar,
  UserCheck,
  HelpCircle,
} from 'lucide-react';

interface VotingBoothProps {
  election: Election;
  candidates: Candidate[];
  currentUser: DemoUser;
  onRefreshData: () => void;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  preselectedCandidateId?: string | null;
}

export const VotingBooth: React.FC<VotingBoothProps> = ({
  election,
  candidates,
  currentUser,
  onRefreshData,
  onNavigate,
  onOpenAuth,
  preselectedCandidateId,
}) => {
  const repo = SimulationRepository.getInstance();

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(() => {
    if (preselectedCandidateId) {
      return candidates.find((c) => c.id === preselectedCandidateId) || null;
    }
    return null;
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<{
    hash: string;
    timestamp: string;
  } | null>(null);

  // Retrieve current voter record
  const currentVoter = currentUser.role === 'voter'
    ? repo.getVoterByUserId(currentUser.id) || repo.getVoters().find((v) => v.voter_reference === currentUser.voterRef)
    : null;

  const participationStatus = currentVoter
    ? repo.hasVoterParticipated(currentVoter.id)
    : { participated: false };

  // Handle vote cast
  const handleConfirmVote = () => {
    if (!selectedCandidate || !currentVoter) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Call atomic ballot casting transaction
    const result = repo.castSimulatedBallot(election.id, currentVoter.id, selectedCandidate.id);

    setIsSubmitting(false);

    if (result.success && result.receipt_hash) {
      setShowConfirmModal(false);
      setSuccessReceipt({
        hash: result.receipt_hash,
        timestamp: result.timestamp || new Date().toISOString(),
      });

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#047857', '#d97706', '#10b981'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }

      onRefreshData();
    } else {
      setErrorMessage(result.message);
    }
  };

  // If user is not logged in as voter
  if (currentUser.role !== 'voter') {
    return (
      <div className="py-12 bg-slate-50 min-h-[calc(100vh-64px)]">
        <SimulationBanner />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Akses Bilik Suara Memerlukan Akun Pemilih
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto">
              Anda saat ini masuk sebagai <strong>{currentUser.roleLabel}</strong>. Untuk merasakan simulasi pencoblosan/pemungutan suara elektronik, silakan beralih ke salah satu akun pemilih demo terdaftar.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Ganti Akun ke Pemilih Terdaftar Demo
              </button>
              <button
                onClick={() => onNavigate('beranda')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If voter is unverified or rejected
  if (currentVoter && currentVoter.verification_status !== 'verified') {
    return (
      <div className="py-12 bg-slate-50 min-h-[calc(100vh-64px)]">
        <SimulationBanner />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Status Pemilih Belum Memenuhi Syarat
            </h2>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed max-w-lg mx-auto">
              Akun Anda (Ref: <strong>{currentVoter.voter_reference}</strong>) berstatus <strong>{currentVoter.verification_status.toUpperCase()}</strong>. Sesuai Bagian 9, hanya pemilih yang telah diverifikasi oleh Tim Verifikator yang berhak memberikan suara.
            </p>
            <div className="bg-amber-50 p-4 rounded-xl text-xs text-amber-900 max-w-md mx-auto mb-6 text-left border border-amber-100">
              <div className="font-semibold mb-1">Catatan Verifikator:</div>
              <div>{currentVoter.notes || 'Menunggu verifikasi berkas NIK dan domisili Pekon Rawas.'}</div>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              *Tips Pengujian: Anda dapat masuk sebagai <strong>Verifikator DPT</strong> untuk memverifikasi akun ini di Portal Petugas.
            </p>
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Ganti Akun Demo Terverifikasi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If voter already participated (or just participated)
  const isAlreadyVoted = participationStatus.participated || Boolean(successReceipt);
  const activeReceipt = successReceipt?.hash || participationStatus.participation?.verification_hash;
  const activeTimestamp = successReceipt?.timestamp || participationStatus.participation?.participated_at;
  const isOfficial = !election.is_demo;

  return (
    <div className="py-10 bg-slate-50 min-h-[calc(100vh-64px)]">
      {/* Banner Disclaimer / Header Wajib */}
      <SimulationBanner onModeChanged={onRefreshData} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Voter Identity Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
              <span>{isOfficial ? 'Bilik Suara Pemilihan Resmi' : 'Bilik Suara Simulasi Elektronik'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">Sesi Pemilih Aktif</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {currentUser.name}
              </h1>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                {currentVoter?.voter_reference || currentUser.voterRef}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>NIK: <strong>{currentVoter?.nik_masked || currentUser.nikMasked}</strong></span>
              <span>Dusun: <strong>{currentVoter?.dusun || currentUser.dusun}</strong></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terdaftar di DPT & Memenuhi Syarat</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAlreadyVoted ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isOfficial ? 'Hak Suara Sah Digunakan' : 'Hak Pilih Telah Digunakan'}</span>
              </div>
            ) : (
              <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2">
                <Vote className="w-4 h-4 text-amber-600" />
                <span>Belum Memberikan Suara</span>
              </div>
            )}
          </div>
        </div>

        {/* State A: Hak Pilih Telah Digunakan (Tanda Bukti Digital) */}
        {isAlreadyVoted ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Terima Kasih Atas Partisipasi Anda!
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {isOfficial
                ? 'Suara resmi Anda telah berhasil diverifikasi dan dicatat ke dalam basis data surat suara definitif Pekon Rawas secara anonim. Hak pilih Anda pada Pemilihan Peratin ini telah sah digunakan.'
                : 'Suara simulasi Anda telah berhasil diverifikasi dan dicatat ke dalam basis data surat suara secara anonim. Hak pilih Anda pada kegiatan simulasi ini telah dinyatakan selesai.'}
            </p>

            {/* Official Digital Participation Receipt */}
            <div className="bg-slate-50 rounded-2xl border border-slate-300 p-6 text-left mb-6 font-mono text-xs text-slate-800 space-y-3 shadow-inner">
              <div className="text-center pb-3 border-b border-slate-200">
                <div className="font-bold text-slate-900 tracking-wider">
                  {isOfficial ? 'TANDA BUKTI RESMI HAK SUARA TERVERIFIKASI' : 'TANDA BUKTI DIGITAL PARTISIPASI'}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  {isOfficial ? 'MODEL C1-ELEKTRONIK · PEKON RAWAS PESISIR BARAT' : 'E-POTING PEKON RAWAS · PESISIR BARAT (SIMULASI)'}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Kode Referensi Pemilih:</span>
                <span className="font-bold">{currentVoter?.voter_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Waktu Pemungutan:</span>
                <span>{new Date(activeTimestamp || Date.now()).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Status Suara:</span>
                <span className="text-emerald-700 font-bold">SAH & TERKUNCI (ANONIM)</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-sans block mb-1">Hash Verifikasi Kriptografis:</span>
                <div className="bg-white p-2 rounded border border-slate-200 break-all select-all font-bold text-slate-900">
                  {activeReceipt}
                </div>
              </div>
            </div>

            {/* Asas Kerahasiaan Notice */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-900 text-left mb-6 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Prinsip Kerahasiaan Suara (Secret Ballot):</strong> Sesuai Bagian 7.8, sistem sengaja tidak menyimpan maupun menampilkan nama calon yang Anda pilih pada resi ini. Hal ini menjamin suara Anda bersifat rahasia dan bebas dari intimidasi atau pembuktian jual beli suara.
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan Bukti Resi</span>
              </button>
              <button
                onClick={() => onNavigate('hasil')}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Lihat Rekapitulasi Suara &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* State B: Bilik Suara Aktif - Memilih Calon */
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isOfficial
                  ? 'Surat Suara Resmi Pemilihan Peratin Pekon Rawas'
                  : 'Surat Suara Simulasi Pemilihan Peratin'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                {isOfficial
                  ? 'Sistem Pemilihan Resmi Definitif Pekon Rawas. Klik salah satu calon di bawah ini untuk menentukan pilihan Anda secara Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil.'
                  : 'Klik salah satu calon di bawah ini untuk menentukan pilihan Anda dalam mode simulasi, lalu klik tombol Konfirmasi di bagian bawah.'}
              </p>
            </div>

            {errorMessage && (
              <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 3 Surat Suara Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {candidates.map((cand) => {
                const isSelected = selectedCandidate?.id === cand.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-emerald-600 shadow-xl ring-2 ring-emerald-500/20 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
                    }`}
                  >
                    {/* Ballot Number Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                        {isOfficial ? 'SURAT SUARA RESMI' : 'SURAT SUARA SIMULASI'}
                      </span>
                      <div
                        className={`w-10 h-10 rounded-xl font-mono font-extrabold flex items-center justify-center text-lg ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-900 text-amber-400'
                        }`}
                      >
                        0{cand.ballot_number}
                      </div>
                    </div>

                    {/* Candidate Portrait */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-200">
                      <img
                        src={cand.photo_path}
                        alt={cand.full_name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="bg-emerald-600 text-white p-2 rounded-full shadow-lg">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Candidate Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {cand.full_name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {cand.profile}
                      </p>
                    </div>

                    {/* Radio-like Selection Button */}
                    <button
                      type="button"
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Vote className="w-4 h-4" />
                      <span>{isSelected ? 'Calon Ini Dipilih' : 'Pilih Calon Ini'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Pilihan Anda Saat Ini:
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {selectedCandidate ? (
                    <span className="text-emerald-800">
                      Calon No. 0{selectedCandidate.ballot_number} — {selectedCandidate.full_name}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Belum ada calon yang dipilih. Silakan klik salah satu kartu di atas.</span>
                  )}
                </div>
              </div>

              <button
                disabled={!selectedCandidate}
                onClick={() => setShowConfirmModal(true)}
                className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  selectedCandidate
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Vote className="w-4 h-4" />
                <span>Kirim Suara Simulasi</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Dua Langkah */}
        {showConfirmModal && selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                  <Vote className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Konfirmasi Pengiriman Suara
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pastikan pilihan Anda sudah sesuai. Setelah dikonfirmasi, suara tidak dapat diubah atau dikirim ulang.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-300">
                  <img
                    src={selectedCandidate.photo_path}
                    alt={selectedCandidate.full_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-amber-700">
                    NOMOR URUT 0{selectedCandidate.ballot_number}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedCandidate.full_name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Calon Peratin Pekon Rawas
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal / Kembali
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVote}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Memproses...</span>
                  ) : (
                    <span>Ya, Kirim Suara Sah</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
