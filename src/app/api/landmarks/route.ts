import { getAllLandmarks } from "@/lib/landmarks";
import { computeSunData } from "@/lib/sun";
import { discoverLandmarksForCity } from "@/lib/discover-landmarks";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const citySlug = searchParams.get("city");
  const category = searchParams.get("category");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const locationName = searchParams.get("locationName");

  let landmarks = await getAllLandmarks();

  if (citySlug) {
    landmarks = landmarks.filter((l) => l.citySlug === citySlug);
  }
  if (category) {
    landmarks = landmarks.filter((l) => l.category === category);
  }

  // Auto-discover when no landmarks found for a specific city and coords provided
  if (landmarks.length === 0 && citySlug && lat && lng && locationName) {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (
      !isNaN(parsedLat) && !isNaN(parsedLng) &&
      parsedLat >= -90 && parsedLat <= 90 &&
      parsedLng >= -180 && parsedLng <= 180
    ) {
      const result = await discoverLandmarksForCity(parsedLat, parsedLng, locationName);
      if (result.landmarks.length > 0) {
        landmarks = category
          ? result.landmarks.filter((l) => l.category === category)
          : result.landmarks;
      }
    }
  }

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
