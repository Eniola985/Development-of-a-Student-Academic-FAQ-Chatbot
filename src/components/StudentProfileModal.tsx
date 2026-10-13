import React, { useState } from 'react';
import { X, Check, School, UserCircle, Layers, BookCheck } from 'lucide-react';
import { StudentProfile, StudentLevel, StudentProgram } from '../types';
import { FACULTIES } from '../data/polyIbadanData';
import { PolyIbadanLogo } from './PolyIbadanLogo';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [matricNo, setMatricNo] = useState(currentProfile.matricNo);
  const [level, setLevel] = useState<StudentLevel>(currentProfile.level);
  const [program, setProgram] = useState<StudentProgram>(currentProfile.program);
  const [faculty, setFaculty] = useState(currentProfile.faculty);
  const [department, setDepartment] = useState(currentProfile.department);

  if (!isOpen) return null;

  const currentFacultyObj = FACULTIES.find(f => f.name === faculty) || FACULTIES[0];
  const departmentsList = currentFacultyObj.departments;

  const handleFacultyChange = (newFaculty: string) => {
    setFaculty(newFaculty);
    const found = FACULTIES.find(f => f.name === newFaculty);
    if (found && found.departments.length > 0) {
      setDepartment(found.departments[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'Student',
      matricNo: matricNo.trim() || 'Pending Clearance',
      level,
      program,
      faculty,
      department
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E5DDD3] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#3D2317] px-6 py-4 text-white flex items-center justify-between border-b border-[#543322]">
          <div className="flex items-center space-x-3">
            <PolyIbadanLogo size={32} />
            <h3 className="font-bold text-base font-serif">Student Profile &amp; Department</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-[#D7CCC8] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#5D4037] bg-[#FAF7F2] border border-[#E5DDD3] p-3 rounded-xl leading-relaxed">
            Personalizing your student context ensures the AI Chatbot accurately checks your specific faculty guidelines, NBTE course units, SIWES eligibility, and HND prerequisites.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3D2317] mb-1">
                Full Name / Nickname
              </label>
              <div className="relative">
                <UserCircle className="w-4 h-4 absolute left-3 top-2.5 text-[#8D6E63]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Joel Abiodun"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-[#FCFBF9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2317] mb-1">
                Matric / Application No.
              </label>
              <input
                type="text"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                placeholder="e.g. 23/FSC/COM/042"
                className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-[#FCFBF9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3D2317] mb-1">
                Academic Level
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-3 top-2.5 text-[#8D6E63]" />
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as StudentLevel)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-white text-[#3D2317] font-medium"
                >
                  <option value="ND I">National Diploma I (ND I)</option>
                  <option value="ND II">National Diploma II (ND II)</option>
                  <option value="HND I">Higher National Diploma I (HND I)</option>
                  <option value="HND II">Higher National Diploma II (HND II)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2317] mb-1">
                Program Type
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value as StudentProgram)}
                className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-white text-[#3D2317] font-medium"
              >
                <option value="Full-Time">Full-Time (Regular)</option>
                <option value="Daily Part-Time (DPP)">Daily Part-Time (DPP)</option>
                <option value="Part-Time (CEC)">Part-Time (CEC Weekend)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2317] mb-1">
              Faculty
            </label>
            <select
              value={faculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-white text-[#3D2317] font-medium"
            >
              {FACULTIES.map((fac) => (
                <option key={fac.code} value={fac.name}>
                  {fac.name} ({fac.campus})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2317] mb-1">
              Department
            </label>
            <div className="relative">
              <BookCheck className="w-4 h-4 absolute left-3 top-2.5 text-[#8D6E63]" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#3D2317] focus:outline-none bg-white text-[#3D2317] font-medium"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5DDD3] flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D7CCC8] text-[#5D4037] rounded-xl text-sm hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#3D2317] hover:bg-[#2A160D] text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Student Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
