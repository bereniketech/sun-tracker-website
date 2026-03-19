# Task 001 — Fix initial store hydration

## Summary
Initialize the Zustand store with NYC location + pre-computed sunData so sunrise/sunset times, all panels, and map overlays appear on first paint without user interaction.

## Implementation Steps
1. In `src/store/sun-tracker-store.ts`:
   - Import `DEFAULT_MAP_LOCATION` from `@/components/map/location-utils`
   - Create `const INITIAL_DATE = new Date()` above the store
   - Set `location: { lat: DEFAULT_MAP_LOCATION.lat, lng: DEFAULT_MAP_LOCATION.lng }` in initial state
   - Set `locationName: DEFAULT_MAP_LOCATION.name`
   - Set `sunData: computeSunData(DEFAULT_MAP_LOCATION.lat, DEFAULT_MAP_LOCATION.lng, INITIAL_DATE)`
   - Set `dateTime: INITIAL_DATE`

2. In `src/components/home-page-client.tsx`:
   - Remove the `useEffect` block that calls `state.setLocation(DEFAULT_MAP_LOCATION...)` (lines 57–67)

## Acceptance Criteria
- [ ] NYC sunrise/sunset times appear on first paint (no "—")
- [ ] Sun Data panel shows data on load (no "Select a location...")
- [ ] Map overlays (sun direction lines, shadow, etc.) appear on map load
- [ ] Tests still pass: `bun test`
