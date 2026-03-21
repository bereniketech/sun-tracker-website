---
task: 001
feature: sun-tracker-v2
status: pending
depends_on: []
---

# Task 001: Lighting Insight Lib + Tests

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /tdd-workflow
Commands: /verify, /task-handoff

---

## Objective
Create a pure TypeScript function `computeLightingInsight(sunData, dateTime)` in `src/lib/lighting-insight.ts` that classifies current lighting conditions into one of 6 labels and returns shot suggestions. Write full unit tests.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [SunData interface — from src/types/sun.ts:35-51]
export interface SunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  goldenHour: TimeWindow;
  goldenHourEvening: TimeWindow;
  blueHour: TimeWindow;
  blueHourEvening: TimeWindow;
  sunAzimuth: number;
  sunElevation: number;
  sunriseAzimuth: number;
  sunsetAzimuth: number;
  shadowDirection: number;
  shadowLengthRatio: number;
  dayLength: number;
  dayLengthChange: number;
}

// [TimeWindow — from src/types/sun.ts:30-33]
export interface TimeWindow {
  start: Date;
  end: Date;
}
```

```typescript
// [Example lib pattern — from src/lib/sun.ts:107]
export function computeSunData(lat: number, lng: number, dateTime: Date): SunData {
  // pure function, no side effects, returns new object
}
```

### Key Patterns in Use
- **Immutability:** All lib functions return new objects, never mutate inputs.
- **Pure functions:** No side effects, no imports of React or browser APIs.
- **File naming:** kebab-case, co-located test in `src/__tests__/lib/`.
- **Test runner:** Vitest (`vitest run`). No Jest.

### Architecture Decisions Affecting This Task
- Classification priority: GOLDEN > BLUE > TWILIGHT > NIGHT > HARSH > SOFT (golden/blue windows take precedence over elevation-only).
- Types live in the same lib file (no separate types file for this feature).

---

## Handoff from Previous Task
> Empty for task-001.

**Files changed by previous task:** _(none)_
**Decisions made:** _(none)_
**Context for this task:** _(none)_
**Open questions left:** _(none)_

---

## Implementation Steps

1. Create `src/lib/lighting-insight.ts`.
2. Define and export types:
   ```typescript
   export type LightingLabel = "HARSH" | "SOFT" | "GOLDEN" | "BLUE" | "TWILIGHT" | "NIGHT";
   export interface ShotSuggestion { label: string; technique?: string; }
   export interface LightingInsight {
     label: LightingLabel;
     headline: string;
     warningMessage?: string;
     shotSuggestions: ShotSuggestion[];
   }
   ```
3. Implement `computeLightingInsight(sunData: SunData, dateTime: Date): LightingInsight`:
   - Check golden hour windows first: if `dateTime >= goldenHour.start && dateTime <= goldenHour.end` OR within `goldenHourEvening` → GOLDEN.
   - Then blue hour: within `blueHour` or `blueHourEvening` → BLUE.
   - Then by elevation: ≤ 0° → NIGHT, 0° < elev ≤ 6° → TWILIGHT, elev > 45° → HARSH, else → SOFT.
4. Define shot suggestions constant map (one object per label, at least 2 suggestions each).
5. Create `src/__tests__/lib/lighting-insight.test.ts`:
   - Import `computeLightingInsight` and a factory helper to build minimal `SunData`.
   - Test all 6 label paths with boundary elevations.
   - Test that GOLDEN takes priority over HARSH (high elevation during golden window).
   - Test NIGHT when elevation ≤ 0.

_Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
_Skills: /code-writing-software-development — pure function patterns; /tdd-workflow — tests first_

---

## Acceptance Criteria
- [ ] `src/lib/lighting-insight.ts` exists and exports `computeLightingInsight`, `LightingLabel`, `ShotSuggestion`, `LightingInsight`.
- [ ] All 6 label paths covered by parametrized tests.
- [ ] GOLDEN takes priority over elevation-only labels (tested).
- [ ] Function is pure: given same inputs always returns same output.
- [ ] `vitest run` passes with 0 failures.
- [ ] `/verify` passes (TypeScript, lint).

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
