import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter, 
  BellRing,
  BookOpenCheck
} from 'lucide-react';
import { ACADEMIC_CALENDAR_EVENTS, INSTITUTION_INFO } from '../data/polyIbadanData';

export const AcademicCalendarView: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<'All' | 'Harmattan (1st)' | 'Rain (2nd)'>('All');

  const filteredEvents = ACADEMIC_CALENDAR_EVENTS.filter(evt => {
    if (selectedSemester === 'All') return true;
    return evt.semester === selectedSemester;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-[#3D2317]" />
            <div>
              <h2 className="text-lg font-bold text-[#2C180E] font-serif">
                2025/2026 Academic Session Calendar
              </h2>
              <p className="text-xs text-[#5D4037]">
                Official calendar approved by The Polytechnic, Ibadan Academic Board
              </p>
            </div>
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl text-xs border border-[#E5DDD3]">
            <button
              onClick={() => setSelectedSemester('All')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                selectedSemester === 'All'
                  ? 'bg-[#3D2317] text-white shadow-xs'
                  : 'text-[#5D4037] hover:text-[#2C180E]'
              }`}
            >
              All Semesters
            </button>
            <button
              onClick={() => setSelectedSemester('Harmattan (1st)')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                selectedSemester === 'Harmattan (1st)'
                  ? 'bg-[#3D2317] text-white shadow-xs'
                  : 'text-[#5D4037] hover:text-[#2C180E]'
              }`}
            >
              Harmattan (1st)
            </button>
            <button
              onClick={() => setSelectedSemester('Rain (2nd)')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                selectedSemester === 'Rain (2nd)'
                  ? 'bg-[#3D2317] text-white shadow-xs'
                  : 'text-[#5D4037] hover:text-[#2C180E]'
              }`}
            >
              Rain (2nd)
            </button>
          </div>
        </div>
      </div>

      {/* Critical Reminders Card */}
      <div className="bg-[#FAF7F2] border border-[#D7CCC8] rounded-2xl p-4 text-xs text-[#4E342E] flex items-start gap-3">
        <BellRing className="w-5 h-5 text-[#C69C6D] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-[#3D2317]">Course Registration &amp; Exam Clearance Reminder</h4>
          <p className="leading-relaxed text-[#5D4037]">
            Late course registration after the published deadline attracts a mandatory late penalty fee. All students must obtain an official <strong className="text-[#3D2317]">Exam Clearance Docket</strong> stamped by their Faculty Officer before the start of Harmattan examinations.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => {
          const isCompleted = evt.status === 'completed';

          return (
            <div
              key={evt.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm ${
                isCompleted ? 'border-[#E5DDD3] opacity-75' : 'border-[#D7CCC8] ring-1 ring-[#D7CCC8]/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#3D2317]">{evt.semester}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[#6D4C41] font-medium">{evt.category}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    {isCompleted ? (
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-[#4A2E1B] font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C69C6D]" />
                        Upcoming
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#2C180E]">
                    {evt.title}
                  </h3>

                  {evt.notes && (
                    <p className="text-xs text-[#6D4C41] leading-relaxed">
                      {evt.notes}
                    </p>
                  )}
                </div>

                {/* Date Display */}
                <div className="sm:text-right shrink-0">
                  <div className="text-xs font-bold text-[#3D2317] font-mono bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E5DDD3] inline-block">
                    {evt.dateStr}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
