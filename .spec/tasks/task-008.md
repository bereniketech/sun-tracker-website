# Task 008: Solar Panel Planner

## Skills
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md
- .kit/skills/development/api-design/SKILL.md

## Agents
- @web-frontend-expert
- @software-developer-expert

## Commands
- /tdd
- /verify
- /task-handoff

## Overview
Build a solar panel optimizer tool that uses SunCalc annual irradiance data to recommend the optimal panel tilt and azimuth for a given location. Display the estimated optimal angle and annual kWh output based on user-configurable panel size.

## Acceptance Criteria
- [ ] `src/lib/solar.ts` — `computeOptimalPanelAngle(lat, lng): SolarResult` — samples sun elevation/azimuth at hourly intervals across the year, sums irradiance, finds tilt/azimuth that maximizes total; returns `{ optimalTilt, optimalAzimuth, annualKwhEstimate, monthlyKwh[] }`
- [ ] `SolarResult` type in `src/types/solar.ts`
- [ ] `src/components/solar/SolarPlannerPanel.tsx` — input: `panelSizeKw` (number slider, 1–20 kW), location from Zustand store; output: optimal tilt, optimal azimuth, estimated annual kWh, monthly chart
- [ ] Monthly kWh bar chart using a lightweight chart lib (Recharts — `bun add recharts`) or a simple Tailwind-based bar chart
- [ ] "Calculate" button triggers computation (runs in a Web Worker or with `setTimeout` chunking to avoid blocking UI)
- [ ] Result includes a sun path diagram showing the optimal angle relative to local horizon
- [ ] Panel accessible from a "Solar Planner" tab or button in the sidebar
- [ ] Unit tests for `computeOptimalPanelAngle` — verify NYC returns tilt ≈ latitude (within ±10°), azimuth ≈ 180° south
- [ ] `/verify` passes

## Steps
1. Create `src/types/solar.ts` — `SolarResult` interface: `{ optimalTilt: number, optimalAzimuth: number, annualKwhEstimate: number, monthlyKwh: number[], panelSizeKw: number }`
2. Create `src/lib/solar.ts`:
   - `computeOptimalPanelAngle(lat, lng, panelSizeKw = 1)`:
     - Iterate every day of the year (365), every hour (24)
     - Use `SunCalc.getPosition(date, lat, lng)` to get `altitude` and `azimuth`
     - For each tilt/azimuth combination (grid search: tilt 0–90 step 5°, azimuth 90–270 step 5°), compute irradiance: `max(0, sin(altitude) * cos(panelNormal - sunAzimuth) * cos(tilt - altitude))` × 1000 W/m²
     - Sum over year to get annual kWh per kWp
     - Pick combination with maximum sum
   - Return `SolarResult` with monthly breakdown
3. Create Web Worker at `public/workers/solar.worker.ts` — run computation off main thread; post result back; handle with `useWorker` hook or inline `new Worker()`
4. Create `src/hooks/useSolarPlanner.ts` — manages worker lifecycle, loading state, result
5. Create `src/components/solar/SolarPlannerPanel.tsx` — panel size slider, "Calculate" button, loading spinner, result cards (optimal tilt, optimal azimuth, annual kWh), monthly bar chart
6. Install Recharts: `bun add recharts` — use `BarChart` for monthly kWh breakdown
7. Add sun path diagram: SVG overlay showing sun arc with optimal panel plane line
8. Add "Solar Planner" button to sidebar navigation that opens `SolarPlannerPanel` in a modal or slide-over
9. Write `src/__tests__/lib/solar.test.ts` — test NYC (40.7, -74.0), verify tilt is within ±10° of latitude, azimuth is between 170°–190°
10. Run `bun test` and `/verify`
