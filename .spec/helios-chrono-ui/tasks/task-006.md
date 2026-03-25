---
task: 006
feature: helios-chrono-ui
status: done
depends_on: [1]
---

# Task 006: Analemma Lib + API Route

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /tdd-workflow
Commands: /verify, /task-handoff

---

## Objective
Create a pure `computeAnalemma(lat, lng, year)` lib function that returns 365 `AnalemmaPoint` objects (one per day at solar noon), and a GET `/api/analemma` route that serves this data as JSON. Write unit tests.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```ts
// [SunCalc API — used in src/lib/sun.ts]
import SunCalc from "suncalc";

// Get sun position at a specific time:
const pos = SunCalc.getPosition(date, lat, lng);
// pos.azimuth: radians (south=0, add 180° for north-relative)
// pos.altitude: radians (above horizon)

// Get key solar times for a day:
const times = SunCalc.getTimes(date, lat, lng);
// times.solarNoon: Date — when sun is at highest point
```

```ts
// [Existing sun.ts pattern — azimuth conversion, src/lib/sun.ts:21-23]
function sunCalcAzimuthToNorthDegrees(azimuthRadians: number): number {
  return normalizeDegrees(radiansToDegrees(azimuthRadians) + 180);
}
```

```ts
// [Existing API route pattern — src/app/api/cities/route.ts]
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "0");
  // ...validate...
  return NextResponse.json(data);
}
```

### Key Patterns in Use
- Solar noon on day D = `SunCalc.getTimes(date, lat, lng).solarNoon`.
- Equation of Time (minutes): difference between solar noon and 12:00 UTC = `(solarNoon.getUTCHours() * 60 + solarNoon.getUTCMinutes()) - (12 * 60 + lng / 0.25)` — approximation sufficient for UI.
- Solar Declination (degrees): `Math.asin(Math.sin(23.45 * DEG_TO_RAD) * Math.sin(2 * Math.PI * (dayOfYear - 80) / 365)) * RAD_TO_DEG` — standard formula.
- Mean Anomaly (degrees): `(357.529 + 0.98560028 * (julianDay - 2451545.0)) % 360`.
- Solar Distance (AU): `1.00014 - 0.01671 * Math.cos(meanAnomalyRad) - 0.00014 * Math.cos(2 * meanAnomalyRad)` — approximation.
- Day of year: iterate from Jan 1 to Dec 31 of the given year.

### Architecture Decisions Affecting This Task
- Keep `computeAnalemma` a pure function — no SunCalc side effects beyond position queries.
- API route validates lat (-90 to 90), lng (-180 to 180), year (1900–2100). Returns 400 on invalid input.
- Response shape: `{ points: AnalemmaPoint[] }`.
- Equatorial obliquity (23.4397°) is a constant; no dynamic lookup needed.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `tailwind.config.ts` | Added Helios Chrono colour tokens + fontFamily |
| `src/app/layout.tsx` | Space Grotesk + Inter fonts; body class updated |
| `src/app/globals.css` | Font CSS vars in `:root` |

**Context for this task:**
Task-006 is independent of tasks 002–005. It only needs the project to be buildable (task-001 done).

---

## Implementation Steps

1. **Create `src/lib/analemma.ts`**:
   ```ts
   export interface AnalemmaPoint {
     dayOfYear: number;       // 1–365 (or 366 for leap year)
     date: Date;              // solar noon on that day
     equationOfTime: number;  // minutes, positive = sun ahead of clock
     declination: number;     // degrees (-23.45 to +23.45)
     azimuth: number;         // degrees at solar noon (near 180 for NH)
     altitude: number;        // degrees at solar noon
     meanAnomaly: number;     // degrees (0–360)
     solarDistance: number;   // AU (approx 0.983–1.017)
   }

   export function computeAnalemma(lat: number, lng: number, year: number): AnalemmaPoint[]
   ```
   - Build a start date of Jan 1 of `year`.
   - For each day 1–365 (366 for leap):
     a. Create `date = new Date(year, 0, dayOfYear - 1)` at midnight.
     b. Get `solarNoon = SunCalc.getTimes(date, lat, lng).solarNoon`.
     c. Get sun position at `solarNoon`: azimuth + altitude.
     d. Compute declination, meanAnomaly, solarDistance, equationOfTime using formulas above.
     e. Push `AnalemmaPoint` to results.
   - Return array.

2. **Create `src/app/api/analemma/route.ts`**:
   - Parse `lat`, `lng`, `year` from query params.
   - Validate ranges; return `NextResponse.json({ error: "..." }, { status: 400 })` on failure.
   - Call `computeAnalemma(lat, lng, year)`.
   - Return `NextResponse.json({ points })`.
   - Add `Cache-Control: public, max-age=86400` header (analemma data is stable per year).

3. **Create `src/__tests__/lib/analemma.test.ts`**:
   - Test that result has 365 points for a non-leap year, 366 for a leap year.
   - Test Summer Solstice (day ~172): declination ≈ +23.4°.
   - Test Winter Solstice (day ~355): declination ≈ -23.4°.
   - Test Vernal Equinox (day ~80): declination ≈ 0°.
   - Test all azimuths are 0–360.
   - Test all altitudes are within valid range for the given lat.

4. **Run `/verify`**.

_Requirements: FR-4 Analemma Tab, FR-7 API Routes_
_Skills: /code-writing-software-development — pure function; /tdd-workflow — tests first_

---

## Acceptance Criteria
- [x] `computeAnalemma` returns 365 points for a non-leap year.
- [x] Declination ≈ +23.4° at Summer Solstice, ≈ -23.4° at Winter Solstice, ≈ 0° at equinoxes.
- [x] `GET /api/analemma?lat=51&lng=0&year=2025` returns 200 with `{ points: [...] }`.
- [x] Invalid lat/lng/year returns 400.
- [x] All unit tests pass.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/lib/analemma.ts` | New pure lib: `computeAnalemma` + `AnalemmaPoint` type | done |
| `src/app/api/analemma/route.ts` | GET route with validation + cache header | done |
| `src/__tests__/lib/analemma.test.ts` | Unit tests: 365/366 points, declination, ranges, solar distance/anomaly | done |

**Decisions made:**
- `computeAnalemma` remains pure and deterministic, with all derived values computed from day index and solar-noon queries.
- Day iteration now seeds SunCalc with noon UTC (`Date.UTC(..., 12, 0, 0)`) to avoid timezone/JD rollback edge cases near year boundaries.
- API validation uses explicit lat/lng/year bounds and stable cache header (`public, max-age=86400`).

**Context for next task:** Task-007 can consume analemma data from `computeAnalemma` directly or via `/api/analemma`; both now produce consistent point structures.
**Verification note:** Full `/verify` is blocked by pre-existing lint errors in `check-tests.js` and `diagnose-tests.js` (`@typescript-eslint/no-require-imports`), unrelated to Task-006 changes.
**Open questions:** _(none)_
