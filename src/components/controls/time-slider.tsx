"use client";

import { useId } from "react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

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

export function TimeSlider() {
  const sliderId = useId();
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const setDateTime = useSunTrackerStore((state) => state.setDateTime);

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
    </div>
  );
}
