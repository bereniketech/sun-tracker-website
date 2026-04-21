"use client";

import type { DailyForecast } from "@/types/weather";
import { getWeatherIcon, getWeatherDescription } from "@/lib/weather-utils";

interface ForecastCardProps {
  day: DailyForecast;
}

export function ForecastCard({ day }: ForecastCardProps) {
  const date = new Date(day.date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = date.toLocaleDateString("en-US", { day: "numeric" });

  const icon = getWeatherIcon(day.weatherCode);
  const description = getWeatherDescription(day.weatherCode);

  return (
    <div className="flex min-w-max flex-col items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
        {dayName}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">{dayNum}</p>

      <div className="my-2 text-2xl">{icon}</div>

      <p className="text-center text-xs text-gray-600 dark:text-gray-400">
        {description}
      </p>

      <div className="mt-2 space-y-1 text-center text-xs">
        <div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {Math.round(day.temperatureMax)}°
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            {" "}
            {Math.round(day.temperatureMin)}°
          </span>
        </div>
        <div className="text-blue-600 dark:text-blue-400">
          💧 {Math.round(day.precipitationProbability)}%
        </div>
      </div>
    </div>
  );
}
