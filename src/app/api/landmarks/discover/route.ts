import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { toSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

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

// ─── Constants ──────────────────────────────────────────────────────

const OVERPASS_API = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_M = 15000; // 15 km radius
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

function getServiceRoleClient() {
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

// ─── Row mapper ─────────────────────────────────────────────────────

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.landmark_id,
    name: row.name,
    lat: row.lat,
    lng: row.lng,
    orientationAzimuth: row.orientation_azimuth ?? 0,
    location: row.location,
    citySlug: row.city_slug,
    category: row.category,
    imageGradient: row.image_gradient,
    imageUrl: row.image_url ?? null,
  };
}

// ─── Route handler ──────────────────────────────────────────────────

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  const lat = typeof body.lat === "number" ? body.lat : null;
  const lng = typeof body.lng === "number" ? body.lng : null;
  const locationName = typeof body.locationName === "string" ? body.locationName : null;

  if (lat === null || lng === null || !locationName) {
    return NextResponse.json(
      { error: "lat, lng, and locationName are required." },
      { status: 400 },
    );
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json(
      { error: "Invalid coordinates." },
      { status: 400 },
    );
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 },
    );
  }

  const citySlug = toSlug(locationName);

  // Check if landmarks already exist for this city
  const { data: existing } = await supabase
    .from("landmarks")
    .select("landmark_id")
    .eq("city_slug", citySlug)
    .limit(1);

  if (existing && existing.length > 0) {
    // Already have landmarks for this city — fetch and return them
    const { data: allExisting } = await supabase
      .from("landmarks")
      .select("*")
      .eq("city_slug", citySlug)
      .order("name");

    return NextResponse.json({
      landmarks: (allExisting ?? []).map(mapRow),
      source: "cache",
      citySlug,
    });
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
      return NextResponse.json(
        { error: "Overpass API unavailable. Try again later." },
        { status: 502 },
      );
    }

    overpassData = (await response.json()) as OverpassResponse;
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch landmarks from OpenStreetMap." },
      { status: 502 },
    );
  }

  const rows = deduplicateRows(
    overpassData.elements
      .map((el) => elementToRow(el, citySlug, locationName))
      .filter((row): row is LandmarkInsertRow => row !== null),
  ).slice(0, MAX_LANDMARKS);

  if (rows.length === 0) {
    return NextResponse.json({
      landmarks: [],
      source: "overpass",
      citySlug,
      message: "No notable landmarks found near this location.",
    });
  }

  // Upsert landmarks into DB
  const { error: upsertError } = await supabase
    .from("landmarks")
    .upsert(rows, { onConflict: "landmark_id" });

  if (upsertError) {
    return NextResponse.json(
      { error: `Failed to save landmarks: ${upsertError.message}` },
      { status: 500 },
    );
  }

  // Fetch back the saved rows (so we get DB-assigned IDs)
  const { data: saved } = await supabase
    .from("landmarks")
    .select("*")
    .eq("city_slug", citySlug)
    .order("name");

  return NextResponse.json({
    landmarks: (saved ?? rows).map(mapRow),
    source: "overpass",
    citySlug,
  });
}
