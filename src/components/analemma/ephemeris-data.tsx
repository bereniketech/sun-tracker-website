"use client";

import React from "react";
import type { AnalemmaPoint } from "@/lib/analemma";

interface EphemerisDataProps {
  point: AnalemmaPoint;
}

// Helper to convert decimal degrees to Degree/Minute/Second notation
function decimalToDMS(degrees: number): string {
  const absValue = Math.abs(degrees);
  const d = Math.floor(absValue);
  const m = Math.floor((absValue - d) * 60);
  const s = ((absValue - d) * 60 - m) * 60;
  
  return `${d}° ${m}' ${s.toFixed(1)}"`;
}

// Compute Obliquity: 23.4397° - 0.0000004 * dayOfYear
function computeObliquity(dayOfYear: number): number {
  return 23.4397 - 0.0000004 * dayOfYear;
}

// Compute Geometric Mean Longitude
// Formula: (280.46646 + 36000.76983 * T) % 360
// T = Julian centuries since J2000
function computeGeometricMeanLongitude(date: Date): number {
  const J2000 = 2451545.0; // Julian day number for J2000 epoch
  const millisecondsPerDay = 86400000;
  const jd = date.getTime() / millisecondsPerDay + 2440587.5; // Convert to Julian Day
  const T = (jd - J2000) / 36525; // Convert to Julian centuries
  
  const gml = (280.46646 + 36000.76983 * T) % 360;
  return gml >= 0 ? gml : gml + 360;
}

export function EphemerisData({ point }: EphemerisDataProps) {
  const obliquity = computeObliquity(point.dayOfYear);
  const geometricMeanLongitude = computeGeometricMeanLongitude(point.date);

  return (
    <div className="space-y-2">
      <div className="text-xs font-sans tracking-widest uppercase text-muted-foreground">
        Ephemeris Data
      </div>
      <div className="rounded-2xl bg-surface-container-low p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-surface/60 p-3">
            <div className="text-xs font-medium text-on-surface">
              Solar Distance
            </div>
            <div className="text-sm text-secondary">
              {point.solarDistance.toFixed(3)} AU
            </div>
          </div>

          <div className="rounded-xl bg-surface/60 p-3">
            <div className="text-xs font-medium text-on-surface">
              Obliquity
            </div>
            <div className="text-sm text-secondary">
              {decimalToDMS(obliquity)}
            </div>
          </div>

          <div className="rounded-xl bg-surface/60 p-3">
            <div className="text-xs font-medium text-on-surface">
              Geometric Mean Longitude
            </div>
            <div className="text-sm text-secondary">
              {geometricMeanLongitude.toFixed(2)}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
