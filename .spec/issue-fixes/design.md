# Design: issue-fixes

## REQ-001 Design — Store Hydration Fix

**Root cause:** `useSunTrackerStore` (Zustand) initializes with `location: null` and `sunData: null`. A `useEffect` in `home-page-client.tsx` calls `setLocation(NYC)` after the first render, leaving a window where all data-dependent UI shows empty states.

**Solution:** Initialize the store synchronously with `DEFAULT_MAP_LOCATION` coordinates and pre-computed `sunData`:

```ts
// sun-tracker-store.ts
import { DEFAULT_MAP_LOCATION } from "@/components/map/location-utils";

const INITIAL_DATE = new Date();

export const useSunTrackerStore = create<SunTrackerState>((set) => ({
  location: { lat: DEFAULT_MAP_LOCATION.lat, lng: DEFAULT_MAP_LOCATION.lng },
  locationName: DEFAULT_MAP_LOCATION.name,
  sunData: computeSunData(DEFAULT_MAP_LOCATION.lat, DEFAULT_MAP_LOCATION.lng, INITIAL_DATE),
  dateTime: INITIAL_DATE,
  // ... rest unchanged
}));
```

Remove the `useEffect` in `home-page-client.tsx` that called `setLocation` on mount (now redundant and causes a double-render flash).

## REQ-002 Design — Time Slider Lighting Phase

Add a `getLightingPhase(sunData, dateTime)` utility that returns a phase object `{ label, color }` by checking `sunElevation` and time windows in `sunData`.

Phase thresholds (by sun elevation):
- `< -6°` → Night
- `-6° to -0.833°` → Blue Hour
- `-0.833° to 6°` → Golden Hour
- `6° to 20°` → Daytime (soft)
- `> 20°` → Harsh Light

Shadow descriptor from `sunData.shadowLengthRatio`:
- `> 5` → Very Long
- `2–5` → Long
- `1–2` → Moderate
- `< 1` → Short

Render a small pill/badge below the slider within `time-slider.tsx`, reading from the store's `sunData`.

## REQ-003 Design — Bidirectional Landmark Axis

In `LandmarkAlignmentOverlay` (`map-overlays.tsx`), call `createRay` twice:
1. `createRay(center, azimuth, DISTANCE)` — forward
2. `createRay(center, (azimuth + 180) % 360, DISTANCE)` — reverse

Render both as `<Polyline>` elements with the same style. The two polylines originate at the landmark and extend in opposite directions, forming a complete sight line.

## REQ-004 Design — UX Polish

**Photographer toggle:** Replace text `"Photographer On"/"Photographer Off"` with `"Photographer Mode"` + a colored dot or icon indicator. Use `aria-pressed` for accessibility.

**Copy coordinates:** In `leaflet-map.tsx`, add a small icon button (clipboard icon from lucide-react) next to the coordinate `<p>` element. On click, call `navigator.clipboard.writeText(coordinateString)` and show a "Copied!" tooltip for 2s via local `useState`.

## REQ-005 Design — Geocoding Language

In `src/app/api/geocode/route.ts`, add one line before the `fetch` call:

```ts
url.searchParams.set("accept-language", "en");
```

Nominatim respects this parameter and returns `display_name` values in English regardless of the queried country.

## REQ-006 Design — Onboarding Banner

In `home-page-client.tsx`, add a `useEffect` that checks `localStorage.getItem("sun-tracker:onboarded")`. If absent, render a dismissible banner above the stats strip. On dismiss, set the localStorage key and remove the banner.

The banner is a simple `<div>` with a close button, not a modal, to avoid blocking interaction.
