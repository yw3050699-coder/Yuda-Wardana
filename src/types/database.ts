/**
 * E-POTING PEKON RAWAS
 * Definisi Tipe Data & Skema Database Supabase PostgreSQL
 */

export type UserRole = 'admin' | 'panitia' | 'verifikator' | 'pengawas' | 'voter' | 'guest';

export type ElectionStatus = 'draft' | 'scheduled' | 'open' | 'closed' | 'completed';

export type CandidateStatus = 'active' | 'withdrawn' | 'disqualified';

export type VoterVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type EligibilityStatus = 'eligible' | 'ineligible' | 'pending';

export type BallotStatus = 'valid' | 'invalid' | 'provisional';

export interface Profile {
  id: string; // Auth User ID
  display_name: string;
  account_status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Election {
  id: string;
  name: string;
  region_name: string;
  description: string;
  start_at: string;
  end_at: string;
  status: ElectionStatus;
  is_demo: boolean;
  results_published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  election_id: string;
  ballot_number: number;
  full_name: string;
  photo_path: string;
  profile: string;
  vision: string;
  mission: string[];
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
}

export interface Voter {
  id: string;
  user_id: string;
  voter_reference: string; // Masked identifier (e.g. RWAS-2026-001)
  nik_masked?: string; // 1804************
  dusun: string; // Dusun/RT di Pekon Rawas
  verification_status: VoterVerificationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VoterEligibility {
  id: string;
  election_id: string;
  voter_id: string;
  eligibility_status: EligibilityStatus;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface VoterParticipation {
  id: string;
  election_id: string;
  voter_id: string;
  participated_at: string;
  status: 'participated';
  verification_hash: string; // Proof of participation hash given to voter
}

/**
 * PENTING: Tabel ballots HANYA menyimpan surat suara sah
 * TANPA voter_id, user_id, nama, NIK, atau identitas pemilih apapun
 * demi menjaga kerahasiaan pilihan (Secret Ballot Principle).
 */
export interface Ballot {
  id: string;
  election_id: string;
  candidate_id: string;
  recorded_at: string;
  ballot_status: BallotStatus;
}

export interface Announcement {
  id: string;
  election_id: string;
  title: string;
  content: string;
  category: 'info' | 'jadwal' | 'pengumuman' | 'urgensi';
  published_at: string;
  created_by: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_name?: string;
  actor_role?: UserRole;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ElectionResultItem {
  candidate_id: string;
  ballot_number: number;
  full_name: string;
  photo_path: string;
  vote_count: number;
  vote_percentage: number;
}

export interface ElectionResultsSummary {
  election_id: string;
  election_name: string;
  total_registered_voters: number;
  total_verified_voters: number;
  total_participated_voters: number;
  total_unparticipated_voters: number;
  turnout_percentage: number;
  total_valid_ballots: number;
  results: ElectionResultItem[];
  is_published: boolean;
  published_at: string | null;
  calculated_at: string;
}
