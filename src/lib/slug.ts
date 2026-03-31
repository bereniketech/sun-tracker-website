/**
 * Converts a display name into a URL-safe slug.
 * "São Paulo" → "sao-paulo", "Ho Chi Minh City" → "ho-chi-minh-city"
 */
export function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum → dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}
