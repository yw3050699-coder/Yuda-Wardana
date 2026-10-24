import React, { useState } from 'react';
import { Announcement } from '../../types/database';
import { Bell, Calendar, User, ChevronRight, X } from 'lucide-react';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ announcements }) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'jadwal':
        return 'Jadwal & Waktu';
      case 'info':
        return 'Informasi Umum';
      case 'urgensi':
        return 'Penting';
      default:
        return 'Pengumuman Resmi';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>Papan Pengumuman Digital</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Warta & Maklumat Panitia Pemilihan
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Informasi dan keputusan resmi dari Sekretariat Panitia Pemilihan Peratin Pekon Rawas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-emerald-800">{getCategoryLabel(item.category)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDate(item.published_at)}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {item.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="text-slate-500 text-[11px] truncate pr-2 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{item.created_by}</span>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(item)}
                  className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Baca</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Baca Pengumuman Lengkap */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-800 uppercase tracking-wide">
                  {getCategoryLabel(selectedAnnouncement.category)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(selectedAnnouncement.published_at)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug">
                {selectedAnnouncement.title}
              </h3>

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedAnnouncement.content}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Diterbitkan oleh: <strong>{selectedAnnouncement.created_by}</strong></span>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
