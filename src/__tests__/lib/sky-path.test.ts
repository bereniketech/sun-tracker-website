import { computeSkyPath } from "@/lib/sky-path";

function getMaxElevation(elevations: number[]): number {
  return Math.max(...elevations);
}

describe("computeSkyPath", () => {
  it("returns 144 points by default for London on the summer solstice", () => {
    const result = computeSkyPath(51.5074, -0.1278, new Date("2025-06-21T12:00:00.000Z"));

    expect(result.points).toHaveLength(144);
    expect(getMaxElevation(result.points.map((point) => point.elevation))).toBeGreaterThan(60);
    expect(result.points.some((point) => point.isGolden)).toBe(true);
    expect(result.isPolarNight).toBe(false);
    expect(result.isMidnightSun).toBe(false);
  });

  it("marks Tromso in December as polar night", () => {
    const result = computeSkyPath(69.6492, 18.9553, new Date("2025-12-21T12:00:00.000Z"));

    expect(result.isPolarNight).toBe(true);
    expect(result.isMidnightSun).toBe(false);
    expect(result.points.every((point) => point.elevation <= 0)).toBe(true);
  });

  it("marks Tromso in June as midnight sun", () => {
    const result = computeSkyPath(69.6492, 18.9553, new Date("2025-06-21T12:00:00.000Z"));

    expect(result.isPolarNight).toBe(false);
    expect(result.isMidnightSun).toBe(true);
    expect(result.points.every((point) => point.elevation > 0)).toBe(true);
  });

  it("supports a custom interval of 30 minutes", () => {
    const result = computeSkyPath(51.5074, -0.1278, new Date("2025-06-21T12:00:00.000Z"), 30);

    expect(result.points).toHaveLength(48);
  });

  it("returns stable time ordering and new point objects", () => {
    const result = computeSkyPath(34.0522, -118.2437, new Date("2025-08-10T15:00:00.000Z"), 60);

    expect(result.points[0]?.time.getTime()).toBeLessThan(result.points[1]?.time.getTime() ?? 0);
    expect(result.points[0]).not.toBe(result.points[1]);
    expect(result.points.every((point) => Number.isFinite(point.azimuth))).toBe(true);
  });
});
