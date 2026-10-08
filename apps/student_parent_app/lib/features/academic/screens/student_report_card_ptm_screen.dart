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

  // Parent consultation notes
  final TextEditingController _parentQueryController = TextEditingController();
  bool _slotAcknowledged = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _parentQueryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserModelProvider);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: const Text(
          'Academic Report & PTM',
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
            Tab(icon: Icon(Icons.assessment_outlined), text: 'CBSE Marksheet'),
            Tab(icon: Icon(Icons.calendar_today_outlined), text: 'PTM Schedule & Slot'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildReportCardTab(user),
          _buildPtmScheduleTab(user),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 1: CBSE DIGITAL MARKSHEET
  // ==========================================
  Widget _buildReportCardTab(UserModel? user) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Term Selector
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Examination Term',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(10)),
                child: DropdownButton<String>(
                  value: _selectedTerm,
                  dropdownColor: const Color(0xFF1E293B),
                  underline: const SizedBox(),
                  style: const TextStyle(color: Color(0xFF06B6D4), fontWeight: FontWeight.bold, fontSize: 12),
                  items: ['Term 1 Examination', 'Periodic Test 1', 'Half-Yearly Exam']
                      .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedTerm = val);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Official Marksheet Container
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white12),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // School Header
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: const Color(0xFF312E81),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.indigoAccent),
                        ),
                        alignment: Alignment.center,
                        child: const Text('VS', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.black, fontSize: 18)),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'DELHI MODERN ACADEMY',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.extrabold, fontSize: 15, letterSpacing: 0.5),
                      ),
                      const Text(
                        'Affiliated to CBSE, New Delhi • Senior Secondary Board',
                        style: TextStyle(color: Colors.grey, fontSize: 10),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(color: const Color(0xFF06B6D4).withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
                        child: Text(_selectedTerm, style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Divider(color: Colors.white12),

                // Student Meta Grid
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(12)),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _metaItem('Student Name', user?.name ?? 'Aarav Sharma'),
                          _metaItem('Roll Number', '#${user?.studentDetails?.rollNumber ?? '12'}'),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _metaItem('Class & Section', user?.studentDetails?.grade ?? 'Class 10-A'),
                          _metaItem('Class Rank', 'Rank #2 in Class'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Marks Table Header
                Row(
                  children: const [
                    Expanded(flex: 3, child: Text('SUBJECT', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold))),
                    Expanded(flex: 2, child: Text('MAX', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold))),
                    Expanded(flex: 2, child: Text('SCORED', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold))),
                    Expanded(flex: 2, child: Text('GRADE', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold))),
                  ],
                ),
                const SizedBox(height: 6),
                const Divider(color: Colors.white12),

                // Subject Rows
                _subjectRow('Mathematics (041)', '100', '95', 'A1'),
                _subjectRow('Science (Phy/Chem/Bio - 086)', '100', '92', 'A1'),
                _subjectRow('English Language & Lit (184)', '100', '88', 'A2'),
                _subjectRow('Social Science (087)', '100', '90', 'A1'),
                _subjectRow('Hindi Course A (002)', '100', '91', 'A1'),
                const Divider(color: Colors.white24),

                // Aggregate Total
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF064E3B).withOpacity(0.4),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('AGGREGATE TOTAL', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                          Text('456 / 500 Marks Scored', style: TextStyle(color: Colors.white70, fontSize: 11)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: const [
                          Text('91.2%', style: TextStyle(color: Color(0xFF6EE7B7), fontWeight: FontWeight.black, fontSize: 18)),
                          Text('Grade: A1 (Outstanding)', style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 10, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Teacher Remarks
                const Text('Class Teacher Observation:', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                const Text(
                  '"Aarav demonstrates excellent analytical clarity in Science and Mathematics. Continues to maintain top percentile. Advised to practice Hindi writing speed for board exams."',
                  style: TextStyle(color: Colors.white60, fontSize: 11, fontStyle: FontStyle.italic, height: 1.4),
                ),
                const SizedBox(height: 14),

                // Signature & Stamp
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.verified, color: Color(0xFF10B981), size: 16),
                        SizedBox(width: 4),
                        Text('Certified CBSE Digital Record', style: TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const Text('Class Teacher: Mrs. Meenakshi Sharma', style: TextStyle(color: Colors.grey, fontSize: 10)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _metaItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 10)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
      ],
    );
  }

  Widget _subjectRow(String subject, String max, String scored, String grade) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(flex: 3, child: Text(subject, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w500))),
          Expanded(flex: 2, child: Text(max, textAlign: TextAlign.center, style: const TextStyle(color: Colors.grey, fontSize: 11))),
          Expanded(flex: 2, child: Text(scored, textAlign: TextAlign.center, style: const TextStyle(color: Color(0xFF06B6D4), fontWeight: FontWeight.bold, fontSize: 12))),
          Expanded(
            flex: 2,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                child: Text(grade, style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 2: PTM SCHEDULE & ALLOTTED SLOT
  // ==========================================
  Widget _buildPtmScheduleTab(UserModel? user) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Meeting Overview Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [const Color(0xFF1E293B), const Color(0xFF312E81).withOpacity(0.6)],
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
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFF6366F1).withOpacity(0.3), borderRadius: BorderRadius.circular(6)),
                      child: const Text('CBSE PARENT-TEACHER MEETING', style: TextStyle(color: Color(0xFFA5B4FC), fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: Colors.emerald.withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
                      child: const Text('SCHEDULED', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Text(
                  'Term 1 Mid-Term Evaluation & CBSE Board Strategy PTM',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                ),
                const SizedBox(height: 12),
                Row(
                  children: const [
                    Icon(Icons.calendar_today, size: 14, color: Colors.grey),
                    SizedBox(width: 6),
                    Text('Saturday, 17th October 2026', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: const [
                    Icon(Icons.room, size: 14, color: Color(0xFF10B981)),
                    SizedBox(width: 6),
                    Text('Senior Wing Room 204 • Offline (In Campus)', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Allotted Slot Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Your Allotted Consultation Slot', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: const Color(0xFF06B6D4).withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
                      child: const Text('Slot #04', style: TextStyle(color: Color(0xFF06B6D4), fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: const [
                    Icon(Icons.schedule, color: Color(0xFF06B6D4), size: 24),
                    SizedBox(width: 10),
                    Text('09:15 AM - 09:30 AM', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                  ],
                ),
                const SizedBox(height: 10),
                const Text(
                  'Parents are requested to reach 5 minutes prior to avoid queue delays. Class Teacher Mrs. Meenakshi Sharma will conduct the consultation.',
                  style: TextStyle(color: Colors.grey, fontSize: 11, height: 1.4),
                ),
                const SizedBox(height: 12),

                // Slot Acknowledgement
                ElevatedButton.icon(
                  onPressed: () {
                    setState(() => _slotAcknowledged = true);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('PTM attendance confirmed! Notification sent to Class Teacher.'), backgroundColor: Colors.teal),
                    );
                  },
                  icon: Icon(_slotAcknowledged ? Icons.check_circle : Icons.thumb_up, size: 16),
                  label: Text(_slotAcknowledged ? 'Slot Confirmed by Parent' : 'Confirm PTM Attendance'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _slotAcknowledged ? const Color(0xFF064E3B) : const Color(0xFF06B6D4),
                    foregroundColor: Colors.white,
                    minimumSize: const Size(double.infinity, 40),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Teacher Consultation Feedback
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white10)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('Recorded Class Teacher PTM Feedback:', style: TextStyle(color: Color(0xFF06B6D4), fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 6),
                Text(
                  '"Outstanding mathematical reasoning and science practical discipline. Advised to practice Hindi writing speed for board exams."',
                  style: TextStyle(color: Colors.white70, fontSize: 12, fontStyle: FontStyle.italic, height: 1.4),
                ),
                SizedBox(height: 10),
                Text('Action Plan from Teacher:', style: TextStyle(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.bold)),
                SizedBox(height: 2),
                Text('• Provide past 5-year CBSE question bank for English & Hindi.\n• Nominated for Inter-School Science Olympiad.', style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 11, height: 1.4)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Parent Query / Reschedule Request Box
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white10)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Parent Note / Reschedule Request', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                const Text('Leave any special questions or request another slot with the Class Teacher:', style: TextStyle(color: Colors.grey, fontSize: 11)),
                const SizedBox(height: 10),
                TextField(
                  controller: _parentQueryController,
                  maxLines: 2,
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                  decoration: const InputDecoration(
                    hintText: 'e.g. Please provide extra worksheets for geometry...',
                    hintStyle: TextStyle(color: Colors.white24, fontSize: 11),
                    filled: true,
                    fillColor: Color(0xFF0F172A),
                    border: OutlineInputBorder(borderSide: BorderSide(color: Colors.white10)),
                  ),
                ),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      if (_parentQueryController.text.trim().isNotEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Note sent to Class Teacher!'), backgroundColor: Colors.indigo),
                        );
                        _parentQueryController.clear();
                      }
                    },
                    icon: const Icon(Icons.send, size: 14),
                    label: const Text('Send to Teacher', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1), foregroundColor: Colors.white),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }
}
