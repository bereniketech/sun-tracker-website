import { createClient } from "@supabase/supabase-js";
import { getAllLandmarks } from "@/lib/landmarks";
import { computeSunData } from "@/lib/sun";
import { fetchWikipediaImageUrl } from "@/lib/wikipedia-image";
import { getFallbackImageUrl } from "@/lib/landmark-images";
import type { Landmark } from "@/types/sun";

export const dynamic = "force-dynamic";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Lazily populate missing Wikipedia images for landmarks.
 * First tries Wikipedia, then falls back to curated fallback URLs.
 * Updates DB in-place, and returns the enriched list.
 */
async function populateMissingImages(
  landmarks: Landmark[],
): Promise<Landmark[]> {
  const missing = landmarks.filter((lm) => !lm.imageUrl);
  if (missing.length === 0) return landmarks;

  const supabase = getServiceClient();

  const results = await Promise.allSettled(
    missing.map(async (lm) => {
      const wikiUrl = await fetchWikipediaImageUrl(lm.name);
      const fallbackUrl = getFallbackImageUrl(lm.name);
      const imageUrl = wikiUrl ?? fallbackUrl;
      return { id: lm.id, imageUrl };
    }),
  );

  const imageMap = new Map<string, string>();
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.imageUrl) {
      imageMap.set(result.value.id, result.value.imageUrl);
    }
  }

  // Persist to DB in background (fire-and-forget)
  if (supabase && imageMap.size > 0) {
    for (const [id, url] of imageMap) {
      supabase
        .from("landmarks")
        .update({ image_url: url })
        .eq("landmark_id", id)
        .then(() => {});
    }
  }

  return landmarks.map((lm) => {
    const url = imageMap.get(lm.id);
    return url ? { ...lm, imageUrl: url } : lm;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const citySlug = searchParams.get("city");
  const category = searchParams.get("category");

  let landmarks = await getAllLandmarks();

  if (citySlug) {
    landmarks = landmarks.filter((l) => l.citySlug === citySlug);
  }
  if (category) {
    landmarks = landmarks.filter((l) => l.category === category);
  }

  landmarks = await populateMissingImages(landmarks);

  const now = new Date();

  const landmarksWithSunData = landmarks.map((landmark) => {
    const sunData = computeSunData(landmark.lat, landmark.lng, now);
    return {
      ...landmark,
      currentAzimuth: sunData.sunAzimuth,
      currentAltitude: sunData.sunElevation,
    };
  });

  return Response.json({
    landmarks: landmarksWithSunData,
  });
}
