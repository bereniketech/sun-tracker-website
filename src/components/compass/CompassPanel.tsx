"use client";

import { useState } from 'react';
import { useSunTrackerStore } from '@/store/sun-tracker-store';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { CompassNeedle } from './CompassNeedle';
import { CompassPermissionPrompt } from './CompassPermissionPrompt';
import { Button } from '@/components/ui/button';
import { Lock, LockOpen } from 'lucide-react';
import { computeBearingToSun, cardinalDirection } from '@/lib/compass-utils';

/**
 * Compass panel that displays:
 * - Live compass needle that follows device orientation
 * - Permission prompt for iOS 13+
 * - Direction lock toggle
 * - Bearing to sun (angle difference between device heading and sun azimuth)
 *
 * Only visible on mobile breakpoints (hidden on lg: and above)
 */
export function CompassPanel() {
  const sunData = useSunTrackerStore((state) => state.sunData);
  const [directionLocked, setDirectionLocked] = useState(false);
  const [lockedHeading, setLockedHeading] = useState<number | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const orientation = useDeviceOrientation();

  // Use locked heading if direction lock is enabled, otherwise use current heading
  const displayHeading = directionLocked ? lockedHeading : orientation.heading;

  // Compute bearing to sun
  const bearingToSun = computeBearingToSun(sunData?.sunAzimuth ?? 0, displayHeading);

  // Handle direction lock toggle
  const handleToggleLock = () => {
    if (!directionLocked && orientation.heading !== null) {
      // Lock the current heading
      setLockedHeading(orientation.heading);
      setDirectionLocked(true);
    } else {
      // Unlock and continue following device
      setDirectionLocked(false);
      setLockedHeading(null);
    }
  };

  // Handle permission request (iOS 13+)
  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        'requestPermission' in DeviceOrientationEvent
      ) {
        const deviceOrientationEvent = DeviceOrientationEvent as {
          requestPermission?: () => Promise<string>;
        };
        const permission = await deviceOrientationEvent.requestPermission?.();
        if (permission === 'granted') {
          // Permission granted; the hook will handle event listener setup
          // Note: In a real app, you might want to trigger a re-initialization of the hook
        }
      }
    } catch (err) {
      console.error('Permission request failed:', err);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  // Not supported on this device
  if (!orientation.supported) {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 lg:hidden">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Compass</p>
        <p className="mt-2 text-sm text-slate-600">Not available on this device.</p>
      </section>
    );
  }

  // Show permission prompt on iOS 13+ (permissionState === 'unknown')
  if (orientation.permissionState === 'unknown') {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 lg:hidden">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">Compass</p>
        <CompassPermissionPrompt
          onRequestPermission={handleRequestPermission}
          isLoading={isRequestingPermission}
        />
      </section>
    );
  }

  // Permission denied
  if (orientation.permissionState === 'denied') {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-4 lg:hidden">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Compass</p>
        <p className="mt-2 text-sm text-red-700">
          Device orientation permission denied. Enable it in settings to use compass.
        </p>
      </section>
    );
  }

  // Main compass display
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:hidden">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Compass</p>
        <Button
          onClick={handleToggleLock}
          variant="outline"
          size="sm"
          title={directionLocked ? 'Unlock heading' : 'Lock heading'}
        >
          {directionLocked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <LockOpen className="h-4 w-4" />
          )}
        </Button>
      </div>

      <CompassNeedle heading={displayHeading} sunAzimuth={sunData?.sunAzimuth ?? 0} />

      {/* Heading and bearing display */}
      <div className="space-y-2 text-center">
        <div>
          <p className="text-xs text-slate-600">Current Heading</p>
          <p className="text-lg font-semibold text-slate-900">
            {displayHeading !== null ? `${Math.round(displayHeading)}°` : 'N/A'}
            {displayHeading !== null && ` ${cardinalDirection(displayHeading)}`}
          </p>
        </div>

        {bearingToSun !== null && sunData && (
          <div>
            <p className="text-xs text-slate-600">Bearing to Sun</p>
            <p className="text-lg font-semibold text-amber-600">
              {Math.round(bearingToSun)}° {cardinalDirection(bearingToSun)}
            </p>
          </div>
        )}
      </div>

      {directionLocked && lockedHeading !== null && (
        <div className="rounded-lg bg-blue-50 px-3 py-2 text-center text-xs text-blue-700">
          Heading locked at {Math.round(lockedHeading)}° ({cardinalDirection(lockedHeading)})
        </div>
      )}
    </section>
  );
}
