import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserProfile } from '../../types';
import {
  CheckCircle,
  XCircle,
  UserCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const PendingApprovalsView: React.FC = () => {
  const { pendingStudents, approveStudent, rejectStudent } = useSchool();
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [rollNo, setRollNo] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [section, setSection] = useState('A');
  const [rejectModalStudent, setRejectModalStudent] = useState<UserProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('Incomplete previous school Transfer Certificate (TC)');

  const handleOpenApproveModal = (student: UserProfile) => {
    setSelectedStudent(student);
    const randomRoll = Math.floor(20 + Math.random() * 20).toString();
    const currentYear = new Date().getFullYear();
    const randomAdm = `DMA-${currentYear}/${Math.floor(1000 + Math.random() * 9000)}`;
    setRollNo(randomRoll);
    setAdmissionNo(randomAdm);
    setSection('A');
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    approveStudent(selectedStudent.id, rollNo, admissionNo, section);
    setSelectedStudent(null);
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalStudent) return;
    rejectStudent(rejectModalStudent.id, rejectReason);
    setRejectModalStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-indigo-500/10 border border-amber-500/30 rounded-3xl p-5 md:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Pending Admission & App Approvals
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  {pendingStudents.length} Awaiting Verification
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Students and parents who register via the mobile app remain locked in "Pending" status until verified by the School Admin, Principal, or Class Teacher. Once approved, credentials and class access are instantly granted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending List */}
      {pendingStudents.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">All Clear! No Pending Registrations</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            All student applications have been reviewed. When new parents register via the mobile app, their requests will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingStudents.map((student) => {
            const details = student.studentDetails;
            return (
              <div
                key={student.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"}
                        alt={student.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {student.name}
                        </h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[11px] border border-indigo-500/30">
                          {details?.grade || 'Class'}
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  </div>

                  {/* Student Details Grid */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Parent/Guardian:</span>
                      <span className="font-semibold text-slate-200">{details?.parentName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-200 font-mono">{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-200 truncate">{student.email}</span>
                    </div>
                    {details?.dob && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-300">DOB: {details.dob} (Blood: {details.bloodGroup || 'B+'})</span>
                      </div>
                    )}
                    {details?.address && (
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{details.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleOpenApproveModal(student)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Verify & Approve
                  </button>
                  <button
                    onClick={() => setRejectModalStudent(student)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 font-semibold text-xs transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approval Verification Dialog */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Confirm Admission & Generate Student ID
                </h3>
                <p className="text-xs text-slate-400">
                  Assigning credentials for {selectedStudent.name} ({selectedStudent.studentDetails?.grade})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Class Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Assign Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Permanent Admission / SRN Number
                </label>
                <input
                  type="text"
                  required
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                  placeholder="e.g. DMA-2026/1089"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Unique Student Registration Number registered on CBSE / State Board portal.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> What happens upon verification?
                </div>
                <p className="text-[11px] text-slate-400">
                  1. Student account status in Firestore transitions from <span className="text-amber-300">pending</span> to <span className="text-emerald-300">approved</span>.
                </p>
                <p className="text-[11px] text-slate-400">
                  2. FCM Push Notification and SMS sent to parent: {selectedStudent.phone}.
                </p>
                <p className="text-[11px] text-slate-400">
                  3. Student instantly gains full access to assignments, timetable, live classes, and fee ledger.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Unlock App Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {rejectModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Decline Registration</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Provide a valid reason for declining {rejectModalStudent.name}'s registration. The parent will be notified.
            </p>

            <form onSubmit={handleConfirmRejection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
