# Implementation Plan: Sun Tracker Website

- [x ] 1. Initialize Next.js project, install dependencies, configure tooling
  - Scaffold Next.js 15 with App Router, TypeScript, Tailwind CSS, ESLint
  - Install: `suncalc`, `zustand`, `react-leaflet`, `leaflet`, `@supabase/supabase-js`, `shadcn/ui`
  - Configure `tsconfig.json`, `tailwind.config.ts`, path aliases
  - Set up Vitest + React Testing Library
  - Create base layout with responsive shell (header, main, sidebar)
  - _Requirements: 10.1, 10.2_
  - _Skills: /build-website-web-app, /code-writing-software-development_
  - **AC:** `bun dev` starts without errors. Tailwind classes render. Vitest runs with a passing smoke test. Layout responsive at 320px–2560px.

- [x] 2. Build SunCalc wrapper and Zustand store
  - Create `src/lib/sun.ts` — wrapper around SunCalc returning `SunData` interface
  - Compute: sunrise, sunset, solar noon, golden/blue hours, azimuth, elevation, shadow direction, shadow length ratio, day length, day length change
  - Create `src/store/sun-tracker-store.ts` — Zustand store with all state and actions
  - Write unit tests for all sun calculation functions
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Skills: /code-writing-software-development, /tdd-workflow_
  - **AC:** All SunCalc wrapper functions return correct values for known test cases (e.g., NYC on June 21). Zustand store actions update state correctly. 90%+ test coverage on `lib/sun.ts`.

- [ x] 3. Implement interactive Leaflet map with location pin
  - Create `src/components/map/` — dynamic import of Leaflet (SSR-safe)
  - Render OSM tiles, draggable location pin
  - Click-to-place pin, drag pin → update Zustand store location
  - Support pinch-to-zoom, touch gestures, fullscreen toggle
  - _Requirements: 1.6, 1.7, 3.5, 3.6, 3.7_
  - _Skills: /build-website-web-app, /code-writing-software-development_
  - **AC:** Map renders with OSM tiles. Pin is draggable. Clicking map places pin and updates store. Fullscreen works on mobile. No SSR errors.

- [x] 4. Build search bar with Nominatim geocoding and geolocation
  - Create `src/components/SearchBar.tsx` — autocomplete search input
  - Integrate Nominatim API with 500ms debounce, session storage caching, User-Agent header
  - Add manual coordinate input (lat/lng fields)
  - Add "Use my location" button with browser Geolocation API
  - Handle geolocation denied/unavailable with fallback message
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - _Skills: /build-website-web-app, /code-writing-software-development_
  - **AC:** Typing shows autocomplete suggestions. Selecting a suggestion centers map. Manual coords work. Geolocation button works (or shows fallback). Nominatim rate limit respected.

- [x] 5. Build time/date controls and sun animation
  - Create `src/components/controls/TimeSlider.tsx` — minute-resolution range input
  - Create `src/components/controls/DatePicker.tsx` — calendar date selector
  - Create animate button — `requestAnimationFrame` loop advancing time
  - Create "Now" button to reset to current time
  - Display daylight duration and change vs previous day
  - Wire all controls to Zustand store
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - _Skills: /build-website-web-app, /code-writing-software-development_
  - **AC:** Moving time slider updates sun data and map overlays in real time. Date picker changes recalculate all data. Animation smoothly moves sun across the day. "Now" resets correctly.

- [x] 6. Implement map overlays (sun lines, arcs, shadow, sun path)
  - Create `SunDirectionLines` — polylines for sunrise/sunset/current sun azimuth
  - Create `HourArcOverlays` — arc polygons for golden/blue hour angular ranges
  - Create `ShadowOverlay` — shadow direction polyline
  - Create `SunPathArc` — semicircular sun trajectory for the day
  - Create `LayerControl` — toggle checkboxes for each overlay
  - All overlays update reactively from Zustand store
  - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - _Skills: /build-website-web-app, /code-writing-software-development_
  - **AC:** Each overlay renders correctly on the map. Toggling layers shows/hides them independently. Overlays update when time slider moves. Lines point in correct azimuth directions.

- [x] 7. Build info panel with sun data display and SVG compass
  - Create `src/components/panels/SunDataDisplay.tsx` — formatted display of all sun values
  - Create `src/components/compass/Compass.tsx` — SVG compass with N/S/E/W, sunrise/sunset/sun/shadow markers
  - Create `src/components/panels/ShadowInfo.tsx` — shadow direction and length ratio
  - Compass updates in real time with time slider
  - Collapsible on mobile
  - _Requirements: 2.1, 6.1, 6.2, 6.3, 6.4, 10.2_
  - _Skills: /build-website-web-app, /code-writing-software-development_
  - **AC:** All sun data values display correctly. Compass renders with accurate markers. Shadow info shows direction and ratio. Panels collapse on mobile.

- [ ] 8. Build photographer mode panel
  - Create `src/components/panels/PhotographerPanel.tsx` — toggleable mode
  - Golden hour and blue hour countdown timers (live)
  - Best direction indicator based on sun azimuth
  - 7-day lighting forecast with golden/blue hour times
  - Highlight "recommended" shooting days
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Skills: /build-website-web-app, /code-writing-software-development_
  - **AC:** Toggle enables photographer mode. Countdowns tick in real time. 7-day forecast shows correct times. Recommended days highlighted. Compass visible in this mode.

- [ ] 9. Implement shareable URLs and data export
  - Encode location, date, time, active overlays in URL search params
  - Restore view state from URL on page load
  - CSV export: sun data for selected location + date range
  - JSON export: same data in JSON format
  - Social share buttons (copy link, Twitter, Facebook)
  - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - _Skills: /code-writing-software-development, /build-website-web-app_
  - **AC:** Changing state updates URL. Loading a shared URL restores exact view. CSV/JSON export downloads correct data. Share buttons open correct dialogs.

- [ ] 10. Set up Supabase auth and favorites
  - Configure Supabase client in `src/lib/supabase.ts`
  - Create auth UI (sign in/sign up modal) with Supabase Auth
  - Create `favorites` table with RLS policies
  - Build favorites panel: save, list, delete locations
  - Unauthenticated save prompts login
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - _Skills: /code-writing-software-development, /postgres-patterns, /security-review_
  - **AC:** Users can sign up/in. Saving a favorite persists to Supabase. Favorites list loads on auth. Delete works. RLS prevents cross-user access. Unauthenticated save shows login prompt.

- [ ] 11. Build SEO city pages with ISR
  - Seed `cities` table with top 100 cities (name, slug, lat, lng, timezone)
  - Create `src/app/city/[slug]/page.tsx` — SSR city page with precomputed sun data
  - Compute sunrise/sunset, golden/blue hour for each month
  - Add JSON-LD structured data
  - Add meta titles/descriptions optimized for "sunrise time in [city]"
  - Internal linking between related cities and interactive tool
  - Generate sitemap.xml
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - _Skills: /build-website-web-app, /code-writing-software-development, /postgres-patterns_
  - **AC:** `/city/new-york` renders SSR with correct sun data. JSON-LD present. Meta tags correct. Related city links work. Sitemap includes all city URLs. ISR revalidates every 24h.

- [ ] 12. Mobile optimization, accessibility, and performance
  - Audit responsive layout at 320px, 375px, 768px, 1024px, 1440px
  - Implement collapsible panels on mobile
  - WCAG 2.1 AA audit: contrast, keyboard nav, aria labels, focus management
  - Lazy-load Leaflet and non-critical components
  - Lighthouse audit: target LCP < 3s on mobile
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - _Skills: /build-website-web-app, /security-review_
  - **AC:** All breakpoints render correctly. Panels collapse on mobile. WCAG AA contrast passes. All interactive elements keyboard-navigable. Lighthouse performance score > 80.

- [ ] 13. Landmark alignment feature (stretch)
  - Create landmark data model (name, lat, lng, orientation azimuth)
  - Calculate alignment dates: when sun azimuth matches landmark orientation
  - Display alignment dates on a calendar view
  - Overlay alignment line on map
  - _Requirements: 11.1, 11.2, 11.3_
  - _Skills: /code-writing-software-development, /build-website-web-app_
  - **AC:** Selecting a landmark shows alignment dates. Calendar displays events. Map shows alignment line overlay. "No alignments" message displays when applicable.
