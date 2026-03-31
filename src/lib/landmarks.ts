import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Landmark } from "@/types/sun";
import { LANDMARKS_DATA } from "@/lib/landmarks-data";

// ─── Fallback: static seed data used when Supabase is unavailable ───
const FALLBACK_LANDMARKS: Landmark[] = LANDMARKS_DATA;

// ─── DB row → Landmark mapping ──────────────────────────────────────

function mapRowToLandmark(row: Record<string, unknown>): Landmark | null {
  const id = typeof row.landmark_id === "string" ? row.landmark_id : null;
  const name = typeof row.name === "string" ? row.name : null;
  const lat = typeof row.lat === "number" ? row.lat : null;
  const lng = typeof row.lng === "number" ? row.lng : null;

  if (!id || !name || lat === null || lng === null) {
    return null;
  }

  return {
    id,
    name,
    lat,
    lng,
    orientationAzimuth:
      typeof row.orientation_azimuth === "number" ? row.orientation_azimuth : 0,
    location: typeof row.location === "string" ? row.location : undefined,
    citySlug: typeof row.city_slug === "string" ? row.city_slug : undefined,
    category: isValidCategory(row.category) ? row.category : undefined,
    imageGradient:
      typeof row.image_gradient === "string" ? row.image_gradient : undefined,
    imageUrl: typeof row.image_url === "string" ? row.image_url : undefined,
  };
}

type LandmarkCategory = NonNullable<Landmark["category"]>;

const VALID_CATEGORIES: Set<string> = new Set([
  "historic",
  "religious",
  "monument",
  "modern",
  "natural",
  "technical",
  "custom",
]);

function isValidCategory(value: unknown): value is LandmarkCategory {
  return typeof value === "string" && VALID_CATEGORIES.has(value);
}

// ─── Supabase client ────────────────────────────────────────────────

function getServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ─── Public API ─────────────────────────────────────────────────────

/** In-memory export for synchronous consumers (search bar, alignment panel). */
export const LANDMARKS: Landmark[] = FALLBACK_LANDMARKS;

/** Fetch all landmarks from DB, falling back to seed data. */
export async function getAllLandmarks(): Promise<Landmark[]> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return FALLBACK_LANDMARKS;
  }

  const { data, error } = await supabase
    .from("landmarks")
    .select("*")
    .order("city_slug")
    .order("name");

  if (error || !data) {
    return FALLBACK_LANDMARKS;
  }

  const rows = data
    .map((row) => mapRowToLandmark(row as Record<string, unknown>))
    .filter((row): row is Landmark => row !== null);

  return rows.length > 0 ? rows : FALLBACK_LANDMARKS;
}

/** Fetch landmarks for a specific city from DB, falling back to seed data. */
export async function getLandmarksByCitySlugAsync(
  citySlug: string,
): Promise<Landmark[]> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return FALLBACK_LANDMARKS.filter((lm) => lm.citySlug === citySlug);
  }

  const { data, error } = await supabase
    .from("landmarks")
    .select("*")
    .eq("city_slug", citySlug)
    .order("name");

  if (error || !data || data.length === 0) {
    return FALLBACK_LANDMARKS.filter((lm) => lm.citySlug === citySlug);
  }

  return data
    .map((row) => mapRowToLandmark(row as Record<string, unknown>))
    .filter((row): row is Landmark => row !== null);
}

// ─── Synchronous helpers (use fallback data) ────────────────────────

export function getLandmarkById(id: string): Landmark | null {
  return LANDMARKS.find((landmark) => landmark.id === id) ?? null;
}

export function getLandmarksByCitySlug(citySlug: string): Landmark[] {
  return LANDMARKS.filter((landmark) => landmark.citySlug === citySlug);
}

export function getLandmarksByCategory(
  category: Landmark["category"],
): Landmark[] {
  return LANDMARKS.filter((landmark) => landmark.category === category);
}

export function getUniqueCitySlugs(): string[] {
  const slugs = new Set<string>();
  for (const landmark of LANDMARKS) {
    if (landmark.citySlug) {
      slugs.add(landmark.citySlug);
    }
  }
  return Array.from(slugs).sort();
}
