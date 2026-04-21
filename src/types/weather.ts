export interface WeatherCurrent {
  temperature: number;
  cloudCover: number; // percentage 0-100
  precipitation: number; // mm
  windSpeed: number; // km/h
  time: string; // ISO 8601
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  temperatureMax: number; // °C
  temperatureMin: number; // °C
  precipitationSum: number; // mm
  precipitationProbability: number; // percentage 0-100
  cloudCoverMean: number; // percentage 0-100
  weatherCode: number; // WMO code
}

export interface WeatherData {
  current: WeatherCurrent;
  daily: DailyForecast[];
  latitude: number;
  longitude: number;
  timezone: string;
}
