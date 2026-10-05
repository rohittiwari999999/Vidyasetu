import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Code2, FileCode, CheckCircle2 } from 'lucide-react';

export const Deliverable3AuthCode: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'model' | 'service' | 'router' | 'screen'>('router');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const codeUserModel = `// File: packages/core_shared/lib/models/user_model.dart
import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole { manager, principal, teacher, student, parent }
enum ApprovalStatus { pending, approved, rejected }

class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final UserRole role;
  final String schoolId;
  final ApprovalStatus status;
  final String? rejectionReason;
  final StudentDetails? studentDetails;
  final TeacherDetails? teacherDetails;
  final List<String> deviceTokens;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    required this.schoolId,
    required this.status,
    this.rejectionReason,
    this.studentDetails,
    this.teacherDetails,
    this.deviceTokens = const [],
    required this.createdAt,
  });

  bool get isApproved => status == ApprovalStatus.approved;
  bool get isPending => status == ApprovalStatus.pending;
  bool get isStaff => role == UserRole.manager || role == UserRole.principal || role == UserRole.teacher;

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      id: doc.id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      phone: data['phone'] ?? '',
      role: UserRole.values.firstWhere(
        (e) => e.name == data['role'],
        orElse: () => UserRole.student,
      ),
      schoolId: data['schoolId'] ?? '',
      status: ApprovalStatus.values.firstWhere(
        (e) => e.name == data['status'],
        orElse: () => ApprovalStatus.pending,
      ),
      rejectionReason: data['rejectionReason'],
      studentDetails: data['studentDetails'] != null
          ? StudentDetails.fromMap(data['studentDetails'])
          : null,
      teacherDetails: data['teacherDetails'] != null
          ? TeacherDetails.fromMap(data['teacherDetails'])
          : null,
      deviceTokens: List<String>.from(data['deviceTokens'] ?? []),
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role.name,
      'schoolId': schoolId,
      'status': status.name,
      'rejectionReason': rejectionReason,
      'studentDetails': studentDetails?.toMap(),
      'teacherDetails': teacherDetails?.toMap(),
      'deviceTokens': deviceTokens,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}

class StudentDetails {
  final String studentId;
  final String admissionNumber; // SRN
  final String rollNumber;
  final String grade; // e.g. "Class 10-A"
  final String parentName;
  final String parentPhone;

  StudentDetails({
    required this.studentId,
    required this.admissionNumber,
    required this.rollNumber,
    required this.grade,
    required this.parentName,
    required this.parentPhone,
  });

  factory StudentDetails.fromMap(Map<String, dynamic> map) {
    return StudentDetails(
      studentId: map['studentId'] ?? '',
      admissionNumber: map['admissionNumber'] ?? 'PENDING',
      rollNumber: map['rollNumber'] ?? '',
      grade: map['grade'] ?? '',
      parentName: map['parentName'] ?? '',
      parentPhone: map['parentPhone'] ?? '',
    );
  }

  Map<String, dynamic> toMap() => {
    'studentId': studentId,
    'admissionNumber': admissionNumber,
    'rollNumber': rollNumber,
    'grade': grade,
    'parentName': parentName,
    'parentPhone': parentPhone,
  };
}`;

  const codeAuthService = `// File: packages/core_shared/lib/services/auth_service.dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';

final authServiceProvider = Provider<AuthService>((ref) => AuthService());

final authStateChangesProvider = StreamProvider<User?>((ref) {
  return ref.watch(authServiceProvider).authStateChanges;
});

final currentUserProfileProvider = StreamProvider<UserModel?>((ref) {
  final authUser = ref.watch(authStateChangesProvider).value;
  if (authUser == null) return Stream.value(null);
  return ref.watch(authServiceProvider).userProfileStream(authUser.uid);
});

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Stream<UserModel?> userProfileStream(String uid) {
    return _firestore.collection('users').doc(uid).snapshots().map((doc) {
      if (!doc.exists) return null;
      return UserModel.fromFirestore(doc);
    });
  }

  /// Student / Parent self-registration
  /// CRITICAL: status is always forced to 'pending' upon creation!
  Future<UserModel> registerStudent({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String grade,
    required String parentName,
    required String parentPhone,
    required String schoolId,
  }) async {
    final userCred = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    final uid = userCred.user!.uid;

    final newUser = UserModel(
      id: uid,
      name: name,
      email: email,
      phone: phone,
      role: UserRole.student,
      schoolId: schoolId,
      status: ApprovalStatus.pending, // Gated until Class Teacher verifies!
      studentDetails: StudentDetails(
        studentId: '',
        admissionNumber: 'PENDING_VERIFICATION',
        rollNumber: '',
        grade: grade,
        parentName: parentName,
        parentPhone: parentPhone,
      ),
      createdAt: DateTime.now(),
    );

    await _firestore.collection('users').doc(uid).set(newUser.toMap());
    return newUser;
  }

  Future<void> signIn({required String email, required String password}) async {
    await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}`;

  const codeRoleRouter = `// File: apps/student_parent_app/lib/routes/student_router.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import '../features/auth/screens/student_login_screen.dart';
import '../features/auth/pending_gate/pending_approval_gate_screen.dart';
import '../features/home/screens/student_home_screen.dart';
import '../features/homework/screens/my_homework_screen.dart';
import '../features/live_classes/screens/join_live_classroom_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final userProfileAsync = ref.watch(currentUserProfileProvider);

  return GoRouter(
    initialLocation: '/login',
    redirect: (BuildContext context, GoRouterState state) {
      if (userProfileAsync.isLoading) return null;

      final user = userProfileAsync.value;
      final isLoggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/signup';

      // 1. If not authenticated, go to login
      if (user == null) {
        return isLoggingIn ? null : '/login';
      }

      // 2. If student/parent account is in PENDING APPROVAL status
      if (user.isPending) {
        return '/pending-approval';
      }

      // 3. If account was rejected by Principal/Teacher
      if (user.status == ApprovalStatus.rejected) {
        return '/rejected';
      }

      // 4. Role enforcement guard
      if (user.role != UserRole.student && user.role != UserRole.parent) {
        // Prevent staff from using student app or vice-versa
        return '/unauthorized-app';
      }

      // 5. Approved student successfully authenticated
      if (isLoggingIn || state.matchedLocation == '/pending-approval') {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const StudentLoginScreen(),
      ),
      GoRoute(
        path: '/pending-approval',
        builder: (context, state) => const PendingApprovalGateScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const StudentHomeScreen(),
      ),
      GoRoute(
        path: '/homework',
        builder: (context, state) => const MyHomeworkScreen(),
      ),
      GoRoute(
        path: '/live-class',
        builder: (context, state) => const JoinLiveClassroomScreen(),
      ),
    ],
  );
});`;

  const codePendingScreen = `// File: apps/student_parent_app/lib/features/auth/pending_gate/pending_approval_gate_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';

class PendingApprovalGateScreen extends ConsumerWidget {
  const PendingApprovalGateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProfileProvider).value;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.amber.withOpacity(0.4), width: 2),
                ),
                child: const Icon(Icons.access_time_filled, color: Colors.amber, size: 40),
              ),
              const SizedBox(height: 24),
              const Text(
                'Admission Verification Pending',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Dear \${user?.name ?? 'Student'}, your admission profile for \${user?.studentDetails?.grade ?? 'Class'} has been submitted to Delhi Modern Academy.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14, height: 1.5),
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: Column(
                  children: [
                    _infoRow('Status', 'Pending Class Teacher Approval', Colors.amber),
                    const Divider(color: Color(0xFF334155), height: 20),
                    _infoRow('Registered Grade', user?.studentDetails?.grade ?? 'N/A', Colors.white),
                    const Divider(color: Color(0xFF334155), height: 20),
                    _infoRow('Parent Phone', user?.phone ?? 'N/A', Colors.white),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: () {
                  // Re-triggers the stream check
                  ref.invalidate(currentUserProfileProvider);
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Check Approval Status'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1), // Indigo
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => ref.read(authServiceProvider).signOut(),
                child: const Text('Sign Out / Switch Account', style: TextStyle(color: Color(0xFF94A3B8))),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value, Color valueColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.between,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
        Text(value, style: TextStyle(color: valueColor, fontWeight: FontWeight.bold, fontSize: 13)),
      ],
    );
  }
}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Deliverable 3 of 5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Authentication Flow & Role-Based Routing Code
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Production Flutter code implementing the exact requested feature: when a student/parent signs up, they enter the <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">ApprovalStatus.pending</code> state. The GoRouter redirect engine intercepts their session and renders the <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">PendingApprovalGateScreen</code> until authorized by Staff.
        </p>
      </div>

      {/* Code Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('router')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'router' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              student_router.dart (GoRouter)
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'service' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              auth_service.dart (Firebase)
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'model' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              user_model.dart (RBAC)
            </button>
            <button
              onClick={() => setActiveTab('screen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'screen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              pending_gate_screen.dart
            </button>
          </div>

          <button
            onClick={() => {
              const codeMap = {
                router: codeRoleRouter,
                service: codeAuthService,
                model: codeUserModel,
                screen: codePendingScreen,
              };
              copyToClipboard(codeMap[activeTab], activeTab);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedKey === activeTab ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === activeTab ? 'Copied Dart Code!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[520px] overflow-y-auto">
          {activeTab === 'router' && <pre>{codeRoleRouter}</pre>}
          {activeTab === 'service' && <pre>{codeAuthService}</pre>}
          {activeTab === 'model' && <pre>{codeUserModel}</pre>}
          {activeTab === 'screen' && <pre>{codePendingScreen}</pre>}
        </div>
      </div>
    </div>
  );
};
