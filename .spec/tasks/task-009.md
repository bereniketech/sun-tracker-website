# Task 009: Continuous Geolocation

## Skills
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/performance/web-performance-optimization/SKILL.md

## Agents
- @web-frontend-expert
- @software-developer-expert

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Implement a "Follow Me" mode using `navigator.geolocation.watchPosition` that continuously updates the map center and sun position as the user physically moves. Include battery-aware throttling to reduce update frequency when the device battery is low.

## Acceptance Criteria
- [ ] `src/hooks/useGeolocation.ts` — manages `watchPosition`, returns `{ position, error, watching, startWatching, stopWatching }`
- [ ] "Follow Me" toggle button in the map UI — activates `watchPosition`, auto-centers map on new position, updates Zustand store location
- [ ] Map pans smoothly to new position with each GPS update
- [ ] Sun data recalculates on every position update
- [ ] Battery-aware throttling: check `navigator.getBattery()`, if battery level < 20% and not charging → set `maximumAge: 30000` (30s) and `timeout: 60000`; otherwise use 5s interval
- [ ] GPS accuracy indicator shown (circle on map representing accuracy radius via `L.Circle`)
- [ ] "Follow Me" automatically disabled when user manually pans the map
- [ ] Proper cleanup on component unmount (`clearWatch`)
- [ ] Unit tests for `useGeolocation` hook (mock `navigator.geolocation`)
- [ ] `/verify` passes

## Steps
1. Create `src/hooks/useGeolocation.ts`:
   - State: `position: GeolocationPosition | null`, `error: GeolocationPositionError | null`, `watching: boolean`
   - `startWatching()`: check `getBattery()` API, set options accordingly, call `watchPosition`, save watchId ref
   - `stopWatching()`: call `clearWatch(watchId)`
   - Cleanup in `useEffect` return
2. Create `src/hooks/useBattery.ts` — wraps `navigator.getBattery()` (feature detect), returns `{ level, charging }` or `null` if unavailable
3. Add `followMeActive` flag to Zustand store
4. Create `src/components/map/FollowMeButton.tsx` — toggle button with GPS icon; `active` state shows green; calls `startWatching` / `stopWatching`; placed as Leaflet control or floating button
5. In `useGeolocation` `positionCallback`: call `store.setLocation(lat, lng)`, if `followMeActive` also call Leaflet `map.panTo([lat, lng])` smoothly
6. Create `src/components/map/AccuracyCircle.tsx` — `L.Circle` centered on position with radius = `position.coords.accuracy` in meters; styled with transparent fill + dashed border
7. Detect manual pan: listen to Leaflet `dragstart` event → if `followMeActive`, set `followMeActive = false` and call `stopWatching()`
8. Add `FollowMeButton` and `AccuracyCircle` to the map component
9. Write `src/__tests__/hooks/useGeolocation.test.ts` — mock `navigator.geolocation.watchPosition` and `clearWatch`; test `startWatching` calls watchPosition, `stopWatching` calls clearWatch, position updates propagate
10. Run `bun test` and `/verify`
