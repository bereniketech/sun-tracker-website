import { computeSunData } from "@/lib/sun";

function minutesBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60);
}

describe("computeSunData", () => {
  it("computes expected NYC summer-solstice values", () => {
    const nycLat = 40.7128;
    const nycLng = -74.006;
    const date = new Date("2025-06-21T16:00:00.000Z");

    const data = computeSunData(nycLat, nycLng, date);

    const expectedSunriseUtc = new Date("2025-06-21T09:25:00.000Z");
    const expectedSunsetUtc = new Date("2025-06-22T00:31:00.000Z");

    expect(minutesBetween(data.sunrise, expectedSunriseUtc)).toBeLessThanOrEqual(2);
    expect(minutesBetween(data.sunset, expectedSunsetUtc)).toBeLessThanOrEqual(2);

    expect(data.sunriseAzimuth).toBeGreaterThan(50);
    expect(data.sunriseAzimuth).toBeLessThan(60);
    expect(data.sunsetAzimuth).toBeGreaterThan(300);
    expect(data.sunsetAzimuth).toBeLessThan(310);
  });

  it("keeps shadow direction opposite to sun azimuth", () => {
    const data = computeSunData(51.5074, -0.1278, new Date("2025-10-01T12:00:00.000Z"));

    const expectedShadowDirection = (data.sunAzimuth + 180) % 360;
    const delta = Math.abs(data.shadowDirection - expectedShadowDirection);

    expect(delta).toBeLessThan(0.000001);
  });

  it("matches shadow length ratio formula for positive elevations", () => {
    const data = computeSunData(0.0, 0.0, new Date("2025-03-21T12:00:00.000Z"));

    if (data.sunElevation > 0) {
      const expected = 1 / Math.tan((data.sunElevation * Math.PI) / 180);
      expect(Math.abs(data.shadowLengthRatio - expected)).toBeLessThan(0.000001);
    } else {
      expect(data.shadowLengthRatio).toBe(Number.POSITIVE_INFINITY);
    }
  });

  it("returns sane values for Tromso during midnight-sun season", () => {
    const data = computeSunData(69.6492, 18.9553, new Date("2025-06-21T12:00:00.000Z"));

    expect(Number.isFinite(data.sunAzimuth)).toBe(true);
    expect(Number.isFinite(data.sunElevation)).toBe(true);
    expect(data.dayLength).toBeGreaterThanOrEqual(0);
    expect(data.dayLength).toBeLessThanOrEqual(24 * 60 * 60);
  });

  it("calculates day-length change relative to previous day", () => {
    const data = computeSunData(40.7128, -74.006, new Date("2025-12-20T12:00:00.000Z"));

    expect(Number.isFinite(data.dayLengthChange)).toBe(true);
    expect(data.dayLength).toBeGreaterThan(0);
  });

  it("produces valid golden and blue hour windows", () => {
    const data = computeSunData(34.0522, -118.2437, new Date("2025-08-10T15:00:00.000Z"));

    expect(data.goldenHour.start.getTime()).toBeLessThan(data.goldenHour.end.getTime());
    expect(data.goldenHourEvening.start.getTime()).toBeLessThan(
      data.goldenHourEvening.end.getTime(),
    );
    expect(data.blueHour.start.getTime()).toBeLessThan(data.blueHour.end.getTime());
    expect(data.blueHourEvening.start.getTime()).toBeLessThan(data.blueHourEvening.end.getTime());
  });
});