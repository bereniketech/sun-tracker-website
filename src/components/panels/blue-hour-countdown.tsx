"use client";

import { useEffect, useMemo, useState } from "react";
import type { SunData, TimeWindow } from "@/types/sun";

interface BlueHourCountdownProps {
  sunData: SunData;
}

interface CountdownState {
  status: "active" | "upcoming" | "ended";
  label: string;
  ms: number;
}

function formatDuration(ms: number): string {
  const safeSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function getCountdownState(now: Date, windows: Array<{ label: string; window: TimeWindow }>): CountdownState {
  for (const entry of windows) {
    if (now >= entry.window.start && now <= entry.window.end) {
      return {
        status: "active",
        label: entry.label,
        ms: entry.window.end.getTime() - now.getTime(),
      };
    }
  }

  const upcoming = windows
    .filter((entry) => entry.window.start.getTime() > now.getTime())
    .sort((a, b) => a.window.start.getTime() - b.window.start.getTime())[0];

  if (upcoming) {
    return {
      status: "upcoming",
      label: upcoming.label,
      ms: upcoming.window.start.getTime() - now.getTime(),
    };
  }

  return {
    status: "ended",
    label: "No more blue hour windows today",
    ms: 0,
  };
}

export function BlueHourCountdown({ sunData }: BlueHourCountdownProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const countdown = useMemo(() => {
    return getCountdownState(now, [
      { label: "Morning", window: sunData.blueHour },
      { label: "Evening", window: sunData.blueHourEvening },
    ]);
  }, [now, sunData.blueHour, sunData.blueHourEvening]);

  return (
    <article className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-900">Blue Hour</p>
        {countdown.status === "active" ? (
          <span className="rounded-full bg-sky-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-900">
            NOW
          </span>
        ) : null}
      </div>

      <p className="mt-1.5 text-sm font-semibold text-sky-950">{countdown.label}</p>
      <p className="text-sm text-sky-900">
        {countdown.status === "active" ? "Ends in" : countdown.status === "upcoming" ? "Starts in" : "Status"}: {" "}
        <span className="font-semibold">{countdown.status === "ended" ? "Complete" : formatDuration(countdown.ms)}</span>
      </p>
    </article>
  );
}
