---
task: 005
feature: helios-chrono-ui
status: done
depends_on: [4]
---

# Task 005: Dashboard — Map, Day Cycle, Photographic Windows

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Complete the dashboard layout: integrate the map into the new layout, create the Day Cycle panel (Sunrise/Solar Noon/Sunset) and Photographic Windows panel (Golden Hour + Blue Hour), and wire everything into the final desktop/mobile grid matching the stitch design.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```tsx
// [SunData time fields — src/types/sun.ts:37-45]
export interface SunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  goldenHour: TimeWindow;      // morning golden: sunrise → goldenHourEnd
  goldenHourEvening: TimeWindow; // evening golden: goldenHour → sunset
  blueHour: TimeWindow;         // morning blue hour window
  blueHourEvening: TimeWindow;  // evening blue hour window
  sunriseAzimuth: number;
  sunsetAzimuth: number;
}
```

```tsx
// [GoldenHourCountdown — src/components/panels/golden-hour-countdown.tsx]
// Props: { sunData: SunData }
// Renders a countdown to golden hour with phase label.
```

```tsx
// [BlueHourCountdown — src/components/panels/blue-hour-countdown.tsx]
// Props: { sunData: SunData }
// Renders a countdown to blue hour with phase label.
```

```tsx
// [Current map + controls section — src/components/home-page-client.tsx:121-145]
<div className="flex flex-col gap-4 lg:flex-row lg:items-start">
  <div className="min-w-0 lg:flex-1">
    <InteractiveMap />
  </div>
  <div className="flex flex-col gap-4 lg:w-80 lg:flex-shrink-0">
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <TimeSlider />
      <DatePicker />
      <AnimateButton />
      <NowButton />
    </div>
    <InfoPanel />
  </div>
</div>
```

### Key Patterns in Use
- Format time: `new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date)`.
- Format azimuth direction: utility function (create or inline) mapping degrees to compass label.
- Map: `InteractiveMap` takes no required props — reads from store internally.
- Controls (TimeSlider, DatePicker, etc.) are also store-driven, no prop changes needed.
- Stitch layout: mobile = full-width stack; desktop = 3-column (left sidebar | center map | right panel).

### Architecture Decisions Affecting This Task
- `DayColorPanel` and `PhotoWindowsPanel` are new components; they receive `sunData` as props.
- On mobile: stack order is metrics → map → day cycle → photo windows.
- On desktop (lg+): left col (metrics + controls) | center col (map) | right col (day cycle + photo windows).
- Keep existing `InfoPanel`, `SharePanel`, `FavoritesPanel` — they move to a "details" section below the 3-col grid.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/dashboard/solar-metrics.tsx` | New metric cards at top of dashboard |
| `src/components/home-page-client.tsx` | Old stats strip removed; SolarMetrics added at top |

---

## Implementation Steps

1. **Create `src/components/dashboard/day-cycle.tsx`**:
   - Props: `sunData: SunData | null`.
   - Section label: "DAY CYCLE" in `text-xs font-label tracking-widest uppercase text-secondary`.
   - Three rows: Sunrise, Solar Noon, Sunset.
   - Each row: left = lucide icon (`Sunrise`, `Sun`, `Sunset`) in `text-primary` + label; right = time in `font-headline text-lg text-on-surface` + azimuth in `text-secondary text-xs`.
   - Container: `bg-surface-container-low rounded-2xl p-4` — no border.

2. **Create `src/components/dashboard/photo-windows.tsx`**:
   - Props: `sunData: SunData | null`.
   - Section label: "PHOTOGRAPHIC WINDOWS".
   - Golden Hour row: orange accent, start–end time range, "Warm directional warmth" subtitle.
   - Blue Hour row: blue accent (`text-[#505f76]`), start–end time range.
   - Clear Sky indicator: lucide `Sparkles` icon + "OPTIMAL" badge.
   - Reuse `GoldenHourCountdown` and `BlueHourCountdown` components below the time display.
   - Container: `bg-surface-container-low rounded-2xl p-4` — no border.

3. **Edit `src/components/home-page-client.tsx`**:
   - Replace the current `flex flex-col gap-4 lg:flex-row` section with the 3-col layout:
     ```
     Mobile: stack (SolarMetrics → SearchBar → map+controls → DayCycle → PhotoWindows → details)
     Desktop: grid-cols-[280px_1fr_320px]
       Left: SolarMetrics + controls card
       Center: InteractiveMap
       Right: DayCycle + PhotoWindows
     ```
   - Controls card (TimeSlider + DatePicker + AnimateButton + NowButton): style as `bg-surface-container-low rounded-2xl p-4` — remove `border border-slate-200`.
   - InfoPanel, SharePanel, FavoritesPanel remain below the main grid.

4. **Run `/verify`**.

_Requirements: FR-3 Dashboard Tab_
_Skills: /build-website-web-app — responsive grid layout_

---

## Acceptance Criteria
- [ ] Day Cycle panel shows Sunrise, Solar Noon, Sunset with times and azimuths.
- [ ] Photo Windows shows Golden Hour and Blue Hour time ranges.
- [ ] GoldenHourCountdown and BlueHourCountdown are visible in Photo Windows panel.
- [ ] Desktop shows 3-column layout.
- [ ] Mobile stacks vertically with map full-width.
- [ ] No `border-slate-*` or `border border-*` on the new layout sections.
- [ ] All times update when date/location changes.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/dashboard/day-cycle.tsx` | Sunrise/Noon/Sunset panel with azimuths | done |
| `src/components/dashboard/photo-windows.tsx` | Golden Hour + Blue Hour panel with countdowns | done |
| `src/components/home-page-client.tsx` | Restructured to 3-col desktop / stacked mobile layout | done |

**Decisions made:**
- Mobile: Day Cycle + Photo Windows rendered inside left col (hidden on lg+) so they appear below controls in the stack order.
- Desktop: right col uses `hidden lg:flex flex-col` — components rendered twice (once mobile, once desktop) to avoid layout shift.
- Controls card uses `bg-surface-container-low rounded-2xl` — removed `border border-slate-200 bg-white shadow-sm`.
- `formatAzimuth` utility inlined in `day-cycle.tsx` (no shared util needed for one use).
- Solar Noon has no azimuth displayed (not available in SunData as a dedicated field).

**Context for next task:** Dashboard 3-col layout is complete. SolarMetrics (top), controls/DayCycle/PhotoWindows (grid), InfoPanel/SharePanel/FavoritesPanel (below grid). Build passes cleanly.
**Open questions:** _(none)_
