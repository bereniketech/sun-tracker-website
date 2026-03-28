"use client";

import type { Landmark } from "@/types/sun";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

interface LandmarkCardProps {
  landmark: Landmark & {
    location?: string;
    imageGradient?: string;
    currentAzimuth?: number;
    currentAltitude?: number;
  };
}

export function LandmarkCard({ landmark }: LandmarkCardProps) {
  const { selectedLandmark, setSelectedLandmark } = useSunTrackerStore();
  const isSelected = selectedLandmark?.id === landmark.id;

  const imageGradient = landmark.imageGradient || "from-slate-700 to-slate-900";

  return (
    <div
      onClick={() => setSelectedLandmark(landmark)}
      className="cursor-pointer rounded-2xl overflow-hidden bg-surface-container-lowest shadow-[0_4px_24px_rgba(11,28,48,0.06)] hover:shadow-[0_8px_32px_rgba(11,28,48,0.12)] transition-shadow duration-300"
    >
      {/* Image area with gradient overlay */}
      <div className={`h-40 bg-gradient-to-br ${imageGradient} relative`}>
        {/* Darkening gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Location badge - top left */}
        {landmark.location && (
          <div className="absolute top-3 left-3 text-xs uppercase tracking-wider text-white/80 font-medium">
            {landmark.location}
          </div>
        )}

        {/* Landmark name - bottom left */}
        <div className="absolute bottom-3 left-3 font-headline text-xl text-white font-bold">
          {landmark.name}
        </div>

        {/* LIVE TRACKING badge - bottom right when selected */}
        {isSelected && (
          <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            LIVE TRACKING
          </div>
        )}
      </div>

      {/* Data row below image */}
      <div className="px-4 py-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Azimuth
          </div>
          <div className="font-headline text-sm font-semibold text-foreground">
            {landmark.currentAzimuth?.toFixed(1)}°
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Elevation
          </div>
          <div className="font-headline text-sm font-semibold text-foreground">
            {landmark.currentAltitude?.toFixed(1)}°
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Status
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            {landmark.currentAltitude !== undefined && landmark.currentAltitude > 0
              ? "Visible"
              : "Below"}
          </div>
        </div>
      </div>

      {/* Photo Window info */}
      <div className="px-4 pb-4 text-xs text-muted-foreground text-center">
        {landmark.location && <span>Photo Window: Varies by season</span>}
      </div>
    </div>
  );
}
