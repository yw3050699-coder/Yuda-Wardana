import React from 'react';
import { Calendar, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const stages = [
    {
      number: '01',
      title: 'Pemutakhiran Data Pemilih Sementara (DPS)',
      date: '10 - 18 Oktober 2026',
      status: 'completed',
      description: 'Pencocokan dan penelitian berkas domisili warga di seluruh dusun Pekon Rawas.',
    },
    {
      number: '02',
      title: 'Pendaftaran & Penetapan Calon Peratin',
      date: '19 - 21 Oktober 2026',
      status: 'completed',
      description: 'Penerimaan berkas persyaratan, pengundian nomor urut 01, 02, dan 03.',
    },
    {
      number: '03',
      title: 'Verifikasi Berkas & Pengesahan DPT',
      date: '22 - 23 Oktober 2026',
      status: 'completed',
      description: 'Pemeriksaan keabsahan NIK dan penetapan status kelayakan oleh Tim Verifikator.',
    },
    {
      number: '04',
      title: 'Masa Uji Coba Simulasi Bilik Suara',
      date: '24 - 31 Oktober 2026',
      status: 'active',
      description: 'Simulasi pemungutan suara online terbuka bagi seluruh warga pemilih terdaftar.',
    },
    {
      number: '05',
      title: 'Penutupan & Rekapitulasi Suara',
      date: '31 Oktober 2026 (16:00 WIB)',
      status: 'upcoming',
      description: 'Sistem mengunci penerimaan suara dan menghitung rekapitulasi surat suara sah.',
    },
    {
      number: '06',
      title: 'Pleno Publikasi Hasil Simulasi',
      date: '01 November 2026',
      status: 'upcoming',
      description: 'Penerbitan Berita Acara Rekapitulasi dan evaluasi sistem untuk perbaikan pekon.',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Tahapan & Jadwal Kegiatan
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Agenda Simulasi Pemilihan Peratin
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Seluruh tahapan diselenggarakan secara transparan berdasarkan petunjuk teknis panitia pemilihan Pekon Rawas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'active';

            return (
              <div
                key={stage.number}
                className={`p-6 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600/20'
                    : isCompleted
                    ? 'bg-white/80 border-slate-200'
                    : 'bg-slate-100/60 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-900'
                        : isCompleted
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Tahap {stage.number}
                  </span>

                  {isActive ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Sedang Berjalan</span>
                    </span>
                  ) : isCompleted ? (
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Selesai</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mendatang</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                  {stage.title}
                </h3>

                <div className="text-xs text-emerald-800 font-medium mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{stage.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
