import { LANDMARKS_DATA } from "@/lib/landmarks-data";

/** Client-safe static image map: landmark id → imageUrl from seed data. */
const STATIC_IMAGE_MAP = new Map<string, string>(
  LANDMARKS_DATA.filter((l) => l.imageUrl).map((l) => [l.id, l.imageUrl as string]),
);

/** Look up the curated static image URL for a landmark by id. */
export function getStaticImageUrl(id: string): string | undefined {
  return STATIC_IMAGE_MAP.get(id);
}
