---
task: 012
feature: helios-chrono-ui
status: pending
depends_on: [11]
---

# Task 012: Observatory — Calibration + Persistence

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Add the Calibration panel to the Observatory page: Focus Offset slider, Exposure Bias slider, Capture Rate selector, Solar Intensity display, Auto-Align and Capture buttons. Persist calibration settings to localStorage (guest) or Supabase user_metadata (signed-in).

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```tsx
// [Stitch observatory calibration layout]
// Section: "CALIBRATION CORE" heading + subtitle "Adjusting precision optics..."
// FOCUS OFFSET slider: -2.5mm to +2.5mm, current value "+1.24MM" shown right
// EXPOSURE BIAS slider: -3 EV to +3 EV, current value "-0.5 EV" shown right
// CAPTURE RATE buttons: "5S" | "10S" | "30S" | "60S" — pill buttons, active = bg-primary text-white
// "AUTO ALIGN" button: secondary style (bg-surface-container)
// "CAPTURE" button: primary gradient, full-width
// Solar Intensity section: "SOLAR INTENSITY" label + "1,361 W/m²" in font-headline text-4xl
//   + row of 5 colour swatches (orange tones)
```

```tsx
// [useAuth — src/hooks/use-auth.ts:19]
export function useAuth(): UseAuthReturn {
  // returns: { user, isLoading, signIn, signUp, signOut, getAccessToken }
}
```

```tsx
// [Supabase user metadata pattern]
import { getBrowserClient } from "@/lib/supabase";
const supabase = getBrowserClient();
// Save: await supabase.auth.updateUser({ data: { calibration: { ... } } });
// Read: user.user_metadata.calibration
```

```tsx
// [localStorage pattern for guest]
localStorage.setItem("helios:calibration", JSON.stringify(calibration));
JSON.parse(localStorage.getItem("helios:calibration") ?? "null");
```

### Key Patterns in Use
- Slider input style: `<input type="range">` with `style={{ accentColor: '#f97316' }}` for orange thumb.
- Focus Offset range: -2.5 to +2.5 mm, step 0.01. Display: `{value > 0 ? '+' : ''}{value.toFixed(2)}MM`.
- Exposure Bias range: -3 to +3 EV, step 0.1. Display: `{value > 0 ? '+' : ''}{value.toFixed(1)} EV`.
- Solar Intensity (W/m²): approximate from elevation: `Math.round(1361 * Math.sin(elevation * Math.PI / 180))` when elevation > 0, else 0.
- Colour swatches: 5 `<div>` elements in a row with bg colors from `#fed7aa` → `#fb923c` → `#f97316` → `#ea580c` → `#9d4300`.
- Calibration state shape: `{ focusOffset: number; exposureBias: number; captureRate: 5 | 10 | 30 | 60 }`.

### Architecture Decisions Affecting This Task
- Add `calibration` state to `useSunTrackerStore` with a `setCalibration` action.
- `Calibration` component reads/writes store; persistence (localStorage/Supabase) is triggered in a `useEffect` watching the calibration state.
- `useAuth().user` determines persistence target — guest → localStorage; signed-in → Supabase.
- "CAPTURE" button triggers a visual flash effect (border flash animation) — no real camera API.
- "AUTO ALIGN" sets focusOffset to 0 and exposureBias to 0 (resets to defaults).

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/observatory/solar-feed.tsx` | Animated solar disc SVG |
| `src/components/observatory/system-status.tsx` | System status chips |
| `src/app/observatory/page.tsx` | Observatory page with feed + status |
| `src/app/globals.css` | corona-pulse keyframe |

---

## Implementation Steps

1. **Edit `src/store/sun-tracker-store.ts`**:
   - Add to `SunTrackerState` type in `src/types/sun.ts`:
     ```ts
     calibration: { focusOffset: number; exposureBias: number; captureRate: 5 | 10 | 30 | 60 };
     setCalibration: (c: Partial<{ focusOffset: number; exposureBias: number; captureRate: 5|10|30|60 }>) => void;
     ```
   - Add initial value: `calibration: { focusOffset: 0, exposureBias: 0, captureRate: 10 }`.
   - Add `setCalibration` action that merges partial update (immutable).

2. **Create `src/components/observatory/calibration.tsx`** (`"use client"`):
   - Reads `calibration` + `setCalibration` from store; reads `sunData` for Solar Intensity.
   - Reads `user` from `useAuth()`.
   - `useEffect([calibration, user])`:
     - If `user` is null: `localStorage.setItem("helios:calibration", JSON.stringify(calibration))`.
     - If `user` is non-null: `getBrowserClient().auth.updateUser({ data: { calibration } })` (debounce 1s).
   - On mount: load from `user.user_metadata.calibration` or `localStorage` into store via `setCalibration`.
   - Layout:
     - Section title: "CALIBRATION CORE" + subtitle.
     - Focus Offset slider + value display.
     - Exposure Bias slider + value display.
     - Capture Rate buttons (5S/10S/30S/60S) — active = `bg-primary text-white`.
     - Solar Intensity: label + `{intensity.toLocaleString()} W/m²` in `font-headline text-4xl` + 5 colour swatches.
     - Button row: "AUTO ALIGN" (secondary) + "CAPTURE" (primary gradient full-width).
     - Capture button: `onClick` triggers a 300ms `captureFlash` state that adds `ring-2 ring-primary` to the solar feed.

3. **Edit `src/app/observatory/page.tsx`**:
   - Import and render `<Calibration />` below `<SystemStatus />`.

4. **Run `/verify`**.

_Requirements: FR-6 Observatory Tab_
_Skills: /build-website-web-app — form state + persistence_

---

## Acceptance Criteria
- [ ] Focus Offset slider renders and updates store state.
- [ ] Exposure Bias slider renders and updates store state.
- [ ] Capture Rate buttons highlight active rate.
- [ ] Solar Intensity shows correct W/m² value (0 when sun is below horizon).
- [ ] Colour swatches render in orange gradient row.
- [ ] "AUTO ALIGN" resets focusOffset and exposureBias to 0.
- [ ] Calibration state persists to localStorage on change (guest user).
- [ ] Page reload restores calibration state from localStorage.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/types/sun.ts` | Added calibration state + setCalibration to SunTrackerState | pending |
| `src/store/sun-tracker-store.ts` | Added calibration initial state + setCalibration action | pending |
| `src/components/observatory/calibration.tsx` | Sliders, capture rate, solar intensity, persistence | pending |
| `src/app/observatory/page.tsx` | Added Calibration panel | pending |

**Decisions made:** _(fill in after completion)_
**Context for next task:** Observatory tab complete. Task-013 is the final polish pass.
**Open questions:** _(none)_
