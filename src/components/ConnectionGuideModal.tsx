import React, { useState } from 'react';
import { X, CheckCircle, Cast, Wifi, Bluetooth, Smartphone, Shield, Zap, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { AndroidBrand } from '../types';

interface ConnectionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrand?: AndroidBrand;
}

export const ConnectionGuideModal: React.FC<ConnectionGuideModalProps> = ({
  isOpen,
  onClose,
  initialBrand = 'Samsung'
}) => {
  const [selectedBrand, setSelectedBrand] = useState<AndroidBrand>(initialBrand);

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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
            <Cast className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              COLOVE 800X &middot; Universal Android Mirroring Setup
            </h2>
            <p className="text-xs text-slate-400">
              Complete setup guide for all Android phones with 5.8GHz Wi-Fi low-latency casting & helmet intercom
            </p>
          </div>
        </div>

        {/* Android Brand Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-800">
          {(
            [
              'Samsung',
              'Google Pixel',
              'Xiaomi / POCO',
              'OnePlus / OPPO',
              'Motorola',
              'Universal Android'
            ] as AndroidBrand[]
          ).map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedBrand === brand
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Step-by-Step Instructions based on selected Brand */}
        <div className="space-y-3.5 text-xs text-slate-300 max-h-[58vh] overflow-y-auto pr-1">
          {/* Universal Step 1: Motorcycle Ignition */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">
                1
              </span>
              <span>COLOVE 800X Ignition & TFT Screencast Mode</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Turn your COLOVE 800X (GT / Pro / Rally) key ignition switch to <strong>ON</strong>. On the 7-inch vertical TFT dashboard, navigate to <strong>Settings &gt; Wireless Projection / MotoCast</strong>. The bike initializes its dual-band 5.8 GHz Wi-Fi Direct hotspot (<code className="text-emerald-400">COLOVE-800X-GT_XXXX</code>).
            </p>
          </div>

          {/* Brand-Specific Step 2: Casting Method */}
          {selectedBrand === 'Samsung' && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Samsung One UI &middot; Smart View Connection</span>
              </div>
              <p className="text-slate-400 pl-8 leading-relaxed">
                Swipe down twice on your Samsung Galaxy (S23, S24, or Fold) to open Quick Settings. Tap <strong>Smart View</strong>. Select <strong>COLOVE-800X-GT</strong> from the device list. Tap the floating blue icon &gt; <strong>Set aspect ratio</strong> &gt; select <strong>Full screen on connected device</strong> to eliminate black bars.
              </p>
            </div>
          )}

          {selectedBrand === 'Google Pixel' && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Google Pixel &middot; Screen Cast & Wireless Display</span>
              </div>
              <p className="text-slate-400 pl-8 leading-relaxed">
                On your Pixel (Pixel 9, 8, or 7), go to <strong>Settings &gt; Connected devices &gt; Connection preferences &gt; Cast</strong>. Tap the 3-dot menu at top right and check <strong>"Enable wireless display"</strong>. Select <strong>COLOVE-800X-GT</strong> to mirror high-definition Google Maps directly to the bike TFT.
              </p>
            </div>
          )}

          {selectedBrand === 'Xiaomi / POCO' && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Xiaomi HyperOS / MIUI &middot; Wireless Display</span>
              </div>
              <p className="text-slate-400 pl-8 leading-relaxed">
                Go to <strong>Settings &gt; Connection &amp; sharing &gt; Wireless display</strong> (or Cast). Toggle it on and select <strong>COLOVE-800X</strong>. HyperOS allows casting with the phone screen dimmed, preventing phone overheating in your motorcycle pocket.
              </p>
            </div>
          )}

          {selectedBrand === 'OnePlus / OPPO' && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">
                  2
                </span>
                <span>OnePlus OxygenOS &middot; Screencast Multi-Screen</span>
              </div>
              <p className="text-slate-400 pl-8 leading-relaxed">
                Swipe down to access OxygenOS Control Center &gt; tap <strong>Screencast</strong> tile &gt; select <strong>COLOVE-800X-GT</strong>. Enjoy fluid 60 FPS low-latency video feed matching the Colove 800X vertical rally aspect ratio.
              </p>
            </div>
          )}

          {selectedBrand === 'Motorola' && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Motorola &middot; Ready For Wireless Display</span>
              </div>
              <p className="text-slate-400 pl-8 leading-relaxed">
                Swipe down Quick Settings &gt; tap <strong>Ready For</strong> &gt; select <strong>Screen Mirroring</strong> &gt; choose <strong>COLOVE-800X</strong>. You can mirror full phone or use Moto dashboard mode.
              </p>
            </div>
          )}

          {selectedBrand === 'Universal Android' && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Universal Android (10 - 15+) &middot; CarbitLink / MotoPlay</span>
              </div>
              <p className="text-slate-400 pl-8 leading-relaxed">
                For any Android device, connect your phone to the bike Wi-Fi (<code className="text-emerald-400">COLOVE-800X-GT_5G_62A</code>). Open the built-in <strong>CarbitLink</strong> or <strong>MotoPlay</strong> mirroring app on the bike TFT and scan the QR code to project immediately.
              </p>
            </div>
          )}

          {/* Step 3: Helmet Intercom Audio */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-xs">
                3
              </span>
              <span>Bluetooth Routing to Helmet Intercom (Cardo / Sena)</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Pair your helmet headset (Cardo Packtalk, Sena 50S, or earbuds) directly to your Android phone via Bluetooth. The bike receives the high-speed navigation display via 5.8 GHz Wi-Fi Direct, while phone audio and voice directions stream straight to your helmet speakers.
            </p>
          </div>

          {/* Step 4: Vibration & Thermal Care */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-xs">
                4
              </span>
              <span>Motorcycle Mount Thermal & Battery Protection</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Enable <strong>Battery Protect (80% limit)</strong> and <strong>Dim Screen</strong> in the app to prevent heat buildup on long highway rides under the Mediterranean sun. Keep your phone in your jacket pocket or on a vibration-dampened handlebar mount.
            </p>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md"
          >
            Got it, Let's Ride!
          </button>
        </div>
      </div>
    </div>
  );
};
