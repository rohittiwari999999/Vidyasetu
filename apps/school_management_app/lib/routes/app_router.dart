import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core_shared/core_shared.dart';
import '../features/auth/screens/staff_role_selection_login_screen.dart';
import '../features/dashboard/screens/staff_main_scaffold.dart';
import '../features/admin/screens/staff_access_management_screen.dart';
import '../features/approvals/screens/pending_approvals_screen.dart';
import '../features/attendance/screens/attendance_register_screen.dart';
import '../features/homework/screens/create_homework_screen.dart';
import '../features/broadcast/screens/compose_broadcast_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final currentStaff = ref.watch(currentVerifiedStaffProvider);

  return GoRouter(
    initialLocation: currentStaff != null ? '/dashboard' : '/login',
    redirect: (BuildContext context, GoRouterState state) {
      final isLogin = state.matchedLocation == '/login';
      // Strict Pre-Verification Enforced: If not verified staff, lock to /login
      if (currentStaff == null) {
        return isLogin ? null : '/login';
      }
      // If already verified and on login, bypass to dashboard
      if (isLogin && currentStaff != null) {
        return '/dashboard';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const StaffRoleSelectionLoginScreen(),
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const StaffMainScaffold(),
      ),
      GoRoute(
        path: '/manage-staff',
        builder: (context, state) => const StaffAccessManagementScreen(),
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
