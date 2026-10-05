import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:core_shared/core_shared.dart';

class PendingApprovalsScreen extends ConsumerStatefulWidget {
  const PendingApprovalsScreen({super.key});

  @override
  ConsumerState<PendingApprovalsScreen> createState() =>
      _PendingApprovalsScreenState();
}

class _PendingApprovalsScreenState extends ConsumerState<PendingApprovalsScreen> {
  Future<void> _approveStudent({
    required BuildContext context,
    required String studentUid,
    required String name,
    required String grade,
  }) async {
    final rollController = TextEditingController(text: '12');
    final admController = TextEditingController(text: 'DMA-2026/1042');

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.verified_user, color: Color(0xFF10B981), size: 24),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Enroll & Verify: $name',
                style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Enrolling into $grade. Once approved, the student waiting room will unlock automatically in real time.',
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: rollController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Assign Class Roll Number',
                labelStyle: const TextStyle(color: Colors.grey),
                filled: true,
                fillColor: const Color(0xFF0F172A),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: admController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'CBSE / SRN Admission Number',
                labelStyle: const TextStyle(color: Colors.grey),
                filled: true,
                fillColor: const Color(0xFF0F172A),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
            child: const Text('Confirm & Approve Access'),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      final authService = ref.read(authServiceProvider);
      await authService.approveStudentByTeacher(
        studentUid: studentUid,
        rollNumber: rollController.text.trim(),
        admissionNumber: admController.text.trim(),
        grade: grade,
      );

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ Approved $name! Waiting room unlocked instantly.'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
      }
    }
  }

  // Helper to seed a test pending student request
  Future<void> _seedTestStudent() async {
    final docRef = FirebaseFirestore.instance.collection('pending_students').doc('test_student_aarav');
    final data = {
      'uid': 'test_student_aarav',
      'name': 'Aarav Sharma',
      'email': 'aarav.sharma@vidyasetu.in',
      'phone': '9876543210',
      'grade': 'Class 10-A',
      'parentName': 'Mrs. Vandana Sharma',
      'parentPhone': '+91 9876543210',
      'isApproved': false,
      'status': 'pending',
      'schoolId': 'vidyasetu_main',
      'role': 'student',
      'createdAt': FieldValue.serverTimestamp(),
    };

    await docRef.set(data);
    await FirebaseFirestore.instance.collection('users').doc('test_student_aarav').set({
      ...data,
      'studentDetails': {
        'grade': 'Class 10-A',
        'parentPhone': '+91 9876543210',
        'parentName': 'Mrs. Vandana Sharma',
        'admissionNumber': 'PENDING_APPROVAL',
        'rollNumber': '',
      },
    }, SetOptions(merge: true));

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Seeded pending student: Aarav Sharma (Class 10-A)'), backgroundColor: Colors.teal),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('New Student Approvals', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1E293B),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_alt, color: Color(0xFF10B981)),
            tooltip: 'Simulate New Student Request',
            onPressed: _seedTestStudent,
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        // Listens in real time to pending student logins
        stream: FirebaseFirestore.instance
            .collection('pending_students')
            .where('isApproved', isEqualTo: false)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
          }

          final docs = snapshot.data?.docs ?? [];

          if (docs.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withOpacity(0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check_circle_outline, color: Color(0xFF10B981), size: 40),
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'No Pending Student Registrations',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'All new student and parent sign-ins have been verified by the Class Teacher.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                    const SizedBox(height: 24),
                    OutlinedButton.icon(
                      onPressed: _seedTestStudent,
                      icon: const Icon(Icons.add),
                      label: const Text('Simulate Incoming Student Request'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF10B981),
                        side: const BorderSide(color: Color(0xFF10B981)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final doc = docs[index];
              final data = doc.data() as Map<String, dynamic>;
              final studentUid = doc.id;
              final name = data['name'] ?? 'New Student';
              final grade = data['grade'] ?? 'Class 10-A';
              final parentPhone = data['parentPhone'] ?? data['phone'] ?? '';
              final email = data['email'] ?? '';

              return Card(
                color: const Color(0xFF1E293B),
                margin: const EdgeInsets.only(bottom: 12),
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Color(0xFF334155)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 24,
                            backgroundColor: const Color(0xFF6366F1).withOpacity(0.2),
                            child: Text(
                              name.isNotEmpty ? name[0] : 'S',
                              style: const TextStyle(color: Color(0xFF818CF8), fontWeight: FontWeight.bold, fontSize: 18),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  name,
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                                const SizedBox(height: 2),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF064E3B),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    grade,
                                    style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 11, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton.icon(
                            onPressed: () => _approveStudent(
                              context: context,
                              studentUid: studentUid,
                              name: name,
                              grade: grade,
                            ),
                            icon: const Icon(Icons.check, size: 16),
                            label: const Text('Approve'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF10B981),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ],
                      ),
                      const Divider(color: Color(0xFF334155), height: 20),
                      Row(
                        children: [
                          if (parentPhone.isNotEmpty) ...[
                            const Icon(Icons.phone, size: 14, color: Colors.grey),
                            const SizedBox(width: 6),
                            Text(parentPhone, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                            const SizedBox(width: 16),
                          ],
                          if (email.isNotEmpty) ...[
                            const Icon(Icons.email, size: 14, color: Colors.grey),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                email,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(color: Colors.grey, fontSize: 12),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
