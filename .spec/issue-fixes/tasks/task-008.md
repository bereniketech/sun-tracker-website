# Task 008 — Mobile Responsive Layout

## Requirement
REQ-008 — Mobile layout must be usable at 390px viewport width

## Context
`home-page-client.tsx` uses `lg:flex-row` as the first breakpoint for the two-column layout (map + sidebar). Below `lg` (1024px), the layout falls back to a stacked column — but no `sm`/`md` adjustments have been validated. At 390px (iPhone 14 width) the stats grid (`grid-cols-3`), search bar, time slider, and panels need to be verified and fixed as needed. No horizontal scroll should occur.

## Implementation Steps

1. **Read the main layout**
   - Read `src/components/home-page-client.tsx` fully
   - Map every element's responsive Tailwind classes
   - List elements that only have `lg:` prefixes with no mobile fallback

2. **Identify breaking elements at 390px** — typical problem spots:
   - Stats grid: `grid-cols-3` — three columns may be too tight; consider `grid-cols-1 sm:grid-cols-3` or reduce font/padding
   - Controls sidebar: confirm it renders full-width below `lg`
   - Map container: confirm it renders at a reasonable height on mobile (e.g. `h-64 md:h-96 lg:h-auto`)
   - Search bar: check for fixed widths that could overflow
   - Time slider: check for overflow at narrow widths
   - Header: check `px-4 py-3 md:px-6` padding and logo/nav items

3. **Read globals.css** (`src/app/globals.css`) for any fixed widths or non-responsive rules

4. **Apply minimal responsive fixes**
   - Use mobile-first Tailwind: default classes = mobile, add `lg:` for desktop
   - Do not add breakpoint classes for things that already work on mobile
   - Prefer `w-full` over fixed widths on mobile
   - For map height: add a sensible mobile height (e.g. `h-72`) if the map collapses to 0

5. **Check panels stack correctly**
   - Share & Export panel and Favorites panel: confirm they are full-width and stack below the map on mobile

## Acceptance Criteria

- [ ] At 390px viewport width, no horizontal scrollbar appears on any page section
- [ ] The map renders at a visible height on mobile (minimum 250px)
- [ ] The search bar, time slider, date picker, Animate, and Now button are all fully visible and usable at 390px
- [ ] Stats grid (sunrise/sunset/day-length) is readable at 390px without text overflow
- [ ] Share & Export and Favorites panels are full-width and accessible on mobile
- [ ] Desktop layout (≥1024px) is unchanged

## Files Likely Touched

- `src/components/home-page-client.tsx` — primary layout file
- `src/app/globals.css` — global styles, possibly map height

## Verification

In browser DevTools:
1. Set viewport to 390×844 (iPhone 14)
2. Scroll the full page — confirm no horizontal overflow at any point
3. Interact with: search bar, time slider, date picker, Animate, Now button — all must be usable
4. Expand Share & Export and Favorites panels — confirm they render correctly
5. Switch to 1440px desktop — confirm layout is unchanged
