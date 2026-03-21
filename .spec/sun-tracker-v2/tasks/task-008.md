---
task: 008
feature: sun-tracker-v2
status: pending
depends_on: [7]
---

# Task 008: SeasonalInsights SVG Chart + InfoPanel and City Page Integration

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /presentations-ui-design
Commands: /verify, /task-handoff

---

## Objective
Create the `SeasonalInsights` SVG bar chart showing 12 months of sunrise/sunset/day length data. Integrate into `InfoPanel` (collapsible) and the SEO city page (`/city/[slug]`).

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [MonthlySnapshot — from src/lib/seasonal-insights.ts (task-007)]
export interface MonthlySnapshot {
  month: number;
  monthName: string;
  sunrise: Date;
  sunset: Date;
  goldenHourStart: Date;
  dayLengthSeconds: number;
  peakElevation: number;
}
```

```typescript
// [City page location — src/app/city/[slug]/page.tsx]
// This is a server component (no "use client"). Import SeasonalInsights as a client component
// using next/dynamic with ssr: false, or pass precomputed data as props.
// City coordinates are available from the city data object.
```

```typescript
// [Store selectors for InfoPanel context]
const location = useSunTrackerStore((state) => state.location);
const dateTime = useSunTrackerStore((state) => state.dateTime);
// year = dateTime.getFullYear()
```

### Key Patterns in Use
- **SVG viewBox:** `viewBox="0 0 600 200"` + `width="100%"` for responsiveness.
- **Bar chart:** One bar per month. Bar top = sunrise time mapped to Y. Bar bottom = sunset time mapped to Y. Remaining top/bottom = night (dark fill). Day length shown by bar height.
- **Highlight:** Longest bar (most daylight) = amber fill. Shortest bar (least daylight) = sky-blue fill. Others = warm-gray.
- **Tooltip via `<title>`:** Each bar group `<g>` has a `<title>` child with the snapshot details (accessible hover text).
- **`useMemo`:** keyed on `lat + lng + year`.
- **City page:** Use `next/dynamic` with `ssr: false` to avoid SSR issues with the store.

### Architecture Decisions Affecting This Task
- ADR-1: SVG over charting library.
- City page receives coordinates as props (from existing city data); pass to `SeasonalInsights` as `lat`/`lng` props rather than reading from store.
- `SeasonalInsights` accepts optional `lat`/`lng` props (override store) to work in both InfoPanel and city page contexts.

---

## Handoff from Previous Task
> Populated by /task-handoff after task-007 completes.

**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps

1. Create `src/components/panels/seasonal-insights.tsx` as a `"use client"` component.
2. Props: `lat?: number`, `lng?: number` (falls back to store location if not provided).
3. Read `dateTime` from store; derive `year = dateTime.getFullYear()`.
4. Compute `snapshots = useMemo(() => computeSeasonalData(lat, lng, year), [lat, lng, year])`.
5. Find `maxDayLength` and `minDayLength` indices for highlight logic.
6. Define mapping helpers:
   - `timeToY(date: Date, minTime, maxTime): number` — maps time-of-day to SVG y within bar range.
   - `indexToX(i: number): number` — maps month index 0–11 to SVG x with padding.
7. Render SVG:
   - Background rect for night (dark).
   - Per month: `<g>` with `<title>` (tooltip text), `<rect>` for day portion (filled based on longest/shortest), `<text>` for 3-letter month abbreviation below.
   - Legend: coloured dots for "Longest day", "Shortest day", "Other months".
8. Add to `InfoPanel` as `<details>` section below `SkyPathDiagram`.
9. Edit `src/app/city/[slug]/page.tsx`:
   - Import `SeasonalInsights` via `next/dynamic({ ssr: false })`.
   - Pass city `lat` and `lng` as props.
10. Create `src/__tests__/components/seasonal-insights.test.tsx`:
    - Mock `computeSeasonalData` return value.
    - Assert 12 bar groups rendered.
    - Assert longest-day bar has highlight class/fill.

_Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
_Skills: /build-website-web-app — Next.js dynamic import; /presentations-ui-design — SVG chart_

---

## Acceptance Criteria
- [ ] SVG renders 12 bars without error.
- [ ] Longest and shortest day bars have distinct highlight fills.
- [ ] `<title>` tooltips contain sunrise time, sunset time, golden hour start, day length.
- [ ] Chart appears in InfoPanel as collapsible section.
- [ ] Chart renders on `/city/[slug]` page using city coordinates.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
