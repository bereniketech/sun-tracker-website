# Task 005: Weather Overlay

## Skills
- .kit/skills/development/api-design/SKILL.md
- .kit/skills/frameworks-frontend/react-best-practices/SKILL.md
- .kit/skills/core/karpathy-principles/SKILL.md

## Agents
- @web-frontend-expert
- @web-backend-expert

## Commands
- /verify
- /tdd
- /task-handoff

## Overview
Integrate the Open-Meteo API (free, no API key) to show a cloud cover and precipitation overlay on the Leaflet map, plus a 7-day forecast widget. Weather data automatically updates when the user's selected location changes.

## Acceptance Criteria
- [ ] `src/lib/weather.ts` — `fetchWeather(lat, lng): Promise<WeatherData>` calling Open-Meteo API; includes current cloud cover %, precipitation, wind speed; 7-day daily forecast
- [ ] `WeatherData` type defined in `src/types/weather.ts`
- [ ] Weather is fetched on location change (debounced, 1s) via a Zustand slice or React Query
- [ ] `src/components/map/WeatherOverlay.tsx` — Leaflet layer that renders cloud cover tiles or a custom color overlay based on cloud percentage; toggled via the existing overlay controls
- [ ] `src/components/weather/ForecastWidget.tsx` — 7-day forecast panel showing day, icon (sunny/cloudy/rainy), high/low temp, precipitation %; visible in the sidebar
- [ ] Weather overlay toggle added to existing overlay control UI
- [ ] Loading skeleton while weather data fetches
- [ ] Error state shown if Open-Meteo request fails
- [ ] Unit tests for `src/lib/weather.ts` (mock fetch)
- [ ] `/verify` passes

## Steps
1. Create `src/types/weather.ts` — define `WeatherData`, `DailyForecast`, `WeatherCurrent` interfaces mapping Open-Meteo response fields (`cloud_cover`, `precipitation`, `wind_speed_10m`, `temperature_2m`, etc.)
2. Create `src/lib/weather.ts` — `fetchWeather(lat, lng)` calls `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=cloud_cover,precipitation,wind_speed_10m,temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,cloud_cover_mean&forecast_days=7&timezone=auto`; parse and return typed `WeatherData`
3. Add `weather` slice to Zustand store (`src/store/sun-tracker-store.ts`): `weatherData`, `weatherLoading`, `fetchWeatherForLocation(lat, lng)` action
4. Subscribe to location changes in a `useEffect` hook at the page level — call `fetchWeatherForLocation` with 1s debounce
5. Create `src/components/map/WeatherOverlay.tsx` — custom Leaflet layer using `L.CircleMarker` or `L.Rectangle` at location center with color coded by cloud cover percentage (0% = clear yellow, 100% = dark grey); render only when weather overlay is active
6. Add "Weather" to the overlay toggle buttons
7. Create `src/components/weather/ForecastWidget.tsx` — horizontal scroll of 7 days; each card: day name, cloud icon (dynamic), max/min temp, precipitation chance; styled with Tailwind + `dark:` variants
8. Add `ForecastWidget` to the sidebar or a collapsible panel below the map
9. Add loading skeleton (`src/components/weather/ForecastSkeleton.tsx`) shown while `weatherLoading` is true
10. Write `src/__tests__/lib/weather.test.ts` — mock `fetch`, test happy path, test error handling; run `bun test` and `/verify`
