import { act, fireEvent, render, screen } from "@testing-library/react";
import { SharePanel } from "@/components/panels/share-panel";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const NYC_SUN_DATA = {
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
};

function setupStoreWithLocation() {
  useSunTrackerStore.setState({
    location: { lat: 40.7128, lng: -74.006 },
    locationName: "New York",
    dateTime: new Date("2026-03-19T12:00:00.000Z"),
    isAnimating: false,
    sunData: NYC_SUN_DATA,
    activeOverlays: new Set([
      "sun-position",
      "sunrise-line",
      "sunset-line",
      "shadow",
      "golden-hour-arc",
      "blue-hour-arc",
      "sun-path",
    ]),
    photographerMode: false,
    isMobile: false,
  });
}

function openPanel() {
  const toggle = screen.getByRole("button", { name: /share/i });
  fireEvent.click(toggle);
}

describe("SharePanel", () => {
  beforeEach(() => {
    setupStoreWithLocation();
    // Mock window.open
    vi.spyOn(window, "open").mockImplementation(() => null);
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a collapsed toggle button", () => {
    render(<SharePanel />);
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
  });

  it("expands and shows share buttons on toggle click", () => {
    render(<SharePanel />);
    openPanel();
    expect(screen.getByRole("button", { name: /copy.*link/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /facebook/i })).toBeInTheDocument();
  });

  it("shows CSV and JSON export buttons when a location is set", () => {
    render(<SharePanel />);
    openPanel();
    expect(screen.getByRole("button", { name: /csv/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /json/i })).toBeInTheDocument();
  });

  it("shows disabled state message when no location", () => {
    useSunTrackerStore.setState({ location: null });
    render(<SharePanel />);
    openPanel();
    expect(screen.getByText(/select a location/i)).toBeInTheDocument();
  });

  it("copy link button calls clipboard.writeText", async () => {
    render(<SharePanel />);
    openPanel();
    const copyBtn = screen.getByRole("button", { name: /copy.*link/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
  });

  it("shows 'Copied!' feedback after copying", async () => {
    render(<SharePanel />);
    openPanel();
    const copyBtn = screen.getByRole("button", { name: /copy.*link/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(screen.getByText(/copied/i)).toBeInTheDocument();
  });

  it("Twitter button opens window.open with twitter.com URL", () => {
    render(<SharePanel />);
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: /twitter/i }));
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("Facebook button opens window.open with facebook.com URL", () => {
    render(<SharePanel />);
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: /facebook/i }));
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("facebook.com"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("export range buttons change selected range", () => {
    render(<SharePanel />);
    openPanel();
    const btn14 = screen.getByRole("button", { name: "14d" });
    fireEvent.click(btn14);
    expect(btn14).toHaveAttribute("aria-pressed", "true");
  });
});
