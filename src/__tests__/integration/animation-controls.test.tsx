import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { AnimateButton } from "@/components/controls/animate-button";
import { TimeSlider } from "@/components/controls/time-slider";
import { NowButton } from "@/components/controls/now-button";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { computeSunData } from "@/lib/sun";

describe("Task 007 — Animation Controls Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Initialize store with NYC and valid sunData
    const initialDate = new Date("2025-06-21T12:00:00Z");
    const sunData = computeSunData(40.7128, -74.006, initialDate);

    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York City",
      dateTime: initialDate,
      isAnimating: false,
      sunData,
      comparisonLocations: [],
      activeOverlays: new Set([
        "sun-position",
        "sunrise-line",
        "sunset-line",
        "shadow",
        "golden-hour-arc",
        "blue-hour-arc",
        "sun-path",
      ]),
      selectedLandmark: null,
      photographerMode: false,
      isMobile: false,
    });
  });

  it("should advance dateTime when animation is playing", async () => {
    render(
      <>
        <TimeSlider />
        <AnimateButton />
      </>
    );

    const playButton = screen.getByRole("button", { name: /animate sun movement/i });
    const initialState = useSunTrackerStore.getState();
    const initialTime = initialState.dateTime;

    fireEvent.click(playButton);

    // Wait for animation to advance the time (should happen within 1000ms)
    await waitFor(
      () => {
        const currentState = useSunTrackerStore.getState();
        expect(currentState.dateTime.getTime()).toBeGreaterThan(initialTime.getTime());
      },
      { timeout: 1000 }
    );

    fireEvent.click(playButton); // Stop animation
  });

  it("should update time slider as animation advances", async () => {
    render(
      <>
        <TimeSlider />
        <AnimateButton />
      </>
    );

    const playButton = screen.getByRole("button", { name: /animate sun movement/i });
    const timeSlider = screen.getByRole("slider", { name: /time of day slider/i }) as HTMLInputElement;

    const initialValue = Number(timeSlider.value);

    fireEvent.click(playButton);

    // Wait for slider to advance
    await waitFor(
      () => {
        const currentValue = Number(
          screen.getByRole("slider", { name: /time of day slider/i }).getAttribute("value")
        );
        expect(currentValue).toBeGreaterThan(initialValue);
      },
      { timeout: 1000 }
    );

    fireEvent.click(playButton); // Stop animation
  });

  it("should stop animation and reset time with Now button", async () => {
    render(
      <>
        <AnimateButton />
        <NowButton />
      </>
    );

    const playButton = screen.getByRole("button", { name: /animate sun movement/i });
    const nowButton = screen.getByRole("button", { name: /now/i });

    fireEvent.click(playButton);

    // Wait for animation to advance
    await waitFor(
      () => {
        const state = useSunTrackerStore.getState();
        expect(state.isAnimating).toBe(true);
      },
      { timeout: 500 }
    );

    const beforeNow = new Date();
    fireEvent.click(nowButton);

    const afterNow = useSunTrackerStore.getState();

    expect(afterNow.isAnimating).toBe(false);

    // Time should be close to now
    const timeDiff = Math.abs(afterNow.dateTime.getTime() - beforeNow.getTime());
    expect(timeDiff).toBeLessThan(500);
  });

  it("should work from default NYC location on page load", () => {
    render(<AnimateButton />);

    const state = useSunTrackerStore.getState();
    expect(state.location).toEqual({ lat: 40.7128, lng: -74.006 });
    expect(state.locationName).toBe("New York City");
    expect(state.sunData).toBeDefined();
    expect(state.sunData?.sunAzimuth).toBeDefined();
  });

  it("should recompute sunData when dateTime changes", () => {
    const initialState = useSunTrackerStore.getState();
    const initialSunData = initialState.sunData;

    // Advance time by 2 hours
    const newDateTime = new Date(initialState.dateTime.getTime() + 2 * 60 * 60 * 1000);
    useSunTrackerStore.getState().setDateTime(newDateTime);

    const updatedState = useSunTrackerStore.getState();
    const updatedSunData = updatedState.sunData;

    expect(initialSunData).toBeDefined();
    expect(updatedSunData).toBeDefined();

    if (initialSunData && updatedSunData) {
      const azimuthDiff = Math.abs(updatedSunData.sunAzimuth - initialSunData.sunAzimuth);
      expect(azimuthDiff).toBeGreaterThan(10);
    }
  });
});
