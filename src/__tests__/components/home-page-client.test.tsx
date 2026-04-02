import { act, render, screen } from "@testing-library/react";
import { HomePageClient } from "@/components/home-page-client";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const SUN_DATA_FIXTURE = {
  sunrise: new Date("2025-06-21T05:27:00Z"),
  sunset: new Date("2025-06-21T20:32:00Z"),
  solarNoon: new Date("2025-06-21T12:59:00Z"),
  goldenHour: {
    start: new Date("2025-06-21T04:50:00Z"),
    end: new Date("2025-06-21T05:50:00Z"),
  },
  goldenHourEvening: {
    start: new Date("2025-06-21T19:45:00Z"),
    end: new Date("2025-06-21T20:32:00Z"),
  },
  blueHour: {
    start: new Date("2025-06-21T04:20:00Z"),
    end: new Date("2025-06-21T04:50:00Z"),
  },
  blueHourEvening: {
    start: new Date("2025-06-21T20:32:00Z"),
    end: new Date("2025-06-21T21:00:00Z"),
  },
  sunAzimuth: 180,
  sunElevation: 70,
  sunriseAzimuth: 60,
  sunsetAzimuth: 300,
  shadowDirection: 0,
  shadowLengthRatio: 0.36,
  dayLength: 54300,
  dayLengthChange: 120,
};

vi.mock("@/components/map/interactive-map", () => ({
  InteractiveMap: () => <div data-testid="interactive-map">Mock Map</div>,
}));

vi.mock("@/components/panels/favorites-panel", () => ({
  FavoritesPanel: () => <div data-testid="favorites-panel" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("HomePageClient", () => {
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

  it("renders the homepage hero copy with solar metric cards", () => {
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York City",
      sunData: SUN_DATA_FIXTURE,
    });

    render(<HomePageClient />);

    expect(useSunTrackerStore.getState().location).toEqual({
      lat: 40.7128,
      lng: -74.006,
    });
    expect(useSunTrackerStore.getState().locationName).toBe("New York City");
    expect(screen.getByTestId("interactive-map")).toBeInTheDocument();
    expect(screen.getByText("REAL-TIME SUN TRACKER")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Track the Sun in Real Time" })).toBeInTheDocument();
    expect(screen.getByText("New York City")).toBeInTheDocument();
    expect(screen.getByText("SOLAR ZENITH")).toBeInTheDocument();
    expect(screen.getByText("AZIMUTH")).toBeInTheDocument();
    expect(screen.getByText("ELEVATION")).toBeInTheDocument();
    expect(screen.getByText("20.0°")).toBeInTheDocument();
    expect(screen.getByText("180.0°")).toBeInTheDocument();
    expect(screen.getByText("+70.0°")).toBeInTheDocument();
  });

  it("updates the location header and metric values when the store location changes", () => {
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York City",
      sunData: SUN_DATA_FIXTURE,
    });

    render(<HomePageClient />);

    act(() => {
      useSunTrackerStore.setState({
        location: { lat: 35.6762, lng: 139.6503 },
        locationName: "Tokyo",
        sunData: {
          ...SUN_DATA_FIXTURE,
          sunAzimuth: 91.2,
          sunElevation: 12.3,
        },
      });
    });

    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("35.6762° N, 139.6503° E")).toBeInTheDocument();
    expect(screen.getByText("77.7°")).toBeInTheDocument();
    expect(screen.getByText("91.2°")).toBeInTheDocument();
    expect(screen.getByText("+12.3°")).toBeInTheDocument();
    expect(screen.getByText("Offset toward E")).toBeInTheDocument();
  });
});