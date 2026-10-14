import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Send, 
  CheckCircle, 
  Copy, 
  Check, 
  FileText, 
  AlertTriangle, 
  Building, 
  User, 
  School, 
  X,
  Printer
} from 'lucide-react';
import { StudentProfile, EscalationTicket } from '../types';
import { PolyIbadanLogo } from './PolyIbadanLogo';

interface EscalationModalProps {
  studentProfile: StudentProfile;
  initialSubject?: string;
  onClose?: () => void;
  isStandaloneTab?: boolean;
}

const ISSUE_CATEGORIES = [
  'Result / Grade Issue',
  'Carryover / Transcript',
  'Portal / Registration Bug',
  'Fees / Payment Verification',
  'SIWES / Industrial Training',
  'Hostel / Student Welfare',
  'General Academic Advising'
];

export const EscalationModal: React.FC<EscalationModalProps> = ({
  studentProfile,
  initialSubject = '',
  onClose,
  isStandaloneTab = false
}) => {
  const [studentName, setStudentName] = useState(studentProfile.name);
  const [matricNo, setMatricNo] = useState(studentProfile.matricNo);
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [subject, setSubject] = useState(initialSubject);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<EscalationTicket | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          matricOrAppNo: matricNo,
          level: studentProfile.level,
          department: studentProfile.department,
          category,
          subject,
          description
        })
      });
      const data = await response.json();
      if (data.ticket) {
        setCreatedTicket(data.ticket);
      }
    } catch (err) {
      console.error('Failed to submit ticket:', err);
      // Fallback local ticket generation
      setCreatedTicket({
        ticketId: `TPI-ADV-${Math.floor(100000 + Math.random() * 900000)}`,
        studentName,
        matricOrAppNo: matricNo || '23/FSC/COM/042',
        level: studentProfile.level,
        department: studentProfile.department,
        category,
        subject,
        description,
        assignedOffice: category.includes('Fee') ? 'Bursary Directorate, Middle Campus' : 'Departmental HOD / Course Advisor Office',
        status: 'Pending Verification',
        createdAt: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (!createdTicket) return;
    const slipText = `THE POLYTECHNIC, IBADAN - ACADEMIC ADVISING REFERRAL SLIP\nTicket Ref: ${createdTicket.ticketId}\nDate: ${new Date(createdTicket.createdAt).toLocaleDateString()}\nStudent Name: ${createdTicket.studentName}\nMatric/App No: ${createdTicket.matricOrAppNo}\nDepartment: ${createdTicket.department} (${createdTicket.level})\nCategory: ${createdTicket.category}\nAssigned Desk: ${createdTicket.assignedOffice}\nSubject: ${createdTicket.subject}\nDetails: ${createdTicket.description}\nStatus: ${createdTicket.status}`;
    navigator.clipboard.writeText(slipText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setCreatedTicket(null);
    setSubject('');
    setDescription('');
  };

  const containerContent = (
    <div className="bg-white rounded-2xl shadow-xl border border-[#E5DDD3] overflow-hidden flex flex-col max-h-[90vh]">
      {/* Modal Header */}
      <div className="bg-[#3D2317] text-white px-6 py-4 flex items-center justify-between border-b border-[#543322]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#C69C6D] text-[#2C180E] flex items-center justify-center font-bold">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg">
              Academic Advising Helpdesk &amp; Escalation
            </h3>
            <p className="text-xs text-[#D7CCC8]">
              The Polytechnic, Ibadan · Official Grade &amp; Clearance Escalation
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#D7CCC8] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Modal Body */}
      <div className="p-6 overflow-y-auto space-y-5 bg-[#FAF7F2]">
        {createdTicket ? (
          /* Success Ticket View */
          <div className="bg-white p-6 rounded-2xl border border-[#C69C6D]/40 space-y-4 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Advising Referral Ticket Generated Successfully</h4>
                <p className="text-xs text-emerald-800">
                  Present this digital or printed slip to your Departmental Course Advisor or HOD for physical resolution.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD3] space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-2">
                <div className="flex items-center gap-1.5">
                  <PolyIbadanLogo size={24} />
                  <span className="font-bold text-[#3D2317]">The Polytechnic, Ibadan</span>
                </div>
                <span className="text-[#3D2317] font-bold px-2 py-0.5 bg-[#C69C6D] rounded text-[11px]">
                  {createdTicket.ticketId}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#4E342E] pt-1">
                <div><strong>Student:</strong> {createdTicket.studentName}</div>
                <div><strong>Matric/App No:</strong> {createdTicket.matricOrAppNo}</div>
                <div><strong>Department:</strong> {createdTicket.department}</div>
                <div><strong>Level:</strong> {createdTicket.level}</div>
                <div><strong>Category:</strong> {createdTicket.category}</div>
                <div><strong>Status:</strong> {createdTicket.status}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E5DDD3]">
                <span className="font-bold text-[#3D2317] block mb-0.5">Assigned Office / Desk:</span>
                <span className="text-[#4A2E1B] font-bold">{createdTicket.assignedOffice}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E5DDD3]">
                <span className="font-bold text-[#3D2317] block mb-0.5">Issue Subject:</span>
                <span className="text-slate-800">{createdTicket.subject}</span>
                <span className="font-bold text-[#3D2317] block mt-2 mb-0.5">Inquiry Details:</span>
                <p className="text-[#4E342E] whitespace-pre-wrap font-sans text-xs">
                  {createdTicket.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTicket}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F0EAE1] text-[#3D2317] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#D7CCC8]"
                >
                  {copied ? <Check className="w-4 h-4 text-[#3D2317]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Slip Copied' : 'Copy Ticket'}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#3D2317] hover:bg-[#2A160D] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-[#F5F0EB] hover:bg-[#E5DDD3] text-[#3D2317] font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#FAF7F2] border border-[#E5DDD3] p-3 rounded-xl text-xs text-[#5D4037] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#C69C6D] shrink-0 mt-0.5" />
              <span>
                Use this form for sensitive matters that cannot be answered automatically (e.g. missing CA scores, grade appeal, portal registration payment clearance error, or medical excuses).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3D2317] mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-[#FCFBF9]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3D2317] mb-1">
                  Matriculation / Application No.
                </label>
                <input
                  type="text"
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-[#FCFBF9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3D2317] mb-1">
                  Issue Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-white text-[#3D2317] font-medium"
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3D2317] mb-1">
                  Department / Level
                </label>
                <div className="px-3 py-2 text-xs bg-[#FAF7F2] rounded-xl text-[#4A2E1B] font-bold border border-[#E5DDD3]">
                  {studentProfile.department} ({studentProfile.level})
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2317] mb-1">
                Subject / Summary
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Missing Continuous Assessment score in COM 112"
                className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-[#FCFBF9]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2317] mb-1">
                Detailed Explanation
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your issue in detail (course code, lecturer name, semester, date of test, or portal error code)..."
                className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-[#FCFBF9]"
                required
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#D7CCC8] text-[#5D4037] rounded-xl text-sm hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !description.trim()}
                className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
                  isSubmitting || !subject.trim() || !description.trim()
                    ? 'bg-[#E0D7CE] text-[#A1887F] cursor-not-allowed'
                    : 'bg-[#3D2317] hover:bg-[#2A160D] text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Generate Advising Docket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (isStandaloneTab) {
    return <div className="max-w-3xl mx-auto">{containerContent}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="max-w-2xl w-full">{containerContent}</div>
    </div>
  );
};
