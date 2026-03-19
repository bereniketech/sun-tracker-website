import { createClient } from "@supabase/supabase-js";
import { CITY_SEEDS } from "../src/lib/cities-data";
import { computeMonthlySunSnapshots } from "../src/lib/cities";

interface CityInsertRow {
  slug: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  precomputed_data: ReturnType<typeof computeMonthlySunSnapshots>;
  updated_at: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createRows(): CityInsertRow[] {
  const updated_at = new Date().toISOString();

  return CITY_SEEDS.map((city) => ({
    slug: city.slug,
    name: city.name,
    country: city.country,
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
    precomputed_data: computeMonthlySunSnapshots(city.lat, city.lng),
    updated_at,
  }));
}

async function run(): Promise<void> {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const rows = createRows();
  const { error } = await supabase.from("cities").upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(`Failed to seed cities: ${error.message}`);
  }

  process.stdout.write(`Seeded ${rows.length} cities.\n`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
