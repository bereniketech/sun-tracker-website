---
task: 012
feature: sun-tracker-v2
status: pending
depends_on: [11]
---

# Task 012: EducationalTooltip Component + InfoPanel Data Label Integration

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Create `EducationalTooltip` — a keyboard-accessible popover wrapping any data label — and integrate it around the azimuth, elevation, shadow ratio, and solar noon labels in `SunDataDisplay` and `ShadowInfo`. Add a "Learn more" link in `InfoPanel` for the full educational glossary modal.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [Educational content types — from src/lib/educational-content.ts (task-011)]
export type EducationalTermKey =
  | "golden-hour" | "blue-hour" | "solar-noon"
  | "shadow-ratio" | "azimuth" | "elevation";
export interface EducationalEntry {
  term: string;
  shortDefinition: string;
  fullExplanation: string;
  photographyTip?: string;
}
export const EDUCATIONAL_ENTRIES: Record<EducationalTermKey, EducationalEntry>
```

```typescript
// [Dismissal hook — from src/hooks/use-educational-dismissal.ts (task-011)]
export function useEducationalDismissal(): {
  isDismissed: (term: EducationalTermKey) => boolean;
  dismiss: (term: EducationalTermKey) => void;
  resetAll: () => void;
}
```

```typescript
// [SunDataDisplay location — src/components/panels/sun-data-display.tsx]
// Displays sunAzimuth, sunElevation, solarNoon, sunrise, sunset, etc.
// Wrap the label text (e.g. "Azimuth") with <EducationalTooltip term="azimuth">Azimuth</EducationalTooltip>
```

```typescript
// [ShadowInfo location — src/components/panels/shadow-info.tsx]
// Displays shadowLengthRatio and shadowDirection.
// Wrap "Shadow ratio" label with <EducationalTooltip term="shadow-ratio">Shadow ratio</EducationalTooltip>
```

### Key Patterns in Use
- **Popover pattern:** Use `useState<boolean>` for open state. Position popover absolutely relative to the trigger with `relative`/`absolute` Tailwind classes.
- **Keyboard accessibility:** Trigger has `role="button"` + `tabIndex={0}`. Handle `onKeyDown` for Enter/Space (open) and Escape (close). Popover has `role="tooltip"` or `role="dialog"` with `aria-describedby`.
- **`useRef` for outside-click:** `useEffect` with a document click listener to close popover when clicking outside.
- **Dismissed terms:** If `isDismissed(term)` is true, render `{children}` only (no wrapping behaviour, no underline).

### Architecture Decisions Affecting This Task
- Popover is inline (not portal) to keep z-index simple. Use `z-10` on the popover panel.
- "Learn more" full glossary: a separate modal (similar pattern to `LocationComparison`) listing all 6 entries — opened by a button in `InfoPanel`.
- Do NOT wrap every data value — only labels (text like "Azimuth", "Elevation", "Shadow ratio", "Solar noon").

---

## Handoff from Previous Task
> Populated by /task-handoff after task-011 completes.

**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps

1. Create `src/components/panels/educational-tooltip.tsx`:
   - Props: `term: EducationalTermKey`, `children: ReactNode`.
   - Call `const { isDismissed, dismiss } = useEducationalDismissal()`.
   - If `isDismissed(term)`: return `<>{children}</>` (no tooltip behaviour).
   - Otherwise: render trigger `<span role="button" tabIndex={0} className="underline decoration-dotted cursor-help">`.
   - On click/Enter/Space: toggle popover `isOpen`.
   - On Escape: close.
   - Outside-click: close.
   - Popover card (shown when `isOpen`):
     - `shortDefinition` always visible.
     - Expand `<details>` for `fullExplanation` and optional `photographyTip`.
     - "Got it" dismiss button → calls `dismiss(term)` + closes popover.

2. Edit `src/components/panels/sun-data-display.tsx`:
   - Read the file first.
   - Import `EducationalTooltip`.
   - Wrap "Azimuth" label text: `<EducationalTooltip term="azimuth">Azimuth</EducationalTooltip>`.
   - Wrap "Elevation" label text: `<EducationalTooltip term="elevation">Elevation</EducationalTooltip>`.
   - Wrap "Solar noon" label text: `<EducationalTooltip term="solar-noon">Solar noon</EducationalTooltip>`.

3. Edit `src/components/panels/shadow-info.tsx`:
   - Read the file first.
   - Import `EducationalTooltip`.
   - Wrap "Shadow ratio" label: `<EducationalTooltip term="shadow-ratio">Shadow ratio</EducationalTooltip>`.

4. Create full glossary modal in `src/components/panels/educational-glossary.tsx`:
   - Props: `isOpen: boolean`, `onClose: () => void`.
   - List all 6 `EDUCATIONAL_ENTRIES` entries with term, shortDefinition, fullExplanation.
   - "Reset dismissed" button calls `resetAll()`.

5. Edit `src/components/panels/info-panel.tsx`:
   - Add "Learn more" button that opens `<EducationalGlossary>`.

6. Create `src/__tests__/components/educational-tooltip.test.tsx`:
   - Test: renders children only when `isDismissed = true`.
   - Test: popover opens on click; shows `shortDefinition`.
   - Test: "Got it" button calls `dismiss`.
   - Test: Escape key closes popover.

_Requirements: 6.1, 6.2, 6.3, 6.5, 6.6, 6.7_
_Skills: /build-website-web-app — accessible popover; /code-writing-software-development — keyboard events_

---

## Acceptance Criteria
- [ ] `EducationalTooltip` renders dismissed terms as plain text (no underline, no popover).
- [ ] Popover opens on click, Enter, and Space.
- [ ] Popover closes on Escape and outside click.
- [ ] ARIA attributes: `role="button"`, `aria-expanded`, `aria-describedby` present.
- [ ] "Azimuth", "Elevation", "Solar noon" labels in `SunDataDisplay` are wrapped.
- [ ] "Shadow ratio" label in `ShadowInfo` is wrapped.
- [ ] "Learn more" button in InfoPanel opens glossary modal.
- [ ] "Got it" dismisses the tooltip and persists via hook.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> This is the final task. No further handoff required.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(N/A — final task)_
**Open questions:** _(fill via /task-handoff)_
