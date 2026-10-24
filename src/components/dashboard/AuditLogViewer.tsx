import React, { useState } from 'react';
import { AuditLog } from '../../types/database';
import { SimulationRepository } from '../../lib/storage';
import { ShieldCheck, Search, Filter, Lock } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const repo = SimulationRepository.getInstance();
  const logs = repo.getAuditLogs();

  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.actor_name && l.actor_name.toLowerCase().includes(search.toLowerCase())) ||
      l.entity_type.toLowerCase().includes(search.toLowerCase());
    const matchesEntity = selectedEntity === 'all' || l.entity_type === selectedEntity;
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Audit Trail & Log Integritas Sistem</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan aktivitas administratif dan transaksi suara. Sesuai Bagian 7.10, log ini bersih dari token otentikasi maupun pilihan suara pemilih.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari aksi / aktor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 w-44"
          />

          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Semua Entitas</option>
            <option value="voter_participation">Partisipasi Suara</option>
            <option value="elections">Pemilihan</option>
            <option value="candidates">Calon</option>
            <option value="voter_eligibility">Kelayakan Pemilih</option>
            <option value="announcements">Pengumuman</option>
            <option value="profiles">Sesi / Akun</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="p-3.5 text-left w-36">Waktu (WIB)</th>
              <th className="p-3.5 text-left">Aksi Terverifikasi</th>
              <th className="p-3.5 text-left">Aktor & Peran</th>
              <th className="p-3.5 text-left">Entitas Target</th>
              <th className="p-3.5 text-left hidden md:table-cell">Metadata Ringkasan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('id-ID', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  })}
                </td>
                <td className="p-3.5">
                  <span className="font-mono font-bold text-slate-900 text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-slate-800">{log.actor_name || 'Sistem'}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{log.actor_role || 'System'}</div>
                </td>
                <td className="p-3.5 font-mono text-slate-600 text-[11px]">
                  {log.entity_type}
                </td>
                <td className="p-3.5 hidden md:table-cell text-slate-500 font-mono text-[11px] max-w-xs truncate">
                  {JSON.stringify(log.metadata || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
