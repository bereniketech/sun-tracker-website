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
});