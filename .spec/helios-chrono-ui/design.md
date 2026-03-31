# Design — helios-chrono-ui

## Architecture Overview

```
src/
├── app/
│   ├── layout.tsx              ← REPLACE: Helios Chrono shell (topbar + bottom nav)
│   ├── page.tsx                ← Keep (renders DashboardPage)
│   ├── login/page.tsx          ← NEW
│   ├── analemma/page.tsx       ← NEW
│   ├── landmarks/page.tsx      ← NEW
│   ├── observatory/page.tsx    ← NEW
│   └── api/
│       ├── analemma/route.ts   ← NEW
│       └── landmarks/route.ts  ← NEW
│
├── components/
│   ├── shell/
│   │   ├── top-bar.tsx         ← NEW (sticky header)
│   │   └── bottom-nav.tsx      ← NEW (mobile tab bar)
│   ├── login/
│   │   └── login-form.tsx      ← NEW (wraps existing useAuth)
│   ├── dashboard/
│   │   ├── solar-metrics.tsx   ← NEW (Zenith/Azimuth/Elevation cards)
│   │   ├── day-cycle.tsx       ← NEW (Sunrise/Noon/Sunset panel)
│   │   └── photo-windows.tsx   ← NEW (Golden/Blue hour panel)
│   ├── analemma/
│   │   ├── analemma-svg.tsx    ← NEW (figure-8 SVG)
│   │   ├── chrono-scrubber.tsx ← NEW (day-of-year slider)
│   │   └── ephemeris-data.tsx  ← NEW (Solar Distance, Obliquity, etc.)
│   ├── landmarks/
│   │   ├── landmark-card.tsx   ← NEW (image + data card)
│   │   └── refraction-index.tsx ← NEW (atmospheric refraction widget)
│   └── observatory/
│       ├── solar-feed.tsx      ← NEW (animated sun disc)
│       ├── system-status.tsx   ← NEW (gimbal/filter/thermal chips)
│       └── calibration.tsx     ← NEW (sliders + capture)
│
├── lib/
│   └── analemma.ts             ← NEW (computeAnalemma function)
│
└── app/globals.css             ← EDIT: add Space Grotesk, design tokens
```

## Design Tokens (tailwind.config.ts additions)

```ts
colors: {
  primary: '#9d4300',
  'primary-container': '#f97316',
  'on-primary': '#ffffff',
  surface: '#f8f9ff',
  'surface-container-low': '#eff4ff',
  'surface-container': '#e5eeff',
  'surface-container-high': '#dce9ff',
  'surface-container-lowest': '#ffffff',
  'surface-dim': '#cbdbf5',
  'on-surface': '#0b1c30',
  secondary: '#565e74',
  outline: '#8c7164',
  'outline-variant': '#e0c0b1',
},
fontFamily: {
  headline: ['Space Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

## Key Component Designs

### TopBar
- Sticky, glassmorphic: bg-white/80 backdrop-blur-xl
- Left: flare icon (orange) + "HELIOS CHRONO" Space Grotesk bold, tracked wide, orange uppercase
- Right: notification bell + user avatar; desktop adds settings gear

### BottomNav (mobile only, md:hidden)
- 4 tabs: Dashboard (grid), Analemma (wave/analytics), Landmarks (location pin), Observatory (eye/telescope)
- Active: orange icon + orange underline indicator
- Background: surface-container-lowest with top ambient shadow

### Dashboard Layout
- Mobile: vertical stack — location header → metric cards row → map → day cycle → photo windows
- Desktop: left sidebar (metrics) | center (map) | right (day cycle + photo windows)
- Location header: label-sm "LIVE CELESTIAL TRACKING" orange + display-lg location name Space Grotesk

### Analemma SVG
- Coordinate space: x = Equation of Time (±16 min), y = Solar Declination (±23.5°)
- Orange gradient stroke for figure-8 path
- Current day: orange dot + glassmorphic tooltip
- Corner bracket glyphs (L-shapes in outline-variant) framing chart
- Solstice labels (Jun 21, Dec 21) + equinox labels (Mar 20, Sep 22)

### Landmark Cards
- Full-width image (h-40) with gradient overlay
- "LIVE TRACKING" pill badge top-left when active
- Name in Space Grotesk display-sm
- Azimuth / Elevation / Status 3-column data row
- Photo Window time range

### Observatory
- Azimuth + Altitude display-lg orange top-right
- Sun disc: circular SVG with CSS-animated pulsing corona rings
- Status chips: green=NORMAL, orange=ACTIVE, red=WARNING
- Sliders: accent-color orange thumb
- "INITIALIZE CALIBRATION" full-width gradient button

## Data Flow

```
useSunTrackerStore (zustand)
  ├── location + dateTime → computeSunData() → all solar metrics
  ├── location + year → GET /api/analemma → analemma data (cached by lat/lng/year)
  └── user (supabase) → calibration settings (localStorage for guest)

New store state:
  - calibration: { focusOffset: number; exposureBias: number; captureRate: number }
```

## New Lib: analemma.ts

```ts
export interface AnalemmaPoint {
  dayOfYear: number;       // 1–365
  date: Date;              // noon on that day
  equationOfTime: number;  // minutes (solar noon vs mean noon)
  declination: number;     // degrees (-23.5 to +23.5)
  azimuth: number;         // degrees at solar noon
  altitude: number;        // degrees at solar noon
  meanAnomaly: number;     // degrees (0–360)
  solarDistance: number;   // AU (approx 0.983–1.017)
}

export function computeAnalemma(lat: number, lng: number, year: number): AnalemmaPoint[]
```

## Route Structure

| Route        | Page        | Auth required |
|---|---|---|
| /login       | LoginForm   | No (redirects if signed in) |
| /            | Dashboard   | No (guest allowed) |
| /analemma    | Analemma    | No |
| /landmarks   | Landmarks   | No |
| /observatory | Observatory | No (calibration saves locally for guest) |

## No-Line Rule
All components must use tonal surface shifts or negative space for structure.
Never use border-gray-*, border-slate-*, divide-*, or any visible 1px lines.
Use border-outline-variant at 15% opacity only if accessibility requires it.
