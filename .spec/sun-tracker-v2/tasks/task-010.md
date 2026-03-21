---
task: 010
feature: sun-tracker-v2
status: pending
depends_on: [9]
---

# Task 010: NotificationSettings Component + InfoPanel Integration

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app
Commands: /verify, /task-handoff

---

## Objective
Create `NotificationSettings` — a small widget rendering the notification opt-in UI (permission chip, "Notify me" button, "Disable reminders" button, inline help text). Integrate into `InfoPanel`.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [Hook return type — from src/hooks/use-golden-hour-notifications.ts (task-009)]
export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported";
export interface UseGoldenHourNotificationsReturn {
  permissionState: NotificationPermissionState;
  isScheduled: boolean;
  requestAndSchedule: () => Promise<void>;
  cancel: () => void;
}
```

```typescript
// [Store selectors for notification context]
const sunData = useSunTrackerStore((state) => state.sunData);
const locationName = useSunTrackerStore((state) => state.locationName);
```

```typescript
// [InfoPanel integration point — src/components/panels/info-panel.tsx]
// Add <NotificationSettings /> above the Share panel in the info panel body.
// Import statically (not dynamic).
```

### Key Patterns in Use
- **`"use client"`:** Required — calls the hook which uses browser APIs.
- **Render-nothing when unsupported:** `if (permissionState === "unsupported") return null`.
- **Permission chip colours:** default = zinc, granted = green, denied = red.
- **Async button:** `requestAndSchedule` is async; show loading state during permission prompt.
- **Tailwind patterns:** Use existing `rounded-lg border px-2 py-1 text-xs` button pattern from other panels.

### Architecture Decisions Affecting This Task
- Component reads from store directly (no prop drilling) for `sunData` and `locationName`.
- Does not manage scheduling logic itself — delegates entirely to `useGoldenHourNotifications`.
- "Notify me at golden hour" button hidden when `isScheduled` (already scheduled) or `permissionState === "denied"`.
- "Disable reminders" button shown only when `isScheduled`.

---

## Handoff from Previous Task
> Populated by /task-handoff after task-009 completes.

**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps

1. Create `src/components/panels/notification-settings.tsx`:
   - Read `sunData`, `locationName` from store.
   - Call `const { permissionState, isScheduled, requestAndSchedule, cancel } = useGoldenHourNotifications(sunData, locationName)`.
   - If `permissionState === "unsupported"`: return `null`.
   - Render:
     - Permission state chip: "Notifications: [state]" with colour coding.
     - "Notify me at golden hour" button: shown when `permissionState !== "denied"` and `!isScheduled`. On click: `await requestAndSchedule()`.
     - "Disable reminders" button: shown when `isScheduled`. On click: `cancel()`.
     - Denied help text: "To re-enable, allow notifications in your browser settings." (shown when `permissionState === "denied"`).
     - Scheduled confirmation: "You'll be notified 30 min before golden hour. (Tab must stay open.)" (shown when `isScheduled`).
   - Add `aria-live="polite"` to the status area for screen reader updates.

2. Edit `src/components/panels/info-panel.tsx`:
   - Import `NotificationSettings`.
   - Place `<NotificationSettings />` above the share section.

3. Create `src/__tests__/components/notification-settings.test.tsx`:
   - Mock `useGoldenHourNotifications` with `vi.mock`.
   - Test: returns null when `permissionState = "unsupported"`.
   - Test: "Notify me" button present when `permissionState = "default"` and `!isScheduled`.
   - Test: "Disable reminders" button present when `isScheduled = true`.
   - Test: denied help text shown when `permissionState = "denied"`.

_Requirements: 5.1, 5.5, 5.8, 5.9_
_Skills: /build-website-web-app — React component_

---

## Acceptance Criteria
- [ ] Component returns `null` when API unsupported.
- [ ] All permission states render correct UI elements.
- [ ] "Notify me" button absent when denied or already scheduled.
- [ ] "Disable reminders" button visible when `isScheduled`.
- [ ] `aria-live` present on status area.
- [ ] Component appears in InfoPanel.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
