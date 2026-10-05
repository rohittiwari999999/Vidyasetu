import React, { useState } from 'react';
import {
  PLAY_STORE_METADATA,
  DATA_SAFETY_ANSWERS,
  PRIVACY_POLICY_TEXT,
  BUILD_COMMANDS_SCRIPT,
} from '../../data/flutterProjectFiles';
import {
  Play,
  Copy,
  Check,
  Shield,
  FileText,
  Key,
  Terminal,
  Smartphone,
  School,
  Sparkles,
  Award,
} from 'lucide-react';

export const PlayConsolePublishGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'commands' | 'metadata' | 'datasafety' | 'privacy' | 'review_creds'>('commands');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const keytoolCommand = `keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias vidyasetu_release`;

  const reviewAccounts = `# Google Play & Apple App Store Reviewer Test Credentials

## APP 1: School Management App (in.vidyasetu.management)
- Role: School Principal
  Login Email: principal@vidyasetu.edu.in
  Password: DemoPassword123!
- Role: Class Teacher (Class 10-A)
  Login Email: meenakshi.sharma@vidyasetu.edu.in
  Password: DemoPassword123!

## APP 2: Student & Parent App (in.vidyasetu.student)
- Role: Approved Student (Class 10-A)
  Login Email: aarav.sharma@student.vidyasetu.in
  Password: DemoPassword123!
- Role: Pending Student (To test verification gate)
  Login Email: devansh.kumar.reg@gmail.com
  Password: DemoPassword123!

*Note for Reviewers: All features (Attendance, Homework, Fees, Notices, Jitsi Virtual Class) can be tested live with these pre-configured accounts without SMS OTP roadblocks.*`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Play className="w-6 h-6 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Google Play Console & App Store Publish Suite
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  Ready for Production
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                All mandatory files, release keystore setup, store listing copies (Title & 4000-char descriptions), Data Safety declarations, and DPDP-compliant Privacy Policy for publishing both apps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-slate-900 p-2 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('commands')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeSubTab === 'commands' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>APK & AAB Build Commands</span>
        </button>

        <button
          onClick={() => setActiveSubTab('metadata')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeSubTab === 'metadata' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Play Store Listing (Title & Description)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('datasafety')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeSubTab === 'datasafety' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Data Safety Questionnaire</span>
        </button>

        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeSubTab === 'privacy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>DPDP Act Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('review_creds')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeSubTab === 'review_creds' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Google Reviewer Demo Logins</span>
        </button>
      </div>

      {/* Tab 1: Build Commands & Keystore */}
      {activeSubTab === 'commands' && (
        <div className="space-y-6 animate-fade-in">
          {/* Keystore Generation */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Step 1: Generate Release Keystore (Play App Signing)</span>
              </div>
              <button
                onClick={() => copyToClipboard(keytoolCommand, 'keytool')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                {copiedKey === 'keytool' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'keytool' ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Run this in your terminal to create the cryptographic signing key. Place the generated <code className="text-amber-300">release.jks</code> in <code className="text-indigo-300">android/keystore/</code>:
            </p>
            <div className="bg-slate-950 p-3 rounded-2xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
              {keytoolCommand}
            </div>
          </div>

          {/* Build Terminal Commands */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <span>Step 2: Build Release APK & AAB (Android App Bundle)</span>
              </div>
              <button
                onClick={() => copyToClipboard(BUILD_COMMANDS_SCRIPT, 'buildscript')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                {copiedKey === 'buildscript' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'buildscript' ? 'Copied Script!' : 'Copy Build Script'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <School className="w-4 h-4" /> App 1: School Management App
                </h4>
                <div className="font-mono text-[11px] text-slate-300 space-y-1 bg-slate-900/60 p-2.5 rounded-xl">
                  <p className="text-slate-500"># Direct test APK (for teachers & principal):</p>
                  <p className="text-emerald-300 font-bold">flutter build apk --release</p>
                  <p className="text-slate-500 pt-2"># Play Store Production Bundle (AAB):</p>
                  <p className="text-amber-300 font-bold">flutter build appbundle --release</p>
                </div>
                <p className="text-[11px] text-slate-400">
                  Output: <code className="text-slate-200">build/app/outputs/bundle/release/app-release.aab</code>
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> App 2: Student & Parent App
                </h4>
                <div className="font-mono text-[11px] text-slate-300 space-y-1 bg-slate-900/60 p-2.5 rounded-xl">
                  <p className="text-slate-500"># Direct test APK (for parents & students):</p>
                  <p className="text-emerald-300 font-bold">flutter build apk --release</p>
                  <p className="text-slate-500 pt-2"># Play Store Production Bundle (AAB):</p>
                  <p className="text-amber-300 font-bold">flutter build appbundle --release</p>
                </div>
                <p className="text-[11px] text-slate-400">
                  Output: <code className="text-slate-200">build/app/outputs/bundle/release/app-release.aab</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Store Metadata */}
      {activeSubTab === 'metadata' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">
              Play Store Listing Metadata (English & Indian Schools)
            </h3>
            <button
              onClick={() => copyToClipboard(PLAY_STORE_METADATA, 'metadata_file')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              {copiedKey === 'metadata_file' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'metadata_file' ? 'Copied Metadata!' : 'Copy Metadata'}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre>{PLAY_STORE_METADATA}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Data Safety */}
      {activeSubTab === 'datasafety' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">
              Google Play Console Data Safety Questionnaire Answers
            </h3>
            <button
              onClick={() => copyToClipboard(DATA_SAFETY_ANSWERS, 'datasafety_file')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              {copiedKey === 'datasafety_file' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'datasafety_file' ? 'Copied Answers!' : 'Copy Questionnaire'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Fill these exact answers in Google Play Console &gt; Policy and programs &gt; App content &gt; Data safety.
          </p>
          <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre>{DATA_SAFETY_ANSWERS}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Privacy Policy */}
      {activeSubTab === 'privacy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">
              Privacy Policy Text (Compliant with India DPDP Act 2023 & Google Play)
            </h3>
            <button
              onClick={() => copyToClipboard(PRIVACY_POLICY_TEXT, 'privacy_file')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              {copiedKey === 'privacy_file' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'privacy_file' ? 'Copied Privacy Policy!' : 'Copy Privacy Policy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Host this text at a public URL (e.g. <code className="text-indigo-300">https://your-school.edu.in/privacy-policy</code>) and paste the URL into your Google Play Console store listing.
          </p>
          <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre>{PRIVACY_POLICY_TEXT}</pre>
          </div>
        </div>
      )}

      {/* Tab 5: Reviewer Credentials */}
      {activeSubTab === 'review_creds' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">
              App Reviewer Test Accounts (For Google Play & Apple Review Teams)
            </h3>
            <button
              onClick={() => copyToClipboard(reviewAccounts, 'review_acc')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              {copiedKey === 'review_acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'review_acc' ? 'Copied Credentials!' : 'Copy Test Accounts'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Provide these in Google Play Console &gt; App Access so the Google review team can test without getting blocked by OTPs or pending approval gates.
          </p>
          <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre>{reviewAccounts}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
