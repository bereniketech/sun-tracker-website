import { computeLightingInsight } from "@/lib/lighting-insight";
import type { SunData } from "@/types/sun";

function makeBase(overrides: Partial<SunData> = {}): SunData {
  const base = new Date("2025-06-21T12:00:00.000Z");
  const hour = 3600_000;
  return {
    sunrise: new Date(base.getTime() - 6 * hour),
    sunset: new Date(base.getTime() + 6 * hour),
    solarNoon: base,
    goldenHour: {
      start: new Date(base.getTime() - 7 * hour),
      end: new Date(base.getTime() - 6.5 * hour),
    },
    goldenHourEvening: {
      start: new Date(base.getTime() + 5.5 * hour),
      end: new Date(base.getTime() + 6 * hour),
    },
    blueHour: {
      start: new Date(base.getTime() - 7.5 * hour),
      end: new Date(base.getTime() - 7 * hour),
    },
    blueHourEvening: {
      start: new Date(base.getTime() + 6 * hour),
      end: new Date(base.getTime() + 6.5 * hour),
    },
    sunAzimuth: 180,
    sunElevation: 30,
    sunriseAzimuth: 60,
    sunsetAzimuth: 300,
    shadowDirection: 0,
    shadowLengthRatio: 1,
    dayLength: 12 * hour,
    dayLengthChange: 0,
    ...overrides,
  };
}

describe("computeLightingInsight", () => {
  // --- GOLDEN ---
  it("returns GOLDEN when dateTime is within morning golden hour", () => {
    const base = new Date("2025-06-21T12:00:00.000Z");
    const hour = 3600_000;
    const sunData = makeBase({ sunElevation: 50 }); // high elevation — golden should win
    const dateTime = new Date(base.getTime() - 6.75 * hour); // inside goldenHour window
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("GOLDEN");
  });

  it("returns GOLDEN when dateTime is within evening golden hour", () => {
    const base = new Date("2025-06-21T12:00:00.000Z");
    const hour = 3600_000;
    const sunData = makeBase({ sunElevation: 50 }); // GOLDEN beats HARSH
    const dateTime = new Date(base.getTime() + 5.75 * hour); // inside goldenHourEvening
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("GOLDEN");
  });

  it("GOLDEN takes priority over HARSH (high elevation during golden window)", () => {
    const base = new Date("2025-06-21T12:00:00.000Z");
    const hour = 3600_000;
    const sunData = makeBase({ sunElevation: 60 }); // would be HARSH without priority
    const dateTime = new Date(base.getTime() - 6.75 * hour);
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("GOLDEN");
  });

  // --- BLUE ---
  it("returns BLUE when dateTime is within morning blue hour", () => {
    const base = new Date("2025-06-21T12:00:00.000Z");
    const hour = 3600_000;
    const sunData = makeBase({ sunElevation: 3 });
    const dateTime = new Date(base.getTime() - 7.25 * hour); // inside blueHour
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("BLUE");
  });

  it("returns BLUE when dateTime is within evening blue hour", () => {
    const base = new Date("2025-06-21T12:00:00.000Z");
    const hour = 3600_000;
    const sunData = makeBase({ sunElevation: 3 });
    const dateTime = new Date(base.getTime() + 6.25 * hour); // inside blueHourEvening
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("BLUE");
  });

  // --- NIGHT ---
  it("returns NIGHT when sunElevation <= 0", () => {
    const sunData = makeBase({ sunElevation: 0 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z"); // outside all windows
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("NIGHT");
  });

  it("returns NIGHT when sunElevation is negative", () => {
    const sunData = makeBase({ sunElevation: -10 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z");
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("NIGHT");
  });

  // --- TWILIGHT ---
  it("returns TWILIGHT when sunElevation is between 0° exclusive and 6° inclusive", () => {
    const sunData = makeBase({ sunElevation: 3 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z"); // outside all windows
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("TWILIGHT");
  });

  it("returns TWILIGHT at boundary elevation 6°", () => {
    const sunData = makeBase({ sunElevation: 6 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z");
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("TWILIGHT");
  });

  // --- HARSH ---
  it("returns HARSH when sunElevation > 45", () => {
    const sunData = makeBase({ sunElevation: 60 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z"); // outside all windows
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("HARSH");
  });

  it("returns HARSH at boundary elevation 46°", () => {
    const sunData = makeBase({ sunElevation: 46 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z");
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("HARSH");
  });

  // --- SOFT ---
  it("returns SOFT when elevation is between 6° exclusive and 45° inclusive", () => {
    const sunData = makeBase({ sunElevation: 25 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z");
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("SOFT");
  });

  it("returns SOFT at boundary elevation 7°", () => {
    const sunData = makeBase({ sunElevation: 7 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z");
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("SOFT");
  });

  it("returns SOFT at boundary elevation 45°", () => {
    const sunData = makeBase({ sunElevation: 45 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z");
    const result = computeLightingInsight(sunData, dateTime);
    expect(result.label).toBe("SOFT");
  });

  // --- Shape of returned object ---
  it("always returns headline and at least 2 shotSuggestions", () => {
    const labels: Array<[number, string]> = [
      [-5, "2025-06-21T00:00:00.000Z"],
      [3, "2025-06-21T00:00:00.000Z"],
      [25, "2025-06-21T00:00:00.000Z"],
      [60, "2025-06-21T00:00:00.000Z"],
    ];
    for (const [elev, dt] of labels) {
      const sunData = makeBase({ sunElevation: elev });
      const result = computeLightingInsight(sunData, new Date(dt));
      expect(typeof result.headline).toBe("string");
      expect(result.headline.length).toBeGreaterThan(0);
      expect(result.shotSuggestions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("is pure: same inputs always return the same output", () => {
    const sunData = makeBase({ sunElevation: 30 });
    const dateTime = new Date("2025-06-21T00:00:00.000Z");
    const r1 = computeLightingInsight(sunData, dateTime);
    const r2 = computeLightingInsight(sunData, dateTime);
    expect(r1).toEqual(r2);
  });

  it("does not mutate sunData input", () => {
    const base = new Date("2025-06-21T12:00:00.000Z");
    const sunData = makeBase({ sunElevation: 30 });
    const before = JSON.stringify(sunData);
    computeLightingInsight(sunData, base);
    expect(JSON.stringify(sunData)).toBe(before);
  });
});
