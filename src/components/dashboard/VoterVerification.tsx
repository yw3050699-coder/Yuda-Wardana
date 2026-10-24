import React, { useState } from 'react';
import { Voter } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import { CheckCircle2, XCircle, Clock, ShieldCheck, Search, Filter } from 'lucide-react';

interface VoterVerificationProps {
  onRefreshData: () => void;
}

export const VoterVerification: React.FC<VoterVerificationProps> = ({ onRefreshData }) => {
  const repo = SimulationRepository.getInstance();
  const voters = repo.getVoters();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredVoters = voters.filter((v) => {
    const matchesSearch =
      v.voter_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.dusun.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.nik_masked && v.nik_masked.includes(searchQuery));
    const matchesFilter = statusFilter === 'all' || v.verification_status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = (status: 'verified' | 'rejected' | 'pending') => {
    if (!selectedVoter) return;

    const res = repo.updateVoterStatus(selectedVoter.id, status, actionNotes);
    if (res.success) {
      setActionSuccess(res.message);
      setSelectedVoter(null);
      setActionNotes('');
      onRefreshData();
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Verifikasi Kelayakan Pemilih (DPT Pekon Rawas)
          </h2>
          <p className="text-xs text-slate-500">
            Tugas Verifikator: Memeriksa berkas kependudukan dan menandai kelayakan pemilih. Catatan: Pilihan suara pemilih bersifat anonim dan tidak terlihat di sini.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Ref / NIK / Dusun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 w-48"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'pending' ? 'bg-white font-bold text-amber-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'verified' ? 'bg-white font-bold text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Terverifikasi
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Voters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="p-3.5 text-left">Kode Referensi Pemilih</th>
              <th className="p-3.5 text-left">NIK (Masked)</th>
              <th className="p-3.5 text-left">Wilayah Dusun</th>
              <th className="p-3.5 text-left">Status Verifikasi</th>
              <th className="p-3.5 text-left hidden lg:table-cell">Catatan Verifikator</th>
              <th className="p-3.5 text-right">Aksi Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVoters.map((v) => {
              const isVerified = v.verification_status === 'verified';
              const isPending = v.verification_status === 'pending';
              const isRejected = v.verification_status === 'rejected';

              return (
                <tr key={v.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {v.voter_reference}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {v.nik_masked || '1804************'}
                  </td>
                  <td className="p-3.5 text-slate-700">
                    {v.dusun}
                  </td>
                  <td className="p-3.5">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Terverifikasi</span>
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>Menunggu</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        <span>Ditolak</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 hidden lg:table-cell text-slate-500 max-w-xs truncate">
                    {v.notes || '-'}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedVoter(v);
                        setActionNotes(v.notes || '');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Periksa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Pemeriksaan Pemilih */}
      {selectedVoter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Verifikasi Kelayakan Pemilih
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Periksa keabsahan berkas domisili dan NIK pemohon sebelum menetapkan kelayakan.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Kode Ref:</span>
                <span className="font-bold text-slate-900">{selectedVoter.voter_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">NIK Terlindungi:</span>
                <span className="font-bold text-slate-900">{selectedVoter.nik_masked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Wilayah Dusun:</span>
                <span className="font-bold text-slate-900">{selectedVoter.dusun}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Verifikator / Alasan Penolakan:
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Berkas KTP-el dan KK Pekon Rawas valid atau lampiran belum terbaca..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => handleUpdateStatus('verified')}
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terima / Sahkan DPT</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('rejected')}
                className="py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak Berkas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSelectedVoter(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Tutup / Batalkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
