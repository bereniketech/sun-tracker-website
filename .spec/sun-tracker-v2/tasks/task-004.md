---
task: 004
feature: sun-tracker-v2
status: pending
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
> Populated by /task-handoff after task-003 completes.

**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

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
- [ ] SVG renders without error for standard, polar-night, and midnight-sun inputs.
- [ ] `viewBox` + `width="100%"` present; minimum renders at 280 px.
- [ ] Current-position dot has CSS transition.
- [ ] Golden and blue hour bands visible in SVG.
- [ ] Polar night / midnight sun labels appear correctly.
- [ ] Section collapses in InfoPanel via `<details>`.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
