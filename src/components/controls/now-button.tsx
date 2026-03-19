"use client";

import { useSunTrackerStore } from "@/store/sun-tracker-store";

export function NowButton() {
  const setAnimating = useSunTrackerStore((state) => state.setAnimating);
  const setDateTime = useSunTrackerStore((state) => state.setDateTime);

  return (
    <button
      type="button"
      onClick={() => {
        setAnimating(false);
        setDateTime(new Date());
      }}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
    >
      Now
    </button>
  );
}
