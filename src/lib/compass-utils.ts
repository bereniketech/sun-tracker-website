/**
 * Normalize degrees to 0-360 range
 */
export function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

/**
 * Convert degrees to cardinal direction (N, NE, E, SE, S, SW, W, NW)
 */
export function cardinalDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const normalized = normalizeDegrees(degrees);
  const index = Math.round(normalized / 45) % directions.length;
  return directions[index] ?? 'N';
}

/**
 * Compute bearing from device heading to sun azimuth
 * bearing = (sunAzimuth - heading + 360) % 360
 */
export function computeBearingToSun(
  sunAzimuth: number,
  heading: number | null,
): number | null {
  if (heading === null) return null;
  const bearing = (sunAzimuth - heading + 360) % 360;
  return bearing;
}
