# Task 001: Dark Mode

## Skills
- .kit/skills/ui-design/frontend-ui-dark-ts/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/frameworks-frontend/nextjs-best-practices/SKILL.md
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md

## Agents
- @web-frontend-expert
- @code-reviewer

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Implement full dark mode support using `next-themes` with Tailwind `dark:` classes, system preference detection via `prefers-color-scheme`, and a persistent toggle in localStorage. All existing UI components must render correctly in both light and dark variants.

## Acceptance Criteria
- [ ] `next-themes` installed and `ThemeProvider` wrapping the root layout in `src/app/layout.tsx`
- [ ] `DarkModeToggle` component in `src/components/ui/DarkModeToggle.tsx` — icon switches between sun/moon
- [ ] System preference (`prefers-color-scheme`) is detected on first load
- [ ] Theme persists in localStorage across page reloads
- [ ] All Tailwind `dark:` variants applied to every existing component (header, sidebar, map panel, sun info panel)
- [ ] No flash of unstyled content (FOUC) on initial load — `suppressHydrationWarning` set on `<html>`
- [ ] Vitest unit test for `DarkModeToggle` toggle behavior

## Steps
1. Install `next-themes`: `bun add next-themes`
2. Wrap root layout: in `src/app/layout.tsx` add `<ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="sun-tracker-theme">` around `{children}`
3. Add `suppressHydrationWarning` to the `<html>` element in the root layout
4. Set `darkMode: 'class'` in `tailwind.config.ts`
5. Create `src/components/ui/DarkModeToggle.tsx` — `useTheme()` hook, toggle between `"light"` and `"dark"`, render `<SunIcon>` / `<MoonIcon>` from `lucide-react`
6. Add `DarkModeToggle` to the site header (`src/components/layout/Header.tsx`)
7. Audit every component under `src/components/` — add `dark:` variants for all background, text, border, and shadow Tailwind classes
8. Audit `src/app/globals.css` — ensure CSS variables cover both light and dark values
9. Test: create `src/__tests__/DarkModeToggle.test.tsx` — renders, clicking toggles theme, localStorage key `sun-tracker-theme` is set
10. Run `bun test` and `/verify` to confirm all pass
