import { act, render, screen } from "@testing-library/react";
import { PhotographerPanel } from "@/components/panels/photographer-panel";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

describe("task 8 photographer mode panel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-19T11:30:00.000Z"));

    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York",
      dateTime: new Date("2026-03-19T11:30:00.000Z"),
      isAnimating: false,
      sunData: {
        sunrise: new Date("2026-03-19T10:55:00.000Z"),
        sunset: new Date("2026-03-19T23:05:00.000Z"),
        solarNoon: new Date("2026-03-19T17:00:00.000Z"),
        goldenHour: {
          start: new Date("2026-03-19T11:00:00.000Z"),
          end: new Date("2026-03-19T12:00:00.000Z"),
        },
        goldenHourEvening: {
          start: new Date("2026-03-19T22:05:00.000Z"),
          end: new Date("2026-03-19T23:05:00.000Z"),
        },
        blueHour: {
          start: new Date("2026-03-19T10:30:00.000Z"),
          end: new Date("2026-03-19T11:00:00.000Z"),
        },
        blueHourEvening: {
          start: new Date("2026-03-19T23:05:00.000Z"),
          end: new Date("2026-03-19T23:35:00.000Z"),
        },
        sunAzimuth: 150,
        sunElevation: 45,
        sunriseAzimuth: 84,
        sunsetAzimuth: 276,
        shadowDirection: 330,
        shadowLengthRatio: 1,
        dayLength: 12 * 3600,
        dayLengthChange: 120,
      },
      activeOverlays: new Set([
        "sun-position",
        "sunrise-line",
        "sunset-line",
        "shadow",
        "golden-hour-arc",
        "blue-hour-arc",
        "sun-path",
      ]),
      photographerMode: true,
      isMobile: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders countdown blocks, direction indicator, and weekly forecast", () => {
    render(<PhotographerPanel />);

    expect(screen.getByText("Photographer Mode")).toBeInTheDocument();
    expect(screen.getAllByText("NOW")).toHaveLength(1);
    expect(screen.getByText("Golden Hour")).toBeInTheDocument();
    expect(screen.getByText("Blue Hour")).toBeInTheDocument();
    expect(screen.getByText("Best Direction")).toBeInTheDocument();
    expect(screen.getByText("7-Day Lighting Forecast")).toBeInTheDocument();
    expect(screen.getByText("Sunrise framing direction")).toBeInTheDocument();
    expect(screen.getByText(/Aim toward 84/)).toBeInTheDocument();
    expect(screen.getAllByText("Recommended").length).toBeGreaterThan(0);
  });

  it("updates countdown text as time advances", () => {
    render(<PhotographerPanel />);

    const before = screen.getByText(/Ends in/).textContent;

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const after = screen.getByText(/Ends in/).textContent;
    expect(after).not.toBe(before);
  });

  it("does not render when photographer mode is disabled", () => {
    useSunTrackerStore.setState((state) => ({
      ...state,
      photographerMode: false,
    }));

    render(<PhotographerPanel />);

    expect(screen.queryByText("7-Day Lighting Forecast")).not.toBeInTheDocument();
  });
});
