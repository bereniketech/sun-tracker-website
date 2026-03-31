import { getAllLandmarks } from "@/lib/landmarks";
import { computeSunData } from "@/lib/sun";

export const dynamic = "force-dynamic";

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
