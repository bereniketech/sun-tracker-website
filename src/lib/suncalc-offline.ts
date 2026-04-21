import type { SunData } from '@/types/sun';
import { useSunTrackerStore } from '@/store/sun-tracker-store';

interface OfflineSunDataCache {
  sunData: SunData | null;
  timestamp: number;
  latitude: number;
  longitude: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = 'sun-tracker-offline-cache';

/**
 * Get the offline cache from localStorage
 */
function getOfflineCache(): OfflineSunDataCache | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as OfflineSunDataCache;
    const now = Date.now();

    // Check if cache is still valid
    if (now - parsed.timestamp > CACHE_DURATION) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Save the offline cache to localStorage
 */
function saveOfflineCache(
  sunData: SunData | null,
  latitude: number,
  longitude: number
): void {
  if (typeof window === 'undefined') return;

  try {
    const cache: OfflineSunDataCache = {
      sunData,
      timestamp: Date.now(),
      latitude,
      longitude,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save offline cache:', error);
  }
}

/**
 * Get cached sun data from store
 * Stores the current sun data in the Zustand store which can be
 * accessed by the offline page and other offline features
 */
export function cacheCurrentSunData(): void {
  if (typeof window === 'undefined') return;

  const state = useSunTrackerStore.getState();
  if (state.sunData && state.location) {
    saveOfflineCache(state.sunData, state.location.lat, state.location.lng);
  }
}

/**
 * Get cached sun data
 * Returns cached data if offline, null if online (real data should be fetched)
 * or if no cache is available
 */
export function getCachedSunData(): SunData | null {
  if (typeof window === 'undefined') return null;

  // If online, don't use cache
  if (navigator.onLine) {
    return null;
  }

  const cache = getOfflineCache();
  return cache?.sunData ?? null;
}

/**
 * Check if sun data should be cached
 * Call this after successfully fetching sun data to enable offline support
 */
export function enableOfflineSupport(
  sunData: SunData | null,
  latitude: number,
  longitude: number
): void {
  saveOfflineCache(sunData, latitude, longitude);
}

/**
 * Get the cached location
 * Useful for displaying where the cached data is from
 */
export function getCachedLocation(): { lat: number; lng: number } | null {
  if (typeof window === 'undefined') return null;

  const cache = getOfflineCache();
  if (!cache) return null;

  return {
    lat: cache.latitude,
    lng: cache.longitude,
  };
}

/**
 * Monitor online/offline status and cache sun data when connection changes
 * This should be called in a useEffect at the app level to ensure
 * data is cached before the user goes offline
 */
export function setupOfflineMonitor(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {
    cacheCurrentSunData();
  };

  const handleOffline = () => {
    cacheCurrentSunData();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Initial cache
  if (navigator.onLine) {
    cacheCurrentSunData();
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
