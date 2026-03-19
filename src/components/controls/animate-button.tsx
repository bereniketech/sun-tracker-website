"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const SPEED_OPTIONS = [1, 2, 5] as const;

export function AnimateButton() {
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const isAnimating = useSunTrackerStore((state) => state.isAnimating);
  const setAnimating = useSunTrackerStore((state) => state.setAnimating);
  const setDateTime = useSunTrackerStore((state) => state.setDateTime);

  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const dateTimeRef = useRef<Date>(dateTime);

  useEffect(() => {
    dateTimeRef.current = dateTime;
  }, [dateTime]);

  useEffect(() => {
    if (!isAnimating) {
      return;
    }

    let frameId = 0;
    let lastTick: number | null = null;
    let accumulatedMs = 0;

    const tick = (now: number): void => {
      if (lastTick === null) {
        lastTick = now;
      }

      const deltaMs = now - lastTick;
      lastTick = now;
      accumulatedMs += deltaMs;

      const minutesToAdvance = Math.floor((accumulatedMs / 1000) * speedMultiplier);

      if (minutesToAdvance > 0) {
        accumulatedMs -= (minutesToAdvance / speedMultiplier) * 1000;

        const current = dateTimeRef.current;
        const endOfDay = new Date(current);
        endOfDay.setHours(23, 59, 0, 0);

        const nextDateTime = new Date(current);
        nextDateTime.setMinutes(nextDateTime.getMinutes() + minutesToAdvance);

        if (nextDateTime.getTime() >= endOfDay.getTime()) {
          setDateTime(endOfDay);
          setAnimating(false);
          return;
        }

        setDateTime(nextDateTime);
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      if (typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isAnimating, setAnimating, setDateTime, speedMultiplier]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setAnimating(!isAnimating);
        }}
        className={`relative inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition ${
          isAnimating
            ? "bg-amber-500 text-slate-950 ring-2 ring-amber-300"
            : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
        aria-pressed={isAnimating}
        aria-label={isAnimating ? "Pause animation" : "Animate sun movement"}
      >
        {isAnimating ? (
          <>
            <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" aria-hidden="true" />
            <Pause className="h-4 w-4" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Animate
          </>
        )}
      </button>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <span className="sr-only">Animation speed</span>
        <select
          value={String(speedMultiplier)}
          onChange={(event) => {
            setSpeedMultiplier(Number(event.target.value));
          }}
          className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          aria-label="Animation speed"
        >
          {SPEED_OPTIONS.map((speed) => (
            <option key={speed} value={String(speed)}>
              {speed}x
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
