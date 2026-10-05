import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { BroadcastMessage } from '../../types';
import { INDIAN_CLASSES } from '../../data/mockData';
import {
  Bell,
  Send,
  AlertTriangle,
  Calendar,
  FileText,
  Radio,
  Users,
  Code2,
  CheckCircle2,
} from 'lucide-react';

export const BroadcastCenter: React.FC = () => {
  const { broadcasts, addBroadcast, currentUser } = useSchool();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<BroadcastMessage['category']>('urgent');
  const [targetAudience, setTargetAudience] = useState<BroadcastMessage['targetAudience']>('all');
  const [targetClass, setTargetClass] = useState('Class 10-A');
  const [priority, setPriority] = useState<BroadcastMessage['priority']>('high');
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addBroadcast({
      title: title.trim(),
      message: message.trim(),
      category,
      targetAudience,
      targetClass: targetAudience === 'class' ? targetClass : undefined,
      senderName: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      senderRole: currentUser.role,
      priority,
    });

    setTitle('');
    setMessage('');
  };

  // Mock FCM push payload representation for developers
  const fcmPayloadSample = {
    message: {
      topic: targetAudience === 'all' ? 'school_all' : targetAudience === 'class' ? `class_${targetClass.replace(/\s+/g, '_')}` : `role_${targetAudience}`,
      notification: {
        title: title || 'Deepawali & Chhath Puja Autumn Break Circular',
        body: message || 'The school will remain closed for festivities...',
      },
      data: {
        category,
        priority,
        sender: currentUser.name,
        schoolId: currentUser.schoolId,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        timestamp: new Date().toISOString(),
      },
      android: {
        priority: priority === 'emergency' ? 'high' : 'normal',
        notification: {
          channel_id: 'school_broadcast_channel',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: { title: title || 'Urgent Notice', body: message || 'Circular...' },
            badge: 1,
            sound: 'default',
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Radio className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              School Broadcast & FCM Push Dispatcher
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Instantly dispatch emergency alerts, holiday circulars, and fee reminders to all registered student and parent devices via Firebase Cloud Messaging.
          </p>
        </div>

        <button
          onClick={() => setShowJsonPreview(!showJsonPreview)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Code2 className="w-4 h-4" />
          <span>{showJsonPreview ? 'Hide FCM Payload' : 'Inspect FCM Payload'}</span>
        </button>
      </div>

      {showJsonPreview && (
        <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-4 font-mono text-[11px] text-indigo-200 overflow-x-auto shadow-inner animate-fade-in">
          <div className="flex items-center justify-between text-xs text-indigo-400 pb-2 mb-2 border-b border-slate-800">
            <span>Firebase Admin SDK Push Payload (HTTP v1)</span>
            <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded font-mono">fcm.send()</span>
          </div>
          <pre>{JSON.stringify(fcmPayloadSample, null, 2)}</pre>
        </div>
      )}

      {/* Broadcast Composer Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            <span>Compose New Broadcast Circular</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notice Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="urgent">🚨 Urgent Alert</option>
                  <option value="holiday">🏖️ Holiday Declaration</option>
                  <option value="circular">📜 Official Circular</option>
                  <option value="exam">📝 Examination Notice</option>
                  <option value="event">🎉 School Event / PTM</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="all">Every Student & Parent</option>
                  <option value="parents">Parents Only</option>
                  <option value="students">Students Only</option>
                  <option value="teachers">Teaching Staff Only</option>
                  <option value="class">Specific Class</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Priority Delivery</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="high">High (Standard push)</option>
                  <option value="emergency">Emergency (Heads-up alert)</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>

            {targetAudience === 'class' && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Target Class</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {INDIAN_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Circular Title / Subject</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Break Schedule & Online Class Routine"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Broadcast Message Body</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type complete circular text including dates, instructions, and contacts..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Sender: <strong>{currentUser.name}</strong> • VidyaSetu FCM Push Gateway
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Instantly</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips & Channel Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Delivery Channels</span>
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-white mb-1">
                  <span>Firebase FCM Push</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Active (1,482 Devices)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Delivered straight to Android & iOS lockscreens with high priority heads-up popups.
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-white mb-1">
                  <span>WhatsApp Business API</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Synced</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Official verified template message sent to Indian parent phone numbers (+91).
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-white mb-1">
                  <span>Student App Notice Board</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Real-time</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Permanently archived in student's digital circular folder.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Meets CBSE circular broadcast guidelines for emergency weather and exam updates.</span>
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Dispatched Circular Archive ({broadcasts.length})</span>
        </h3>

        <div className="space-y-3">
          {broadcasts.map((bc) => (
            <div
              key={bc.id}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs transition hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                      bc.category === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : bc.category === 'holiday'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {bc.category}
                  </span>
                  <h4 className="font-bold text-white text-sm">{bc.title}</h4>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{new Date(bc.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{bc.readByCount || 120} delivered</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-2.5">{bc.message}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Sender: <strong className="text-slate-300">{bc.senderName}</strong></span>
                <span>Audience: <strong className="text-indigo-300 capitalize">{bc.targetAudience}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
