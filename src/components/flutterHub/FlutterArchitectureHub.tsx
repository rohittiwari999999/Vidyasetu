import React, { useState } from 'react';
import { Deliverable1Schema } from './Deliverable1Schema';
import { Deliverable2Structure } from './Deliverable2Structure';
import { Deliverable3AuthCode } from './Deliverable3AuthCode';
import { Deliverable4HomeworkCode } from './Deliverable4HomeworkCode';
import { Deliverable5BroadcastCode } from './Deliverable5BroadcastCode';
import { Deliverable6ExamsPtmCode } from './Deliverable6ExamsPtmCode';
import { PlayConsolePublishGuide } from './PlayConsolePublishGuide';
import { NativeBuildConfigsView } from './NativeBuildConfigsView';
import { PlayConsoleAssetVault } from './PlayConsoleAssetVault';
import { generateAndDownloadFlutterProjectZip } from '../../services/zipExporter';
import {
  Database,
  FolderTree,
  ShieldCheck,
  BookOpen,
  Radio,
  Award,
  Download,
  Sparkles,
  Play,
  FileCode,
  FolderArchive,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

export const FlutterArchitectureHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'asset_vault' | 'play_publish' | 'native_configs' | 1 | 2 | 3 | 4 | 5 | 6>('asset_vault');
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    setZipProgress(10);
    try {
      await generateAndDownloadFlutterProjectZip((percent) => {
        setZipProgress(Math.round(percent));
      });
    } catch (e) {
      console.error('Failed to create ZIP', e);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hub Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Google Play Console &amp; Android/iOS Release Suite
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Play Console Release Assets, Photos &amp; Dual-App Hub
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Standalone codebases for <strong>School Management App</strong> &amp; <strong>Student/Parent App</strong> with pre-built <strong>APK/AAB release configs</strong>, <strong>512x512 App Icons</strong>, <strong>1024x500 Feature Graphics</strong>, and <strong>1080x1920 Screenshots</strong> in the <code className="text-emerald-300 font-mono">/play_console_release_package/</code> folder.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Bundling Package ({zipProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Complete Release Package (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Deliverables Switcher Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-6 mt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('asset_vault')}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 'asset_vault'
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <FolderArchive className="w-4 h-4 text-emerald-300" />
              <span className="text-[10px] font-mono font-bold uppercase opacity-80">PHOTOS</span>
            </div>
            <div className="text-xs font-bold leading-tight">Play Console Photos &amp; Assets</div>
          </button>

          <button
            onClick={() => setActiveTab('play_publish')}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 'play_publish'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Play className="w-4 h-4 fill-indigo-300" />
              <span className="text-[10px] font-mono font-bold uppercase opacity-80">GUIDE</span>
            </div>
            <div className="text-xs font-bold leading-tight">Play Console Publish Guide</div>
          </button>

          <button
            onClick={() => setActiveTab('native_configs')}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 'native_configs'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <FileCode className="w-4 h-4 text-indigo-300" />
              <span className="text-[10px] font-mono font-bold uppercase opacity-80">CONFIGS</span>
            </div>
            <div className="text-xs font-bold leading-tight">Android &amp; iOS Native Files</div>
          </button>

          <button
            onClick={() => setActiveTab(1)}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 1
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold opacity-80">PART 1</span>
            </div>
            <div className="text-xs font-bold leading-tight">Firestore Schema &amp; Rules</div>
          </button>

          <button
            onClick={() => setActiveTab(2)}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 2
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <FolderTree className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold opacity-80">PART 2</span>
            </div>
            <div className="text-xs font-bold leading-tight">Project Folder Structure</div>
          </button>

          <button
            onClick={() => setActiveTab(3)}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 3
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold opacity-80">PART 3</span>
            </div>
            <div className="text-xs font-bold leading-tight">Auth Flow &amp; Routing Code</div>
          </button>

          <button
            onClick={() => setActiveTab(4)}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 4
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold opacity-80">PART 4</span>
            </div>
            <div className="text-xs font-bold leading-tight">Teacher Homework Module</div>
          </button>

          <button
            onClick={() => setActiveTab(5)}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 5
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Radio className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold opacity-80">PART 5</span>
            </div>
            <div className="text-xs font-bold leading-tight">Broadcast Messaging &amp; FCM</div>
          </button>

          <button
            onClick={() => setActiveTab(6)}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeTab === 6
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Award className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] font-mono font-bold opacity-80">PART 6</span>
            </div>
            <div className="text-xs font-bold leading-tight">Exam Marks &amp; PTM Module</div>
          </button>
        </div>
      </div>

      {/* Render Deliverable Content */}
      <div className="animate-fade-in">
        {activeTab === 'asset_vault' && <PlayConsoleAssetVault />}
        {activeTab === 'play_publish' && <PlayConsolePublishGuide />}
        {activeTab === 'native_configs' && <NativeBuildConfigsView />}
        {activeTab === 1 && <Deliverable1Schema />}
        {activeTab === 2 && <Deliverable2Structure />}
        {activeTab === 3 && <Deliverable3AuthCode />}
        {activeTab === 4 && <Deliverable4HomeworkCode />}
        {activeTab === 5 && <Deliverable5BroadcastCode />}
        {activeTab === 6 && <Deliverable6ExamsPtmCode />}
      </div>
    </div>
  );
};
