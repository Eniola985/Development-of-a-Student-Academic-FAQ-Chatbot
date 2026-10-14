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
  Radio,
  Mic,
  GraduationCap,
  ShoppingBag,
  FileText,
  User,
  Edit3,
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { StudentProfile } from '../types';
import { PolyIbadanLogo } from './PolyIbadanLogo';

export type NavTabId = 
  | 'home' 
  | 'chat' 
  | 'voice'
  | 'faqs' 
  | 'calculator' 
  | 'calendar' 
  | 'directory' 
  | 'checklist' 
  | 'escalate';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  studentProfile: StudentProfile;
  onOpenProfileModal: () => void;
  onOpenVoiceModal: () => void;
}

interface MenuItem {
  id: NavTabId | 'voice-action';
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'chat',
    label: 'AI Academic Chatbot',
    sublabel: 'Direct Q&A & Advisory',
    icon: MessageSquare
  },
  {
    id: 'voice-action',
    label: 'PolyVoice (Live Voice Chat)',
    sublabel: 'Real-time spoken AI',
    icon: Radio,
    isSpecial: true
  },
  {
    id: 'checklist',
    label: 'Course Clearance Checklist',
    sublabel: 'Admission & Course Reg',
    icon: CheckSquare
  },
  {
    id: 'faqs',
    label: 'Verified FAQs & Regulations',
    sublabel: 'Official Student Handbook',
    icon: BookOpen
  },
  {
    id: 'calculator',
    label: 'NBTE 4.0 CGPA Tool',
    sublabel: 'Semester GPA & Standing',
    icon: GraduationCap
  },
  {
    id: 'calendar',
    label: 'Academic Calendar',
    sublabel: '2025/2026 Session Dates',
    icon: Calendar
  },
  {
    id: 'directory',
    label: 'Campus Directory & Bookstores',
    sublabel: 'Faculties, Hubs & Books',
    icon: Building2
  },
  {
    id: 'escalate',
    label: 'Advising Helpdesk & Tickets',
    sublabel: 'Official Referral Tickets',
    icon: LifeBuoy
  },
  {
    id: 'home',
    label: 'Portal Home / Dashboard',
    sublabel: 'Overview & Quick Actions',
    icon: Home
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  studentProfile,
  onOpenProfileModal,
  onOpenVoiceModal
}) => {
  const handleItemClick = (item: MenuItem) => {
    if (item.id === 'voice-action') {
      onOpenVoiceModal();
    } else {
      setActiveTab(item.id as NavTabId);
    }
    // On mobile screens, automatically close drawer after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 w-72 sm:w-80 bg-white border-r border-[#E5DDD3] shadow-xl lg:shadow-none flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Institutional Header (matching Poly Ibadan official portal design) */}
        <div className="p-4 sm:p-5 border-b border-[#E5DDD3] bg-gradient-to-b from-[#FAF7F2] to-white flex flex-col items-center text-center relative">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute right-3 top-3 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-[#F2ECE5] transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo container */}
          <div className="w-24 h-24 mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-xs border border-[#E5DDD3]">
            <PolyIbadanLogo size={80} className="drop-shadow-xs" />
          </div>

          {/* Blue institutional banner title */}
          <div className="w-full bg-[#1E40AF] text-white py-1.5 px-3 rounded-lg shadow-xs mt-1">
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight font-serif">
              The Polytechnic, Ibadan
            </h2>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#6D4C41]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF]"></span>
            <span>Academic Advisory &amp; FAQ Portal</span>
          </div>
        </div>

        {/* Scrollable Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin">
          <div className="px-3 pt-1 pb-1.5 text-[10px] font-extrabold text-[#8D6E63] uppercase tracking-wider">
            Portal Menu
          </div>

          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;
            const isVoiceAction = item.id === 'voice-action';

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#3D2317] text-white shadow-sm font-bold'
                    : isVoiceAction
                    ? 'bg-[#FAF0E6] text-[#3D2317] hover:bg-[#F5E6D3] border border-[#C69C6D]/40 font-bold'
                    : 'text-[#3D2317] hover:bg-[#FAF7F2] hover:text-[#2C180E] font-medium border border-transparent hover:border-[#E5DDD3]'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-[#513121] text-white'
                        : isVoiceAction
                        ? 'bg-red-500 text-white'
                        : 'bg-[#FAF7F2] text-[#3D2317] border border-[#E5DDD3]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm truncate flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {isVoiceAction && (
                        <span className="text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                          Live
                        </span>
                      )}
                    </div>
                    {item.sublabel && (
                      <p
                        className={`text-[11px] truncate ${
                          isActive ? 'text-[#D7CCC8]' : 'text-[#8D6E63]'
                        }`}
                      >
                        {item.sublabel}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? 'text-white' : 'text-[#8D6E63] opacity-60'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Bottom Student Profile Card */}
        <div className="p-3 border-t border-[#E5DDD3] bg-[#FAF7F2]">
          <div className="bg-white p-3 rounded-xl border border-[#E5DDD3] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#3D2317] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#2C180E] truncate">
                    {studentProfile.name}
                  </div>
                  <div className="text-[10px] text-[#6D4C41] truncate font-mono">
                    {studentProfile.matricNo}
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenProfileModal}
                className="p-1 text-[#3D2317] hover:bg-[#FAF7F2] rounded transition-colors cursor-pointer"
                title="Switch Student Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-[10px] text-[#6D4C41]">
              <span className="font-semibold">{studentProfile.level} ({studentProfile.program})</span>
              <span className="truncate max-w-[120px]">{studentProfile.department}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
