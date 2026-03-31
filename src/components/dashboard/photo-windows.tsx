"use client";

import { Sparkles } from "lucide-react";
import type { SunData } from "@/types/sun";
import { GoldenHourCountdown } from "@/components/panels/golden-hour-countdown";
import { BlueHourCountdown } from "@/components/panels/blue-hour-countdown";

interface PhotoWindowsProps {
  sunData: SunData | null;
}

function formatTime(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function PhotoWindows({ sunData }: PhotoWindowsProps) {
  const goldenMorningStart = sunData ? formatTime(sunData.goldenHour.start) : "—";
  const goldenMorningEnd = sunData ? formatTime(sunData.goldenHour.end) : "—";
  const goldenEveStart = sunData ? formatTime(sunData.goldenHourEvening.start) : "—";
  const goldenEveEnd = sunData ? formatTime(sunData.goldenHourEvening.end) : "—";
  const blueMorningStart = sunData ? formatTime(sunData.blueHour.start) : "—";
  const blueMorningEnd = sunData ? formatTime(sunData.blueHour.end) : "—";
  const blueEveStart = sunData ? formatTime(sunData.blueHourEvening.start) : "—";
  const blueEveEnd = sunData ? formatTime(sunData.blueHourEvening.end) : "—";

  return (
    <div className="glass-card sidebar-card rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-label tracking-widest uppercase text-secondary">
          Photographic Windows
        </p>
        <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#505f76] to-[#3d4d64] px-2 py-0.5 shadow-sm">
          <Sparkles className="h-3 w-3 text-white" aria-hidden="true" />
          <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-white">
            Optimal
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Golden Hour */}
        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
            <span className="text-sm font-label font-medium text-amber-700">Golden Hour</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 mb-1">
            <div>
              <p className="text-[10px] text-secondary uppercase tracking-wide">Morning</p>
              <p className="text-sm font-headline text-on-surface">
                {goldenMorningStart} – {goldenMorningEnd}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-secondary uppercase tracking-wide">Evening</p>
              <p className="text-sm font-headline text-on-surface">
                {goldenEveStart} – {goldenEveEnd}
              </p>
            </div>
          </div>
          <p className="mb-1 text-xs text-secondary italic">Warm directional light</p>
          {sunData && <GoldenHourCountdown sunData={sunData} />}
        </div>

        <div className="border-t border-outline-variant" />

        {/* Blue Hour */}
        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#505f76] shrink-0" aria-hidden="true" />
            <span className="text-sm font-label font-medium text-[#505f76]">Blue Hour</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 mb-1">
            <div>
              <p className="text-[10px] text-secondary uppercase tracking-wide">Morning</p>
              <p className="text-sm font-headline text-on-surface">
                {blueMorningStart} – {blueMorningEnd}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-secondary uppercase tracking-wide">Evening</p>
              <p className="text-sm font-headline text-on-surface">
                {blueEveStart} – {blueEveEnd}
              </p>
            </div>
          </div>
          {sunData && <BlueHourCountdown sunData={sunData} />}
        </div>
      </div>
    </div>
  );
}
