---
task: 004
feature: sun-tracker-website
status: pending
depends_on: [003]
---

# Task 004: Build search bar with Nominatim geocoding and geolocation

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create a search bar with autocomplete powered by Nominatim geocoding, manual coordinate input, and browser geolocation. Selecting a result or entering coordinates updates the map and sun data via the Zustand store.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- ADR-2: Nominatim with 500ms debounce, session storage caching, User-Agent header
- Nominatim usage policy: max 1 request/sec, must include User-Agent

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/lib/geo.ts`:
   - `searchLocation(query: string): Promise<GeoResult[]>` — Nominatim search with User-Agent header
   - `reverseGeocode(lat, lng): Promise<string>` — get place name from coords
   - Session storage cache for recent queries
   - 500ms debounce utility
2. Create `src/components/SearchBar.tsx`:
   - Text input with autocomplete dropdown
   - Debounced Nominatim search on input change
   - Click suggestion → `store.setLocation(lat, lng, name)`
3. Add manual coordinate input: two number fields (lat, lng) with validation [-90,90] and [-180,180]
4. Add "Use my location" button:
   - Call `navigator.geolocation.getCurrentPosition`
   - On success → reverse geocode → `store.setLocation`
   - On error → show toast/message with fallback instructions
5. Write tests for `src/lib/geo.ts` — mock fetch, test debounce, test cache

_Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
_Skills: /build-website-web-app, /code-writing-software-development_

---

## Acceptance Criteria
- [ ] Typing in search shows autocomplete suggestions from Nominatim
- [ ] Selecting a suggestion centers the map and computes sun data
- [ ] Manual coordinate input validates and centers map
- [ ] "Use my location" button requests geolocation and works (or shows fallback)
- [ ] Nominatim requests are debounced (500ms) and cached
- [ ] User-Agent header sent with all Nominatim requests
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
