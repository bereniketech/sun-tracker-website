"use client";

import { Sunrise, Sun, Sunset } from "lucide-react";
import type { SunData } from "@/types/sun";

interface DayCycleProps {
  sunData: SunData | null;
}

function formatTime(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatAzimuth(degrees: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return `${Math.round(degrees)}° ${dirs[index]}`;
}

const rows = [
  {
    key: "sunrise" as const,
    label: "Sunrise",
    Icon: Sunrise,
    azimuthKey: "sunriseAzimuth" as const,
  },
  {
    key: "solarNoon" as const,
    label: "Solar Noon",
    Icon: Sun,
    azimuthKey: null,
  },
  {
    key: "sunset" as const,
    label: "Sunset",
    Icon: Sunset,
    azimuthKey: "sunsetAzimuth" as const,
  },
];

export function DayCycle({ sunData }: DayCycleProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-4">
      <p className="mb-3 text-xs font-label tracking-widest uppercase text-secondary">
        Day Cycle
      </p>

      <div className="flex flex-col gap-3">
        {rows.map(({ key, label, Icon, azimuthKey }) => {
          const time = sunData ? formatTime(sunData[key] as Date) : "—";
          const azimuth =
            azimuthKey && sunData ? formatAzimuth(sunData[azimuthKey]) : null;

          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span className="text-sm font-label text-on-surface">{label}</span>
              </div>
              <div className="text-right">
                <span className="font-headline text-lg text-on-surface leading-none">
                  {time}
                </span>
                {azimuth && (
                  <p className="mt-0.5 text-xs text-secondary">{azimuth}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
