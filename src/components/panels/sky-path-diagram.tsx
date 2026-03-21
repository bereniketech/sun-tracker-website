"use client";

import { useMemo } from "react";
import { computeSkyPath, type SkyPathPoint } from "@/lib/sky-path";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const VIEW_W = 500;
const VIEW_H = 160;
const PAD = 20;
const MINUTES_PER_DAY = 24 * 60;
const FULL_DAY_SECONDS = 24 * 60 * 60;

function getMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

function timeToX(date: Date): number {
  const drawableWidth = VIEW_W - PAD * 2;
  return PAD + (getMinutesSinceMidnight(date) / MINUTES_PER_DAY) * drawableWidth;
}

function elevToY(degrees: number, minElevation: number, maxElevation: number): number {
  if (maxElevation === minElevation) {
    return VIEW_H / 2;
  }

  const drawableHeight = VIEW_H - PAD * 2;
  const ratio = (degrees - minElevation) / (maxElevation - minElevation);
  return VIEW_H - PAD - ratio * drawableHeight;
}

function buildBands(points: SkyPathPoint[], isInBand: (point: SkyPathPoint) => boolean): SkyPathPoint[][] {
  const bands: SkyPathPoint[][] = [];
  let currentBand: SkyPathPoint[] = [];

  points.forEach((point) => {
    if (isInBand(point)) {
      currentBand = [...currentBand, point];
      return;
    }

    if (currentBand.length > 0) {
      bands.push(currentBand);
      currentBand = [];
    }
  });

  if (currentBand.length > 0) {
    bands.push(currentBand);
  }

  return bands;
}

function bandToPolygon(
  band: SkyPathPoint[],
  horizonY: number,
  minElevation: number,
  maxElevation: number,
): string {
  const firstPoint = band[0];
  const lastPoint = band[band.length - 1];

  if (!firstPoint || !lastPoint) {
    return "";
  }

  const topEdge = band.map((point) => `${timeToX(point.time)},${elevToY(point.elevation, minElevation, maxElevation)}`);

  return [`${timeToX(firstPoint.time)},${horizonY}`, ...topEdge, `${timeToX(lastPoint.time)},${horizonY}`].join(" ");
}

export function SkyPathDiagram() {
  const location = useSunTrackerStore((state) => state.location);
  const sunData = useSunTrackerStore((state) => state.sunData);
  const dateTime = useSunTrackerStore((state) => state.dateTime);

  const dayStartTimestamp = new Date(
    dateTime.getFullYear(),
    dateTime.getMonth(),
    dateTime.getDate(),
  ).getTime();

  const skyPathResult = useMemo(() => {
    if (!location) {
      return null;
    }

    return computeSkyPath(location.lat, location.lng, new Date(dayStartTimestamp), 10);
  }, [dayStartTimestamp, location]);

  if (!location || !sunData || !skyPathResult || skyPathResult.points.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Sky path</p>
        <p className="mt-2 text-sm text-slate-600">Select a location to view the sun arc for the day.</p>
      </div>
    );
  }

  const { points, isPolarNight, isMidnightSun } = skyPathResult;
  const elevations = points.map((point) => point.elevation);
  const minElevation = Math.min(0, -12, ...elevations);
  const maxElevation = Math.max(12, ...elevations);
  const horizonY = elevToY(0, minElevation, maxElevation);
  const pathPoints = points.map((point) => `${timeToX(point.time)},${elevToY(point.elevation, minElevation, maxElevation)}`).join(" ");
  const currentDotX = timeToX(dateTime);
  const currentDotY = elevToY(sunData.sunElevation, minElevation, maxElevation);
  const goldenBands = buildBands(points, (point) => point.isGolden);
  const blueBands = buildBands(points, (point) => point.isBlue);
  const showRiseSetMarkers = !isPolarNight && !isMidnightSun && sunData.dayLength > 0 && sunData.dayLength < FULL_DAY_SECONDS;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Sky path</p>
        {isPolarNight && <span className="text-[11px] font-medium text-slate-600">Polar night</span>}
        {isMidnightSun && <span className="text-[11px] font-medium text-slate-600">Midnight sun</span>}
      </div>

      <div className="overflow-x-auto">
        <svg
          aria-label="Sky path diagram"
          className="min-w-[280px] w-full"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
        >
          <line
            data-testid="sky-path-horizon"
            x1={PAD}
            x2={VIEW_W - PAD}
            y1={horizonY}
            y2={horizonY}
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {!isPolarNight &&
            blueBands.map((band, index) => (
              <polygon
                key={`blue-${index}`}
                data-testid="sky-path-blue-band"
                fill="#38bdf8"
                fillOpacity="0.18"
                points={bandToPolygon(band, horizonY, minElevation, maxElevation)}
              />
            ))}

          {!isPolarNight &&
            goldenBands.map((band, index) => (
              <polygon
                key={`golden-${index}`}
                data-testid="sky-path-golden-band"
                fill="#f59e0b"
                fillOpacity="0.2"
                points={bandToPolygon(band, horizonY, minElevation, maxElevation)}
              />
            ))}

          {isPolarNight ? (
            <polyline
              fill="none"
              points={`${PAD},${horizonY} ${VIEW_W - PAD},${horizonY}`}
              stroke="#334155"
              strokeWidth="3"
            />
          ) : (
            <polyline fill="none" points={pathPoints} stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
          )}

          <line
            data-testid="sky-path-solar-noon"
            stroke="#475569"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            x1={timeToX(sunData.solarNoon)}
            x2={timeToX(sunData.solarNoon)}
            y1={PAD}
            y2={VIEW_H - PAD}
          />

          {showRiseSetMarkers && (
            <>
              <circle cx={timeToX(sunData.sunrise)} cy={horizonY} fill="#f59e0b" r="4" />
              <circle cx={timeToX(sunData.sunset)} cy={horizonY} fill="#f59e0b" r="4" />
              <text fill="#64748b" fontSize="11" textAnchor="start" x={timeToX(sunData.sunrise) + 8} y={VIEW_H - 6}>
                Sunrise
              </text>
              <text fill="#64748b" fontSize="11" textAnchor="end" x={timeToX(sunData.sunset) - 8} y={VIEW_H - 6}>
                Sunset
              </text>
            </>
          )}

          <circle
            data-testid="sky-path-current-dot"
            cx={currentDotX}
            cy={currentDotY}
            fill="#f97316"
            r="5"
            style={{ transition: "cx 0.3s ease" }}
          />

          <text fill="#64748b" fontSize="11" textAnchor="start" x={PAD} y={PAD - 4}>
            Midnight
          </text>
          <text fill="#64748b" fontSize="11" textAnchor="middle" x={VIEW_W / 2} y={PAD - 4}>
            Solar noon
          </text>
          <text fill="#64748b" fontSize="11" textAnchor="end" x={VIEW_W - PAD} y={PAD - 4}>
            24h
          </text>

          {isPolarNight && (
            <text fill="#334155" fontSize="13" fontWeight="600" textAnchor="end" x={VIEW_W - PAD} y={horizonY - 8}>
              Polar night
            </text>
          )}

          {isMidnightSun && (
            <text fill="#334155" fontSize="13" fontWeight="600" textAnchor="end" x={VIEW_W - PAD} y={PAD + 12}>
              Midnight sun
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}