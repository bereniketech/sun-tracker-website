---
task: 011
feature: helios-chrono-ui
status: pending
depends_on: [2]
---

# Task 011: Observatory Page — Solar Feed + System Status

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Build the Observatory page with the live azimuth/altitude header, animated solar feed visualization, and system status chips (Gimbal Logic, Filter Array, Thermal Sink). Reuses live sun data from the store.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```ts
// [Store selectors for observatory — src/store/sun-tracker-store.ts]
const sunData = useSunTrackerStore((state) => state.sunData);
const location = useSunTrackerStore((state) => state.location);
// sunData.sunAzimuth  — current azimuth degrees
// sunData.sunElevation — current elevation degrees
```

```tsx
// [Stitch observatory mobile layout]
// TopBar: "HELIOS CHRONO" + notification + user icons
// "LIVE TELEMETRY" label + "Observatory Feed" heading in font-headline
// Top-right: azimuth "284.42°" + altitude "42.15°" in text-primary display-lg
// Circular solar feed: large circle with sun disc + animated corona rings
// Below circle: "GIMBAL LOGIC: NOMINAL", "FILTER ARRAY: ACTIVE", "THERMAL SINK: WARNING"
// Status chips: normal=green bg-surface-container text-secondary,
//               active=orange bg-primary-container/20 text-primary,
//               warning=red bg-error-container/20 text-error
```

```tsx
// [CSS keyframe animation pattern for corona rings]
// @keyframes corona-pulse { 0%,100% { opacity:0.3; transform:scale(1) }
//                           50% { opacity:0.8; transform:scale(1.05) } }
// Apply: animation: corona-pulse 2s ease-in-out infinite
// Use 3 rings with different delays: 0s, 0.7s, 1.4s
```

### Key Patterns in Use
- Solar disc center colour: gradient from `primary` to `primary-container`.
- Corona rings: SVG `<circle>` elements at increasing radii with decreasing opacity and the pulse animation.
- System status: derive from sun elevation: elevation > 0 → "ACTIVE" (filter array); elevation > 20 → "NORMAL" (gimbal); elevation < 5 or elevation ≤ 0 → "WARNING" (thermal sink).
- The observatory page has a different top layout from other pages — the azimuth/altitude display is top-right of the heading, not in a separate card row.
- `"HD 540283"` in the stitch is the tracking target label — use current location name or a static label.

### Architecture Decisions Affecting This Task
- `SolarFeed` is an SVG + CSS component (no canvas or WebGL needed).
- The corona animation uses CSS `@keyframes` defined in `globals.css` or as a `<style>` tag inside the component.
- System status (Gimbal/Filter/Thermal) is derived from `sunElevation` with thresholds.
- Status chips show label + sub-description (e.g., "Dual-axis synchronization verified. No drift detected.").

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/shell/top-bar.tsx` | Glassmorphic TopBar |
| `src/components/shell/bottom-nav.tsx` | 4-tab BottomNav |
| `src/app/layout.tsx` | Shell updated |
| `src/app/observatory/page.tsx` | Placeholder (to be replaced) |

---

## Implementation Steps

1. **Create `src/components/observatory/solar-feed.tsx`** (`"use client"`):
   - Props: `azimuth: number`, `altitude: number`.
   - SVG `viewBox="0 0 300 300"` + `width="100%"`.
   - Background circle: `bg-surface-container-low` (or SVG rect with `fill="var(--color-surface-container-low)"`).
   - Three corona rings (SVG `<circle>`): r = 90, 105, 120 — `fill="none"` `stroke="#f97316"` with decreasing `strokeOpacity` and CSS animation `corona-pulse` with staggered delays.
   - Sun disc: `<circle r="70">` with SVG `<radialGradient>` from `#f97316` (center) to `#9d4300` (edge).
   - Azimuth label top-left of SVG: `{azimuth.toFixed(2)}°` small text.
   - Altitude label bottom-right: `{altitude.toFixed(2)}°` small text.
   - Add `@keyframes corona-pulse` to `src/app/globals.css`.

2. **Create `src/components/observatory/system-status.tsx`**:
   - Props: `elevation: number`.
   - Derive status for each system:
     ```ts
     const gimbalStatus = elevation > 20 ? 'NORMAL' : elevation > 5 ? 'ACTIVE' : 'WARNING';
     const filterStatus = elevation > 0 ? 'ACTIVE' : 'WARNING';
     const thermalStatus = elevation > 5 ? 'NORMAL' : 'WARNING';
     ```
   - Three status chips in a row (or vertical stack on mobile):
     - Each: icon (lucide `Activity`, `Layers`, `Thermometer`) + name + status badge + description line.
     - NORMAL: `bg-surface-container text-secondary`.
     - ACTIVE: `bg-orange-50 text-primary border border-orange-100/50`.
     - WARNING: `bg-red-50 text-error border border-red-100/50`.
     - Note: the status borders here are `border-*-100/50` — very low opacity, acceptable per "ghost border" fallback rule.

3. **Replace `src/app/observatory/page.tsx`** (was placeholder):
   - `"use client"`.
   - Reads `sunData`, `locationName` from store.
   - Header layout: left = "LIVE TELEMETRY" label + "Observatory Feed" heading; right = azimuth + altitude in `font-headline text-2xl text-primary`.
   - LIVE badge: `bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse`.
   - Render `<SolarFeed azimuth={...} altitude={...} />` centred below header.
   - Render `<SystemStatus elevation={sunData?.sunElevation ?? 0} />` below solar feed.

4. **Run `/verify`**.

_Requirements: FR-6 Observatory Tab_
_Skills: /build-website-web-app — SVG animation + client component_

---

## Acceptance Criteria
- [ ] Observatory page shows "Observatory Feed" heading with live azimuth/altitude top-right.
- [ ] Solar feed SVG renders sun disc with gradient fill.
- [ ] Corona rings animate (pulse) on load.
- [ ] System status chips show NORMAL/ACTIVE/WARNING states correctly for current sun elevation.
- [ ] Status chip colours match spec (green/orange/red tonal backgrounds).
- [ ] Azimuth and altitude values update as time changes in the store.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/observatory/solar-feed.tsx` | Animated SVG sun disc with corona rings | pending |
| `src/components/observatory/system-status.tsx` | Gimbal/Filter/Thermal status chips | pending |
| `src/app/observatory/page.tsx` | Observatory page with live header + feed + status | pending |
| `src/app/globals.css` | Added `@keyframes corona-pulse` | pending |

**Decisions made:** _(fill in after completion)_
**Context for next task:** Task-012 adds calibration sliders to the observatory page.
**Open questions:** _(none)_
