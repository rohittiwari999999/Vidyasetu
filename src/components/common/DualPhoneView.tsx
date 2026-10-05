import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ManagementDashboard } from '../management/ManagementDashboard';
import { StudentDashboard } from '../student/StudentDashboard';
import { Smartphone, School, UserCheck, Shield } from 'lucide-react';

export const DualPhoneView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {/* LEFT PHONE: School Management App */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
              <School className="w-4 h-4 text-indigo-400" />
              <span>App 1: School Management (Staff Portal)</span>
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800">
            Manager • Principal • Class Teacher
          </span>
        </div>

        {/* Device frame container */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-[32px] p-3 md:p-4 shadow-2xl relative">
          <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />
          <div className="max-h-[85vh] overflow-y-auto pr-1">
            <ManagementDashboard />
          </div>
        </div>
      </div>

      {/* RIGHT PHONE: Student / Parent App */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>App 2: Student & Parent App</span>
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Student • Parent
          </span>
        </div>

        {/* Device frame container */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-[32px] p-3 md:p-4 shadow-2xl relative">
          <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />
          <div className="max-h-[85vh] overflow-y-auto pr-1">
            <StudentDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};
