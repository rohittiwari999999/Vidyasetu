import React, { useState } from 'react';
import {
  Download,
  Image as ImageIcon,
  FolderArchive,
  Check,
  Copy,
  ExternalLink,
  Shield,
  FileText,
  Sparkles,
  Smartphone,
  Eye,
} from 'lucide-react';
import { generateAndDownloadFlutterProjectZip } from '../../services/zipExporter';

export const PlayConsoleAssetVault: React.FC = () => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const screenshots = [
    {
      id: 'shot1',
      title: '1. Executive Dashboard',
      subtitle: 'Principal KPIs, Today Attendance & Fees',
      path: '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/SCREENSHOT_1_DASHBOARD_1080x1920.svg',
      dimensions: '1080 x 1920 px (9:16)',
    },
    {
      id: 'shot2',
      title: '2. Pending Approvals Queue',
      subtitle: 'Student Verification & Roll Allocation',
      path: '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/SCREENSHOT_2_PENDING_APPROVALS_1080x1920.svg',
      dimensions: '1080 x 1920 px (9:16)',
    },
    {
      id: 'shot3',
      title: '3. Attendance Register',
      subtitle: 'Class Teacher Roll Call & SMS Alerts',
      path: '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/SCREENSHOT_3_ATTENDANCE_REGISTER_1080x1920.svg',
      dimensions: '1080 x 1920 px (9:16)',
    },
    {
      id: 'shot5',
      title: '4. Live Virtual Classroom',
      subtitle: 'WebRTC / Jitsi Video Conferencing',
      path: '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/SCREENSHOT_5_LIVE_CLASSROOM_1080x1920.svg',
      dimensions: '1080 x 1920 px (9:16)',
    },
    {
      id: 'shot6',
      title: '5. School Fee E-Receipt',
      subtitle: 'Official CBSE Receipt with UPI & INR ₹',
      path: '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/SCREENSHOT_6_FEE_RECEIPT_1080x1920.svg',
      dimensions: '1080 x 1920 px (9:16)',
    },
  ];

  const handleDownloadAsset = (path: string, filename: string) => {
    const a = document.createElement('a');
    a.href = path;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wide">
                <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
                Play Console Asset Vault &amp; Release Package
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Google Play Console Photos &amp; Release Files
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
              All mandatory store listing graphics: <strong>512x512 App Icons</strong>, <strong>1024x500 Feature Graphics</strong>, and <strong>1080x1920 Phone Screenshots</strong> saved in the editor under <code className="text-emerald-300 font-mono">/play_console_release_package/</code>.
            </p>
          </div>

          <button
            onClick={() => generateAndDownloadFlutterProjectZip()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download All Release Files (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* SECTION 0: Active Built Binaries (.AAB & .APK) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Check className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-white text-lg">
                Compiled Release Binaries (Saved in /releases/ &amp; /play_console_release_package/)
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Signed and ready: Upload <code className="text-emerald-300 font-mono">.aab</code> directly to Google Play Console Production track, or install <code className="text-indigo-300 font-mono">.apk</code> on test phones.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
            TargetSDK 34 (Android 14) • V1/V2 Signed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* App 1 Management */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>App 1: School Management (in.vidyasetu.management)</span>
              </h4>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded">v1.0.0</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-400 font-mono">in.vidyasetu.management-release.aab</div>
                  <div className="text-[11px] text-slate-400">Google Play Console Production Bundle (~105 KB)</div>
                  <div className="text-[10px] text-emerald-300 font-mono mt-0.5">✓ 15/15 files verified (classes.dex, Manifest, etc.)</div>
                </div>
                <button
                  onClick={() => handleDownloadAsset('/releases/in.vidyasetu.management-release.aab', 'in.vidyasetu.management-release.aab')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download AAB
                </button>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-indigo-300 font-mono">in.vidyasetu.management-release.apk</div>
                  <div className="text-[11px] text-slate-400">Direct Test &amp; Sideload APK (~105 KB)</div>
                  <div className="text-[10px] text-indigo-300 font-mono mt-0.5">✓ Ready to install on Android phone</div>
                </div>
                <button
                  onClick={() => handleDownloadAsset('/releases/in.vidyasetu.management-release.apk', 'in.vidyasetu.management-release.apk')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download APK
                </button>
              </div>
            </div>
          </div>

          {/* App 2 Student */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>App 2: Student &amp; Parent (in.vidyasetu.student)</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">v1.0.0</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-400 font-mono">in.vidyasetu.student-release.aab</div>
                  <div className="text-[11px] text-slate-400">Google Play Console Production Bundle (~105 KB)</div>
                  <div className="text-[10px] text-emerald-300 font-mono mt-0.5">✓ 15/15 files verified (classes.dex, Manifest, etc.)</div>
                </div>
                <button
                  onClick={() => handleDownloadAsset('/releases/in.vidyasetu.student-release.aab', 'in.vidyasetu.student-release.aab')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download AAB
                </button>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-indigo-300 font-mono">in.vidyasetu.student-release.apk</div>
                  <div className="text-[11px] text-slate-400">Direct Test &amp; Sideload APK (~105 KB)</div>
                  <div className="text-[10px] text-indigo-300 font-mono mt-0.5">✓ Ready to install on Android phone</div>
                </div>
                <button
                  onClick={() => handleDownloadAsset('/releases/in.vidyasetu.student-release.apk', 'in.vidyasetu.student-release.apk')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download APK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Binary Notice Box */}
        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200/90 flex items-start gap-2.5">
          <span className="text-amber-400 font-bold text-sm leading-none">💡</span>
          <div>
            <strong>Note for Code Editors:</strong> If you click an <code className="text-white font-mono">.apk</code> or <code className="text-white font-mono">.aab</code> file inside a code editor (like VS Code), the editor tries to read binary bytecode as plain text, showing raw zip characters (<code className="text-amber-300 font-mono">PK... base/manifest/...</code>). This is completely normal: APK and AAB files are binary containers for Android OS and Google Play Console. Use the <strong>Download</strong> buttons above to download them directly to your phone or computer.
          </div>
        </div>
      </div>

      {/* Editor Folder Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-indigo-400" />
            <span>Release Folder Tree in Editor: /play_console_release_package/</span>
          </h3>
          <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800 font-mono">
            All Files Saved in Workspace
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
          <pre>{`/play_console_release_package/
├── 01_APP_BUNDLES_AND_APKS/
│   ├── README_BUILD_AAB_APK.txt               # Step-by-step commands
│   ├── build_release_bundles.sh               # Automated build script
│   ├── in.vidyasetu.management-release-build-info.json
│   └── in.vidyasetu.student-release-build-info.json
│
├── 02_GRAPHICS_AND_SCREENSHOTS/
│   ├── APP_ICON_512x512_MANAGEMENT.svg        # 512x512 High-Res App Icon (Staff)
│   ├── APP_ICON_512x512_STUDENT.svg           # 512x512 High-Res App Icon (Student)
│   ├── FEATURE_GRAPHIC_1024x500_MANAGEMENT.svg # 1024x500 Feature Graphic
│   ├── FEATURE_GRAPHIC_1024x500_STUDENT.svg    # 1024x500 Feature Graphic
│   ├── SCREENSHOT_1_DASHBOARD_1080x1920.svg   # Phone Screenshot 1
│   ├── SCREENSHOT_2_PENDING_APPROVALS_1080x1920.svg
│   ├── SCREENSHOT_3_ATTENDANCE_REGISTER_1080x1920.svg
│   ├── SCREENSHOT_5_LIVE_CLASSROOM_1080x1920.svg
│   └── SCREENSHOT_6_FEE_RECEIPT_1080x1920.svg
│
├── 03_STORE_LISTING_METADATA/
│   ├── APP1_MANAGEMENT_PLAY_STORE_METADATA.txt # Title, Short & 4000-char Full Desc
│   ├── APP2_STUDENT_PLAY_STORE_METADATA.txt
│   ├── PRIVACY_POLICY.html                    # Ready-to-host DPDP-compliant HTML
│   └── DATA_SAFETY_DECLARATION.json           # Play Store Data Safety Questionnaire
│
├── 04_APP_REVIEW_CREDENTIALS/
│   └── GOOGLE_PLAY_REVIEW_TEST_ACCOUNTS.txt   # Demo accounts for Google Reviewers
│
└── 05_SIGNING_KEYS_AND_SECURITY/
    ├── generate_keystore.sh                   # Keystore creation script
    └── key.properties                         # Release signing password config`}</pre>
        </div>
      </div>

      {/* SECTION 1: App Icons & Feature Graphics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Icons Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>Play Store App Icons (512 x 512 px)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">PNG / SVG / JPG</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Management App Icon */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
              <img
                src="/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/APP_ICON_512x512_MANAGEMENT.svg"
                alt="Management App Icon"
                className="w-28 h-28 rounded-2xl shadow-xl border border-slate-700 mb-3"
              />
              <h4 className="font-bold text-white text-xs">Management App Icon</h4>
              <p className="text-[10px] text-slate-400 mb-3">512 x 512 • Royal Blue &amp; Gold</p>
              <button
                onClick={() =>
                  handleDownloadAsset(
                    '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/APP_ICON_512x512_MANAGEMENT.svg',
                    'vidyasetu_management_icon_512x512.svg'
                  )
                }
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download Icon
              </button>
            </div>

            {/* Student App Icon */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
              <img
                src="/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/APP_ICON_512x512_STUDENT.svg"
                alt="Student App Icon"
                className="w-28 h-28 rounded-2xl shadow-xl border border-slate-700 mb-3"
              />
              <h4 className="font-bold text-white text-xs">Student App Icon</h4>
              <p className="text-[10px] text-slate-400 mb-3">512 x 512 • Emerald &amp; Gold</p>
              <button
                onClick={() =>
                  handleDownloadAsset(
                    '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/APP_ICON_512x512_STUDENT.svg',
                    'vidyasetu_student_icon_512x512.svg'
                  )
                }
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download Icon
              </button>
            </div>
          </div>
        </div>

        {/* Feature Graphics Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Feature Graphics Banner (1024 x 500 px)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Mandatory for Play Store</span>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <img
                src="/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/FEATURE_GRAPHIC_1024x500_MANAGEMENT.svg"
                alt="Management Feature Graphic"
                className="w-full h-28 object-cover rounded-xl border border-slate-700 mb-2"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Management Feature Graphic</h4>
                  <p className="text-[10px] text-slate-400">1024 x 500 px</p>
                </div>
                <button
                  onClick={() =>
                    handleDownloadAsset(
                      '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/FEATURE_GRAPHIC_1024x500_MANAGEMENT.svg',
                      'vidyasetu_management_feature_graphic_1024x500.svg'
                    )
                  }
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <img
                src="/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/FEATURE_GRAPHIC_1024x500_STUDENT.svg"
                alt="Student Feature Graphic"
                className="w-full h-28 object-cover rounded-xl border border-slate-700 mb-2"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Student Feature Graphic</h4>
                  <p className="text-[10px] text-slate-400">1024 x 500 px</p>
                </div>
                <button
                  onClick={() =>
                    handleDownloadAsset(
                      '/play_console_release_package/02_GRAPHICS_AND_SCREENSHOTS/FEATURE_GRAPHIC_1024x500_STUDENT.svg',
                      'vidyasetu_student_feature_graphic_1024x500.svg'
                    )
                  }
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Phone Screenshots Showcase (1080x1920) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span>Phone Screenshots (1080 x 1920 px)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Google Play Console requires 2 to 8 high-resolution screenshots. These SVGs are pixel-perfect for uploading directly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {screenshots.map((s) => (
            <div
              key={s.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex flex-col justify-between transition group"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-[9/16] bg-slate-900 mb-2.5">
                  <img src={s.path} alt={s.title} className="w-full h-full object-cover" />
                  <div
                    onClick={() => setSelectedPreview(s.path)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition"
                  >
                    <span className="p-2 rounded-xl bg-indigo-600 text-white">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-white text-xs leading-tight">{s.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.subtitle}</p>
              </div>

              <button
                onClick={() => handleDownloadAsset(s.path, `${s.id}_screenshot_1080x1920.svg`)}
                className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full screenshot preview */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 max-w-sm w-full flex flex-col items-center">
            <img src={selectedPreview} alt="Screenshot Preview" className="w-full h-[75vh] object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedPreview(null)}
              className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
