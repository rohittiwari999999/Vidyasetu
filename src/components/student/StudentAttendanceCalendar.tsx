import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StudentAttendanceCalendar: React.FC = () => {
  const { currentUser } = useSchool();

  // Days in October 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Simulated status for Aarav Sharma in Oct 2026
  const getDayStatus = (day: number) => {
    // Sundays: 4, 11, 18, 25
    if ([4, 11, 18, 25].includes(day)) return 'sunday';
    // Deepawali break: 19 to 24
    if (day >= 19 && day <= 24) return 'holiday';
    // Gandhi Jayanti: 2
    if (day === 2) return 'holiday';
    // Absent on 1 day
    if (day === 7) return 'absent';
    // Late on 1 day
    if (day === 14) return 'late';
    // Future days past day 4
    if (day > 4 && day !== 7 && day !== 14) return 'upcoming';
    return 'present';
  };

  const totalWorking = 22;
  const presentCount = 21;
  const attendancePercentage = 95.5;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Monthly Attendance Tracker
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              October 2026 Academic Session • {currentUser.studentDetails?.grade || 'Class 10-A'} (Roll #{currentUser.studentDetails?.rollNumber || '12'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Cumulative Rate</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {attendancePercentage}%
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Present (P)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Absent (A)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Late (L)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Holiday / Autumn Break (H)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span>Sunday</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <h3 className="font-bold text-white text-base mb-4">October 2026</h3>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div className="text-rose-400">Sun</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Oct 1 2026 starts on Thursday -> 3 empty padding cells */}
          <div className="p-3 rounded-xl bg-slate-950/20 opacity-30" />
          <div className="p-3 rounded-xl bg-slate-950/20 opacity-30" />
          <div className="p-3 rounded-xl bg-slate-950/20 opacity-30" />

          {daysInMonth.map((day) => {
            const status = getDayStatus(day);
            return (
              <div
                key={day}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-between min-h-[64px] border transition ${
                  status === 'present'
                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                    : status === 'absent'
                    ? 'bg-rose-950/40 border-rose-800/50 text-rose-300 ring-1 ring-rose-500/50'
                    : status === 'late'
                    ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                    : status === 'holiday'
                    ? 'bg-blue-950/30 border-blue-800/40 text-blue-300'
                    : status === 'sunday'
                    ? 'bg-slate-950 border-slate-800 text-slate-500'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                }`}
              >
                <span className="font-mono text-xs font-bold">{day}</span>
                <span className="font-extrabold text-[11px] uppercase">
                  {status === 'present' && 'P'}
                  {status === 'absent' && 'A'}
                  {status === 'late' && 'L'}
                  {status === 'holiday' && 'H'}
                  {status === 'sunday' && 'SUN'}
                  {status === 'upcoming' && '—'}
                </span>
              </div>
            );
          })}
        </div>

        {/* CBSE Requirement Card */}
        <div className="mt-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">CBSE Board Exam Eligibility Rule 14.1</span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              As per CBSE bylaws, students must maintain a minimum of <strong>75% attendance</strong> across all school terms to be eligible for the issuance of the Class 10/12 Board Admit Card. Aarav's attendance is safely at <strong>{attendancePercentage}%</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
