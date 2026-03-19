"use client";

import { type FormEvent, useEffect, useId, useState } from "react";
import { LoaderCircle, LocateFixed, Search } from "lucide-react";
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
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const SEARCH_CACHE_PREFIX = "sun-tracker:nominatim:";
const SEARCH_DEBOUNCE_MS = 500;

function getGeolocationErrorMessage(code: number): string {
  if (code === 1) {
    return "Location access was denied. Search for a place or enter coordinates manually.";
  }

  if (code === 2) {
    return "Current location is unavailable. Search for a place or enter coordinates manually.";
  }

  if (code === 3) {
    return "Finding your location timed out. Search for a place or enter coordinates manually.";
  }

  return "Unable to retrieve your current location. Search for a place or enter coordinates manually.";
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

export function SearchBar() {
  const inputId = useId();
  const latitudeId = useId();
  const longitudeId = useId();
  const location = useSunTrackerStore((state) => state.location);
  const setLocation = useSunTrackerStore((state) => state.setLocation);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [coordinateError, setCoordinateError] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (!location) {
      return;
    }

    setLatitudeInput(location.lat.toFixed(4));
    setLongitudeInput(location.lng.toFixed(4));
  }, [location]);

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
          throw new Error(payload.error || "Location search is temporarily unavailable.");
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
          error instanceof Error ? error.message : "Location search is temporarily unavailable.",
        );
      })
      .finally(() => {
        setIsSearching(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const handleSuggestionSelect = (suggestion: GeocodingSuggestion): void => {
    setLocation(suggestion.lat, suggestion.lng, suggestion.displayName);
    setQuery(suggestion.displayName);
    setSuggestions([]);
    setSearchError("");
    setCoordinateError("");
    setLocationMessage(`Centered map on ${suggestion.displayName}.`);
  };

  const handleCoordinateSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const latitude = parseCoordinateInput(latitudeInput);
    const longitude = parseCoordinateInput(longitudeInput);

    if (latitude === null || longitude === null) {
      setCoordinateError("Enter valid numeric latitude and longitude values.");
      return;
    }

    if (!isLatitude(latitude) || !isLongitude(longitude)) {
      setCoordinateError("Latitude must be between -90 and 90, and longitude between -180 and 180.");
      return;
    }

    const coordinateLabel = formatCoordinatePair(latitude, longitude);

    setLocation(latitude, longitude, `Manual coordinates ${coordinateLabel}`);
    setCoordinateError("");
    setSearchError("");
    setSuggestions([]);
    setLocationMessage(`Centered map on ${coordinateLabel}.`);
  };

  const handleUseCurrentLocation = (): void => {
    if (!("geolocation" in navigator)) {
      setLocationMessage(
        "Current location is not supported in this browser. Search for a place or enter coordinates manually.",
      );
      return;
    }

    setIsLocating(true);
    setSearchError("");
    setCoordinateError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude, "Current location");
        setLocationMessage("Centered map on your current location.");
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

  const showSuggestions = suggestions.length > 0 || isSearching || Boolean(searchError);

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-amber-700">
          <Search className="h-4 w-4" />
          Find a location
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <label htmlFor={inputId} className="text-sm font-medium text-slate-900">
            Search city, landmark, or address
          </label>
          <div className="mt-2 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <input
                id={inputId}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLocationMessage("");
                }}
                placeholder="Search for a city, neighborhood, or address"
                autoComplete="off"
                aria-label="Search city, landmark, or address"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-11 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              aria-label="Use my location"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLocating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
              {isLocating ? "Finding location..." : "Use my location"}
            </button>
          </div>

          {showSuggestions ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              {isSearching ? (
                <p className="px-3 py-2 text-sm text-slate-500">Searching OpenStreetMap...</p>
              ) : null}

              {!isSearching && searchError ? (
                <p className="px-3 py-2 text-sm text-rose-600">{searchError}</p>
              ) : null}

              {!isSearching && !searchError && suggestions.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500">No matching places found.</p>
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Manual coordinates</p>
            <p className="text-sm text-slate-600">Jump directly to any latitude and longitude.</p>
          </div>

          <div className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Rate limit friendly
          </div>
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
            aria-label="Center map on coordinates"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-amber-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Center map on coordinates
          </button>
        </form>

        <div className="mt-4 min-h-12 rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Status</p>
          <p className="mt-1 text-sm text-slate-700" aria-live="polite">
            {coordinateError || locationMessage || "Search suggestions are debounced for 500ms and cached for this browser session."}
          </p>
        </div>
      </div>
    </section>
  );
}