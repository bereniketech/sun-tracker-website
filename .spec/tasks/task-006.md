# Task 006: Device Orientation (Compass)

## Skills
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/frameworks-frontend/nextjs-best-practices/SKILL.md

## Agents
- @web-frontend-expert
- @software-developer-expert

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Use the `DeviceOrientationEvent` API to display a live compass needle that follows the phone's physical orientation. Include a permissions prompt (required on iOS 13+), a direction lock toggle to freeze the heading, and a bearing display showing the angle to the sun's current azimuth.

## Acceptance Criteria
- [ ] `src/hooks/useDeviceOrientation.ts` — custom hook that requests permission (iOS), listens to `deviceorientationabsolute` or `deviceorientation`, returns `{ heading, alpha, beta, gamma, supported, permissionState }`
- [ ] `src/components/compass/CompassNeedle.tsx` — SVG or CSS-based compass rose that rotates to match `heading`; red needle points north; animated with CSS `transform: rotate()`
- [ ] Permissions prompt component shows on first use on iOS (calls `DeviceOrientationEvent.requestPermission()`)
- [ ] "Direction lock" toggle button freezes the heading at its current value until unlocked
- [ ] Bearing to sun: computed as `(sunAzimuth - heading + 360) % 360` — displayed as degrees and cardinal direction (N/NE/E/...)
- [ ] Compass visible in a dedicated panel or floating widget on mobile breakpoints
- [ ] Gracefully disabled on desktop (shows "Not available on this device")
- [ ] Unit tests for `useDeviceOrientation` hook (mock `window.DeviceOrientationEvent`)
- [ ] `/verify` passes

## Steps
1. ✅ Create `src/hooks/useDeviceOrientation.ts`:
   - ✅ Feature detect: `'DeviceOrientationEvent' in window`
   - ✅ iOS permission check: if `typeof DeviceOrientationEvent.requestPermission === 'function'`, call it and handle `'granted'` / `'denied'`
   - ✅ Add event listener for `'deviceorientationabsolute'` (fall back to `'deviceorientation'` with `webkitCompassHeading`)
   - ✅ Return `{ heading: number | null, supported: boolean, permissionState: 'unknown' | 'granted' | 'denied' }`
   - ✅ Clean up listener on unmount
2. ✅ Create `src/components/compass/CompassPermissionPrompt.tsx` — button that calls `requestPermission` on iOS; rendered conditionally when `permissionState === 'unknown'` on iOS
3. ✅ Create `src/components/compass/CompassNeedle.tsx`:
   - ✅ SVG compass rose with N/S/E/W labels
   - ✅ Red needle SVG element rotated by `heading` degrees using `style={{ transform: \`rotate(\${heading}deg)\` }}`
   - ✅ Framer Motion `animate={{ rotate: heading }}` for smooth interpolation
4. ✅ Add `directionLocked` state and a lock toggle button in the compass component
5. ✅ Compute bearing to sun: import `sunData.azimuth` from Zustand store; `bearingToSun = (sunData.azimuth - heading + 360) % 360`; display with `cardinalDirection(bearingToSun)` helper
6. ✅ Create `src/components/compass/CompassPanel.tsx` — wraps CompassNeedle + permission prompt + bearing display; shown as a floating card on mobile, hidden on `lg:` breakpoint and above
7. ✅ Add `CompassPanel` to main page layout
8. ✅ Test: `src/__tests__/hooks/useDeviceOrientation.test.ts` — mock `window.DeviceOrientationEvent`, dispatch synthetic events, verify heading updates; verify cleanup
9. ✅ Run `bun test` and `/verify`

## Status
COMPLETE

## Completed
2026-04-21T16:45:00Z
