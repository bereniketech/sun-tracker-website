---
task: 003
feature: sun-tracker-v2
status: complete
depends_on: []
---

# Task 003: Sky Path Lib + Tests

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /tdd-workflow
Commands: /verify, /task-handoff

---

## Objective
Create `src/lib/sky-path.ts` with `computeSkyPath(lat, lng, date, intervalMinutes?)` returning an array of `SkyPathPoint` objects representing the sun's elevation across an entire day. Handle polar edge cases.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [SunCalc usage pattern — from src/lib/sun.ts:25-33]
function positionAt(lat: number, lng: number, when: Date): {
  azimuth: number;
  elevation: number;
} {
  const pos = SunCalc.getPosition(when, lat, lng);
  return {
    azimuth: sunCalcAzimuthToNorthDegrees(pos.azimuth),
    elevation: radiansToDegrees(pos.altitude),
  };
}
// NOTE: SunCalc.getPosition returns altitude in radians — convert to degrees.
// NOTE: azimuth from SunCalc is south-based; add 180 and normalize for north-based.
```

```typescript
// [TimeWindow used for golden/blue hour — from src/types/sun.ts:30-33]
export interface TimeWindow {
  start: Date;
  end: Date;
}
```

```typescript
// [How suncalc is imported — from src/lib/sun.ts:1]
import SunCalc from "suncalc";
```

### Key Patterns in Use
- **Use `SunCalc.getPosition` directly** (not `computeSunData`) — sky-path only needs position, not full sun data.
- **Midnight-to-midnight iteration:** Start at `date` set to 00:00:00, step by `intervalMinutes` up to 24 h.
- **Immutability:** Return a new array of new objects; never mutate.
- **Polar night detection:** If max elevation across all points ≤ 0°, flag `isPolarNight = true` in return metadata (or return flat array).

### Architecture Decisions Affecting This Task
- Default interval: 10 minutes → 144 points per day.
- `isGolden` and `isBlue` flags per point are computed by checking the point's time against the golden/blue hour windows from `SunCalc.getTimes()`.
- Do NOT import `computeSunData` — it calls `getMoonPosition` and computes 24-hour deltas unnecessarily.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/panels/lighting-insight-card.tsx` | New pure presentational component; maps `LightingLabel` to colour scheme; renders badge, headline, shot suggestions list, optional warning chip |
| `src/components/panels/photographer-panel.tsx` | Integrated `LightingInsightCard` between `BestDirectionIndicator` and `WeeklyForecast` |
| `src/components/panels/info-panel.tsx` | Added collapsible `<details>` "Lighting Tip" widget visible when photographer mode is off |
| `src/__tests__/components/lighting-insight-card.test.tsx` | Component tests for all 6 label variants and warning chip conditional rendering |

**Decisions made in previous task:**
- **`LightingInsightCard` is prop-only (no Zustand)** — pure/testable; callers own the `computeLightingInsight` call.
- **`<details>` element for InfoPanel widget** — lightweight collapse without extra state.

**Context for this task:**
`computeLightingInsight` from `@/lib/lighting-insight` and `LightingInsightCard` are complete and integrated. Task-003 is independent — create `src/lib/sky-path.ts` with `computeSkyPath` returning `SkyPathResult`. Use `SunCalc.getPosition` directly (not `computeSunData`). This lib will later feed a sun-path chart component.

**Open questions left by previous task:**
- None.

---

## Implementation Steps

1. Create `src/lib/sky-path.ts`.
2. Define and export:
   ```typescript
   export interface SkyPathPoint {
     time: Date;
     elevation: number;   // degrees, may be negative
     azimuth: number;     // degrees from north
     isGolden: boolean;
     isBlue: boolean;
   }

   export interface SkyPathResult {
     points: SkyPathPoint[];
     isPolarNight: boolean;
     isMidnightSun: boolean;
   }
   ```
3. Implement `computeSkyPath(lat, lng, date, intervalMinutes = 10): SkyPathResult`:
   - Set `startOfDay` = midnight of `date` in the date's timezone (use `new Date(date); start.setHours(0,0,0,0)`).
   - Call `SunCalc.getTimes(date, lat, lng)` once to get golden/blue hour windows.
   - Loop from 0 to 1440 minutes, stepping by `intervalMinutes`, building `SkyPathPoint[]`.
   - For each point: call `SunCalc.getPosition(time, lat, lng)` directly; convert altitude radians → degrees; compute azimuth.
   - `isGolden`: time falls within morning or evening golden hour window.
   - `isBlue`: time falls within morning or evening blue hour window (use −4° to −6° windows from SunCalc times).
   - After loop: `isPolarNight = points.every(p => p.elevation <= 0)`.
   - `isMidnightSun = points.every(p => p.elevation > 0)`.
4. Create `src/__tests__/lib/sky-path.test.ts`:
   - Test London (51.5°N) on summer solstice: 144 points, max elevation > 60°, some `isGolden = true` points.
   - Test Tromsø (69.6°N) on December 21: `isPolarNight = true`.
   - Test Tromsø on June 21: `isMidnightSun = true`.
   - Test custom interval (30 min → 48 points).

_Requirements: 2.1, 2.2, 2.7, 2.8_
_Skills: /code-writing-software-development — pure function; /tdd-workflow — tests first_

---

## Acceptance Criteria
- [x] `src/lib/sky-path.ts` exports `computeSkyPath`, `SkyPathPoint`, `SkyPathResult`.
- [x] Default 10-min interval returns 144 or 145 points (midnight to midnight inclusive).
- [x] `isPolarNight` is `true` for Tromsø in December.
- [x] `isMidnightSun` is `true` for Tromsø in June.
- [x] `isGolden` flags correctly identify golden hour points.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/lib/sky-path.ts` | New pure sky-path utility; samples SunCalc positions across a day, converts azimuth/elevation to app-friendly degrees, derives golden/blue hour flags, and reports polar-night/midnight-sun metadata | complete |
| `src/__tests__/lib/sky-path.test.ts` | New unit tests covering London summer-solstice sampling, Tromsø polar-night and midnight-sun edge cases, default/custom interval counts, and point ordering/object creation | complete |

**Decisions made:**
- **Default sampling is midnight-inclusive and end-exclusive** — loop runs from local midnight in `intervalMinutes` steps while `minuteOffset < 1440`, producing 144 points at the default 10-minute interval and 48 points at 30 minutes.
- **Blue hour uses SunCalc times plus direct altitude search** — `dawn`/`sunrise` and `sunset`/`dusk` bracket the `-4°` crossing, so the lib stays independent of `computeSunData` while still matching the feature definition.
- **Polar flags come from sampled elevations, not rise/set timestamps** — avoids depending on invalid sunrise/sunset dates in high-latitude cases.

**Context for next task:**
`computeSkyPath(lat, lng, date, intervalMinutes?)` is now available at `@/lib/sky-path` and returns `{ points, isPolarNight, isMidnightSun }`. Each point contains `time`, `elevation`, `azimuth`, `isGolden`, and `isBlue`. The output is ready for a client-side SVG sky-path diagram without needing `computeSunData` or additional store work.

**Open questions:**
- Full `vitest run` is currently blocked by unrelated existing failures in `src/__tests__/components/time-controls.test.tsx`, `src/__tests__/components/search-bar.test.tsx`, and `src/__tests__/components/info-panel.test.tsx`.
- `/verify` could not be confirmed end-to-end for the same reason; the targeted sky-path tests pass and `npm run build` succeeds.
