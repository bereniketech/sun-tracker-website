"use client";

import { useMemo } from "react";
import { computeSunData } from "@/lib/sun";
import type { Coordinates, SunData } from "@/types/sun";

interface WeeklyForecastProps {
  location: Coordinates;
  dateTime: Date;
}

interface ForecastRow {
  date: Date;
  sunData: SunData;
  score: number;
}

function formatTime(value: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatWindow(start: Date, end: Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

function windowDurationMs(start: Date, end: Date): number {
  return Math.max(0, end.getTime() - start.getTime());
}

function atNoon(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0,
  );
}

function plusDays(date: Date, days: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
}

export function WeeklyForecast({ location, dateTime }: WeeklyForecastProps) {
  const forecast = useMemo<Array<ForecastRow>>(() => {
    const start = atNoon(dateTime);

    return Array.from({ length: 7 }, (_, index) => {
      const date = plusDays(start, index);
      const sunData = computeSunData(location.lat, location.lng, date);

      const goldenDurationMs =
        windowDurationMs(sunData.goldenHour.start, sunData.goldenHour.end) +
        windowDurationMs(sunData.goldenHourEvening.start, sunData.goldenHourEvening.end);

      const blueDurationMs =
        windowDurationMs(sunData.blueHour.start, sunData.blueHour.end) +
        windowDurationMs(sunData.blueHourEvening.start, sunData.blueHourEvening.end);

      return {
        date,
        sunData,
        score: goldenDurationMs + blueDurationMs,
      };
    });
  }, [dateTime, location.lat, location.lng]);

  const recommendedKeys = useMemo(() => {
    const sorted = [...forecast].sort((a, b) => b.score - a.score).slice(0, 2);
    return new Set(sorted.map((entry) => entry.date.toDateString()));
  }, [forecast]);

  return (
    <article className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800">7-Day Lighting Forecast</p>
        <span className="text-[11px] text-slate-600">Top 2 days recommended</span>
      </div>

      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th scope="col" className="pb-1 pr-3 font-semibold">Date</th>
              <th scope="col" className="pb-1 pr-3 font-semibold">Golden (AM/PM)</th>
              <th scope="col" className="pb-1 pr-3 font-semibold">Blue (AM/PM)</th>
              <th scope="col" className="pb-1 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((entry) => {
              const isRecommended = recommendedKeys.has(entry.date.toDateString());

              return (
                <tr
                  key={entry.date.toISOString()}
                  className={isRecommended ? "bg-emerald-50" : "border-b border-slate-100"}
                >
                  <td className="py-1.5 pr-3 font-medium text-slate-900">
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    }).format(entry.date)}
                  </td>
                  <td className="py-1.5 pr-3 text-slate-700">
                    {formatWindow(entry.sunData.goldenHour.start, entry.sunData.goldenHour.end)} / {" "}
                    {formatWindow(entry.sunData.goldenHourEvening.start, entry.sunData.goldenHourEvening.end)}
                  </td>
                  <td className="py-1.5 pr-3 text-slate-700">
                    {formatWindow(entry.sunData.blueHour.start, entry.sunData.blueHour.end)} / {" "}
                    {formatWindow(entry.sunData.blueHourEvening.start, entry.sunData.blueHourEvening.end)}
                  </td>
                  <td className="py-1.5">
                    {isRecommended ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">
                        Recommended
                      </span>
                    ) : (
                      <span className="text-slate-500">Standard</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
