# Task 012: Heatmap Visualization

## Skills
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/performance/web-performance-optimization/SKILL.md

## Agents
- @web-frontend-expert
- @software-developer-expert

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Add a sun azimuth frequency density heatmap overlay to the Leaflet map using the `leaflet.heat` plugin. The heatmap shows where the sun appears most frequently across the entire year for the selected location, helping photographers identify hotspots.

## Acceptance Criteria
- [x] `leaflet.heat` installed (`bun add leaflet.heat` + `bun add -d @types/leaflet.heat` or manual type declaration)
- [x] `src/lib/heatmap.ts` — `computeHeatmapPoints(lat, lng): HeatmapPoint[]` — samples sun position at hourly intervals for 365 days, projects azimuth/elevation to a local horizon coordinate plane, returns array of `[lat, lng, intensity]` points
- [x] `src/components/map/SunHeatmapLayer.tsx` — Leaflet layer using `L.heatLayer(points, { radius: 25, blur: 15, maxZoom: 17 })`; toggled via overlay controls
- [x] Computation runs in a Web Worker or memoized (heavy — 365 × 24 = 8,760 calculations)
- [x] "Sun Heatmap" toggle added to existing overlay controls
- [x] Loading indicator while heatmap is computing
- [x] Heatmap clears and recomputes when location changes
- [x] Unit tests for `computeHeatmapPoints` — verify NYC returns non-empty array, all points within valid lat/lng range
- [x] `/verify` passes

Status: COMPLETE
Completed: 2026-04-21T19:55:00Z

## Steps
1. Install `leaflet.heat`: `bun add leaflet.heat`; if no types package available, create `src/types/leaflet-heat.d.ts` declaring `declare module 'leaflet.heat'`
2. Create `src/types/heatmap.ts` — `HeatmapPoint = [lat: number, lng: number, intensity: number]`
3. Create `src/lib/heatmap.ts` — `computeHeatmapPoints(lat, lng)`:
   - For each day of 2025 (Date range Jan 1 – Dec 31, step 1 day):
     - For each hour 0–23:
       - Get `SunCalc.getPosition(date, lat, lng)` → `altitude`, `azimuth`
       - Skip if `altitude <= 0` (sun below horizon)
       - Project to offset coordinates: `pointLat = lat + (cos(azimuth) * altitude * 0.01)`, `pointLng = lng + (sin(azimuth) * altitude * 0.01)`
       - Intensity = `altitude / (Math.PI / 2)` (normalized 0–1)
       - Push `[pointLat, pointLng, intensity]`
   - Return array
4. Create a Web Worker at `public/workers/heatmap.worker.ts` — import SunCalc via `importScripts` or dynamic import; run computation; `postMessage(result)`
5. Create `src/hooks/useHeatmap.ts` — manages worker, loading state, cached `points` keyed by `lat+lng`
6. Create `src/components/map/SunHeatmapLayer.tsx`:
   - Client component (no SSR)
   - `import 'leaflet.heat'` and use `L.heatLayer(points, options).addTo(map)`
   - Subscribe to Leaflet map instance via context or ref
   - Re-render layer when `points` changes
   - Remove layer on component unmount
7. Add "Sun Heatmap" to the overlay toggle UI; when toggled on, trigger `useHeatmap.compute(lat, lng)`; when toggled off, remove layer
8. Add `<SunHeatmapLayer>` conditionally inside the map component
9. Write `src/__tests__/lib/heatmap.test.ts` — test NYC returns ≥ 4000 points (sun is up many hours), all latitudes within ±0.5 of input lat
10. Run `bun test` and `/verify`
