import type { Landmark } from "@/types/sun";

export const LANDMARKS: Landmark[] = [
  {
    id: "manhattanhenge",
    name: "Manhattanhenge",
    lat: 40.758,
    lng: -73.9855,
    orientationAzimuth: 299,
  },
  {
    id: "stonehenge-axis",
    name: "Stonehenge Solstice Axis",
    lat: 51.1789,
    lng: -1.8262,
    orientationAzimuth: 49,
  },
  {
    id: "abu-simbel-axis",
    name: "Abu Simbel Sun Temple Axis",
    lat: 22.3372,
    lng: 31.6258,
    orientationAzimuth: 106,
  },
  {
    id: "north-axis-study",
    name: "North Axis Study",
    lat: 40.7128,
    lng: -74.006,
    orientationAzimuth: 0,
  },
];

export function getLandmarkById(id: string): Landmark | null {
  return LANDMARKS.find((landmark) => landmark.id === id) ?? null;
}