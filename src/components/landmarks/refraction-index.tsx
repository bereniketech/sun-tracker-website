"use client";

import { useEffect, useState } from "react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { computeSunData } from "@/lib/sun";
import type { Landmark } from "@/types/sun";

/**
 * Compute atmospheric refraction using Bennett formula
 * R = 1.02 / tan(h + 10.3 / (h + 5.11))  [arc-minutes]
 * h = apparent altitude in degrees
 * Returns arc-minutes
 */
function calculateRefraction(elevationDegrees: number): number {
  // Guard for low elevations
  if (elevationDegrees <= -1) {
    return 0;
  }

  const h = elevationDegrees;
  const tanInput = h + 10.3 / (h + 5.11);
  const refraction = 1.02 / Math.tan((tanInput * Math.PI) / 180);

  return Math.max(0, refraction);
}

/**
 * Convert arc-minutes to percentage of sun's apparent diameter
 * Sun's diameter ≈ 0.53° ≈ 32 arc-minutes
 */
function refractionToPercentage(arcMinutes: number): number {
  return Math.min(100, Math.round((arcMinutes / 32) * 100));
}

interface LandmarkRefraction {
  id: string;
  name: string;
  elevation: number;
  refractionArcSec: number;
}

interface RefractionIndexProps {
  landmarks: Landmark[];
}

function buildDiagnosticData(landmarks: Landmark[], dateTime: Date): LandmarkRefraction[] {
  return landmarks.map((landmark) => {
    const landmarkSunData = computeSunData(landmark.lat, landmark.lng, dateTime);
    const landmarkRefraction = calculateRefraction(landmarkSunData.sunElevation);
    const arcSeconds = landmarkRefraction * 60;

    return {
      id: landmark.id,
      name: landmark.name,
      elevation: landmarkSunData.sunElevation,
      refractionArcSec: Math.round(arcSeconds * 10) / 10,
    };
  });
}

export function RefractionIndex({ landmarks }: RefractionIndexProps) {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<LandmarkRefraction[]>([]);

  useEffect(() => {
    if (!isDiagnosticRunning) {
      return;
    }

    setDiagnosticData(buildDiagnosticData(landmarks, dateTime));
  }, [dateTime, isDiagnosticRunning, landmarks]);

  if (!sunData) {
    return null;
  }

  const refraction = calculateRefraction(sunData.sunElevation);
  const percentage = refractionToPercentage(refraction);

  // Calculate circumference for stroke-dasharray animation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const handleRunDiagnostic = () => {
    if (isDiagnosticRunning) {
      setIsDiagnosticRunning(false);
      setDiagnosticData([]);
      return;
    }

    setDiagnosticData(buildDiagnosticData(landmarks, dateTime));
    setIsDiagnosticRunning(true);
  };

  return (
    <div className="px-4 sm:px-6 py-6 border-t border-surface-variant/20">
      <div className="max-w-7xl mx-auto">
        {/* Dark card with refraction display */}
        <div className="bg-inverse-surface rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div>
            <p className="text-xs tracking-widest uppercase text-inverse-on-surface/60 mb-2">
              REAL-TIME GLOBAL VECTOR
            </p>
            <h2 className="font-headline text-xl text-inverse-on-surface">
              Atmospheric Refraction Index
            </h2>
          </div>

          {/* Percentage display with circular ring */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className="absolute">
                {/* Background ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-inverse-on-surface/20"
                />

                {/* Progress ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="text-primary-container transition-all duration-300"
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "80px 80px",
                  }}
                />
              </svg>

              {/* Percentage text */}
              <div className="text-center">
                <div className="font-headline text-5xl text-primary-container font-bold">
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Equatorial constant */}
            <p className="text-sm text-inverse-on-surface/70">
              Equatorial Standard: +0.0042
            </p>
          </div>

          {/* Diagnostic button */}
          <div className="flex justify-center">
            <button
              onClick={handleRunDiagnostic}
              className="bg-surface-container text-on-surface rounded-xl px-4 py-2 text-sm font-medium hover:bg-surface-container/80 transition-colors"
            >
              {isDiagnosticRunning ? "HIDE DIAGNOSTIC" : "RUN DIAGNOSTIC"}
            </button>
          </div>

          {/* Diagnostic table */}
          {isDiagnosticRunning && diagnosticData.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl p-4 mt-4 space-y-2">
              {/* Table header */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-4 pb-3 border-b border-on-surface/10 text-xs font-medium text-on-surface/60 uppercase tracking-wider">
                <div>Landmark</div>
                <div>Elevation°</div>
                <div>Refraction (arc-sec)</div>
              </div>

              {/* Table rows */}
              <div className="space-y-3">
                {diagnosticData.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 sm:p-0 sm:border-none bg-surface-container-low sm:bg-transparent rounded-lg sm:rounded-none text-sm"
                  >
                    <div className="font-medium text-on-surface">
                      <span className="sm:hidden text-xs text-on-surface/60 uppercase block mb-1">
                        Landmark
                      </span>
                      {row.name}
                    </div>
                    <div className="text-on-surface/80">
                      <span className="sm:hidden text-xs text-on-surface/60 uppercase block mb-1">
                        Elevation°
                      </span>
                      {row.elevation.toFixed(1)}°
                    </div>
                    <div className="text-on-surface/80">
                      <span className="sm:hidden text-xs text-on-surface/60 uppercase block mb-1">
                        Refraction
                      </span>
                      {row.refractionArcSec}&quot;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
