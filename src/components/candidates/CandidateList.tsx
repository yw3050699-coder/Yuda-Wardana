import React, { useState } from 'react';
import { Candidate } from '../../types/database';
import { CheckCircle2, User, Vote, ArrowRight, ShieldCheck, Sparkles, X, Palette, Camera, Compass } from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
  onOpenVotingForCandidate?: (candidateId: string) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onOpenVotingForCandidate,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(candidates[0]);
  const [analysisModalCandidate, setAnalysisModalCandidate] = useState<Candidate | null>(null);

  // Analisis Semiotika & Visual untuk masing-masing kandidat
  const visualAnalyses: Record<string, {
    title: string;
    semiotics: string;
    palette: string;
    lighting: string;
    cultural: string;
    psychologicalImpact: string;
  }> = {
    'cand-01': {
      title: 'Ahmad Fauzi, S.Pd. — Kebijaksanaan, Pengabdian & Budaya',
      semiotics: 'Peci/songkok hitam polos nasional merepresentasikan integritas moral, kepemimpinan kebapakan (paternal integrity), dan religiusitas yang menenangkan masyarakat desa.',
      palette: 'Dominasi Batik Navy & Emas: Biru navy menyiratkan kestabilan, kedalaman pertimbangan, dan loyalitas pengabdian. Pola batik tradisional mempertegas ikatan erat dengan nilai luhur desa.',
      lighting: 'Pencahayaan 45° soft diffused studio lighting menonjolkan ekspresi teduh dan kerutan tawa alami, memancarkan keramahan tanpa kehilangan wibawa kepemimpinan.',
      cultural: 'Sangat mewakili figur guru dan tetua adat di Pekon Rawas yang mengedepankan musyawarah mufakat dan pendidikan anak pekon.',
      psychologicalImpact: 'Menimbulkan rasa aman, dapat dipercaya, dan keyakinan bahwa arah kebijakan pekon akan dipandu oleh figur berpengalaman dan tenang.',
    },
    'cand-02': {
      title: 'Siti Rahmawati, S.E. — Kepemimpinan Teknokratik Inklusif & Kesejahteraan',
      semiotics: 'Perpaduan jas blazer formal navy dengan hijab sage green memancarkan profesionalitas modern yang tetap berakar kuat pada nilai kesantunan dan keibuan.',
      palette: 'Sage Green & Navy: Warna hijau sage menyimbolkan pertumbuhan ekonomi pekon, kesuburan agraria, dan pemulihan sosial; navy blue memperkuat kompetensi manajerial akuntansi desa.',
      lighting: 'Pencahayaan studio kontemporer seimbang dengan rim light halus, menonjolkan sorot mata fokus dan senyum percaya diri.',
      cultural: 'Mewakili kebangkitan peran wanita tangguh Pesisir Barat dalam mengelola ekonomi keluarga, koperasi damar, dan penurunan angka stunting balita.',
      psychologicalImpact: 'Membangun impresi ketelitian pengelolaan anggaran, keterbukaan reformasi birokrasi, dan kepedulian tulus terhadap kesejahteraan kaum ibu dan lansia.',
    },
    'cand-03': {
      title: 'Hendra Saputra — Energi Pembaruan, Transparansi & Maritim',
      semiotics: 'Kemeja putih bersih dengan bordir motif khas Lampung (tapis/songket pesisir) melambangkan transparansi anti-korupsi yang bangga akan identitas kedaerahan Saibatin.',
      palette: 'Putih Bersih & Aksen Songket Emas-Hitam: Warna putih adalah lambang lembaran baru dan keterbukaan; ornamen tapis menegaskan jati diri putra asli pesisir Krui.',
      lighting: 'High-key daylight look dengan pencahayaan terang alami, mencerminkan optimisme matahari pagi pesisir dan etos kerja cepat lapangan.',
      cultural: 'Mencerminkan generasi pemuda nelayan dan inovator pariwisata bahari yang ingin memajukan potensi ombak surfing dan hasil laut Pekon Rawas ke kancah global.',
      psychologicalImpact: 'Membangkitkan antusiasme, semangat gotong royong generasi muda, dan keyakinan akan perubahan nyata yang gesit dan solutif.',
    },
  };

  const currentAnalysis = analysisModalCandidate
    ? visualAnalyses[analysisModalCandidate.id] || visualAnalyses['cand-01']
    : null;

  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Daftar Calon Peratin Tetap Pekon Rawas
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Profil Calon Peratin Periode 2026–2032
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Masyarakat Pekon Rawas berhak mengetahui rekam jejak, visi kepemimpinan, dan rencana program kerja masing-masing calon sebelum memberikan suara pada bilik simulasi.
          </p>
        </div>

        {/* 3 Candidate Quick Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {candidates.map((c) => {
            const isSelected = selectedCandidate?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCandidate(c)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-600/30'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-slate-900 text-amber-400 font-mono font-extrabold flex items-center justify-center text-lg shrink-0">
                  0{c.ballot_number}
                </div>
                <div className="truncate">
                  <div className="text-xs text-slate-500 font-medium">Calon Peratin No. 0{c.ballot_number}</div>
                  <div className="text-sm font-bold text-slate-900 truncate">{c.full_name}</div>
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Lolos Verifikasi</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Candidate Showcase */}
        {selectedCandidate && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Photo & Number Column */}
              <div className="lg:col-span-4 bg-slate-100 p-8 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
                <div className="w-full">
                  <div className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-white mb-6">
                    <img
                      src={selectedCandidate.photo_path}
                      alt={selectedCandidate.full_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1">
                      <span className="text-slate-400 text-[10px]">NO.</span>
                      <span className="text-amber-400 text-base">0{selectedCandidate.ballot_number}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      {selectedCandidate.full_name}
                    </h2>
                    <p className="text-xs text-slate-500 mb-3">
                      Calon Peratin Pekon Rawas · Nomor Urut 0{selectedCandidate.ballot_number}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 mb-4">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Berkas Terverifikasi Panitia</span>
                    </div>

                    {/* Tombol Buka Analisis Visual */}
                    <div>
                      <button
                        onClick={() => setAnalysisModalCandidate(selectedCandidate)}
                        className="w-full py-2 px-3 bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Analisis Semiotika & Citra Foto</span>
                      </button>
                    </div>
                  </div>
                </div>

                {onOpenVotingForCandidate && (
                  <div className="w-full pt-6 mt-6 border-t border-slate-200">
                    <button
                      onClick={() => onOpenVotingForCandidate(selectedCandidate.id)}
                      className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Vote className="w-4 h-4 text-emerald-200" />
                      <span>Simulasikan Pilihan No. 0{selectedCandidate.ballot_number}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Information, Vision, Mission */}
              <div className="lg:col-span-8 p-8 space-y-8">
                {/* Profil Singkat */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Latar Belakang & Profil Singkat
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedCandidate.profile}
                  </p>
                </div>

                {/* Visi */}
                <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                    Visi Kepemimpinan
                  </h3>
                  <p className="text-base text-emerald-950 font-serif italic leading-relaxed">
                    &ldquo;{selectedCandidate.vision}&rdquo;
                  </p>
                </div>

                {/* Misi */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Program Kerja & Misi Utama
                  </h3>
                  <div className="space-y-3">
                    {selectedCandidate.mission.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {m}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Analisis Citra Visual & Semiotika Foto */}
        {analysisModalCandidate && currentAnalysis && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <button
                onClick={() => setAnalysisModalCandidate(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-200">
                  <img
                    src={analysisModalCandidate.photo_path}
                    alt={analysisModalCandidate.full_name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">
                    Kajian Citra Visual Calon No. 0{analysisModalCandidate.ballot_number}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {currentAnalysis.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <Compass className="w-4 h-4 text-emerald-700" />
                    <span>Semiotika Pakaian & Simbol Visual</span>
                  </div>
                  <p>{currentAnalysis.semiotics}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <Palette className="w-4 h-4 text-emerald-700" />
                    <span>Teori Warna & Busana</span>
                  </div>
                  <p>{currentAnalysis.palette}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>Pencahayaan Studio & Bahasa Tubuh (Body Language)</span>
                  </div>
                  <p>{currentAnalysis.lighting}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Representasi Budaya Pekon Rawas (Pesisir Barat)</span>
                  </div>
                  <p>{currentAnalysis.cultural}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                  <div className="font-bold flex items-center gap-2 mb-1 text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Dampak Psikologis Terhadap Pemilih (Electoral Trust)</span>
                  </div>
                  <p>{currentAnalysis.psychologicalImpact}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setAnalysisModalCandidate(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Kajian
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
