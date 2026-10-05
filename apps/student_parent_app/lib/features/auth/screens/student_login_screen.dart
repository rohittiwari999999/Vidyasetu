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

  // Phone Auth State
  bool _isPhoneMode = false;
  final _otpController = TextEditingController();
  String? _verificationId;
  bool _otpSent = false;

  final List<String> _grades = [
    'Class 10-A',
    'Class 10-B',
    'Class 9-A',
    'Class 9-B',
    'Class 8-A',
    'Class 11-Science',
    'Class 12-Science',
  ];

  @override
  void dispose() {
    _studentNameController.dispose();
    _parentPhoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  // -------------------------------------------------------------
  // 1. GOOGLE SIGN IN FLOW
  // -------------------------------------------------------------
  Future<void> _handleGoogleSignIn() async {
    final studentName = _studentNameController.text.trim();
    final parentPhone = _parentPhoneController.text.trim();

    if (studentName.isEmpty) {
      _showToast('Please enter Student Name before logging in.');
      return;
    }

    setState(() {
      _isLoading = true;
      _loadingMessage = 'Connecting to Google Authentication...';
    });

    try {
      final authService = ref.read(authServiceProvider);
      final userCred = await authService.signInStudentWithGoogle(
        grade: _selectedGrade,
        parentPhone: parentPhone,
      );

      setState(() {
        _loadingMessage = 'Registering profile in Class Teacher approval queue...';
      });

      await authService.registerOrEnsurePendingStudent(
        user: userCred.user!,
        grade: _selectedGrade,
        studentName: studentName,
        parentPhone: parentPhone,
      );

      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/pending-approval');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showErrorDialog(e.toString());
      }
    }
  }

  // -------------------------------------------------------------
  // 2. MOBILE PHONE OTP FLOW
  // -------------------------------------------------------------
  Future<void> _handleSendOtp() async {
    final phone = _parentPhoneController.text.trim();
    if (phone.length < 10) {
      _showToast('Please enter a valid 10-digit mobile number.');
      return;
    }

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
            _showToast('OTP sent successfully!');
          }
        },
        onVerificationFailed: (e) {
          if (mounted) {
            setState(() => _isLoading = false);
            _showErrorDialog('SMS verification failed: ${e.message}');
          }
        },
        onAutoVerified: (credential) async {
          await _onPhoneCredentialVerified(credential);
        },
      );
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showErrorDialog(e.toString());
      }
    }
  }

  Future<void> _handleVerifyOtp() async {
    final smsCode = _otpController.text.trim();
    if (smsCode.length < 6 || _verificationId == null) {
      _showToast('Please enter complete 6-digit OTP.');
      return;
    }

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
        context.go('/pending-approval');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showErrorDialog(e.toString());
      }
    }
  }

  Future<void> _onPhoneCredentialVerified(PhoneAuthCredential credential) async {
    try {
      final userCred = await FirebaseAuth.instance.signInWithCredential(credential);
      final authService = ref.read(authServiceProvider);
      await authService.registerOrEnsurePendingStudent(
        user: userCred.user!,
        grade: _selectedGrade,
        studentName: _studentNameController.text.trim(),
        parentPhone: _parentPhoneController.text.trim(),
      );
      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/pending-approval');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showErrorDialog(e.toString());
      }
    }
  }

  void _showToast(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: const Color(0xFF10B981)),
    );
  }

  void _showErrorDialog(String msg) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Authentication Error', style: TextStyle(color: Colors.redAccent)),
        content: Text(msg, style: const TextStyle(color: Colors.white70)),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF334155)),
            child: const Text('OK'),
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
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // School Badge Header
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF064E3B),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.school, color: Color(0xFF6EE7B7), size: 16),
                          SizedBox(width: 8),
                          Text(
                            'VidyaSetu • CBSE Affiliation #2130894',
                            style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  const Center(
                    child: Text(
                      'Student & Parent Portal',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Center(
                    child: Text(
                      'Authenticate using Google or Mobile OTP.\nNew registrations undergo Class Teacher verification.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Student Profile Enrollment Details Card
                  Card(
                    color: const Color(0xFF1E293B),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Student Enrollment Details',
                            style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 14),

                          // Grade Dropdown
                          const Text('Select Academic Class:', style: TextStyle(color: Colors.grey, fontSize: 12)),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F172A),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF334155)),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedGrade,
                                isExpanded: true,
                                dropdownColor: const Color(0xFF1E293B),
                                items: _grades.map((grade) {
                                  return DropdownMenuItem(
                                    value: grade,
                                    child: Text(grade, style: const TextStyle(color: Colors.white)),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedGrade = val);
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Student Name
                          TextField(
                            controller: _studentNameController,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Student Full Name',
                              hintText: 'e.g. Aarav Sharma',
                              prefixIcon: const Icon(Icons.person, color: Colors.grey, size: 20),
                              labelStyle: const TextStyle(color: Colors.grey, fontSize: 13),
                              filled: true,
                              fillColor: const Color(0xFF0F172A),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Parent Phone
                          TextField(
                            controller: _parentPhoneController,
                            keyboardType: TextInputType.phone,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Parent Mobile Number',
                              hintText: '9876543210',
                              prefixText: '+91 ',
                              prefixStyle: const TextStyle(color: Colors.white70),
                              prefixIcon: const Icon(Icons.phone, color: Colors.grey, size: 20),
                              labelStyle: const TextStyle(color: Colors.grey, fontSize: 13),
                              filled: true,
                              fillColor: const Color(0xFF0F172A),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Authentication Options
                  if (!_isPhoneMode) ...[
                    // Button 1: Continue with Google (Gmail)
                    ElevatedButton.icon(
                      onPressed: _handleGoogleSignIn,
                      icon: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                        child: const Text('G', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 15)),
                      ),
                      label: const Text('Continue with Google (Gmail)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E293B),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 52),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: const BorderSide(color: Color(0xFF334155)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Button 2: Continue with Mobile Number (OTP)
                    ElevatedButton.icon(
                      onPressed: () => setState(() => _isPhoneMode = true),
                      icon: const Icon(Icons.phone_android, color: Colors.white),
                      label: const Text('Continue with Mobile Number (OTP)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF064E3B),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 52),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: const BorderSide(color: Color(0xFF10B981)),
                        ),
                      ),
                    ),
                  ] else ...[
                    // Phone OTP Mode
                    Card(
                      color: const Color(0xFF1E293B),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      child: Padding(
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Mobile OTP Verification', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                TextButton(
                                  onPressed: () => setState(() {
                                    _isPhoneMode = false;
                                    _otpSent = false;
                                  }),
                                  child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
                                ),
                              ],
                            ),
                            const Divider(color: Colors.white10),
                            if (!_otpSent) ...[
                              Text('We will send a 6-digit verification code to +91 ${_parentPhoneController.text}',
                                  style: const TextStyle(color: Colors.grey, fontSize: 13)),
                              const SizedBox(height: 14),
                              ElevatedButton(
                                onPressed: _handleSendOtp,
                                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                                child: const Text('Send SMS OTP'),
                              ),
                            ] else ...[
                              const Text('Enter 6-Digit OTP:', style: TextStyle(color: Colors.grey, fontSize: 13)),
                              const SizedBox(height: 8),
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
                              const SizedBox(height: 10),
                              ElevatedButton(
                                onPressed: _handleVerifyOtp,
                                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                                child: const Text('Verify & Submit for Approval'),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],

                  const SizedBox(height: 24),
                  const Center(
                    child: Text(
                      'Protected by 256-bit SSL • Official VidyaSetu School Network',
                      style: TextStyle(color: Colors.white30, fontSize: 11),
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
                        _loadingMessage ?? 'Authenticating...',
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
}
