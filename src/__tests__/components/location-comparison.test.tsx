import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InfoPanel } from "@/components/panels/info-panel";
import { LocationComparison } from "@/components/panels/location-comparison";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

function formatExpectedTime(value: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

vi.mock("@/components/search-bar", () => ({
  SearchBar: ({ onLocationSelect }: { onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void }) => (
    <button
      type="button"
      onClick={() =>
        onLocationSelect?.({
          lat: 51.5074,
          lng: -0.1278,
          name: "London",
        })
      }
    >
      Add location
    </button>
  ),
}));

vi.mock("@/lib/sun", () => ({
  computeSunData: vi.fn((lat: number, lng: number, dateTime: Date) => ({
    sunrise: new Date(dateTime.getTime() + Math.round(lat + lng) * 60000),
    sunset: new Date(dateTime.getTime() + 8 * 60 * 60000),
    solarNoon: new Date(dateTime.getTime() + 4 * 60 * 60000),
    goldenHour: {
      start: new Date(dateTime.getTime() + 30 * 60000),
      end: new Date(dateTime.getTime() + 90 * 60000),
    },
    goldenHourEvening: {
      start: new Date(dateTime.getTime() + 7 * 60 * 60000),
      end: new Date(dateTime.getTime() + 8 * 60 * 60000),
    },
    blueHour: {
      start: new Date(dateTime.getTime()),
      end: new Date(dateTime.getTime() + 15 * 60000),
    },
    blueHourEvening: {
      start: new Date(dateTime.getTime() + 8 * 60 * 60000),
      end: new Date(dateTime.getTime() + 8 * 60 * 60000 + 15 * 60000),
    },
    sunAzimuth: 165,
    sunElevation: lat / 2,
    sunriseAzimuth: 82,
    sunsetAzimuth: 278,
    shadowDirection: 345,
    shadowLengthRatio: 0.9,
    dayLength: 12 * 3600,
    dayLengthChange: 120,
  })),
}));

describe("LocationComparison", () => {
  beforeEach(() => {
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York",
      dateTime: new Date("2026-03-21T12:00:00.000Z"),
      isAnimating: false,
      sunData: {
        sunrise: new Date("2026-03-21T11:00:00.000Z"),
        sunset: new Date("2026-03-21T23:00:00.000Z"),
        solarNoon: new Date("2026-03-21T17:00:00.000Z"),
        goldenHour: {
          start: new Date("2026-03-21T11:10:00.000Z"),
          end: new Date("2026-03-21T12:10:00.000Z"),
        },
        goldenHourEvening: {
          start: new Date("2026-03-21T22:00:00.000Z"),
          end: new Date("2026-03-21T23:00:00.000Z"),
        },
        blueHour: {
          start: new Date("2026-03-21T10:30:00.000Z"),
          end: new Date("2026-03-21T11:00:00.000Z"),
        },
        blueHourEvening: {
          start: new Date("2026-03-21T23:00:00.000Z"),
          end: new Date("2026-03-21T23:30:00.000Z"),
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

    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not render when closed", () => {
    render(<LocationComparison isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog", { name: "Compare Locations" })).not.toBeInTheDocument();
  });

  it("shows the placeholder when fewer than two locations are selected", () => {
    render(<LocationComparison isOpen={true} onClose={vi.fn()} />);

    expect(
      screen.getByText(/add at least 2 locations to compare sunrise, golden hour, and elevation side by side/i),
    ).toBeInTheDocument();
  });

  it("renders a column for each selected location", () => {
    useSunTrackerStore.setState({
      comparisonLocations: [
        { lat: 40.7128, lng: -74.006, name: "New York" },
        { lat: 34.0522, lng: -118.2437, name: "Los Angeles" },
      ],
    });

    render(<LocationComparison isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole("article", { name: /comparison snapshot for new york/i })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: /comparison snapshot for los angeles/i })).toBeInTheDocument();
    expect(screen.getAllByText("Sunrise")).toHaveLength(2);
    expect(screen.getAllByText("Golden hour end")).toHaveLength(2);
  });

  it("adds locations through the reusable SearchBar callback until the store cap", () => {
    render(<LocationComparison isOpen={true} onClose={vi.fn()} />);

    const addButton = screen.getByRole("button", { name: "Add location" });

    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(useSunTrackerStore.getState().comparisonLocations).toHaveLength(3);
  });

  it("calls onClose when the close button is pressed", () => {
    const onClose = vi.fn();

    render(<LocationComparison isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("recomputes snapshot content when the date changes", async () => {
    useSunTrackerStore.setState({
      comparisonLocations: [{ lat: 40.7128, lng: -74.006, name: "New York" }],
    });

    const firstDateTime = new Date("2026-03-21T12:00:00.000Z");
    const secondDateTime = new Date("2026-03-21T13:00:00.000Z");
    const expectedFirstSunrise = formatExpectedTime(
      new Date(firstDateTime.getTime() + Math.round(40.7128 - 74.006) * 60000),
    );
    const expectedSecondSunrise = formatExpectedTime(
      new Date(secondDateTime.getTime() + Math.round(40.7128 - 74.006) * 60000),
    );

    render(<LocationComparison isOpen={true} onClose={vi.fn()} />);

    const originalSunrise = screen.getByText(expectedFirstSunrise);
    expect(originalSunrise).toBeInTheDocument();

    useSunTrackerStore.setState({
      dateTime: secondDateTime,
    });

    await waitFor(() => {
      expect(screen.getByText(expectedSecondSunrise)).toBeInTheDocument();
    });
  });

  it("opens from the InfoPanel compare button", () => {
    render(<InfoPanel />);

    fireEvent.click(screen.getByRole("button", { name: "Compare" }));

    expect(screen.getByRole("dialog", { name: "Compare Locations" })).toBeInTheDocument();
  });
});