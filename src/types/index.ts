export type ScreenMode = 'portrait_rally' | 'landscape_touring';
export type ActiveTab = 'nav' | 'music' | 'comms' | 'telemetry' | 'settings';
export type RideMode = 'Touring' | 'Sport' | 'Eco' | 'Rally';
export type AbsMode = 'Road' | 'Off-Road' | 'ABS Off';
export type TcsMode = 'Level 3' | 'Level 2' | 'Level 1' | 'TCS Off';

export interface MotorcycleTelemetry {
  speedKmH: number;
  rpm: number;
  gear: number | 'N';
  fuelLevelPercent: number;
  fuelLiters: number;
  fuelTankCapacityLiters: number;
  instantConsumptionL100: number; // L/100km real-time rate
  avgConsumptionL100: number; // L/100km trip average
  distanceToEmptyKm: number; // Distance-to-empty (DTE) in km
  estimatedRangeKm: number; // alias for DTE
  isLowFuelReserve: boolean;
  coolantTempC: number;
  batteryVoltage: number;
  ambientTempC: number;
  odometerKm: number;
  tripAKm: number;
  tripBKm: number;
  tpmsFront: {
    pressureBar: number;
    pressurePsi: number;
    tempC: number;
    isLow: boolean;
  };
  tpmsRear: {
    pressureBar: number;
    pressurePsi: number;
    tempC: number;
    isLow: boolean;
  };
  leanAngle: number; // negative = left, positive = right
  maxLeanLeft: number;
  maxLeanRight: number;
  rideMode: RideMode;
  absMode: AbsMode;
  tcsMode: TcsMode;
  turnSignal: 'left' | 'right' | 'off' | 'hazard';
  highBeam: boolean;
}

export interface NavigationManeuver {
  id: string;
  type: 'turn-right' | 'turn-left' | 'sharp-right' | 'sharp-left' | 'slight-right' | 'slight-left' | 'roundabout' | 'straight' | 'u-turn' | 'destination';
  instruction: string;
  roadName: string;
  distanceMeters: number;
  laneInfo?: string;
  speedLimitKmH?: number;
}

export interface PointOfInterest {
  id: string;
  name: string;
  category: 'fuel' | 'pass' | 'cafe' | 'scenic' | 'repair';
  distanceKm: number;
  etaMinutes: number;
  rating: number;
  elevationMeters?: number;
  coordinates: { x: number; y: number }; // normalized 0-100 on map
  address: string;
  description: string;
}

export interface RouteInfo {
  destinationName: string;
  totalDistanceKm: number;
  remainingDistanceKm: number;
  totalDurationMinutes: number;
  remainingMinutes: number;
  eta: string;
  currentManeuver: NavigationManeuver;
  upcomingManeuvers: NavigationManeuver[];
  elevationProfile: number[]; // altitude in meters
  weatherCondition: 'Sunny' | 'Partly Cloudy' | 'Rain Alert' | 'Mountain Fog';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  durationSeconds: number;
  accentColor: string;
}

export interface AudioSystemState {
  currentTrack: MusicTrack;
  isPlaying: boolean;
  currentTimeSeconds: number;
  volumePercent: number;
  isMuted: boolean;
  repeatMode: 'off' | 'one' | 'all';
  shuffle: boolean;
  outputDevice: 'helmet_intercom' | 'kove_speakers' | 'phone_speaker';
  intercomModel: string;
}

export interface IncomingCall {
  id: string;
  callerName: string;
  phoneNumber: string;
  callerPhoto?: string;
  status: 'incoming' | 'active' | 'declined' | 'ended';
  durationSeconds: number;
  isMicMuted: boolean;
}

export interface IncomingMessage {
  id: string;
  sender: string;
  app: 'WhatsApp' | 'SMS' | 'Telegram';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface MirroringConnectionState {
  isConnected: boolean;
  isPairing: boolean;
  protocol: 'Samsung Smart View' | 'Kove MotoCast HD' | 'CarbitLink' | 'MotoPlay';
  s23Model: string;
  wifiSsid: string;
  wifiFrequencyGhz: number;
  wifiSignalDbm: number;
  bluetoothConnected: boolean;
  intercomConnected: boolean;
  aspectRatio: ScreenMode;
  phoneBatteryPercent: number;
  isPhoneCharging: boolean;
  phoneTempC: number;
  keepScreenAwake: boolean;
  batteryProtectLimit: boolean;
  autoConnectOnIgnition: boolean;
  voiceGuidanceEnabled: boolean;
  voiceGuidanceVolume: number;
}
