import React from 'react';
import { X, CheckCircle, Cast, Wifi, Bluetooth, Smartphone, Shield, Zap, Sparkles } from 'lucide-react';

interface ConnectionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectionGuideModal: React.FC<ConnectionGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
            <Cast className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Samsung S23 + KOVE 800X GT Mirroring Setup
            </h2>
            <p className="text-xs text-slate-400">
              Complete setup guide for 5.8GHz Wi-Fi casting, helmet audio, and One UI aspect ratio
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
          {/* Step 1 */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">
                1
              </span>
              <span>Motorcycle Ignition & TFT Screencast Mode</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Turn your KOVE 800X GT key ignition switch to <strong>ON</strong>. On the 7-inch vertical TFT cockpit, use the left handlebar joystick to select <strong>Settings &gt; Wireless Projection / MotoCast</strong>. The dashboard will initialize its dual-band 5.8 GHz Wi-Fi hotspot (<code className="text-emerald-400">KOVE-800X-GT_XXXX</code>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">
                2
              </span>
              <span>Samsung Galaxy S23 Smart View Connection</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Swipe down twice from the top of your Samsung S23 screen to expand the One UI Quick Settings shade. Tap <strong>Smart View</strong>. In the device list, tap <strong>KOVE-800X-GT</strong> and tap "Start now" when prompted for screen casting.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-xs">
                3
              </span>
              <span>Aspect Ratio Configuration (Eliminate Black Borders)</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              While Smart View is mirroring, tap the floating blue Smart View button on your phone &gt; tap <strong>Set aspect ratio</strong> &gt; select <strong>Full screen on connected phone</strong>. This ensures the 7-inch KOVE display is filled end-to-end without black bars!
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-xs">
                4
              </span>
              <span>Dual Bluetooth Routing for Helmet Intercom</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Pair your helmet headset (Cardo Packtalk, Sena 50S, or Galaxy Buds) to your Samsung S23 via Bluetooth. In Samsung Media Output, ensure media & voice calls are routed to your helmet intercom. The KOVE TFT receives the low-latency video feed via Wi-Fi Direct.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center text-xs">
                5
              </span>
              <span>Thermal & Battery Protection on Bike Mounts</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              When riding in direct sunlight on a handlebar phone mount, enable <strong>Dim Phone Screen</strong> in this app and toggle Samsung <strong>Battery Protect (80% limit)</strong> to prevent battery degradation and thermal throttling.
            </p>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            Got It, Launch MirrorLink Hub
          </button>
        </div>
      </div>
    </div>
  );
};
