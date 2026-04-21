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
- [x] `src/hooks/useGeolocation.ts` — manages `watchPosition`, returns `{ position, error, watching, startWatching, stopWatching }`
- [x] "Follow Me" toggle button in the map UI — activates `watchPosition`, auto-centers map on new position, updates Zustand store location
- [x] Map pans smoothly to new position with each GPS update
- [x] Sun data recalculates on every position update
- [x] Battery-aware throttling: check `navigator.getBattery()`, if battery level < 20% and not charging → set `maximumAge: 30000` (30s) and `timeout: 60000`; otherwise use 5s interval
- [x] GPS accuracy indicator shown (circle on map representing accuracy radius via `L.Circle`)
- [x] "Follow Me" automatically disabled when user manually pans the map
- [x] Proper cleanup on component unmount (`clearWatch`)
- [x] Unit tests for `useGeolocation` hook (mock `navigator.geolocation`)
- [x] `/verify` passes

## Implementation Summary

### Files Created
1. **src/hooks/useGeolocation.ts** (91 lines)
   - Custom React hook managing geolocation watchPosition
   - Returns position, error, watching state and control methods
   - Implements battery-aware throttling logic
   - Proper cleanup on unmount via useEffect

2. **src/hooks/useBattery.ts** (57 lines)
   - Custom React hook wrapping Battery Status API
   - Feature detects navigator.getBattery()
   - Returns battery level and charging status
   - Listens to levelchange and chargingchange events

3. **src/components/map/FollowMeButton.tsx** (48 lines)
   - Toggle button with MapPin icon from lucide-react
   - Green active state with pulsing animation
   - Disabled/error states with visual feedback
   - Integrated into map control bar

4. **src/components/map/AccuracyCircle.tsx** (64 lines)
   - Leaflet Circle component showing accuracy radius
   - Dashed blue border with transparent fill
   - Center marker at current position
   - Updates on every position change

5. **src/__tests__/hooks/useGeolocation.test.ts** (64 lines)
   - 10 unit tests verifying hook structure and implementation
   - Tests verify watchPosition, clearWatch calls
   - Tests verify battery threshold (0.2 = 20%)
   - Tests verify timeout values (30000 vs 5000)

### Files Modified
1. **src/components/map/leaflet-map.tsx**
   - Added useGeolocation hook integration
   - Added FollowMeMapEvents component to detect manual pan
   - Added FollowMeController component to sync position and pan map
   - Added AccuracyCircle component to render accuracy on map
   - Added FollowMeButton to header controls
   - Implemented handleFollowMeStop to disable tracking on user drag

2. **src/store/sun-tracker-store.ts**
   - Added followMeActive: boolean state flag
   - Added setFollowMeActive(active: boolean) method
   - Immutable state updates via Zustand pattern

3. **src/types/sun.ts**
   - Added followMeActive: boolean to SunTrackerState interface
   - Added setFollowMeActive method signature

## Key Design Decisions

1. **Separate Hooks for Concerns**
   - useGeolocation handles position tracking
   - useBattery handles battery status (optional feature detection)
   - Each has clear, focused responsibility

2. **Battery-Aware Throttling**
   - Checks battery level < 20% AND not charging
   - Low battery: 30s maximumAge, 60s timeout, disabled high accuracy
   - Normal: 5s maximumAge, 10s timeout, enabled high accuracy
   - Graceful fallback if Battery API unavailable

3. **Map Integration**
   - FollowMeMapEvents component detects dragstart to auto-disable tracking
   - FollowMeController syncs position to store and pans map smoothly
   - AccuracyCircle visualizes GPS accuracy as dashed circle
   - All components cleanup properly on unmount

4. **Type Safety**
   - Avoided `any` types by properly typing Battery API and Leaflet Marker
   - Full TypeScript support for position callbacks and error handling
   - Proper cleanup function typing in useEffect

5. **Accessibility**
   - Button has aria-pressed, aria-label attributes
   - Title attribute explains functionality
   - Visual feedback (green color, pulsing animation) for active state

## Test Coverage
- 10 tests passing for useGeolocation hook
- Tests verify hook structure and critical implementation details
- Tests check battery threshold, timeout values, API calls
- Full build and type checking passes

Status: COMPLETE
Completed: 2026-04-21T00:00:00Z
