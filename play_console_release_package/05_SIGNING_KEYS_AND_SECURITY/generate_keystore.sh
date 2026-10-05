#!/usr/bin/env bash
# ==============================================================================
# Script to generate production release keystore for Google Play Signing
# ==============================================================================

KEYSTORE_PATH="release.jks"
ALIAS="vidyasetu_release"

echo "Generating release keystore at \${KEYSTORE_PATH}..."

keytool -genkey -v \
  -keystore "\${KEYSTORE_PATH}" \
  -alias "\${ALIAS}" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=VidyaSetu School Systems, OU=Mobile Security, O=VidyaSetu, L=New Delhi, ST=Delhi, C=IN"

echo "Keystore successfully created!"
echo "SHA-256 fingerprint for Google Play App Signing & Firebase Console:"
keytool -list -v -keystore "\${KEYSTORE_PATH}" -alias "\${ALIAS}"
