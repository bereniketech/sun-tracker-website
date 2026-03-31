"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { LANDMARKS } from "@/lib/landmarks";
import { findNearestCitySlug, CITY_SEEDS } from "@/lib/cities-data";
import { toSlug } from "@/lib/slug";
import { LandmarkCard } from "@/components/landmarks/landmark-card";
import { RefractionIndex } from "@/components/landmarks/refraction-index";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { Landmark } from "@/types/sun";

type FilterCategory = "all" | "historic" | "religious" | "monument" | "modern" | "natural" | "technical" | "custom";

interface LandmarkWithData extends Landmark {
  location?: string;
  imageGradient?: string;
  currentAzimuth?: number;
  currentAltitude?: number;
}

function getInitialCitySlug(): string {
  const { location, locationName } = useSunTrackerStore.getState();
  const nearest = findNearestCitySlug(location.lat, location.lng);
  if (nearest) return nearest;
  // For non-seeded cities (e.g. Kuwait), derive slug from location name
  if (locationName) return toSlug(locationName);
  return "all";
}

export default function LandmarksPage() {
  const [landmarks, setLandmarks] = useState<LandmarkWithData[]>(LANDMARKS);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [cityFilter, setCityFilter] = useState<string>(getInitialCitySlug);
  const [sortBy, setSortBy] = useState<"proximity" | "name">("proximity");
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const cityNameMap = useMemo(() => {
    const map = new Map(CITY_SEEDS.map((c) => [c.slug, c.name]));
    // Add display names from discovered landmarks (e.g. "kuwait" → "Kuwait")
    for (const lm of landmarks) {
      if (lm.citySlug && !map.has(lm.citySlug) && lm.location) {
        map.set(lm.citySlug, lm.location);
      }
    }
    return map;
  }, [landmarks]);

  // Build city slugs from both static seed data and fetched landmarks
  const uniqueCitySlugs = useMemo(() => {
    const slugs = new Set<string>();
    for (const lm of LANDMARKS) {
      if (lm.citySlug) slugs.add(lm.citySlug);
    }
    for (const lm of landmarks) {
      if (lm.citySlug) slugs.add(lm.citySlug);
    }
    return Array.from(slugs).sort();
  }, [landmarks]);

  const discoverLandmarks = useCallback(async (slug: string) => {
    const { location, locationName } = useSunTrackerStore.getState();
    if (!locationName || slug === "all") return;

    setIsDiscovering(true);
    try {
      const res = await fetch("/api/landmarks/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: location.lat, lng: location.lng, locationName }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.landmarks?.length > 0) {
        setLandmarks(data.landmarks);
      }
    } catch {
      // Discovery failed silently — user still sees empty state
    } finally {
      setIsDiscovering(false);
    }
  }, []);

  // Fetch landmark data from API
  useEffect(() => {
    async function fetchLandmarks() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (cityFilter !== "all") params.set("city", cityFilter);
        if (filter !== "all") params.set("category", filter);
        const url = `/api/landmarks${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch landmarks");
        const data = await response.json();
        const fetched = data.landmarks ?? [];

        if (fetched.length > 0) {
          setLandmarks(fetched);
        } else if (cityFilter !== "all") {
          // No landmarks found for this city — try discovering from OpenStreetMap
          setLandmarks([]);
          void discoverLandmarks(cityFilter);
        } else {
          setLandmarks(LANDMARKS);
        }
      } catch {
        setLandmarks(LANDMARKS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLandmarks();
  }, [cityFilter, filter, discoverLandmarks]);

  // Filter landmarks based on category and city
  const filteredLandmarks = landmarks.filter((landmark) => {
    const categoryMatch = filter === "all" || landmark.category === filter;
    const cityMatch = cityFilter === "all" || landmark.citySlug === cityFilter;
    return categoryMatch && cityMatch;
  });

  // Sort landmarks
  const sortedLandmarks = [...filteredLandmarks].sort((a, b) => {
    if (sortBy === "proximity") {
      const altA = a.currentAltitude ?? -90;
      const altB = b.currentAltitude ?? -90;
      return altB - altA; // Sort by altitude descending
    }
    return a.name.localeCompare(b.name);
  });

  const categories: FilterCategory[] = ["all", "historic", "religious", "monument", "modern", "natural", "technical", "custom"];

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 px-4 sm:px-6 pt-4 pb-4 border-b border-surface-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-headline text-3xl font-bold text-foreground">Celestial</span>
            <span className="font-headline text-3xl font-bold text-primary">Landmarks</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore ancient monuments and iconic landmarks aligned with the sun&apos;s path across the sky
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filter and Sort Controls */}
          <div className="space-y-4">
            {/* City filter */}
            <div className="flex items-center gap-3">
              <label htmlFor="city-filter" className="text-sm font-medium text-foreground whitespace-nowrap">
                City:
              </label>
              <select
                id="city-filter"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="rounded-xl px-3 py-2 text-sm bg-surface-container-low border-0 text-foreground max-w-xs"
              >
                <option value="all">All Cities</option>
                {uniqueCitySlugs.map((slug) => (
                  <option key={slug} value={slug}>
                    {cityNameMap.get(slug) ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
                {cityFilter !== "all" && !uniqueCitySlugs.includes(cityFilter) && (
                  <option key={cityFilter} value={cityFilter}>
                    {cityNameMap.get(cityFilter) ?? cityFilter.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                )}
              </select>
            </div>

            {/* Category filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-colors ${
                    filter === cat
                      ? "bg-surface-container-lowest text-primary"
                      : "bg-surface-container-low text-foreground hover:bg-surface-container"
                  }`}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                SORTING:{" "}
                <span className="text-primary">
                  {sortBy === "proximity" ? "SOLAR PROXIMITY" : "A-Z"}
                </span>
                {" "}&middot;{" "}
                <span className="text-muted-foreground">{sortedLandmarks.length} landmarks</span>
              </span>
              <button
                onClick={() => setSortBy(sortBy === "proximity" ? "name" : "proximity")}
                className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"
                aria-label="Toggle sort"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Landmarks Grid */}
          {isLoading || isDiscovering ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">
                {isDiscovering ? "Discovering landmarks from OpenStreetMap..." : "Loading landmarks..."}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedLandmarks.map((landmark) => (
                <LandmarkCard key={landmark.id} landmark={landmark} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && sortedLandmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground mb-2">No landmarks found</div>
              <button
                onClick={() => {
                  setFilter("all");
                  setCityFilter("all");
                }}
                className="text-sm text-primary hover:underline"
              >
                View all landmarks
              </button>
            </div>
          )}

          {/* Atmospheric Refraction Index Widget */}
          <RefractionIndex />
        </div>
      </div>
    </main>
  );
}
