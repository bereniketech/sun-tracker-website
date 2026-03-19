---
task: 007
feature: sun-tracker-website
status: pending
depends_on: [002, 005]
---

# Task 007: Build info panel with sun data display and SVG compass

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create the info panel showing all computed sun values in a formatted display, an SVG compass with cardinal directions and sun/shadow azimuth markers, and shadow info. Panels are collapsible on mobile and update in real time with the time slider.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- SunData interface provides all values to display (task-002)
- Compass is pure SVG — no canvas or external library
- Mobile: collapsible panels to maximize map visibility

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/components/panels/SunDataDisplay.tsx`:
   - Display: sunrise, sunset, solar noon, day length, golden hour times, blue hour times
   - Display: sun azimuth, sun elevation (formatted degrees)
   - Use grid/table layout with icons or labels
   - Subscribe to `store.sunData`
2. Create `src/components/compass/Compass.tsx`:
   - SVG circle with N/S/E/W labels
   - Rotating markers for: sunrise azimuth (orange), sunset azimuth (red), current sun (yellow), shadow (gray)
   - Markers positioned by rotating around the compass circle at their azimuth angle
   - Smooth transitions when time slider moves
3. Create `src/components/panels/ShadowInfo.tsx`:
   - Shadow direction in degrees and cardinal direction (e.g., "225° SW")
   - Shadow length ratio (e.g., "2.1x object height")
   - "No shadow" when sun is below horizon
4. Create `src/components/panels/InfoPanel.tsx`:
   - Wrapper that contains SunDataDisplay, Compass, ShadowInfo
   - Collapsible on mobile (toggle button to expand/collapse)
5. Integrate InfoPanel into the main layout sidebar

_Requirements: 2.1, 6.1, 6.2, 6.3, 6.4, 10.2_
_Skills: /build-website-web-app, /code-writing-software-development_

---

## Acceptance Criteria
- [ ] All sun data values display correctly and match SunCalc output
- [ ] Compass renders with N/S/E/W and all azimuth markers at correct angles
- [ ] Compass markers update in real time when time slider moves
- [ ] Shadow info shows direction and length ratio correctly
- [ ] "No shadow" displayed when sun below horizon
- [ ] Panel collapses on mobile (< 768px)
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
