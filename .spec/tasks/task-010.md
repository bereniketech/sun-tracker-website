---
task: 010
feature: sun-tracker-website
status: complete
depends_on: [004]
---

# Task 010: Set up Supabase auth and favorites

## Session Bootstrap
> Load these before reading anything else. Do not load skills not listed here.

Skills: /code-writing-software-development, /postgres-patterns, /security-review
Commands: /verify, /task-handoff

---

## Objective
Configure the Supabase client, create auth UI (sign in/sign up), create the `favorites` table with Row Level Security, and build the favorites panel for saving, listing, and deleting locations. Unauthenticated users are prompted to log in when trying to save.

---

## Codebase Context
> Pre-populated by Task Enrichment. No file reading required.

### Key Code Snippets
[greenfield — no existing files to reference]

### Key Patterns in Use
[greenfield — no existing files to reference]

### Architecture Decisions Affecting This Task
- Supabase client reads from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- RLS policy on favorites: `auth.uid() = user_id`
- Auth via Supabase Auth (email + social)

---

## Handoff from Previous Task
**Files changed by previous task:** _(none yet)_
**Decisions made:** _(none yet)_
**Context for this task:** _(none yet)_
**Open questions left:** _(none yet)_

---

## Implementation Steps
1. Create `src/lib/supabase.ts`:
   - Browser client: `createBrowserClient(url, anonKey)`
   - Server client: `createServerClient(url, anonKey, { cookies })` for API routes
2. Create SQL migration for `favorites` table:
   - Schema from design doc
   - RLS: `auth.uid() = user_id` for SELECT, INSERT, DELETE
   - Save as `supabase/migrations/001_favorites.sql`
3. Create `src/components/auth/AuthModal.tsx`:
   - Sign in with email/password
   - Sign up with email/password
   - Social login buttons (Google, GitHub — configurable)
   - Uses Supabase Auth UI or custom form
4. Create `src/hooks/useAuth.ts`:
   - Subscribe to auth state changes
   - Expose: user, signIn, signUp, signOut, isLoading
5. Create `src/components/panels/FavoritesPanel.tsx`:
   - List saved favorites (fetch from Supabase)
   - "Save current location" button
   - Delete button per favorite
   - Click favorite → `store.setLocation`
6. Create `src/app/api/favorites/route.ts`:
   - GET: list favorites for authenticated user
   - POST: save new favorite (validate input)
   - Authenticate via Supabase server client
7. Create `src/app/api/favorites/[id]/route.ts`:
   - DELETE: remove favorite (verify ownership)
8. If unauthenticated user clicks "save" → open AuthModal

_Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
_Skills: /code-writing-software-development, /postgres-patterns, /security-review_

---

## Acceptance Criteria
- [ ] Users can sign up and sign in with email
- [ ] Saving a favorite persists to Supabase and appears in the list
- [ ] Favorites list loads on page load for authenticated users
- [ ] Delete removes the favorite from Supabase and the list
- [ ] RLS prevents accessing other users' favorites (test via API)
- [ ] Unauthenticated "save" opens the auth modal
- [ ] Clicking a favorite centers the map on that location
- [ ] All existing tests still pass
- [ ] `/verify` passes

---

## Handoff to Next Task
> Fill via `/task-handoff` after completing this task.

**Files changed:** _(fill via /task-handoff)_
**Decisions made:** _(fill via /task-handoff)_
**Context for next task:** _(fill via /task-handoff)_
**Open questions:** _(fill via /task-handoff)_
