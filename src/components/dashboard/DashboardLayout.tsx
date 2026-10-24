import React, { useState } from 'react';
import { Election, Candidate, ElectionResultsSummary } from '../../types/database';
import { DemoUser } from '../../lib/constants';
import { SimulationRepository } from '../../lib/storage';
import { CandidateManagement } from './CandidateManagement';
import { VoterVerification } from './VoterVerification';
import { ElectionControl } from './ElectionControl';
import { AuditLogViewer } from './AuditLogViewer';
import { SystemTestingSuite } from './SystemTestingSuite';
import { SqlMigrationViewer } from './SqlMigrationViewer';
import {
  Shield,
  Users,
  Vote,
  BarChart3,
  CheckCircle2,
  Calendar,
  Lock,
  FileCode,
  Sliders,
  History,
} from 'lucide-react';

interface DashboardLayoutProps {
  election: Election;
  candidates: Candidate[];
  results: ElectionResultsSummary;
  currentUser: DemoUser;
  onRefreshData: () => void;
  onOpenAuth: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  election,
  candidates,
  results,
  currentUser,
  onRefreshData,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'voters' | 'control' | 'audit' | 'tests' | 'sql'>('overview');

  const role = currentUser.role;

  // Role permissions
  const canManageCandidates = role === 'admin' || role === 'panitia';
  const canVerifyVoters = role === 'admin' || role === 'verifikator';
  const canControlElection = role === 'admin' || role === 'panitia';
  const canViewAudit = role === 'admin' || role === 'pengawas';

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Officer Context Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
              <span>Portal Terpadu Administrasi Pekon Rawas</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">{currentUser.roleLabel}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard Petugas & Pengawasan
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Petugas aktif: <strong>{currentUser.name}</strong> ({currentUser.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              Ganti Peran Petugas Demo
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Ringkasan & Metrik</span>
          </button>

          {canManageCandidates && (
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'candidates'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manajemen Calon ({candidates.length})</span>
            </button>
          )}

          {canVerifyVoters && (
            <button
              onClick={() => setActiveTab('voters')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'voters'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verifikasi DPT Pemilih</span>
            </button>
          )}

          {canControlElection && (
            <button
              onClick={() => setActiveTab('control')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'control'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Kontrol Status Pemilihan</span>
            </button>
          )}

          {canViewAudit && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'audit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log Integritas</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'tests'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Suite Uji 13 Aturan</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-500" />
            <span>Panduan & Migrasi SQL</span>
          </button>
        </div>

        {/* Tab View Contents */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 mb-1">DPT Terdaftar</div>
                <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {results.total_registered_voters}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Pemilih Demo Pekon Rawas</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 mb-1">DPT Terverifikasi</div>
                <div className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
                  {results.total_verified_voters}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">Memenuhi Syarat (Eligible)</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 mb-1">Suara Sah Masuk</div>
                <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {results.total_valid_ballots}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Tersimpan di tabel ballots</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 mb-1">Partisipasi (Turnout)</div>
                <div className="text-2xl font-black text-amber-600 font-mono tabular-nums">
                  {results.turnout_percentage}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{results.total_unparticipated_voters} belum hadir</div>
              </div>
            </div>

            {/* Quick Guidance Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-2">
                Hak Akses Anda Saat Ini ({currentUser.roleLabel})
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {currentUser.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`px-2.5 py-1 rounded-md font-medium ${canManageCandidates ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                  Kelola Calon: {canManageCandidates ? 'Ya' : 'Tidak'}
                </span>
                <span className={`px-2.5 py-1 rounded-md font-medium ${canVerifyVoters ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                  Verifikasi Berkas: {canVerifyVoters ? 'Ya' : 'Tidak'}
                </span>
                <span className={`px-2.5 py-1 rounded-md font-medium ${canControlElection ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                  Buka/Tutup Simulasi: {canControlElection ? 'Ya' : 'Tidak'}
                </span>
                <span className={`px-2.5 py-1 rounded-md font-medium ${canViewAudit ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                  Audit Trail: {canViewAudit ? 'Ya' : 'Tidak'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && canManageCandidates && (
          <CandidateManagement candidates={candidates} onRefreshData={onRefreshData} />
        )}

        {activeTab === 'voters' && canVerifyVoters && (
          <VoterVerification onRefreshData={onRefreshData} />
        )}

        {activeTab === 'control' && canControlElection && (
          <ElectionControl election={election} onRefreshData={onRefreshData} />
        )}

        {activeTab === 'audit' && canViewAudit && (
          <AuditLogViewer />
        )}

        {activeTab === 'tests' && (
          <SystemTestingSuite />
        )}

        {activeTab === 'sql' && (
          <SqlMigrationViewer />
        )}
      </div>
    </div>
  );
};
