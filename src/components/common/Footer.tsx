import React from 'react';
import { ShieldCheck, MapPin, Scale, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Context */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-wide">
                E-POTING PEKON RAWAS
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Sistem Informasi dan Simulasi Pemilihan Peratin (Kepala Desa) berbasis digital untuk Pekon Rawas, Kecamatan Pesisir Tengah, Kabupaten Pesisir Barat, Provinsi Lampung. Dirancang untuk edukasi hak pilih, transparansi administrasi desa, dan pengujian kehandalan teknologi pemilu.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Status Operasional: Mode Uji Coba & Simulasi Digital (Bukan Pemilihan Resmi)</span>
            </div>
          </div>

          {/* Wilayah & Sekretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
              Wilayah Administrasi
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Balai Pekon Rawas, Kecamatan Pesisir Tengah, Kabupaten Pesisir Barat, Lampung 34874
                </span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                *Kontak resmi sekretariat panitia dan nomor layanan bantuan akan diumumkan oleh panitia yang berwenang.
              </p>
            </div>
          </div>

          {/* Legalitas & Kepatuhan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
              Landasan & Ketentuan
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Penerapan untuk pemilihan resmi tunduk pada Peraturan Daerah Kabupaten Pesisir Barat mengenai Tata Cara Pemilihan Peratin dan persetujuan instansi berwenang.
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Asas LUBER JURDIL Terlindungi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} E-POTING PEKON RAWAS. Dikelola untuk kepentingan edukasi dan simulasi masyarakat pekon.
          </p>
          <div className="flex items-center gap-4">
            <span>Kabupaten Pesisir Barat</span>
            <span>·</span>
            <span>Provinsi Lampung</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
