"use client";

import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { ForecastCard } from "./forecast-card";
import { ForecastSkeleton } from "./forecast-skeleton";

export function ForecastWidget() {
  const weatherData = useSunTrackerStore((state) => state.weatherData);
  const weatherLoading = useSunTrackerStore((state) => state.weatherLoading);
  const weatherError = useSunTrackerStore((state) => state.weatherError);

  if (weatherLoading) {
    return <ForecastSkeleton />;
  }

  if (weatherError) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-700 dark:text-red-400">
          Failed to load weather: {weatherError}
        </p>
      </div>
    );
  }

  if (!weatherData || weatherData.daily.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        7-Day Forecast
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {weatherData.daily.map((day) => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
