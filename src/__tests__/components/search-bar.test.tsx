import { act, fireEvent, render, screen } from "@testing-library/react";
import { SearchBar } from "@/components/search-bar";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    vi.restoreAllMocks();

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
        "sun-path",
      ]),
      photographerMode: false,
      isMobile: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows suggestions after debounce and updates the store when a result is selected", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        suggestions: [
          {
            placeId: "1",
            name: "Paris",
            displayName: "Paris, Ile-de-France, France",
            lat: 48.8566,
            lng: 2.3522,
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<SearchBar />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Search for a place"), {
        target: { value: "Paris" },
      });

      await vi.advanceTimersByTimeAsync(500);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/geocode?q=Paris", expect.any(Object));

    fireEvent.click(screen.getByRole("button", { name: /Paris, Ile-de-France, France/i }));

    expect(useSunTrackerStore.getState().location).toEqual({
      lat: 48.8566,
      lng: 2.3522,
    });
    expect(useSunTrackerStore.getState().locationName).toBe("Paris, Ile-de-France, France");
  });

  it("accepts manual coordinates and centers the store location", () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText("Latitude"), {
      target: { value: "34.0522" },
    });
    fireEvent.change(screen.getByLabelText("Longitude"), {
      target: { value: "-118.2437" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Go to location" }));

    expect(useSunTrackerStore.getState().location).toEqual({
      lat: 34.0522,
      lng: -118.2437,
    });
    expect(useSunTrackerStore.getState().locationName).toBe(
      "Manual coordinates 34.0522° N, 118.2437° W",
    );
  });

  it("shows a fallback message when geolocation is denied", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn(
          (
            _success: GeolocationPositionCallback,
            error?: GeolocationPositionErrorCallback,
          ) => {
            error?.({ code: 1 } as GeolocationPositionError);
          },
        ),
      },
    });

    render(<SearchBar />);

    fireEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(
      screen.getByText(
        "Location access was denied. Search for a place or enter coordinates.",
      ),
    ).toBeInTheDocument();
  });
});