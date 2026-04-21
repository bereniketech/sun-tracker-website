import SunCalc from "suncalc";
import type { HeatmapPoint } from "@/types/heatmap";

const DAYS_PER_YEAR = 365;
const HOURS_PER_DAY = 24;
const YEAR = 2025;

interface HeatmapWorkerMessage {
  type: "compute";
  latitude: number;
  longitude: number;
}

interface HeatmapWorkerResult {
  type: "complete";
  points: HeatmapPoint[];
  latitude: number;
  longitude: number;
}

function computeHeatmapPoints(lat: number, lng: number): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];

  // Iterate through each day of 2025
  for (let dayOfYear = 1; dayOfYear <= DAYS_PER_YEAR; dayOfYear++) {
    const date = new Date(`${YEAR}-01-01T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + dayOfYear - 1);

    // Sample every hour of the day
    for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
      const sampleDate = new Date(date);
      sampleDate.setUTCHours(hour, 0, 0, 0);

      const position = SunCalc.getPosition(sampleDate, lat, lng);
      const altitude = position.altitude;
      const azimuth = position.azimuth;

      // Skip if sun is below horizon
      if (altitude <= 0) {
        continue;
      }

      // Project azimuth/elevation to local horizon plane
      const altitudeDegrees = (altitude * 180) / Math.PI;

      // Convert to radians for trigonometry
      const azimuthRad = azimuth;

      // Project point: offset from center based on azimuth and altitude
      const offsetDistance = (altitudeDegrees * 0.01) / 111; // Convert to approximate degrees
      const pointLat = lat + Math.cos(azimuthRad) * offsetDistance;
      const pointLng = lng + Math.sin(azimuthRad) * offsetDistance;

      // Normalize intensity to 0-1 range (altitude goes from 0 to π/2 radians)
      const intensity = altitude / (Math.PI / 2);

      points.push([pointLat, pointLng, intensity]);
    }
  }

  return points;
}

// Listen for messages from the main thread
self.onmessage = (event: MessageEvent<HeatmapWorkerMessage>) => {
  const { type, latitude, longitude } = event.data;

  if (type === "compute") {
    const points = computeHeatmapPoints(latitude, longitude);

    const result: HeatmapWorkerResult = {
      type: "complete",
      points,
      latitude,
      longitude,
    };

    self.postMessage(result);
  }
};
