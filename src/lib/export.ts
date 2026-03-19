import { computeSunData } from "@/lib/sun";

export interface SunExportRow {
  date: string;
  sunrise: string;
  sunset: string;
  solarNoon: string;
  goldenHourMorningStart: string;
  goldenHourMorningEnd: string;
  goldenHourEveningStart: string;
  goldenHourEveningEnd: string;
  blueHourMorningStart: string;
  blueHourMorningEnd: string;
  blueHourEveningStart: string;
  blueHourEveningEnd: string;
  dayLengthMinutes: number;
  sunAzimuthDeg: number;
  sunElevationDeg: number;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function isoTime(d: Date): string {
  return d.toISOString();
}

/**
 * Compute one SunExportRow per day for `days` days starting from `startDate`.
 * Sun position columns are sampled at solar noon.
 */
export function generateSunDataRows(
  lat: number,
  lng: number,
  startDate: Date,
  days: number,
): SunExportRow[] {
  const rows: SunExportRow[] = [];

  for (let i = 0; i < days; i++) {
    const day = addDays(startDate, i);
    const noon = new Date(day);
    noon.setHours(12, 0, 0, 0);

    const data = computeSunData(lat, lng, noon);

    rows.push({
      date: day.toISOString().slice(0, 10),
      sunrise: isoTime(data.sunrise),
      sunset: isoTime(data.sunset),
      solarNoon: isoTime(data.solarNoon),
      goldenHourMorningStart: isoTime(data.goldenHour.start),
      goldenHourMorningEnd: isoTime(data.goldenHour.end),
      goldenHourEveningStart: isoTime(data.goldenHourEvening.start),
      goldenHourEveningEnd: isoTime(data.goldenHourEvening.end),
      blueHourMorningStart: isoTime(data.blueHour.start),
      blueHourMorningEnd: isoTime(data.blueHour.end),
      blueHourEveningStart: isoTime(data.blueHourEvening.start),
      blueHourEveningEnd: isoTime(data.blueHourEvening.end),
      dayLengthMinutes: Math.round(data.dayLength / 60),
      sunAzimuthDeg: Math.round(data.sunAzimuth * 10) / 10,
      sunElevationDeg: Math.round(data.sunElevation * 10) / 10,
    });
  }

  return rows;
}

const CSV_HEADERS = [
  "Date",
  "Sunrise (UTC)",
  "Sunset (UTC)",
  "Solar Noon (UTC)",
  "Golden Hour Morning Start",
  "Golden Hour Morning End",
  "Golden Hour Evening Start",
  "Golden Hour Evening End",
  "Blue Hour Morning Start",
  "Blue Hour Morning End",
  "Blue Hour Evening Start",
  "Blue Hour Evening End",
  "Day Length (min)",
  "Sun Azimuth (°)",
  "Sun Elevation (°)",
];

function escapeCell(value: string | number): string {
  const str = String(value);
  // Escape double-quotes by doubling them, then wrap in quotes
  return `"${str.replace(/"/g, '""')}"`;
}

function rowToCSVLine(row: SunExportRow): string {
  return [
    row.date,
    row.sunrise,
    row.sunset,
    row.solarNoon,
    row.goldenHourMorningStart,
    row.goldenHourMorningEnd,
    row.goldenHourEveningStart,
    row.goldenHourEveningEnd,
    row.blueHourMorningStart,
    row.blueHourMorningEnd,
    row.blueHourEveningStart,
    row.blueHourEveningEnd,
    row.dayLengthMinutes,
    row.sunAzimuthDeg,
    row.sunElevationDeg,
  ]
    .map(escapeCell)
    .join(",");
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportAsCSV(rows: SunExportRow[], filename: string): void {
  const lines = [CSV_HEADERS.join(","), ...rows.map(rowToCSVLine)];
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, filename);
}

export function exportAsJSON(rows: SunExportRow[], filename: string): void {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, filename);
}
