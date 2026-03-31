import { computeSunData } from "@/lib/sun";

export interface MonthlySnapshot {
  month: number;
  monthName: string;
  sunrise: Date;
  sunset: Date;
  goldenHourStart: Date;
  dayLengthSeconds: number;
  peakElevation: number;
}

const MONTH_NAMES: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const REFERENCE_DAY = 21;
const REFERENCE_HOUR = 12;

export function computeSeasonalData(lat: number, lng: number, year: number): MonthlySnapshot[] {
  return MONTH_NAMES.map((monthName, monthIndex) => {
    const referenceDate = new Date(year, monthIndex, REFERENCE_DAY, REFERENCE_HOUR, 0, 0);
    const sunData = computeSunData(lat, lng, referenceDate);

    return {
      month: monthIndex + 1,
      monthName,
      sunrise: sunData.sunrise,
      sunset: sunData.sunset,
      goldenHourStart: sunData.goldenHourEvening.start,
      dayLengthSeconds: sunData.dayLength,
      peakElevation: sunData.sunElevation,
    };
  });
}