import { render, screen, waitFor } from "@testing-library/react";
import { HomePageClient } from "@/components/home-page-client";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

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

  it("renders with the default map location pre-loaded from the store", async () => {
    // Store now initializes with NYC synchronously; no useEffect needed in the component.
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York City",
    });

    render(<HomePageClient />);

    expect(useSunTrackerStore.getState().location).toEqual({
      lat: 40.7128,
      lng: -74.006,
    });
    expect(useSunTrackerStore.getState().locationName).toBe("New York City");
    expect(screen.getByTestId("interactive-map")).toBeInTheDocument();
    expect(screen.getByText("New York City")).toBeInTheDocument();
  });
});