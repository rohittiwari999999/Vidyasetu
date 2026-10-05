================================================================================
VIDYASETU INDIAN SCHOOL MANAGEMENT ECOSYSTEM - RELEASE BUILDS
================================================================================

Target Platform: Android (SDK 23 to 34 - Android 14+) & iOS (12.0+)
Build System: Flutter 3.19+ / Gradle 8.0+ / Kotlin 1.9+
Package IDs:
  - App 1 (Staff & Teachers): in.vidyasetu.management
  - App 2 (Students & Parents): in.vidyasetu.student

================================================================================
COMMANDS TO GENERATE RELEASE AAB & APK FILES IN YOUR EDITOR:
================================================================================

1. Generate Keystore (One-time):
   cd 05_SIGNING_KEYS_AND_SECURITY
   bash generate_keystore.sh

2. Build App 1 (Management App):
   cd apps/school_management_app
   flutter clean && flutter pub get
   flutter build apk --release --split-per-abi
   flutter build appbundle --release
   Output files:
     - APK: build/app/outputs/flutter-apk/app-release.apk
     - AAB: build/app/outputs/bundle/release/app-release.aab (Upload this to Google Play Console)

3. Build App 2 (Student & Parent App):
   cd apps/student_parent_app
   flutter clean && flutter pub get
   flutter build apk --release --split-per-abi
   flutter build appbundle --release
   Output files:
     - APK: build/app/outputs/flutter-apk/app-release.apk
     - AAB: build/app/outputs/bundle/release/app-release.aab (Upload this to Google Play Console)

4. Automated Build Script:
   Execute './build_release_bundles.sh' to compile both apps consecutively.
