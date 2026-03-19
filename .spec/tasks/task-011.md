---
task: 011
feature: sun-tracker-website
status: pending
depends_on: [002, 010]
---

# Task 011: Build SEO city pages with ISR

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /build-website-web-app, /code-writing-software-development, /postgres-patterns
Commands: /verify, /task-handoff

---

## Objective
Create server-rendered city pages at `/city/[slug]` with precomputed sun data, JSON-LD structured data, SEO-optimized meta tags, and internal linking. Seed the `cities` table with top 100 cities. Generate a sitemap. Use ISR with 24-hour revalidation.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- ADR-4: ISR with `revalidate: 86400` (24 hours)
- Cities table schema from design doc (slug, name, country, lat, lng, timezone, precomputed_data)
- SunCalc wrapper from task-002 for precomputing data

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create SQL migration for `cities` table:
   - Schema from design doc
   - RLS: public read, admin-only write
   - Save as `supabase/migrations/002_cities.sql`
2. Create `scripts/seed-cities.ts`:
   - Top 100 world cities with name, slug, country, lat, lng, timezone
   - Run SunCalc to precompute monthly sunrise/sunset/golden/blue hour data
   - Insert into Supabase cities table
3. Create `src/app/city/[slug]/page.tsx`:
   - Server component: fetch city from Supabase by slug
   - Display: city name, country, today's sun data, monthly sun data table
   - Link to interactive tool with city coordinates pre-filled
   - `export const revalidate = 86400`
4. Create `src/app/city/[slug]/layout.tsx`:
   - Generate metadata: title "Sunrise & Sunset Times in {City} | Sun Tracker"
   - Meta description: "Find sunrise, sunset, golden hour, and blue hour times in {City}. Plan your photography and activities with real-time sun position data."
5. Add JSON-LD structured data (WebPage + FAQPage schema)
6. Create `src/app/city/page.tsx` — city index page listing all cities by country
7. Add internal links: related cities (same country), link back to home tool
8. Create `src/app/sitemap.ts` — Next.js sitemap generation including all city slugs
9. Create `src/app/api/cities/route.ts` and `src/app/api/cities/[slug]/route.ts`

_Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
_Skills: /build-website-web-app, /code-writing-software-development, /postgres-patterns_

---

## Acceptance Criteria
- [ ] `/city/new-york` renders SSR with correct sun data for New York
- [ ] JSON-LD structured data present in page source
- [ ] Meta title and description are SEO-optimized
- [ ] Related city links work and navigate correctly
- [ ] "Open in tracker" link opens interactive tool with city coords
- [ ] City index page lists all 100 cities grouped by country
- [ ] Sitemap includes all city URLs
- [ ] ISR revalidates every 24 hours (`revalidate: 86400`)
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
