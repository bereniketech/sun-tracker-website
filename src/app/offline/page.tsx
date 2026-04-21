'use client';

import { useEffect, useState } from 'react';
import { useSunTrackerStore } from '@/store/sun-tracker-store';
import { Cloud, Wifi, WifiOff } from 'lucide-react';

interface CachedSunData {
  date: string;
  latitude: number;
  longitude: number;
  sunrise: string;
  sunset: string;
  azimuth: number;
  altitude: number;
  location: string;
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedData, setCachedData] = useState<CachedSunData | null>(null);
  const sunData = useSunTrackerStore((state) => state.sunData);
  const location = useSunTrackerStore((state) => state.location);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    // Monitor online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached sun data from store
    if (sunData && location) {
      setCachedData({
        date: new Date().toLocaleDateString(),
        latitude: location.lat,
        longitude: location.lng,
        sunrise: sunData.sunrise.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        sunset: sunData.sunset.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        azimuth: sunData.sunAzimuth,
        altitude: sunData.sunElevation,
        location: useSunTrackerStore.getState().locationName || 'Unknown Location',
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [sunData, location]);

  if (isOnline) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-surface to-surface-variant p-4">
        <div className="text-center max-w-md">
          <Wifi className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <h1 className="text-2xl font-bold mb-2">Back Online</h1>
          <p className="text-on-surface-variant">
            Your connection has been restored. The app is now fully functional.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-hover transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-surface to-surface-variant p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <WifiOff className="w-16 h-16 mx-auto mb-4 text-warning" />
          <h1 className="text-3xl font-bold mb-2">You&apos;re Offline</h1>
          <p className="text-on-surface-variant">
            Showing cached sun data. Please reconnect to the internet for real-time data.
          </p>
        </div>

        {cachedData ? (
          <div className="bg-surface-variant rounded-2xl p-6 space-y-4 border border-outline">
            <div className="border-b border-outline pb-4">
              <h2 className="text-lg font-semibold mb-2">Last Cached Data</h2>
              <p className="text-sm text-on-surface-variant">{cachedData.location}</p>
              <p className="text-xs text-on-surface-variant mt-1">{cachedData.date}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4">
                <p className="text-xs text-on-surface-variant mb-1">Sunrise</p>
                <p className="text-lg font-semibold text-on-surface">{cachedData.sunrise}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-xs text-on-surface-variant mb-1">Sunset</p>
                <p className="text-lg font-semibold text-on-surface">{cachedData.sunset}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-xs text-on-surface-variant mb-1">Azimuth</p>
                <p className="text-lg font-semibold text-on-surface">{cachedData.azimuth.toFixed(1)}°</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-xs text-on-surface-variant mb-1">Altitude</p>
                <p className="text-lg font-semibold text-on-surface">{cachedData.altitude.toFixed(1)}°</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <Cloud className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Offline Mode
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                    Showing cached sun position data. Please reconnect for real-time calculations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-variant rounded-2xl p-6 text-center border border-outline">
            <Cloud className="w-12 h-12 mx-auto mb-4 text-on-surface-variant opacity-50" />
            <p className="text-on-surface-variant mb-4">
              No cached sun data available. Please reconnect to the internet.
            </p>
          </div>
        )}

        <button
          onClick={() => {
            // Try to refresh page when connection is restored
            window.location.href = '/';
          }}
          className="w-full mt-6 px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          Check Connection
        </button>
      </div>
    </div>
  );
}
