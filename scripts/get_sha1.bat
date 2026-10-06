@echo off
echo ==========================================================
echo VidyaSetu - Extract Android SHA-1 Certificate Fingerprint
echo ==========================================================
echo.

if exist "%USERPROFILE%\.android\debug.keystore" (
    echo Found Debug Keystore! Extracting SHA-1 and SHA-256:
    keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android | findstr /R "SHA1: SHA256:"
) else (
    echo Running Gradle signingReport...
    cd apps\school_management_app\android
    call gradlew.bat signingReport | findstr /R "Variant: SHA1: SHA-256:"
)

echo.
echo ==========================================================
echo Copy the SHA1 above and add it to Firebase Console:
echo Project Settings -> Your Apps -> in.vidyasetu.management -> Add Fingerprint
echo ==========================================================
pause
