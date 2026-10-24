import { MotorcycleTelemetry, RouteInfo, PointOfInterest, MusicTrack, ScreenMode } from '../types';

/**
 * Validates tire pressure for front and rear tires on KOVE 800X GT.
 * Recommended cold pressure:
 * Front (90/90-21 or 110/80-19): 2.1 - 2.5 bar (30 - 36 psi)
 * Rear (150/70-18 or 150/70-17): 2.4 - 2.9 bar (35 - 42 psi)
 */
export function checkTirePressureWarning(
  pressureBar: number,
  isFront: boolean
): { isWarning: boolean; isCritical: boolean; message: string } {
  const minBar = isFront ? 1.8 : 2.0;
  const maxBar = isFront ? 2.8 : 3.2;

  if (pressureBar < minBar * 0.85) {
    return {
      isWarning: true,
      isCritical: true,
      message: `CRITICAL: ${isFront ? 'Front' : 'Rear'} tire dangerously low (${pressureBar.toFixed(1)} bar)`
    };
  }
  if (pressureBar < minBar) {
    return {
      isWarning: true,
      isCritical: false,
      message: `Low pressure in ${isFront ? 'front' : 'rear'} tire (${pressureBar.toFixed(1)} bar)`
    };
  }
  if (pressureBar > maxBar) {
    return {
      isWarning: true,
      isCritical: false,
      message: `High pressure in ${isFront ? 'front' : 'rear'} tire (${pressureBar.toFixed(1)} bar)`
    };
  }
  return {
    isWarning: false,
    isCritical: false,
    message: 'Nominal'
  };
}

/**
 * Calculates distance-to-empty (DTE) in km based on available fuel liters and consumption rate
 */
export function calculateDistanceToEmpty(fuelLiters: number, consumptionL100: number): number {
  if (consumptionL100 <= 0 || fuelLiters <= 0) return 0;
  const dte = (fuelLiters / consumptionL100) * 100;
  return Math.round(Math.max(0, dte));
}

/**
 * Calculates estimated riding range in km (alias for DTE) based on Kove 800X GT 19-liter tank
 */
export function estimateFuelRange(fuelLiters: number, avgConsumptionL100: number): number {
  return calculateDistanceToEmpty(fuelLiters, avgConsumptionL100);
}

/**
 * Calculates dynamic instantaneous fuel consumption rate (L/100km)
 * for the KOVE 800X GT 799cc DOHC parallel twin based on speed and RPM
 */
export function calculateInstantConsumption(speedKmH: number, rpm: number): number {
  // Stationary idle: engine running at ~1300 RPM consumes ~0.8 L/hour, but as L/100km is undefined/infinite,
  // motorcycle dashboards display 0.0 or idle benchmark
  if (speedKmH < 2) return 0.0;

  // Base consumption derived from speed and engine load (RPM vs speed)
  const loadFactor = rpm / Math.max(2500, speedKmH * 50);
  const baseRate = 3.2 + (speedKmH / 100) * 1.5;
  const instantRate = baseRate * Math.max(0.7, Math.min(2.2, loadFactor));

  return parseFloat(instantRate.toFixed(1));
}

/**
 * Determines gear from speed and RPM for the Kove 800X GT (799cc DOHC twin, 6-speed)
 */
export function calculateGear(speedKmH: number, rpm: number): number | 'N' {
  if (speedKmH < 2 && rpm < 2000) return 'N';
  if (rpm < 500) return 'N';

  // Speed-to-RPM approximate gear ratios
  const ratio = (speedKmH / Math.max(1, rpm)) * 1000;
  if (ratio < 9.5) return 1;
  if (ratio < 13.5) return 2;
  if (ratio < 17.5) return 3;
  if (ratio < 21.5) return 4;
  if (ratio < 25.5) return 5;
  return 6;
}

/**
 * Formats distance with motorcycle-readable units
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Formats time in seconds to mm:ss
 */
export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Categorizes lean angle severity for adventure sport riding
 */
export function calculateLeanRating(angleDeg: number): {
  rating: 'Upright' | 'Moderate' | 'Spirited' | 'Aggressive' | 'Limit';
  color: string;
} {
  const abs = Math.abs(angleDeg);
  if (abs < 8) return { rating: 'Upright', color: 'text-slate-400' };
  if (abs < 22) return { rating: 'Moderate', color: 'text-cyan-400' };
  if (abs < 35) return { rating: 'Spirited', color: 'text-emerald-400' };
  if (abs < 45) return { rating: 'Aggressive', color: 'text-amber-400' };
  return { rating: 'Limit', color: 'text-rose-500' };
}

/**
 * Calculates motorcycle lean angle in degrees from phone motion sensors (DeviceOrientationEvent)
 * Clamps to realistic motorcycle physical lean range (-55° to +55°)
 */
export function calculateLeanFromDeviceOrientation(
  gamma: number | null,
  beta: number | null,
  screenMode: ScreenMode
): number {
  if (gamma === null && beta === null) return 0;
  // In portrait rally mode, phone is vertical: roll is primarily gamma
  // In landscape touring mode, roll is primarily beta
  let rawRoll = screenMode === 'portrait_rally' ? (gamma ?? 0) : (beta ?? 0);

  // Invert if needed for standard motorcycle orientation (negative = left, positive = right)
  const clamped = Math.max(-55, Math.min(55, Math.round(rawRoll)));
  return clamped;
}

/**
 * Generates turn-by-turn route info for any custom user-searched destination
 */
export function generateCustomRoute(query: string): RouteInfo {
  const cleanName = query.trim() || 'Custom Waypoint';
  const distanceKm = Math.round(15 + Math.random() * 45);
  const durationMins = Math.round(distanceKm * 1.35);

  return {
    destinationName: cleanName,
    totalDistanceKm: distanceKm,
    remainingDistanceKm: distanceKm,
    totalDurationMinutes: durationMins,
    remainingMinutes: durationMins,
    eta: '15:45',
    currentManeuver: {
      id: `custom-m-${Date.now()}`,
      type: 'turn-right',
      instruction: `Follow GPS navigation route towards ${cleanName}`,
      roadName: `En Route to ${cleanName}`,
      distanceMeters: 400,
      speedLimitKmH: 70
    },
    upcomingManeuvers: [
      {
        id: `custom-m-next`,
        type: 'straight',
        instruction: 'Continue on scenic touring pass',
        roadName: 'Main Regional Arterial',
        distanceMeters: 2800,
        speedLimitKmH: 80
      },
      {
        id: `custom-m-dest`,
        type: 'destination',
        instruction: `Arrive at destination: ${cleanName}`,
        roadName: cleanName,
        distanceMeters: distanceKm * 1000
      }
    ],
    elevationProfile: [1150, 1420, 1890, 2150],
    weatherCondition: 'Sunny'
  };
}

/**
 * Transforms Samsung Galaxy S23 (native 19.5:9 display) to match Kove 800X GT TFT
 * (either vertical 9:16 rally tower or 16:9 landscape cockpit)
 */
export function getSamsungS23AspectTransform(screenMode: ScreenMode) {
  if (screenMode === 'portrait_rally') {
    return {
      aspectClass: 'aspect-[9/16]',
      orientation: 'portrait',
      resolution: '720x1280',
      description: 'Vertical 7" TFT Rally Tower Mode'
    };
  }
  return {
    aspectClass: 'aspect-[16/9]',
    orientation: 'landscape',
    resolution: '1280x720',
    description: 'Horizontal 7" TFT GT Touring Mode'
  };
}

export const INITIAL_TELEMETRY: MotorcycleTelemetry = {
  speedKmH: 74,
  rpm: 5200,
  gear: 4,
  fuelLevelPercent: 78,
  fuelLiters: 14.8,
  fuelTankCapacityLiters: 19.0,
  instantConsumptionL100: 4.2,
  avgConsumptionL100: 4.4,
  distanceToEmptyKm: 336,
  estimatedRangeKm: 336,
  isLowFuelReserve: false,
  coolantTempC: 86,
  batteryVoltage: 14.2,
  ambientTempC: 22,
  odometerKm: 3420,
  tripAKm: 142.6,
  tripBKm: 48.2,
  tpmsFront: {
    pressureBar: 2.3,
    pressurePsi: 33.4,
    tempC: 28,
    isLow: false
  },
  tpmsRear: {
    pressureBar: 2.7,
    pressurePsi: 39.2,
    tempC: 32,
    isLow: false
  },
  leanAngle: 18,
  maxLeanLeft: 42,
  maxLeanRight: 44,
  rideMode: 'Touring',
  absMode: 'Road',
  tcsMode: 'Level 2',
  turnSignal: 'off',
  highBeam: false
};

export const SAMPLE_PLAYLIST: MusicTrack[] = [
  {
    id: 't1',
    title: 'Born to Be Wild',
    artist: 'Steppenwolf',
    album: 'Steppenwolf (Remastered)',
    albumArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    durationSeconds: 210,
    accentColor: '#10b981'
  },
  {
    id: 't2',
    title: 'Highway to Hell',
    artist: 'AC/DC',
    album: 'Highway to Hell',
    albumArtUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    durationSeconds: 208,
    accentColor: '#ef4444'
  },
  {
    id: 't3',
    title: 'Riders on the Storm',
    artist: 'The Doors',
    album: 'L.A. Woman',
    albumArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    durationSeconds: 434,
    accentColor: '#06b6d4'
  },
  {
    id: 't4',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    albumArtUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=80',
    durationSeconds: 243,
    accentColor: '#8b5cf6'
  }
];

export const SAMPLE_POIS: PointOfInterest[] = [
  {
    id: 'poi-1',
    name: 'Passo dello Stelvio (2,757m)',
    category: 'pass',
    distanceKm: 28.4,
    etaMinutes: 38,
    rating: 4.9,
    elevationMeters: 2757,
    coordinates: { x: 72, y: 22 },
    address: 'SS38 Stelvio Pass, Bormio / Prato',
    description: 'Iconic 48 hairpin bends mountain pass with legendary tarmac for sport touring.'
  },
  {
    id: 'poi-2',
    name: 'TotalEnergies 24/7 Moto Stop & High-Octane 98',
    category: 'fuel',
    distanceKm: 4.2,
    etaMinutes: 6,
    rating: 4.7,
    coordinates: { x: 38, y: 55 },
    address: 'Via Nazionale 142, Valfurva',
    description: 'Dedicated motorcycle tire air station, premium 98 RON fuel, visor cleaning station.'
  },
  {
    id: 'poi-3',
    name: 'Rifugio Alpino Moto Cafe & Espresso',
    category: 'cafe',
    distanceKm: 12.1,
    etaMinutes: 16,
    rating: 4.8,
    coordinates: { x: 58, y: 40 },
    address: 'Strada del Passo km 18',
    description: 'Panoramic terrace overlooking alpine switchbacks, fresh espresso & apple strudel.'
  },
  {
    id: 'poi-4',
    name: 'Glacier Panorama Viewpoint',
    category: 'scenic',
    distanceKm: 19.5,
    etaMinutes: 24,
    rating: 5.0,
    elevationMeters: 2210,
    coordinates: { x: 65, y: 28 },
    address: 'Tornante 34, Belvédère Ridge',
    description: 'Wide gravel pulloff with panoramic valley views. Perfect photo spot for the KOVE 800X GT.'
  },
  {
    id: 'poi-5',
    name: 'Alpine Moto Service & Tire Clinic',
    category: 'repair',
    distanceKm: 34.0,
    etaMinutes: 44,
    rating: 4.9,
    coordinates: { x: 20, y: 75 },
    address: 'Zona Industriale 8, Bormio',
    description: 'Adventure bike tire patching, chain lube, brake fluid, KOVE / KTM / Yamaha specialist.'
  }
];

export const DEFAULT_ROUTE: RouteInfo = {
  destinationName: 'Passo dello Stelvio Summit',
  totalDistanceKm: 28.4,
  remainingDistanceKm: 24.2,
  totalDurationMinutes: 38,
  remainingMinutes: 31,
  eta: '14:48',
  currentManeuver: {
    id: 'm1',
    type: 'sharp-right',
    instruction: 'Sharp right onto SS38 Switchback 14',
    roadName: 'SS38 Strada Statale dello Stelvio',
    distanceMeters: 350,
    speedLimitKmH: 60,
    laneInfo: 'Tight mountain hairpin'
  },
  upcomingManeuvers: [
    {
      id: 'm2',
      type: 'sharp-left',
      instruction: 'In 600m, hairpin left turn into switchback 15',
      roadName: 'SS38 Strada Statale dello Stelvio',
      distanceMeters: 950,
      speedLimitKmH: 50
    },
    {
      id: 'm3',
      type: 'straight',
      instruction: 'Continue straight along the alpine ridge',
      roadName: 'Alta Via Val Viola',
      distanceMeters: 4200,
      speedLimitKmH: 70
    },
    {
      id: 'm4',
      type: 'destination',
      instruction: 'Arrive at Passo dello Stelvio Summit (2,757m)',
      roadName: 'Cima Coppi Viewpoint',
      distanceMeters: 24200
    }
  ],
  elevationProfile: [1225, 1410, 1680, 1950, 2240, 2510, 2757],
  weatherCondition: 'Sunny'
};
