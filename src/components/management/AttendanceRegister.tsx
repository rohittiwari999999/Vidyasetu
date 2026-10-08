import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SAMPLE_STUDENTS_CLASS_10A, INDIAN_CLASSES } from '../../data/mockData';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Users,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const AttendanceRegister: React.FC = () => {
  const { attendanceMap, updateAttendance, saveBulkAttendance, currentUser } = useSchool();
  const [selectedClass, setSelectedClass] = useState(() => currentUser.teacherDetails?.assignedClass || 'Class 10-A');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Keep selectedClass updated if currentUser changes to another class teacher
  React.useEffect(() => {
    if (currentUser.teacherDetails?.assignedClass) {
      setSelectedClass(currentUser.teacherDetails.assignedClass);
    }
  }, [currentUser]);

  const students = SAMPLE_STUDENTS_CLASS_10A;
  const total = students.length;
  const presentCount = students.filter((s) => (attendanceMap[s.id] || 'present') === 'present').length;
  const absentCount = students.filter((s) => attendanceMap[s.id] === 'absent').length;
  const lateCount = students.filter((s) => attendanceMap[s.id] === 'late').length;
  const leaveCount = students.filter((s) => attendanceMap[s.id] === 'leave').length;
  const presentPct = Math.round((presentCount / total) * 100);

  const handleMarkAllPresent = () => {
    students.forEach((s) => {
      updateAttendance(s.id, 'present');
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Digital Attendance Register
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>Class Teacher Daily Roll Call • Synced to Student/Parent App & Cloud Firestore in Realtime</span>
              {currentUser.teacherDetails?.assignedClass && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
                  CT In-Charge: {currentUser.name} ({currentUser.teacherDetails.assignedClass})
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              {INDIAN_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark All Present</span>
            </button>

            <button
              onClick={saveBulkAttendance}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save & Notify Absentees</span>
            </button>
          </div>
        </div>

        {/* Live Attendance Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Present</p>
              <p className="text-lg font-bold text-white">
                {presentCount} <span className="text-xs font-normal text-slate-400">({presentPct}%)</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Absent</p>
              <p className="text-lg font-bold text-rose-300">{absentCount}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Late Coming</p>
              <p className="text-lg font-bold text-amber-300">{lateCount}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Approved Leave</p>
              <p className="text-lg font-bold text-blue-300">{leaveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Register Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              Class Roster — {selectedClass} ({students.length} Enrolled)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Date: {date}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((student) => {
                const currentStatus = attendanceMap[student.id] || 'present';
                return (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                      #{student.rollNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-[11px] shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <span>{student.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide border ${
                          currentStatus === 'present'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : currentStatus === 'absent'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : currentStatus === 'late'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => updateAttendance(student.id, 'present')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:text-emerald-400'
                          }`}
                          title="Mark Present"
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => updateAttendance(student.id, 'absent')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-400 hover:text-rose-400'
                          }`}
                          title="Mark Absent"
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => updateAttendance(student.id, 'late')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-slate-950'
                              : 'text-slate-400 hover:text-amber-400'
                          }`}
                          title="Mark Late"
                        >
                          L
                        </button>
                        <button
                          type="button"
                          onClick={() => updateAttendance(student.id, 'leave')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                            currentStatus === 'leave'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-blue-400'
                          }`}
                          title="Mark Authorized Leave"
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
