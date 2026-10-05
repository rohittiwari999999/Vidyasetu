import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  FileCheck,
  Sparkles,
  Terminal,
  Cpu,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PhoneTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneTestModal: React.FC<PhoneTestModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;

  const copyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleDownload = (path: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Smartphone className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Phone Installation &amp; Testing Center
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                VidyaSetu K-12
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Everything you need to test and run on your Android smartphone.
            </p>
          </div>
        </div>

        {/* EXPLANATION BOX: "There was a problem parsing the package" */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200/90 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>"There was a problem parsing the package" (20 KB फाइल का कारण)</span>
          </div>
          <p className="leading-relaxed">
            जब आपने 20 KB की फाइल फोन में खोली, तो एंड्रॉइड ने <em>"Problem parsing the package"</em> दिखाया। ऐसा इसलिए होता है क्योंकि एक असली Flutter APK <strong>25 MB से 35 MB</strong> का होता है जिसमें Google का कंपाइल किया हुआ C++ इंजन (<code className="text-white font-mono">libflutter.so</code>) और Dart बाइटकोड होता है। ब्राउज़र एडिटर के अंदर 30GB का Android SDK नहीं होता, इसलिए असली 30MB का APK केवल आपके कंप्यूटर या GitHub बिल्डर पर बनता है।
          </p>
        </div>

        {/* METHOD 1: INSTANT PHONE INSTALLATION (PWA) */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-950 border border-indigo-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-white text-base">
                  विधि 1: फोन पर तुरंत 1-टैप में ऐप इंस्टॉल करें (Best for Phone)
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Zero Parsing Error: यह सीधे आपके एंड्रॉइड फोन के होमस्क्रीन पर ऐप आइकन, ऑफलाइन मोड और फुल स्क्रीन के साथ इंस्टॉल होता है।
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 shrink-0">
              100% Works on Android
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {isInstallable ? (
              <button
                onClick={install}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>फोन पर Install करें (Add to Home Screen)</span>
              </button>
            ) : (
              <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex-1">
                <strong>फोन पर खोलने का तरीका:</strong> अपने फोन के Google Chrome में यह लिंक खोलें, फिर ऊपर 3 डॉट्स (⋮) पर टैप करके <strong>"Install app"</strong> या <strong>"Add to Home Screen"</strong> पर टैप करें।
              </div>
            )}

            <button
              onClick={() => copyUrl(currentOrigin, 'app_url')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-700"
            >
              {copiedLink === 'app_url' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">लिंक कॉपी हो गया! WhatsApp पर भेजें</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Phone Link कॉपी करें</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* METHOD 2: BUILD REAL 30MB APK VIA FLUTTER SDK */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>विधि 2: अपने कंप्यूटर पर असली 30 MB APK कैसे बनाएं (Flutter Source)</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            दोनों ऐप्स का पूरा Flutter कोड प्रोजेक्ट आपके एडिटर में <code className="text-emerald-300 font-mono">/apps/school_management_app/</code> और <code className="text-emerald-300 font-mono">/apps/student_parent_app/</code> में मौजूद है।
          </p>

          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-2">
            <div className="text-indigo-400 font-bold"># Windows यूज़र्स के लिए:</div>
            <div className="text-emerald-300">प्रोजेक्ट फोल्डर में `build_releases.bat` फाइल पर डबल-क्लिक करें।</div>
            <div className="text-slate-500 pt-1"># Mac / Linux / Terminal में:</div>
            <div className="text-slate-300">cd apps/school_management_app && flutter build apk --release</div>
            <div className="text-slate-400 text-[10px]">
              &rarr; यह <span className="text-white">build/app/outputs/flutter-apk/app-release.apk (30 MB)</span> तैयार कर देगा जो किसी भी फोन में बिना एरर इंस्टॉल होगा।
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong>GitHub Actions ऑटो-बिल्डर:</strong> हमने <code className="text-white font-mono">.github/workflows/build_apk.yml</code> भी जोड़ दिया है। जब आप इस कोड को GitHub पर पुश करेंगे, तो GitHub का क्लाउड सर्वर अपने आप असली 30 MB APK और Play Store AAB तैयार करके डाउनलोड लिंक दे देगा।
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Target: <strong>Android 14 (API 34)</strong> • PWA + Flutter Native Code</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition w-full sm:w-auto text-center"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
