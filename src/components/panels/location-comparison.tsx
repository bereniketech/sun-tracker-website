"use client";

import { useMemo, useState } from "react";
import { Share2, X } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { computeSunData } from "@/lib/sun";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { ComparisonLocation, ComparisonSnapshot } from "@/types/comparison";

const MAX_COMPARISON_LOCATIONS = 3;

export interface LocationComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

export function buildComparisonSnapshot(
  location: ComparisonLocation,
  dateTime: Date,
): ComparisonSnapshot {
  const sunData = computeSunData(location.lat, location.lng, dateTime);

  return {
    location,
    sunrise: sunData.sunrise,
    sunset: sunData.sunset,
    goldenHourStart: sunData.goldenHour.start,
    goldenHourEnd: sunData.goldenHourEvening.end,
    dayLengthSeconds: sunData.dayLength,
    currentElevation: sunData.sunElevation,
  };
}

function formatTime(value: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatDayLength(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function formatElevation(value: number): string {
  return `${Math.round(value)}°`;
}

function serializeComparisonLocations(locations: ComparisonLocation[]): string {
  return locations
    .map((location) => {
      const encodedName = encodeURIComponent(location.name);
      return `${location.lat.toFixed(6)},${location.lng.toFixed(6)},${encodedName}`;
    })
    .join("|");
}

function buildComparisonShareUrl(locations: ComparisonLocation[]): string {
  const url = new URL(window.location.href);

  if (locations.length === 0) {
    url.searchParams.delete("compare");
    return url.toString();
  }

  url.searchParams.set("compare", serializeComparisonLocations(locations));
  return url.toString();
}

async function shareComparisonUrl(url: string): Promise<"shared" | "copied"> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: "Sun Tracker comparison",
        text: "Compare sun snapshots across locations.",
        url,
      });
      return "shared";
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  await navigator.clipboard.writeText(url);
  return "copied";
}

interface ComparisonCardProps {
  snapshot: ComparisonSnapshot;
  onRemove: () => void;
}

function ComparisonCard({ snapshot, onRemove }: ComparisonCardProps) {
  return (
    <article
      aria-label={`Comparison snapshot for ${snapshot.location.name}`}
      className="min-w-[16rem] rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{snapshot.location.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {snapshot.location.lat.toFixed(3)}°, {snapshot.location.lng.toFixed(3)}°
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          aria-label={`Remove ${snapshot.location.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <dl className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <dt className="text-sm text-slate-600">Sunrise</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatTime(snapshot.sunrise)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <dt className="text-sm text-slate-600">Sunset</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatTime(snapshot.sunset)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <dt className="text-sm text-slate-600">Golden hour start</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatTime(snapshot.goldenHourStart)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <dt className="text-sm text-slate-600">Golden hour end</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatTime(snapshot.goldenHourEnd)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <dt className="text-sm text-slate-600">Day length</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatDayLength(snapshot.dayLengthSeconds)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <dt className="text-sm text-slate-600">Elevation</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatElevation(snapshot.currentElevation)}</dd>
        </div>
      </dl>
    </article>
  );
}

export function LocationComparison({ isOpen, onClose }: LocationComparisonProps) {
  const comparisonLocations = useSunTrackerStore((state) => state.comparisonLocations);
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const addComparisonLocation = useSunTrackerStore((state) => state.addComparisonLocation);
  const removeComparisonLocation = useSunTrackerStore((state) => state.removeComparisonLocation);
  const [shareMessage, setShareMessage] = useState<string>("");

  const snapshots = useMemo(
    () => comparisonLocations.map((location) => buildComparisonSnapshot(location, dateTime)),
    [comparisonLocations, dateTime],
  );

  if (!isOpen) {
    return null;
  }

  const handleShare = async (): Promise<void> => {
    try {
      const result = await shareComparisonUrl(buildComparisonShareUrl(comparisonLocations));
      setShareMessage(result === "shared" ? "Opened your share sheet." : "Copied comparison link.");
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setShareMessage("Unable to share right now.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-comparison-title"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl md:max-w-6xl md:rounded-3xl md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Sun snapshots</p>
            <h2 id="location-comparison-title" className="mt-1 text-xl font-semibold text-slate-950">
              Compare Locations
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add up to {MAX_COMPARISON_LOCATIONS} locations to compare the current date side by side.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={comparisonLocations.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-700">
              {comparisonLocations.length}/{MAX_COMPARISON_LOCATIONS} locations selected
            </p>
            <p className="text-sm text-slate-500">The store enforces the 3-location cap.</p>
          </div>
          <SearchBar onLocationSelect={addComparisonLocation} />
        </div>

        {comparisonLocations.length < 2 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Add at least 2 locations to compare sunrise, golden hour, and elevation side by side.
          </div>
        ) : null}

        {shareMessage ? (
          <p className="mt-4 text-sm text-slate-600" aria-live="polite">
            {shareMessage}
          </p>
        ) : null}

        <div className="mt-4 overflow-x-auto pb-1">
          <div className="flex gap-3">
            {snapshots.map((snapshot, index) => (
              <ComparisonCard
                key={`${snapshot.location.lat}-${snapshot.location.lng}-${snapshot.location.name}`}
                snapshot={snapshot}
                onRemove={() => removeComparisonLocation(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}