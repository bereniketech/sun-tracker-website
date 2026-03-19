---
task: 008
feature: sun-tracker-website
status: pending
depends_on: [005, 007]
---

# Task 008: Build photographer mode panel

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create a toggleable photographer mode that displays golden/blue hour countdowns, a best-direction indicator for sunrise/sunset shots, a 7-day lighting forecast, and recommended shooting days. The compass should be prominently visible in this mode.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- Photographer mode toggles via `store.togglePhotographerMode()`
- Sun data recomputation for 7 days requires calling `computeSunData` for each day
- Countdown timers use `setInterval` or `requestAnimationFrame`

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/components/panels/PhotographerPanel.tsx`:
   - Only renders when `store.photographerMode === true`
   - Toggle button in the header/toolbar to enable/disable
2. Create `src/components/panels/GoldenHourCountdown.tsx`:
   - Countdown to next golden hour (morning or evening)
   - Live updating every second
   - Shows "NOW" badge when currently in golden hour
3. Create `src/components/panels/BlueHourCountdown.tsx`:
   - Same pattern as golden hour countdown
4. Create `src/components/panels/BestDirectionIndicator.tsx`:
   - Arrow/compass indicator pointing toward the best direction for sunrise/sunset photos
   - Based on current sun azimuth and time of day
5. Create `src/components/panels/WeeklyForecast.tsx`:
   - Compute sun data for today + 6 days
   - Display table: date, golden hour AM/PM times, blue hour AM/PM times
   - Highlight "recommended" days (criteria: clear golden hour window, longest duration)
6. Ensure Compass component (task-007) is prominently displayed in photographer mode

_Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
_Skills: /build-website-web-app, /code-writing-software-development_

---

## Acceptance Criteria
- [ ] Toggle enables/disables photographer mode
- [ ] Golden hour countdown ticks every second and shows "NOW" when active
- [ ] Blue hour countdown works identically
- [ ] Best direction indicator points correctly based on sun azimuth
- [ ] 7-day forecast shows correct golden/blue hour times for each day
- [ ] Recommended days are highlighted
- [ ] Compass is visible in photographer mode
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
