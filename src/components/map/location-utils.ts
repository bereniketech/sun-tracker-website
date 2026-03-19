import type { Coordinates } from "@/types/sun";

export interface NamedCoordinates extends Coordinates {
  name: string;
}

export const DEFAULT_MAP_LOCATION: NamedCoordinates = {
  lat: 40.7128,
  lng: -74.006,
  name: "New York City",
};

function formatCoordinate(value: number, positiveLabel: string, negativeLabel: string): string {
  const label = value >= 0 ? positiveLabel : negativeLabel;
  return `${Math.abs(value).toFixed(4)}° ${label}`;
}

export function formatCoordinatePair(lat: number, lng: number): string {
  return `${formatCoordinate(lat, "N", "S")}, ${formatCoordinate(lng, "E", "W")}`;
}

export function formatPinnedLocationName(lat: number, lng: number): string {
  return `Pinned location ${formatCoordinatePair(lat, lng)}`;
}