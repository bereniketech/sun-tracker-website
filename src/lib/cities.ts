import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { computeSunData } from "@/lib/sun";
import { CITY_SEEDS } from "@/lib/cities-data";
import type { CityListItem, CityRecord, CitySeed, MonthlySunSnapshot } from "@/types/cities";

export const CITY_PAGE_REVALIDATE_SECONDS = 86400;

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function formatMonthLabel(monthIndex: number): string {
  return MONTH_LABELS[monthIndex] ?? `Month ${monthIndex + 1}`;
}

function createSampleDate(year: number, monthIndex: number): Date {
  return new Date(Date.UTC(year, monthIndex, 15, 12, 0, 0));
}

export function isValidCitySlug(slug: string): boolean {
  return VALID_SLUG.test(slug);
}

export function computeMonthlySunSnapshots(
  lat: number,
  lng: number,
  year = new Date().getUTCFullYear(),
): MonthlySunSnapshot[] {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const sampleDate = createSampleDate(year, monthIndex);
    const sunData = computeSunData(lat, lng, sampleDate);

    return {
      month: monthIndex + 1,
      monthLabel: formatMonthLabel(monthIndex),
      sampleDateIso: sampleDate.toISOString(),
      sunriseIso: sunData.sunrise.toISOString(),
      sunsetIso: sunData.sunset.toISOString(),
      solarNoonIso: sunData.solarNoon.toISOString(),
      goldenHourMorningStartIso: sunData.goldenHour.start.toISOString(),
      goldenHourMorningEndIso: sunData.goldenHour.end.toISOString(),
      goldenHourEveningStartIso: sunData.goldenHourEvening.start.toISOString(),
      goldenHourEveningEndIso: sunData.goldenHourEvening.end.toISOString(),
      blueHourMorningStartIso: sunData.blueHour.start.toISOString(),
      blueHourMorningEndIso: sunData.blueHour.end.toISOString(),
      blueHourEveningStartIso: sunData.blueHourEvening.start.toISOString(),
      blueHourEveningEndIso: sunData.blueHourEvening.end.toISOString(),
    };
  });
}

function withPrecomputedData(seed: CitySeed): CityRecord {
  return {
    ...seed,
    precomputed_data: computeMonthlySunSnapshots(seed.lat, seed.lng),
  };
}

const FALLBACK_CITY_RECORDS: CityRecord[] = CITY_SEEDS.map(withPrecomputedData);

function mapRowToCityRecord(row: Record<string, unknown>): CityRecord | null {
  const slug = typeof row.slug === "string" ? row.slug : null;
  const name = typeof row.name === "string" ? row.name : null;
  const country = typeof row.country === "string" ? row.country : null;
  const timezone = typeof row.timezone === "string" ? row.timezone : null;
  const lat = typeof row.lat === "number" ? row.lat : null;
  const lng = typeof row.lng === "number" ? row.lng : null;

  if (!slug || !name || !country || !timezone || lat === null || lng === null) {
    return null;
  }

  const precomputedRaw = row.precomputed_data;
  const precomputed_data = Array.isArray(precomputedRaw)
    ? (precomputedRaw as MonthlySunSnapshot[])
    : computeMonthlySunSnapshots(lat, lng);

  return {
    id: typeof row.id === "number" ? row.id : undefined,
    slug,
    name,
    country,
    lat,
    lng,
    timezone,
    precomputed_data,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : undefined,
  };
}

function getServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function toCityListItem(city: CityRecord): CityListItem {
  return {
    slug: city.slug,
    name: city.name,
    country: city.country,
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
  };
}

export async function getAllCities(): Promise<CityRecord[]> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return FALLBACK_CITY_RECORDS;
  }

  const { data, error } = await supabase.from("cities").select("*").order("country").order("name");

  if (error || !data) {
    return FALLBACK_CITY_RECORDS;
  }

  const rows = data
    .map((row) => mapRowToCityRecord(row as Record<string, unknown>))
    .filter((row): row is CityRecord => row !== null);

  return rows.length > 0 ? rows : FALLBACK_CITY_RECORDS;
}

export async function getCityBySlug(slug: string): Promise<CityRecord | null> {
  if (!isValidCitySlug(slug)) {
    return null;
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return FALLBACK_CITY_RECORDS.find((city) => city.slug === slug) ?? null;
  }

  const { data, error } = await supabase.from("cities").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    return FALLBACK_CITY_RECORDS.find((city) => city.slug === slug) ?? null;
  }

  return mapRowToCityRecord(data as Record<string, unknown>);
}

export async function getRelatedCities(country: string, slug: string, limit = 6): Promise<CityListItem[]> {
  const cities = await getAllCities();
  return cities
    .filter((city) => city.country === country && city.slug !== slug)
    .slice(0, limit)
    .map(toCityListItem);
}

export async function getCityIndexGroups(): Promise<Array<{ country: string; cities: CityListItem[] }>> {
  const cities = (await getAllCities()).map(toCityListItem);
  const map = new Map<string, CityListItem[]>();

  for (const city of cities) {
    const existing = map.get(city.country) ?? [];
    map.set(city.country, [...existing, city]);
  }

  return Array.from(map.entries())
    .map(([country, countryCities]) => ({
      country,
      cities: [...countryCities].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.country.localeCompare(b.country));
}
