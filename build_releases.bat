@echo off
echo ========================================================
echo  VidyaSetu - Flutter Dual-App Build Engine (Windows)
echo ========================================================

echo [1/3] Resolving dependencies...
cd packages\core_shared
call flutter pub get
cd ..\..

echo [2/3] Building App 1: School Management App...
cd apps\school_management_app
call flutter pub get
call flutter build apk --release
call flutter build appbundle --release
cd ..\..

echo [3/3] Building App 2: Student & Parent App...
cd apps\student_parent_app
call flutter pub get
call flutter build apk --release
call flutter build appbundle --release
cd ..\..

echo.
echo ========================================================
echo  BUILD COMPLETE!
echo  AAB files ready for Google Play Console upload:
echo  1. apps\school_management_app\build\app\outputs\bundle\release\app-release.aab
echo  2. apps\student_parent_app\build\app\outputs\bundle\release\app-release.aab
echo ========================================================
pause
