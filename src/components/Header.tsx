import React from 'react';
import { 
  Menu, 
  MoreVertical,
  User, 
  Edit3, 
  Smartphone, 
  Radio, 
  Mic, 
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile } from '../types';
import { PolyIbadanLogo } from './PolyIbadanLogo';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  studentProfile: StudentProfile;
  onOpenProfileModal: () => void;
  onOpenVoiceModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  studentProfile,
  onOpenProfileModal,
  onOpenVoiceModal
}) => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [showInstallHelp, setShowInstallHelp] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallHelp(true);
      setTimeout(() => setShowInstallHelp(false), 5000);
    }
  };

  // Format date like screenshot: "Wed Oct 14 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="bg-[#3D2317] text-white shadow-md border-b border-[#543322] sticky top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left section: Hamburger/Three-bar Menu button & Welcome Header */}
          <div className="flex items-center space-x-3.5">
            {/* Three Dot (⋮) & Menu button to toggle left sidebar drawer */}
            <button
              onClick={onToggleSidebar}
              className="px-2.5 py-2 bg-[#513121] hover:bg-[#68412D] text-white rounded-xl transition-all cursor-pointer shadow-xs border border-[#68412D] flex items-center gap-1 shrink-0 group hover:ring-2 hover:ring-[#C69C6D]/50"
              title="Open Navigation Menu (Three Dots ⋮)"
              aria-label="Toggle navigation menu"
            >
              <MoreVertical className="w-5 h-5 text-[#C69C6D] group-hover:text-white transition-colors" />
              <Menu className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-xs font-bold text-[#FAF7F2] ml-0.5">Menu</span>
            </button>

            {/* Welcome greeting with formatted date pill matching the user's screenshot */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-black tracking-tight text-white uppercase font-sans truncate">
                  Welcome {studentProfile.name}
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-[#1E40AF] text-white text-[11px] font-bold shadow-2xs">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#D7CCC8] mt-0.5 flex-wrap">
                <span className="sm:hidden px-2 py-0.5 rounded bg-[#1E40AF] text-white text-[10px] font-bold">
                  {formattedDate}
                </span>
                <span>The Polytechnic, Ibadan</span>
                <span>•</span>
                <span className="text-[#C69C6D] font-medium italic">"Ise loogun ise"</span>
              </div>
            </div>
          </div>

          {/* Right section: Student Session Details, Live Voice & Persona */}
          <div className="flex items-center gap-2.5 flex-wrap justify-between md:justify-end">
            {/* Academic Session & Semester Pill (matching portal card in screenshot) */}
            <div className="hidden lg:flex flex-col text-right leading-tight bg-[#513121] px-3 py-1.5 rounded-lg border border-[#68412D] text-[11px]">
              <span className="font-bold text-[#FAF7F2]">
                Current Session: <span className="text-[#C69C6D]">2025/2026</span>
              </span>
              <span className="text-[#D7CCC8]">
                Harmattan Semester · {studentProfile.level}
              </span>
            </div>

            {/* Live Voice Assistant Quick Launcher */}
            {onOpenVoiceModal && (
              <button
                onClick={onOpenVoiceModal}
                className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-white text-[#3D2317] font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-[#C69C6D]"
                title="Open Voice Assistant"
              >
                <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span className="font-bold">Live Voice 🎙️</span>
              </button>
            )}

            {/* PWA Install Button */}
            {!isInstalled && (
              <div className="relative hidden sm:block">
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 bg-[#C69C6D] hover:bg-[#b58b5c] text-[#2C180E] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Install app to your home screen"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
                {showInstallHelp && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white text-[#2C180E] p-2.5 rounded-lg shadow-lg border border-[#E5DDD3] text-[11px] z-50">
                    <p className="font-semibold mb-0.5">To Install App:</p>
                    <p>Tap your browser's share or menu button (⋮ / ⎋) and select <strong>"Add to Home Screen"</strong>.</p>
                  </div>
                )}
              </div>
            )}

            {/* Student Info Quick Profile Box */}
            <div className="flex items-center gap-2 bg-[#513121] px-3 py-1.5 rounded-lg border border-[#68412D] text-xs">
              <div className="w-6 h-6 rounded-full bg-[#FAF7F2] text-[#3D2317] flex items-center justify-center font-bold text-[11px] shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left leading-tight min-w-0">
                <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">
                  {studentProfile.department}
                </span>
                <span className="text-[10px] text-[#D7CCC8] truncate font-mono">
                  {studentProfile.matricNo}
                </span>
              </div>
              <button
                onClick={onOpenProfileModal}
                className="ml-1.5 px-2 py-0.5 bg-white hover:bg-[#FAF7F2] text-[#3D2317] font-bold rounded text-[10px] flex items-center gap-0.5 transition-colors cursor-pointer shadow-xs shrink-0"
                title="Change Student Profile"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
