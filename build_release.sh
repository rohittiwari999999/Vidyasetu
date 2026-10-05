#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  VidyaSetu - Official Android Gradle Build System"
echo "=========================================================="

echo "[1/3] Building Core Shared Package..."
cd packages/core_shared
flutter pub get
cd ../..

echo "[2/3] Compiling App 1: School Management App (APK + AAB)..."
cd apps/school_management_app
flutter pub get
flutter build apk --release
flutter build appbundle --release
cd ../..

echo "[3/3] Compiling App 2: Student & Parent App (APK + AAB)..."
cd apps/student_parent_app
flutter pub get
flutter build apk --release
flutter build appbundle --release
cd ../..

echo "=========================================================="
echo "  All Official Gradle Builds Completed Successfully!"
echo "  APKs: apps/*/build/app/outputs/flutter-apk/app-release.apk"
echo "  AABs: apps/*/build/app/outputs/bundle/release/app-release.aab"
echo "=========================================================="
