import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Homework, HomeworkSubmission } from '../../types';
import { INDIAN_CLASSES } from '../../data/mockData';
import {
  BookOpen,
  Plus,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Paperclip,
  Award,
  Send,
  X,
  ChevronRight,
} from 'lucide-react';

export const HomeworkManager: React.FC = () => {
  const { homeworkList, submissions, addHomework, gradeSubmission, currentUser } = useSchool();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHwForSubmissions, setSelectedHwForSubmissions] = useState<Homework | null>(null);

  // Create form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [classId, setClassId] = useState(currentUser.teacherDetails?.assignedClass || 'Class 10-A');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState('');
  const [maxMarks, setMaxMarks] = useState(25);
  const [hasAttachment, setHasAttachment] = useState(true);

  // Grade form state
  const [gradingSub, setGradingSub] = useState<HomeworkSubmission | null>(null);
  const [marks, setMarks] = useState(24);
  const [feedback, setFeedback] = useState('Well presented solutions with clear steps.');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addHomework({
      title: title.trim(),
      description: description.trim(),
      classId,
      subject,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      dueDate,
      maxMarks: Number(maxMarks),
      attachments: hasAttachment
        ? [
            {
              name: `${subject}_Class10_Assignment_Set.pdf`,
              url: '#',
              size: '1.2 MB',
              type: 'application/pdf',
            },
          ]
        : [],
    });

    setTitle('');
    setDescription('');
    setShowCreateModal(false);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;
    gradeSubmission(gradingSub.id, Number(marks), feedback);
    setGradingSub(null);
  };

  const currentClassHw = homeworkList.filter(
    (h) => !currentUser.teacherDetails?.assignedClass || h.classId === currentUser.teacherDetails.assignedClass
  );

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Class Teacher Homework Assignment Module
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish daily homework, assignments, and study worksheets. Review and grade student PDF submissions in realtime.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Homework</span>
        </button>
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentClassHw.map((hw) => {
          const hwSubmissions = submissions.filter((s) => s.homeworkId === hw.id);
          const gradedCount = hwSubmissions.filter((s) => s.status === 'graded').length;

          return (
            <div
              key={hw.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-bold text-[11px] border border-blue-500/20">
                    {hw.subject} • {hw.classId}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Due: {hw.dueDate}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mt-2 mb-1.5 leading-snug">
                  {hw.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                  {hw.description}
                </p>

                {hw.attachments && hw.attachments.length > 0 && (
                  <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 mb-3">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate">{hw.attachments[0].name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({hw.attachments[0].size})</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    Submissions: <strong className="text-white">{hwSubmissions.length}</strong>
                  </span>
                  {gradedCount > 0 && (
                    <span className="text-emerald-400 font-medium">
                      ✓ {gradedCount} Graded
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedHwForSubmissions(hw)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold text-xs transition flex items-center gap-1"
                >
                  <span>Review & Grade</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submissions Drawer / Modal */}
      {selectedHwForSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div>
                <h3 className="font-bold text-white text-base">
                  Submissions for: {selectedHwForSubmissions.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedHwForSubmissions.classId} • Subject: {selectedHwForSubmissions.subject} • Max Marks: {selectedHwForSubmissions.maxMarks}
                </p>
              </div>
              <button
                onClick={() => setSelectedHwForSubmissions(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {submissions.filter((s) => s.homeworkId === selectedHwForSubmissions.id).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No submissions uploaded yet for this assignment.
                </div>
              ) : (
                submissions
                  .filter((s) => s.homeworkId === selectedHwForSubmissions.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <span className="font-mono text-indigo-400">Roll #{sub.studentRoll}</span>
                          <span>{sub.studentName}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                            sub.status === 'graded'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {sub.status === 'graded' ? `Graded: ${sub.marksObtained}/${selectedHwForSubmissions.maxMarks}` : 'Pending Evaluation'}
                        </span>
                      </div>

                      <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                        {sub.notes}
                      </p>

                      {sub.files && sub.files.length > 0 && (
                        <div className="flex items-center gap-2 text-indigo-300">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{sub.files[0].name} ({sub.files[0].size})</span>
                        </div>
                      )}

                      {sub.feedback && (
                        <div className="bg-emerald-950/30 border border-emerald-900/40 p-2 rounded-xl text-emerald-300">
                          <strong>Teacher Feedback:</strong> {sub.feedback}
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setGradingSub(sub);
                            setMarks(sub.marksObtained || selectedHwForSubmissions.maxMarks - 1);
                            setFeedback(sub.feedback || 'Good work!');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                        >
                          {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grade modal */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-1">
              Grade Submission: {gradingSub.studentName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">Roll No. #{gradingSub.studentRoll}</p>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Marks Awarded (Max 25)
                </label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Teacher Remarks & Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
                >
                  Save Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Homework Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Assign New Homework / Task</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Class</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {INDIAN_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Quadratic Equations NCERT Ex 4.2"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Instructions / Problem List</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention questions, submission format, and expectations..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="attachFile"
                  checked={hasAttachment}
                  onChange={(e) => setHasAttachment(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                />
                <label htmlFor="attachFile" className="text-slate-300 cursor-pointer">
                  Attach CBSE Practice Worksheet PDF (Simulated Cloud Storage link)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
