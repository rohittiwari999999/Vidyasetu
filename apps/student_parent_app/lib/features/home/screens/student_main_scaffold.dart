import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'student_home_screen.dart';
import '../../homework/screens/my_homework_screen.dart';
import '../../attendance/screens/attendance_calendar_screen.dart';
import '../../fees/screens/fee_ledger_screen.dart';
import '../../live_class/screens/live_class_screen.dart';

class StudentMainScaffold extends StatefulWidget {
  final int initialIndex;
  const StudentMainScaffold({super.key, this.initialIndex = 0});

  @override
  State<StudentMainScaffold> createState() => _StudentMainScaffoldState();
}

class _StudentMainScaffoldState extends State<StudentMainScaffold> {
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
      StudentHomeScreen(onNavigateTab: _onTabSelected),
      const MyHomeworkScreen(),
      const AttendanceCalendarScreen(),
      const FeeLedgerScreen(),
      const LiveClassScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onTabSelected,
        backgroundColor: const Color(0xFF0F172A),
        indicatorColor: const Color(0xFF064E3B),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.home, color: Color(0xFF10B981)),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.book_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.book, color: Color(0xFF10B981)),
            label: 'Homework',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_today_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.calendar_today, color: Color(0xFF10B981)),
            label: 'Attendance',
          ),
          NavigationDestination(
            icon: Icon(Icons.currency_rupee, color: Colors.grey),
            selectedIcon: Icon(Icons.currency_rupee, color: Color(0xFF10B981)),
            label: 'Fees',
          ),
          NavigationDestination(
            icon: Icon(Icons.video_call_outlined, color: Colors.grey),
            selectedIcon: Icon(Icons.video_call, color: Color(0xFF10B981)),
            label: 'Live Class',
          ),
        ],
      ),
    );
  }
}
