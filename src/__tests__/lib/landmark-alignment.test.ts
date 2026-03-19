import { findLandmarkAlignmentEvents } from "@/lib/landmark-alignment";
import { LANDMARKS } from "@/lib/landmarks";

describe("landmark alignment calculations", () => {
  it("finds known alignment windows for Manhattanhenge", () => {
    const events = findLandmarkAlignmentEvents(LANDMARKS[0], 2026, 1);

    expect(events.length).toBeGreaterThan(0);
    expect(events.some((event) => event.matchType === "sunset")).toBe(true);
  });

  it("returns no events for an impossible sunrise-sunset axis", () => {
    const events = findLandmarkAlignmentEvents(LANDMARKS[3], 2026, 0.2);

    expect(events).toEqual([]);
  });
});