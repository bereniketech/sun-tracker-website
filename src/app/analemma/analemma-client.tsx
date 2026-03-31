"use client";

import { useState, useMemo } from "react";
import { AnalemmasvG } from "@/components/analemma/analemma-svg";
import { ChronoScrubber } from "@/components/analemma/chrono-scrubber";
import { EphemerisData } from "@/components/analemma/ephemeris-data";
import { computeAnalemma } from "@/lib/analemma";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

export default function AnalemmaPage() {
  const { location } = useSunTrackerStore();
  const currentYear = new Date().getFullYear();
  const currentDayOfYear = Math.floor(
    (new Date().getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000
  );

  const [selectedDay, setSelectedDay] = useState(currentDayOfYear);

  // Compute analemma points once
  const points = useMemo(
    () => computeAnalemma(location.lat, location.lng, currentYear),
    [location.lat, location.lng, currentYear]
  );

  // Get selected point for display
  const selectedPoint = useMemo(
    () => points.find((p) => p.dayOfYear === selectedDay),
    [points, selectedDay]
  );

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="text-xs font-sans tracking-widest uppercase text-muted-foreground">
            Celestial Mechanics
          </div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Analemma
          </h1>
          <p className="text-sm text-muted-foreground">
            The figure-8 path of the sun throughout the year when observed at
            solar noon from a fixed location. Used by photographers to predict
            the sun&apos;s apparent position on any day.
          </p>
        </div>

        {/* Data Display Section */}
        {selectedPoint && (
          <div className="space-y-6">
            {/* Top Cards: Equation of Time & Declination */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-1 rounded-lg border border-outline bg-surface-variant/20 p-3 backdrop-blur">
                <div className="text-xs tracking-widest uppercase text-muted-foreground">
                  Equation of Time
                </div>
                <div className="text-lg font-headline text-primary">
                  {selectedPoint.equationOfTime.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">minutes</div>
              </div>

              <div className="space-y-1 rounded-lg border border-outline bg-surface-variant/20 p-3 backdrop-blur">
                <div className="text-xs tracking-widest uppercase text-muted-foreground">
                  Declination
                </div>
                <div className="text-lg font-headline text-primary">
                  {selectedPoint.declination.toFixed(2)}°
                </div>
                <div className="text-xs text-muted-foreground">angle</div>
              </div>
            </div>

            {/* Solar Azimuth & Altitude Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface-container-low p-4">
                <div className="text-xs tracking-widest uppercase text-secondary mb-2">
                  Solar Azimuth
                </div>
                <div className="font-headline text-2xl text-on-surface">
                  {selectedPoint.azimuth.toFixed(1)}°
                </div>
                <div className="text-xs text-secondary mt-2">
                  {selectedPoint.azimuth >= 22.5 && selectedPoint.azimuth < 67.5
                    ? "NE"
                    : selectedPoint.azimuth >= 67.5 && selectedPoint.azimuth < 112.5
                    ? "E"
                    : selectedPoint.azimuth >= 112.5 && selectedPoint.azimuth < 157.5
                    ? "SE"
                    : selectedPoint.azimuth >= 157.5 && selectedPoint.azimuth < 202.5
                    ? "S"
                    : selectedPoint.azimuth >= 202.5 && selectedPoint.azimuth < 247.5
                    ? "SW"
                    : selectedPoint.azimuth >= 247.5 && selectedPoint.azimuth < 292.5
                    ? "W"
                    : selectedPoint.azimuth >= 292.5 && selectedPoint.azimuth < 337.5
                    ? "NW"
                    : "N"} · {selectedPoint.azimuth < 180 ? "East of Meridian" : "West of Meridian"}
                </div>
              </div>

              <div className="rounded-2xl bg-surface-container-low p-4">
                <div className="text-xs tracking-widest uppercase text-secondary mb-2">
                  Altitude
                </div>
                <div className="font-headline text-2xl text-on-surface">
                  {selectedPoint.altitude.toFixed(1)}°
                </div>
                <div className="text-xs text-secondary mt-2">
                  Zenith distance: {(90 - selectedPoint.altitude).toFixed(1)}°
                </div>
              </div>
            </div>

            {/* Mean Anomaly Card - Full Width */}
            <div className="relative rounded-2xl bg-surface-container-low p-6">
              <div className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 text-orange-600 text-xs font-medium">
                REAL-TIME
              </div>
              <div className="text-xs tracking-widest uppercase text-secondary mb-3">
                Mean Anomaly
              </div>
              <div className="font-headline text-5xl text-on-surface mb-3">
                {selectedPoint.meanAnomaly.toFixed(3)}°
              </div>
              <div className="text-sm text-secondary">
                Position relative to perihelion point in the orbital ellipse.
              </div>
            </div>

            {/* Ephemeris Data Section */}
            <EphemerisData point={selectedPoint} />
          </div>
        )}

        {/* SVG Visualization */}
        <div className="space-y-4 rounded-lg border border-outline bg-surface-variant/20 p-6 backdrop-blur">
          <div className="text-sm text-muted-foreground">
            Click on the curve to select a day
          </div>
          <div className="flex justify-center bg-surface rounded-lg p-4">
            <div className="w-full max-w-md">
              <AnalemmasvG
                points={points}
                selectedDay={selectedDay}
                onDaySelect={setSelectedDay}
              />
            </div>
          </div>
        </div>

        {/* Scrubber Section */}
        <div className="space-y-4 rounded-lg border border-outline bg-surface-variant/20 p-6 backdrop-blur">
          <ChronoScrubber value={selectedDay} onChange={setSelectedDay} />
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            <strong>Legend:</strong> The orange curve represents the sun&apos;s
            position at solar noon throughout the year. The vertical axis shows
            solar declination (latitude), and the horizontal axis shows the
            equation of time (time offset from mean solar time).
          </p>
        </div>
      </div>
    </main>
  );
}