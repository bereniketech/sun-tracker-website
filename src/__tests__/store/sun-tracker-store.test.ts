import { useSunTrackerStore } from "@/store/sun-tracker-store";

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
        "sun-path",
      ]),
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

  it("toggleOverlay adds and removes overlay entries immutably", () => {
    const before = useSunTrackerStore.getState().activeOverlays;
    expect(before.has("blue-hour-arc")).toBe(false);

    useSunTrackerStore.getState().toggleOverlay("blue-hour-arc");
    const afterAdd = useSunTrackerStore.getState().activeOverlays;

    expect(afterAdd.has("blue-hour-arc")).toBe(true);
    expect(afterAdd).not.toBe(before);

    useSunTrackerStore.getState().toggleOverlay("blue-hour-arc");
    const afterRemove = useSunTrackerStore.getState().activeOverlays;

    expect(afterRemove.has("blue-hour-arc")).toBe(false);
  });

  it("togglePhotographerMode flips boolean state", () => {
    expect(useSunTrackerStore.getState().photographerMode).toBe(false);

    useSunTrackerStore.getState().togglePhotographerMode();
    expect(useSunTrackerStore.getState().photographerMode).toBe(true);

    useSunTrackerStore.getState().togglePhotographerMode();
    expect(useSunTrackerStore.getState().photographerMode).toBe(false);
  });
});