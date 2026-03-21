import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { LANDMARKS } from "@/lib/landmarks";

describe("useSunTrackerStore", () => {
  beforeEach(() => {
    useSunTrackerStore.setState({
      location: null,
      locationName: "",
      dateTime: new Date("2025-06-21T12:00:00.000Z"),
      isAnimating: false,
      sunData: null,
      comparisonLocations: [],
      activeOverlays: new Set([
        "sun-position",
        "sunrise-line",
        "sunset-line",
        "shadow",
        "golden-hour-arc",
        "blue-hour-arc",
        "sun-path",
        "landmark-alignment",
      ]),
      selectedLandmark: null,
      photographerMode: false,
      isMobile: false,
    });
  });

  it("setLocation updates location and recomputes sunData", () => {
    const previous = useSunTrackerStore.getState();
    expect(previous.sunData).toBeNull();

    useSunTrackerStore.getState().setLocation(40.7128, -74.006, "New York");

    const next = useSunTrackerStore.getState();
    expect(next.location).toEqual({ lat: 40.7128, lng: -74.006 });
    expect(next.locationName).toBe("New York");
    expect(next.sunData).not.toBeNull();
  });

  it("setDateTime recomputes sunData when location exists", () => {
    useSunTrackerStore.getState().setLocation(40.7128, -74.006, "New York");
    const firstSunData = useSunTrackerStore.getState().sunData;

    useSunTrackerStore
      .getState()
      .setDateTime(new Date("2025-06-21T18:00:00.000Z"));

    const secondSunData = useSunTrackerStore.getState().sunData;

    expect(secondSunData).not.toBeNull();
    expect(firstSunData?.sunAzimuth).not.toBe(secondSunData?.sunAzimuth);
  });

  it("setAnimating updates animation state", () => {
    expect(useSunTrackerStore.getState().isAnimating).toBe(false);

    useSunTrackerStore.getState().setAnimating(true);
    expect(useSunTrackerStore.getState().isAnimating).toBe(true);

    useSunTrackerStore.getState().setAnimating(false);
    expect(useSunTrackerStore.getState().isAnimating).toBe(false);
  });

  it("toggleOverlay adds and removes overlay entries immutably", () => {
    const before = useSunTrackerStore.getState().activeOverlays;
    expect(before.has("blue-hour-arc")).toBe(true);

    useSunTrackerStore.getState().toggleOverlay("blue-hour-arc");
    const afterRemove = useSunTrackerStore.getState().activeOverlays;

    expect(afterRemove.has("blue-hour-arc")).toBe(false);
    expect(afterRemove).not.toBe(before);

    useSunTrackerStore.getState().toggleOverlay("blue-hour-arc");
    const afterAdd = useSunTrackerStore.getState().activeOverlays;

    expect(afterAdd.has("blue-hour-arc")).toBe(true);
  });

  it("togglePhotographerMode flips boolean state", () => {
    expect(useSunTrackerStore.getState().photographerMode).toBe(false);

    useSunTrackerStore.getState().togglePhotographerMode();
    expect(useSunTrackerStore.getState().photographerMode).toBe(true);

    useSunTrackerStore.getState().togglePhotographerMode();
    expect(useSunTrackerStore.getState().photographerMode).toBe(false);
  });

  it("setSelectedLandmark recenters the map and keeps the landmark in state", () => {
    const landmark = LANDMARKS[0];

    useSunTrackerStore.getState().setSelectedLandmark(landmark);

    const next = useSunTrackerStore.getState();
    expect(next.selectedLandmark).toEqual(landmark);
    expect(next.location).toEqual({ lat: landmark.lat, lng: landmark.lng });
    expect(next.locationName).toBe(landmark.name);
    expect(next.sunData).not.toBeNull();
  });

  it("addComparisonLocation adds up to 3 locations and ignores the fourth", () => {
    const store = useSunTrackerStore.getState();

    store.addComparisonLocation({ lat: 40.7128, lng: -74.006, name: "New York" });
    store.addComparisonLocation({ lat: 34.0522, lng: -118.2437, name: "Los Angeles" });
    store.addComparisonLocation({ lat: 51.5074, lng: -0.1278, name: "London" });
    store.addComparisonLocation({ lat: 35.6762, lng: 139.6503, name: "Tokyo" });

    const next = useSunTrackerStore.getState();
    expect(next.comparisonLocations).toHaveLength(3);
    expect(next.comparisonLocations.map((location) => location.name)).toEqual([
      "New York",
      "Los Angeles",
      "London",
    ]);
  });

  it("removeComparisonLocation removes the entry at the specified index", () => {
    const store = useSunTrackerStore.getState();

    store.addComparisonLocation({ lat: 40.7128, lng: -74.006, name: "New York" });
    store.addComparisonLocation({ lat: 34.0522, lng: -118.2437, name: "Los Angeles" });
    store.addComparisonLocation({ lat: 51.5074, lng: -0.1278, name: "London" });

    store.removeComparisonLocation(1);

    const next = useSunTrackerStore.getState();
    expect(next.comparisonLocations).toHaveLength(2);
    expect(next.comparisonLocations.map((location) => location.name)).toEqual([
      "New York",
      "London",
    ]);
  });

  it("clearComparisonLocations empties the comparison locations array", () => {
    const store = useSunTrackerStore.getState();

    store.addComparisonLocation({ lat: 40.7128, lng: -74.006, name: "New York" });
    store.addComparisonLocation({ lat: 34.0522, lng: -118.2437, name: "Los Angeles" });

    expect(useSunTrackerStore.getState().comparisonLocations).toHaveLength(2);

    store.clearComparisonLocations();

    expect(useSunTrackerStore.getState().comparisonLocations).toEqual([]);
  });
});