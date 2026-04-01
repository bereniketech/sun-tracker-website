"use client";

import type { Landmark } from "@/types/sun";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

interface LandmarkCardProps {
  landmark: Landmark & {
    currentAzimuth?: number;
    currentAltitude?: number;
  };
  locationLabel?: string;
}

export function LandmarkCard({ landmark, locationLabel }: LandmarkCardProps) {
  const { selectedLandmark, setSelectedLandmark } = useSunTrackerStore();
  const isSelected = selectedLandmark?.id === landmark.id;
  const isVisible =
    landmark.currentAltitude !== undefined && landmark.currentAltitude > 0;

  return (
    <div
      onClick={() => setSelectedLandmark(landmark)}
      className={`cursor-pointer rounded-2xl overflow-hidden bg-surface-container-lowest shadow-[0_4px_24px_rgba(11,28,48,0.06)] hover:shadow-[0_8px_32px_rgba(11,28,48,0.12)] transition-shadow duration-300 p-5 ${
        isSelected ? "ring-2 ring-orange-500" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="block truncate bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text font-headline text-lg font-bold text-transparent">
            {landmark.name}
          </h3>
          {locationLabel && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {locationLabel}
            </p>
          )}
        </div>
        {landmark.category && (
          <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {landmark.category}
          </span>
        )}
      </div>

      {/* Data row */}
      <div className="grid grid-cols-3 gap-4 text-center border-t border-surface-variant/20 pt-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Azimuth
          </div>
          <div className="font-headline text-sm font-semibold text-foreground">
            {landmark.currentAzimuth?.toFixed(1)}&deg;
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Elevation
          </div>
          <div className="font-headline text-sm font-semibold text-foreground">
            {landmark.currentAltitude?.toFixed(1)}&deg;
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Status
          </div>
          <div
            className={`text-xs font-semibold uppercase tracking-wider ${
              isVisible ? "text-orange-500" : "text-muted-foreground"
            }`}
          >
            {isVisible ? "Visible" : "Below"}
          </div>
        </div>
      </div>
    </div>
  );
}
