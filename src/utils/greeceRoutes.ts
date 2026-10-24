import { PointOfInterest, RouteInfo } from '../types';

export interface GreeceRegion {
  id: string;
  name: string;
  greekName: string;
  center: { lat: number; lng: number };
  zoom: number;
  highlightPass: string;
  description: string;
}

export const GREECE_REGIONS: GreeceRegion[] = [
  {
    id: 'all_greece',
    name: 'All Greece (Overview)',
    greekName: 'Ελλάδα',
    center: { lat: 38.35, lng: 23.5 },
    zoom: 7,
    highlightPass: 'Full Greek National Road & Mountain Network',
    description: 'Complete Hellenic road network covering mainland passes, coastal highways, and islands.'
  },
  {
    id: 'pindus_meteora',
    name: 'Pindus Range & Meteora',
    greekName: 'Πίνδος & Μετέωρα',
    center: { lat: 39.75, lng: 21.35 },
    zoom: 10,
    highlightPass: 'Katara Pass (1,705m) & Metsovo Switchbacks',
    description: 'Greece\'s highest and most scenic motorcycle mountain pass through the northern Pindus spine.'
  },
  {
    id: 'athens_attica',
    name: 'Athens Riviera & Attica',
    greekName: 'Αθήνα & Αττική',
    center: { lat: 37.85, lng: 23.85 },
    zoom: 10,
    highlightPass: 'EO91 Athens Coastal Highway to Cape Sounion',
    description: 'Sweeping coastal asphalt tracing the Aegean sea to the ancient Temple of Poseidon.'
  },
  {
    id: 'peloponnese',
    name: 'Peloponnese & Taygetos',
    greekName: 'Πελοπόννησος & Ταΰγετος',
    center: { lat: 37.07, lng: 22.35 },
    zoom: 9,
    highlightPass: 'Langada Pass EO82 (Sparta - Kalamata Gorge)',
    description: 'Carved canyon switchbacks through Mt. Taygetos with dramatic cliff drops and pristine tarmac.'
  },
  {
    id: 'delphi_parnassus',
    name: 'Delphi & Mount Parnassus',
    greekName: 'Δελφοί & Παρνασσός',
    center: { lat: 38.5, lng: 22.55 },
    zoom: 10,
    highlightPass: 'Arachova to Delphi Alpine Curves (EO48)',
    description: 'Historic winding mountain road over the Gulf of Corinth and ancient sanctuary of Apollo.'
  },
  {
    id: 'olympus_macedonia',
    name: 'Mount Olympus & Macedonia',
    greekName: 'Όλυμπος & Μακεδονία',
    center: { lat: 40.1, lng: 22.45 },
    zoom: 10,
    highlightPass: 'Litochoro to Prionia Olympus Ascent',
    description: 'Dense beech forests and tight hairpins ascending the Mythological home of the Gods.'
  },
  {
    id: 'crete_island',
    name: 'Crete & White Mountains',
    greekName: 'Κρήτη & Λευκά Όρη',
    center: { lat: 35.35, lng: 24.3 },
    zoom: 9,
    highlightPass: 'Theriso Gorge & Omalos Plateau',
    description: 'Rugged Mediterranean canyons, mountain plateaus, and turquoise sea coastal roads.'
  }
];

export const GREECE_POIS: PointOfInterest[] = [
  {
    id: 'gr-pass-1',
    name: 'Katara Pass (Pindus Spine Summit 1,705m)',
    category: 'pass',
    distanceKm: 28.4,
    etaMinutes: 32,
    rating: 4.9,
    elevationMeters: 1705,
    coordinates: { x: 42, y: 35 },
    geoLat: 39.7891,
    geoLng: 21.2372,
    region: 'pindus_meteora',
    country: 'Greece',
    address: 'Old National Road 6, Metsovo / Katara, Epirus',
    description: 'The King of Greek motorcycle passes. 46 twisting kilometers connecting Epirus and Thessaly with epic alpine views.'
  },
  {
    id: 'gr-scenic-1',
    name: 'Meteora Monasteries Panoramic Lookouts',
    category: 'scenic',
    distanceKm: 46.2,
    etaMinutes: 48,
    rating: 5.0,
    elevationMeters: 550,
    coordinates: { x: 55, y: 38 },
    geoLat: 39.7217,
    geoLng: 21.6306,
    region: 'pindus_meteora',
    country: 'Greece',
    address: 'Meteora Ring Road, Kalabaka 422 00',
    description: 'UNESCO World Heritage giant sandstone pillars with monasteries perched high above twisting asphalt ribbons.'
  },
  {
    id: 'gr-pass-2',
    name: 'Taygetos Langada Gorge Pass (EO82)',
    category: 'pass',
    distanceKm: 58.2,
    etaMinutes: 55,
    rating: 4.9,
    elevationMeters: 1280,
    coordinates: { x: 45, y: 72 },
    geoLat: 37.0673,
    geoLng: 22.2841,
    region: 'peloponnese',
    country: 'Greece',
    address: 'EO82 Sparta - Kalamata National Road',
    description: 'One of the top riding roads in Southern Europe. Deep river canyons, rock tunnels, and 60 uninterrupted switchbacks.'
  },
  {
    id: 'gr-scenic-2',
    name: 'Cape Sounion & Temple of Poseidon',
    category: 'scenic',
    distanceKm: 64.0,
    etaMinutes: 52,
    rating: 4.8,
    elevationMeters: 65,
    coordinates: { x: 62, y: 65 },
    geoLat: 37.6501,
    geoLng: 24.0245,
    region: 'athens_attica',
    country: 'Greece',
    address: 'EO91 Athens - Sounion Coastal Blvd, Lavreotiki',
    description: 'Sunset coastal twisties ending at the dramatic cliffside temple overlooking the Aegean sea.'
  },
  {
    id: 'gr-pass-3',
    name: 'Mount Olympus Prionia Ascent',
    category: 'pass',
    distanceKm: 85.0,
    etaMinutes: 75,
    rating: 4.8,
    elevationMeters: 1100,
    coordinates: { x: 48, y: 25 },
    geoLat: 40.0844,
    geoLng: 22.4042,
    region: 'olympus_macedonia',
    country: 'Greece',
    address: 'Olympus National Park Road, Litochoro',
    description: 'Steep climb through pine and beech forests up to the final trailhead of Mt. Olympus (2,917m).'
  },
  {
    id: 'gr-pass-4',
    name: 'Delphi & Mount Parnassus Alpine Run',
    category: 'pass',
    distanceKm: 38.5,
    etaMinutes: 42,
    rating: 4.9,
    elevationMeters: 980,
    coordinates: { x: 48, y: 52 },
    geoLat: 38.4824,
    geoLng: 22.5010,
    region: 'delphi_parnassus',
    country: 'Greece',
    address: 'EO48 Livadeia - Amfissa Road, Delphi',
    description: 'High-speed sweeping turns flanked by Mount Parnassus ski slopes and ancient olive groves.'
  },
  {
    id: 'gr-scenic-3',
    name: 'Vikos Gorge & Papingo Switchbacks',
    category: 'scenic',
    distanceKm: 72.0,
    etaMinutes: 80,
    rating: 5.0,
    elevationMeters: 960,
    coordinates: { x: 32, y: 28 },
    geoLat: 39.9678,
    geoLng: 20.7225,
    region: 'pindus_meteora',
    country: 'Greece',
    address: 'Papingo Hairpin Road, Zagori 440 04',
    description: 'The deepest gorge in the world relative to its width. 14 tight switchbacks with cobblestone architecture.'
  },
  {
    id: 'gr-fuel-1',
    name: 'EKO 24/7 Racing 100 & Moto Service Point',
    category: 'fuel',
    distanceKm: 8.5,
    etaMinutes: 10,
    rating: 4.8,
    coordinates: { x: 50, y: 48 },
    geoLat: 38.8986,
    geoLng: 22.4339,
    region: 'all_greece',
    country: 'Greece',
    address: 'A1 / E75 Highway km 214, Lamia',
    description: 'Dedicated motorcycle lane, 100 Octane Racing fuel, visor cleaning squeegees, digital tire pressure station.'
  },
  {
    id: 'gr-fuel-2',
    name: 'Shell Hellas V-Power Racing Moto Hub',
    category: 'fuel',
    distanceKm: 14.2,
    etaMinutes: 15,
    rating: 4.7,
    coordinates: { x: 52, y: 62 },
    geoLat: 37.9385,
    geoLng: 22.9322,
    region: 'peloponnese',
    country: 'Greece',
    address: 'Olympia Odos km 84, Korinthos Interchange',
    description: 'Shell V-Power fuel, Cardo headset charging hub, espresso bar, free motorcycle parking.'
  },
  {
    id: 'gr-cafe-1',
    name: 'Metsovo Central Square Rider Cafe & Tsipouro',
    category: 'cafe',
    distanceKm: 19.8,
    etaMinutes: 22,
    rating: 4.9,
    elevationMeters: 1160,
    coordinates: { x: 40, y: 34 },
    geoLat: 39.7719,
    geoLng: 21.1833,
    region: 'pindus_meteora',
    country: 'Greece',
    address: 'Plateia Metsovou, Metsovo 442 00',
    description: 'Famous gathering square for Greek and European adventure riders under ancient plane trees.'
  },
  {
    id: 'gr-repair-1',
    name: 'MotoTouring Hellas & Tire Specialist',
    category: 'repair',
    distanceKm: 24.5,
    etaMinutes: 28,
    rating: 4.9,
    coordinates: { x: 58, y: 60 },
    geoLat: 37.9680,
    geoLng: 23.6980,
    region: 'athens_attica',
    country: 'Greece',
    address: 'Pireos 140, Tavros / Athens',
    description: 'Colove, KTM, BMW, Yamaha adventure bike repair. Metzeler / Pirelli dual-sport tire mounting & balancing.'
  }
];

export const GREECE_PRIMARY_ROUTE: RouteInfo = {
  destinationName: 'Katara Alpine Pass (Metsovo Summit 1,705m)',
  totalDistanceKm: 62.4,
  remainingDistanceKm: 48.6,
  totalDurationMinutes: 65,
  remainingMinutes: 48,
  eta: '15:24',
  currentManeuver: {
    id: 'gr-m1',
    type: 'sharp-right',
    instruction: 'Sharp right onto Old National Road 6 toward Katara Pass',
    roadName: 'EO6 Metsovo - Kalabaka Alpine Highway',
    distanceMeters: 450,
    speedLimitKmH: 60,
    laneInfo: 'Tight mountain hairpin 1 of 46'
  },
  upcomingManeuvers: [
    {
      id: 'gr-m2',
      type: 'sharp-left',
      instruction: 'Hairpin left turn into Switchback 4 through pine forest',
      roadName: 'EO6 Pindus Mountain Pass',
      distanceMeters: 800,
      speedLimitKmH: 50
    },
    {
      id: 'gr-m3',
      type: 'straight',
      instruction: 'Continue climbing on EO6 for 12.4 km toward summit cafe',
      roadName: 'EO6 Metsovo Pass',
      distanceMeters: 12400,
      speedLimitKmH: 70
    },
    {
      id: 'gr-m4',
      type: 'destination',
      instruction: 'Arrive at Katara Alpine Summit (1,705m Viewpoint)',
      roadName: 'Katara Pass Lookout',
      distanceMeters: 35000
    }
  ],
  elevationProfile: [1160, 1280, 1420, 1590, 1705],
  weatherCondition: 'Sunny'
};
