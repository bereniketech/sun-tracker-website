"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { AnimateButton } from "@/components/controls/animate-button";
import { DatePicker } from "@/components/controls/date-picker";
import { NowButton } from "@/components/controls/now-button";
import { TimeSlider } from "@/components/controls/time-slider";
import { InteractiveMap } from "@/components/map/interactive-map";
import { InfoPanel } from "@/components/panels/info-panel";
import { SharePanel } from "@/components/panels/share-panel";
import { SearchBar } from "@/components/search-bar";
import {
  DEFAULT_MAP_LOCATION,
  formatCoordinatePair,
} from "@/components/map/location-utils";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { useUrlState } from "@/hooks/use-url-state";

const FavoritesPanel = dynamic(
  () => import("@/components/panels/favorites-panel").then((module) => module.FavoritesPanel),
  {
    loading: () => (
      <section
        className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600"
        role="status"
        aria-live="polite"
      >
        Loading favorites...
      </section>
    ),
  },
);

/** Inner component so useSearchParams is inside a Suspense boundary. */
function UrlStateSyncer() {
  useUrlState();
  return null;
}

function formatTime(value: Date | null): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function HomePageClient() {
  const location = useSunTrackerStore((state) => state.location);
  const locationName = useSunTrackerStore((state) => state.locationName);
  const sunData = useSunTrackerStore((state) => state.sunData);

  useEffect(() => {
    const state = useSunTrackerStore.getState();

    if (!state.location) {
      state.setLocation(
        DEFAULT_MAP_LOCATION.lat,
        DEFAULT_MAP_LOCATION.lng,
        DEFAULT_MAP_LOCATION.name,
      );
    }
  }, []);

  const coordinateLabel = location
    ? formatCoordinatePair(location.lat, location.lng)
    : formatCoordinatePair(DEFAULT_MAP_LOCATION.lat, DEFAULT_MAP_LOCATION.lng);

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={null}>
        <UrlStateSyncer />
      </Suspense>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Location</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {locationName || DEFAULT_MAP_LOCATION.name}
          </p>
          <p className="text-xs text-slate-500">{coordinateLabel}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Sunrise</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatTime(sunData?.sunrise ?? null)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Sunset</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatTime(sunData?.sunset ?? null)}
          </p>
        </div>
      </div>

      <SearchBar />

      {/* Map + controls: stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Map — takes available width on desktop */}
        <div className="min-w-0 lg:flex-1">
          <InteractiveMap />
        </div>

        {/* Controls sidebar */}
        <div className="flex flex-col gap-4 lg:w-80 lg:flex-shrink-0">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-4">
              <TimeSlider />
              <div className="grid grid-cols-2 gap-3">
                <DatePicker />
                <div className="flex items-end gap-2">
                  <AnimateButton />
                  <NowButton />
                </div>
              </div>
            </div>
          </div>

          <InfoPanel />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Active location {locationName || DEFAULT_MAP_LOCATION.name}. Sunrise {formatTime(sunData?.sunrise ?? null)}.
        Sunset {formatTime(sunData?.sunset ?? null)}.
      </p>

      <SharePanel />
      <FavoritesPanel />
    </div>
  );
}
