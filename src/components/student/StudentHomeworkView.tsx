import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Homework, HomeworkSubmission } from '../../types';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Paperclip,
  Upload,
  X,
  FileCheck,
  Send,
  AlertCircle,
} from 'lucide-react';

export const StudentHomeworkView: React.FC = () => {
  const { homeworkList, submissions, submitHomework, currentUser } = useSchool();
  const [selectedHw, setSelectedHw] = useState<Homework | null>(null);
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  const studentClass = currentUser.studentDetails?.grade || 'Class 10-A';
  const classHomework = homeworkList.filter((h) => h.classId === studentClass);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;

    submitHomework({
      homeworkId: selectedHw.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRoll: currentUser.studentDetails?.rollNumber || '12',
      notes: notes.trim() || 'Attached completed homework solutions.',
      files: [
        {
          name: `${currentUser.name.replace(/\s+/g, '_')}_${selectedHw.subject}_Solutions.pdf`,
          size: '2.1 MB',
        },
      ],
      status: 'submitted',
    });

    setNotes('');
    setSelectedHw(null);
  };

  const filteredHw = classHomework.filter((hw) => {
    const isSubmitted = submissions.some((s) => s.homeworkId === hw.id && s.studentId === currentUser.id);
    if (filter === 'pending') return !isSubmitted;
    if (filter === 'submitted') return isSubmitted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and filter tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Homework & Digital Assignments
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {studentClass} • Assigned by your subject teachers. Upload scanned PDF solutions for marks.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({classHomework.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'submitted' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Submitted
          </button>
        </div>
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHw.map((hw) => {
          const submission = submissions.find(
            (s) => s.homeworkId === hw.id && s.studentId === currentUser.id
          );

          return (
            <div
              key={hw.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] border border-indigo-500/30">
                    {hw.subject}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Due: {hw.dueDate}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mt-2 mb-1 leading-snug">
                  {hw.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                  {hw.description}
                </p>

                {hw.attachments && hw.attachments.length > 0 && (
                  <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs text-indigo-300 mb-3">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span className="truncate">{hw.attachments[0].name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({hw.attachments[0].size})</span>
                  </div>
                )}
              </div>

              {/* Submission status or submit button */}
              <div className="pt-4 border-t border-slate-800/80">
                {submission ? (
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submitted</span>
                      </span>
                      {submission.status === 'graded' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Marks: {submission.marksObtained}/{hw.maxMarks}
                        </span>
                      ) : (
                        <span className="text-amber-400 text-[11px] font-medium">Under Review</span>
                      )}
                    </div>
                    {submission.feedback && (
                      <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-xl">
                        <strong>Teacher:</strong> {submission.feedback}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedHw(hw)}
                    className="w-full py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload & Submit Assignment</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Submit Assignment: {selectedHw.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedHw.subject} • Max Marks: {selectedHw.maxMarks}
                </p>
              </div>
              <button
                onClick={() => setSelectedHw(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-950/60 cursor-pointer">
                <FileCheck className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="font-semibold text-white">
                  {currentUser.name.replace(/\s+/g, '_')}_{selectedHw.subject}_Solutions.pdf
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ready to upload (2.1 MB • PDF / Scanned image)
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Notes for Subject Teacher (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Respected Ma'am, all problems solved step-by-step in register..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedHw(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Confirm & Turn In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
