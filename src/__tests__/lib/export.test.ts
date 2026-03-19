import { generateSunDataRows, exportAsCSV, exportAsJSON } from "@/lib/export";

const NYC_LAT = 40.7128;
const NYC_LNG = -74.006;
const START_DATE = new Date("2026-03-19T00:00:00.000Z");

describe("generateSunDataRows", () => {
  it("returns the correct number of rows", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 7);
    expect(rows).toHaveLength(7);
  });

  it("first row date matches startDate", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 3);
    expect(rows[0].date).toBe("2026-03-19");
  });

  it("increments date by one day per row", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 3);
    expect(rows[1].date).toBe("2026-03-20");
    expect(rows[2].date).toBe("2026-03-21");
  });

  it("each row has valid sunrise ISO string", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 1);
    const sunrise = new Date(rows[0].sunrise);
    expect(Number.isFinite(sunrise.getTime())).toBe(true);
    // Sunrise for NYC in March should be roughly 10:00–11:30 UTC
    expect(sunrise.getUTCHours()).toBeGreaterThanOrEqual(9);
    expect(sunrise.getUTCHours()).toBeLessThanOrEqual(12);
  });

  it("dayLengthMinutes is a positive integer", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 1);
    expect(rows[0].dayLengthMinutes).toBeGreaterThan(0);
    expect(Number.isInteger(rows[0].dayLengthMinutes)).toBe(true);
  });

  it("sunAzimuthDeg and sunElevationDeg are finite numbers", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 1);
    expect(Number.isFinite(rows[0].sunAzimuthDeg)).toBe(true);
    expect(Number.isFinite(rows[0].sunElevationDeg)).toBe(true);
  });

  it("returns empty array for 0 days", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 0);
    expect(rows).toHaveLength(0);
  });
});

describe("exportAsCSV", () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURLSpy = vi.fn(() => "blob:test-csv");
    revokeObjectURLSpy = vi.fn();
    clickSpy = vi.fn();

    Object.defineProperty(window, "URL", {
      value: { createObjectURL: createObjectURLSpy, revokeObjectURL: revokeObjectURLSpy },
      writable: true,
    });

    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(clickSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls createObjectURL and triggers anchor click", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 1);
    exportAsCSV(rows, "test.csv");
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("revokes the object URL after download", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 1);
    exportAsCSV(rows, "test.csv");
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:test-csv");
  });
});

describe("exportAsJSON", () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURLSpy = vi.fn(() => "blob:test-json");
    revokeObjectURLSpy = vi.fn();
    clickSpy = vi.fn();

    Object.defineProperty(window, "URL", {
      value: { createObjectURL: createObjectURLSpy, revokeObjectURL: revokeObjectURLSpy },
      writable: true,
    });

    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(clickSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("triggers anchor click for JSON download", () => {
    const rows = generateSunDataRows(NYC_LAT, NYC_LNG, START_DATE, 1);
    exportAsJSON(rows, "test.json");
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
