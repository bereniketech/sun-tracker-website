# Requirements: Sun Tracker v2 — Enhanced Features

## Introduction
Sun Tracker v2 adds six new capabilities on top of the existing Next.js / SunCalc / Leaflet / Zustand / Supabase application. The existing app already delivers location search, sun calculations, map overlays, time slider, date picker, golden/blue hour countdowns, shadow info, best-direction indicator, photographer panel, landmark alignment, favorites, shareable URLs, compass, weekly forecast, and SEO city pages. These requirements cover only what is genuinely absent: a real-time lighting insight engine, a sky-arc diagram panel, multi-location comparison, month-by-month seasonal insights, browser push notifications, and an educational insights panel.

---

## Requirement 1: Lighting Insight Engine ("What Should I Do Now")

**User Story:** As a photographer or outdoor planner, I want the app to tell me whether current lighting is good, bad, or exceptional and what types of shots are possible right now, so that I can make instant creative decisions without interpreting raw sun data myself.

### Acceptance Criteria

1. WHEN a location and time are active THEN the system SHALL compute a lighting quality label from one of: `HARSH`, `SOFT`, `GOLDEN`, `BLUE`, `TWILIGHT`, `NIGHT` based on sun elevation and golden/blue hour windows.
2. WHEN the lighting label is `GOLDEN` or `BLUE` THEN the system SHALL surface at least two shot-type suggestions (e.g. "Perfect for silhouettes", "Ideal for portrait — diffuse light").
3. WHEN the lighting label is `HARSH` (elevation > 45°) THEN the system SHALL display a warning ("Light too harsh for portraits") and suggest compensating techniques (e.g. "Seek shade or use a diffuser").
4. WHEN the time slider moves THEN the insight label and shot suggestions SHALL update in real time without a page reload.
5. WHEN the sun is below the horizon (elevation ≤ 0°) THEN the system SHALL display a "No direct sunlight" state with appropriate night/twilight guidance.
6. The insight engine SHALL be displayed inside the existing Photographer Panel when photographer mode is active.
7. IF photographer mode is inactive THEN the insight engine SHALL be accessible as a collapsed "Lighting Tip" widget in the main info panel.

---

## Requirement 2: Sky Path Diagram

**User Story:** As a user, I want to see a visual arc showing the sun's path across the sky for the selected date and location, so that I can understand how high the sun gets and where golden hours fall without interpreting numbers.

### Acceptance Criteria

1. WHEN a location and date are selected THEN the system SHALL render a 2D arc diagram showing the sun's elevation from sunrise to sunset.
2. The diagram SHALL mark: sunrise point (left), solar noon (apex), sunset point (right), current sun position (animated dot), golden hour bands (amber fill), blue hour bands (sky-blue fill).
3. WHEN the time slider moves THEN the current-position dot on the arc SHALL update in real time.
4. WHEN the date changes THEN the arc height (peak elevation) and golden/blue hour bands SHALL update.
5. The diagram SHALL be rendered client-side using SVG (no external charting library required).
6. The diagram SHALL be responsive: minimum width 280 px, maintains aspect ratio on resize.
7. WHEN the sun never rises (polar night) THEN the system SHALL show a flat line with a "Polar night" label.
8. WHEN the sun never sets (midnight sun) THEN the system SHALL show a full arc with a "Midnight sun" label.

---

## Requirement 3: Multi-Location Comparison

**User Story:** As a travel planner or photographer scouting locations, I want to compare sun timing and golden hour conditions for up to three locations side by side, so that I can choose the best location for a shoot.

### Acceptance Criteria

1. WHEN the user opens the comparison panel THEN the system SHALL allow adding between 2 and 3 locations via the existing search bar component.
2. WHEN two or more locations are added THEN the system SHALL display, for each location and the selected date: sunrise time, sunset time, golden hour start/end, day length, and current sun elevation.
3. WHEN the date picker changes THEN all comparison columns SHALL update simultaneously.
4. WHEN a location is removed from the comparison THEN its column SHALL disappear and remaining columns reflow.
5. The comparison panel SHALL not replace the main map view — it SHALL appear as a modal or slide-over overlay.
6. WHEN the user closes the comparison panel THEN the main map SHALL restore its previous single-location state.
7. The comparison panel SHALL be shareable: the URL SHALL encode up to three locations when the comparison panel is open.
8. IF fewer than two locations are added THEN the system SHALL show a placeholder prompting the user to add a second location.

---

## Requirement 4: Seasonal Sun Insights

**User Story:** As a user planning long-term shoots or architectural studies, I want to see how sunrise time, sunset time, day length, and peak elevation change across all 12 months, so that I can identify the best season to visit a location.

### Acceptance Criteria

1. WHEN a location is active THEN the system SHALL render a seasonal chart showing one data point per month (the 21st of each month) for: sunrise time, sunset time, and day length.
2. The chart SHALL highlight the month with the longest day (summer solstice period) and the month with the shortest day (winter solstice period).
3. WHEN the user hovers over or taps a month THEN the system SHALL show a tooltip with exact sunrise time, sunset time, golden hour start, and day length for that month's reference day.
4. The chart SHALL be rendered client-side using SVG.
5. WHEN a new location is selected THEN the seasonal chart SHALL recalculate for the new coordinates.
6. The seasonal chart SHALL be accessible from the main info panel and from the SEO city pages.
7. The system SHALL compute seasonal data using the existing `computeSunData` function from `src/lib/sun.ts` — no new calculation library shall be introduced.

---

## Requirement 5: Browser Notifications and Reminders

**User Story:** As a returning user who wants to catch golden hour, I want to opt in to browser notifications that alert me shortly before golden hour begins at my saved or current location, so that I never miss the best light.

### Acceptance Criteria

1. WHEN the user clicks "Notify me at golden hour" THEN the system SHALL request browser Notification permission via the Web Notifications API.
2. IF the user grants permission THEN the system SHALL schedule a notification to fire 30 minutes before the next golden hour event (morning or evening) at the current location.
3. WHEN a notification fires THEN it SHALL read: "Golden hour starts in 30 minutes at [location name]. Open the tracker."
4. WHEN the notification is clicked THEN the browser SHALL focus the app and restore the saved location.
5. IF the user denies notification permission THEN the system SHALL show an inline message explaining how to re-enable notifications in browser settings.
6. The system SHALL use `setTimeout` scheduling within the browser tab — no server-side push infrastructure is required in v2.
7. WHEN the user changes location or date THEN any previously scheduled notifications SHALL be cancelled and rescheduled for the new location/time.
8. The system SHALL expose a "Disable reminders" button that clears all scheduled notifications and resets the permission state display.
9. IF the browser does not support the Notifications API THEN the system SHALL hide the opt-in button and show no error.

---

## Requirement 6: Educational Insights Panel

**User Story:** As a beginner photographer or curious user, I want contextual explanations of sun and lighting concepts (golden hour, blue hour, shadow ratios, solar noon) so that I understand why the app's data matters and how to apply it.

### Acceptance Criteria

1. WHEN a lighting period becomes active (golden, blue, solar noon) THEN the system SHALL surface a contextual tooltip or expandable card explaining what that period is and why it matters photographically.
2. The system SHALL provide educational entries for at least: Golden Hour, Blue Hour, Solar Noon, Shadow Length Ratio, Sun Azimuth, Sun Elevation.
3. WHEN the user clicks a data label (e.g. "Azimuth: 245°") THEN the system SHALL show an inline explanation of that term.
4. Educational content SHALL be static copy stored in a TypeScript constants file — no CMS or external API shall be required.
5. WHEN the user dismisses a tooltip THEN their preference SHALL be stored in `localStorage` and the tooltip SHALL not reappear for that term in the same session.
6. The educational panel SHALL be accessible via a "Learn more" link in the main info panel.
7. All educational copy SHALL be written at a reading level appropriate for non-technical users (plain English, no jargon without explanation).
