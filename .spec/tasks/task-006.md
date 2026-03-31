---
task: 006
feature: sun-tracker-website
status: complete
depends_on: [003, 005]
---

# Task 006: Implement map overlays (sun lines, arcs, shadow, sun path)

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create Leaflet map overlays for sunrise/sunset/current sun direction lines, golden/blue hour arcs, shadow direction, and the full-day sun path arc. Add a layer control to toggle each overlay independently. All overlays react to Zustand store changes.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- Overlays are Leaflet polylines/polygons drawn from the pin location outward at computed azimuths
- OverlayType enum defined in types/sun.ts (task-002)
- Store's `activeOverlays` Set controls visibility

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/lib/map-utils.ts`:
   - `azimuthToLatLng(origin, azimuth, distance): LatLng` — project a point from origin along azimuth
   - `createArc(origin, startAzimuth, endAzimuth, radius, steps): LatLng[]` — generate arc polygon
2. Create `src/components/map/SunDirectionLines.tsx`:
   - Three polylines from pin location: sunrise azimuth (orange), sunset azimuth (red), current sun azimuth (yellow)
   - Length: ~500m or proportional to zoom level
3. Create `src/components/map/HourArcOverlays.tsx`:
   - Golden hour arc: filled polygon between golden hour start/end azimuths
   - Blue hour arc: filled polygon between blue hour start/end azimuths
   - Semi-transparent fills with distinct colors
4. Create `src/components/map/ShadowOverlay.tsx`:
   - Polyline from pin in shadow direction (dark gray, dashed)
5. Create `src/components/map/SunPathArc.tsx`:
   - Compute sun positions every 15 minutes throughout the day
   - Draw arc/polyline showing the sun's trajectory
6. Create `src/components/map/LayerControl.tsx`:
   - Checkbox list toggling each OverlayType in the store
   - Only render overlays that are in `activeOverlays`
7. All overlay components subscribe to relevant store slices and re-render on changes

_Requirements: 3.1, 3.2, 3.3, 3.4_
_Skills: /build-website-web-app, /code-writing-software-development_

---

## Acceptance Criteria
- [ ] Sunrise/sunset/current sun lines render at correct azimuths from pin
- [ ] Golden/blue hour arcs render as filled polygons at correct angular ranges
- [ ] Shadow direction line renders opposite to sun azimuth
- [ ] Sun path arc shows full day trajectory
- [ ] Layer control toggles each overlay independently
- [ ] All overlays update when time slider or date changes
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
