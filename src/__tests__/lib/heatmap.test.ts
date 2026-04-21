import { computeHeatmapPoints } from "@/lib/heatmap";

describe("computeHeatmapPoints", () => {
  it("computes non-empty point array for NYC", () => {
    const nycLat = 40.7128;
    const nycLng = -74.006;

    const points = computeHeatmapPoints(nycLat, nycLng);

    expect(points.length).toBeGreaterThan(4000);
  });

  it("returns array of [lat, lng, intensity] tuples", () => {
    const points = computeHeatmapPoints(0, 0);

    expect(points.length).toBeGreaterThan(0);

    points.forEach((point) => {
      expect(Array.isArray(point)).toBe(true);
      expect(point.length).toBe(3);
      expect(typeof point[0]).toBe("number");
      expect(typeof point[1]).toBe("number");
      expect(typeof point[2]).toBe("number");
    });
  });

  it("keeps latitudes within valid range of input latitude", () => {
    const nycLat = 40.7128;
    const nycLng = -74.006;
    const tolerance = 0.5; // degrees

    const points = computeHeatmapPoints(nycLat, nycLng);

    points.forEach((point) => {
      const [lat] = point;
      expect(Math.abs(lat - nycLat)).toBeLessThan(tolerance);
    });
  });

  it("keeps longitudes within valid range of input longitude", () => {
    const nycLat = 40.7128;
    const nycLng = -74.006;
    const tolerance = 0.5; // degrees

    const points = computeHeatmapPoints(nycLat, nycLng);

    points.forEach((point) => {
      const [, lng] = point;
      expect(Math.abs(lng - nycLng)).toBeLessThan(tolerance);
    });
  });

  it("generates intensity values in valid range [0, 1]", () => {
    const points = computeHeatmapPoints(51.5074, -0.1278);

    points.forEach((point) => {
      const [, , intensity] = point;
      expect(intensity).toBeGreaterThanOrEqual(0);
      expect(intensity).toBeLessThanOrEqual(1);
    });
  });

  it("produces valid point counts across different latitudes", () => {
    const equatorPoints = computeHeatmapPoints(0, 0);
    const tempPoints = computeHeatmapPoints(40, 0);
    const polarPoints = computeHeatmapPoints(80, 0);

    // All should have points (sun rises somewhere at any latitude)
    expect(equatorPoints.length).toBeGreaterThan(0);
    expect(tempPoints.length).toBeGreaterThan(0);
    expect(polarPoints.length).toBeGreaterThan(0);
  });

  it("computes consistent results for same location", () => {
    const lat = 35.6762;
    const lng = 139.6503;

    const points1 = computeHeatmapPoints(lat, lng);
    const points2 = computeHeatmapPoints(lat, lng);

    expect(points1.length).toBe(points2.length);
    points1.forEach((p1, i) => {
      const p2 = points2[i];
      expect(p1[0]).toBeCloseTo(p2[0], 8);
      expect(p1[1]).toBeCloseTo(p2[1], 8);
      expect(p1[2]).toBeCloseTo(p2[2], 8);
    });
  });
});
