---
task: 013
feature: helios-chrono-ui
status: complete
depends_on: [3, 5, 8, 10, 12]
---

# Task 013: Polish — Search Integration, Responsive Audit, No-Line Audit

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Final integration pass: wire SearchBar into the shell, audit all 4 tabs for responsive behaviour on 375px viewport, eliminate any remaining border-slate/border-gray violations, update app metadata, and confirm the build passes cleanly.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```tsx
// [SearchBar — src/components/search-bar.tsx]
// Self-contained "use client" component
// Reads from useSunTrackerStore; calls setLocation on result selection
// Currently standalone — not in the shell header
```

```tsx
// [TopBar structure to extend — src/components/shell/top-bar.tsx]
// Left: branding; Right: icons
// Desktop: nav links between branding and icons
// Target: add SearchBar between nav links and icons on desktop (md+)
// Mobile: SearchBar stays in Dashboard page body (not in sticky header)
```

```tsx
// [layout.tsx metadata — src/app/layout.tsx:16-19]
export const metadata: Metadata = {
  title: "Sun Tracker",
  description: "See where the sun rises and sets for any location, any time.",
};
```

```tsx
// [No-line audit — patterns to replace]
// WRONG: className="... border border-slate-200 ..."
// WRONG: className="... border-gray-300 ..."
// CORRECT: className="... bg-surface-container-low ..." (tonal shift)
// CORRECT: className="... shadow-[0_4px_24px_rgba(11,28,48,0.06)] ..." (ambient shadow)
```

### Key Patterns in Use
- Responsive breakpoints: `sm` = 640px, `md` = 768px, `lg` = 1024px. All 4 tabs must be usable at 375px (iPhone SE).
- Bottom nav must not overlap content: `pb-20 md:pb-0` on `<main>`.
- Search in TopBar (desktop): `hidden md:block` wrapper around SearchBar, constrained width `max-w-xs`.
- Touch targets: all interactive elements minimum 44×44px on mobile.
- Final check list: grep for `border-slate`, `border-gray`, `divide-`, `border border` in `src/components/` and `src/app/`.

### Architecture Decisions Affecting This Task
- SearchBar in TopBar is desktop-only (`md:block hidden`). On mobile it stays in the Dashboard page body.
- No new components are created in this task — only edits to existing ones.
- This task is a clean-up pass; do not refactor logic or restructure pages.

---

## Handoff from Previous Task

**Files changed by previous tasks (cumulative new files):**
- `src/components/shell/top-bar.tsx`, `bottom-nav.tsx`
- `src/app/login/page.tsx`, `src/components/login/login-form.tsx`
- `src/components/dashboard/solar-metrics.tsx`, `day-cycle.tsx`, `photo-windows.tsx`
- `src/lib/analemma.ts`, `src/app/api/analemma/route.ts`
- `src/components/analemma/analemma-svg.tsx`, `chrono-scrubber.tsx`, `ephemeris-data.tsx`
- `src/app/analemma/page.tsx`
- `src/components/landmarks/landmark-card.tsx`, `refraction-index.tsx`
- `src/app/landmarks/page.tsx`, `src/app/api/landmarks/route.ts`
- `src/components/observatory/solar-feed.tsx`, `system-status.tsx`, `calibration.tsx`
- `src/app/observatory/page.tsx`

---

## Implementation Steps

1. **Integrate SearchBar into TopBar** (`src/components/shell/top-bar.tsx`):
   - Import `SearchBar` from `@/components/search-bar`.
   - Wrap in `<div className="hidden md:block w-64 mx-4">` between nav links and icon buttons.

2. **No-line audit** — grep for violations and fix:
   ```bash
   grep -r "border border-slate\|border-gray\|border-zinc\|divide-" src/components/ src/app/ --include="*.tsx"
   ```
   - For each match in new Helios Chrono components (shell, dashboard, analemma, landmarks, observatory, login):
     - Replace solid border with tonal surface shift or ambient shadow.
   - Exception: `src/components/auth/auth-modal.tsx` and legacy panels (not changed in this feature) can keep their existing styles.

3. **Responsive audit** — manually verify at 375px by checking each page:
   - **Dashboard:** metric cards readable; map doesn't overflow; day cycle + photo windows stack cleanly below map.
   - **Analemma:** SVG scales without horizontal scroll; scrubber is full-width; data cards readable.
   - **Landmarks:** cards are full-width on mobile; filter tabs don't wrap awkwardly; refraction widget fits.
   - **Observatory:** solar feed centred; status chips stack; calibration sliders full-width.
   - Fix any overflow or text truncation issues found.

4. **Update metadata** (`src/app/layout.tsx`):
   ```tsx
   export const metadata: Metadata = {
     title: "Helios Chrono",
     description: "Precision solar tracking — celestial alignment for photographers and astronomers.",
   };
   ```

5. **Verify bottom nav clearance**: ensure `<main>` has `pb-20 md:pb-0` — if any page bypasses this, add it.

6. **Run `bun run build`** to confirm production build passes (no TypeScript errors, no missing imports).

7. **Run `/verify`**.

_Requirements: All — final integration_
_Skills: /build-website-web-app — polish and integration_

---

## Acceptance Criteria
- [ ] SearchBar appears in TopBar on desktop (md+); absent from TopBar on mobile.
- [ ] `grep "border border-slate\|border-gray" src/components/shell src/components/dashboard src/components/analemma src/components/landmarks src/components/observatory src/components/login` returns 0 matches.
- [ ] All 4 tabs render without horizontal scroll on 375px viewport.
- [ ] Bottom nav does not overlap page content.
- [ ] App title is "Helios Chrono" in browser tab.
- [ ] `bun run build` exits with 0 errors.
- [ ] `/verify` passes.

---

## Handoff to Next Task

> This is the final task. Feature `helios-chrono-ui` is complete.

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/shell/top-bar.tsx` | Added SearchBar for desktop | pending |
| `src/app/layout.tsx` | Updated metadata to "Helios Chrono" | pending |
| Various new components | Removed any remaining border-slate/gray violations | pending |

**Decisions made:** _(fill in after completion)_
**Context for next task:** Feature complete — all 4 tabs built, styled, and functional.
**Open questions:** _(none)_
