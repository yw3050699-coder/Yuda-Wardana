/**
 * E-POTING PEKON RAWAS
 * Konstanta Sistem, Aset Citra, dan Akun Demo Multi-Role
 */

import { Candidate, Election, Announcement, UserRole } from '../types/database';

export const APP_NAME = 'E-POTING PEKON RAWAS';
export const REGION_FULL = 'Pekon Rawas, Kecamatan Pesisir Tengah, Kabupaten Pesisir Barat, Lampung';
export const SIMULATION_DISCLAIMER = 'MODE SIMULASI — BUKAN PEMILIHAN RESMI';

// Asset Citra yang telah digenerate secara otentik
export const IMAGES = {
  hero: '/src/assets/images/hero_pekon_rawas_1792855860751.jpg',
  candidate1: '/src/assets/images/candidate_fauzi_1792855861315.jpg',
  candidate2: '/src/assets/images/candidate_rahma_1792855862550.jpg',
  candidate3: '/src/assets/images/candidate_hendra_1792855861742.jpg',
};

export const INITIAL_ELECTION: Election = {
  id: 'el-pekon-rawas-2026',
  name: 'Simulasi Pemilihan Peratin Pekon Rawas Periode 2026-2032',
  region_name: 'Pekon Rawas, Kabupaten Pesisir Barat',
  description: 'Simulasi pemungutan suara elektronik untuk menguji kesiapan sistem informasi, verifikasi DPT pemilih, dan transparansi penghitungan suara berbasis standar integritas pemilu.',
  start_at: '2026-10-24T08:00:00Z',
  end_at: '2026-10-31T16:00:00Z',
  status: 'open', // Mode simulasi sedang dibuka untuk uji coba
  is_demo: true,
  results_published_at: null,
  created_at: '2026-10-20T00:00:00Z',
  updated_at: '2026-10-24T08:00:00Z',
};

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    election_id: 'el-pekon-rawas-2026',
    ballot_number: 1,
    full_name: 'Ahmad Fauzi, S.Pd.',
    photo_path: IMAGES.candidate1,
    profile: 'Tokoh pendidik dan penggerak masyarakat Pekon Rawas yang berpengalaman lebih dari 15 tahun dalam pemberdayaan pemuda dan penguatan sarana pendidikan desa.',
    vision: 'Mewujudkan Pekon Rawas yang Berdaya, Berakhlak, dan Mandiri Berbasis Potensi Maritim dan Pertanian Berkelanjutan.',
    mission: [
      'Peningkatan transparansi tata kelola anggaran pekon melalui publikasi berkala dan digitalisasi pelayanan warga.',
      'Optimalisasi sarana jalan pertanian, sentra nelayan pesisir, dan fasilitas umum masyarakat.',
      'Pengembangan beasiswa prestasi bagi anak-anak Pekon Rawas berpenghasilan rendah.',
      'Penguatan peran Badan Usaha Milik Desa (BUMDes) untuk menampung komoditas lokal Krui.'
    ],
    status: 'active',
    created_at: '2026-10-21T02:00:00Z',
    updated_at: '2026-10-21T02:00:00Z',
  },
  {
    id: 'cand-02',
    election_id: 'el-pekon-rawas-2026',
    ballot_number: 2,
    full_name: 'Siti Rahmawati, S.E.',
    photo_path: IMAGES.candidate2,
    profile: 'Praktisi ekonomi kerakyatan dan ketua koperasi wanita pekon, fokus pada hilirisasi produk UMKM olahan damar, kopi, dan kerajinan tapis Pesisir Barat.',
    vision: 'Pekon Rawas Maju, Tangguh, dan Inklusif Melalui Penguatan Ekonomi Kreatif dan Kesejahteraan Keluarga.',
    mission: [
      'Pemberian modal bergulir dan pelatihan digital marketing bagi pelaku usaha mikro perempuan dan pemuda.',
      'Peningkatan mutu layanan kesehatan Posyandu, pencegahan stunting, dan santunan lansia.',
      'Perbaikan sanitasi lingkungan pemukiman dan pengolahan sampah mandiri pekon.',
      'Membangun balai kemasyarakatan sebagai pusat kreasi adat Saibatin dan budaya lokal.'
    ],
    status: 'active',
    created_at: '2026-10-21T02:30:00Z',
    updated_at: '2026-10-21T02:30:00Z',
  },
  {
    id: 'cand-03',
    election_id: 'el-pekon-rawas-2026',
    ballot_number: 3,
    full_name: 'Hendra Saputra',
    photo_path: IMAGES.candidate3,
    profile: 'Pemuda pelopor agraria dan inovator agrowisata pesisir, aktif memperjuangkan perlindungan ekosistem pesisir dan modernisasi alat tangkap nelayan tradisional.',
    vision: 'Revitalisasi Desa Pesisir: Kolaborasi Antar-Generasi Menuju Pekon Rawas Modern dan Lestari.',
    mission: [
      'Modernisasi rantai dingin (cold chain) nelayan dan kemudahan akses BBM bersubsidi tepat sasaran.',
      'Pengembangan spot desa wisata bahari ramah lingkungan bersinergi dengan destinasi surfing Krui.',
      'Pelayanan administrasi kependudukan cepat 1 hari selesai berbasis loket digital pekon.',
      'Kemitraan penanaman mangrove dan mitigasi abrasi pesisir pantai Rawas.'
    ],
    status: 'active',
    created_at: '2026-10-21T03:00:00Z',
    updated_at: '2026-10-21T03:00:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    election_id: 'el-pekon-rawas-2026',
    title: 'Pembukaan Akses Simulasi Bilik Suara Elektronik Pekon Rawas',
    content: 'Panitia Pemilihan Peratin membuka masa uji coba simulasi pemungutan suara bagi seluruh warga yang telah terdaftar dalam Daftar Pemilih Sementara (DPS). Uji coba ini murni simulasi dan bertujuan menguji kehandalan sistem.',
    category: 'pengumuman',
    published_at: '2026-10-24T08:00:00Z',
    created_by: 'Panitia Pemilihan Peratin Rawas',
    created_at: '2026-10-24T07:30:00Z',
  },
  {
    id: 'ann-02',
    election_id: 'el-pekon-rawas-2026',
    title: 'Pemberitahuan Verifikasi Kelayakan Pemilih oleh Tim Verifikator',
    content: 'Warga dimohon memeriksa status kelayakan pemilih pada menu Panduan atau Profil. Petugas Verifikator akan melakukan verifikasi berkas NIK dan domisili secara bertahap.',
    category: 'jadwal',
    published_at: '2026-10-23T10:00:00Z',
    created_by: 'Sekretariat Panitia',
    created_at: '2026-10-23T09:45:00Z',
  },
  {
    id: 'ann-03',
    election_id: 'el-pekon-rawas-2026',
    title: 'Penetapan Nomor Urut Calon Peratin Periode Simulasi',
    content: 'Berdasarkan rapat pleno panitia, telah ditetapkan 3 calon Peratin Pekon Rawas dengan nomor urut 01 (Ahmad Fauzi, S.Pd.), nomor urut 02 (Siti Rahmawati, S.E.), dan nomor urut 03 (Hendra Saputra).',
    category: 'info',
    published_at: '2026-10-22T14:00:00Z',
    created_by: 'Ketua Panitia Pemilihan',
    created_at: '2026-10-22T13:30:00Z',
  },
];

export const INITIAL_COMMITTEE = [
  {
    id: 'cmt-01',
    election_id: 'el-pekon-rawas-2026',
    full_name: 'Zulkifli, S.H.',
    role_title: 'Ketua Panitia Pemilihan',
    sk_number: '140/01/SK-PAN/RAWAS/2026',
    phone: '0812-7890-XXXX',
    dusun_assigned: 'Seluruh Dusun Pekon Rawas',
    status: 'active' as const,
    created_at: '2026-10-15T00:00:00Z',
    updated_at: '2026-10-15T00:00:00Z',
  },
  {
    id: 'cmt-02',
    election_id: 'el-pekon-rawas-2026',
    full_name: 'Mansyur Efendi',
    role_title: 'Sekretaris Panitia',
    sk_number: '140/01/SK-PAN/RAWAS/2026',
    phone: '0813-6789-XXXX',
    dusun_assigned: 'Sekretariat Balai Pekon',
    status: 'active' as const,
    created_at: '2026-10-15T00:00:00Z',
    updated_at: '2026-10-15T00:00:00Z',
  },
  {
    id: 'cmt-03',
    election_id: 'el-pekon-rawas-2026',
    full_name: 'Rohimah, A.Md.',
    role_title: 'Bendahara & Logistik',
    sk_number: '140/01/SK-PAN/RAWAS/2026',
    phone: '0852-1234-XXXX',
    dusun_assigned: 'Pekon Rawas',
    status: 'active' as const,
    created_at: '2026-10-15T00:00:00Z',
    updated_at: '2026-10-15T00:00:00Z',
  },
  {
    id: 'cmt-04',
    election_id: 'el-pekon-rawas-2026',
    full_name: 'Nurhasanah',
    role_title: 'Koordinator Verifikator DPT',
    sk_number: '140/02/SK-PAN/RAWAS/2026',
    phone: '0821-9876-XXXX',
    dusun_assigned: 'Dusun Way Sindi & Rawas Tengah',
    status: 'active' as const,
    created_at: '2026-10-16T00:00:00Z',
    updated_at: '2026-10-16T00:00:00Z',
  },
  {
    id: 'cmt-05',
    election_id: 'el-pekon-rawas-2026',
    full_name: 'Bahrudin',
    role_title: 'Divisi Teknis & Admin IT',
    sk_number: '140/03/SK-PAN/RAWAS/2026',
    phone: '0877-5544-XXXX',
    dusun_assigned: 'Server & Pusat Komputasi E-Poting',
    status: 'active' as const,
    created_at: '2026-10-16T00:00:00Z',
    updated_at: '2026-10-16T00:00:00Z',
  },
  {
    id: 'cmt-06',
    election_id: 'el-pekon-rawas-2026',
    full_name: 'Subur Santoso',
    role_title: 'Verifikator Lapangan',
    sk_number: '140/02/SK-PAN/RAWAS/2026',
    phone: '0857-4321-XXXX',
    dusun_assigned: 'Dusun Way Haru & Pematang Nibung',
    status: 'active' as const,
    created_at: '2026-10-16T00:00:00Z',
    updated_at: '2026-10-16T00:00:00Z',
  },
];

export interface DemoUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  voterRef?: string;
  nikMasked?: string;
  dusun?: string;
  isVerified?: boolean;
  avatarLetter: string;
  roleLabel: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    id: 'usr-admin-01',
    name: 'Bahrudin (Administrator)',
    role: 'admin',
    email: 'admin.pekon@rawas.desa.id',
    avatarLetter: 'A',
    roleLabel: 'Admin Sistem',
    description: 'Akses penuh konfigurasi, manajemen akun petugas, audit trail, dan status teknis.',
  },
  {
    id: 'usr-panitia-01',
    name: 'Zulkifli, S.H. (Ketua Panitia)',
    role: 'panitia',
    email: 'panitia@rawas.desa.id',
    avatarLetter: 'P',
    roleLabel: 'Panitia Pemilihan',
    description: 'Mengelola profil calon, jadwal tahapan, pengumuman, dan kontrol simulasi.',
  },
  {
    id: 'usr-verifikator-01',
    name: 'Nurhasanah (Verifikator DPT)',
    role: 'verifikator',
    email: 'verifikator@rawas.desa.id',
    avatarLetter: 'V',
    roleLabel: 'Verifikator Berkas',
    description: 'Memeriksa keabsahan DPT, menandai kelayakan pemilih, dan mencatat alasan penolakan.',
  },
  {
    id: 'usr-pengawas-01',
    name: 'Drs. Suparman (Pengawas Independen BPD)',
    role: 'pengawas',
    email: 'pengawas.bpd@rawas.desa.id',
    avatarLetter: 'W',
    roleLabel: 'Pengawas Independen',
    description: 'Memantau jalannya simulasi, mengawasi audit log, tanpa hak mengubah suara.',
  },
  {
    id: 'usr-voter-01',
    name: 'Muhammad Ridho',
    role: 'voter',
    email: 'ridho.warga@rawas.desa.id',
    voterRef: 'RWAS-2026-001',
    nikMasked: '180401230492****',
    dusun: 'Dusun Way Sindi, RT 02',
    isVerified: true,
    avatarLetter: 'R',
    roleLabel: 'Pemilih Terdaftar (Belum Memilih)',
    description: 'Warga Pekon Rawas telah terverifikasi, memenuhi syarat memberikan suara simulasi.',
  },
  {
    id: 'usr-voter-02',
    name: 'Dewi Lestari',
    role: 'voter',
    email: 'dewi.warga@rawas.desa.id',
    voterRef: 'RWAS-2026-002',
    nikMasked: '180401650895****',
    dusun: 'Dusun Rawas Tengah, RT 01',
    isVerified: true,
    avatarLetter: 'D',
    roleLabel: 'Pemilih Terdaftar (Demo Multi-Voter)',
    description: 'Warga terverifikasi lainnya untuk simulasi rotasi pemilih.',
  },
  {
    id: 'usr-voter-unverified',
    name: 'Rian Pratama',
    role: 'voter',
    email: 'rian.pending@rawas.desa.id',
    voterRef: 'RWAS-2026-042',
    nikMasked: '180401121199****',
    dusun: 'Dusun Pematang Nibung, RT 03',
    isVerified: false,
    avatarLetter: 'N',
    roleLabel: 'Pemilih Belum Terverifikasi',
    description: 'Contoh akun pemilih dengan status pending (untuk menguji penolakan hak suara).',
  },
];
