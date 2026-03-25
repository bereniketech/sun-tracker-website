---
task: 002
feature: helios-chrono-ui
status: pending
depends_on: [1]
---

# Task 002: App Shell — TopBar + BottomNav

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development
Commands: /verify, /task-handoff

---

## Objective
Replace the current plain header in `layout.tsx` with the Helios Chrono glassmorphic TopBar and a mobile-only 4-tab BottomNav. Wire the 4 routes: `/`, `/analemma`, `/landmarks`, `/observatory`.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets

```tsx
// [Current layout.tsx shell — src/app/layout.tsx:21-43]
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50">
        <header className="border-b bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="text-lg font-semibold tracking-tight text-slate-900">Sun Tracker</p>
          </div>
        </header>
        <main className="flex-1 p-3 md:p-5">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
```

```tsx
// [useAuth hook — src/hooks/use-auth.ts:19]
export function useAuth(): UseAuthReturn {
  // returns: { user, isLoading, signIn, signUp, signOut, getAccessToken }
}
```

### Key Patterns in Use
- `layout.tsx` is a Server Component — shell components that need `usePathname` (for active tab) must be Client Components.
- Use `next/link` for tab navigation (not `<a>`).
- Use `next/navigation`'s `usePathname` in BottomNav to determine active tab.
- No explicit borders: use `bg-surface-container-lowest` vs `bg-surface` for separation.

### Architecture Decisions Affecting This Task
- `TopBar` and `BottomNav` are separate `"use client"` components imported into `layout.tsx`.
- Desktop hides BottomNav (`md:hidden`); desktop shows nav links in TopBar.
- `main` gets `pb-20 md:pb-0` to avoid content hiding behind BottomNav on mobile.

---

## Handoff from Previous Task

**Files changed by previous task:**

| File | What changed |
|------|-------------|
| `tailwind.config.ts` | Added Helios Chrono colour tokens + fontFamily (headline/body/label) |
| `src/app/layout.tsx` | Added Space Grotesk + Inter fonts; body class updated to `bg-surface font-body text-on-surface` |
| `src/app/globals.css` | Added font CSS vars to `:root` |

**Context for this task:**
All Helios Chrono design tokens are now available. `bg-surface`, `text-primary`, `font-headline`, etc. all resolve correctly. Use these tokens throughout this task.

---

## Implementation Steps

1. **Create `src/components/shell/top-bar.tsx`** (`"use client"`):
   - Sticky, `bg-white/80 backdrop-blur-xl z-50`.
   - Left: `✦` (or `flare` Material Symbol equivalent — use a simple star glyph `✦`) in `text-primary` + "HELIOS CHRONO" in `font-headline font-bold tracking-widest text-primary uppercase text-xl`.
   - Right: notification bell icon (lucide `Bell`) + user avatar circle. On desktop add a `Settings` icon.
   - Desktop nav: show Dashboard | Analemma | Landmarks | Observatory as `next/link` items. Active link gets `text-primary border-b-2 border-primary`.
   - Props: none — reads `usePathname()` for active state.

2. **Create `src/components/shell/bottom-nav.tsx`** (`"use client"`):
   - Fixed bottom, `md:hidden`, `bg-surface-container-lowest`.
   - No top border — use a top ambient shadow: `shadow-[0_-4px_24px_rgba(11,28,48,0.06)]`.
   - 4 tabs with icons (lucide: `LayoutDashboard`, `TrendingUp`, `MapPin`, `Eye`) + labels.
   - Active tab: icon + label in `text-primary`; inactive: `text-secondary`.
   - Active indicator: 2px orange underline at top of tab item (`border-t-2 border-primary`).

3. **Edit `src/app/layout.tsx`**:
   - Import and render `<TopBar />` in place of the old `<header>`.
   - Import and render `<BottomNav />` below `<main>`.
   - Add `pb-20 md:pb-0` to `<main>` so content isn't hidden behind BottomNav.
   - Remove the old `<header>` entirely.

4. **Create placeholder pages** (empty, just a heading) so nav links resolve:
   - `src/app/analemma/page.tsx` — `<main><h1>Analemma</h1></main>`
   - `src/app/landmarks/page.tsx` — `<main><h1>Landmarks</h1></main>`
   - `src/app/observatory/page.tsx` — `<main><h1>Observatory</h1></main>`

5. **Run `/verify`**.

_Requirements: FR-2 App Shell_
_Skills: /build-website-web-app — Next.js layout + client components_

---

## Acceptance Criteria
- [ ] TopBar shows "✦ HELIOS CHRONO" in orange Space Grotesk on all pages.
- [ ] BottomNav is visible on mobile (< md), hidden on desktop.
- [ ] Desktop TopBar shows horizontal nav links.
- [ ] Active route link/tab is highlighted in orange.
- [ ] No visible border lines in the shell (tonal shift only).
- [ ] `main` content not hidden behind BottomNav on mobile.
- [ ] All 4 placeholder routes resolve without 404.
- [ ] `/verify` passes.

---

## Handoff to Next Task

**Files changed:**

| File | What changed | State |
|------|-------------|-------|
| `src/components/shell/top-bar.tsx` | New glassmorphic TopBar with branding, desktop nav, user icons | pending |
| `src/components/shell/bottom-nav.tsx` | New 4-tab mobile BottomNav with active state | pending |
| `src/app/layout.tsx` | Replaced old header with TopBar + BottomNav; added pb-20 md:pb-0 to main | pending |
| `src/app/analemma/page.tsx` | New placeholder page | pending |
| `src/app/landmarks/page.tsx` | New placeholder page | pending |
| `src/app/observatory/page.tsx` | New placeholder page | pending |

**Decisions made:** _(fill in after completion)_
**Context for next task:** _(fill in after completion)_
**Open questions:** _(none)_
