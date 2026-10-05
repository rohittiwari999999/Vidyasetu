import React, { useState } from 'react';
import {
  MANAGEMENT_APP_BUILD_GRADLE,
  MANAGEMENT_APP_MANIFEST,
  STUDENT_APP_BUILD_GRADLE,
  STUDENT_APP_MANIFEST,
  KEY_PROPERTIES_TEMPLATE,
  PROGUARD_RULES,
  IOS_INFO_PLIST,
} from '../../data/flutterProjectFiles';
import { Copy, Check, FileCode, Smartphone, School, Apple } from 'lucide-react';

export const NativeBuildConfigsView: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<'mgmt' | 'student'>('mgmt');
  const [selectedFile, setSelectedFile] = useState<'gradle' | 'manifest' | 'keyprops' | 'proguard' | 'ios_plist'>('gradle');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getActiveContent = () => {
    if (selectedFile === 'ios_plist') return IOS_INFO_PLIST;
    if (selectedFile === 'keyprops') return KEY_PROPERTIES_TEMPLATE;
    if (selectedFile === 'proguard') return PROGUARD_RULES;

    if (selectedApp === 'mgmt') {
      return selectedFile === 'gradle' ? MANAGEMENT_APP_BUILD_GRADLE : MANAGEMENT_APP_MANIFEST;
    } else {
      return selectedFile === 'gradle' ? STUDENT_APP_BUILD_GRADLE : STUDENT_APP_MANIFEST;
    }
  };

  const getFilePath = () => {
    const appDir = selectedApp === 'mgmt' ? 'apps/school_management_app' : 'apps/student_parent_app';
    if (selectedFile === 'gradle') return `${appDir}/android/app/build.gradle`;
    if (selectedFile === 'manifest') return `${appDir}/android/app/src/main/AndroidManifest.xml`;
    if (selectedFile === 'keyprops') return `${appDir}/android/key.properties`;
    if (selectedFile === 'proguard') return `${appDir}/android/app/proguard-rules.pro`;
    if (selectedFile === 'ios_plist') return `${appDir}/ios/Runner/Info.plist`;
    return '';
  };

  const content = getActiveContent();
  const filePath = getFilePath();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <FileCode className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Android & iOS Native Release Configurations
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Production configuration files for TargetSDK 34 (Android 14+), Play Store App Signing, ProGuard optimization, and iOS Camera & Mic permissions.
            </p>
          </div>

          {/* App Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedApp('mgmt')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                selectedApp === 'mgmt' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Management App</span>
            </button>
            <button
              onClick={() => setSelectedApp('student')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                selectedApp === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Student App</span>
            </button>
          </div>
        </div>
      </div>

      {/* File Selector & Code Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedFile('gradle')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFile === 'gradle' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              android/app/build.gradle
            </button>

            <button
              onClick={() => setSelectedFile('manifest')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFile === 'manifest' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              AndroidManifest.xml
            </button>

            <button
              onClick={() => setSelectedFile('keyprops')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFile === 'keyprops' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              key.properties
            </button>

            <button
              onClick={() => setSelectedFile('proguard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFile === 'proguard' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              proguard-rules.pro
            </button>

            <button
              onClick={() => setSelectedFile('ios_plist')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                selectedFile === 'ios_plist' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>ios/Runner/Info.plist</span>
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(content, filePath)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
          >
            {copiedKey === filePath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === filePath ? 'Copied Content!' : 'Copy File Content'}</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-indigo-300 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 flex items-center justify-between">
          <span>Path: {filePath}</span>
          <span className="text-slate-500">UTF-8</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto border border-slate-800">
          <pre>{content}</pre>
        </div>
      </div>
    </div>
  );
};
