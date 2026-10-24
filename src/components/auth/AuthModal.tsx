import React from 'react';
import { DemoUser, DEMO_ACCOUNTS } from '../../lib/constants';
import { Shield, UserCheck, CheckCircle2, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DemoUser;
  onSelectUser: (user: DemoUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Pusat Autentikasi & Pilih Peran Demo
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Pilih salah satu dari 5 peran resmi untuk menguji seluruh alur kerja sistem informasi dan simulasi e-Poting Pekon Rawas.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = acc.id === currentUser.id;
            return (
              <div
                key={acc.id}
                onClick={() => {
                  onSelectUser(acc);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-600 shadow-sm ring-1 ring-emerald-600/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm shrink-0 mt-0.5">
                    {acc.avatarLetter}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{acc.name}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                        {acc.role}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-800 mt-0.5">
                      {acc.roleLabel}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {acc.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  {isSelected ? (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aktif</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 hover:text-slate-700">
                      Pilih
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-400">
            Sistem autentikasi terhubung ke Supabase Auth dengan sesi terisolasi per peran (RBAC).
          </p>
        </div>
      </div>
    </div>
  );
};
