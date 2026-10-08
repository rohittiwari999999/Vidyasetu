import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Award,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Star,
  Calendar,
  Clock,
  MapPin,
  Video,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const StudentReportCard: React.FC = () => {
  const { examReports, ptmMeetings, currentUser } = useSchool();
  const [selectedTerm, setSelectedTerm] = useState('Term 1 Examination');

  const report =
    examReports.find((r) => r.studentId === currentUser.id) ||
    examReports[0];

  // Find user's PTM slot
  const userPtm = ptmMeetings.find((m) =>
    m.slots.some((s) => s.studentId === currentUser.id)
  ) || ptmMeetings[0];

  const userSlot = userPtm?.slots.find((s) => s.studentId === currentUser.id) || userPtm?.slots[0];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              CBSE Digital Report Card & Marksheet
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Academic Year: {report.academicYear} • Continuous & Comprehensive Evaluation (CCE)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Term 1 Examination">Term 1 Examination</option>
            <option value="Periodic Test 1">Periodic Test 1 (PT-1)</option>
            <option value="Half-Yearly Exam">Half-Yearly Examination</option>
          </select>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* PTM Consultation Slot Card for Parent */}
      {userPtm && userSlot && (
        <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 md:p-6 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Parent-Teacher Meeting (PTM) Appointment
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{userPtm.title}</h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: {userSlot.attendanceStatus.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Allotted Time Slot</span>
                <span className="font-mono font-bold text-white">{userSlot.slotTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              {userPtm.meetingMode === 'online' ? (
                <Video className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="text-[10px] text-slate-400 block">Venue / Mode</span>
                <span className="font-bold text-white">{userPtm.venue}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Scheduled Date</span>
                <span className="font-bold text-white">{userPtm.scheduledDate}</span>
              </div>
            </div>
          </div>

          {userSlot.teacherFeedback && (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-indigo-500/20 text-xs space-y-1">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-[11px]">
                <MessageSquare className="w-3.5 h-3.5" />
                Class Teacher PTM Feedback:
              </span>
              <p className="text-slate-200 italic">"{userSlot.teacherFeedback}"</p>
              {userSlot.actionItems && (
                <p className="text-emerald-400 text-[11px] pt-1">
                  <strong>Action Plan:</strong> {userSlot.actionItems}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Official Marksheet Document Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 space-y-6">
        {/* School Header */}
        <div className="text-center border-b border-slate-800 pb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-900 text-amber-400 flex items-center justify-center font-black text-xl shadow mb-2 border border-indigo-700/50">
            VS
          </div>
          <h3 className="text-lg font-extrabold uppercase text-white tracking-tight">
            Delhi Modern Academy
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Affiliated to CBSE, New Delhi • Senior Secondary Assessment Board
          </p>
          <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            {selectedTerm}
          </div>
        </div>

        {/* Student Meta Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Student Name:</span>
            <p className="font-bold text-white">{currentUser.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Class & Section:</span>
            <p className="font-bold text-indigo-300">{report.classId}</p>
          </div>
          <div>
            <span className="text-slate-400">Roll Number:</span>
            <p className="font-bold font-mono text-white">#{report.rollNo}</p>
          </div>
          <div>
            <span className="text-slate-400">Class Rank:</span>
            <p className="font-bold text-amber-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Rank #{report.rankInClass}
            </p>
          </div>
        </div>

        {/* Subject Scorecard Table */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4 text-center">Max Marks</th>
                <th className="py-3 px-4 text-center">Marks Obtained</th>
                <th className="py-3 px-4 text-center">CBSE Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {report.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-4 font-medium text-white">{sub.name}</td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-400">{sub.maxMarks}</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-cyan-300">
                    {sub.marksObtained}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {sub.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-800">
              <tr>
                <td className="py-3 px-4 text-white font-extrabold">AGGREGATE TOTAL</td>
                <td className="py-3 px-4 text-center font-mono text-slate-400">{report.totalMarks}</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-400 font-extrabold text-sm">
                  {report.obtainedMarks} ({report.percentage}%)
                </td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">
                  {report.overallGrade}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Remarks & Signatures */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-3">
          <div>
            <span className="font-bold text-slate-300">Class Teacher Remarks:</span>
            <p className="text-slate-400 mt-1 italic leading-relaxed">
              "{report.teacherRemarks}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Certified Digitally via VidyaSetu CBSE Portal</span>
            </div>
            <div>
              <span>Class Teacher: <strong>Mrs. Meenakshi Sharma</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
