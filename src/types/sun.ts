export type OverlayType =
  | "sunrise-line"
  | "sunset-line"
  | "sun-position"
  | "shadow"
  | "golden-hour-arc"
  | "blue-hour-arc"
  | "sun-path";

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

export interface SunTrackerState {
  location: Coordinates | null;
  locationName: string;
  dateTime: Date;
  isAnimating: boolean;
  sunData: SunData | null;
  activeOverlays: Set<OverlayType>;
  photographerMode: boolean;
  isMobile: boolean;
  setLocation: (lat: number, lng: number, name?: string) => void;
  setDateTime: (dateTime: Date) => void;
  setAnimating: (isAnimating: boolean) => void;
  toggleOverlay: (overlay: OverlayType) => void;
  togglePhotographerMode: () => void;
}