---
task: 013
feature: sun-tracker-website
status: pending
depends_on: [002, 006]
---

# Task 013: Landmark alignment feature (stretch)

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /build-website-web-app
Commands: /verify, /task-handoff

---

## Objective
Create a landmark alignment feature that calculates when the sun aligns with notable landmarks (e.g., Manhattanhenge). Users can select landmarks, view alignment dates on a calendar, and see alignment lines overlaid on the map.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- Alignment = sun azimuth matches landmark orientation azimuth (within ±1°)
- Scan the entire year day-by-day at sunrise and sunset to find alignment dates
- Use SunCalc wrapper from task-002

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/types/landmark.ts`:
   - `interface Landmark { id: string; name: string; lat: number; lng: number; orientationAzimuth: number; description?: string }`
2. Create `src/data/landmarks.ts`:
   - Curated list of notable landmarks with orientation azimuths
   - E.g., Manhattan street grid (29°), Stonehenge (various), Paris Champs-Élysées (296°)
3. Create `src/lib/alignment.ts`:
   - `findAlignmentDates(landmark, year): AlignmentEvent[]`
   - Scan each day of the year: compute sunrise/sunset azimuth
   - If |sunriseAzimuth - orientationAzimuth| < 1° or |sunsetAzimuth - orientationAzimuth| < 1° → alignment
   - Return date, time, type (sunrise/sunset), exact azimuth
4. Create `src/components/panels/LandmarkPanel.tsx`:
   - Landmark selector (dropdown or search)
   - Calendar view showing alignment dates highlighted
   - Click date → set store dateTime to alignment moment
5. Create `src/components/map/AlignmentOverlay.tsx`:
   - Draw alignment line on map from landmark position along orientation azimuth
   - Highlight when sun is currently aligned
6. Write tests for `findAlignmentDates` — verify Manhattanhenge dates are approximately correct (late May / mid July)

_Requirements: 11.1, 11.2, 11.3_
_Skills: /code-writing-software-development, /build-website-web-app_

---

## Acceptance Criteria
- [ ] Selecting a landmark shows computed alignment dates
- [ ] Calendar displays alignment events highlighted
- [ ] Clicking an alignment date sets the time to the alignment moment
- [ ] Map shows alignment line overlay from landmark along orientation
- [ ] "No alignments this year" message when applicable
- [ ] Manhattanhenge dates approximately match known dates (late May, mid July)
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
