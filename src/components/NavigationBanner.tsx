import React from 'react';
import { RouteInfo, NavigationManeuver } from '../types';
import {
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCw,
  Volume2,
  VolumeX,
  Flag,
  Compass,
  CloudSun,
  AlertTriangle
} from 'lucide-react';
import { formatDistance } from '../utils/telemetry';

interface NavigationBannerProps {
  route: RouteInfo;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onRepeatVoice: () => void;
}

export const NavigationBanner: React.FC<NavigationBannerProps> = ({
  route,
  voiceEnabled,
  onToggleVoice,
  onRepeatVoice
}) => {
  const current = route.currentManeuver;
  const next = route.upcomingManeuvers[0];

  const getManeuverIcon = (type: NavigationManeuver['type'], className = 'w-9 h-9') => {
    switch (type) {
      case 'sharp-right':
      case 'turn-right':
      case 'slight-right':
        return <CornerUpRight className={className} />;
      case 'sharp-left':
      case 'turn-left':
      case 'slight-left':
        return <CornerUpLeft className={className} />;
      case 'roundabout':
        return <RotateCw className={className} />;
      case 'destination':
        return <Flag className={className} />;
      case 'straight':
      default:
        return <ArrowUp className={className} />;
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        {/* Maneuver Icon & Distance Zone (Motorcycle High-Visibility) */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20 shrink-0">
            {getManeuverIcon(current.type, 'w-8 h-8 stroke-[2.5]')}
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                {formatDistance(current.distanceMeters)}
              </span>
              {current.laneInfo && (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 rounded px-1.5 py-0.5">
                  {current.laneInfo}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-100 truncate max-w-[280px] sm:max-w-md">
              {current.instruction}
            </div>
            <div className="text-xs text-slate-400 truncate max-w-[260px] sm:max-w-md">
              {current.roadName}
            </div>
          </div>
        </div>

        {/* Voice Guidance & Repeat Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onRepeatVoice}
            title="Read turn instruction to helmet"
            aria-label="Repeat voice guidance to helmet"
            className="w-11 h-11 bg-slate-800/80 hover:bg-slate-700 active:scale-95 border border-slate-700/80 text-emerald-400 rounded-xl flex items-center justify-center shadow transition-all"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleVoice}
            aria-label={voiceEnabled ? 'Mute helmet voice guidance' : 'Enable helmet voice guidance'}
            className={`w-11 h-11 border rounded-xl flex items-center justify-center active:scale-95 transition-all ${
              voiceEnabled
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Secondary Next-Maneuver & Route Strip */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 gap-2">
        {next && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">THEN</span>
            <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
              {getManeuverIcon(next.type, 'w-3.5 h-3.5')}
            </div>
            <span className="text-slate-300 font-medium truncate">{next.instruction}</span>
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-slate-300">
          <div className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{route.remainingDistanceKm.toFixed(1)} km</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{route.remainingMinutes} min</span>
            <span className="text-slate-500">({route.eta})</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 text-amber-300">
            <CloudSun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{route.weatherCondition}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
