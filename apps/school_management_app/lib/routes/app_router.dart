import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import '../features/dashboard/screens/staff_main_scaffold.dart';
import '../features/approvals/screens/pending_approvals_screen.dart';
import '../features/attendance/screens/attendance_register_screen.dart';
import '../features/homework/screens/create_homework_screen.dart';
import '../features/broadcast/screens/compose_broadcast_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/dashboard',
    routes: [
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const StaffMainScaffold(),
      ),
      GoRoute(
        path: '/attendance',
        builder: (context, state) => const AttendanceRegisterScreen(),
      ),
      GoRoute(
        path: '/create-homework',
        builder: (context, state) => const CreateHomeworkScreen(assignedClass: 'Class 10-A'),
      ),
      GoRoute(
        path: '/broadcast',
        builder: (context, state) => const ComposeBroadcastScreen(),
      ),
      GoRoute(
        path: '/approvals',
        builder: (context, state) => const PendingApprovalsScreen(),
      ),
    ],
  );
});
