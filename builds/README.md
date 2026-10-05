# 📱 VidyaSetu Official Android Releases (APK & AAB)

This directory is designated for the compiled production Android Release artifacts for both VidyaSetu applications.

---

## 📦 Generated Release Artifacts

| App Name | Artifact Type | File Name | Purpose | Target Size |
|---|---|---|---|---|
| **VidyaSetu School Management** | Direct Install APK | `VidyaSetu-Staff-Management-Release.apk` | Sideload / Direct phone installation | ~30 MB |
| **VidyaSetu School Management** | Play Store Bundle | `VidyaSetu-Staff-Management-Release.aab` | Google Play Console Publishing | ~22 MB |
| **VidyaSetu Student & Parent** | Direct Install APK | `VidyaSetu-Student-Parent-Release.apk` | Direct phone installation for students/parents | ~30 MB |
| **VidyaSetu Student & Parent** | Play Store Bundle | `VidyaSetu-Student-Parent-Release.aab` | Google Play Console Publishing | ~22 MB |

---

## 🚀 How to Obtain & Save to Editor / Local Machine

### Option 1: Direct from GitHub Actions (Recommended)
1. Go to your GitHub repository: **`github.com/rohittiwari.../actions`**
2. Click on the latest run of **"Compile 30MB Official Flutter Android Release"**
3. Scroll down to the **Artifacts** section at the bottom of the summary page.
4. Click and download:
   - `VidyaSetu-Staff-Management-Release-APK`
   - `VidyaSetu-Staff-Management-Release-AAB`
   - `VidyaSetu-Student-Parent-Release-APK`
   - `VidyaSetu-Student-Parent-Release-AAB`
5. Extract the `.zip` files and place the `.apk` and `.aab` files into this `builds/` directory.

### Option 2: Run Automated Build Script Locally
If you have Flutter installed locally on your computer:
```bash
./build_release.sh
```
The script will output the compiled binaries to:
- `apps/school_management_app/build/app/outputs/flutter-apk/app-release.apk`
- `apps/school_management_app/build/app/outputs/bundle/release/app-release.aab`
- `apps/student_parent_app/build/app/outputs/flutter-apk/app-release.apk`
- `apps/student_parent_app/build/app/outputs/bundle/release/app-release.aab`
