import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Lock,
  Vote,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { REGION_FULL } from '../../lib/constants';

interface GuideViewProps {
  onOpenVoting: () => void;
  onNavigate: (tab: string) => void;
}

export const GuideView: React.FC<GuideViewProps> = ({ onOpenVoting, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const guideSteps = [
    {
      num: '01',
      title: 'Pemeriksaan Status Daftar Pemilih (DPS / DPT)',
      desc: 'Setiap warga Pekon Rawas yang berhak memilih harus terdaftar di Daftar Pemilih. Anda dapat melihat status kelayakan melalui profil akun. Jika status masih PENDING, berkas NIK dan kartu keluarga Anda sedang diverifikasi oleh Verifikator.',
      tip: 'Pastikan nama Anda sesuai dengan dokumen kependudukan resmi.',
    },
    {
      num: '02',
      title: 'Kaji Visi, Misi, dan Profil Calon',
      desc: 'Buka menu "Calon" untuk menelaah secara objektif program kerja masing-masing calon Peratin (No. 01, No. 02, dan No. 03). Setiap calon memiliki komitmen pembangunan Pekon Rawas yang dapat Anda bandingkan.',
      tip: 'Gunakan hak pilih Anda secara mandiri dan cerdas tanpa paksaan.',
    },
    {
      num: '03',
      title: 'Akses Masuk ke Bilik Suara Simulasi',
      desc: 'Klik tombol "Bilik Suara Simulasi". Sistem akan memvalidasi apakah Anda memiliki status kelayakan (eligible) dan memastikan Anda belum pernah memberikan suara pada kegiatan yang sama.',
      tip: 'JANGAN PERNAH membagikan kata sandi atau kode autentikasi kepada petugas atau pihak manapun!',
    },
    {
      num: '04',
      title: 'Pilih Satu Calon & Konfirmasi Pilihan',
      desc: 'Di dalam bilik suara elektronik, pilih salah satu kartu calon. Layar dialog konfirmasi akan muncul untuk memastikan pilihan Anda. Setelah dikonfirmasi, transaksi basis data atomik akan mencatat surat suara sah.',
      tip: 'Pilihan tidak dapat dibatalkan atau diubah setelah Anda menekan tombol konfirmasi.',
    },
    {
      num: '05',
      title: 'Periksa Bukti Partisipasi Digital (Resi Kripto)',
      desc: 'Setelah suara tersimpan, sistem akan menerbitkan resi dengan hash verifikasi kriptografis. Resi ini membuktikan Anda telah menunaikan hak suara tanpa memperlihatkan nama calon yang Anda pilih, demi menjaga kerahasiaan suara (Secret Ballot).',
      tip: 'Anda dapat mencetak atau menyimpan kode bukti tersebut.',
    },
  ];

  const faqs = [
    {
      q: 'Apakah pilihan calon saya dapat dilihat oleh panitia atau admin desa?',
      a: 'TIDAK. Sistem E-POTING PEKON RAWAS memisahkan secara ketat tabel partisipasi (voter_participation) dengan tabel surat suara (ballots). Di tabel surat suara, sistem sama sekali TIDAK menyimpan voter_id, NIK, nama, atau alamat IP pemilih. Pilihan Anda 100% rahasia sesuai asas LUBER.',
    },
    {
      q: 'Bisakah seorang pemilih memberikan suara dua kali jika mencoba kembali?',
      a: 'TIDAK BISA. Database kami menerapkan constraint unik dan transaksi atomik. Jika seorang pemilih mencoba mengirimkan suara kedua kalinya, sistem secara otomatis menolak permintaan dengan pesan: "Hak pilih telah digunakan sebelumnya."',
    },
    {
      q: 'Mengapa status pemilih saya "PENDING" atau belum terverifikasi?',
      a: 'Status pending berarti dokumen KTP-el atau KK Anda masih dalam proses penelaahan oleh Tim Verifikator Desa untuk memastikan keaslian domisili di Pekon Rawas.',
    },
    {
      q: 'Apakah hasil simulasi ini menjadi keputusan resmi Peratin Pekon Rawas?',
      a: 'TIDAK. Ini adalah media informasi dan simulasi uji coba teknologi. Pelaksanaan pemilihan Peratin resmi wajib mematuhi seluruh peraturan perundang-undangan daerah Kabupaten Pesisir Barat dan mendapat pengesahan resmi dari instansi pemerintah terkait.',
    },
    {
      q: 'Bagaimana jika perangkat saya mengalami gangguan koneksi internet saat memilih?',
      a: 'Transaksi kami bersifat atomik: jika koneksi terputus sebelum konfirmasi akhir diterima server, tidak ada suara yang dicatat dan hak pilih Anda tetap utuh. Anda dapat mengulangi proses begitu koneksi stabil kembali.',
    },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Pusat Panduan & Edukasi Pemilih</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Panduan Lengkap Penggunaan E-POTING
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Petunjuk resmi tata cara pemungutan suara simulasi, verifikasi kelayakan, dan penjelasan prinsip kerahasiaan bagi warga Pekon Rawas.
          </p>
        </div>

        {/* Security Warning Box */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-12 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block text-amber-950 font-bold mb-0.5">PERINGATAN KEAMANAN & PRIVASI RESMI:</strong>
            Petugas panitia, verifikator, maupun administrator TIDAK PERNAH meminta kata sandi akun, kode OTP, atau meminta Anda memberitahukan nama calon yang Anda pilih. Jangan pernah membagikan rahasia kredensial Anda kepada siapapun!
          </div>
        </div>

        {/* 5-Step Visual Walkthrough */}
        <div className="space-y-4 mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Tahapan Pemilih Langkah Demi Langkah
          </h2>

          <div className="space-y-4">
            {guideSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center text-lg shrink-0">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {step.desc}
                  </p>
                  <div className="bg-slate-50 px-3.5 py-2 rounded-lg text-xs text-slate-700 font-medium border border-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span><strong>Tips Panitia:</strong> {step.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Desk & Secretariat Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Posko Pelayanan Bantuan Warga (Help Desk)
          </h3>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-xl">
            Bagi masyarakat Pekon Rawas yang memerlukan pendampingan teknis, kendala verifikasi data, atau informasi simulasi, silakan hubungi meja bantuan panitia pemilihan:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Sekretariat Panitia</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Balai Pekon Rawas, Kec. Pesisir Tengah, Kab. Pesisir Barat, Lampung. Buka Senin - Sabtu, 08:00 - 15:30 WIB.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>Saluran Informasi Panitia</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Layanan pengaduan melalui formulir resmi sekretariat atau pengawas independen BPD Pekon Rawas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
