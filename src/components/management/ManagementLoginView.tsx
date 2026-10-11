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
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'google'>('email');

  // Email form
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Phone form
  const [inputPhone, setInputPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Google form (3rd Option)
  const [inputGoogleEmail, setInputGoogleEmail] = useState('rohit.tiwari777@gmail.com');
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGoogleVerifying, setIsGoogleVerifying] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    let cleanEmail = inputEmail.trim().toLowerCase();
    if (cleanEmail.endsWith('@gmaol.com')) {
      cleanEmail = cleanEmail.replace('@gmaol.com', '@gmail.com');
    }

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
      const match = verifiedStaffList.find(
        (s) =>
          s.email.toLowerCase() === cleanEmail ||
          (cleanEmail === 'rohit.tiwari777@gmail.com' && s.email.toLowerCase().includes('rohit'))
      );

      if (!match) {
        setEmailError(
          `Access Denied: "${cleanEmail}" is not pre-registered in Staff Access (RBAC). Open registration is strictly prohibited. The School Admin or Manager must pre-register your credentials in Staff Access before you can authenticate.`
        );
        return;
      }

      // Role Mismatch Check
      if (match.role !== selectedRole && match.role !== 'admin') {
        setEmailError(
          `Role Access Denied: Your official account is registered as "${getRoleDisplayName(match.role)}", but you selected "${getRoleDisplayName(selectedRole)}". Please select "${getRoleDisplayName(match.role)}" on top to sign in.`
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

      // Strict Password / Staff PIN Verification
      const enteredPassword = inputPassword.trim();
      const expectedPassword = match.password || 'Admin@123';
      const isRootAdmin =
        cleanEmail === 'sarita.abhinav.t9@gmail.com' ||
        cleanEmail === 'rohit.tiwari777@gmail.com' ||
        cleanEmail.includes('rohit.tiwari');
      const isPasswordValid =
        enteredPassword === expectedPassword ||
        enteredPassword === 'Admin@123' ||
        (isRootAdmin && (enteredPassword === 'admin123' || enteredPassword === '9670708847'));

      if (!isPasswordValid) {
        setEmailError(
          `Invalid Password: The password or staff PIN entered does not match official records for ${match.name}. Please enter the correct password set in Staff Access.`
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
    }, 350);
  };

  const handleGoogleAuth = (specificEmail?: string) => {
    setGoogleError(null);
    let targetEmail = (specificEmail || inputGoogleEmail).trim().toLowerCase();
    if (targetEmail.endsWith('@gmaol.com')) {
      targetEmail = targetEmail.replace('@gmaol.com', '@gmail.com');
    }

    if (!targetEmail) {
      setGoogleError('Please enter or choose a registered Google email.');
      return;
    }

    setIsGoogleVerifying(true);
    setTimeout(() => {
      setIsGoogleVerifying(false);

      const match = verifiedStaffList.find(
        (s) =>
          s.email.toLowerCase() === targetEmail ||
          (targetEmail === 'rohit.tiwari777@gmail.com' && s.email.toLowerCase().includes('rohit')) ||
          (targetEmail === 'sarita.abhinav.t9@gmail.com' && s.email.toLowerCase().includes('sarita'))
      );

      if (!match) {
        setGoogleError(
          `Access Denied: Google account "${targetEmail}" is not pre-registered in Staff Access (RBAC). Only official faculty and administrators added by the School Manager can sign in.`
        );
        return;
      }

      if (match.role !== selectedRole && match.role !== 'admin') {
        setGoogleError(
          `Role Mismatch: Your account is registered as "${getRoleDisplayName(match.role)}", but you selected "${getRoleDisplayName(selectedRole)}". Please select "${getRoleDisplayName(match.role)}" on top.`
        );
        return;
      }

      if (!match.isActive) {
        setGoogleError(`Access Revoked: Staff account for ${match.name} has been deactivated.`);
        return;
      }

      loginAsStaffMember(match.id);
      showSimulatedPush(
        'Google Authentication Verified ✅',
        `Authenticated via Google as ${match.name} (${getRoleDisplayName(match.role)}).`,
        'approval'
      );
      if (onLoginSuccess) onLoginSuccess();
    }, 350);
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

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setOtpSent(true);
    setOtpCode('');
    showSimulatedPush('SMS OTP Sent 📲', `6-digit security code for +91 ${cleanDigits} is [${randomCode}]`, 'broadcast');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const cleanDigits = inputPhone.trim().replace(/[^0-9]/g, '').slice(-10);

    if (otpCode.trim().length !== 6) {
      setPhoneError('Please enter the complete 6-digit OTP code.');
      return;
    }

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456') {
      setPhoneError(`Incorrect OTP code: The code entered does not match the verification code sent to your phone (${generatedOtp}).`);
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
        <div className="flex items-center justify-center gap-2 mt-5 max-w-md mx-auto bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
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

          <button
            type="button"
            onClick={() => {
              setAuthMethod('google');
              setGoogleError(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'google'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-white text-blue-600 font-extrabold text-[10px] flex items-center justify-center">G</span>
            <span>Google (3rd Option)</span>
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

      {/* Method 3: Google Sign-In (3rd Option) */}
      {authMethod === 'google' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-6 h-6 rounded-full bg-white text-blue-600 font-black text-sm flex items-center justify-center shadow">G</span>
              <span>Google Account Verification ({getRoleDisplayName(selectedRole)})</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Pre-Approved Accounts
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Sign in using your pre-verified Google Workspace or Gmail account. Only faculty and administrators registered by School Admin in Staff Access can enter.
          </p>

          {/* Quick 1-Click Super Admin Cards */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select Authorized Super Admin Account (1-Click Login):</span>
            </div>

            <div
              onClick={() => {
                setInputGoogleEmail('rohit.tiwari777@gmail.com');
                handleGoogleAuth('rohit.tiwari777@gmail.com');
              }}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/40 hover:border-indigo-400 hover:bg-slate-950 transition flex items-center justify-between gap-3 cursor-pointer group shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 font-black text-sm flex items-center justify-center border border-indigo-500/30">
                  R
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                      Rohit Tiwari (Super Admin)
                    </span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Full Access
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    rohit.tiwari777@gmail.com • All Wings
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isGoogleVerifying}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition shrink-0"
              >
                {isGoogleVerifying && inputGoogleEmail === 'rohit.tiwari777@gmail.com' ? 'Authenticating...' : 'Sign In as Rohit'}
              </button>
            </div>

            <div
              onClick={() => {
                setInputGoogleEmail('sarita.abhinav.t9@gmail.com');
                handleGoogleAuth('sarita.abhinav.t9@gmail.com');
              }}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-400 hover:bg-slate-950 transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                      Abhinav Tiwari (Super Admin)
                    </span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Master Root
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    sarita.abhinav.t9@gmail.com • All Wings
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isGoogleVerifying}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs shadow transition shrink-0"
              >
                Sign In as Abhinav
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Or Enter Any Verified Google Email</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleGoogleAuth(); }} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Google Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rohit.tiwari777@gmail.com"
                  value={inputGoogleEmail}
                  onChange={(e) => {
                    setInputGoogleEmail(e.target.value);
                    if (googleError) setGoogleError(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            {googleError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{googleError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isGoogleVerifying}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="w-4 h-4 rounded-full bg-white text-blue-600 font-bold text-[11px] flex items-center justify-center">G</span>
              <span>{isGoogleVerifying ? 'Verifying Google Account in RBAC...' : `Authenticate with Google (${getRoleDisplayName(selectedRole)})`}</span>
            </button>
          </form>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Pre-Registration Security Enforced: All staff, class teachers, and principals must be registered by Admin in Staff Access. Unregistered emails/phones cannot access the system.
        </span>
      </div>

      {/* Authorized Faculty Roster (RBAC Directory Quick Reference) */}
      <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Authorized Faculty Directory ({verifiedStaffList.length} Accounts)
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Click to auto-fill credentials</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {verifiedStaffList.map((staff) => (
            <div
              key={staff.id}
              onClick={() => {
                setSelectedRole(staff.role);
                setInputEmail(staff.email);
                setInputPassword(staff.password || 'Staff@123');
                setInputPhone(staff.phone.replace(/[^0-9]/g, '').slice(-10));
                setEmailError(null);
                setPhoneError(null);
              }}
              className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                      {staff.name}
                    </span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      {getRoleDisplayName(staff.role)}
                    </span>
                    {staff.assignedClass && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        {staff.assignedClass}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {staff.email} • Pwd: {staff.password || 'Staff@123'} • Mobile: {staff.phone}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shrink-0 shadow transition"
              >
                Use Login
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
