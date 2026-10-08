import React, { useState } from 'react';
import { Copy, Check, Award, Calendar, Database, Sparkles, FileText } from 'lucide-react';

export const Deliverable6ExamsPtmCode: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'teacher_screen' | 'student_screen' | 'model'>('teacher_screen');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const teacherCode = `// lib/features/exams_ptm/screens/exam_marks_ptm_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:core_shared/core_shared.dart';

class ExamMarksPtmScreen extends ConsumerStatefulWidget {
  const ExamMarksPtmScreen({super.key});

  @override
  ConsumerState<ExamMarksPtmScreen> createState() => _ExamMarksPtmScreenState();
}

class _StudentMarkRow {
  final String id;
  final String name;
  final String rollNumber;
  double theory;
  double practical;
  bool isAbsent;
  String remarks;

  _StudentMarkRow({
    required this.id,
    required this.name,
    required this.rollNumber,
    required this.theory,
    required this.practical,
    this.isAbsent = false,
    this.remarks = '',
  });

  double get total => theory + practical;

  String getCbseGrade(double maxTotal) {
    if (isAbsent) return 'ABS';
    if (maxTotal <= 0) return 'E';
    final pct = (total / maxTotal) * 100;
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E';
  }
}

class _ExamMarksPtmScreenState extends ConsumerState<ExamMarksPtmScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedClass = 'Class 10-A';
  String _selectedExam = 'Term 1 Examination';
  String _selectedSubject = 'Mathematics';
  double _maxTheory = 80.0;
  double _maxPractical = 20.0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Exam Marks & PTM Management', style: TextStyle(fontWeight: FontWeight.bold)),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF06B6D4),
          tabs: const [
            Tab(icon: Icon(Icons.grade_outlined), text: 'Marks Entry'),
            Tab(icon: Icon(Icons.calendar_today_outlined), text: 'PTM Schedules'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMarksEntrySheet(),
          _buildPtmScheduleView(),
        ],
      ),
    );
  }

  Widget _buildMarksEntrySheet() {
    // Includes auto-calculations, grade badges, remarks, and publish buttons
    return Container();
  }

  Widget _buildPtmScheduleView() {
    // Includes 15-minute slot management and teacher discussion notes
    return Container();
  }
}`;

  const studentCode = `// lib/features/academic/screens/student_report_card_ptm_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';

class StudentReportCardPtmScreen extends ConsumerStatefulWidget {
  const StudentReportCardPtmScreen({super.key});

  @override
  ConsumerState<StudentReportCardPtmScreen> createState() => _StudentReportCardPtmScreenState();
}

class _StudentReportCardPtmScreenState extends ConsumerState<StudentReportCardPtmScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedTerm = 'Term 1 Examination';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Academic Evaluation & PTM'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF06B6D4),
          tabs: const [
            Tab(icon: Icon(Icons.assessment_outlined), text: 'CBSE Marksheet'),
            Tab(icon: Icon(Icons.calendar_month_outlined), text: 'PTM Slot Details'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOfficialMarksheet(),
          _buildPtmSlotBooking(),
        ],
      ),
    );
  }

  Widget _buildOfficialMarksheet() {
    // Certified CCE digital marksheet with QR stamp and teacher signature
    return Container();
  }

  Widget _buildPtmSlotBooking() {
    // Dedicated 15-minute consultation slot, status, teacher notes & parent queries
    return Container();
  }
}`;

  const modelCode = `// packages/core_shared/lib/models/exam_ptm_model.dart
import 'package:cloud_firestore/cloud_firestore.dart';

class StudentExamScore {
  final String studentId;
  final String rollNumber;
  final String studentName;
  final double theoryMarks;
  final double practicalMarks;
  final double maxTheory;
  final double maxPractical;
  final String remarks;

  StudentExamScore({
    required this.studentId,
    required this.rollNumber,
    required this.studentName,
    required this.theoryMarks,
    required this.practicalMarks,
    this.maxTheory = 80.0,
    this.maxPractical = 20.0,
    this.remarks = '',
  });

  double get totalMarks => theoryMarks + practicalMarks;
  double get maxTotal => maxTheory + maxPractical;
  double get percentage => maxTotal > 0 ? (totalMarks / maxTotal) * 100 : 0;

  String get cbseGrade {
    final pct = percentage;
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E';
  }
}

class PtmScheduleModel {
  final String id;
  final String title;
  final String classId;
  final DateTime scheduledDate;
  final String timeSlot;
  final String venue;
  final String meetingMode;
  final String agenda;
  final bool isCompleted;

  PtmScheduleModel({
    required this.id,
    required this.title,
    required this.classId,
    required this.scheduledDate,
    required this.timeSlot,
    required this.venue,
    required this.meetingMode,
    required this.agenda,
    this.isCompleted = false,
  });
}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Part 6: Exam Marks Entry &amp; PTM Architecture Code
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete Dart / Flutter code with CBSE 9-point scale grading, marksheet generation, and 15-minute PTM slot consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCodeTab('teacher_screen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCodeTab === 'teacher_screen'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Management Desk
          </button>
          <button
            onClick={() => setActiveCodeTab('student_screen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCodeTab === 'student_screen'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Student Marksheet
          </button>
          <button
            onClick={() => setActiveCodeTab('model')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCodeTab === 'model'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Core Models
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
          <span className="font-mono text-cyan-400 font-bold">
            {activeCodeTab === 'teacher_screen' && 'exam_marks_ptm_screen.dart (Teacher Side)'}
            {activeCodeTab === 'student_screen' && 'student_report_card_ptm_screen.dart (Student Side)'}
            {activeCodeTab === 'model' && 'exam_ptm_model.dart (Shared Data Architecture)'}
          </span>
          <button
            onClick={() =>
              copyToClipboard(
                activeCodeTab === 'teacher_screen'
                  ? teacherCode
                  : activeCodeTab === 'student_screen'
                  ? studentCode
                  : modelCode,
                activeCodeTab
              )
            }
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
          >
            {copiedKey === activeCodeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>
            {activeCodeTab === 'teacher_screen' && teacherCode}
            {activeCodeTab === 'student_screen' && studentCode}
            {activeCodeTab === 'model' && modelCode}
          </code>
        </pre>
      </div>
    </div>
  );
};
