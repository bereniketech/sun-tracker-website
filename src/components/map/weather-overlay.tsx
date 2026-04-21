import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

export function WeatherOverlay() {
  const map = useMap();
  const weatherData = useSunTrackerStore((state) => state.weatherData);
  const activeOverlays = useSunTrackerStore((state) => state.activeOverlays);

  useEffect(() => {
    if (!map || !weatherData || !activeOverlays.has("weather")) {
      return;
    }

    const cloudCover = weatherData.current.cloudCover;

    // Color gradient based on cloud cover: clear (yellow) to dark (grey)
    const getColorForCloudCover = (cloudPercentage: number): string => {
      if (cloudPercentage < 20) return "#FFD700"; // Gold
      if (cloudPercentage < 40) return "#FFA500"; // Orange
      if (cloudPercentage < 60) return "#A9A9A9"; // Dark Gray
      if (cloudPercentage < 80) return "#696969"; // Dim Gray
      return "#2F4F4F"; // Dark Slate Gray
    };

    const color = getColorForCloudCover(cloudCover);
    const opacity = 0.4;

    // Create a circle marker at the center of the location with radius ~5000m
    const circle = L.circle(
      [weatherData.latitude, weatherData.longitude],
      {
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        radius: 5000, // 5km radius
        weight: 2,
      },
    ).addTo(map);

    // Add popup with weather info
    circle.bindPopup(
      `<div class="font-semibold">Cloud Cover: ${cloudCover}%</div>
       <div>Precipitation: ${weatherData.current.precipitation}mm</div>
       <div>Wind Speed: ${weatherData.current.windSpeed}km/h</div>`,
    );

    return () => {
      map.removeLayer(circle);
    };
  }, [map, weatherData, activeOverlays]);

  return null;
}
