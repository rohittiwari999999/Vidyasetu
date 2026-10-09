import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PendingApprovalGate } from './PendingApprovalGate';
import { StudentHomeworkView } from './StudentHomeworkView';
import { StudentAttendanceCalendar } from './StudentAttendanceCalendar';
import { StudentNoticeBoard } from './StudentNoticeBoard';
import { StudentFeeLedger } from './StudentFeeLedger';
import { StudentReportCard } from './StudentReportCard';
import { StudentTimetable } from './StudentTimetable';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Bell,
  CreditCard,
  Award,
  Clock,
  Video,
  ShieldCheck,
  Building,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, currentStudentUser, homeworkList, broadcasts, liveClasses, setActiveLiveClassModal } = useSchool();
  const [activeTab, setActiveTab] = useState<'overview' | 'homework' | 'live' | 'attendance' | 'notices' | 'fees' | 'report_card' | 'timetable'>('overview');

  const activeStudent = (currentUser.role === 'student' || currentUser.role === 'parent') ? currentUser : currentStudentUser;

  // If status is pending, show the verification gate!
  if (activeStudent.status === 'pending') {
    return <PendingApprovalGate />;
  }

  const studentDetails = activeStudent.studentDetails;
  const pendingHw = homeworkList.filter((h) => h.classId === studentDetails?.grade).slice(0, 2);
  const activeLive = liveClasses.find((l) => l.classId === studentDetails?.grade && l.status === 'live');
  const latestNotice = broadcasts[0];

  return (
    <div className="space-y-6">
      {/* Student ID Card Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeStudent.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"}
                alt={activeStudent.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full text-[10px] font-bold shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {activeStudent.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  VERIFIED STUDENT
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="font-semibold text-indigo-300">
                  {studentDetails?.grade || 'Class 10-A'}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-400">
                  Roll: <strong className="text-white">#{studentDetails?.rollNumber || '12'}</strong>
                </span>
                <span>•</span>
                <span className="font-mono text-slate-400">
                  SRN: <strong className="text-white">{studentDetails?.admissionNumber || 'DMA-2022/1042'}</strong>
                </span>
                <span>•</span>
                <span className="text-amber-400 font-medium">House: Shivaji House</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end text-xs text-slate-400">
            <span className="text-slate-300 font-semibold">{currentUser.schoolName}</span>
            <span className="text-[11px]">CBSE Affiliation No: 2130894</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 scrollbar-none border-t border-slate-800/80 mt-5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('homework')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'homework'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Homework</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition relative ${
              activeTab === 'live'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Live Class</span>
            {activeLive && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'notices'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notices</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'fees'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Fees & Receipt</span>
          </button>

          <button
            onClick={() => setActiveTab('report_card')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'report_card'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Report Card</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'timetable'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timetable</span>
          </button>
        </div>
      </div>

      {/* Tab views */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Active Live Class Banner if any */}
          {activeLive && (
            <div className="bg-gradient-to-r from-rose-900/40 via-slate-900 to-indigo-950/40 border border-rose-500/40 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
                  <Video className="w-6 h-6 animate-pulse" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase">
                      LIVE CLASSROOM NOW
                    </span>
                    <h3 className="font-bold text-white text-base">{activeLive.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Host: {activeLive.teacherName} • Subject: {activeLive.subject} • Platform: Integrated Jitsi
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveLiveClassModal(activeLive)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition"
              >
                <span>Join Live Class</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Attendance</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">96.4%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">23 of 24 days present</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Pending Homework</span>
              <div className="text-2xl font-bold font-mono text-indigo-300 mt-1">{pendingHw.length}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Due in next 4 days</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">CBSE Term 1 Score</span>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-1">94.0%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Rank #2 in Class 10-A</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Q3 Fee Status</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">Pending</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Due: 15 Oct 2026</p>
            </div>
          </div>

          {/* Two column: Pending assignments + Notice board peek */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Homework Peek */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Active Homework & Worksheets</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('homework')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingHw.map((hw) => (
                    <div
                      key={hw.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300">{hw.subject}</span>
                        <span className="text-[11px] text-slate-400 font-mono">Due: {hw.dueDate}</span>
                      </div>
                      <h4 className="font-semibold text-white truncate">{hw.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{hw.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('homework')}
                className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Open Homework Submission Drawer
              </button>
            </div>

            {/* Latest Notice Peek */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Important School Notice</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    All Circulars <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {latestNotice && (
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
                        {latestNotice.category}
                      </span>
                      <h4 className="font-bold text-white text-sm truncate">{latestNotice.title}</h4>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {latestNotice.message}
                    </p>
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                      Dispatched by {latestNotice.senderName}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('fees')}
                className="mt-4 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Quarter 3 School Fees (₹20,200)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'homework' && <StudentHomeworkView />}
      {activeTab === 'live' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white">Live Virtual Classroom</h2>
          <p className="text-xs text-slate-400">
            Join your subject teacher's live online lecture. Zero external setup required.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
                    Subject: {session.subject} • Class: {session.classId}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Teacher: {session.teacherName}</p>
                </div>
                <button
                  onClick={() => setActiveLiveClassModal(session)}
                  className="mt-4 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                >
                  Join Video Session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'attendance' && <StudentAttendanceCalendar />}
      {activeTab === 'notices' && <StudentNoticeBoard />}
      {activeTab === 'fees' && <StudentFeeLedger />}
      {activeTab === 'report_card' && <StudentReportCard />}
      {activeTab === 'timetable' && <StudentTimetable />}
    </div>
  );
};
