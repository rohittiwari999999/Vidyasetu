import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  ShieldCheck,
  Building2,
  LogIn,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Users,
} from 'lucide-react';

interface ManagementLoginViewProps {
  onLoginSuccess?: () => void;
}

type StaffRoleKey = 'admin' | 'principal' | 'classTeacher' | 'generalTeacher';

const ROLE_OPTIONS: { key: StaffRoleKey; label: string; badge: string; icon: any; color: string }[] = [
  {
    key: 'admin',
    label: 'Management / Admin',
    badge: 'Full Access',
    icon: ShieldCheck,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  },
  {
    key: 'principal',
    label: 'Principal',
    badge: 'Academic Head',
    icon: GraduationCap,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    key: 'classTeacher',
    label: 'Class Teacher',
    badge: 'Class Incharge',
    icon: Users,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    key: 'generalTeacher',
    label: 'Subject Teacher',
    badge: 'Faculty',
    icon: Briefcase,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
];

const getRoleDisplayName = (role: StaffRoleKey): string => {
  switch (role) {
    case 'admin':
      return 'Management / Admin';
    case 'principal':
      return 'Principal';
    case 'classTeacher':
      return 'Class Teacher';
    case 'generalTeacher':
      return 'Subject Teacher';
    default:
      return role;
  }
};

export const ManagementLoginView: React.FC<ManagementLoginViewProps> = ({ onLoginSuccess }) => {
  const { verifiedStaffList, loginAsStaffMember, showSimulatedPush } = useSchool();

  const [selectedRole, setSelectedRole] = useState<StaffRoleKey>('admin');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Email form
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Phone form
  const [inputPhone, setInputPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const cleanEmail = inputEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError('Please enter your official email address.');
      return;
    }

    if (!inputPassword.trim()) {
      setEmailError('Please enter your official security password or staff PIN.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      // Strict Pre-Verification Lookup in Staff Access
      const match = verifiedStaffList.find((s) => s.email.toLowerCase() === cleanEmail);

      if (!match) {
        setEmailError(
          `Access Denied: "${cleanEmail}" is not pre-registered in Staff Access (RBAC). Open registration is strictly prohibited. The School Admin or Manager must add your credentials in Staff Access before you can authenticate.`
        );
        return;
      }

      // Role Mismatch Check
      if (match.role !== selectedRole) {
        setEmailError(
          `Role Access Denied: Your official account is registered as "${getRoleDisplayName(match.role)}", but you selected "${getRoleDisplayName(selectedRole)}". Please select "${getRoleDisplayName(match.role)}" to sign in.`
        );
        return;
      }

      // Active status check
      if (!match.isActive) {
        setEmailError(
          `Account Suspended: The staff account for ${match.name} has been deactivated by the Administration. Contact the School Manager.`
        );
        return;
      }

      // Successful Authorized Login
      loginAsStaffMember(match.id);
      showSimulatedPush(
        'Staff Authentication Verified ✅',
        `Logged in successfully as ${match.name} (${getRoleDisplayName(match.role)}).`,
        'approval'
      );
      if (onLoginSuccess) onLoginSuccess();
    }, 450);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const cleanDigits = inputPhone.trim().replace(/[^0-9]/g, '').slice(-10);

    if (cleanDigits.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Strict Pre-Verification Lookup
    const match = verifiedStaffList.find(
      (s) => s.phone.replace(/[^0-9]/g, '').slice(-10) === cleanDigits
    );

    if (!match) {
      setPhoneError(
        `Access Denied: Mobile number "+91 ${cleanDigits}" is not pre-registered in Staff Access. Only authorized faculty added by the Admin can log in.`
      );
      return;
    }

    if (match.role !== selectedRole) {
      setPhoneError(
        `Role Mismatch: Registered as "${getRoleDisplayName(match.role)}", but you chose "${getRoleDisplayName(selectedRole)}". Please select "${getRoleDisplayName(match.role)}".`
      );
      return;
    }

    if (!match.isActive) {
      setPhoneError(`Account Suspended: ${match.name}'s account has been deactivated by the School Admin.`);
      return;
    }

    setOtpSent(true);
    setOtpCode('');
    showSimulatedPush('SMS OTP Sent 📲', `6-digit security code sent to +91 ${cleanDigits}`, 'broadcast');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const cleanDigits = inputPhone.trim().replace(/[^0-9]/g, '').slice(-10);

    if (otpCode.trim().length !== 6) {
      setPhoneError('Please enter the complete 6-digit OTP code.');
      return;
    }

    const match = verifiedStaffList.find(
      (s) => s.phone.replace(/[^0-9]/g, '').slice(-10) === cleanDigits
    );

    if (match) {
      if (match.role !== selectedRole) {
        setPhoneError(`Role Mismatch: This mobile is registered as ${getRoleDisplayName(match.role)}.`);
        return;
      }
      loginAsStaffMember(match.id);
      showSimulatedPush('OTP Verified ✅', `Welcome back, ${match.name}!`, 'approval');
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* School Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
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
              <span>Official Faculty Portal</span>
            </p>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-4">
          Strict Role-Based Staff Authentication
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1 leading-relaxed">
          Open registration is strictly prohibited. Only faculty and administration pre-registered by the School Admin in Staff Access (RBAC) are authorized to log in.
        </p>

        {/* Role Selector Cards */}
        <div className="mt-6 text-left">
          <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2 text-center">
            Select Your Assigned Role:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROLE_OPTIONS.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedRole === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(opt.key);
                    setEmailError(null);
                    setPhoneError(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg ring-2 ring-indigo-500/40'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {opt.badge}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate">{opt.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Method Selector */}
        <div className="flex items-center justify-center gap-2 mt-5 max-w-xs mx-auto bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setEmailError(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Official Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setPhoneError(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
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

      {/* Method 1: Official Email Form */}
      {authMethod === 'email' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Log In as {getRoleDisplayName(selectedRole)}</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Verified Accounts Only
            </span>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Official Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@school.edu.in or registered email"
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Password / Staff PIN</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter staff security password or PIN"
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            {emailError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{emailError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying Pre-Registration in RBAC...' : `Authenticate as ${getRoleDisplayName(selectedRole)}`}</span>
            </button>
          </form>
        </div>
      )}

      {/* Method 2: Mobile OTP Form */}
      {authMethod === 'phone' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Sign In with Registered Mobile ({getRoleDisplayName(selectedRole)})</span>
            </div>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Mobile Number (+91)</label>
                <div className="flex items-center">
                  <span className="px-3.5 py-3 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-slate-300 font-semibold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit registered number"
                    value={inputPhone}
                    onChange={(e) => {
                      setInputPhone(e.target.value);
                      if (phoneError) setPhoneError(null);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-r-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              {phoneError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <span className="leading-relaxed">{phoneError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <span>OTP code sent to +91 {inputPhone}</span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode('');
                  }}
                  className="underline text-[11px] hover:text-white"
                >
                  Change Number
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP (e.g. 123456)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-white tracking-widest text-center text-lg font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {phoneError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <span className="leading-relaxed">{phoneError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Log In</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Pre-Registration Security Enforced: All staff, class teachers, and principals must be registered by Admin in Staff Access.
        </span>
      </div>
    </div>
  );
};
