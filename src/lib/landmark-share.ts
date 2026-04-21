/**
 * Landmark sharing utility - encode/decode landmark coordinates to base64 URL params
 */

interface LandmarkShareData {
  lat: number;
  lng: number;
  name?: string;
}

/**
 * Encode landmark data to base64 string for URL sharing
 */
export function encodeLandmarkShare(data: LandmarkShareData): string {
  const json = JSON.stringify({
    lat: Math.round(data.lat * 1000000) / 1000000, // Round to 6 decimals
    lng: Math.round(data.lng * 1000000) / 1000000,
    name: data.name || "",
  });

  return Buffer.from(json).toString("base64");
}

/**
 * Decode landmark data from base64 string
 */
export function decodeLandmarkShare(encoded: string): LandmarkShareData | null {
  try {
    const json = Buffer.from(encoded, "base64").toString("utf-8");
    const data = JSON.parse(json) as Record<string, unknown>;

    const lat = typeof data.lat === "number" ? data.lat : null;
    const lng = typeof data.lng === "number" ? data.lng : null;

    if (lat === null || lng === null) {
      return null;
    }

    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return null;
    }

    return {
      lat,
      lng,
      name: typeof data.name === "string" && data.name ? data.name : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL with landmark data
 */
export function generateLandmarkShareUrl(data: LandmarkShareData): string {
  const encoded = encodeLandmarkShare(data);
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://sun-tracker.dev";
  return `${baseUrl}?landmark=${encoded}`;
}

/**
 * Parse landmark from URL search params
 */
export function parseLandmarkFromUrl(search: string): LandmarkShareData | null {
  const params = new URLSearchParams(search);
  const encoded = params.get("landmark");

  if (!encoded) {
    return null;
  }

  return decodeLandmarkShare(encoded);
}
