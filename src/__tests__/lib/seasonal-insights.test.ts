import { computeSeasonalData } from "@/lib/seasonal-insights";

const LONDON_LAT = 51.5;
const LONDON_LNG = -0.12;
const REFERENCE_YEAR = 2024;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

describe("computeSeasonalData", () => {
  it("returns one monthly snapshot for each month of the year", () => {
    const result = computeSeasonalData(LONDON_LAT, LONDON_LNG, REFERENCE_YEAR);

    expect(result).toHaveLength(12);
    expect(result.map((entry) => entry.month)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(result.map((entry) => entry.monthName)).toEqual(MONTH_NAMES);
  });

  it("shows longer days in June than December for London", () => {
    const result = computeSeasonalData(LONDON_LAT, LONDON_LNG, REFERENCE_YEAR);
    const june = result[5];
    const december = result[11];

    expect(june.dayLengthSeconds).toBeGreaterThan(december.dayLengthSeconds);
  });

  it("makes December the shortest day-length snapshot in the set", () => {
    const result = computeSeasonalData(LONDON_LAT, LONDON_LNG, REFERENCE_YEAR);
    const december = result[11];

    expect(
      result.every((entry) => december.dayLengthSeconds <= entry.dayLengthSeconds),
    ).toBe(true);
  });

  it("shows higher noon elevation in summer than winter", () => {
    const result = computeSeasonalData(LONDON_LAT, LONDON_LNG, REFERENCE_YEAR);
    const june = result[5];
    const december = result[11];

    expect(june.peakElevation).toBeGreaterThan(december.peakElevation);
  });
});