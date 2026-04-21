// WMO Weather interpretation codes
// https://www.open-meteo.com/en/docs

export function getWeatherIcon(code: number): string {
  // Clear sky
  if (code === 0) return "☀️";
  // Mainly clear
  if (code === 1 || code === 2) return "🌤️";
  // Overcast
  if (code === 3) return "☁️";
  // Foggy
  if (code === 45 || code === 48) return "🌫️";
  // Drizzle
  if (code >= 51 && code <= 55) return "🌦️";
  // Freezing drizzle
  if (code >= 56 && code <= 57) return "🧊";
  // Rain
  if (code >= 61 && code <= 67) return "🌧️";
  // Snow
  if (code >= 71 && code <= 77) return "❄️";
  // Rain and snow
  if (code >= 80 && code <= 82) return "🌨️";
  // Showers
  if (code >= 85 && code <= 86) return "🌧️";
  // Thunderstorm
  if (code >= 80 && code <= 99) return "⛈️";

  return "🌤️"; // Default
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45) return "Foggy";
  if (code === 48) return "Freezing Fog";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Heavy Showers";
  if (code >= 80 && code <= 99) return "Thunderstorm";

  return "Unknown";
}
