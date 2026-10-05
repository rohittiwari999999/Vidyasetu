import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import '../features/home/screens/student_home_screen.dart';
import '../features/auth/screens/pending_approval_gate_screen.dart';
import '../features/homework/screens/my_homework_screen.dart';
import '../features/attendance/screens/attendance_calendar_screen.dart';
import '../features/fees/screens/fee_ledger_screen.dart';

final studentRouterProvider = Provider<GoRouter>((ref) {
  final userProfileAsync = ref.watch(currentUserProfileProvider);

  return GoRouter(
    initialLocation: '/home',
    redirect: (BuildContext context, GoRouterState state) {
      final user = userProfileAsync.value;
      if (user != null && user.status == ApprovalStatus.pending) {
        return '/pending-approval';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/home',
        builder: (context, state) => const StudentHomeScreen(),
      ),
      GoRoute(
        path: '/pending-approval',
        builder: (context, state) => const PendingApprovalGateScreen(),
      ),
      GoRoute(
        path: '/homework',
        builder: (context, state) => const MyHomeworkScreen(),
      ),
      GoRoute(
        path: '/attendance',
        builder: (context, state) => const AttendanceCalendarScreen(),
      ),
      GoRoute(
        path: '/fees',
        builder: (context, state) => const FeeLedgerScreen(),
      ),
    ],
  );
});
