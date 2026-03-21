# Requirements: issue-fixes

## Overview
Fix all real issues found in the post-launch audit (`issues.md`). Many reported items were already implemented; this spec covers the genuine regressions and UX gaps.

## Requirements

### REQ-001 — Initial data must be visible without user interaction
On page load, sunrise/sunset times, sun data panels, compass, shadow info, and map overlays must all display data for the default location (New York City) without requiring the user to click the map or search for a location.

### REQ-002 — Time slider must show contextual lighting feedback
The time slider must display the current lighting phase (Night, Blue Hour, Golden Hour, Daytime, Harsh Light) and shadow descriptor (Very Long, Long, Moderate, Short) as the user drags the slider.

### REQ-003 — Landmark alignment axis must be bidirectional
When a landmark is selected, the alignment axis overlay on the map must extend in both the forward direction (orientationAzimuth) and the reverse direction (orientationAzimuth + 180°), showing the full sight line through the landmark.

### REQ-004 — UX polish
- The Photographer Mode toggle must be clearly labeled "Photographer Mode" with an active/inactive indicator, not "Photographer Off/On".
- Map coordinates must include a copy-to-clipboard button that confirms success with a "Copied!" indicator.

### REQ-005 — Geocoding results must be in English
The search bar must always return place names in English, regardless of the queried location's local language. Searching "Kuwait" must return English results (e.g., "Kuwait City, Kuwait"), not Arabic text.

### REQ-006 — Onboarding hint for first-time users
On the first visit, a dismissible banner must appear explaining how to interact with the app. The banner must not reappear after the user dismisses it.

### REQ-007 — Animation controls must advance sun position visibly
- The Animate button must visibly move the sun arc on the map and advance the time slider when pressed.
- The speed selector (1x, 2x, 5x) must change the rate of time progression proportionally.
- The "Now" button must jump the time to the current real-world time and stop any active animation.
- All controls must work from the default NYC location on page load (no manual location search required).

### REQ-008 — Mobile layout must be usable at 390px viewport width
- The sidebar controls and map must not overlap or cause horizontal scroll at 390px.
- All interactive controls (search bar, time slider, date picker, animate, Now) must be reachable without horizontal scrolling.
- Panels (Share & Export, Favorites) must stack correctly below the map in a single column on mobile.

---

## Deferred / Out of Scope

The following audit items were already resolved in code before this spec was written. No implementation work required — included here for traceability.

| Audit item | Status | Notes |
|---|---|---|
| Animate button does nothing (Major #2) | Addressed by REQ-007 | Code exists in `animate-button.tsx`; needs end-to-end verification |
| Geolocation fails silently (Major #4) | Already implemented | `search-bar.tsx` handles all 4 geolocation error codes with inline messages |
| Date field invisible/unusable (Major #5) | Already implemented | `date-picker.tsx` renders a native `<input type="date">` in the controls sidebar |
| Favorites don't persist (Minor #2) | By design | Favorites are Supabase-backed and require sign-in; this is intentional |
| Share & Export is empty (Minor #3) | Already implemented | `share-panel.tsx` provides copy link, Twitter, Facebook, CSV, and JSON export |
| Browser tab title "Sun Data" (UX #1) | Already fixed | `layout.tsx` metadata already reads `title: "Sun Tracker"` |
