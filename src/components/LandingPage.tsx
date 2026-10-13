import React, { useState } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Calculator, 
  Calendar, 
  Building2, 
  LifeBuoy, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  School,
  Users
} from 'lucide-react';
import { PolyIbadanLogo } from './PolyIbadanLogo';
import { StudentProfile } from '../types';
import { FACULTIES, SUGGESTED_QUESTIONS, INSTITUTION_INFO } from '../data/polyIbadanData';

interface LandingPageProps {
  studentProfile: StudentProfile;
  onNavigate: (tab: 'chat' | 'faqs' | 'calculator' | 'calendar' | 'directory' | 'escalate') => void;
  onQuickAsk: (question: string) => void;
  onOpenProfileModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  studentProfile,
  onNavigate,
  onQuickAsk,
  onOpenProfileModal
}) => {
  const [heroSearchInput, setHeroSearchInput] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      onQuickAsk(heroSearchInput.trim());
    } else {
      onNavigate('chat');
    }
  };

  return (
    <div className="space-y-10 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border border-[#E5DDD3] rounded-3xl p-6 sm:p-10 shadow-xs">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-[-40px] top-[-40px] opacity-[0.04] pointer-events-none select-none">
          <PolyIbadanLogo size={420} />
        </div>

        <div className="relative z-10 max-w-3xl">
          {/* Header pill / Institution Identity */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5DDD3] text-[#3D2317] text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3D2317]" />
            <span>The Polytechnic, Ibadan · Official Academic Advisory Portal</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
            <PolyIbadanLogo size={84} className="shrink-0 drop-shadow-sm" />
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#2C180E] font-serif tracking-tight leading-tight">
                Student Academic FAQ &amp; Advisory Assistant
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#6D4C41] mt-1 italic">
                "{INSTITUTION_INFO.motto}" · Established 1970
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#5D4037] leading-relaxed mb-6">
            Instant 24/7 academic guidance for <strong>National Diploma (ND)</strong> and <strong>Higher National Diploma (HND)</strong> students. Find accurate policies on portal course registration, NBTE 4.0 CGPA calculations, carryover rules, 4-month SIWES, 1-year cognate IT, and campus directorates.
          </p>

          {/* Search Box / Instant Question Input */}
          <form onSubmit={handleHeroSearch} className="mb-6">
            <div className="relative flex items-center shadow-xs">
              <Search className="w-5 h-5 text-[#8D6E63] absolute left-4" />
              <input
                type="text"
                value={heroSearchInput}
                onChange={(e) => setHeroSearchInput(e.target.value)}
                placeholder="Ask any question (e.g., How do I register courses on the portal? What is the cutoff for HND?)..."
                className="w-full pl-12 pr-28 sm:pr-36 py-3.5 sm:py-4 text-xs sm:text-sm border border-[#D7CCC8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3D2317] bg-[#FCFBF9] text-[#2C180E] placeholder-[#8D6E63]"
              />
              <button
                type="submit"
                className="absolute right-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#3D2317] hover:bg-[#2A160D] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick CTA Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('chat')}
              className="px-5 py-2.5 bg-[#3D2317] hover:bg-[#2A160D] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Launch AI Chatbot</span>
            </button>

            <button
              onClick={() => onNavigate('faqs')}
              className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D2317] border border-[#D7CCC8] rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Verified FAQs</span>
            </button>

            <button
              onClick={() => onNavigate('calculator')}
              className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#4A2E1B] border border-[#E5DDD3] rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>NBTE 4.0 CGPA Tool</span>
            </button>
          </div>
        </div>

        {/* Student Active Persona Banner in Hero Footer */}
        <div className="mt-8 pt-5 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#5D4037]">
            <span className="font-bold text-[#3D2317]">Current Student Context:</span>
            <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E5DDD3] font-semibold text-[#3D2317]">
              {studentProfile.name} · {studentProfile.level} · {studentProfile.department}
            </span>
          </div>

          <button
            onClick={onOpenProfileModal}
            className="text-xs text-[#3D2317] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Change Level or Faculty</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Featured Core Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C180E] font-serif">
              Explore Academic Services &amp; Tools
            </h2>
            <p className="text-xs text-[#6D4C41]">
              Everything you need to navigate your academic journey at The Polytechnic, Ibadan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Chatbot */}
          <div 
            onClick={() => onNavigate('chat')}
            className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs hover:border-[#C69C6D] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DDD3] text-[#3D2317] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2C180E] mb-1.5 flex items-center justify-between">
                <span>AI Academic Advisor</span>
                <ChevronRight className="w-4 h-4 text-[#8D6E63] group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Ask questions naturally and get instant answers tailored to your faculty, department, and academic level.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0EAE1] text-[11px] font-bold text-[#3D2317] flex items-center gap-1">
              <span>Start Dialogue</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2: Knowledge Base */}
          <div 
            onClick={() => onNavigate('faqs')}
            className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs hover:border-[#C69C6D] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DDD3] text-[#3D2317] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2C180E] mb-1.5 flex items-center justify-between">
                <span>Verified FAQs</span>
                <ChevronRight className="w-4 h-4 text-[#8D6E63] group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Search verified policies directly referenced from the Poly Ibadan Student Handbook and NBTE regulations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0EAE1] text-[11px] font-bold text-[#3D2317] flex items-center gap-1">
              <span>Browse Handbook</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3: CGPA Calculator */}
          <div 
            onClick={() => onNavigate('calculator')}
            className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs hover:border-[#C69C6D] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DDD3] text-[#3D2317] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2C180E] mb-1.5 flex items-center justify-between">
                <span>NBTE 4.0 CGPA Tool</span>
                <ChevronRight className="w-4 h-4 text-[#8D6E63] group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Compute your Semester GPA and Cumulative CGPA using the official Polytechnic grading points (Distinction to Pass).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0EAE1] text-[11px] font-bold text-[#3D2317] flex items-center gap-1">
              <span>Calculate Standing</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 4: Academic Calendar */}
          <div 
            onClick={() => onNavigate('calendar')}
            className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs hover:border-[#C69C6D] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DDD3] text-[#3D2317] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2C180E] mb-1.5 flex items-center justify-between">
                <span>Academic Calendar</span>
                <ChevronRight className="w-4 h-4 text-[#8D6E63] group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Stay updated on Harmattan and Rain semester registration cutoffs, mid-semester CA tests, and exams.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0EAE1] text-[11px] font-bold text-[#3D2317] flex items-center gap-1">
              <span>View 2025/2026 Dates</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 5: Campus Directory */}
          <div 
            onClick={() => onNavigate('directory')}
            className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs hover:border-[#C69C6D] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DDD3] text-[#3D2317] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2C180E] mb-1.5 flex items-center justify-between">
                <span>Campus &amp; Offices Guide</span>
                <ChevronRight className="w-4 h-4 text-[#8D6E63] group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Locate key offices across North, South, and Middle campuses (DSA, Poly Clinic, ICT Centre, Bursary).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0EAE1] text-[11px] font-bold text-[#3D2317] flex items-center gap-1">
              <span>Explore Campuses</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 6: Advising Helpdesk */}
          <div 
            onClick={() => onNavigate('escalate')}
            className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs hover:border-[#C69C6D] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DDD3] text-[#3D2317] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2C180E] mb-1.5 flex items-center justify-between">
                <span>Advising Helpdesk</span>
                <ChevronRight className="w-4 h-4 text-[#8D6E63] group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Need official human intervention for missing CA scores or grade appeals? Generate a referral docket.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0EAE1] text-[11px] font-bold text-[#3D2317] flex items-center gap-1">
              <span>Generate Docket</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Student Questions Quick Grid */}
      <section className="bg-white border border-[#E5DDD3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#2C180E] font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C69C6D]" />
            Frequently Asked Questions by Poly Ibadan Students
          </h2>
          <p className="text-xs text-[#6D4C41]">
            Click any question to get an instant answer from the assistant
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTED_QUESTIONS.map((question, idx) => (
            <button
              key={idx}
              onClick={() => onQuickAsk(question)}
              className="text-left p-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE5] border border-[#E5DDD3] hover:border-[#C69C6D] transition-colors cursor-pointer group flex items-center justify-between gap-3"
            >
              <span className="text-xs font-semibold text-[#3D2317] group-hover:text-[#2A160D]">
                {question}
              </span>
              <ChevronRight className="w-4 h-4 text-[#8D6E63] shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </section>

      {/* Poly Ibadan Faculties Strip */}
      <section className="bg-[#3D2317] text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold text-[#C69C6D] uppercase tracking-wider block mb-1">
            Academic Divisions
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            Serving All Five Faculties of The Polytechnic, Ibadan
          </h3>
          <p className="text-xs text-[#D7CCC8] mt-1.5 leading-relaxed">
            The assistant is trained on the distinct departmental regulations, course units, and SIWES requirements across all faculties.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {FACULTIES.map((fac) => (
            <div 
              key={fac.code} 
              className="bg-[#513121] p-3.5 rounded-xl border border-[#68412D] text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate">{fac.name}</span>
                <span className="font-mono text-[10px] bg-[#3D2317] text-[#C69C6D] font-bold px-1.5 py-0.5 rounded">
                  {fac.code}
                </span>
              </div>
              <span className="text-[11px] text-[#D7CCC8] block">{fac.campus}</span>
              <span className="text-[11px] text-[#A1887F] block">
                {fac.departments.length} Accredited Departments
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
