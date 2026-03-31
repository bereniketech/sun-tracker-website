---
task: 008
feature: helios-chrono-ui
status: complete
depends_on: [7]
---

# Task 008: Analemma Page — Data Cards + Ephemeris

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Complete the Analemma page by adding the Solar Azimuth/Altitude cards, Mean Anomaly display, and Ephemeris Data section (Solar Distance, Obliquity, Geometric Mean Longitude). All values update from the selected `AnalemmaPoint`.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```ts
// [AnalemmaPoint — src/lib/analemma.ts]
export interface AnalemmaPoint {
  dayOfYear: number;
  date: Date;
  equationOfTime: number;  // minutes, e.g. +14.36
  declination: number;     // degrees, e.g. +23.4
  azimuth: number;         // degrees at solar noon
  altitude: number;        // degrees at solar noon
  meanAnomaly: number;     // degrees 0–360
  solarDistance: number;   // AU e.g. 1.017
}
```

```tsx
// [Stitch analemma mobile — data section layout]
// Row 1: Solar Azimuth card (left) | Altitude card (right)
// Full-width: Mean Anomaly at display-lg scale with label "REAL-TIME / LIVE"
// Row 2: Ephemeris Data section with 3 items: Solar Distance, Obliquity, Geometric Mean Longitude
//   Each item: label + value + chevron (indicating it's expandable/detail)
```

### Key Patterns in Use
- Two-column data card grid: `grid grid-cols-2 gap-3`.
- Card style: `bg-surface-container-low rounded-2xl p-4` no border.
- Data card inner: `text-xs tracking-widest uppercase text-secondary` label + `font-headline text-2xl text-on-surface` value.
- Sub-label below value: `text-xs text-secondary` (e.g., "NW · West of the Meridian").
- Mean Anomaly: full-width card with orange "REAL-TIME" badge pill.
- Ephemeris list: each item is a row (`flex justify-between items-center`) with label-left and value-right + a `>` chevron icon.
- Obliquity constant: 23.4397° (epoch J2000, negligible change for display).
- Geometric Mean Longitude (°): `(280.46646 + 36000.76983 * T) % 360` where T = Julian centuries since J2000.

### Architecture Decisions Affecting This Task
- Create `src/components/analemma/ephemeris-data.tsx` as a pure presentational component.
- It receives a single `point: AnalemmaPoint` prop.
- Obliquity is a near-constant — compute a simple approximation: `23.4397 - 0.0000004 * dayOfYear`.
- Geometric Mean Longitude: compute from the `date` field of the `AnalemmaPoint`.
- All values are read-only display — no user interaction on this panel.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/analemma/analemma-svg.tsx` | SVG figure-8 visualization with interactive dot |
| `src/components/analemma/chrono-scrubber.tsx` | Day 1–365 scrubber |
| `src/app/analemma/page.tsx` | Analemma page with SVG + scrubber wired |

**Context for this task:**
`src/app/analemma/page.tsx` already has `selectedDay` state and the `points` array. The selected `AnalemmaPoint` is `points[selectedDay - 1]`. This task adds data cards and ephemeris below the SVG+scrubber section.

---

## Implementation Steps

1. **Create `src/components/analemma/ephemeris-data.tsx`**:
   - Props: `point: AnalemmaPoint`.
   - Section label: "EPHEMERIS DATA" tracking-widest uppercase.
   - Three list rows with a subtle `bg-surface-container-low rounded-2xl p-4 space-y-4`:
     1. **Solar Distance** — `{point.solarDistance.toFixed(3)} AU`.
     2. **Obliquity** — compute: `(23.4397 - 0.0000004 * point.dayOfYear).toFixed(4)}°` displayed as `23° 26' 11.2"` style.
     3. **Geometric Mean Longitude** — compute from `point.date`; display as `{value.toFixed(2)}°`.
   - Each row: label in `text-on-surface font-medium` + value in `text-secondary text-sm` + `ChevronRight` icon.

2. **Edit `src/app/analemma/page.tsx`**:
   - Below the `<ChronoScrubber>`, add:
     - Two-column card grid for **Solar Azimuth** and **Altitude**:
       - Azimuth card: value `{point.azimuth.toFixed(1)}°` + sub-label from cardinal direction.
       - Altitude card: value `{point.altitude.toFixed(1)}°` + sub-label "Solar Zenith Distance: {(90 - point.altitude).toFixed(1)}°".
     - Full-width **Mean Anomaly** card:
       - Badge: "REAL-TIME" orange pill top-right.
       - Value: `{point.meanAnomaly.toFixed(3)}°` in `font-headline text-5xl text-on-surface`.
       - Sub-text: "Position relative to perihelion point in the orbital ellipse."
     - `<EphemerisData point={point} />` section.

3. **Run `/verify`**.

_Requirements: FR-4 Analemma Tab_
_Skills: /build-website-web-app — data display components_

---

## Acceptance Criteria
- [x] Solar Azimuth and Altitude cards render with correct values for selected day.
- [x] Mean Anomaly displays at `display-lg` scale (font-headline text-5xl) with orange badge.
- [x] Ephemeris section shows Solar Distance, Obliquity, Geometric Mean Longitude.
- [x] All values update when scrubber moves to a different day.
- [x] Obliquity value is in degree notation (e.g., "23° 26' 14.3"").
- [x] No visible borders on any of the new cards.
- [x] Build passes and compilation successful.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/analemma/ephemeris-data.tsx` | New component: Solar Distance, Obliquity (23.4397 - 0.0000004 * dayOfYear), Geometric Mean Longitude with ChevronRight icons | complete |
| `src/app/analemma/page.tsx` | Added Solar Azimuth/Altitude data cards (2-column grid), Mean Anomaly display with orange badge, EphemerisData component integration | complete |

**Decisions made:**
- Obliquity approximated as `23.4397 - 0.0000004 * dayOfYear` for display accuracy
- Geometric Mean Longitude computed from Julian Day: T = (JD - J2000) / 36525, then (280.46646 + 36000.76983 * T) % 360
- Decimal-to-DMS conversion for Obliquity display: degrees° minutes' seconds"
- Meridian side indicator (East/West) based on azimuth < 180 / >= 180
- All cards styled with `bg-surface-container-low rounded-2xl p-4` (no borders per design spec)
- Text styling matches pattern: tracking-widest uppercase labels + font-headline values + secondary text for sub-labels

**Context for next task:** Analemma tab is complete with full data visualization. Task-009 (Landmarks) is independent and can start immediately.

**Open questions:** None.
