import { useEffect, useRef, useState } from "react";

export interface GeolocationState {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  watching: boolean;
  startWatching: () => void;
  stopWatching: () => void;
}

export function useGeolocation(): GeolocationState {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [watching, setWatching] = useState(false);

  const watchIdRef = useRef<number | null>(null);

  const startWatching = async () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError);
      return;
    }

    setWatching(true);
    setError(null);

    // Check battery status to determine throttling strategy
    let options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 5000, // 5s default
      timeout: 10000,
    };

    try {
      if ("getBattery" in navigator) {
        const battery = await (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean }> }).getBattery();
        const isLowBattery = battery.level < 0.2 && !battery.charging;

        if (isLowBattery) {
          // Low battery mode: less frequent updates
          options = {
            enableHighAccuracy: false,
            maximumAge: 30000, // 30s
            timeout: 60000, // 60s
          };
        }
      }
    } catch {
      // Battery API not available, use default options
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition(pos);
        setError(null);
      },
      (err) => {
        setError(err);
        setWatching(false);
      },
      options,
    );

    watchIdRef.current = watchId;
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setWatching(false);
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return {
    position,
    error,
    watching,
    startWatching,
    stopWatching,
  };
}
