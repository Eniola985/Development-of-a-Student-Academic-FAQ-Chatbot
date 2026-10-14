import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  UserCheck, 
  ShieldCheck,
  Building,
  Award,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { StudentProfile } from '../types';

interface RegistrationChecklistProps {
  studentProfile: StudentProfile;
  onOpenEscalate: (subject: string) => void;
}

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  policy: string;
  isMandatory: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'remita-fees',
    category: 'Financial Clearance',
    title: 'School Fees Payment & Remita RRR Generation',
    description: 'Generate your official Remita Retrieval Reference (RRR) via portal.polyibadan.edu.ng and pay at designated commercial banks or online via debit card.',
    policy: 'Bursary Department Financial Directives',
    isMandatory: true,
  },
  {
    id: 'tiship-medical',
    category: 'Medical Screening',
    title: 'Poly Clinic Medical Screening (TISHIP)',
    description: 'Undergo mandatory medical tests (Chest X-ray, Genotype, Blood Group, Urinalysis) at the Poly Clinic (Middle Campus) and obtain your TISHIP medical card.',
    policy: 'Polytechnic Health Services Directorate',
    isMandatory: true,
  },
  {
    id: 'credit-load',
    category: 'Academic Registration',
    title: 'Credit Unit Load Validation (Min 18 - Max 24)',
    description: 'Select approved departmental courses ensuring total credit units are between 18 (minimum) and 24 (maximum) units for the semester.',
    policy: 'NBTE & Academic Board Guidelines',
    isMandatory: true,
  },
  {
    id: 'print-forms',
    category: 'Documentation',
    title: 'Print 4 Colored Copies of Course Form',
    description: 'After online course registration approval, print four (4) colored copies of your course registration slip for physical endorsement.',
    policy: 'Academic Affairs Directorate',
    isMandatory: true,
  },
  {
    id: 'signatures',
    category: 'Physical Clearance',
    title: 'Physical Signatures & Endorsement (Advisor -> HOD -> Faculty)',
    description: 'Endorse your printed course forms sequentially with your Course Advisor, Head of Department (HOD), and Faculty Officer.',
    policy: 'Departmental Academic Regulations',
    isMandatory: true,
  },
  {
    id: 'exam-docket',
    category: 'Examination Eligibility',
    title: 'Exam Docket Generation & Bursary Stamping',
    description: 'Print your photocard examination docket and ensure fee validation stamp is obtained from Bursary before examination week.',
    policy: 'Chief Examiner & Academic Board Bylaws',
    isMandatory: true,
  }
];

export const RegistrationChecklist: React.FC<RegistrationChecklistProps> = ({
  studentProfile,
  onOpenEscalate
}) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('poly_registration_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      'remita-fees': true, // default some checked for demonstration
      'tiship-medical': false,
      'credit-load': true,
      'print-forms': false,
      'signatures': false,
      'exam-docket': false,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('poly_registration_checklist', JSON.stringify(completedItems));
    } catch (e) {
      console.error(e);
    }
  }, [completedItems]);

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalItems = CHECKLIST_ITEMS.length;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2C180E] via-[#4A2E1B] to-[#3D2317] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#C69C6D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69C6D]/20 text-[#E5DDD3] text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C69C6D]" />
              <span>Official Academic Clearance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Interactive Course Registration & Clearance Tracker
            </h1>
            <p className="text-[#E5DDD3] text-sm mt-2 max-w-2xl leading-relaxed">
              Step-by-step guidance for ND & HND students at The Polytechnic, Ibadan. Track your Remita fee payment, credit unit load, medical screening, and physical signature endorsement.
            </p>
          </div>
          <button
            onClick={handlePrintSlip}
            className="flex items-center gap-2 px-5 py-3 bg-[#C69C6D] hover:bg-[#b0885d] text-[#2C180E] font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clearance Slip</span>
          </button>
        </div>
      </div>

      {/* Student Meta & Progress Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E5DDD3] shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8D6E63] uppercase tracking-wider">Student Profile</span>
            <h3 className="text-lg font-bold text-[#2C180E] mt-1">{studentProfile.name}</h3>
            <div className="mt-3 space-y-2 text-sm text-[#5D4037]">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-[#8D6E63]">Matric No:</span>
                <span className="font-mono font-medium">{studentProfile.matricNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-[#8D6E63]">Level / Program:</span>
                <span className="font-medium">{studentProfile.level} ({studentProfile.program})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-[#8D6E63]">Faculty:</span>
                <span className="font-medium">{studentProfile.faculty}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8D6E63]">Department:</span>
                <span className="font-medium">{studentProfile.department}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100">
            <button
              onClick={() => onOpenEscalate('Course Registration & Clearance Issue')}
              className="w-full py-2.5 px-4 bg-[#F5F0EB] hover:bg-[#E5DDD3] text-[#4A2E1B] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#C69C6D]" />
              <span>Escalate Clearance Issue to HOD</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5DDD3] shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2C180E]">Clearance Progress Status</h3>
              <span className="text-sm font-bold px-3 py-1 bg-[#F5F0EB] text-[#4A2E1B] rounded-full">
                {completedCount} of {totalItems} Completed ({progressPercent}%)
              </span>
            </div>
            
            <div className="w-full bg-[#F5F0EB] rounded-full h-3.5 mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#C69C6D] to-[#8D6E63] h-3.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-[#8D6E63] mt-3">
              {progressPercent === 100 
                ? '🎉 Congratulations! Your clearance checklist is 100% complete. You are fully cleared for examinations.' 
                : 'Please complete all mandatory clearance steps and obtain physical signatures from your Course Advisor and HOD.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
            <div className="p-3 bg-[#F9F6F0] rounded-xl border border-[#E5DDD3]/60">
              <span className="text-[11px] font-semibold text-[#8D6E63]">Credit Load Rule</span>
              <p className="text-xs font-bold text-[#2C180E] mt-0.5">Min 18 – Max 24 Units</p>
            </div>
            <div className="p-3 bg-[#F9F6F0] rounded-xl border border-[#E5DDD3]/60">
              <span className="text-[11px] font-semibold text-[#8D6E63]">Portal Status</span>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">Remita Active</p>
            </div>
            <div className="p-3 bg-[#F9F6F0] rounded-xl border border-[#E5DDD3]/60">
              <span className="text-[11px] font-semibold text-[#8D6E63]">Medical Status</span>
              <p className="text-xs font-bold text-[#8D6E63] mt-0.5">Poly Clinic Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-2xl border border-[#E5DDD3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#F5F0EB] border-b border-[#E5DDD3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#C69C6D]" />
            <h3 className="font-bold text-[#2C180E]">Course Registration & Physical Clearance Steps</h3>
          </div>
          <span className="text-xs text-[#6D4C41] font-medium">Click checkbox to toggle status</span>
        </div>

        <div className="divide-y divide-[#E5DDD3]/60">
          {CHECKLIST_ITEMS.map((item, index) => {
            const isDone = !!completedItems[item.id];
            return (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-6 transition-colors hover:bg-[#F9F6F0] cursor-pointer flex items-start gap-4 ${
                  isDone ? 'bg-[#F9F6F0]/50' : 'bg-white'
                }`}
              >
                <div className="mt-1 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Square className="w-6 h-6 text-stone-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#E5DDD3] text-[#4A2E1B] text-[11px] font-bold rounded-md">
                      Step {index + 1} · {item.category}
                    </span>
                    {item.isMandatory && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <h4 className={`text-base font-bold mt-1.5 ${isDone ? 'text-stone-500 line-through' : 'text-[#2C180E]'}`}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#6D4C41] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-[#8D6E63] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C69C6D]" />
                    <span>Policy Reference: {item.policy}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Signoff Card */}
      <div className="bg-[#F5F0EB] rounded-2xl p-6 border border-[#E5DDD3] shadow-sm">
        <h3 className="text-base font-bold text-[#2C180E] mb-3">Physical Endorsement Sign-Off Table</h3>
        <p className="text-xs text-[#6D4C41] mb-4">
          After printing your 4 colored copies of the course form, obtain official signatures from the following officers in order:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E5DDD3]">
            <span className="text-[11px] font-bold text-[#8D6E63] uppercase">1. Course Advisor</span>
            <p className="text-sm font-bold text-[#2C180E] mt-1">Prerequisite & Credit Load Verification</p>
            <span className="inline-block mt-3 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Signature Required</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E5DDD3]">
            <span className="text-[11px] font-bold text-[#8D6E63] uppercase">2. Head of Department (HOD)</span>
            <p className="text-sm font-bold text-[#2C180E] mt-1">Departmental Stamp & Approval</p>
            <span className="inline-block mt-3 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Signature Required</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E5DDD3]">
            <span className="text-[11px] font-bold text-[#8D6E63] uppercase">3. Faculty Officer</span>
            <p className="text-sm font-bold text-[#2C180E] mt-1">Final Faculty Clearance Stamp</p>
            <span className="inline-block mt-3 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Signature Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};
