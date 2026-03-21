---
task: 004
feature: sun-tracker-v2
status: completed
depends_on: [3]
---

# Task 004: SkyPathDiagram SVG Component + InfoPanel Integration

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /presentations-ui-design
Commands: /verify, /task-handoff

---

## Objective
Create a pure SVG component `SkyPathDiagram` that visualises the sun's elevation arc across the day using data from `computeSkyPath`. Add it to `InfoPanel` as a collapsible section. Handle polar edge cases with label text.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [SkyPathResult — from src/lib/sky-path.ts (created in task-003)]
export interface SkyPathPoint {
  time: Date;
  elevation: number;
  azimuth: number;
  isGolden: boolean;
  isBlue: boolean;
}
export interface SkyPathResult {
  points: SkyPathPoint[];
  isPolarNight: boolean;
  isMidnightSun: boolean;
}
```

```typescript
// [Store selectors used in panels]
const location = useSunTrackerStore((state) => state.location);
const sunData = useSunTrackerStore((state) => state.sunData);
const dateTime = useSunTrackerStore((state) => state.dateTime);
```

```typescript
// [InfoPanel component location — src/components/panels/info-panel.tsx]
// Add SkyPathDiagram as a <details> section above ShadowInfo in the panel body.
// Pattern: import statically (not dynamic) — SVG is lightweight.
```

### Key Patterns in Use
- **SVG via `viewBox`:** `viewBox="0 0 500 160"` + `width="100%"` for responsiveness. No fixed pixel dimensions.
- **`useMemo`:** Compute `SkyPathResult` inside `useMemo` keyed on `${lat},${lng},${date.toDateString()}`.
- **No external charting library:** Pure SVG `<polyline>`, `<polygon>`, `<circle>`, `<line>` elements.
- **CSS transition on dot:** Use `style={{ transition: "cx 0.3s ease" }}` on the current-position `<circle>`.

### Architecture Decisions Affecting This Task
- SVG chosen over canvas/charting lib (ADR-1): zero bundle cost, full control.
- Y-axis: map elevation degrees to SVG y-coordinate (invert: higher elevation = lower y).
- X-axis: map 0–1440 minutes to SVG width.
- Golden bands: `<polygon>` covering the golden hour time range at all elevations (from 0 to max elevation within the band).
- Blue bands: same approach with blue hour ranges.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/lib/sky-path.ts` | New pure sky-path utility; samples SunCalc positions across a day, converts azimuth/elevation to app-friendly degrees, derives golden/blue hour flags, and reports polar-night/midnight-sun metadata |
| `src/__tests__/lib/sky-path.test.ts` | New unit tests covering London summer-solstice sampling, Tromsø polar-night and midnight-sun edge cases, default/custom interval counts, and point ordering/object creation |

**Decisions made in previous task:**
- **Default sampling is midnight-inclusive and end-exclusive** — loop runs from local midnight in `intervalMinutes` steps while `minuteOffset < 1440`, producing 144 points at the default 10-minute interval and 48 points at 30 minutes.
- **Blue hour uses SunCalc times plus direct altitude search** — `dawn`/`sunrise` and `sunset`/`dusk` bracket the `-4°` crossing, so the lib stays independent of `computeSunData` while still matching the feature definition.
- **Polar flags come from sampled elevations, not rise/set timestamps** — avoids depending on invalid sunrise/sunset dates in high-latitude cases.

**Context for this task:**
`computeSkyPath(lat, lng, date, intervalMinutes?)` is now available at `@/lib/sky-path` and returns `{ points, isPolarNight, isMidnightSun }`. Each point contains `time`, `elevation`, `azimuth`, `isGolden`, and `isBlue`. The output is ready for a client-side SVG sky-path diagram without needing `computeSunData` or additional store work.

**Open questions left by previous task:**
- Full `vitest run` is currently blocked by unrelated existing failures in `src/__tests__/components/time-controls.test.tsx`, `src/__tests__/components/search-bar.test.tsx`, and `src/__tests__/components/info-panel.test.tsx`.
- `/verify` could not be confirmed end-to-end for the same reason; the targeted sky-path tests pass and `npm run build` succeeds.

---

## Implementation Steps

1. Create `src/components/panels/sky-path-diagram.tsx` as a `"use client"` component.
2. Read location, dateTime, sunData from the store.
3. Compute `skyPathResult = useMemo(() => computeSkyPath(lat, lng, dateTime, 10), [lat, lng, dateTime.toDateString()])`.
4. Define SVG constants: `VIEW_W = 500`, `VIEW_H = 160`, `PAD = 20`.
5. Define mapping helpers:
   - `timeToX(date: Date): number` — maps minutes since midnight to `[PAD, VIEW_W - PAD]`.
   - `elevToY(deg: number, minElev, maxElev): number` — maps elevation to `[VIEW_H - PAD, PAD]` (inverted).
6. Render:
   - Horizon line: `<line y1={horizonY} y2={horizonY} x1={PAD} x2={VIEW_W - PAD} stroke="gray" />`.
   - Golden hour polygon band (fill amber, low opacity).
   - Blue hour polygon band (fill sky-blue, low opacity).
   - Sun path polyline from `points.map(p => [timeToX(p.time), elevToY(p.elevation, ...)])`.
   - Solar noon dashed vertical line.
   - Current position dot: `<circle cx={timeToX(dateTime)} cy={elevToY(currentElevation, ...)} r={5} />` with CSS transition.
7. Polar edge cases: if `isPolarNight`, render flat horizon line + `<text>Polar night</text>`. If `isMidnightSun`, render full arc + `<text>Midnight sun</text>`.
8. Wrap in `<details>` in InfoPanel above `<ShadowInfo>`.
9. Create `src/__tests__/components/sky-path-diagram.test.tsx`:
   - Mock `computeSkyPath` return value.
   - Assert SVG renders, horizon line present, polar night label shown when `isPolarNight = true`.

_Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
_Skills: /build-website-web-app — React/SVG; /presentations-ui-design — visual layout_

---

## Acceptance Criteria
- [x] SVG renders without error for standard, polar-night, and midnight-sun inputs.
- [x] `viewBox` + `width="100%"` present; minimum renders at 280 px.
- [x] Current-position dot has CSS transition.
- [x] Golden and blue hour bands visible in SVG.
- [x] Polar night / midnight sun labels appear correctly.
- [x] Section collapses in InfoPanel via `<details>`.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed |
|------|-------------|
| `src/components/panels/sky-path-diagram.tsx` | Added a client-side SVG sky-path panel with horizon, sunrise/sunset markers, solar-noon guide, golden/blue hour polygons, animated current-position dot, and polar-night/midnight-sun labels |
| `src/components/panels/info-panel.tsx` | Added the new Sky Path `<details>` section above `ShadowInfo` using a static import |
| `src/__tests__/components/sky-path-diagram.test.tsx` | Added targeted tests for standard rendering, polar night, midnight sun, and InfoPanel collapsible integration |

**Decisions made:**
- The diagram uses sampled `computeSkyPath` points for the arc and band polygons, while the current-position dot and sunrise/sunset/solar-noon markers come from `sunData` so slider movement updates immediately without recomputing the full day path.
- The path is memoized by location plus start-of-day timestamp, so intraday time changes only move the current dot.
- Sunrise and sunset are marked explicitly to satisfy Requirement 2.2 even though the task steps only called out solar noon and the current dot.

**Context for next task:**
Task 004 is functionally complete. The main info panel now exposes a responsive SVG sky-path visual that handles standard, polar-night, and midnight-sun days. Targeted SkyPathDiagram tests pass and `npm run build` succeeds.

**Open questions:**
- Full `vitest run` still does not pass because of pre-existing component test failures; `src/__tests__/components/info-panel.test.tsx` still queries the old "Photographer Off/On" button name instead of the current "Photographer Mode" control.
- `/verify` was not runnable end-to-end from this task because the repo-level test suite is still red outside the task-004 files.
