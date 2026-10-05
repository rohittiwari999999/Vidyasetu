import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'staff_dashboard_screen.dart';
import '../../attendance/screens/attendance_register_screen.dart';
import '../../homework/screens/create_homework_screen.dart';
import '../../broadcast/screens/compose_broadcast_screen.dart';
import '../../approvals/screens/pending_approvals_screen.dart';

class StaffMainScaffold extends StatefulWidget {
  final int initialIndex;
  const StaffMainScaffold({super.key, this.initialIndex = 0});

  @override
  State<StaffMainScaffold> createState() => _StaffMainScaffoldState();
}

class _StaffMainScaffoldState extends State<StaffMainScaffold> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void _onTabSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      StaffDashboardScreen(onNavigateTab: _onTabSelected),
      const AttendanceRegisterScreen(),
      const CreateHomeworkScreen(assignedClass: 'Class 10-A'),
      const ComposeBroadcastScreen(),
      const PendingApprovalsScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onTabSelected,
        backgroundColor: const Color(0xFF1E293B),
        indicatorColor: const Color(0xFF312E81),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.dashboard, color: Color(0xFF818CF8)),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.checklist_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.checklist, color: Color(0xFF818CF8)),
            label: 'Attendance',
          ),
          NavigationDestination(
            icon: Icon(Icons.assignment_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.assignment, color: Color(0xFF818CF8)),
            label: 'Homework',
          ),
          NavigationDestination(
            icon: Icon(Icons.campaign_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.campaign, color: Color(0xFF818CF8)),
            label: 'Broadcast',
          ),
          NavigationDestination(
            icon: Icon(Icons.how_to_reg_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.how_to_reg, color: Color(0xFF818CF8)),
            label: 'Approvals',
          ),
        ],
      ),
    );
  }
}
