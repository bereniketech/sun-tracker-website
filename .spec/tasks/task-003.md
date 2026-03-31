---
task: 003
feature: sun-tracker-website
status: complete
depends_on: [001, 002]
---

# Task 003: Implement interactive Leaflet map with location pin

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create a dynamic-imported Leaflet map component (SSR-safe) with OpenStreetMap tiles, a draggable location pin, click-to-place functionality, pinch-to-zoom, and fullscreen toggle. Clicking or dragging the pin updates the Zustand store location.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- ADR-2: Leaflet + OpenStreetMap — free tiles, no API key
- Leaflet is SSR-incompatible — must use `next/dynamic` with `ssr: false`
- Store location updates via `setLocation(lat, lng)` from Zustand store (task-002)

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/components/map/MapContainer.tsx` — dynamic import wrapper with `ssr: false`
2. Create `src/components/map/LeafletMap.tsx` — the actual map component:
   - Initialize with OpenStreetMap tile layer
   - Default center: [0, 0] zoom 2 (world view) or user's last location
   - Import Leaflet CSS in this component
3. Create `src/components/map/LocationPin.tsx` — draggable Marker:
   - On drag end → `store.setLocation(lat, lng)`
   - Custom pin icon
4. Add click handler on map: click → place pin → `store.setLocation(lat, lng)`
5. Add fullscreen control plugin or custom button
6. Ensure touch gestures work (Leaflet handles this natively)
7. Subscribe to `store.location` — when location changes externally (search, geolocation), pan map to new location

_Requirements: 1.6, 1.7, 3.5, 3.6, 3.7_
_Skills: /build-website-web-app, /code-writing-software-development_

---

## Acceptance Criteria
- [ ] Map renders with OpenStreetMap tiles — no blank screen
- [ ] No SSR errors (dynamic import with `ssr: false`)
- [ ] Clicking on map places a pin and updates Zustand store
- [ ] Dragging the pin updates Zustand store on drag end
- [ ] Map pans to location when store.location changes externally
- [ ] Fullscreen toggle works on mobile
- [ ] Pinch-to-zoom works on touch devices
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
