---
task: 009
feature: sun-tracker-website
status: complete
depends_on: [005, 006]
---

# Task 009: Implement shareable URLs and data export

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /build-website-web-app
Commands: /verify, /task-handoff

---

## Objective
Encode the full app state (location, date, time, active overlays) in URL search params so views are shareable. Restore state from URL on page load. Add CSV and JSON export of sun data, and social share buttons.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- URL params: `?lat=40.71&lng=-74.00&date=2025-06-21&time=14:30&overlays=sunrise-line,shadow`
- Use `next/navigation` `useSearchParams` and `useRouter` for URL sync
- Export generates files client-side using Blob + download link

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/lib/url-state.ts`:
   - `stateToParams(state): URLSearchParams` — serialize location, date, time, overlays
   - `paramsToState(params): Partial<SunTrackerState>` — deserialize and validate
2. Create `src/hooks/useUrlSync.ts`:
   - On store change → update URL (debounced, replace not push)
   - On mount → read URL params → initialize store
3. Create `src/lib/export.ts`:
   - `exportCSV(location, startDate, endDate): string` — compute sun data for date range, format as CSV
   - `exportJSON(location, startDate, endDate): string` — same as JSON
   - `downloadFile(content, filename, mimeType)` — trigger browser download
4. Create `src/components/ShareExportBar.tsx`:
   - "Copy link" button — copy current URL to clipboard
   - "Export CSV" / "Export JSON" buttons with date range selector
   - Social share buttons: Twitter (X), Facebook — open share URLs in new tab
5. Write tests for url-state serialization/deserialization round-trip
6. Write tests for export CSV/JSON format correctness

_Requirements: 8.1, 8.2, 8.3, 8.4_
_Skills: /code-writing-software-development, /build-website-web-app_

---

## Acceptance Criteria
- [ ] Changing location/time/date/overlays updates URL search params
- [ ] Loading a shared URL restores exact view state (location, date, time, overlays)
- [ ] CSV export downloads file with correct sun data columns
- [ ] JSON export downloads file with correct structure
- [ ] "Copy link" copies URL to clipboard
- [ ] Social share buttons open correct share dialogs
- [ ] URL round-trip tests pass (serialize → deserialize → equal)
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
