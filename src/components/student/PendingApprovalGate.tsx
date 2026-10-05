import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Clock,
  ShieldAlert,
  Phone,
  Mail,
  UserCheck,
  CheckCircle,
  RefreshCw,
  School,
} from 'lucide-react';

export const PendingApprovalGate: React.FC = () => {
  const { currentUser, approveStudent, setViewMode } = useSchool();

  const handleSimulateInstantApproval = () => {
    approveStudent(
      currentUser.id,
      '24',
      'DMA-2026/' + Math.floor(1000 + Math.random() * 9000),
      'A'
    );
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 mb-4 shadow-lg">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 uppercase tracking-wider mb-2">
          Registration Under Review
        </span>

        <h2 className="text-xl font-extrabold text-white">
          Awaiting Verification & Approval
        </h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Welcome to <strong className="text-white">Delhi Modern Academy</strong>. Your registration for{' '}
          <span className="text-amber-300 font-semibold">{currentUser.studentDetails?.grade || 'Class'}</span> has been submitted to the School Management and Class Teacher for document verification.
        </p>

        {/* Applicant Summary */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 my-5 text-left text-xs space-y-2">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Student Name:</span>
            <span className="font-bold text-white">{currentUser.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Target Grade:</span>
            <span className="font-bold text-indigo-300">{currentUser.studentDetails?.grade}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Parent / Guardian:</span>
            <span className="font-semibold text-slate-200">{currentUser.studentDetails?.parentName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Registered Phone:</span>
            <span className="font-mono text-slate-200">{currentUser.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status in Firestore:</span>
            <span className="font-bold text-amber-400 font-mono">status: "pending"</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Check Approval Status</span>
          </button>

          {/* Quick Demo Simulator Helper */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3.5 text-xs text-left">
            <div className="flex items-center gap-2 font-bold text-indigo-300 mb-1">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Interactive Evaluation Mode:</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              You are simulating a pending student! You can either switch to the <strong>Management App</strong> to verify them from the "Pending Approvals" tab, or click below for instant 1-click approval:
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSimulateInstantApproval}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Simulate 1-Click Verification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
