import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Award, Printer, ShieldCheck, CheckCircle2, Star, TrendingUp } from 'lucide-react';

export const StudentReportCard: React.FC = () => {
  const { examReports, currentUser } = useSchool();
  const report = examReports.find((r) => r.studentId === currentUser.id) || examReports[0];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex items-center justify-between">
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
            Academic Year: {report.academicYear} • Term 1 Assessment
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" /> Print Marksheet
        </button>
      </div>

      {/* Official Marksheet Document Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 space-y-6">
        {/* School Header */}
        <div className="text-center border-b border-slate-800 pb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-900 text-amber-400 flex items-center justify-center font-black text-xl shadow mb-2">
            VS
          </div>
          <h3 className="text-lg font-extrabold uppercase text-white tracking-tight">
            Delhi Modern Academy
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Affiliated to CBSE, New Delhi • Senior Secondary Assessment Board
          </p>
          <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            {report.examName}
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
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-300">
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
