import React, { useState } from 'react';
import { useSchool, SchoolProvider, AppViewMode } from './context/SchoolContext';
import { ManagementDashboard } from './components/management/ManagementDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { DualPhoneView } from './components/common/DualPhoneView';
import { FlutterArchitectureHub } from './components/flutterHub/FlutterArchitectureHub';
import { SimulatedNotification } from './components/common/SimulatedNotification';
import { LiveClassModal } from './components/classroom/LiveClassModal';
import { RegisterStudentModal } from './components/common/RegisterStudentModal';
import { PhoneTestModal } from './components/common/PhoneTestModal';
import { generateAndDownloadFlutterProjectZip } from './services/zipExporter';
import {
  Smartphone,
  School,
  UserPlus,
  Code2,
  GraduationCap,
  Download,
  Loader2,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentUser,
    users,
    setCurrentUser,
    viewMode,
    setViewMode,
    pendingStudents,
    resetToDefaults,
  } = useSchool();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPhoneTestModal, setShowPhoneTestModal] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await generateAndDownloadFlutterProjectZip();
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Universal School Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & School Affiliation */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setViewMode('dual')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white flex items-center justify-center font-extrabold text-base shadow-lg">
                VS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight">VidyaSetu</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    K-12 INDIA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  Delhi Modern Academy • CBSE Affiliated (PG to 12th)
                </p>
              </div>
            </div>

            {/* Mobile View Switcher */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="p-2 rounded-xl bg-indigo-600 text-white"
                title="Register New Student"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setViewMode('dual')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                viewMode === 'dual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Dual Phone Sync</span>
            </button>

            <button
              onClick={() => setViewMode('management')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                viewMode === 'management' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Management App</span>
              {pendingStudents.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                  {pendingStudents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                viewMode === 'student' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student / Parent App</span>
            </button>

            <button
              onClick={() => setViewMode('flutter-hub')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                viewMode === 'flutter-hub' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Flutter & Firebase Code</span>
            </button>

            <button
              onClick={() => setShowPhoneTestModal(true)}
              className="px-3.5 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 transition whitespace-nowrap bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg border border-emerald-400/40"
              title="Install & Test APK on Phone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install APK on Phone</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </button>
          </div>

          {/* User Role Switcher & Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isZipping ? 'Zipping...' : 'Download Project ZIP'}</span>
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Student Signup</span>
            </button>

            {/* Active User Identity */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200">
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-600"
              />
              <span className="hidden sm:inline max-w-[120px] truncate">{currentUser.name}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {viewMode === 'dual' && <DualPhoneView />}
        {viewMode === 'management' && <ManagementDashboard />}
        {viewMode === 'student' && <StudentDashboard />}
        {viewMode === 'flutter-hub' && <FlutterArchitectureHub />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">VidyaSetu</span>
            <span>•</span>
            <span>Indian School Management Ecosystem (Playgroup to 12th Grade)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>CBSE / ICSE / State Board Ready</span>
            <span>•</span>
            <span>Cross-Platform Flutter 3.19+ & Firebase</span>
          </div>
        </div>
      </footer>

      {/* Overlays, Modals & Notifications */}
      <SimulatedNotification />
      <LiveClassModal />
      {showRegisterModal && (
        <RegisterStudentModal onClose={() => setShowRegisterModal(false)} />
      )}
      <PhoneTestModal
        isOpen={showPhoneTestModal}
        onClose={() => setShowPhoneTestModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
