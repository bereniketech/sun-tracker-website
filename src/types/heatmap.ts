/**
 * Heatmap point representation for sun position frequency density
 * [latitude, longitude, intensity]
 */
export type HeatmapPoint = [lat: number, lng: number, intensity: number];

export interface HeatmapResult {
  points: HeatmapPoint[];
  latitude: number;
  longitude: number;
  generatedAt: number;
}
