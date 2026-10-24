import React, { useState } from 'react';
import { CommitteeMember } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Printer,
  X,
  Phone,
  FileText,
  MapPin,
  Search,
} from 'lucide-react';

interface CommitteeManagementProps {
  onRefreshData: () => void;
}

export const CommitteeManagement: React.FC<CommitteeManagementProps> = ({ onRefreshData }) => {
  const repo = SimulationRepository.getInstance();
  const committee = repo.getCommitteeMembers();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  const [formName, setFormName] = useState('');
  const [formRoleTitle, setFormRoleTitle] = useState('Anggota Panitia');
  const [formSkNumber, setFormSkNumber] = useState('140/01/SK-PAN/RAWAS/2026');
  const [formPhone, setFormPhone] = useState('08');
  const [formDusun, setFormDusun] = useState('Wilayah Pekon Rawas');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rolePresets = [
    'Ketua Panitia Pemilihan',
    'Wakil Ketua Panitia',
    'Sekretaris Panitia',
    'Bendahara & Logistik',
    'Koordinator Verifikator DPT',
    'Divisi Teknis & Admin IT',
    'Verifikator Lapangan Dusun',
    'Divisi Sosialisasi & Edukasi',
    'Pengawas / BPD Independen',
  ];

  const filteredCommittee = committee.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.role_title.toLowerCase().includes(search.toLowerCase()) ||
      (c.dusun_assigned && c.dusun_assigned.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setFormName('');
    setFormRoleTitle('Anggota Panitia');
    setFormSkNumber('140/01/SK-PAN/RAWAS/2026');
    setFormPhone('0812-3456-XXXX');
    setFormDusun('Wilayah Pekon Rawas');
    setFormStatus('active');
    setEditingMember(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (m: CommitteeMember) => {
    setEditingMember(m);
    setFormName(m.full_name);
    setFormRoleTitle(m.role_title);
    setFormSkNumber(m.sk_number);
    setFormPhone(m.phone || '');
    setFormDusun(m.dusun_assigned || 'Wilayah Pekon Rawas');
    setFormStatus(m.status);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (editingMember) {
      const res = repo.updateCommitteeMember(editingMember.id, {
        full_name: formName,
        role_title: formRoleTitle,
        sk_number: formSkNumber,
        phone: formPhone,
        dusun_assigned: formDusun,
        status: formStatus,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setShowAddModal(false);
        setEditingMember(null);
        onRefreshData();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = repo.addCommitteeMember({
        full_name: formName,
        role_title: formRoleTitle,
        sk_number: formSkNumber,
        phone: formPhone,
        dusun_assigned: formDusun,
        status: formStatus,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setShowAddModal(false);
        onRefreshData();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleDelete = (m: CommitteeMember) => {
    if (window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus petugas ${m.full_name} (${m.role_title}) dari susunan kepanitiaan?`)) {
      const res = repo.deleteCommitteeMember(m.id);
      if (res.success) {
        setSuccessMsg(res.message);
        onRefreshData();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>Manajemen Panitia Pemilihan Peratin Pekon Rawas</span>
          </h2>
          <p className="text-xs text-slate-500">
            Penetapan susunan anggota panitia, surat keputusan (SK) pengesahan, pembagian divisi, dan penugasan wilayah dusun.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak SK Susunan Panitia</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Anggota Panitia</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama anggota / jabatan / penugasan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Panitia Terdaftar: <strong className="text-slate-900">{committee.length} Orang</strong>
        </div>
      </div>

      {/* Committee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="p-3.5 text-left">Nama Petugas & Gelar</th>
              <th className="p-3.5 text-left">Jabatan / Divisi Kepanitiaan</th>
              <th className="p-3.5 text-left hidden md:table-cell">Nomor SK Pengesahan</th>
              <th className="p-3.5 text-left">Wilayah Penugasan</th>
              <th className="p-3.5 text-left">Status</th>
              <th className="p-3.5 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCommittee.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900 text-sm">{m.full_name}</div>
                  {m.phone && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{m.phone}</span>
                    </div>
                  )}
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                    {m.role_title}
                  </span>
                </td>
                <td className="p-3.5 hidden md:table-cell font-mono text-slate-600 text-[11px]">
                  {m.sk_number}
                </td>
                <td className="p-3.5 text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{m.dusun_assigned}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {m.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Ubah Data Petugas"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Petugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Ubah Panitia */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingMember ? 'Ubah Data Petugas Panitia' : 'Penambahan Anggota Panitia Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Struktur resmi panitia pemilihan Peratin Pekon Rawas berdasarkan SK BPD.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Zulkifli, S.H."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jabatan / Divisi *
                </label>
                <select
                  value={formRoleTitle}
                  onChange={(e) => setFormRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {rolePresets.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor SK Pelantikan / Pengesahan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="140/01/SK-PAN/RAWAS/2026"
                  value={formSkNumber}
                  onChange={(e) => setFormSkNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wilayah Dusun / Penugasan Khusus *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Dusun Way Sindi / Sekretariat"
                  value={formDusun}
                  onChange={(e) => setFormDusun(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp Resmi
                </label>
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Keaktifan Petugas
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="active">Aktif Bertugas</option>
                  <option value="inactive">Non-Aktif / Cuti</option>
                </select>
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
                  {editingMember ? 'Simpan Perubahan' : 'Daftarkan Petugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
