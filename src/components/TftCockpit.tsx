import React, { useState } from 'react';
import {
  MotorcycleTelemetry,
  RouteInfo,
  PointOfInterest,
  AudioSystemState,
  MusicTrack,
  IncomingCall,
  IncomingMessage,
  ActiveTab,
  ScreenMode
} from '../types';
import { NavigationBanner } from './NavigationBanner';
import { MusicPlayerView } from './MusicPlayerView';
import { CallAndMessagesView } from './CallAndMessagesView';
import { GreeceGoogleMap } from './GreeceGoogleMap';
import {
  Navigation,
  Music,
  Phone,
  Gauge,
  Cast,
  Sliders,
  AlertTriangle,
  Flame,
  BatteryCharging,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Search,
  Fuel,
  Coffee,
  Mountain,
  Wrench,
  Smartphone,
  Eye,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import { calculateLeanRating, formatDistance } from '../utils/telemetry';

interface TftCockpitProps {
  telemetry: MotorcycleTelemetry;
  route: RouteInfo;
  pois: PointOfInterest[];
  selectedPoi: PointOfInterest | null;
  onSelectPoi: (poi: PointOfInterest) => void;
  onSetDestination: (poi: PointOfInterest) => void;
  onSetCustomDestination?: (query: string) => void;
  onRefuelOrTestFuel?: (liters: number) => void;
  audioState: AudioSystemState;
  playlist: MusicTrack[];
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSelectTrack: (track: MusicTrack) => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
  onSetOutputDevice: (device: AudioSystemState['outputDevice']) => void;
  onSeek: (seconds: number) => void;
  activeCall: IncomingCall | null;
  messages: IncomingMessage[];
  onAcceptCall: () => void;
  onRejectCall: () => void;
  onEndCall: () => void;
  onToggleMic: () => void;
  onReadMessageAloud: (msg: IncomingMessage) => void;
  onSendQuickReply: (msgId: string, replyText: string) => void;
  onMarkMessageRead: (msgId: string) => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  screenMode: ScreenMode;
  onToggleScreenMode: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onRepeatVoice: () => void;
  isRiding: boolean;
  rideProgressPercent: number;
}

export const TftCockpit: React.FC<TftCockpitProps> = ({
  telemetry,
  route,
  pois,
  selectedPoi,
  onSelectPoi,
  onSetDestination,
  onSetCustomDestination,
  onRefuelOrTestFuel,
  audioState,
  playlist,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSelectTrack,
  onChangeVolume,
  onToggleMute,
  onSetOutputDevice,
  onSeek,
  activeCall,
  messages,
  onAcceptCall,
  onRejectCall,
  onEndCall,
  onToggleMic,
  onReadMessageAloud,
  onSendQuickReply,
  onMarkMessageRead,
  activeTab,
  onSelectTab,
  screenMode,
  onToggleScreenMode,
  voiceEnabled,
  onToggleVoice,
  onRepeatVoice,
  isRiding,
  rideProgressPercent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDaylightHighContrast, setIsDaylightHighContrast] = useState(false);

  // Filter POIs based on search query and category
  const filteredPois = pois.filter((poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || poi.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  // Tachometer percentage (0-11,000 RPM)
  const rpmPercent = Math.min(100, (telemetry.rpm / 11000) * 100);
  const isRedline = telemetry.rpm >= 9500;
  const leanRating = calculateLeanRating(telemetry.leanAngle);

  return (
    <div
      className={`relative w-full rounded-3xl tft-bezel bg-slate-950 p-2 sm:p-3 overflow-hidden transition-all duration-300 border-4 ${
        isRedline ? 'border-rose-600 shadow-rose-950/80 shadow-2xl' : 'border-slate-800'
      } ${
        screenMode === 'portrait_rally'
          ? 'max-w-[480px] mx-auto min-h-[780px]'
          : 'w-full min-h-[580px]'
      }`}
    >
      {/* Matte Screen Glare Overlay */}
      <div className="absolute inset-0 pointer-events-none tft-screen-glare z-30" />

      {/* 1. TOP STATUS BAR (COLOVE / KOVE TFT HEADER) */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 rounded-t-2xl px-3 py-2 flex items-center justify-between gap-2 text-xs">
        {/* Brand & Bike Model */}
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tight text-white font-mono text-sm">
            COLOVE / KOVE <span className="text-emerald-400">800X GT</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-semibold text-cyan-400 uppercase font-mono">
            Android MirrorCast 5.8G
          </span>
        </div>

        {/* Turn Signals & Warning Indicators */}
        <div className="flex items-center gap-2.5">
          {/* Left Turn Indicator */}
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              telemetry.turnSignal === 'left' || telemetry.turnSignal === 'hazard'
                ? 'bg-emerald-400 animate-turn-signal shadow-lg shadow-emerald-500/50'
                : 'bg-slate-800'
            }`}
            title="Left Turn Signal"
          />

          {/* High Beam */}
          <span
            className={`text-[10px] font-mono px-1 rounded font-bold ${
              telemetry.highBeam ? 'bg-cyan-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            HIGH BEAM
          </span>

          {/* Right Turn Indicator */}
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              telemetry.turnSignal === 'right' || telemetry.turnSignal === 'hazard'
                ? 'bg-emerald-400 animate-turn-signal shadow-lg shadow-emerald-500/50'
                : 'bg-slate-800'
            }`}
            title="Right Turn Signal"
          />
        </div>

        {/* System Clocks, Ambient Temp & Battery */}
        <div className="flex items-center gap-3 text-slate-300 font-mono text-xs">
          <span>{telemetry.ambientTempC}°C</span>
          <span>14:28</span>
          <button
            onClick={() => setIsDaylightHighContrast(!isDaylightHighContrast)}
            aria-label="Toggle daylight high-contrast TFT mode"
            title="Daylight / Night Mode"
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            {isDaylightHighContrast ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleScreenMode}
            aria-label="Toggle TFT Screen orientation mode"
            title="Switch Portrait Rally Tower / Landscape Touring"
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] font-sans"
          >
            {screenMode === 'portrait_rally' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-bold">{screenMode === 'portrait_rally' ? 'Rally 9:16' : 'GT 16:9'}</span>
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC RPM TACHOMETER ARC (KOVE 800X GT 799cc TWIN) */}
      <div className="w-full bg-slate-900/80 px-3 py-2 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-300">RPM x1000</span>
            <span className="text-slate-500">·</span>
            <span className={`font-bold font-mono ${isRedline ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
              {telemetry.rpm.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">REDLINE 9.5k</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              telemetry.rideMode === 'Sport' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {telemetry.rideMode}
            </span>
          </div>
        </div>

        {/* Tachometer Bar Segmented */}
        <div className="relative w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              isRedline
                ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 shadow-md shadow-rose-500/80'
                : 'bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400'
            }`}
            style={{ width: `${rpmPercent}%` }}
          />
          {/* Tick marks for 2k, 4k, 6k, 8k, 10k */}
          <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-40">
            {[...Array(11)].map((_, i) => (
              <span key={i} className="w-[1px] h-full bg-white" />
            ))}
          </div>
        </div>

        {/* Dynamic Fuel Level, Consumption Rate & DTE Strip */}
        <div className={`mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono transition-colors ${
          telemetry.isLowFuelReserve ? 'text-amber-400' : 'text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Fuel className={`w-3.5 h-3.5 ${telemetry.isLowFuelReserve ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className="text-[10px] uppercase font-bold text-slate-400">FUEL</span>
            {/* 8-Segment Graphic LED Fuel Gauge */}
            <div className="flex items-center gap-0.5" title={`Fuel Level: ${telemetry.fuelLevelPercent}% (${telemetry.fuelLiters.toFixed(1)}L)`}>
              {[...Array(8)].map((_, i) => {
                const isLit = telemetry.fuelLevelPercent >= (i * 12.5 + 3);
                const isReserve = i < 2;
                return (
                  <div
                    key={i}
                    className={`w-2.5 sm:w-3 h-2 rounded-[2px] transition-all ${
                      isLit
                        ? isReserve && telemetry.isLowFuelReserve
                          ? 'bg-amber-400 animate-pulse shadow-sm shadow-amber-400/60'
                          : 'bg-cyan-400 shadow-sm shadow-cyan-400/40'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-semibold text-slate-300 font-mono">
              {telemetry.fuelLiters.toFixed(1)}L / {telemetry.fuelTankCapacityLiters || 19}L
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="text-slate-500">RATE:</span>
              <span className="font-bold text-emerald-400">{telemetry.instantConsumptionL100.toFixed(1)} L/100</span>
            </div>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">DTE:</span>
              <span className={`font-bold font-mono ${telemetry.isLowFuelReserve ? 'text-amber-400 font-black animate-pulse' : 'text-cyan-300'}`}>
                {telemetry.distanceToEmptyKm} km
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY TELEMETRY GAUGES (SPEEDOMETER, GEAR, DTE RANGE, LEAN ANGLE) */}
      <div className="bg-slate-950/90 px-3 py-3 border-b border-slate-800 grid grid-cols-4 gap-2 text-center items-center">
        {/* Speedometer */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SPEED</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tighter leading-none my-0.5">
            {telemetry.speedKmH}
          </div>
          <div className="text-[10px] font-mono text-slate-400 font-semibold">KM / H</div>
        </div>

        {/* Gear Indicator */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GEAR</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tracking-tighter leading-none my-0.5">
            {telemetry.gear === 'N' ? (
              <span className="text-emerald-400">N</span>
            ) : (
              telemetry.gear
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {telemetry.gear === 'N' ? 'NEUTRAL' : 'CLUTCH IN'}
          </div>
        </div>

        {/* Dynamic Distance-to-Empty (DTE) Range & Consumption Card */}
        <div className={`col-span-2 sm:col-span-1 border rounded-2xl p-2.5 flex flex-col justify-center transition-all ${
          telemetry.isLowFuelReserve
            ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/50'
            : 'bg-slate-900/70 border-slate-800/80'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Fuel className={`w-3.5 h-3.5 ${telemetry.isLowFuelReserve ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`} />
              <span>DTE RANGE</span>
            </div>
            <span className="font-mono text-emerald-400 text-[10px]">
              {telemetry.instantConsumptionL100.toFixed(1)} L/100
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300 leading-tight my-0.5">
            {telemetry.distanceToEmptyKm}
            <span className="text-xs ml-0.5 font-normal text-slate-400">km</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Tank {telemetry.fuelLevelPercent}%</span>
            <span>{telemetry.fuelLiters.toFixed(1)}L left</span>
          </div>
          {telemetry.isLowFuelReserve && (
            <div className="mt-1 text-[9px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/60 px-1 py-0.5 rounded text-center animate-pulse">
              LOW FUEL RESERVE
            </div>
          )}
        </div>

        {/* Dynamic Lean Angle Gyro */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LEAN ANGLE</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white leading-tight my-0.5">
            {Math.abs(telemetry.leanAngle)}°
            <span className="text-xs ml-1 text-slate-400">
              {telemetry.leanAngle < 0 ? 'L' : telemetry.leanAngle > 0 ? 'R' : '—'}
            </span>
          </div>
          <div className={`text-[10px] font-bold truncate ${leanRating.color}`}>
            Max {telemetry.maxLeanLeft}°L / {telemetry.maxLeanRight}°R
          </div>
        </div>
      </div>

      {/* 4. MOTORCYCLE GLOVE SWITCHGEAR TABS */}
      <div className="bg-slate-900/90 px-2 py-2 border-b border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto">
        <button
          onClick={() => onSelectTab('nav')}
          className={`flex-1 min-w-[70px] min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'nav'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Navigation className="w-4 h-4 shrink-0" />
          <span>GPS MAP</span>
        </button>

        <button
          onClick={() => onSelectTab('music')}
          className={`flex-1 min-w-[70px] min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'music'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Music className="w-4 h-4 shrink-0" />
          <span>MUSIC</span>
          {audioState.isPlaying && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-0.5" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('comms')}
          className={`flex-1 min-w-[70px] min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap relative ${
            activeTab === 'comms'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>COMMS</span>
          {(activeCall || messages.length > 0) && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-bounce ml-0.5" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('telemetry')}
          className={`flex-1 min-w-[70px] min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'telemetry'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Gauge className="w-4 h-4 shrink-0" />
          <span>TPMS</span>
        </button>

        {/* Colove 800X Universal Android Cast Tab */}
        <button
          onClick={() => onSelectTab('android')}
          className={`flex-1 min-w-[75px] min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'android'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 font-extrabold'
              : 'text-cyan-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Cast className="w-4 h-4 shrink-0" />
          <span>CAST</span>
        </button>
      </div>

      {/* 5. ACTIVE TAB MAIN VIEWPORT */}
      <div className="p-2 sm:p-3 space-y-3">
        {/* TAB 1: NAVIGATION & ADDRESS/POI SEARCH */}
        {activeTab === 'nav' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Turn-by-Turn Instruction Banner */}
            <NavigationBanner
              route={route}
              voiceEnabled={voiceEnabled}
              onToggleVoice={onToggleVoice}
              onRepeatVoice={onRepeatVoice}
            />

            {/* Address & Points of Interest Search Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        if (onSetCustomDestination) {
                          onSetCustomDestination(searchQuery.trim());
                        }
                        setSearchQuery('');
                      }
                    }}
                    placeholder="Search address, pass, city (Press Enter to route)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Glove Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    filterCategory === 'all'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Places
                </button>
                <button
                  onClick={() => setFilterCategory('pass')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                    filterCategory === 'pass'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Passes</span>
                </button>
                <button
                  onClick={() => setFilterCategory('fuel')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                    filterCategory === 'fuel'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fuel & Air</span>
                </button>
                <button
                  onClick={() => setFilterCategory('cafe')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                    filterCategory === 'cafe'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5 text-orange-400" />
                  <span>Moto Cafes</span>
                </button>
                <button
                  onClick={() => setFilterCategory('repair')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                    filterCategory === 'repair'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-rose-400" />
                  <span>Tire & Service</span>
                </button>
              </div>

              {/* Search Results Dropdown (if searching) */}
              {searchQuery && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 max-h-48 overflow-y-auto space-y-1.5">
                  {/* Direct Route Action to typed Address */}
                  <div
                    onClick={() => {
                      if (onSetCustomDestination) {
                        onSetCustomDestination(searchQuery.trim());
                      }
                      setSearchQuery('');
                    }}
                    className="p-2.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Route to: "{searchQuery}"</div>
                        <div className="text-[10px] text-cyan-300">Generate voice turn-by-turn navigation</div>
                      </div>
                    </div>
                    <button className="px-2.5 py-1 bg-cyan-600 text-white rounded text-[10px] font-bold shrink-0">
                      Go
                    </button>
                  </div>

                  {filteredPois.map((poi) => (
                    <div
                      key={poi.id}
                      onClick={() => {
                        onSelectPoi(poi);
                        onSetDestination(poi);
                        setSearchQuery('');
                      }}
                      className="p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{poi.name}</div>
                        <div className="text-[10px] text-slate-400">{poi.distanceKm} km · {poi.address}</div>
                      </div>
                      <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold">
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Greece Google Maps Navigation Canvas */}
            <div className="h-[380px] sm:h-[430px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <GreeceGoogleMap
                route={route}
                selectedPoi={selectedPoi}
                onSelectPoi={onSelectPoi}
                onSetDestination={onSetDestination}
                speedKmH={telemetry.speedKmH}
                isRiding={isRiding}
                rideProgressPercent={rideProgressPercent}
              />
            </div>
          </div>
        )}

        {/* TAB 2: MUSIC CONTROLS WITHIN MIRRORED DASH */}
        {activeTab === 'music' && (
          <div className="animate-in fade-in duration-200">
            <MusicPlayerView
              audioState={audioState}
              playlist={playlist}
              onTogglePlay={onTogglePlay}
              onNextTrack={onNextTrack}
              onPrevTrack={onPrevTrack}
              onSelectTrack={onSelectTrack}
              onChangeVolume={onChangeVolume}
              onToggleMute={onToggleMute}
              onSetOutputDevice={onSetOutputDevice}
              onSeek={onSeek}
            />
          </div>
        )}

        {/* TAB 3: INCOMING CALLS & NOTIFICATIONS */}
        {activeTab === 'comms' && (
          <div className="animate-in fade-in duration-200">
            <CallAndMessagesView
              activeCall={activeCall}
              messages={messages}
              onAcceptCall={onAcceptCall}
              onRejectCall={onRejectCall}
              onEndCall={onEndCall}
              onToggleMic={onToggleMic}
              onReadMessageAloud={onReadMessageAloud}
              onSendQuickReply={onSendQuickReply}
              onMarkMessageRead={onMarkMessageRead}
            />
          </div>
        )}

        {/* TAB 4: DETAILED KOVE 800X GT TPMS & TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* TPMS Front & Rear Tire Health - Pounds per Square Inch (PSI) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span>TPMS Tire Pressure (PSI - Pounds per Square Inch)</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Dual Rim Transmitters OK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Front Tire */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    FRONT (21" Spoked Wheel)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 my-1">
                    {telemetry.tpmsFront.pressurePsi.toFixed(1)}{' '}
                    <span className="text-sm font-extrabold text-emerald-300">PSI</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Pounds per Square Inch</div>
                  <div className="text-xs text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800/60">
                    {telemetry.tpmsFront.pressureBar.toFixed(2)} bar · {telemetry.tpmsFront.tempC}°C
                  </div>
                </div>

                {/* Rear Tire */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    REAR (18" Spoked Wheel)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 my-1">
                    {telemetry.tpmsRear.pressurePsi.toFixed(1)}{' '}
                    <span className="text-sm font-extrabold text-emerald-300">PSI</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Pounds per Square Inch</div>
                  <div className="text-xs text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800/60">
                    {telemetry.tpmsRear.pressureBar.toFixed(2)} bar · {telemetry.tpmsRear.tempC}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Fuel Telemetry & Range Monitor */}
            <div className={`border rounded-2xl p-4 transition-all ${
              telemetry.isLowFuelReserve
                ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/80 shadow-xl shadow-amber-950/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Fuel className={`w-4 h-4 ${telemetry.isLowFuelReserve ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Dynamic Fuel Range & Consumption Monitor
                  </span>
                </div>
                {telemetry.isLowFuelReserve ? (
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 border border-amber-500/50 px-2 py-0.5 rounded animate-pulse">
                    LOW FUEL RESERVE (&lt;3.5L)
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    Sensor OK · 19.0L Tank
                  </span>
                )}
              </div>

              {/* Dynamic Tank Level Gauge Bar with Milestones */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span className={telemetry.fuelLevelPercent <= 18 ? 'text-amber-400 font-bold' : ''}>E (Reserve 3.5L)</span>
                  <span>1/4</span>
                  <span>1/2</span>
                  <span>3/4</span>
                  <span>F (19L)</span>
                </div>
                <div className="relative w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      telemetry.isLowFuelReserve
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-md shadow-amber-500/50 animate-pulse'
                        : 'bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(4, telemetry.fuelLevelPercent))}%` }}
                  />
                  {/* Gauge Tick Divisions */}
                  <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-30">
                    <span className="w-[1px] h-full bg-rose-500" />
                    <span className="w-[1px] h-full bg-white" />
                    <span className="w-[1px] h-full bg-white" />
                    <span className="w-[1px] h-full bg-white" />
                    <span className="w-[1px] h-full bg-white" />
                  </div>
                </div>
              </div>

              {/* 4 Fuel Performance Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mb-3">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Distance to Empty</div>
                  <div className={`text-xl font-extrabold font-mono mt-0.5 ${telemetry.isLowFuelReserve ? 'text-amber-400' : 'text-cyan-300'}`}>
                    {telemetry.distanceToEmptyKm} <span className="text-xs font-normal text-slate-400">km</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Instant Rate</div>
                  <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">
                    {telemetry.instantConsumptionL100.toFixed(1)} <span className="text-xs font-normal text-slate-400">L/100</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Trip Average</div>
                  <div className="text-xl font-extrabold font-mono text-slate-200 mt-0.5">
                    {telemetry.avgConsumptionL100.toFixed(1)} <span className="text-xs font-normal text-slate-400">L/100</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Fuel Volume</div>
                  <div className="text-xl font-extrabold font-mono text-slate-200 mt-0.5">
                    {telemetry.fuelLiters.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 19L</span>
                  </div>
                </div>
              </div>

              {/* Riding Range Projection by Ride Mode & Testing Triggers */}
              <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>Eco Proj: <strong className="text-emerald-400 font-bold">{Math.round((telemetry.fuelLiters / 3.8) * 100)} km</strong></span>
                  <span>·</span>
                  <span>Sport Proj: <strong className="text-amber-400 font-bold">{Math.round((telemetry.fuelLiters / 5.6) * 100)} km</strong></span>
                </div>

                {/* Refuel & Low Fuel Simulation Buttons */}
                {onRefuelOrTestFuel && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500">Test:</span>
                    <button
                      onClick={() => onRefuelOrTestFuel(19.0)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold transition-colors"
                      title="Simulate 100% full fuel tank"
                    >
                      Full 19L
                    </button>
                    <button
                      onClick={() => onRefuelOrTestFuel(9.5)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold transition-colors"
                      title="Simulate 50% half fuel tank"
                    >
                      Half 9.5L
                    </button>
                    <button
                      onClick={() => onRefuelOrTestFuel(2.8)}
                      className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 rounded font-semibold transition-colors"
                      title="Simulate low fuel reserve (<3.5L)"
                    >
                      Reserve 2.8L
                    </button>
                  </div>
                )}
              </div>

              {/* Low Fuel Reserve Action Banner (If Reserve Alert is active) */}
              {telemetry.isLowFuelReserve && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/50 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-medium">
                    <Fuel className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    <span>Low fuel reserve active. Recommended fuel stop within {telemetry.distanceToEmptyKm} km.</span>
                  </div>
                  <button
                    onClick={() => {
                      const fuelPoi = pois.find((p) => p.category === 'fuel');
                      if (fuelPoi) {
                        onSetDestination(fuelPoi);
                      }
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow whitespace-nowrap shrink-0 transition-colors"
                  >
                    Route to Gas Station
                  </button>
                </div>
              )}
            </div>

            {/* Trip Computer Metrics */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                KOVE 800X GT Trip Computer
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Odometer</div>
                  <div className="text-lg font-bold font-mono text-slate-200 mt-0.5">
                    {telemetry.odometerKm} km
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Trip A (Pass)</div>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                    {telemetry.tripAKm} km
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Avg Fuel</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    {telemetry.avgConsumptionL100} L/100
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Coolant Temp</div>
                  <div className="text-lg font-bold font-mono text-slate-200 mt-0.5">
                    {telemetry.coolantTempC}°C
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Battery System</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    {telemetry.batteryVoltage} V
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">ABS / TCS</div>
                  <div className="text-xs font-bold font-mono text-cyan-400 mt-1">
                    {telemetry.absMode} · {telemetry.tcsMode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COLOVE 800X UNIVERSAL ANDROID WIRELESS PROJECTION */}
        {activeTab === 'android' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Mirroring Connection Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    COLOVE 800X GT &middot; Android Wireless MirrorLink
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
                  60 FPS &middot; Low Latency
                </span>
              </div>

              {/* Protocol & Device Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Active Protocol</div>
                  <div className="text-xs font-bold font-mono text-cyan-300 mt-1 truncate">
                    Smart View / Cast
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Wi-Fi Direct</div>
                  <div className="text-xs font-bold font-mono text-emerald-400 mt-1">
                    5.8 GHz &middot; 802.11ac
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Tire Pressure</div>
                  <div className="text-xs font-bold font-mono text-amber-300 mt-1">
                    {telemetry.tpmsFront.pressurePsi.toFixed(1)} / {telemetry.tpmsRear.pressurePsi.toFixed(1)} PSI
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Glove Control</div>
                  <div className="text-xs font-bold font-mono text-slate-200 mt-1">
                    Handlebar D-Pad
                  </div>
                </div>
              </div>

              {/* Supported Android Brands strip */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Compatible with Samsung, Google Pixel, Xiaomi, OnePlus, Motorola & Universal Android</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Colove MotoCast Engine v2.4</span>
              </div>
            </div>

            {/* Live Navigation & Cockpit Quick Glance */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Real-Time Colove 800X Telemetry Glance</span>
                <span className="text-emerald-400 font-mono text-[11px]">TPMS Primary: PSI</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">DTE Fuel Range</div>
                  <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                    {telemetry.distanceToEmptyKm} km
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Front / Rear TPMS</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                    {telemetry.tpmsFront.pressurePsi.toFixed(1)} / {telemetry.tpmsRear.pressurePsi.toFixed(1)} PSI
                  </div>
                  <div className="text-[9px] text-slate-500">Pounds per Square Inch</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Next Maneuver</div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                    {route.currentManeuver.instruction}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. BOTTOM SYSTEM GLANCE BAR */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-2 rounded-b-2xl flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-300">Android Phone Screencast</span>
          <span>·</span>
          <span className="font-mono">Wi-Fi Direct 5.8GHz</span>
          <span>·</span>
          <span className="text-emerald-400 font-mono">60 FPS</span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span className="text-slate-300">
            TPMS: <strong className="text-emerald-400">{telemetry.tpmsFront.pressurePsi.toFixed(1)}</strong> / <strong className="text-emerald-400">{telemetry.tpmsRear.pressurePsi.toFixed(1)}</strong> PSI
          </span>
          <span>·</span>
          <span>Battery 84%</span>
        </div>
      </div>
    </div>
  );
};
