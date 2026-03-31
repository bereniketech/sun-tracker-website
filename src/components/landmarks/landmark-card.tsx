"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import type { Landmark } from "@/types/sun";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { getStaticImageUrl } from "@/lib/landmark-static-images";

const MAX_RETRIES = 5;

interface LandmarkCardProps {
  landmark: Landmark & {
    location?: string;
    imageGradient?: string;
    imageUrl?: string;
    currentAzimuth?: number;
    currentAltitude?: number;
  };
  /** Stagger image loading to avoid Wikimedia 429 rate limits (ms). */
  loadDelay?: number;
}

export function LandmarkCard({ landmark, loadDelay = 0 }: LandmarkCardProps) {
  const { selectedLandmark, setSelectedLandmark } = useSunTrackerStore();
  const isSelected = selectedLandmark?.id === landmark.id;
  const [ready, setReady] = useState(loadDelay === 0);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    loadDelay === 0 ? landmark.imageUrl : undefined,
  );
  const [imgError, setImgError] = useState(false);
  const retryCount = useRef(0);

  // Stagger image loading to spread requests over time
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => {
      setCurrentSrc(landmark.imageUrl);
      setReady(true);
    }, loadDelay);
    return () => clearTimeout(timer);
  }, [loadDelay, ready, landmark.imageUrl]);

  const handleImageError = useCallback(() => {
    // Retry with exponential backoff (Wikimedia returns 429 on concurrent requests)
    if (retryCount.current < MAX_RETRIES) {
      retryCount.current += 1;
      const delay = 1500 * Math.pow(2, retryCount.current) + Math.random() * 1000;
      setTimeout(() => {
        // Append cache-buster to force browser to retry the request
        const base = landmark.imageUrl ?? "";
        const sep = base.includes("?") ? "&" : "?";
        setCurrentSrc(`${base}${sep}_r=${retryCount.current}`);
      }, delay);
      return;
    }

    // After retries exhausted, try static fallback URL
    const fallback = getStaticImageUrl(landmark.id);
    if (fallback && fallback !== currentSrc) {
      retryCount.current = 0;
      setCurrentSrc(fallback);
    } else {
      setImgError(true);
    }
  }, [landmark.id, landmark.imageUrl, currentSrc]);

  const imageGradient = landmark.imageGradient || "from-slate-700 to-slate-900";
  const showImage = Boolean(currentSrc) && !imgError;

  return (
    <div
      onClick={() => setSelectedLandmark(landmark)}
      className="cursor-pointer rounded-2xl overflow-hidden bg-surface-container-lowest shadow-[0_4px_24px_rgba(11,28,48,0.06)] hover:shadow-[0_8px_32px_rgba(11,28,48,0.12)] transition-shadow duration-300"
    >
      {/* Image area with gradient fallback */}
      <div className={`h-48 bg-gradient-to-br ${imageGradient} relative overflow-hidden`}>
        {showImage && (
          <Image
            src={currentSrc!}
            alt={landmark.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top"
            loading="lazy"
            onError={handleImageError}
          />
        )}
        {/* Darkening gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Location badge - top left */}
        {landmark.location && (
          <div className="absolute top-3 left-3 text-xs uppercase tracking-wider text-white/80 font-medium">
            {landmark.location}
          </div>
        )}

        {/* Landmark name - bottom left */}
        <div className="absolute bottom-3 left-3 font-headline text-xl text-white font-bold">
          {landmark.name}
        </div>

        {/* LIVE TRACKING badge - bottom right when selected */}
        {isSelected && (
          <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            LIVE TRACKING
          </div>
        )}
      </div>

      {/* Data row below image */}
      <div className="px-4 pt-4 pb-3 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Azimuth
          </div>
          <div className="font-headline text-sm font-semibold text-foreground">
            {landmark.currentAzimuth?.toFixed(1)}°
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Elevation
          </div>
          <div className="font-headline text-sm font-semibold text-foreground">
            {landmark.currentAltitude?.toFixed(1)}°
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Status
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            {landmark.currentAltitude !== undefined && landmark.currentAltitude > 0
              ? "Visible"
              : "Below"}
          </div>
        </div>
      </div>

    </div>
  );
}
