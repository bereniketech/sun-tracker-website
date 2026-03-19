export interface GeocodingSuggestion {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
}

export interface GeocodingApiResponse {
  suggestions: GeocodingSuggestion[];
  error?: string;
}

interface NominatimSearchResult {
  place_id?: number | string;
  name?: string;
  display_name?: string;
  lat?: string;
  lon?: string;
}

function isNominatimSearchResult(value: unknown): value is NominatimSearchResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  return true;
}

function parseCoordinate(value: string | undefined): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}

export function createSearchCacheKey(query: string): string {
  return normalizeSearchQuery(query).toLowerCase();
}

export function parseCoordinateInput(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isLatitude(value: number): boolean {
  return value >= -90 && value <= 90;
}

export function isLongitude(value: number): boolean {
  return value >= -180 && value <= 180;
}

export function mapNominatimSuggestions(payload: unknown): GeocodingSuggestion[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((entry) => {
    if (!isNominatimSearchResult(entry)) {
      return [];
    }

    const lat = parseCoordinate(entry.lat);
    const lng = parseCoordinate(entry.lon);

    if (lat === null || lng === null) {
      return [];
    }

    const displayName = typeof entry.display_name === "string" ? entry.display_name : "";
    const name = typeof entry.name === "string" && entry.name.trim() ? entry.name : displayName;
    const placeId = String(entry.place_id ?? displayName);

    if (!displayName || !name || !placeId) {
      return [];
    }

    return [
      {
        placeId,
        name,
        displayName,
        lat,
        lng,
      },
    ];
  });
}