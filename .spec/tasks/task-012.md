---
task: 012
feature: sun-tracker-website
status: pending
depends_on: [003, 005, 006, 007, 008]
---

# Task 012: Mobile optimization, accessibility, and performance

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /security-review
Commands: /verify, /task-handoff

---

## Objective
Audit and optimize the app for mobile responsiveness (320px–2560px), WCAG 2.1 AA accessibility compliance, and performance (Lighthouse > 80). Implement collapsible panels on mobile, lazy-load heavy components, and ensure keyboard navigation works throughout.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- Leaflet is dynamically imported (already SSR-safe from task-003)
- Photographer panel is code-split (conditional render)
- Target: LCP < 3s on mobile 3G, < 1s on desktop

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Responsive audit at breakpoints: 320px, 375px, 768px, 1024px, 1440px, 2560px
   - Fix any overflow, truncation, or layout issues
   - Ensure map takes full width on mobile
2. Implement collapsible panels:
   - Info panel, photographer panel, favorites panel collapse to a bottom sheet or accordion on mobile
   - Toggle button always visible
3. Accessibility audit:
   - Contrast: all text meets 4.5:1 ratio (AA)
   - Add `aria-label` to all interactive elements (map controls, sliders, buttons)
   - Ensure focus management: tab order is logical, focus visible on all elements
   - Add `role` attributes where needed (compass, overlays)
   - Screen reader announcements for dynamic content updates
4. Keyboard navigation:
   - Time slider: arrow keys to increment/decrement
   - Date picker: keyboard navigable
   - Map: keyboard shortcuts for zoom in/out
   - All buttons and toggles focusable and activatable via Enter/Space
5. Performance optimization:
   - Verify Leaflet is dynamically imported
   - Lazy-load photographer panel and favorites panel
   - Optimize images with Next.js Image component
   - Add `loading="lazy"` to below-fold content
6. Run Lighthouse audit and fix issues until score > 80

_Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
_Skills: /build-website-web-app, /security-review_

---

## Acceptance Criteria
- [ ] Layout renders correctly at 320px, 375px, 768px, 1024px, 1440px, 2560px
- [ ] Panels collapse on mobile (< 768px) with toggle button
- [ ] All text meets WCAG 2.1 AA contrast (4.5:1)
- [ ] All interactive elements have aria-labels
- [ ] Tab order is logical across the page
- [ ] Time slider responds to arrow keys
- [ ] Lighthouse performance score > 80
- [ ] LCP < 3s on simulated mobile 3G
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
