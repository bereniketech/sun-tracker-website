---
task: 005
feature: sun-tracker-v2
status: completed
depends_on: []
---

# Task 005: Comparison Store Slice + Types + URL State Extension

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Extend the Zustand store with a `comparisonLocations` slice (max 3 entries) and types. Extend `use-url-state.ts` to encode/decode comparison locations in the URL `compare` param.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [SunTrackerState — from src/types/sun.ts:58-74]
export interface SunTrackerState {
  location: Coordinates | null;
  locationName: string;
  dateTime: Date;
  isAnimating: boolean;
  sunData: SunData | null;
  activeOverlays: Set<OverlayType>;
  selectedLandmark: Landmark | null;
  photographerMode: boolean;
  isMobile: boolean;
  setLocation: (lat: number, lng: number, name?: string) => void;
  setDateTime: (dateTime: Date) => void;
  setAnimating: (isAnimating: boolean) => void;
  toggleOverlay: (overlay: OverlayType) => void;
  setSelectedLandmark: (landmark: Landmark | null) => void;
  togglePhotographerMode: () => void;
}
// ADD: comparisonLocations, addComparisonLocation, removeComparisonLocation, clearComparisonLocations
```

```typescript
// [Store implementation pattern — from src/store/sun-tracker-store.ts:16-20]
export const useSunTrackerStore = create<SunTrackerState>((set) => ({
  location: { lat: DEFAULT_MAP_LOCATION.lat, lng: DEFAULT_MAP_LOCATION.lng },
  // ...initial state
  setLocation: (lat, lng, name) => {
    set((state) => ({ ...new computed object... }));
  },
}));
```

```typescript
// [URL state hook — from src/hooks/use-url-state.ts:19-38]
function buildParams(
  lat: number,
  lng: number,
  name: string,
  dateTime: Date,
  activeOverlays: Set<OverlayType>,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("lat", lat.toFixed(6));
  // ... existing params
  return params;
}
// ADD: comparisonLocations serialisation to buildParams
// ADD: compare param parsing in the restore effect
```

```typescript
// [Coordinates type — from src/types/sun.ts:53-56]
export interface Coordinates {
  lat: number;
  lng: number;
}
```

### Key Patterns in Use
- **Immutable store updates:** `set((state) => ({ ...state, comparisonLocations: [...] }))` — never mutate the existing array.
- **Max cap enforced in action:** `addComparisonLocation` returns early (no-op) if length is already 3.
- **URL encoding:** pipe-separated locations, comma-separated fields: `lat,lng,name|lat,lng,name`.
- **Validation:** Only add locations where `parseFloat(lat)` and `parseFloat(lng)` are finite.

### Architecture Decisions Affecting This Task
- ADR-3: Extend existing store rather than creating a second store.
- `comparisonLocations` initial value: `[]` (empty array).
- Store actions must be pure (no async, no side effects).

---

## Handoff from Previous Task
> Empty for task-005 (parallel with task-001, 003).

**Files changed by previous task:** _(none)_
**Decisions made:** _(none)_
**Context for this task:** _(none)_
**Open questions left:** _(none)_

---

## Implementation Steps

1. Create `src/types/comparison.ts`:
   ```typescript
   export interface ComparisonLocation {
     lat: number;
     lng: number;
     name: string;
   }
   export interface ComparisonSnapshot {
     location: ComparisonLocation;
     sunrise: Date;
     sunset: Date;
     goldenHourStart: Date;
     goldenHourEnd: Date;
     dayLengthSeconds: number;
     currentElevation: number;
   }
   ```

2. Edit `src/types/sun.ts` — add to `SunTrackerState`:
   ```typescript
   comparisonLocations: ComparisonLocation[];
   addComparisonLocation: (loc: ComparisonLocation) => void;
   removeComparisonLocation: (index: number) => void;
   clearComparisonLocations: () => void;
   ```

3. Edit `src/store/sun-tracker-store.ts`:
   - Initial state: `comparisonLocations: []`.
   - `addComparisonLocation`: no-op if length >= 3; otherwise append immutably.
   - `removeComparisonLocation(index)`: filter by index immutably.
   - `clearComparisonLocations`: reset to `[]`.

4. Edit `src/hooks/use-url-state.ts`:
   - In `buildParams`: if `comparisonLocations.length > 0`, serialize as `compare=lat,lng,name|lat,lng,name` (encode name with `encodeURIComponent`).
   - In the restore effect: parse `compare` param, split on `|`, parse each entry, validate floats, call `addComparisonLocation` for each valid entry.
   - Pass `comparisonLocations` into `buildParams` (add as param).

5. Edit `src/__tests__/store/sun-tracker-store.test.ts` — add tests:
   - `addComparisonLocation` adds up to 3, ignores 4th.
   - `removeComparisonLocation` removes correct index.
   - `clearComparisonLocations` empties the array.

_Requirements: 3.1, 3.4, 3.7_
_Skills: /code-writing-software-development — Zustand patterns, URL encoding_

---

## Acceptance Criteria
- [x] `src/types/comparison.ts` exists with `ComparisonLocation` and `ComparisonSnapshot`.
- [x] `SunTrackerState` includes all 4 new fields/actions.
- [x] Store enforces max 3 comparison locations.
- [x] URL `compare` param round-trips correctly (encode on change, decode on mount).
- [x] Invalid lat/lng in URL param are silently ignored.
- [x] All existing store tests still pass.
- [x] New store tests pass.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:**

| File | What changed |
|------|-------------|
| `src/types/comparison.ts` | Added `ComparisonLocation` and `ComparisonSnapshot` interfaces for multi-location comparison data |
| `src/types/sun.ts` | Extended `SunTrackerState` with `comparisonLocations` and comparison actions |
| `src/store/sun-tracker-store.ts` | Added comparison slice state plus immutable `add/remove/clear` actions with a hard max of 3 entries |
| `src/hooks/use-url-state.ts` | Added `compare` URL serialization/deserialization with float validation and safe decode handling |
| `src/__tests__/store/sun-tracker-store.test.ts` | Added tests for add cap, remove by index, and clear behavior |

**Decisions made:**
- Comparison list cap is enforced in the store action (`addComparisonLocation`) as the source of truth.
- URL format uses `lat,lng,name|...` with encoded names and six-decimal coordinates for stable share links.
- URL restore clears existing comparison entries before parsing `compare` to avoid stale/duplicate state.
- Malformed percent-encoding in names is tolerated via safe decode fallback to keep restore resilient.

**Context for next task:**
Task 005 delivers comparison state foundations and URL persistence required by Task 006. The `LocationComparison` modal can now rely on store actions (`addComparisonLocation`, `removeComparisonLocation`, `clearComparisonLocations`) and URL round-tripping through `useUrlState`.

**Open questions:**
- Full `vitest run` remains red due pre-existing unrelated failures in `src/__tests__/components/time-controls.test.tsx` and `src/__tests__/components/search-bar.test.tsx`.
- Lint has an unrelated warning in `src/__tests__/components/home-page-client.test.tsx` (`waitFor` unused).
