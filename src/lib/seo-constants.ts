const DEFAULT_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "Sun Tracker by Helios Chrono";

export const SITE_DESCRIPTION =
  "Sun Tracker by Helios Chrono is a precision solar tracking app that calculates real-time sun position, sunrise, sunset, golden hour, and blue hour times for any location on Earth. Built for photographers, astronomers, and outdoor planners.";

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function siteUrl(path?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  const fromVercelProduction =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ?? "";
  const fromVercel = process.env.VERCEL_URL?.trim() ?? "";

  const resolvedBase =
    fromEnv && fromEnv.length > 0
      ? fromEnv
      : fromVercelProduction.length > 0
        ? fromVercelProduction
        : fromVercel.length > 0
          ? fromVercel
          : DEFAULT_SITE_URL;

  const base = normalizeBaseUrl(resolvedBase);

  return path ? `${base}${path}` : base;
}
