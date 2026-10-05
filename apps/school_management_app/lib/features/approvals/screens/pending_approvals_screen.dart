import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:core_shared/core_shared.dart';

class PendingApprovalsScreen extends ConsumerWidget {
  const PendingApprovalsScreen({super.key});

  Future<void> _approveStudentDialog(
    BuildContext context,
    WidgetRef ref,
    String docId,
    String name,
    String grade,
    String phone,
  ) async {
    final rollController = TextEditingController(text: '12');
    final admController = TextEditingController(text: 'DMA-2026/1042');

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.verified_user, color: Color(0xFF10B981)),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Enroll Student: $name',
                style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Assign official school credentials for $grade. Approving will instantly unlock student/parent dashboard access.',
                style: const TextStyle(color: Colors.grey, fontSize: 12, height: 1.4),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: rollController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Class Roll Number',
                  hintText: 'e.g. 12',
                  prefixIcon: const Icon(Icons.pin, color: Colors.grey),
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
                  labelText: 'School SRN / Admission Number',
                  hintText: 'e.g. DMA-2026/1042',
                  prefixIcon: const Icon(Icons.badge, color: Colors.grey),
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton.icon(
            onPressed: () => Navigator.pop(ctx, true),
            icon: const Icon(Icons.check_circle, size: 18),
            label: const Text('Approve & Unlock App'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(authServiceProvider).approveStudentByTeacher(
        studentId: docId,
        rollNumber: rollController.text.trim(),
        admissionNumber: admController.text.trim(),
        grade: grade,
      );

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Successfully approved $name! Their Waiting Room has unlocked.'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
      }
    }
  }

  Future<void> _seedSamplePendingStudent(BuildContext context) async {
    final sampleId = 'sample_student_${DateTime.now().millisecondsSinceEpoch % 10000}';
    final sampleData = {
      'id': sampleId,
      'name': 'Aarav Sharma',
      'email': 'aarav.sharma@gmail.com',
      'phone': '9876543210',
      'role': 'student',
      'schoolId': 'vidyasetu_main',
      'isApproved': false,
      'status': 'pending',
      'studentDetails': {
        'studentId': sampleId,
        'admissionNumber': 'PENDING_APPROVAL',
        'rollNumber': 'PENDING',
        'grade': 'Class 10-A',
        'parentName': 'Vandana Sharma',
        'parentPhone': '9876543210',
      },
      'createdAt': FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
    };

    await FirebaseFirestore.instance.collection('users').doc(sampleId).set(sampleData);
    await FirebaseFirestore.instance.collection('pending_students').doc(sampleId).set(sampleData);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Created sample student registration: Aarav Sharma (Class 10-A)'), backgroundColor: Colors.teal),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('New Student Approvals', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1E293B),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_alt, color: Color(0xFF6EE7B7)),
            tooltip: 'Simulate Student Registration',
            onPressed: () => _seedSamplePendingStudent(context),
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('users')
            .where('role', isEqualTo: 'student')
            .where('status', isEqualTo: 'pending')
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
          }

          final docs = snapshot.data?.docs ?? [];
          if (docs.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(28.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF334155)),
                      ),
                      child: const Icon(Icons.done_all, size: 48, color: Color(0xFF10B981)),
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'All Student Registrations Cleared!',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'When students or parents sign up via Google or Mobile OTP in the Student App, their verification cards will appear here in real-time.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.4),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => _seedSamplePendingStudent(context),
                      icon: const Icon(Icons.add),
                      label: const Text('Simulate New Student Sign-Up'),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
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
              final name = data['name'] ?? 'Student';
              final studentDetails = data['studentDetails'] as Map<String, dynamic>?;
              final grade = studentDetails?['grade'] ?? 'Class 10-A';
              final parentPhone = studentDetails?['parentPhone'] ?? data['phone'] ?? '';
              final email = data['email'] ?? '';

              return Card(
                color: const Color(0xFF1E293B),
                margin: const EdgeInsets.only(bottom: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Color(0xFFF59E0B), width: 1.2),
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
                            backgroundColor: Colors.amber.withOpacity(0.2),
                            child: Text(
                              name.isNotEmpty ? name[0] : 'S',
                              style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 18),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      name,
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.amber.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Text(
                                        'Awaiting Approval',
                                        style: TextStyle(color: Colors.amber, fontSize: 10, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(grade, style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 13, fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Divider(color: Colors.white10, height: 20),
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
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => _approveStudentDialog(context, ref, doc.id, name, grade, parentPhone),
                              icon: const Icon(Icons.check, size: 18),
                              label: const Text('Review & Approve'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF10B981),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                            ),
                          ),
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
