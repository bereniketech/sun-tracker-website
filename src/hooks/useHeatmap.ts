"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { computeHeatmapPoints } from "@/lib/heatmap";
import type { HeatmapPoint } from "@/types/heatmap";

interface CacheEntry {
  points: HeatmapPoint[];
  timestamp: number;
}

const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hour

/**
 * Hook for computing sun heatmap points using a Web Worker
 * Caches results by location to avoid recomputation
 */
export function useHeatmap() {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const pendingRequestRef = useRef<{ lat: number; lng: number } | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    try {
      workerRef.current = new Worker(new URL("../../public/workers/heatmap.worker.ts", import.meta.url), {
        type: "module",
      });

      workerRef.current.onmessage = (event) => {
        const { type, points: workerPoints, latitude, longitude } = event.data;

        if (type === "complete") {
          // Cache the result
          const cacheKey = `${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
          cacheRef.current.set(cacheKey, {
            points: workerPoints,
            timestamp: Date.now(),
          });

          setPoints(workerPoints);
          setLoading(false);
          setError(null);
        }
      };

      workerRef.current.onerror = (error) => {
        console.error("Heatmap worker error:", error);
        setError("Failed to compute heatmap");
        setLoading(false);
      };
    } catch (err) {
      console.error("Failed to initialize heatmap worker:", err);
      setError("Failed to initialize heatmap worker");
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const compute = useCallback(
    (lat: number, lng: number) => {
      const cacheKey = `${lat.toFixed(4)}-${lng.toFixed(4)}`;

      // Check cache
      const cached = cacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        setPoints(cached.points);
        setLoading(false);
        return;
      }

      // Store pending request
      pendingRequestRef.current = { lat, lng };

      // Use Web Worker if available, fallback to main thread
      if (workerRef.current) {
        setLoading(true);
        workerRef.current.postMessage({
          type: "compute",
          latitude: lat,
          longitude: lng,
        });
      } else {
        // Fallback: compute on main thread
        setLoading(true);
        try {
          const result = computeHeatmapPoints(lat, lng);
          setPoints(result);
          cacheRef.current.set(cacheKey, {
            points: result,
            timestamp: Date.now(),
          });
          setError(null);
        } catch (err) {
          console.error("Failed to compute heatmap:", err);
          setError("Failed to compute heatmap");
        } finally {
          setLoading(false);
        }
      }
    },
    []
  );

  const clear = useCallback(() => {
    setPoints([]);
    setLoading(false);
    setError(null);
  }, []);

  return {
    points,
    loading,
    error,
    compute,
    clear,
  };
}
