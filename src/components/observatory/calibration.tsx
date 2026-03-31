"use client";

import { useEffect, useState } from "react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { useAuth } from "@/hooks/use-auth";
import { getBrowserClient } from "@/lib/supabase";
import type { CalibrationState } from "@/types/sun";

const CAPTURE_RATES = [5, 10, 30, 60] as const;

const INTENSITY_SWATCHES = [
  "#fed7aa",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#9d4300",
] as const;

const STORAGE_KEY = "helios:calibration";

function computeSolarIntensity(elevation: number): number {
  if (elevation <= 0) return 0;
  return Math.round(1361 * Math.sin((elevation * Math.PI) / 180));
}

function loadFromStorage(): CalibrationState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CalibrationState) : null;
  } catch {
    return null;
  }
}

export function Calibration() {
  const calibration = useSunTrackerStore((state) => state.calibration);
  const setCalibration = useSunTrackerStore((state) => state.setCalibration);
  const sunData = useSunTrackerStore((state) => state.sunData);
  const { user } = useAuth();

  const [captureFlash, setCaptureFlash] = useState(false);

  const elevation = sunData?.sunElevation ?? 0;
  const intensity = computeSolarIntensity(elevation);

  // Load persisted calibration on mount
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata?.calibration as CalibrationState | undefined;
      if (meta) {
        setCalibration(meta);
        return;
      }
    }
    const stored = loadFromStorage();
    if (stored) setCalibration(stored);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(calibration));
      } catch {
        // ignore storage errors
      }
    } else {
      const timeout = setTimeout(() => {
        const supabase = getBrowserClient();
        void supabase.auth.updateUser({ data: { calibration } });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [calibration, user]);

  function handleCapture() {
    setCaptureFlash(true);
    setTimeout(() => setCaptureFlash(false), 300);
  }

  return (
    <div
      className={`rounded-2xl bg-surface-container-low p-5 space-y-5 transition-all ${
        captureFlash ? "ring-2 ring-primary" : ""
      }`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">
          CALIBRATION CORE
        </p>
        <p className="text-sm text-secondary">Adjusting precision optics...</p>
      </div>

      {/* Focus Offset */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Focus Offset
          </label>
          <span className="font-headline text-sm font-bold text-primary">
            {calibration.focusOffset > 0 ? "+" : ""}
            {calibration.focusOffset.toFixed(2)}MM
          </span>
        </div>
        <input
          type="range"
          min="-2.5"
          max="2.5"
          step="0.01"
          value={calibration.focusOffset}
          onChange={(e) =>
            setCalibration({ focusOffset: parseFloat(e.target.value) })
          }
          style={{ accentColor: "#f97316" }}
          className="w-full"
          aria-label="Focus offset"
        />
      </div>

      {/* Exposure Bias */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Exposure Bias
          </label>
          <span className="font-headline text-sm font-bold text-primary">
            {calibration.exposureBias > 0 ? "+" : ""}
            {calibration.exposureBias.toFixed(1)} EV
          </span>
        </div>
        <input
          type="range"
          min="-3"
          max="3"
          step="0.1"
          value={calibration.exposureBias}
          onChange={(e) =>
            setCalibration({ exposureBias: parseFloat(e.target.value) })
          }
          style={{ accentColor: "#f97316" }}
          className="w-full"
          aria-label="Exposure bias"
        />
      </div>

      {/* Capture Rate */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface">
          Capture Rate
        </p>
        <div className="flex gap-2">
          {CAPTURE_RATES.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setCalibration({ captureRate: rate })}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                calibration.captureRate === rate
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {rate}S
            </button>
          ))}
        </div>
      </div>

      {/* Solar Intensity */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface">
          SOLAR INTENSITY
        </p>
        <p className="font-headline text-4xl font-bold text-on-surface">
          {intensity.toLocaleString()} W/m²
        </p>
        <div className="flex gap-1.5">
          {INTENSITY_SWATCHES.map((color) => (
            <div
              key={color}
              className="h-5 flex-1 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCalibration({ focusOffset: 0, exposureBias: 0 })}
          className="flex-1 rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
        >
          AUTO ALIGN
        </button>
        <button
          type="button"
          onClick={handleCapture}
          className="flex-1 rounded-xl bg-gradient-to-r from-primary to-orange-600 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          CAPTURE
        </button>
      </div>
    </div>
  );
}
