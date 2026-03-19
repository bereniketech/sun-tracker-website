# Requirements: Sun Tracker Website

## Introduction
A comprehensive sun position and golden hour finder web application that enables photographers, architects, and urban planners to visualize sun trajectories, plan activities around golden/blue hours, and explore sun data for any location worldwide. The app combines an interactive Leaflet map with real-time SunCalc computations, a photographer planning mode, and SEO-optimized city pages.

## Requirements

### Requirement 1: Location Search & Selection

**User Story:** As a user, I want to find any location by city name, landmark, address, or coordinates, so that I can view sun data for that place.

#### Acceptance Criteria
1. WHEN the user types into the search bar THEN the system SHALL display autocomplete suggestions from a geocoding service.
2. WHEN the user selects a suggestion THEN the system SHALL center the map on that location and compute sun data.
3. WHEN the user enters manual coordinates (lat/lng) THEN the system SHALL validate the input and center the map accordingly.
4. WHEN the user clicks "Use my location" THEN the system SHALL request browser geolocation and center the map on the detected position.
5. IF browser geolocation is denied or unavailable THEN the system SHALL display a fallback message and allow manual entry.
6. WHEN the user clicks/taps on the map THEN the system SHALL place a pin and recalculate sun data for that position.
7. WHEN the user drags the pin THEN the system SHALL recalculate sun data in real time.

### Requirement 2: Sun & Lighting Calculations

**User Story:** As a user, I want to see accurate sun position data for my selected location and time, so that I can plan around natural lighting.

#### Acceptance Criteria
1. WHEN a location is selected THEN the system SHALL display: sunrise time, sunset time, solar noon, golden hour start/end, blue hour start/end, current sun azimuth, current sun elevation, and day length.
2. WHEN the time slider or date is changed THEN the system SHALL recalculate all sun data for the new time/date instantly (client-side).
3. The system SHALL compute shadow direction and approximate shadow length ratio based on sun elevation.
4. WHEN the date changes THEN the system SHALL show updated seasonal sun trajectory data.
5. The system SHALL use the SunCalc library for all astronomical calculations.

### Requirement 3: Interactive Map & Overlays

**User Story:** As a user, I want to see sun directions and overlays on the map, so that I can visualize how sunlight interacts with the terrain.

#### Acceptance Criteria
1. WHEN a location is active THEN the system SHALL render directional lines on the map for: sunrise azimuth, sunset azimuth, current sun azimuth, and shadow direction.
2. WHEN golden/blue hour is active THEN the system SHALL render arc overlays showing the sun's angular range during those periods.
3. The system SHALL render a sky path diagram (sun trajectory arc) showing the sun's movement across the sky for the selected date.
4. WHEN the user toggles a layer control THEN the system SHALL show/hide individual overlays independently.
5. The system SHALL use Leaflet with OpenStreetMap tiles.
6. The system SHALL support pinch-to-zoom and drag gestures on mobile.
7. WHEN the user enters fullscreen mode THEN the map SHALL expand to fill the viewport.

### Requirement 4: Time & Date Controls

**User Story:** As a user, I want to scrub through time and change dates, so that I can explore sun positions at any moment.

#### Acceptance Criteria
1. WHEN the user moves the time slider THEN the system SHALL update all sun calculations and map overlays in real time.
2. WHEN the user selects a date from the date picker THEN the system SHALL recalculate all data for that date.
3. WHEN the user clicks "animate" THEN the system SHALL animate the sun's movement across the sky for the selected date.
4. The system SHALL display daylight duration and how it changes relative to the previous day.
5. WHEN the user clicks "now" THEN the system SHALL reset to the current date/time.

### Requirement 5: Photographer Mode

**User Story:** As a photographer, I want a dedicated mode highlighting optimal lighting conditions, so that I can plan my shoots effectively.

#### Acceptance Criteria
1. WHEN photographer mode is enabled THEN the system SHALL prominently display golden hour and blue hour countdowns.
2. WHEN photographer mode is enabled THEN the system SHALL show a "best direction" indicator for sunrise/sunset shots based on current azimuth.
3. The system SHALL provide a 7-day lighting forecast showing golden/blue hour times for each day.
4. WHEN a day in the forecast has optimal conditions THEN the system SHALL highlight it as a "recommended" shooting day.
5. WHEN photographer mode is enabled THEN the system SHALL display a compass overlay showing sun and shadow directions.

### Requirement 6: Visual Compass

**User Story:** As a user, I want a compass showing cardinal directions and sun/shadow azimuths, so that I can quickly orient myself.

#### Acceptance Criteria
1. The system SHALL render a compass showing N/S/E/W.
2. WHEN sun data is calculated THEN the compass SHALL display sunrise, sunset, and current sun azimuth markers.
3. WHEN the shadow direction is calculated THEN the compass SHALL display a shadow direction marker.
4. WHEN the time slider moves THEN the compass SHALL update in real time.

### Requirement 7: Saved Favorites & User Accounts

**User Story:** As a returning user, I want to save my favorite locations, so that I can quickly access them on future visits.

#### Acceptance Criteria
1. WHEN an authenticated user clicks "save location" THEN the system SHALL persist it to Supabase.
2. WHEN an authenticated user loads the app THEN the system SHALL display their saved favorites.
3. WHEN an unauthenticated user clicks "save" THEN the system SHALL prompt them to sign in or sign up.
4. The system SHALL support email and social login via Supabase Auth.
5. WHEN a user deletes a favorite THEN the system SHALL remove it from the database.

### Requirement 8: Shareable URLs & Export

**User Story:** As a user, I want to share my current view and export data, so that I can collaborate with others.

#### Acceptance Criteria
1. The system SHALL encode location, date, time, and active overlays in the URL.
2. WHEN a user loads a shared URL THEN the system SHALL restore the exact view state.
3. WHEN the user clicks "export" THEN the system SHALL generate a CSV or JSON file with sun data for the selected location and date range.
4. WHEN the user clicks a social share button THEN the system SHALL open a share dialog with the current URL.

### Requirement 9: SEO City Pages

**User Story:** As a search engine visitor, I want dedicated city pages with sun data, so that I can find location-specific information via search.

#### Acceptance Criteria
1. The system SHALL generate server-rendered pages at `/city/[slug]` for top cities.
2. WHEN a city page loads THEN the system SHALL display precomputed sunrise/sunset times, golden/blue hour data, and seasonal highlights.
3. Each city page SHALL include structured data (JSON-LD) for search engines.
4. Each city page SHALL link to related city pages and the interactive tool.
5. The system SHALL include meta titles and descriptions optimized for search queries like "sunrise time in [city]".

### Requirement 10: Mobile & Accessibility

**User Story:** As a mobile user, I want a responsive, touch-friendly interface, so that I can use the app on any device.

#### Acceptance Criteria
1. The system SHALL render correctly on screens from 320px to 2560px wide.
2. The system SHALL use collapsible panels on mobile to maximize map visibility.
3. The system SHALL meet WCAG 2.1 AA contrast requirements.
4. The system SHALL support keyboard navigation for all interactive elements.
5. The system SHALL lazy-load map tiles and non-critical assets for performance.

### Requirement 11: Landmark Alignment (Stretch)

**User Story:** As a user, I want to visualize when the sun aligns with notable landmarks (e.g., Manhattanhenge), so that I can plan visits to alignment events.

#### Acceptance Criteria
1. WHEN the user selects a landmark THEN the system SHALL calculate dates when the sun aligns with the landmark's orientation.
2. WHEN an alignment event is found THEN the system SHALL display it on a calendar and overlay the alignment line on the map.
3. IF no alignment events exist for the selected year THEN the system SHALL inform the user.
