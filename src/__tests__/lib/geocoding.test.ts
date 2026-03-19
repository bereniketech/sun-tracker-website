import {
  createSearchCacheKey,
  isLatitude,
  isLongitude,
  mapNominatimSuggestions,
  normalizeSearchQuery,
  parseCoordinateInput,
} from "@/lib/geocoding";

describe("geocoding helpers", () => {
  it("normalizes search queries and cache keys consistently", () => {
    expect(normalizeSearchQuery("  New   York  ")).toBe("New York");
    expect(createSearchCacheKey("  New   York  ")).toBe("new york");
  });

  it("parses coordinate input and validates ranges", () => {
    expect(parseCoordinateInput("40.7128")).toBe(40.7128);
    expect(parseCoordinateInput("   ")).toBeNull();
    expect(parseCoordinateInput("abc")).toBeNull();
    expect(isLatitude(90)).toBe(true);
    expect(isLatitude(91)).toBe(false);
    expect(isLongitude(-180)).toBe(true);
    expect(isLongitude(-181)).toBe(false);
  });

  it("maps valid Nominatim records and skips invalid entries", () => {
    expect(
      mapNominatimSuggestions([
        {
          place_id: 123,
          name: "Paris",
          display_name: "Paris, Ile-de-France, France",
          lat: "48.8566",
          lon: "2.3522",
        },
        {
          place_id: 456,
          display_name: "Invalid place",
          lat: "not-a-number",
          lon: "2.3522",
        },
      ]),
    ).toEqual([
      {
        placeId: "123",
        name: "Paris",
        displayName: "Paris, Ile-de-France, France",
        lat: 48.8566,
        lng: 2.3522,
      },
    ]);
  });
});