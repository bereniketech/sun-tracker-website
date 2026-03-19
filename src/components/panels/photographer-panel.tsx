"use client";

import { BestDirectionIndicator } from "@/components/panels/best-direction-indicator";
import { BlueHourCountdown } from "@/components/panels/blue-hour-countdown";
import { GoldenHourCountdown } from "@/components/panels/golden-hour-countdown";
import { WeeklyForecast } from "@/components/panels/weekly-forecast";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

export function PhotographerPanel() {
  const photographerMode = useSunTrackerStore((state) => state.photographerMode);
  const location = useSunTrackerStore((state) => state.location);
  const sunData = useSunTrackerStore((state) => state.sunData);
  const dateTime = useSunTrackerStore((state) => state.dateTime);

  if (!photographerMode) {
    return null;
  }

  if (!location || !sunData) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">Photographer Mode</p>
        <p className="mt-1.5 text-sm text-amber-900">Pick a location to unlock golden/blue hour planning tools.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">Photographer Mode</p>
        <span className="rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-900">
          Planning active
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <GoldenHourCountdown sunData={sunData} />
        <BlueHourCountdown sunData={sunData} />
      </div>

      <BestDirectionIndicator sunData={sunData} dateTime={dateTime} />
      <WeeklyForecast location={location} dateTime={dateTime} />
    </section>
  );
}
