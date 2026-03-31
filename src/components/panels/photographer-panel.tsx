"use client";

import { useEffect, useState } from "react";
import { BestDirectionIndicator } from "@/components/panels/best-direction-indicator";
import { BlueHourCountdown } from "@/components/panels/blue-hour-countdown";
import { GoldenHourCountdown } from "@/components/panels/golden-hour-countdown";
import { LightingInsightCard } from "@/components/panels/lighting-insight-card";
import { WeeklyForecast } from "@/components/panels/weekly-forecast";
import { computeLightingInsight } from "@/lib/lighting-insight";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const MOBILE_WIDTH_PX = 768;

function isMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < MOBILE_WIDTH_PX;
}

export function PhotographerPanel() {
  const photographerMode = useSunTrackerStore((state) => state.photographerMode);
  const location = useSunTrackerStore((state) => state.location);
  const sunData = useSunTrackerStore((state) => state.sunData);
  const dateTime = useSunTrackerStore((state) => state.dateTime);

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const syncViewportState = () => {
      const mobile = isMobileViewport();
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      }
    };

    syncViewportState();
    window.addEventListener("resize", syncViewportState);

    return () => {
      window.removeEventListener("resize", syncViewportState);
    };
  }, []);

  if (!photographerMode) {
    return null;
  }

  if (!location || !sunData) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-3" aria-label="Photographer panel">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">Photographer Mode</p>
          {isMobile && (
            <button
              type="button"
              className="rounded-lg border border-amber-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-900"
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
              aria-controls="photographer-panel-content-empty"
              aria-label={isOpen ? "Collapse photographer panel" : "Expand photographer panel"}
            >
              {isOpen ? "Collapse" : "Expand"}
            </button>
          )}
        </div>
        <div id="photographer-panel-content-empty" className={isMobile && !isOpen ? "hidden" : "block"}>
          <p className="mt-1.5 text-sm text-amber-900">Pick a location to unlock golden/blue hour planning tools.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-3" aria-label="Photographer panel">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">Photographer Mode</p>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-900">
            Planning active
          </span>
          {isMobile && (
            <button
              type="button"
              className="rounded-lg border border-amber-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-900"
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
              aria-controls="photographer-panel-content"
              aria-label={isOpen ? "Collapse photographer panel" : "Expand photographer panel"}
            >
              {isOpen ? "Collapse" : "Expand"}
            </button>
          )}
        </div>
      </div>

      <div id="photographer-panel-content" className={isMobile && !isOpen ? "hidden" : "space-y-3"}>
        <div className="grid gap-2 sm:grid-cols-2">
          <GoldenHourCountdown sunData={sunData} />
          <BlueHourCountdown sunData={sunData} />
        </div>

        <BestDirectionIndicator sunData={sunData} dateTime={dateTime} />
        <LightingInsightCard insight={computeLightingInsight(sunData, dateTime)} />
        <WeeklyForecast location={location} dateTime={dateTime} />
      </div>
    </section>
  );
}
