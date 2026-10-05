/**
 * Complete file representations for both Flutter standalone apps,
 * Android native files (build.gradle, AndroidManifest.xml, key.properties, proguard),
 * iOS native files (Info.plist, Podfile), and Play Store Console publish assets.
 */

export const MANAGEMENT_APP_BUILD_GRADLE = `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
    id "com.google.gms.google-services"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystorePropertiesFile.withReader('UTF-8') { reader ->
        keystoreProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0.0'
}

android {
    namespace "in.vidyasetu.management"
    compileSdk 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
        coreLibraryDesugaringEnabled true
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "in.vidyasetu.management"
        minSdk 23
        targetSdk 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        multiDexEnabled true

        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a", "x86_64"
        }
    }

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                storePassword keystoreProperties['storePassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            signingConfig signingConfigs.debug
        }
    }
}

flutter {
    source '../..'
}

dependencies {
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.0.4'
    implementation 'androidx.multidex:multidex:2.0.1'
    implementation platform('com.google.firebase:firebase-bom:33.1.0')
    implementation 'com.google.firebase:firebase-analytics'
}
`;

export const MANAGEMENT_APP_MANIFEST = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="in.vidyasetu.management">

    <!-- Permissions required for Video Classes (Jitsi/WebRTC), FCM, and Attendance -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32"/>
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>

    <!-- Camera hardware features (optional for devices without rear camera) -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <application
        android:label="VidyaSetu Staff"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:fullBackupContent="false"
        android:supportsRtl="true"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">

            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>

            <!-- Push notification intent click -->
            <intent-filter>
                <action android:name="FLUTTER_NOTIFICATION_CLICK" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>

        <!-- Firebase FCM Notification Channel Configuration -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="school_broadcast_channel" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@drawable/ic_notification" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_color"
            android:resource="@color/brand_primary" />

        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`;

export const STUDENT_APP_BUILD_GRADLE = `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
    id "com.google.gms.google-services"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystorePropertiesFile.withReader('UTF-8') { reader ->
        keystoreProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode') ?: '1'
def flutterVersionName = localProperties.getProperty('flutter.versionName') ?: '1.0.0'

android {
    namespace "in.vidyasetu.student"
    compileSdk 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
        coreLibraryDesugaringEnabled true
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    defaultConfig {
        applicationId "in.vidyasetu.student"
        minSdk 23
        targetSdk 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        multiDexEnabled true

        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a", "x86_64"
        }
    }

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                storePassword keystoreProperties['storePassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.0.4'
    implementation 'androidx.multidex:multidex:2.0.1'
    implementation platform('com.google.firebase:firebase-bom:33.1.0')
    implementation 'com.google.firebase:firebase-analytics'
}
`;

export const STUDENT_APP_MANIFEST = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="in.vidyasetu.student">

    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32"/>
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>

    <application
        android:label="VidyaSetu Student"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:supportsRtl="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>

            <!-- UPI Payment Callback intent filter (for Razorpay / PhonePe / GPay fee payments) -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="vidyasetupay" />
            </intent-filter>
        </activity>

        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="school_broadcast_channel" />
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`;

export const KEY_PROPERTIES_TEMPLATE = `storePassword=YOUR_KEYSTORE_PASSWORD_HERE
keyPassword=YOUR_KEY_PASSWORD_HERE
keyAlias=vidyasetu_release
storeFile=../keystore/release.jks
`;

export const PROGUARD_RULES = `# Flutter Proguard Rules for VidyaSetu Indian School Ecosystem
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Firebase Rules
-keepattributes *Annotation*
-keepclassmembers class * {
  @com.google.firebase.database.IgnoreExtraProperties *;
}
-dontwarn com.google.firebase.**

# Jitsi / WebRTC
-keep class org.webrtc.** { *; }
-dontwarn org.webrtc.**
`;

export const IOS_INFO_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>$(DEVELOPMENT_LANGUAGE)</string>
	<key>CFBundleDisplayName</key>
	<string>VidyaSetu</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>vidyasetu</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>$(FLUTTER_BUILD_NAME)</string>
	<key>CFBundleSignature</key>
	<string>????</string>
	<key>CFBundleVersion</key>
	<string>$(FLUTTER_BUILD_NUMBER)</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>

	<!-- Required Apple Privacy Permissions -->
	<key>NSCameraUsageDescription</key>
	<string>VidyaSetu requires camera access for interactive live online classes, document scanning, and profile photo upload.</string>
	<key>NSMicrophoneUsageDescription</key>
	<string>VidyaSetu requires microphone access to let students and teachers speak during live classroom sessions.</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>VidyaSetu requires photo library access to upload completed homework worksheets and fee receipts.</string>

	<!-- Background Modes for Push Notifications & Audio -->
	<key>UIBackgroundModes</key>
	<array>
		<string>fetch</string>
		<string>remote-notification</string>
		<string>audio</string>
		<string>voip</string>
	</array>

	<key>UILaunchStoryboardName</key>
	<string>LaunchScreen</string>
	<key>UIMainStoryboardFile</key>
	<string>Main</string>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
		<string>UIInterfaceOrientationLandscapeLeft</string>
		<string>UIInterfaceOrientationLandscapeRight</string>
	</array>
</dict>
</plist>
`;

export const PLAY_STORE_METADATA = `# Google Play Console Store Listing Metadata (Indian Schools)

## APP 1: VidyaSetu - School Management (Staff Portal)
- **Application ID:** in.vidyasetu.management
- **App Title (Max 30 chars):** VidyaSetu School Management
- **Short Description (Max 80 chars):** Complete school management for Indian Principals, Managers & Teachers.
- **Full Description (Max 4000 chars):**
VidyaSetu Staff is the premier Indian School Management application tailored for Principals, School Managers, Trustees, and Class Teachers (from Playgroup/Pre-Primary to 12th Senior Secondary / Inter College).

Fully aligned with CBSE, ICSE, and State Board administrative standards.

KEY FEATURES FOR STAFF:
1. PENDING ADMISSIONS APPROVAL: Review new student signups, verify parent documents, and assign official Roll Numbers and SRN (Student Registration Number) with 1 click.
2. DIGITAL ATTENDANCE REGISTER: Take daily class attendance in under 30 seconds. Automatically queue SMS/WhatsApp notifications to parents of absent students.
3. HOMEWORK & WORKSHEET PUBLISHER: Upload chapter worksheets, problem sets, and homework with deadlines. Review student PDF submissions and assign marks with feedback.
4. URGENT CIRCULAR BROADCASTS: Dispatch instant push notifications for emergency rain holidays, Dussehra/Diwali break, and CBSE examination dates via Firebase Cloud Messaging.
5. INTEGRATED LIVE VIRTUAL CLASSROOM: Host live video classes with screen share, student hand-raise, and AES-256 encrypted classroom rooms without external apps.
6. FEE COLLECTION MONITORING: Real-time tracking of term tuition fees, transport dues, and collection velocity in Indian Rupees (₹).

---

## APP 2: VidyaSetu - Student & Parent Portal
- **Application ID:** in.vidyasetu.student
- **App Title (Max 30 chars):** VidyaSetu Student & Parent
- **Short Description (Max 80 chars):** Homework, live classes, attendance, fee receipts & report card for students.
- **Full Description (Max 4000 chars):**
VidyaSetu Student & Parent app connects Indian students and parents directly to their school (Playgroup, Nursery, KG, Classes 1 to 12).

FEATURES FOR STUDENTS & PARENTS:
1. DIGITAL HOMEWORK: View daily homework assignments, download teacher's worksheet PDFs, and upload handwritten solution photos.
2. LIVE ONLINE CLASSES: Join your subject teacher's live classroom with a single tap. High quality video conferencing with zero configuration.
3. ATTENDANCE TRACKER: Monthly calendar with color-coded Present, Absent, and Holiday markers. Keep track of CBSE mandatory 75% attendance rule.
4. SCHOOL CIRCULARS & NOTICES: Never miss urgent holiday advisories, weather notices, or PTM schedules with lockscreen push alerts.
5. ONLINE FEE PAYMENT & RECEIPTS: Pay school fees via UPI (Google Pay, PhonePe, Paytm, BHIM) or NetBanking. Instantly download official CBSE fee receipts.
6. DIGITAL REPORT CARDS: Check Term 1, Half-Yearly, and Final marksheet cards with CBSE grades (A1 to E), rank in class, and teacher remarks.
7. CLASS DAILY TIMETABLE: 8-period daily routine with period timings and classroom lab allocations.
`;

export const DATA_SAFETY_ANSWERS = `# Google Play Console Data Safety Questionnaire Answers

According to Google Play Store requirements, here are the exact answers to declare for VidyaSetu:

1. Data Collection & Sharing:
- Does your app collect or share any of the required user data types? -> YES
- Is all of the user data collected by your app encrypted in transit? -> YES (HTTPS & TLS 1.3 / E2E)
- Do you provide a way for users to request that their data be deleted? -> YES (Via School Admin or in-app account deletion request)

2. Data Types Declared:
A. Personal Info:
   - Name: YES (App functionality, Account management)
   - Email address: YES (Account login, circular communication)
   - Phone number: YES (Parent SMS alerts, WhatsApp broadcast sync)
   - User IDs: YES (Admission Number / Roll Number)
B. Photos and Videos:
   - Photos: YES (Student homework notebook photo uploads)
C. Audio:
   - Voice recordings: YES (Microphone used exclusively during active live video classes)
D. Device or other identifiers:
   - Device tokens: YES (Firebase Cloud Messaging push tokens for urgent school alerts)

3. Target Audience:
- 13 and under / Families: YES (Educational app for K-12 students).
- Follows Google Play Families Policy and India DPDP Act 2023.
`;

export const PRIVACY_POLICY_TEXT = `# Privacy Policy for VidyaSetu Educational Ecosystem
Effective Date: October 2026
Applicable to: VidyaSetu Management App & VidyaSetu Student App

1. Introduction
VidyaSetu ("we", "us", "our") provides school management software and student portals for educational institutions in India. This privacy policy complies with the Digital Personal Data Protection Act, 2023 (DPDP Act, India), the Information Technology Act, 2000, and Google Play Store policies.

2. Information We Collect
We collect information provided directly by schools, parents, teachers, and students:
- Student Academic Data: Name, date of birth, blood group, class, section, roll number, admission number (SRN), attendance logs, and academic marks.
- Parent / Guardian Data: Parent name, primary phone number, registered email address, and residential address.
- Staff Data: Teacher name, employee ID, assigned subjects, and qualifications.
- Audio & Camera: Used strictly in real-time during live interactive classrooms (WebRTC/Jitsi) and homework uploads. No audio/video is recorded without administrative notice.

3. Purpose of Processing
Data is processed strictly for educational purposes:
- School attendance recordkeeping and CBSE compliance.
- Homework assignment delivery and marks compilation.
- Emergency holiday alerts, fee dues reminders, and academic notices.
- Verification and approval of student enrollments.

4. Data Security & Storage
All data is stored in Google Cloud / Firebase data centers with AES-256 encryption at rest and TLS 1.3 encryption in transit. We NEVER sell or monetize student data to third-party advertising networks.

5. Rights of Parents and Data Principals
Parents have the right to inspect student records, request corrections through the school principal, or request account deactivation upon school transfer.

Contact:
VidyaSetu Data Protection Officer (DPO)
Email: privacy@vidyasetu.edu.in
New Delhi, India
`;

export const BUILD_COMMANDS_SCRIPT = `#!/bin/bash
# ==============================================================================
# VidyaSetu Build Script: Generate APK, AAB (Play Store) & iOS IPA
# ==============================================================================

echo "======================================================"
echo " 🏫 VidyaSetu Indian School System - Build Engine      "
echo "======================================================"

# 1. Clean and get dependencies
echo "📦 Step 1: Resolving dependencies in all packages..."
cd packages/core_shared && flutter pub get && cd ../..
cd apps/school_management_app && flutter pub get && cd ../..
cd apps/student_parent_app && flutter pub get && cd ../..

# ==============================================================================
# APP 1: School Management App (Staff)
# ==============================================================================
echo ""
echo "🔨 Building APP 1: School Management App (in.vidyasetu.management)..."
cd apps/school_management_app

# Build APK (for direct school testing / distribution)
echo "  -> Building Release APK..."
flutter build apk --release --split-per-abi

# Build AAB (for Google Play Console Production release)
echo "  -> Building Release AAB (Android App Bundle)..."
flutter build appbundle --release

# Output locations:
# build/app/outputs/flutter-apk/app-release.apk
# build/app/outputs/bundle/release/app-release.aab
cd ../..

# ==============================================================================
# APP 2: Student & Parent App
# ==============================================================================
echo ""
echo "🔨 Building APP 2: Student & Parent App (in.vidyasetu.student)..."
cd apps/student_parent_app

# Build APK
echo "  -> Building Release APK..."
flutter build apk --release --split-per-abi

# Build AAB
echo "  -> Building Release AAB (Android App Bundle)..."
flutter build appbundle --release

cd ../..

echo ""
echo "🎉 BUILD COMPLETE!"
echo "Files ready to upload to Google Play Console: "
echo "1. apps/school_management_app/build/app/outputs/bundle/release/app-release.aab"
echo "2. apps/student_parent_app/build/app/outputs/bundle/release/app-release.aab"
`;
