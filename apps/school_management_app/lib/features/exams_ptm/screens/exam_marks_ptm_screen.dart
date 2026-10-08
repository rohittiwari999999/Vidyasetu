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

class _PtmSlotRow {
  final String studentId;
  final String studentName;
  final String rollNumber;
  final String parentName;
  final String parentPhone;
  final String slotTime;
  String status; // 'Scheduled', 'Attended', 'Rescheduled', 'Absent'
  String teacherFeedback;
  String parentRemarks;

  _PtmSlotRow({
    required this.studentId,
    required this.studentName,
    required this.rollNumber,
    required this.parentName,
    required this.parentPhone,
    required this.slotTime,
    this.status = 'Scheduled',
    this.teacherFeedback = '',
    this.parentRemarks = '',
  });
}

class _ExamMarksPtmScreenState extends ConsumerState<ExamMarksPtmScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Filters
  String _selectedClass = 'Class 10-A';
  String _selectedExam = 'Term 1 Examination';
  String _selectedSubject = 'Mathematics';
  double _maxTheory = 80.0;
  double _maxPractical = 20.0;
  String _searchQuery = '';

  // Student Marks Data
  late List<_StudentMarkRow> _students;

  // PTM Data
  late List<_PtmSlotRow> _ptmSlots;
  String _ptmTitle = 'Term 1 Evaluation & CBSE Board Strategy PTM';
  String _ptmDate = 'Saturday, 17th Oct 2026';
  String _ptmTime = '08:30 AM - 01:30 PM';
  String _ptmVenue = 'Senior Wing Room 204';
  String _ptmMode = 'Offline (In Campus)';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);

    _students = [
      _StudentMarkRow(id: 'stu-1', name: 'Aarav Sharma', rollNumber: '12', theory: 76.0, practical: 19.0, remarks: 'Excellent conceptual grasp in algebra'),
      _StudentMarkRow(id: 'stu-2', name: 'Ananya Verma', rollNumber: '18', theory: 74.0, practical: 18.0, remarks: 'High accuracy in theorems and geometry'),
      _StudentMarkRow(id: 'stu-3', name: 'Aakash Bhattacharya', rollNumber: '01', theory: 68.0, practical: 17.0, remarks: 'Good speed, needs revision in trigonometry'),
      _StudentMarkRow(id: 'stu-4', name: 'Aditi Chauhan', rollNumber: '02', theory: 70.0, practical: 18.0, remarks: 'Consistent problem solving approach'),
      _StudentMarkRow(id: 'stu-5', name: 'Aryan Singhal', rollNumber: '03', theory: 72.0, practical: 19.0, remarks: 'Logical analysis is commendable'),
      _StudentMarkRow(id: 'stu-6', name: 'Bhavna Kulkarni', rollNumber: '04', theory: 65.0, practical: 16.0, remarks: 'Needs slightly more practice in statistics'),
      _StudentMarkRow(id: 'stu-7', name: 'Chirag Sethi', rollNumber: '05', theory: 60.0, practical: 17.0, remarks: 'Active in class, can score higher with daily drill'),
      _StudentMarkRow(id: 'stu-8', name: 'Divyanshu Mishra', rollNumber: '06', theory: 78.0, practical: 20.0, remarks: 'Top scorer candidate for CBSE boards'),
    ];

    _ptmSlots = [
      _PtmSlotRow(
        studentId: 'stu-1',
        studentName: 'Aarav Sharma',
        rollNumber: '12',
        parentName: 'Mr. Rakesh Sharma',
        parentPhone: '+91 98101 23456',
        slotTime: '09:15 AM - 09:30 AM',
        status: 'Attended',
        teacherFeedback: 'Outstanding mathematical reasoning and science practical discipline.',
        parentRemarks: 'Very satisfied. Requested sample question papers.',
      ),
      _PtmSlotRow(
        studentId: 'stu-2',
        studentName: 'Ananya Verma',
        rollNumber: '18',
        parentName: 'Mrs. Sunita Verma',
        parentPhone: '+91 98202 34567',
        slotTime: '09:30 AM - 09:45 AM',
        status: 'Scheduled',
        teacherFeedback: 'Consistent high performer in Humanities and Science.',
        parentRemarks: 'Will supervise daily revision at home.',
      ),
      _PtmSlotRow(
        studentId: 'stu-3',
        studentName: 'Aakash Bhattacharya',
        rollNumber: '01',
        parentName: 'Dr. S. Bhattacharya',
        parentPhone: '+91 98303 45678',
        slotTime: '08:30 AM - 08:45 AM',
        status: 'Attended',
        teacherFeedback: 'Good conceptual clarity. Recommended weekend test series.',
        parentRemarks: 'Will review timetable.',
      ),
      _PtmSlotRow(
        studentId: 'stu-4',
        studentName: 'Aditi Chauhan',
        rollNumber: '02',
        parentName: 'Col. V. Chauhan',
        parentPhone: '+91 98404 56789',
        slotTime: '08:45 AM - 09:00 AM',
        status: 'Rescheduled',
        teacherFeedback: 'Good athletics-academics balance.',
        parentRemarks: 'Requested afternoon slot due to duty.',
      ),
      _PtmSlotRow(
        studentId: 'stu-5',
        studentName: 'Aryan Singhal',
        rollNumber: '03',
        parentName: 'Mr. Manoj Singhal',
        parentPhone: '+91 98505 67890',
        slotTime: '09:00 AM - 09:15 AM',
        status: 'Scheduled',
        teacherFeedback: 'Shows keen aptitude in Computer Applications.',
        parentRemarks: 'Pleased with school activities.',
      ),
    ];
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  double get _maxTotal => _maxTheory + _maxPractical;

  double get _classAverage {
    final present = _students.where((s) => !s.isAbsent).toList();
    if (present.isEmpty) return 0.0;
    return present.fold<double>(0.0, (acc, s) => acc + s.total) / present.length;
  }

  double get _highestMarks {
    final present = _students.where((s) => !s.isAbsent).toList();
    if (present.isEmpty) return 0.0;
    return present.map((s) => s.total).reduce((a, b) => a > b ? a : b);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: const Text(
          'Exam Marks & PTM Desk',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF06B6D4),
          indicatorWeight: 3,
          labelColor: const Color(0xFF06B6D4),
          unselectedLabelColor: Colors.grey,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(icon: Icon(Icons.grade_outlined), text: 'Exam Marks Entry'),
            Tab(icon: Icon(Icons.calendar_month_outlined), text: 'PTM Schedules & Slots'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildExamMarksView(),
          _buildPtmView(),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 1: EXAM MARKS ENTRY VIEW
  // ==========================================
  Widget _buildExamMarksView() {
    final filtered = _students.where((s) {
      final q = _searchQuery.toLowerCase();
      return s.name.toLowerCase().contains(q) || s.rollNumber.contains(q);
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Filter Bar
          _buildExamFilterCard(),
          const SizedBox(height: 16),

          // KPI Analytics Row
          _buildKpiAnalyticsRow(),
          const SizedBox(height: 16),

          // Action bar (Search & Quick Auto-Fill / Save)
          Row(
            children: [
              Expanded(
                child: TextField(
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'Search student or roll number...',
                    hintStyle: const TextStyle(color: Colors.grey, fontSize: 13),
                    prefixIcon: const Icon(Icons.search, color: Colors.grey, size: 18),
                    filled: true,
                    fillColor: const Color(0xFF1E293B),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                  onChanged: (val) => setState(() => _searchQuery = val),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: _autoFillSampleData,
                icon: const Icon(Icons.auto_fix_high, color: Colors.amber),
                tooltip: 'Auto-fill sample scores',
                style: IconButton.styleFrom(backgroundColor: const Color(0xFF1E293B)),
              ),
              const SizedBox(width: 4),
              ElevatedButton.icon(
                onPressed: _saveMarks,
                icon: const Icon(Icons.save_outlined, size: 16),
                label: const Text('Save'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF06B6D4),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Student Marks Table / List
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: filtered.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final student = filtered[index];
              return _buildStudentMarksCard(student);
            },
          ),
          const SizedBox(height: 20),

          // Publish Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: _publishResultsToParentApp,
              icon: const Icon(Icons.send_rounded, size: 18),
              label: const Text(
                'Publish All Marksheets to Parent App',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF10B981),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildExamFilterCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.tune, color: Color(0xFF06B6D4), size: 18),
              const SizedBox(width: 8),
              const Text('Assessment Configuration', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: const Color(0xFF06B6D4).withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
                child: const Text('CBSE 9-Point Scale', style: TextStyle(color: Color(0xFF06B6D4), fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _dropdownField('Class', _selectedClass, ['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 12-Science'], (v) {
                  if (v != null) setState(() => _selectedClass = v);
                }),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _dropdownField('Term', _selectedExam, ['Term 1 Examination', 'Periodic Test 1', 'Periodic Test 2', 'Pre-Board'], (v) {
                  if (v != null) setState(() => _selectedExam = v);
                }),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                flex: 2,
                child: _dropdownField('Subject', _selectedSubject, ['Mathematics', 'Science', 'English Language', 'Social Science', 'Hindi Course A'], (v) {
                  if (v != null) setState(() => _selectedSubject = v);
                }),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Max Theory', style: TextStyle(color: Colors.grey, fontSize: 11)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
                      child: Text('${_maxTheory.toInt()}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Max Pract', style: TextStyle(color: Colors.grey, fontSize: 11)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
                      child: Text('${_maxPractical.toInt()}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _dropdownField(String label, String value, List<String> items, ValueChanged<String?> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 11)),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
          child: DropdownButton<String>(
            value: value,
            isExpanded: true,
            dropdownColor: const Color(0xFF1E293B),
            underline: const SizedBox(),
            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
            items: items.map((i) => DropdownMenuItem(value: i, child: Text(i, overflow: TextOverflow.ellipsis))).toList(),
            onChanged: onChanged,
          ),
        ),
      ],
    );
  }

  Widget _buildKpiAnalyticsRow() {
    final avgPct = _maxTotal > 0 ? ((_classAverage / _maxTotal) * 100).toStringAsFixed(1) : '0';

    return Row(
      children: [
        Expanded(
          child: _kpiCard('Class Average', '${_classAverage.toStringAsFixed(1)} / ${_maxTotal.toInt()}', '$avgPct% Pct', const Color(0xFF06B6D4)),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _kpiCard('Top Score', '${_highestMarks.toInt()} / ${_maxTotal.toInt()}', 'Roll #06', const Color(0xFF10B981)),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _kpiCard('Pass Ratio', '100%', 'Min 33%', const Color(0xFF8B5CF6)),
        ),
      ],
    );
  }

  Widget _kpiCard(String title, String value, String sub, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(14),
        border: Border(left: BorderSide(color: color, width: 3.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: Colors.grey, fontSize: 11)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 2),
          Text(sub, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildStudentMarksCard(_StudentMarkRow student) {
    final grade = student.getCbseGrade(_maxTotal);
    final pct = _maxTotal > 0 ? ((student.total / _maxTotal) * 100).toStringAsFixed(1) : '0';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: student.isAbsent ? Colors.redAccent.withOpacity(0.3) : Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: const Color(0xFF06B6D4).withOpacity(0.2),
                child: Text(student.name[0], style: const TextStyle(color: Color(0xFF06B6D4), fontWeight: FontWeight.bold, fontSize: 13)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(student.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('Roll #${student.rollNumber}', style: const TextStyle(color: Colors.grey, fontSize: 11)),
                  ],
                ),
              ),
              // Absent toggle
              InkWell(
                onTap: () => setState(() => student.isAbsent = !student.isAbsent),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: student.isAbsent ? Colors.red.withOpacity(0.2) : Colors.white10,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    student.isAbsent ? 'ABSENT' : 'PRESENT',
                    style: TextStyle(
                      color: student.isAbsent ? Colors.redAccent : Colors.grey,
                      fontWeight: FontWeight.bold,
                      fontSize: 10,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Grade Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _gradeColor(grade).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _gradeColor(grade)),
                ),
                child: Text(grade, style: TextStyle(color: _gradeColor(grade), fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Inputs Row
          Row(
            children: [
              Expanded(
                child: _numericInput(
                  label: 'Theory (${_maxTheory.toInt()})',
                  initialValue: student.theory.toInt().toString(),
                  enabled: !student.isAbsent,
                  onChanged: (val) {
                    final num = double.tryParse(val) ?? 0.0;
                    setState(() => student.theory = num.clamp(0.0, _maxTheory));
                  },
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _numericInput(
                  label: 'Pract (${_maxPractical.toInt()})',
                  initialValue: student.practical.toInt().toString(),
                  enabled: !student.isAbsent,
                  onChanged: (val) {
                    final num = double.tryParse(val) ?? 0.0;
                    setState(() => student.practical = num.clamp(0.0, _maxPractical));
                  },
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Total / %', style: TextStyle(color: Colors.grey, fontSize: 11)),
                    const SizedBox(height: 4),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
                      child: Text(
                        student.isAbsent ? 'ABS' : '${student.total.toInt()} ($pct%)',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Remarks field & Report Preview
          Row(
            children: [
              Expanded(
                child: TextField(
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                  controller: TextEditingController(text: student.remarks),
                  decoration: const InputDecoration(
                    hintText: 'Teacher comments/remarks...',
                    hintStyle: TextStyle(color: Colors.white24, fontSize: 11),
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderSide: BorderSide(color: Colors.white10)),
                  ),
                  onChanged: (val) => student.remarks = val,
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () => _showStudentReportCardModal(student),
                icon: const Icon(Icons.receipt_long, color: Color(0xFF06B6D4), size: 18),
                tooltip: 'Preview Report Card',
                style: IconButton.styleFrom(backgroundColor: const Color(0xFF0F172A)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _numericInput({
    required String label,
    required String initialValue,
    required bool enabled,
    required ValueChanged<String> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 11)),
        const SizedBox(height: 4),
        TextField(
          enabled: enabled,
          keyboardType: TextInputType.number,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
          controller: TextEditingController(text: initialValue),
          decoration: InputDecoration(
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            filled: true,
            fillColor: const Color(0xFF0F172A),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
          ),
          onChanged: onChanged,
        ),
      ],
    );
  }

  Color _gradeColor(String grade) {
    if (grade.startsWith('A')) return const Color(0xFF10B981);
    if (grade.startsWith('B')) return const Color(0xFF06B6D4);
    if (grade.startsWith('C')) return Colors.amber;
    if (grade == 'D') return Colors.orange;
    return Colors.redAccent;
  }

  // ==========================================
  // TAB 2: PTM SCHEDULES & SLOTS VIEW
  // ==========================================
  Widget _buildPtmView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // PTM Meeting Event Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [const Color(0xFF1E293B), const Color(0xFF312E81).withOpacity(0.5)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(color: const Color(0xFF6366F1).withOpacity(0.3), borderRadius: BorderRadius.circular(6)),
                      child: Text(_selectedClass, style: const TextStyle(color: Color(0xFFA5B4FC), fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                    IconButton(
                      icon: const Icon(Icons.edit_calendar, color: Color(0xFFA5B4FC), size: 20),
                      onPressed: _showEditPtmDialog,
                      tooltip: 'Edit PTM Event Details',
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(_ptmTitle, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 14, color: Colors.grey),
                    const SizedBox(width: 6),
                    Text('$_ptmDate ($_ptmTime)', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.room, size: 14, color: Color(0xFF10B981)),
                    const SizedBox(width: 6),
                    Text('$_ptmVenue • $_ptmMode', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: _sendPtmBroadcastReminder,
                  icon: const Icon(Icons.send_rounded, size: 16),
                  label: const Text('Send SMS & Notification Reminder to All Parents'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    foregroundColor: Colors.white,
                    minimumSize: const Size(double.infinity, 42),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Slots Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Student Consultation Slots (15-min)',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
              ),
              Text(
                '${_ptmSlots.length} Slots',
                style: const TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Slots List
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _ptmSlots.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final slot = _ptmSlots[index];
              return _buildPtmSlotCard(slot);
            },
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildPtmSlotCard(_PtmSlotRow slot) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
                child: Text(slot.slotTime, style: const TextStyle(color: Color(0xFF06B6D4), fontWeight: FontWeight.bold, fontSize: 11)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${slot.studentName} (Roll #${slot.rollNumber})', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    Text('${slot.parentName} • ${slot.parentPhone}', style: const TextStyle(color: Colors.grey, fontSize: 11)),
                  ],
                ),
              ),
              // Status Dropdown
              DropdownButton<String>(
                value: slot.status,
                dropdownColor: const Color(0xFF0F172A),
                underline: const SizedBox(),
                style: TextStyle(
                  color: slot.status == 'Attended' ? Colors.greenAccent : (slot.status == 'Rescheduled' ? Colors.amberAccent : Colors.cyanAccent),
                  fontWeight: FontWeight.bold,
                  fontSize: 11,
                ),
                items: ['Scheduled', 'Attended', 'Rescheduled', 'Absent'].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => slot.status = val);
                },
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Feedback display or edit
          if (slot.teacherFeedback.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Teacher Notes:', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 2),
                  Text('"${slot.teacherFeedback}"', style: const TextStyle(color: Colors.white70, fontSize: 11, fontStyle: FontStyle.italic)),
                  if (slot.parentRemarks.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text('Parent: ${slot.parentRemarks}', style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 11)),
                  ],
                ],
              ),
            ),
          const SizedBox(height: 8),

          Align(
            alignment: Alignment.centerRight,
            child: TextButton.icon(
              onPressed: () => _showEditSlotNotesDialog(slot),
              icon: const Icon(Icons.edit_note, size: 16),
              label: Text(slot.teacherFeedback.isEmpty ? 'Record Consultation Notes' : 'Edit Notes', style: const TextStyle(fontSize: 11)),
              style: TextButton.styleFrom(foregroundColor: const Color(0xFF06B6D4)),
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // ACTIONS & DIALOGS
  // ==========================================
  void _autoFillSampleData() {
    setState(() {
      for (int i = 0; i < _students.length; i++) {
        _students[i].theory = (55 + (i * 3.5) % 24).clamp(0, _maxTheory);
        _students[i].practical = (16 + (i % 5)).toDouble().clamp(0, _maxPractical);
        _students[i].isAbsent = false;
        _students[i].remarks = i % 2 == 0 ? 'Consistent performance in exams' : 'Good problem solving skills';
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Sample scores populated for Class 10-A!'), backgroundColor: Colors.teal),
    );
  }

  void _saveMarks() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$_selectedSubject marks for $_selectedClass saved to database!'),
        backgroundColor: Colors.indigo,
      ),
    );
  }

  void _publishResultsToParentApp() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$_selectedExam marksheets published! Parents can now view results.'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  void _sendPtmBroadcastReminder() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('PTM schedule & allotted time slots sent to all parents via SMS & push notice!'),
        backgroundColor: Color(0xFF6366F1),
      ),
    );
  }

  void _showStudentReportCardModal(_StudentMarkRow student) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('CBSE Marksheet Preview', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.close, color: Colors.grey), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const Divider(color: Colors.white24),
            Text('Student: ${student.name} • Roll #${student.rollNumber}', style: const TextStyle(color: Color(0xFF06B6D4), fontWeight: FontWeight.bold)),
            Text('Class: $_selectedClass • $_selectedExam', style: const TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 12),
            _marksRow('Mathematics', '${student.total.toInt()}/${_maxTotal.toInt()}', student.getCbseGrade(_maxTotal)),
            _marksRow('Science', '92/100', 'A1'),
            _marksRow('English Language', '88/100', 'A2'),
            _marksRow('Social Science', '90/100', 'A1'),
            _marksRow('Hindi Course A', '91/100', 'A1'),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: const Color(0xFF064E3B), borderRadius: BorderRadius.circular(10)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Certified Status: PASSED (CCE)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  Text(student.getCbseGrade(_maxTotal), style: const TextStyle(color: Color(0xFF6EE7B7), fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _marksRow(String subject, String marks, String grade) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(subject, style: const TextStyle(color: Colors.white70, fontSize: 12)),
          Row(
            children: [
              Text(marks, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: Colors.cyan.withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                child: Text(grade, style: const TextStyle(color: Colors.cyanAccent, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showEditPtmDialog() {
    final titleCtrl = TextEditingController(text: _ptmTitle);
    final dateCtrl = TextEditingController(text: _ptmDate);
    final timeCtrl = TextEditingController(text: _ptmTime);
    final venueCtrl = TextEditingController(text: _ptmVenue);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Edit PTM Event', style: TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleCtrl, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(labelText: 'Title', labelStyle: TextStyle(color: Colors.grey))),
            TextField(controller: dateCtrl, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(labelText: 'Date', labelStyle: TextStyle(color: Colors.grey))),
            TextField(controller: timeCtrl, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(labelText: 'Time Slot', labelStyle: TextStyle(color: Colors.grey))),
            TextField(controller: venueCtrl, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(labelText: 'Venue', labelStyle: TextStyle(color: Colors.grey))),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _ptmTitle = titleCtrl.text;
                _ptmDate = dateCtrl.text;
                _ptmTime = timeCtrl.text;
                _ptmVenue = venueCtrl.text;
              });
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showEditSlotNotesDialog(_PtmSlotRow slot) {
    final feedbackCtrl = TextEditingController(text: slot.teacherFeedback);
    final parentCtrl = TextEditingController(text: slot.parentRemarks);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: Text('Consultation: ${slot.studentName}', style: const TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: feedbackCtrl,
              maxLines: 2,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'Teacher Observations', labelStyle: TextStyle(color: Colors.grey)),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: parentCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'Parent Notes & Action Plan', labelStyle: TextStyle(color: Colors.grey)),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              setState(() {
                slot.teacherFeedback = feedbackCtrl.text;
                slot.parentRemarks = parentCtrl.text;
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Consultation notes saved!'), backgroundColor: Colors.teal),
              );
            },
            child: const Text('Save Notes'),
          ),
        ],
      ),
    );
  }
}
