import React from 'react';
import { TIMETABLE_CLASS_10A } from '../../data/mockData';
import { useSchool } from '../../context/SchoolContext';
import { Clock, BookOpen, User, MapPin } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const { currentUser } = useSchool();

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Class Daily Routine & Timetable
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.studentDetails?.grade || 'Class 10-A'} • 8 Periods Routine with Lab Slots
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TIMETABLE_CLASS_10A.map((slot) => {
          const isRecess = slot.period === 4;
          return (
            <div
              key={slot.period}
              className={`p-4 rounded-2xl border transition ${
                isRecess
                  ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-indigo-300">
                  {isRecess ? 'RECESS' : `PERIOD ${slot.period}`}
                </span>
                <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {slot.time}
                </span>
              </div>

              <h4 className="font-bold text-sm mb-1">{slot.subject}</h4>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {slot.teacher}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {slot.room}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
