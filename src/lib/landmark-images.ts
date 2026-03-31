/**
 * Fallback image URLs for landmarks that fail Wikipedia scraping.
 * Maps landmark names to manually-curated Wikipedia or Wikimedia Commons URLs.
 */
export const LANDMARK_IMAGE_FALLBACKS: Record<string, string> = {
  // New York
  "Empire State Building": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/640px-Empire_State_Building_%28aerial_view%29.jpg",
  "Top of the Rock / Rockefeller Center": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/NYC_Top_of_the_Rock_Cropped.jpg/640px-NYC_Top_of_the_Rock_Cropped.jpg",
  "St. Patrick's Cathedral": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Saint_Patrick%27s_Cathedral_NYC.jpg/640px-Saint_Patrick%27s_Cathedral_NYC.jpg",
  "North Axis Study": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Stonehenge_2007_07_30.jpg/640px-Stonehenge_2007_07_30.jpg",
  "Grand Central Terminal": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Grand_Central_Terminal_-_Narthex.jpg/640px-Grand_Central_Terminal_-_Narthex.jpg",
  "Central Park": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Central_park_nyc.jpg/640px-Central_park_nyc.jpg",
  
  // Tokyo
  "Sensō-ji Temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sensoji_Temple_Entrance02.jpg/640px-Sensoji_Temple_Entrance02.jpg",
  "Imperial Palace": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Imperial_Palace_-_Tokyo_-_April_2018.jpg/640px-Imperial_Palace_-_Tokyo_-_April_2018.jpg",
  "Rainbow Bridge": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Rainbow_Bridge_and_Tokyo_Tower.jpg/640px-Rainbow_Bridge_and_Tokyo_Tower.jpg",
  
  // Osaka
  "Osaka Castle": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Osaka_Castle.JPG/640px-Osaka_Castle.JPG",
  "Dōtonbori": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Dotonbori_at_night.jpg/640px-Dotonbori_at_night.jpg",
  "Shitennō-ji": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Shitennouji_pagoda.JPG/640px-Shitennouji_pagoda.JPG",
  "Tsūtenkaku Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tsutenkaku_Tower_Osaka.jpg/640px-Tsutenkaku_Tower_Osaka.jpg",
  "Sumiyoshi Taisha": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sumiyoshi_Taisha_main_hall.jpg/640px-Sumiyoshi_Taisha_main_hall.jpg",
  
  // Nagoya
  "Nagoya Castle": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Nagoya_Castle_2013.jpg/640px-Nagoya_Castle_2013.jpg",
  "Atsuta Shrine": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Atsuta_Shrine_naiku.jpg/640px-Atsuta_Shrine_naiku.jpg",
  "Oasis 21": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Oasis_21_Nagoya.jpg/640px-Oasis_21_Nagoya.jpg",
  
  // Delhi
  "India Gate": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/India_Gate_as_seen_from_Teen_Murti_Chowk.jpg/640px-India_Gate_as_seen_from_Teen_Murti_Chowk.jpg",
  "Red Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Red_Fort_Delhi.jpg/640px-Red_Fort_Delhi.jpg",
  "Qutub Minar": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/QUTUB_MINAR_NEW_DELHI.jpg/640px-QUTUB_MINAR_NEW_DELHI.jpg",
  "Humayun's Tomb": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Humayun%E2%80%99s_Tomb%2C_Delhi_%282019%29.jpg/640px-Humayun%E2%80%99s_Tomb%2C_Delhi_%282019%29.jpg",
  "Lotus Temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bahaityab_RV.jpg/640px-Bahaityab_RV.jpg",
  "Jama Masjid": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Jama_Masjid%2C_Delhi_a_monument_of_the_Mughal_period.jpg/640px-Jama_Masjid%2C_Delhi_a_monument_of_the_Mughal_period.jpg",
  "Akshardham Temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Akshardham_Temple_Delhi.jpg/640px-Akshardham_Temple_Delhi.jpg",
  "Rashtrapati Bhavan": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rashtrapati_Bhavan_front.jpg/640px-Rashtrapati_Bhavan_front.jpg",
  
  // Mumbai
  "Gateway of India": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Gateway_of_India%2C_Mumbai.jpg/640px-Gateway_of_India%2C_Mumbai.jpg",
  "Taj Mahal Palace Hotel": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Taj_Mahal_Hotel%2C_Mumbai.jpg/640px-Taj_Mahal_Hotel%2C_Mumbai.jpg",
  "Chhatrapati Shivaji Terminus": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/CST_Main_Building_Exterior.jpg/640px-CST_Main_Building_Exterior.jpg",
  "Haji Ali Dargah": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Haji_Ali_mumbai.jpg/640px-Haji_Ali_mumbai.jpg",
  "Bandra-Worli Sea Link": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Bandra-Worli_Sea_Link_Mumbai_November_2012.jpg/640px-Bandra-Worli_Sea_Link_Mumbai_November_2012.jpg",
  "Marine Drive": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Marine_Drive_Mumbai.jpg/640px-Marine_Drive_Mumbai.jpg",
};

/**
 * Get a fallback image URL for a landmark by name.
 * Returns the fallback if available, otherwise returns null.
 */
export function getFallbackImageUrl(landmarkName: string): string | null {
  return LANDMARK_IMAGE_FALLBACKS[landmarkName] ?? null;
}
