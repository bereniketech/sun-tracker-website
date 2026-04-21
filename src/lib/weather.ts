import type { WeatherData } from "@/types/weather";

const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,cloud_cover,precipitation,wind_speed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,cloud_cover_mean,weather_code",
    forecast_days: "7",
    timezone: "auto",
  });

  const url = `${OPEN_METEO_API}?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        cloudCover: data.current.cloud_cover,
        precipitation: data.current.precipitation,
        windSpeed: data.current.wind_speed_10m,
        time: data.current.time,
      },
      daily: data.daily.time.map(
        (
          date: string,
          index: number,
        ) => ({
          date,
          temperatureMax: data.daily.temperature_2m_max[index],
          temperatureMin: data.daily.temperature_2m_min[index],
          precipitationSum: data.daily.precipitation_sum[index],
          precipitationProbability:
            data.daily.precipitation_probability_max[index],
          cloudCoverMean: data.daily.cloud_cover_mean[index],
          weatherCode: data.daily.weather_code[index],
        }),
      ),
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
    throw new Error("Failed to fetch weather data: Unknown error");
  }
}
