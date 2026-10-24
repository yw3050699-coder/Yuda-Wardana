/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SimulationRepository } from './lib/storage';
import { DemoUser } from './lib/constants';
import { Candidate } from './types/database';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TimelineSection } from './components/home/TimelineSection';
import { CandidatesPreview } from './components/home/CandidatesPreview';
import { AnnouncementsSection } from './components/home/AnnouncementsSection';
import { GuideQuickSection } from './components/home/GuideQuickSection';
import { CandidateList } from './components/candidates/CandidateList';
import { InformationView } from './components/info/InformationView';
import { GuideView } from './components/guide/GuideView';
import { VotingBooth } from './components/voting/VotingBooth';
import { ResultsView } from './components/results/ResultsView';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  const repo = SimulationRepository.getInstance();

  const [currentTab, setCurrentTab] = useState<string>('beranda');
  const [currentUser, setCurrentUser] = useState<DemoUser>(() => repo.getCurrentUser());
  const [election, setElection] = useState(() => repo.getElection());
  const [candidates, setCandidates] = useState(() => repo.getCandidates());
  const [announcements, setAnnouncements] = useState(() => repo.getAnnouncements());
  const [results, setResults] = useState(() => repo.getResultsSummary());

  const [preselectedCandidateId, setPreselectedCandidateId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Refresh data trigger
  const handleRefreshData = () => {
    setElection(repo.getElection());
    setCandidates(repo.getCandidates());
    setAnnouncements(repo.getAnnouncements());
    setResults(repo.getResultsSummary());
    setCurrentUser(repo.getCurrentUser());
  };

  const handleSwitchUser = (user: DemoUser) => {
    repo.setCurrentUser(user);
    setCurrentUser(user);
    handleRefreshData();
  };

  const handleOpenVotingForCandidate = (candId: string) => {
    setPreselectedCandidateId(candId);
    setCurrentTab('voting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'beranda' && (
          <div>
            <HeroSection
              election={election}
              results={results}
              currentUser={currentUser}
              onNavigate={setCurrentTab}
              onOpenVoting={() => setCurrentTab('voting')}
            />
            <TimelineSection />
            <CandidatesPreview
              candidates={candidates}
              onSelectCandidate={(cand) => handleOpenVotingForCandidate(cand.id)}
              onNavigate={setCurrentTab}
            />
            <AnnouncementsSection announcements={announcements} />
            <GuideQuickSection
              onNavigate={setCurrentTab}
              onOpenVoting={() => setCurrentTab('voting')}
            />
          </div>
        )}

        {currentTab === 'informasi' && (
          <InformationView
            election={election}
            announcements={announcements}
            onNavigate={setCurrentTab}
            onOpenVoting={() => setCurrentTab('voting')}
          />
        )}

        {currentTab === 'calon' && (
          <CandidateList
            candidates={candidates}
            onOpenVotingForCandidate={handleOpenVotingForCandidate}
          />
        )}

        {currentTab === 'panduan' && (
          <GuideView
            onOpenVoting={() => setCurrentTab('voting')}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'voting' && (
          <VotingBooth
            election={election}
            candidates={candidates}
            currentUser={currentUser}
            onRefreshData={handleRefreshData}
            onNavigate={setCurrentTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            preselectedCandidateId={preselectedCandidateId}
          />
        )}

        {currentTab === 'hasil' && (
          <ResultsView
            election={election}
            results={results}
            currentUser={currentUser}
            onRefreshData={handleRefreshData}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardLayout
            election={election}
            candidates={candidates}
            results={results}
            currentUser={currentUser}
            onRefreshData={handleRefreshData}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth / Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSwitchUser}
      />
    </div>
  );
}
