import React, { useState } from 'react';
import { Copy, Check, FolderTree, Code2, Layers, Cpu } from 'lucide-react';

export const Deliverable2Structure: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const folderStructureTree = `vidyasetu_ecosystem/
├── melos.yaml                            # Multi-package monorepo workspace config
├── packages/
│   ├── core_shared/                      # SHARED CORE PACKAGE (Shared between both apps)
│   │   ├── pubspec.yaml
│   │   ├── lib/
│   │   │   ├── core_shared.dart
│   │   │   ├── constants/
│   │   │   │   ├── app_colors.dart       # Indian school branding palette
│   │   │   │   ├── firestore_paths.dart  # Unified collection names
│   │   │   │   └── indian_grades.dart    # Playgroup to Class 12 enum
│   │   │   ├── models/
│   │   │   │   ├── user_model.dart       # UserProfile, Role, ApprovalStatus
│   │   │   │   ├── student_details.dart  # Roll, SRN, Section, Parent details
│   │   │   │   ├── homework_model.dart   # Homework & Attachment models
│   │   │   │   ├── submission_model.dart # Student submission & marks
│   │   │   │   ├── attendance_model.dart # Daily attendance record
│   │   │   │   ├── broadcast_model.dart  # Emergency alert & circular
│   │   │   │   └── fee_model.dart        # Fee ledger, Indian Rupee breakdown
│   │   │   ├── services/
│   │   │   │   ├── firebase_auth_service.dart
│   │   │   │   ├── firestore_service.dart
│   │   │   │   ├── fcm_notification_service.dart
│   │   │   │   └── cloud_storage_service.dart
│   │   │   └── widgets/
│   │   │       ├── school_branding_header.dart
│   │   │       ├── fee_receipt_card.dart
│   │   │       └── custom_text_field.dart
│
├── apps/
│   ├── school_management_app/            # APP 1: FOR MANAGER, PRINCIPAL & TEACHERS
│   │   ├── pubspec.yaml
│   │   ├── android/ & ios/
│   │   ├── lib/
│   │   │   ├── main.dart                 # App 1 Entrypoint (Firebase.initializeApp)
│   │   │   ├── app.dart                  # Riverpod ProviderScope & MaterialApp
│   │   │   ├── routes/
│   │   │   │   └── app_router.dart       # GoRouter with role & permission guards
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── controllers/      # auth_controller.dart (Riverpod)
│   │   │   │   │   └── screens/          # staff_login_screen.dart
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── principal_dashboard_screen.dart
│   │   │   │   │   └── manager_analytics_screen.dart
│   │   │   │   ├── approvals/            # PENDING APPROVALS MODULE
│   │   │   │   │   ├── controllers/      # pending_students_notifier.dart
│   │   │   │   │   └── screens/          # pending_approvals_screen.dart
│   │   │   │   ├── class_teacher/        # CLASS TEACHER SECTION
│   │   │   │   │   ├── controllers/      # attendance_register_notifier.dart
│   │   │   │   │   └── screens/          # digital_rollcall_screen.dart
│   │   │   │   ├── homework/             # HOMEWORK CREATION & GRADING MODULE
│   │   │   │   │   ├── controllers/      # homework_manager_controller.dart
│   │   │   │   │   └── screens/          # create_homework_screen.dart, grading_screen.dart
│   │   │   │   ├── broadcast/            # BROADCAST MESSAGING MODULE
│   │   │   │   │   ├── controllers/      # broadcast_controller.dart
│   │   │   │   │   └── screens/          # compose_broadcast_screen.dart
│   │   │   │   ├── live_classes/         # JITSI / WEBRTC CONFERENCING
│   │   │   │   │   └── screens/          # host_live_class_screen.dart
│   │   │   │   └── fee_monitoring/       # Staff fee dues collection
│   │   │   │       └── screens/          # school_ledger_screen.dart
│
│   └── student_parent_app/               # APP 2: FOR STUDENTS & PARENTS
│       ├── pubspec.yaml
│       ├── android/ & ios/
│       ├── lib/
│       │   ├── main.dart                 # App 2 Entrypoint
│       │   ├── app.dart
│       │   ├── routes/
│       │   │   └── student_router.dart   # Role & Pending Approval redirect logic
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   ├── screens/          # student_signup_screen.dart, student_login_screen.dart
│       │   │   │   └── pending_gate/     # pending_approval_gate_screen.dart
│       │   │   ├── home/
│       │   │   │   └── screens/          # student_home_screen.dart
│       │   │   ├── homework/
│       │   │   │   ├── screens/          # my_homework_screen.dart, submit_solution_modal.dart
│       │   │   ├── live_classes/
│       │   │   │   └── screens/          # join_live_classroom_screen.dart (Jitsi Meet)
│       │   │   ├── attendance/
│       │   │   │   └── screens/          # monthly_attendance_calendar_screen.dart
│       │   │   ├── notices/
│       │   │   │   └── screens/          # student_notice_board_screen.dart
│       │   │   ├── fee_payments/         # Razorpay / UPI Integration
│       │   │   │   └── screens/          # fee_dues_screen.dart, receipt_viewer_screen.dart
│       │   │   ├── report_cards/
│       │   │   │   └── screens/          # cbse_marksheet_screen.dart
│       │   │   └── timetable/
│       │   │       └── screens/          # daily_routine_screen.dart
│
└── functions/                            # FIREBASE CLOUD FUNCTIONS (Node.js/TypeScript)
    ├── package.json
    ├── src/
    │   ├── index.ts                      # FCM notification triggers on homework & broadcasts
    │   └── onStudentApproved.ts          # Sends Welcome SMS + Email to Indian parents`;

  const pubspecShared = `name: core_shared
description: Shared models, Firebase Firestore services, and widgets for VidyaSetu Indian School Ecosystem.
version: 1.0.0
publish_to: none

environment:
  sdk: '>=3.2.0 <4.0.0'
  flutter: '>=3.16.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  firebase_core: ^3.0.0
  firebase_auth: ^5.0.0
  cloud_firestore: ^5.0.0
  firebase_messaging: ^15.0.0
  firebase_storage: ^12.0.0
  intl: ^0.19.0
  freezed_annotation: ^2.4.1
  json_annotation: ^4.8.1

dev_dependencies:
  build_runner: ^2.4.8
  freezed: ^2.4.6
  json_serializable: ^6.7.1`;

  const pubspecApp = `name: school_management_app
description: VidyaSetu School Management App for Principals, Managers, and Class Teachers.
version: 1.0.0+1
publish_to: none

environment:
  sdk: '>=3.2.0 <4.0.0'
  flutter: '>=3.16.0'

dependencies:
  flutter:
    sdk: flutter
  core_shared:
    path: ../../packages/core_shared
  flutter_riverpod: ^2.5.1
  go_router: ^14.0.0
  jitsi_meet_flutter_sdk: ^10.3.0 # Or flutter_webrtc / agora_rtc_engine
  file_picker: ^8.0.0
  cached_network_image: ^3.3.1
  google_fonts: ^6.2.1
  flutter_local_notifications: ^17.1.0`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Deliverable 2 of 5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Production Flutter Monorepo / Multi-App Folder Structure
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Clean Architecture with Riverpod. The two separate apps (School Management App & Student/Parent App) live in the same repository, sharing a common <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">core_shared</code> package containing all Firestore models, authentication providers, and FCM services.
        </p>
      </div>

      {/* Folder Tree */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">
              Dual-App Workspace Architecture
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(folderStructureTree, 'tree')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedKey === 'tree' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'tree' ? 'Copied Tree!' : 'Copy Tree'}</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
          <pre>{folderStructureTree}</pre>
        </div>
      </div>

      {/* Pubspec configs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">packages/core_shared/pubspec.yaml</h4>
            <button
              onClick={() => copyToClipboard(pubspecShared, 'pubshared')}
              className="text-xs text-indigo-400 hover:text-white"
            >
              {copiedKey === 'pubshared' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64">
            <pre>{pubspecShared}</pre>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">apps/school_management_app/pubspec.yaml</h4>
            <button
              onClick={() => copyToClipboard(pubspecApp, 'pubapp')}
              className="text-xs text-indigo-400 hover:text-white"
            >
              {copiedKey === 'pubapp' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64">
            <pre>{pubspecApp}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
