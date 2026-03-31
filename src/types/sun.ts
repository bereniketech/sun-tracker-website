import type { ComparisonLocation } from "@/types/comparison";

export type OverlayType =
  | "sunrise-line"
  | "sunset-line"
  | "sun-position"
  | "shadow"
  | "golden-hour-arc"
  | "blue-hour-arc"
  | "sun-path"
  | "landmark-alignment";

export interface Landmark {
  id: string;
  name: string;
  lat: number;
  lng: number;
  orientationAzimuth: number;
  location?: string;
  category?: "historic" | "technical" | "custom";
  imageGradient?: string;
}

export interface AlignmentEvent {
  id: string;
  landmarkId: string;
  landmarkName: string;
  eventTime: Date;
  matchType: "sunrise" | "sunset";
  matchedAzimuth: number;
  sunAzimuth: number;
  differenceDegrees: number;
}

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface SunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  goldenHour: TimeWindow;
  goldenHourEvening: TimeWindow;
  blueHour: TimeWindow;
  blueHourEvening: TimeWindow;
  sunAzimuth: number;
  sunElevation: number;
  sunriseAzimuth: number;
  sunsetAzimuth: number;
  shadowDirection: number;
  shadowLengthRatio: number;
  dayLength: number;
  dayLengthChange: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CalibrationState {
  focusOffset: number;
  exposureBias: number;
  captureRate: 5 | 10 | 30 | 60;
}

export interface SunTrackerState {
  location: Coordinates;
  locationName: string;
  dateTime: Date;
  isAnimating: boolean;
  sunData: SunData | null;
  comparisonLocations: ComparisonLocation[];
  activeOverlays: Set<OverlayType>;
  selectedLandmark: Landmark | null;
  photographerMode: boolean;
  isMobile: boolean;
  calibration: CalibrationState;
  setLocation: (lat: number, lng: number, name?: string) => void;
  setDateTime: (dateTime: Date) => void;
  setAnimating: (isAnimating: boolean) => void;
  addComparisonLocation: (loc: ComparisonLocation) => void;
  removeComparisonLocation: (index: number) => void;
  clearComparisonLocations: () => void;
  toggleOverlay: (overlay: OverlayType) => void;
  setSelectedLandmark: (landmark: Landmark | null) => void;
  togglePhotographerMode: () => void;
  setCalibration: (c: Partial<CalibrationState>) => void;
}