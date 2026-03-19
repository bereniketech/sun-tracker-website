"use client";

import { useEffect } from "react";
import { InteractiveMap } from "@/components/map/interactive-map";
import { SearchBar } from "@/components/search-bar";
import {
  DEFAULT_MAP_LOCATION,
  formatCoordinatePair,
} from "@/components/map/location-utils";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

function formatTime(value: Date | null): string {
  if (!value) {
    return "Waiting for a map selection";
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
    <div className="flex h-full min-h-[50vh] flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-amber-700">
            Interactive Sun Map
          </p>
          <div className="space-y-2">
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Search, geolocate, or enter coordinates and the map updates sun data instantly.
            </h1>
            <p className="max-w-3xl text-base text-slate-600">
              Task 4 adds debounced Nominatim search, session caching, manual coordinates, and
              browser geolocation on top of the interactive OpenStreetMap explorer.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[28rem]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Active Location
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {locationName || DEFAULT_MAP_LOCATION.name}
            </p>
            <p className="text-sm text-slate-600">{coordinateLabel}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Sunrise
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {formatTime(sunData?.sunrise ?? null)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Sunset
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {formatTime(sunData?.sunset ?? null)}
            </p>
          </div>
        </div>
      </div>

      <SearchBar />

      <InteractiveMap />
    </div>
  );
}