---
task: 002
feature: sun-tracker-v2
status: pending
depends_on: [1]
---

# Task 002: LightingInsightCard Component + InfoPanel Integration

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create `LightingInsightCard` component that renders the `LightingInsight` value from task-001. Integrate it into `PhotographerPanel` and add a collapsed "Lighting Tip" widget to `InfoPanel` for when photographer mode is off.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [PhotographerPanel structure — from src/components/panels/photographer-panel.tsx:98-106]
<div id="photographer-panel-content" className={isMobile && !isOpen ? "hidden" : "space-y-3"}>
  <div className="grid gap-2 sm:grid-cols-2">
    <GoldenHourCountdown sunData={sunData} />
    <BlueHourCountdown sunData={sunData} />
  </div>
  <BestDirectionIndicator sunData={sunData} dateTime={dateTime} />
  <WeeklyForecast location={location} dateTime={dateTime} />
</div>
// INSERT <LightingInsightCard> between BestDirectionIndicator and WeeklyForecast
```

```typescript
// [InfoPanel imports — from src/components/panels/info-panel.tsx:1-9]
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Compass } from "@/components/compass/compass";
import { LandmarkAlignmentPanel } from "@/components/panels/landmark-alignment-panel";
import { ShadowInfo } from "@/components/panels/shadow-info";
import { SunDataDisplay } from "@/components/panels/sun-data-display";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
```

```typescript
// [Store selectors pattern used in existing panels]
const sunData = useSunTrackerStore((state) => state.sunData);
const dateTime = useSunTrackerStore((state) => state.dateTime);
const photographerMode = useSunTrackerStore((state) => state.photographerMode);
```

```typescript
// [LightingInsight type — from src/lib/lighting-insight.ts (created in task-001)]
export type LightingLabel = "HARSH" | "SOFT" | "GOLDEN" | "BLUE" | "TWILIGHT" | "NIGHT";
export interface LightingInsight {
  label: LightingLabel;
  headline: string;
  warningMessage?: string;
  shotSuggestions: ShotSuggestion[];
}
```

### Key Patterns in Use
- **`"use client"` directive:** All panel components are client components.
- **Tailwind colour tokens:** amber-* for golden, sky-* for blue, red-* for harsh, zinc-* for soft/night/twilight.
- **Conditional rendering:** `if (!sunData) return null` at top of component.
- **Dynamic import in InfoPanel:** `PhotographerPanel` is already dynamically imported; new panels can be imported statically.

### Architecture Decisions Affecting This Task
- When photographer mode is off, show a collapsed `<details>` element in InfoPanel (not a full panel) to avoid visual noise.
- `LightingInsightCard` receives computed `LightingInsight` as a prop (not raw `SunData`) — keeps component pure/testable.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/lib/lighting-insight.ts` | New pure TS lib: exports `computeLightingInsight`, `LightingLabel`, `ShotSuggestion`, `LightingInsight` types, full shot-suggestion map and headline/warning constants |
| `src/__tests__/lib/lighting-insight.test.ts` | 17 unit tests covering all 6 label paths, boundary elevations, GOLDEN priority, purity, and no-mutation guarantee |

**Decisions made in previous task:**
- **GOLDEN/BLUE checked via `dateTime` window membership, not elevation** — per architecture: window-based labels take precedence; elevation-only classification is the fallback.
- **Shot suggestions as a compile-time constant map** — avoids repeated allocation; immutability preserved by returning the same array reference (read-only in practice).
- **`warningMessage` omitted when not applicable** — field is `undefined` rather than `null` or empty string, keeping output clean.

**Context for this task:**
`computeLightingInsight(sunData, dateTime)` is now available at `@/lib/lighting-insight`. It returns a `LightingInsight` object with `label`, `headline`, optional `warningMessage`, and `shotSuggestions[]`. The function is pure and side-effect free. Import it directly into `LightingInsightCard` and the panel integrations — no additional lib work needed.

**Open questions left by previous task:**
- None.
**Open questions left:** _(none yet)_

---

## Implementation Steps

1. Create `src/components/panels/lighting-insight-card.tsx`:
   - Props: `insight: LightingInsight`.
   - Map each `LightingLabel` to a colour scheme (badge background + border + text).
   - Render: coloured badge with label text, `headline` below, list of `shotSuggestions`, optional `warningMessage` chip.
   - No Zustand — pure presentational component.

2. Edit `src/components/panels/photographer-panel.tsx`:
   - Import `computeLightingInsight` from `@/lib/lighting-insight`.
   - Import `LightingInsightCard` from `@/components/panels/lighting-insight-card`.
   - Derive `insight = computeLightingInsight(sunData, dateTime)` inside the render path.
   - Place `<LightingInsightCard insight={insight} />` between `<BestDirectionIndicator>` and `<WeeklyForecast>`.

3. Edit `src/components/panels/info-panel.tsx`:
   - Import `computeLightingInsight` and `LightingInsightCard`.
   - Add a `<details>` element near the top of the panel body (visible when `!photographerMode`):
     ```tsx
     <details className="...">
       <summary>Lighting Tip</summary>
       <LightingInsightCard insight={computeLightingInsight(sunData, dateTime)} />
     </details>
     ```
   - Guard with `if (!sunData) return null` equivalent inside the details.

4. Create `src/__tests__/components/lighting-insight-card.test.tsx`:
   - Import `LightingInsightCard`.
   - Render with a mock `LightingInsight` for each label; assert badge text and suggestion text appear.
   - Assert `warningMessage` renders only when provided.

_Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
_Skills: /build-website-web-app — React component patterns_

---

## Acceptance Criteria
- [ ] `LightingInsightCard` renders all 6 label variants without error.
- [ ] Badge colour changes per label.
- [ ] `warningMessage` chip appears only when present on the insight.
- [ ] `LightingInsightCard` appears in `PhotographerPanel` when photographer mode is on and sunData exists.
- [ ] `<details>` Lighting Tip appears in `InfoPanel` when photographer mode is off.
- [ ] Time slider re-render updates the insight label (integration test or manual verify).
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
