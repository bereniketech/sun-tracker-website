# Task 013: Email Reports

## Skills
- .kit/skills/development/api-design/SKILL.md
- .kit/skills/data-backend/postgres-patterns/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md

## Agents
- @web-backend-expert
- @software-developer-expert

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Send users a monthly HTML email digest of sun data highlights for their saved location via Resend API. A Supabase Edge Function runs on a cron schedule, generates the report, and sends it. Users can opt in/out from their settings panel.

## Acceptance Criteria
- [ ] `email_subscriptions` Supabase table: `id`, `user_id FK auth.users`, `email`, `lat`, `lng`, `location_name`, `opted_in boolean`, `created_at`
- [ ] RLS policies: users can only read/write their own row
- [ ] `src/app/api/email-reports/subscribe/route.ts` — POST to opt in; DELETE to opt out
- [ ] `src/components/settings/EmailReportToggle.tsx` — toggle shown in user settings panel; calls subscribe/unsubscribe API
- [ ] `supabase/functions/monthly-report/index.ts` — Deno Edge Function:
  - Fetch all `opted_in = true` subscriptions
  - For each, compute next month's sun highlights (avg sunrise/sunset, golden hour dates, day length trend)
  - Generate HTML email using a template
  - Send via Resend API (`resend.emails.send(...)`)
- [ ] Edge Function scheduled with Supabase cron (1st of each month, 08:00 UTC)
- [ ] `RESEND_API_KEY` in `.env.example`
- [ ] HTML email template renders correctly in major email clients (tested with Litmus or manual testing)
- [ ] Unit tests for subscribe/unsubscribe API routes (mock Supabase)
- [ ] `/verify` passes

## Steps
1. Create migration `supabase/migrations/YYYYMMDD_create_email_subscriptions.sql` — table + RLS policies
2. Create `src/types/email-report.ts` — `EmailSubscription` interface matching table; `MonthlyReport` interface for the data payload
3. Create `src/app/api/email-reports/subscribe/route.ts`:
   - POST: upsert subscription with `opted_in = true`; validate email, lat, lng
   - DELETE: update `opted_in = false` where `user_id = auth.uid()`
4. Create `src/components/settings/EmailReportToggle.tsx` — toggle switch with current opt-in state; email input field; "Save" button calls POST; "Unsubscribe" calls DELETE
5. Add `EmailReportToggle` to the user settings modal or profile panel
6. Create `supabase/functions/monthly-report/index.ts` (Deno):
   - Import Supabase client for service role queries
   - Import SunCalc from `npm:suncalc`
   - Fetch all `opted_in = true` rows from `email_subscriptions`
   - For each: compute monthly stats using SunCalc (iterate each day of next month; collect sunrise, sunset, golden hour start/end times; compute averages and trends)
   - Build HTML email from a template string (inline CSS for email client compatibility)
   - Send via `fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Authorization': \`Bearer \${RESEND_API_KEY}\` }, body: JSON.stringify({ from, to, subject, html }) })`
7. Configure Supabase cron: add `pg_cron` extension and schedule `supabase/functions/monthly-report` to run `0 8 1 * *` (1st of month, 8am UTC)
8. Deploy Edge Function: `supabase functions deploy monthly-report --no-verify-jwt`
9. Write `src/__tests__/api/email-reports.test.ts` — mock Supabase client; test POST creates subscription, DELETE sets opted_in false, unauthenticated POST returns 401
10. Run `bun test` and `/verify`
