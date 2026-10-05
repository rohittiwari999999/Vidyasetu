import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import '../features/auth/screens/student_login_screen.dart';
import '../features/auth/screens/pending_approval_gate_screen.dart';
import '../features/home/screens/student_main_scaffold.dart';
import '../features/homework/screens/my_homework_screen.dart';
import '../features/attendance/screens/attendance_calendar_screen.dart';
import '../features/fees/screens/fee_ledger_screen.dart';
import '../features/live_class/screens/live_class_screen.dart';
import '../features/notices/screens/notices_screen.dart';

final studentRouterProvider = Provider<GoRouter>((ref) {
  final authUser = ref.watch(authStateChangesProvider).value;
  final userProfileAsync = ref.watch(currentUserProfileProvider);

  return GoRouter(
    initialLocation: authUser != null ? '/home' : '/login',
    redirect: (BuildContext context, GoRouterState state) {
      final isLoggingIn = state.matchedLocation == '/login';
      final isWaiting = state.matchedLocation == '/pending-approval';

      // 1. Unauthenticated -> force login
      if (authUser == null) {
        return isLoggingIn ? null : '/login';
      }

      // 2. Authenticated but Profile Pending -> force waiting room
      final user = userProfileAsync.value;
      if (user != null && !user.isApproved) {
        return isWaiting ? null : '/pending-approval';
      }

      // 3. Approved -> if currently on login or waiting room, bypass straight to /home
      if (user != null && user.isApproved) {
        if (isLoggingIn || isWaiting) {
          return '/home';
        }
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
        builder: (context, state) => const StudentMainScaffold(),
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
      GoRoute(
        path: '/live-class',
        builder: (context, state) => const LiveClassScreen(),
      ),
      GoRoute(
        path: '/notices',
        builder: (context, state) => const StudentNoticesScreen(),
      ),
    ],
  );
});
