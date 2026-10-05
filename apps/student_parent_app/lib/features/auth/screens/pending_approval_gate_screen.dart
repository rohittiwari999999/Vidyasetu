import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:core_shared/core_shared.dart';

class PendingApprovalGateScreen extends ConsumerStatefulWidget {
  const PendingApprovalGateScreen({super.key});

  @override
  ConsumerState<PendingApprovalGateScreen> createState() =>
      _PendingApprovalGateScreenState();
}

class _PendingApprovalGateScreenState
    extends ConsumerState<PendingApprovalGateScreen> {
  bool _hasNavigated = false;

  void _onApprovedDetected(BuildContext context, String studentName) {
    if (_hasNavigated) return;
    _hasNavigated = true;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 10),
                Expanded(
                  child: Text('Approved! Welcome to VidyaSetu, $studentName!'),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
            duration: const Duration(seconds: 4),
          ),
        );
        context.go('/home');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authUser = FirebaseAuth.instance.currentUser;

    if (authUser == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.go('/login');
      });
      return const Scaffold(
        backgroundColor: Color(0xFF0F172A),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: StreamBuilder<DocumentSnapshot>(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(authUser.uid)
              .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Center(
                child: Text('Error: ${snapshot.error}',
                    style: const TextStyle(color: Colors.redAccent)),
              );
            }

            final data = snapshot.data?.data() as Map<String, dynamic>? ?? {};
            final isApproved = data['isApproved'] == true || data['status'] == 'approved';
            final studentName = data['name'] ?? authUser.displayName ?? 'Student';
            final studentDetails = data['studentDetails'] as Map<String, dynamic>?;
            final grade = studentDetails?['grade'] ?? 'Class 10-A';
            final phone = data['phone'] ?? authUser.phoneNumber ?? 'Registered';

            // AUTOMATIC REAL-TIME REDIRECT: the exact instant the teacher approves
            if (isApproved) {
              _onApprovedDetected(context, studentName);
              return const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(color: Color(0xFF10B981)),
                    SizedBox(height: 16),
                    Text(
                      'Teacher Approved! Unlocking Dashboard...',
                      style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              );
            }

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Animated Clock/Waiting Badge
                  Container(
                    width: 86,
                    height: 86,
                    decoration: BoxDecoration(
                      color: Colors.amber.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.amber, width: 2),
                    ),
                    child: const Icon(Icons.hourglass_top, color: Colors.amber, size: 44),
                  ),
                  const SizedBox(height: 24),

                  const Text(
                    'Verification in Progress',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Your account is pending verification.\nPlease wait for your Class Teacher to approve your access.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Color(0xFF94A3B8),
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Real-time listener pulse banner
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        SizedBox(
                          width: 10,
                          height: 10,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF10B981)),
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Live Listening: Waiting for Teacher Approval...',
                          style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Details Card
                  Card(
                    color: const Color(0xFF1E293B),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          _infoRow('Student Name', studentName, Colors.white),
                          const Divider(color: Color(0xFF334155), height: 22),
                          _infoRow('Target Grade', grade, const Color(0xFF6EE7B7)),
                          const Divider(color: Color(0xFF334155), height: 22),
                          _infoRow('Contact Phone', phone, Colors.white70),
                          const Divider(color: Color(0xFF334155), height: 22),
                          _infoRow('Status', 'Pending Teacher Approval', Colors.amber),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Sign Out Button
                  TextButton.icon(
                    onPressed: () async {
                      await ref.read(authServiceProvider).signOut();
                      if (context.mounted) {
                        context.go('/login');
                      }
                    },
                    icon: const Icon(Icons.logout, color: Colors.grey, size: 18),
                    label: const Text('Sign Out & Return to Login', style: TextStyle(color: Colors.grey)),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
        Text(value, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13)),
      ],
    );
  }
}
