"use client";

import { useSunTrackerStore } from "@/store/sun-tracker-store";

function formatTime(value: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatWindow(start: Date, end: Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

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

function formatDegrees(value: number): string {
  return `${Math.round(value)}°`;
}

interface DataRowProps {
  label: string;
  value: string;
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-right text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function SunDataDisplay() {
  const sunData = useSunTrackerStore((state) => state.sunData);

  if (!sunData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Sun Data</p>
        <p className="mt-2 text-sm text-slate-600">Select a location to view sunrise and shadow data.</p>
      </div>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Sun Data</p>

      <div className="grid gap-2">
        <DataRow label="Sunrise" value={formatTime(sunData.sunrise)} />
        <DataRow label="Sunset" value={formatTime(sunData.sunset)} />
        <DataRow label="Solar noon" value={formatTime(sunData.solarNoon)} />
        <DataRow label="Day length" value={formatDayLength(sunData.dayLength)} />
        <DataRow label="Day length change" value={formatDayLengthChange(sunData.dayLengthChange)} />
        <DataRow label="Golden hour (AM)" value={formatWindow(sunData.goldenHour.start, sunData.goldenHour.end)} />
        <DataRow
          label="Golden hour (PM)"
          value={formatWindow(sunData.goldenHourEvening.start, sunData.goldenHourEvening.end)}
        />
        <DataRow label="Blue hour (AM)" value={formatWindow(sunData.blueHour.start, sunData.blueHour.end)} />
        <DataRow
          label="Blue hour (PM)"
          value={formatWindow(sunData.blueHourEvening.start, sunData.blueHourEvening.end)}
        />
        <DataRow label="Sun azimuth" value={formatDegrees(sunData.sunAzimuth)} />
        <DataRow label="Sun elevation" value={formatDegrees(sunData.sunElevation)} />
      </div>
    </section>
  );
}