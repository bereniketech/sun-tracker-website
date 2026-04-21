# Task 007: Custom Landmarks

## Skills
- .kit/skills/data-backend/postgres-patterns/SKILL.md
- .kit/skills/development/api-design/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md

## Agents
- @web-backend-expert
- @web-frontend-expert
- @database-architect

## Commands
- /tdd
- /verify
- /task-handoff

## Overview
Allow authenticated users to create custom alignment landmarks on the map (e.g., "Stonehenge viewpoint"), save them to Supabase with Row Level Security, and share via a URL parameter. Each landmark stores a name, coordinates, and optional notes.

## Acceptance Criteria
- [ ] Supabase migration creates `landmarks` table: `id uuid`, `user_id uuid FK auth.users`, `name text`, `lat double precision`, `lng double precision`, `notes text`, `created_at timestamptz`
- [ ] RLS policies: INSERT/SELECT/UPDATE/DELETE only for `auth.uid() = user_id`
- [ ] `src/app/api/landmarks/route.ts` — GET (list user's landmarks), POST (create), DELETE (by id)
- [ ] `src/hooks/useLandmarks.ts` — React hook for CRUD operations; optimistic updates
- [ ] `src/components/map/LandmarkMarker.tsx` — custom Leaflet marker with landmark icon; click opens edit/delete popup
- [ ] Long-press or right-click on map adds a new landmark at that location via a creation dialog
- [ ] `LandmarkDialog` component for create/edit with name + notes fields and form validation
- [ ] Share via URL: `?landmark={base64encodedLatLng}` query param; on load, center map to landmark
- [ ] All CRUD operations reflected in map immediately (optimistic update)
- [ ] Unit tests for API route handlers (mock Supabase client)
- [ ] `/verify` passes

## Steps
1. Create migration `supabase/migrations/YYYYMMDD_create_landmarks.sql` — table definition + RLS policies (authenticated users only, own rows only)
2. Create `src/types/landmark.ts` — `Landmark` interface matching table columns
3. Create `src/app/api/landmarks/route.ts`:
   - GET: `supabase.from('landmarks').select('*')` filtered by auth user; return array
   - POST: validate body (name required, lat/lng valid range), insert with `user_id = auth.uid()`
   - DELETE: delete by `id` where `user_id = auth.uid()`
4. Create `src/hooks/useLandmarks.ts` — fetch on mount, `createLandmark`, `deleteLandmark` functions with optimistic state updates; error rollback
5. Create `src/components/map/LandmarkMarker.tsx` — `L.Marker` with custom icon (`📍` emoji or SVG); `Popup` with name, notes, edit/delete buttons
6. Add long-press handler to Leaflet map (`touchstart` timeout 600ms → cancel on `touchend`/`touchmove`); right-click via `contextmenu` event — open `LandmarkDialog` with coords pre-filled
7. Create `src/components/landmarks/LandmarkDialog.tsx` — shadcn `Dialog`; form with name (required), notes (optional); submit calls `createLandmark`; edit mode pre-fills fields
8. Implement URL sharing: `src/lib/landmark-share.ts` — encode `{lat, lng, name}` to base64; decode on page load in a `useEffect` in `src/app/page.tsx`; center map and show a temporary highlight marker
9. Write `src/__tests__/api/landmarks.test.ts` — mock Supabase, test GET/POST/DELETE with auth and without auth (expect 401)
10. Run `bun test` and `/verify`
