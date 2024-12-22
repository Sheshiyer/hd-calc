export interface Location {
  lat: number;
  lng: number;
  timezone: string;
}

export interface BirthData {
  date: string;    // YYYY-MM-DD
  time: string;    // HH:mm:ss
  location: Location;
}

export interface HDProfile {
  type: string;
  authority: string;
  profile: number[];
  centers: Record<string, boolean>;
  gates: number[];
  channels: number[][];
  definition: string;
  incarnationCross: string;
  variables: string[];
}

export interface CalculationResponse {
  success: boolean;
  profile?: HDProfile;
  error?: string;
  cacheHit?: boolean;
}

export interface BatchCalculationRequest {
  profiles: BirthData[];
}

export interface BatchCalculationResponse {
  success: boolean;
  results: {
    birthData: BirthData;
    profile?: HDProfile;
    error?: string;
  }[];
}
