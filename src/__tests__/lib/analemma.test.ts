import { describe, it, expect } from "vitest";
import { computeAnalemma } from "@/lib/analemma";

const LONDON_LAT = 51.5074;
const LONDON_LNG = -0.1278;
const NON_LEAP_YEAR = 2025;
const LEAP_YEAR = 2024;

describe("computeAnalemma", () => {
  it("returns 365 points for a non-leap year", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    expect(points).toHaveLength(365);
  });

  it("returns 366 points for a leap year", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, LEAP_YEAR);
    expect(points).toHaveLength(366);
  });

  it("day numbers run from 1 to 365", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    expect(points[0].dayOfYear).toBe(1);
    expect(points[364].dayOfYear).toBe(365);
  });

  it("Summer Solstice (~day 172) declination is near +23.4°", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    const summerSolstice = points[171]; // day 172
    expect(summerSolstice.declination).toBeGreaterThan(23.0);
    expect(summerSolstice.declination).toBeLessThan(23.5);
  });

  it("Winter Solstice (~day 355) declination is near -23.4°", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    const winterSolstice = points[354]; // day 355
    expect(winterSolstice.declination).toBeLessThan(-23.0);
    expect(winterSolstice.declination).toBeGreaterThan(-23.5);
  });

  it("Vernal Equinox (~day 80) declination is near 0°", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    const vernalEquinox = points[79]; // day 80
    expect(Math.abs(vernalEquinox.declination)).toBeLessThan(1.5);
  });

  it("all azimuths are in range 0–360", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    for (const point of points) {
      expect(point.azimuth).toBeGreaterThanOrEqual(0);
      expect(point.azimuth).toBeLessThanOrEqual(360);
    }
  });

  it("all altitudes are within valid range for London latitude", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    for (const point of points) {
      // At solar noon in London, altitude must be between 0 and 90
      expect(point.altitude).toBeGreaterThanOrEqual(0);
      expect(point.altitude).toBeLessThanOrEqual(90);
    }
  });

  it("solar distance is approximately 0.983–1.017 AU", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    for (const point of points) {
      expect(point.solarDistance).toBeGreaterThan(0.98);
      expect(point.solarDistance).toBeLessThan(1.02);
    }
  });

  it("mean anomaly is in range 0–360", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    for (const point of points) {
      expect(point.meanAnomaly).toBeGreaterThanOrEqual(0);
      expect(point.meanAnomaly).toBeLessThan(360);
    }
  });

  it("each point's date corresponds to the correct year", () => {
    const points = computeAnalemma(LONDON_LAT, LONDON_LNG, NON_LEAP_YEAR);
    for (const point of points) {
      expect(point.date.getUTCFullYear()).toBe(NON_LEAP_YEAR);
    }
  });

  it("equatorial location produces noon altitude close to 90° at equinox", () => {
    const equatorialLat = 0;
    const equatorialLng = 0;
    const points = computeAnalemma(equatorialLat, equatorialLng, NON_LEAP_YEAR);
    const vernalEquinox = points[79]; // day 80
    expect(vernalEquinox.altitude).toBeGreaterThan(85);
  });
});
