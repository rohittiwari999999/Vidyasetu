import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import 'package:go_router/go_router.dart';
import '../../attendance/screens/attendance_register_screen.dart';
import '../../homework/screens/create_homework_screen.dart';
import '../../broadcast/screens/compose_broadcast_screen.dart';
import '../../approvals/screens/pending_approvals_screen.dart';
import '../../admin/screens/staff_access_management_screen.dart';
import '../../exams_ptm/screens/exam_marks_ptm_screen.dart';

class StaffDashboardScreen extends ConsumerWidget {
  final void Function(int tabIndex)? onNavigateTab;
  const StaffDashboardScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final verifiedStaff = ref.watch(currentVerifiedStaffProvider);
    final userProfile = ref.watch(currentUserProfileProvider).value;
    final authUser = ref.watch(authStateChangesProvider).value;

    final displayName = (verifiedStaff?.name.isNotEmpty == true)
        ? verifiedStaff!.name
        : (userProfile?.name.isNotEmpty == true
            ? userProfile!.name
            : (authUser?.displayName?.isNotEmpty == true
                ? authUser!.displayName!
                : (authUser?.email != null && authUser!.email!.isNotEmpty
                    ? authUser.email!.split('@').first.replaceAll('.', ' ').toUpperCase()
                    : (authUser?.phoneNumber ?? 'Faculty Member'))));

    final staffRoleStr = (verifiedStaff != null)
        ? verifiedStaff.role.displayName
        : (userProfile != null
            ? (userProfile.teacherDetails?.designation ?? userProfile.role.name.toUpperCase())
            : 'School Faculty');

    final assignedClassStr = (verifiedStaff?.assignedClass.isNotEmpty == true)
        ? verifiedStaff!.assignedClass
        : (userProfile?.teacherDetails?.assignedClass?.isNotEmpty == true
            ? userProfile!.teacherDetails!.assignedClass!
            : 'All Classes Access');

    final initial = displayName.trim().isNotEmpty
        ? displayName.trim()[0].toUpperCase()
        : 'S';

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('VidyaSetu Staff & Admin', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1E293B),
        actions: [
          IconButton(
            icon: const Icon(Icons.shield, color: Color(0xFF10B981)),
            tooltip: 'Staff Access (RBAC)',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const StaffAccessManagementScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            tooltip: 'Log Out / Switch Role',
            onPressed: () async {
              ref.read(currentVerifiedStaffProvider.notifier).state = null;
              await ref.read(authServiceProvider).signOut();
              if (context.mounted) {
                context.go('/login');
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Teacher Profile Banner
            Card(
              color: const Color(0xFF1E293B),
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: const Color(0xFF6366F1),
                      child: Text(initial, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(displayName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text('$staffRoleStr • $assignedClassStr', style: const TextStyle(color: Color(0xFFA5B4FC), fontSize: 13)),
                          const SizedBox(height: 2),
                          Text(
                            authUser?.email ?? authUser?.phoneNumber ?? 'VidyaSetu Academy • Affiliation #2130894',
                            style: const TextStyle(color: Colors.grey, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Key Daily Stats
            const Text('Today\'s Overview', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _statMiniCard('Total Students', '42', 'Class 10-A', const Color(0xFF3B82F6))),
                const SizedBox(width: 12),
                Expanded(child: _statMiniCard('Present Today', '40', '95.2% Attendance', const Color(0xFF10B981))),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _statMiniCard('Homework Due', '2', 'Math & Science', const Color(0xFFF59E0B))),
                const SizedBox(width: 12),
                Expanded(child: _statMiniCard('Approvals', '0', 'All verified', const Color(0xFF8B5CF6))),
              ],
            ),
            const SizedBox(height: 24),

            // Action Center Grid
            const Text('Administrative Modules', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              childAspectRatio: 1.15,
              children: [
                _actionCard(
                  title: 'Daily Attendance',
                  subtitle: 'Mark Roll & Absent SMS',
                  icon: Icons.checklist,
                  accentColor: const Color(0xFF10B981),
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(1);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const AttendanceRegisterScreen()));
                    }
                  },
                ),
                _actionCard(
                  title: 'Assign Homework',
                  subtitle: 'Upload PDF & Worksheets',
                  icon: Icons.assignment_outlined,
                  accentColor: const Color(0xFF6366F1),
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(2);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const CreateHomeworkScreen(assignedClass: 'Class 10-A')));
                    }
                  },
                ),
                _actionCard(
                  title: 'Send Broadcast',
                  subtitle: 'SMS, WhatsApp, Notice',
                  icon: Icons.campaign_outlined,
                  accentColor: const Color(0xFFF59E0B),
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(3);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const ComposeBroadcastScreen()));
                    }
                  },
                ),
                _actionCard(
                  title: 'Student Approvals',
                  subtitle: 'Verify SRN & Admission',
                  icon: Icons.how_to_reg_outlined,
                  accentColor: const Color(0xFF8B5CF6),
                  onTap: () {
                    if (onNavigateTab != null) {
                      onNavigateTab!(4);
                    } else {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const PendingApprovalsScreen()));
                    }
                  },
                ),
                _actionCard(
                  title: 'Fee Collection',
                  subtitle: 'Track Receipts & Dues',
                  icon: Icons.receipt_long_outlined,
                  accentColor: const Color(0xFFEC4899),
                  onTap: () {
                    _showFeeSummaryDialog(context);
                  },
                ),
                _actionCard(
                  title: 'Exam Marks & PTM',
                  subtitle: 'Term 1 Results Entry',
                  icon: Icons.grade_outlined,
                  accentColor: const Color(0xFF06B6D4),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const ExamMarksPtmScreen()));
                  },
                ),
                _actionCard(
                  title: 'Staff Access (RBAC)',
                  subtitle: 'Pre-verify Email & Phone',
                  icon: Icons.security,
                  accentColor: const Color(0xFF10B981),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const StaffAccessManagementScreen()));
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _statMiniCard(String label, String value, String sub, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border(left: BorderSide(color: color, width: 4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(sub, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _actionCard({
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
        splashColor: accentColor.withOpacity(0.25),
        highlightColor: accentColor.withOpacity(0.1),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 34, color: accentColor),
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

  void _showFeeSummaryDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Fee Collection Summary (Class 10-A)', style: TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Quarter 3 (Oct - Dec 2026)', style: TextStyle(color: Colors.grey)),
            SizedBox(height: 12),
            Text('• Total Dues: ₹ 6,09,000 (42 students)', style: TextStyle(color: Colors.white)),
            SizedBox(height: 6),
            Text('• Collected: ₹ 5,22,000 (36 paid)', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
            SizedBox(height: 6),
            Text('• Pending: ₹ 87,000 (6 students)', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Fee reminder SMS sent to 6 pending parents!'), backgroundColor: Colors.indigo),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
            child: const Text('Send Fee SMS Reminder'),
          ),
        ],
      ),
    );
  }

  void _showExamEntryDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Term 1 Assessment Entry', style: TextStyle(color: Colors.white)),
        content: const Text(
          'Class 10-A Term 1 Marks Register:\n\n• Mathematics: 42/42 entered\n• Science: 42/42 entered\n• English: 40/42 entered (2 pending verification)\n• Social Science: 42/42 entered',
          style: TextStyle(color: Colors.white70, height: 1.4),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Report cards published to Parent App!'), backgroundColor: Colors.teal),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
            child: const Text('Publish Report Cards'),
          ),
        ],
      ),
    );
  }
}
