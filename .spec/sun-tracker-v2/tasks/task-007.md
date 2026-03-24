---
task: 007
feature: sun-tracker-v2
status: complete
depends_on: []
---

# Task 007: Seasonal Insights Lib + Tests

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /tdd-workflow
Commands: /verify, /task-handoff

---

## Objective
Create `src/lib/seasonal-insights.ts` with `computeSeasonalData(lat, lng, year)` returning 12 `MonthlySnapshot` entries (one per month, reference date the 21st). Full unit tests.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [computeSunData — from src/lib/sun.ts:107]
export function computeSunData(lat: number, lng: number, dateTime: Date): SunData
// Returns SunData with: sunrise, sunset, goldenHour, goldenHourEvening, dayLength, sunElevation, etc.
// Use this as the calculation source — Req 4.7 forbids introducing new calculation libraries.
```

```typescript
// [SunData fields relevant to seasonal — from src/types/sun.ts:35-51]
export interface SunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  goldenHour: TimeWindow;   // morning golden hour
  goldenHourEvening: TimeWindow;  // evening golden hour
  dayLength: number;        // seconds
  sunElevation: number;     // current elevation at dateTime
}
```

### Key Patterns in Use
- **Reference date:** 21st of each month at 12:00:00 local (noon) — use `new Date(year, month, 21, 12, 0, 0)` (JS month is 0-indexed).
- **Peak elevation:** Pass the reference noon date — `sunElevation` at noon approximates peak.
- **Immutability:** Build a new array of new objects; do not mutate.
- **No SunCalc direct calls:** Use `computeSunData()` exclusively per Req 4.7.

### Architecture Decisions Affecting This Task
- 12 calls to `computeSunData` (one per month) — acceptable; each call is ~1 ms.
- `goldenHourStart` = `goldenHourEvening.start` (evening golden hour start = most useful planning value).
- Month names hardcoded as English strings in the constants (not i18n in v2).

---

## Handoff from Previous Task
> Empty for task-007 (parallel with task-001, 003, 005).

**Files changed by previous task:** _(none)_
**Decisions made:** _(none)_
**Context for this task:** _(none)_
**Open questions left:** _(none)_

---

## Implementation Steps

1. Create `src/lib/seasonal-insights.ts`.
2. Define and export:
   ```typescript
   export interface MonthlySnapshot {
     month: number;           // 1–12
     monthName: string;
     sunrise: Date;
     sunset: Date;
     goldenHourStart: Date;   // evening golden hour start
     dayLengthSeconds: number;
     peakElevation: number;   // elevation at solar noon on the 21st
   }
   ```
3. Define `MONTH_NAMES: string[]` constant (January … December).
4. Implement `computeSeasonalData(lat, lng, year): MonthlySnapshot[]`:
   - Loop `month` from 0 to 11 (JS Date month index).
   - For each: `refDate = new Date(year, month, 21, 12, 0, 0)`.
   - Call `computeSunData(lat, lng, refDate)`.
   - Map to `MonthlySnapshot`.
5. Create `src/__tests__/lib/seasonal-insights.test.ts`:
   - Test London (51.5°N, −0.12°E) for year 2024.
   - Assert 12 entries returned.
   - Assert June (index 5) has longer `dayLengthSeconds` than December (index 11).
   - Assert December has shorter `dayLengthSeconds` than any other month.
   - Assert `peakElevation` higher in summer than winter.

_Requirements: 4.1, 4.2, 4.5, 4.7_
_Skills: /code-writing-software-development — pure function; /tdd-workflow_

---

## Acceptance Criteria
- [x] `src/lib/seasonal-insights.ts` exports `computeSeasonalData` and `MonthlySnapshot`.
- [x] Returns exactly 12 entries.
- [x] June entry has longer day length than December entry for northern hemisphere.
- [x] `monthName` strings are correct English month names.
- [x] `vitest run` passes.
- [x] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** `src/lib/seasonal-insights.ts`, `src/__tests__/lib/seasonal-insights.test.ts`, `src/__tests__/components/home-page-client.test.tsx`
**Decisions made:** Use `computeSunData()` as the only calculation source; compute snapshots from the 21st of each month at local noon; expose evening golden hour start as `goldenHourStart`.
**Context for next task:** `MonthlySnapshot` now exists and returns ordered English month labels plus sunrise, sunset, evening golden-hour start, day-length seconds, and noon elevation. Full Vitest suite passed during verification, and the `HomePageClient` test's unused import warning was removed so lint is clean. Repo-wide coverage reported `63.36%` overall even though the new seasonal-insights module is fully covered.
**Open questions:** Whether the global coverage baseline should be raised to meet the documented `80%` project target before broader task sign-off.
