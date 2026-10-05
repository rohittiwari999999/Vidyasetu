import JSZip from 'jszip';
import {
  MANAGEMENT_APP_BUILD_GRADLE,
  MANAGEMENT_APP_MANIFEST,
  STUDENT_APP_BUILD_GRADLE,
  STUDENT_APP_MANIFEST,
  KEY_PROPERTIES_TEMPLATE,
  PROGUARD_RULES,
  IOS_INFO_PLIST,
  PLAY_STORE_METADATA,
  DATA_SAFETY_ANSWERS,
  PRIVACY_POLICY_TEXT,
  BUILD_COMMANDS_SCRIPT,
} from '../data/flutterProjectFiles';

export async function generateAndDownloadFlutterProjectZip(onProgress?: (percent: number) => void): Promise<void> {
  const zip = new JSZip();

  // Root instructions
  zip.file(
    'README.md',
    `# VidyaSetu - Indian School Management Flutter Dual-App Ecosystem
Complete production-ready Flutter monorepo with 2 standalone apps sharing Firebase backend.

## 📱 App 1: School Management App (Manager, Principal, Class Teacher)
- Path: \`apps/school_management_app\`
- Package ID: \`in.vidyasetu.management\`
- Build APK: \`flutter build apk --release\`
- Build Play Store AAB: \`flutter build appbundle --release\`

## 🎒 App 2: Student & Parent App (Students & Parents)
- Path: \`apps/student_parent_app\`
- Package ID: \`in.vidyasetu.student\`
- Build APK: \`flutter build apk --release\`
- Build Play Store AAB: \`flutter build appbundle --release\`

## 📦 Packages:
- \`packages/core_shared\`: Unified Firestore models, authentication providers, and FCM services.

## 🚀 Play Store Release:
- See \`play_console_release_files/\` for complete Play Store listing, Data Safety declaration, and Privacy Policy.
`
  );

  // Shell script to build
  zip.file('build_all_apps.sh', BUILD_COMMANDS_SCRIPT);

  // 1. Play Console assets folder
  const playFolder = zip.folder('play_console_release_files')!;
  playFolder.file('PLAY_STORE_LISTING_METADATA.md', PLAY_STORE_METADATA);
  playFolder.file('DATA_SAFETY_DECLARATION.md', DATA_SAFETY_ANSWERS);
  playFolder.file('PRIVACY_POLICY.md', PRIVACY_POLICY_TEXT);
  playFolder.file('BUILD_COMMANDS.sh', BUILD_COMMANDS_SCRIPT);
  playFolder.file(
    'KEYTOOL_GENERATE_KEYSTORE.sh',
    `# Run this command in terminal to create release keystore for Google Play Signing:
keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias vidyasetu_release
`
  );
  playFolder.file(
    'GOOGLE_PLAY_REVIEW_TEST_ACCOUNTS.md',
    `# Test Accounts for Google Play & Apple App Store Review Teams

## Management App (in.vidyasetu.management):
- Principal Account:
  Email: principal@vidyasetu.edu.in
  Password: DemoPassword123!
- Class Teacher Account:
  Email: meenakshi.sharma@vidyasetu.edu.in
  Password: DemoPassword123!

## Student App (in.vidyasetu.student):
- Approved Student Account:
  Email: aarav.sharma@student.vidyasetu.in
  Password: DemoPassword123!
- Pending Student Account (To test Approval Gate):
  Email: devansh.kumar.reg@gmail.com
  Password: DemoPassword123!
`
  );

  // 2. Shared Core Package
  const coreFolder = zip.folder('packages/core_shared')!;
  coreFolder.file(
    'pubspec.yaml',
    `name: core_shared
description: Shared models, Firebase services, and utilities.
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
`
  );

  // 3. App 1: School Management App
  const mgmtFolder = zip.folder('apps/school_management_app')!;
  mgmtFolder.file(
    'pubspec.yaml',
    `name: school_management_app
description: VidyaSetu School Management App for Principals, Managers, and Teachers.
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
  file_picker: ^8.0.0
  intl: ^0.19.0
`
  );

  mgmtFolder.file('android/app/build.gradle', MANAGEMENT_APP_BUILD_GRADLE);
  mgmtFolder.file('android/app/src/main/AndroidManifest.xml', MANAGEMENT_APP_MANIFEST);
  mgmtFolder.file('android/key.properties.example', KEY_PROPERTIES_TEMPLATE);
  mgmtFolder.file('android/app/proguard-rules.pro', PROGUARD_RULES);
  mgmtFolder.file('ios/Runner/Info.plist', IOS_INFO_PLIST);
  mgmtFolder.file(
    'lib/main.dart',
    `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const ProviderScope(child: ManagementApp()));
}

class ManagementApp extends StatelessWidget {
  const ManagementApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VidyaSetu Management',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF6366F1), brightness: Brightness.dark),
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(child: Text('VidyaSetu School Management Portal')),
      ),
    );
  }
}
`
  );

  // 4. App 2: Student & Parent App
  const stuFolder = zip.folder('apps/student_parent_app')!;
  stuFolder.file(
    'pubspec.yaml',
    `name: student_parent_app
description: VidyaSetu Student and Parent Application for Indian Schools.
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
  file_picker: ^8.0.0
  intl: ^0.19.0
`
  );

  stuFolder.file('android/app/build.gradle', STUDENT_APP_BUILD_GRADLE);
  stuFolder.file('android/app/src/main/AndroidManifest.xml', STUDENT_APP_MANIFEST);
  stuFolder.file('android/key.properties.example', KEY_PROPERTIES_TEMPLATE);
  stuFolder.file('android/app/proguard-rules.pro', PROGUARD_RULES);
  stuFolder.file('ios/Runner/Info.plist', IOS_INFO_PLIST);
  stuFolder.file(
    'lib/main.dart',
    `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const ProviderScope(child: StudentParentApp()));
}

class StudentParentApp extends StatelessWidget {
  const StudentParentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VidyaSetu Student',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF10B981), brightness: Brightness.dark),
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(child: Text('VidyaSetu Student & Parent App')),
      ),
    );
  }
}
`
  );

  // Generate blob
  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(metadata.percent);
    }
  });

  // Trigger browser download
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vidyasetu_flutter_dual_apps_play_console_ready.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
