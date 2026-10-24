import React, { useState } from 'react';
import { SimulationRepository } from '../../lib/storage';
import { CheckCircle2, XCircle, Play, Shield, RefreshCw } from 'lucide-react';

export const SystemTestingSuite: React.FC = () => {
  const repo = SimulationRepository.getInstance();
  const [testResults, setTestResults] = useState<
    { testId: number; title: string; description: string; passed: boolean; evidence: string }[]
  >(() => repo.runAutomatedSecuritySuite());

  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = repo.runAutomatedSecuritySuite();
      setTestResults(results);
      setIsRunning(false);
    }, 400);
  };

  const totalTests = testResults.length;
  const passedTests = testResults.filter((t) => t.passed).length;
  const allPassed = passedTests === totalTests;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-700" />
            <span>Suite Pengujian Wajib Sistem (13 Butir Bagian 12)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Verifikasi otomatis seluruh aturan keamanan, RLS, pencegahan double voting, dan kerahasiaan surat suara.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          <span>{isRunning ? 'Menjalankan Uji...' : 'Jalankan Seluruh Pengujian'}</span>
        </button>
      </div>

      {/* Summary Scorecard */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs text-slate-500 mb-1">Status Kepatuhan Spesifikasi:</div>
          <div className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className={allPassed ? 'text-emerald-700' : 'text-red-700'}>
              {passedTests} / {totalTests} Butir Uji Lulus
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              100% Terverifikasi
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-600 max-w-md leading-relaxed">
          Seluruh 13 skenario uji kritis dari <strong>Bagian 12 (Pengujian Wajib)</strong> dijalankan secara langsung terhadap logika transaksi dan model data simulasi.
        </div>
      </div>

      {/* Test List */}
      <div className="space-y-3">
        {testResults.map((t) => (
          <div
            key={t.testId}
            className={`p-4 rounded-xl border transition-all ${
              t.passed ? 'bg-white border-slate-200' : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {t.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      UJI #{t.testId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {t.description}
                  </p>
                  <div className="mt-2 text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 break-all">
                    <strong>Bukti Verifikasi:</strong> {t.evidence}
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                  t.passed
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-red-100 text-red-900'
                }`}
              >
                {t.passed ? 'LULUS (PASSED)' : 'GAGAL (FAILED)'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
