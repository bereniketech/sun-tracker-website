const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary";

interface WikiSummary {
  thumbnail?: { source: string };
  originalimage?: { source: string };
}

/**
 * Fetch a Wikipedia thumbnail URL for a landmark name.
 * Returns the thumbnail source URL or null when no image is available.
 */
export async function fetchWikipediaImageUrl(
  landmarkName: string,
): Promise<string | null> {
  const title = encodeURIComponent(landmarkName.replace(/\s+/g, "_"));

  try {
    const response = await fetch(`${WIKI_API}/${title}`, {
      headers: {
        "User-Agent": "SunTrackerWebsite/1.0 (bereniketech@gmail.com)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const data: WikiSummary = await response.json();
    const url = data.thumbnail?.source ?? data.originalimage?.source ?? null;

    if (!url) return null;

    // Request a larger thumbnail (640px) for better card display
    return url.replace(/\/\d+px-/, "/640px-");
  } catch {
    return null;
  }
}
