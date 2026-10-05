import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:core_shared/core_shared.dart';

class StudentWaitingRoomScreen extends ConsumerStatefulWidget {
  const StudentWaitingRoomScreen({super.key});

  @override
  ConsumerState<StudentWaitingRoomScreen> createState() =>
      _StudentWaitingRoomScreenState();
}

class _StudentWaitingRoomScreenState
    extends ConsumerState<StudentWaitingRoomScreen> {
  bool _hasRedirected = false;

  void _handleApprovalRedirect(BuildContext context) {
    if (_hasRedirected) return;
    _hasRedirected = true;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎉 Your admission has been APPROVED by your Class Teacher! Welcome to VidyaSetu.'),
            backgroundColor: Color(0xFF10B981),
            duration: Duration(seconds: 4),
          ),
        );
        context.go('/home');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = FirebaseAuth.instance.currentUser;
    final uid = currentUser?.uid;

    if (uid == null) {
      return Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Session expired. Please log in again.', style: TextStyle(color: Colors.white)),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                child: const Text('Back to Login'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: StreamBuilder<DocumentSnapshot>(
          // Real-time Firestore Stream listening to the user's document
          stream: FirebaseFirestore.instance.collection('users').doc(uid).snapshots(),
          builder: (context, snapshot) {
            if (snapshot.hasData && snapshot.data!.exists) {
              final data = snapshot.data!.data() as Map<String, dynamic>? ?? {};
              final isApproved = data['isApproved'] == true || data['status'] == 'approved';

              // THE EXACT MOMENT THE TEACHER APPROVES -> REDIRECT TO HOME!
              if (isApproved) {
                _handleApprovalRedirect(context);
              }
            }

            final data = snapshot.data?.data() as Map<String, dynamic>? ?? {};
            final studentName = data['name'] ?? currentUser.displayName ?? 'Student';
            final studentDetails = data['studentDetails'] as Map<String, dynamic>?;
            final grade = studentDetails?['grade'] ?? data['grade'] ?? 'Class 10-A';
            final parentPhone = studentDetails?['parentPhone'] ?? data['phone'] ?? currentUser.phoneNumber ?? '';

            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 20),

                  // Animated / Glowing Waiting Badge
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      color: Colors.amber.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.amber.withOpacity(0.5), width: 2.5),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.amber.withOpacity(0.2),
                          blurRadius: 24,
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                    child: const Icon(Icons.hourglass_top_rounded, color: Colors.amber, size: 44),
                  ),
                  const SizedBox(height: 28),

                  const Text(
                    'Your account is pending verification',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Please wait for your Class Teacher to approve your access.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Color(0xFF94A3B8),
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Real-time Status Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Column(
                      children: [
                        _statusRow(
                          label: 'Verification Status',
                          value: 'Awaiting Teacher Review',
                          color: Colors.amber,
                          icon: Icons.pending_actions,
                        ),
                        const Divider(color: Color(0xFF334155), height: 24),
                        _statusRow(
                          label: 'Student Name',
                          value: studentName,
                          color: Colors.white,
                          icon: Icons.person_outline,
                        ),
                        const Divider(color: Color(0xFF334155), height: 24),
                        _statusRow(
                          label: 'Enrolled Class',
                          value: grade,
                          color: const Color(0xFF6EE7B7),
                          icon: Icons.class_outlined,
                        ),
                        const Divider(color: Color(0xFF334155), height: 24),
                        _statusRow(
                          label: 'Registered Contact',
                          value: parentPhone.isNotEmpty ? parentPhone : 'Google Account',
                          color: Colors.white70,
                          icon: Icons.phone_android,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Live Listening Indicator
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F766E).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        SizedBox(
                          width: 10,
                          height: 10,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Color(0xFF10B981),
                          ),
                        ),
                        SizedBox(width: 10),
                        Text(
                          'Listening live for Class Teacher approval...',
                          style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 36),

                  // Logout Button
                  OutlinedButton.icon(
                    onPressed: () async {
                      await ref.read(authServiceProvider).signOut();
                      if (context.mounted) {
                        context.go('/login');
                      }
                    },
                    icon: const Icon(Icons.logout, size: 18),
                    label: const Text('Log Out / Switch Account'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF94A3B8),
                      side: const BorderSide(color: Color(0xFF334155)),
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _statusRow({
    required String label,
    required String value,
    required Color color,
    required IconData icon,
  }) {
    return Row(
      children: [
        Icon(icon, color: Colors.grey, size: 18),
        const SizedBox(width: 10),
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
        const Spacer(),
        Text(
          value,
          style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ],
    );
  }
}
