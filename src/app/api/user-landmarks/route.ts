import { NextRequest, NextResponse } from "next/server";
import { createServerClient, extractAccessToken } from "@/lib/supabase";
import type { CreateLandmarkInput, Landmark } from "@/types/landmark";

const LAT_MIN = -90;
const LAT_MAX = 90;
const LNG_MIN = -180;
const LNG_MAX = 180;
const NAME_MAX_LENGTH = 200;
const NOTES_MAX_LENGTH = 1000;

function isValidCoordinates(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  if (!isFinite(lat) || !isFinite(lng)) return false;
  return lat >= LAT_MIN && lat <= LAT_MAX && lng >= LNG_MIN && lng <= LNG_MAX;
}

function parseCreateInput(raw: unknown): CreateLandmarkInput | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim() : null;
  const lat = typeof body.lat === "number" ? body.lat : null;
  const lng = typeof body.lng === "number" ? body.lng : null;
  const notes = typeof body.notes === "string" ? body.notes.trim() : undefined;

  if (!name || name.length === 0 || name.length > NAME_MAX_LENGTH) return null;
  if (lat === null || lng === null || !isValidCoordinates(lat, lng)) return null;
  if (notes && notes.length > NOTES_MAX_LENGTH) return null;

  return { name, lat, lng, notes: notes || undefined };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get("Authorization");
  const accessToken = extractAccessToken(authHeader);
  const supabase = createServerClient(authHeader);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken ?? undefined);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_landmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch landmarks." }, { status: 500 });
  }

  return NextResponse.json({ landmarks: data as Landmark[] });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get("Authorization");
  const accessToken = extractAccessToken(authHeader);
  const supabase = createServerClient(authHeader);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken ?? undefined);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const input = parseCreateInput(rawBody);
  if (!input) {
    return NextResponse.json(
      {
        error:
          "Invalid input. Required: name (string, ≤200 chars), lat (number −90–90), lng (number −180–180). Optional: notes (string, ≤1000 chars).",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("user_landmarks")
    .insert({
      user_id: user.id,
      name: input.name,
      lat: input.lat,
      lng: input.lng,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save landmark." }, { status: 500 });
  }

  return NextResponse.json({ landmark: data as Landmark }, { status: 201 });
}
