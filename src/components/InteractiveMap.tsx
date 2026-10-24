import React, { useState } from 'react';
import { PointOfInterest, RouteInfo } from '../types';
import { MapPin, Navigation, Fuel, Coffee, Mountain, Wrench, Camera, ZoomIn, ZoomOut, Compass, Sparkles } from 'lucide-react';

interface InteractiveMapProps {
  route: RouteInfo;
  pois: PointOfInterest[];
  selectedPoi: PointOfInterest | null;
  onSelectPoi: (poi: PointOfInterest) => void;
  onSetDestination: (poi: PointOfInterest) => void;
  speedKmH: number;
  isRiding: boolean;
  rideProgressPercent: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  route,
  pois,
  selectedPoi,
  onSelectPoi,
  onSetDestination,
  speedKmH,
  isRiding,
  rideProgressPercent,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [mapStyle, setMapStyle] = useState<'topo' | 'high_contrast' | 'satellite'>('topo');

  // Realistic alpine mountain road coordinates for SS38 Stelvio Pass
  const routeWaypoints = [
    { x: 18, y: 88, name: 'Bormio Valley Entry' },
    { x: 26, y: 78, name: 'Bagni Vecchi' },
    { x: 38, y: 72, name: 'Hairpin 1-8 Lower Gorge' },
    { x: 44, y: 60, name: 'Braulio Waterfalls' },
    { x: 54, y: 52, name: 'Switchback 9-22 Middle Alpine' },
    { x: 62, y: 41, name: 'Rifugio Belvedere' },
    { x: 74, y: 31, name: 'Switchback 23-48 High Pass' },
    { x: 82, y: 19, name: 'Passo dello Stelvio Summit (2,757m)' }
  ];

  // SVG route path with smooth beziers mimicking real motorcycle switchbacks
  const routePathD = "M 18,88 Q 22,82 26,78 T 32,74 T 38,72 C 45,71 42,63 44,60 C 47,56 50,55 54,52 C 58,49 57,44 62,41 C 67,37 70,36 74,31 C 77,27 80,22 82,19";

  // Calculate current motorcycle position along progress
  const progressRatio = Math.max(0, Math.min(1, rideProgressPercent / 100));
  const bikeX = 18 + (82 - 18) * progressRatio + Math.sin(progressRatio * Math.PI * 4) * 3;
  const bikeY = 88 - (88 - 19) * progressRatio + Math.cos(progressRatio * Math.PI * 3) * 2;

  const getPoiIcon = (category: PointOfInterest['category']) => {
    switch (category) {
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5 text-amber-300" />;
      case 'pass':
        return <Mountain className="w-3.5 h-3.5 text-cyan-300" />;
      case 'cafe':
        return <Coffee className="w-3.5 h-3.5 text-orange-300" />;
      case 'scenic':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-300" />;
      case 'repair':
        return <Wrench className="w-3.5 h-3.5 text-rose-300" />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-950 overflow-hidden flex flex-col select-none rounded-xl border border-slate-800/80">
      {/* Map Vector Canvas */}
      <div className="relative w-full flex-1 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: `${bikeX}% ${bikeY}%` }}
        >
          <defs>
            {/* Mountain contour gradients */}
            <linearGradient id="topo-bg" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#08101e" />
              <stop offset="50%" stopColor="#0b182b" />
              <stop offset="100%" stopColor="#11223b" />
            </linearGradient>

            <linearGradient id="route-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#10b981" floodOpacity="0.8" />
            </filter>
            <filter id="bike-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#06b6d4" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Background Topo Land */}
          <rect width="100" height="100" fill="url(#topo-bg)" />

          {/* Alpine Elevation Contour Rings */}
          <path
            d="M -10,40 Q 30,20 60,35 T 110,15 L 110,0 L -10,0 Z"
            fill="#162947"
            opacity="0.4"
          />
          <path
            d="M -10,65 Q 40,55 70,68 T 110,45 L 110,0 L -10,0 Z"
            fill="#1a3257"
            opacity="0.3"
          />
          <path
            d="M -10,85 Q 25,80 55,88 T 110,75 L 110,0 L -10,0 Z"
            fill="#1e3a66"
            opacity="0.25"
          />

          {/* Minor mountain trails and secondary roads */}
          <path
            d="M 5,95 Q 15,80 28,68 T 42,42 T 50,15"
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="1.5,1.5"
            fill="none"
          />
          <path
            d="M 40,70 Q 55,60 70,72 T 95,65"
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="1.5,1.5"
            fill="none"
          />

          {/* Main Highway & Stelvio Pass Route Outline (High-contrast casing) */}
          <path
            d={routePathD}
            fill="none"
            stroke="#022c22"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Active Navigation Route Line */}
          <path
            d={routePathD}
            fill="none"
            stroke="url(#route-gradient)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#route-glow)"
          />

          {/* Traveled portion trail */}
          <path
            d="M 18,88 Q 22,82 26,78 T 32,74"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity={progressRatio > 0.2 ? 0.8 : 0.3}
          />

          {/* Speed Camera / Hazard indicator */}
          <g transform="translate(68, 35)">
            <circle r="2.8" fill="#ef4444" opacity="0.25" />
            <circle r="1.6" fill="#ef4444" />
          </g>

          {/* Destination summit flag */}
          <g transform="translate(82, 19)">
            <circle r="3.2" fill="#10b981" opacity="0.3" />
            <circle r="2.0" fill="#10b981" />
            <circle r="0.8" fill="#ffffff" />
          </g>

          {/* Points of Interest Pins on Map */}
          {pois.map((poi) => {
            const isSelected = selectedPoi?.id === poi.id;
            return (
              <g
                key={poi.id}
                transform={`translate(${poi.coordinates.x}, ${poi.coordinates.y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectPoi(poi)}
              >
                <circle
                  r={isSelected ? 3.5 : 2.5}
                  fill={isSelected ? '#38bdf8' : '#0f172a'}
                  stroke={isSelected ? '#ffffff' : '#64748b'}
                  strokeWidth="0.6"
                />
                <circle
                  r={isSelected ? 1.8 : 1.2}
                  fill={
                    poi.category === 'fuel'
                      ? '#f59e0b'
                      : poi.category === 'pass'
                      ? '#06b6d4'
                      : poi.category === 'cafe'
                      ? '#f97316'
                      : '#10b981'
                  }
                />
              </g>
            );
          })}

          {/* KOVE 800X GT Motorcycle GPS Position & Direction Beam */}
          <g transform={`translate(${bikeX}, ${bikeY})`} filter="url(#bike-glow)">
            {/* Forward radar cone / heading indicator */}
            <path
              d="M 0,0 L -5,-12 L 5,-12 Z"
              fill="#06b6d4"
              opacity={isRiding ? 0.35 : 0.2}
            />
            {/* Pulsing ring when riding */}
            <circle
              r="4.5"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="0.8"
              opacity={isRiding ? 0.9 : 0.4}
            />
            {/* Bike icon dot */}
            <circle r="2.6" fill="#0284c7" stroke="#ffffff" strokeWidth="0.8" />
            <circle r="1.1" fill="#ffffff" />
          </g>
        </svg>

        {/* Top-Right Map Controls (Glove-friendly) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5))}
            aria-label="Zoom in map"
            className="w-11 h-11 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center text-slate-200 active:scale-95 shadow-lg transition-all"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8))}
            aria-label="Zoom out map"
            className="w-11 h-11 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center text-slate-200 active:scale-95 shadow-lg transition-all"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1.2);
            }}
            aria-label="Recenter on KOVE 800X GT"
            className="w-11 h-11 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center text-cyan-400 active:scale-95 shadow-lg transition-all"
            title="Recenter motorcycle"
          >
            <Compass className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Limit & Alert Badges Floating on Map */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <div className="w-12 h-12 rounded-full bg-white border-4 border-rose-600 flex flex-col items-center justify-center shadow-lg text-slate-950 font-black leading-none">
            <span className="text-sm font-mono font-extrabold">{route.currentManeuver.speedLimitKmH || 60}</span>
            <span className="text-[7px] uppercase font-bold tracking-tighter">LIMIT</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Navigation className="w-3.5 h-3.5" />
              <span>SS38 Stelvio</span>
            </div>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-300 font-mono">Hairpin 14/48</span>
          </div>
        </div>

        {/* Speed camera caution banner */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-amber-500/20 border border-amber-500/50 backdrop-blur-md text-amber-300 rounded-lg px-2.5 py-1 flex items-center gap-2 text-xs font-medium shadow-md">
            <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Speed Safety Zone in 650m</span>
          </div>
        </div>
      </div>

      {/* Selected POI Quick Card (if user clicked or searched a POI) */}
      {selectedPoi && (
        <div className="bg-slate-900/95 border-t border-slate-800 p-3 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center shrink-0">
              {getPoiIcon(selectedPoi.category)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                <span>{selectedPoi.name}</span>
                {selectedPoi.elevationMeters && (
                  <span className="text-[10px] text-cyan-400 font-mono">({selectedPoi.elevationMeters}m)</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {selectedPoi.distanceKm} km · {selectedPoi.etaMinutes} min · {selectedPoi.address}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectPoi(null as unknown as PointOfInterest)}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => onSetDestination(selectedPoi)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route Here</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
