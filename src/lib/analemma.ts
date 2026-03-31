import SunCalc from "suncalc";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const OBLIQUITY_DEG = 23.4397;
const OBLIQUITY_RAD = OBLIQUITY_DEG * DEG_TO_RAD;
const J2000 = 2451545.0;

export interface AnalemmaPoint {
  dayOfYear: number;
  date: Date;
  equationOfTime: number;
  declination: number;
  azimuth: number;
  altitude: number;
  meanAnomaly: number;
  solarDistance: number;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function computeDeclination(dayOfYear: number): number {
  return (
    Math.asin(
      Math.sin(OBLIQUITY_RAD) * Math.sin((2 * Math.PI * (dayOfYear - 80)) / 365)
    ) * RAD_TO_DEG
  );
}

function computeMeanAnomaly(jd: number): number {
  return normalizeDegrees(357.529 + 0.98560028 * (jd - J2000));
}

function computeSolarDistance(meanAnomalyDeg: number): number {
  const m = meanAnomalyDeg * DEG_TO_RAD;
  return 1.00014 - 0.01671 * Math.cos(m) - 0.00014 * Math.cos(2 * m);
}

function computeEquationOfTime(solarNoon: Date, lng: number): number {
  const minutesFromMidnightUTC =
    solarNoon.getUTCHours() * 60 + solarNoon.getUTCMinutes() + solarNoon.getUTCSeconds() / 60;
  const lngOffsetMinutes = lng / 0.25;
  return minutesFromMidnightUTC - (12 * 60 + lngOffsetMinutes);
}

export function computeAnalemma(lat: number, lng: number, year: number): AnalemmaPoint[] {
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const points: AnalemmaPoint[] = [];

  for (let dayOfYear = 1; dayOfYear <= daysInYear; dayOfYear++) {
    // Pass noon UTC so SunCalc's Julian-day rounding doesn't roll back to the prior calendar day.
    const date = new Date(Date.UTC(year, 0, dayOfYear, 12, 0, 0));

    const times = SunCalc.getTimes(date, lat, lng);
    const solarNoon = times.solarNoon;

    const pos = SunCalc.getPosition(solarNoon, lat, lng);
    const azimuthDeg = normalizeDegrees((pos.azimuth * RAD_TO_DEG) + 180);
    const altitudeDeg = pos.altitude * RAD_TO_DEG;

    const jd = julianDay(solarNoon);
    const declination = computeDeclination(dayOfYear);
    const meanAnomaly = computeMeanAnomaly(jd);
    const solarDistance = computeSolarDistance(meanAnomaly);
    const equationOfTime = computeEquationOfTime(solarNoon, lng);

    points.push({
      dayOfYear,
      date: solarNoon,
      equationOfTime,
      declination,
      azimuth: azimuthDeg,
      altitude: altitudeDeg,
      meanAnomaly,
      solarDistance,
    });
  }

  return points;
}
