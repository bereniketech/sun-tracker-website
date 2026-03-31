---
status: complete
---

# Task 004 — UX polish: Photographer Mode label + copy coordinates

## Summary
Fix two UX issues: confusing "Photographer Off" toggle label and coordinates with no copy affordance.

## Implementation Steps
1. In `src/components/panels/info-panel.tsx`:
   - Replace `{photographerMode ? "Photographer On" : "Photographer Off"}` with `"Photographer Mode"` (static label)
   - Add visual indicator: when active, keep amber styling; when inactive, keep slate styling
   - The toggle button text is always "Photographer Mode" — the styling alone signals state

2. In `src/components/map/leaflet-map.tsx`:
   - Add local `const [coordsCopied, setCoordsCopied] = useState(false)`
   - Add import `Copy` from lucide-react
   - Next to the coordinates `<p>`, add a small `<button>` with the Copy icon
   - On click: `navigator.clipboard.writeText(formatCoordinatePair(center.lat, center.lng))`, set `coordsCopied(true)`, reset after 2000ms
   - Show "✓" or change icon color when `coordsCopied` is true

## Acceptance Criteria
- [ ] Toggle always reads "Photographer Mode" — no "On/Off" in the label
- [ ] Active state is visually distinct (amber border/background)
- [ ] Coordinates panel has a copy icon button
- [ ] Clicking copy shows a success indicator for 2 seconds
- [ ] No new test failures
