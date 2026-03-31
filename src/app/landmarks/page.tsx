"use client";

import { useState, useEffect } from "react";
import { LANDMARKS } from "@/lib/landmarks";
import { LandmarkCard } from "@/components/landmarks/landmark-card";
import { RefractionIndex } from "@/components/landmarks/refraction-index";
import type { Landmark } from "@/types/sun";

type FilterCategory = "historic" | "technical" | "custom" | "all";

interface LandmarkWithData extends Landmark {
  location?: string;
  imageGradient?: string;
  currentAzimuth?: number;
  currentAltitude?: number;
}

export default function LandmarksPage() {
  const [landmarks, setLandmarks] = useState<LandmarkWithData[]>(LANDMARKS);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [sortBy, setSortBy] = useState<"proximity" | "name">("proximity");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch landmark data from API
  useEffect(() => {
    async function fetchLandmarks() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/landmarks");
        if (!response.ok) throw new Error("Failed to fetch landmarks");
        const data = await response.json();
        setLandmarks(data.landmarks || LANDMARKS);
      } catch (error) {
        console.error("Error fetching landmarks:", error);
        setLandmarks(LANDMARKS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLandmarks();
  }, []);

  // Filter landmarks based on category
  const filteredLandmarks = landmarks.filter((landmark) => {
    if (filter === "all") return true;
    return landmark.category === filter;
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
            Explore ancient monuments aligned with the sun&apos;s path across the sky
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filter and Sort Controls */}
          <div className="space-y-4">
            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(["all", "historic", "technical", "custom"] as FilterCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-colors ${
                    filter === cat
                      ? "bg-surface-container-lowest text-primary"
                      : "bg-surface-container-low text-foreground hover:bg-surface-container"
                  }`}
                >
                  {cat === "all" ? "All Landmarks" : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading landmarks...</div>
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
                onClick={() => setFilter("all")}
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