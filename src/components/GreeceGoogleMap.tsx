import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { PointOfInterest, RouteInfo } from '../types';
import { GREECE_REGIONS, GREECE_POIS, GreeceRegion } from '../utils/greeceRoutes';
import {
  Compass,
  MapPin,
  Navigation,
  Fuel,
  Coffee,
  Mountain,
  Wrench,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface GreeceGoogleMapProps {
  route: RouteInfo;
  selectedPoi: PointOfInterest | null;
  onSelectPoi: (poi: PointOfInterest) => void;
  onSetDestination: (poi: PointOfInterest) => void;
  speedKmH: number;
  isRiding: boolean;
  rideProgressPercent: number;
}

// Controller component to smoothly pan/zoom when user chooses a Greek region or POI
function MapCameraController({
  targetCenter,
  targetZoom
}: {
  targetCenter: { lat: number; lng: number };
  targetZoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(targetCenter);
    map.setZoom(targetZoom);
  }, [map, targetCenter, targetZoom]);

  return null;
}

export const GreeceGoogleMap: React.FC<GreeceGoogleMapProps> = ({
  route,
  selectedPoi,
  onSelectPoi,
  onSetDestination,
  speedKmH,
  isRiding,
  rideProgressPercent
}) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || 'AIzaSyBxlzWLe-PSKDy5_opq97nI7USYYN_8wgo';

  const [activeRegion, setActiveRegion] = useState<GreeceRegion>(GREECE_REGIONS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredPoi, setHoveredPoi] = useState<PointOfInterest | null>(null);
  const [clickedPoi, setClickedPoi] = useState<PointOfInterest | null>(selectedPoi || GREECE_POIS[0]);
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>(GREECE_REGIONS[0].center);
  const [cameraZoom, setCameraZoom] = useState<number>(GREECE_REGIONS[0].zoom);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('roadmap');

  // Sync clicked POI when props change
  useEffect(() => {
    if (selectedPoi && selectedPoi.geoLat && selectedPoi.geoLng) {
      setClickedPoi(selectedPoi);
      setCameraCenter({ lat: selectedPoi.geoLat, lng: selectedPoi.geoLng });
      setCameraZoom(12);
    }
  }, [selectedPoi]);

  const handleSelectRegion = (region: GreeceRegion) => {
    setActiveRegion(region);
    setCameraCenter(region.center);
    setCameraZoom(region.zoom);
  };

  const handleMarkerClick = (poi: PointOfInterest) => {
    setClickedPoi(poi);
    onSelectPoi(poi);
    if (poi.geoLat && poi.geoLng) {
      setCameraCenter({ lat: poi.geoLat, lng: poi.geoLng });
      setCameraZoom(12);
    }
  };

  const filteredPois = GREECE_POIS.filter((poi) => {
    const matchesCat = activeCategory === 'all' || poi.category === activeCategory;
    const matchesRegion = activeRegion.id === 'all_greece' || poi.region === activeRegion.id || !poi.region;
    const matchesSearch =
      searchQuery === '' ||
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesRegion && matchesSearch;
  });

  const getPoiColor = (category: PointOfInterest['category']) => {
    switch (category) {
      case 'pass':
        return { bg: '#06b6d4', glyph: '#ffffff', border: '#0891b2' };
      case 'fuel':
        return { bg: '#f59e0b', glyph: '#000000', border: '#d97706' };
      case 'scenic':
        return { bg: '#10b981', glyph: '#ffffff', border: '#059669' };
      case 'cafe':
        return { bg: '#f97316', glyph: '#ffffff', border: '#ea580c' };
      case 'repair':
        return { bg: '#ef4444', glyph: '#ffffff', border: '#dc2626' };
      default:
        return { bg: '#64748b', glyph: '#ffffff', border: '#475569' };
    }
  };

  const getCategoryIcon = (category: PointOfInterest['category']) => {
    switch (category) {
      case 'pass':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5" />;
      case 'scenic':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'cafe':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'repair':
        return <Wrench className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full h-full min-h-[460px] flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      {/* 1. Greece Region Selector Strip (Motorcycle Tour of Greece) */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-2.5 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 font-bold text-xs">
            GR
          </div>
          <div className="hidden sm:block">
            <div className="font-extrabold text-white text-[11px] leading-tight">Google Maps Greece</div>
            <div className="text-[10px] text-slate-400">Colove 800X TFT GPS</div>
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {GREECE_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => handleSelectRegion(region)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeRegion.id === region.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{region.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Search & Category Filter Header */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* POI Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          {[
            { id: 'all', label: 'All Greece Places' },
            { id: 'pass', label: 'Mountain Passes', icon: Mountain, color: 'text-cyan-400' },
            { id: 'fuel', label: 'Gas Stations (EKO/Shell)', icon: Fuel, color: 'text-amber-400' },
            { id: 'scenic', label: 'Scenic Viewpoints', icon: Sparkles, color: 'text-emerald-400' },
            { id: 'cafe', label: 'Rider Cafes', icon: Coffee, color: 'text-orange-400' },
            { id: 'repair', label: 'Moto Service', icon: Wrench, color: 'text-rose-400' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-slate-100 text-slate-950 font-bold'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.icon && <cat.icon className={`w-3 h-3 ${cat.color}`} />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Map Type Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
          {(['roadmap', 'terrain', 'satellite'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setMapType(t)}
              className={`px-2 py-0.5 rounded capitalize transition-all ${
                mapType === t ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Real Google Maps Viewport with @vis.gl/react-google-maps */}
      <div className="relative w-full flex-1 min-h-[380px] bg-slate-950">
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            defaultCenter={activeRegion.center}
            defaultZoom={activeRegion.zoom}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full min-h-[380px]"
            colorScheme="DARK"
          >
            <MapCameraController targetCenter={cameraCenter} targetZoom={cameraZoom} />

            {/* Google Maps Advanced Markers for Greece */}
            {filteredPois.map((poi) => {
              if (!poi.geoLat || !poi.geoLng) return null;
              const style = getPoiColor(poi.category);
              const isSelected = clickedPoi?.id === poi.id;

              return (
                <AdvancedMarker
                  key={poi.id}
                  position={{ lat: poi.geoLat, lng: poi.geoLng }}
                  title={`${poi.name} (${poi.address})`}
                  onClick={() => handleMarkerClick(poi)}
                >
                  <Pin
                    background={isSelected ? '#38bdf8' : style.bg}
                    borderColor={isSelected ? '#ffffff' : style.border}
                    glyphColor={isSelected ? '#0f172a' : style.glyph}
                    scale={isSelected ? 1.3 : 1.05}
                  />
                </AdvancedMarker>
              );
            })}

            {/* Active Greece POI InfoWindow */}
            {clickedPoi && clickedPoi.geoLat && clickedPoi.geoLng && (
              <InfoWindow
                position={{ lat: clickedPoi.geoLat, lng: clickedPoi.geoLng }}
                onCloseClick={() => setClickedPoi(null)}
                headerContent={
                  <div className="font-extrabold text-slate-900 text-xs truncate max-w-[200px]">
                    {clickedPoi.name}
                  </div>
                }
              >
                <div className="p-1 space-y-2 text-slate-800 text-xs max-w-xs">
                  <div className="text-[11px] text-slate-600 font-medium">
                    {clickedPoi.address}
                  </div>

                  <p className="text-[11px] text-slate-700 leading-snug">
                    {clickedPoi.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-200 pt-1.5 text-slate-600">
                    <span>{clickedPoi.distanceKm} km from position</span>
                    {clickedPoi.elevationMeters && (
                      <span className="font-bold text-cyan-800">Alt: {clickedPoi.elevationMeters}m</span>
                    )}
                  </div>

                  <button
                    onClick={() => onSetDestination(clickedPoi)}
                    className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Set Route to Colove 800X TFT</span>
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Motorcycle Live Speed & GPS Status HUD Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800/90 backdrop-blur-md rounded-xl p-2 px-3 flex items-center gap-3 text-xs shadow-xl pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-extrabold text-white font-mono">
              GPS LOCK: GREECE (Hellas)
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="text-[11px] font-mono text-cyan-300 font-bold">
            {speedKmH} <span className="text-[9px] font-normal text-slate-400">KM/H</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="text-[10px] text-slate-400 hidden sm:block">
            {activeRegion.highlightPass}
          </div>
        </div>
      </div>
    </div>
  );
};
