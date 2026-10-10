import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  AlertCircle,
  Search,
  Save,
  Send,
  Plus,
  Users,
  Printer,
  ChevronRight,
  TrendingUp,
  FileText,
  Star,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { PtmMeeting, PtmStudentSlot, ExamReport } from '../../types';

export const ExamMarksPtmManager: React.FC = () => {
  const {
    examReports,
    ptmMeetings,
    saveStudentMarks,
    publishExamResults,
    schedulePtm,
    updatePtmSlot,
    sendPtmReminder,
    users,
    currentUser,
    showSimulatedPush,
  } = useSchool();

  const [activeMainTab, setActiveMainTab] = useState<'exams' | 'ptm'>('exams');

  // Exam state filters
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [selectedExam, setSelectedExam] = useState('Term 1 Examination');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [maxTheory, setMaxTheory] = useState(80);
  const [maxPractical, setMaxPractical] = useState(20);
  const [studentSearch, setStudentSearch] = useState('');
  const [previewStudentReport, setPreviewStudentReport] = useState<ExamReport | null>(null);

  // Local draft of marks for quick bulk entry
  interface LocalMarkRow {
    studentId: string;
    studentName: string;
    rollNo: string;
    theory: number;
    practical: number;
    isAbsent: boolean;
    remarks: string;
  }

  // Get students of the selected class
  const classStudents = users.filter(
    (u) => u.role === 'student' && (u.studentDetails?.grade === selectedClass || selectedClass === 'Class 10-A')
  );

  const [marksDraft, setMarksDraft] = useState<Record<string, LocalMarkRow>>(() => {
    const initial: Record<string, LocalMarkRow> = {};
    classStudents.forEach((stu, index) => {
      // Find existing marks from reports if available
      const report = examReports.find((r) => r.studentId === stu.id);
      const sub = report?.subjects.find((s) => s.name.toLowerCase().includes('math'));
      const defaultTheory = sub ? Math.min(Math.round(sub.marksObtained * 0.8), 75) : 65 + (index % 12);
      const defaultPractical = sub ? Math.max(sub.marksObtained - defaultTheory, 16) : 18;

      initial[stu.id] = {
        studentId: stu.id,
        studentName: stu.name,
        rollNo: stu.studentDetails?.rollNumber || `${index + 1}`.padStart(2, '0'),
        theory: defaultTheory,
        practical: defaultPractical,
        isAbsent: false,
        remarks: index === 0 ? 'Consistent logical approach' : 'Good class participation',
      };
    });
    return initial;
  });

  // PTM state
  const [selectedPtmId, setSelectedPtmId] = useState<string>(ptmMeetings[0]?.id || '');
  const [showNewPtmModal, setShowNewPtmModal] = useState(false);
  const [ptmSearch, setPtmSearch] = useState('');
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotDraftNotes, setSlotDraftNotes] = useState<{
    teacherFeedback: string;
    parentRemarks: string;
    actionItems: string;
  }>({ teacherFeedback: '', parentRemarks: '', actionItems: '' });

  // New PTM Form State
  const [newPtmForm, setNewPtmForm] = useState({
    title: 'Term 1 Parent-Teacher Meeting (PTM)',
    classId: 'Class 10-A',
    scheduledDate: '2026-10-25',
    timeSlot: '09:00 AM - 01:30 PM',
    venue: 'Senior Wing Room 204',
    meetingMode: 'offline' as 'offline' | 'online',
    meetLink: '',
    agenda: 'Individual academic counseling, term marksheet distribution, and attendance review.',
  });

  const activePtm = ptmMeetings.find((m) => m.id === selectedPtmId) || ptmMeetings[0];

  // Helper calculations for exam statistics
  const currentMarksList = Object.values(marksDraft);
  const maxTotalMarks = maxTheory + maxPractical;
  const presentStudents = currentMarksList.filter((m) => !m.isAbsent);
  const averageMarks =
    presentStudents.length > 0
      ? Math.round(
          presentStudents.reduce((acc, curr) => acc + (curr.theory + curr.practical), 0) /
            presentStudents.length
        )
      : 0;
  const averagePercentage = maxTotalMarks > 0 ? ((averageMarks / maxTotalMarks) * 100).toFixed(1) : '0';
  const highestMarks =
    presentStudents.length > 0
      ? Math.max(...presentStudents.map((s) => s.theory + s.practical))
      : 0;
  const topperStudent = presentStudents.find((s) => s.theory + s.practical === highestMarks);

  // Grade helper
  const getGrade = (total: number, max: number) => {
    const pct = max > 0 ? (total / max) * 100 : 0;
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E';
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A1':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'A2':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'B1':
      case 'B2':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'C1':
      case 'C2':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  // Grade distribution
  const gradeCounts = {
    A1: presentStudents.filter((s) => getGrade(s.theory + s.practical, maxTotalMarks) === 'A1').length,
    A2: presentStudents.filter((s) => getGrade(s.theory + s.practical, maxTotalMarks) === 'A2').length,
    B1: presentStudents.filter((s) => getGrade(s.theory + s.practical, maxTotalMarks) === 'B1').length,
    B2: presentStudents.filter((s) => getGrade(s.theory + s.practical, maxTotalMarks) === 'B2').length,
    C: presentStudents.filter((s) => ['C1', 'C2'].includes(getGrade(s.theory + s.practical, maxTotalMarks))).length,
  };

  const handleUpdateMarks = (studentId: string, field: 'theory' | 'practical' | 'remarks' | 'isAbsent', value: any) => {
    setMarksDraft((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveAllMarks = () => {
    Object.values(marksDraft).forEach((row) => {
      if (!row.isAbsent) {
        saveStudentMarks(
          row.studentId,
          selectedSubject,
          row.theory + row.practical,
          maxTotalMarks,
          row.remarks
        );
      }
    });

    showSimulatedPush(
      'Marks Register Saved ✅',
      `${selectedSubject} marks for ${selectedClass} saved to school database successfully.`,
      'approval'
    );
  };

  const handlePublishAll = () => {
    handleSaveAllMarks();
    publishExamResults(selectedExam, selectedClass);
  };

  const handleFillSampleData = () => {
    const updated = { ...marksDraft };
    Object.keys(updated).forEach((id, idx) => {
      updated[id] = {
        ...updated[id],
        theory: Math.min(Math.round(55 + (idx * 3.5) % 24), maxTheory),
        practical: Math.min(Math.round(16 + (idx % 5)), maxPractical),
        isAbsent: false,
        remarks: idx % 3 === 0 ? 'Consistent performance' : 'Excellent work in numericals',
      };
    });
    setMarksDraft(updated);
    showSimulatedPush('Auto-Fill Complete ⚡', 'Sample scores calculated for all class students.', 'approval');
  };

  const handleCreatePtm = (e: React.FormEvent) => {
    e.preventDefault();
    schedulePtm({
      title: newPtmForm.title,
      classId: newPtmForm.classId,
      scheduledDate: newPtmForm.scheduledDate,
      timeSlot: newPtmForm.timeSlot,
      venue: newPtmForm.venue,
      meetingMode: newPtmForm.meetingMode,
      meetLink: newPtmForm.meetLink || undefined,
      agenda: newPtmForm.agenda,
      status: 'upcoming',
    });
    setShowNewPtmModal(false);
  };

  const handleSaveSlotNotes = (slot: PtmStudentSlot) => {
    if (!activePtm) return;
    const updatedSlot: PtmStudentSlot = {
      ...slot,
      teacherFeedback: slotDraftNotes.teacherFeedback || slot.teacherFeedback,
      parentRemarks: slotDraftNotes.parentRemarks || slot.parentRemarks,
      actionItems: slotDraftNotes.actionItems || slot.actionItems,
    };
    updatePtmSlot(activePtm.id, updatedSlot);
    setEditingSlotId(null);
    showSimulatedPush('PTM Notes Saved 📝', `Feedback recorded for ${slot.studentName}.`, 'approval');
  };

  const handleSlotStatusChange = (slot: PtmStudentSlot, status: PtmStudentSlot['attendanceStatus']) => {
    if (!activePtm) return;
    updatePtmSlot(activePtm.id, { ...slot, attendanceStatus: status });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Exam Marks & PTM Management</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/30 uppercase">
                    CBSE Aligned
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Term Assessments, Grade Register, Instant Report Card Dispatch & Parent-Teacher Meeting Scheduler
                </p>
              </div>
            </div>
          </div>

          {/* Tab Switcher & Quick Actions */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveMainTab('exams')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeMainTab === 'exams'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Exam & Marks Entry</span>
              </button>

              <button
                onClick={() => setActiveMainTab('ptm')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeMainTab === 'ptm'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>PTM Schedules ({ptmMeetings.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: EXAM MARKS ENTRY & EVALUATION DESK */}
      {/* ======================================================== */}
      {activeMainTab === 'exams' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter & Configuration Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Grade / Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Class 10-A">Class 10-A (Class Teacher)</option>
                  <option value="Class 10-B">Class 10-B</option>
                  <option value="Class 9-A">Class 9-A</option>
                  <option value="Class 9-B">Class 9-B</option>
                  <option value="Class 11-Science">Class 11-Science</option>
                  <option value="Class 12-Science">Class 12-Science</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Examination Term
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Term 1 Examination">Term 1 Examination (Mid-Term)</option>
                  <option value="Periodic Test 1 (PT-1)">Periodic Test 1 (PT-1)</option>
                  <option value="Periodic Test 2 (PT-2)">Periodic Test 2 (PT-2)</option>
                  <option value="Pre-Board Examination">Pre-Board Examination</option>
                  <option value="Annual Board Examination">Annual Board Examination</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Mathematics">Mathematics (041)</option>
                  <option value="Science">Science (Physics/Chem/Bio - 086)</option>
                  <option value="English Language & Lit">English Language & Lit (184)</option>
                  <option value="Social Science">Social Science (087)</option>
                  <option value="Hindi Course A">Hindi Course A (002)</option>
                  <option value="Computer Applications">Computer Applications (165)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Max Marks (Theory / Pract)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={maxTheory}
                    onChange={(e) => setMaxTheory(Number(e.target.value) || 80)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-cyan-500"
                    title="Max Theory"
                  />
                  <span className="text-slate-500 font-bold">+</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={maxPractical}
                    onChange={(e) => setMaxPractical(Number(e.target.value) || 20)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-cyan-500"
                    title="Max Practical/Internal"
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleFillSampleData}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-700"
                  title="Auto-fill sample scores for fast testing"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-Fill</span>
                </button>
                <button
                  onClick={handleSaveAllMarks}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance Analytics KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Class Average</span>
              <div className="text-2xl font-black text-white mt-1">
                {averageMarks} <span className="text-xs font-normal text-slate-400">/ {maxTotalMarks}</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {averagePercentage}% Aggregate Average
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Highest Marks</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {highestMarks} <span className="text-xs font-normal text-slate-400">/ {maxTotalMarks}</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-1">
                {topperStudent?.studentName ? `Topper: ${topperStudent.studentName}` : 'All students submitted'}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Students Assessed</span>
              <div className="text-2xl font-black text-white mt-1">
                {presentStudents.length} <span className="text-xs font-normal text-slate-400">/ {currentMarksList.length}</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                100% Pass Ratio (Min 33%)
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">CBSE Grade Spread</span>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  A1: {gradeCounts.A1}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  A2: {gradeCounts.A2}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  B1: {gradeCounts.B1}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Marks Register Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-sm">
                  {selectedClass} • {selectedSubject} Marks Sheet
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-xs">
                  {currentMarksList.length} Students
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student or roll..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handlePublishAll}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Parent App</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-3 text-center">Theory ({maxTheory})</th>
                    <th className="py-3 px-3 text-center">Pract/Int ({maxPractical})</th>
                    <th className="py-3 px-3 text-center">Total ({maxTotalMarks})</th>
                    <th className="py-3 px-3 text-center">% Pct</th>
                    <th className="py-3 px-3 text-center">Grade</th>
                    <th className="py-3 px-4">Teacher Remark / Comments</th>
                    <th className="py-3 px-3 text-center">Report Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentMarksList
                    .filter(
                      (row) =>
                        row.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        row.rollNo.includes(studentSearch)
                    )
                    .map((row) => {
                      const total = row.theory + row.practical;
                      const pct = maxTotalMarks > 0 ? ((total / maxTotalMarks) * 100).toFixed(1) : '0';
                      const grade = getGrade(total, maxTotalMarks);

                      return (
                        <tr
                          key={row.studentId}
                          className={`hover:bg-slate-800/30 transition ${
                            row.isAbsent ? 'opacity-50 bg-rose-950/10' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-300">
                            #{row.rollNo}
                          </td>
                          <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-cyan-600/30 text-cyan-400 flex items-center justify-center text-[10px] font-black">
                                {row.studentName[0]}
                              </div>
                              <span>{row.studentName}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max={maxTheory}
                              value={row.theory}
                              disabled={row.isAbsent}
                              onChange={(e) =>
                                handleUpdateMarks(
                                  row.studentId,
                                  'theory',
                                  Math.min(Number(e.target.value) || 0, maxTheory)
                                )
                              }
                              className="w-16 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2 py-1 text-center font-mono font-bold text-cyan-300 text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max={maxPractical}
                              value={row.practical}
                              disabled={row.isAbsent}
                              onChange={(e) =>
                                handleUpdateMarks(
                                  row.studentId,
                                  'practical',
                                  Math.min(Number(e.target.value) || 0, maxPractical)
                                )
                              }
                              className="w-16 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2 py-1 text-center font-mono font-bold text-emerald-300 text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-extrabold text-white">
                            {row.isAbsent ? <span className="text-rose-400">ABS</span> : total}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-300 font-semibold">
                            {row.isAbsent ? '-' : `${pct}%`}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.isAbsent ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">
                                ABS
                              </span>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getGradeBadgeColor(
                                  grade
                                )}`}
                              >
                                {grade}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={row.remarks}
                              placeholder="Add observation..."
                              onChange={(e) => handleUpdateMarks(row.studentId, 'remarks', e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => {
                                const report =
                                  examReports.find((r) => r.studentId === row.studentId) || examReports[0];
                                setPreviewStudentReport(report);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-[11px] transition inline-flex items-center gap-1 border border-slate-700"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Calculations conform with Central Board of Secondary Education (CBSE) 9-point grading system.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAllMarks}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handlePublishAll}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish All Marksheets</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: PARENT-TEACHER MEETING (PTM) MANAGEMENT */}
      {/* ======================================================== */}
      {activeMainTab === 'ptm' && (
        <div className="space-y-6 animate-fade-in">
          {/* PTM Header & Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Parent-Teacher Meeting Sessions</h3>
                <p className="text-xs text-slate-400">
                  Manage meeting dates, individual parent consultation slots, and recorded teacher discussion notes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewPtmModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New PTM</span>
              </button>
            </div>
          </div>

          {/* Active PTM Overview Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ptmMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => setSelectedPtmId(meeting.id)}
                className={`p-5 rounded-3xl border transition cursor-pointer ${
                  selectedPtmId === meeting.id
                    ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                      {meeting.classId}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1.5">{meeting.title}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      meeting.status === 'upcoming'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{meeting.scheduledDate} ({meeting.timeSlot})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    {meeting.meetingMode === 'online' ? (
                      <Video className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{meeting.venue}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-1">
                    "{meeting.agenda}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {meeting.slots.length} Parent Consultation Slots
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendPtmReminder(meeting.id);
                    }}
                    className="px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-[11px] border border-indigo-500/30 flex items-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send SMS Reminder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Slots & Consultation Notes Table */}
          {activePtm && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden space-y-4">
              <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{activePtm.title}</span>
                    <span className="text-slate-400 font-normal">({activePtm.classId})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    15-minute dedicated discussion slots per roll number. Record feedback and parent remarks.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter student slot..."
                      value={ptmSearch}
                      onChange={(e) => setPtmSearch(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Slot Table */}
              <div className="overflow-x-auto px-5 pb-5">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-3 px-3">Slot Time</th>
                      <th className="py-3 px-3">Roll / Student</th>
                      <th className="py-3 px-3">Parent Contact</th>
                      <th className="py-3 px-3 text-center">Meeting Status</th>
                      <th className="py-3 px-4">Teacher Feedback & Observations</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activePtm.slots
                      .filter(
                        (s) =>
                          s.studentName.toLowerCase().includes(ptmSearch.toLowerCase()) ||
                          s.rollNo.includes(ptmSearch)
                      )
                      .map((slot) => {
                        const isEditing = editingSlotId === slot.studentId;

                        return (
                          <tr key={slot.studentId} className="hover:bg-slate-800/20 transition">
                            <td className="py-3 px-3 font-mono font-bold text-indigo-300 whitespace-nowrap">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                {slot.slotTime}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                              <div>
                                <span className="text-slate-400 font-mono text-[11px] mr-1.5">
                                  #{slot.rollNo}
                                </span>
                                {slot.studentName}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              <div className="text-xs">{slot.parentName}</div>
                              <div className="text-[11px] font-mono text-slate-500">{slot.parentPhone}</div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <select
                                value={slot.attendanceStatus}
                                onChange={(e) =>
                                  handleSlotStatusChange(
                                    slot,
                                    e.target.value as PtmStudentSlot['attendanceStatus']
                                  )
                                }
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold border bg-slate-950 focus:outline-none ${
                                  slot.attendanceStatus === 'attended'
                                    ? 'text-emerald-300 border-emerald-500/40'
                                    : slot.attendanceStatus === 'rescheduled'
                                    ? 'text-amber-300 border-amber-500/40'
                                    : 'text-indigo-300 border-indigo-500/40'
                                }`}
                              >
                                <option value="scheduled">Scheduled</option>
                                <option value="attended">Attended</option>
                                <option value="rescheduled">Rescheduled</option>
                                <option value="absent">Absent</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-indigo-500/50">
                                  <div>
                                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                                      Teacher Feedback:
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={slotDraftNotes.teacherFeedback}
                                      onChange={(e) =>
                                        setSlotDraftNotes((prev) => ({
                                          ...prev,
                                          teacherFeedback: e.target.value,
                                        }))
                                      }
                                      placeholder="Academic strengths, weaknesses, discipline..."
                                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                                      Parent Remarks & Action Plan:
                                    </label>
                                    <input
                                      type="text"
                                      value={slotDraftNotes.parentRemarks}
                                      onChange={(e) =>
                                        setSlotDraftNotes((prev) => ({
                                          ...prev,
                                          parentRemarks: e.target.value,
                                        }))
                                      }
                                      placeholder="Parent requests, home study plan..."
                                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                      onClick={() => setEditingSlotId(null)}
                                      className="px-2.5 py-1 rounded text-slate-400 hover:text-white text-xs font-semibold"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveSlotNotes(slot)}
                                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                                    >
                                      Save Notes
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {slot.teacherFeedback ? (
                                    <div className="space-y-1">
                                      <p className="text-slate-200 text-xs italic">
                                        "{slot.teacherFeedback}"
                                      </p>
                                      {slot.parentRemarks && (
                                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                          <MessageSquare className="w-3 h-3 text-cyan-400" />
                                          <span>Parent: {slot.parentRemarks}</span>
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-500 italic text-[11px]">
                                      No notes added yet. Click edit to record discussion.
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              {!isEditing && (
                                <button
                                  onClick={() => {
                                    setEditingSlotId(slot.studentId);
                                    setSlotDraftNotes({
                                      teacherFeedback: slot.teacherFeedback || '',
                                      parentRemarks: slot.parentRemarks || '',
                                      actionItems: slot.actionItems || '',
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold text-[11px] transition border border-slate-700"
                                >
                                  Edit Notes
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SCHEDULE NEW PTM */}
      {/* ======================================================== */}
      {showNewPtmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>Schedule New Parent-Teacher Meeting</span>
              </h3>
              <button
                onClick={() => setShowNewPtmModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePtm} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">PTM Meeting Title</label>
                <input
                  type="text"
                  required
                  value={newPtmForm.title}
                  onChange={(e) => setNewPtmForm({ ...newPtmForm, title: e.target.value })}
                  placeholder="e.g. Term 1 Performance Review & Board Strategy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Class</label>
                  <select
                    value={newPtmForm.classId}
                    onChange={(e) => setNewPtmForm({ ...newPtmForm, classId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 10-B">Class 10-B</option>
                    <option value="Class 9-A">Class 9-A</option>
                    <option value="Class 11-Science">Class 11-Science</option>
                    <option value="Class 12-Science">Class 12-Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newPtmForm.scheduledDate}
                    onChange={(e) => setNewPtmForm({ ...newPtmForm, scheduledDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Time Slot Window</label>
                  <input
                    type="text"
                    required
                    value={newPtmForm.timeSlot}
                    onChange={(e) => setNewPtmForm({ ...newPtmForm, timeSlot: e.target.value })}
                    placeholder="09:00 AM - 01:30 PM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mode</label>
                  <select
                    value={newPtmForm.meetingMode}
                    onChange={(e) =>
                      setNewPtmForm({
                        ...newPtmForm,
                        meetingMode: e.target.value as 'offline' | 'online',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="offline">Offline (In Campus)</option>
                    <option value="online">Online (Google Meet)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Venue / Room / Meet Link</label>
                <input
                  type="text"
                  required
                  value={newPtmForm.venue}
                  onChange={(e) => setNewPtmForm({ ...newPtmForm, venue: e.target.value })}
                  placeholder="e.g. Senior Block Room 204 or meet.google.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Meeting Agenda</label>
                <textarea
                  rows={2}
                  required
                  value={newPtmForm.agenda}
                  onChange={(e) => setNewPtmForm({ ...newPtmForm, agenda: e.target.value })}
                  placeholder="Explain discussion topics for parents..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPtmModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                >
                  Create & Generate Slots
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: STUDENT REPORT CARD PREVIEW & PRINT */}
      {/* ======================================================== */}
      {previewStudentReport && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl my-8 space-y-5 animate-scale-up text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-white text-base">CBSE Digital Marksheet Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setPreviewStudentReport(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* School Header */}
            <div className="text-center pb-3 border-b border-slate-800">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-950 text-amber-400 flex items-center justify-center font-black text-lg mb-1 border border-indigo-700/50">
                VS
              </div>
              <h4 className="font-extrabold uppercase text-white tracking-tight text-base">
                Delhi Modern Academy, New Delhi
              </h4>
              <p className="text-[11px] text-slate-400">
                CBSE Affiliation #2130894 • Senior Secondary Assessment Board
              </p>
              <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                {previewStudentReport.examName} ({previewStudentReport.academicYear})
              </div>
            </div>

            {/* Student Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Student Name:</span>
                <p className="font-bold text-white">{previewStudentReport.studentName}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Class & Section:</span>
                <p className="font-bold text-indigo-300">{previewStudentReport.classId}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Roll Number:</span>
                <p className="font-bold font-mono text-white">#{previewStudentReport.rollNo}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Class Rank:</span>
                <p className="font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> #{previewStudentReport.rankInClass}
                </p>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Max Marks</th>
                    <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-3 text-center">CBSE Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {previewStudentReport.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20">
                      <td className="py-2 px-3 font-semibold text-white">{sub.name}</td>
                      <td className="py-2 px-3 text-center font-mono text-slate-400">{sub.maxMarks}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-cyan-300">
                        {sub.marksObtained}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-950 font-bold border-t border-slate-800">
                  <tr>
                    <td className="py-2.5 px-3 text-white font-extrabold">AGGREGATE TOTAL</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                      {previewStudentReport.totalMarks}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-emerald-400 font-extrabold">
                      {previewStudentReport.obtainedMarks} ({previewStudentReport.percentage}%)
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">
                      {previewStudentReport.overallGrade}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Remarks */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-300">Teacher Evaluation:</span>
              <p className="text-slate-400 italic">"{previewStudentReport.teacherRemarks}"</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Digitally by Examination In-Charge
                </span>
                <span>Signature: <strong>{currentUser.name}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
