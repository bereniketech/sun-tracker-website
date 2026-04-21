# Task 003: Push Notifications

## Skills
- .kit/skills/development/api-design/SKILL.md
- .kit/skills/data-backend/postgres-patterns/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/frameworks-frontend/nextjs-best-practices/SKILL.md

## Agents
- @web-backend-expert
- @web-frontend-expert
- @software-developer-expert

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Implement Web Push notifications so users can opt in to receive alerts at golden hour and blue hour. Store push subscriptions in Supabase `push_subscriptions` table. A Supabase Edge Function runs on a schedule to trigger notifications at the right times based on each user's saved location.

## Acceptance Criteria
- [ ] VAPID key pair generated and stored in environment variables (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`)
- [ ] `push_subscriptions` Supabase table created with columns: `id`, `user_id`, `endpoint`, `p256dh`, `auth`, `lat`, `lng`, `notification_types` (jsonb), `created_at`
- [ ] `src/app/api/push/subscribe/route.ts` — POST endpoint saves subscription to Supabase
- [ ] `src/app/api/push/unsubscribe/route.ts` — DELETE endpoint removes subscription
- [ ] `src/components/notifications/NotificationToggle.tsx` — requests permission, subscribes/unsubscribes, shows current status
- [ ] `supabase/functions/push-scheduler/index.ts` — Edge Function reads subscriptions, computes golden/blue hour for each user's lat/lng, sends web push payload via `web-push` library
- [ ] Supabase Edge Function scheduled with pg_cron (every 15 minutes) or Supabase cron jobs
- [ ] Push notification received in browser when golden/blue hour is within the next 15 minutes
- [ ] `/verify` passes

## Steps
1. Generate VAPID keys: `bunx web-push generate-vapid-keys` — add to `.env.example` and actual `.env`
2. Install `web-push`: `bun add web-push` and `bun add -d @types/web-push`
3. Create Supabase migration `supabase/migrations/YYYYMMDD_create_push_subscriptions.sql` — create `push_subscriptions` table with RLS policy (users can only read/write their own rows)
4. Create `src/app/api/push/subscribe/route.ts` — validate request body (endpoint, keys, lat, lng), upsert into `push_subscriptions` via Supabase service role client
5. Create `src/app/api/push/unsubscribe/route.ts` — delete subscription by `endpoint` for authenticated user
6. Create `src/lib/push-client.ts` — `subscribeToPush()` function using `serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_PUBLIC_KEY })`
7. Create `src/components/notifications/NotificationToggle.tsx` — check `Notification.permission`, request permission, call `subscribeToPush()`, POST to `/api/push/subscribe`, show toggle UI
8. Add `NotificationToggle` to the settings panel or header
9. Create `supabase/functions/push-scheduler/index.ts` — Deno Edge Function: fetch all `push_subscriptions`, for each compute golden/blue hour using SunCalc (import from `npm:suncalc`), if within 15-minute window send web push via `npm:web-push`
10. Deploy Edge Function: `supabase functions deploy push-scheduler`; set up pg_cron or Supabase scheduled function to run every 15 minutes
11. Write unit tests for subscribe/unsubscribe API routes (mock Supabase client); run `/verify`
