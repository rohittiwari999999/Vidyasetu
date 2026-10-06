#!/usr/bin/env bash
echo "=========================================================="
echo "VidyaSetu - Extract Android SHA-1 Certificate Fingerprint"
echo "=========================================================="

echo ""
echo "Attempting to read Flutter / Android Debug Keystore..."
if [ -f "$HOME/.android/debug.keystore" ]; then
    keytool -list -v -keystore "$HOME/.android/debug.keystore" -alias androiddebugkey -storepass android -keypass android | grep -E "SHA1|SHA256"
else
    echo "Debug keystore not found in default path."
    echo "Running Gradle signingReport in school_management_app..."
    cd apps/school_management_app/android && ./gradlew signingReport | grep -E "Variant:|SHA1|SHA-256"
fi

echo ""
echo "Copy the SHA1 above and paste it into Firebase Console:"
echo "Project Settings -> Your Apps -> in.vidyasetu.management -> Add Fingerprint"
