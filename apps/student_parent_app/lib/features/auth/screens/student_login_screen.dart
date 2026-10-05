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
  final _phoneController = TextEditingController();
  final _nameController = TextEditingController(text: 'Aarav Sharma');
  final _otpController = TextEditingController();
  String _selectedGrade = 'Class 10-A';
  bool _isPhoneMode = false;
  bool _otpSent = false;
  String? _verificationId;
  bool _isLoading = false;
  String? _loadingMsg;

  final List<String> _grades = [
    'Class 9-A',
    'Class 9-B',
    'Class 10-A',
    'Class 10-B',
    'Class 11-Science',
    'Class 11-Commerce',
    'Class 12-Science',
    'Class 12-Commerce',
  ];

  @override
  void dispose() {
    _phoneController.dispose();
    _nameController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  // --- GOOGLE SIGN IN FLOW ---
  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isLoading = true;
      _loadingMsg = 'Signing in with Google account...';
    });

    try {
      final authService = ref.read(authServiceProvider);
      final isAlreadyApproved = await authService.signInOrRegisterStudentWithGoogle(
        grade: _selectedGrade,
        parentPhone: _phoneController.text.trim(),
      );

      if (mounted) {
        setState(() => _isLoading = false);
        if (isAlreadyApproved) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Welcome back! Logging into Student Portal...'), backgroundColor: Color(0xFF10B981)),
          );
          context.go('/home');
        } else {
          context.go('/waiting-room');
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Authentication error: ${e.toString()}'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  // --- PHONE OTP FLOW ---
  Future<void> _handleSendOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid 10-digit mobile number')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _loadingMsg = 'Sending OTP to +91 $phone...';
    });

    final authService = ref.read(authServiceProvider);
    try {
      await authService.sendPhoneOtp(
        phoneNumber: phone,
        onCodeSent: (verificationId, resendToken) {
          if (mounted) {
            setState(() {
              _isLoading = false;
              _verificationId = verificationId;
              _otpSent = true;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('OTP sent successfully! Please enter code.')),
            );
          }
        },
        onVerificationFailed: (e) {
          if (mounted) {
            setState(() => _isLoading = false);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('OTP Failed: ${e.message}'), backgroundColor: Colors.redAccent),
            );
          }
        },
        onAutoVerified: (credential) async {
          if (mounted) {
            setState(() {
              _isLoading = true;
              _loadingMsg = 'Auto-verifying and registering admission...';
            });
          }
          final cred = await FirebaseAuth.instance.signInWithCredential(credential);
          final isAlreadyApproved = await authService.signInOrRegisterStudentWithPhone(
            verificationId: '',
            smsCode: '',
            studentName: _nameController.text.trim(),
            grade: _selectedGrade,
          );
          if (mounted) {
            setState(() => _isLoading = false);
            if (isAlreadyApproved) {
              context.go('/home');
            } else {
              context.go('/waiting-room');
            }
          }
        },
      );
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.redAccent),
        );
      }
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

    setState(() {
      _isLoading = true;
      _loadingMsg = 'Verifying OTP & Admission Status...';
    });

    try {
      final authService = ref.read(authServiceProvider);
      final isAlreadyApproved = await authService.signInOrRegisterStudentWithPhone(
        verificationId: _verificationId!,
        smsCode: smsCode,
        studentName: _nameController.text.trim(),
        grade: _selectedGrade,
      );

      if (mounted) {
        setState(() => _isLoading = false);
        if (isAlreadyApproved) {
          context.go('/home');
        } else {
          context.go('/waiting-room');
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Verification error: ${e.toString()}'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: Stack(
        children: [
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 12),
                  // School Badge
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
                          Icon(Icons.school, color: Color(0xFF10B981), size: 16),
                          SizedBox(width: 8),
                          Text(
                            'Delhi Modern Academy • CBSE #2130894',
                            style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  const Center(
                    child: Text(
                      'VidyaSetu Student & Parent',
                      style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: -0.5),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Center(
                    child: Text(
                      'Access Homework, Live Classes, Attendance & Fees.\nNew logins require Class Teacher approval.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Student Details Form
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Student Profile Details',
                          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),

                        // Student Name
                        TextField(
                          controller: _nameController,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            labelText: 'Student Full Name',
                            labelStyle: const TextStyle(color: Colors.grey),
                            prefixIcon: const Icon(Icons.person, color: Color(0xFF10B981), size: 20),
                            filled: true,
                            fillColor: const Color(0xFF0F172A),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Grade Dropdown
                        const Text('Enrolled Grade / Class:', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
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
                              items: _grades.map((g) {
                                return DropdownMenuItem(
                                  value: g,
                                  child: Text(g, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _selectedGrade = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  if (!_isPhoneMode) ...[
                    // Button 1: Continue with Google (Gmail)
                    ElevatedButton.icon(
                      onPressed: _handleGoogleSignIn,
                      icon: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                        child: const Text('G', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 14)),
                      ),
                      label: const Text('Continue with Google (Gmail)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E293B),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 52),
                        side: const BorderSide(color: Color(0xFF475569)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Button 2: Continue with Mobile Number
                    ElevatedButton.icon(
                      onPressed: () => setState(() => _isPhoneMode = true),
                      icon: const Icon(Icons.phone_android, color: Colors.white, size: 20),
                      label: const Text('Continue with Mobile Number (OTP)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF064E3B),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 52),
                        side: const BorderSide(color: Color(0xFF10B981)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ] else ...[
                    // Mobile OTP View
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF10B981)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          if (!_otpSent) ...[
                            TextField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              style: const TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                labelText: 'Parent / Student Mobile Number',
                                hintText: '9876543210',
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
                              icon: const Icon(Icons.sms),
                              label: const Text('Send SMS OTP'),
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
                              style: const TextStyle(color: Colors.white, letterSpacing: 8, fontSize: 22, fontWeight: FontWeight.bold),
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
                              child: const Text('Verify OTP & Proceed', style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                          ],
                          const SizedBox(height: 10),
                          TextButton(
                            onPressed: () => setState(() {
                              _isPhoneMode = false;
                              _otpSent = false;
                            }),
                            child: const Text('← Switch to Google Sign-In', style: TextStyle(color: Colors.grey)),
                          ),
                        ],
                      ),
                    ),
                  ],

                  const SizedBox(height: 24),
                  // Security Notice
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B).withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.lock_clock, color: Color(0xFFF59E0B), size: 18),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Your admission is verified by your Class Teacher before full dashboard access is unlocked.',
                            style: TextStyle(color: Colors.grey, fontSize: 11, height: 1.3),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Fullscreen Loading Overlay
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
                        _loadingMsg ?? 'Authenticating...',
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
