"use client";

import { type FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { LoaderCircle, LocateFixed, MapPin, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createSearchCacheKey,
  isLatitude,
  isLongitude,
  normalizeSearchQuery,
  parseCoordinateInput,
  type GeocodingApiResponse,
  type GeocodingSuggestion,
} from "@/lib/geocoding";
import { formatCoordinatePair } from "@/components/map/location-utils";
import { LANDMARKS } from "@/lib/landmarks";
import { findNearestCitySlug } from "@/lib/cities-data";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { ComparisonLocation } from "@/types/comparison";
import type { Landmark } from "@/types/sun";

const SEARCH_CACHE_PREFIX = "sun-tracker:nominatim:";
const SEARCH_DEBOUNCE_MS = 500;

function getGeolocationErrorMessage(code: number): string {
  if (code === 1) {
    return "Location access was denied. Search for a place or enter coordinates.";
  }

  if (code === 2) {
    return "Your location is unavailable. Search for a place or enter coordinates.";
  }

  if (code === 3) {
    return "Finding your location timed out. Search for a place or enter coordinates.";
  }

  return "Unable to get your location. Search for a place or enter coordinates.";
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return debouncedValue;
}

interface SearchBarProps {
  onLocationSelect?: (location: ComparisonLocation) => void;
  onClose?: () => void;
}

function buildSelectionMessage(locationName: string, isPickerMode: boolean): string {
  return isPickerMode ? `Added ${locationName} to comparison.` : `Moved to ${locationName}.`;
}

export function SearchBar({ onLocationSelect, onClose }: SearchBarProps) {
  const inputId = useId();
  const latitudeId = useId();
  const longitudeId = useId();
  const location = useSunTrackerStore((state) => state.location);
  const setLocation = useSunTrackerStore((state) => state.setLocation);
  const setSelectedLandmark = useSunTrackerStore((state) => state.setSelectedLandmark);
  const isPickerMode = typeof onLocationSelect === "function";

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [coordinateError, setCoordinateError] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const [discoveredLandmarks, setDiscoveredLandmarks] = useState<Landmark[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryLabel, setDiscoveryLabel] = useState("");
  const discoveryRef = useRef<AbortController | null>(null);
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  const discoverLandmarks = useCallback(
    async (lat: number, lng: number, locationName: string) => {
      // Abort any in-flight discovery
      discoveryRef.current?.abort();
      const controller = new AbortController();
      discoveryRef.current = controller;

      setIsDiscovering(true);
      setDiscoveredLandmarks([]);
      setDiscoveryLabel(locationName);

      try {
        const response = await fetch("/api/landmarks/discover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng, locationName }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          setLocationMessage(payload.error ?? "Could not discover landmarks.");
          return;
        }

        const payload = (await response.json()) as {
          landmarks: Array<Record<string, unknown>>;
          source: string;
        };

        const mapped: Landmark[] = payload.landmarks
          .map((row) => ({
            id: typeof row.landmark_id === "string" ? row.landmark_id : String(row.id ?? ""),
            name: typeof row.name === "string" ? row.name : "",
            lat: typeof row.lat === "number" ? row.lat : 0,
            lng: typeof row.lng === "number" ? row.lng : 0,
            orientationAzimuth:
              typeof row.orientation_azimuth === "number" ? row.orientation_azimuth : 0,
            location: typeof row.location === "string" ? row.location : undefined,
            citySlug: typeof row.city_slug === "string" ? row.city_slug : undefined,
            category: typeof row.category === "string" ? (row.category as Landmark["category"]) : undefined,
            imageGradient: typeof row.image_gradient === "string" ? row.image_gradient : undefined,
          }))
          .filter((lm) => lm.name.length > 0);

        setDiscoveredLandmarks(mapped);

        if (mapped.length > 0 && payload.source === "overpass") {
          setLocationMessage(`Found ${mapped.length} landmarks near ${locationName}.`);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLocationMessage("Failed to discover landmarks for this location.");
      } finally {
        setIsDiscovering(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isPickerMode || !location) {
      return;
    }

    setLatitudeInput(location.lat.toFixed(4));
    setLongitudeInput(location.lng.toFixed(4));
  }, [isPickerMode, location]);

  useEffect(() => {
    const normalizedQuery = normalizeSearchQuery(debouncedQuery);

    if (normalizedQuery.length < 2) {
      setSuggestions([]);
      setSearchError("");
      setIsSearching(false);
      return;
    }

    const cacheKey = `${SEARCH_CACHE_PREFIX}${createSearchCacheKey(normalizedQuery)}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as GeocodingSuggestion[];
        setSuggestions(parsed);
        setSearchError("");
        setIsSearching(false);
        return;
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    const controller = new AbortController();

    setIsSearching(true);
    setSearchError("");

    void fetch(`/api/geocode?q=${encodeURIComponent(normalizedQuery)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as GeocodingApiResponse;

        if (!response.ok) {
          throw new Error(payload.error || "Search is temporarily unavailable.");
        }

        sessionStorage.setItem(cacheKey, JSON.stringify(payload.suggestions));
        setSuggestions(payload.suggestions);
        setSearchError("");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSuggestions([]);
        setSearchError(
          error instanceof Error ? error.message : "Search is temporarily unavailable.",
        );
      })
      .finally(() => {
        setIsSearching(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const nearestCitySlug = location
    ? findNearestCitySlug(location.lat, location.lng)
    : null;

  const seededLandmarks = nearestCitySlug
    ? LANDMARKS.filter((lm) => lm.citySlug === nearestCitySlug)
    : [];

  // Merge seeded + discovered landmarks (discovered takes priority for new locations)
  const availableLandmarks = seededLandmarks.length > 0 ? seededLandmarks : discoveredLandmarks;

  const matchedLandmarks = normalizeSearchQuery(query).length >= 2
    ? availableLandmarks.filter((lm) =>
        lm.name.toLowerCase().includes(normalizeSearchQuery(query))
      ).slice(0, 5)
    : availableLandmarks.slice(0, 8);

  const applyLocationSelection = (
    nextLocation: ComparisonLocation,
    landmark: Landmark | null = null,
  ): void => {
    if (isPickerMode) {
      onLocationSelect?.(nextLocation);
      setQuery("");
    } else {
      setLocation(nextLocation.lat, nextLocation.lng, nextLocation.name);
      setQuery(nextLocation.name);
      setSelectedLandmark(landmark);
    }

    setSuggestions([]);
    setSearchError("");
    setCoordinateError("");
    setLocationMessage(buildSelectionMessage(nextLocation.name, isPickerMode));
    onClose?.();

    // Auto-discover landmarks if none exist for this location
    if (!landmark) {
      const slug = findNearestCitySlug(nextLocation.lat, nextLocation.lng);
      const hasSeeded = slug
        ? LANDMARKS.some((lm) => lm.citySlug === slug)
        : false;

      if (!hasSeeded) {
        void discoverLandmarks(nextLocation.lat, nextLocation.lng, nextLocation.name);
      }
    }
  };

  const handleLandmarkSelect = (landmark: Landmark): void => {
    applyLocationSelection(
      {
        lat: landmark.lat,
        lng: landmark.lng,
        name: landmark.name,
      },
      landmark,
    );
  };

  const handleSuggestionSelect = (suggestion: GeocodingSuggestion): void => {
    applyLocationSelection({
      lat: suggestion.lat,
      lng: suggestion.lng,
      name: suggestion.name,
    });
  };

  const handleCoordinateSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const latitude = parseCoordinateInput(latitudeInput);
    const longitude = parseCoordinateInput(longitudeInput);

    if (latitude === null || longitude === null) {
      setCoordinateError("Enter valid latitude and longitude values.");
      return;
    }

    if (!isLatitude(latitude) || !isLongitude(longitude)) {
      setCoordinateError("Latitude must be −90 to 90, longitude −180 to 180.");
      return;
    }

    const coordinateLabel = formatCoordinatePair(latitude, longitude);

    applyLocationSelection({
      lat: latitude,
      lng: longitude,
      name: `Manual coordinates ${coordinateLabel}`,
    });
  };

  const handleUseCurrentLocation = (): void => {
    if (!("geolocation" in navigator)) {
      setLocationMessage(
        "Your browser doesn't support location. Search for a place or enter coordinates.",
      );
      return;
    }

    setIsLocating(true);
    setSearchError("");
    setCoordinateError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyLocationSelection({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: "Your location",
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationMessage(getGeolocationErrorMessage(error.code));
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const normalizedQuery = normalizeSearchQuery(query);
  const hasLandmarkMatches = matchedLandmarks.length > 0;
  const showSuggestions =
    hasLandmarkMatches || isDiscovering || suggestions.length > 0 || isSearching || Boolean(searchError);
  const statusMessage = coordinateError || locationMessage;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Search className="h-4 w-4" />
          Search
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <label htmlFor={inputId} className="text-sm font-medium text-slate-900">
            Search for a place
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Enter a city, landmark, or address to view sun data for that location.
          </p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <input
                id={inputId}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLocationMessage("");
                }}
                placeholder="City, neighborhood, or address"
                autoComplete="off"
                aria-label="Search for a place"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              aria-label="Use my location"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLocating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
              {isLocating ? "Finding..." : "Use my location"}
            </button>
          </div>

          {showSuggestions ? (
            <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              {/* Discovery loading */}
              {isDiscovering && (
                <div className="flex items-center gap-2 px-3 py-2">
                  <LoaderCircle className="h-4 w-4 animate-spin text-amber-500" />
                  <p className="text-sm text-slate-500">
                    Discovering landmarks near {discoveryLabel}...
                  </p>
                </div>
              )}

              {/* Landmark matches */}
              {hasLandmarkMatches && (
                <>
                  <p className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">
                    {discoveredLandmarks.length > 0 && seededLandmarks.length === 0 && (
                      <Sparkles className="h-3 w-3" />
                    )}
                    {nearestCitySlug
                      ? `Landmarks near ${matchedLandmarks[0]?.location ?? nearestCitySlug}`
                      : discoveryLabel
                        ? `Landmarks near ${discoveryLabel}`
                        : "Landmarks"}
                  </p>
                  <ul className="space-y-1">
                    {matchedLandmarks.map((lm) => (
                      <li key={lm.id}>
                        <button
                          type="button"
                          onClick={() => handleLandmarkSelect(lm)}
                          aria-label={`Select ${lm.name}`}
                          className="flex w-full items-start gap-3 rounded-xl bg-sky-50 px-3 py-2 text-left transition hover:bg-sky-100 focus:bg-sky-100 focus:outline-none"
                        >
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-600" />
                          <div>
                            <span className="text-sm font-semibold text-slate-900">{lm.name}</span>
                            <span className="block text-xs text-slate-500">
                              Axis {Math.round(lm.orientationAzimuth)}° · {lm.lat.toFixed(2)}°, {lm.lng.toFixed(2)}°
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {(suggestions.length > 0 || isSearching) && (
                    <div className="my-2 border-t border-slate-100" />
                  )}
                </>
              )}

              {/* Geocoding results */}
              {isSearching ? (
                <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>
              ) : null}

              {!isSearching && searchError ? (
                <p className="px-3 py-2 text-sm text-rose-600">{searchError}</p>
              ) : null}

              {!isSearching && !searchError && suggestions.length === 0 && !hasLandmarkMatches ? (
                <p className="px-3 py-2 text-sm text-slate-500">No places found.</p>
              ) : null}

              {suggestions.length > 0 ? (
                <ul className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.placeId}>
                      <button
                        type="button"
                        onClick={() => {
                          handleSuggestionSelect(suggestion);
                        }}
                        aria-label={`Select ${suggestion.displayName}`}
                        className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-amber-50 focus:bg-amber-50 focus:outline-none"
                      >
                        <span className="text-sm font-medium text-slate-900">{suggestion.name}</span>
                        <span className="text-sm text-slate-500">{suggestion.displayName}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,251,235,0.95),rgba(248,250,252,0.95))] p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Jump to coordinates</p>
          <p className="text-sm text-slate-600">Go directly to any latitude and longitude.</p>
        </div>

        <form className="mt-4 space-y-3" onSubmit={handleCoordinateSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={latitudeId} className="text-sm font-medium text-slate-900">
                Latitude
              </label>
              <input
                id={latitudeId}
                inputMode="decimal"
                value={latitudeInput}
                onChange={(event) => {
                  setLatitudeInput(event.target.value);
                  setCoordinateError("");
                  setLocationMessage("");
                }}
                placeholder="40.7128"
                aria-label="Latitude"
                className={cn(
                  "mt-2 h-11 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-amber-100",
                  coordinateError ? "border-rose-300 focus:border-rose-300" : "border-slate-200 focus:border-amber-400",
                )}
              />
            </div>

            <div>
              <label htmlFor={longitudeId} className="text-sm font-medium text-slate-900">
                Longitude
              </label>
              <input
                id={longitudeId}
                inputMode="decimal"
                value={longitudeInput}
                onChange={(event) => {
                  setLongitudeInput(event.target.value);
                  setCoordinateError("");
                  setLocationMessage("");
                }}
                placeholder="-74.0060"
                aria-label="Longitude"
                className={cn(
                  "mt-2 h-11 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-amber-100",
                  coordinateError ? "border-rose-300 focus:border-rose-300" : "border-slate-200 focus:border-amber-400",
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            aria-label="Go to location"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-amber-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Go to location
          </button>
        </form>

        <div className="mt-4 min-h-10 rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
          {statusMessage ? (
            <p className="text-sm text-slate-700" aria-live="polite">
              {statusMessage}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
