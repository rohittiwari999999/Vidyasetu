import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import '../../homework/screens/my_homework_screen.dart';
import '../../attendance/screens/attendance_calendar_screen.dart';
import '../../fees/screens/fee_ledger_screen.dart';
import '../../live_class/screens/live_class_screen.dart';
import '../../notices/screens/notices_screen.dart';

class StudentHomeScreen extends ConsumerWidget {
  final void Function(int index)? onNavigateTab;
  const StudentHomeScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProfileProvider).value;

    return Scaffold(
      appBar: AppBar(
        title: const Text('VidyaSetu Student', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF064E3B),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.white),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentNoticesScreen()));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student Profile Card
            Card(
              color: const Color(0xFF064E3B),
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: const Color(0xFF10B981),
                      child: Text(
                        user?.name.isNotEmpty == true ? user!.name[0] : 'A',
                        style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.name ?? 'Aarav Sharma',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${user?.studentDetails?.grade ?? 'Class 10-A'} • Roll #${user?.studentDetails?.rollNumber ?? '12'}',
                            style: const TextStyle(color: Color(0xFF6EE7B7), fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 2),
                          const Text('CBSE Affiliation #2130894', style: TextStyle(color: Colors.white60, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Quick Learning Dashboard',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Navigation Grid with guaranteed touch responsiveness
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              childAspectRatio: 1.15,
              children: [
                _interactiveCard(
                  title: 'Homework',
                  subtitle: '3 Assignments',
                  icon: Icons.book,
                  accentColor: Colors.blueAccent,
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(1);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const MyHomeworkScreen()));
                    }
                  },
                ),
                _interactiveCard(
                  title: 'Attendance',
                  subtitle: '96.4% Present',
                  icon: Icons.calendar_today,
                  accentColor: const Color(0xFF10B981),
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(2);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const AttendanceCalendarScreen()));
                    }
                  },
                ),
                _interactiveCard(
                  title: 'Fees & Receipts',
                  subtitle: 'Q2 Paid / Q3 Due',
                  icon: Icons.currency_rupee,
                  accentColor: Colors.purpleAccent,
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(3);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const FeeLedgerScreen()));
                    }
                  },
                ),
                _interactiveCard(
                  title: 'Live Class',
                  subtitle: 'Join Jitsi Room',
                  icon: Icons.video_call,
                  accentColor: Colors.redAccent,
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(4);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const LiveClassScreen()));
                    }
                  },
                ),
                _interactiveCard(
                  title: 'Notices',
                  subtitle: '3 New Circulars',
                  icon: Icons.campaign,
                  accentColor: Colors.amberAccent,
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentNoticesScreen()));
                  },
                ),
                _interactiveCard(
                  title: 'Report Card',
                  subtitle: 'Term 1: 91.2% (A1)',
                  icon: Icons.assessment,
                  accentColor: Colors.cyanAccent,
                  onTap: () {
                    _showReportCardModal(context);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _interactiveCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return Card(
      color: const Color(0xFF1E293B),
      elevation: 2,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        splashColor: accentColor.withOpacity(0.2),
        highlightColor: accentColor.withOpacity(0.1),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 36, color: accentColor),
              const SizedBox(height: 10),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.grey, fontSize: 11),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showReportCardModal(BuildContext context) {
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
                const Text('Term 1 Academic Evaluation', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.close, color: Colors.grey), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const Divider(color: Colors.white24),
            _subjectScoreRow('Mathematics', '95/100', 'A1'),
            _subjectScoreRow('Science (Physics/Chem/Bio)', '92/100', 'A1'),
            _subjectScoreRow('English Language & Lit', '88/100', 'A2'),
            _subjectScoreRow('Social Science', '90/100', 'A1'),
            _subjectScoreRow('Hindi Course A', '91/100', 'A1'),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: const Color(0xFF064E3B), borderRadius: BorderRadius.circular(10)),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Aggregate Score: 456/500 (91.2%)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  Text('Rank: #3', style: TextStyle(color: Color(0xFF6EE7B7), fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Widget _subjectScoreRow(String subject, String marks, String grade) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(subject, style: const TextStyle(color: Colors.white70)),
          Row(
            children: [
              Text(marks, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: Colors.indigo, borderRadius: BorderRadius.circular(4)),
                child: Text(grade, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
