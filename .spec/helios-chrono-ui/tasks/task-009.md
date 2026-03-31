---
task: 009
feature: helios-chrono-ui
status: complete
depends_on: [2]
---

# Task 009: Landmarks Page + API Route

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Build the Landmarks page with styled cards for each celestial landmark. Add Stonehenge, Giza Pyramids, and Chichen Itza to the landmarks data. Create a `/api/landmarks` route. Reuse existing landmark alignment logic.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```ts
// [Existing LANDMARKS data — src/lib/landmarks.ts:3-32]
export const LANDMARKS: Landmark[] = [
  { id: "manhattanhenge", name: "Manhattanhenge", lat: 40.758, lng: -73.9855, orientationAzimuth: 299 },
  { id: "stonehenge-axis", name: "Stonehenge Solstice Axis", lat: 51.1789, lng: -1.8262, orientationAzimuth: 49 },
  { id: "abu-simbel-axis", name: "Abu Simbel Sun Temple Axis", lat: 22.3372, lng: 31.6258, orientationAzimuth: 106 },
  { id: "north-axis-study", name: "North Axis Study", lat: 40.7128, lng: -74.006, orientationAzimuth: 0 },
];
```

```ts
// [Landmark type — src/types/sun.ts:13-19]
export interface Landmark {
  id: string;
  name: string;
  lat: number;
  lng: number;
  orientationAzimuth: number;
}
```

```ts
// [computeSunData used in alignment — src/lib/landmark-alignment.ts:1-4]
import { computeSunData } from "@/lib/sun";
import type { AlignmentEvent, Landmark } from "@/types/sun";
const DEFAULT_TOLERANCE_DEGREES = 0.6;
```

```tsx
// [Stitch landmarks mobile card layout]
// Full-width image (h-40) with darkening gradient overlay at bottom
// Top-left: location badge "WILTSHIRE, SK" in text-xs secondary
// Bottom-left over image: landmark name in font-headline text-xl text-white
// Below image: azimuth | elevation | status in grid-cols-3
// Photo Window time range
// "LIVE TRACKING" orange pill badge when selected
```

### Key Patterns in Use
- Landmark card image: use a CSS gradient placeholder (`bg-gradient-to-br from-surface-dim to-surface-container-high`) when no real image is available.
- For Stonehenge, Giza Pyramids, Chichen Itza: use representative placeholder gradients with distinctive hues.
- Selected landmark: reuse `useSunTrackerStore.selectedLandmark` + `setSelectedLandmark`.
- Filter tabs (Historic/Technical/Custom): local `useState` — no routing needed.
- API route returns the extended landmark list with `location`, `imageGradient`, `category` fields.

### Architecture Decisions Affecting This Task
- Extend the `Landmark` type with optional `location: string` (e.g., "Wiltshire, UK"), `category: 'historic' | 'technical' | 'custom'`, `imageGradient: string`.
- Do NOT break existing `LANDMARKS` usage — add new landmarks to the array and add the new optional fields.
- `LandmarkCard` is a client component (needs `useSunTrackerStore` for selected state).
- Category filter is UI-only (no server filtering needed).

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `src/components/shell/top-bar.tsx` | Glassmorphic TopBar |
| `src/components/shell/bottom-nav.tsx` | 4-tab mobile BottomNav |
| `src/app/layout.tsx` | Shell updated |
| `src/app/landmarks/page.tsx` | Placeholder (to be replaced) |

---

## Implementation Steps

1. **Edit `src/lib/landmarks.ts`**:
   - Extend `Landmark` type import or inline optional fields. Add to LANDMARKS array:
     ```ts
     { id: "stonehenge", name: "Stonehenge", lat: 51.1789, lng: -1.8262,
       orientationAzimuth: 49, location: "Wiltshire, UK", category: "historic",
       imageGradient: "from-amber-900 to-stone-700" },
     { id: "giza-pyramids", name: "Giza Pyramids", lat: 29.9792, lng: 31.1342,
       orientationAzimuth: 100, location: "Giza, Egypt", category: "historic",
       imageGradient: "from-yellow-800 to-amber-600" },
     { id: "chichen-itza", name: "Chichén Itzá", lat: 20.6843, lng: -88.5678,
       orientationAzimuth: 66, location: "Yucatán, Mexico", category: "historic",
       imageGradient: "from-green-900 to-emerald-700" },
     ```
   - Existing 4 landmarks: add `category: "technical"` and a `location` string to each.

2. **Create `src/app/api/landmarks/route.ts`**:
   - GET — return `LANDMARKS` array with current sun azimuth/altitude for each (compute using `computeSunData` at current time with each landmark's lat/lng).
   - Response: `{ landmarks: Array<Landmark & { currentAzimuth: number; currentAltitude: number }> }`.

3. **Create `src/components/landmarks/landmark-card.tsx`** (`"use client"`):
   - Props: `landmark: Landmark & { location?: string; imageGradient?: string; currentAzimuth?: number; currentAltitude?: number }`.
   - Image area: `h-40 rounded-t-2xl bg-gradient-to-br {imageGradient}` with bottom gradient overlay.
   - Location badge top-left: `text-xs uppercase tracking-wider text-white/80`.
   - Name bottom-left (over image): `font-headline text-xl text-white font-bold`.
   - "LIVE TRACKING" orange pill: visible when this landmark matches `selectedLandmark?.id`.
   - Data row below image: Azimuth `{currentAzimuth?.toFixed(2)}°` | Elevation `{currentAltitude?.toFixed(2)}°` | Status chip.
   - Photo Window time row.
   - Card: `bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(11,28,48,0.06)]`.
   - On click: `setSelectedLandmark(landmark)`.

4. **Replace `src/app/landmarks/page.tsx`** (was placeholder):
   - `"use client"`.
   - Header: "Celestial" + "Landmarks" (second word in `text-primary`), subtitle.
   - Filter tabs: Historic | Technical | Custom — `bg-surface-container-low rounded-xl` tab bar, active = `bg-surface-container-lowest text-primary`.
   - Sort toggle: "SORTING: SOLAR PROXIMITY" button with sort icon.
   - Grid of `<LandmarkCard>` for filtered landmarks.
   - Fetch landmark data from `/api/landmarks` on mount (SWR-style `useEffect` + `fetch`).

5. **Run `/verify`**.

_Requirements: FR-5 Landmarks Tab, FR-7 API Routes_
_Skills: /build-website-web-app — card grid layout_

---

## Acceptance Criteria
- [ ] Landmarks page renders 7+ landmark cards.
- [ ] Each card shows gradient image area, location badge, name, azimuth/elevation, status.
- [ ] "LIVE TRACKING" badge visible on the selected landmark card.
- [ ] Clicking a card sets it as selected in the store.
- [ ] Historic/Technical filter tabs filter the visible cards.
- [ ] `/api/landmarks` returns 200 with landmark list.
- [ ] No visible borders on cards or filter tabs.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/types/sun.ts` | Extended Landmark interface with optional location, category, imageGradient fields | complete |
| `src/lib/landmarks.ts` | Added Stonehenge, Giza Pyramids, Chichen Itza + location/category/imageGradient fields to all landmarks | complete |
| `src/app/api/landmarks/route.ts` | GET route returning landmarks with current sun data (azimuth/altitude) | complete |
| `src/components/landmarks/landmark-card.tsx` | Helios Chrono styled landmark card with gradient images, location badges, selection state | complete |
| `src/app/landmarks/page.tsx` | Full landmarks page with filter tabs, sorting, card grid, and API data fetching | complete |

**Decisions made:**
- **Landmark card styling** — Used CSS gradient placeholders (from-amber-900 to-stone-700) instead of real images to match the stitch designs and enable fast iteration
- **Category filters** — Implemented as client-side state (useState) for snappy UX; no server-side filtering needed since LANDMARKS is small
- **Sort by solar proximity** — Sorts by current altitude (descending) to show visible landmarks first in the grid
- **API route pattern** — Computes sun data on-the-fly per landmark using computeSunData; marked as `dynamic = "force-dynamic"` for real-time updates
- **Landmark selection** — Reused existing `useSunTrackerStore.selectedLandmark` + `setSelectedLandmark` to integrate with the store

**Context for next task:**
Task-010 extends the landmarks page with an Atmospheric Refraction Index widget at the bottom. The landmark card and page are stable and can accept additional UI elements (refraction info, expanded panels, etc.). All 7 landmarks are loaded and functional with filtering/sorting.

**Open questions:** 
- None; ready for Task-010

