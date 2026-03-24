import { render, screen } from "@testing-library/react";
import { InfoPanel } from "@/components/panels/info-panel";
import { SeasonalInsights } from "@/components/panels/seasonal-insights";
import * as seasonalInsightsModule from "@/lib/seasonal-insights";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

vi.mock("@/lib/seasonal-insights", async () => {
  const actual = await vi.importActual<typeof import("@/lib/seasonal-insights")>("@/lib/seasonal-insights");

  return {
    ...actual,
    computeSeasonalData: vi.fn(),
  };
});

const computeSeasonalDataMock = vi.mocked(seasonalInsightsModule.computeSeasonalData);

function makeSnapshot(month: number, monthName: string, sunriseIso: string, sunsetIso: string, goldenIso: string, dayLengthSeconds: number) {
  return {
    month,
    monthName,
    sunrise: new Date(sunriseIso),
    sunset: new Date(sunsetIso),
    goldenHourStart: new Date(goldenIso),
    dayLengthSeconds,
    peakElevation: 35 + month,
  };
}

describe("SeasonalInsights", () => {
  beforeEach(() => {
    computeSeasonalDataMock.mockReset();
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York",
      dateTime: new Date("2026-06-21T12:00:00.000Z"),
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
      ]),
      photographerMode: false,
      isMobile: false,
    });

    computeSeasonalDataMock.mockReturnValue([
      makeSnapshot(1, "January", "2026-01-21T07:20:00.000Z", "2026-01-21T16:40:00.000Z", "2026-01-21T15:55:00.000Z", 9 * 3600 + 20 * 60),
      makeSnapshot(2, "February", "2026-02-21T06:55:00.000Z", "2026-02-21T17:20:00.000Z", "2026-02-21T16:35:00.000Z", 10 * 3600 + 25 * 60),
      makeSnapshot(3, "March", "2026-03-21T06:10:00.000Z", "2026-03-21T18:05:00.000Z", "2026-03-21T17:20:00.000Z", 11 * 3600 + 55 * 60),
      makeSnapshot(4, "April", "2026-04-21T05:30:00.000Z", "2026-04-21T18:45:00.000Z", "2026-04-21T18:00:00.000Z", 13 * 3600 + 15 * 60),
      makeSnapshot(5, "May", "2026-05-21T04:55:00.000Z", "2026-05-21T19:20:00.000Z", "2026-05-21T18:35:00.000Z", 14 * 3600 + 25 * 60),
      makeSnapshot(6, "June", "2026-06-21T04:25:00.000Z", "2026-06-21T19:40:00.000Z", "2026-06-21T18:55:00.000Z", 15 * 3600 + 15 * 60),
      makeSnapshot(7, "July", "2026-07-21T04:40:00.000Z", "2026-07-21T19:30:00.000Z", "2026-07-21T18:45:00.000Z", 14 * 3600 + 50 * 60),
      makeSnapshot(8, "August", "2026-08-21T05:10:00.000Z", "2026-08-21T18:55:00.000Z", "2026-08-21T18:10:00.000Z", 13 * 3600 + 45 * 60),
      makeSnapshot(9, "September", "2026-09-21T05:45:00.000Z", "2026-09-21T18:10:00.000Z", "2026-09-21T17:25:00.000Z", 12 * 3600 + 25 * 60),
      makeSnapshot(10, "October", "2026-10-21T06:20:00.000Z", "2026-10-21T17:20:00.000Z", "2026-10-21T16:35:00.000Z", 11 * 3600),
      makeSnapshot(11, "November", "2026-11-21T06:50:00.000Z", "2026-11-21T16:45:00.000Z", "2026-11-21T16:00:00.000Z", 9 * 3600 + 55 * 60),
      makeSnapshot(12, "December", "2026-12-21T07:15:00.000Z", "2026-12-21T16:25:00.000Z", "2026-12-21T15:40:00.000Z", 9 * 3600 + 10 * 60),
    ]);
  });

  it("renders 12 monthly bars with highlight fills and tooltip details", () => {
    const { container } = render(<SeasonalInsights lat={40.7128} lng={-74.006} />);

    expect(screen.getByLabelText("Seasonal daylight chart")).toHaveAttribute("viewBox", "0 0 600 200");
    expect(screen.getAllByTestId("seasonal-insight-bar")).toHaveLength(12);
    expect(container.querySelector('[data-testid="seasonal-insight-bar-longest"] rect')).toHaveAttribute("fill", "#f59e0b");
    expect(container.querySelector('[data-testid="seasonal-insight-bar-shortest"] rect')).toHaveAttribute("fill", "#38bdf8");

    const titleNodes = Array.from(container.querySelectorAll("title"));
    expect(titleNodes[0]?.textContent).toContain("Sunrise:");
    expect(titleNodes[0]?.textContent).toContain("Sunset:");
    expect(titleNodes[0]?.textContent).toContain("Golden hour start:");
    expect(titleNodes[0]?.textContent).toContain("Day length:");
  });

  it("appears inside a collapsible info panel section", () => {
    render(<InfoPanel />);

    expect(screen.getByText("Seasonal Insights").closest("details")).toBeInTheDocument();
    expect(screen.getByLabelText("Seasonal daylight chart")).toBeInTheDocument();
  });
});