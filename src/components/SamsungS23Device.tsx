import React, { useState } from 'react';
import { MirroringConnectionState, IncomingCall, IncomingMessage } from '../types';
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
  Volume2,
  Lock,
  Sun,
  Flame,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface SamsungS23DeviceProps {
  mirroringState: MirroringConnectionState;
  onToggleConnection: () => void;
  onSelectProtocol: (protocol: MirroringConnectionState['protocol']) => void;
  onToggleKeepAwake: () => void;
  onToggleBatteryProtect: () => void;
  onToggleAutoConnect: () => void;
  onTriggerIncomingCall: () => void;
  onTriggerIncomingMessage: () => void;
  isRiding: boolean;
  onToggleRideSimulation: () => void;
  onOpenPairingGuide: () => void;
}

export const SamsungS23Device: React.FC<SamsungS23DeviceProps> = ({
  mirroringState,
  onToggleConnection,
  onSelectProtocol,
  onToggleKeepAwake,
  onToggleBatteryProtect,
  onToggleAutoConnect,
  onTriggerIncomingCall,
  onTriggerIncomingMessage,
  isRiding,
  onToggleRideSimulation,
  onOpenPairingGuide
}) => {
  const [screenDimmed, setScreenDimmed] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900 border-4 border-slate-700 rounded-[2.5rem] p-3 shadow-2xl relative select-none">
      {/* S23 Camera Punch Hole */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20 border border-slate-800 flex items-center justify-center">
        <span className="w-1.5 h-1.5 bg-blue-950 rounded-full" />
      </div>

      {/* Screen Container */}
      <div
        className={`w-full rounded-[2rem] bg-slate-950 border border-slate-800 p-4 pt-6 flex flex-col justify-between transition-opacity duration-300 min-h-[580px] ${
          screenDimmed ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {/* S23 One UI Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium px-2 pb-3 border-b border-slate-800/80">
          <span className="font-semibold">14:28</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] text-cyan-400 font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-center gap-0.5">
              <span>{mirroringState.phoneBatteryPercent}%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Samsung Smart View / Motorcycle Mirroring Card */}
        <div className="space-y-4 py-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <Cast className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">Smart View Casting</div>
                <div className="text-[11px] text-slate-400">Samsung Galaxy S23 (SM-S911B)</div>
              </div>
            </div>

            <button
              onClick={onOpenPairingGuide}
              title="Pairing instructions"
              aria-label="Pairing instructions"
              className="text-slate-400 hover:text-cyan-400 p-1"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Active Target Bike Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">KOVE 800X GT (TFT-5G)</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  SSID: {mirroringState.wifiSsid} · 5.8 GHz
                </div>
              </div>

              <button
                onClick={onToggleConnection}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  mirroringState.isConnected
                    ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {mirroringState.isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {/* Protocol Selector */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Casting Protocol
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['Samsung Smart View', 'Kove MotoCast HD', 'CarbitLink', 'MotoPlay'] as const).map((proto) => (
                  <button
                    key={proto}
                    onClick={() => onSelectProtocol(proto)}
                    className={`px-2 py-1.5 rounded-lg border text-left text-[11px] font-medium truncate transition-all ${
                      mirroringState.protocol === proto
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {proto}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Samsung S23 Motorcycle Optimizations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Samsung S23 Ride Optimizations
            </div>

            {/* Keep Awake */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">Keep Screen Awake (Wakelock)</span>
              </div>
              <input
                type="checkbox"
                checked={mirroringState.keepScreenAwake}
                onChange={onToggleKeepAwake}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Battery Protect */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Battery Protect (Limit to 80%)</span>
              </div>
              <input
                type="checkbox"
                checked={mirroringState.batteryProtectLimit}
                onChange={onToggleBatteryProtect}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Auto Start on Bike Ignition */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300">Auto-Cast on Bike Ignition</span>
              </div>
              <input
                type="checkbox"
                checked={mirroringState.autoConnectOnIgnition}
                onChange={onToggleAutoConnect}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Screen Dimming */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">Dim Phone Screen while Casted</span>
              </div>
              <button
                onClick={() => setScreenDimmed(!screenDimmed)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  screenDimmed ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {screenDimmed ? 'Dimmed (Active)' : 'Normal'}
              </button>
            </div>
          </div>

          {/* Test & Simulation Triggers for User */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 space-y-2">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
              <span>Rider Simulation Tools</span>
              <span className="text-slate-500 font-normal">Test S23 on Bike</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={onTriggerIncomingCall}
                className="p-2 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-300 font-semibold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Simulate Call</span>
              </button>

              <button
                onClick={onTriggerIncomingMessage}
                className="p-2 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/80 text-cyan-300 font-semibold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Simulate SMS</span>
              </button>
            </div>

            {/* Live Ride Simulator Toggle */}
            <button
              onClick={onToggleRideSimulation}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                isRiding
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isRiding ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop Ride Simulation (74 km/h)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Live Motorcycle Ride Sim</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* S23 Bottom Home Bar */}
        <div className="pt-2 flex justify-center">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
