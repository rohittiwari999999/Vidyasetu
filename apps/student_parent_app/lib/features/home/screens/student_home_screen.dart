import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:core_shared/core_shared.dart';

class StudentHomeScreen extends ConsumerWidget {
  const StudentHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProfileProvider).value;

    return Scaffold(
      appBar: AppBar(
        title: const Text('VidyaSetu Student'),
        backgroundColor: const Color(0xFF064E3B),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Student Card
            Card(
              color: const Color(0xFF064E3B),
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
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(user?.name ?? 'Aarav Sharma', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                          Text(
                            '${user?.studentDetails?.grade ?? 'Class 10-A'} • Roll #${user?.studentDetails?.rollNumber ?? '12'}',
                            style: const TextStyle(color: Color(0xFF6EE7B7)),
                          ),
                          const Text('CBSE Affiliation #2130894', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Navigation Grid
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: [
                _navCard(context, Icons.book, 'Homework', '3 Assignments', '/homework', Colors.blue),
                _navCard(context, Icons.calendar_today, 'Attendance', '96.4% Present', '/attendance', Colors.emerald),
                _navCard(context, Icons.currency_rupee, 'Fees & Receipts', 'Q2 Paid / Q3 Due', '/fees', Colors.purple),
                _navCard(context, Icons.video_call, 'Live Class', 'Join Jitsi Room', '/home', Colors.rose),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _navCard(BuildContext context, IconData icon, String title, String subtitle, String route, MaterialColor color) {
    return InkWell(
      onTap: () => context.push(route),
      child: Card(
        color: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 36, color: color),
              const SizedBox(height: 8),
              Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 11)),
            ],
          ),
        ),
      ),
    );
  }
}
