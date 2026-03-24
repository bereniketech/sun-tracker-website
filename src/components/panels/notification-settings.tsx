"use client";

import { useState } from "react";
import { useGoldenHourNotifications } from "@/hooks/use-golden-hour-notifications";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

export function NotificationSettings() {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const locationName = useSunTrackerStore((state) => state.locationName);
  const [isLoading, setIsLoading] = useState(false);

  const { permissionState, isScheduled, requestAndSchedule, cancel } = useGoldenHourNotifications(
    sunData,
    locationName,
  );

  if (permissionState === "unsupported") {
    return null;
  }

  const permissionColors = {
    default: "border-zinc-300 bg-zinc-50 text-zinc-700",
    granted: "border-green-300 bg-green-50 text-green-700",
    denied: "border-red-300 bg-red-50 text-red-700",
    unsupported: "",
  };

  const handleNotifyClick = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await requestAndSchedule();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableClick = (): void => {
    cancel();
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div aria-live="polite" aria-atomic="true" className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`rounded-lg border px-2 py-1 text-xs font-semibold uppercase ${permissionColors[permissionState]}`}>
            Notifications: {permissionState}
          </span>
        </div>

        {permissionState === "denied" && (
          <p className="text-xs text-red-700">
            To re-enable, allow notifications in your browser settings.
          </p>
        )}

        {isScheduled && (
          <p className="text-xs text-green-700">
            You&apos;ll be notified 30 min before golden hour. (Tab must stay open.)
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {permissionState !== "denied" && !isScheduled && (
            <button
              type="button"
              onClick={handleNotifyClick}
              disabled={isLoading}
              className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Requesting..." : "Notify me at golden hour"}
            </button>
          )}

          {isScheduled && (
            <button
              type="button"
              onClick={handleDisableClick}
              className="rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:bg-red-50"
            >
              Disable reminders
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
