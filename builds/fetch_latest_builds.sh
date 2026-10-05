#!/usr/bin/env bash
# Script to copy locally generated or downloaded APK and AAB files to this builds/ directory

BUILD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$BUILD_DIR")"

echo "=== Copying generated release builds to /builds ==="

# School Management App
STAFF_APK="$ROOT_DIR/apps/school_management_app/build/app/outputs/flutter-apk/app-release.apk"
STAFF_AAB="$ROOT_DIR/apps/school_management_app/build/app/outputs/bundle/release/app-release.aab"

if [ -f "$STAFF_APK" ]; then
    cp "$STAFF_APK" "$BUILD_DIR/VidyaSetu-Staff-Management-Release.apk"
    echo "✓ Copied Staff Management APK"
fi

if [ -f "$STAFF_AAB" ]; then
    cp "$STAFF_AAB" "$BUILD_DIR/VidyaSetu-Staff-Management-Release.aab"
    echo "✓ Copied Staff Management AAB"
fi

# Student & Parent App
STUDENT_APK="$ROOT_DIR/apps/student_parent_app/build/app/outputs/flutter-apk/app-release.apk"
STUDENT_AAB="$ROOT_DIR/apps/student_parent_app/build/app/outputs/bundle/release/app-release.aab"

if [ -f "$STUDENT_APK" ]; then
    cp "$STUDENT_APK" "$BUILD_DIR/VidyaSetu-Student-Parent-Release.apk"
    echo "✓ Copied Student Parent APK"
fi

if [ -f "$STUDENT_AAB" ]; then
    cp "$STUDENT_AAB" "$BUILD_DIR/VidyaSetu-Student-Parent-Release.aab"
    echo "✓ Copied Student Parent AAB"
fi

echo "Done. Files in $BUILD_DIR:"
ls -lh "$BUILD_DIR"
