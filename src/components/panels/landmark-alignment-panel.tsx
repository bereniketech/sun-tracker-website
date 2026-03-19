"use client";

import { useEffect, useMemo, useState } from "react";
import { findLandmarkAlignmentEvents } from "@/lib/landmark-alignment";
import { LANDMARKS, getLandmarkById } from "@/lib/landmarks";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { AlignmentEvent } from "@/types/sun";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const YEAR_WINDOW = 2;

interface CalendarMonth {
  label: string;
  cells: Array<Date | null>;
}

function sameDayKey(value: Date): string {
  return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
}

function formatClock(value: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatEventLabel(event: AlignmentEvent): string {
  const phaseLabel = event.matchType === "sunrise" ? "Sunrise" : "Sunset";
  return `${phaseLabel} ${formatClock(event.eventTime)} (${Math.round(event.sunAzimuth)}°)`;
}

function buildCalendarMonths(year: number): CalendarMonth[] {
  return Array.from({ length: 12 }, (_, month) => {
    const firstDay = new Date(year, month, 1);
    const leadingCells = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<Date | null> = [
      ...Array.from({ length: leadingCells }, () => null),
      ...Array.from({ length: daysInMonth }, (_, dayIndex) => new Date(year, month, dayIndex + 1)),
    ];

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return {
      label: new Intl.DateTimeFormat("en", { month: "long" }).format(firstDay),
      cells,
    };
  });
}

function yearOptions(centerYear: number): number[] {
  return Array.from({ length: YEAR_WINDOW * 2 + 1 }, (_, index) => centerYear - YEAR_WINDOW + index);
}

export function LandmarkAlignmentPanel() {
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const selectedLandmark = useSunTrackerStore((state) => state.selectedLandmark);
  const setSelectedLandmark = useSunTrackerStore((state) => state.setSelectedLandmark);

  const [selectedYear, setSelectedYear] = useState<number>(dateTime.getFullYear());

  useEffect(() => {
    setSelectedYear(dateTime.getFullYear());
  }, [dateTime]);

  const events = useMemo(() => {
    if (!selectedLandmark) {
      return [] as AlignmentEvent[];
    }

    return findLandmarkAlignmentEvents(selectedLandmark, selectedYear);
  }, [selectedLandmark, selectedYear]);

  const eventsByDay = useMemo(() => {
    const eventMap = new Map<string, AlignmentEvent[]>();

    for (const event of events) {
      const key = sameDayKey(event.eventTime);
      const entry = eventMap.get(key) ?? [];
      entry.push(event);
      eventMap.set(key, entry);
    }

    return eventMap;
  }, [events]);

  const months = useMemo(() => buildCalendarMonths(selectedYear), [selectedYear]);
  const years = useMemo(() => yearOptions(dateTime.getFullYear()), [dateTime]);

  return (
    <section className="rounded-xl border border-sky-200 bg-sky-50/60 p-3" aria-label="Landmark alignment panel">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-900">Landmark Alignment</p>
          <p className="mt-1 text-sm text-slate-700">
            Track sunrise and sunset dates that line up with a landmark&apos;s viewing axis.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            Landmark
            <select
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              value={selectedLandmark?.id ?? ""}
              onChange={(event) => {
                setSelectedLandmark(getLandmarkById(event.target.value));
              }}
              aria-label="Select a landmark"
            >
              <option value="">Choose a landmark</option>
              {LANDMARKS.map((landmark) => (
                <option key={landmark.id} value={landmark.id}>
                  {landmark.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            Year
            <select
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              value={selectedYear}
              onChange={(event) => {
                setSelectedYear(Number(event.target.value));
              }}
              aria-label="Select alignment year"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {selectedLandmark ? (
        <div className="mt-3 rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{selectedLandmark.name}</p>
          <p className="mt-1">
            Alignment axis {Math.round(selectedLandmark.orientationAzimuth)}° / {Math.round((selectedLandmark.orientationAzimuth + 180) % 360)}°
          </p>
          <p className="text-xs text-slate-500">
            Selecting a landmark recenters the map and turns the overlay into a sight line for that axis.
          </p>
        </div>
      ) : (
        <p className="mt-3 rounded-lg border border-dashed border-sky-300 bg-white px-3 py-2 text-sm text-slate-600">
          Select a landmark to calculate alignment dates and draw its axis on the map.
        </p>
      )}

      {selectedLandmark && events.length === 0 && (
        <p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          No alignments found for {selectedLandmark.name} in {selectedYear}.
        </p>
      )}

      {selectedLandmark && events.length > 0 && (
        <>
          <div className="mt-3 grid gap-2 xl:grid-cols-2">
            {months.map((month) => (
              <article key={month.label} className="rounded-lg border border-slate-200 bg-white p-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">{month.label}</p>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-slate-400">
                  {WEEKDAY_LABELS.map((label, index) => (
                    <span key={`${month.label}-${index}`}>{label}</span>
                  ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1">
                  {month.cells.map((cell, index) => {
                    if (!cell) {
                      return <div key={`${month.label}-empty-${index}`} className="h-10 rounded-md bg-slate-50" />;
                    }

                    const dayEvents = eventsByDay.get(sameDayKey(cell)) ?? [];

                    return (
                      <div
                        key={cell.toISOString()}
                        className={`flex h-10 flex-col justify-between rounded-md border px-1 py-1 text-left ${
                          dayEvents.length > 0
                            ? "border-amber-300 bg-amber-50 text-amber-900"
                            : "border-slate-100 bg-white text-slate-400"
                        }`}
                        title={dayEvents.map((entry) => formatEventLabel(entry)).join(" | ")}
                      >
                        <span className="text-[10px] font-semibold">{cell.getDate()}</span>
                        {dayEvents.length > 0 ? (
                          <span className="text-[9px] font-semibold">
                            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                          </span>
                        ) : (
                          <span className="text-[9px]">&nbsp;</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <article className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800">Alignment Dates</p>
              <span className="text-[11px] text-slate-500">{events.length} events this year</span>
            </div>

            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {events.map((event) => (
                <li key={event.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="font-semibold text-slate-900">
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(event.eventTime)}
                  </span>{" "}
                  <span>
                    {event.matchType === "sunrise" ? "Sunrise" : "Sunset"} at {formatClock(event.eventTime)}
                    , sun azimuth {Math.round(event.sunAzimuth)}°.
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </>
      )}
    </section>
  );
}