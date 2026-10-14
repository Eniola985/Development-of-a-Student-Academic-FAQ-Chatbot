import React, { useState } from 'react';
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

interface ChecklistItem {
  id: string;
  category: 'Freshers' | 'Returning' | 'All';
  title: string;
  description: string;
  department: string;
  mandatory: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'remita',
    category: 'All',
    title: 'School Fees Remita RRR Validation & Payment',
    description: 'Generate RRR via student portal, pay through approved commercial banks or online gateway, and obtain official receipt.',
    department: 'Bursary & ICT Centre',
    mandatory: true
  },
  {
    id: 'tiship',
    category: 'Freshers',
    title: 'Medical Screening & TISHIP Registration',
    description: 'Complete medical examination at the Poly Clinic and register for Tertiary Institutions Students Health Insurance Programme.',
    department: 'Poly Clinic (North Campus)',
    mandatory: true
  },
  {
    id: 'dept_clearance',
    category: 'Freshers',
    title: 'O\'Level Verification & Departmental Clearance',
    description: 'Present original WAEC/NECO certificates, birth certificate, and admission letter to the Departmental Admissions Officer.',
    department: 'Department / Academic Office',
    mandatory: true
  },
  {
    id: 'course_reg',
    category: 'All',
    title: 'Online Course Registration (Min 18 - Max 24 Units)',
    description: 'Select carryovers first, then current semester core and elective courses. Ensure total credit load is between 18 and 24 units.',
    department: 'MIS / ICT Centre',
    mandatory: true
  },
  {
    id: 'four_copies',
    category: 'All',
    title: 'Print 4 Colored Copies of Course Form',
    description: 'Print 4 official colored copies of the registered course form for signing and distribution.',
    department: 'ICT Centre / Cybercafe',
    mandatory: true
  },
  {
    id: 'advisor_sign',
    category: 'All',
    title: 'Course Advisor Signature & Approval',
    description: 'Submit course form to your designated Level/Course Advisor for credit unit validation and signature.',
    department: 'Departmental Office',
    mandatory: true
  },
  {
    id: 'hod_sign',
    category: 'All',
    title: 'Head of Department (HOD) Counter-Sign',
    description: 'Get HOD approval and signature on all 4 copies of the course form.',
    department: 'Head of Department',
    mandatory: true
  },
  {
    id: 'faculty_sign',
    category: 'All',
    title: 'Faculty Officer Endorsement',
    description: 'Submit course forms for faculty records stamp and final endorsement.',
    department: 'Faculty Officer',
    mandatory: true
  },
  {
    id: 'exam_docket',
    category: 'All',
    title: 'Examination Docket Stamping & Clearance',
    description: 'Print examination docket, attach passport, and stamp at the Bursary and Department before CBT/semester exams.',
    department: 'Bursary & Department',
    mandatory: true
  }
];

interface RegistrationChecklistProps {
  studentProfile?: StudentProfile;
  onOpenEscalate?: (prefill?: string) => void;
}

export const RegistrationChecklist: React.FC<RegistrationChecklistProps> = ({
  studentProfile,
  onOpenEscalate
}) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('poly_clearance_checklist');
    return saved ? JSON.parse(saved) : {};
  });
  const [filter, setFilter] = useState<'All' | 'Freshers' | 'Returning'>('All');

  const toggleItem = (id: string) => {
    const updated = { ...completedItems, [id]: !completedItems[id] };
    setCompletedItems(updated);
    localStorage.setItem('poly_clearance_checklist', JSON.stringify(updated));
  };

  const filteredItems = CHECKLIST_ITEMS.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Freshers') return item.category === 'Freshers' || item.category === 'All';
    return item.category === 'Returning' || item.category === 'All';
  });

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <CheckSquare className="w-6 h-6 text-[#3D2317]" />
            <h2 className="text-xl font-bold text-[#2C180E] font-serif">
              Course Registration &amp; Clearance Tracker
            </h2>
          </div>
          <p className="text-xs text-[#5D4037] leading-relaxed max-w-xl">
            Official step-by-step clearance checklist for {studentProfile?.level || 'ND & HND'} students ({studentProfile?.department || 'The Polytechnic, Ibadan'}). Track Remita payment, course unit validation (18-24 units), and physical signature approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenEscalate && (
            <button
              onClick={() => onOpenEscalate('Course Registration & Clearance Issue')}
              className="bg-[#FAF7F2] hover:bg-[#F2ECE5] text-[#3D2317] border border-[#E5DDD3] px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Advising Help</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="shrink-0 bg-[#3D2317] hover:bg-[#2A160D] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Slip</span>
          </button>
        </div>
      </div>

      {/* Progress & Filters */}
      <div className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#6D4C41] uppercase tracking-wider mb-1">
              Clearance Progress: {completedCount} of {CHECKLIST_ITEMS.length} Completed ({progressPercent}%)
            </div>
            <div className="w-full sm:w-64 h-3 bg-[#FAF7F2] border border-[#E5DDD3] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3D2317] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {(['All', 'Freshers', 'Returning'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-[#3D2317] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#5D4037] hover:bg-[#EFE8DE] border border-[#E5DDD3]'
                }`}
              >
                {f} Students
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => {
          const isDone = !!completedItems[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex items-start gap-4 shadow-xs ${
                isDone 
                  ? 'border-[#C69C6D] bg-[#FAF7F2]/60' 
                  : 'border-[#E5DDD3] hover:border-[#C69C6D]'
              }`}
            >
              <div className="pt-0.5 text-[#3D2317]">
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-[#3D2317] fill-[#FAF7F2]" />
                ) : (
                  <Square className="w-6 h-6 text-[#8D6E63]" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className={`font-bold text-sm ${isDone ? 'line-through text-[#6D4C41]' : 'text-[#2C180E]'}`}>
                    {idx + 1}. {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF7F2] text-[#5D4037] border border-[#E5DDD3]">
                      {item.department}
                    </span>
                    {item.mandatory && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Mandatory
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#5D4037] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="bg-[#FAF7F2] border border-[#E5DDD3] rounded-2xl p-4 text-xs text-[#5D4037] space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#3D2317]">
          <ShieldCheck className="w-4 h-4 text-[#C69C6D]" />
          <span>Official Poly Ibadan Regulation Note</span>
        </div>
        <p className="leading-relaxed">
          Course registration deadline is strictly enforced two weeks after resumption. Ensure all four colored copies are duly signed before submitting to your departmental officer. For unit load issues (minimum 18, maximum 24 units), visit your Course Advisor or MIS.
        </p>
      </div>
    </div>
  );
};
