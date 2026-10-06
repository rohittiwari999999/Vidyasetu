import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';

class StaffAccessManagementScreen extends ConsumerStatefulWidget {
  const StaffAccessManagementScreen({super.key});

  @override
  ConsumerState<StaffAccessManagementScreen> createState() =>
      _StaffAccessManagementScreenState();
}

class _StaffAccessManagementScreenState
    extends ConsumerState<StaffAccessManagementScreen> {
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
          title: Row(
            children: const [
              Icon(Icons.person_add_alt_1, color: Color(0xFF10B981)),
              SizedBox(width: 10),
              Text('Pre-Verify New Staff', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Staff member will be authorized to log in via Google or Phone OTP matching these credentials.',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: _inputDeco('Full Name', 'e.g. Mrs. Sunita Verma', Icons.person),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: const TextStyle(color: Colors.white),
                  decoration: _inputDeco('Official Email ID (Google Login)', 'e.g. sunita.teacher@gmail.com', Icons.email),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(color: Colors.white),
                  decoration: _inputDeco('Mobile Number (Phone OTP)', 'e.g. 9876543210', Icons.phone),
                ),
                const SizedBox(height: 16),
                const Text('Assign Strict Role:', style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<StaffRole>(
                      value: selectedRole,
                      isExpanded: true,
                      dropdownColor: const Color(0xFF1E293B),
                      items: StaffRole.values.map((role) {
                        return DropdownMenuItem(
                          value: role,
                          child: Text(role.displayName, style: const TextStyle(color: Colors.white)),
                        );
                      }).toList(),
                      onChanged: (newRole) {
                        if (newRole != null) {
                          setDialogState(() => selectedRole = newRole);
                        }
                      },
                    ),
                  ),
                ),
                if (selectedRole == StaffRole.classTeacher) ...[
                  const SizedBox(height: 12),
                  TextField(
                    controller: classController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _inputDeco('Assigned Class', 'e.g. Class 10-A', Icons.class_),
                  ),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              onPressed: () async {
                final name = nameController.text.trim();
                final email = emailController.text.trim();
                final phone = phoneController.text.trim();

                if (name.isEmpty || (email.isEmpty && phone.isEmpty)) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Please provide Name and either Email or Phone!')),
                  );
                  return;
                }

                final newStaff = VerifiedStaffModel(
                  id: '',
                  name: name,
                  email: email,
                  phone: phone,
                  role: selectedRole,
                  assignedClass: selectedRole == StaffRole.classTeacher ? classController.text.trim() : '',
                  schoolId: _schoolId,
                  isActive: true,
                  addedBy: 'Admin',
                  createdAt: DateTime.now(),
                );

                await ref.read(authServiceProvider).addVerifiedStaff(newStaff);
                if (context.mounted) {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Authorized $name as ${selectedRole.displayName}!'),
                      backgroundColor: const Color(0xFF10B981),
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
              child: const Text('Save & Authorize Staff'),
            ),
          ],
        ),
      ),
    );
  }

  InputDecoration _inputDeco(String label, String hint, IconData icon) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      prefixIcon: Icon(icon, color: Colors.grey, size: 20),
      labelStyle: const TextStyle(color: Colors.grey, fontSize: 13),
      hintStyle: const TextStyle(color: Colors.white24, fontSize: 12),
      filled: true,
      fillColor: const Color(0xFF0F172A),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
    );
  }

  void _editStaffDialog(BuildContext context, VerifiedStaffModel staff) {
    final phoneController = TextEditingController(text: staff.phone);
    final emailController = TextEditingController(text: staff.email);
    final nameController = TextEditingController(text: staff.name);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: const [
            Icon(Icons.edit, color: Color(0xFF10B981), size: 22),
            SizedBox(width: 8),
            Text('Change Mobile Number', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDeco('Staff Name', 'Name', Icons.person),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDeco('Mobile Number (For OTP)', 'e.g. 9876543210', Icons.phone),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: emailController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDeco('Email ID (For Google Login)', 'email', Icons.email),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              await ref.read(authServiceProvider).updateVerifiedStaff(
                staff.id,
                name: nameController.text.trim(),
                phone: phoneController.text.trim(),
                email: emailController.text.trim(),
              );
              if (context.mounted) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Mobile number updated!'), backgroundColor: Color(0xFF10B981)),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
            child: const Text('Update'),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, VerifiedStaffModel staff) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Revoke & Delete Access?', style: TextStyle(color: Colors.white)),
        content: Text(
          'Are you sure you want to permanently delete pre-verified access for ${staff.name} (${staff.role.displayName})?\nThey will immediately be blocked from logging in.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              await ref.read(authServiceProvider).deleteVerifiedStaff(staff.id);
              if (context.mounted) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Revoked and deleted access for ${staff.name}!'), backgroundColor: Colors.redAccent),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            child: const Text('Delete Access'),
          ),
        ],
      ),
    );
  }

  Future<void> _seedDefaultStaff() async {
    final authService = ref.read(authServiceProvider);
    
    // Admin
    await authService.addVerifiedStaff(VerifiedStaffModel(
      id: '',
      name: 'Abhinav Tiwari (Super Admin)',
      email: 'sarita.abhinav.t9@gmail.com',
      phone: '+919670708847',
      role: StaffRole.admin,
      schoolId: _schoolId,
      createdAt: DateTime.now(),
    ));

    // Principal
    await authService.addVerifiedStaff(VerifiedStaffModel(
      id: '',
      name: 'Dr. R.K. Mishra (Principal)',
      email: 'principal@vidyasetu.in',
      phone: '9876500001',
      role: StaffRole.principal,
      schoolId: _schoolId,
      createdAt: DateTime.now(),
    ));

    // Class Teacher
    await authService.addVerifiedStaff(VerifiedStaffModel(
      id: '',
      name: 'Mrs. Sunita Verma',
      email: 'sunita.verma@vidyasetu.in',
      phone: '9876500002',
      role: StaffRole.classTeacher,
      assignedClass: 'Class 10-A',
      schoolId: _schoolId,
      createdAt: DateTime.now(),
    ));

    // General Teacher
    await authService.addVerifiedStaff(VerifiedStaffModel(
      id: '',
      name: 'Mr. Rajesh Pandey (Physics)',
      email: 'rajesh.pandey@vidyasetu.in',
      phone: '9876500003',
      role: StaffRole.generalTeacher,
      schoolId: _schoolId,
      createdAt: DateTime.now(),
    ));

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Seeded 4 default verified staff roles!'), backgroundColor: Colors.teal),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authService = ref.watch(authServiceProvider);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('Staff Access Management', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1E293B),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_moderator, color: Color(0xFF10B981)),
            tooltip: 'Add Verified Staff',
            onPressed: () => _showAddStaffDialog(context),
          ),
        ],
      ),
      body: StreamBuilder<List<VerifiedStaffModel>>(
        stream: authService.getVerifiedStaffStream(schoolId: _schoolId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
          }

          final staffList = snapshot.data ?? [];

          if (staffList.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.shield_outlined, size: 64, color: Colors.grey),
                    const SizedBox(height: 16),
                    const Text(
                      'No Verified Staff Found',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Staff members must be pre-approved here before they can log in via Google or Phone OTP.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => _showAddStaffDialog(context),
                      icon: const Icon(Icons.person_add),
                      label: const Text('Add First Staff Member'),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                    ),
                    const SizedBox(height: 12),
                    TextButton.icon(
                      onPressed: _seedDefaultStaff,
                      icon: const Icon(Icons.auto_fix_high, size: 18),
                      label: const Text('Seed 4 Demo Roles (Admin, Principal, Teacher)'),
                      style: TextButton.styleFrom(foregroundColor: const Color(0xFF6EE7B7)),
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: staffList.length,
            itemBuilder: (context, index) {
              final staff = staffList[index];
              return _staffCard(staff);
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddStaffDialog(context),
        icon: const Icon(Icons.person_add),
        label: const Text('Add Staff'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  Widget _staffCard(VerifiedStaffModel staff) {
    Color roleColor;
    switch (staff.role) {
      case StaffRole.admin:
        roleColor = const Color(0xFF6366F1);
        break;
      case StaffRole.principal:
        roleColor = const Color(0xFF10B981);
        break;
      case StaffRole.classTeacher:
        roleColor = const Color(0xFFF59E0B);
        break;
      case StaffRole.generalTeacher:
        roleColor = const Color(0xFF06B6D4);
        break;
    }

    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: staff.isActive ? roleColor.withOpacity(0.3) : Colors.redAccent.withOpacity(0.4)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: roleColor.withOpacity(0.2),
                  child: Text(
                    staff.name.isNotEmpty ? staff.name[0] : 'S',
                    style: TextStyle(color: roleColor, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        staff.name,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: roleColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              staff.role.displayName,
                              style: TextStyle(color: roleColor, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                          if (staff.assignedClass.isNotEmpty) ...[
                            const SizedBox(width: 6),
                            Text(
                              '• ${staff.assignedClass}',
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                // Toggle Active Switch
                Switch(
                  value: staff.isActive,
                  activeColor: const Color(0xFF10B981),
                  onChanged: (val) {
                    ref.read(authServiceProvider).toggleStaffStatus(staff.id, staff.isActive);
                  },
                ),
              ],
            ),
            const Divider(color: Colors.white10, height: 20),
            Row(
              children: [
                if (staff.email.isNotEmpty)
                  Expanded(
                    child: Row(
                      children: [
                        const Icon(Icons.email_outlined, size: 14, color: Colors.grey),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            staff.email,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ),
                if (staff.phone.isNotEmpty)
                  Expanded(
                    child: Row(
                      children: [
                        const Icon(Icons.phone_outlined, size: 14, color: Colors.grey),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            staff.phone,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ),
                IconButton(
                  icon: const Icon(Icons.edit_outlined, color: Color(0xFF10B981), size: 20),
                  tooltip: 'Change Mobile Number',
                  onPressed: () => _editStaffDialog(context, staff),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                  tooltip: 'Revoke Access',
                  onPressed: () => _confirmDelete(context, staff),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
