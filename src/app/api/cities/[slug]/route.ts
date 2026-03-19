import { NextResponse } from "next/server";
import { getCityBySlug, isValidCitySlug } from "@/lib/cities";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;

  if (!isValidCitySlug(slug)) {
    return NextResponse.json({ error: "Invalid city slug." }, { status: 400 });
  }

  const city = await getCityBySlug(slug);
  if (!city) {
    return NextResponse.json({ error: "City not found." }, { status: 404 });
  }

  return NextResponse.json({ city });
}
