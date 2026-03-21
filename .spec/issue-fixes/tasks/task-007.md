# Task 007 — Animation Controls Verification & Fix

## Requirement
REQ-007 — Animation controls must advance sun position visibly

## Context
The animate button, speed selector (1x/2x/5x), and "Now" button are all coded and rendered in the UI (`animate-button.tsx`, `now-button.tsx`). The audit flagged them as "doing nothing observable." This is likely because REQ-001 (store hydration) must be resolved first — without initial data, the animation loop runs but produces no visible output. This task verifies the full reactive chain works end-to-end after REQ-001 is complete, and fixes any broken links in the chain.

## Depends on
- task-001 (REQ-001 — initial store hydration) must be complete first

## Implementation Steps

1. **Read and trace the reactive chain**
   - Read `src/components/controls/animate-button.tsx` — confirm the animation loop calls `setDateTime` from the Zustand store
   - Read `src/store/sun-tracker-store.ts` — confirm `dateTime`, `setDateTime`, and `isAnimating` are present
   - Read `src/components/controls/time-slider.tsx` — confirm it subscribes to `dateTime` from the store (not local state)
   - Read the sun arc / map overlay component — confirm it re-renders when `dateTime` changes

2. **Identify any broken subscriptions**
   - If any component reads `dateTime` via a prop instead of the store, add the store subscription
   - If the sun arc position is computed only on mount (not reactively), fix it to recompute on `dateTime` change

3. **Verify speed multiplier**
   - Confirm `speedMultiplier` from the store or local state is applied in the `requestAnimationFrame` loop
   - 1x = real-time feel, 2x = double rate, 5x = five times rate

4. **Verify "Now" button**
   - Read `src/components/controls/now-button.tsx`
   - Confirm it calls `setAnimating(false)` and `setDateTime(new Date())`

5. **Fix any issues found** — minimal, targeted changes only

## Acceptance Criteria

- [ ] Pressing the Animate (Play) button causes the time slider thumb to visibly advance
- [ ] The sun arc on the map moves as the time advances
- [ ] Changing speed to 5x produces noticeably faster advancement than 1x
- [ ] Pressing "Now" stops the animation and resets the displayed time to the current real-world time
- [ ] All of the above work from the default NYC location on page load (no manual search required)

## Files Likely Touched

- `src/components/controls/animate-button.tsx`
- `src/components/controls/now-button.tsx`
- `src/components/controls/time-slider.tsx`
- `src/store/sun-tracker-store.ts`
- Possibly: sun arc / map overlay component (find via grep for `dateTime` or `azimuth`)

## Verification

Open the app in the browser:
1. Do not search for a location (NYC default should be loaded — requires task-001 done)
2. Press Play → confirm time slider moves and sun arc rotates on the map
3. Switch to 5x → confirm noticeably faster movement
4. Press Now → confirm time jumps to current time and animation stops
