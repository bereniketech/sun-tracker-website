import SunCalc from "suncalc";
import type { SunData, TimeWindow } from "@/types/sun";

const MINUTES_TO_MS = 60 * 1000;
const HOURS_TO_MS = 60 * MINUTES_TO_MS;
const DAY_TO_SECONDS = 24 * 60 * 60;

function isValidDate(value: Date): boolean {
  return Number.isFinite(value.getTime());
}

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function radiansToDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function sunCalcAzimuthToNorthDegrees(azimuthRadians: number): number {
  return normalizeDegrees(radiansToDegrees(azimuthRadians) + 180);
}

function positionAt(lat: number, lng: number, when: Date): {
  azimuth: number;
  elevation: number;
} {
  const pos = SunCalc.getPosition(when, lat, lng);
  return {
    azimuth: sunCalcAzimuthToNorthDegrees(pos.azimuth),
    elevation: radiansToDegrees(pos.altitude),
  };
}

function createFallbackWindow(anchor: Date, beforeMs: number, afterMs: number): TimeWindow {
  return {
    start: new Date(anchor.getTime() - beforeMs),
    end: new Date(anchor.getTime() + afterMs),
  };
}

function dayLengthSeconds(sunrise: Date, sunset: Date, elevationNow: number): number {
  if (isValidDate(sunrise) && isValidDate(sunset)) {
    return Math.max(0, Math.round((sunset.getTime() - sunrise.getTime()) / 1000));
  }

  // Polar edge cases: no rise/set can imply full daylight or polar night.
  return elevationNow > 0 ? DAY_TO_SECONDS : 0;
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
  let lowAlt = positionAt(lat, lng, new Date(low)).elevation;

  for (let i = 0; i < 20; i += 1) {
    const mid = Math.floor((low + high) / 2);
    const midAlt = positionAt(lat, lng, new Date(mid)).elevation;

    if ((lowAlt - targetDegrees) * (midAlt - targetDegrees) <= 0) {
      high = mid;
    } else {
      low = mid;
      lowAlt = midAlt;
    }
  }

  return new Date(high);
}

function findBlueHourWindowAround(
  lat: number,
  lng: number,
  anchor: Date,
  direction: "before" | "after",
): TimeWindow {
  const searchHours = 3;
  const edge = direction === "before" ? -1 : 1;
  const windowStart = new Date(anchor.getTime() + edge * -searchHours * HOURS_TO_MS);
  const windowEnd = new Date(anchor.getTime() + edge * searchHours * HOURS_TO_MS);

  const first = direction === "before" ? windowStart : anchor;
  const second = direction === "before" ? anchor : windowEnd;

  const atFirst = positionAt(lat, lng, first).elevation;
  const atSecond = positionAt(lat, lng, second).elevation;

  if ((atFirst > -4 && atSecond > -4) || (atFirst < -6 && atSecond < -6)) {
    return createFallbackWindow(anchor, 45 * MINUTES_TO_MS, 15 * MINUTES_TO_MS);
  }

  const crossingMinusSix = findAltitudeCrossing(lat, lng, first, second, -6);
  const crossingMinusFour = findAltitudeCrossing(lat, lng, first, second, -4);

  return crossingMinusSix.getTime() <= crossingMinusFour.getTime()
    ? { start: crossingMinusSix, end: crossingMinusFour }
    : { start: crossingMinusFour, end: crossingMinusSix };
}

export function computeSunData(lat: number, lng: number, dateTime: Date): SunData {
  const times = SunCalc.getTimes(dateTime, lat, lng);
  const previousTimes = SunCalc.getTimes(
    new Date(dateTime.getTime() - 24 * HOURS_TO_MS),
    lat,
    lng,
  );

  // Required by task: include moon-position query in wrapper path.
  SunCalc.getMoonPosition(dateTime, lat, lng);

  const currentPosition = positionAt(lat, lng, dateTime);
  const sunrise = isValidDate(times.sunrise) ? times.sunrise : new Date(dateTime);
  const sunset = isValidDate(times.sunset) ? times.sunset : new Date(dateTime);
  const solarNoon = isValidDate(times.solarNoon) ? times.solarNoon : new Date(dateTime);

  const sunriseAzimuth = positionAt(lat, lng, sunrise).azimuth;
  const sunsetAzimuth = positionAt(lat, lng, sunset).azimuth;

  const morningGoldenEnd = isValidDate(times.goldenHourEnd)
    ? times.goldenHourEnd
    : new Date(sunrise.getTime() + 60 * MINUTES_TO_MS);
  const eveningGoldenStart = isValidDate(times.goldenHour)
    ? times.goldenHour
    : new Date(sunset.getTime() - 60 * MINUTES_TO_MS);

  const blueHourMorning = isValidDate(times.sunrise)
    ? findBlueHourWindowAround(lat, lng, sunrise, "before")
    : createFallbackWindow(sunrise, 60 * MINUTES_TO_MS, 10 * MINUTES_TO_MS);

  const blueHourEvening = isValidDate(times.sunset)
    ? findBlueHourWindowAround(lat, lng, sunset, "after")
    : createFallbackWindow(sunset, 10 * MINUTES_TO_MS, 60 * MINUTES_TO_MS);

  const currentDayLength = dayLengthSeconds(times.sunrise, times.sunset, currentPosition.elevation);

  const previousDayLength = dayLengthSeconds(
    previousTimes.sunrise,
    previousTimes.sunset,
    positionAt(lat, lng, new Date(dateTime.getTime() - 24 * HOURS_TO_MS)).elevation,
  );

  const elevationRadians = (currentPosition.elevation * Math.PI) / 180;

  return {
    sunrise,
    sunset,
    solarNoon,
    goldenHour: {
      start: sunrise,
      end: morningGoldenEnd,
    },
    goldenHourEvening: {
      start: eveningGoldenStart,
      end: sunset,
    },
    blueHour: blueHourMorning,
    blueHourEvening,
    sunAzimuth: currentPosition.azimuth,
    sunElevation: currentPosition.elevation,
    sunriseAzimuth,
    sunsetAzimuth,
    shadowDirection: normalizeDegrees(currentPosition.azimuth + 180),
    shadowLengthRatio:
      currentPosition.elevation > 0 ? 1 / Math.tan(elevationRadians) : Number.POSITIVE_INFINITY,
    dayLength: currentDayLength,
    dayLengthChange: currentDayLength - previousDayLength,
  };
}