import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { VerifiedStaffItem, INDIAN_CLASSES } from '../../data/mockData';
import {
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  LogIn,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  School,
  Lock,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const StaffAccessManagementView: React.FC = () => {
  const {
    verifiedStaffList,
    addVerifiedStaff,
    updateVerifiedStaff,
    deleteVerifiedStaff,
    toggleStaffStatus,
    loginAsStaffMember,
    currentUser,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'classTeacher' | 'generalTeacher' | 'principal' | 'admin'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<VerifiedStaffItem | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<VerifiedStaffItem | null>(null);

  // New Staff Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('Staff@123');
  const [newRole, setNewRole] = useState<'classTeacher' | 'generalTeacher' | 'principal' | 'admin'>('classTeacher');
  const [newAssignedClass, setNewAssignedClass] = useState('Class 10-A');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newEmployeeId, setNewEmployeeId] = useState('');

  // Handle Add Staff Submit
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim()) return;

    addVerifiedStaff({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim(),
      password: newPassword.trim() || 'Staff@123',
      role: newRole,
      assignedClass: newRole === 'classTeacher' ? newAssignedClass : newRole === 'admin' ? 'All Wings' : newRole === 'principal' ? 'All Classes' : '',
      subject: newSubject.trim() || 'General',
      employeeId: newEmployeeId.trim() || `EMP-T${Math.floor(100 + Math.random() * 900)}`,
      addedBy: currentUser.name,
    });

    // Reset & Close
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('Staff@123');
    setNewSubject('Mathematics');
    setNewEmployeeId('');
    setShowAddModal(false);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    updateVerifiedStaff(editingStaff.id, {
      name: editingStaff.name,
      email: editingStaff.email,
      phone: editingStaff.phone,
      password: editingStaff.password,
      role: editingStaff.role,
      assignedClass: editingStaff.role === 'classTeacher' ? editingStaff.assignedClass : '',
      subject: editingStaff.subject,
    });

    setEditingStaff(null);
  };

  // Filtered List
  const filteredStaff = verifiedStaffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.assignedClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);

    const matchesRole =
      selectedRoleFilter === 'all' || staff.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const classTeacherCount = verifiedStaffList.filter((s) => s.role === 'classTeacher').length;
  const adminPrincipalCount = verifiedStaffList.filter((s) => s.role === 'admin' || s.role === 'principal').length;
  const activeCount = verifiedStaffList.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Staff Access & RBAC Directory
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  {verifiedStaffList.length} Pre-Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Only faculty pre-verified in this directory can authenticate and access class rosters.
                Assign official Class Teachers to classes, manage credentials, and audit permissions.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setNewEmployeeId(`EMP-T${Math.floor(100 + Math.random() * 900)}`);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Pre-Verify New Staff</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Faculty</div>
          <div className="text-2xl font-bold text-white mt-1">{verifiedStaffList.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">{activeCount} Active Authorized</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Class Teachers</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{classTeacherCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Class Attendance & Marks In-charge</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Admins & Principals</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{adminPrincipalCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Full Institution Controls</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">RBAC Protection</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Active</div>
          <p className="text-[10px] text-slate-400 mt-1">Zero Unauthorized Logins</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teacher name, assigned class, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedRoleFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({verifiedStaffList.length})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('classTeacher')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedRoleFilter === 'classTeacher'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Class Teachers ({classTeacherCount})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('principal')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedRoleFilter === 'principal'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Principals
          </button>
          <button
            onClick={() => setSelectedRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedRoleFilter === 'admin'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Admins
          </button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => {
          const isCurrentLoggedIn =
            currentUser.email.toLowerCase() === staff.email.toLowerCase() ||
            currentUser.name.toLowerCase() === staff.name.toLowerCase();

          const roleBadgeColor =
            staff.role === 'admin'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              : staff.role === 'principal'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : staff.role === 'classTeacher'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';

          const roleDisplay =
            staff.role === 'classTeacher'
              ? 'Class Teacher'
              : staff.role === 'principal'
              ? 'Principal'
              : staff.role === 'admin'
              ? 'Management Admin'
              : 'Subject Faculty';

          return (
            <div
              key={staff.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all ${
                isCurrentLoggedIn
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              } ${!staff.isActive ? 'opacity-60' : ''}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center font-bold text-white text-base shadow">
                      {staff.name.replace(/^(Mr\.|Mrs\.|Dr\.|Er\.)\s*/i, '').charAt(0) || 'T'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-white text-sm leading-tight">
                          {staff.name}
                        </h3>
                        {isCurrentLoggedIn && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Logged-in Session" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
                          {roleDisplay}
                        </span>
                        {staff.assignedClass && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                            {staff.assignedClass}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Active */}
                  <button
                    onClick={() => toggleStaffStatus(staff.id)}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      staff.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                    title={staff.isActive ? 'Access Active (Click to suspend)' : 'Access Suspended (Click to restore)'}
                  >
                    {staff.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{staff.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Staff PIN/Password: <strong>{staff.password || 'Staff@123'}</strong></span>
                  </div>
                  {staff.subject && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Specialization: {staff.subject}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>ID: {staff.employeeId}</span>
                    <span>Added by: {staff.addedBy}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-800">
                <div
                  className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border ${
                    staff.isActive
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-950/30 text-rose-300 border-rose-500/30'
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${staff.isActive ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span>{staff.isActive ? 'Authorized Credential' : 'Access Revoked'}</span>
                </div>

                <button
                  onClick={() => setEditingStaff(staff)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  title="Edit details & assigned class"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {staff.id !== 'staff-admin-root' ? (
                  <button
                    onClick={() => setStaffToDelete(staff)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    title="Permanently remove faculty record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span
                    className="p-1.5 rounded-xl bg-slate-800/40 text-slate-600 border border-slate-800 text-[10px] font-bold px-2"
                    title="Root Super Admin cannot be deleted"
                  >
                    Protected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Verify New Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pre-Verify New Staff Member</h3>
                  <p className="text-xs text-slate-400">
                    Staff member will be authorized to log in via Google or Phone OTP matching these credentials.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mrs. Sunita Verma or Mr. Ramesh Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Official Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="sunita.verma@vidyasetu.edu.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Mobile Number (Phone OTP)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00002"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Designated Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="classTeacher">Class Teacher (Daily Attendance & Marks)</option>
                    <option value="generalTeacher">Subject / General Teacher</option>
                    <option value="principal">Principal (Full Academic Control)</option>
                    <option value="admin">Management / Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {newRole === 'classTeacher' ? 'Assigned Class (Class Teacher Of)' : 'Wing / Class Scope'}
                  </label>
                  {newRole === 'classTeacher' ? (
                    <select
                      value={newAssignedClass}
                      onChange={(e) => setNewAssignedClass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      {INDIAN_CLASSES.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={newRole === 'admin' ? 'All Institution Wings' : newRole === 'principal' ? 'All Classes' : 'Subject Specific'}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl px-3 py-2"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subject Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics, Physics, English"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Employee Code / ID</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-T105"
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Staff PIN / Login Password</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff@123 or 6-digit PIN"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Staff will use this password / PIN to authenticate on the login screen.</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-[11px] flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  This record is saved permanently to <strong>Verified Staff Directory</strong>.
                  The staff member can instantly log in on either web or mobile APK with these credentials.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition"
                >
                  Save & Pre-Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Faculty Assignment</h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="classTeacher">Class Teacher</option>
                  <option value="generalTeacher">Subject Teacher</option>
                  <option value="principal">Principal</option>
                  <option value="admin">Management / Admin</option>
                </select>
              </div>

              {editingStaff.role === 'classTeacher' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Class Teacher Of</label>
                  <select
                    value={editingStaff.assignedClass}
                    onChange={(e) => setEditingStaff({ ...editingStaff, assignedClass: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {INDIAN_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  required
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Staff PIN / Password</label>
                <input
                  type="text"
                  value={editingStaff.password || 'Staff@123'}
                  onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={editingStaff.subject}
                  onChange={(e) => setEditingStaff({ ...editingStaff, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke / Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Revoke Access?</h3>
                <p className="text-xs text-slate-400">This action immediately blocks login credentials.</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Faculty Name:</span>
                <span className="font-bold text-white">{staffToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Role:</span>
                <span className="font-semibold text-indigo-300">{staffToDelete.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-300">{staffToDelete.email}</span>
              </div>
              {staffToDelete.assignedClass && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Class:</span>
                  <span className="text-emerald-300">{staffToDelete.assignedClass}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-rose-300/90 leading-relaxed">
              Are you sure you want to remove <strong>{staffToDelete.name}</strong> from the RBAC directory?
              They will not be able to log in to the Management App until re-added by an Admin.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteVerifiedStaff(staffToDelete.id);
                  setStaffToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete & Revoke</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
