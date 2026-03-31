"use client";

import { useId } from "react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

function toDateInputValue(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): { year: number; month: number; day: number } | null {
  const parts = value.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  return { year, month, day };
}

export function DatePicker() {
  const pickerId = useId();
  const dateTime = useSunTrackerStore((state) => state.dateTime);
  const setDateTime = useSunTrackerStore((state) => state.setDateTime);

  return (
    <div className="space-y-2">
      <label htmlFor={pickerId} className="text-sm font-medium text-slate-900">
        Date
      </label>
      <input
        id={pickerId}
        type="date"
        value={toDateInputValue(dateTime)}
        onChange={(event) => {
          const parsed = parseDateInput(event.target.value);

          if (!parsed) {
            return;
          }

          const nextDateTime = new Date(dateTime);
          nextDateTime.setFullYear(parsed.year, parsed.month - 1, parsed.day);
          setDateTime(nextDateTime);
        }}
        aria-label="Date picker"
        className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
      />
    </div>
  );
}
