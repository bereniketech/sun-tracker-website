"use client";

import { useEffect, useRef } from "react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const DEBOUNCE_MS = 1000;

export function useWeatherFetch() {
  const location = useSunTrackerStore((state) => state.location);
  const fetchWeatherForLocation = useSunTrackerStore(
    (state) => state.fetchWeatherForLocation,
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      void fetchWeatherForLocation(location.lat, location.lng);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [location.lat, location.lng, fetchWeatherForLocation]);
}
