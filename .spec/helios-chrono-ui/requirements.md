# Requirements — helios-chrono-ui

## Goal
Full UI overhaul of Sun Tracker into "Helios Chrono" — a luxury celestial tracking application matching the stitch designs — with a 4-tab mobile app shell and full-stack backend for each tab.

## Design System (all screens)
- Fonts: Space Grotesk (headlines) + Inter (body/labels) via Google Fonts
- Palette: primary #9d4300 / primary-container #f97316; surfaces #f8f9ff → #eff4ff → #ffffff
- No explicit 1px borders — structural separation via tonal surface color shifts only
- Glassmorphism for floating/overlay elements (backdrop-blur: 12px, semi-transparent white)
- Primary buttons: gradient fill (#9d4300 → #f97316), rounded-xl, no border

## FR-1: Login Page `/login`
- "Helios Chrono" branding + sun icon, "PRECISION SOLAR TRACKING" subtitle
- Observer ID (email) + Access Key (password) — minimalist bracket input style
- Sign In gradient button + Continue as Guest button
- "New to the observatory? Create Account" link
- Reuses: existing useAuth hook + Supabase auth

## FR-2: App Shell
- Mobile: sticky top bar ("✦ HELIOS CHRONO" + menu icon) + bottom tab nav (4 tabs)
- Desktop: horizontal top nav (Dashboard | Analemma | Landmarks | Observatory) + settings/user icons
- Route-based: / (Dashboard), /analemma, /landmarks, /observatory

## FR-3: Dashboard Tab `/`
- Location header: observatory name, coordinates, local solar time
- Solar metric cards: Solar Zenith, Azimuth, Elevation
- Solar Orientation Live — reuses InteractiveMap + existing overlays
- Day Cycle panel: Sunrise / Solar Noon / Sunset with azimuths
- Photographic Windows: Golden Hour + Blue Hour
- Local Visibility: sky condition indicator
- Reuses: computeSunData, useSunTrackerStore, GoldenHourCountdown, BlueHourCountdown

## FR-4: Analemma Tab `/analemma`
- SVG figure-8 analemma visualization (sun's noon position for every day of the year)
- Solstice/equinox markers on the curve
- Chronological scrubber slider (Day 1–365)
- Live display: Equation of Time (±min/sec), Solar Declination (±°)
- Data cards: Solar Azimuth, Altitude, Mean Anomaly for selected day
- Ephemeris section: Solar Distance (AU), Obliquity (°), Geometric Mean Longitude (°)
- New backend: computeAnalemma(lat, lng, year) lib function — 365 noon sun positions

## FR-5: Landmarks Tab `/landmarks`
- Header "Celestial Landmarks" with filter tabs: Historic | Technical | Custom
- Landmark cards with image, name, location tag, azimuth/elevation/status, photo window
- Stonehenge, Giza Pyramids, Chichen Itza + existing 4 landmarks
- Live tracking badge on selected landmark
- Atmospheric Refraction Index widget with equatorial constant + Run Diagnostic
- Reuses: landmark-alignment.ts, existing LANDMARKS data

## FR-6: Observatory Tab `/observatory`
- "Observatory Control" heading + LIVE system feed badge
- Current Azimuth + Altitude large displays
- Solar feed visualization (animated sun disc)
- System status chips: Gimbal Logic, Filter Array, Thermal Sink
- Calibration sliders: Focus Offset (mm), Exposure Bias (EV)
- Capture Rate selector (5s / 10s / 30s / 60s) + Auto-Align + Capture buttons
- Solar Intensity display with color swatch bar
- Backend: calibration state persisted per user (localStorage for guest, Supabase for signed-in)

## FR-7: New API Routes
- GET /api/analemma?lat=&lng=&year= — 365 noon sun positions
- GET /api/landmarks — enhanced landmark list with location labels
- Reuses: /api/cities, /api/favorites, /api/geocode, auth

## What is NOT changing
- All existing lib functions (sun.ts, sky-path.ts, landmark-alignment.ts, lighting-insight.ts, etc.)
- Supabase schema + migrations
- Zustand store (minor state additions only)
- All existing API routes (/api/cities, /api/favorites, /api/geocode)
