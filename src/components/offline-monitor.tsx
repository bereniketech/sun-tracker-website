'use client';

import { useEffect } from 'react';
import { setupOfflineMonitor } from '@/lib/suncalc-offline';

/**
 * OfflineMonitor - Sets up offline caching and monitoring
 * Must be rendered as a client component in the root layout to ensure
 * sun data is cached before the user goes offline
 */
export function OfflineMonitor() {
  useEffect(() => {
    const cleanup = setupOfflineMonitor();
    return cleanup;
  }, []);

  return null;
}
