#!/usr/bin/env bash
# ==============================================================================
# VidyaSetu - Automated Release Build Engine for APK & AAB
# ==============================================================================

set -e

echo "🚀 [1/4] Preparing Workspace & Core Shared Packages..."
cd "$(dirname "$0")/../.."
flutter --version

echo "📦 [2/4] Resolving dependencies..."
cd packages/core_shared && flutter pub get && cd ../..
cd apps/school_management_app && flutter pub get && cd ../..
cd apps/student_parent_app && flutter pub get && cd ../..

echo "🔨 [3/4] Compiling App 1: School Management App (in.vidyasetu.management)..."
cd apps/school_management_app
flutter build apk --release --split-per-abi
flutter build appbundle --release
echo "✅ App 1 AAB generated at: apps/school_management_app/build/app/outputs/bundle/release/app-release.aab"
cd ../..

echo "🔨 [4/4] Compiling App 2: Student & Parent App (in.vidyasetu.student)..."
cd apps/student_parent_app
flutter build apk --release --split-per-abi
flutter build appbundle --release
echo "✅ App 2 AAB generated at: apps/student_parent_app/build/app/outputs/bundle/release/app-release.aab"
cd ../..

echo "🎉 ALL APKS AND AAB BUNDLES READY FOR GOOGLE PLAY CONSOLE UPLOAD!"
