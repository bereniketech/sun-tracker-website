"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { OverlayType } from "@/types/sun";
import type { ComparisonLocation } from "@/types/comparison";

const ALL_OVERLAY_KEYS: OverlayType[] = [
  "sun-position",
  "sunrise-line",
  "sunset-line",
  "shadow",
  "golden-hour-arc",
  "blue-hour-arc",
  "sun-path",
  "landmark-alignment",
];

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildParams(
  lat: number,
  lng: number,
  name: string,
  dateTime: Date,
  activeOverlays: Set<OverlayType>,
  comparisonLocations: ComparisonLocation[],
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("lat", lat.toFixed(6));
  params.set("lng", lng.toFixed(6));
  if (name) params.set("name", name);
  params.set("dt", dateTime.toISOString());

  const hidden = ALL_OVERLAY_KEYS.filter((o) => !activeOverlays.has(o));
  if (hidden.length > 0) {
    params.set("hidden", hidden.join(","));
  }

  if (comparisonLocations.length > 0) {
    const compare = comparisonLocations
      .map((location) => {
        const encodedName = encodeURIComponent(location.name);
        return `${location.lat.toFixed(6)},${location.lng.toFixed(6)},${encodedName}`;
      })
      .join("|");
    params.set("compare", compare);
  }

  return params;
}

/**
 * Syncs the Zustand store (location, dateTime, overlays) with URL search params.
 * On mount, restores state from params if present.
 * On state changes, replaces the current URL with up-to-date params.
 */
export function useUrlState(): void {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const restoredRef = useRef(false);

  // Restore state from URL on first mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    if (!latStr || !lngStr) return;

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const name = searchParams.get("name") ?? "";
    const dtStr = searchParams.get("dt");
    const dateTime = dtStr ? new Date(dtStr) : null;

    const store = useSunTrackerStore.getState();
    store.setLocation(lat, lng, name);

    if (dateTime && Number.isFinite(dateTime.getTime())) {
      store.setDateTime(dateTime);
    }

    const hiddenStr = searchParams.get("hidden");
    if (hiddenStr) {
      const toHide = hiddenStr.split(",") as OverlayType[];
      for (const overlay of toHide) {
        if (store.activeOverlays.has(overlay)) {
          store.toggleOverlay(overlay);
        }
      }
    }

    store.clearComparisonLocations();

    const compareStr = searchParams.get("compare");
    if (compareStr) {
      const entries = compareStr.split("|");
      for (const entry of entries) {
        const [rawLat, rawLng, ...nameParts] = entry.split(",");
        const parsedLat = parseFloat(rawLat ?? "");
        const parsedLng = parseFloat(rawLng ?? "");
        const encodedName = nameParts.join(",");

        if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
          continue;
        }

        store.addComparisonLocation({
          lat: parsedLat,
          lng: parsedLng,
          name: safeDecodeURIComponent(encodedName),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push state changes to URL
  useEffect(() => {
    const unsubscribe = useSunTrackerStore.subscribe((state) => {
      if (!state.location) return;

      const params = buildParams(
        state.location.lat,
        state.location.lng,
        state.locationName,
        state.dateTime,
        state.activeOverlays,
        state.comparisonLocations,
      );

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });

    return unsubscribe;
  }, [router, pathname]);
}
