# 📱 VidyaSetu Official Android Gradle Build System

## 🛠️ Official Gradle Commands (Gradle Tasks)

In Android development, Flutter delegates compilation directly to the **Android Gradle Plugin (AGP)**:

### 1. APK Files (Direct Phone Installation)
- **Release APK (~30 MB standalone, optimized with R8/ProGuard):**
  ```bash
  cd apps/school_management_app/android && ./gradlew :app:assembleRelease
  # OR via Flutter:
  flutter build apk --release
  ```
- **Debug APK (Fast test build):**
  ```bash
  cd apps/school_management_app/android && ./gradlew :app:assembleDebug
  # OR via Flutter:
  flutter build apk --debug
  ```
  **Output Path:**
  `build/app/outputs/flutter-apk/app-release.apk` (or `app-debug.apk`)

### 2. AAB Files (Google Play Store Publishing Bundle)
- **Release App Bundle:**
  ```bash
  cd apps/school_management_app/android && ./gradlew :app:bundleRelease
  # OR via Flutter:
  flutter build appbundle --release
  ```
- **Debug App Bundle:**
  ```bash
  cd apps/school_management_app/android && ./gradlew :app:bundleDebug
  ```
  **Output Path:**
  `build/app/outputs/bundle/release/app-release.aab`

---

## ⚡ Where the Real ~30 MB Binaries are Generated

A real, installable Flutter Android APK is **~25 MB to 35 MB** because it must include:
- Native AOT Flutter shared engine (`libflutter.so`, `libapp.so`) compiled for `arm64-v8a`, `armeabi-v7a`, `x86_64`
- Google Play Services, Firebase SDK (`cloud_firestore`, `firebase_messaging`), and Dart runtime
- Dalvik Executable (`classes.dex`) containing all compiled application bytecode

Because compiling native C++/Rust/Java/Kotlin binaries requires the full Android NDK, Android SDK Build-Tools, and Flutter SDK (~5 GB of toolchain), compilation is handled on your **GitHub Actions CI runner** (Ubuntu 22.04 LTS runner with 64GB SSD, 16GB RAM, Java 17, and Flutter 3.19.6).

### 📥 Download the Real ~30 MB Files:
1. Open your GitHub Repository: `https://github.com/rohittiwari...`
2. Click **Actions** > **Compile 30MB Official Flutter Android Release**
3. Under **Artifacts**, download:
   - `VidyaSetu-Staff-Management-Release-APK` (~30 MB)
   - `VidyaSetu-Staff-Management-Release-AAB` (~22 MB)
   - `VidyaSetu-Student-Parent-Release-APK` (~30 MB)
   - `VidyaSetu-Student-Parent-Release-AAB` (~22 MB)

