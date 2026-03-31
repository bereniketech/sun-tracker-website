import { LANDMARKS } from "@/lib/landmarks";
import { computeSunData } from "@/lib/sun";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();

  const landmarksWithSunData = LANDMARKS.map((landmark) => {
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
