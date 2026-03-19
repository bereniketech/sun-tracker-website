"use client";

import { useSunTrackerStore } from "@/store/sun-tracker-store";

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function cardinalFromDegrees(value: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const normalized = normalizeDegrees(value);
  const index = Math.round(normalized / 45) % directions.length;
  return directions[index] ?? "N";
}

function formatShadowRatio(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return "No shadow";
  }

  return `${value.toFixed(1)}x object height`;
}

export function ShadowInfo() {
  const sunData = useSunTrackerStore((state) => state.sunData);

  if (!sunData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Shadow</p>
        <p className="mt-2 text-sm text-slate-600">Select a location to view shadow direction.</p>
      </div>
    );
  }

  const isSunBelowHorizon = sunData.sunElevation <= 0 || !Number.isFinite(sunData.shadowLengthRatio);

  return (
    <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Shadow</p>

      {isSunBelowHorizon ? (
        <p className="text-sm font-semibold text-slate-900">No shadow (sun below horizon)</p>
      ) : (
        <>
          <p className="text-sm text-slate-700">
            Direction:{" "}
            <span className="font-semibold text-slate-900">
              {Math.round(sunData.shadowDirection)}° {cardinalFromDegrees(sunData.shadowDirection)}
            </span>
          </p>
          <p className="text-sm text-slate-700">
            Length:{" "}
            <span className="font-semibold text-slate-900">
              {formatShadowRatio(sunData.shadowLengthRatio)}
            </span>
          </p>
        </>
      )}
    </section>
  );
}