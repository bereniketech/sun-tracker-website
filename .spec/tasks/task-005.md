---
task: 005
feature: sun-tracker-website
status: completed
depends_on: [002, 003]
---

# Task 005: Build time/date controls and sun animation

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create time slider (minute-resolution), date picker, animate button, and "Now" reset button. All controls update the Zustand store, which triggers sun data recalculation and map overlay updates. Display daylight duration and change vs previous day.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- Store's `setDateTime` triggers `computeSunData` recomputation (task-002)
- Animation uses `requestAnimationFrame` loop advancing time in configurable increments

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/components/controls/TimeSlider.tsx`:
   - Range input: 0–1439 (minutes in a day)
   - Display formatted time (HH:MM)
   - On change → update store dateTime with new hour/minute
2. Create `src/components/controls/DatePicker.tsx`:
   - Calendar date selector (shadcn/ui Calendar or native input)
   - On change → update store dateTime with new date
3. Create `src/components/controls/AnimateButton.tsx`:
   - Play/pause toggle
   - `requestAnimationFrame` loop: advance time by N minutes per frame
   - Speed control (1x, 2x, 5x)
   - Stop at end of day or on pause
4. Create `src/components/controls/NowButton.tsx`:
   - Reset store dateTime to `new Date()`
5. Create `src/components/controls/DaylightInfo.tsx`:
   - Display day length from sun data (formatted hours:minutes)
   - Display change vs previous day (e.g., "+2m 15s")
6. Integrate all controls into the ControlPanel area of the layout

_Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
_Skills: /build-website-web-app, /code-writing-software-development_

---

## Acceptance Criteria
- [ ] Moving time slider updates sun data and any visible map overlays in real time
- [ ] Date picker changes recalculate all sun data
- [ ] Animation smoothly moves sun position across the day
- [ ] "Now" button resets to current date/time
- [ ] Daylight duration displays correctly
- [ ] Day length change vs previous day shown
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
