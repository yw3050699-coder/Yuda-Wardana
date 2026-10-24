import React, { useState } from 'react';
import { Voter } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Download,
  X,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';

interface VoterVerificationProps {
  onRefreshData: () => void;
}

export const VoterVerification: React.FC<VoterVerificationProps> = ({ onRefreshData }) => {
  const repo = SimulationRepository.getInstance();
  const voters = repo.getVoters();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [dusunFilter, setDusunFilter] = useState<string>('all');

  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal Tambah / Edit Pemilih DPT
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [formRef, setFormRef] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formDusun, setFormDusun] = useState('Dusun Way Sindi, RT 01');
  const [formStatus, setFormStatus] = useState<'verified' | 'pending'>('verified');
  const [formNotes, setFormNotes] = useState('');

  const dusunList = [
    'Dusun Way Sindi, RT 01',
    'Dusun Way Sindi, RT 02',
    'Dusun Way Sindi, RT 03',
    'Dusun Rawas Tengah, RT 01',
    'Dusun Rawas Tengah, RT 02',
    'Dusun Rawas Tengah, RT 03',
    'Dusun Way Haru, RT 01',
    'Dusun Way Haru, RT 02',
    'Dusun Pematang Nibung, RT 01',
    'Dusun Pematang Nibung, RT 02',
    'Dusun Pematang Nibung, RT 03',
  ];

  const filteredVoters = voters.filter((v) => {
    const matchesSearch =
      v.voter_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.dusun.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.nik_masked && v.nik_masked.includes(searchQuery));
    const matchesStatus = statusFilter === 'all' || v.verification_status === statusFilter;
    const matchesDusun = dusunFilter === 'all' || v.dusun.includes(dusunFilter);
    return matchesSearch && matchesStatus && matchesDusun;
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
    } else {
      setActionError(res.message);
    }
  };

  const handleOpenAdd = () => {
    const nextIdx = voters.length + 1;
    setFormRef(`RWAS-2026-${String(nextIdx).padStart(3, '0')}`);
    setFormNik('180401' + Math.floor(100000 + Math.random() * 900000) + '****');
    setFormDusun('Dusun Way Sindi, RT 01');
    setFormStatus('verified');
    setFormNotes('Data KTP-el dan KK Pekon Rawas telah dicocokkan panitia');
    setEditingVoter(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (v: Voter) => {
    setEditingVoter(v);
    setFormRef(v.voter_reference);
    setFormNik(v.nik_masked || '');
    setFormDusun(v.dusun);
    setFormStatus(v.verification_status === 'verified' ? 'verified' : 'pending');
    setFormNotes(v.notes || '');
    setShowAddModal(true);
  };

  const handleSaveVoter = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (editingVoter) {
      const res = repo.updateVoter(editingVoter.id, {
        voter_reference: formRef,
        nik_masked: formNik,
        dusun: formDusun,
        verification_status: formStatus,
        notes: formNotes,
      });

      if (res.success) {
        setActionSuccess(res.message);
        setShowAddModal(false);
        setEditingVoter(null);
        onRefreshData();
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(res.message);
      }
    } else {
      const res = repo.addVoter({
        voter_reference: formRef,
        nik_masked: formNik,
        dusun: formDusun,
        verification_status: formStatus,
        notes: formNotes,
      });

      if (res.success) {
        setActionSuccess(res.message);
        setShowAddModal(false);
        onRefreshData();
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(res.message);
      }
    }
  };

  const handleDeleteVoter = (v: Voter) => {
    if (window.confirm(`PERINGATAN: Apakah Anda yakin ingin mencoret pemilih ${v.voter_reference} (${v.dusun}) dari Daftar Pemilih Tetap (DPT)?`)) {
      const res = repo.deleteVoter(v.id);
      if (res.success) {
        setActionSuccess(res.message);
        onRefreshData();
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(res.message);
      }
    }
  };

  const handleExportCsv = () => {
    const headers = ['ID Referensi', 'NIK Terproteksi', 'Wilayah Dusun', 'Status Verifikasi', 'Status Kelayakan', 'Catatan'];
    const rows = filteredVoters.map((v) => [
      v.voter_reference,
      v.nik_masked || '',
      `"${v.dusun}"`,
      v.verification_status,
      v.eligibility_status,
      `"${v.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DPT_Pekon_Rawas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Manajemen Daftar Pemilih Tetap (DPT) & Kelayakan</span>
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data pemilih, pendaftaran warga baru, pencocokan domisili, dan verifikasi hak suara Pekon Rawas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh CSV DPT</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pemilih DPT</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Ref / NIK / Dusun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <select
            value={dusunFilter}
            onChange={(e) => setDusunFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Semua Dusun</option>
            <option value="Way Sindi">Dusun Way Sindi</option>
            <option value="Rawas Tengah">Dusun Rawas Tengah</option>
            <option value="Way Haru">Dusun Way Haru</option>
            <option value="Pematang Nibung">Dusun Pematang Nibung</option>
          </select>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Semua ({voters.length})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'verified' ? 'bg-white font-bold text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Terverifikasi ({voters.filter((v) => v.verification_status === 'verified').length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'pending' ? 'bg-white font-bold text-amber-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Pending ({voters.filter((v) => v.verification_status === 'pending').length})
          </button>
        </div>
      </div>

      {/* DPT Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="p-3.5 text-left w-36">Kode Referensi DPT</th>
              <th className="p-3.5 text-left">NIK Terproteksi</th>
              <th className="p-3.5 text-left">Wilayah Dusun</th>
              <th className="p-3.5 text-left">Status Kelayakan</th>
              <th className="p-3.5 text-left hidden lg:table-cell">Catatan Panitia / Verifikator</th>
              <th className="p-3.5 text-right w-36">Aksi DPT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVoters.map((v) => {
              const isVerified = v.verification_status === 'verified';
              const isPending = v.verification_status === 'pending';

              return (
                <tr key={v.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {v.voter_reference}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {v.nik_masked || '1804************'}
                  </td>
                  <td className="p-3.5 text-slate-800 font-medium">
                    {v.dusun}
                  </td>
                  <td className="p-3.5">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Terverifikasi (Eligible)</span>
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
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
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedVoter(v);
                          setActionNotes(v.notes || '');
                        }}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Verifikasi Status"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(v)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Ubah Data Pemilih"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVoter(v)}
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Coret dari DPT"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit DPT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingVoter ? 'Ubah Data Pemilih DPT' : 'Pendaftaran Pemilih DPT Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Sesuai ketentuan, NIK dimasking untuk melindungi privasi warga Pekon Rawas.
            </p>

            <form onSubmit={handleSaveVoter} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Referensi DPT *
                </label>
                <input
                  type="text"
                  required
                  placeholder="RWAS-2026-..."
                  value={formRef}
                  onChange={(e) => setFormRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIK (Masked) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="180401123456****"
                  value={formNik}
                  onChange={(e) => setFormNik(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wilayah Dusun / RT *
                </label>
                <select
                  value={formDusun}
                  onChange={(e) => setFormDusun(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {dusunList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Verifikasi Kelayakan
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="verified">Terverifikasi (Memenuhi Syarat / Eligible)</option>
                  <option value="pending">Pending (Menunggu Verifikasi KTP)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Kependudukan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan domisili atau catatan verifikator..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow cursor-pointer"
                >
                  {editingVoter ? 'Simpan Perubahan' : 'Daftarkan ke DPT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pemeriksaan & Pengesahan Status */}
      {selectedVoter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Verifikasi Kelayakan Hak Suara
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Periksa keabsahan berkas domisili dan NIK pemohon sebelum menetapkan kelayakan.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Kode Ref DPT:</span>
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
                <span>Sahkan (Eligible)</span>
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
