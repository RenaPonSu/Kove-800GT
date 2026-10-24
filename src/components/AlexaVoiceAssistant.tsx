import React, { useState, useEffect } from 'react';
import { MotorcycleTelemetry, RouteInfo, PointOfInterest, IncomingMessage, MusicTrack } from '../types';
import { voiceGuide, AlexaState } from '../utils/voiceGuide';
import { processAlexaCommand } from '../utils/alexa';
import { AlexaRingIcon } from './AlexaRingIcon';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Fuel,
  Compass,
  MessageSquare,
  Music,
  Gauge,
  X,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface AlexaVoiceAssistantProps {
  telemetry: MotorcycleTelemetry;
  route: RouteInfo;
  pois: PointOfInterest[];
  messages: IncomingMessage[];
  currentTrack: MusicTrack;
  onSetDestination: (poi: PointOfInterest) => void;
  onNextTrack: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  className?: string;
  isCompact?: boolean;
}

export const AlexaVoiceAssistant: React.FC<AlexaVoiceAssistantProps> = ({
  telemetry,
  route,
  pois,
  messages,
  currentTrack,
  onSetDestination,
  onNextTrack,
  voiceEnabled,
  onToggleVoice,
  className = '',
  isCompact = false
}) => {
  const [alexaState, setAlexaState] = useState<AlexaState>(voiceGuide.getState());
  const [customQuery, setCustomQuery] = useState('');
  const [lastSpoken, setLastSpoken] = useState<string>(
    'Alexa is connected to your Kove 800X GT intercom. Say or tap a command below.'
  );

  // Subscribe to voice guide state changes
  useEffect(() => {
    const unsubscribe = voiceGuide.subscribe((state) => {
      setAlexaState(state);
      if (state.currentText && state.status === 'speaking') {
        setLastSpoken(state.currentText);
      }
    });
    return unsubscribe;
  }, []);

  const handleExecuteAlexa = (commandText: string) => {
    if (!voiceEnabled) {
      onToggleVoice();
    }

    voiceGuide.playAlexaWakeChime();

    // Small delay to let wake chime finish before Alexa speaks
    setTimeout(() => {
      const result = processAlexaCommand(commandText, {
        telemetry,
        route,
        pois,
        messages,
        currentTrack
      });

      setLastSpoken(result.spokenResponse);
      voiceGuide.speak(result.spokenResponse, 'urgent');

      // Trigger side effects
      if (result.action === 'route_gas') {
        const fuelPoi = pois.find((p) => p.category === 'fuel');
        if (fuelPoi) {
          onSetDestination(fuelPoi);
        }
      } else if (result.action === 'next_track') {
        onNextTrack();
      }
    }, 280);
  };

  const handleStartMic = () => {
    if (alexaState.isListening) {
      voiceGuide.stopListening();
      return;
    }

    voiceGuide.startListening(
      (transcript) => {
        handleExecuteAlexa(transcript);
      },
      () => {
        // Fallback to sample query if mic error/unsupported
        handleExecuteAlexa('Alexa, what is my fuel range?');
      }
    );
  };

  const quickPrompts = [
    {
      id: 'gas',
      label: 'Gas Station',
      query: 'Alexa, route to nearest gas station',
      icon: Fuel,
      color: 'hover:border-amber-400/80 hover:text-amber-300'
    },
    {
      id: 'range',
      label: 'Fuel Range & DTE',
      query: 'Alexa, what is my fuel range?',
      icon: Gauge,
      color: 'hover:border-cyan-400/80 hover:text-cyan-300'
    },
    {
      id: 'tpms',
      label: 'Check Tire Pressure',
      query: 'Alexa, check my tire pressure',
      icon: CheckCircle2,
      color: 'hover:border-emerald-400/80 hover:text-emerald-300'
    },
    {
      id: 'nav',
      label: 'Turn Directions',
      query: 'Alexa, repeat navigation directions',
      icon: Compass,
      color: 'hover:border-teal-400/80 hover:text-teal-300'
    },
    {
      id: 'msg',
      label: 'Read Messages',
      query: 'Alexa, read incoming messages',
      icon: MessageSquare,
      color: 'hover:border-indigo-400/80 hover:text-indigo-300'
    },
    {
      id: 'music',
      label: 'Next Song',
      query: 'Alexa, play next track',
      icon: Music,
      color: 'hover:border-rose-400/80 hover:text-rose-300'
    }
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 shadow-2xl transition-all ${className}`}
    >
      {/* 1. Signature Alexa Glowing Cyan Light Bar (Amazon Echo Style) */}
      <div
        className={`w-full h-1.5 transition-all ${
          alexaState.status === 'listening'
            ? 'alexa-light-bar-gradient h-2 shadow-lg shadow-cyan-400/80'
            : alexaState.status === 'speaking'
            ? 'alexa-light-bar-gradient h-1.5 shadow-md shadow-cyan-400/50'
            : 'bg-gradient-to-r from-slate-800 via-cyan-600/40 to-slate-800'
        }`}
      />

      <div className="p-3.5 space-y-3">
        {/* 2. Alexa Header with Glowing Light Ring */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* The Amazon Alexa Signature Glowing Light Ring */}
            <AlexaRingIcon
              size={isCompact ? 'sm' : 'md'}
              status={alexaState.status}
              withGlow={true}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                  <span>Alexa</span>
                  <span className="text-[10px] font-mono uppercase bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 px-1.5 py-0.2 rounded-full font-bold">
                    Moto Intercom
                  </span>
                </span>
                {alexaState.status === 'speaking' && (
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Speaking...
                  </span>
                )}
                {alexaState.status === 'listening' && (
                  <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    Listening...
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                KOVE 800X GT &middot; Cardo Mesh Voice Integration
              </div>
            </div>
          </div>

          {/* Voice Guidance Mute / Mic Activation */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleStartMic}
              title={alexaState.isListening ? 'Stop listening' : 'Ask Alexa (or speak to helmet)'}
              aria-label="Ask Alexa with microphone"
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md ${
                alexaState.isListening
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 animate-pulse font-black'
                  : 'bg-slate-800/90 hover:bg-slate-700/90 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">
                {alexaState.isListening ? 'Listening...' : 'Ask Alexa'}
              </span>
            </button>

            <button
              onClick={onToggleVoice}
              title={voiceEnabled ? 'Mute Alexa voice output' : 'Enable Alexa voice output'}
              aria-label={voiceEnabled ? 'Mute Alexa voice' : 'Enable Alexa voice'}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                voiceEnabled
                  ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* 3. Alexa Speech Bubble / Dynamic Live Response Card */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 flex items-start gap-2.5 shadow-inner">
          <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-0.5 flex items-center justify-between">
              <span>Alexa Voice Response</span>
              <span className="text-slate-500 font-mono text-[9px] lowercase">
                {voiceGuide.getState().voiceName}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {alexaState.status === 'speaking' ? alexaState.currentText : lastSpoken}
            </p>
          </div>

          {alexaState.status === 'speaking' && (
            <div className="flex items-center gap-1 self-center px-1">
              <span className="w-1 h-3 bg-cyan-400 rounded-full alexa-wave-1" />
              <span className="w-1 h-5 bg-cyan-300 rounded-full alexa-wave-2" />
              <span className="w-1 h-4 bg-teal-300 rounded-full alexa-wave-3" />
              <span className="w-1 h-6 bg-cyan-400 rounded-full alexa-wave-4" />
              <span className="w-1 h-2 bg-teal-400 rounded-full alexa-wave-5" />
            </div>
          )}
        </div>

        {/* 4. Quick Alexa Motorcycle Voice Command Chips */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Tap or Say "Alexa, ..."</span>
            <span className="text-[10px] text-cyan-400/80">Helmet Hands-Free</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {quickPrompts.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handleExecuteAlexa(p.query)}
                  className={`px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/90 text-left text-xs font-semibold text-slate-300 transition-all active:scale-95 flex items-center justify-between group ${p.color}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
