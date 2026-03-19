export interface MonthlySunSnapshot {
  month: number;
  monthLabel: string;
  sampleDateIso: string;
  sunriseIso: string;
  sunsetIso: string;
  solarNoonIso: string;
  goldenHourMorningStartIso: string;
  goldenHourMorningEndIso: string;
  goldenHourEveningStartIso: string;
  goldenHourEveningEndIso: string;
  blueHourMorningStartIso: string;
  blueHourMorningEndIso: string;
  blueHourEveningStartIso: string;
  blueHourEveningEndIso: string;
}

export interface CitySeed {
  slug: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface CityRecord extends CitySeed {
  id?: number;
  updated_at?: string;
  precomputed_data: MonthlySunSnapshot[];
}

export interface CityListItem {
  slug: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}
