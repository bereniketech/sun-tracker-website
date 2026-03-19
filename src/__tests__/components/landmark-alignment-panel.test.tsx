import { fireEvent, render, screen } from "@testing-library/react";
import { LandmarkAlignmentPanel } from "@/components/panels/landmark-alignment-panel";
import { LANDMARKS } from "@/lib/landmarks";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

describe("landmark alignment panel", () => {
  beforeEach(() => {
    useSunTrackerStore.setState({
      location: { lat: 40.7128, lng: -74.006 },
      locationName: "New York",
      dateTime: new Date("2026-03-19T12:00:00.000Z"),
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
        "landmark-alignment",
      ]),
      selectedLandmark: null,
      photographerMode: false,
      isMobile: false,
    });
  });

  it("renders an empty state before a landmark is selected", () => {
    render(<LandmarkAlignmentPanel />);

    expect(screen.getByText(/Select a landmark to calculate alignment dates/i)).toBeInTheDocument();
  });

  it("updates store state when the user selects a landmark", () => {
    render(<LandmarkAlignmentPanel />);

    fireEvent.change(screen.getByLabelText("Select a landmark"), {
      target: { value: LANDMARKS[0].id },
    });

    expect(useSunTrackerStore.getState().selectedLandmark?.id).toBe(LANDMARKS[0].id);
    expect(screen.getByText("Alignment Dates")).toBeInTheDocument();
  });

  it("shows a no alignments message for the north axis study", () => {
    useSunTrackerStore.setState({
      selectedLandmark: LANDMARKS[3],
      location: { lat: LANDMARKS[3].lat, lng: LANDMARKS[3].lng },
      locationName: LANDMARKS[3].name,
    });

    render(<LandmarkAlignmentPanel />);

    expect(screen.getByText(/No alignments found for North Axis Study in 2026/i)).toBeInTheDocument();
  });
});