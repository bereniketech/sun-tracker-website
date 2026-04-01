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
      <div className="mb-4 -mx-5 -mt-5 w-auto bg-gradient-to-r from-amber-300/85 via-orange-200/65 to-orange-100/45 px-5 pb-1.5 pt-3 sm:pt-3.5">
        <div className="flex min-h-[2.6rem] w-full items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="block truncate font-headline text-lg font-bold text-amber-700">
              {landmark.name}
            </h3>
            {locationLabel && (
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {locationLabel}
              </p>
            )}
          </div>
          {landmark.category && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              {landmark.category}
            </span>
          )}
        </div>
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
