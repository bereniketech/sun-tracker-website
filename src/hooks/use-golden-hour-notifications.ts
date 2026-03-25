"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SunData } from "@/types/sun";

export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported";

export interface UseGoldenHourNotificationsReturn {
  permissionState: NotificationPermissionState;
  isScheduled: boolean;
  requestAndSchedule: () => Promise<void>;
  cancel: () => void;
}

export function useGoldenHourNotifications(
  sunData: SunData | null,
  locationName: string
): UseGoldenHourNotificationsReturn {
  const [permissionState, setPermissionState] =
    useState<NotificationPermissionState>("unsupported");
  const [isScheduled, setIsScheduled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Feature detection and permission state initialization
  useEffect(() => {
    const isSupported = typeof window !== "undefined" && "Notification" in window;

    if (!isSupported) {
      setPermissionState("unsupported");
      return;
    }

    // Set the current permission state
    const currentPermission =
      (window.Notification.permission as NotificationPermissionState) || "default";
    setPermissionState(currentPermission);
  }, []);

  const fireNotification = useCallback(() => {
    if (!("Notification" in window)) {
      return;
    }

    const truncatedName = locationName.slice(0, 100);
    new window.Notification("Golden Hour Starting Soon", {
      body: `Golden hour starts in 30 minutes at ${truncatedName}. Open the tracker.`,
    });
    setIsScheduled(false);
  }, [locationName]);

  // Calculate next golden hour event that is > 30 minutes away
  const scheduleNext = useCallback(() => {
    if (!sunData || !("Notification" in window)) {
      setIsScheduled(false);
      return;
    }

    const now = Date.now();
    const thirtyMinutesMs = 30 * 60 * 1000;
    const alertTime = now + thirtyMinutesMs;

    // Find the next golden hour event (morning or evening) that starts after alertTime
    const morningStart = sunData.goldenHour.start.getTime();
    const eveningStart = sunData.goldenHourEvening.start.getTime();

    let nextEventStart: number | null = null;

    // Check morning golden hour
    if (morningStart > alertTime) {
      nextEventStart = morningStart;
    }

    // Check evening golden hour
    if (eveningStart > alertTime) {
      if (nextEventStart === null || eveningStart < nextEventStart) {
        nextEventStart = eveningStart;
      }
    }

    // If no future event found (both already happened or will happen within 30 min), don't schedule
    if (nextEventStart === null) {
      setIsScheduled(false);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Calculate milliseconds until we should fire the alert (30 min before the event)
    const fireTime = nextEventStart - thirtyMinutesMs;
    const msUntilAlert = fireTime - now;

    // Clear any existing timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Only schedule if timeframe is positive
    if (msUntilAlert > 0) {
      timerRef.current = setTimeout(() => {
        fireNotification();
      }, msUntilAlert);
      setIsScheduled(true);
    } else {
      setIsScheduled(false);
    }
  }, [fireNotification, sunData]);

  const requestAndSchedule = async () => {
    const isSupported = typeof window !== "undefined" && "Notification" in window;

    if (!isSupported) {
      setPermissionState("unsupported");
      return;
    }

    try {
      const result = await window.Notification.requestPermission();
      setPermissionState(result as NotificationPermissionState);

      if (result === "granted") {
        scheduleNext();
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    }
  };

  const cancel = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsScheduled(false);
  };

  // Schedule on sunData or locationName change if already scheduled
  useEffect(() => {
    if (isScheduled && permissionState === "granted") {
      scheduleNext();
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isScheduled, permissionState, scheduleNext]);

  return {
    permissionState,
    isScheduled,
    requestAndSchedule,
    cancel,
  };
}
