import {
  formatCoordinatePair,
  formatPinnedLocationName,
} from "@/components/map/location-utils";

describe("location-utils", () => {
  it("formats coordinate pairs with hemisphere labels", () => {
    expect(formatCoordinatePair(40.7128, -74.006)).toBe("40.7128° N, 74.0060° W");
    expect(formatCoordinatePair(-33.8688, 151.2093)).toBe("33.8688° S, 151.2093° E");
  });

  it("creates a readable label for custom pinned locations", () => {
    expect(formatPinnedLocationName(12.34, -56.78)).toBe(
      "Pinned location 12.3400° N, 56.7800° W",
    );
  });
});