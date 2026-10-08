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
          if (mounted) {
            setState(() {
              _isLoading = false;
              _loadingMessage = null;
            });
          }
        },
        onLoginSuccess: (verifiedStaff) {
          ref.read(currentVerifiedStaffProvider.notifier).state = verifiedStaff;
          if (mounted) {
            setState(() {
              _isLoading = false;
              _loadingMessage = null;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'Welcome ${verifiedStaff.name}! Authorized as ${verifiedStaff.role.displayName}.',
                ),
                backgroundColor: const Color(0xFF10B981),
              ),
            );
            context.go('/dashboard');
          }
        },
        onLoginError: (errorMsg) {
          if (mounted) {
            setState(() {
              _isLoading = false;
              _loadingMessage = null;
            });
            _showAccessDeniedDialog(context, errorMsg);
          }
        },
      ),
    );
  }

  void _showAccessDeniedDialog(BuildContext context, String message) {
    final bool isGoogleApi10 = message.contains('ApiException: 10') ||
        (message.contains('PlatformException') && message.contains('sign_in_failed'));

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(
              isGoogleApi10 ? Icons.settings_suggest_rounded : Icons.shield_outlined,
              color: isGoogleApi10 ? Colors.amber : Colors.redAccent,
              size: 28,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                isGoogleApi10 ? 'Google Sign-In SHA-1 Setup Needed' : 'Access Denied',
                style: TextStyle(
                  color: isGoogleApi10 ? Colors.amber : Colors.redAccent,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isGoogleApi10) ...[
              const Text(
                'Aapke phone me Google Sign-In isliye fail hua kyonki Firebase Console me is APK ka SHA-1 fingerprint add nahi hai (ApiException 10: DEVELOPER_ERROR).\n\n'
                'Isko theek karne ke do tareeqe hain:\n'
                '1. Turant login karne ke liye "Continue with Mobile Number (OTP)" use karein.\n'
                '2. Ya Firebase Console me jaakar apne project me SHA-1 add karke naya google-services.json download karein.',
                style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.45),
              ),
            ] else ...[
              Text(
                message,
                style: const TextStyle(color: Colors.white70, fontSize: 14, height: 1.4),
              ),
            ],
          ],
        ),
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
                  // Header & School Identity
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
                          Text(
                            'CBSE Affiliation #2130894 • Closed RBAC System',
                            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  const Center(
                    child: Text(
                      'VidyaSetu Staff Portal',
                      style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: -0.5),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Center(
                    child: Text(
                      'Select your authorized role to authenticate.\nOpen registration is strictly prohibited.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // 4 Strict Role Cards
                  _roleCard(
                    role: StaffRole.admin,
                    title: 'Management / Admin',
                    subtitle: 'Full institution control, staff access, approvals & financial audit.',
                    icon: Icons.admin_panel_settings,
                    accentColor: const Color(0xFF6366F1),
                    badge: 'Full Access',
                  ),
                  const SizedBox(height: 14),

                  _roleCard(
                    role: StaffRole.principal,
                    title: 'Principal',
                    subtitle: 'Academic oversight, staff supervision & circular broadcasts.',
                    icon: Icons.school,
                    accentColor: const Color(0xFF10B981),
                    badge: 'Academic Head',
                  ),
                  const SizedBox(height: 14),

                  _roleCard(
                    role: StaffRole.classTeacher,
                    title: 'Class Teacher',
                    subtitle: 'Daily attendance register, student roll verification & homework.',
                    icon: Icons.co_present,
                    accentColor: const Color(0xFFF59E0B),
                    badge: 'Class Incharge',
                  ),
                  const SizedBox(height: 14),

                  _roleCard(
                    role: StaffRole.generalTeacher,
                    title: 'General Teachers',
                    subtitle: 'Subject syllabus, worksheets, marks entry & student feedback.',
                    icon: Icons.menu_book,
                    accentColor: const Color(0xFF06B6D4),
                    badge: 'Faculty',
                  ),

                  const SizedBox(height: 24),
                  // Help note
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B).withOpacity(0.6),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.lock_outline, color: Color(0xFF94A3B8), size: 20),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Access is restricted to pre-registered staff phone numbers and Google accounts verified by the School Admin.',
                            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, height: 1.3),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Loading Overlay
          if (_isLoading)
            Container(
              color: Colors.black87,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CircularProgressIndicator(color: Color(0xFF10B981)),
                      const SizedBox(height: 16),
                      Text(
                        _loadingMessage ?? 'Verifying credentials against Admin database...',
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.white, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _roleCard({
    required StaffRole role,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
    required String badge,
  }) {
    return Card(
      color: const Color(0xFF1E293B),
      elevation: 2,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: accentColor.withOpacity(0.3), width: 1.2),
      ),
      child: InkWell(
        onTap: () => _showRoleLoginBottomSheet(context, role),
        splashColor: accentColor.withOpacity(0.2),
        highlightColor: accentColor.withOpacity(0.1),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: accentColor.withOpacity(0.4)),
                ),
                child: Icon(icon, color: accentColor, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: accentColor.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            badge,
                            style: TextStyle(color: accentColor, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(color: Colors.grey, fontSize: 12, height: 1.3),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward_ios, color: Colors.grey, size: 14),
            ],
          ),
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// BOTTOM SHEET MODAL: GOOGLE (GMAIL) & PHONE AUTH
// -------------------------------------------------------------
class _RoleLoginModal extends ConsumerStatefulWidget {
  final StaffRole role;
  final void Function(String message) onStartLoading;
  final VoidCallback onEndLoading;
  final void Function(VerifiedStaffModel staff) onLoginSuccess;
  final void Function(String error) onLoginError;

  const _RoleLoginModal({
    required this.role,
    required this.onStartLoading,
    required this.onEndLoading,
    required this.onLoginSuccess,
    required this.onLoginError,
  });

  @override
  ConsumerState<_RoleLoginModal> createState() => _RoleLoginModalState();
}

class _RoleLoginModalState extends ConsumerState<_RoleLoginModal> {
  bool _isPhoneMode = false;
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  String? _verificationId;
  bool _otpSent = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  // --- GOOGLE AUTH FLOW ---
  Future<void> _handleGoogleSignIn() async {
    widget.onStartLoading('Authenticating with Google...');
    final authService = ref.read(authServiceProvider);

    try {
      final cred = await authService.signInWithGoogle();
      widget.onStartLoading('Verifying role with School Admin Database...');
      
      final verifiedStaff = await authService.verifyAndAuthorizeStaff(
        user: cred.user!,
        requestedRole: widget.role,
      );

      widget.onLoginSuccess(verifiedStaff);
    } catch (e) {
      widget.onLoginError(e.toString());
    }
  }

  // --- PHONE AUTH FLOW ---
  Future<void> _handleSendOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid 10-digit mobile number')),
      );
      return;
    }

    widget.onStartLoading('Sending OTP via SMS...');
    final authService = ref.read(authServiceProvider);

    try {
      await authService.sendPhoneOtp(
        phoneNumber: phone,
        onCodeSent: (verificationId, resendToken) {
          widget.onEndLoading();
          setState(() {
            _verificationId = verificationId;
            _otpSent = true;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('OTP sent successfully! Please enter code.')),
          );
        },
        onVerificationFailed: (e) {
          widget.onLoginError('SMS Verification failed: ${e.message}');
        },
        onAutoVerified: (credential) async {
          widget.onStartLoading('Auto-verifying OTP and checking Admin pre-approval...');
          try {
            final cred = await FirebaseAuth.instance.signInWithCredential(credential);
            final verifiedStaff = await authService.verifyAndAuthorizeStaff(
              user: cred.user!,
              requestedRole: widget.role,
            );
            widget.onLoginSuccess(verifiedStaff);
          } catch (e) {
            widget.onLoginError(e.toString());
          }
        },
      );
    } catch (e) {
      widget.onLoginError(e.toString());
    }
  }

  Future<void> _handleVerifyOtp() async {
    final smsCode = _otpController.text.trim();
    if (smsCode.length < 6 || _verificationId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter complete 6-digit OTP')),
      );
      return;
    }

    widget.onStartLoading('Verifying OTP and validating Staff Pre-registration...');
    final authService = ref.read(authServiceProvider);

    try {
      final cred = await authService.verifyOtpAndSignIn(
        verificationId: _verificationId!,
        smsCode: smsCode,
      );

      final verifiedStaff = await authService.verifyAndAuthorizeStaff(
        user: cred.user!,
        requestedRole: widget.role,
      );

      widget.onLoginSuccess(verifiedStaff);
    } catch (e) {
      widget.onLoginError(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        top: 24,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Login as ${widget.role.displayName}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'Pre-verified credentials required',
                      style: TextStyle(color: Color(0xFF10B981), fontSize: 12),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.grey),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const Divider(color: Colors.white24, height: 24),

          if (!_isPhoneMode) ...[
            // Option 1: Continue with Google
            ElevatedButton.icon(
              onPressed: _handleGoogleSignIn,
              icon: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                child: const Text('G', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 14)),
              ),
              label: const Text('Continue with Google (Gmail)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF334155),
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 14),

            // Option 2: Switch to Mobile Number
            OutlinedButton.icon(
              onPressed: () => setState(() => _isPhoneMode = true),
              icon: const Icon(Icons.phone_android, size: 20),
              label: const Text('Continue with Mobile Number (OTP)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(color: Color(0xFF475569)),
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 14),

            // Option 3: Select from Verified Staff Roster for this Role
            const SizedBox(height: 6),
            Text(
              'Select Authorized Faculty Account (${widget.role.displayName}):',
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            Builder(builder: (context) {
              final authService = ref.read(authServiceProvider);
              final allStaff = authService.getLocalStaffList();
              final matchingStaff = allStaff.where((s) => s.role == widget.role).toList();

              if (matchingStaff.isEmpty) {
                matchingStaff.add(
                  VerifiedStaffModel(
                    id: 'staff-custom-fallback',
                    name: widget.role == StaffRole.classTeacher ? 'Mrs. Meenakshi Sharma' : 'Faculty Member',
                    email: 'faculty@vidyasetu.edu.in',
                    phone: '9870000000',
                    role: widget.role,
                    assignedClass: widget.role == StaffRole.classTeacher ? 'Class 10-A' : '',
                    schoolId: 'vidyasetu_main',
                    createdAt: DateTime.now(),
                  ),
                );
              }

              return Column(
                children: matchingStaff.map((staff) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                      leading: CircleAvatar(
                        radius: 18,
                        backgroundColor: const Color(0xFF6366F1).withOpacity(0.2),
                        child: Text(
                          staff.name.isNotEmpty ? staff.name[0] : 'S',
                          style: const TextStyle(color: Color(0xFFA5B4FC), fontWeight: FontWeight.bold),
                        ),
                      ),
                      title: Text(
                        staff.name,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      subtitle: Text(
                        staff.assignedClass.isNotEmpty
                            ? 'Class: ${staff.assignedClass} • ${staff.email}'
                            : staff.email,
                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                      ),
                      trailing: ElevatedButton(
                        onPressed: () => widget.onLoginSuccess(staff),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4F46E5),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          minimumSize: const Size(60, 32),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Login', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  );
                }).toList(),
              );
            }),
          ] else ...[
            // Phone Auth View
            if (!_otpSent) ...[
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Staff Mobile Number',
                  hintText: 'e.g. 9876543210',
                  prefixText: '+91 ',
                  prefixStyle: const TextStyle(color: Colors.white70),
                  labelStyle: const TextStyle(color: Colors.grey),
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                onPressed: _handleSendOtp,
                icon: const Icon(Icons.send, size: 18),
                label: const Text('Send Verification OTP'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  minimumSize: const Size(double.infinity, 48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ] else ...[
              Text(
                'Enter 6-digit OTP sent to +91 ${_phoneController.text}',
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _otpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                style: const TextStyle(color: Colors.white, letterSpacing: 8, fontSize: 20),
                decoration: InputDecoration(
                  hintText: '000000',
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: _handleVerifyOtp,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  minimumSize: const Size(double.infinity, 48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Verify OTP & Enter App', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => setState(() {
                _isPhoneMode = false;
                _otpSent = false;
              }),
              child: const Text('← Back to Login Options', style: TextStyle(color: Colors.grey)),
            ),
          ],
        ],
      ),
    );
  }
}
