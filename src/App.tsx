import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTabId } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { KnowledgeBase } from './components/KnowledgeBase';
import { CGPACalculator } from './components/CGPACalculator';
import { AcademicCalendarView } from './components/AcademicCalendarView';
import { CampusDirectoryView } from './components/CampusDirectoryView';
import { RegistrationChecklist } from './components/RegistrationChecklist';
import { EscalationModal } from './components/EscalationModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { VoiceChatModal } from './components/VoiceChatModal';
import { StudentProfile } from './types';
import { INSTITUTION_INFO } from './data/polyIbadanData';
import { PolyIbadanLogo } from './components/PolyIbadanLogo';
import { ExternalLink, ShieldCheck } from 'lucide-react';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Student',
  matricNo: '23/FSC/COM/042',
  level: 'ND I',
  program: 'Full-Time',
  faculty: 'Faculty of Science',
  department: 'Computer Science'
};

export default function App() {
  // Default to 'home' so first-time visitors see the welcoming Landing Page
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'faqs' | 'calculator' | 'calendar' | 'directory' | 'checklist' | 'escalate'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [escalateInitialSubject, setEscalateInitialSubject] = useState('');
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);

  // Load profile from localStorage if exists
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('poly_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    try {
      localStorage.setItem('poly_student_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickAsk = (question: string) => {
    setChatInitialQuestion(question);
    setActiveTab('chat');
  };

  const handleOpenEscalateModal = (prefillSubject?: string) => {
    setEscalateInitialSubject(prefillSubject || '');
    setIsEscalateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex font-sans text-[#2C180E] antialiased selection:bg-[#C69C6D] selection:text-[#2C180E]">
      {/* Left Navigation Sidebar matching official Poly Ibadan student portal */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'voice') {
            setIsVoiceModalOpen(true);
          } else {
            setActiveTab(tab as any);
          }
        }}
        studentProfile={studentProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Right Content Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header with Hamburger Button, Welcome Banner, and Date Pill */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          studentProfile={studentProfile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">

        {activeTab === 'home' && (
          <LandingPage
            studentProfile={studentProfile}
            onNavigate={(tab) => setActiveTab(tab)}
            onQuickAsk={handleQuickAsk}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatInterface
            studentProfile={studentProfile}
            onOpenEscalateModal={handleOpenEscalateModal}
            onOpenFaqsTab={() => setActiveTab('faqs')}
            initialQuestion={chatInitialQuestion}
            onClearInitialQuestion={() => setChatInitialQuestion(undefined)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {activeTab === 'faqs' && (
          <KnowledgeBase
            onAskInChat={handleQuickAsk}
          />
        )}

        {activeTab === 'calculator' && (
          <CGPACalculator />
        )}

        {activeTab === 'calendar' && (
          <AcademicCalendarView />
        )}

        {activeTab === 'directory' && (
          <CampusDirectoryView />
        )}

        {activeTab === 'checklist' && (
          <RegistrationChecklist
            studentProfile={studentProfile}
            onOpenEscalate={handleOpenEscalateModal}
          />
        )}

        {activeTab === 'escalate' && (
          <EscalationModal
            studentProfile={studentProfile}
            isStandaloneTab={true}
          />
        )}
      </main>


      {/* Student Profile Customizer Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Advising Escalation Dialog */}
      {isEscalateModalOpen && (
        <EscalationModal
          studentProfile={studentProfile}
          initialSubject={escalateInitialSubject}
          onClose={() => setIsEscalateModalOpen(false)}
        />
      )}

      {/* PolyVoice Interactive Live Voice Assistant Modal */}
      <VoiceChatModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        studentProfile={studentProfile}
        onSendToTextChat={handleQuickAsk}
      />


      {/* Institutional Footer */}
      <footer className="bg-white border-t border-[#E5DDD3] mt-auto py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#6D4C41]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5 text-center md:text-left">
            <PolyIbadanLogo size={28} className="shrink-0" />
            <span>
              <strong className="text-[#3D2317]">The Polytechnic, Ibadan</strong> · Academic Advisory &amp; Student FAQ System · <span className="italic">Ise loogun ise</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-[#5D4037] flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-[#3D2317] transition-colors font-medium cursor-pointer"
            >
              Home Portal
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <a
              href="https://portal.polyibadan.edu.ng"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#3D2317] flex items-center gap-1 transition-colors font-medium"
            >
              <span>Student Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <a
              href="https://polyibadan.edu.ng"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#3D2317] flex items-center gap-1 transition-colors font-medium"
            >
              <span>Main Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-[#4A2E1B] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C69C6D]" />
              <span>NBTE Accredited Standards</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}

