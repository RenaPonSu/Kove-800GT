/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MotorcycleTelemetry,
  RouteInfo,
  PointOfInterest,
  AudioSystemState,
  MusicTrack,
  IncomingCall,
  IncomingMessage,
  ActiveTab,
  ScreenMode,
  MirroringConnectionState
} from './types';
import {
  INITIAL_TELEMETRY,
  SAMPLE_PLAYLIST,
  SAMPLE_POIS,
  DEFAULT_ROUTE,
  calculateGear,
  estimateFuelRange,
  calculateDistanceToEmpty,
  calculateInstantConsumption,
  generateCustomRoute,
  calculateLeanFromDeviceOrientation
} from './utils/telemetry';
import { voiceGuide } from './utils/voiceGuide';
import { TftCockpit } from './components/TftCockpit';
import { SamsungS23Device } from './components/SamsungS23Device';
import { HandlebarControls } from './components/HandlebarControls';
import { ConnectionGuideModal } from './components/ConnectionGuideModal';
import {
  Compass,
  Navigation,
  Music,
  Phone,
  Gauge,
  Sliders,
  Cast,
  Smartphone,
  Layers,
  HelpCircle,
  Play,
  Square,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [activeView, setActiveView] = useState<'cockpit' | 'split' | 'phone'>('split');
  const [activeTab, setActiveTab] = useState<ActiveTab>('nav');
  const [screenMode, setScreenMode] = useState<ScreenMode>('portrait_rally');
  const [isPairingGuideOpen, setIsPairingGuideOpen] = useState(false);

  // 2. Motorcycle Telemetry State
  const [telemetry, setTelemetry] = useState<MotorcycleTelemetry>(INITIAL_TELEMETRY);
  const [isRiding, setIsRiding] = useState(false);
  const [rideProgressPercent, setRideProgressPercent] = useState(15);

  // 3. Navigation State
  const [route, setRoute] = useState<RouteInfo>(DEFAULT_ROUTE);
  const [pois, setPois] = useState<PointOfInterest[]>(SAMPLE_POIS);
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // 4. Music Playback State
  const [audioState, setAudioState] = useState<AudioSystemState>({
    currentTrack: SAMPLE_PLAYLIST[0],
    isPlaying: true,
    currentTimeSeconds: 65,
    volumePercent: 85,
    isMuted: false,
    repeatMode: 'all',
    shuffle: false,
    outputDevice: 'helmet_intercom',
    intercomModel: 'Cardo Packtalk Edge (Mesh HD)'
  });

  // 5. Calls & Messages State
  const [activeCall, setActiveCall] = useState<IncomingCall | null>(null);
  const [messages, setMessages] = useState<IncomingMessage[]>([
    {
      id: 'msg-1',
      sender: 'Marco (Kove Riding Club)',
      app: 'WhatsApp',
      text: 'We are taking the Stelvio east ramp hairpin pass in 15 mins. Meet at the summit cafe!',
      timestamp: '14:25',
      isRead: false
    },
    {
      id: 'msg-2',
      sender: 'Elena Vance',
      app: 'SMS',
      text: 'How is the weather on the pass? Remember to check rear tire pressure.',
      timestamp: '14:18',
      isRead: true
    },
    {
      id: 'msg-3',
      sender: 'Alpine Moto Rescue',
      app: 'Telegram',
      text: 'Notice: High pass road surface clean and dry. No snow reported at 2,757m summit.',
      timestamp: '13:50',
      isRead: true
    }
  ]);

  // 6. Mirroring Connection State
  const [mirroringState, setMirroringState] = useState<MirroringConnectionState>({
    isConnected: true,
    isPairing: false,
    protocol: 'Samsung Smart View',
    s23Model: 'Samsung Galaxy S23 Ultra (SM-S918B)',
    wifiSsid: 'KOVE-800X-GT_5G_62A',
    wifiFrequencyGhz: 5.8,
    wifiSignalDbm: -42,
    bluetoothConnected: true,
    intercomConnected: true,
    aspectRatio: 'portrait_rally',
    phoneBatteryPercent: 84,
    isPhoneCharging: true,
    phoneTempC: 31,
    keepScreenAwake: true,
    batteryProtectLimit: true,
    autoConnectOnIgnition: true,
    voiceGuidanceEnabled: true,
    voiceGuidanceVolume: 0.9
  });

  // 7. Track interval timers for ride simulation & music playback
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (audioState.isPlaying) {
      interval = setInterval(() => {
        setAudioState((prev) => {
          if (prev.currentTimeSeconds >= prev.currentTrack.durationSeconds) {
            // Next track
            const curIdx = SAMPLE_PLAYLIST.findIndex((t) => t.id === prev.currentTrack.id);
            const nextTrack = SAMPLE_PLAYLIST[(curIdx + 1) % SAMPLE_PLAYLIST.length];
            return {
              ...prev,
              currentTrack: nextTrack,
              currentTimeSeconds: 0
            };
          }
          return {
            ...prev,
            currentTimeSeconds: prev.currentTimeSeconds + 1
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [audioState.isPlaying]);

  // Ride simulator ticker
  useEffect(() => {
    let rideInterval: NodeJS.Timeout | null = null;
    if (isRiding) {
      rideInterval = setInterval(() => {
        setRideProgressPercent((prev) => {
          const nextVal = prev >= 95 ? 10 : prev + 0.8;
          return nextVal;
        });

        setTelemetry((prev) => {
          // Dynamic RPM & speed wave for realistic motorcycle feel
          const speedDelta = Math.sin(Date.now() / 1500) * 12;
          const currentSpeed = Math.round(Math.max(45, Math.min(105, 78 + speedDelta)));
          const currentRpm = Math.round(4200 + (currentSpeed - 60) * 85);
          const currentGear = calculateGear(currentSpeed, currentRpm);
          const lean = Math.round(Math.sin(Date.now() / 2500) * 32);

          // Calculate instant fuel consumption rate and distance-to-empty
          const instantRate = calculateInstantConsumption(currentSpeed, currentRpm);
          const dte = calculateDistanceToEmpty(prev.fuelLiters, prev.avgConsumptionL100);

          return {
            ...prev,
            speedKmH: currentSpeed,
            rpm: currentRpm,
            gear: currentGear,
            instantConsumptionL100: instantRate,
            distanceToEmptyKm: dte,
            estimatedRangeKm: dte,
            isLowFuelReserve: prev.fuelLiters <= 3.5,
            leanAngle: lean,
            maxLeanLeft: Math.max(prev.maxLeanLeft, lean < 0 ? Math.abs(lean) : prev.maxLeanLeft),
            maxLeanRight: Math.max(prev.maxLeanRight, lean > 0 ? lean : prev.maxLeanRight)
          };
        });
      }, 500);
    }
    return () => {
      if (rideInterval) clearInterval(rideInterval);
    };
  }, [isRiding]);

  // Call timer ticker
  useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;
    if (activeCall && activeCall.status === 'active') {
      callTimer = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null));
      }, 1000);
    }
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [activeCall]);

  // Motorcycle Handlebar / Phone Gyroscope Lean Angle Sensor
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null || e.beta !== null) {
        const lean = calculateLeanFromDeviceOrientation(e.gamma, e.beta, screenMode);
        if (Math.abs(lean) > 0) {
          setTelemetry((prev) => ({
            ...prev,
            leanAngle: lean,
            maxLeanLeft: Math.max(prev.maxLeanLeft, lean < 0 ? Math.abs(lean) : prev.maxLeanLeft),
            maxLeanRight: Math.max(prev.maxLeanRight, lean > 0 ? lean : prev.maxLeanRight)
          }));
        }
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [screenMode]);

  // Voice Guidance Actions
  const handleToggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    voiceGuide.setEnabled(nextVal);
    if (nextVal) {
      voiceGuide.speak('Helmet voice guidance activated');
    }
  };

  const handleRepeatVoice = () => {
    voiceGuide.playTurnChime();
    voiceGuide.speak(
      `${route.currentManeuver.instruction}. Then in ${route.upcomingManeuvers[0]?.distanceMeters || 600} meters, ${
        route.upcomingManeuvers[0]?.instruction || 'continue straight'
      }`
    );
  };

  // Music handlers
  const handleTogglePlay = () => {
    setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleNextTrack = () => {
    const curIdx = SAMPLE_PLAYLIST.findIndex((t) => t.id === audioState.currentTrack.id);
    const nextTrack = SAMPLE_PLAYLIST[(curIdx + 1) % SAMPLE_PLAYLIST.length];
    setAudioState((prev) => ({
      ...prev,
      currentTrack: nextTrack,
      currentTimeSeconds: 0
    }));
    voiceGuide.speak(`Playing ${nextTrack.title} by ${nextTrack.artist}`);
  };

  const handlePrevTrack = () => {
    const curIdx = SAMPLE_PLAYLIST.findIndex((t) => t.id === audioState.currentTrack.id);
    const prevTrack = SAMPLE_PLAYLIST[(curIdx - 1 + SAMPLE_PLAYLIST.length) % SAMPLE_PLAYLIST.length];
    setAudioState((prev) => ({
      ...prev,
      currentTrack: prevTrack,
      currentTimeSeconds: 0
    }));
  };

  const handleSelectTrack = (track: MusicTrack) => {
    setAudioState((prev) => ({
      ...prev,
      currentTrack: track,
      currentTimeSeconds: 0,
      isPlaying: true
    }));
  };

  const handleChangeVolume = (vol: number) => {
    setAudioState((prev) => ({ ...prev, volumePercent: vol, isMuted: false }));
  };

  const handleToggleMute = () => {
    setAudioState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleSetOutputDevice = (device: AudioSystemState['outputDevice']) => {
    setAudioState((prev) => ({ ...prev, outputDevice: device }));
    voiceGuide.speak(
      device === 'helmet_intercom'
        ? 'Audio routed to Helmet Intercom'
        : device === 'kove_speakers'
        ? 'Audio routed to KOVE fairing speakers'
        : 'Audio routed to Samsung phone speaker'
    );
  };

  const handleSeek = (seconds: number) => {
    setAudioState((prev) => ({ ...prev, currentTimeSeconds: seconds }));
  };

  // Call handlers
  const handleTriggerIncomingCall = () => {
    setActiveCall({
      id: 'call-' + Date.now(),
      callerName: 'Elena Vance (Moto Touring)',
      phoneNumber: '+39 348 892 1024',
      status: 'incoming',
      durationSeconds: 0,
      isMicMuted: false
    });
    setActiveTab('comms');
    voiceGuide.playTurnChime();
    voiceGuide.speak('Incoming call from Elena Vance. Press green button on handlebar to answer.', 'urgent');
  };

  const handleAcceptCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, status: 'active' } : null));
    voiceGuide.speak('Call connected via helmet intercom', 'urgent');
  };

  const handleRejectCall = () => {
    setActiveCall(null);
    voiceGuide.speak('Call declined. Sent auto SMS.', 'urgent');
  };

  const handleEndCall = () => {
    setActiveCall(null);
    voiceGuide.speak('Call ended', 'urgent');
  };

  const handleToggleMic = () => {
    setActiveCall((prev) => (prev ? { ...prev, isMicMuted: !prev.isMicMuted } : null));
  };

  // Message handlers
  const handleTriggerIncomingMessage = () => {
    const newMsg: IncomingMessage = {
      id: 'msg-' + Date.now(),
      sender: 'Dakar Club Road Captain',
      app: 'WhatsApp',
      text: 'Pass summit reached! Clear road ahead, great tarmac condition for the 800X GT.',
      timestamp: 'Just now',
      isRead: false
    };
    setMessages((prev) => [newMsg, ...prev]);
    setActiveTab('comms');
    voiceGuide.playTurnChime();
    voiceGuide.speak(`New WhatsApp message from ${newMsg.sender}: ${newMsg.text}`);
  };

  const handleReadMessageAloud = (msg: IncomingMessage) => {
    voiceGuide.speak(`Message from ${msg.sender}: "${msg.text}"`, 'urgent');
  };

  const handleSendQuickReply = (msgId: string, replyText: string) => {
    voiceGuide.speak(`Quick reply dispatched: ${replyText}`);
  };

  const handleMarkMessageRead = (msgId: string) => {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, isRead: true } : m)));
  };

  // Destination & POI selection
  const handleSetDestination = (poi: PointOfInterest) => {
    setSelectedPoi(poi);
    setRoute({
      destinationName: poi.name,
      totalDistanceKm: poi.distanceKm,
      remainingDistanceKm: poi.distanceKm,
      totalDurationMinutes: poi.etaMinutes,
      remainingMinutes: poi.etaMinutes,
      eta: '15:10',
      currentManeuver: {
        id: 'new-m1',
        type: poi.category === 'pass' ? 'sharp-right' : 'turn-right',
        instruction: `Follow signs towards ${poi.name}`,
        roadName: poi.address,
        distanceMeters: 450,
        speedLimitKmH: 70
      },
      upcomingManeuvers: [
        {
          id: 'new-m2',
          type: 'straight',
          instruction: 'Continue on scenic alpine touring route',
          roadName: 'Panoramica SS38',
          distanceMeters: 3800
        }
      ],
      elevationProfile: [1400, 1850, 2200, poi.elevationMeters || 2400],
      weatherCondition: 'Sunny'
    });
    setActiveTab('nav');
    voiceGuide.playTurnChime();
    voiceGuide.speak(`Route calculated to ${poi.name}. In 450 meters, follow signs onto ${poi.address}`);
  };

  const handleSetCustomDestination = (query: string) => {
    const customRoute = generateCustomRoute(query);
    setRoute(customRoute);
    setSelectedPoi(null);
    setActiveTab('nav');
    voiceGuide.playTurnChime();
    voiceGuide.speak(`Route calculated to ${customRoute.destinationName}. Starting voice-guided navigation.`);
  };

  const handleRefuelOrTestFuel = (liters: number) => {
    const clampedLiters = Math.max(0, Math.min(19.0, liters));
    const percent = Math.round((clampedLiters / 19.0) * 100);
    const dte = calculateDistanceToEmpty(clampedLiters, telemetry.avgConsumptionL100);
    const isReserve = clampedLiters <= 3.5;

    setTelemetry((prev) => ({
      ...prev,
      fuelLiters: clampedLiters,
      fuelLevelPercent: percent,
      distanceToEmptyKm: dte,
      estimatedRangeKm: dte,
      isLowFuelReserve: isReserve
    }));

    if (isReserve) {
      voiceGuide.speak('Warning: Low fuel reserve. 3.5 liters remaining. Search for fuel recommended.', 'urgent');
    } else {
      voiceGuide.speak(`Fuel level updated to ${clampedLiters.toFixed(1)} liters. Distance to empty is ${dte} kilometers.`);
    }
  };

  // Handlebar D-Pad actions
  const handleNavigateUp = () => {
    setTelemetry((prev) => ({
      ...prev,
      speedKmH: Math.min(135, prev.speedKmH + 5),
      rpm: Math.min(10500, prev.rpm + 400)
    }));
  };

  const handleNavigateDown = () => {
    setTelemetry((prev) => ({
      ...prev,
      speedKmH: Math.max(0, prev.speedKmH - 5),
      rpm: Math.max(1200, prev.rpm - 400)
    }));
  };

  const handleHandlebarSelect = () => {
    if (activeCall && activeCall.status === 'incoming') {
      handleAcceptCall();
    } else {
      handleRepeatVoice();
    }
  };

  const handleHandlebarBack = () => {
    if (activeCall) {
      handleRejectCall();
    } else {
      setActiveTab('nav');
    }
  };

  const handleToggleTurnSignal = (signal: 'left' | 'right') => {
    setTelemetry((prev) => ({
      ...prev,
      turnSignal: prev.turnSignal === signal ? 'off' : signal
    }));
  };

  const handleToggleHighBeam = () => {
    setTelemetry((prev) => ({
      ...prev,
      highBeam: !prev.highBeam
    }));
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30">
      {/* 1. TOP BAR CONTRACT (Exact 3-Zone Architecture) */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="text-base sm:text-lg font-black tracking-tight text-white font-mono">
            KOVE <span className="text-emerald-400">800X GT</span>
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-semibold text-slate-300">MotoCast Hub</span>
        </div>

        {/* Zone 2: 4 Clean single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView('cockpit')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'cockpit' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Motorcycle TFT
          </button>
          <button
            onClick={() => setActiveView('split')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'split' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Cockpit + Samsung S23
          </button>
          <button
            onClick={() => setActiveView('phone')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'phone' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Samsung Phone View
          </button>
          <button
            onClick={() => setIsPairingGuideOpen(true)}
            className="text-slate-400 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Pairing Guide</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setIsRiding(!isRiding);
              if (!isRiding) {
                voiceGuide.speak('Motorcycle ride simulation active. Navigation live.');
              }
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-md whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isRiding
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
            }`}
          >
            {isRiding ? <Square className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
            <span>{isRiding ? 'Stop Ride' : 'Start Ride Sim'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-6">
        {/* Quick Viewport Mode Switcher & Mirroring Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
            <span className="font-bold text-slate-200">
              Samsung Galaxy S23 &harr; KOVE 800X GT 7" TFT
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono">Wi-Fi Direct 5.8 GHz Low Latency</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-emerald-400 font-mono hidden sm:inline">60 FPS</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Selector Controls */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveView('split')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeView === 'split'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dual View
              </button>
              <button
                onClick={() => setActiveView('cockpit')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeView === 'cockpit'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Motorcycle TFT Only
              </button>
              <button
                onClick={() => setActiveView('phone')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeView === 'phone'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Samsung S23 Only
              </button>
            </div>
          </div>
        </div>

        {/* 3. DUAL WORKSPACE SPLIT (TFT DASHBOARD + SAMSUNG S23 / CONTROLS) */}
        <div
          className={`grid gap-6 items-start ${
            activeView === 'split'
              ? 'grid-cols-1 lg:grid-cols-12'
              : activeView === 'cockpit'
              ? 'grid-cols-1 max-w-4xl mx-auto'
              : 'grid-cols-1 max-w-lg mx-auto'
          }`}
        >
          {/* LEFT / CENTER: KOVE 800X GT 7-INCH TFT COCKPIT */}
          {(activeView === 'split' || activeView === 'cockpit') && (
            <div className={activeView === 'split' ? 'lg:col-span-8' : 'w-full'}>
              <TftCockpit
                telemetry={telemetry}
                route={route}
                pois={pois}
                selectedPoi={selectedPoi}
                onSelectPoi={(poi) => setSelectedPoi(poi)}
                onSetDestination={handleSetDestination}
                onSetCustomDestination={handleSetCustomDestination}
                onRefuelOrTestFuel={handleRefuelOrTestFuel}
                audioState={audioState}
                playlist={SAMPLE_PLAYLIST}
                onTogglePlay={handleTogglePlay}
                onNextTrack={handleNextTrack}
                onPrevTrack={handlePrevTrack}
                onSelectTrack={handleSelectTrack}
                onChangeVolume={handleChangeVolume}
                onToggleMute={handleToggleMute}
                onSetOutputDevice={handleSetOutputDevice}
                onSeek={handleSeek}
                activeCall={activeCall}
                messages={messages}
                onAcceptCall={handleAcceptCall}
                onRejectCall={handleRejectCall}
                onEndCall={handleEndCall}
                onToggleMic={handleToggleMic}
                onReadMessageAloud={handleReadMessageAloud}
                onSendQuickReply={handleSendQuickReply}
                onMarkMessageRead={handleMarkMessageRead}
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
                screenMode={screenMode}
                onToggleScreenMode={() =>
                  setScreenMode(screenMode === 'portrait_rally' ? 'landscape_touring' : 'portrait_rally')
                }
                voiceEnabled={voiceEnabled}
                onToggleVoice={handleToggleVoice}
                onRepeatVoice={handleRepeatVoice}
                isRiding={isRiding}
                rideProgressPercent={rideProgressPercent}
              />
            </div>
          )}

          {/* RIGHT: SAMSUNG GALAXY S23 + HANDLEBAR SWITCHGEAR CONTROLS */}
          {(activeView === 'split' || activeView === 'phone') && (
            <div className={activeView === 'split' ? 'lg:col-span-4 space-y-6' : 'w-full space-y-6'}>
              {/* Samsung S23 Device Model */}
              <SamsungS23Device
                mirroringState={mirroringState}
                onToggleConnection={() =>
                  setMirroringState((prev) => ({ ...prev, isConnected: !prev.isConnected }))
                }
                onSelectProtocol={(proto) =>
                  setMirroringState((prev) => ({ ...prev, protocol: proto }))
                }
                onToggleKeepAwake={() =>
                  setMirroringState((prev) => ({ ...prev, keepScreenAwake: !prev.keepScreenAwake }))
                }
                onToggleBatteryProtect={() =>
                  setMirroringState((prev) => ({
                    ...prev,
                    batteryProtectLimit: !prev.batteryProtectLimit
                  }))
                }
                onToggleAutoConnect={() =>
                  setMirroringState((prev) => ({
                    ...prev,
                    autoConnectOnIgnition: !prev.autoConnectOnIgnition
                  }))
                }
                onTriggerIncomingCall={handleTriggerIncomingCall}
                onTriggerIncomingMessage={handleTriggerIncomingMessage}
                isRiding={isRiding}
                onToggleRideSimulation={() => setIsRiding(!isRiding)}
                onOpenPairingGuide={() => setIsPairingGuideOpen(true)}
              />

              {/* Left Handlebar Switchgear Control Pad */}
              <HandlebarControls
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
                onNavigateUp={handleNavigateUp}
                onNavigateDown={handleNavigateDown}
                onSelect={handleHandlebarSelect}
                onBack={handleHandlebarBack}
                telemetry={telemetry}
                onToggleTurnSignal={handleToggleTurnSignal}
                onToggleHighBeam={handleToggleHighBeam}
                onTriggerVoicePtt={handleRepeatVoice}
              />
            </div>
          )}
        </div>

        {/* 4. MOTORCYCLE HARDWARE & SPECIFICATION SHOWCASE (Kove 800X GT Authentic Context) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                KOVE 800X GT &middot; High-Performance Adventure Touring
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                799cc DOHC Parallel-Twin &middot; 71 kW (96.5 HP) @ 9,000 RPM &middot; 183 kg dry &middot; 7-inch TFT screen casting with Samsung Smart View
              </p>
            </div>

            <button
              onClick={() => setIsPairingGuideOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Full Mirroring Manual</span>
            </button>
          </div>

          {/* Authentic Kove 800X GT Images & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Image 1: Kove 800X GT Bike */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 group shadow-xl bg-slate-950">
              <img
                src="/src/assets/images/kove_800x_gt_hero_1792815739012.jpg"
                alt="KOVE 800X GT Adventure Motorcycle on Alpine Mountain Pass"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                <div className="text-base font-extrabold text-white">KOVE 800X GT Alpine Edition</div>
                <div className="text-xs text-slate-300">
                  Long-range 19L fuel tank, Brembo radial calipers, adjustable upside-down front forks, 21" front & 18" rear spoked wheels.
                </div>
              </div>
            </div>

            {/* Image 2: Cockpit TFT Close-up */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 group shadow-xl bg-slate-950">
              <img
                src="/src/assets/images/kove_cockpit_dash_1792815739248.jpg"
                alt="Motorcycle First-Person Cockpit View with 7-inch TFT Navigation"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                <div className="text-base font-extrabold text-white">7" Vertical Rally TFT Cockpit</div>
                <div className="text-xs text-slate-300">
                  Dual-band Wi-Fi screencast receiver with glove touch sensitivity, left handlebar switchgear joystick, and anti-glare optically bonded glass.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. FOOTER (Compliant with Anti-Slop, No fake telemetry tickers) */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 sm:px-8 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">KOVE 800X GT MotoCast Hub</span>
            <span>&middot;</span>
            <span>Samsung Galaxy S23 Smart View Projection</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Passo dello Stelvio Route Active</span>
            <span>&middot;</span>
            <span>A2DP Helmet Audio</span>
            <span>&middot;</span>
            <span>TPMS OK</span>
          </div>
        </div>
      </footer>

      {/* 6. CONNECTION & PAIRING GUIDE MODAL */}
      <ConnectionGuideModal
        isOpen={isPairingGuideOpen}
        onClose={() => setIsPairingGuideOpen(false)}
      />
    </div>
  );
}
