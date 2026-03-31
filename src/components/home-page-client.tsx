"use client";

import { Suspense } from "react";
import { AnimateButton } from "@/components/controls/animate-button";
import { DatePicker } from "@/components/controls/date-picker";
import { TimeSlider } from "@/components/controls/time-slider";
import { InteractiveMap } from "@/components/map/interactive-map";
import { InfoPanel } from "@/components/panels/info-panel";
import { SharePanel } from "@/components/panels/share-panel";
import { SolarMetrics } from "@/components/dashboard/solar-metrics";
import { DayCycle } from "@/components/dashboard/day-cycle";
import { PhotoWindows } from "@/components/dashboard/photo-windows";
import { AdUnit } from "@/components/ads/ad-unit";
import { FadeUp, ScaleIn } from "@/components/motion";
import {
  DEFAULT_MAP_LOCATION,
  formatCoordinatePair,
} from "@/components/map/location-utils";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { useUrlState } from "@/hooks/use-url-state";

/** Inner component so useSearchParams is inside a Suspense boundary. */
function UrlStateSyncer() {
  useUrlState();
  return null;
}

function formatTime(value: Date | null): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function HomePageClient() {
  const location = useSunTrackerStore((state) => state.location);
  const locationName = useSunTrackerStore((state) => state.locationName);
  const sunData = useSunTrackerStore((state) => state.sunData);
  const resolvedLocationName = locationName || DEFAULT_MAP_LOCATION.name;

  const coordinateLabel = location
    ? formatCoordinatePair(location.lat, location.lng)
    : formatCoordinatePair(DEFAULT_MAP_LOCATION.lat, DEFAULT_MAP_LOCATION.lng);

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={null}>
        <UrlStateSyncer />
      </Suspense>

      <SolarMetrics
        sunData={sunData}
        locationName={resolvedLocationName}
        coordinates={coordinateLabel}
      />

      {/* Main 3-col grid: stacked on mobile, 3-col on desktop */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_320px] lg:items-start">
        {/* Left col: controls card */}
        <FadeUp delay={0.4} className="flex flex-col gap-4">
          <div className="glass-card sidebar-card rounded-2xl p-4 relative z-10">
            <div className="space-y-4">
              <TimeSlider />
              <DatePicker />
              <AnimateButton />
            </div>
          </div>

          {/* Day Cycle + Photo Windows shown in left col on mobile, hidden on desktop */}
          <div className="flex flex-col gap-4 lg:hidden">
            <DayCycle sunData={sunData} />
            <PhotoWindows sunData={sunData} />
          </div>
        </FadeUp>

        {/* Center col: map */}
        <ScaleIn delay={0.3} className="min-w-0">
          <InteractiveMap />
        </ScaleIn>

        {/* Right col: day cycle + photo windows — desktop only */}
        <FadeUp delay={0.5} className="hidden flex-col gap-4 lg:flex">
          <DayCycle sunData={sunData} />
          <PhotoWindows sunData={sunData} />
        </FadeUp>
      </div>

      <AdUnit adSlot="3555028435" adFormat="horizontal" className="my-2" />

      <FadeUp delay={0.6}>
        <InfoPanel />
      </FadeUp>

      <p className="sr-only" aria-live="polite">
        Active location {resolvedLocationName}. Sunrise {formatTime(sunData?.sunrise ?? null)}.
        Sunset {formatTime(sunData?.sunset ?? null)}.
      </p>

      <FadeUp delay={0.65} className="pb-8">
        <SharePanel />
      </FadeUp>
    </div>
  );
}
