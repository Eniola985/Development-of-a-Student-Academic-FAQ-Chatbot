import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Info, 
  Compass, 
  School, 
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { INSTITUTION_INFO, FACULTIES, CAMPUS_OFFICES } from '../data/polyIbadanData';

export const CampusDirectoryView: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<'All' | 'North Campus' | 'South Campus' | 'Middle Campus'>('All');

  const filteredOffices = CAMPUS_OFFICES.filter(office => {
    if (selectedCampus === 'All') return true;
    return office.location.toLowerCase().includes(selectedCampus.toLowerCase().replace(' campus', ''));
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Building2 className="w-5 h-5 text-[#3D2317]" />
          <h2 className="text-lg font-bold text-[#2C180E] font-serif">
            Campus Guide &amp; Directorate Directory
          </h2>
        </div>
        <p className="text-xs text-[#5D4037] leading-relaxed">
          The Polytechnic, Ibadan operates across distinct campus zones located along Sango-Eleyele Road, Ibadan, Oyo State.
        </p>

        {/* Campus Filter */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['All', 'North Campus', 'South Campus', 'Middle Campus'] as const).map(camp => (
            <button
              key={camp}
              onClick={() => setSelectedCampus(camp)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCampus === camp
                  ? 'bg-[#3D2317] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5D4037] hover:bg-[#EFE8DE] border border-[#E5DDD3]'
              }`}
            >
              {camp}
            </button>
          ))}
        </div>
      </div>

      {/* Campus Zones Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INSTITUTION_INFO.campuses.map((camp, idx) => (
          <div key={idx} className="bg-white border border-[#E5DDD3] rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#3D2317] font-bold text-sm">
              <Compass className="w-4 h-4 text-[#C69C6D]" />
              <span>{camp.name}</span>
            </div>
            <div className="text-xs text-[#6D4C41] flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-[#A1887F]" />
              <span>{camp.location}</span>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed pt-1.5 border-t border-[#F0EAE1]">
              {camp.housing}
            </p>
          </div>
        ))}
      </div>

      {/* Campus Directorates & Service Offices */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#3D2317] flex items-center gap-2">
          <School className="w-4 h-4 text-[#4A2E1B]" />
          Key Administrative &amp; Student Service Units
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOffices.map((office, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5DDD3] rounded-2xl p-4 shadow-xs hover:border-[#C69C6D] transition-colors space-y-2"
            >
              <h4 className="font-bold text-sm text-[#2C180E]">
                {office.name}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-[#4A2E1B] font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#C69C6D] shrink-0" />
                <span>{office.location}</span>
              </div>

              <p className="text-xs text-[#5D4037] leading-relaxed">
                {office.role}
              </p>

              <div className="pt-2 border-t border-[#F0EAE1] flex items-center gap-1.5 text-[11px] text-[#8D6E63]">
                <Clock className="w-3 h-3 text-[#A1887F]" />
                <span>{office.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculties Directory */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-[#3D2317] flex items-center gap-2">
          <School className="w-4 h-4 text-[#4A2E1B]" />
          Academic Faculties &amp; Departments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACULTIES.map((fac) => (
            <div key={fac.code} className="bg-white border border-[#E5DDD3] rounded-2xl p-4 shadow-xs space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#2C180E]">{fac.name}</h4>
                  <span className="text-xs text-[#6D4C41]">{fac.campus}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#3D2317] bg-[#FAF7F2] px-2.5 py-0.5 rounded-lg border border-[#E5DDD3]">
                  {fac.code}
                </span>
              </div>

              <div className="text-xs text-[#5D4037]">
                <span className="font-bold text-[#3D2317] block mb-1">Departments:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#5D4037]">
                  {fac.departments.map((dept, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8D6E63] shrink-0"></span>
                      <span className="truncate">{dept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
