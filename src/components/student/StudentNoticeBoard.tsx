import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { BroadcastMessage } from '../../types';
import { Bell, AlertTriangle, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const StudentNoticeBoard: React.FC = () => {
  const { broadcasts } = useSchool();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = broadcasts.filter((b) => {
    if (filterCategory !== 'all' && b.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              School Notice Board & Circulars
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official announcements, examination schedules, and urgent weather advisories.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['all', 'urgent', 'holiday', 'circular'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition ${
                filterCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`rounded-3xl p-5 md:p-6 border shadow-xl transition ${
              item.priority === 'emergency'
                ? 'bg-gradient-to-r from-rose-950/40 to-slate-900 border-rose-500/40 ring-1 ring-rose-500/30'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                    item.category === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : item.category === 'holiday'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {item.category}
                </span>
                <h3 className="font-bold text-white text-base">{item.title}</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-3">{item.message}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
              <span>Authority: <strong className="text-white">{item.senderName}</strong></span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Delivered via FCM Push
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
