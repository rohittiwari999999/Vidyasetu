import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import '../features/auth/screens/student_login_screen.dart';
import '../features/auth/screens/student_waiting_room_screen.dart';
import '../features/home/screens/student_main_scaffold.dart';
import '../features/homework/screens/my_homework_screen.dart';
import '../features/attendance/screens/attendance_calendar_screen.dart';
import '../features/fees/screens/fee_ledger_screen.dart';
import '../features/live_class/screens/live_class_screen.dart';
import '../features/notices/screens/notices_screen.dart';

final studentRouterProvider = Provider<GoRouter>((ref) {
  final authUserAsync = ref.watch(authStateChangesProvider);
  final userProfileAsync = ref.watch(currentUserProfileProvider);

  return GoRouter(
    initialLocation: '/home',
    redirect: (BuildContext context, GoRouterState state) {
      final authUser = authUserAsync.value;
      final user = userProfileAsync.value;
      final isGoingToLogin = state.matchedLocation == '/login';
      final isGoingToWaitingRoom = state.matchedLocation == '/waiting-room';

      // 1. Unauthenticated -> Go to Login
      if (authUser == null) {
        return isGoingToLogin ? null : '/login';
      }

      // 2. Authenticated but pending Class Teacher approval -> Go to Waiting Room
      if (user != null && !user.isApproved) {
        return isGoingToWaitingRoom ? null : '/waiting-room';
      }

      // 3. Authenticated AND approved -> Persistent access to Home (bypass login/waiting)
      if (user != null && user.isApproved) {
        if (isGoingToLogin || isGoingToWaitingRoom) {
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
        path: '/waiting-room',
        builder: (context, state) => const StudentWaitingRoomScreen(),
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
