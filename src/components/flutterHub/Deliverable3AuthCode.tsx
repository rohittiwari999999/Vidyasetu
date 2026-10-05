import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Code2, Lock, Users, KeyRound, Database } from 'lucide-react';

export const Deliverable3AuthCode: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login_screen' | 'auth_service' | 'staff_mgmt' | 'rules_schema' | 'model'>('login_screen');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const codeRoleLoginScreen = `// File: apps/school_management_app/lib/features/auth/screens/staff_role_selection_login_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:core_shared/core_shared.dart';

class StaffRoleSelectionLoginScreen extends ConsumerStatefulWidget {
  const StaffRoleSelectionLoginScreen({super.key});

  @override
  ConsumerState<StaffRoleSelectionLoginScreen> createState() =>
      _StaffRoleSelectionLoginScreenState();
}

class _StaffRoleSelectionLoginScreenState
    extends ConsumerState<StaffRoleSelectionLoginScreen> {
  bool _isLoading = false;
  String? _loadingMessage;

  void _showRoleLoginBottomSheet(BuildContext context, StaffRole role) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => _RoleLoginModal(
        role: role,
        onStartLoading: (msg) {
          Navigator.pop(ctx);
          setState(() {
            _isLoading = true;
            _loadingMessage = msg;
          });
        },
        onEndLoading: () {
          if (mounted) setState(() { _isLoading = false; _loadingMessage = null; });
        },
        onLoginSuccess: (verifiedStaff) {
          if (mounted) {
            setState(() { _isLoading = false; _loadingMessage = null; });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Welcome \${verifiedStaff.name}! Authorized as \${verifiedStaff.role.displayName}.'),
                backgroundColor: const Color(0xFF10B981),
              ),
            );
            context.go('/dashboard');
          }
        },
        onLoginError: (errorMsg) {
          if (mounted) {
            setState(() { _isLoading = false; _loadingMessage = null; });
            _showAccessDeniedDialog(context, errorMsg);
          }
        },
      ),
    );
  }

  void _showAccessDeniedDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: const [
            Icon(Icons.shield_outlined, color: Colors.redAccent, size: 28),
            SizedBox(width: 10),
            Text('Access Denied', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Text(message, style: const TextStyle(color: Colors.white70, fontSize: 14, height: 1.4)),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF334155)),
            child: const Text('Understood'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: Stack(
        children: [
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF334155)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.verified_user, color: Color(0xFF10B981), size: 16),
                          SizedBox(width: 6),
                          Text('CBSE Affiliation #2130894 • Closed RBAC System',
                              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Center(
                    child: Text('VidyaSetu Staff Portal',
                        style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                  const SizedBox(height: 6),
                  const Center(
                    child: Text(
                      'Select your authorized role to authenticate.\\nOpen registration is strictly prohibited.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // 1. Management / Admin
                  _roleCard(StaffRole.admin, 'Management / Admin', 'Full institution control, staff access & financial audit.', Icons.admin_panel_settings, const Color(0xFF6366F1), 'Super Admin'),
                  const SizedBox(height: 14),

                  // 2. Principal
                  _roleCard(StaffRole.principal, 'Principal', 'Academic oversight, staff supervision & circular broadcasts.', Icons.school, const Color(0xFF10B981), 'Academic Head'),
                  const SizedBox(height: 14),

                  // 3. Class Teacher
                  _roleCard(StaffRole.classTeacher, 'Class Teacher', 'Daily attendance register, student roll verification & homework.', Icons.co_present, const Color(0xFFF59E0B), 'Class Incharge'),
                  const SizedBox(height: 14),

                  // 4. General Teachers
                  _roleCard(StaffRole.generalTeacher, 'General Teachers', 'Subject syllabus, worksheets, marks entry & student feedback.', Icons.menu_book, const Color(0xFF06B6D4), 'Faculty'),
                ],
              ),
            ),
          ),
          if (_isLoading)
            Container(
              color: Colors.black87,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CircularProgressIndicator(color: Color(0xFF10B981)),
                      const SizedBox(height: 16),
                      Text(_loadingMessage ?? 'Verifying with School Admin Database...', style: const TextStyle(color: Colors.white, fontSize: 13)),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _roleCard(StaffRole role, String title, String sub, IconData icon, Color color, String badge) {
    return Card(
      color: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18), side: BorderSide(color: color.withOpacity(0.3))),
      child: InkWell(
        onTap: () => _showRoleLoginBottomSheet(context, role),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Row(
            children: [
              CircleAvatar(backgroundColor: color.withOpacity(0.15), child: Icon(icon, color: color)),
              const SizedBox(width: 16),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text(sub, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                ]),
              ),
              const Icon(Icons.arrow_forward_ios, color: Colors.grey, size: 14),
            ],
          ),
        ),
      ),
    );
  }
}`;

  const codeAuthService = `// File: packages/core_shared/lib/services/auth_service.dart
// STRICT PRE-VERIFIED AUTHENTICATION ENGINE (Google Sign-In + Phone Auth OTP)
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';

class StaffAuthException implements Exception {
  final String message;
  const StaffAuthException(this.message);
  @override
  String toString() => message;
}

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: ['email', 'profile']);

  // 1. STRICT PRE-VERIFIED CHECK (Firestore: 'verified_staff')
  Future<VerifiedStaffModel?> checkPreVerifiedStaff({String? email, String? phone}) async {
    // Check Email
    if (email != null && email.trim().isNotEmpty) {
      final query = await _firestore
          .collection('verified_staff')
          .where('email', isEqualTo: email.trim().toLowerCase())
          .where('isActive', isEqualTo: true)
          .limit(1)
          .get();
      if (query.docs.isNotEmpty) {
        return VerifiedStaffModel.fromFirestore(query.docs.first);
      }
    }

    // Check Phone (with or without +91)
    if (phone != null && phone.trim().isNotEmpty) {
      final clean = phone.trim().replaceAll(RegExp(r'[\\\\s-]'), '');
      final p1 = clean.startsWith('+91') ? clean.substring(3) : clean;
      final p2 = clean.startsWith('+91') ? clean : '+91\$clean';

      final query = await _firestore
          .collection('verified_staff')
          .where('phone', whereIn: [p1, p2])
          .where('isActive', isEqualTo: true)
          .limit(1)
          .get();
      if (query.docs.isNotEmpty) {
        return VerifiedStaffModel.fromFirestore(query.docs.first);
      }
    }
    return null;
  }

  // 2. GOOGLE SIGN IN
  Future<UserCredential> signInWithGoogle() async {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) throw const StaffAuthException('Google Sign-In was cancelled.');
    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
    final AuthCredential credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );
    return await _auth.signInWithCredential(credential);
  }

  // 3. FIREBASE PHONE AUTH WITH OTP
  Future<void> sendPhoneOtp({
    required String phoneNumber,
    required void Function(String verificationId, int? resendToken) onCodeSent,
    required void Function(FirebaseAuthException e) onVerificationFailed,
    required void Function(PhoneAuthCredential credential) onAutoVerified,
  }) async {
    String formatted = phoneNumber.trim();
    if (!formatted.startsWith('+')) formatted = '+91\$formatted';
    await _auth.verifyPhoneNumber(
      phoneNumber: formatted,
      verificationCompleted: onAutoVerified,
      verificationFailed: onVerificationFailed,
      codeSent: onCodeSent,
      codeAutoRetrievalTimeout: (_) {},
      timeout: const Duration(seconds: 60),
    );
  }

  Future<UserCredential> verifyOtpAndSignIn({required String verificationId, required String smsCode}) async {
    final credential = PhoneAuthProvider.credential(verificationId: verificationId, smsCode: smsCode);
    return await _auth.signInWithCredential(credential);
  }

  // 4. CRITICAL: PRE-VERIFICATION ENFORCEMENT & INSTANT LOGOUT
  Future<VerifiedStaffModel> verifyAndAuthorizeStaff({
    required User user,
    required StaffRole requestedRole,
  }) async {
    final staffRecord = await checkPreVerifiedStaff(
      email: user.email,
      phone: user.phoneNumber,
    );

    // If NOT found in pre-verified database -> INSTANT LOGOUT
    if (staffRecord == null) {
      await _auth.signOut();
      await _googleSignIn.signOut();
      throw const StaffAuthException(
        'Access Denied: You are not verified by the Admin. Open registration is prohibited for school staff.',
      );
    }

    // If role does NOT match the button clicked -> INSTANT LOGOUT
    if (staffRecord.role != requestedRole) {
      await _auth.signOut();
      await _googleSignIn.signOut();
      throw StaffAuthException(
        'Access Denied: You are not authorized for this role.\\nYour assigned role is "\${staffRecord.role.displayName}", but you selected "\${requestedRole.displayName}".',
      );
    }

    // If deactivated -> INSTANT LOGOUT
    if (!staffRecord.isActive) {
      await _auth.signOut();
      await _googleSignIn.signOut();
      throw const StaffAuthException('Access Revoked: Your staff account has been deactivated by the Administration.');
    }

    // Upsert into users collection with verified role
    await _firestore.collection('users').doc(user.uid).set({
      'name': staffRecord.name.isNotEmpty ? staffRecord.name : (user.displayName ?? 'Staff'),
      'email': staffRecord.email.isNotEmpty ? staffRecord.email : (user.email ?? ''),
      'phone': staffRecord.phone.isNotEmpty ? staffRecord.phone : (user.phoneNumber ?? ''),
      'role': staffRecord.role == StaffRole.admin ? 'manager' : (staffRecord.role == StaffRole.principal ? 'principal' : 'teacher'),
      'staffRole': staffRecord.role.name,
      'status': 'approved',
      'assignedClass': staffRecord.assignedClass,
      'lastLoginAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    return staffRecord;
  }
}`;

  const codeStaffMgmt = `// File: apps/school_management_app/lib/features/admin/screens/staff_access_management_screen.dart
// ADMIN SUPERPOWERS: Add Email/Phone, Assign Role, Instant Revoke & Delete
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';

class StaffAccessManagementScreen extends ConsumerStatefulWidget {
  const StaffAccessManagementScreen({super.key});

  @override
  ConsumerState<StaffAccessManagementScreen> createState() => _StaffAccessManagementScreenState();
}

class _StaffAccessManagementScreenState extends ConsumerState<StaffAccessManagementScreen> {
  final String _schoolId = 'vidyasetu_main';

  void _showAddStaffDialog(BuildContext context) {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final phoneController = TextEditingController();
    final classController = TextEditingController(text: 'Class 10-A');
    StaffRole selectedRole = StaffRole.classTeacher;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Pre-Verify New Staff', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Staff Name')),
              TextField(controller: emailController, decoration: const InputDecoration(labelText: 'Google Email ID')),
              TextField(controller: phoneController, decoration: const InputDecoration(labelText: 'Mobile Number (OTP)')),
              DropdownButton<StaffRole>(
                value: selectedRole,
                items: StaffRole.values.map((r) => DropdownMenuItem(value: r, child: Text(r.displayName))).toList(),
                onChanged: (r) => setDialogState(() => selectedRole = r!),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                await ref.read(authServiceProvider).addVerifiedStaff(VerifiedStaffModel(
                  id: '',
                  name: nameController.text.trim(),
                  email: emailController.text.trim(),
                  phone: phoneController.text.trim(),
                  role: selectedRole,
                  assignedClass: selectedRole == StaffRole.classTeacher ? classController.text.trim() : '',
                  schoolId: _schoolId,
                  createdAt: DateTime.now(),
                ));
                if (context.mounted) Navigator.pop(ctx);
              },
              child: const Text('Save & Authorize Staff'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(title: const Text('Staff Access Management (RBAC)'), backgroundColor: const Color(0xFF1E293B)),
      body: StreamBuilder<List<VerifiedStaffModel>>(
        stream: ref.watch(authServiceProvider).getVerifiedStaffStream(schoolId: _schoolId),
        builder: (context, snapshot) {
          final list = snapshot.data ?? [];
          return ListView.builder(
            itemCount: list.length,
            itemBuilder: (context, i) {
              final staff = list[i];
              return ListTile(
                title: Text(staff.name, style: const TextStyle(color: Colors.white)),
                subtitle: Text('\${staff.role.displayName} • \${staff.email.isNotEmpty ? staff.email : staff.phone}'),
                trailing: Switch(
                  value: staff.isActive,
                  onChanged: (val) => ref.read(authServiceProvider).toggleStaffStatus(staff.id, staff.isActive),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddStaffDialog(context),
        label: const Text('Add Staff'),
        icon: const Icon(Icons.add),
      ),
    );
  }
}`;

  const codeRulesSchema = `// File: firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() { return request.auth != null; }
    function getUserData() { return get(/databases/\$(database)/documents/users/\$(request.auth.uid)).data; }
    function isSuperAdmin() {
      return isAuthenticated() && (
        getUserData().role == 'manager' || 
        getUserData().staffRole == 'admin' ||
        request.auth.token.email == 'sarita.abhinav.t9@gmail.com'
      );
    }
    function isStaff() {
      return isAuthenticated() && (
        getUserData().role in ['manager', 'principal', 'teacher'] ||
        getUserData().staffRole in ['admin', 'principal', 'classTeacher', 'generalTeacher']
      );
    }

    // STRICT PRE-VERIFIED STAFF ACCESS RULES
    match /verified_staff/{staffId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isSuperAdmin();
    }

    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isStaff());
      allow write: if isAuthenticated() && (request.auth.uid == userId || isSuperAdmin());
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Strict Closed RBAC & Authentication Suite
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pre-Verified Staff Authentication (Google & Phone OTP)
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Open registration is strictly prohibited. Users authenticate via Google or Phone OTP and are checked against the pre-approved <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">verified_staff</code> collection in Firestore. If their credentials are not found or their assigned role does not match, they are instantly logged out with an Access Denied alert.
        </p>
      </div>

      {/* Code Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('login_screen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'login_screen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              1. Front Page Role Selection UI
            </button>
            <button
              onClick={() => setActiveTab('auth_service')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'auth_service' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              2. Strict Pre-Verification Logic
            </button>
            <button
              onClick={() => setActiveTab('staff_mgmt')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'staff_mgmt' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              3. Admin Staff Access Management
            </button>
            <button
              onClick={() => setActiveTab('rules_schema')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'rules_schema' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              4. Firestore Rules & Schema
            </button>
          </div>

          <button
            onClick={() => {
              const codeMap: Record<string, string> = {
                login_screen: codeRoleLoginScreen,
                auth_service: codeAuthService,
                staff_mgmt: codeStaffMgmt,
                rules_schema: codeRulesSchema,
                model: codeRoleLoginScreen,
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
          {activeTab === 'login_screen' && <pre>{codeRoleLoginScreen}</pre>}
          {activeTab === 'auth_service' && <pre>{codeAuthService}</pre>}
          {activeTab === 'staff_mgmt' && <pre>{codeStaffMgmt}</pre>}
          {activeTab === 'rules_schema' && <pre>{codeRulesSchema}</pre>}
        </div>
      </div>
    </div>
  );
};
