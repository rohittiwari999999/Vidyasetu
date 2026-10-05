import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Lock, Users, KeyRound, Database, Hourglass, CheckCircle2, UserCheck } from 'lucide-react';

export const Deliverable3AuthCode: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'student_login' | 'waiting_room' | 'teacher_approval' | 'auth_service' | 'staff_login' | 'rules_schema'
  >('student_login');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const codeStudentLogin = `// File: apps/student_parent_app/lib/features/auth/screens/student_login_screen.dart
// STUDENT / PARENT AUTHENTICATION: Google Sign-In & Mobile Phone OTP
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:core_shared/core_shared.dart';

class StudentLoginScreen extends ConsumerStatefulWidget {
  const StudentLoginScreen({super.key});

  @override
  ConsumerState<StudentLoginScreen> createState() => _StudentLoginScreenState();
}

class _StudentLoginScreenState extends ConsumerState<StudentLoginScreen> {
  final _studentNameController = TextEditingController(text: 'Aarav Sharma');
  final _parentPhoneController = TextEditingController(text: '9876543210');
  String _selectedGrade = 'Class 10-A';

  bool _isLoading = false;
  String? _loadingMessage;

  // Phone Auth state
  bool _isPhoneMode = false;
  final _otpController = TextEditingController();
  String? _verificationId;
  bool _otpSent = false;

  final List<String> _grades = [
    'Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B',
    'Class 8-A', 'Class 11-Science', 'Class 12-Science'
  ];

  @override
  void dispose() {
    _studentNameController.dispose();
    _parentPhoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  // 1. GOOGLE SIGN IN
  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isLoading = true;
      _loadingMessage = 'Connecting to Google Authentication...';
    });

    try {
      final authService = ref.read(authServiceProvider);
      final userCred = await authService.signInStudentWithGoogle(
        grade: _selectedGrade,
        parentPhone: _parentPhoneController.text.trim(),
      );

      await authService.registerOrEnsurePendingStudent(
        user: userCred.user!,
        grade: _selectedGrade,
        studentName: _studentNameController.text.trim(),
        parentPhone: _parentPhoneController.text.trim(),
      );

      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/pending-approval'); // Redirect to Waiting Room
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showError(e.toString());
      }
    }
  }

  // 2. MOBILE PHONE OTP FLOW
  Future<void> _handleSendOtp() async {
    final phone = _parentPhoneController.text.trim();
    if (phone.length < 10) return;

    setState(() {
      _isLoading = true;
      _loadingMessage = 'Sending 6-digit OTP via SMS...';
    });

    try {
      final authService = ref.read(authServiceProvider);
      await authService.sendPhoneOtp(
        phoneNumber: phone,
        onCodeSent: (verificationId, resendToken) {
          if (mounted) {
            setState(() {
              _isLoading = false;
              _verificationId = verificationId;
              _otpSent = true;
            });
          }
        },
        onVerificationFailed: (e) {
          if (mounted) {
            setState(() => _isLoading = false);
            _showError(e.message ?? 'OTP failed');
          }
        },
        onAutoVerified: (credential) async {
          final cred = await FirebaseAuth.instance.signInWithCredential(credential);
          await authService.registerOrEnsurePendingStudent(
            user: cred.user!,
            grade: _selectedGrade,
            studentName: _studentNameController.text.trim(),
            parentPhone: _parentPhoneController.text.trim(),
          );
          if (mounted) context.go('/pending-approval');
        },
      );
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showError(e.toString());
      }
    }
  }

  Future<void> _handleVerifyOtp() async {
    final smsCode = _otpController.text.trim();
    if (smsCode.length < 6 || _verificationId == null) return;

    setState(() {
      _isLoading = true;
      _loadingMessage = 'Verifying OTP & Submitting for Teacher Approval...';
    });

    try {
      final authService = ref.read(authServiceProvider);
      final userCred = await authService.verifyOtpAndSignIn(
        verificationId: _verificationId!,
        smsCode: smsCode,
      );

      await authService.registerOrEnsurePendingStudent(
        user: userCred.user!,
        grade: _selectedGrade,
        studentName: _studentNameController.text.trim(),
        parentPhone: _parentPhoneController.text.trim(),
      );

      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/pending-approval'); // Redirect to Waiting Room
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showError(e.toString());
      }
    }
  }

  void _showError(String msg) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Authentication Error', style: TextStyle(color: Colors.redAccent)),
        content: Text(msg, style: const TextStyle(color: Colors.white70)),
        actions: [
          ElevatedButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Center(
                child: Text('VidyaSetu Student & Parent Portal',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              const SizedBox(height: 8),
              const Center(
                child: Text('Authenticate with Google or Mobile OTP.\\nNew accounts route to the Waiting Room for Teacher review.',
                    textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 13)),
              ),
              const SizedBox(height: 24),

              // Button 1: Google
              ElevatedButton.icon(
                onPressed: _handleGoogleSignIn,
                icon: const Text('G', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 18)),
                label: const Text('Continue with Google (Gmail)', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E293B),
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 14),

              // Button 2: Phone OTP
              ElevatedButton.icon(
                onPressed: () => setState(() => _isPhoneMode = true),
                icon: const Icon(Icons.phone_android),
                label: const Text('Continue with Mobile Number (OTP)', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF064E3B),
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`;

  const codeWaitingRoom = `// File: apps/student_parent_app/lib/features/auth/screens/pending_approval_gate_screen.dart
// REAL-TIME "WAITING ROOM" SCREEN (StreamBuilder auto-redirects on Class Teacher Approval)
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:core_shared/core_shared.dart';

class PendingApprovalGateScreen extends ConsumerStatefulWidget {
  const PendingApprovalGateScreen({super.key});

  @override
  ConsumerState<PendingApprovalGateScreen> createState() => _PendingApprovalGateScreenState();
}

class _PendingApprovalGateScreenState extends ConsumerState<PendingApprovalGateScreen> {
  bool _hasNavigated = false;

  void _onApprovedDetected(BuildContext context, String studentName) {
    if (_hasNavigated) return;
    _hasNavigated = true;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Approved! Welcome to VidyaSetu, \$studentName!'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
        context.go('/home'); // Unlocks Home Dashboard instantly!
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authUser = FirebaseAuth.instance.currentUser;
    if (authUser == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => context.go('/login'));
      return const SizedBox.shrink();
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
            final data = snapshot.data?.data() as Map<String, dynamic>? ?? {};
            final isApproved = data['isApproved'] == true || data['status'] == 'approved';
            final studentName = data['name'] ?? 'Student';
            final grade = data['studentDetails']?['grade'] ?? 'Class 10-A';

            // THE EXACT MOMENT THE TEACHER APPROVES -> INSTANT AUTO REDIRECT
            if (isApproved) {
              _onApprovedDetected(context, studentName);
              return const Center(
                child: CircularProgressIndicator(color: Color(0xFF10B981)),
              );
            }

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 80, height: 80,
                    decoration: BoxDecoration(color: Colors.amber.withOpacity(0.15), shape: BoxShape.circle),
                    child: const Icon(Icons.hourglass_top, color: Colors.amber, size: 40),
                  ),
                  const SizedBox(height: 20),
                  const Text('Verification in Progress',
                      style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text(
                    'Your account is pending verification.\\nPlease wait for your Class Teacher to approve your access.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(20)),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(width: 10, height: 10, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF10B981))),
                        SizedBox(width: 8),
                        Text('Live Listening: Waiting for Teacher Approval...', style: TextStyle(color: Color(0xFF10B981), fontSize: 12)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  TextButton.icon(
                    onPressed: () async {
                      await ref.read(authServiceProvider).signOut();
                      if (context.mounted) context.go('/login');
                    },
                    icon: const Icon(Icons.logout, color: Colors.grey),
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
}`;

  const codeTeacherApproval = `// File: apps/school_management_app/lib/features/approvals/screens/pending_approvals_screen.dart
// CLASS TEACHER APPROVAL SCREEN (Reviews pending students, assigns Roll/SRN, unlocks access)
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:core_shared/core_shared.dart';

class PendingApprovalsScreen extends ConsumerWidget {
  const PendingApprovalsScreen({super.key});

  Future<void> _approveStudent(BuildContext context, WidgetRef ref, String docId, String name, String grade) async {
    final rollCtrl = TextEditingController(text: '12');
    final admCtrl = TextEditingController(text: 'DMA-2026/1042');

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: Text('Enroll & Verify: \$name', style: const TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: rollCtrl, decoration: const InputDecoration(labelText: 'Roll Number')),
            const SizedBox(height: 10),
            TextField(controller: admCtrl, decoration: const InputDecoration(labelText: 'Admission No / SRN')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
            child: const Text('Confirm Approval & Grant Access'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(authServiceProvider).approveStudentByTeacher(
        studentId: docId,
        rollNumber: rollCtrl.text.trim(),
        admissionNumber: admCtrl.text.trim(),
        grade: grade,
      );
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Approved \$name! Their Waiting Room has unlocked.'), backgroundColor: Colors.green),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(title: const Text('New Student Approvals'), backgroundColor: const Color(0xFF1E293B)),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('users')
            .where('role', isEqualTo: 'student')
            .where('status', isEqualTo: 'pending')
            .snapshots(),
        builder: (context, snapshot) {
          final docs = snapshot.data?.docs ?? [];
          if (docs.isEmpty) {
            return const Center(child: Text('No pending student registrations! All clear.', style: TextStyle(color: Colors.grey)));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: docs.length,
            itemBuilder: (context, i) {
              final doc = docs[i];
              final data = doc.data() as Map<String, dynamic>;
              final name = data['name'] ?? 'Student';
              final grade = data['studentDetails']?['grade'] ?? 'Class 10-A';
              final phone = data['studentDetails']?['parentPhone'] ?? data['phone'] ?? '';

              return Card(
                color: const Color(0xFF1E293B),
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: ListTile(
                  title: Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  subtitle: Text('\$grade • Phone: \$phone', style: const TextStyle(color: Colors.grey)),
                  trailing: ElevatedButton(
                    onPressed: () => _approveStudent(context, ref, doc.id, name, grade),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                    child: const Text('Approve'),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}`;

  const codeAuthService = `// File: packages/core_shared/lib/services/auth_service.dart
// STUDENT AUTH & CLASS TEACHER APPROVAL LOGIC
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // 1. Google Sign In for Students
  Future<UserCredential> signInStudentWithGoogle({String grade = 'Class 10-A', String parentPhone = ''}) async {
    final userCred = await signInWithGoogle();
    await registerOrEnsurePendingStudent(user: userCred.user!, grade: grade, parentPhone: parentPhone);
    return userCred;
  }

  // 2. Register to pending_students collection with isApproved: false
  Future<void> registerOrEnsurePendingStudent({
    required User user,
    String grade = 'Class 10-A',
    String studentName = '',
    String parentPhone = '',
  }) async {
    final userDoc = await _firestore.collection('users').doc(user.uid).get();
    if (userDoc.exists && (userDoc.data()?['isApproved'] == true)) return;

    final studentData = {
      'id': user.uid,
      'name': studentName.isNotEmpty ? studentName : (user.displayName ?? 'Student'),
      'email': user.email ?? '',
      'phone': parentPhone,
      'role': 'student',
      'schoolId': 'vidyasetu_main',
      'isApproved': false,
      'status': 'pending',
      'studentDetails': {
        'grade': grade,
        'admissionNumber': 'PENDING_APPROVAL',
        'rollNumber': 'PENDING',
        'parentPhone': parentPhone,
      },
      'createdAt': FieldValue.serverTimestamp(),
    };

    await _firestore.collection('users').doc(user.uid).set(studentData, SetOptions(merge: true));
    await _firestore.collection('pending_students').doc(user.uid).set(studentData, SetOptions(merge: true));
  }

  // 3. Class Teacher Approval Action
  Future<void> approveStudentByTeacher({
    required String studentId,
    required String rollNumber,
    required String admissionNumber,
    required String grade,
  }) async {
    final updateData = {
      'status': 'approved',
      'isApproved': true,
      'studentDetails.rollNumber': rollNumber,
      'studentDetails.admissionNumber': admissionNumber,
      'approvedAt': FieldValue.serverTimestamp(),
    };

    // Update in users collection
    await _firestore.collection('users').doc(studentId).update(updateData);

    // Save in verified_students
    await _firestore.collection('verified_students').doc(studentId).set({
      'studentId': studentId,
      'rollNumber': rollNumber,
      'admissionNumber': admissionNumber,
      'grade': grade,
      'isApproved': true,
      'approvedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    // Update pending_students
    await _firestore.collection('pending_students').doc(studentId).update({'status': 'approved', 'isApproved': true});
  }
}`;

  const codeStaffLogin = `// File: apps/school_management_app/lib/features/auth/screens/staff_role_selection_login_screen.dart
// Strict Closed RBAC Staff Portal with pre-verified check against 'verified_staff' collection.`;

  const codeRulesSchema = `// File: firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isStaff() {
      return isAuthenticated() && (
        get(/databases/\$(database)/documents/users/\$(request.auth.uid)).data.role in ['manager', 'principal', 'teacher']
      );
    }

    match /pending_students/{studentId} {
      allow read, create: if isAuthenticated() && (request.auth.uid == studentId || isStaff());
      allow update, delete: if isStaff();
    }

    match /verified_students/{studentId} {
      allow read: if isAuthenticated();
      allow write: if isStaff();
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (request.auth.uid == userId || isStaff());
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Student/Parent & Teacher Approval Suite
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              OTP & Google Sign-In with Real-Time Waiting Room
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Students sign up via Google or Mobile OTP with <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">isApproved: false</code> and enter the Waiting Room. When the Class Teacher clicks Approve in the Management App, the student's StreamBuilder detects the change and navigates straight to the Home Dashboard!
        </p>
      </div>

      {/* Code Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('student_login')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'student_login' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              1. Student Login (Google & OTP)
            </button>
            <button
              onClick={() => setActiveTab('waiting_room')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'waiting_room' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <Hourglass className="w-3.5 h-3.5" />
              2. Waiting Room (StreamBuilder)
            </button>
            <button
              onClick={() => setActiveTab('teacher_approval')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'teacher_approval' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              3. Teacher Approval Screen
            </button>
            <button
              onClick={() => setActiveTab('auth_service')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'auth_service' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              4. Firebase Auth Service
            </button>
            <button
              onClick={() => setActiveTab('rules_schema')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'rules_schema' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              5. Firestore Rules
            </button>
          </div>

          <button
            onClick={() => {
              const codeMap: Record<string, string> = {
                student_login: codeStudentLogin,
                waiting_room: codeWaitingRoom,
                teacher_approval: codeTeacherApproval,
                auth_service: codeAuthService,
                staff_login: codeStaffLogin,
                rules_schema: codeRulesSchema,
              };
              copyToClipboard(codeMap[activeTab] || '', activeTab);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedKey === activeTab ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === activeTab ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[560px] overflow-y-auto">
          {activeTab === 'student_login' && <pre>{codeStudentLogin}</pre>}
          {activeTab === 'waiting_room' && <pre>{codeWaitingRoom}</pre>}
          {activeTab === 'teacher_approval' && <pre>{codeTeacherApproval}</pre>}
          {activeTab === 'auth_service' && <pre>{codeAuthService}</pre>}
          {activeTab === 'rules_schema' && <pre>{codeRulesSchema}</pre>}
        </div>
      </div>
    </div>
  );
};
