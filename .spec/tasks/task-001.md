---
task: 001
feature: sun-tracker-website
status: complete
depends_on: []
---

# Task 001: Initialize Next.js project, install dependencies, configure tooling

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Scaffold a Next.js 15 App Router project with TypeScript, Tailwind CSS, shadcn/ui, and all core dependencies. Set up Vitest for testing. Create a responsive base layout shell (header, main content area, sidebar) that works from 320px to 2560px.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- ADR-3: Zustand for state management (install but don't configure yet)
- ADR-2: Nominatim for geocoding (no Mapbox dependency)
- Package manager: bun

---

## Handoff from Previous Task
> Populated by /task-handoff after prior task completes. Empty for task-001.

**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Run `bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` in project root
2. Install core deps: `bun add suncalc zustand react-leaflet leaflet @supabase/supabase-js`
3. Install dev deps: `bun add -d @types/leaflet @types/suncalc vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
4. Initialize shadcn/ui: `bunx shadcn@latest init`
5. Configure path aliases in `tsconfig.json` (`@/*` → `./src/*`)
6. Create base layout in `src/app/layout.tsx` — responsive shell with header, main, collapsible sidebar
7. Create `src/app/page.tsx` — placeholder home page
8. Write a smoke test: `src/__tests__/smoke.test.tsx` — renders layout without errors
9. Verify: `bun dev` starts, `bun test` passes

_Requirements: 10.1, 10.2_
_Skills: /build-website-web-app, /code-writing-software-development_

---

## Acceptance Criteria
- [ ] `bun dev` starts without errors
- [ ] Tailwind classes render correctly in the browser
- [ ] Vitest runs with a passing smoke test
- [ ] Layout is responsive at 320px, 768px, 1440px, 2560px
- [ ] All dependencies installed and importable
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
