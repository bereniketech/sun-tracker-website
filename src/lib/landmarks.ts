import type { Landmark } from "@/types/sun";

export const LANDMARKS: Landmark[] = [
  {
    id: "manhattanhenge",
    name: "Manhattanhenge",
    lat: 40.758,
    lng: -73.9855,
    orientationAzimuth: 299,
    location: "New York, USA",
    category: "technical",
    imageGradient: "from-slate-700 to-blue-900",
  },
  {
    id: "stonehenge-axis",
    name: "Stonehenge Solstice Axis",
    lat: 51.1789,
    lng: -1.8262,
    orientationAzimuth: 49,
    location: "Wiltshire, UK",
    category: "historic",
    imageGradient: "from-amber-900 to-stone-700",
  },
  {
    id: "abu-simbel-axis",
    name: "Abu Simbel Sun Temple Axis",
    lat: 22.3372,
    lng: 31.6258,
    orientationAzimuth: 106,
    location: "Nubia, Egypt",
    category: "historic",
    imageGradient: "from-orange-900 to-amber-700",
  },
  {
    id: "north-axis-study",
    name: "North Axis Study",
    lat: 40.7128,
    lng: -74.006,
    orientationAzimuth: 0,
    location: "New York, USA",
    category: "technical",
    imageGradient: "from-slate-600 to-slate-800",
  },
  {
    id: "stonehenge",
    name: "Stonehenge",
    lat: 51.1789,
    lng: -1.8262,
    orientationAzimuth: 49,
    location: "Wiltshire, UK",
    category: "historic",
    imageGradient: "from-amber-900 to-stone-700",
  },
  {
    id: "giza-pyramids",
    name: "Giza Pyramids",
    lat: 29.9792,
    lng: 31.1342,
    orientationAzimuth: 100,
    location: "Giza, Egypt",
    category: "historic",
    imageGradient: "from-yellow-800 to-amber-600",
  },
  {
    id: "chichen-itza",
    name: "Chichén Itzá",
    lat: 20.6843,
    lng: -88.5678,
    orientationAzimuth: 66,
    location: "Yucatán, Mexico",
    category: "historic",
    imageGradient: "from-green-900 to-emerald-700",
  },
];

export function getLandmarkById(id: string): Landmark | null {
  return LANDMARKS.find((landmark) => landmark.id === id) ?? null;
}