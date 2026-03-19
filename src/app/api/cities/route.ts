import { NextResponse } from "next/server";
import { getAllCities, toCityListItem } from "@/lib/cities";

export async function GET(): Promise<NextResponse> {
  const cities = await getAllCities();
  return NextResponse.json({ cities: cities.map(toCityListItem) });
}
