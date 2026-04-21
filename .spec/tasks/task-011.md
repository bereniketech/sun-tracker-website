# Task 011: Admin Dashboard

## Skills
- .kit/skills/data-backend/postgres-patterns/SKILL.md
- .kit/skills/development/api-design/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/frameworks-frontend/nextjs-best-practices/SKILL.md

## Agents
- @web-backend-expert
- @web-frontend-expert

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Create an admin dashboard at `/admin` gated to admin emails via Supabase Auth middleware. The dashboard allows managing cities (preset locations) and user landmarks — CRUD operations via Supabase admin client without raw SQL.

## Acceptance Criteria
- [ ] `src/middleware.ts` — Next.js middleware checks session cookie; if route matches `/admin/**` and user email not in `ADMIN_EMAILS` env var (comma-separated), redirect to `/` with a 403 toast
- [ ] `ADMIN_EMAILS` added to `.env.example`
- [ ] `src/app/admin/layout.tsx` — admin layout with sidebar navigation (Cities, Landmarks, Users)
- [ ] `src/app/admin/page.tsx` — dashboard overview: total cities count, total landmarks count, active push subscriptions count
- [ ] `src/app/admin/cities/page.tsx` — data table of cities (name, lat, lng, country); add/edit/delete via server actions
- [ ] `src/app/admin/landmarks/page.tsx` — paginated table of all user landmarks; delete capability
- [ ] Supabase admin client (`service_role` key) used for admin operations (bypasses RLS)
- [ ] Server actions in `src/app/admin/actions.ts` for all CRUD operations
- [ ] Unauthorized access attempt redirected to `/` (not 401 page)
- [ ] Unit tests for middleware auth check
- [ ] `/verify` passes

## Steps
1. Add `ADMIN_EMAILS` to `.env.example` (comma-separated list of authorized admin email addresses)
2. Update `src/middleware.ts` (or create if missing) — for requests to `/admin/**`: get Supabase session from cookie using `@supabase/ssr`, check `session.user.email` against `process.env.ADMIN_EMAILS?.split(',')`, redirect to `/?error=unauthorized` if not in list
3. Create admin Supabase client util `src/lib/supabase/admin.ts` — uses `SUPABASE_SERVICE_ROLE_KEY`, bypasses RLS
4. Create `src/app/admin/layout.tsx` — server component; double-check auth; sidebar with links to Cities, Landmarks sections; styled with Tailwind
5. Create `src/app/admin/page.tsx` — fetch counts in parallel using admin client; display stat cards
6. Create `src/app/admin/cities/page.tsx` — `cities` table (create migration if not exists): `id`, `name`, `lat`, `lng`, `country`, `timezone`; display with shadcn `DataTable`; add/edit via a dialog form
7. Create `src/app/admin/landmarks/page.tsx` — fetch all landmarks (admin bypass RLS), display user_id + name + coordinates + created_at; delete button per row
8. Create `src/app/admin/actions.ts` — Next.js server actions: `createCity`, `updateCity`, `deleteCity`, `deleteLandmark`; all use admin Supabase client; revalidate path after mutations
9. Write `src/__tests__/middleware/admin-auth.test.ts` — mock Supabase session, test admin email passes, test non-admin redirects
10. Run `bun test` and `/verify`
