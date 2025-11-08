// types/api.ts

export type TransportType = 'BUS' | 'GBAKA' | 'WORO_WORO' | 'TAXI' | 'MOTO_TAXI';
export type StopType = 'STATION' | 'BUS_STOP' | 'GBAKA_STOP' | 'TAXI_STAND';
export type ReportType = 
  | 'MISSING_STOP' 
  | 'INCORRECT_INFO' 
  | 'DAMAGE' 
  | 'SAFETY_ISSUE' 
  | 'NEW_LINE' 
  | 'SCHEDULE_CHANGE' 
  | 'DUPLICATE_STOP' 
  | 'OTHER';
export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';

// Arrêts
export interface Stop {
  id: string;
  osmId?: string;
  name: string;
  lat: number;
  lon: number;
  stopType: StopType;
  distance?: number;
  shelter?: boolean;
  bench?: boolean;
  wheelchair?: boolean;
  rating?: number;
  ratingCount?: number;
  gbaka?: boolean;
  woroworo?: boolean;
  taxi?: boolean;
  mototaxi?: boolean;
  verified?: boolean;
  lastUpdated?: string;
  lines?: TransportLine[];
}

// Lignes de transport
export interface TransportLine {
  id: string;
  name: string;
  shortName?: string;
  color: string;
  transportType: TransportType;
  operator?: string;
  fare?: number;
  active?: boolean;
  stopsCount?: number;
  stops?: Stop[];
}

// Itinéraires
export interface Route {
  distance: number;
  duration: number;
  geometry: GeoJSON.LineString;
  legs?: RouteLeg[];
  summary?: string;
}

export interface RouteLeg {
  distance: number;
  duration: number;
  summary: string;
  steps: RouteStep[];
}

export interface RouteStep {
  distance: number;
  duration: number;
  name: string;
  instruction: string;
}

// Suggestions de transport
export interface TransportSuggestion {
  mode: string;
  reason: string;
  priceRange: {
    min: number;
    max: number;
  };
  duration: number;
  distance: number;
  pros: string[];
  cons: string[];
  availability: 'high' | 'medium' | 'low';
  weatherScore: number;
  overallScore: number;
  advice?: string[];
  timeFactors?: string[];
  rank: number;
  nearbyStops?: {
    start: Stop[];
    end: Stop[];
  };
}

// Météo
export interface Weather {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  main: string;
  icon: string;
  isRaining: boolean;
  windSpeed: number;
  visibility: number;
  cloudCover: number;
}

export interface WeatherImpact {
  walkingScore: number;
  mototaxiScore: number;
  publicTransportScore: number;
  openTransportScore: number;
  recommendations: string[];
}

// Signalements
export interface Report {
  id: string;
  userId: string;
  stopId?: string;
  reportType: ReportType;
  title: string;
  description?: string;
  imageUrl?: string;
  lat?: number;
  lon?: number;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    displayName: string;
    email?: string;
  };
  stop?: Stop;
}

// Favoris
export interface Favorite {
  id: string;
  userId: string;
  stopId: string;
  createdAt: string;
  stop: Stop;
}

// Historique de recherche
export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  fromLat: number;
  fromLon: number;
  toLat: number;
  toLon: number;
  createdAt: string;
}

// Réponses API standard
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: any;
}

// Coordonnées
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}