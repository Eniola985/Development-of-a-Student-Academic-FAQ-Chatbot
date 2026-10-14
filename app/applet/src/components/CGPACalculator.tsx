import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles,
  BookOpen,
  Printer
} from 'lucide-react';
import { CourseEntry } from '../types';
import { NBTE_GRADING_SCALE, GRADUATION_CLASSIFICATIONS } from '../data/polyIbadanData';

const GRADE_POINTS: Record<string, number> = {
  A: 4.00,
  AB: 3.50,
  B: 3.25,
  BC: 3.00,
  C: 2.75,
  CD: 2.50,
  D: 2.25,
  E: 2.00,
  F: 0.00
};

const DEFAULT_COURSES: CourseEntry[] = [
  { id: 'c-1', code: 'COM 111', title: 'Introduction to Computing', units: 3, grade: 'A' },
  { id: 'c-2', code: 'COM 112', title: 'Digital Computer Fundamentals', units: 3, grade: 'AB' },
  { id: 'c-3', code: 'COM 113', title: 'Introduction to Programming in C', units: 3, grade: 'B' },
  { id: 'c-4', code: 'MTH 111', title: 'Logic and Linear Algebra', units: 2, grade: 'BC' },
  { id: 'c-5', code: 'GNS 101', title: 'Use of English I', units: 2, grade: 'AB' },
  { id: 'c-6', code: 'GNS 111', title: 'Citizenship Education I', units: 2, grade: 'B' },
  { id: 'c-7', code: 'EEC 115', title: 'Electrical Engineering Science I', units: 3, grade: 'C' }
];

export const CGPACalculator: React.FC = () => {
  const [courses, setCourses] = useState<CourseEntry[]>(DEFAULT_COURSES);
  const [prevUnits, setPrevUnits] = useState<number>(0);
  const [prevQualityPoints, setPrevQualityPoints] = useState<number>(0);

  const addCourse = () => {
    const newCourse: CourseEntry = {
      id: `c-${Date.now()}`,
      code: `CRS ${Math.floor(100 + Math.random() * 900)}`,
      title: 'Departmental Course',
      units: 3,
      grade: 'B'
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseEntry, value: any) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const resetCourses = () => {
    setCourses(DEFAULT_COURSES);
    setPrevUnits(0);
    setPrevQualityPoints(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentTotalUnits = courses.reduce((sum, c) => sum + Number(c.units || 0), 0);
  const currentQualityPoints = courses.reduce((sum, c) => {
    const gp = GRADE_POINTS[c.grade] ?? 0;
    return sum + gp * Number(c.units || 0);
  }, 0);

  const currentGPA = currentTotalUnits > 0 ? currentQualityPoints / currentTotalUnits : 0;

  const totalCumulativeUnits = currentTotalUnits + Number(prevUnits || 0);
  const totalCumulativeQualityPoints = currentQualityPoints + Number(prevQualityPoints || 0);
  const cumulativeCGPA = totalCumulativeUnits > 0 ? totalCumulativeQualityPoints / totalCumulativeUnits : currentGPA;

  // Standing determination
  let standing = 'Good Academic Standing';
  let badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (cumulativeCGPA >= 3.50) {
    standing = 'Distinction Level';
    badgeClass = 'bg-amber-50 text-amber-900 border-amber-200';
  } else if (cumulativeCGPA >= 3.00) {
    standing = 'Upper Credit (Deans List Eligible)';
    badgeClass = 'bg-emerald-50 text-emerald-900 border-emerald-200';
  } else if (cumulativeCGPA >= 2.50) {
    standing = 'Lower Credit (Standard Progression)';
    badgeClass = 'bg-blue-50 text-blue-900 border-blue-200';
  } else if (cumulativeCGPA >= 2.00) {
    standing = 'Pass Grade (Minimum Standard)';
    badgeClass = 'bg-yellow-50 text-yellow-900 border-yellow-200';
  } else {
    standing = 'Academic Probation (Below 2.00)';
    badgeClass = 'bg-red-50 text-red-900 border-red-200';
  }

  let advice = 'Your academic progress is solid. Ensure regular lecture attendance and submit all continuous assessment tests on time.';
  if (cumulativeCGPA >= 3.50) {
    advice = 'Exceptional performance! Maintaining this GPA qualifies you for departmental honors and competitive HND postgraduate transitions.';
  } else if (cumulativeCGPA < 2.00) {
    advice = 'Warning: Your CGPA is below the 2.00 NBTE promotion threshold. You are placed on academic probation. Consult your Academic Advisor immediately.';
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title & Info Banner */}
      <div className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#3D2317]" />
            <h2 className="text-lg font-bold text-[#2C180E] font-serif">
              NBTE 4.0 Grading &amp; CGPA Calculator
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs text-white hover:bg-[#2A160D] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#3D2317] transition-colors cursor-pointer font-bold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save Slip
            </button>
            <button
              onClick={resetCourses}
              className="text-xs text-[#5D4037] hover:text-[#2C180E] flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE8DE] border border-[#E5DDD3] transition-colors cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
        <p className="text-xs text-[#5D4037] mt-1.5 leading-relaxed">
          Standardized for The Polytechnic, Ibadan using the National Board for Technical Education (NBTE) 9-point grading scale (A, AB, B, BC, C, CD, D, E, F).
        </p>
      </div>

      {/* Main Grid: Calculator Table + Results Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Course Input Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD3] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[#E5DDD3] flex items-center justify-between bg-[#FAF7F2]/40">
            <h3 className="font-bold text-sm text-[#3D2317]">
              Semester Courses ({courses.length})
            </h3>
            <span className="text-xs text-[#5D4037]">
              Total Units: <strong className="text-[#3D2317]">{currentTotalUnits}</strong> (Approved limit: 18–24)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#3D2317] border-b border-[#E5DDD3] uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 font-bold">Course Code</th>
                  <th className="py-2.5 px-3 font-bold">Course Title</th>
                  <th className="py-2.5 px-2 text-center font-bold">Units</th>
                  <th className="py-2.5 px-2 text-center font-bold">Grade</th>
                  <th className="py-2.5 px-2 text-center font-bold">Points</th>
                  <th className="py-2.5 px-2 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DDD3]">
                {courses.map((course) => {
                  const gp = GRADE_POINTS[course.grade] ?? 0;
                  const pts = gp * Number(course.units || 0);
                  return (
                    <tr key={course.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                          className="w-20 px-2 py-1 font-mono uppercase font-bold border border-[#D7CCC8] rounded text-xs focus:ring-1 focus:ring-[#3D2317] focus:outline-none text-[#3D2317]"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                          className="w-full px-2 py-1 border border-[#D7CCC8] rounded text-xs focus:ring-1 focus:ring-[#3D2317] focus:outline-none text-slate-800"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <select
                          value={course.units}
                          onChange={(e) => updateCourse(course.id, 'units', Number(e.target.value))}
                          className="px-2 py-1 border border-[#D7CCC8] rounded text-xs focus:ring-1 focus:ring-[#3D2317] focus:outline-none bg-white font-semibold text-[#3D2317]"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                          <option value={6}>6</option>
                        </select>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="px-2 py-1 border border-[#D7CCC8] rounded text-xs focus:ring-1 focus:ring-[#3D2317] focus:outline-none bg-white font-bold text-[#3D2317]"
                        >
                          {NBTE_GRADING_SCALE.map((g) => (
                            <option key={g.grade} value={g.grade}>
                              {g.grade} ({g.points.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-[#4A2E1B]">
                        {pts.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="text-[#A1887F] hover:text-[#B71C1C] p-1 rounded transition-colors cursor-pointer"
                          title="Remove Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Course Button */}
          <div className="p-3 bg-[#FAF7F2] border-t border-[#E5DDD3] flex justify-between items-center">
            <button
              onClick={addCourse}
              className="px-3.5 py-1.5 bg-[#3D2317] hover:bg-[#2A160D] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Course
            </button>
            <span className="text-[11px] font-bold text-[#5D4037]">
              Quality Points: {currentQualityPoints.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Column: CGPA Summary & Advice (1 col) */}
        <div className="space-y-4">
          {/* Result Card */}
          <div className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">
                Academic Standing
              </span>
              <Award className="w-5 h-5 text-[#C69C6D]" />
            </div>

            <div className="text-center py-3 bg-[#FAF7F2] rounded-xl border border-[#E5DDD3]">
              <span className="text-xs text-[#5D4037]">Semester GPA</span>
              <div className="text-3xl font-extrabold text-[#3D2317] tracking-tight font-mono">
                {currentGPA.toFixed(2)}
              </div>
              <span className="text-[11px] text-[#8D6E63]">out of 4.00</span>
            </div>

            {/* Standing Banner */}
            <div className={`p-3 rounded-xl border text-center ${badgeClass}`}>
              <div className="text-xs font-bold uppercase tracking-wider">
                {standing}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5">
                NBTE Poly Ibadan Scale
              </div>
            </div>

            {/* Previous Semesters Cumulative */}
            <div className="pt-3 border-t border-[#E5DDD3] space-y-2">
              <span className="text-xs font-bold text-[#3D2317] block">
                Include Previous Semesters (Cumulative):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-[#6D4C41] block mb-0.5">Prev. Units</label>
                  <input
                    type="number"
                    min="0"
                    value={prevUnits || ''}
                    onChange={(e) => setPrevUnits(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full px-2 py-1.5 border border-[#D7CCC8] rounded-lg text-xs focus:ring-1 focus:ring-[#3D2317] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#6D4C41] block mb-0.5">Prev. Quality Points</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={prevQualityPoints || ''}
                    onChange={(e) => setPrevQualityPoints(Math.max(0, Number(e.target.value)))}
                    placeholder="0.00"
                    className="w-full px-2 py-1.5 border border-[#D7CCC8] rounded-lg text-xs focus:ring-1 focus:ring-[#3D2317] focus:outline-none"
                  />
                </div>
              </div>

              {prevUnits > 0 && (
                <div className="mt-2 p-2 bg-[#FAF7F2] rounded-lg text-center border border-[#C69C6D]">
                  <span className="text-[11px] text-[#5D4037]">Cumulative CGPA:</span>
                  <div className="text-xl font-bold font-mono text-[#3D2317]">
                    {cumulativeCGPA.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {/* Advice Box */}
            <div className="text-xs text-[#4A2E1B] bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DDD3] leading-relaxed">
              <div className="font-bold text-[#3D2317] mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C69C6D]" />
                Advisory Insights:
              </div>
              <p>{advice}</p>
            </div>
          </div>

          {/* Reference Scale Table */}
          <div className="bg-white border border-[#E5DDD3] rounded-2xl p-4 shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-[#3D2317] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#4A2E1B]" />
              NBTE Graduation Classes
            </h4>
            <div className="space-y-1 text-[11px]">
              {GRADUATION_CLASSIFICATIONS.map((c, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-[#F0EAE1] last:border-none">
                  <span className="font-medium text-[#4A2E1B]">{c.classification}</span>
                  <span className="font-mono text-[#6D4C41] font-semibold">{c.cgpaRange}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
