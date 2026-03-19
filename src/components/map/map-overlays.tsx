"use client";

import { useMemo } from "react";
import SunCalc from "suncalc";
import { CircleMarker, Polygon, Polyline, Tooltip } from "react-leaflet";
import {
  createArcBand,
  createArcPoints,
  createRay,
  normalizeAzimuth,
} from "@/components/map/overlay-geometry";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { Coordinates, OverlayType } from "@/types/sun";

const DIRECTION_LINE_DISTANCE_METERS = 5_500;
const SUN_MARKER_DISTANCE_METERS = 2_800;
const SHADOW_DISTANCE_MIN_METERS = 600;
const SHADOW_DISTANCE_MAX_METERS = 8_000;
const HOUR_ARC_INNER_RADIUS_METERS = 2_000;
const HOUR_ARC_OUTER_RADIUS_METERS = 3_200;
const SUN_PATH_RADIUS_METERS = 6_000;

const OVERLAY_OPTIONS: Array<{ id: OverlayType; label: string }> = [
  { id: "sun-position", label: "Current sun direction" },
  { id: "sunrise-line", label: "Sunrise line" },
  { id: "sunset-line", label: "Sunset line" },
  { id: "shadow", label: "Shadow direction" },
  { id: "golden-hour-arc", label: "Golden hour arcs" },
  { id: "blue-hour-arc", label: "Blue hour arcs" },
  { id: "sun-path", label: "Sun path arc" },
];

function toLatLngPairs(points: Coordinates[]): Array<[number, number]> {
  return points.map((point) => [point.lat, point.lng]);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toNorthDegrees(azimuthRadians: number): number {
  return normalizeAzimuth((azimuthRadians * 180) / Math.PI + 180);
}

function azimuthAt(lat: number, lng: number, date: Date): number {
  const position = SunCalc.getPosition(date, lat, lng);
  return toNorthDegrees(position.azimuth);
}

function HourArcOverlays({ center }: { center: Coordinates }) {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const activeOverlays = useSunTrackerStore((state) => state.activeOverlays);

  const polygons = useMemo(() => {
    if (!sunData || !activeOverlays.has("golden-hour-arc") && !activeOverlays.has("blue-hour-arc")) {
      return {
        golden: [] as Array<Array<[number, number]>>,
        blue: [] as Array<Array<[number, number]>>,
      };
    }

    const golden = activeOverlays.has("golden-hour-arc")
      ? [
          createArcBand(
            center,
            sunData.sunriseAzimuth,
            azimuthAt(center.lat, center.lng, sunData.goldenHour.end),
            HOUR_ARC_INNER_RADIUS_METERS,
            HOUR_ARC_OUTER_RADIUS_METERS,
          ),
          createArcBand(
            center,
            azimuthAt(center.lat, center.lng, sunData.goldenHourEvening.start),
            sunData.sunsetAzimuth,
            HOUR_ARC_INNER_RADIUS_METERS,
            HOUR_ARC_OUTER_RADIUS_METERS,
          ),
        ].map((item) => toLatLngPairs(item))
      : [];

    const blue = activeOverlays.has("blue-hour-arc")
      ? [
          createArcBand(
            center,
            azimuthAt(center.lat, center.lng, sunData.blueHour.start),
            azimuthAt(center.lat, center.lng, sunData.blueHour.end),
            HOUR_ARC_INNER_RADIUS_METERS,
            HOUR_ARC_OUTER_RADIUS_METERS,
          ),
          createArcBand(
            center,
            azimuthAt(center.lat, center.lng, sunData.blueHourEvening.start),
            azimuthAt(center.lat, center.lng, sunData.blueHourEvening.end),
            HOUR_ARC_INNER_RADIUS_METERS,
            HOUR_ARC_OUTER_RADIUS_METERS,
          ),
        ].map((item) => toLatLngPairs(item))
      : [];

    return { golden, blue };
  }, [activeOverlays, center, sunData]);

  return (
    <>
      {polygons.golden.map((polygon, index) => (
        <Polygon
          key={`golden-${index}`}
          positions={polygon}
          pathOptions={{
            color: "#f59e0b",
            fillColor: "#fbbf24",
            fillOpacity: 0.22,
            weight: 1.5,
          }}
        />
      ))}

      {polygons.blue.map((polygon, index) => (
        <Polygon
          key={`blue-${index}`}
          positions={polygon}
          pathOptions={{
            color: "#2563eb",
            fillColor: "#60a5fa",
            fillOpacity: 0.16,
            weight: 1.5,
          }}
        />
      ))}
    </>
  );
}

function SunPathArc({ center }: { center: Coordinates }) {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const activeOverlays = useSunTrackerStore((state) => state.activeOverlays);

  const positions = useMemo(() => {
    if (!sunData || !activeOverlays.has("sun-path")) {
      return [] as Array<[number, number]>;
    }

    return toLatLngPairs(
      createArcPoints(
        center,
        sunData.sunriseAzimuth,
        sunData.sunsetAzimuth,
        SUN_PATH_RADIUS_METERS,
        42,
      ),
    );
  }, [activeOverlays, center, sunData]);

  if (positions.length === 0) {
    return null;
  }

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: "#0f172a",
        weight: 2,
        opacity: 0.75,
        dashArray: "6 8",
      }}
    />
  );
}

function SunDirectionLines({ center }: { center: Coordinates }) {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const activeOverlays = useSunTrackerStore((state) => state.activeOverlays);

  const sunrisePositions = useMemo(() => {
    if (!sunData || !activeOverlays.has("sunrise-line")) {
      return [] as Array<[number, number]>;
    }

    return toLatLngPairs(createRay(center, sunData.sunriseAzimuth, DIRECTION_LINE_DISTANCE_METERS));
  }, [activeOverlays, center, sunData]);

  const sunsetPositions = useMemo(() => {
    if (!sunData || !activeOverlays.has("sunset-line")) {
      return [] as Array<[number, number]>;
    }

    return toLatLngPairs(createRay(center, sunData.sunsetAzimuth, DIRECTION_LINE_DISTANCE_METERS));
  }, [activeOverlays, center, sunData]);

  const currentSunPositions = useMemo(() => {
    if (!sunData || !activeOverlays.has("sun-position")) {
      return [] as Array<[number, number]>;
    }

    return toLatLngPairs(createRay(center, sunData.sunAzimuth, DIRECTION_LINE_DISTANCE_METERS));
  }, [activeOverlays, center, sunData]);

  const currentSunMarker = useMemo(() => {
    if (!sunData || !activeOverlays.has("sun-position")) {
      return null;
    }

    return createRay(center, sunData.sunAzimuth, SUN_MARKER_DISTANCE_METERS)[1];
  }, [activeOverlays, center, sunData]);

  return (
    <>
      {sunrisePositions.length > 0 && (
        <Polyline
          positions={sunrisePositions}
          pathOptions={{ color: "#f59e0b", weight: 2.5, opacity: 0.9 }}
        />
      )}

      {sunsetPositions.length > 0 && (
        <Polyline
          positions={sunsetPositions}
          pathOptions={{ color: "#ea580c", weight: 2.5, opacity: 0.9 }}
        />
      )}

      {currentSunPositions.length > 0 && (
        <Polyline
          positions={currentSunPositions}
          pathOptions={{ color: "#facc15", weight: 3, opacity: 0.95 }}
        />
      )}

      {currentSunMarker && (
        <CircleMarker
          center={[currentSunMarker.lat, currentSunMarker.lng]}
          radius={7}
          pathOptions={{
            color: "#ca8a04",
            fillColor: "#fde047",
            fillOpacity: 0.95,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            Sun
          </Tooltip>
        </CircleMarker>
      )}
    </>
  );
}

function ShadowOverlay({ center }: { center: Coordinates }) {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const activeOverlays = useSunTrackerStore((state) => state.activeOverlays);

  const positions = useMemo(() => {
    if (!sunData || !activeOverlays.has("shadow")) {
      return [] as Array<[number, number]>;
    }

    const lengthFactor = Number.isFinite(sunData.shadowLengthRatio)
      ? sunData.shadowLengthRatio
      : Number.MAX_SAFE_INTEGER;

    const distance = clamp(
      1_600 * Math.max(0.6, lengthFactor),
      SHADOW_DISTANCE_MIN_METERS,
      SHADOW_DISTANCE_MAX_METERS,
    );

    return toLatLngPairs(createRay(center, sunData.shadowDirection, distance));
  }, [activeOverlays, center, sunData]);

  if (positions.length === 0) {
    return null;
  }

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: "#475569",
        weight: 2.5,
        opacity: 0.85,
        dashArray: "10 6",
      }}
    />
  );
}

export function MapOverlays() {
  const location = useSunTrackerStore((state) => state.location);
  const sunData = useSunTrackerStore((state) => state.sunData);

  if (!location || !sunData) {
    return null;
  }

  return (
    <>
      <SunDirectionLines center={location} />
      <HourArcOverlays center={location} />
      <ShadowOverlay center={location} />
      <SunPathArc center={location} />
    </>
  );
}

export function LayerControl() {
  const activeOverlays = useSunTrackerStore((state) => state.activeOverlays);
  const toggleOverlay = useSunTrackerStore((state) => state.toggleOverlay);

  return (
    <aside
      className="absolute left-4 top-4 z-[1000] w-60 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur"
      aria-label="Map overlay controls"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        Map Layers
      </p>

      <div className="mt-2 space-y-2">
        {OVERLAY_OPTIONS.map((overlay) => (
          <label key={overlay.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={activeOverlays.has(overlay.id)}
              onChange={() => {
                toggleOverlay(overlay.id);
              }}
              aria-label={overlay.label}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            <span>{overlay.label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
