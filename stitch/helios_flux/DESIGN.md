# Design System Document

## 1. Overview & Creative North Star: "The Celestial Chronometer"

This design system is built to transform technical solar data into a high-end editorial experience. Moving away from the "utility dashboard" aesthetic, we embrace a Creative North Star we call **The Celestial Chronometer**. 

The goal is to evoke the precision of a luxury timepiece combined with the expansive clarity of an observatory. We break the standard "box-and-grid" template by using intentional asymmetry, generous white space (kerning for the layout), and high-contrast typography scales. Data isn't just displayed; it is curated. The interface feels like a series of sophisticated, layered surfaces that react to light, mirroring the very subject the application tracks.

---

## 2. Colors & Tonal Depth

Our palette moves beyond simple hex codes to a functional hierarchy that mimics natural light and shadow.

### The Palette
- **Primary (`#9d4300` / `#f97316`):** Used for "Solar Energy." This is our heat and action color.
- **Surface Tiers:** We use a range from `surface_container_lowest` (#ffffff) to `surface_dim` (#cbdbf5) to create structural meaning.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Traditional "dividers" are forbidden. Physical boundaries must be defined solely through:
1.  **Background Color Shifts:** e.g., A `surface_container_low` sidebar sitting against a `surface` background.
2.  **Negative Space:** Using the Spacing Scale (specifically `8` or `12`) to create a cognitive break between data modules.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of fine paper or frosted glass. 
- **The Base:** Use `surface` (#f8f9ff) for the main canvas.
- **The Level 1 Layer:** Use `surface_container_low` (#eff4ff) for primary content zones.
- **The Callout Layer:** Use `surface_container_lowest` (#ffffff) for high-priority interactive cards. This creates a "lift" through color value rather than a drop shadow.

### The "Glass & Gradient" Rule
To elevate the "out-of-the-box" feel, use **Glassmorphism** for floating controllers or floating sun-path legends. Use a semi-transparent `surface_container_lowest` with a `backdrop-blur: 12px`.
- **Signature Textures:** Apply a subtle linear gradient from `primary` (#9d4300) to `primary_container` (#f97316) for main Action buttons or the "Active Sun Path" line in visualizations to provide professional "soul."

---

## 3. Typography: Editorial Precision

The typography conveys authority through a mix of technical sans-serifs and wide, geometric display faces.

*   **Display & Headline (Space Grotesk):** This is our "Technical Editorial" voice. Use `display-lg` (3.5rem) for hero solar metrics (e.g., current Azimuth). The wide stance of Space Grotesk feels engineered yet modern.
*   **Body & Label (Inter):** High-readability sans-serif for technical data points and secondary descriptions.
*   **The Hierarchy Rule:** Always pair a `display-sm` metric with a `label-sm` (all caps, tracked out +10%) to create a "spec-sheet" aesthetic common in high-end horology.

---

## 4. Elevation & Depth: Tonal Layering

Shadows and lines are crutches; we use tonal layering to achieve 3D space.

*   **The Layering Principle:** Place a `surface_container_lowest` card on top of a `surface_container_low` background. The slight shift in brightness creates a "Soft Lift" that feels integrated into the environment.
*   **Ambient Shadows:** If a floating element (like a modal or a floating action button) requires a shadow, use a large blur (24px–48px) at 6% opacity, tinted with `on_surface` (#0b1c30). This mimics natural ambient occlusion.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism:** Use semi-transparent white (20-40% opacity) with a background blur to indicate elements that "float" above the solar map, allowing the data visualization to bleed through the UI.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (0.75rem) roundedness. No border.
- **Secondary:** `surface_container_highest` fill with `on_surface` text. 
- **Tertiary:** No background. Text-only with an underline that appears on hover using the `primary` color.

### Input Fields
- **Architecture:** Use a "minimalist bracket" style. No full bounding box. Instead, use a subtle background shift (`surface_container_low`) and a `primary` color bottom-border (2px) only when focused.
- **Labels:** Always use `label-md` in `secondary` (#565e74) positioned above the input.

### Cards & Data Modules
- **Rule:** Forbid divider lines. Use vertical white space (`spacing.6`) or a shift from `surface_container_low` to `surface_container_lowest` to separate header from content.
- **Interaction:** On hover, a card should not grow; it should shift its background color slightly toward `surface_bright`.

### Additional Specialized Components
- **The Solar Scrubber:** A custom horizontal slider for time-tracking. The track uses `surface_variant`, while the thumb is a `primary` gradient circle with a `display-sm` timestamp floating above it in a glassmorphic tooltip.
- **Data Brackets:** Use small, L-shaped "corner" glyphs in `outline_variant` to frame key visualizations (like the analemma plot), giving them a "technical drawing" feel.

---

## 6. Do's and Don'ts

### Do
- **DO** use asymmetry. Place a large solar visualization on the left and a narrow, vertically stacked column of data on the right.
- **DO** use `spacing.20` and `spacing.24` for section margins. Space is a luxury; use it.
- **DO** use the `primary` orange sparingly as a "laser pointer" to guide the eye to the most critical sun-tracking data.

### Don't
- **DON'T** use 1px solid black or grey lines. They clutter the technical beauty of the data.
- **DON'T** use standard "drop shadows" (e.g., `0 4px 6px rgba(0,0,0,0.1)`). They look cheap. Use tonal shifts or ambient, tinted blurs.
- **DON'T** crowd the interface. If a screen feels full, move secondary data to a `surface_container_low` slide-out panel.