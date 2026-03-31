"use client";

import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { SolarFeed } from "@/components/observatory/solar-feed";
import { SystemStatus } from "@/components/observatory/system-status";
import { Calibration } from "@/components/observatory/calibration";

export default function ObservatoryPage() {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const locationName = useSunTrackerStore((state) => state.locationName);

  const azimuth = sunData?.sunAzimuth ?? 0;
  const altitude = sunData?.sunElevation ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            LIVE TELEMETRY
          </p>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Observatory Feed
          </h1>
          <p className="mt-1 text-sm text-secondary">{locationName}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="animate-pulse rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              LIVE
            </span>
          </div>
          <p className="font-headline text-2xl font-bold text-primary">
            {azimuth.toFixed(2)}°
          </p>
          <p className="font-headline text-2xl font-bold text-primary">
            {altitude.toFixed(2)}°
          </p>
          <p className="text-xs text-secondary">AZ / ALT</p>
        </div>
      </div>

      {/* Solar feed */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <SolarFeed azimuth={azimuth} altitude={altitude} />
        </div>
      </div>

      {/* System status */}
      <SystemStatus elevation={altitude} />

      {/* Calibration */}
      <Calibration />
    </div>
  );
}
