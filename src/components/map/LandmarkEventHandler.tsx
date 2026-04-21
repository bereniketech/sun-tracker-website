"use client";

import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

interface LandmarkEventHandlerProps {
  onLongPress: (lat: number, lng: number) => void;
  onRightClick: (lat: number, lng: number) => void;
}

export function LandmarkEventHandler({
  onLongPress,
  onRightClick,
}: LandmarkEventHandlerProps): null {
  const map = useMap();
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressStartRef = useRef<{ lat: number; lng: number } | null>(null);

  // Handle right-click via useMapEvents
  useMapEvents({
    contextmenu: (event) => {
      event.originalEvent.preventDefault();
      onRightClick(event.latlng.lat, event.latlng.lng);
    },
  });

  // Handle long-press via direct DOM events
  useEffect(() => {
    const container = map.getContainer();

    const handleTouchStart = (event: TouchEvent) => {
      const point = map.mouseEventToLatLng(
        new MouseEvent("click", {
          clientX: event.touches[0].clientX,
          clientY: event.touches[0].clientY,
        }),
      );

      longPressStartRef.current = {
        lat: point.lat,
        lng: point.lng,
      };

      longPressTimeoutRef.current = setTimeout(() => {
        if (longPressStartRef.current) {
          onLongPress(longPressStartRef.current.lat, longPressStartRef.current.lng);
        }
      }, 600);
    };

    const handleTouchEnd = () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
      longPressStartRef.current = null;
    };

    const handleTouchMove = () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
      longPressStartRef.current = null;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [map, onLongPress]);

  return null;
}
