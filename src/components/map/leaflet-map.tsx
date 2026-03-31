"use client";

import { useEffect, useRef, useState } from "react";
import { divIcon, type LeafletEvent, type Marker as LeafletMarker } from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Copy, Check, Expand, Shrink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MAP_LOCATION,
  formatCoordinatePair,
  formatPinnedLocationName,
} from "@/components/map/location-utils";
import { LayerControl, MapOverlays } from "@/components/map/map-overlays";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { Coordinates } from "@/types/sun";

const pinIcon = divIcon({
  className: "",
  html: '<span class="sun-tracker-pin" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface LocationEventHandlersProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

interface MapViewportControllerProps {
  center: Coordinates;
}

function MapViewportController({ center }: MapViewportControllerProps): null {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), {
      animate: true,
    });
  }, [center, map]);

  return null;
}

function LocationEventHandlers({ onLocationSelect }: LocationEventHandlersProps): null {
  useMapEvents({
    click: (event) => {
      onLocationSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapKeyboardShortcuts(): null {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        map.zoomIn();
      }

      if (event.key === "-") {
        event.preventDefault();
        map.zoomOut();
      }
    };

    container.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [map]);

  return null;
}

function extractMarkerCoordinates(event: LeafletEvent): Coordinates {
  const marker = event.target as LeafletMarker;
  const latLng = marker.getLatLng();

  return {
    lat: latLng.lat,
    lng: latLng.lng,
  };
}

export function LeafletMap() {
  const location = useSunTrackerStore((state) => state.location);
  const locationName = useSunTrackerStore((state) => state.locationName);
  const setLocation = useSunTrackerStore((state) => state.setLocation);
  const mapShellRef = useRef<HTMLDivElement | null>(null);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [coordsCopied, setCoordsCopied] = useState(false);

  const center = location ?? DEFAULT_MAP_LOCATION;
  const isFullscreen = isNativeFullscreen || isFallbackFullscreen;

  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsNativeFullscreen(document.fullscreenElement === mapShellRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.mapFullscreen = isFullscreen ? "true" : "false";

    return () => {
      delete document.body.dataset.mapFullscreen;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFallbackFullscreen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsFallbackFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isFallbackFullscreen]);

  const handleLocationSelect = (lat: number, lng: number): void => {
    setLocation(lat, lng, formatPinnedLocationName(lat, lng));
  };

  const toggleFullscreen = async (): Promise<void> => {
    const shell = mapShellRef.current;

    if (!shell) {
      return;
    }

    if (document.fullscreenEnabled && typeof shell.requestFullscreen === "function") {
      if (document.fullscreenElement === shell) {
        await document.exitFullscreen();
        return;
      }

      await shell.requestFullscreen();
      return;
    }

    setIsFallbackFullscreen((current) => !current);
  };

  return (
    <section className="space-y-3" aria-label="Map explorer">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {locationName || DEFAULT_MAP_LOCATION.name}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-slate-600">
              {formatCoordinatePair(center.lat, center.lng)}
            </p>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(formatCoordinatePair(center.lat, center.lng)).then(() => {
                  setCoordsCopied(true);
                  setTimeout(() => setCoordsCopied(false), 2000);
                });
              }}
              aria-label="Copy coordinates to clipboard"
              className="rounded p-0.5 text-slate-400 transition hover:text-slate-700"
            >
              {coordsCopied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

      </div>

      <div
        ref={mapShellRef}
        className={cn(
          "sun-tracker-map relative isolate h-[32rem] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:h-[38rem]",
          isFullscreen && "ring-0",
        )}
        data-expanded={isFullscreen ? "true" : "false"}
        aria-label="Interactive map area"
      >
        <button
          type="button"
          onClick={() => {
            void toggleFullscreen();
          }}
          className="absolute right-4 top-4 z-[1000] inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg backdrop-blur transition hover:bg-white"
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen map" : "Enter fullscreen map"}
        >
          {isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        </button>

        <LayerControl />

        <MapContainer
          center={[center.lat, center.lng]}
          zoom={12}
          scrollWheelZoom
          touchZoom
          keyboard
          zoomControl={false}
          className="h-full w-full"
          aria-label="Map with location pin and sun overlays"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapOverlays />

          <ZoomControl position="bottomright" />
          <MapViewportController center={center} />
          <MapKeyboardShortcuts />
          <LocationEventHandlers onLocationSelect={handleLocationSelect} />
          <Marker
            position={[center.lat, center.lng]}
            draggable
            autoPan
            icon={pinIcon}
            eventHandlers={{
              drag: (event) => {
                const next = extractMarkerCoordinates(event);
                handleLocationSelect(next.lat, next.lng);
              },
              dragend: (event) => {
                const next = extractMarkerCoordinates(event);
                handleLocationSelect(next.lat, next.lng);
              },
            }}
          />
        </MapContainer>
      </div>
    </section>
  );
}