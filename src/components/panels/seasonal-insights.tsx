"use client";

import { useMemo } from "react";
import { computeSeasonalData, type MonthlySnapshot } from "@/lib/seasonal-insights";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 200;
const CHART_TOP = 16;
const CHART_BOTTOM = 144;
const CHART_LEFT = 36;
const CHART_RIGHT = 564;
const BAR_WIDTH = 30;
const LEGEND_Y = 184;
const OTHER_BAR_FILL = "#78716c";
const LONGEST_BAR_FILL = "#f59e0b";
const SHORTEST_BAR_FILL = "#38bdf8";
const NIGHT_FILL = "#0f172a";

interface SeasonalInsightsProps {
  lat?: number;
  lng?: number;
}

function toMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

function timeToY(date: Date, minTime: number, maxTime: number): number {
  if (maxTime <= minTime) {
    return (CHART_TOP + CHART_BOTTOM) / 2;
  }

  const ratio = (toMinutesSinceMidnight(date) - minTime) / (maxTime - minTime);
  return CHART_TOP + ratio * (CHART_BOTTOM - CHART_TOP);
}

function indexToX(index: number): number {
  const slotWidth = (CHART_RIGHT - CHART_LEFT) / 12;
  return CHART_LEFT + slotWidth * index + (slotWidth - BAR_WIDTH) / 2;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDayLength(dayLengthSeconds: number): string {
  const totalMinutes = Math.round(dayLengthSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function buildTooltip(snapshot: MonthlySnapshot): string {
  return [
    snapshot.monthName,
    `Sunrise: ${formatTime(snapshot.sunrise)}`,
    `Sunset: ${formatTime(snapshot.sunset)}`,
    `Golden hour start: ${formatTime(snapshot.goldenHourStart)}`,
    `Day length: ${formatDayLength(snapshot.dayLengthSeconds)}`,
  ].join("\n");
}

export function SeasonalInsights({ lat, lng }: SeasonalInsightsProps) {
  const location = useSunTrackerStore((state) => state.location);
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const year = dateTime.getFullYear();
  const hasPropCoordinates = typeof lat === "number" && typeof lng === "number";
  const resolvedLat = hasPropCoordinates ? lat : location?.lat;
  const resolvedLng = hasPropCoordinates ? lng : location?.lng;

  const snapshots = useMemo(() => {
    if (typeof resolvedLat !== "number" || typeof resolvedLng !== "number") {
      return null;
    }

    return computeSeasonalData(resolvedLat, resolvedLng, year);
  }, [resolvedLat, resolvedLng, year]);

  const chartData = useMemo(() => {
    if (!snapshots || snapshots.length === 0) {
      return null;
    }

    const minTime = Math.min(...snapshots.map((snapshot) => toMinutesSinceMidnight(snapshot.sunrise)));
    const maxTime = Math.max(...snapshots.map((snapshot) => toMinutesSinceMidnight(snapshot.sunset)));

    let longestIndex = 0;
    let shortestIndex = 0;

    snapshots.forEach((snapshot, index) => {
      if (snapshot.dayLengthSeconds > snapshots[longestIndex].dayLengthSeconds) {
        longestIndex = index;
      }

      if (snapshot.dayLengthSeconds < snapshots[shortestIndex].dayLengthSeconds) {
        shortestIndex = index;
      }
    });

    return {
      minTime,
      maxTime,
      longestIndex,
      shortestIndex,
    };
  }, [snapshots]);

  if (!snapshots || !chartData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Seasonal insights</p>
        <p className="mt-2 text-sm text-slate-600">Select a location to view seasonal daylight trends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Seasonal insights</p>
          <p className="mt-1 text-sm text-slate-600">Daylight expands and contracts across the year for this location.</p>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{year}</p>
      </div>

      <div className="overflow-x-auto">
        <svg
          aria-label="Seasonal daylight chart"
          className="min-w-[320px] w-full"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          width="100%"
        >
          <rect fill={NIGHT_FILL} height={CHART_BOTTOM - CHART_TOP} rx="14" width={CHART_RIGHT - CHART_LEFT} x={CHART_LEFT} y={CHART_TOP} />

          {snapshots.map((snapshot, index) => {
            const x = indexToX(index);
            const sunriseY = timeToY(snapshot.sunrise, chartData.minTime, chartData.maxTime);
            const sunsetY = timeToY(snapshot.sunset, chartData.minTime, chartData.maxTime);
            const barHeight = Math.max(sunsetY - sunriseY, 2);
            const fill =
              index === chartData.longestIndex
                ? LONGEST_BAR_FILL
                : index === chartData.shortestIndex
                  ? SHORTEST_BAR_FILL
                  : OTHER_BAR_FILL;

            return (
              <g
                key={snapshot.month}
                data-testid="seasonal-insight-bar"
                transform={`translate(${x} 0)`}
              >
                <title>{buildTooltip(snapshot)}</title>
                <rect
                  fill={fill}
                  height={barHeight}
                  rx="8"
                  width={BAR_WIDTH}
                  x="0"
                  y={sunriseY}
                />
                <text
                  fill="#475569"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  x={BAR_WIDTH / 2}
                  y="166"
                >
                  {snapshot.monthName.slice(0, 3)}
                </text>
              </g>
            );
          })}

          <g data-testid="seasonal-insight-bar-longest">
            <rect fill={LONGEST_BAR_FILL} height="0" width="0" x="0" y="0" />
          </g>
          <g data-testid="seasonal-insight-bar-shortest">
            <rect fill={SHORTEST_BAR_FILL} height="0" width="0" x="0" y="0" />
          </g>

          <g transform={`translate(${CHART_LEFT} ${LEGEND_Y})`}>
            <circle cx="6" cy="0" fill={LONGEST_BAR_FILL} r="4" />
            <text fill="#475569" fontSize="11" x="16" y="4">Longest day</text>
            <circle cx="120" cy="0" fill={SHORTEST_BAR_FILL} r="4" />
            <text fill="#475569" fontSize="11" x="130" y="4">Shortest day</text>
            <circle cx="250" cy="0" fill={OTHER_BAR_FILL} r="4" />
            <text fill="#475569" fontSize="11" x="260" y="4">Other months</text>
          </g>
        </svg>
      </div>
    </div>
  );
}