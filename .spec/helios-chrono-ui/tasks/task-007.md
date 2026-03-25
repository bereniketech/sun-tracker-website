---
task: 007
feature: helios-chrono-ui
status: pending
depends_on: [6]
---

# Task 007: Analemma Page — SVG Figure-8 + Chrono Scrubber

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Build the Analemma page with an interactive SVG figure-8 visualization and a chronological scrubber (Day 1–365). The selected day's dot moves along the curve. Solstice and equinox markers are labelled on the SVG.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```ts
// [AnalemmaPoint type — src/lib/analemma.ts]
export interface AnalemmaPoint {
  dayOfYear: number;
  date: Date;
  equationOfTime: number;  // minutes
  declination: number;     // degrees
  azimuth: number;
  altitude: number;
  meanAnomaly: number;
  solarDistance: number;
}
export function computeAnalemma(lat: number, lng: number, year: number): AnalemmaPoint[]
```

```tsx
// [useSunTrackerStore — location, src/store/sun-tracker-store.ts:16-18]
export const useSunTrackerStore = create<SunTrackerState>((set) => ({
  location: { lat: DEFAULT_MAP_LOCATION.lat, lng: DEFAULT_MAP_LOCATION.lng },
  // ...
}));
```

```tsx
// [SVG coordinate mapping pattern]
// equationOfTime range: -16 to +16 minutes → map to SVG x-axis
// declination range: -23.45 to +23.45 degrees → map to SVG y-axis (inverted: top = max)
// Given SVG viewBox "0 0 400 480":
//   x = (equationOfTime + 16) / 32 * 380 + 10
//   y = (23.45 - declination) / 46.9 * 460 + 10
```

### Key Patterns in Use
- SVG polyline/path for the curve: build a path string from all 365 points.
- Orange gradient: use `<defs><linearGradient id="analemma-grad">` in SVG.
- Corner brackets: four `<path>` elements at corners drawing L-shapes in `stroke-outline-variant`.
- Glassmorphic tooltip: absolute-positioned `<div>` with `bg-white/70 backdrop-blur-md rounded-xl shadow`.
- Current day dot: `<circle>` at computed x/y of selected point, filled `text-primary`.
- Scrubber: standard `<input type="range" min="1" max="365">` styled with `accent-color: #9d4300`.

### Architecture Decisions Affecting This Task
- `computeAnalemma` is called client-side (imported directly from `@/lib/analemma`) — avoids a fetch round-trip since the data is pure computation.
- Compute once on mount with current lat/lng + current year, memoize with `useMemo`.
- Selected day state: `useState<number>` (1–365), initialized to current day of year.
- SVG is responsive: use `viewBox` + `width="100%"` so it scales.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/lib/analemma.ts` | New `computeAnalemma` function + `AnalemmaPoint` type |
| `src/app/api/analemma/route.ts` | GET API route |
| `src/__tests__/lib/analemma.test.ts` | Unit tests |

**Context for this task:**
`computeAnalemma(lat, lng, year)` is available at `@/lib/analemma`. It returns a stable 365-point array. Call it client-side with `useMemo` — no API fetch needed in the component.

---

## Implementation Steps

1. **Create `src/components/analemma/analemma-svg.tsx`** (`"use client"`):
   - Props: `points: AnalemmaPoint[]`, `selectedDay: number`, `onDaySelect: (day: number) => void`.
   - `viewBox="0 0 400 500"` + `width="100%"`.
   - Build SVG path `d` string from all 365 points mapped through coordinate transform.
   - Add `<defs>` with orange linear gradient (`#9d4300` → `#f97316`).
   - Render `<path>` with `stroke="url(#analemma-grad)" strokeWidth="2" fill="none"`.
   - Add corner bracket paths (L-shapes) at SVG corners using `stroke-outline-variant opacity-50`.
   - Mark solstices and equinoxes with small `<circle r="4">` + `<text>` labels: "JUN 21", "DEC 21", "MAR 20", "SEP 22".
   - Render selected day `<circle r="7" fill="#f97316">` at its (x, y).
   - On SVG click: compute nearest point to click coordinates and call `onDaySelect`.

2. **Create `src/components/analemma/chrono-scrubber.tsx`** (`"use client"`):
   - Props: `value: number` (1–365), `onChange: (day: number) => void`.
   - Label above: "CHRONOLOGICAL SCRUBBER" in tracking-widest uppercase secondary.
   - Right label: "Day {value} of 365" in `font-headline text-primary`.
   - Month labels below the track: JAN, APR, JUL, OCT, DEC — positioned at days 1, 91, 182, 274, 335.
   - `<input type="range" min={1} max={365} value={value} style={{ accentColor: '#9d4300' }}>`
   - Track background: `bg-surface-variant rounded-full h-1`.
   - Glassmorphic tooltip above thumb showing full date.

3. **Replace `src/app/analemma/page.tsx`** (was placeholder):
   - `"use client"` page.
   - Header: "CELESTIAL MECHANICS" label-sm + "Analemma" in `font-headline text-4xl` + subtitle.
   - Use `useSunTrackerStore` for lat/lng.
   - `const points = useMemo(() => computeAnalemma(lat, lng, currentYear), [lat, lng])`.
   - State: `selectedDay` (default = current day of year from `new Date()`).
   - Render `<AnalemmaSvg>` + `<ChronoScrubber>` in the page body.
   - Selected point display: Equation of Time + Solar Declination values at top of SVG section.

4. **Run `/verify`**.

_Requirements: FR-4 Analemma Tab_
_Skills: /build-website-web-app — SVG + React state_

---

## Acceptance Criteria
- [ ] Analemma SVG renders a figure-8 (two loops) shaped curve.
- [ ] Orange gradient stroke visible on the curve.
- [ ] Corner bracket glyphs visible at SVG edges.
- [ ] Solstice/equinox labels visible on the SVG.
- [ ] Selected day dot is visible and positioned correctly on the curve.
- [ ] Dragging the scrubber moves the dot along the curve.
- [ ] Equation of Time and Declination values update with the scrubber.
- [ ] SVG is responsive (scales on mobile).
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/analemma/analemma-svg.tsx` | SVG figure-8 with gradient, brackets, markers, interactive dot | pending |
| `src/components/analemma/chrono-scrubber.tsx` | Day 1–365 range slider with glassmorphic tooltip | pending |
| `src/app/analemma/page.tsx` | Full analemma page with SVG + scrubber | pending |

**Decisions made:** _(fill in after completion)_
**Context for next task:** Task-008 imports `selectedDay` state from the page and the `AnalemmaPoint` at that index to populate data cards and ephemeris section.
**Open questions:** _(none)_
