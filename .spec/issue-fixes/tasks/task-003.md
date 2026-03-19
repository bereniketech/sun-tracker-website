# Task 003 — Fix landmark alignment axis (bidirectional)

## Summary
The landmark alignment overlay currently draws only a single forward-direction ray. Fix it to draw both forward and reverse rays so the full sight line is visible through the landmark.

## Implementation Steps
1. In `src/components/map/map-overlays.tsx`, inside `LandmarkAlignmentOverlay`:
   - Add a `reversePositions` computed value alongside existing `positions`:
     ```ts
     const reverseAzimuth = (selectedLandmark.orientationAzimuth + 180) % 360;
     const reversePositions = toLatLngPairs(createRay(center, reverseAzimuth, DIRECTION_LINE_DISTANCE_METERS));
     ```
   - Render a second `<Polyline>` with the same pathOptions for the reverse direction

## Acceptance Criteria
- [ ] Selecting Manhattanhenge draws a line extending in both directions from the landmark
- [ ] The axis passes visually through the landmark marker point
- [ ] No new test failures
