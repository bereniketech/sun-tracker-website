# Sun Tracker Website

Interactive solar tracking app built with Next.js, React, TypeScript, Leaflet, and Zustand.

The app helps users explore:

- Real-time sun position
- Sunrise and sunset times
- Golden hour and blue hour windows
- Map-based location search and sun path exploration

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Leaflet + React Leaflet
- Zustand
- Supabase (auth/data integration)
- Vitest + Testing Library

## Prerequisites

- Node.js 20+
- npm 10+

Windows note: use `npm.cmd` in `cmd` if PowerShell execution policy blocks npm scripts.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Available Scripts

- `npm run dev`: Start local development server
- `npm run build`: Create production build
- `npm run start`: Run production build locally
- `npm run lint`: Run ESLint
- `npm run test`: Run test suite once (Vitest)
- `npm run test:watch`: Run Vitest in watch mode

## Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

If local test cache behaves unexpectedly, clear Vitest cache and rerun tests.

## Database / Supabase

SQL migrations are in:

- `supabase/migrations/001_favorites.sql`
- `supabase/migrations/002_cities.sql`
- `supabase/migrations/003_landmarks.sql`

Apply migrations with your preferred Supabase workflow (CLI or dashboard SQL editor).

## Project Structure

```text
src/
	app/           Next.js routes, layout, metadata
	components/    UI, map, dashboard, controls, panels
	hooks/         Reusable client hooks
	lib/           Domain logic (sun math, geocoding, schema, data helpers)
	store/         Zustand state store
	types/         Shared TypeScript types
	__tests__/     Unit, component, integration, and smoke tests
supabase/
	migrations/    SQL migrations
scripts/
	seed-*.ts      Seed data utilities
```

## Build and Deploy

1. Build:

```bash
npm run build
```

2. Start:

```bash
npm run start
```

Set required environment variables in your deployment platform before starting the app.

## Notes

- Client-side Supabase initialization requires both public env vars at runtime.
- Map and solar features rely on browser APIs and geospatial rendering, so verify behavior on both desktop and mobile.
