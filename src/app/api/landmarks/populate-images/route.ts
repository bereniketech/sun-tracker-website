import { createClient } from "@supabase/supabase-js";
import { fetchWikipediaImageUrl } from "@/lib/wikipedia-image";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const BATCH_SIZE = 50;
const DELAY_MS = 150;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getServiceClient();
  if (!client) {
    return Response.json(
      { error: "Supabase not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const cityFilter = searchParams.get("city");

  let query = client
    .from("landmarks")
    .select("id, landmark_id, name")
    .is("image_url", null);

  if (cityFilter) {
    query = query.eq("city_slug", cityFilter);
  }

  const { data: rows, error } = await query.limit(500);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return Response.json({ updated: 0, failed: [], message: "No landmarks need images" });
  }

  const updated: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const updates: { id: number; image_url: string }[] = [];

    for (const row of batch) {
      const imageUrl = await fetchWikipediaImageUrl(row.name);

      if (imageUrl) {
        updates.push({ id: row.id, image_url: imageUrl });
        updated.push(row.landmark_id);
      } else {
        failed.push(row.landmark_id);
      }

      await delay(DELAY_MS);
    }

    if (updates.length > 0) {
      for (const update of updates) {
        await client
          .from("landmarks")
          .update({ image_url: update.image_url })
          .eq("id", update.id);
      }
    }
  }

  return Response.json({
    updated: updated.length,
    failed,
    message: `Populated ${updated.length} images, ${failed.length} failed`,
  });
}
