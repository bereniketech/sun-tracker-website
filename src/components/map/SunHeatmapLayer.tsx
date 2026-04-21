"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { HeatmapPoint } from "@/types/heatmap";

interface SunHeatmapLayerProps {
  points: HeatmapPoint[];
  visible: boolean;
}

/**
 * Leaflet layer component for sun position frequency density heatmap
 * Uses leaflet.heat plugin to render a heat layer of sun positions
 */
export function SunHeatmapLayer({ points, visible }: SunHeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !visible) {
      return;
    }

    if (points.length === 0) {
      return;
    }

    // Create heat layer with custom options
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.2,
      gradient: {
        0.0: "#0000ff",
        0.25: "#00ffff",
        0.5: "#00ff00",
        0.75: "#ffff00",
        1.0: "#ff0000",
      },
    });

    heatLayer.addTo(map);

    // Cleanup on unmount or when visibility changes
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, visible]);

  return null;
}
