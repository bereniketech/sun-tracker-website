import { create } from "zustand";
import { computeSunData } from "@/lib/sun";
import { DEFAULT_MAP_LOCATION } from "@/components/map/location-utils";
import type { SunTrackerState } from "@/types/sun";

function withSunData(
  lat: number,
  lng: number,
  dateTime: Date,
): ReturnType<typeof computeSunData> {
  return computeSunData(lat, lng, dateTime);
}

const INITIAL_DATE = new Date();

export const useSunTrackerStore = create<SunTrackerState>((set) => ({
  location: { lat: DEFAULT_MAP_LOCATION.lat, lng: DEFAULT_MAP_LOCATION.lng },
  locationName: DEFAULT_MAP_LOCATION.name,
  dateTime: INITIAL_DATE,
  isAnimating: false,
  sunData: computeSunData(DEFAULT_MAP_LOCATION.lat, DEFAULT_MAP_LOCATION.lng, INITIAL_DATE),
  comparisonLocations: [],
  activeOverlays: new Set([
    "sun-position",
    "sunrise-line",
    "sunset-line",
    "shadow",
    "golden-hour-arc",
    "blue-hour-arc",
    "sun-path",
    "landmark-alignment",
  ]),
  selectedLandmark: null,
  photographerMode: false,
  isMobile: false,

  setLocation: (lat, lng, name) => {
    set((state) => ({
      location: { lat, lng },
      locationName: name ?? state.locationName,
      selectedLandmark: null,
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

  addComparisonLocation: (loc) => {
    set((state) => {
      if (state.comparisonLocations.length >= 3) {
        return state;
      }

      return {
        comparisonLocations: [...state.comparisonLocations, loc],
      };
    });
  },

  removeComparisonLocation: (index) => {
    set((state) => ({
      comparisonLocations: state.comparisonLocations.filter((_, i) => i !== index),
    }));
  },

  clearComparisonLocations: () => {
    set(() => ({
      comparisonLocations: [],
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

  setSelectedLandmark: (landmark) => {
    set((state) => {
      if (!landmark) {
        return {
          selectedLandmark: null,
        };
      }

      return {
        selectedLandmark: landmark,
        location: {
          lat: landmark.lat,
          lng: landmark.lng,
        },
        locationName: landmark.name,
        sunData: withSunData(landmark.lat, landmark.lng, state.dateTime),
      };
    });
  },

  togglePhotographerMode: () => {
    set((state) => ({
      photographerMode: !state.photographerMode,
    }));
  },
}));