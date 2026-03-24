import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Compass } from "@/components/compass/compass";
import { InfoPanel } from "@/components/panels/info-panel";
import { ShadowInfo } from "@/components/panels/shadow-info";
import { SunDataDisplay } from "@/components/panels/sun-data-display";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

describe("task 7 info panel components", () => {
  beforeEach(() => {
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York",
      dateTime: new Date("2026-03-19T12:00:00.000Z"),
      isAnimating: false,
      sunData: {
        sunrise: new Date("2026-03-19T11:00:00.000Z"),
        sunset: new Date("2026-03-19T23:15:00.000Z"),
        solarNoon: new Date("2026-03-19T17:00:00.000Z"),
        goldenHour: {
          start: new Date("2026-03-19T11:10:00.000Z"),
          end: new Date("2026-03-19T12:10:00.000Z"),
        },
        goldenHourEvening: {
          start: new Date("2026-03-19T22:15:00.000Z"),
          end: new Date("2026-03-19T23:15:00.000Z"),
        },
        blueHour: {
          start: new Date("2026-03-19T10:30:00.000Z"),
          end: new Date("2026-03-19T11:00:00.000Z"),
        },
        blueHourEvening: {
          start: new Date("2026-03-19T23:15:00.000Z"),
          end: new Date("2026-03-19T23:40:00.000Z"),
        },
        sunAzimuth: 165,
        sunElevation: 48,
        sunriseAzimuth: 82,
        sunsetAzimuth: 278,
        shadowDirection: 345,
        shadowLengthRatio: 0.9,
        dayLength: 12 * 3600 + 15 * 60,
        dayLengthChange: 135,
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
      photographerMode: false,
      isMobile: false,
    });
  });

  it("shows formatted sun data values", () => {
    render(<SunDataDisplay />);

    expect(screen.getByText("Sun Data")).toBeInTheDocument();
    expect(screen.getByText("Day length")).toBeInTheDocument();
    expect(screen.getByText("12h 15m")).toBeInTheDocument();
    expect(screen.getByText("Day length change")).toBeInTheDocument();
    expect(screen.getByText("+2m 15s")).toBeInTheDocument();
    expect(screen.getByText("Sun azimuth")).toBeInTheDocument();
    expect(screen.getByText("165°")).toBeInTheDocument();
    expect(screen.getByText("Sun elevation")).toBeInTheDocument();
    expect(screen.getByText("48°")).toBeInTheDocument();
  });

  it("renders compass with cardinal labels and marker legend", () => {
    render(<Compass />);

    expect(screen.getByLabelText("Sun direction compass")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();
    expect(screen.getByText("E")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("W")).toBeInTheDocument();
    expect(screen.getByText("82° E")).toBeInTheDocument();
    expect(screen.getByText("278° W")).toBeInTheDocument();
    expect(screen.getByText("165° S")).toBeInTheDocument();
    expect(screen.getByText("345° N")).toBeInTheDocument();
  });

  it("shows no shadow when sun is below the horizon", () => {
    useSunTrackerStore.setState((state) => ({
      sunData: state.sunData
        ? {
            ...state.sunData,
            sunElevation: -3,
            shadowLengthRatio: Number.POSITIVE_INFINITY,
          }
        : null,
    }));

    render(<ShadowInfo />);

    expect(screen.getByText("No shadow (sun below horizon)")).toBeInTheDocument();
  });

  it("collapses on mobile when toggle is pressed", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 375,
      configurable: true,
      writable: true,
    });

    render(<InfoPanel />);

    const toggleButton = screen.getByRole("button", { name: "Collapse" });
    fireEvent.click(toggleButton);

    expect(screen.getByRole("button", { name: "Expand" })).toBeInTheDocument();

    const panelContent = document.getElementById("sun-info-panel-content");
    expect(panelContent).toHaveClass("hidden");
  });

  it("toggles photographer mode from the panel toolbar", async () => {
    render(<InfoPanel />);

    const modeButton = screen.getByRole("button", { name: "Photographer Mode" });
    expect(modeButton).toBeInTheDocument();
    expect(modeButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(modeButton);

    expect(screen.getByRole("button", { name: "Photographer Mode" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(useSunTrackerStore.getState().photographerMode).toBe(true);
    
    // Wait for lazy-loaded PhotographerPanel to load
    await waitFor(() => {
      expect(screen.getByText("7-Day Lighting Forecast")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Sun direction compass")).toBeInTheDocument();
  });
});