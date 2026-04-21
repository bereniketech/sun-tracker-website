"use client";

import { Button } from '@/components/ui/button';

interface CompassPermissionPromptProps {
  onRequestPermission: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Permission prompt component for iOS 13+ devices.
 * Shows a button to request device orientation permission.
 * Called when permissionState === 'unknown' on iOS.
 */
export function CompassPermissionPrompt({
  onRequestPermission,
  isLoading = false,
}: CompassPermissionPromptProps) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p className="text-sm text-blue-900 mb-3">
        This device requires permission to access compass data. Enable device orientation to see live compass heading.
      </p>
      <Button
        onClick={onRequestPermission}
        disabled={isLoading}
        size="sm"
        variant="default"
        className="w-full"
      >
        {isLoading ? 'Requesting...' : 'Enable Compass'}
      </Button>
    </div>
  );
}
