"use client";

import { useSunTrackerStore } from "@/store/sun-tracker-store";

function formatDayLength(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function formatDayLengthChange(deltaSeconds: number): string {
  const rounded = Math.round(deltaSeconds);

  if (rounded === 0) {
    return "No change";
  }

  const sign = rounded > 0 ? "+" : "-";
  const absolute = Math.abs(rounded);
  const minutes = Math.floor(absolute / 60);
  const seconds = absolute % 60;

  return `${sign}${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export function DaylightInfo() {
  const sunData = useSunTrackerStore((state) => state.sunData);

  if (!sunData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Daylight</p>
        <p className="mt-1 text-sm text-slate-600">Select a location to view daylight duration.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Daylight</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        Day length: {formatDayLength(sunData.dayLength)}
      </p>
      <p className="mt-1 text-sm text-slate-700">
        Change vs previous day: {formatDayLengthChange(sunData.dayLengthChange)}
      </p>
    </div>
  );
}
