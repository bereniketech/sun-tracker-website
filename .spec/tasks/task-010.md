# Task 010: Public REST API

## Skills
- .kit/skills/development/api-design/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/frameworks-frontend/nextjs-best-practices/SKILL.md
- .kit/skills/data-backend/postgres-patterns/SKILL.md

## Agents
- @web-backend-expert
- @software-developer-expert

## Commands
- /verify
- /tdd
- /quality-gate
- /task-handoff

## Overview
Expose a public REST API endpoint at `/api/v1/sun` that returns sun position, rise/set times, and golden/blue hour windows for a given lat/lng/date. Protect it with rate limiting via Upstash Redis and provide an OpenAPI spec at `/api/docs`.

## Acceptance Criteria
- [ ] `src/app/api/v1/sun/route.ts` — GET handler accepts `lat`, `lng`, `date` query params; validates ranges; computes sun data using existing `lib/sun.ts`; returns JSON
- [ ] Response schema: `{ lat, lng, date, timezone, sunrise, sunset, solarNoon, goldenHourMorning, goldenHourEvening, blueHourMorning, blueHourEvening, azimuth, elevation, dayLength }`
- [ ] Input validation: `lat` ∈ [-90, 90], `lng` ∈ [-180, 180], `date` parseable as ISO 8601; returns 400 with descriptive error on invalid input
- [ ] Rate limiting: 60 requests/minute per IP using Upstash Redis (`@upstash/ratelimit` + `@upstash/redis`); returns 429 with `Retry-After` header when exceeded
- [ ] `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` added to `.env.example`
- [ ] `public/api-spec.json` — OpenAPI 3.1 spec documenting the endpoint, request params, response schema, error codes
- [ ] `src/app/api/docs/route.ts` — serves `api-spec.json` as JSON; optionally renders Swagger UI via HTML response
- [ ] Unit tests for the API route (mock Upstash, test valid/invalid inputs, test rate limit response)
- [ ] `/verify` passes

## Steps
1. Install: `bun add @upstash/ratelimit @upstash/redis`
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env.example`
3. Create `src/lib/rate-limit.ts` — initialize `Ratelimit` with `slidingWindow(60, '1 m')` strategy; export `rateLimit(ip: string)` function returning `{ success, limit, reset, remaining }`
4. Create `src/app/api/v1/sun/route.ts`:
   - Parse and validate `lat`, `lng`, `date` from `request.nextUrl.searchParams`
   - Return 400 with `{ error: string }` on invalid input
   - Call `rateLimit(request.ip ?? 'anonymous')` — return 429 with `Retry-After` header if blocked
   - Call `computeSunData(lat, lng, new Date(date))` from `src/lib/sun.ts`
   - Return 200 with full response JSON
5. Add CORS headers to allow cross-origin requests (public API)
6. Create `public/api-spec.json` — OpenAPI 3.1 YAML/JSON spec with `info`, `paths./api/v1/sun.get` with parameters, responses 200/400/429; include examples
7. Create `src/app/api/docs/route.ts` — return `api-spec.json` content as JSON; add `Content-Type: application/json` header; optionally return a Swagger UI HTML page for GET requests with `Accept: text/html`
8. Write `src/__tests__/api/sun-api.test.ts` — mock `rateLimit`, test valid request returns correct structure, test invalid lat returns 400, test rate limit hit returns 429
9. Run `bun test` and `/verify`; manually test with `curl "http://localhost:3000/api/v1/sun?lat=40.71&lng=-74.00&date=2025-06-21"`
