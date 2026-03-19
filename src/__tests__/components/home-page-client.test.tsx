import { render, screen, waitFor } from "@testing-library/react";
import { HomePageClient } from "@/components/home-page-client";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

vi.mock("@/components/map/interactive-map", () => ({
  InteractiveMap: () => <div data-testid="interactive-map">Mock Map</div>,
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

  it("initializes the default map location when the page mounts", async () => {
    render(<HomePageClient />);

    await waitFor(() => {
      expect(useSunTrackerStore.getState().location).toEqual({
        lat: 40.7128,
        lng: -74.006,
      });
    });

    expect(useSunTrackerStore.getState().locationName).toBe("New York City");
    expect(screen.getByTestId("interactive-map")).toBeInTheDocument();
    expect(screen.getByText("New York City")).toBeInTheDocument();
  });
});