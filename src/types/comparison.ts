export interface ComparisonLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface ComparisonSnapshot {
  location: ComparisonLocation;
  sunrise: Date;
  sunset: Date;
  goldenHourStart: Date;
  goldenHourEnd: Date;
  dayLengthSeconds: number;
  currentElevation: number;
}