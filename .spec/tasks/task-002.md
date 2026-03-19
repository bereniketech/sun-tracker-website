---
task: 002
feature: sun-tracker-website
status: complete
depends_on: [001]
---

# Task 002: Build SunCalc wrapper and Zustand store

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /tdd-workflow
Commands: /verify, /task-handoff

---

## Objective
Create a typed SunCalc wrapper (`src/lib/sun.ts`) that computes all sun data fields from the `SunData` interface. Create the Zustand store (`src/store/sun-tracker-store.ts`) that holds location, time, sun data, and UI state. Write comprehensive unit tests achieving 90%+ coverage on `lib/sun.ts`.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- ADR-1: Client-side SunCalc — all calculations run in the browser, no server round-trips
- ADR-3: Zustand for state management — selective subscriptions prevent unnecessary re-renders
- SunData interface and SunTrackerState interface defined in design.md

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/types/sun.ts` — define `SunData`, `OverlayType`, `SunTrackerState` interfaces from design doc
2. Create `src/lib/sun.ts`:
   - `computeSunData(lat, lng, dateTime): SunData` — wraps SunCalc.getTimes, SunCalc.getPosition, SunCalc.getMoonPosition
   - Compute golden hour: sun altitude between 0° and 6° above horizon (evening: before sunset; morning: after sunrise)
   - Compute blue hour: sun altitude between -6° and -4° below horizon
   - Compute shadow direction: sun azimuth + 180° (mod 360)
   - Compute shadow length ratio: `1 / Math.tan(elevation in radians)` (when elevation > 0)
   - Compute day length: sunset - sunrise in seconds
   - Compute day length change: compare with previous day
3. Create `src/store/sun-tracker-store.ts` — Zustand store implementing `SunTrackerState`
   - `setLocation` recomputes sun data
   - `setDateTime` recomputes sun data
   - `toggleOverlay` adds/removes from activeOverlays set
4. Write tests in `src/__tests__/lib/sun.test.ts`:
   - Test NYC (40.7128, -74.0060) on June 21 2025 — verify sunrise, sunset, azimuth within ±2 minutes / ±1°
   - Test edge cases: polar region (Tromsø in summer — midnight sun), equator
   - Test shadow calculations
5. Write tests in `src/__tests__/store/sun-tracker-store.test.ts`:
   - Test setLocation updates sunData
   - Test setDateTime updates sunData
   - Test toggleOverlay

_Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
_Skills: /code-writing-software-development, /tdd-workflow_

---

## Acceptance Criteria
- [ ] `computeSunData` returns all SunData fields correctly for NYC June 21
- [ ] Golden/blue hour times are accurate within ±5 minutes of reference values
- [ ] Shadow direction = sun azimuth + 180° (mod 360)
- [ ] Shadow length ratio correct for known elevations
- [ ] Day length change computed correctly
- [ ] Zustand store actions update state and recompute sun data
- [ ] 90%+ test coverage on `lib/sun.ts`
- [ ] All tests pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:**
- `src/types/sun.ts`
- `src/lib/sun.ts`
- `src/store/sun-tracker-store.ts`
- `src/__tests__/lib/sun.test.ts`
- `src/__tests__/store/sun-tracker-store.test.ts`
- `eslint.config.mjs` (fixed flat-config compatibility for lint)
- `.spec/tasks.md` (Task 2 marked complete)

**Decisions made:**
- Implemented a typed `SunData` + `SunTrackerState` contract in `src/types/sun.ts` based on `design.md`.
- Built `computeSunData` in `src/lib/sun.ts` using `SunCalc.getTimes`, `SunCalc.getPosition`, and `SunCalc.getMoonPosition`.
- Converted SunCalc azimuth to degrees-from-north and elevation to degrees.
- Implemented blue-hour calculation (`-6°` to `-4°`) using altitude crossing search around sunrise/sunset.
- Added polar fallback behavior for day length when sunrise/sunset are unavailable.
- Implemented immutable Zustand actions for location, datetime, overlays, and photographer mode.

**Context for next task:**
- Store is ready for map integration:
   - `setLocation(lat, lng, name?)` recomputes `sunData`
   - `setDateTime(dt)` recomputes `sunData` when location is set
   - `activeOverlays` is a `Set<OverlayType>` with defaults for sun/shadow/path layers
- `sunData` now contains sunrise/sunset/noon, golden/blue windows, azimuth/elevation, shadow metrics, and day-length delta.
- Tests are in place and passing for both `lib/sun.ts` and the store.

**Open questions:**
- None blocking for Task 3. The map layer can consume the existing store and sun data directly.
