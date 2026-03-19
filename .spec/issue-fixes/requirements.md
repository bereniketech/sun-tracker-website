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
