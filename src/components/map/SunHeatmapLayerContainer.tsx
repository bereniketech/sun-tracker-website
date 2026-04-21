"use client";

import { useEffect } from "react";
import { useHeatmap } from "@/hooks/useHeatmap";
import { SunHeatmapLayer } from "@/components/map/SunHeatmapLayer";
import type { Coordinates } from "@/types/sun";

interface SunHeatmapLayerContainerProps {
  location: Coordinates;
  visible: boolean;
}

/**
 * Container component that manages heatmap computation and rendering
 * Triggers computation when location changes and heatmap becomes visible
 */
export function SunHeatmapLayerContainer({
  location,
  visible,
}: SunHeatmapLayerContainerProps) {
  const { points, loading, compute } = useHeatmap();

  // Compute heatmap when location changes and overlay is visible
  useEffect(() => {
    if (visible) {
      compute(location.lat, location.lng);
    }
  }, [location.lat, location.lng, visible, compute]);

  if (!visible) {
    return null;
  }

  return (
    <>
      {loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-[1.5rem] z-[500]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            <p className="text-xs font-medium text-slate-700">Computing heatmap...</p>
          </div>
        </div>
      )}
      <SunHeatmapLayer points={points} visible={visible && !loading} />
    </>
  );
}
