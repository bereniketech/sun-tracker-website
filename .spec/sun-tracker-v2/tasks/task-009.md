---
task: 009
feature: sun-tracker-v2
status: complete
depends_on: []
---

# Task 009: Golden Hour Notification Hook + Tests

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /tdd-workflow
Commands: /verify, /task-handoff

---

## Objective
Create `src/hooks/use-golden-hour-notifications.ts` implementing `useGoldenHourNotifications(sunData, locationName)`. Handles Web Notifications API feature detection, permission request, `setTimeout`-based scheduling 30 minutes before the next golden hour event, and cleanup.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [SunData golden hour windows — from src/types/sun.ts:35-51]
export interface SunData {
  goldenHour: TimeWindow;          // morning: { start, end }
  goldenHourEvening: TimeWindow;   // evening: { start, end }
  // ...
}
export interface TimeWindow { start: Date; end: Date; }
```

```typescript
// [Existing hook pattern — from src/hooks/use-auth.ts (reference for hook structure)]
"use client";
import { useEffect, useState } from "react";
// hooks export a single named function; no default exports
```

### Key Patterns in Use
- **`"use client"`:** Required — uses browser APIs (`Notification`, `setTimeout`).
- **`useRef` for timer:** Store `setTimeout` ID in a `useRef<ReturnType<typeof setTimeout> | null>` to survive re-renders.
- **`useEffect` cleanup:** Always `clearTimeout` the stored ref on unmount and before rescheduling.
- **Feature detection:** `const supported = typeof window !== "undefined" && "Notification" in window`.
- **Permission state:** Track with `useState<NotificationPermissionState>`.

### Architecture Decisions Affecting This Task
- ADR-2: `setTimeout` in-tab only (no Service Worker in v2). Document this limitation in UI.
- Alert timing: 30 minutes before the next golden hour `start` (morning or evening), whichever is sooner and still in the future.
- If golden hour is currently active or already past for today: schedule for the other window; if both past, do not schedule (let the user re-open the app tomorrow).
- `locationName` truncated to 100 chars before use in notification body (security).

---

## Handoff from Previous Task
> Empty for task-009 (parallel with task-001, 003, 005, 007).

**Files changed by previous task:** _(none)_
**Decisions made:** _(none)_
**Context for this task:** _(none)_
**Open questions left:** _(none)_

---

## Implementation Steps

1. Create `src/hooks/use-golden-hour-notifications.ts`.
2. Define and export types:
   ```typescript
   export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported";
   export interface UseGoldenHourNotificationsReturn {
     permissionState: NotificationPermissionState;
     isScheduled: boolean;
     requestAndSchedule: () => Promise<void>;
     cancel: () => void;
   }
   ```
3. Implement `useGoldenHourNotifications(sunData: SunData | null, locationName: string)`:
   - Feature-detect on mount: if unsupported, set `permissionState = "unsupported"` and return early-style.
   - On mount: read `Notification.permission` and sync `permissionState`.
   - `requestAndSchedule`:
     1. Call `await Notification.requestPermission()`.
     2. Update `permissionState`.
     3. If granted: call internal `scheduleNext()`.
   - `scheduleNext()`:
     1. Find next golden hour event start (morning or evening) that is > `Date.now() + 30 min`.
     2. `msUntilAlert = eventStart.getTime() - Date.now() - 30 * 60 * 1000`.
     3. If `msUntilAlert > 0`: `timerRef.current = setTimeout(fireNotification, msUntilAlert); setIsScheduled(true)`.
   - `fireNotification()`: `new Notification("Golden Hour Starting Soon", { body: \`Golden hour starts in 30 minutes at ${name.slice(0, 100)}. Open the tracker.\` })`.
   - `cancel()`: `clearTimeout(timerRef.current); setIsScheduled(false)`.
   - Re-schedule on `sunData`/`locationName` change if `isScheduled`.
   - Cleanup on unmount: `clearTimeout`.

4. Create `src/__tests__/hooks/use-golden-hour-notifications.test.ts`:
   - Mock `window.Notification` with `{ permission: "default", requestPermission: vi.fn() }`.
   - Mock `vi.useFakeTimers()`.
   - Test: unsupported returns `permissionState = "unsupported"`.
   - Test: `requestAndSchedule` when granted schedules setTimeout.
   - Test: `cancel` clears the timer.
   - Test: `sunData` change reschedules when `isScheduled`.

_Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_
_Skills: /code-writing-software-development — hook patterns; /tdd-workflow — mock timers_

---

## Acceptance Criteria
- [ ] `src/hooks/use-golden-hour-notifications.ts` exports the hook and types.
- [ ] Returns `"unsupported"` when `Notification` API absent.
- [ ] Schedules `setTimeout` correctly when permission granted.
- [ ] `cancel()` clears the timer; `isScheduled` becomes `false`.
- [ ] Hook cleans up timer on unmount.
- [ ] `locationName` truncated to 100 chars in notification body.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**
- `src/hooks/use-golden-hour-notifications.ts` (new)
- `src/__tests__/hooks/use-golden-hour-notifications.test.ts` (new)

**Decisions made:**
- Used `useRef` to store setTimeout ID for proper cleanup across re-renders
- Implemented scheduleNext() to find the sooner of morning or evening golden hour start time, then schedule 30 minutes before
- All error handling delegated to console.error (no silent failures)
- Feature detection on mount; permission state synced from window.Notification.permission
- locationName truncated to 100 chars for security via slice(0, 100)

**Context for next task:**
- Hook exports `useGoldenHourNotifications(sunData, locationName)` returning { permissionState, isScheduled, requestAndSchedule(), cancel() }
- Task-010 will create NotificationSettings component integrating this hook into InfoPanel
- All 8 tests pass; 145 total tests pass; build and linting clean

**Open questions:** None — ready for task-010
