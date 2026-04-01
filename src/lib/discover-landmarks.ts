import { createClient } from "@supabase/supabase-js";
import { toSlug } from "@/lib/slug";
import type { Landmark } from "@/types/sun";

// ─── Types ──────────────────────────────────────────────────────────

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface LandmarkInsertRow {
  landmark_id: string;
  name: string;
  lat: number;
  lng: number;
  orientation_azimuth: number;
  location: string;
  city_slug: string;
  category: string;
  image_gradient: string;
  updated_at: string;
}

export interface DiscoverResult {
  landmarks: Landmark[];
  source: "cache" | "overpass";
  citySlug: string;
  message?: string;
}

// ─── Constants ──────────────────────────────────────────────────────

const OVERPASS_API = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_M = 15000;
const MAX_LANDMARKS = 15;

const CATEGORY_MAP: Record<string, string> = {
  castle: "historic",
  monument: "monument",
  memorial: "monument",
  ruins: "historic",
  archaeological_site: "historic",
  church: "religious",
  cathedral: "religious",
  mosque: "religious",
  temple: "religious",
  shrine: "religious",
  synagogue: "religious",
  monastery: "religious",
  tower: "modern",
  bridge: "modern",
  skyscraper: "modern",
  stadium: "modern",
  museum: "historic",
  palace: "historic",
  fort: "historic",
  city_gate: "historic",
  lighthouse: "technical",
  windmill: "technical",
  watermill: "technical",
  artwork: "modern",
  viewpoint: "natural",
  peak: "natural",
  waterfall: "natural",
  garden: "natural",
  park: "natural",
};

const GRADIENT_BY_CATEGORY: Record<string, string> = {
  historic: "from-amber-700 to-stone-500",
  religious: "from-red-800 to-red-600",
  monument: "from-amber-700 to-orange-500",
  modern: "from-sky-600 to-blue-800",
  natural: "from-green-600 to-emerald-400",
  technical: "from-slate-600 to-slate-400",
  custom: "from-violet-600 to-purple-400",
};

// ─── Helpers ────────────────────────────────────────────────────────

export function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function classifyCategory(tags: Record<string, string>): string {
  const historic = tags.historic;
  if (historic && CATEGORY_MAP[historic]) return CATEGORY_MAP[historic];

  const tourism = tags.tourism;
  if (tourism && CATEGORY_MAP[tourism]) return CATEGORY_MAP[tourism];

  const building = tags.building;
  if (building && CATEGORY_MAP[building]) return CATEGORY_MAP[building];

  const natural = tags.natural;
  if (natural && CATEGORY_MAP[natural]) return CATEGORY_MAP[natural];

  const amenity = tags.amenity;
  if (amenity === "place_of_worship") {
    const religion = tags.religion;
    if (religion === "christian") return "religious";
    if (religion === "muslim") return "religious";
    if (religion === "hindu") return "religious";
    if (religion === "buddhist") return "religious";
    if (religion === "jewish") return "religious";
    return "religious";
  }

  if (tags.man_made && CATEGORY_MAP[tags.man_made]) return CATEGORY_MAP[tags.man_made];

  return "historic";
}

function buildOverpassQuery(lat: number, lng: number): string {
  return `
[out:json][timeout:15];
(
  node["tourism"~"^(attraction|artwork|viewpoint)$"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["historic"](around:${SEARCH_RADIUS_M},${lat},${lng});
  way["historic"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["building"~"^(cathedral|church|mosque|temple|shrine|castle|palace)$"](around:${SEARCH_RADIUS_M},${lat},${lng});
  way["building"~"^(cathedral|church|mosque|temple|shrine|castle|palace)$"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["amenity"="place_of_worship"]["name"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["natural"~"^(peak|waterfall)$"]["name"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["man_made"~"^(lighthouse|tower|bridge)$"]["name"](around:${SEARCH_RADIUS_M},${lat},${lng});
);
out center ${MAX_LANDMARKS * 3};
`;
}

function elementToRow(
  element: OverpassElement,
  citySlug: string,
  locationLabel: string,
): LandmarkInsertRow | null {
  const tags = element.tags ?? {};
  const name = tags.name ?? tags["name:en"];
  if (!name) return null;

  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (lat === undefined || lng === undefined) return null;

  const category = classifyCategory(tags);

  return {
    landmark_id: `${citySlug}-${toSlug(name)}`,
    name,
    lat,
    lng,
    orientation_azimuth: 0,
    location: locationLabel,
    city_slug: citySlug,
    category,
    image_gradient: GRADIENT_BY_CATEGORY[category] ?? GRADIENT_BY_CATEGORY.historic,
    updated_at: new Date().toISOString(),
  };
}

function deduplicateRows(rows: LandmarkInsertRow[]): LandmarkInsertRow[] {
  const seen = new Set<string>();
  const unique: LandmarkInsertRow[] = [];

  for (const row of rows) {
    if (!seen.has(row.landmark_id)) {
      seen.add(row.landmark_id);
      unique.push(row);
    }
  }

  return unique;
}

export function mapRowToLandmark(row: LandmarkInsertRow): Landmark {
  return {
    id: row.landmark_id,
    name: row.name,
    lat: row.lat,
    lng: row.lng,
    orientationAzimuth: row.orientation_azimuth ?? 0,
    location: row.location,
    citySlug: row.city_slug,
    category: row.category as Landmark["category"],
  };
}

// Also map DB rows (snake_case fields from Supabase)
export function mapDbRowToLandmark(row: Record<string, unknown>): Landmark | null {
  const id = typeof row.landmark_id === "string" ? row.landmark_id : null;
  const name = typeof row.name === "string" ? row.name : null;
  const lat = typeof row.lat === "number" ? row.lat : null;
  const lng = typeof row.lng === "number" ? row.lng : null;

  if (!id || !name || lat === null || lng === null) return null;

  return {
    id,
    name,
    lat,
    lng,
    orientationAzimuth:
      typeof row.orientation_azimuth === "number" ? row.orientation_azimuth : 0,
    location: typeof row.location === "string" ? row.location : undefined,
    citySlug: typeof row.city_slug === "string" ? row.city_slug : undefined,
    category: typeof row.category === "string" ? (row.category as Landmark["category"]) : undefined,
  };
}

// ─── Core discover function ─────────────────────────────────────────

/**
 * Discovers landmarks near the given coordinates, persists them to Supabase
 * if available, and returns the results.
 */
export async function discoverLandmarksForCity(
  lat: number,
  lng: number,
  locationName: string,
): Promise<DiscoverResult> {
  const supabase = getServiceRoleClient();
  const citySlug = toSlug(locationName);

  if (supabase) {
    // Ensure a city row exists to satisfy the FK constraint
    await supabase
      .from("cities")
      .upsert(
        { slug: citySlug, name: locationName, country: "Unknown", lat, lng, timezone: "UTC" },
        { onConflict: "slug", ignoreDuplicates: true },
      );

    // Check if landmarks already exist for this city
    const { data: existing } = await supabase
      .from("landmarks")
      .select("*")
      .eq("city_slug", citySlug)
      .order("name");

    if (existing && existing.length > 0) {
      const landmarks = existing
        .map((r) => mapDbRowToLandmark(r as Record<string, unknown>))
        .filter((lm): lm is Landmark => lm !== null);

      return { landmarks, source: "cache", citySlug };
    }
  }

  // Fetch from Overpass API
  const query = buildOverpassQuery(lat, lng);

  let overpassData: OverpassResponse;
  try {
    const response = await fetch(OVERPASS_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      return { landmarks: [], source: "overpass", citySlug, message: "Overpass API unavailable." };
    }

    overpassData = (await response.json()) as OverpassResponse;
  } catch {
    return { landmarks: [], source: "overpass", citySlug, message: "Failed to fetch from OpenStreetMap." };
  }

  const rows = deduplicateRows(
    overpassData.elements
      .map((el) => elementToRow(el, citySlug, locationName))
      .filter((row): row is LandmarkInsertRow => row !== null),
  ).slice(0, MAX_LANDMARKS);

  if (rows.length === 0) {
    return { landmarks: [], source: "overpass", citySlug, message: "No notable landmarks found near this location." };
  }

  // Persist to DB when Supabase is available
  if (supabase) {
    const { error: upsertError } = await supabase
      .from("landmarks")
      .upsert(rows, { onConflict: "landmark_id" });

    if (!upsertError) {
      // Fetch back saved rows
      const { data: saved } = await supabase
        .from("landmarks")
        .select("*")
        .eq("city_slug", citySlug)
        .order("name");

      if (saved && saved.length > 0) {
        const landmarks = saved
          .map((r) => mapDbRowToLandmark(r as Record<string, unknown>))
          .filter((lm): lm is Landmark => lm !== null);

        return { landmarks, source: "overpass", citySlug };
      }
    }
  }

  // No DB — return Overpass results directly
  return {
    landmarks: rows.map(mapRowToLandmark),
    source: "overpass",
    citySlug,
  };
}
