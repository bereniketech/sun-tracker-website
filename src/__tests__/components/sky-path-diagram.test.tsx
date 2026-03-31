import { render, screen } from "@testing-library/react";
import { InfoPanel } from "@/components/panels/info-panel";
import { SkyPathDiagram } from "@/components/panels/sky-path-diagram";
import * as skyPathModule from "@/lib/sky-path";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

vi.mock("@/lib/sky-path", async () => {
  const actual = await vi.importActual<typeof import("@/lib/sky-path")>("@/lib/sky-path");

  return {
    ...actual,
    computeSkyPath: vi.fn(),
  };
});

const computeSkyPathMock = vi.mocked(skyPathModule.computeSkyPath);

describe("SkyPathDiagram", () => {
  beforeEach(() => {
    computeSkyPathMock.mockReset();
    useSunTrackerStore.setState({
      location: { lat: 51.5072, lng: -0.1276 },
      locationName: "London",
      dateTime: new Date("2026-06-21T12:00:00.000Z"),
      isAnimating: false,
      sunData: {
        sunrise: new Date("2026-06-21T03:43:00.000Z"),
        sunset: new Date("2026-06-21T20:21:00.000Z"),
        solarNoon: new Date("2026-06-21T12:02:00.000Z"),
        goldenHour: {
          start: new Date("2026-06-21T03:43:00.000Z"),
          end: new Date("2026-06-21T04:43:00.000Z"),
        },
        goldenHourEvening: {
          start: new Date("2026-06-21T19:21:00.000Z"),
          end: new Date("2026-06-21T20:21:00.000Z"),
        },
        blueHour: {
          start: new Date("2026-06-21T03:13:00.000Z"),
          end: new Date("2026-06-21T03:43:00.000Z"),
        },
        blueHourEvening: {
          start: new Date("2026-06-21T20:21:00.000Z"),
          end: new Date("2026-06-21T20:51:00.000Z"),
        },
        sunAzimuth: 180,
        sunElevation: 59,
        sunriseAzimuth: 51,
        sunsetAzimuth: 309,
        shadowDirection: 0,
        shadowLengthRatio: 0.6,
        dayLength: 16 * 3600 + 38 * 60,
        dayLengthChange: 32,
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
      selectedLandmark: null,
      photographerMode: false,
      isMobile: false,
    });
  });

  it("renders the responsive SVG with hour bands and a transitioned current dot", () => {
    computeSkyPathMock.mockReturnValue({
      points: [
        {
          time: new Date("2026-06-21T03:20:00.000Z"),
          elevation: -5,
          azimuth: 40,
          isGolden: false,
          isBlue: true,
        },
        {
          time: new Date("2026-06-21T03:50:00.000Z"),
          elevation: 2,
          azimuth: 55,
          isGolden: true,
          isBlue: false,
        },
        {
          time: new Date("2026-06-21T12:00:00.000Z"),
          elevation: 59,
          azimuth: 180,
          isGolden: false,
          isBlue: false,
        },
        {
          time: new Date("2026-06-21T19:40:00.000Z"),
          elevation: 4,
          azimuth: 300,
          isGolden: true,
          isBlue: false,
        },
        {
          time: new Date("2026-06-21T20:35:00.000Z"),
          elevation: -5,
          azimuth: 315,
          isGolden: false,
          isBlue: true,
        },
      ],
      isPolarNight: false,
      isMidnightSun: false,
    });

    render(<SkyPathDiagram />);

    expect(screen.getByLabelText("Sky path diagram")).toHaveAttribute("viewBox", "0 0 500 160");
    expect(screen.getByLabelText("Sky path diagram")).toHaveAttribute("width", "100%");
    expect(screen.getByTestId("sky-path-horizon")).toBeInTheDocument();
    expect(screen.getAllByTestId("sky-path-golden-band")).toHaveLength(2);
    expect(screen.getAllByTestId("sky-path-blue-band")).toHaveLength(2);
    expect(screen.getByText("Sunrise")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
    expect(screen.getByTestId("sky-path-current-dot").style.transition).toContain("cx 0.3s ease");
  });

  it("renders the polar night fallback label", () => {
    computeSkyPathMock.mockReturnValue({
      points: [
        {
          time: new Date("2026-12-21T12:00:00.000Z"),
          elevation: -12,
          azimuth: 180,
          isGolden: false,
          isBlue: false,
        },
      ],
      isPolarNight: true,
      isMidnightSun: false,
    });

    render(<SkyPathDiagram />);

    expect(screen.getAllByText("Polar night")).not.toHaveLength(0);
    expect(screen.getByTestId("sky-path-horizon")).toBeInTheDocument();
  });

  it("renders the midnight sun label", () => {
    computeSkyPathMock.mockReturnValue({
      points: [
        {
          time: new Date("2026-06-21T00:00:00.000Z"),
          elevation: 3,
          azimuth: 0,
          isGolden: false,
          isBlue: false,
        },
        {
          time: new Date("2026-06-21T12:00:00.000Z"),
          elevation: 28,
          azimuth: 180,
          isGolden: false,
          isBlue: false,
        },
      ],
      isPolarNight: false,
      isMidnightSun: true,
    });

    render(<SkyPathDiagram />);

    expect(screen.getAllByText("Midnight sun")).not.toHaveLength(0);
  });

  it("exposes the sky path inside a collapsible info-panel section", () => {
    computeSkyPathMock.mockReturnValue({
      points: [
        {
          time: new Date("2026-06-21T12:00:00.000Z"),
          elevation: 59,
          azimuth: 180,
          isGolden: false,
          isBlue: false,
        },
      ],
      isPolarNight: false,
      isMidnightSun: false,
    });

    render(<InfoPanel />);

    expect(screen.getByText("Sky Path").closest("details")).toBeInTheDocument();
  });
});