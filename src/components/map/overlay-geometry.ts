import type { Coordinates } from "@/types/sun";

const EARTH_RADIUS_METERS = 6_371_000;

export function normalizeAzimuth(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

export function destinationPoint(
  origin: Coordinates,
  bearingDegrees: number,
  distanceMeters: number,
): Coordinates {
  const bearing = toRadians(normalizeAzimuth(bearingDegrees));
  const angularDistance = distanceMeters / EARTH_RADIUS_METERS;

  const lat1 = toRadians(origin.lat);
  const lng1 = toRadians(origin.lng);

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinAngularDistance = Math.sin(angularDistance);
  const cosAngularDistance = Math.cos(angularDistance);

  const lat2 = Math.asin(
    sinLat1 * cosAngularDistance + cosLat1 * sinAngularDistance * Math.cos(bearing),
  );

  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * sinAngularDistance * cosLat1,
      cosAngularDistance - sinLat1 * Math.sin(lat2),
    );

  return {
    lat: toDegrees(lat2),
    lng: normalizeLongitude(toDegrees(lng2)),
  };
}

function normalizeLongitude(value: number): number {
  if (value > 180) {
    return value - 360;
  }

  if (value < -180) {
    return value + 360;
  }

  return value;
}

export function createRay(
  origin: Coordinates,
  bearingDegrees: number,
  distanceMeters: number,
): [Coordinates, Coordinates] {
  return [origin, destinationPoint(origin, bearingDegrees, distanceMeters)];
}

function shortestSignedDelta(startDegrees: number, endDegrees: number): number {
  const raw = normalizeAzimuth(endDegrees) - normalizeAzimuth(startDegrees);

  if (raw > 180) {
    return raw - 360;
  }

  if (raw < -180) {
    return raw + 360;
  }

  return raw;
}

export function createArcPoints(
  origin: Coordinates,
  startDegrees: number,
  endDegrees: number,
  radiusMeters: number,
  segments = 24,
): Coordinates[] {
  const safeSegments = Math.max(2, segments);
  const delta = shortestSignedDelta(startDegrees, endDegrees);

  return Array.from({ length: safeSegments + 1 }, (_, index) => {
    const progress = index / safeSegments;
    const azimuth = normalizeAzimuth(startDegrees + delta * progress);
    return destinationPoint(origin, azimuth, radiusMeters);
  });
}

export function createArcBand(
  origin: Coordinates,
  startDegrees: number,
  endDegrees: number,
  innerRadiusMeters: number,
  outerRadiusMeters: number,
  segments = 24,
): Coordinates[] {
  const outer = createArcPoints(
    origin,
    startDegrees,
    endDegrees,
    outerRadiusMeters,
    segments,
  );

  const inner = createArcPoints(
    origin,
    endDegrees,
    startDegrees,
    innerRadiusMeters,
    segments,
  );

  return [...outer, ...inner];
}
