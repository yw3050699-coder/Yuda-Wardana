import React, { useState } from 'react';
import { Candidate } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import { Plus, Edit2, AlertCircle, CheckCircle2, UserCheck, X } from 'lucide-react';

interface CandidateManagementProps {
  candidates: Candidate[];
  onRefreshData: () => void;
}

export const CandidateManagement: React.FC<CandidateManagementProps> = ({
  candidates,
  onRefreshData,
}) => {
  const repo = SimulationRepository.getInstance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [ballotNumber, setBallotNumber] = useState(candidates.length + 1);
  const [fullName, setFullName] = useState('');
  const [photoPath, setPhotoPath] = useState('');
  const [profile, setProfile] = useState('');
  const [vision, setVision] = useState('');
  const [missionsText, setMissionsText] = useState('');

  const handleOpenAdd = () => {
    setBallotNumber(candidates.length + 1);
    setFullName('');
    setPhotoPath('/src/assets/images/candidate_fauzi_1792855861315.jpg');
    setProfile('');
    setVision('');
    setMissionsText('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (cand: Candidate) => {
    setEditingCandidate(cand);
    setBallotNumber(cand.ballot_number);
    setFullName(cand.full_name);
    setPhotoPath(cand.photo_path);
    setProfile(cand.profile);
    setVision(cand.vision);
    setMissionsText(cand.mission.join('\n'));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const missionsArray = missionsText
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);

    if (editingCandidate) {
      const res = repo.updateCandidate(editingCandidate.id, {
        ballot_number: Number(ballotNumber),
        full_name: fullName,
        photo_path: photoPath,
        profile,
        vision,
        mission: missionsArray,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setEditingCandidate(null);
        onRefreshData();
      } else {
        setErrorMessage(res.message);
      }
    } else {
      const res = repo.addCandidate({
        ballot_number: Number(ballotNumber),
        full_name: fullName,
        photo_path: photoPath || '/src/assets/images/candidate_fauzi_1792855861315.jpg',
        profile,
        vision,
        mission: missionsArray,
        status: 'active',
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setShowAddModal(false);
        onRefreshData();
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Pengelolaan Calon Peratin Tetap
          </h2>
          <p className="text-xs text-slate-500">
            Dikelola oleh Panitia Pemilihan. Nomor urut divalidasi unik untuk mencegah duplikasi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Calon Baru</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Candidate Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="p-3.5 text-left w-16">No.</th>
              <th className="p-3.5 text-left">Foto & Nama Calon</th>
              <th className="p-3.5 text-left hidden md:table-cell">Visi Utama</th>
              <th className="p-3.5 text-left">Status</th>
              <th className="p-3.5 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-mono font-bold text-slate-900 text-sm">
                  0{c.ballot_number}
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={c.photo_path}
                        alt={c.full_name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{c.full_name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{c.profile}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 hidden md:table-cell text-slate-600 max-w-xs truncate font-serif italic">
                  &ldquo;{c.vision}&rdquo;
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {c.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Ubah Data Calon"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Candidate */}
      {(showAddModal || editingCandidate) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingCandidate(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingCandidate ? 'Ubah Data Calon Peratin' : 'Pendaftaran Calon Peratin Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Pastikan nomor urut tidak bertabrakan dengan calon lain dalam kegiatan pemilihan ini.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Urut *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={ballotNumber}
                    onChange={(e) => setBallotNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Fauzi, S.Pd."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Path / URL Foto Calon
                </label>
                <input
                  type="text"
                  placeholder="/src/assets/images/candidate_fauzi_..."
                  value={photoPath}
                  onChange={(e) => setPhotoPath(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ringkasan Profil & Latar Belakang *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Pengalaman kemasyarakatan atau dedikasi bagi Pekon Rawas..."
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Visi Utama *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Mewujudkan Pekon Rawas yang Berdaya..."
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Misi / Program Kerja (1 baris per butir) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Program 1&#10;Program 2&#10;Program 3"
                  value={missionsText}
                  onChange={(e) => setMissionsText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCandidate(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Calon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
