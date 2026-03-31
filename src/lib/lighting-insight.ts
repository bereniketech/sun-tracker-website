import type { SunData } from "@/types/sun";

export type LightingLabel = "HARSH" | "SOFT" | "GOLDEN" | "BLUE" | "TWILIGHT" | "NIGHT";

export interface ShotSuggestion {
  label: string;
  technique?: string;
}

export interface LightingInsight {
  label: LightingLabel;
  headline: string;
  warningMessage?: string;
  shotSuggestions: ShotSuggestion[];
}

const SHOT_SUGGESTIONS: Record<LightingLabel, ShotSuggestion[]> = {
  GOLDEN: [
    { label: "Backlit portraits", technique: "Position subject between camera and sun for rim-light glow." },
    { label: "Long shadows", technique: "Shoot perpendicular to sun direction to stretch leading lines." },
    { label: "Silhouettes", technique: "Expose for the bright sky and let foreground go dark." },
  ],
  BLUE: [
    { label: "Cityscape reflections", technique: "Use a tripod; balance ambient and artificial lights." },
    { label: "Minimalist seascapes", technique: "Long exposure smooths water and sky into complementary blues." },
    { label: "Street photography", technique: "Wet surfaces create natural mirrors in the cool blue cast." },
  ],
  TWILIGHT: [
    { label: "Sky-to-ground balance", technique: "Use graduated ND filter or bracket exposures for HDR." },
    { label: "Architecture with interior glow", technique: "Window light balances the dim sky at twilight." },
    { label: "Landscape silhouettes", technique: "Expose for the colorful horizon; foreground becomes graphic." },
  ],
  NIGHT: [
    { label: "Star trails", technique: "Open shutter ≥ 30 min; point towards Polaris for circular arcs." },
    { label: "Light painting", technique: "Slow shutter (10–30 s) while moving a torch through the frame." },
    { label: "Astroscapes", technique: "Wide lens, high ISO, 500-rule for pinpoint stars." },
  ],
  HARSH: [
    { label: "High-key abstracts", technique: "Embrace blown highlights; seek geometric shadows." },
    { label: "Open shade portraits", technique: "Move subject into shadow to avoid overhead hard light." },
    { label: "Reflector fill", technique: "Use a 5-in-1 reflector to fill deep eye shadows." },
  ],
  SOFT: [
    { label: "Natural light portraits", technique: "Overcast sky acts as a giant softbox; no harsh shadows." },
    { label: "Macro flowers", technique: "Diffuse light reveals texture and color without specular glare." },
    { label: "Environmental storytelling", technique: "Low contrast preserves shadow detail across wide scenes." },
  ],
};

const HEADLINES: Record<LightingLabel, string> = {
  GOLDEN: "Golden hour — warm, directional magic light",
  BLUE: "Blue hour — cool, ethereal twilight tones",
  TWILIGHT: "Twilight — rapid sky transitions, act fast",
  NIGHT: "Night — darkness, stars, artificial light sources",
  HARSH: "Harsh midday sun — high contrast, deep shadows",
  SOFT: "Soft diffuse light — even tones, great for detail",
};

const WARNINGS: Partial<Record<LightingLabel, string>> = {
  HARSH: "Midday sun causes unflattering shadows for portraits — seek shade or use fill light.",
  NIGHT: "Long exposures required; use a tripod and remote shutter release.",
};

function isWithinWindow(dateTime: Date, start: Date, end: Date): boolean {
  const t = dateTime.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function classifyByElevation(elevation: number): LightingLabel {
  if (elevation <= 0) return "NIGHT";
  if (elevation <= 6) return "TWILIGHT";
  if (elevation > 45) return "HARSH";
  return "SOFT";
}

export function computeLightingInsight(sunData: SunData, dateTime: Date): LightingInsight {
  let label: LightingLabel;

  if (
    isWithinWindow(dateTime, sunData.goldenHour.start, sunData.goldenHour.end) ||
    isWithinWindow(dateTime, sunData.goldenHourEvening.start, sunData.goldenHourEvening.end)
  ) {
    label = "GOLDEN";
  } else if (
    isWithinWindow(dateTime, sunData.blueHour.start, sunData.blueHour.end) ||
    isWithinWindow(dateTime, sunData.blueHourEvening.start, sunData.blueHourEvening.end)
  ) {
    label = "BLUE";
  } else {
    label = classifyByElevation(sunData.sunElevation);
  }

  return {
    label,
    headline: HEADLINES[label],
    warningMessage: WARNINGS[label],
    shotSuggestions: SHOT_SUGGESTIONS[label],
  };
}
