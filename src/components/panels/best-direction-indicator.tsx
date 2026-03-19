"use client";

import { useMemo } from "react";
import type { SunData } from "@/types/sun";

interface BestDirectionIndicatorProps {
  sunData: SunData;
  dateTime: Date;
}

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function cardinalFromDegrees(value: number): string {
  const labels = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const normalized = normalizeDegrees(value);
  const index = Math.round(normalized / 45) % labels.length;
  return labels[index] ?? "N";
}

export function BestDirectionIndicator({ sunData, dateTime }: BestDirectionIndicatorProps) {
  const guidance = useMemo(() => {
    const isSunriseWindow = dateTime.getTime() <= sunData.solarNoon.getTime();
    const direction = isSunriseWindow ? sunData.sunriseAzimuth : sunData.sunsetAzimuth;
    const shotType = isSunriseWindow ? "Sunrise" : "Sunset";

    return {
      shotType,
      direction,
      cardinal: cardinalFromDegrees(direction),
    };
  }, [dateTime, sunData.solarNoon, sunData.sunriseAzimuth, sunData.sunsetAzimuth]);

  return (
    <article className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2.5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-900">Best Direction</p>

      <div className="mt-2 flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-violet-300 bg-white">
          <span className="text-[10px] font-semibold text-violet-800">N</span>
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700"
            style={{
              transform: `translate(-50%, -50%) rotate(${guidance.direction}deg) translateY(-15px)`,
              transformOrigin: "center center",
            }}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-violet-950">{guidance.shotType} framing direction</p>
          <p className="text-sm text-violet-900">
            Aim toward {Math.round(guidance.direction)}° ({guidance.cardinal}).
          </p>
          <p className="text-xs text-violet-800">
            Current sun azimuth: {Math.round(sunData.sunAzimuth)}° ({cardinalFromDegrees(sunData.sunAzimuth)}).
          </p>
        </div>
      </div>
    </article>
  );
}
