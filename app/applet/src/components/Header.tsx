import React from 'react';
import { 
  Home,
  MessageSquare, 
  BookOpen, 
  Calculator, 
  Calendar, 
  Building2, 
  CheckSquare,
  LifeBuoy, 
  User, 
  Edit3 
} from 'lucide-react';
import { StudentProfile } from '../types';
import { PolyIbadanLogo } from './PolyIbadanLogo';

interface HeaderProps {
  activeTab: 'home' | 'chat' | 'faqs' | 'calculator' | 'calendar' | 'directory' | 'checklist' | 'escalate';
  setActiveTab: (tab: 'home' | 'chat' | 'faqs' | 'calculator' | 'calendar' | 'directory' | 'checklist' | 'escalate') => void;
  studentProfile: StudentProfile;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentProfile,
  onOpenProfileModal
}) => {
  return (
    <header className="bg-[#3D2317] text-white shadow-md border-b border-[#543322] sticky top-0 z-40">
      {/* Top Banner with Institution Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & Institution Branding - Clickable to Home */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3.5 text-center md:text-left cursor-pointer group"
          >
            <PolyIbadanLogo size={52} className="shadow-xs group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                  The Polytechnic, Ibadan
                </h1>
                <span className="text-xs bg-[#C69C6D] text-[#2C180E] font-bold px-2 py-0.5 rounded shadow-xs">
                  Academic FAQ AI
                </span>
              </div>
              <p className="text-xs text-[#D7CCC8]">
                Student Advisory Assistant · <span className="italic font-medium">Ise loogun ise</span> (Est. 1970)
              </p>
            </div>
          </div>

          {/* Student Persona Box */}
          <div className="flex items-center gap-2 bg-[#513121] px-3.5 py-1.5 rounded-lg border border-[#68412D] text-xs">
            <User className="w-4 h-4 text-[#D7CCC8] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="font-semibold text-white truncate max-w-[170px] sm:max-w-xs">
                {studentProfile.name} ({studentProfile.level})
              </span>
              <span className="text-[11px] text-[#D7CCC8] truncate max-w-[170px] sm:max-w-xs">
                {studentProfile.department} · {studentProfile.program}
              </span>
            </div>
            <button
              onClick={onOpenProfileModal}
              className="ml-2 px-2.5 py-1 bg-white hover:bg-[#FAF7F2] text-[#3D2317] font-bold rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Change your department or level"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-[#543322] text-sm">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Academic Chatbot</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Verified FAQs</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Clearance Checklist</span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>NBTE 4.0 CGPA Tool</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Academic Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Campus Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('escalate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'escalate'
                ? 'bg-white text-[#3D2317] font-bold shadow-xs'
                : 'text-[#EFEBE9] hover:bg-[#513121] hover:text-white'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Advising Helpdesk</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
