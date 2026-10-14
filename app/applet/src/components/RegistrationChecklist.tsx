import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Printer, CheckCircle2, AlertCircle, FileText, UserCheck, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';

interface RegistrationChecklistProps {
  studentProfile: StudentProfile;
}

interface ChecklistItem {
  id: string;
  title: string;
  category: 'fees' | 'academic' | 'medical' | 'signatures' | 'docket';
  description: string;
  departmentalNote?: string;
}

const INITIAL_ITEMS: ChecklistItem[] = [
  {
    id: 'remita',
    title: 'School Fees Remita RRR Generation & Payment',
    category: 'fees',
    description: 'Generate your school fees invoice via the student portal (portal.polyibadan.edu.ng) and make payment via Remita RRR at designated banks or online.',
    departmentalNote: 'Keep your RRR teller and e-receipt secure for clearance verification.'
  },
  {
    id: 'credits',
    title: 'Course Registration & Credit Unit Verification',
    category: 'academic',
    description: 'Ensure registered credit units fall within NBTE approved limits (Minimum 18 units, Maximum 24 units per semester) including core and elective courses.',
    departmentalNote: 'Check with your Course Advisor if you have carryovers to ensure correct prerequisite nesting.'
  },
  {
    id: 'print_forms',
    title: 'Print 4 Colored Copies of Course Form',
    category: 'academic',
    description: 'After online course registration approval, print four (4) official colored copies of your course registration form from the student portal.',
    departmentalNote: 'Copies are distributed to: Course Advisor, HOD office, Faculty Officer, and Student copy.'
  },
  {
    id: 'medical_tiship',
    title: 'Poly Clinic Medical Screening & TISHIP Clearance',
    category: 'medical',
    description: 'Complete mandatory medical screening (X-ray, blood test, genotype) at the Poly Clinic (Middle Campus) and obtain your TISHIP medical card.',
    departmentalNote: 'Compulsory for fresh ND I & HND I students before exam docket issuance.'
  },
  {
    id: 'sign_advisor',
    title: 'Course Advisor Signature & File Opening',
    category: 'signatures',
    description: 'Present your school fees receipt, O\'level certificates, and 4 course form copies to your departmental Course Advisor for physical verification and signature.',
    departmentalNote: 'Course Advisor confirms your prerequisites and attendance eligibility.'
  },
  {
    id: 'sign_hod',
    title: 'Head of Department (HOD) Endorsement',
    category: 'signatures',
    description: 'Get your course forms and departmental file endorsed by your Head of Department (HOD).',
    departmentalNote: 'HOD stamp validates departmental enrollment for the semester.'
  },
  {
    id: 'sign_faculty',
    title: 'Faculty Officer Clearance Stamp',
    category: 'signatures',
    description: 'Proceed to your Faculty Officer (Science, Engineering, FBCS, FFMS, FES) for final faculty documentation and stamp.',
    departmentalNote: 'Faculty stamp is mandatory before semester examination clearance.'
  },
  {
    id: 'exam_docket',
    title: 'Exam Docket Stamping & Clearance',
    category: 'docket',
    description: 'Print your Examination Docket 2 weeks before exams, attach your passport photo, and obtain the final stamp from your HOD and Academic Affairs.',
    departmentalNote: 'No student is allowed into the exam hall without a fully stamped exam docket and ID card.'
  }
];

export const RegistrationChecklist: React.FC<RegistrationChecklistProps> = ({ studentProfile }) => {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('poly_registration_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['remita']; // Default first item checked
  });

  useEffect(() => {
    try {
      localStorage.setItem('poly_registration_checklist', JSON.stringify(completedIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedIds]);

  const toggleItem = (id: string) => {
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((completedIds.length / INITIAL_ITEMS.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3D2317] to-[#543322] text-white rounded-xl p-6 shadow-lg border border-[#68412D]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#C69C6D] text-[#2C180E] text-xs font-bold px-2 py-0.5 rounded">
                Official Clearance Guide
              </span>
              <span className="text-xs text-[#D7CCC8]">The Polytechnic, Ibadan</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              Course Registration & Clearance Checklist
            </h2>
            <p className="text-sm text-[#D7CCC8] mt-1">
              Step-by-step verification protocol for {studentProfile.name} ({studentProfile.department} - {studentProfile.level})
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#3D2317] font-bold px-4 py-2.5 rounded-lg text-sm shadow-md transition-all cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clearance Slip</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#68412D]">
          <div className="flex items-center justify-between text-xs font-medium text-[#D7CCC8] mb-1.5">
            <span>Clearance Progress</span>
            <span className="font-bold text-white">{completedIds.length} of {INITIAL_ITEMS.length} Steps Completed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-[#2C180E] h-3 rounded-full overflow-hidden p-0.5 border border-[#68412D]">
            <div
              className="bg-gradient-to-r from-[#C69C6D] to-[#E0A96D] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5DDD3] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3D2317]" />
            <h3 className="font-serif font-bold text-lg text-[#3D2317]">
              Harmattan / Rain Semester Clearance Workflow
            </h3>
          </div>
          <span className="text-xs bg-[#F5F0EB] text-[#6D4C41] px-2.5 py-1 rounded-full font-medium">
            NBTE & Academic Board Standard
          </span>
        </div>

        <div className="space-y-3">
          {INITIAL_ITEMS.map((item, idx) => {
            const isCompleted = completedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isCompleted
                    ? 'bg-[#FAF7F2] border-[#C69C6D]/40 text-[#4A2E1B]'
                    : 'bg-white border-[#E5DDD3] hover:border-[#C69C6D] text-[#2C180E]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-[#8D6E63] fill-[#C69C6D]/20" />
                  ) : (
                    <Square className="w-6 h-6 text-[#A1887F]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className={`font-semibold text-sm sm:text-base ${isCompleted ? 'line-through text-[#6D4C41]' : 'text-[#3D2317]'}`}>
                      {idx + 1}. {item.title}
                    </h4>
                    <span className="text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#F5F0EB] text-[#5D4037]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5D4037] mt-1">
                    {item.description}
                  </p>
                  {item.departmentalNote && (
                    <div className="mt-2 text-xs bg-white/80 p-2 rounded border border-[#E5DDD3] text-[#6D4C41] flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#C69C6D] shrink-0 mt-0.5" />
                      <span><strong>Advisory Note:</strong> {item.departmentalNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#E5DDD3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6D4C41]">
            * Completed steps are saved automatically on your browser for your convenience.
          </p>
          <button
            onClick={() => setCompletedIds(INITIAL_ITEMS.map(i => i.id))}
            className="text-xs font-bold text-[#3D2317] hover:underline cursor-pointer"
          >
            Mark All Steps as Completed
          </button>
        </div>
      </div>
    </div>
  );
};
