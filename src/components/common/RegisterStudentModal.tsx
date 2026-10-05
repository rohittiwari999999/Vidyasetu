import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { INDIAN_CLASSES } from '../../data/mockData';
import { UserPlus, X, CheckCircle, Sparkles, School } from 'lucide-react';

interface RegisterStudentModalProps {
  onClose: () => void;
}

export const RegisterStudentModal: React.FC<RegisterStudentModalProps> = ({ onClose }) => {
  const { registerNewStudent, setCurrentUser, setViewMode } = useSchool();
  const [name, setName] = useState('Rohan Gupta');
  const [grade, setGrade] = useState('Class 10-A');
  const [parentName, setParentName] = useState('Mr. Suresh Gupta');
  const [parentPhone, setParentPhone] = useState('+91 98111 23456');
  const [email, setEmail] = useState('rohan.gupta.reg@gmail.com');
  const [address, setAddress] = useState('Sector 62, Noida, Uttar Pradesh');
  const [dob, setDob] = useState('2011-05-14');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = registerNewStudent({
      name,
      grade,
      parentName,
      parentPhone,
      email,
      phone: parentPhone,
      address,
      dob,
    });

    // Optionally switch to this new student so the user sees the pending gate,
    // or let them stay in management to verify!
    setCurrentUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                New Student / Parent Registration Flow
              </h3>
              <p className="text-xs text-slate-400">
                Simulate mobile app signup (Status will be 'Pending Approvals')
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Applying for Class</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                {INDIAN_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Parent Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Parent Mobile (+91)</label>
              <input
                type="text"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+91 98..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address in India"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-amber-300 text-[11px] space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> What happens on submit?
            </span>
            <p className="text-slate-300">
              A new document is created in the Firestore <code className="bg-slate-900 px-1 rounded text-indigo-300 font-mono">users</code> collection with <code className="bg-slate-900 px-1 rounded text-amber-300 font-mono">status: 'pending'</code>. The application will immediately lock access with the <strong>Pending Verification Gate</strong> until approved in the School Management App.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg transition"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
