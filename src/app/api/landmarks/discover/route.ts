import { NextResponse } from "next/server";
import { discoverLandmarksForCity } from "@/lib/discover-landmarks";

export const dynamic = "force-dynamic";

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

  const result = await discoverLandmarksForCity(lat, lng, locationName);

  if (result.landmarks.length === 0 && result.message) {
    return NextResponse.json({
      landmarks: [],
      source: result.source,
      citySlug: result.citySlug,
      message: result.message,
    });
  }

  return NextResponse.json({
    landmarks: result.landmarks,
    source: result.source,
    citySlug: result.citySlug,
  });
}
