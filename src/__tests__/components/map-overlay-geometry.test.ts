import {
  createArcBand,
  createArcPoints,
  createRay,
  destinationPoint,
  normalizeAzimuth,
} from "@/components/map/overlay-geometry";

describe("overlay-geometry", () => {
  it("normalizes azimuths into 0-359 degrees", () => {
    expect(normalizeAzimuth(370)).toBe(10);
    expect(normalizeAzimuth(-15)).toBe(345);
  });

  it("computes destination point along a bearing", () => {
    const origin = { lat: 0, lng: 0 };
    const destination = destinationPoint(origin, 90, 1_000);

    expect(destination.lat).toBeGreaterThan(-0.001);
    expect(destination.lat).toBeLessThan(0.001);
    expect(destination.lng).toBeGreaterThan(0);
  });

  it("creates a ray with origin and destination", () => {
    const origin = { lat: 40.7128, lng: -74.006 };
    const [start, end] = createRay(origin, 45, 2_000);

    expect(start).toEqual(origin);
    expect(end).not.toEqual(origin);
  });

  it("creates arc points including start and end", () => {
    const points = createArcPoints({ lat: 40.7128, lng: -74.006 }, 60, 120, 1_000, 12);

    expect(points).toHaveLength(13);
    expect(points[0]).not.toEqual(points[points.length - 1]);
  });

  it("creates a closed arc band polygon point set", () => {
    const points = createArcBand({ lat: 40.7128, lng: -74.006 }, 80, 130, 1_000, 1_500, 10);

    expect(points.length).toBeGreaterThan(20);
  });
});
