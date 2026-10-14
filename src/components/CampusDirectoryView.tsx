import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Info, 
  Compass, 
  School, 
  CheckCircle2,
  Navigation,
  Search,
  Bus,
  Footprints,
  Home,
  ShieldAlert,
  ArrowRight,
  ShoppingBag,
  Utensils,
  Landmark,
  BookOpen
} from 'lucide-react';
import { INSTITUTION_INFO, FACULTIES, CAMPUS_OFFICES, BOOK_LOCATIONS, CAMPUS_FACILITIES } from '../data/polyIbadanData';


const CAMPUS_HOSTELS = [
  {
    name: 'Unity Hall',
    location: 'North Campus (near Sports Pavilion)',
    gender: 'Male Students (ND & HND)',
    features: 'Study rooms, cafeteria, proximity to Science & Engineering faculties'
  },
  {
    name: 'Ramat Hall',
    location: 'South Campus (near Apete Gate)',
    gender: 'Female Students (ND & HND)',
    features: 'High security perimeter, common room, close to FBCS and FFMS'
  },
  {
    name: 'Olori Hall',
    location: 'North Campus residential perimeter',
    gender: 'Female Freshers & Finalists',
    features: 'Quiet study environment, water points, power backup'
  }
];

export const CampusDirectoryView: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<'All' | 'North Campus' | 'South Campus' | 'Middle Campus'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOffices = CAMPUS_OFFICES.filter(office => {
    const matchesCampus = selectedCampus === 'All' || office.location.toLowerCase().includes(selectedCampus.toLowerCase().replace(' campus', ''));
    const matchesSearch = !searchQuery.trim() || 
      office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCampus && matchesSearch;
  });

  const filteredFaculties = FACULTIES.filter(fac => {
    const matchesCampus = selectedCampus === 'All' || fac.campus.toLowerCase().includes(selectedCampus.toLowerCase());
    const matchesSearch = !searchQuery.trim() ||
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCampus && matchesSearch;
  });

  const filteredBooks = BOOK_LOCATIONS.filter(book => {
    const matchesCampus = selectedCampus === 'All' || book.campus.toLowerCase().includes(selectedCampus.toLowerCase().replace(' campus', ''));
    const matchesSearch = !searchQuery.trim() ||
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.itemsAvailable.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCampus && matchesSearch;
  });


  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Intro Header & Search */}
      <div className="bg-white border border-[#E5DDD3] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Building2 className="w-6 h-6 text-[#3D2317]" />
              <h2 className="text-xl font-bold text-[#2C180E] font-serif">
                Interactive Poly Ibadan Campus Navigator &amp; Directory
              </h2>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed max-w-2xl">
              Wayfinding guide for faculties, administrative directorates, student hostels, and transit routes between North Campus, Middle Campus, and South Campus along the Sango-Eleyele corridor.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty, office, clinic..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl text-xs text-[#2C180E] placeholder-[#8D6E63] focus:outline-none focus:ring-2 focus:ring-[#3D2317]"
            />
          </div>
        </div>

        {/* Campus Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-[#F0EAE1]">
          <span className="text-[11px] font-bold text-[#6D4C41] uppercase tracking-wider mr-1">
            Zone:
          </span>
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

      {/* Transit Navigator: North Campus ↔ South Campus */}
      <div className="bg-white border-2 border-[#C69C6D]/40 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#3D2317]">
          <Navigation className="w-5 h-5 text-[#C69C6D]" />
          <h3 className="font-serif font-bold text-base text-[#2C180E]">
            How to Transit Between North Campus &amp; South Campus
          </h3>
        </div>
        <p className="text-xs text-[#5D4037] leading-relaxed">
          The Polytechnic, Ibadan has two primary academic complexes connected via Middle Campus. Follow these options for quick and safe commuting between lectures:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Option 1: Campus Shuttle */}
          <div className="bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3D2317]">
              <Bus className="w-4 h-4 text-[#C69C6D]" />
              <span>Campus Shuttle Bus</span>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed">
              Board at <strong>North Campus Central Park</strong> (by Faculty of Engineering) or <strong>South Campus Park</strong> (by FBCS). 
            </p>
            <div className="text-[11px] font-bold text-[#8D6E63] pt-1">
              • Fare: ~₦100 · Duration: 5–7 mins
            </div>
          </div>

          {/* Option 2: Tricycle (Keke Napep) */}
          <div className="bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3D2317]">
              <Compass className="w-4 h-4 text-[#C69C6D]" />
              <span>Intra-Campus Tricycles</span>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed">
              Operate continuously connecting <strong>Main Sango Gate</strong>, Middle Campus (Central Library / Poly Clinic), and South Campus (Apete Gate).
            </p>
            <div className="text-[11px] font-bold text-[#8D6E63] pt-1">
              • Continuous boarding along main route
            </div>
          </div>

          {/* Option 3: Walking Route */}
          <div className="bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3D2317]">
              <Footprints className="w-4 h-4 text-[#C69C6D]" />
              <span>Pedestrian Paved Walkway</span>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed">
              A scenic 10–12 minute walk via Middle Campus past the Central Administrative block, Poly Clinic, and Central Library.
            </p>
            <div className="text-[11px] font-bold text-[#8D6E63] pt-1">
              • Safe, shaded student sidewalks
            </div>
          </div>
        </div>
      </div>

      {/* Campus Zones Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INSTITUTION_INFO.campuses.map((camp, idx) => (
          <div key={idx} className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#3D2317] font-bold text-sm">
              <Compass className="w-4 h-4 text-[#C69C6D]" />
              <span>{camp.name}</span>
            </div>
            <div className="text-xs text-[#6D4C41] flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#A1887F]" />
              <span>{camp.location}</span>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed pt-2 border-t border-[#F0EAE1]">
              {camp.housing}
            </p>
          </div>
        ))}
      </div>

      {/* Student Hostels */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#3D2317] flex items-center gap-2">
          <Home className="w-4 h-4 text-[#4A2E1B]" />
          Student Halls of Residence (Hostels)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAMPUS_HOSTELS.map((hostel, idx) => (
            <div key={idx} className="bg-white border border-[#E5DDD3] rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-sm text-[#2C180E]">{hostel.name}</h4>
                <span className="text-[10px] font-bold text-[#3D2317] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5DDD3]">
                  {hostel.gender}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#6D4C41]">
                <MapPin className="w-3 h-3 text-[#A1887F]" />
                <span>{hostel.location}</span>
              </div>
              <p className="text-xs text-[#5D4037] leading-relaxed pt-1.5 border-t border-[#F0EAE1]">
                {hostel.features}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Administrative & Service Offices */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#3D2317] flex items-center gap-2">
          <School className="w-4 h-4 text-[#4A2E1B]" />
          Key Administrative &amp; Student Service Units ({filteredOffices.length})
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
          Academic Faculties &amp; Departments ({filteredFaculties.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFaculties.map((fac) => (
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

      {/* Bookstores, Course Manuals & Academic Supplies Section */}
      <div className="space-y-3 pt-4 border-t border-[#E5DDD3]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#3D2317] font-serif flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C69C6D]" />
              Where to Purchase Books, Course Manuals &amp; Supplies ({filteredBooks.length})
            </h3>
            <p className="text-xs text-[#6D4C41]">
              Designated institutional bookshops, departmental secretariats, and commercial printing hubs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBooks.map((book, idx) => (
            <div key={idx} className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-[#2C180E] leading-snug">{book.name}</h4>
                  <span className="text-[10px] font-bold text-[#3D2317] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5DDD3] shrink-0">
                    {book.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#5D4037] mb-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C69C6D] shrink-0" />
                  <span><strong>{book.campus}:</strong> {book.location}</span>
                </div>

                <div className="space-y-1.5 text-xs text-[#4E342E] bg-[#FCFBF9] p-3 rounded-xl border border-[#F0EAE1]">
                  <span className="font-bold text-[#3D2317] block text-[11px] uppercase tracking-wide">
                    Available Academic Items:
                  </span>
                  <ul className="space-y-1 text-[11px]">
                    {book.itemsAvailable.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#3D2317] shrink-0 mt-1.5"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0EAE1] text-[11px] text-[#6D4C41] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#C69C6D] shrink-0" />
                <span className="italic">{book.tips}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Essential Facilities (Food, Banks, Lecture Halls) */}
      <div className="space-y-3 pt-4 border-t border-[#E5DDD3]">
        <h3 className="text-base font-bold text-[#3D2317] font-serif flex items-center gap-2">
          <Utensils className="w-4 h-4 text-[#C69C6D]" />
          Campus Essential Facilities (Food, Banking &amp; Halls)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAMPUS_FACILITIES.map((cat, catIdx) => (
            <div key={catIdx} className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-[#2C180E] border-b border-[#F0EAE1] pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3D2317]"></span>
                {cat.category}
              </h4>
              <ul className="space-y-2.5 text-xs text-[#5D4037]">
                {cat.facilities.map((fac, fIdx) => (
                  <li key={fIdx} className="space-y-0.5">
                    <div className="font-semibold text-[#2C180E]">{fac.name}</div>
                    <div className="text-[11px] text-[#8D6E63] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C69C6D]" />
                      <span>{fac.location}</span>
                    </div>
                    <p className="text-[11px] text-[#4E342E] italic">{fac.notes}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

