# Task 004: Error Boundaries

## Skills
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/testing-quality/tdd-workflow/SKILL.md

## Agents
- @web-frontend-expert
- @code-reviewer

## Commands
- /tdd
- /verify
- /task-handoff

## Overview
Add React `ErrorBoundary` wrappers around all major UI sections (map, sun info panel, observatory panel) so that a crash in one section does not bring down the entire app. Provide per-section fallback UIs and a global error page.

## Acceptance Criteria
- [ ] `src/components/error/ErrorBoundary.tsx` — reusable class component with `componentDidCatch` + `getDerivedStateFromError`, accepts `fallback` prop
- [ ] `src/components/error/MapErrorFallback.tsx` — fallback for map section crash
- [ ] `src/components/error/PanelErrorFallback.tsx` — fallback for sun info / observatory panel crash
- [ ] `src/app/error.tsx` — Next.js global error page (catches unhandled errors in App Router layouts)
- [ ] `src/app/not-found.tsx` — custom 404 page
- [ ] Map component wrapped in `<ErrorBoundary fallback={<MapErrorFallback />}>`
- [ ] Sun info panel wrapped in `<ErrorBoundary fallback={<PanelErrorFallback section="Sun Info" />}>`
- [ ] Observatory panel wrapped in `<ErrorBoundary fallback={<PanelErrorFallback section="Observatory" />}>`
- [ ] Vitest tests confirm boundary catches render errors and shows fallback
- [ ] `/verify` passes

## Steps
1. Create `src/components/error/ErrorBoundary.tsx` — class component implementing `componentDidCatch` (log to console + optional error reporting), `getDerivedStateFromError` sets `hasError: true`, renders `fallback` prop when in error state, exposes `resetErrorBoundary` via a "Try again" button that resets state
2. Create `src/components/error/MapErrorFallback.tsx` — styled card with map icon, "Map failed to load" message, and "Reload map" button that calls `resetErrorBoundary`
3. Create `src/components/error/PanelErrorFallback.tsx` — accepts `section: string` prop, shows section name, "This section encountered an error" message, and reset button
4. Create `src/app/error.tsx` — Next.js `error.tsx` client component with `reset()` function from props; styled with Tailwind; shows friendly message
5. Create `src/app/not-found.tsx` — 404 page with navigation back to home
6. Wrap `<MapContainer>` usage in main page with `<ErrorBoundary fallback={<MapErrorFallback />}>`
7. Wrap sun info panel component with `<ErrorBoundary fallback={<PanelErrorFallback section="Sun Info" />}>`
8. Wrap observatory panel with `<ErrorBoundary fallback={<PanelErrorFallback section="Observatory" />}>`
9. Write tests: `src/__tests__/error/ErrorBoundary.test.tsx` — create a ThrowingComponent, render inside ErrorBoundary, verify fallback shows; verify "Try again" resets; verify `componentDidCatch` is called
10. Run `bun test` and `/verify`
