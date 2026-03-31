export type EducationalTermKey =
  | "golden-hour"
  | "blue-hour"
  | "solar-noon"
  | "shadow-ratio"
  | "azimuth"
  | "elevation";

export interface EducationalEntry {
  term: string;
  shortDefinition: string;
  fullExplanation: string;
  photographyTip?: string;
}

export const EDUCATIONAL_ENTRIES: Record<EducationalTermKey, EducationalEntry> = {
  "golden-hour": {
    term: "Golden Hour",
    shortDefinition: "The first and last hour of sunlight each day, producing warm, diffused light.",
    fullExplanation:
      "The golden hour occurs during the first and last hour of sunlight in the day, when the sun is at a low angle in the sky (below 6° elevation). This creates warm, directional light with a distinctive golden or orange hue. The low contrast and soft shadows make it ideal for landscape and portrait photography.",
    photographyTip:
      "Align your camera toward the sun for backlighting effects, or position subjects to create rim lighting during golden hour.",
  },
  "blue-hour": {
    term: "Blue Hour",
    shortDefinition:
      "The brief period after sunset or before sunrise when the sky displays deep blue tones.",
    fullExplanation:
      "The blue hour happens shortly after sunset or before sunrise when the sun is below the horizon (typically between -6° and -18° elevation) but still illuminates the upper atmosphere, creating a deep, rich blue sky. During this time, artificial lights begin to balance with ambient light, creating unique color balance and mood.",
    photographyTip:
      "The blue hour is perfect for cityscapes and architectural photography when street lights and building lights are balanced with twilight.",
  },
  "solar-noon": {
    term: "Solar Noon",
    shortDefinition: "The moment when the sun reaches its highest point in the sky each day.",
    fullExplanation:
      "Solar noon is the exact moment when the sun reaches its zenith (highest point) in the sky for your location. This occurs when the sun crosses the local meridian. Solar noon differs from clock noon due to time zones and the equation of time.",
    photographyTip:
      "Avoid shooting during solar noon if possible due to harsh, high-contrast light that creates unflattering shadows. Use this time to scout locations or adjust camera settings.",
  },
  "shadow-ratio": {
    term: "Shadow Ratio",
    shortDefinition:
      "The proportional relationship between light falling on a subject and light in shadowed areas.",
    fullExplanation:
      "Shadow ratio describes the brightness difference between lit and shadowed areas, expressed as a ratio (e.g., 4:1 means the lit area is 4x brighter than shadows). This ratio affects mood, contrast, and how much detail is visible in shadow areas. Lower ratios (closer to 1:1) create even, flattering light; higher ratios (5:1 or more) create dramatic contrast.",
    photographyTip:
      "Use reflectors or fill flash to reduce shadow ratios in portrait photography for more balanced, forgiving lighting.",
  },
  azimuth: {
    term: "Azimuth",
    shortDefinition:
      "The compass direction where the sun appears, measured clockwise from north in degrees.",
    fullExplanation:
      "Azimuth is the horizontal direction of the sun measured in degrees from north (0°), going clockwise. East is 90°, south is 180°, and west is 270°. This is essential for planning shots that require the sun to be in a specific horizontal direction relative to your location.",
    photographyTip:
      "Use azimuth to plan backlighting, side-lighting, and directional shadow effects by positioning yourself relative to where the sun will be.",
  },
  elevation: {
    term: "Solar Elevation",
    shortDefinition: "The angle of the sun above the horizon, measured in degrees.",
    fullExplanation:
      "Solar elevation is the vertical angle of the sun above the horizon, ranging from -90° (directly below) to 90° (directly overhead). Positive values indicate the sun is above the horizon; negative values mean it is below. Elevation directly affects light quality, shadow length, and color temperature throughout the day.",
    photographyTip:
      "Low elevation angles (below 15°) create long shadows and warm colors—perfect for landscape photography with dramatic dimensionality.",
  },
};
