"use client";

import { Circle, Marker, divIcon, type Marker as LeafletMarker } from "leaflet";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

interface AccuracyCircleProps {
  position: GeolocationPosition | null;
}

export function AccuracyCircle({ position }: AccuracyCircleProps) {
  const map = useMap();
  const circleRef = useRef<Circle | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (!position) {
      if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    const { latitude, longitude, accuracy } = position.coords;

    // Create or update accuracy circle
    if (circleRef.current) {
      circleRef.current.setLatLng([latitude, longitude]);
      circleRef.current.setRadius(accuracy);
    } else {
      circleRef.current = new Circle([latitude, longitude], {
        radius: accuracy,
        fillColor: "#3b82f6",
        fillOpacity: 0.1,
        color: "#1e40af",
        weight: 2,
        dashArray: "5, 5",
        lineCap: "round",
        lineJoin: "round",
      });
      circleRef.current.addTo(map);
    }

    // Create or update center marker
    if (!markerRef.current) {
      const icon = divIcon({
        className: "",
        html: '<div class="w-2 h-2 bg-blue-600 rounded-full border border-white shadow-lg"></div>',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      markerRef.current = new Marker([latitude, longitude], { icon });
      markerRef.current.addTo(map);
    } else {
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [position, map]);

  return null;
}
