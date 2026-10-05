import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const LiveClassModal: React.FC = () => {
  const { activeLiveClassModal, setActiveLiveClassModal, currentUser } = useSchool();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Mrs. Meenakshi Sharma', text: 'Good morning students, please open NCERT page 48 for Theorem 2.3.', time: '10:02 AM' },
    { sender: 'Aarav Sharma', text: 'Good morning ma\'am! Notebook and NCERT open.', time: '10:03 AM' },
    { sender: 'Ananya Verma', text: 'Ma\'am audio is crystal clear.', time: '10:04 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!activeLiveClassModal) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: currentUser.name,
        text: inputMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm md:text-base leading-tight">
                  {activeLiveClassModal.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  LIVE JITSI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeLiveClassModal.classId} • Teacher: {activeLiveClassModal.teacherName} • Room: {activeLiveClassModal.roomCode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 E2E Encrypted</span>
            </div>
            <button
              onClick={() => setActiveLiveClassModal(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold"
            >
              Minimize
            </button>
          </div>
        </div>

        {/* Classroom Grid & Chat */}
        <div className="flex-1 flex overflow-hidden bg-slate-950">
          {/* Video Streams */}
          <div className="flex-1 p-3 md:p-4 grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto">
            {/* Main Stage: Teacher / Presenter */}
            <div className="md:col-span-2 relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video md:aspect-auto flex items-center justify-center group shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
                alt="Teacher stream"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Mrs. Meenakshi Sharma (Host • Speaking)</span>
              </div>
              {screenSharing && (
                <div className="absolute top-3 right-3 bg-indigo-600/90 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium shadow-md">
                  <Share2 className="w-3.5 h-3.5" /> Screen Sharing Active
                </div>
              )}
              <div className="absolute bottom-3 left-3 text-xs text-slate-300">
                CBSE Class 10-A Daily Interactive Lecture
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 overflow-y-auto">
              {/* Student 1 (Aarav / Current user) */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                {cameraOn ? (
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80"}
                    alt="Current user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-white flex items-center gap-1.5">
                  <span>{currentUser.name} (You)</span>
                  {!micOn && <MicOff className="w-3 h-3 text-rose-400" />}
                </div>
                {handRaised && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow animate-bounce">
                    <Hand className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Student 2 */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80"
                  alt="Ananya Verma"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-white flex items-center gap-1.5">
                  <span>Ananya Verma (Roll 18)</span>
                </div>
              </div>

              {/* Student 3 */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
                  alt="Devansh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-white flex items-center gap-1.5">
                  <span>Devansh Kumar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Panel Side Drawer */}
          {showChat && (
            <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col animate-slide-left">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Classroom Live Chat</span>
                </div>
                <span className="text-xs text-slate-400">Class 10-A</span>
              </div>
              <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/50">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-indigo-300">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">{msg.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>38 Students Connected</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-full font-medium transition ${
                micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white ring-2 ring-rose-400'
              }`}
              title={micOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`p-3 rounded-full font-medium transition ${
                cameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white ring-2 ring-rose-400'
              }`}
              title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-3 rounded-full font-medium transition ${
                screenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Share Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`p-3 rounded-full font-medium transition ${
                handRaised ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Raise Hand"
            >
              <Hand className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-full font-medium transition ${
                showChat ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle Classroom Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveLiveClassModal(null)}
              className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Class</span>
            </button>
          </div>

          <div className="hidden sm:block text-xs text-slate-400 font-mono">
            00:32:15
          </div>
        </div>
      </div>
    </div>
  );
};
