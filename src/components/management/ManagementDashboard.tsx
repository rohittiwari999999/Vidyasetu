import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PendingApprovalsView } from './PendingApprovalsView';
import { AttendanceRegister } from './AttendanceRegister';
import { HomeworkManager } from './HomeworkManager';
import { BroadcastCenter } from './BroadcastCenter';
import { FeeManagementView } from './FeeManagementView';
import { ExamMarksPtmManager } from './ExamMarksPtmManager';
import { StaffAccessManagementView } from './StaffAccessManagementView';
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  BookOpen,
  Radio,
  CreditCard,
  Video,
  Users,
  Award,
  Shield,
  Building2,
  TrendingUp,
  Clock,
  Sparkles,
  PhoneCall,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export const ManagementDashboard: React.FC = () => {
  const {
    currentUser,
    pendingStudents,
    users,
    liveClasses,
    startLiveClass,
    setActiveLiveClassModal,
    verifiedStaffList,
    loginAsStaffMember,
    setCurrentUser,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'attendance' | 'homework' | 'broadcast' | 'fees' | 'live' | 'exams_ptm' | 'staff_access'>('overview');
  const [liveSubject, setLiveSubject] = useState('Mathematics');
  const [liveTitle, setLiveTitle] = useState('Class 10-A: Real Numbers & Revision Drill');
  const [liveClassTarget, setLiveClassTarget] = useState('Class 10-A');
  const [showStartLiveModal, setShowStartLiveModal] = useState(false);
  const [showFacultySwitchModal, setShowFacultySwitchModal] = useState(false);

  const isClassTeacher = currentUser.role === 'teacher';
  const isPrincipalOrManager = currentUser.role === 'principal' || currentUser.role === 'manager';

  const handleStartLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;
    startLiveClass(liveTitle, liveSubject, liveClassTarget);
    setShowStartLiveModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs uppercase border border-indigo-500/30">
                  {currentUser.role}
                </span>
                {currentUser.teacherDetails?.assignedClass && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                    CT: {currentUser.teacherDetails.assignedClass}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.schoolName} (CBSE Affiliated #2130894)
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFacultySwitchModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
              title="Switch between Teacher, Class Teacher, Principal, or Admin accounts"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Switch Faculty Login</span>
            </button>

            <button
              onClick={() => setShowStartLiveModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Host Live Class</span>
            </button>

            {pendingStudents.length > 0 && (
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verify Pending ({pendingStudents.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition relative ${
              activeTab === 'approvals'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pending Approvals</span>
            {pendingStudents.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                {pendingStudents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Attendance Register</span>
          </button>

          <button
            onClick={() => setActiveTab('homework')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'homework'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Class Teacher Homework</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'broadcast'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'fees'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Fee Collection</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'live'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Live Classroom</span>
          </button>

          <button
            onClick={() => setActiveTab('exams_ptm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'exams_ptm'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Exam Marks & PTM</span>
          </button>

          <button
            onClick={() => setActiveTab('staff_access')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition relative ${
              activeTab === 'staff_access'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Staff Access (RBAC)</span>
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold text-[10px] flex items-center justify-center">
              {verifiedStaffList.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Executive KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Students</span>
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">1,482</div>
              <p className="text-[11px] text-slate-400 mt-1">Playgroup to 12th Senior Sec</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Daily Attendance</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-400">94.6%</div>
              <p className="text-[11px] text-slate-400 mt-1">1,402 Present • 80 Absent</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Q3 Fee Realized</span>
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-purple-300">₹78.4 L</div>
              <p className="text-[11px] text-slate-400 mt-1">84% of Term 3 target</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Pending Approvals</span>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-300">{pendingStudents.length}</div>
              <p className="text-[11px] text-amber-400/90 mt-1">New registrations to verify</p>
            </div>
          </div>

          {/* Quick Shortcuts & Live Class Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Class Teacher Focus */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Class Teacher Command: Class 10-A</span>
                </h3>
                <span className="text-xs text-indigo-400 font-semibold">Teacher: Mrs. Meenakshi Sharma</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 p-4 rounded-2xl text-left transition group"
                >
                  <Calendar className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-white text-xs">Take Daily Roll Call</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Present, Absent, Late & Leaves</p>
                </button>

                <button
                  onClick={() => setActiveTab('homework')}
                  className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 p-4 rounded-2xl text-left transition group"
                >
                  <BookOpen className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-white text-xs">Assign Homework</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Worksheets & problem sets</p>
                </button>

                <button
                  onClick={() => setActiveTab('broadcast')}
                  className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 p-4 rounded-2xl text-left transition group"
                >
                  <Radio className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-white text-xs">Class Push Circular</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Urgent parent broadcast</p>
                </button>

                <button
                  onClick={() => setActiveTab('exams_ptm')}
                  className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 p-4 rounded-2xl text-left transition group"
                >
                  <Award className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-white text-xs">Exams & PTM Desk</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Marks entry & consultations</p>
                </button>
              </div>

              {/* Indian School Academic Structure Overview */}
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300">
                <h4 className="font-bold text-white mb-2">School Grade Structure (CBSE / State Pattern)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold">Pre-Primary</span>
                    <p className="text-slate-400">Playgroup, Nursery, LKG, UKG</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold">Primary</span>
                    <p className="text-slate-400">Classes 1 to 5</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-blue-400 font-bold">Secondary</span>
                    <p className="text-slate-400">Classes 6 to 10 (Board Exam)</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-purple-400 font-bold">Sr. Secondary</span>
                    <p className="text-slate-400">11th & 12th (Sci/Comm/Arts)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Live Video Sessions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-400" />
                    <span>Live Video Classes</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Integrated Jitsi
                  </span>
                </div>

                <div className="space-y-3">
                  {liveClasses.map((session) => (
                    <div
                      key={session.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs truncate">{session.title}</span>
                        {session.status === 'live' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {session.classId} • {session.subject} • Host: {session.teacherName}
                      </p>
                      <button
                        onClick={() => setActiveLiveClassModal(session)}
                        className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition shadow"
                      >
                        Enter Live Class Room
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setShowStartLiveModal(true)}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Video className="w-4 h-4" /> Start New Video Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && <PendingApprovalsView />}
      {activeTab === 'attendance' && <AttendanceRegister />}
      {activeTab === 'homework' && <HomeworkManager />}
      {activeTab === 'broadcast' && <BroadcastCenter />}
      {activeTab === 'fees' && <FeeManagementView />}
      {activeTab === 'live' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white">Live Video Conferencing Hub</h2>
              <p className="text-xs text-slate-400 mt-1">
                Integrated WebRTC / Jitsi Meet SDK. No third-party downloads required for students.
              </p>
            </div>
            <button
              onClick={() => setShowStartLiveModal(true)}
              className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Video className="w-4 h-4" /> Start Instant Class
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveClasses.map((session) => (
              <div
                key={session.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase">
                      {session.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{session.roomCode}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-2 mb-1">{session.title}</h3>
                  <p className="text-xs text-slate-300">
                    Subject: {session.subject} • Target: {session.classId}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Teacher: {session.teacherName}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{session.participantsCount} Connected</span>
                  <button
                    onClick={() => setActiveLiveClassModal(session)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                  >
                    Join Video Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'exams_ptm' && <ExamMarksPtmManager />}
      {activeTab === 'staff_access' && <StaffAccessManagementView />}

      {/* Switch Faculty / Teacher Login Modal */}
      {showFacultySwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <LogIn className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Switch Faculty Member / Teacher Login</h3>
                  <p className="text-xs text-slate-400">
                    Log in as any authorized teacher or administrator to view their personalized class dashboard.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFacultySwitchModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Current Active User Banner */}
            <div className="mt-4 p-3.5 bg-slate-950 border border-indigo-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-indigo-400"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] text-indigo-300">
                    Current Active: {currentUser.role.toUpperCase()}
                    {currentUser.teacherDetails?.assignedClass ? ` • ${currentUser.teacherDetails.assignedClass}` : ''}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                Logged In
              </span>
            </div>

            {/* Faculty Directory Options */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Authorized Faculty Roster ({verifiedStaffList.length}):
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {verifiedStaffList.map((staff) => {
                  const isCurrent =
                    currentUser.email.toLowerCase() === staff.email.toLowerCase() ||
                    currentUser.name.toLowerCase() === staff.name.toLowerCase();

                  return (
                    <button
                      key={staff.id}
                      onClick={() => {
                        loginAsStaffMember(staff.id);
                        setShowFacultySwitchModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                        isCurrent
                          ? 'bg-indigo-600/20 border-indigo-500/60 text-white'
                          : 'bg-slate-950/80 hover:bg-slate-800/90 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {staff.name.replace(/^(Mr\.|Mrs\.|Dr\.|Er\.)\s*/i, '').charAt(0) || 'T'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-white truncate">{staff.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize truncate">
                            {staff.role === 'classTeacher'
                              ? `Class Teacher (${staff.assignedClass})`
                              : staff.role === 'principal'
                              ? 'Principal'
                              : staff.role === 'admin'
                              ? 'Management Admin'
                              : `Subject Teacher (${staff.subject})`}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Switch'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setShowFacultySwitchModal(false);
                  setActiveTab('staff_access');
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manage / Pre-Verify More Staff</span>
              </button>

              <button
                onClick={() => setShowFacultySwitchModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Live Session Modal */}
      {showStartLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Video className="w-5 h-5 text-rose-400" />
              <span>Launch Live Online Class</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Creates a secure Jitsi Meet room and notifies students with 1-click join link.
            </p>

            <form onSubmit={handleStartLive} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Class</label>
                <select
                  value={liveClassTarget}
                  onChange={(e) => setLiveClassTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Class 10-A">Class 10-A</option>
                  <option value="Class 12-Science">Class 12-Science</option>
                  <option value="Class 8-B">Class 8-B</option>
                  <option value="Nursery">Nursery</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={liveSubject}
                  onChange={(e) => setLiveSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Topic / Lecture Title</label>
                <input
                  type="text"
                  required
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStartLiveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg transition"
                >
                  Go Live Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
