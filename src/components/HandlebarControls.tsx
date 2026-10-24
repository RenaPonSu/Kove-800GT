import React, { useEffect } from 'react';
import { ActiveTab, MotorcycleTelemetry } from '../types';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  ArrowLeft,
  Volume2,
  AlertTriangle,
  Lightbulb,
  Radio,
  Sliders
} from 'lucide-react';

interface HandlebarControlsProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onSelect: () => void;
  onBack: () => void;
  telemetry: MotorcycleTelemetry;
  onToggleTurnSignal: (signal: 'left' | 'right') => void;
  onToggleHighBeam: () => void;
  onTriggerVoicePtt: () => void;
}

export const HandlebarControls: React.FC<HandlebarControlsProps> = ({
  activeTab,
  onSelectTab,
  onNavigateUp,
  onNavigateDown,
  onSelect,
  onBack,
  telemetry,
  onToggleTurnSignal,
  onToggleHighBeam,
  onTriggerVoicePtt
}) => {
  // Listen for keyboard arrow keys and Enter/Escape for motorcycle handlebar simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onNavigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onNavigateDown();
          break;
        case 'Enter':
          e.preventDefault();
          onSelect();
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          onBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateUp, onNavigateDown, onSelect, onBack]);

  const tabs: ActiveTab[] = ['nav', 'music', 'comms', 'telemetry'];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              KOVE Left Handlebar Switchgear
            </div>
            <div className="text-[10px] text-slate-400">Glove D-Pad & Quick Controls</div>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
          Arrows + Enter
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Left Switchgear 5-Way Joypad */}
        <div className="flex flex-col items-center justify-center p-2 bg-slate-950/80 rounded-2xl border border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation D-Pad
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* UP BUTTON */}
            <button
              onClick={onNavigateUp}
              aria-label="Handlebar switchgear UP"
              className="absolute top-0 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 shadow-md transition-all"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            {/* DOWN BUTTON */}
            <button
              onClick={onNavigateDown}
              aria-label="Handlebar switchgear DOWN"
              className="absolute bottom-0 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 shadow-md transition-all"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            {/* LEFT TAB PREV */}
            <button
              onClick={() => {
                const curIdx = tabs.indexOf(activeTab);
                const nextIdx = (curIdx - 1 + tabs.length) % tabs.length;
                onSelectTab(tabs[nextIdx]);
              }}
              aria-label="Handlebar switchgear PREV TAB"
              className="absolute left-0 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 shadow-md transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* RIGHT TAB NEXT */}
            <button
              onClick={() => {
                const curIdx = tabs.indexOf(activeTab);
                const nextIdx = (curIdx + 1) % tabs.length;
                onSelectTab(tabs[nextIdx]);
              }}
              aria-label="Handlebar switchgear NEXT TAB"
              className="absolute right-0 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 shadow-md transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* CENTER SELECT / ENTER */}
            <button
              onClick={onSelect}
              aria-label="Handlebar switchgear SELECT"
              className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 active:scale-90 text-slate-950 font-black rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all"
            >
              <CornerDownLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={onBack}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back / Home</span>
            </button>
          </div>
        </div>

        {/* Physical Bike Action Switches (Turn signals, High beam, Voice PTT) */}
        <div className="space-y-2.5">
          {/* Turn Signal Rocker Switch */}
          <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Turn Signals (Left Grip)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleTurnSignal('left')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  telemetry.turnSignal === 'left'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>LEFT SIGNAL</span>
              </button>

              <button
                onClick={() => onToggleTurnSignal('right')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  telemetry.turnSignal === 'right'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>RIGHT SIGNAL</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* High Beam & Helmet PTT Quick Keys */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleHighBeam}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                telemetry.highBeam
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{telemetry.highBeam ? 'HIGH BEAM ON' : 'PASS LIGHT'}</span>
            </button>

            <button
              onClick={onTriggerVoicePtt}
              title="Voice Guidance Prompt to Helmet"
              className="py-2.5 px-3 bg-slate-950/80 hover:bg-slate-850 active:scale-95 border border-slate-800 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>HELMET PTT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
