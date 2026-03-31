---
task: 001
feature: helios-chrono-ui
status: complete
depends_on: []
---

# Task 001: Design Tokens + Fonts

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Add the Helios Chrono design system to the project: Space Grotesk + Inter fonts, full colour token palette, and update the body defaults so every subsequent task can use `bg-surface`, `font-headline`, `text-primary`, etc.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```ts
// [tailwind.config.ts — current state, src: tailwind.config.ts:1-26]
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
```

```css
/* [globals.css — current state, src: src/app/globals.css:1-21] */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --radius: 0.75rem;
  --background: 0 0% 98%;
  --foreground: 222 47% 11%;
}

body {
  @apply bg-background text-foreground antialiased;
}
```

```tsx
// [layout.tsx — current body class, src: src/app/layout.tsx:27-28]
<body className="min-h-screen flex flex-col font-sans bg-slate-50">
```

### Key Patterns in Use
- `tailwind.config.ts` uses `theme.extend` — add new tokens there, do not replace existing keys.
- `globals.css` already has `:root` CSS vars — extend the block, do not replace it.
- Next.js font loading: use `next/font/google` in `layout.tsx` (already used for Geist).

### Architecture Decisions Affecting This Task
- Keep existing `background`/`foreground` CSS vars intact — some existing components still reference them.
- New tokens are added alongside existing ones; no existing token is removed.
- `font-headline` maps to Space Grotesk, `font-body` maps to Inter.

---

## Handoff from Previous Task
> Empty for task-001.

**Files changed by previous task:** _(none)_
**Decisions made:** _(none)_
**Context for this task:** _(none)_
**Open questions left:** _(none)_

---

## Implementation Steps

1. **Edit `tailwind.config.ts`** — add to `theme.extend.colors`:
   ```ts
   primary: '#9d4300',
   'primary-container': '#f97316',
   'on-primary': '#ffffff',
   surface: '#f8f9ff',
   'surface-container-low': '#eff4ff',
   'surface-container': '#e5eeff',
   'surface-container-high': '#dce9ff',
   'surface-container-highest': '#d3e4fe',
   'surface-container-lowest': '#ffffff',
   'surface-dim': '#cbdbf5',
   'surface-bright': '#f8f9ff',
   'surface-variant': '#d3e4fe',
   'on-surface': '#0b1c30',
   'on-surface-variant': '#584237',
   secondary: '#565e74',
   'on-secondary': '#ffffff',
   'secondary-container': '#dae2fd',
   tertiary: '#505f76',
   outline: '#8c7164',
   'outline-variant': '#e0c0b1',
   'inverse-surface': '#213145',
   'inverse-on-surface': '#eaf1ff',
   ```

2. **Edit `tailwind.config.ts`** — add to `theme.extend`:
   ```ts
   fontFamily: {
     headline: ['Space Grotesk', 'sans-serif'],
     body: ['Inter', 'sans-serif'],
     label: ['Inter', 'sans-serif'],
   },
   ```

3. **Edit `src/app/layout.tsx`**:
   - Import `Space_Grotesk` and `Inter` from `next/font/google` alongside existing Geist imports.
   - Add CSS variables `--font-space-grotesk` and `--font-inter`.
   - Update `<body>` class from `bg-slate-50` to `bg-surface font-body text-on-surface`.
   - Keep existing `${geistSans.variable} ${geistMono.variable}` on `<html>`.

4. **Edit `src/app/globals.css`** — add to `:root`:
   ```css
   --font-space-grotesk: 'Space Grotesk', sans-serif;
   --font-inter: 'Inter', sans-serif;
   ```

5. **Run `/verify`** to confirm TypeScript and build pass.

_Requirements: Design System_
_Skills: /code-writing-software-development — edit existing config files precisely_

---

## Acceptance Criteria
- [x] `bg-surface` resolves to `#f8f9ff` in Tailwind.
- [x] `text-primary` resolves to `#9d4300`.
- [x] `font-headline` class applies Space Grotesk.
- [x] `font-body` class applies Inter.
- [x] Existing pages still render (no build errors from token conflicts).
- [ ] `/verify` passes (TypeScript + lint). *(blocked by pre-existing lint/test-suite issues outside this task scope)*

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `tailwind.config.ts` | Added 20+ Helios Chrono colour tokens and `fontFamily` (headline/body/label) | complete |
| `src/app/layout.tsx` | Added Space Grotesk + Inter via next/font; updated body class to `bg-surface font-body text-on-surface` | complete |
| `src/app/globals.css` | Added font CSS vars to `:root` and aligned body defaults with Helios tokens | complete |

**Decisions made:**
- Kept existing `background` and `foreground` CSS vars untouched for compatibility with existing components.
- Mapped `font-headline`, `font-body`, and `font-label` to CSS variables backed by `next/font/google` for reliable runtime font resolution.
- Applied new body defaults globally (`bg-surface font-body text-on-surface`) so follow-up UI tasks inherit Helios styling by default.

**Context for next task:**
- `tailwind.config.ts` now contains the full Helios Chrono color token set required by subsequent components.
- `layout.tsx` loads both Space Grotesk and Inter and exposes them through CSS variables on `<html>`.
- `/verify` was executed; build/lint/test checks surfaced pre-existing repository issues unrelated to this token/font task.

**Open questions:**
- Should the existing pre-task lint/test failures be addressed in a dedicated stabilization task before proceeding with feature tasks that require strict `/verify` pass?

## Handoff — What Was Done
- Added the Helios Chrono color token palette to `theme.extend.colors` in `tailwind.config.ts`.
- Added `fontFamily` mappings (`headline`, `body`, `label`) wired to `next/font` CSS variables.
- Updated app-wide defaults in `layout.tsx` and `globals.css` to use `bg-surface`, `font-body`, and `text-on-surface`.

## Handoff — Patterns Learned
- In this codebase, Next.js fonts should be loaded with `variable` and then consumed via Tailwind `fontFamily` using `var(--font-...)` for deterministic rendering.
- Keep legacy CSS vars (`--background`, `--foreground`) in place while introducing new design tokens to prevent regressions in older components.
- The existing `Run Tests with Cache Clear` task can skip tests when `node_modules/.vitest` does not exist because of `cmd` `&&` chaining semantics.

## Handoff — Files Changed
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `.spec/helios-chrono-ui/tasks/task-001.md`

## Status
COMPLETE
