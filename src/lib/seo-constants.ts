const DEFAULT_SITE_URL = "https://sun-tracker.example.com";

export const SITE_NAME = "Helios Chrono";

export const SITE_DESCRIPTION =
  "Helios Chrono is a precision solar tracking application that calculates sunrise, sunset, golden hour, and blue hour times for any location on Earth. Built for photographers and astronomers who need accurate celestial alignment data.";

export function siteUrl(path?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base =
    fromEnv && fromEnv.length > 0
      ? fromEnv.replace(/\/$/, "")
      : DEFAULT_SITE_URL;
  return path ? `${base}${path}` : base;
}
