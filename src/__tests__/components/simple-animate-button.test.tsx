import { render, fireEvent, screen } from "@testing-library/react";
import { AnimateButton } from "@/components/controls/animate-button";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { computeSunData } from "@/lib/sun";

describe("Simple AnimateButton Test", () => {
  beforeEach(() => {
    const initialDate = new Date("2025-06-21T12:00:00Z");
    const sunData = computeSunData(40.7128, -74.006, initialDate);

    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York City",
      dateTime: initialDate,
      isAnimating: false,
      sunData,
      comparisonLocations: [],
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

  it("should toggle isAnimating state when button is clicked", () => {
    render(<AnimateButton />);

    const playButton = screen.getByRole("button", { name: /animate sun movement/i });

    expect(screen.getByText("Animate")).toBeInTheDocument();

    fireEvent.click(playButton);

    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(useSunTrackerStore.getState().isAnimating).toBe(true);
  });

  it("should directly update store via setDateTime", () => {
    const initialState = useSunTrackerStore.getState();
    const initialTime = initialState.dateTime;

    const newTime = new Date(initialTime.getTime() + 60 * 1000);
    useSunTrackerStore.getState().setDateTime(newTime);

    const updatedState = useSunTrackerStore.getState();
    expect(updatedState.dateTime.getTime()).toBe(newTime.getTime());
  });

  it("should render with NYC default state", () => {
    render(<AnimateButton />);

    const state = useSunTrackerStore.getState();
    expect(state.location?.lat).toBe(40.7128);
    expect(state.locationName).toBe("New York City");
    expect(state.sunData).toBeDefined();
  });
});
