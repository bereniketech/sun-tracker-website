---
task: 011
feature: sun-tracker-v2
status: complete
depends_on: []
---

# Task 011: Educational Content + Dismissal Hook + Tests

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /tdd-workflow
Commands: /verify, /task-handoff

---

## Objective
Create the static educational content constants file and the `useEducationalDismissal` hook backed by `localStorage`. Both are pure/isolated — no React rendering in this task.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```typescript
// [Pattern for static constants — from src/lib/landmarks.ts (reference)]
// Static data exported as typed constants, no runtime computation.
// Import path: "@/lib/educational-content"
```

```typescript
// [Hook pattern — from src/hooks/use-auth.ts (reference for "use client" hooks)]
"use client";
import { useEffect, useState } from "react";
export function useAuth() { ... }
```

### Key Patterns in Use
- **Static constants:** `EDUCATIONAL_ENTRIES` is a `Record<EducationalTermKey, EducationalEntry>` — no runtime computation, tree-shakeable.
- **`localStorage` wrapper:** Always wrap in `try/catch`; return safe defaults on failure (SSR or private mode).
- **Term keys:** Use string literal union type for the 6 keys — prevents typos at call sites.
- **Hook returns stable references:** Use `useCallback` for `dismiss` and `resetAll` to prevent infinite re-renders in consumers.

### Architecture Decisions Affecting This Task
- `localStorage` key: `"edu-dismissed"` stores a JSON array of dismissed term key strings.
- No server-side persistence — purely client-side, per-browser.
- `isDismissed` is synchronous (reads from state, not `localStorage` directly after mount).
- On mount: read `localStorage`, parse, set state.

---

## Handoff from Previous Task
> Empty for task-011 (parallel with task-001, 003, 005, 007, 009).

**Files changed by previous task:** _(none)_
**Decisions made:** _(none)_
**Context for this task:** _(none)_
**Open questions left:** _(none)_

---

## Implementation Steps

1. Create `src/lib/educational-content.ts`:
   ```typescript
   export type EducationalTermKey =
     | "golden-hour" | "blue-hour" | "solar-noon"
     | "shadow-ratio" | "azimuth" | "elevation";

   export interface EducationalEntry {
     term: string;
     shortDefinition: string;   // ≤ 20 words
     fullExplanation: string;   // 2–4 sentences
     photographyTip?: string;
   }

   export const EDUCATIONAL_ENTRIES: Record<EducationalTermKey, EducationalEntry> = {
     "golden-hour": { ... },
     "blue-hour": { ... },
     "solar-noon": { ... },
     "shadow-ratio": { ... },
     "azimuth": { ... },
     "elevation": { ... },
   };
   ```
   - Write plain-English copy for each entry. `shortDefinition` ≤ 20 words. `fullExplanation` 2–4 sentences aimed at non-technical users.

2. Create `src/hooks/use-educational-dismissal.ts`:
   ```typescript
   "use client";
   export interface UseEducationalDismissalReturn {
     isDismissed: (term: EducationalTermKey) => boolean;
     dismiss: (term: EducationalTermKey) => void;
     resetAll: () => void;
   }
   export function useEducationalDismissal(): UseEducationalDismissalReturn
   ```
   - State: `dismissed: Set<string>`.
   - On mount (`useEffect`): try `JSON.parse(localStorage.getItem("edu-dismissed") ?? "[]")`; set state; catch → set `[]`.
   - `dismiss(term)`: add to state, persist to `localStorage`.
   - `resetAll()`: clear state, remove `localStorage` key.
   - `isDismissed(term)`: `dismissed.has(term)`.
   - Use `useCallback` for `dismiss` and `resetAll`.

3. Create `src/__tests__/hooks/use-educational-dismissal.test.ts`:
   - Mock `localStorage` with `vi.stubGlobal`.
   - Test: `isDismissed` returns false for fresh hook.
   - Test: `dismiss("golden-hour")` → `isDismissed("golden-hour")` returns true.
   - Test: persists to `localStorage` on dismiss.
   - Test: `resetAll` clears all dismissals.
   - Test: `localStorage` failure → hook returns `isDismissed = false` without throwing.

4. Create `src/__tests__/lib/educational-content.test.ts` (lightweight):
   - Assert all 6 keys present.
   - Assert `shortDefinition` ≤ 20 words for each entry.
   - Assert `fullExplanation` is non-empty for each entry.

_Requirements: 6.2, 6.4, 6.5, 6.7_
_Skills: /code-writing-software-development; /tdd-workflow_

---

## Acceptance Criteria
- [ ] All 6 `EducationalTermKey` values have entries in `EDUCATIONAL_ENTRIES`.
- [ ] All `shortDefinition` values are ≤ 20 words.
- [ ] Hook `dismiss` / `isDismissed` / `resetAll` work correctly across re-renders.
- [ ] `localStorage` failure is silent; hook returns safe defaults.
- [ ] `vitest run` passes.
- [ ] `/verify` passes.

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:**
- Created `src/lib/educational-content.ts` — Educational terms constants with type-safe keys
- Created `src/hooks/use-educational-dismissal.ts` — localStorage-backed dismissal hook
- Created `src/__tests__/lib/educational-content.test.ts` — 5 tests for entries and field validation
- Created `src/__tests__/hooks/use-educational-dismissal.test.ts` — 11 tests for dismissal behavior

**Decisions made:**
- Set<string> for O(1) lookups; useCallback for stable references
- Silent localStorage error handling for SSR/private-mode
- Non-technical user language; Definitions 2–4 sentences, ≤20 words shortDef

**Context for next task:**
- Educational content is tree-shakeable; no server persistence
- Ready for integration with UI panels
- All tests passing

**Open questions:** None
