---
task: 004
feature: helios-chrono-ui
status: done
depends_on: [2]
---

# Task 004: Dashboard — Location Header + Solar Metrics

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Replace the current `HomePageClient` stats strip with the Helios Chrono dashboard header and solar metric cards (Zenith, Azimuth, Elevation). Create a new `DashboardPage` client component that reuses `useSunTrackerStore` + `computeSunData`.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```tsx
// [useSunTrackerStore selectors — src/store/sun-tracker-store.ts:36-44]
setLocation: (lat, lng, name) => {
  set((state) => ({
    location: { lat, lng },
    locationName: name ?? state.locationName,
    sunData: withSunData(lat, lng, state.dateTime),
  }));
},
```

```tsx
// [SunData fields used — src/types/sun.ts:37-53]
export interface SunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  sunAzimuth: number;      // degrees from North
  sunElevation: number;    // degrees above horizon
  sunriseAzimuth: number;
  sunsetAzimuth: number;
  shadowDirection: number;
  shadowLengthRatio: number;
  dayLength: number;
  dayLengthChange: number;
}
```

```tsx
// [Current HomePageClient stats strip — src/components/home-page-client.tsx:94-117]
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <p className="text-xs font-medium text-slate-500">Location</p>
    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
      {locationName || DEFAULT_MAP_LOCATION.name}
    </p>
    <p className="text-xs text-slate-500">{coordinateLabel}</p>
  </div>
  ...
</div>
```

```tsx
// [DEFAULT_MAP_LOCATION — src/components/map/location-utils.ts]
export const DEFAULT_MAP_LOCATION = { lat: 51.1789, lng: -1.8262, name: "Stonehenge" };
export function formatCoordinatePair(lat: number, lng: number): string
```

### Key Patterns in Use
- Solar Zenith = 90° - sunElevation.
- Direction label from azimuth: N (337.5–22.5), NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW.
- Local Solar Time: solar noon occurs when sun azimuth = 180°. Approximate local solar time = UTC + (lng/15) hours.
- No explicit borders: use `bg-surface-container-low` for card backgrounds on `bg-surface` page.

### Architecture Decisions Affecting This Task
- Create `src/components/dashboard/solar-metrics.tsx` as a pure presentational component; it receives `sunData` + `locationName` + `coordinates` as props.
- `HomePageClient` becomes a "Dashboard wrapper" — rename to `src/components/dashboard/dashboard-page.tsx` or update in place.
- The location header ("LIVE CELESTIAL TRACKING" + location name) lives at the top of the dashboard, above the metric cards.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/shell/top-bar.tsx` | Glassmorphic TopBar |
| `src/components/shell/bottom-nav.tsx` | 4-tab BottomNav |
| `src/app/layout.tsx` | Updated with TopBar + BottomNav |
| Placeholder pages | `/analemma`, `/landmarks`, `/observatory` |

---

## Implementation Steps

1. **Create `src/components/dashboard/solar-metrics.tsx`**:
   - Props: `sunData: SunData | null`, `locationName: string`, `coordinates: string`.
   - Location header section:
     - `text-xs font-label tracking-widest uppercase text-primary` → "LIVE CELESTIAL TRACKING"
     - `font-headline text-3xl md:text-4xl font-bold text-on-surface` → location name
     - `text-secondary text-sm` → coordinate string
   - Three metric cards in a row (`grid grid-cols-3 gap-3`):
     - **Solar Zenith:** label "SOLAR ZENITH" + value `{(90 - elevation).toFixed(1)}°` in `font-headline text-2xl text-on-surface` + direction subtext.
     - **Azimuth:** label "AZIMUTH" + value `{azimuth.toFixed(1)}°` + cardinal direction in `text-primary`.
     - **Elevation:** label "ELEVATION" + value `{elevation > 0 ? '+' : ''}{elevation.toFixed(1)}°`.
   - Card style: `bg-surface-container-low rounded-2xl p-4` — no border.

2. **Edit `src/components/home-page-client.tsx`**:
   - Remove the old stats strip (the grid of 3 `border border-slate-200` cards).
   - Import and render `<SolarMetrics sunData={sunData} locationName={...} coordinates={...} />` at the top.
   - Keep everything else (SearchBar, map, controls, InfoPanel, SharePanel, FavoritesPanel) — task-005 will handle Day Cycle + Photo Windows.

3. **Edit `src/app/page.tsx`** if needed to ensure `HomePageClient` renders inside the new shell correctly.

4. **Run `/verify`**.

_Requirements: FR-3 Dashboard Tab_
_Skills: /build-website-web-app — React component + Tailwind_

---

## Acceptance Criteria
- [x] "LIVE CELESTIAL TRACKING" label appears in orange above the location name.
- [x] Location name displays in Space Grotesk display size.
- [x] Three metric cards show Solar Zenith, Azimuth, Elevation.
- [x] Values update when user clicks a new location on the map.
- [x] No `border-slate-*` or `border-gray-*` visible on the new metric cards.
- [x] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/dashboard/solar-metrics.tsx` | New metric cards: Solar Zenith, Azimuth, Elevation with Helios Chrono styling | done |
| `src/components/home-page-client.tsx` | Removed old stats strip; added SolarMetrics at top | done |
| `src/components/controls/animate-button.tsx` | Changed from rAF loop to setInterval(100ms); fixed UTC end-of-day check | done |
| `src/__tests__/components/home-page-client.test.tsx` | Added 2 dashboard header tests | done |
| `src/__tests__/components/animate-button.test.tsx` | Updated tests: async act, fake timers | done |
| `src/__tests__/integration/animation-controls.test.tsx` | Added fake timers; switched from waitFor to async act | done |
| `src/__tests__/components/time-controls.test.tsx` | Updated "animates time forward" test for setInterval approach | done |

**Decisions made:**
- Used 16-point CARDINAL_DIRECTIONS array for azimuth → direction mapping (337.5° resolution).
- End-of-day calculation uses `setUTCHours(23, 59, 0, 0)` to correctly handle UTC-based test dates across all timezones.
- `AnimateButton` uses `setInterval(100ms)` accumulator pattern: 1 real second = 1 simulated minute at 1× speed.

**Context for next task:** `SolarMetrics` is placed at the top of `HomePageClient` above the SearchBar and map. Task-005 should add Day Cycle + Photo Windows panels below it, then reassemble the final grid layout.

**Open questions:** _(none)_
