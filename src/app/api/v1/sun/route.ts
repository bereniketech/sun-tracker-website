import { NextRequest, NextResponse } from "next/server";
import { computeSunData } from "@/lib/sun";
import { rateLimit } from "@/lib/rate-limit";
import type { SunData } from "@/types/sun";

interface SunApiResponse {
  lat: number;
  lng: number;
  date: string;
  timezone: string;
  sunrise: string;
  sunset: string;
  solarNoon: string;
  goldenHourMorning: {
    start: string;
    end: string;
  };
  goldenHourEvening: {
    start: string;
    end: string;
  };
  blueHourMorning: {
    start: string;
    end: string;
  };
  blueHourEvening: {
    start: string;
    end: string;
  };
  azimuth: number;
  elevation: number;
  dayLength: number;
}

interface ErrorResponse {
  error: string;
}

function validateCoordinates(
  lat: unknown,
  lng: unknown,
): { valid: true; lat: number; lng: number } | { valid: false; error: string } {
  if (typeof lat !== "string" || typeof lng !== "string") {
    return { valid: false, error: "lat and lng must be strings" };
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (!Number.isFinite(latNum)) {
    return { valid: false, error: "lat must be a valid number" };
  }

  if (!Number.isFinite(lngNum)) {
    return { valid: false, error: "lng must be a valid number" };
  }

  if (latNum < -90 || latNum > 90) {
    return { valid: false, error: "lat must be between -90 and 90" };
  }

  if (lngNum < -180 || lngNum > 180) {
    return { valid: false, error: "lng must be between -180 and 180" };
  }

  return { valid: true, lat: latNum, lng: lngNum };
}

function validateDate(dateStr: unknown): { valid: true; date: Date } | { valid: false; error: string } {
  if (typeof dateStr !== "string") {
    return { valid: false, error: "date must be a string" };
  }

  const date = new Date(dateStr);

  if (!Number.isFinite(date.getTime())) {
    return { valid: false, error: "date must be a valid ISO 8601 date string" };
  }

  return { valid: true, date };
}

function getTimezone(lng: number): string {
  // Approximate timezone offset based on longitude
  // This is simplified; in production, use a proper timezone library
  const offset = Math.round(lng / 15);
  return `UTC${offset > 0 ? "+" : ""}${offset}`;
}

function formatSunResponse(lat: number, lng: number, dateStr: string, sunData: SunData): SunApiResponse {
  return {
    lat,
    lng,
    date: dateStr,
    timezone: getTimezone(lng),
    sunrise: sunData.sunrise.toISOString(),
    sunset: sunData.sunset.toISOString(),
    solarNoon: sunData.solarNoon.toISOString(),
    goldenHourMorning: {
      start: sunData.goldenHour.start.toISOString(),
      end: sunData.goldenHour.end.toISOString(),
    },
    goldenHourEvening: {
      start: sunData.goldenHourEvening.start.toISOString(),
      end: sunData.goldenHourEvening.end.toISOString(),
    },
    blueHourMorning: {
      start: sunData.blueHour.start.toISOString(),
      end: sunData.blueHour.end.toISOString(),
    },
    blueHourEvening: {
      start: sunData.blueHourEvening.start.toISOString(),
      end: sunData.blueHourEvening.end.toISOString(),
    },
    azimuth: Math.round(sunData.sunAzimuth * 100) / 100,
    elevation: Math.round(sunData.sunElevation * 100) / 100,
    dayLength: sunData.dayLength,
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<SunApiResponse | ErrorResponse>> {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const dateStr = searchParams.get("date");

  // Validate coordinates
  const coordsValidation = validateCoordinates(lat, lng);
  if (!coordsValidation.valid) {
    return NextResponse.json<ErrorResponse>(
      { error: coordsValidation.error },
      { status: 400 },
    );
  }

  // Validate date
  const dateValidation = validateDate(dateStr);
  if (!dateValidation.valid) {
    return NextResponse.json<ErrorResponse>(
      { error: dateValidation.error },
      { status: 400 },
    );
  }

  // Apply rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "anonymous";
  const rateLimitResponse = await rateLimit(ip);

  if (!rateLimitResponse.success) {
    const resetSeconds = Math.ceil((rateLimitResponse.reset - Date.now()) / 1000);
    return NextResponse.json<ErrorResponse>(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": String(resetSeconds),
          "X-RateLimit-Limit": String(rateLimitResponse.limit),
          "X-RateLimit-Remaining": String(rateLimitResponse.remaining),
          "X-RateLimit-Reset": String(rateLimitResponse.reset),
        },
      },
    );
  }

  // Add CORS headers for public API
  const responseHeaders = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-RateLimit-Limit": String(rateLimitResponse.limit),
    "X-RateLimit-Remaining": String(rateLimitResponse.remaining),
    "X-RateLimit-Reset": String(rateLimitResponse.reset),
  });

  try {
    const sunData = computeSunData(coordsValidation.lat, coordsValidation.lng, dateValidation.date);
    const response = formatSunResponse(coordsValidation.lat, coordsValidation.lng, dateStr, sunData);

    return NextResponse.json<SunApiResponse>(response, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error computing sun data:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to compute sun data" },
      { status: 500, headers: responseHeaders },
    );
  }
}
