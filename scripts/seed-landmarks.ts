import { createClient } from "@supabase/supabase-js";
import { LANDMARKS_DATA } from "../src/lib/landmarks-data";

interface LandmarkInsertRow {
  landmark_id: string;
  name: string;
  lat: number;
  lng: number;
  orientation_azimuth: number;
  location: string | null;
  city_slug: string | null;
  category: string;
  image_gradient: string | null;
  updated_at: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createRows(): LandmarkInsertRow[] {
  const updated_at = new Date().toISOString();

  return LANDMARKS_DATA.map((lm) => ({
    landmark_id: lm.id,
    name: lm.name,
    lat: lm.lat,
    lng: lm.lng,
    orientation_azimuth: lm.orientationAzimuth,
    location: lm.location ?? null,
    city_slug: lm.citySlug ?? null,
    category: lm.category ?? "historic",
    image_gradient: lm.imageGradient ?? null,
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

  // Upsert in batches of 50 to avoid payload size limits
  const BATCH_SIZE = 50;
  let seeded = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("landmarks")
      .upsert(batch, { onConflict: "landmark_id" });

    if (error) {
      throw new Error(
        `Failed to seed landmarks batch ${i / BATCH_SIZE + 1}: ${error.message}`,
      );
    }

    seeded += batch.length;
  }

  process.stdout.write(`Seeded ${seeded} landmarks.\n`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
