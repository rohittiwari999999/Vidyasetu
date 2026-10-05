import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Bell, X, AlertTriangle, BookOpen, UserCheck, CreditCard, Video } from 'lucide-react';

export const SimulatedNotification: React.FC = () => {
  const { activePushNotification, clearPushNotification } = useSchool();

  if (!activePushNotification) return null;

  const getIcon = () => {
    switch (activePushNotification.category) {
      case 'broadcast':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'homework':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'approval':
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case 'fee':
        return <CreditCard className="w-5 h-5 text-purple-400" />;
      case 'live_class':
        return <Video className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-bounce-in">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 backdrop-blur-md text-white transition-all transform hover:scale-[1.02]">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 shadow-inner shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                VidyaSetu FCM Push • {activePushNotification.timestamp}
              </span>
              <button
                onClick={clearPushNotification}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-semibold text-sm text-slate-100 mt-1 truncate">
              {activePushNotification.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
              {activePushNotification.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
