# Plan: Sun Tracker Website

## Goal
A comprehensive sun position and golden hour finder web app for photographers, architects, and planners — with interactive maps, real-time sun calculations, SEO city pages, and photographer mode.

## Constraints
- Next.js App Router with TypeScript
- Leaflet + OpenStreetMap (no Mapbox)
- SunCalc library for client-side sun calculations
- Supabase for database and auth
- Vercel deployment
- Mobile-first responsive design

## Deliverables
The plan must produce:
- `.spec/plan.md` — high-level project overview: goal, tech stack, architecture diagram, file structure
- `.spec/requirements.md` — user stories and acceptance criteria (EARS format)
- `.spec/design.md` — architecture, data models, API design, ADRs, security, performance
- `.spec/tasks.md` — ordered task list with acceptance criteria per task

## Instructions
Use /planning-specification-architecture.
Write `plan.md` first as the high-level overview, then follow the skill's 3-phase gated workflow: requirements → user approves → design → user approves → tasks → user approves.
Do not write implementation code. Do not skip approval gates.
Save each artifact only after the user explicitly approves that phase.
