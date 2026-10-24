import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  Users,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Landmark,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { DemoUser, DEMO_ACCOUNTS } from '../../lib/constants';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: DemoUser;
  onSwitchUser: (user: DemoUser) => void;
  onOpenAuth: () => void;
  isOfficialMode?: boolean;
  onToggleMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onSwitchUser,
  onOpenAuth,
  isOfficialMode = false,
  onToggleMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'informasi', label: 'Informasi' },
    { id: 'calon', label: 'Calon' },
    { id: 'cek-dpt', label: 'Cek DPT' },
    { id: 'panduan', label: 'Panduan' },
    { id: 'hasil', label: isOfficialMode ? 'Hasil Pemilihan' : 'Hasil Simulasi' },
  ];

  const isOfficer = ['admin', 'panitia', 'verifikator', 'pengawas'].includes(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark & Mode Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('beranda')}
              className="text-left cursor-pointer group focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-emerald-900 group-hover:text-emerald-700 whitespace-nowrap shrink-0 block">
                E-POTING PEKON RAWAS
              </span>
            </button>

            {/* Mode Switcher Pill */}
            {onToggleMode && (
              <button
                onClick={onToggleMode}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer border shadow-2xs ${
                  isOfficialMode
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                }`}
                title={isOfficialMode ? 'Klik untuk beralih ke Mode Simulasi' : 'Klik untuk beralih ke Web Asli (Mode Resmi)'}
              >
                {isOfficialMode ? (
                  <>
                    <Landmark className="w-3.5 h-3.5 text-emerald-700" />
                    <span>WEB ASLI (RESMI)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>MODE SIMULASI</span>
                  </>
                )}
                <ArrowRightLeft className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>
            )}
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const active = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'text-emerald-800 font-semibold after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('dashboard')}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold ${
                currentTab === 'dashboard'
                  ? 'text-amber-900 after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-0.5 after:bg-amber-600'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              Portal Petugas (Kelola)
            </button>
          </nav>

          {/* Zone 3: CTA & User Persona Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser.role === 'voter' ? (
              <button
                onClick={() => onNavigate('voting')}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5 ${
                  isOfficialMode ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isOfficialMode ? 'Bilik Suara (Resmi)' : 'Bilik Suara Simulasi'}</span>
              </button>
            ) : isOfficer ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Panel {currentUser.roleLabel.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Masuk / Pilih Peran
              </button>
            )}

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs text-slate-700 cursor-pointer"
                title="Ganti Peran Pengguna Demo"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {currentUser.avatarLetter}
                </div>
                <div className="hidden sm:block text-left max-w-[110px] truncate">
                  <span className="font-semibold block truncate leading-tight">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-500 font-medium">Masuk Sebagai:</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-emerald-700">{currentUser.roleLabel}</p>
                  </div>

                  <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Akun Demo Simulasi
                  </p>

                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {DEMO_ACCOUNTS.map((acc) => {
                      const isCurrent = acc.id === currentUser.id;
                      return (
                        <button
                          key={acc.id}
                          onClick={() => {
                            onSwitchUser(acc);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-emerald-50 text-emerald-900 font-medium'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="font-semibold truncate">{acc.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{acc.roleLabel}</div>
                          </div>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between px-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                    >
                      Bantuan Login
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onSwitchUser(DEMO_ACCOUNTS[0]);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Mode Tamu</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-2 py-1 cursor-pointer ${
                currentTab === link.id ? 'text-emerald-800 font-bold' : 'hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          {isOfficer && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-2 py-1 cursor-pointer font-bold ${
                currentTab === 'dashboard' ? 'text-amber-800' : 'text-slate-700'
              }`}
            >
              Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
