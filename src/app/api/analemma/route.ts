import { NextRequest, NextResponse } from "next/server";
import { computeAnalemma } from "@/lib/analemma";

const MIN_LAT = -90;
const MAX_LAT = 90;
const MIN_LNG = -180;
const MAX_LNG = 180;
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const yearParam = searchParams.get("year");

  if (latParam === null || lngParam === null || yearParam === null) {
    return NextResponse.json(
      { error: "Missing required parameters: lat, lng, year" },
      { status: 400 }
    );
  }

  const lat = parseFloat(latParam);
  const lng = parseFloat(lngParam);
  const year = parseInt(yearParam, 10);

  if (!Number.isFinite(lat) || lat < MIN_LAT || lat > MAX_LAT) {
    return NextResponse.json(
      { error: `lat must be a number between ${MIN_LAT} and ${MAX_LAT}` },
      { status: 400 }
    );
  }

  if (!Number.isFinite(lng) || lng < MIN_LNG || lng > MAX_LNG) {
    return NextResponse.json(
      { error: `lng must be a number between ${MIN_LNG} and ${MAX_LNG}` },
      { status: 400 }
    );
  }

  if (!Number.isFinite(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return NextResponse.json(
      { error: `year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}` },
      { status: 400 }
    );
  }

  const points = computeAnalemma(lat, lng, year);

  return NextResponse.json(
    { points },
    {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
}
