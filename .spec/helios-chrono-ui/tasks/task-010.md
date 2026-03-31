---
task: 010
feature: helios-chrono-ui
status: complete
depends_on: [9]
---

# Task 010: Landmarks — Atmospheric Refraction Index Widget

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Add the Atmospheric Refraction Index widget to the bottom of the Landmarks page. It computes and displays the real-time bending of light at the horizon, shows a percentage and equatorial constant, and runs a per-landmark diagnostic on demand.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```ts
// [Atmospheric Refraction formula — standard Bennett formula]
// R = 1.02 / tan(h + 10.3 / (h + 5.11))   [arc-minutes]
// h = apparent altitude in degrees
// For h = 0° (horizon): R ≈ 34.5 arc-minutes ≈ 0.575°
// Convert to percentage of sun's diameter (0.53°): R / 0.53 * 100 ≈ 108%
// Equatorial constant: 0.0042 (refraction at equator, standard atmosphere)
```

```ts
// [SunData — current elevation, from store]
const sunData = useSunTrackerStore((state) => state.sunData);
// sunData.sunElevation: current altitude in degrees
```

```ts
// [Landmarks list now available from task-009]
import { LANDMARKS } from "@/lib/landmarks";
// Each landmark has lat, lng, name, and optional location string
```

```tsx
// [Stitch design — refraction widget layout]
// Dark card: bg-on-surface text-inverse-on-surface
// Title: "REAL-TIME GLOBAL VECTOR" label + "Atmospheric Refraction Index" heading
// Large percentage display: "74%" in font-headline text-6xl text-primary-container
// Circular progress ring (SVG) around the percentage
// Below: "Equatorial Standard: +0.0042" in secondary text
// "RUN DIAGNOSTIC" button: bg-surface-container text-on-surface rounded-xl
// When diagnostic runs: table of per-landmark refraction adjustments (arcseconds)
```

### Key Patterns in Use
- Refraction percentage: `R_arcmin / 32 * 100` where R is in arc-minutes and 32 arc-min ≈ sun's apparent diameter.
- The circular progress ring: SVG `<circle>` with `stroke-dasharray` and `stroke-dashoffset` to fill based on percentage.
- Dark card variant: `bg-inverse-surface text-inverse-on-surface` — this is the one place the design uses a dark surface.
- Diagnostic table: rows of `{ name, refractionArcSec }` computed per landmark using their lat at current time's sun elevation at those coordinates.
- "RUN DIAGNOSTIC" triggers a `useState<boolean>` that shows/hides the table.

### Architecture Decisions Affecting This Task
- The widget is a self-contained client component — no new API route needed.
- Refraction is computed purely in the component from `sunData.sunElevation`.
- The diagnostic computes `computeSunData` at each landmark's lat/lng for the current time, then applies the refraction formula to each landmark's current sun elevation.
- The dark card background (`bg-inverse-surface`) is an intentional design exception matching the stitch design.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/types/sun.ts` | Extended Landmark interface with optional location, category, imageGradient fields |
| `src/lib/landmarks.ts` | Added Stonehenge, Giza Pyramids, Chichen Itza + extended all landmarks with location/category/imageGradient |
| `src/app/api/landmarks/route.ts` | GET route returning landmarks with currentAzimuth/currentAltitude computed at request time |
| `src/components/landmarks/landmark-card.tsx` | Client component with gradient image area, location badges, selection state (LIVE TRACKING) |
| `src/app/landmarks/page.tsx` | Full landmarks page with filter tabs (Historic/Technical), sort toggle (Solar Proximity/A-Z), and card grid |

**Decisions made in previous task:**
- **Grade placeholder images** — CSS gradient placeholders (from-amber-900 to-stone-700) enable fast iteration without external image dependencies
- **Client-side filtering** — Filter state is local (useState) for snappy UX; LANDMARKS is small enough to filter in-component
- **Real-time sun data** — `/api/landmarks` computes sunData on-demand per landmark, no caching; marked as `force-dynamic`
- **Reused store integration** — Landmarks leverage existing `useSunTrackerStore.selectedLandmark` for cross-page state management

**Context for this task:**
The landmarks page is complete and stable with 7 landmarks (4 technical + 3 historic). Task-010 now adds the Atmospheric Refraction Index widget to the page footer. The widget computes real-time atmospheric refraction from the current `sunData.sunElevation` and displays it as a percentage in a dark card with optional per-landmark diagnostic. The component can import `LANDMARKS` directly and leverage the same `computeSunData` function used in the API route.



## Implementation Steps

1. **Create `src/components/landmarks/refraction-index.tsx`** (`"use client"`):
   - Reads `sunData` from `useSunTrackerStore`.
   - Computes `R` (arc-minutes) using Bennett formula from `sunData.sunElevation` (guard for elevation ≤ -1°).
   - Computes `percentage = Math.min(100, Math.round(R / 32 * 100))`.
   - Layout (dark card: `bg-inverse-surface rounded-2xl p-6`):
     - Top label: "REAL-TIME GLOBAL VECTOR" in `text-xs tracking-widest uppercase text-inverse-on-surface/60`.
     - Title: "Atmospheric Refraction Index" in `font-headline text-xl text-inverse-on-surface`.
     - Centre: SVG circular ring (r=60) + `{percentage}%` in `font-headline text-5xl text-primary-container`.
     - Below ring: "Equatorial Standard: +0.0042" in `text-sm text-inverse-on-surface/70`.
     - `RUN DIAGNOSTIC` button: `bg-surface-container text-on-surface rounded-xl px-4 py-2 text-sm font-medium`.
   - Diagnostic table (visible when `isDiagnosticRunning`):
     - Trigger: `onClick` calls `computeDiagnostic()` — iterates `LANDMARKS`, calls `computeSunData` for each at current `dateTime`, applies Bennett formula.
     - Table columns: Landmark name | Elevation° | Refraction (arc-sec) | Adjustment.
     - Table style: `bg-surface-container-lowest rounded-xl p-3 mt-4 space-y-2`.

2. **Edit `src/app/landmarks/page.tsx`**:
   - Import and render `<RefractionIndex />` at the bottom of the page, below the card grid.

3. **Run `/verify`**.

_Requirements: FR-5 Landmarks Tab_
_Skills: /build-website-web-app — SVG ring + computation_

---

## Acceptance Criteria
- [ ] Widget renders on the Landmarks page.
- [ ] Percentage value changes as sun elevation changes (time slider).
- [ ] Circular SVG ring fills proportionally to percentage.
- [ ] "Equatorial Standard: +0.0042" text is visible.
- [ ] "RUN DIAGNOSTIC" button reveals per-landmark refraction table.
- [ ] No error when sun elevation ≤ 0° (night-time guard).
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/landmarks/refraction-index.tsx` | Atmospheric refraction widget with diagnostic | pending |
| `src/app/landmarks/page.tsx` | Added RefractionIndex at bottom of page | pending |

**Decisions made:** _(fill in after completion)_
**Context for next task:** Landmarks tab complete. Task-011 is independent (Observatory).
**Open questions:** _(none)_
