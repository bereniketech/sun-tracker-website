---
status: complete
---

# Task 002 — Time slider contextual feedback

## Summary
Add a lighting phase label and shadow descriptor below the time slider so users get real-time feedback as they scrub through the day.

## Implementation Steps
1. In `src/components/controls/time-slider.tsx`:
   - Import `useSunTrackerStore` (already in scope if needed)
   - Add a `getLightingPhase(sunElevation: number)` helper that returns `{ label, colorClass }`:
     - elevation < -6 → "Night", slate
     - -6 to -0.833 → "Blue Hour", blue
     - -0.833 to 6 → "Golden Hour", amber
     - 6 to 20 → "Daytime", green
     - > 20 → "Harsh Light", orange
   - Add a `getShadowDescriptor(ratio: number | null)` helper:
     - null / Infinity / > 5 → "Very Long"
     - 2–5 → "Long"
     - 1–2 → "Moderate"
     - < 1 → "Short"
   - Read `sunData` from the store
   - Below the slider, render a flex row with the phase pill and shadow descriptor

## Acceptance Criteria
- [ ] Dragging the slider updates the lighting phase label instantly
- [ ] Night / Blue Hour / Golden Hour / Daytime / Harsh Light labels appear correctly
- [ ] Shadow descriptor updates with the slider
- [ ] No new test failures
