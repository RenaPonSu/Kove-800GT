import React, { useState } from 'react';
import {
  MirroringConnectionState,
  AndroidBrand,
  MirroringProtocol,
  ColoveModel,
  MotorcycleTelemetry
} from '../types';
import {
  ANDROID_PHONE_PROFILES,
  COLOVE_800X_VARIANTS,
  getProtocolsForBrand,
  getBrandGuideInstructions,
  getStreamingPerformance
} from '../utils/androidMirroring';
import {
  Cast,
  Wifi,
  Bluetooth,
  BatteryCharging,
  Smartphone,
  PhoneCall,
  MessageSquare,
  Shield,
  Zap,
  RotateCw,
  Sliders,
  Play,
  Square,
  Lock,
  Sun,
  Flame,
  CheckCircle2,
  HelpCircle,
  Gauge,
  Cpu,
  Info
} from 'lucide-react';

interface AndroidPhoneDeviceProps {
  mirroringState: MirroringConnectionState;
  onToggleConnection: () => void;
  onSelectBrand: (brand: AndroidBrand) => void;
  onSelectProtocol: (protocol: MirroringProtocol) => void;
  onSelectColoveModel: (model: ColoveModel) => void;
  onSelectLatencyMode: (mode: MirroringConnectionState['latencyMode']) => void;
  onToggleKeepAwake: () => void;
  onToggleBatteryProtect: () => void;
  onToggleAutoConnect: () => void;
  onTriggerIncomingCall: () => void;
  onTriggerIncomingMessage: () => void;
  isRiding: boolean;
  onToggleRideSimulation: () => void;
  onOpenPairingGuide: () => void;
  telemetry?: MotorcycleTelemetry;
}

export const AndroidPhoneDevice: React.FC<AndroidPhoneDeviceProps> = ({
  mirroringState,
  onToggleConnection,
  onSelectBrand,
  onSelectProtocol,
  onSelectColoveModel,
  onSelectLatencyMode,
  onToggleKeepAwake,
  onToggleBatteryProtect,
  onToggleAutoConnect,
  onTriggerIncomingCall,
  onTriggerIncomingMessage,
  isRiding,
  onToggleRideSimulation,
  onOpenPairingGuide,
  telemetry
}) => {
  const [screenDimmed, setScreenDimmed] = useState(false);

  const currentProfile =
    ANDROID_PHONE_PROFILES.find((p) => p.brand === mirroringState.phoneBrand) ||
    ANDROID_PHONE_PROFILES[0];

  const availableProtocols = getProtocolsForBrand(mirroringState.phoneBrand);
  const brandInstructions = getBrandGuideInstructions(mirroringState.phoneBrand);
  const performance = getStreamingPerformance(mirroringState.latencyMode || 'low_latency_60fps');

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900 border-4 border-slate-700 rounded-[2.5rem] p-3 shadow-2xl relative select-none">
      {/* Dynamic Camera Cutout (Center hole / Left hole / Pill) */}
      {currentProfile.cameraCutout === 'left_hole' ? (
        <div className="absolute top-5 left-7 w-4 h-4 bg-black rounded-full z-20 border border-slate-800 flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-cyan-900 rounded-full" />
        </div>
      ) : currentProfile.cameraCutout === 'pill' ? (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-black rounded-full z-20 border border-slate-800 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 bg-blue-900 rounded-full" />
          <span className="w-1.5 h-1.5 bg-indigo-900 rounded-full" />
        </div>
      ) : (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20 border border-slate-800 flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-blue-950 rounded-full" />
        </div>
      )}

      {/* Screen Container */}
      <div
        className={`w-full rounded-[2rem] bg-slate-950 border border-slate-800 p-3.5 pt-6 flex flex-col justify-between transition-opacity duration-300 min-h-[640px] ${
          screenDimmed ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {/* Dynamic Android OS Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium px-2 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold font-mono">14:28</span>
            <span className="text-[10px] text-slate-500 font-mono">· {currentProfile.osName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] text-cyan-400 font-bold font-mono">5G</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-center gap-0.5 font-mono">
              <span>{mirroringState.phoneBatteryPercent}%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Universal Android Mirroring Control Hub */}
        <div className="space-y-3 py-2">
          {/* Header & Brand Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <Cast className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">Universal Android Mirroring</div>
                  <div className="text-[10px] text-slate-400">Colove 800X TFT Hub</div>
                </div>
              </div>

              <button
                onClick={onOpenPairingGuide}
                title="Open Android Pairing Instructions"
                aria-label="Open Android Pairing Instructions"
                className="text-slate-400 hover:text-cyan-400 p-1"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Android Phone Brand Switcher Pills */}
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Your Android Phone:
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
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
                  onClick={() => onSelectBrand(brand)}
                  className={`py-1 px-1.5 rounded-lg border text-center font-bold truncate transition-all ${
                    mirroringState.phoneBrand === brand
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-cyan-300 font-mono mt-1 truncate">
              Model: {currentProfile.modelName}
            </div>
          </div>

          {/* Active Target Bike Card (Colove 800X GT / Pro / Rally) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{mirroringState.coloveBikeModel || 'Colove 800X GT'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  SSID: {mirroringState.wifiSsid} · 5.8 GHz
                </div>
              </div>

              <button
                onClick={onToggleConnection}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  mirroringState.isConnected
                    ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                }`}
              >
                {mirroringState.isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {/* Colove 800X Bike Model Selector */}
            <div className="pt-1.5 border-t border-slate-800/80">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Colove 800X Model:
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                {COLOVE_800X_VARIANTS.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => onSelectColoveModel(variant.id)}
                    className={`py-1 px-1 rounded-lg border text-center font-bold truncate transition-all ${
                      mirroringState.coloveBikeModel === variant.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {variant.id.replace('Colove 800X ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Protocol Selector based on Brand */}
            <div className="pt-1.5 border-t border-slate-800/80">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Casting Protocol</span>
                <span className="text-[9px] text-emerald-400 font-mono">{performance.fps} FPS · {performance.latencyMs}ms</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {availableProtocols.map((proto) => (
                  <button
                    key={proto}
                    onClick={() => onSelectProtocol(proto)}
                    className={`px-2 py-1 rounded-lg border text-left text-[10px] font-medium truncate transition-all ${
                      mirroringState.protocol === proto
                        ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {proto}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Motorcycle TPMS Readout in PSI (Pounds per Square Inch) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 space-y-1 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>TPMS (Pounds per Square Inch)</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">LIVE PSI</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Front Tire (21")</div>
                <div className="text-lg font-black text-emerald-400">
                  {telemetry ? telemetry.tpmsFront.pressurePsi.toFixed(1) : '33.4'} <span className="text-xs font-bold text-slate-400">PSI</span>
                </div>
                <div className="text-[9px] text-slate-500">
                  {telemetry ? telemetry.tpmsFront.pressureBar.toFixed(2) : '2.30'} bar
                </div>
              </div>

              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Rear Tire (18")</div>
                <div className="text-lg font-black text-emerald-400">
                  {telemetry ? telemetry.tpmsRear.pressurePsi.toFixed(1) : '39.2'} <span className="text-xs font-bold text-slate-400">PSI</span>
                </div>
                <div className="text-[9px] text-slate-500">
                  {telemetry ? telemetry.tpmsRear.pressureBar.toFixed(2) : '2.70'} bar
                </div>
              </div>
            </div>
          </div>

          {/* Android Ride Optimizations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 space-y-1.5 text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Android Ride Optimizations
            </div>

            <div className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300 text-[11px]">Keep Awake (Wakelock)</span>
              </div>
              <input
                type="checkbox"
                checked={mirroringState.keepScreenAwake}
                onChange={onToggleKeepAwake}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 text-[11px]">Battery Protect (Limit 80%)</span>
              </div>
              <input
                type="checkbox"
                checked={mirroringState.batteryProtectLimit}
                onChange={onToggleBatteryProtect}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300 text-[11px]">Auto-Cast on Bike Ignition</span>
              </div>
              <input
                type="checkbox"
                checked={mirroringState.autoConnectOnIgnition}
                onChange={onToggleAutoConnect}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300 text-[11px]">Dim Screen while Casted</span>
              </div>
              <button
                onClick={() => setScreenDimmed(!screenDimmed)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  screenDimmed ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {screenDimmed ? 'Dimmed' : 'Normal'}
              </button>
            </div>
          </div>

          {/* Brand Quick Tip Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 flex items-start gap-2 text-[10px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>{currentProfile.pairingTip}</span>
          </div>

          {/* Test & Simulation Triggers */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={onTriggerIncomingCall}
                className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-300 font-semibold rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all text-[11px]"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Simulate Call</span>
              </button>

              <button
                onClick={onTriggerIncomingMessage}
                className="p-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/80 text-cyan-300 font-semibold rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all text-[11px]"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Simulate SMS</span>
              </button>
            </div>

            <button
              onClick={onToggleRideSimulation}
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                isRiding
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isRiding ? (
                <>
                  <Square className="w-3 h-3 fill-white" />
                  <span>Stop Ride Sim (74 km/h)</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-white" />
                  <span>Start Live Motorcycle Ride Sim</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Android Bottom Navigation Pill */}
        <div className="pt-1 flex justify-center">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Backwards-compatible alias for existing imports
export const SamsungS23Device = AndroidPhoneDevice;
