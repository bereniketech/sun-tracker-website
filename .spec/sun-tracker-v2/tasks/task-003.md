---
task: 003
feature: sun-tracker-v2
status: pending
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
> Empty for task-003 (parallel with task-001).

**Files changed by previous task:** _(none)_
**Decisions made:** _(none)_
**Context for this task:** _(none)_
**Open questions left:** _(none)_

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
- [ ] `src/lib/sky-path.ts` exports `computeSkyPath`, `SkyPathPoint`, `SkyPathResult`.
- [ ] Default 10-min interval returns 144 or 145 points (midnight to midnight inclusive).
- [ ] `isPolarNight` is `true` for Tromsø in December.
- [ ] `isMidnightSun` is `true` for Tromsø in June.
- [ ] `isGolden` flags correctly identify golden hour points.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
