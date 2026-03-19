"use client";

import { useId } from "react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { SunData } from "@/types/sun";

function minuteOfDay(dateTime: Date): number {
  return dateTime.getHours() * 60 + dateTime.getMinutes();
}

function formatMinuteLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hoursLabel = String(hours).padStart(2, "0");
  const minuteLabel = String(minutes).padStart(2, "0");

  return `${hoursLabel}:${minuteLabel}`;
}

interface LightingPhase {
  label: string;
  colorClass: string;
}

function getLightingPhase(elevation: number): LightingPhase {
  if (elevation < -6) return { label: "Night", colorClass: "bg-slate-700 text-slate-100" };
  if (elevation < -0.833) return { label: "Blue Hour", colorClass: "bg-blue-600 text-white" };
  if (elevation < 6) return { label: "Golden Hour", colorClass: "bg-amber-400 text-amber-950" };
  if (elevation < 20) return { label: "Daytime", colorClass: "bg-green-500 text-white" };
  return { label: "Harsh Light", colorClass: "bg-orange-500 text-white" };
}

function getShadowDescriptor(ratio: number | null | undefined): string {
  if (ratio === null || ratio === undefined || !Number.isFinite(ratio) || ratio > 5) return "Very Long";
  if (ratio > 2) return "Long";
  if (ratio > 1) return "Moderate";
  return "Short";
}

interface LightingBadgeProps {
  sunData: SunData | null;
}

function LightingBadge({ sunData }: LightingBadgeProps) {
  if (!sunData) return null;

  const phase = getLightingPhase(sunData.sunElevation);
  const shadow = getShadowDescriptor(sunData.shadowLengthRatio);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`rounded-full px-2 py-0.5 font-semibold ${phase.colorClass}`}>
        {phase.label}
      </span>
      <span className="text-slate-500">Shadow: {shadow}</span>
    </div>
  );
}

export function TimeSlider() {
  const sliderId = useId();
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const setDateTime = useSunTrackerStore((state) => state.setDateTime);
  const sunData = useSunTrackerStore((state) => state.sunData);

  const value = minuteOfDay(dateTime);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={sliderId} className="text-sm font-medium text-slate-900">
          Time of day
        </label>
        <p className="text-sm font-semibold text-slate-900">{formatMinuteLabel(value)}</p>
      </div>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={1439}
        step={1}
        value={value}
        onChange={(event) => {
          const nextMinutes = Number(event.target.value);
          const nextDateTime = new Date(dateTime);
          const nextHours = Math.floor(nextMinutes / 60);
          const nextMinute = nextMinutes % 60;

          nextDateTime.setHours(nextHours, nextMinute, 0, 0);
          setDateTime(nextDateTime);
        }}
        aria-label="Time of day slider"
        aria-valuetext={formatMinuteLabel(value)}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-amber-500"
      />
      <LightingBadge sunData={sunData} />
    </div>
  );
}
