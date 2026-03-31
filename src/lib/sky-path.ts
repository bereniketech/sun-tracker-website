import SunCalc from "suncalc";

const DEGREES_PER_RADIAN = 180 / Math.PI;
const MINUTES_PER_DAY = 24 * 60;
const MILLISECONDS_PER_MINUTE = 60 * 1000;
const DEFAULT_INTERVAL_MINUTES = 10;
const MIN_ELEVATION = -90;
const MAX_ELEVATION = 90;
const INVALID_DATE = new Date(Number.NaN);

type TimeWindowPair = [Date, Date];

export interface SkyPathPoint {
  time: Date;
  elevation: number;
  azimuth: number;
  isGolden: boolean;
  isBlue: boolean;
}

export interface SkyPathResult {
  points: SkyPathPoint[];
  isPolarNight: boolean;
  isMidnightSun: boolean;
}

function isValidDate(value: Date): boolean {
  return Number.isFinite(value.getTime());
}

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function radiansToDegrees(value: number): number {
  return value * DEGREES_PER_RADIAN;
}

function clampElevation(value: number): number {
  return Math.min(MAX_ELEVATION, Math.max(MIN_ELEVATION, value));
}

function sunCalcAzimuthToNorthDegrees(azimuthRadians: number): number {
  return normalizeDegrees(radiansToDegrees(azimuthRadians) + 180);
}

function isWithinWindow(time: Date, start: Date, end: Date): boolean {
  if (!isValidDate(start) || !isValidDate(end)) {
    return false;
  }

  const timestamp = time.getTime();
  return timestamp >= start.getTime() && timestamp <= end.getTime();
}

function hasAltitudeCrossing(startElevation: number, endElevation: number, targetDegrees: number): boolean {
  return (startElevation - targetDegrees) * (endElevation - targetDegrees) <= 0;
}

function positionAt(lat: number, lng: number, when: Date): { azimuth: number; elevation: number } {
  const position = SunCalc.getPosition(when, lat, lng);

  return {
    azimuth: sunCalcAzimuthToNorthDegrees(position.azimuth),
    elevation: clampElevation(radiansToDegrees(position.altitude)),
  };
}

function findAltitudeCrossing(
  lat: number,
  lng: number,
  start: Date,
  end: Date,
  targetDegrees: number,
): Date {
  let low = start.getTime();
  let high = end.getTime();
  let lowElevation = positionAt(lat, lng, new Date(low)).elevation;

  for (let iteration = 0; iteration < 20; iteration += 1) {
    const midpoint = Math.floor((low + high) / 2);
    const midpointElevation = positionAt(lat, lng, new Date(midpoint)).elevation;

    if (hasAltitudeCrossing(lowElevation, midpointElevation, targetDegrees)) {
      high = midpoint;
    } else {
      low = midpoint;
      lowElevation = midpointElevation;
    }
  }

  return new Date(high);
}

function getBlueHourWindows(
  lat: number,
  lng: number,
  times: SunCalc.GetTimesResult,
): { morning: TimeWindowPair; evening: TimeWindowPair } {
  const morningStart = times.dawn;
  const morningEnd = times.sunrise;
  const eveningStart = times.sunset;
  const eveningEnd = times.dusk;

  const morningWindow: TimeWindowPair =
    isValidDate(morningStart) &&
    isValidDate(morningEnd) &&
    hasAltitudeCrossing(
      positionAt(lat, lng, morningStart).elevation,
      positionAt(lat, lng, morningEnd).elevation,
      -4,
    )
      ? [morningStart, findAltitudeCrossing(lat, lng, morningStart, morningEnd, -4)]
      : [INVALID_DATE, INVALID_DATE];

  const eveningWindow: TimeWindowPair =
    isValidDate(eveningStart) &&
    isValidDate(eveningEnd) &&
    hasAltitudeCrossing(
      positionAt(lat, lng, eveningStart).elevation,
      positionAt(lat, lng, eveningEnd).elevation,
      -4,
    )
      ? [findAltitudeCrossing(lat, lng, eveningStart, eveningEnd, -4), eveningEnd]
      : [INVALID_DATE, INVALID_DATE];

  return {
    morning: morningWindow,
    evening: eveningWindow,
  };
}

function validateInterval(intervalMinutes: number): void {
  if (!Number.isFinite(intervalMinutes) || intervalMinutes <= 0) {
    throw new RangeError("intervalMinutes must be a positive number");
  }
}

export function computeSkyPath(
  lat: number,
  lng: number,
  date: Date,
  intervalMinutes: number = DEFAULT_INTERVAL_MINUTES,
): SkyPathResult {
  validateInterval(intervalMinutes);

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const times = SunCalc.getTimes(date, lat, lng);
  const blueHourWindows = getBlueHourWindows(lat, lng, times);
  const points: SkyPathPoint[] = [];

  for (let minuteOffset = 0; minuteOffset < MINUTES_PER_DAY; minuteOffset += intervalMinutes) {
    const time = new Date(startOfDay.getTime() + minuteOffset * MILLISECONDS_PER_MINUTE);
    const position = positionAt(lat, lng, time);

    const isGolden =
      isWithinWindow(time, times.sunrise, times.goldenHourEnd) ||
      isWithinWindow(time, times.goldenHour, times.sunset);

    const isBlue =
      isWithinWindow(time, blueHourWindows.morning[0], blueHourWindows.morning[1]) ||
      isWithinWindow(time, blueHourWindows.evening[0], blueHourWindows.evening[1]);

    points.push({
      time,
      elevation: position.elevation,
      azimuth: position.azimuth,
      isGolden,
      isBlue,
    });
  }

  return {
    points,
    isPolarNight: points.every((point) => point.elevation <= 0),
    isMidnightSun: points.every((point) => point.elevation > 0),
  };
}
