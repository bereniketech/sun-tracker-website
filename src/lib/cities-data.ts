import type { CitySeed } from "@/types/cities";

const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;

/** Maximum distance (km) to consider a city as "nearby". */
const MAX_NEARBY_KM = 150;

function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLng = (lng2 - lng1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) *
      Math.cos(lat2 * DEG_TO_RAD) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns the slug of the nearest supported city within MAX_NEARBY_KM,
 * or `null` if no city is close enough.
 */
export function findNearestCitySlug(lat: number, lng: number): string | null {
  let bestSlug: string | null = null;
  let bestDist = MAX_NEARBY_KM;

  for (const city of CITY_SEEDS) {
    const dist = haversineDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < bestDist) {
      bestDist = dist;
      bestSlug = city.slug;
    }
  }

  return bestSlug;
}

export const CITY_SEEDS: CitySeed[] = [
  { slug: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo" },
  { slug: "delhi", name: "Delhi", country: "India", lat: 28.6139, lng: 77.209, timezone: "Asia/Kolkata" },
  { slug: "shanghai", name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, timezone: "Asia/Shanghai" },
  { slug: "sao-paulo", name: "Sao Paulo", country: "Brazil", lat: -23.5558, lng: -46.6396, timezone: "America/Sao_Paulo" },
  { slug: "mexico-city", name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, timezone: "America/Mexico_City" },
  { slug: "cairo", name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo" },
  { slug: "mumbai", name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, timezone: "Asia/Kolkata" },
  { slug: "beijing", name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai" },
  { slug: "dhaka", name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, timezone: "Asia/Dhaka" },
  { slug: "osaka", name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023, timezone: "Asia/Tokyo" },
  { slug: "new-york", name: "New York", country: "United States", lat: 40.7128, lng: -74.006, timezone: "America/New_York" },
  { slug: "karachi", name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, timezone: "Asia/Karachi" },
  { slug: "buenos-aires", name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, timezone: "America/Argentina/Buenos_Aires" },
  { slug: "chongqing", name: "Chongqing", country: "China", lat: 29.4316, lng: 106.9123, timezone: "Asia/Shanghai" },
  { slug: "istanbul", name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, timezone: "Europe/Istanbul" },
  { slug: "kolkata", name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639, timezone: "Asia/Kolkata" },
  { slug: "manila", name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842, timezone: "Asia/Manila" },
  { slug: "lagos", name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, timezone: "Africa/Lagos" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, timezone: "America/Sao_Paulo" },
  { slug: "tianjin", name: "Tianjin", country: "China", lat: 39.0842, lng: 117.2009, timezone: "Asia/Shanghai" },
  { slug: "kinshasa", name: "Kinshasa", country: "DR Congo", lat: -4.4419, lng: 15.2663, timezone: "Africa/Kinshasa" },
  { slug: "guangzhou", name: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644, timezone: "Asia/Shanghai" },
  { slug: "los-angeles", name: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, timezone: "America/Los_Angeles" },
  { slug: "moscow", name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, timezone: "Europe/Moscow" },
  { slug: "shenzhen", name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579, timezone: "Asia/Shanghai" },
  { slug: "lahore", name: "Lahore", country: "Pakistan", lat: 31.5497, lng: 74.3436, timezone: "Asia/Karachi" },
  { slug: "bangalore", name: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946, timezone: "Asia/Kolkata" },
  { slug: "paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris" },
  { slug: "bogota", name: "Bogota", country: "Colombia", lat: 4.711, lng: -74.0721, timezone: "America/Bogota" },
  { slug: "jakarta", name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta" },
  { slug: "chennai", name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707, timezone: "Asia/Kolkata" },
  { slug: "lima", name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428, timezone: "America/Lima" },
  { slug: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, timezone: "Asia/Bangkok" },
  { slug: "seoul", name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978, timezone: "Asia/Seoul" },
  { slug: "nagoya", name: "Nagoya", country: "Japan", lat: 35.1815, lng: 136.9066, timezone: "Asia/Tokyo" },
  { slug: "hyderabad", name: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867, timezone: "Asia/Kolkata" },
  { slug: "london", name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  { slug: "tehran", name: "Tehran", country: "Iran", lat: 35.6892, lng: 51.389, timezone: "Asia/Tehran" },
  { slug: "chicago", name: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298, timezone: "America/Chicago" },
  { slug: "chengdu", name: "Chengdu", country: "China", lat: 30.5728, lng: 104.0668, timezone: "Asia/Shanghai" },
  { slug: "nanjing", name: "Nanjing", country: "China", lat: 32.0603, lng: 118.7969, timezone: "Asia/Shanghai" },
  { slug: "wuhan", name: "Wuhan", country: "China", lat: 30.5928, lng: 114.3055, timezone: "Asia/Shanghai" },
  { slug: "ho-chi-minh-city", name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297, timezone: "Asia/Ho_Chi_Minh" },
  { slug: "luanda", name: "Luanda", country: "Angola", lat: -8.839, lng: 13.2894, timezone: "Africa/Luanda" },
  { slug: "ahmedabad", name: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714, timezone: "Asia/Kolkata" },
  { slug: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869, timezone: "Asia/Kuala_Lumpur" },
  { slug: "xian", name: "Xian", country: "China", lat: 34.3416, lng: 108.9398, timezone: "Asia/Shanghai" },
  { slug: "hong-kong", name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, timezone: "Asia/Hong_Kong" },
  { slug: "dongguan", name: "Dongguan", country: "China", lat: 23.0207, lng: 113.7518, timezone: "Asia/Shanghai" },
  { slug: "hangzhou", name: "Hangzhou", country: "China", lat: 30.2741, lng: 120.1551, timezone: "Asia/Shanghai" },
  { slug: "foshan", name: "Foshan", country: "China", lat: 23.0215, lng: 113.1214, timezone: "Asia/Shanghai" },
  { slug: "shenyang", name: "Shenyang", country: "China", lat: 41.8057, lng: 123.4315, timezone: "Asia/Shanghai" },
  { slug: "riyadh", name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, timezone: "Asia/Riyadh" },
  { slug: "baghdad", name: "Baghdad", country: "Iraq", lat: 33.3152, lng: 44.3661, timezone: "Asia/Baghdad" },
  { slug: "santiago", name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693, timezone: "America/Santiago" },
  { slug: "surat", name: "Surat", country: "India", lat: 21.1702, lng: 72.8311, timezone: "Asia/Kolkata" },
  { slug: "madrid", name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, timezone: "Europe/Madrid" },
  { slug: "suzhou", name: "Suzhou", country: "China", lat: 31.2989, lng: 120.5853, timezone: "Asia/Shanghai" },
  { slug: "pune", name: "Pune", country: "India", lat: 18.5204, lng: 73.8567, timezone: "Asia/Kolkata" },
  { slug: "harbin", name: "Harbin", country: "China", lat: 45.8038, lng: 126.535, timezone: "Asia/Shanghai" },
  { slug: "houston", name: "Houston", country: "United States", lat: 29.7604, lng: -95.3698, timezone: "America/Chicago" },
  { slug: "dallas", name: "Dallas", country: "United States", lat: 32.7767, lng: -96.797, timezone: "America/Chicago" },
  { slug: "toronto", name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, timezone: "America/Toronto" },
  { slug: "miami", name: "Miami", country: "United States", lat: 25.7617, lng: -80.1918, timezone: "America/New_York" },
  { slug: "philadelphia", name: "Philadelphia", country: "United States", lat: 39.9526, lng: -75.1652, timezone: "America/New_York" },
  { slug: "atlanta", name: "Atlanta", country: "United States", lat: 33.749, lng: -84.388, timezone: "America/New_York" },
  { slug: "washington-dc", name: "Washington DC", country: "United States", lat: 38.9072, lng: -77.0369, timezone: "America/New_York" },
  { slug: "phoenix", name: "Phoenix", country: "United States", lat: 33.4484, lng: -112.074, timezone: "America/Phoenix" },
  { slug: "san-francisco", name: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, timezone: "America/Los_Angeles" },
  { slug: "seattle", name: "Seattle", country: "United States", lat: 47.6062, lng: -122.3321, timezone: "America/Los_Angeles" },
  { slug: "boston", name: "Boston", country: "United States", lat: 42.3601, lng: -71.0589, timezone: "America/New_York" },
  { slug: "detroit", name: "Detroit", country: "United States", lat: 42.3314, lng: -83.0458, timezone: "America/Detroit" },
  { slug: "montreal", name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673, timezone: "America/Toronto" },
  { slug: "vancouver", name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207, timezone: "America/Vancouver" },
  { slug: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney" },
  { slug: "melbourne", name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, timezone: "Australia/Melbourne" },
  { slug: "brisbane", name: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251, timezone: "Australia/Brisbane" },
  { slug: "perth", name: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605, timezone: "Australia/Perth" },
  { slug: "auckland", name: "Auckland", country: "New Zealand", lat: -36.8509, lng: 174.7645, timezone: "Pacific/Auckland" },
  { slug: "wellington", name: "Wellington", country: "New Zealand", lat: -41.2866, lng: 174.7756, timezone: "Pacific/Auckland" },
  { slug: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore" },
  { slug: "dubai", name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai" },
  { slug: "abu-dhabi", name: "Abu Dhabi", country: "United Arab Emirates", lat: 24.4539, lng: 54.3773, timezone: "Asia/Dubai" },
  { slug: "johannesburg", name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, timezone: "Africa/Johannesburg" },
  { slug: "cape-town", name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, timezone: "Africa/Johannesburg" },
  { slug: "nairobi", name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, timezone: "Africa/Nairobi" },
  { slug: "addis-ababa", name: "Addis Ababa", country: "Ethiopia", lat: 8.9806, lng: 38.7578, timezone: "Africa/Addis_Ababa" },
  { slug: "accra", name: "Accra", country: "Ghana", lat: 5.6037, lng: -0.187, timezone: "Africa/Accra" },
  { slug: "casablanca", name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898, timezone: "Africa/Casablanca" },
  { slug: "algiers", name: "Algiers", country: "Algeria", lat: 36.7538, lng: 3.0588, timezone: "Africa/Algiers" },
  { slug: "tunis", name: "Tunis", country: "Tunisia", lat: 36.8065, lng: 10.1815, timezone: "Africa/Tunis" },
  { slug: "rome", name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, timezone: "Europe/Rome" },
  { slug: "milan", name: "Milan", country: "Italy", lat: 45.4642, lng: 9.19, timezone: "Europe/Rome" },
  { slug: "berlin", name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, timezone: "Europe/Berlin" },
  { slug: "munich", name: "Munich", country: "Germany", lat: 48.1351, lng: 11.582, timezone: "Europe/Berlin" },
  { slug: "hamburg", name: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937, timezone: "Europe/Berlin" },
  { slug: "amsterdam", name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, timezone: "Europe/Amsterdam" },
  { slug: "brussels", name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517, timezone: "Europe/Brussels" },
  { slug: "zurich", name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, timezone: "Europe/Zurich" },
  { slug: "vienna", name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, timezone: "Europe/Vienna" },
  { slug: "prague", name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378, timezone: "Europe/Prague" },
  { slug: "warsaw", name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122, timezone: "Europe/Warsaw" },
  { slug: "budapest", name: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402, timezone: "Europe/Budapest" },
  { slug: "athens", name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275, timezone: "Europe/Athens" },
  { slug: "lisbon", name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, timezone: "Europe/Lisbon" },
  { slug: "dublin", name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, timezone: "Europe/Dublin" },
  { slug: "barcelona", name: "Barcelona", country: "Spain", lat: 41.3874, lng: 2.1686, timezone: "Europe/Madrid" },
  { slug: "valencia", name: "Valencia", country: "Spain", lat: 39.4699, lng: -0.3763, timezone: "Europe/Madrid" },
  { slug: "oslo", name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522, timezone: "Europe/Oslo" },
  { slug: "stockholm", name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, timezone: "Europe/Stockholm" },
  { slug: "helsinki", name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384, timezone: "Europe/Helsinki" },
  { slug: "copenhagen", name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683, timezone: "Europe/Copenhagen" },
  { slug: "ankara", name: "Ankara", country: "Turkey", lat: 39.9334, lng: 32.8597, timezone: "Europe/Istanbul" },
  { slug: "jerusalem", name: "Jerusalem", country: "Israel", lat: 31.7683, lng: 35.2137, timezone: "Asia/Jerusalem" }
];
