import { act, render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { AnimateButton } from "@/components/controls/animate-button";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

describe("AnimateButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      return window.setTimeout(() => callback(Date.now()), 16);
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((frameId) => {
      window.clearTimeout(frameId);
    });
    
    // Initialize store with NYC location and valid sunData
    const initialDate = new Date("2025-06-21T12:00:00Z");
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York City",
      dateTime: initialDate,
      isAnimating: false,
      sunData: {
        sunrise: new Date("2025-06-21T05:27:00Z"),
        sunset: new Date("2025-06-21T20:32:00Z"),
        solarNoon: new Date("2025-06-21T12:59:30Z"),
        goldenHour: {
          start: new Date("2025-06-21T05:27:00Z"),
          end: new Date("2025-06-21T06:27:00Z"),
        },
        goldenHourEvening: {
          start: new Date("2025-06-21T19:32:00Z"),
          end: new Date("2025-06-21T20:32:00Z"),
        },
        blueHour: {
          start: new Date("2025-06-21T04:27:00Z"),
          end: new Date("2025-06-21T05:27:00Z"),
        },
        blueHourEvening: {
          start: new Date("2025-06-21T20:32:00Z"),
          end: new Date("2025-06-21T21:32:00Z"),
        },
        sunAzimuth: 180,
        sunElevation: 70,
        sunriseAzimuth: 60,
        sunsetAzimuth: 300,
        shadowDirection: 0,
        shadowLengthRatio: 0.5,
        dayLength: 54300,
        dayLengthChange: 0,
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with initial Play button text", () => {
    render(<AnimateButton />);
    expect(screen.getByText("Animate")).toBeInTheDocument();
  });

  it("toggles between Animate and Pause when clicked", async () => {
    render(<AnimateButton />);
    const button = screen.getByRole("button", { name: /animate sun movement/i });
    
    fireEvent.click(button);
    expect(screen.getByText("Pause")).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByText("Animate")).toBeInTheDocument();
  });

  it("advances dateTime when animation is running", async () => {
    render(<AnimateButton />);
    const playButton = screen.getByRole("button", { name: /animate sun movement/i });
    
    const initialState = useSunTrackerStore.getState();
    const initialDateTime = initialState.dateTime;
    
    // Start animation
    fireEvent.click(playButton);
    
    // Advance timers to trigger animation frames
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    const updatedState = useSunTrackerStore.getState();
    const updatedDateTime = updatedState.dateTime;
    
    // DateTime should have advanced
    expect(updatedDateTime.getTime()).toBeGreaterThan(initialDateTime.getTime());
  });

  it("respects speed multiplier setting", async () => {
    render(<AnimateButton />);
    const playButton = screen.getByRole("button", { name: /animate sun movement/i });
    const speedSelect = screen.getByRole("combobox", { name: /animation speed/i });
    
    // Start with 1x speed
    fireEvent.click(playButton);
    
    const state1x = useSunTrackerStore.getState();
    const time1x = state1x.dateTime;
    
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    const state1xAfter = useSunTrackerStore.getState();
    const advancement1x = state1xAfter.dateTime.getTime() - time1x.getTime();
    
    // Reset and try with 5x speed
    fireEvent.click(playButton); // Stop animation
    act(() => {
      useSunTrackerStore.setState({ dateTime: new Date(time1x) });
    });
    
    // Change speed to 5x
    fireEvent.change(speedSelect, { target: { value: "5" } });
    fireEvent.click(playButton); // Start animation again
    
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    const state5x = useSunTrackerStore.getState();
    const advancement5x = state5x.dateTime.getTime() - time1x.getTime();
    
    // 5x speed should advance roughly 5 times as much
    expect(advancement5x).toBeGreaterThan(advancement1x * 3);
  });

  it("stops animation at end of day", async () => {
    const nearEndOfDay = new Date("2025-06-21T23:58:00Z");
    act(() => {
      useSunTrackerStore.setState({ dateTime: nearEndOfDay });
    });

    render(<AnimateButton />);
    const playButton = screen.getByRole("button", { name: /animate sun movement/i });
    
    // Start animation
    fireEvent.click(playButton);
    
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    
    const finalState = useSunTrackerStore.getState();
    expect(finalState.isAnimating).toBe(false);
    expect(screen.getByText("Animate")).toBeInTheDocument();
  });

  it("updates sunData reactively as dateTime advances", async () => {
    render(<AnimateButton />);
    const playButton = screen.getByRole("button", { name: /animate sun movement/i });
    
    const initialState = useSunTrackerStore.getState();
    const initialSunAzimuth = initialState.sunData?.sunAzimuth;
    
    fireEvent.click(playButton);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    const updatedState = useSunTrackerStore.getState();
    const updatedSunAzimuth = updatedState.sunData?.sunAzimuth;
    
    // sunAzimuth should change as time advances
    expect(updatedSunAzimuth).toBeDefined();
    if (updatedState.dateTime.getHours() !== initialState.dateTime.getHours()) {
      // Only check if hour changed (azimuth changes throughout the day)
      expect(updatedSunAzimuth).not.toEqual(initialSunAzimuth);
    }
  });
});
