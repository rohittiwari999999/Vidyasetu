import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { VerifiedStaffItem } from '../../data/mockData';
import {
  ShieldCheck,
  Building2,
  LogIn,
  Mail,
  Phone,
  Lock,
  Search,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface ManagementLoginViewProps {
  onLoginSuccess?: () => void;
}

export const ManagementLoginView: React.FC<ManagementLoginViewProps> = ({ onLoginSuccess }) => {
  const { verifiedStaffList, loginAsStaffMember, setCurrentUser, users, showSimulatedPush } = useSchool();

  const [authMethod, setAuthMethod] = useState<'roster' | 'email' | 'phone'>('roster');
  const [roleFilter, setRoleFilter] = useState<'all' | 'classTeacher' | 'principal' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Email form
  const [inputEmail, setInputEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Phone form
  const [inputPhone, setInputPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Filter staff roster
  const filteredStaff = verifiedStaffList.filter((staff) => {
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.assignedClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const handleSelectStaff = (staffId: string) => {
    loginAsStaffMember(staffId);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const clean = inputEmail.trim().toLowerCase();
    if (!clean) return;

    // Check pre-verified roster
    const match = verifiedStaffList.find((s) => s.email.toLowerCase() === clean);
    if (!match) {
      setEmailError('Access Denied: This email is not pre-registered in Staff Access (RBAC). Self-registration is strictly prohibited.');
      return;
    }

    if (!match.isActive) {
      setEmailError('Account Deactivated: This faculty access has been temporarily suspended by the Principal.');
      return;
    }

    loginAsStaffMember(match.id);
    showSimulatedPush('Google Auth Verified', `Logged in via Google Workspace as ${match.name}`, 'approval');
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const cleanPhone = inputPhone.trim().replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const match = verifiedStaffList.find((s) => s.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone);
    if (!match) {
      setPhoneError('Access Denied: Mobile number not found in Staff Pre-Verified Database.');
      return;
    }

    if (!match.isActive) {
      setPhoneError('Account Deactivated: Contact School Administration.');
      return;
    }

    setOtpSent(true);
    setOtpCode('654321'); // Simulated default auto-fill
    showSimulatedPush('SMS OTP Sent', `Verification code sent to +91 ${cleanPhone}. Demo OTP: 654321`, 'broadcast');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      setPhoneError('Please enter the 6-digit OTP code.');
      return;
    }

    const cleanPhone = inputPhone.trim().replace(/[^0-9]/g, '').slice(-10);
    const match = verifiedStaffList.find((s) => s.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone);
    if (match) {
      loginAsStaffMember(match.id);
      showSimulatedPush('Mobile OTP Verified', `Welcome back, ${match.name}!`, 'approval');
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* School Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Delhi Modern Academy
            </h1>
            <p className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
              <span>CBSE Affiliation #2130894</span>
              <span>•</span>
              <span>New Delhi Campus</span>
            </p>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-4">
          Faculty, Class Teacher & Administration Portal
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto mt-1">
          Authorized personnel access only. Pre-registration via Staff Access (RBAC) is strictly enforced for all teachers and school managers.
        </p>

        {/* Auth Method Selector */}
        <div className="flex items-center justify-center gap-2 mt-6 max-w-md mx-auto bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setAuthMethod('roster')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'roster'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Authorized Roster</span>
          </button>

          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Official Email</span>
          </button>

          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
        </div>
      </div>

      {/* Method 1: Authorized Roster Grid */}
      {authMethod === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teacher, class, email, or designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  roleFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All Faculty ({verifiedStaffList.length})
              </button>
              <button
                onClick={() => setRoleFilter('classTeacher')}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  roleFilter === 'classTeacher'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Class Teachers ({verifiedStaffList.filter((s) => s.role === 'classTeacher').length})
              </button>
              <button
                onClick={() => setRoleFilter('principal')}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  roleFilter === 'principal'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Principals
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  roleFilter === 'admin'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Super Admins
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStaff.map((staff) => {
              const isClassTeacher = staff.role === 'classTeacher';
              const isPrincipal = staff.role === 'principal';
              const isAdmin = staff.role === 'admin';

              return (
                <div
                  key={staff.id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg transition-all hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isClassTeacher
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isPrincipal
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isAdmin
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {staff.name.replace(/^(Mr\.|Mrs\.|Dr\.|Er\.)\s*/i, '').charAt(0) || 'T'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white truncate">{staff.name}</h4>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                            isClassTeacher
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : isPrincipal
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isAdmin
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {isClassTeacher
                            ? `CT • ${staff.assignedClass}`
                            : isPrincipal
                            ? 'Principal'
                            : isAdmin
                            ? 'Super Admin'
                            : staff.subject || 'Faculty'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 truncate mt-0.5">{staff.email}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>ID: {staff.employeeId}</span>
                        <span>•</span>
                        <span>{staff.phone}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectStaff(staff.id)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition"
                  >
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Method 2: Official Email Form */}
      {authMethod === 'email' && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span>Sign In with Pre-Registered Email</span>
          </div>

          <p className="text-xs text-slate-400">
            Enter your official institution Google account or verified teacher email ID.
          </p>

          <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. meenakshi.sharma@vidyasetu.edu.in"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Quick suggested chips */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1.5">Quick Select Pre-Verified Staff:</label>
              <div className="flex flex-wrap gap-1.5">
                {verifiedStaffList.slice(0, 4).map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setInputEmail(s.email)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition"
                  >
                    {s.name} ({s.role === 'classTeacher' ? s.assignedClass : s.role})
                  </button>
                ))}
              </div>
            </div>

            {emailError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{emailError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Verify & Log In</span>
            </button>
          </form>
        </div>
      )}

      {/* Method 3: Mobile OTP Form */}
      {authMethod === 'phone' && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base">
            <Phone className="w-5 h-5 text-emerald-400" />
            <span>Sign In with Registered Mobile (OTP)</span>
          </div>

          <p className="text-xs text-slate-400">
            Strict Pre-Verification applies. Your 10-digit mobile number must be registered in Staff Access.
          </p>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Number (+91 India)</label>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-slate-300 font-semibold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98711 22334"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-r-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              {/* Quick phone suggestions */}
              <div>
                <label className="block text-slate-400 text-[11px] mb-1.5">Quick Select Registered Mobile:</label>
                <div className="flex flex-wrap gap-1.5">
                  {verifiedStaffList.slice(0, 4).map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setInputPhone(s.phone.replace(/[^0-9]/g, '').slice(-10))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition"
                    >
                      {s.name} ({s.phone})
                    </button>
                  ))}
                </div>
              </div>

              {phoneError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{phoneError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Send 6-Digit OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <span>OTP sent to +91 {inputPhone}</span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="underline text-[11px] hover:text-white"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white tracking-widest text-center text-lg font-mono focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1 text-center">Demo Verification Code: 654321</p>
              </div>

              {phoneError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{phoneError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify & Sign In</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Security Footer Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Role-Based Access Control Active: Only verified faculty pre-authorized by Administration can log in. Details persist securely across sessions.
        </span>
      </div>
    </div>
  );
};
