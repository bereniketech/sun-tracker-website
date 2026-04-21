"use client";

import { MapPin } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { cn } from "@/lib/utils";

interface FollowMeButtonProps {
  onFollowMeStart?: () => void;
  onFollowMeStop?: () => void;
}

export function FollowMeButton({ onFollowMeStart, onFollowMeStop }: FollowMeButtonProps) {
  const followMeActive = useSunTrackerStore((state) => state.followMeActive);
  const setFollowMeActive = useSunTrackerStore((state) => state.setFollowMeActive);

  const { startWatching, stopWatching, error } = useGeolocation();

  const handleToggle = () => {
    if (followMeActive) {
      stopWatching();
      setFollowMeActive(false);
      onFollowMeStop?.();
    } else {
      startWatching();
      setFollowMeActive(true);
      onFollowMeStart?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        followMeActive
          ? "border-green-200 bg-green-50 text-green-900 shadow-md hover:bg-green-100"
          : "border-slate-200 bg-white text-slate-900 shadow hover:bg-slate-50",
        error && "border-red-200 bg-red-50 text-red-900",
      )}
      title={error ? "Geolocation error: permission denied or unavailable" : "Track your location"}
      aria-pressed={followMeActive}
      aria-label={followMeActive ? "Stop tracking location" : "Start tracking location"}
    >
      <MapPin
        className={cn(
          "h-4 w-4",
          followMeActive && "animate-pulse",
          error && "text-red-600",
        )}
      />
      <span>{followMeActive ? "Tracking" : "Follow Me"}</span>
    </button>
  );
}
