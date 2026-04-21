'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    DeviceOrientationEvent?: typeof DeviceOrientationEvent;
  }
}

export type PermissionState = 'unknown' | 'granted' | 'denied';

export interface DeviceOrientationState {
  heading: number | null;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  supported: boolean;
  permissionState: PermissionState;
}

/**
 * Custom hook that uses the DeviceOrientationEvent API to track device heading.
 * On iOS 13+, requests explicit permission via requestPermission().
 * Falls back to webkitCompassHeading on older iOS versions.
 * Returns null on unsupported devices.
 *
 * This is a client-side only hook and will not work on the server.
 */
export function useDeviceOrientation(): DeviceOrientationState {
  const [state, setState] = useState<DeviceOrientationState>({
    heading: null,
    alpha: null,
    beta: null,
    gamma: null,
    supported: false,
    permissionState: 'unknown',
  });

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') {
      return;
    }

    // Feature detect: Check if DeviceOrientationEvent is available
    if (!('DeviceOrientationEvent' in window)) {
      setState((prev) => ({
        ...prev,
        supported: false,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      supported: true,
    }));

    // Check for iOS 13+ permission API
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const deviceOrientationEvent = DeviceOrientationEvent as {
      requestPermission?: () => Promise<string>;
    };
    const hasPermissionAPI =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof deviceOrientationEvent.requestPermission === 'function';

    let permissionGranted = true; // Assume granted on non-iOS or older iOS

    /**
     * Request permission on iOS 13+
     */
    const requestPermissionIfNeeded = async () => {
      if (!hasPermissionAPI) {
        setState((prev) => ({
          ...prev,
          permissionState: 'granted',
        }));
        return true;
      }

      try {
        const result = await deviceOrientationEvent.requestPermission?.();
        if (result === 'granted') {
          setState((prev) => ({
            ...prev,
            permissionState: 'granted',
          }));
          permissionGranted = true;
          return true;
        } else {
          setState((prev) => ({
            ...prev,
            permissionState: 'denied',
          }));
          permissionGranted = false;
          return false;
        }
      } catch (err) {
        // If permission request fails, assume denied
        console.error('Device orientation permission request failed:', err);
        setState((prev) => ({
          ...prev,
          permissionState: 'denied',
        }));
        permissionGranted = false;
        return false;
      }
    };

    /**
     * Handle deviceorientationabsolute event (preferred, absolute heading)
     */
    const handleAbsoluteOrientation = (event: DeviceOrientationEvent) => {
      if (!permissionGranted) return;

      const alpha = event.alpha ?? 0; // Z axis: 0 to 360
      const beta = event.beta ?? 0; // X axis: -180 to 180
      const gamma = event.gamma ?? 0; // Y axis: -90 to 90

      // Use alpha as the heading (compass direction)
      // alpha increases as device rotates clockwise when viewed from above
      const heading = alpha;

      setState((prev) => ({
        ...prev,
        heading,
        alpha,
        beta,
        gamma,
      }));
    };

    /**
     * Handle deviceorientation event (fallback for older devices)
     * On some older iOS devices, webkitCompassHeading contains the compass heading
     */
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!permissionGranted) return;

      const alpha = event.alpha ?? 0;
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      // Try webkitCompassHeading first (iOS fallback)
      const webkitEvent = event as { webkitCompassHeading?: number };
      const heading = webkitEvent.webkitCompassHeading ?? alpha;

      setState((prev) => ({
        ...prev,
        heading,
        alpha,
        beta,
        gamma,
      }));
    };

    // Initialize listener setup
    const setupListeners = async () => {
      // Request permission if needed
      if (isIOS && hasPermissionAPI) {
        const granted = await requestPermissionIfNeeded();
        if (!granted) {
          return;
        }
      } else {
        // Non-iOS or older iOS: assume permission granted
        setState((prev) => ({
          ...prev,
          permissionState: 'granted',
        }));
      }

      // Try absolute orientation first (preferred)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = typeof window !== 'undefined' ? window : null;
      if (w) {
        if ('ondeviceorientationabsolute' in w) {
          w.addEventListener('deviceorientationabsolute', handleAbsoluteOrientation);
        } else {
          // Fallback to regular deviceorientation
          w.addEventListener('deviceorientation', handleOrientation);
        }
      }
    };

    setupListeners();

    // Cleanup: Remove event listeners
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = typeof window !== 'undefined' ? window : null;
      if (w) {
        w.removeEventListener('deviceorientationabsolute', handleAbsoluteOrientation);
        w.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return state;
}
