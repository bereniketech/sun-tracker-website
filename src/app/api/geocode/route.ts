import { NextRequest, NextResponse } from "next/server";
import {
  mapNominatimSuggestions,
  normalizeSearchQuery,
  type GeocodingApiResponse,
} from "@/lib/geocoding";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 5;
const DEFAULT_NOMINATIM_USER_AGENT = "sun-tracker-website/0.1";

export async function GET(request: NextRequest): Promise<NextResponse<GeocodingApiResponse>> {
  const query = normalizeSearchQuery(request.nextUrl.searchParams.get("q") ?? "");

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ suggestions: [] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", String(MAX_RESULTS));

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": process.env.NOMINATIM_USER_AGENT?.trim() || DEFAULT_NOMINATIM_USER_AGENT,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          suggestions: [],
          error: "Location search is temporarily unavailable.",
        },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as unknown;

    return NextResponse.json({
      suggestions: mapNominatimSuggestions(payload),
    });
  } catch {
    return NextResponse.json(
      {
        suggestions: [],
        error: "Location search is temporarily unavailable.",
      },
      { status: 502 },
    );
  }
}