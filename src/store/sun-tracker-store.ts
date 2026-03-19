import { create } from "zustand";
import { computeSunData } from "@/lib/sun";
import type { SunTrackerState } from "@/types/sun";

function withSunData(
  lat: number,
  lng: number,
  dateTime: Date,
): ReturnType<typeof computeSunData> {
  return computeSunData(lat, lng, dateTime);
}

export const useSunTrackerStore = create<SunTrackerState>((set) => ({
  location: null,
  locationName: "",
  dateTime: new Date(),
  isAnimating: false,
  sunData: null,
  activeOverlays: new Set([
    "sun-position",
    "sunrise-line",
    "sunset-line",
    "shadow",
    "sun-path",
  ]),
  photographerMode: false,
  isMobile: false,

  setLocation: (lat, lng, name) => {
    set((state) => ({
      location: { lat, lng },
      locationName: name ?? state.locationName,
      sunData: withSunData(lat, lng, state.dateTime),
    }));
  },

  setDateTime: (dateTime) => {
    set((state) => {
      if (!state.location) {
        return {
          dateTime,
        };
      }

      return {
        dateTime,
        sunData: withSunData(state.location.lat, state.location.lng, dateTime),
      };
    });
  },

  setAnimating: (isAnimating) => {
    set(() => ({
      isAnimating,
    }));
  },

  toggleOverlay: (overlay) => {
    set((state) => {
      const nextOverlays = new Set(state.activeOverlays);

      if (nextOverlays.has(overlay)) {
        nextOverlays.delete(overlay);
      } else {
        nextOverlays.add(overlay);
      }

      return {
        activeOverlays: nextOverlays,
      };
    });
  },

  togglePhotographerMode: () => {
    set((state) => ({
      photographerMode: !state.photographerMode,
    }));
  },
}));