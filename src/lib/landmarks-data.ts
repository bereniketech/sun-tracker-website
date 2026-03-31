import type { Landmark } from "@/types/sun";


// ─── Tokyo, Japan ────────────────────────────────────────────────
const tokyo: Landmark[] = [
  { id: "tokyo-tower", name: "Tokyo Tower", lat: 35.6586, lng: 139.7454, orientationAzimuth: 0, location: "Tokyo, Japan", citySlug: "tokyo", category: "modern", imageGradient: "from-red-600 to-orange-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Tokyotower_distance.jpg/640px-Tokyotower_distance.jpg" },
  { id: "senso-ji", name: "Sensō-ji Temple", lat: 35.7148, lng: 139.7967, orientationAzimuth: 180, location: "Tokyo, Japan", citySlug: "tokyo", category: "religious", imageGradient: "from-red-800 to-red-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sensoji_Temple_Entrance02.jpg/640px-Sensoji_Temple_Entrance02.jpg" },
  { id: "meiji-shrine", name: "Meiji Shrine", lat: 35.6764, lng: 139.6993, orientationAzimuth: 180, location: "Tokyo, Japan", citySlug: "tokyo", category: "religious", imageGradient: "from-green-900 to-green-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/MeijiShrine2.jpg/640px-MeijiShrine2.jpg" },
  { id: "tokyo-skytree", name: "Tokyo Skytree", lat: 35.7101, lng: 139.8107, orientationAzimuth: 0, location: "Tokyo, Japan", citySlug: "tokyo", category: "modern", imageGradient: "from-sky-600 to-blue-800", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Tokyo_Sky_Tree_2012.JPG/640px-Tokyo_Sky_Tree_2012.JPG" },
  { id: "imperial-palace-tokyo", name: "Imperial Palace", lat: 35.6852, lng: 139.7528, orientationAzimuth: 180, location: "Tokyo, Japan", citySlug: "tokyo", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Imperial_Palace_-_Tokyo_-_April_2018.jpg/640px-Imperial_Palace_-_Tokyo_-_April_2018.jpg" },
  { id: "shibuya-crossing", name: "Shibuya Crossing", lat: 35.6595, lng: 139.7004, orientationAzimuth: 0, location: "Tokyo, Japan", citySlug: "tokyo", category: "modern", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Shibuya_scramble_crossing.jpg/640px-Shibuya_scramble_crossing.jpg" },
  { id: "rainbow-bridge-tokyo", name: "Rainbow Bridge", lat: 35.6366, lng: 139.7634, orientationAzimuth: 120, location: "Tokyo, Japan", citySlug: "tokyo", category: "modern", imageGradient: "from-violet-600 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Rainbow_Bridge_and_Tokyo_Tower.jpg/640px-Rainbow_Bridge_and_Tokyo_Tower.jpg" },
  { id: "shinjuku-gyoen", name: "Shinjuku Gyoen", lat: 35.6852, lng: 139.71, orientationAzimuth: 0, location: "Tokyo, Japan", citySlug: "tokyo", category: "natural", imageGradient: "from-green-600 to-emerald-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Shinjuku_Gyoen_National_Garden_2011.jpg/640px-Shinjuku_Gyoen_National_Garden_2011.jpg" },
];

// ─── Osaka, Japan ────────────────────────────────────────────────
const osaka: Landmark[] = [
  { id: "osaka-castle", name: "Osaka Castle", lat: 34.6873, lng: 135.5262, orientationAzimuth: 180, location: "Osaka, Japan", citySlug: "osaka", category: "historic", imageGradient: "from-amber-700 to-yellow-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Osaka_Castle.JPG/640px-Osaka_Castle.JPG" },
  { id: "dotonbori", name: "Dōtonbori", lat: 34.6687, lng: 135.5013, orientationAzimuth: 0, location: "Osaka, Japan", citySlug: "osaka", category: "modern", imageGradient: "from-pink-600 to-red-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Dotonbori_at_night.jpg/640px-Dotonbori_at_night.jpg" },
  { id: "shitenno-ji", name: "Shitennō-ji", lat: 34.6533, lng: 135.5167, orientationAzimuth: 180, location: "Osaka, Japan", citySlug: "osaka", category: "religious", imageGradient: "from-orange-800 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Shitennouji_pagoda.JPG/640px-Shitennouji_pagoda.JPG" },
  { id: "tsutenkaku", name: "Tsūtenkaku Tower", lat: 34.6525, lng: 135.5063, orientationAzimuth: 0, location: "Osaka, Japan", citySlug: "osaka", category: "modern", imageGradient: "from-yellow-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tsutenkaku_Tower_Osaka.jpg/640px-Tsutenkaku_Tower_Osaka.jpg" },
  { id: "sumiyoshi-taisha", name: "Sumiyoshi Taisha", lat: 34.6128, lng: 135.4929, orientationAzimuth: 180, location: "Osaka, Japan", citySlug: "osaka", category: "religious", imageGradient: "from-red-900 to-red-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sumiyoshi_Taisha_main_hall.jpg/640px-Sumiyoshi_Taisha_main_hall.jpg" },
];

// ─── Nagoya, Japan ───────────────────────────────────────────────
const nagoya: Landmark[] = [
  { id: "nagoya-castle", name: "Nagoya Castle", lat: 35.1856, lng: 136.8997, orientationAzimuth: 180, location: "Nagoya, Japan", citySlug: "nagoya", category: "historic", imageGradient: "from-amber-700 to-yellow-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Nagoya_Castle_2013.jpg/640px-Nagoya_Castle_2013.jpg" },
  { id: "atsuta-shrine", name: "Atsuta Shrine", lat: 35.1283, lng: 136.9086, orientationAzimuth: 180, location: "Nagoya, Japan", citySlug: "nagoya", category: "religious", imageGradient: "from-green-800 to-green-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Atsuta_Shrine_naiku.jpg/640px-Atsuta_Shrine_naiku.jpg" },
  { id: "oasis-21", name: "Oasis 21", lat: 35.1709, lng: 136.9094, orientationAzimuth: 0, location: "Nagoya, Japan", citySlug: "nagoya", category: "modern", imageGradient: "from-cyan-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Oasis_21_Nagoya.jpg/640px-Oasis_21_Nagoya.jpg" },
];

// ─── Delhi, India ────────────────────────────────────────────────
const delhi: Landmark[] = [
  { id: "india-gate", name: "India Gate", lat: 28.6129, lng: 77.2295, orientationAzimuth: 75, location: "Delhi, India", citySlug: "delhi", category: "monument", imageGradient: "from-amber-700 to-orange-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/India_Gate_as_seen_from_Teen_Murti_Chowk.jpg/640px-India_Gate_as_seen_from_Teen_Murti_Chowk.jpg" },
  { id: "red-fort", name: "Red Fort", lat: 28.6562, lng: 77.241, orientationAzimuth: 180, location: "Delhi, India", citySlug: "delhi", category: "historic", imageGradient: "from-red-800 to-red-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Red_Fort_Delhi.jpg/640px-Red_Fort_Delhi.jpg" },
  { id: "qutub-minar", name: "Qutub Minar", lat: 28.5245, lng: 77.1855, orientationAzimuth: 0, location: "Delhi, India", citySlug: "delhi", category: "historic", imageGradient: "from-amber-900 to-stone-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/QUTUB_MINAR_NEW_DELHI.jpg/640px-QUTUB_MINAR_NEW_DELHI.jpg" },
  { id: "humayuns-tomb", name: "Humayun's Tomb", lat: 28.5933, lng: 77.2507, orientationAzimuth: 180, location: "Delhi, India", citySlug: "delhi", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Humayun%E2%80%99s_Tomb%2C_Delhi_%282019%29.jpg/640px-Humayun%E2%80%99s_Tomb%2C_Delhi_%282019%29.jpg" },
  { id: "lotus-temple", name: "Lotus Temple", lat: 28.5535, lng: 77.2588, orientationAzimuth: 0, location: "Delhi, India", citySlug: "delhi", category: "religious", imageGradient: "from-white to-slate-200", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bahaityab_RV.jpg/640px-Bahaityab_RV.jpg" },
  { id: "jama-masjid-delhi", name: "Jama Masjid", lat: 28.6507, lng: 77.2334, orientationAzimuth: 270, location: "Delhi, India", citySlug: "delhi", category: "religious", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Jama_Masjid%2C_Delhi_a_monument_of_the_Mughal_period.jpg/640px-Jama_Masjid%2C_Delhi_a_monument_of_the_Mughal_period.jpg" },
  { id: "akshardham-delhi", name: "Akshardham Temple", lat: 28.6127, lng: 77.2773, orientationAzimuth: 180, location: "Delhi, India", citySlug: "delhi", category: "religious", imageGradient: "from-amber-600 to-orange-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Akshardham_Temple_Delhi.jpg/640px-Akshardham_Temple_Delhi.jpg" },
  { id: "rashtrapati-bhavan", name: "Rashtrapati Bhavan", lat: 28.6143, lng: 77.1994, orientationAzimuth: 75, location: "Delhi, India", citySlug: "delhi", category: "historic", imageGradient: "from-stone-700 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rashtrapati_Bhavan_front.jpg/640px-Rashtrapati_Bhavan_front.jpg" },
];

// ─── Mumbai, India ───────────────────────────────────────────────
const mumbai: Landmark[] = [
  { id: "gateway-of-india", name: "Gateway of India", lat: 18.9217, lng: 72.8347, orientationAzimuth: 180, location: "Mumbai, India", citySlug: "mumbai", category: "monument", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Gateway_of_India%2C_Mumbai.jpg/640px-Gateway_of_India%2C_Mumbai.jpg" },
  { id: "taj-mahal-palace", name: "Taj Mahal Palace Hotel", lat: 18.9217, lng: 72.8332, orientationAzimuth: 180, location: "Mumbai, India", citySlug: "mumbai", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Taj_Mahal_Hotel%2C_Mumbai.jpg/640px-Taj_Mahal_Hotel%2C_Mumbai.jpg" },
  { id: "chhatrapati-shivaji-terminus", name: "Chhatrapati Shivaji Terminus", lat: 18.9398, lng: 72.8355, orientationAzimuth: 180, location: "Mumbai, India", citySlug: "mumbai", category: "historic", imageGradient: "from-amber-800 to-stone-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/CST_Main_Building_Exterior.jpg/640px-CST_Main_Building_Exterior.jpg" },
  { id: "haji-ali-dargah", name: "Haji Ali Dargah", lat: 18.9827, lng: 72.809, orientationAzimuth: 270, location: "Mumbai, India", citySlug: "mumbai", category: "religious", imageGradient: "from-white to-cyan-200", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Haji_Ali_mumbai.jpg/640px-Haji_Ali_mumbai.jpg" },
  { id: "bandra-worli-sea-link", name: "Bandra-Worli Sea Link", lat: 19.0381, lng: 72.8166, orientationAzimuth: 340, location: "Mumbai, India", citySlug: "mumbai", category: "modern", imageGradient: "from-blue-700 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Bandra-Worli_Sea_Link_Mumbai_November_2012.jpg/640px-Bandra-Worli_Sea_Link_Mumbai_November_2012.jpg" },
  { id: "marine-drive-mumbai", name: "Marine Drive", lat: 18.9441, lng: 72.8237, orientationAzimuth: 300, location: "Mumbai, India", citySlug: "mumbai", category: "natural", imageGradient: "from-sky-500 to-blue-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Marine_Drive_Mumbai.jpg/640px-Marine_Drive_Mumbai.jpg" },
];

// ─── Bangalore, India ────────────────────────────────────────────
const bangalore: Landmark[] = [
  { id: "vidhana-soudha", name: "Vidhana Soudha", lat: 12.9796, lng: 77.5907, orientationAzimuth: 180, location: "Bangalore, India", citySlug: "bangalore", category: "historic", imageGradient: "from-stone-700 to-slate-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Vidhana_Soudha.jpg/640px-Vidhana_Soudha.jpg" },
  { id: "lalbagh-botanical-garden", name: "Lalbagh Botanical Garden", lat: 12.9507, lng: 77.5848, orientationAzimuth: 0, location: "Bangalore, India", citySlug: "bangalore", category: "natural", imageGradient: "from-green-700 to-emerald-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Lalbagh_garden.JPG/640px-Lalbagh_garden.JPG" },
  { id: "bangalore-palace", name: "Bangalore Palace", lat: 12.9988, lng: 77.5921, orientationAzimuth: 180, location: "Bangalore, India", citySlug: "bangalore", category: "historic", imageGradient: "from-red-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Bangalore_Palace.jpg/640px-Bangalore_Palace.jpg" },
];

// ─── Chennai, India ──────────────────────────────────────────────
const chennai: Landmark[] = [
  { id: "kapaleeshwarar-temple", name: "Kapaleeshwarar Temple", lat: 13.0339, lng: 80.2696, orientationAzimuth: 90, location: "Chennai, India", citySlug: "chennai", category: "religious", imageGradient: "from-amber-700 to-orange-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Lord_shiva_at_kapaleeshwarar_temple.jpg/640px-Lord_shiva_at_kapaleeshwarar_temple.jpg" },
  { id: "marina-beach", name: "Marina Beach", lat: 13.0499, lng: 80.2824, orientationAzimuth: 90, location: "Chennai, India", citySlug: "chennai", category: "natural", imageGradient: "from-sky-400 to-blue-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Marina_beach_Chennai.jpg/640px-Marina_beach_Chennai.jpg" },
  { id: "fort-st-george", name: "Fort St. George", lat: 13.0798, lng: 80.2874, orientationAzimuth: 90, location: "Chennai, India", citySlug: "chennai", category: "historic", imageGradient: "from-stone-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Fort_St_George%2C_Chennai.jpg/640px-Fort_St_George%2C_Chennai.jpg" },
];

// ─── Kolkata, India ──────────────────────────────────────────────
const kolkata: Landmark[] = [
  { id: "victoria-memorial", name: "Victoria Memorial", lat: 22.5448, lng: 88.3426, orientationAzimuth: 0, location: "Kolkata, India", citySlug: "kolkata", category: "monument", imageGradient: "from-white to-stone-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Victoria_Memorial%2C_Kolkata_%28West_view%29.jpg/640px-Victoria_Memorial%2C_Kolkata_%28West_view%29.jpg" },
  { id: "howrah-bridge", name: "Howrah Bridge", lat: 22.5851, lng: 88.3468, orientationAzimuth: 315, location: "Kolkata, India", citySlug: "kolkata", category: "modern", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Howrah_bridge_1_new.jpg/640px-Howrah_bridge_1_new.jpg" },
  { id: "dakshineswar-kali-temple", name: "Dakshineswar Kali Temple", lat: 22.6548, lng: 88.3575, orientationAzimuth: 270, location: "Kolkata, India", citySlug: "kolkata", category: "religious", imageGradient: "from-red-800 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Dakshineswar_Kali_Temple.jpg/640px-Dakshineswar_Kali_Temple.jpg" },
];

// ─── Hyderabad, India ────────────────────────────────────────────
const hyderabad: Landmark[] = [
  { id: "charminar", name: "Charminar", lat: 17.3616, lng: 78.4747, orientationAzimuth: 0, location: "Hyderabad, India", citySlug: "hyderabad", category: "monument", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Charminar_-_Hyderabad.jpg/640px-Charminar_-_Hyderabad.jpg" },
  { id: "golconda-fort", name: "Golconda Fort", lat: 17.3833, lng: 78.4011, orientationAzimuth: 90, location: "Hyderabad, India", citySlug: "hyderabad", category: "historic", imageGradient: "from-stone-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Golconda_Fort_Hyderabd.jpg/640px-Golconda_Fort_Hyderabd.jpg" },
  { id: "hussain-sagar", name: "Hussain Sagar Lake & Buddha Statue", lat: 17.4239, lng: 78.4738, orientationAzimuth: 0, location: "Hyderabad, India", citySlug: "hyderabad", category: "monument", imageGradient: "from-sky-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Buddha_statue_Hussain_Sagar.jpg/640px-Buddha_statue_Hussain_Sagar.jpg" },
];

// ─── Shanghai, China ─────────────────────────────────────────────
const shanghai: Landmark[] = [
  { id: "oriental-pearl-tower", name: "Oriental Pearl Tower", lat: 31.2397, lng: 121.4998, orientationAzimuth: 0, location: "Shanghai, China", citySlug: "shanghai", category: "modern", imageGradient: "from-pink-600 to-purple-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Oriental_Pearl_Tower_2015.jpg/640px-Oriental_Pearl_Tower_2015.jpg" },
  { id: "the-bund", name: "The Bund", lat: 31.2398, lng: 121.4905, orientationAzimuth: 90, location: "Shanghai, China", citySlug: "shanghai", category: "historic", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Shanghai_bund_night.jpg/640px-Shanghai_bund_night.jpg" },
  { id: "shanghai-tower", name: "Shanghai Tower", lat: 31.2355, lng: 121.5016, orientationAzimuth: 0, location: "Shanghai, China", citySlug: "shanghai", category: "modern", imageGradient: "from-sky-600 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Shanghai_Tower_2015.jpg/640px-Shanghai_Tower_2015.jpg" },
  { id: "yu-garden", name: "Yu Garden", lat: 31.2272, lng: 121.4922, orientationAzimuth: 180, location: "Shanghai, China", citySlug: "shanghai", category: "historic", imageGradient: "from-green-800 to-emerald-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Yuyuan_Garden.jpg/640px-Yuyuan_Garden.jpg" },
  { id: "jin-mao-tower", name: "Jin Mao Tower", lat: 31.2354, lng: 121.5007, orientationAzimuth: 0, location: "Shanghai, China", citySlug: "shanghai", category: "modern", imageGradient: "from-slate-600 to-slate-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Jin_Mao_Tower.jpg/640px-Jin_Mao_Tower.jpg" },
  { id: "jade-buddha-temple", name: "Jade Buddha Temple", lat: 31.2431, lng: 121.4502, orientationAzimuth: 180, location: "Shanghai, China", citySlug: "shanghai", category: "religious", imageGradient: "from-yellow-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jade_Buddha_Temple_%2820150214151517%29.jpg/640px-Jade_Buddha_Temple_%2820150214151517%29.jpg" },
];

// ─── Beijing, China ──────────────────────────────────────────────
const beijing: Landmark[] = [
  { id: "forbidden-city", name: "Forbidden City", lat: 39.9163, lng: 116.3972, orientationAzimuth: 180, location: "Beijing, China", citySlug: "beijing", category: "historic", imageGradient: "from-red-800 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/The_Forbidden_City_-_View_from_Coal_Hill.JPG/640px-The_Forbidden_City_-_View_from_Coal_Hill.JPG" },
  { id: "tiananmen-square", name: "Tiananmen Square", lat: 39.9055, lng: 116.3976, orientationAzimuth: 0, location: "Beijing, China", citySlug: "beijing", category: "historic", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Tiananmen_Square_viewed_from_Tiananmen.jpg/640px-Tiananmen_Square_viewed_from_Tiananmen.jpg" },
  { id: "temple-of-heaven", name: "Temple of Heaven", lat: 39.8822, lng: 116.4066, orientationAzimuth: 180, location: "Beijing, China", citySlug: "beijing", category: "religious", imageGradient: "from-blue-800 to-cyan-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Beijing_Temple_of_Heaven.jpg/640px-Beijing_Temple_of_Heaven.jpg" },
  { id: "great-wall-badaling", name: "Great Wall (Badaling)", lat: 40.3538, lng: 116.0061, orientationAzimuth: 45, location: "Beijing, China", citySlug: "beijing", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/640px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg" },
  { id: "summer-palace", name: "Summer Palace", lat: 39.9998, lng: 116.2755, orientationAzimuth: 180, location: "Beijing, China", citySlug: "beijing", category: "historic", imageGradient: "from-green-700 to-emerald-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Summer_Palace%2C_Marble_Boat.jpg/640px-Summer_Palace%2C_Marble_Boat.jpg" },
  { id: "birds-nest-stadium", name: "Bird's Nest Stadium", lat: 39.9929, lng: 116.3966, orientationAzimuth: 0, location: "Beijing, China", citySlug: "beijing", category: "modern", imageGradient: "from-red-600 to-slate-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/National_Stadium_2009.jpg/640px-National_Stadium_2009.jpg" },
  { id: "cctv-headquarters", name: "CCTV Headquarters", lat: 39.9147, lng: 116.4592, orientationAzimuth: 0, location: "Beijing, China", citySlug: "beijing", category: "modern", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/CCTV_Headquarters_2014.jpg/640px-CCTV_Headquarters_2014.jpg" },
];

// ─── Hong Kong, China ────────────────────────────────────────────
const hongKong: Landmark[] = [
  { id: "victoria-peak", name: "Victoria Peak", lat: 22.2759, lng: 114.1455, orientationAzimuth: 0, location: "Hong Kong, China", citySlug: "hong-kong", category: "natural", imageGradient: "from-green-700 to-emerald-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Hong_Kong_Night_Skyline.jpg/640px-Hong_Kong_Night_Skyline.jpg" },
  { id: "tian-tan-buddha", name: "Tian Tan Buddha", lat: 22.254, lng: 113.905, orientationAzimuth: 0, location: "Hong Kong, China", citySlug: "hong-kong", category: "religious", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Tian_Tan_Buddha_4_Jan_2007.jpg/640px-Tian_Tan_Buddha_4_Jan_2007.jpg" },
  { id: "star-ferry-pier", name: "Star Ferry Pier", lat: 22.2869, lng: 114.1689, orientationAzimuth: 180, location: "Hong Kong, China", citySlug: "hong-kong", category: "historic", imageGradient: "from-green-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Star_Ferry_Pier_TST.jpg/640px-Star_Ferry_Pier_TST.jpg" },
  { id: "hong-kong-skyline", name: "Victoria Harbour Skyline", lat: 22.2932, lng: 114.1721, orientationAzimuth: 180, location: "Hong Kong, China", citySlug: "hong-kong", category: "modern", imageGradient: "from-blue-700 to-purple-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Hong_Kong_Night_Skyline_%28cropped%29.jpg/640px-Hong_Kong_Night_Skyline_%28cropped%29.jpg" },
];

// ─── Guangzhou, China ────────────────────────────────────────────
const guangzhou: Landmark[] = [
  { id: "canton-tower", name: "Canton Tower", lat: 23.1085, lng: 113.3245, orientationAzimuth: 0, location: "Guangzhou, China", citySlug: "guangzhou", category: "modern", imageGradient: "from-purple-600 to-pink-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Canton_Tower_2012.jpg/640px-Canton_Tower_2012.jpg" },
  { id: "chen-clan-ancestral-hall", name: "Chen Clan Ancestral Hall", lat: 23.1259, lng: 113.2445, orientationAzimuth: 180, location: "Guangzhou, China", citySlug: "guangzhou", category: "historic", imageGradient: "from-amber-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chen_Clan_Academy.jpg/640px-Chen_Clan_Academy.jpg" },
];

// ─── Shenzhen, China ─────────────────────────────────────────────
const shenzhen: Landmark[] = [
  { id: "ping-an-finance-centre", name: "Ping An Finance Centre", lat: 22.5333, lng: 114.0543, orientationAzimuth: 0, location: "Shenzhen, China", citySlug: "shenzhen", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Ping_An_IFC_-_Shenzhen.jpg/640px-Ping_An_IFC_-_Shenzhen.jpg" },
  { id: "window-of-the-world", name: "Window of the World", lat: 22.5348, lng: 113.9746, orientationAzimuth: 0, location: "Shenzhen, China", citySlug: "shenzhen", category: "modern", imageGradient: "from-blue-600 to-cyan-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Window_of_the_World_Shenzhen.jpg/640px-Window_of_the_World_Shenzhen.jpg" },
];

// ─── Chengdu, China ──────────────────────────────────────────────
const chengdu: Landmark[] = [
  { id: "leshan-giant-buddha", name: "Leshan Giant Buddha", lat: 29.5443, lng: 103.7734, orientationAzimuth: 270, location: "Chengdu, China", citySlug: "chengdu", category: "religious", imageGradient: "from-stone-700 to-green-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Giant_Buddha_of_Leshan.jpg/640px-Giant_Buddha_of_Leshan.jpg" },
  { id: "wuhou-shrine", name: "Wuhou Shrine", lat: 30.6428, lng: 104.0485, orientationAzimuth: 180, location: "Chengdu, China", citySlug: "chengdu", category: "historic", imageGradient: "from-red-800 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Wuhou_Temple.jpg/640px-Wuhou_Temple.jpg" },
];

// ─── Nanjing, China ──────────────────────────────────────────────
const nanjing: Landmark[] = [
  { id: "sun-yat-sen-mausoleum", name: "Sun Yat-sen Mausoleum", lat: 32.0584, lng: 118.8559, orientationAzimuth: 180, location: "Nanjing, China", citySlug: "nanjing", category: "monument", imageGradient: "from-blue-800 to-slate-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Sun_Yat-sen_Mausoleum_2014.jpg/640px-Sun_Yat-sen_Mausoleum_2014.jpg" },
  { id: "nanjing-city-wall", name: "Nanjing City Wall", lat: 32.0226, lng: 118.7998, orientationAzimuth: 0, location: "Nanjing, China", citySlug: "nanjing", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Nanjing_City_Wall.jpg/640px-Nanjing_City_Wall.jpg" },
];

// ─── Hangzhou, China ─────────────────────────────────────────────
const hangzhou: Landmark[] = [
  { id: "west-lake", name: "West Lake", lat: 30.2422, lng: 120.1419, orientationAzimuth: 0, location: "Hangzhou, China", citySlug: "hangzhou", category: "natural", imageGradient: "from-emerald-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/West_Lake%2C_Hangzhou.jpg/640px-West_Lake%2C_Hangzhou.jpg" },
  { id: "lingyin-temple", name: "Lingyin Temple", lat: 30.2395, lng: 120.0996, orientationAzimuth: 180, location: "Hangzhou, China", citySlug: "hangzhou", category: "religious", imageGradient: "from-amber-700 to-green-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Lingyin_Temple_entrance.jpg/640px-Lingyin_Temple_entrance.jpg" },
];

// ─── Xian, China ─────────────────────────────────────────────────
const xian: Landmark[] = [
  { id: "terracotta-army", name: "Terracotta Army", lat: 34.3847, lng: 109.2785, orientationAzimuth: 0, location: "Xian, China", citySlug: "xian", category: "historic", imageGradient: "from-amber-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Terracotta_Army_-_9_June_2009.jpg/640px-Terracotta_Army_-_9_June_2009.jpg" },
  { id: "xian-city-wall", name: "Xi'an City Wall", lat: 34.2616, lng: 108.9461, orientationAzimuth: 0, location: "Xian, China", citySlug: "xian", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Xian_city_wall.jpg/640px-Xian_city_wall.jpg" },
  { id: "big-wild-goose-pagoda", name: "Big Wild Goose Pagoda", lat: 34.2182, lng: 108.9604, orientationAzimuth: 180, location: "Xian, China", citySlug: "xian", category: "religious", imageGradient: "from-amber-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Big_Wild_Goose_Pagoda.jpg/640px-Big_Wild_Goose_Pagoda.jpg" },
];

// ─── Wuhan, China ────────────────────────────────────────────────
const wuhan: Landmark[] = [
  { id: "yellow-crane-tower", name: "Yellow Crane Tower", lat: 30.5446, lng: 114.3024, orientationAzimuth: 180, location: "Wuhan, China", citySlug: "wuhan", category: "historic", imageGradient: "from-amber-700 to-yellow-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Yellow_Crane_Tower_%28cropped%29.jpg/640px-Yellow_Crane_Tower_%28cropped%29.jpg" },
];

// ─── Chongqing, China ────────────────────────────────────────────
const chongqing: Landmark[] = [
  { id: "hongya-cave", name: "Hongya Cave", lat: 29.5631, lng: 106.5784, orientationAzimuth: 0, location: "Chongqing, China", citySlug: "chongqing", category: "historic", imageGradient: "from-amber-800 to-orange-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Hongyadong.jpg/640px-Hongyadong.jpg" },
];

// ─── Harbin, China ───────────────────────────────────────────────
const harbin: Landmark[] = [
  { id: "saint-sophia-cathedral-harbin", name: "Saint Sophia Cathedral", lat: 45.7701, lng: 126.6269, orientationAzimuth: 270, location: "Harbin, China", citySlug: "harbin", category: "religious", imageGradient: "from-green-800 to-red-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Saint_Sofia_Cathedral_in_Harbin.jpg/640px-Saint_Sofia_Cathedral_in_Harbin.jpg" },
];

// ─── Seoul, South Korea ──────────────────────────────────────────
const seoul: Landmark[] = [
  { id: "gyeongbokgung", name: "Gyeongbokgung Palace", lat: 37.5796, lng: 126.977, orientationAzimuth: 180, location: "Seoul, South Korea", citySlug: "seoul", category: "historic", imageGradient: "from-blue-800 to-cyan-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Korean_palace_Gyeongbokgung_1.jpg/640px-Korean_palace_Gyeongbokgung_1.jpg" },
  { id: "namsan-tower", name: "N Seoul Tower", lat: 37.5512, lng: 126.9882, orientationAzimuth: 0, location: "Seoul, South Korea", citySlug: "seoul", category: "modern", imageGradient: "from-sky-600 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/N_Seoul_Tower_-_Seoul%2C_South_Korea_-_August_2011.jpg/640px-N_Seoul_Tower_-_Seoul%2C_South_Korea_-_August_2011.jpg" },
  { id: "bukchon-hanok", name: "Bukchon Hanok Village", lat: 37.5826, lng: 126.9831, orientationAzimuth: 0, location: "Seoul, South Korea", citySlug: "seoul", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Bukchon_Hanok_Village.jpg/640px-Bukchon_Hanok_Village.jpg" },
  { id: "changdeokgung", name: "Changdeokgung Palace", lat: 37.5794, lng: 126.991, orientationAzimuth: 180, location: "Seoul, South Korea", citySlug: "seoul", category: "historic", imageGradient: "from-green-700 to-emerald-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Changdeokgung_Palace.jpg/640px-Changdeokgung_Palace.jpg" },
  { id: "dongdaemun-design-plaza", name: "Dongdaemun Design Plaza", lat: 37.5673, lng: 127.0093, orientationAzimuth: 0, location: "Seoul, South Korea", citySlug: "seoul", category: "modern", imageGradient: "from-slate-600 to-slate-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Seoul_-_Dongdaemun_Design_Plaza_01.jpg/640px-Seoul_-_Dongdaemun_Design_Plaza_01.jpg" },
  { id: "lotte-world-tower", name: "Lotte World Tower", lat: 37.5126, lng: 127.1026, orientationAzimuth: 0, location: "Seoul, South Korea", citySlug: "seoul", category: "modern", imageGradient: "from-slate-700 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lotte_World_Tower_2017.jpg/640px-Lotte_World_Tower_2017.jpg" },
];

// ─── Bangkok, Thailand ───────────────────────────────────────────
const bangkok: Landmark[] = [
  { id: "grand-palace-bangkok", name: "Grand Palace", lat: 13.7516, lng: 100.4915, orientationAzimuth: 0, location: "Bangkok, Thailand", citySlug: "bangkok", category: "historic", imageGradient: "from-amber-600 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Grand_Palace_Bangkok.jpg/640px-Grand_Palace_Bangkok.jpg" },
  { id: "wat-arun", name: "Wat Arun", lat: 13.7437, lng: 100.489, orientationAzimuth: 90, location: "Bangkok, Thailand", citySlug: "bangkok", category: "religious", imageGradient: "from-white to-sky-200", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Wat_Arun_temple.jpg/640px-Wat_Arun_temple.jpg" },
  { id: "wat-pho", name: "Wat Pho", lat: 13.7465, lng: 100.4933, orientationAzimuth: 90, location: "Bangkok, Thailand", citySlug: "bangkok", category: "religious", imageGradient: "from-amber-700 to-green-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Reclining_Buddha_Wat_Pho_Bangkok.jpg/640px-Reclining_Buddha_Wat_Pho_Bangkok.jpg" },
  { id: "wat-saket", name: "Wat Saket (Golden Mount)", lat: 13.7537, lng: 100.5064, orientationAzimuth: 0, location: "Bangkok, Thailand", citySlug: "bangkok", category: "religious", imageGradient: "from-yellow-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Wat_Saket_temple.jpg/640px-Wat_Saket_temple.jpg" },
  { id: "mahanakhon", name: "King Power Mahanakhon", lat: 13.7228, lng: 100.5295, orientationAzimuth: 0, location: "Bangkok, Thailand", citySlug: "bangkok", category: "modern", imageGradient: "from-slate-700 to-blue-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/MahaNakhon_tower_2016.jpg/640px-MahaNakhon_tower_2016.jpg" },
];

// ─── Singapore ───────────────────────────────────────────────────
const singapore: Landmark[] = [
  { id: "marina-bay-sands", name: "Marina Bay Sands", lat: 1.2834, lng: 103.8607, orientationAzimuth: 0, location: "Singapore", citySlug: "singapore", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Marina_Bay_Sands_in_the_evening_-_20101120.jpg/640px-Marina_Bay_Sands_in_the_evening_-_20101120.jpg" },
  { id: "merlion", name: "Merlion", lat: 1.2868, lng: 103.8545, orientationAzimuth: 90, location: "Singapore", citySlug: "singapore", category: "monument", imageGradient: "from-white to-sky-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Merlion%2C_Singapore%2C_Dec_2005.jpg/640px-Merlion%2C_Singapore%2C_Dec_2005.jpg" },
  { id: "gardens-by-the-bay", name: "Gardens by the Bay", lat: 1.2816, lng: 103.8636, orientationAzimuth: 0, location: "Singapore", citySlug: "singapore", category: "natural", imageGradient: "from-green-500 to-purple-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Gardens_by_the_Bay%2C_Singapore_-_20130101-02.jpg/640px-Gardens_by_the_Bay%2C_Singapore_-_20130101-02.jpg" },
  { id: "supertree-grove", name: "Supertree Grove", lat: 1.2816, lng: 103.8636, orientationAzimuth: 0, location: "Singapore", citySlug: "singapore", category: "modern", imageGradient: "from-purple-600 to-pink-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Gardens_by_the_Bay%2C_Singapore_-_20130101-02.jpg/640px-Gardens_by_the_Bay%2C_Singapore_-_20130101-02.jpg" },
  { id: "esplanade-theatres", name: "Esplanade – Theatres on the Bay", lat: 1.2899, lng: 103.8559, orientationAzimuth: 180, location: "Singapore", citySlug: "singapore", category: "modern", imageGradient: "from-amber-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Esplanade_Theatres_on_the_Bay%2C_Singapore.jpg/640px-Esplanade_Theatres_on_the_Bay%2C_Singapore.jpg" },
];

// ─── Kuala Lumpur, Malaysia ──────────────────────────────────────
const kualaLumpur: Landmark[] = [
  { id: "petronas-towers", name: "Petronas Twin Towers", lat: 3.1578, lng: 101.7117, orientationAzimuth: 0, location: "Kuala Lumpur, Malaysia", citySlug: "kuala-lumpur", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Petronas_Twin_Towers%2C_Kuala_Lumpur.jpg/640px-Petronas_Twin_Towers%2C_Kuala_Lumpur.jpg" },
  { id: "kl-tower", name: "KL Tower", lat: 3.1528, lng: 101.7007, orientationAzimuth: 0, location: "Kuala Lumpur, Malaysia", citySlug: "kuala-lumpur", category: "modern", imageGradient: "from-blue-600 to-cyan-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Menara_Kuala_Lumpur.jpg/640px-Menara_Kuala_Lumpur.jpg" },
  { id: "batu-caves", name: "Batu Caves", lat: 3.2379, lng: 101.684, orientationAzimuth: 0, location: "Kuala Lumpur, Malaysia", citySlug: "kuala-lumpur", category: "religious", imageGradient: "from-amber-600 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Batu_Caves%2C_Kuala_Lumpur%2C_Malaysia.jpg/640px-Batu_Caves%2C_Kuala_Lumpur%2C_Malaysia.jpg" },
  { id: "sultan-abdul-samad-building", name: "Sultan Abdul Samad Building", lat: 3.1488, lng: 101.6936, orientationAzimuth: 270, location: "Kuala Lumpur, Malaysia", citySlug: "kuala-lumpur", category: "historic", imageGradient: "from-red-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sultan_Abdul_Samad_Building.JPG/640px-Sultan_Abdul_Samad_Building.JPG" },
];

// ─── Jakarta, Indonesia ──────────────────────────────────────────
const jakarta: Landmark[] = [
  { id: "monas", name: "National Monument (Monas)", lat: -6.1754, lng: 106.8272, orientationAzimuth: 0, location: "Jakarta, Indonesia", citySlug: "jakarta", category: "monument", imageGradient: "from-amber-600 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/National_Monument_of_Indonesia.jpg/640px-National_Monument_of_Indonesia.jpg" },
  { id: "istiqlal-mosque", name: "Istiqlal Mosque", lat: -6.1702, lng: 106.8316, orientationAzimuth: 295, location: "Jakarta, Indonesia", citySlug: "jakarta", category: "religious", imageGradient: "from-white to-slate-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Masjid_Istiqlal_Jakarta.jpg/640px-Masjid_Istiqlal_Jakarta.jpg" },
  { id: "jakarta-cathedral", name: "Jakarta Cathedral", lat: -6.1695, lng: 106.8312, orientationAzimuth: 270, location: "Jakarta, Indonesia", citySlug: "jakarta", category: "religious", imageGradient: "from-stone-600 to-white", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Cathedral_of_Our_Lady_of_Assumption_Jakarta.jpg/640px-Cathedral_of_Our_Lady_of_Assumption_Jakarta.jpg" },
];

// ─── Ho Chi Minh City, Vietnam ───────────────────────────────────
const hoChiMinh: Landmark[] = [
  { id: "notre-dame-saigon", name: "Notre-Dame Cathedral Basilica", lat: 10.7798, lng: 106.699, orientationAzimuth: 225, location: "Ho Chi Minh City, Vietnam", citySlug: "ho-chi-minh-city", category: "religious", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Notre-Dame_Cathedral_Basilica_of_Saigon.jpg/640px-Notre-Dame_Cathedral_Basilica_of_Saigon.jpg" },
  { id: "independence-palace", name: "Independence Palace", lat: 10.7769, lng: 106.6953, orientationAzimuth: 180, location: "Ho Chi Minh City, Vietnam", citySlug: "ho-chi-minh-city", category: "historic", imageGradient: "from-stone-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Reunification_Palace_Ho_Chi_Minh_City.jpg/640px-Reunification_Palace_Ho_Chi_Minh_City.jpg" },
  { id: "bitexco-tower", name: "Bitexco Financial Tower", lat: 10.7717, lng: 106.7047, orientationAzimuth: 0, location: "Ho Chi Minh City, Vietnam", citySlug: "ho-chi-minh-city", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bitexco_Financial_Tower_2010.jpg/640px-Bitexco_Financial_Tower_2010.jpg" },
];

// ─── Manila, Philippines ─────────────────────────────────────────
const manila: Landmark[] = [
  { id: "rizal-monument", name: "Rizal Monument", lat: 14.5831, lng: 120.9794, orientationAzimuth: 270, location: "Manila, Philippines", citySlug: "manila", category: "monument", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Rizal_Monument.jpg/640px-Rizal_Monument.jpg" },
  { id: "intramuros", name: "Intramuros", lat: 14.5896, lng: 120.9745, orientationAzimuth: 180, location: "Manila, Philippines", citySlug: "manila", category: "historic", imageGradient: "from-stone-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Fort_Santiago_gate.jpg/640px-Fort_Santiago_gate.jpg" },
  { id: "san-agustin-church", name: "San Agustin Church", lat: 14.5888, lng: 120.975, orientationAzimuth: 270, location: "Manila, Philippines", citySlug: "manila", category: "religious", imageGradient: "from-stone-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/San_Agustin_Church_Manila.jpg/640px-San_Agustin_Church_Manila.jpg" },
];

// ─── Dhaka, Bangladesh ───────────────────────────────────────────
const dhaka: Landmark[] = [
  { id: "lalbagh-fort", name: "Lalbagh Fort", lat: 23.7192, lng: 90.3881, orientationAzimuth: 180, location: "Dhaka, Bangladesh", citySlug: "dhaka", category: "historic", imageGradient: "from-red-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg" },
  { id: "national-parliament-dhaka", name: "National Parliament House", lat: 23.7626, lng: 90.3786, orientationAzimuth: 0, location: "Dhaka, Bangladesh", citySlug: "dhaka", category: "modern", imageGradient: "from-slate-600 to-slate-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/National_Parliament_House_of_Bangladesh.jpg/640px-National_Parliament_House_of_Bangladesh.jpg" },
  { id: "ahsan-manzil", name: "Ahsan Manzil", lat: 23.7088, lng: 90.4057, orientationAzimuth: 180, location: "Dhaka, Bangladesh", citySlug: "dhaka", category: "historic", imageGradient: "from-pink-700 to-rose-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg" },
];

// ─── Karachi, Pakistan ───────────────────────────────────────────
const karachi: Landmark[] = [
  { id: "quaid-e-azam-mausoleum", name: "Mazar-e-Quaid", lat: 24.8754, lng: 67.0396, orientationAzimuth: 0, location: "Karachi, Pakistan", citySlug: "karachi", category: "monument", imageGradient: "from-white to-marble-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Mazar-e-Quaid_Karachi_2.jpg/640px-Mazar-e-Quaid_Karachi_2.jpg" },
  { id: "clifton-beach", name: "Clifton Beach", lat: 24.8056, lng: 67.0277, orientationAzimuth: 180, location: "Karachi, Pakistan", citySlug: "karachi", category: "natural", imageGradient: "from-sky-400 to-blue-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Clifton_Beach%2C_Karachi.jpg/640px-Clifton_Beach%2C_Karachi.jpg" },
];

// ─── Lahore, Pakistan ────────────────────────────────────────────
const lahore: Landmark[] = [
  { id: "badshahi-mosque", name: "Badshahi Mosque", lat: 31.5882, lng: 74.3104, orientationAzimuth: 270, location: "Lahore, Pakistan", citySlug: "lahore", category: "religious", imageGradient: "from-red-800 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Badshahi_Mosque_-_Lahore.jpg/640px-Badshahi_Mosque_-_Lahore.jpg" },
  { id: "lahore-fort", name: "Lahore Fort", lat: 31.588, lng: 74.3152, orientationAzimuth: 90, location: "Lahore, Pakistan", citySlug: "lahore", category: "historic", imageGradient: "from-amber-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lahore_Fort.jpg/640px-Lahore_Fort.jpg" },
  { id: "minar-e-pakistan", name: "Minar-e-Pakistan", lat: 31.5928, lng: 74.3098, orientationAzimuth: 0, location: "Lahore, Pakistan", citySlug: "lahore", category: "monument", imageGradient: "from-stone-600 to-green-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Minar-e-Pakistan.JPG/640px-Minar-e-Pakistan.JPG" },
];

// ─── Tehran, Iran ────────────────────────────────────────────────
const tehran: Landmark[] = [
  { id: "azadi-tower", name: "Azadi Tower", lat: 35.6993, lng: 51.338, orientationAzimuth: 0, location: "Tehran, Iran", citySlug: "tehran", category: "monument", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Azadi_Tower_2014.jpg/640px-Azadi_Tower_2014.jpg" },
  { id: "milad-tower", name: "Milad Tower", lat: 35.7448, lng: 51.3754, orientationAzimuth: 0, location: "Tehran, Iran", citySlug: "tehran", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Milad_Tower_Tehran.jpg/640px-Milad_Tower_Tehran.jpg" },
  { id: "golestan-palace", name: "Golestan Palace", lat: 35.6762, lng: 51.4216, orientationAzimuth: 180, location: "Tehran, Iran", citySlug: "tehran", category: "historic", imageGradient: "from-amber-700 to-blue-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Iranian_Throne_%28Golestan_Palace%29.jpg/640px-Iranian_Throne_%28Golestan_Palace%29.jpg" },
];

// ─── Istanbul, Turkey ────────────────────────────────────────────
const istanbul: Landmark[] = [
  { id: "hagia-sophia", name: "Hagia Sophia", lat: 41.0086, lng: 28.9802, orientationAzimuth: 110, location: "Istanbul, Turkey", citySlug: "istanbul", category: "religious", imageGradient: "from-red-800 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_in_Istanbul_2023.jpg/640px-Hagia_Sophia_in_Istanbul_2023.jpg" },
  { id: "blue-mosque", name: "Blue Mosque", lat: 41.0054, lng: 28.9768, orientationAzimuth: 135, location: "Istanbul, Turkey", citySlug: "istanbul", category: "religious", imageGradient: "from-blue-800 to-blue-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Blue_Mosque%2C_Istanbul%2C_Turkey.jpg/640px-Blue_Mosque%2C_Istanbul%2C_Turkey.jpg" },
  { id: "topkapi-palace", name: "Topkapı Palace", lat: 41.0115, lng: 28.9833, orientationAzimuth: 90, location: "Istanbul, Turkey", citySlug: "istanbul", category: "historic", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Topkapi_Palace_2007.jpg/640px-Topkapi_Palace_2007.jpg" },
  { id: "galata-tower", name: "Galata Tower", lat: 41.0256, lng: 28.9741, orientationAzimuth: 0, location: "Istanbul, Turkey", citySlug: "istanbul", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Galata_Tower_-_P%C3%A9ter_Kis.jpg/640px-Galata_Tower_-_P%C3%A9ter_Kis.jpg" },
  { id: "bosphorus-bridge", name: "Bosphorus Bridge", lat: 41.0451, lng: 29.0343, orientationAzimuth: 45, location: "Istanbul, Turkey", citySlug: "istanbul", category: "modern", imageGradient: "from-blue-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Bosphorus_bridge.jpg/640px-Bosphorus_bridge.jpg" },
  { id: "basilica-cistern", name: "Basilica Cistern", lat: 41.0084, lng: 28.9779, orientationAzimuth: 0, location: "Istanbul, Turkey", citySlug: "istanbul", category: "historic", imageGradient: "from-slate-800 to-red-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Basilica_Cistern_20041213_01.jpg/640px-Basilica_Cistern_20041213_01.jpg" },
  { id: "grand-bazaar", name: "Grand Bazaar", lat: 41.0107, lng: 28.968, orientationAzimuth: 0, location: "Istanbul, Turkey", citySlug: "istanbul", category: "historic", imageGradient: "from-amber-600 to-red-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Grand_Bazaar_Istanbul.jpg/640px-Grand_Bazaar_Istanbul.jpg" },
];

// ─── Ankara, Turkey ──────────────────────────────────────────────
const ankara: Landmark[] = [
  { id: "anitkabir", name: "Anıtkabir", lat: 39.9254, lng: 32.8369, orientationAzimuth: 0, location: "Ankara, Turkey", citySlug: "ankara", category: "monument", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Anitkabir.jpg/640px-Anitkabir.jpg" },
  { id: "kocatepe-mosque", name: "Kocatepe Mosque", lat: 39.9188, lng: 32.8584, orientationAzimuth: 135, location: "Ankara, Turkey", citySlug: "ankara", category: "religious", imageGradient: "from-white to-slate-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Kocatepe_Camii_2011.jpg/640px-Kocatepe_Camii_2011.jpg" },
];

// ─── Dubai, UAE ──────────────────────────────────────────────────
const dubai: Landmark[] = [
  { id: "burj-khalifa", name: "Burj Khalifa", lat: 25.1972, lng: 55.2744, orientationAzimuth: 0, location: "Dubai, UAE", citySlug: "dubai", category: "modern", imageGradient: "from-sky-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Burj_Khalifa_by_Emaar.jpg/640px-Burj_Khalifa_by_Emaar.jpg" },
  { id: "burj-al-arab", name: "Burj Al Arab", lat: 25.1412, lng: 55.1853, orientationAzimuth: 0, location: "Dubai, UAE", citySlug: "dubai", category: "modern", imageGradient: "from-sky-400 to-blue-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Burj_Al_Arab%2C_Dubai_by_Joi_Ito_Dec2007.jpg/640px-Burj_Al_Arab%2C_Dubai_by_Joi_Ito_Dec2007.jpg" },
  { id: "palm-jumeirah", name: "Palm Jumeirah", lat: 25.1124, lng: 55.139, orientationAzimuth: 0, location: "Dubai, UAE", citySlug: "dubai", category: "modern", imageGradient: "from-cyan-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Palm_Jumeirah_aerial_view.jpg/640px-Palm_Jumeirah_aerial_view.jpg" },
  { id: "dubai-frame", name: "Dubai Frame", lat: 25.2354, lng: 55.3002, orientationAzimuth: 0, location: "Dubai, UAE", citySlug: "dubai", category: "modern", imageGradient: "from-amber-500 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Dubai_Frame_2019.jpg/640px-Dubai_Frame_2019.jpg" },
  { id: "dubai-mall", name: "Dubai Mall & Fountain", lat: 25.1985, lng: 55.2796, orientationAzimuth: 0, location: "Dubai, UAE", citySlug: "dubai", category: "modern", imageGradient: "from-blue-500 to-cyan-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dubai_Mall.jpg/640px-Dubai_Mall.jpg" },
  { id: "museum-of-the-future", name: "Museum of the Future", lat: 25.2195, lng: 55.2809, orientationAzimuth: 315, location: "Dubai, UAE", citySlug: "dubai", category: "modern", imageGradient: "from-emerald-600 to-teal-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Museum_of_the_Future_Dubai.jpg/640px-Museum_of_the_Future_Dubai.jpg" },
];

// ─── Abu Dhabi, UAE ──────────────────────────────────────────────
const abuDhabi: Landmark[] = [
  { id: "sheikh-zayed-mosque", name: "Sheikh Zayed Grand Mosque", lat: 24.4128, lng: 54.4753, orientationAzimuth: 315, location: "Abu Dhabi, UAE", citySlug: "abu-dhabi", category: "religious", imageGradient: "from-white to-amber-200", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Sheikh_Zayed_Grand_Mosque_Center.jpg/640px-Sheikh_Zayed_Grand_Mosque_Center.jpg" },
  { id: "louvre-abu-dhabi", name: "Louvre Abu Dhabi", lat: 24.5336, lng: 54.3983, orientationAzimuth: 0, location: "Abu Dhabi, UAE", citySlug: "abu-dhabi", category: "modern", imageGradient: "from-slate-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Louvre_Abu_Dhabi_-_from_the_sea_%2846948697812%29.jpg/640px-Louvre_Abu_Dhabi_-_from_the_sea_%2846948697812%29.jpg" },
  { id: "qasr-al-watan", name: "Qasr Al Watan", lat: 24.4623, lng: 54.3243, orientationAzimuth: 0, location: "Abu Dhabi, UAE", citySlug: "abu-dhabi", category: "historic", imageGradient: "from-white to-amber-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Qasr_Al_Watan_Palace_Abu_Dhabi_3.jpg/640px-Qasr_Al_Watan_Palace_Abu_Dhabi_3.jpg" },
];

// ─── Riyadh, Saudi Arabia ────────────────────────────────────────
const riyadh: Landmark[] = [
  { id: "kingdom-centre", name: "Kingdom Centre", lat: 24.7112, lng: 46.6745, orientationAzimuth: 0, location: "Riyadh, Saudi Arabia", citySlug: "riyadh", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Kingdom_Centre_Tower_Riyadh.jpg/640px-Kingdom_Centre_Tower_Riyadh.jpg" },
  { id: "masmak-fortress", name: "Masmak Fortress", lat: 24.6311, lng: 46.7134, orientationAzimuth: 0, location: "Riyadh, Saudi Arabia", citySlug: "riyadh", category: "historic", imageGradient: "from-amber-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Masmak_fortress_in_Riyadh.JPG/640px-Masmak_fortress_in_Riyadh.JPG" },
];

// ─── Baghdad, Iraq ───────────────────────────────────────────────
const baghdad: Landmark[] = [
  { id: "al-kadhimiya-mosque", name: "Al-Kadhimiya Mosque", lat: 33.3815, lng: 44.3398, orientationAzimuth: 225, location: "Baghdad, Iraq", citySlug: "baghdad", category: "religious", imageGradient: "from-amber-600 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Al-Kadhimiya_Mosque.jpg/640px-Al-Kadhimiya_Mosque.jpg" },
  { id: "baghdad-tower", name: "Baghdad Tower", lat: 33.3081, lng: 44.3667, orientationAzimuth: 0, location: "Baghdad, Iraq", citySlug: "baghdad", category: "modern", imageGradient: "from-slate-600 to-slate-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Baghdad_TV_Tower.jpg/640px-Baghdad_TV_Tower.jpg" },
];

// ─── Jerusalem, Israel ───────────────────────────────────────────
const jerusalem: Landmark[] = [
  { id: "dome-of-the-rock", name: "Dome of the Rock", lat: 31.778, lng: 35.2354, orientationAzimuth: 0, location: "Jerusalem, Israel", citySlug: "jerusalem", category: "religious", imageGradient: "from-amber-500 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Dome_of_the_rock.jpg/640px-Dome_of_the_rock.jpg" },
  { id: "western-wall", name: "Western Wall", lat: 31.7767, lng: 35.2345, orientationAzimuth: 270, location: "Jerusalem, Israel", citySlug: "jerusalem", category: "religious", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Western_Wall_-_Kotel.JPG/640px-Western_Wall_-_Kotel.JPG" },
  { id: "church-holy-sepulchre", name: "Church of the Holy Sepulchre", lat: 31.7785, lng: 35.2296, orientationAzimuth: 90, location: "Jerusalem, Israel", citySlug: "jerusalem", category: "religious", imageGradient: "from-stone-500 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jerusalem_Holy_Sepulchre_BW_1.JPG/640px-Jerusalem_Holy_Sepulchre_BW_1.JPG" },
  { id: "tower-of-david", name: "Tower of David", lat: 31.7764, lng: 35.2287, orientationAzimuth: 0, location: "Jerusalem, Israel", citySlug: "jerusalem", category: "historic", imageGradient: "from-stone-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tower_of_David_Jerusalem.jpg/640px-Tower_of_David_Jerusalem.jpg" },
];

// ─── Remaining cities with fewer landmarks ───────────────────────

const surat: Landmark[] = [
  { id: "surat-castle", name: "Surat Castle", lat: 21.1882, lng: 72.8363, orientationAzimuth: 180, location: "Surat, India", citySlug: "surat", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Surat_Castle.jpg/640px-Surat_Castle.jpg" },
];

const pune: Landmark[] = [
  { id: "shaniwar-wada", name: "Shaniwar Wada", lat: 18.5196, lng: 73.8553, orientationAzimuth: 0, location: "Pune, India", citySlug: "pune", category: "historic", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Shaniwar_Wada.jpg/640px-Shaniwar_Wada.jpg" },
  { id: "aga-khan-palace", name: "Aga Khan Palace", lat: 18.5527, lng: 73.9019, orientationAzimuth: 180, location: "Pune, India", citySlug: "pune", category: "historic", imageGradient: "from-stone-500 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Aga_Khan_Palace_Pune.JPG/640px-Aga_Khan_Palace_Pune.JPG" },
];

const ahmedabad: Landmark[] = [
  { id: "sabarmati-ashram", name: "Sabarmati Ashram", lat: 23.0607, lng: 72.5801, orientationAzimuth: 270, location: "Ahmedabad, India", citySlug: "ahmedabad", category: "historic", imageGradient: "from-white to-stone-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sabarmati_Ashram.jpg/640px-Sabarmati_Ashram.jpg" },
  { id: "adalaj-stepwell", name: "Adalaj Stepwell", lat: 23.1668, lng: 72.5815, orientationAzimuth: 0, location: "Ahmedabad, India", citySlug: "ahmedabad", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Adalaj_Stepwell.JPG/640px-Adalaj_Stepwell.JPG" },
];

const tianjin: Landmark[] = [
  { id: "tianjin-eye", name: "Tianjin Eye", lat: 39.1476, lng: 117.1718, orientationAzimuth: 0, location: "Tianjin, China", citySlug: "tianjin", category: "modern", imageGradient: "from-blue-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Tianjin_Eye.jpg/640px-Tianjin_Eye.jpg" },
];

const shenyang: Landmark[] = [
  { id: "shenyang-imperial-palace", name: "Shenyang Imperial Palace", lat: 41.7953, lng: 123.456, orientationAzimuth: 180, location: "Shenyang, China", citySlug: "shenyang", category: "historic", imageGradient: "from-red-800 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Shenyang_Imperial_Palace.jpg/640px-Shenyang_Imperial_Palace.jpg" },
];

const dongguan: Landmark[] = [
  { id: "keyuan-garden", name: "Keyuan Garden", lat: 23.0453, lng: 113.7394, orientationAzimuth: 0, location: "Dongguan, China", citySlug: "dongguan", category: "historic", imageGradient: "from-green-700 to-emerald-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Keyuan_Garden_%28Dongguan%29.jpg/640px-Keyuan_Garden_%28Dongguan%29.jpg" },
];

const foshan: Landmark[] = [
  { id: "foshan-ancestral-temple", name: "Foshan Ancestral Temple", lat: 23.0271, lng: 113.1145, orientationAzimuth: 180, location: "Foshan, China", citySlug: "foshan", category: "historic", imageGradient: "from-red-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Foshan_Zu_Miao_02.jpg/640px-Foshan_Zu_Miao_02.jpg" },
];

const suzhou: Landmark[] = [
  { id: "humble-administrator-garden", name: "Humble Administrator's Garden", lat: 31.3247, lng: 120.6299, orientationAzimuth: 180, location: "Suzhou, China", citySlug: "suzhou", category: "historic", imageGradient: "from-green-700 to-emerald-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Humble_Administrator%27s_Garden_Suzhou.jpg/640px-Humble_Administrator%27s_Garden_Suzhou.jpg" },
  { id: "tiger-hill", name: "Tiger Hill", lat: 31.3313, lng: 120.5715, orientationAzimuth: 0, location: "Suzhou, China", citySlug: "suzhou", category: "natural", imageGradient: "from-green-800 to-green-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Tiger_Hill_Suzhou.jpg/640px-Tiger_Hill_Suzhou.jpg" },
];



// ─── London, United Kingdom ──────────────────────────────────────
const london: Landmark[] = [
  { id: "tower-bridge", name: "Tower Bridge", lat: 51.5055, lng: -0.0754, orientationAzimuth: 90, location: "London, UK", citySlug: "london", category: "historic", imageGradient: "from-blue-800 to-slate-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tower_Bridge_from_Shad_Thames.jpg/640px-Tower_Bridge_from_Shad_Thames.jpg" },
  { id: "big-ben", name: "Big Ben & Palace of Westminster", lat: 51.5007, lng: -0.1246, orientationAzimuth: 0, location: "London, UK", citySlug: "london", category: "historic", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Clock_Tower_-_Palace_of_Westminster%2C_London_-_September_2006.jpg/640px-Clock_Tower_-_Palace_of_Westminster,_London_-_September_2006.jpg" },
  { id: "london-eye", name: "London Eye", lat: 51.5033, lng: -0.1196, orientationAzimuth: 0, location: "London, UK", citySlug: "london", category: "modern", imageGradient: "from-sky-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_London_Eye_September_2009.jpg/640px-The_London_Eye_September_2009.jpg" },
  { id: "buckingham-palace", name: "Buckingham Palace", lat: 51.5014, lng: -0.1419, orientationAzimuth: 90, location: "London, UK", citySlug: "london", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Buckingham_Palace%2C_London_-_April_2009.jpg/640px-Buckingham_Palace,_London_-_April_2009.jpg" },
  { id: "st-pauls-cathedral", name: "St Paul's Cathedral", lat: 51.5138, lng: -0.0984, orientationAzimuth: 270, location: "London, UK", citySlug: "london", category: "religious", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/St_Pauls_Cathedral%2C_London%2C_England_-_Jan_2010.jpg/640px-St_Pauls_Cathedral,_London,_England_-_Jan_2010.jpg" },
  { id: "tower-of-london", name: "Tower of London", lat: 51.5081, lng: -0.0759, orientationAzimuth: 180, location: "London, UK", citySlug: "london", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Tower_of_London_viewed_from_the_River_Thames.jpg/640px-Tower_of_London_viewed_from_the_River_Thames.jpg" },
  { id: "the-shard", name: "The Shard", lat: 51.5045, lng: -0.0865, orientationAzimuth: 0, location: "London, UK", citySlug: "london", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/The_Shard%2C_London.jpg/640px-The_Shard,_London.jpg" },
  { id: "westminster-abbey", name: "Westminster Abbey", lat: 51.4993, lng: -0.1273, orientationAzimuth: 90, location: "London, UK", citySlug: "london", category: "religious", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Westminster_Abbey_Exterior%2C_London_-_Sept_2006.jpg/640px-Westminster_Abbey_Exterior,_London_-_Sept_2006.jpg" },
  { id: "trafalgar-square", name: "Trafalgar Square", lat: 51.508, lng: -0.1281, orientationAzimuth: 0, location: "London, UK", citySlug: "london", category: "monument", imageGradient: "from-slate-500 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Trafalgar_Square%2C_London_2006.jpg/640px-Trafalgar_Square,_London_2006.jpg" },
  { id: "greenwich-observatory", name: "Royal Observatory Greenwich", lat: 51.4769, lng: -0.0005, orientationAzimuth: 0, location: "London, UK", citySlug: "london", category: "historic", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Royal_Observatory_Greenwich.jpg/640px-Royal_Observatory_Greenwich.jpg" },
];

// ─── Paris, France ───────────────────────────────────────────────
const paris: Landmark[] = [
  { id: "eiffel-tower", name: "Eiffel Tower", lat: 48.8584, lng: 2.2945, orientationAzimuth: 315, location: "Paris, France", citySlug: "paris", category: "monument", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/640px-Tour_Eiffel_Wikimedia_Commons.jpg" },
  { id: "arc-de-triomphe", name: "Arc de Triomphe", lat: 48.8738, lng: 2.295, orientationAzimuth: 296, location: "Paris, France", citySlug: "paris", category: "monument", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Arc_de_Triomphe%2C_Paris_%282007%29.jpg/640px-Arc_de_Triomphe,_Paris_(2007).jpg" },
  { id: "notre-dame-paris", name: "Notre-Dame de Paris", lat: 48.853, lng: 2.3499, orientationAzimuth: 113, location: "Paris, France", citySlug: "paris", category: "religious", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cath%C3%A9drale_Notre-Dame_de_Paris%2C_29_March_2014.jpg/640px-Cathédrale_Notre-Dame_de_Paris,_29_March_2014.jpg" },
  { id: "sacre-coeur", name: "Sacré-Cœur", lat: 48.8867, lng: 2.3431, orientationAzimuth: 180, location: "Paris, France", citySlug: "paris", category: "religious", imageGradient: "from-white to-stone-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sacre_Coeur_Montmartre_church%2C_Paris_August_2017.jpg/640px-Sacre_Coeur_Montmartre_church,_Paris_August_2017.jpg" },
  { id: "louvre-pyramid", name: "Louvre Pyramid", lat: 48.8611, lng: 2.3358, orientationAzimuth: 0, location: "Paris, France", citySlug: "paris", category: "modern", imageGradient: "from-slate-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/640px-Louvre_Museum_Wikimedia_Commons.jpg" },
  { id: "pantheon-paris", name: "Panthéon", lat: 48.8462, lng: 2.3464, orientationAzimuth: 0, location: "Paris, France", citySlug: "paris", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Paris_Pantheon_Facade.jpg/640px-Paris_Pantheon_Facade.jpg" },
  { id: "place-de-la-concorde", name: "Place de la Concorde", lat: 48.8656, lng: 2.3212, orientationAzimuth: 296, location: "Paris, France", citySlug: "paris", category: "monument", imageGradient: "from-amber-500 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Place_de_la_Concorde_2007.jpg/640px-Place_de_la_Concorde_2007.jpg" },
  { id: "pont-alexandre-iii", name: "Pont Alexandre III", lat: 48.8637, lng: 2.3136, orientationAzimuth: 150, location: "Paris, France", citySlug: "paris", category: "historic", imageGradient: "from-amber-600 to-emerald-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Pont_Alexandre_III%2C_Paris_2008.jpg/640px-Pont_Alexandre_III,_Paris_2008.jpg" },
  { id: "tour-montparnasse", name: "Tour Montparnasse", lat: 48.8422, lng: 2.3219, orientationAzimuth: 0, location: "Paris, France", citySlug: "paris", category: "modern", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tour_Maine-Montparnasse_summer_2007.jpg/640px-Tour_Maine-Montparnasse_summer_2007.jpg" },
  { id: "musee-dorsay", name: "Musée d'Orsay", lat: 48.86, lng: 2.3266, orientationAzimuth: 135, location: "Paris, France", citySlug: "paris", category: "historic", imageGradient: "from-amber-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Mus%C3%A9e_d%27Orsay%2C_North_face.jpg/640px-Musée_d'Orsay,_North_face.jpg" },
];

// ─── Rome, Italy ─────────────────────────────────────────────────
const rome: Landmark[] = [
  { id: "colosseum", name: "Colosseum", lat: 41.8902, lng: 12.4922, orientationAzimuth: 0, location: "Rome, Italy", citySlug: "rome", category: "historic", imageGradient: "from-amber-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/640px-Colosseo_2020.jpg" },
  { id: "st-peters-basilica", name: "St. Peter's Basilica", lat: 41.9022, lng: 12.4539, orientationAzimuth: 90, location: "Rome, Italy", citySlug: "rome", category: "religious", imageGradient: "from-white to-amber-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Saint_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg/640px-Saint_Peter's_Square,_Vatican_City_-_April_2007.jpg" },
  { id: "trevi-fountain", name: "Trevi Fountain", lat: 41.9009, lng: 12.4833, orientationAzimuth: 180, location: "Rome, Italy", citySlug: "rome", category: "monument", imageGradient: "from-cyan-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fontana_di_Trevi_2015.jpg/640px-Fontana_di_Trevi_2015.jpg" },
  { id: "roman-forum", name: "Roman Forum", lat: 41.8925, lng: 12.4853, orientationAzimuth: 135, location: "Rome, Italy", citySlug: "rome", category: "historic", imageGradient: "from-stone-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Roman_Forum_2007.jpg/640px-Roman_Forum_2007.jpg" },
  { id: "pantheon-rome", name: "Pantheon", lat: 41.8986, lng: 12.4769, orientationAzimuth: 180, location: "Rome, Italy", citySlug: "rome", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Pantheon%28Rome%29_from_outside.jpg/640px-Pantheon(Rome)_from_outside.jpg" },
  { id: "castel-sant-angelo", name: "Castel Sant'Angelo", lat: 41.903, lng: 12.4663, orientationAzimuth: 90, location: "Rome, Italy", citySlug: "rome", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Castel_sant%27angelo.jpg/640px-Castel_sant'angelo.jpg" },
  { id: "spanish-steps", name: "Spanish Steps", lat: 41.906, lng: 12.4828, orientationAzimuth: 215, location: "Rome, Italy", citySlug: "rome", category: "monument", imageGradient: "from-amber-500 to-rose-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Spanish_steps_in_Rome.jpg/640px-Spanish_steps_in_Rome.jpg" },
  { id: "piazza-navona", name: "Piazza Navona", lat: 41.8992, lng: 12.4731, orientationAzimuth: 0, location: "Rome, Italy", citySlug: "rome", category: "historic", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Piazza_navona_fountain_detail.jpg/640px-Piazza_navona_fountain_detail.jpg" },
];

// ─── Milan, Italy ────────────────────────────────────────────────
const milan: Landmark[] = [
  { id: "duomo-di-milano", name: "Duomo di Milano", lat: 45.4642, lng: 9.1919, orientationAzimuth: 270, location: "Milan, Italy", citySlug: "milan", category: "religious", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Duomo_Milano_2012_%285%29.jpg/640px-Duomo_Milano_2012_(5).jpg" },
  { id: "galleria-vittorio", name: "Galleria Vittorio Emanuele II", lat: 45.4658, lng: 9.19, orientationAzimuth: 0, location: "Milan, Italy", citySlug: "milan", category: "historic", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Galleria_Vittorio_Emanuele_II_2013_Interior.jpg/640px-Galleria_Vittorio_Emanuele_II_2013_Interior.jpg" },
  { id: "castello-sforzesco", name: "Castello Sforzesco", lat: 45.4705, lng: 9.1794, orientationAzimuth: 180, location: "Milan, Italy", citySlug: "milan", category: "historic", imageGradient: "from-red-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Castello_Sforzesco_a_Milano.jpg/640px-Castello_Sforzesco_a_Milano.jpg" },
  { id: "bosco-verticale", name: "Bosco Verticale", lat: 45.4861, lng: 9.1901, orientationAzimuth: 0, location: "Milan, Italy", citySlug: "milan", category: "modern", imageGradient: "from-green-600 to-emerald-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bosco_Verticale_March_2014.jpg/640px-Bosco_Verticale_March_2014.jpg" },
];

// ─── Berlin, Germany ─────────────────────────────────────────────
const berlin: Landmark[] = [
  { id: "brandenburg-gate", name: "Brandenburg Gate", lat: 52.5163, lng: 13.3777, orientationAzimuth: 270, location: "Berlin, Germany", citySlug: "berlin", category: "monument", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Brandenburg_Gate_at_night_2.jpg/640px-Brandenburg_Gate_at_night_2.jpg" },
  { id: "berlin-tv-tower", name: "Fernsehturm (TV Tower)", lat: 52.5208, lng: 13.4094, orientationAzimuth: 0, location: "Berlin, Germany", citySlug: "berlin", category: "modern", imageGradient: "from-slate-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Fernsehturm_Berlin_2006.jpg/640px-Fernsehturm_Berlin_2006.jpg" },
  { id: "reichstag", name: "Reichstag Building", lat: 52.5186, lng: 13.3762, orientationAzimuth: 270, location: "Berlin, Germany", citySlug: "berlin", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Reichstag_building_Berlin_view_from_west_before_sunset.jpg/640px-Reichstag_building_Berlin_view_from_west_before_sunset.jpg" },
  { id: "berlin-cathedral", name: "Berlin Cathedral", lat: 52.5191, lng: 13.4014, orientationAzimuth: 270, location: "Berlin, Germany", citySlug: "berlin", category: "religious", imageGradient: "from-green-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Berliner_Dom_2021.jpg/640px-Berliner_Dom_2021.jpg" },
  { id: "east-side-gallery", name: "East Side Gallery", lat: 52.5053, lng: 13.4396, orientationAzimuth: 90, location: "Berlin, Germany", citySlug: "berlin", category: "monument", imageGradient: "from-pink-500 to-blue-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/East_Side_Gallery_Berlin_2010.jpg/640px-East_Side_Gallery_Berlin_2010.jpg" },
  { id: "checkpoint-charlie", name: "Checkpoint Charlie", lat: 52.5075, lng: 13.3904, orientationAzimuth: 0, location: "Berlin, Germany", citySlug: "berlin", category: "historic", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Checkpoint_charlie_2004.jpg/640px-Checkpoint_charlie_2004.jpg" },
  { id: "memorial-murdered-jews", name: "Holocaust Memorial", lat: 52.5139, lng: 13.3789, orientationAzimuth: 0, location: "Berlin, Germany", citySlug: "berlin", category: "monument", imageGradient: "from-slate-800 to-slate-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Memorial_to_the_Murdered_Jews_of_Europe.jpg/640px-Memorial_to_the_Murdered_Jews_of_Europe.jpg" },
];

// ─── Munich, Germany ─────────────────────────────────────────────
const munich: Landmark[] = [
  { id: "frauenkirche-munich", name: "Frauenkirche", lat: 48.1386, lng: 11.5735, orientationAzimuth: 90, location: "Munich, Germany", citySlug: "munich", category: "religious", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Muenchen_Frauenkirche_0097.JPG/640px-Muenchen_Frauenkirche_0097.JPG" },
  { id: "marienplatz", name: "Marienplatz & Neues Rathaus", lat: 48.1374, lng: 11.5755, orientationAzimuth: 0, location: "Munich, Germany", citySlug: "munich", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Neues_Rathaus_Muenchen.jpg/640px-Neues_Rathaus_Muenchen.jpg" },
  { id: "nymphenburg-palace", name: "Nymphenburg Palace", lat: 48.1583, lng: 11.5036, orientationAzimuth: 90, location: "Munich, Germany", citySlug: "munich", category: "historic", imageGradient: "from-amber-500 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Schloss_Nymphenburg_2013.jpg/640px-Schloss_Nymphenburg_2013.jpg" },
  { id: "olympic-park-munich", name: "Olympic Park & Tower", lat: 48.1735, lng: 11.5466, orientationAzimuth: 0, location: "Munich, Germany", citySlug: "munich", category: "modern", imageGradient: "from-green-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Olympiastadion_M%C3%BCnchen_Innen_Ost.JPG/640px-Olympiastadion_München_Innen_Ost.JPG" },
];

// ─── Hamburg, Germany ────────────────────────────────────────────
const hamburg: Landmark[] = [
  { id: "elbphilharmonie", name: "Elbphilharmonie", lat: 53.5413, lng: 9.9842, orientationAzimuth: 180, location: "Hamburg, Germany", citySlug: "hamburg", category: "modern", imageGradient: "from-blue-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Elbphilharmonie.jpg/640px-Elbphilharmonie.jpg" },
  { id: "speicherstadt", name: "Speicherstadt", lat: 53.5437, lng: 9.9907, orientationAzimuth: 0, location: "Hamburg, Germany", citySlug: "hamburg", category: "historic", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Hamburg_Speicherstadt_at_sunset.jpg/640px-Hamburg_Speicherstadt_at_sunset.jpg" },
  { id: "st-michaelis-church", name: "St. Michael's Church", lat: 53.5484, lng: 9.9789, orientationAzimuth: 0, location: "Hamburg, Germany", citySlug: "hamburg", category: "religious", imageGradient: "from-green-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Hamburg_Michel.jpg/640px-Hamburg_Michel.jpg" },
];

// ─── Madrid, Spain ───────────────────────────────────────────────
const madrid: Landmark[] = [
  { id: "royal-palace-madrid", name: "Royal Palace of Madrid", lat: 40.4179, lng: -3.7143, orientationAzimuth: 180, location: "Madrid, Spain", citySlug: "madrid", category: "historic", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Palacio_Real_de_Madrid_-_01.jpg/640px-Palacio_Real_de_Madrid_-_01.jpg" },
  { id: "puerta-del-sol", name: "Puerta del Sol", lat: 40.4169, lng: -3.7035, orientationAzimuth: 0, location: "Madrid, Spain", citySlug: "madrid", category: "historic", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Puerta_del_Sol_2018.jpg/640px-Puerta_del_Sol_2018.jpg" },
  { id: "plaza-mayor-madrid", name: "Plaza Mayor", lat: 40.4155, lng: -3.7074, orientationAzimuth: 0, location: "Madrid, Spain", citySlug: "madrid", category: "historic", imageGradient: "from-red-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Madrid_-_Plaza_Mayor_2012.jpg/640px-Madrid_-_Plaza_Mayor_2012.jpg" },
  { id: "prado-museum", name: "Museo del Prado", lat: 40.4138, lng: -3.6921, orientationAzimuth: 270, location: "Madrid, Spain", citySlug: "madrid", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Museo_del_Prado_2016_%2830474877060%29.jpg/640px-Museo_del_Prado_2016_(30474877060).jpg" },
  { id: "almudena-cathedral", name: "Almudena Cathedral", lat: 40.4157, lng: -3.7145, orientationAzimuth: 90, location: "Madrid, Spain", citySlug: "madrid", category: "religious", imageGradient: "from-stone-500 to-white", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Almudena_Cathedral_%28Madrid%29_HDR.jpg/640px-Almudena_Cathedral_(Madrid)_HDR.jpg" },
  { id: "retiro-park", name: "Retiro Park & Crystal Palace", lat: 40.4153, lng: -3.6845, orientationAzimuth: 0, location: "Madrid, Spain", citySlug: "madrid", category: "natural", imageGradient: "from-green-600 to-emerald-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Parque_del_Buen_Retiro%2C_Madrid%2C_2014.jpg/640px-Parque_del_Buen_Retiro,_Madrid,_2014.jpg" },
];

// ─── Barcelona, Spain ────────────────────────────────────────────
const barcelona: Landmark[] = [
  { id: "sagrada-familia", name: "Sagrada Família", lat: 41.4036, lng: 2.1744, orientationAzimuth: 135, location: "Barcelona, Spain", citySlug: "barcelona", category: "religious", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Sagrada_Familia_01.jpg/640px-Sagrada_Familia_01.jpg" },
  { id: "park-guell", name: "Park Güell", lat: 41.4145, lng: 2.1527, orientationAzimuth: 180, location: "Barcelona, Spain", citySlug: "barcelona", category: "modern", imageGradient: "from-green-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Park_G%C3%BCell%2C_Barcelona%2C_Spain_%2819%29.jpg/640px-Park_Güell,_Barcelona,_Spain_(19).jpg" },
  { id: "casa-batllo", name: "Casa Batlló", lat: 41.3916, lng: 2.165, orientationAzimuth: 225, location: "Barcelona, Spain", citySlug: "barcelona", category: "modern", imageGradient: "from-blue-600 to-cyan-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Casa_Batll%C3%B3_%282006%29.jpg/640px-Casa_Batlló_(2006).jpg" },
  { id: "casa-mila", name: "Casa Milà (La Pedrera)", lat: 41.3953, lng: 2.162, orientationAzimuth: 225, location: "Barcelona, Spain", citySlug: "barcelona", category: "modern", imageGradient: "from-stone-500 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/BarcelonaCasaMila.jpg/640px-BarcelonaCasaMila.jpg" },
  { id: "barceloneta-beach", name: "Barceloneta Beach", lat: 41.3784, lng: 2.1924, orientationAzimuth: 135, location: "Barcelona, Spain", citySlug: "barcelona", category: "natural", imageGradient: "from-sky-400 to-blue-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Barceloneta_Beach_%28Barcelona%2C_Spain%29.jpg/640px-Barceloneta_Beach_(Barcelona,_Spain).jpg" },
  { id: "montjuic-castle", name: "Montjuïc Castle", lat: 41.3634, lng: 2.1662, orientationAzimuth: 0, location: "Barcelona, Spain", citySlug: "barcelona", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Castello_di_Montjuic.jpg/640px-Castello_di_Montjuic.jpg" },
  { id: "gothic-quarter", name: "Gothic Quarter (Barri Gòtic)", lat: 41.3825, lng: 2.1767, orientationAzimuth: 0, location: "Barcelona, Spain", citySlug: "barcelona", category: "historic", imageGradient: "from-stone-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Barri_G%C3%B2tic_01.jpg/640px-Barri_Gòtic_01.jpg" },
];

// ─── Valencia, Spain ─────────────────────────────────────────────
const valencia: Landmark[] = [
  { id: "city-of-arts-sciences", name: "City of Arts and Sciences", lat: 39.4536, lng: -0.3476, orientationAzimuth: 135, location: "Valencia, Spain", citySlug: "valencia", category: "modern", imageGradient: "from-white to-sky-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Valencia_Ciudad_de_las_Artes_y_las_Ciencias.jpg/640px-Valencia_Ciudad_de_las_Artes_y_las_Ciencias.jpg" },
  { id: "valencia-cathedral", name: "Valencia Cathedral", lat: 39.4751, lng: -0.3753, orientationAzimuth: 270, location: "Valencia, Spain", citySlug: "valencia", category: "religious", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Catedral_de_Valencia.jpg/640px-Catedral_de_Valencia.jpg" },
  { id: "lonja-de-la-seda", name: "Lonja de la Seda", lat: 39.4743, lng: -0.3787, orientationAzimuth: 0, location: "Valencia, Spain", citySlug: "valencia", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Lonja_de_la_Seda_de_Valencia_2013.jpg/640px-Lonja_de_la_Seda_de_Valencia_2013.jpg" },
];

// ─── Lisbon, Portugal ────────────────────────────────────────────
const lisbon: Landmark[] = [
  { id: "tower-of-belem", name: "Tower of Belém", lat: 38.6916, lng: -9.216, orientationAzimuth: 180, location: "Lisbon, Portugal", citySlug: "lisbon", category: "historic", imageGradient: "from-stone-500 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Belem_tower.JPG/640px-Belem_tower.JPG" },
  { id: "jeronimos-monastery", name: "Jerónimos Monastery", lat: 38.6979, lng: -9.2068, orientationAzimuth: 180, location: "Lisbon, Portugal", citySlug: "lisbon", category: "religious", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Mos_Jer%C3%B3nimos_8175.jpg/640px-Mos_Jerónimos_8175.jpg" },
  { id: "padrao-dos-descobrimentos", name: "Padrão dos Descobrimentos", lat: 38.6936, lng: -9.2097, orientationAzimuth: 180, location: "Lisbon, Portugal", citySlug: "lisbon", category: "monument", imageGradient: "from-stone-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Padrao_dos_Descobrimentos-Lissabon.jpg/640px-Padrao_dos_Descobrimentos-Lissabon.jpg" },
  { id: "sao-jorge-castle", name: "São Jorge Castle", lat: 38.7139, lng: -9.1334, orientationAzimuth: 180, location: "Lisbon, Portugal", citySlug: "lisbon", category: "historic", imageGradient: "from-stone-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Castelo_de_S%C3%A3o_Jorge%2C_Lisbon.jpg/640px-Castelo_de_São_Jorge,_Lisbon.jpg" },
  { id: "ponte-25-abril", name: "25 de Abril Bridge", lat: 38.6874, lng: -9.1775, orientationAzimuth: 180, location: "Lisbon, Portugal", citySlug: "lisbon", category: "modern", imageGradient: "from-red-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Ponte_25_de_Abril_%281%29.jpg/640px-Ponte_25_de_Abril_(1).jpg" },
];

// ─── Amsterdam, Netherlands ──────────────────────────────────────
const amsterdam: Landmark[] = [
  { id: "rijksmuseum", name: "Rijksmuseum", lat: 52.36, lng: 4.8852, orientationAzimuth: 0, location: "Amsterdam, Netherlands", citySlug: "amsterdam", category: "historic", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Rijksmuseum_-_The_Garden_2016.jpg/640px-Rijksmuseum_-_The_Garden_2016.jpg" },
  { id: "anne-frank-house", name: "Anne Frank House", lat: 52.3752, lng: 4.884, orientationAzimuth: 270, location: "Amsterdam, Netherlands", citySlug: "amsterdam", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Anne_Frank_House_2014.jpg/640px-Anne_Frank_House_2014.jpg" },
  { id: "dam-square", name: "Dam Square & Royal Palace", lat: 52.3733, lng: 4.8913, orientationAzimuth: 270, location: "Amsterdam, Netherlands", citySlug: "amsterdam", category: "historic", imageGradient: "from-stone-500 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Amsterdam_-_Dam_Square_2012.jpg/640px-Amsterdam_-_Dam_Square_2012.jpg" },
  { id: "westerkerk", name: "Westerkerk", lat: 52.3747, lng: 4.8842, orientationAzimuth: 0, location: "Amsterdam, Netherlands", citySlug: "amsterdam", category: "religious", imageGradient: "from-blue-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Westerkerk%2C_Amsterdam_-_April_2007.jpg/640px-Westerkerk,_Amsterdam_-_April_2007.jpg" },
  { id: "amsterdam-canals", name: "Canal Ring (Grachtengordel)", lat: 52.3667, lng: 4.8945, orientationAzimuth: 0, location: "Amsterdam, Netherlands", citySlug: "amsterdam", category: "historic", imageGradient: "from-green-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Amsterdam_canal_reflection_1.jpg/640px-Amsterdam_canal_reflection_1.jpg" },
];

// ─── Brussels, Belgium ───────────────────────────────────────────
const brussels: Landmark[] = [
  { id: "grand-place-brussels", name: "Grand-Place", lat: 50.8467, lng: 4.3525, orientationAzimuth: 0, location: "Brussels, Belgium", citySlug: "brussels", category: "historic", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Grand-Place%2C_Brussels%2C_Belgium_-_Jan_2006.jpg/640px-Grand-Place,_Brussels,_Belgium_-_Jan_2006.jpg" },
  { id: "atomium", name: "Atomium", lat: 50.8948, lng: 4.3418, orientationAzimuth: 0, location: "Brussels, Belgium", citySlug: "brussels", category: "modern", imageGradient: "from-slate-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Atomium_Brussels.jpg/640px-Atomium_Brussels.jpg" },
  { id: "manneken-pis", name: "Manneken Pis", lat: 50.845, lng: 4.3499, orientationAzimuth: 0, location: "Brussels, Belgium", citySlug: "brussels", category: "monument", imageGradient: "from-stone-500 to-cyan-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Manneken_Pis_Brussels.jpg/640px-Manneken_Pis_Brussels.jpg" },
];

// ─── Zurich, Switzerland ─────────────────────────────────────────
const zurich: Landmark[] = [
  { id: "grossmunster", name: "Grossmünster", lat: 47.3702, lng: 8.5437, orientationAzimuth: 270, location: "Zurich, Switzerland", citySlug: "zurich", category: "religious", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Grossmunster.jpg/640px-Grossmunster.jpg" },
  { id: "fraumunster", name: "Fraumünster", lat: 47.3695, lng: 8.5413, orientationAzimuth: 0, location: "Zurich, Switzerland", citySlug: "zurich", category: "religious", imageGradient: "from-green-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Zirich_-_Fr%C3%B6m%C3%BCnster_gnagelt.jpg/640px-Zirich_-_Frömünster_gnagelt.jpg" },
  { id: "lake-zurich", name: "Lake Zürich Promenade", lat: 47.3537, lng: 8.5418, orientationAzimuth: 180, location: "Zurich, Switzerland", citySlug: "zurich", category: "natural", imageGradient: "from-sky-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/ZurichSeen.jpg/640px-ZurichSeen.jpg" },
];

// ─── Vienna, Austria ─────────────────────────────────────────────
const vienna: Landmark[] = [
  { id: "stephansdom", name: "St. Stephen's Cathedral", lat: 48.2082, lng: 16.3738, orientationAzimuth: 90, location: "Vienna, Austria", citySlug: "vienna", category: "religious", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Stephansdom_Wien_Suedansicht.jpg/640px-Stephansdom_Wien_Suedansicht.jpg" },
  { id: "schonbrunn-palace", name: "Schönbrunn Palace", lat: 48.1845, lng: 16.3122, orientationAzimuth: 0, location: "Vienna, Austria", citySlug: "vienna", category: "historic", imageGradient: "from-amber-500 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Schonbrunn_Palace%2C_Vienna%2C_August_2014.jpg/640px-Schonbrunn_Palace,_Vienna,_August_2014.jpg" },
  { id: "belvedere-palace", name: "Belvedere Palace", lat: 48.1915, lng: 16.3808, orientationAzimuth: 0, location: "Vienna, Austria", citySlug: "vienna", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Oberes_Belvedere_Wien.jpg/640px-Oberes_Belvedere_Wien.jpg" },
  { id: "hofburg-palace", name: "Hofburg Palace", lat: 48.2066, lng: 16.3656, orientationAzimuth: 0, location: "Vienna, Austria", citySlug: "vienna", category: "historic", imageGradient: "from-stone-500 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Michaelerplatz%2C_Vienna.jpg/640px-Michaelerplatz,_Vienna.jpg" },
  { id: "prater-ferris-wheel", name: "Wiener Riesenrad (Giant Ferris Wheel)", lat: 48.2166, lng: 16.3966, orientationAzimuth: 0, location: "Vienna, Austria", citySlug: "vienna", category: "modern", imageGradient: "from-red-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Riesenrad_%28Wien%29.jpg/640px-Riesenrad_(Wien).jpg" },
];

// ─── Prague, Czech Republic ──────────────────────────────────────
const prague: Landmark[] = [
  { id: "charles-bridge", name: "Charles Bridge", lat: 50.0865, lng: 14.4114, orientationAzimuth: 270, location: "Prague, Czech Republic", citySlug: "prague", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Charles_Bridge_at_Dusk.jpg/640px-Charles_Bridge_at_Dusk.jpg" },
  { id: "prague-castle", name: "Prague Castle", lat: 50.0909, lng: 14.4013, orientationAzimuth: 180, location: "Prague, Czech Republic", citySlug: "prague", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Prazsky_hrad_2006.jpg/640px-Prazsky_hrad_2006.jpg" },
  { id: "old-town-square-prague", name: "Old Town Square & Astronomical Clock", lat: 50.0872, lng: 14.4213, orientationAzimuth: 180, location: "Prague, Czech Republic", citySlug: "prague", category: "historic", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Old_Town_Square%2C_Prague.jpg/640px-Old_Town_Square,_Prague.jpg" },
  { id: "st-vitus-cathedral", name: "St. Vitus Cathedral", lat: 50.0909, lng: 14.4005, orientationAzimuth: 270, location: "Prague, Czech Republic", citySlug: "prague", category: "religious", imageGradient: "from-slate-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Cathédrale_Saint-Guy_de_Prague.jpg/640px-Cathédrale_Saint-Guy_de_Prague.jpg" },
  { id: "dancing-house", name: "Dancing House", lat: 50.0755, lng: 14.4142, orientationAzimuth: 270, location: "Prague, Czech Republic", citySlug: "prague", category: "modern", imageGradient: "from-slate-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Dancing_House_Prague.jpg/640px-Dancing_House_Prague.jpg" },
];

// ─── Warsaw, Poland ──────────────────────────────────────────────
const warsaw: Landmark[] = [
  { id: "palace-of-culture-warsaw", name: "Palace of Culture and Science", lat: 52.2319, lng: 21.0067, orientationAzimuth: 0, location: "Warsaw, Poland", citySlug: "warsaw", category: "modern", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Palace_of_Culture_and_Science_in_Warsaw%2C_2013.jpg/640px-Palace_of_Culture_and_Science_in_Warsaw,_2013.jpg" },
  { id: "old-town-warsaw", name: "Old Town Market Square", lat: 52.2495, lng: 21.0121, orientationAzimuth: 0, location: "Warsaw, Poland", citySlug: "warsaw", category: "historic", imageGradient: "from-red-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Warsaw_Old_Town_2010.jpg/640px-Warsaw_Old_Town_2010.jpg" },
  { id: "royal-castle-warsaw", name: "Royal Castle", lat: 52.2479, lng: 21.0148, orientationAzimuth: 90, location: "Warsaw, Poland", citySlug: "warsaw", category: "historic", imageGradient: "from-red-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Zamek_Kr%C3%B3lewski_w_Warszawie_2009.jpg/640px-Zamek_Królewski_w_Warszawie_2009.jpg" },
  { id: "wilanow-palace", name: "Wilanów Palace", lat: 52.1652, lng: 21.0904, orientationAzimuth: 0, location: "Warsaw, Poland", citySlug: "warsaw", category: "historic", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Palac_Wilanow_2008.jpg/640px-Palac_Wilanow_2008.jpg" },
];

// ─── Budapest, Hungary ───────────────────────────────────────────
const budapest: Landmark[] = [
  { id: "hungarian-parliament", name: "Hungarian Parliament Building", lat: 47.5073, lng: 19.0458, orientationAzimuth: 270, location: "Budapest, Hungary", citySlug: "budapest", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Hungarian_Parliament_Building%2C_Budapest%2C_2014.jpg/640px-Hungarian_Parliament_Building,_Budapest,_2014.jpg" },
  { id: "buda-castle", name: "Buda Castle", lat: 47.4961, lng: 19.0398, orientationAzimuth: 90, location: "Budapest, Hungary", citySlug: "budapest", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Buda_Castle_from_Chain_Bridge.jpg/640px-Buda_Castle_from_Chain_Bridge.jpg" },
  { id: "chain-bridge", name: "Széchenyi Chain Bridge", lat: 47.4991, lng: 19.0429, orientationAzimuth: 270, location: "Budapest, Hungary", citySlug: "budapest", category: "historic", imageGradient: "from-amber-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Lanchid_Budapest.jpg/640px-Lanchid_Budapest.jpg" },
  { id: "fishermans-bastion", name: "Fisherman's Bastion", lat: 47.5019, lng: 19.0345, orientationAzimuth: 90, location: "Budapest, Hungary", citySlug: "budapest", category: "historic", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Fishermans_Bastion_Budapest.jpg/640px-Fishermans_Bastion_Budapest.jpg" },
  { id: "heroes-square-budapest", name: "Heroes' Square", lat: 47.5148, lng: 19.0779, orientationAzimuth: 270, location: "Budapest, Hungary", citySlug: "budapest", category: "monument", imageGradient: "from-stone-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Budapest_Heroes_Square.jpg/640px-Budapest_Heroes_Square.jpg" },
];

// ─── Athens, Greece ───────────────────────────────────────────────
const athens: Landmark[] = [
  { id: "acropolis", name: "Acropolis & Parthenon", lat: 37.9715, lng: 23.7267, orientationAzimuth: 270, location: "Athens, Greece", citySlug: "athens", category: "historic", imageGradient: "from-amber-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Acropolis_of_Athens_viewed_from_the_Hill_of_the_Muses.jpg/640px-The_Acropolis_of_Athens_viewed_from_the_Hill_of_the_Muses.jpg" },
  { id: "temple-of-olympian-zeus", name: "Temple of Olympian Zeus", lat: 37.9693, lng: 23.7331, orientationAzimuth: 90, location: "Athens, Greece", citySlug: "athens", category: "historic", imageGradient: "from-stone-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Olympieion_Athens.jpg/640px-Olympieion_Athens.jpg" },
  { id: "plaka-district", name: "Plaka District", lat: 37.9735, lng: 23.7298, orientationAzimuth: 0, location: "Athens, Greece", citySlug: "athens", category: "historic", imageGradient: "from-white to-sky-200", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Plaka_district%2C_Athens.jpg/640px-Plaka_district,_Athens.jpg" },
  { id: "panathenaic-stadium", name: "Panathenaic Stadium", lat: 37.9683, lng: 23.7413, orientationAzimuth: 200, location: "Athens, Greece", citySlug: "athens", category: "historic", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Panathinaiko_stadio.jpg/640px-Panathinaiko_stadio.jpg" },
];

// ─── Moscow, Russia ──────────────────────────────────────────────
const moscow: Landmark[] = [
  { id: "red-square", name: "Red Square", lat: 55.7539, lng: 37.6208, orientationAzimuth: 0, location: "Moscow, Russia", citySlug: "moscow", category: "historic", imageGradient: "from-red-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Red_Square%2C_Moscow.jpg/640px-Red_Square,_Moscow.jpg" },
  { id: "st-basils-cathedral", name: "St. Basil's Cathedral", lat: 55.7525, lng: 37.6231, orientationAzimuth: 0, location: "Moscow, Russia", citySlug: "moscow", category: "religious", imageGradient: "from-red-600 to-blue-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Moscow_StBasil_asv2019img2.jpg/640px-Moscow_StBasil_asv2019img2.jpg" },
  { id: "moscow-kremlin", name: "Moscow Kremlin", lat: 55.752, lng: 37.6175, orientationAzimuth: 0, location: "Moscow, Russia", citySlug: "moscow", category: "historic", imageGradient: "from-red-700 to-amber-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Moscow_Kremlin_from_Kamenny_bridge.jpg/640px-Moscow_Kremlin_from_Kamenny_bridge.jpg" },
  { id: "christ-the-saviour", name: "Cathedral of Christ the Saviour", lat: 55.7446, lng: 37.6056, orientationAzimuth: 0, location: "Moscow, Russia", citySlug: "moscow", category: "religious", imageGradient: "from-white to-amber-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cathedral_of_Christ_the_Saviour_in_Moscow.jpg/640px-Cathedral_of_Christ_the_Saviour_in_Moscow.jpg" },
  { id: "bolshoi-theatre", name: "Bolshoi Theatre", lat: 55.76, lng: 37.6186, orientationAzimuth: 180, location: "Moscow, Russia", citySlug: "moscow", category: "historic", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bolshoi_Theatre_September_2011.jpg/640px-Bolshoi_Theatre_September_2011.jpg" },
  { id: "moscow-state-university", name: "Moscow State University (Main Building)", lat: 55.7033, lng: 37.5303, orientationAzimuth: 0, location: "Moscow, Russia", citySlug: "moscow", category: "modern", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Moscow_State_University%2C_Main_building%2C_Panorama.jpg/640px-Moscow_State_University,_Main_building,_Panorama.jpg" },
];

// ─── Dublin, Ireland ─────────────────────────────────────────────
const dublin: Landmark[] = [
  { id: "trinity-college-dublin", name: "Trinity College Dublin", lat: 53.3439, lng: -6.2546, orientationAzimuth: 0, location: "Dublin, Ireland", citySlug: "dublin", category: "historic", imageGradient: "from-stone-600 to-green-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/TrinityCollegeDublin_Front.jpg/640px-TrinityCollegeDublin_Front.jpg" },
  { id: "ha-penny-bridge", name: "Ha'penny Bridge", lat: 53.3466, lng: -6.2634, orientationAzimuth: 0, location: "Dublin, Ireland", citySlug: "dublin", category: "historic", imageGradient: "from-white to-slate-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ha%27penny_Bridge%2C_Dublin.jpg/640px-Ha'penny_Bridge,_Dublin.jpg" },
  { id: "st-patricks-cathedral", name: "St Patrick's Cathedral", lat: 53.3397, lng: -6.2714, orientationAzimuth: 90, location: "Dublin, Ireland", citySlug: "dublin", category: "religious", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/St._Patrick%27s_Cathedral%2C_Dublin%2C_exterior_2.jpg/640px-St._Patrick's_Cathedral,_Dublin,_exterior_2.jpg" },
  { id: "dublin-castle", name: "Dublin Castle", lat: 53.3429, lng: -6.2674, orientationAzimuth: 0, location: "Dublin, Ireland", citySlug: "dublin", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Dublin_castle.jpg/640px-Dublin_castle.jpg" },
];

// ─── Oslo, Norway ────────────────────────────────────────────────
const oslo: Landmark[] = [
  { id: "oslo-opera-house", name: "Oslo Opera House", lat: 59.9074, lng: 10.7536, orientationAzimuth: 180, location: "Oslo, Norway", citySlug: "oslo", category: "modern", imageGradient: "from-white to-sky-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Oslo_Opera_House_2008.jpg/640px-Oslo_Opera_House_2008.jpg" },
  { id: "vigeland-park", name: "Vigeland Sculpture Park", lat: 59.9271, lng: 10.7003, orientationAzimuth: 0, location: "Oslo, Norway", citySlug: "oslo", category: "monument", imageGradient: "from-green-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Vigeland_park_Oslo_August_2011.jpg/640px-Vigeland_park_Oslo_August_2011.jpg" },
  { id: "akershus-fortress", name: "Akershus Fortress", lat: 59.907, lng: 10.7357, orientationAzimuth: 180, location: "Oslo, Norway", citySlug: "oslo", category: "historic", imageGradient: "from-stone-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Akershus_Fortress_Norway.jpg/640px-Akershus_Fortress_Norway.jpg" },
];

// ─── Stockholm, Sweden ───────────────────────────────────────────
const stockholm: Landmark[] = [
  { id: "gamla-stan", name: "Gamla Stan (Old Town)", lat: 59.3256, lng: 18.0711, orientationAzimuth: 0, location: "Stockholm, Sweden", citySlug: "stockholm", category: "historic", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Gamla_Stan_view_from_Monteliusv%C3%A4gen.jpg/640px-Gamla_Stan_view_from_Monteliusvägen.jpg" },
  { id: "stockholm-city-hall", name: "Stockholm City Hall", lat: 59.3275, lng: 18.0545, orientationAzimuth: 180, location: "Stockholm, Sweden", citySlug: "stockholm", category: "historic", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stockholm_City_Hall%2C_Sweden.jpg/640px-Stockholm_City_Hall,_Sweden.jpg" },
  { id: "vasa-museum", name: "Vasa Museum", lat: 59.328, lng: 18.0914, orientationAzimuth: 0, location: "Stockholm, Sweden", citySlug: "stockholm", category: "historic", imageGradient: "from-blue-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Vasamuseet_2013.jpg/640px-Vasamuseet_2013.jpg" },
  { id: "stockholm-royal-palace", name: "Royal Palace", lat: 59.3268, lng: 18.0717, orientationAzimuth: 0, location: "Stockholm, Sweden", citySlug: "stockholm", category: "historic", imageGradient: "from-stone-500 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Stockholm_Palace_from_Skeppsholmen.jpg/640px-Stockholm_Palace_from_Skeppsholmen.jpg" },
];

// ─── Helsinki, Finland ───────────────────────────────────────────
const helsinki: Landmark[] = [
  { id: "helsinki-cathedral", name: "Helsinki Cathedral", lat: 60.1706, lng: 24.9522, orientationAzimuth: 180, location: "Helsinki, Finland", citySlug: "helsinki", category: "religious", imageGradient: "from-white to-sky-200", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Helsinki_Cathedral_-_June_2020.jpg/640px-Helsinki_Cathedral_-_June_2020.jpg" },
  { id: "suomenlinna", name: "Suomenlinna Fortress", lat: 60.1454, lng: 24.9884, orientationAzimuth: 180, location: "Helsinki, Finland", citySlug: "helsinki", category: "historic", imageGradient: "from-stone-600 to-green-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Suomenlinna_fortress_Finland.jpg/640px-Suomenlinna_fortress_Finland.jpg" },
  { id: "temppeliaukio-church", name: "Temppeliaukio Church (Rock Church)", lat: 60.1726, lng: 24.925, orientationAzimuth: 0, location: "Helsinki, Finland", citySlug: "helsinki", category: "religious", imageGradient: "from-stone-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Temppeliaukio_Church_Helsinki.jpg/640px-Temppeliaukio_Church_Helsinki.jpg" },
];

// ─── Copenhagen, Denmark ─────────────────────────────────────────
const copenhagen: Landmark[] = [
  { id: "little-mermaid", name: "The Little Mermaid", lat: 55.6929, lng: 12.5994, orientationAzimuth: 45, location: "Copenhagen, Denmark", citySlug: "copenhagen", category: "monument", imageGradient: "from-cyan-500 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Copenhagen_-_The_Little_Mermaid_statue.jpg/640px-Copenhagen_-_The_Little_Mermaid_statue.jpg" },
  { id: "nyhavn", name: "Nyhavn", lat: 55.6799, lng: 12.5911, orientationAzimuth: 135, location: "Copenhagen, Denmark", citySlug: "copenhagen", category: "historic", imageGradient: "from-amber-500 to-red-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Nyhavn_Copenhagen.jpg/640px-Nyhavn_Copenhagen.jpg" },
  { id: "tivoli-gardens", name: "Tivoli Gardens", lat: 55.6738, lng: 12.5681, orientationAzimuth: 0, location: "Copenhagen, Denmark", citySlug: "copenhagen", category: "natural", imageGradient: "from-green-500 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Tivoli_Gardens_Copenhagen.jpg/640px-Tivoli_Gardens_Copenhagen.jpg" },
  { id: "christiansborg-palace", name: "Christiansborg Palace", lat: 55.6763, lng: 12.5804, orientationAzimuth: 0, location: "Copenhagen, Denmark", citySlug: "copenhagen", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Christiansborg_Palace_Copenhagen.jpg/640px-Christiansborg_Palace_Copenhagen.jpg" },
];



// ─── New York, United States ─────────────────────────────────────
const newYork: Landmark[] = [
  { id: "statue-of-liberty", name: "Statue of Liberty", lat: 40.6892, lng: -74.0445, orientationAzimuth: 135, location: "New York, USA", citySlug: "new-york", category: "monument", imageGradient: "from-green-700 to-cyan-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/640px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg" },
  { id: "empire-state-building", name: "Empire State Building", lat: 40.7484, lng: -73.9857, orientationAzimuth: 0, location: "New York, USA", citySlug: "new-york", category: "modern", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/640px-Empire_State_Building_%28aerial_view%29.jpg" },
  { id: "brooklyn-bridge", name: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969, orientationAzimuth: 135, location: "New York, USA", citySlug: "new-york", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Brooklyn_Bridge_Postdlf.jpg/640px-Brooklyn_Bridge_Postdlf.jpg" },
  { id: "central-park", name: "Central Park", lat: 40.7829, lng: -73.9654, orientationAzimuth: 0, location: "New York, USA", citySlug: "new-york", category: "natural", imageGradient: "from-green-600 to-emerald-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg/640px-Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg" },
  { id: "times-square", name: "Times Square", lat: 40.758, lng: -73.9855, orientationAzimuth: 0, location: "New York, USA", citySlug: "new-york", category: "modern", imageGradient: "from-pink-500 to-blue-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/640px-New_york_times_square-terabass.jpg" },
  { id: "one-world-trade", name: "One World Trade Center", lat: 40.7127, lng: -74.0134, orientationAzimuth: 0, location: "New York, USA", citySlug: "new-york", category: "modern", imageGradient: "from-sky-600 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/One_World_Trade_Center_seen_from_the_Hudson_River.jpg/640px-One_World_Trade_Center_seen_from_the_Hudson_River.jpg" },
  { id: "flatiron-building", name: "Flatiron Building", lat: 40.7411, lng: -73.9897, orientationAzimuth: 0, location: "New York, USA", citySlug: "new-york", category: "historic", imageGradient: "from-stone-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg/640px-Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg" },
  { id: "top-of-the-rock", name: "Top of the Rock / Rockefeller Center", lat: 40.7587, lng: -73.9787, orientationAzimuth: 0, location: "New York, USA", citySlug: "new-york", category: "modern", imageGradient: "from-amber-600 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/NYC_Top_of_the_Rock_Cropped.jpg/640px-NYC_Top_of_the_Rock_Cropped.jpg" },
  { id: "st-patricks-nyc", name: "St. Patrick's Cathedral", lat: 40.7585, lng: -73.9762, orientationAzimuth: 90, location: "New York, USA", citySlug: "new-york", category: "religious", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Saint_Patrick%27s_Cathedral_NYC.jpg/640px-Saint_Patrick%27s_Cathedral_NYC.jpg" },
  { id: "grand-central-terminal", name: "Grand Central Terminal", lat: 40.7527, lng: -73.9772, orientationAzimuth: 180, location: "New York, USA", citySlug: "new-york", category: "historic", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Grand_Central_Terminal_-_Narthex.jpg/640px-Grand_Central_Terminal_-_Narthex.jpg" },
];

// ─── Los Angeles, United States ──────────────────────────────────
const losAngeles: Landmark[] = [
  { id: "hollywood-sign", name: "Hollywood Sign", lat: 34.1341, lng: -118.3215, orientationAzimuth: 180, location: "Los Angeles, USA", citySlug: "los-angeles", category: "monument", imageGradient: "from-green-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Hollywood_Sign_%282020%29.jpg/640px-Hollywood_Sign_(2020).jpg" },
  { id: "griffith-observatory", name: "Griffith Observatory", lat: 34.1185, lng: -118.3004, orientationAzimuth: 180, location: "Los Angeles, USA", citySlug: "los-angeles", category: "modern", imageGradient: "from-white to-sky-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Griffith_Observatory_-_Jan_2012.jpg/640px-Griffith_Observatory_-_Jan_2012.jpg" },
  { id: "santa-monica-pier", name: "Santa Monica Pier", lat: 34.0083, lng: -118.4987, orientationAzimuth: 270, location: "Los Angeles, USA", citySlug: "los-angeles", category: "natural", imageGradient: "from-sky-400 to-orange-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Santa_Monica_Pier.jpg/640px-Santa_Monica_Pier.jpg" },
  { id: "walt-disney-concert-hall", name: "Walt Disney Concert Hall", lat: 34.0553, lng: -118.2498, orientationAzimuth: 180, location: "Los Angeles, USA", citySlug: "los-angeles", category: "modern", imageGradient: "from-slate-400 to-slate-300" },
  { id: "venice-beach", name: "Venice Beach", lat: 33.985, lng: -118.4695, orientationAzimuth: 270, location: "Los Angeles, USA", citySlug: "los-angeles", category: "natural", imageGradient: "from-sky-400 to-blue-300" },
  { id: "the-getty-center", name: "The Getty Center", lat: 34.078, lng: -118.4741, orientationAzimuth: 180, location: "Los Angeles, USA", citySlug: "los-angeles", category: "modern", imageGradient: "from-white to-stone-300" },
];

// ─── Chicago, United States ──────────────────────────────────────
const chicago: Landmark[] = [
  { id: "cloud-gate", name: "Cloud Gate (The Bean)", lat: 41.8827, lng: -87.6233, orientationAzimuth: 0, location: "Chicago, USA", citySlug: "chicago", category: "modern", imageGradient: "from-slate-400 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Cloud_Gate_at_Night_2014.jpg/640px-Cloud_Gate_at_Night_2014.jpg" },
  { id: "willis-tower", name: "Willis Tower (Sears Tower)", lat: 41.8789, lng: -87.6359, orientationAzimuth: 0, location: "Chicago, USA", citySlug: "chicago", category: "modern", imageGradient: "from-slate-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Willis_Tower_2015.jpg/640px-Willis_Tower_2015.jpg" },
  { id: "navy-pier", name: "Navy Pier", lat: 41.8917, lng: -87.6063, orientationAzimuth: 90, location: "Chicago, USA", citySlug: "chicago", category: "modern", imageGradient: "from-blue-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Navy_Pier_Chicago_Illinois_2012.jpg/640px-Navy_Pier_Chicago_Illinois_2012.jpg" },
  { id: "art-institute-chicago", name: "Art Institute of Chicago", lat: 41.8796, lng: -87.6237, orientationAzimuth: 0, location: "Chicago, USA", citySlug: "chicago", category: "historic", imageGradient: "from-stone-600 to-amber-500" },
  { id: "buckingham-fountain", name: "Buckingham Fountain", lat: 41.8758, lng: -87.6189, orientationAzimuth: 0, location: "Chicago, USA", citySlug: "chicago", category: "monument", imageGradient: "from-cyan-500 to-blue-400" },
  { id: "chicago-riverwalk", name: "Chicago Riverwalk", lat: 41.8882, lng: -87.6218, orientationAzimuth: 90, location: "Chicago, USA", citySlug: "chicago", category: "natural", imageGradient: "from-green-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Chicago_Riverwalk_2014.jpg/640px-Chicago_Riverwalk_2014.jpg" },
];

// ─── San Francisco, United States ────────────────────────────────
const sanFrancisco: Landmark[] = [
  { id: "golden-gate-bridge", name: "Golden Gate Bridge", lat: 37.8199, lng: -122.4783, orientationAzimuth: 0, location: "San Francisco, USA", citySlug: "san-francisco", category: "modern", imageGradient: "from-red-600 to-orange-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Golden_Gate_1.jpg/640px-Golden_Gate_1.jpg" },
  { id: "alcatraz-island", name: "Alcatraz Island", lat: 37.8267, lng: -122.4233, orientationAzimuth: 0, location: "San Francisco, USA", citySlug: "san-francisco", category: "historic", imageGradient: "from-stone-700 to-slate-500" },
  { id: "painted-ladies", name: "Painted Ladies", lat: 37.7762, lng: -122.4328, orientationAzimuth: 90, location: "San Francisco, USA", citySlug: "san-francisco", category: "historic", imageGradient: "from-pink-400 to-purple-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Painted_Ladies_San_Francisco.jpg/640px-Painted_Ladies_San_Francisco.jpg" },
  { id: "fishermans-wharf-sf", name: "Fisherman's Wharf", lat: 37.808, lng: -122.4177, orientationAzimuth: 0, location: "San Francisco, USA", citySlug: "san-francisco", category: "natural", imageGradient: "from-sky-500 to-blue-400" },
  { id: "transamerica-pyramid", name: "Transamerica Pyramid", lat: 37.7952, lng: -122.4028, orientationAzimuth: 0, location: "San Francisco, USA", citySlug: "san-francisco", category: "modern", imageGradient: "from-white to-slate-400" },
];

// ─── Washington DC, United States ────────────────────────────────
const washingtonDC: Landmark[] = [
  { id: "us-capitol", name: "United States Capitol", lat: 38.8899, lng: -77.0091, orientationAzimuth: 270, location: "Washington DC, USA", citySlug: "washington-dc", category: "historic", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/United_States_Capitol_west_front_edit2.jpg/640px-United_States_Capitol_west_front_edit2.jpg" },
  { id: "washington-monument", name: "Washington Monument", lat: 38.8895, lng: -77.0353, orientationAzimuth: 0, location: "Washington DC, USA", citySlug: "washington-dc", category: "monument", imageGradient: "from-white to-stone-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Washington_Monument_Dusk_Jan_2006.jpg/640px-Washington_Monument_Dusk_Jan_2006.jpg" },
  { id: "lincoln-memorial", name: "Lincoln Memorial", lat: 38.8893, lng: -77.0502, orientationAzimuth: 90, location: "Washington DC, USA", citySlug: "washington-dc", category: "monument", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Lincoln_memorial.jpg/640px-Lincoln_memorial.jpg" },
  { id: "white-house", name: "The White House", lat: 38.8977, lng: -77.0365, orientationAzimuth: 180, location: "Washington DC, USA", citySlug: "washington-dc", category: "historic", imageGradient: "from-white to-stone-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/White_House_Washington.jpg/640px-White_House_Washington.jpg" },
  { id: "jefferson-memorial", name: "Jefferson Memorial", lat: 38.8814, lng: -77.0365, orientationAzimuth: 0, location: "Washington DC, USA", citySlug: "washington-dc", category: "monument", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Jefferson_Memorial_Tidal_Basin.jpg/640px-Jefferson_Memorial_Tidal_Basin.jpg" },
  { id: "national-mall", name: "National Mall", lat: 38.8893, lng: -77.0228, orientationAzimuth: 270, location: "Washington DC, USA", citySlug: "washington-dc", category: "natural", imageGradient: "from-green-500 to-sky-300" },
];

// ─── Houston, United States ──────────────────────────────────────
const houston: Landmark[] = [
  { id: "space-center-houston", name: "Space Center Houston", lat: 29.5519, lng: -95.098, orientationAzimuth: 0, location: "Houston, USA", citySlug: "houston", category: "modern", imageGradient: "from-slate-700 to-blue-500" },
  { id: "houston-museum-district", name: "Museum District", lat: 29.7222, lng: -95.3903, orientationAzimuth: 0, location: "Houston, USA", citySlug: "houston", category: "historic", imageGradient: "from-stone-600 to-amber-400" },
  { id: "san-jacinto-monument", name: "San Jacinto Monument", lat: 29.7498, lng: -95.0804, orientationAzimuth: 0, location: "Houston, USA", citySlug: "houston", category: "monument", imageGradient: "from-stone-600 to-stone-400" },
];

// ─── Dallas, United States ───────────────────────────────────────
const dallas: Landmark[] = [
  { id: "reunion-tower", name: "Reunion Tower", lat: 32.7757, lng: -96.809, orientationAzimuth: 0, location: "Dallas, USA", citySlug: "dallas", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Reunion_Tower%2C_Dallas.jpg/640px-Reunion_Tower,_Dallas.jpg" },
  { id: "dealey-plaza", name: "Dealey Plaza", lat: 32.7787, lng: -96.8083, orientationAzimuth: 0, location: "Dallas, USA", citySlug: "dallas", category: "historic", imageGradient: "from-stone-600 to-green-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Dealey_Plaza_2011.jpg/640px-Dealey_Plaza_2011.jpg" },
  { id: "margaret-hunt-hill-bridge", name: "Margaret Hunt Hill Bridge", lat: 32.7895, lng: -96.8228, orientationAzimuth: 315, location: "Dallas, USA", citySlug: "dallas", category: "modern", imageGradient: "from-white to-sky-300" },
];

// ─── Miami, United States ────────────────────────────────────────
const miami: Landmark[] = [
  { id: "south-beach-miami", name: "South Beach", lat: 25.7826, lng: -80.1341, orientationAzimuth: 90, location: "Miami, USA", citySlug: "miami", category: "natural", imageGradient: "from-sky-400 to-cyan-300" },
  { id: "art-deco-district", name: "Art Deco Historic District", lat: 25.7822, lng: -80.1308, orientationAzimuth: 0, location: "Miami, USA", citySlug: "miami", category: "historic", imageGradient: "from-pink-400 to-cyan-400" },
  { id: "vizcaya-museum", name: "Vizcaya Museum and Gardens", lat: 25.7444, lng: -80.2105, orientationAzimuth: 90, location: "Miami, USA", citySlug: "miami", category: "historic", imageGradient: "from-green-600 to-emerald-400" },
  { id: "freedom-tower-miami", name: "Freedom Tower", lat: 25.7822, lng: -80.1886, orientationAzimuth: 0, location: "Miami, USA", citySlug: "miami", category: "monument", imageGradient: "from-amber-600 to-stone-500" },
];

// ─── Phoenix, United States ──────────────────────────────────────
const phoenix: Landmark[] = [
  { id: "camelback-mountain", name: "Camelback Mountain", lat: 33.5154, lng: -111.9706, orientationAzimuth: 0, location: "Phoenix, USA", citySlug: "phoenix", category: "natural", imageGradient: "from-orange-600 to-red-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Camelback_Mountain_Phoenix.jpg/640px-Camelback_Mountain_Phoenix.jpg" },
  { id: "desert-botanical-garden", name: "Desert Botanical Garden", lat: 33.4618, lng: -111.9445, orientationAzimuth: 0, location: "Phoenix, USA", citySlug: "phoenix", category: "natural", imageGradient: "from-green-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Desert_Botanical_Garden_Phoenix.jpg/640px-Desert_Botanical_Garden_Phoenix.jpg" },
];

// ─── Seattle, United States ──────────────────────────────────────
const seattle: Landmark[] = [
  { id: "space-needle", name: "Space Needle", lat: 47.6205, lng: -122.3493, orientationAzimuth: 0, location: "Seattle, USA", citySlug: "seattle", category: "modern", imageGradient: "from-slate-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Space_Needle_2011-07-04.jpg/640px-Space_Needle_2011-07-04.jpg" },
  { id: "pike-place-market", name: "Pike Place Market", lat: 47.6097, lng: -122.3422, orientationAzimuth: 270, location: "Seattle, USA", citySlug: "seattle", category: "historic", imageGradient: "from-red-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Pike_Place_Market_Entrance.jpg/640px-Pike_Place_Market_Entrance.jpg" },
  { id: "chihuly-garden", name: "Chihuly Garden and Glass", lat: 47.6206, lng: -122.3506, orientationAzimuth: 0, location: "Seattle, USA", citySlug: "seattle", category: "modern", imageGradient: "from-red-500 to-blue-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Chihuly_Garden_and_Glass_Seattle.jpg/640px-Chihuly_Garden_and_Glass_Seattle.jpg" },
  { id: "kerry-park-seattle", name: "Kerry Park", lat: 47.6295, lng: -122.3594, orientationAzimuth: 90, location: "Seattle, USA", citySlug: "seattle", category: "natural", imageGradient: "from-green-500 to-sky-400" },
];

// ─── Boston, United States ───────────────────────────────────────
const boston: Landmark[] = [
  { id: "faneuil-hall", name: "Faneuil Hall", lat: 42.36, lng: -71.0561, orientationAzimuth: 180, location: "Boston, USA", citySlug: "boston", category: "historic", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Faneuil_Hall%2C_Boston%2C_Massachusetts.jpg/640px-Faneuil_Hall,_Boston,_Massachusetts.jpg" },
  { id: "boston-common", name: "Boston Common", lat: 42.3554, lng: -71.0656, orientationAzimuth: 0, location: "Boston, USA", citySlug: "boston", category: "natural", imageGradient: "from-green-600 to-emerald-400" },
  { id: "old-north-church", name: "Old North Church", lat: 42.3663, lng: -71.0565, orientationAzimuth: 0, location: "Boston, USA", citySlug: "boston", category: "religious", imageGradient: "from-white to-stone-400" },
];

// ─── Philadelphia, United States ─────────────────────────────────
const philadelphia: Landmark[] = [
  { id: "liberty-bell", name: "Liberty Bell", lat: 39.9496, lng: -75.1503, orientationAzimuth: 0, location: "Philadelphia, USA", citySlug: "philadelphia", category: "monument", imageGradient: "from-amber-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Liberty_Bell_2008.jpg/640px-Liberty_Bell_2008.jpg" },
  { id: "independence-hall", name: "Independence Hall", lat: 39.9489, lng: -75.15, orientationAzimuth: 0, location: "Philadelphia, USA", citySlug: "philadelphia", category: "historic", imageGradient: "from-red-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Independence_Hall%2C_Philadelphia%2C_PA.jpg/640px-Independence_Hall,_Philadelphia,_PA.jpg" },
  { id: "philadelphia-museum-art", name: "Philadelphia Museum of Art", lat: 39.9656, lng: -75.181, orientationAzimuth: 135, location: "Philadelphia, USA", citySlug: "philadelphia", category: "historic", imageGradient: "from-stone-600 to-amber-500" },
];

// ─── Atlanta, United States ──────────────────────────────────────
const atlanta: Landmark[] = [
  { id: "centennial-olympic-park", name: "Centennial Olympic Park", lat: 33.7605, lng: -84.3931, orientationAzimuth: 0, location: "Atlanta, USA", citySlug: "atlanta", category: "natural", imageGradient: "from-green-500 to-sky-400" },
  { id: "mlk-historic-site", name: "Martin Luther King Jr. Historic Site", lat: 33.7555, lng: -84.3733, orientationAzimuth: 0, location: "Atlanta, USA", citySlug: "atlanta", category: "historic", imageGradient: "from-stone-600 to-amber-500" },
];

// ─── Detroit, United States ──────────────────────────────────────
const detroit: Landmark[] = [
  { id: "renaissance-center", name: "Renaissance Center (GM HQ)", lat: 42.3293, lng: -83.0398, orientationAzimuth: 180, location: "Detroit, USA", citySlug: "detroit", category: "modern", imageGradient: "from-slate-700 to-sky-500" },
  { id: "belle-isle-park", name: "Belle Isle Park", lat: 42.3383, lng: -82.9764, orientationAzimuth: 0, location: "Detroit, USA", citySlug: "detroit", category: "natural", imageGradient: "from-green-600 to-emerald-400" },
];

// ─── Toronto, Canada ─────────────────────────────────────────────
const toronto: Landmark[] = [
  { id: "cn-tower", name: "CN Tower", lat: 43.6426, lng: -79.3871, orientationAzimuth: 0, location: "Toronto, Canada", citySlug: "toronto", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Toronto_-_ON_-_CN_Tower_at_Dusk.jpg/640px-Toronto_-_ON_-_CN_Tower_at_Dusk.jpg" },
  { id: "royal-ontario-museum", name: "Royal Ontario Museum", lat: 43.6677, lng: -79.3948, orientationAzimuth: 180, location: "Toronto, Canada", citySlug: "toronto", category: "historic", imageGradient: "from-stone-600 to-slate-500" },
  { id: "casa-loma", name: "Casa Loma", lat: 43.6781, lng: -79.4094, orientationAzimuth: 180, location: "Toronto, Canada", citySlug: "toronto", category: "historic", imageGradient: "from-stone-700 to-stone-500" },
  { id: "toronto-city-hall", name: "Toronto City Hall", lat: 43.6534, lng: -79.3841, orientationAzimuth: 180, location: "Toronto, Canada", citySlug: "toronto", category: "modern", imageGradient: "from-slate-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Toronto_City_Hall_2016_%2830078706560%29.jpg/640px-Toronto_City_Hall_2016_(30078706560).jpg" },
  { id: "toronto-islands", name: "Toronto Islands", lat: 43.623, lng: -79.3783, orientationAzimuth: 0, location: "Toronto, Canada", citySlug: "toronto", category: "natural", imageGradient: "from-green-500 to-sky-400" },
];

// ─── Montreal, Canada ────────────────────────────────────────────
const montreal: Landmark[] = [
  { id: "notre-dame-basilica-mtl", name: "Notre-Dame Basilica of Montreal", lat: 45.5046, lng: -73.5566, orientationAzimuth: 180, location: "Montreal, Canada", citySlug: "montreal", category: "religious", imageGradient: "from-blue-800 to-amber-600" },
  { id: "mount-royal", name: "Mount Royal", lat: 45.5048, lng: -73.5874, orientationAzimuth: 0, location: "Montreal, Canada", citySlug: "montreal", category: "natural", imageGradient: "from-green-700 to-emerald-500" },
  { id: "olympic-stadium-mtl", name: "Olympic Stadium", lat: 45.558, lng: -73.5516, orientationAzimuth: 0, location: "Montreal, Canada", citySlug: "montreal", category: "modern", imageGradient: "from-slate-600 to-slate-400" },
  { id: "old-port-montreal", name: "Old Port of Montreal", lat: 45.5044, lng: -73.553, orientationAzimuth: 180, location: "Montreal, Canada", citySlug: "montreal", category: "historic", imageGradient: "from-stone-600 to-sky-400" },
];

// ─── Vancouver, Canada ───────────────────────────────────────────
const vancouver: Landmark[] = [
  { id: "stanley-park", name: "Stanley Park", lat: 49.3043, lng: -123.1443, orientationAzimuth: 0, location: "Vancouver, Canada", citySlug: "vancouver", category: "natural", imageGradient: "from-green-700 to-emerald-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Stanley_Park_Vancouver.jpg/640px-Stanley_Park_Vancouver.jpg" },
  { id: "canada-place", name: "Canada Place", lat: 49.2888, lng: -123.1114, orientationAzimuth: 0, location: "Vancouver, Canada", citySlug: "vancouver", category: "modern", imageGradient: "from-white to-sky-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Canada_Place_Vancouver.jpg/640px-Canada_Place_Vancouver.jpg" },
  { id: "capilano-suspension-bridge", name: "Capilano Suspension Bridge", lat: 49.343, lng: -123.1149, orientationAzimuth: 0, location: "Vancouver, Canada", citySlug: "vancouver", category: "natural", imageGradient: "from-green-800 to-green-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Capilano_Suspension_Bridge%2C_2007.jpg/640px-Capilano_Suspension_Bridge,_2007.jpg" },
  { id: "science-world-vancouver", name: "Science World", lat: 49.2734, lng: -123.1036, orientationAzimuth: 0, location: "Vancouver, Canada", citySlug: "vancouver", category: "modern", imageGradient: "from-slate-600 to-purple-400" },
];

// ─── Mexico City, Mexico ─────────────────────────────────────────
const mexicoCity: Landmark[] = [
  { id: "palacio-bellas-artes", name: "Palacio de Bellas Artes", lat: 19.4352, lng: -99.1413, orientationAzimuth: 90, location: "Mexico City, Mexico", citySlug: "mexico-city", category: "historic", imageGradient: "from-white to-amber-300" },
  { id: "zocalo", name: "Zócalo (Plaza de la Constitución)", lat: 19.4326, lng: -99.1332, orientationAzimuth: 0, location: "Mexico City, Mexico", citySlug: "mexico-city", category: "historic", imageGradient: "from-stone-600 to-red-500" },
  { id: "angel-independence", name: "Angel of Independence", lat: 19.4279, lng: -99.1677, orientationAzimuth: 0, location: "Mexico City, Mexico", citySlug: "mexico-city", category: "monument", imageGradient: "from-amber-500 to-yellow-400" },
  { id: "templo-mayor", name: "Templo Mayor", lat: 19.4345, lng: -99.1315, orientationAzimuth: 270, location: "Mexico City, Mexico", citySlug: "mexico-city", category: "historic", imageGradient: "from-stone-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Templo_Mayor%2C_Mexico_City.jpg/640px-Templo_Mayor,_Mexico_City.jpg" },
  { id: "chapultepec-castle", name: "Chapultepec Castle", lat: 19.4207, lng: -99.1818, orientationAzimuth: 90, location: "Mexico City, Mexico", citySlug: "mexico-city", category: "historic", imageGradient: "from-green-700 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Chapultepec_Castle_2014.jpg/640px-Chapultepec_Castle_2014.jpg" },
  { id: "metropolitan-cathedral-mx", name: "Metropolitan Cathedral", lat: 19.4336, lng: -99.1332, orientationAzimuth: 180, location: "Mexico City, Mexico", citySlug: "mexico-city", category: "religious", imageGradient: "from-stone-600 to-amber-500" },
];

// ─── Sao Paulo, Brazil ──────────────────────────────────────────
const saoPaulo: Landmark[] = [
  { id: "sao-paulo-cathedral", name: "Sé Cathedral", lat: -23.5505, lng: -46.634, orientationAzimuth: 180, location: "Sao Paulo, Brazil", citySlug: "sao-paulo", category: "religious", imageGradient: "from-stone-600 to-stone-400" },
  { id: "ibirapuera-park", name: "Ibirapuera Park", lat: -23.5874, lng: -46.6576, orientationAzimuth: 0, location: "Sao Paulo, Brazil", citySlug: "sao-paulo", category: "natural", imageGradient: "from-green-600 to-emerald-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Ibirapuera_sp_06_2006.jpg/640px-Ibirapuera_sp_06_2006.jpg" },
  { id: "sao-paulo-museum-art", name: "São Paulo Museum of Art (MASP)", lat: -23.5614, lng: -46.6558, orientationAzimuth: 0, location: "Sao Paulo, Brazil", citySlug: "sao-paulo", category: "modern", imageGradient: "from-red-600 to-slate-500" },
  { id: "paulista-avenue", name: "Paulista Avenue", lat: -23.5614, lng: -46.6553, orientationAzimuth: 60, location: "Sao Paulo, Brazil", citySlug: "sao-paulo", category: "modern", imageGradient: "from-slate-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Avenida_Paulista_by_drone_%282%29.jpg/640px-Avenida_Paulista_by_drone_(2).jpg" },
];

// ─── Rio de Janeiro, Brazil ──────────────────────────────────────
const rio: Landmark[] = [
  { id: "christ-the-redeemer", name: "Christ the Redeemer", lat: -22.9519, lng: -43.2105, orientationAzimuth: 90, location: "Rio de Janeiro, Brazil", citySlug: "rio-de-janeiro", category: "religious", imageGradient: "from-green-700 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg/640px-Cristo_Redentor_-_Rio_de_Janeiro,_Brasil.jpg" },
  { id: "sugarloaf-mountain", name: "Sugarloaf Mountain", lat: -22.949, lng: -43.1546, orientationAzimuth: 0, location: "Rio de Janeiro, Brazil", citySlug: "rio-de-janeiro", category: "natural", imageGradient: "from-green-800 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rio_de_Janeiro_Sugar_Loaf_Mountain_2009.jpg/640px-Rio_de_Janeiro_Sugar_Loaf_Mountain_2009.jpg" },
  { id: "copacabana-beach", name: "Copacabana Beach", lat: -22.9711, lng: -43.1822, orientationAzimuth: 135, location: "Rio de Janeiro, Brazil", citySlug: "rio-de-janeiro", category: "natural", imageGradient: "from-sky-400 to-blue-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Copacabana_Beach_aerial_view_2010.jpg/640px-Copacabana_Beach_aerial_view_2010.jpg" },
  { id: "ipanema-beach", name: "Ipanema Beach", lat: -22.9838, lng: -43.2096, orientationAzimuth: 180, location: "Rio de Janeiro, Brazil", citySlug: "rio-de-janeiro", category: "natural", imageGradient: "from-sky-400 to-orange-300" },
  { id: "selaron-steps", name: "Escadaria Selarón", lat: -22.915, lng: -43.1788, orientationAzimuth: 0, location: "Rio de Janeiro, Brazil", citySlug: "rio-de-janeiro", category: "monument", imageGradient: "from-red-500 to-blue-500" },
  { id: "maracana-stadium", name: "Maracanã Stadium", lat: -22.9121, lng: -43.2302, orientationAzimuth: 0, location: "Rio de Janeiro, Brazil", citySlug: "rio-de-janeiro", category: "modern", imageGradient: "from-green-600 to-yellow-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Maracana_2012.jpg/640px-Maracana_2012.jpg" },
];

// ─── Buenos Aires, Argentina ─────────────────────────────────────
const buenosAires: Landmark[] = [
  { id: "obelisco-ba", name: "Obelisco de Buenos Aires", lat: -34.6038, lng: -58.3816, orientationAzimuth: 0, location: "Buenos Aires, Argentina", citySlug: "buenos-aires", category: "monument", imageGradient: "from-white to-stone-400" },
  { id: "casa-rosada", name: "Casa Rosada", lat: -34.6083, lng: -58.3702, orientationAzimuth: 90, location: "Buenos Aires, Argentina", citySlug: "buenos-aires", category: "historic", imageGradient: "from-pink-500 to-rose-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Casa_Rosada_2007.jpg/640px-Casa_Rosada_2007.jpg" },
  { id: "la-boca", name: "La Boca (Caminito)", lat: -34.6345, lng: -58.3625, orientationAzimuth: 0, location: "Buenos Aires, Argentina", citySlug: "buenos-aires", category: "historic", imageGradient: "from-yellow-500 to-blue-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/La_Boca_2008.jpg/640px-La_Boca_2008.jpg" },
  { id: "recoleta-cemetery", name: "Recoleta Cemetery", lat: -34.5877, lng: -58.3928, orientationAzimuth: 0, location: "Buenos Aires, Argentina", citySlug: "buenos-aires", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cementerio_de_la_Recoleta_2009.jpg/640px-Cementerio_de_la_Recoleta_2009.jpg" },
  { id: "teatro-colon", name: "Teatro Colón", lat: -34.6011, lng: -58.3833, orientationAzimuth: 90, location: "Buenos Aires, Argentina", citySlug: "buenos-aires", category: "historic", imageGradient: "from-red-700 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Teatro_Colon_Buenos_Aires_2014.jpg/640px-Teatro_Colon_Buenos_Aires_2014.jpg" },
];

// ─── Santiago, Chile ─────────────────────────────────────────────
const santiago: Landmark[] = [
  { id: "cerro-san-cristobal", name: "Cerro San Cristóbal", lat: -33.4259, lng: -70.6324, orientationAzimuth: 0, location: "Santiago, Chile", citySlug: "santiago", category: "natural", imageGradient: "from-green-700 to-sky-400" },
  { id: "la-moneda-palace", name: "Palacio de La Moneda", lat: -33.4428, lng: -70.6539, orientationAzimuth: 0, location: "Santiago, Chile", citySlug: "santiago", category: "historic", imageGradient: "from-stone-600 to-stone-400" },
  { id: "plaza-de-armas-santiago", name: "Plaza de Armas", lat: -33.4378, lng: -70.6506, orientationAzimuth: 0, location: "Santiago, Chile", citySlug: "santiago", category: "historic", imageGradient: "from-stone-500 to-amber-400" },
];

// ─── Lima, Peru ──────────────────────────────────────────────────
const lima: Landmark[] = [
  { id: "plaza-mayor-lima", name: "Plaza Mayor de Lima", lat: -12.0464, lng: -77.0303, orientationAzimuth: 0, location: "Lima, Peru", citySlug: "lima", category: "historic", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Plaza_de_Armas_Lima.jpg/640px-Plaza_de_Armas_Lima.jpg" },
  { id: "huaca-pucllana", name: "Huaca Pucllana", lat: -12.1104, lng: -77.0335, orientationAzimuth: 0, location: "Lima, Peru", citySlug: "lima", category: "historic", imageGradient: "from-amber-800 to-stone-600", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Huaca_Pucllana_Lima.jpg/640px-Huaca_Pucllana_Lima.jpg" },
  { id: "lima-cathedral", name: "Cathedral of Lima", lat: -12.0468, lng: -77.0294, orientationAzimuth: 90, location: "Lima, Peru", citySlug: "lima", category: "religious", imageGradient: "from-stone-500 to-amber-400" },
];

// ─── Bogota, Colombia ────────────────────────────────────────────
const bogota: Landmark[] = [
  { id: "monserrate", name: "Cerro de Monserrate", lat: 4.6058, lng: -74.0556, orientationAzimuth: 0, location: "Bogota, Colombia", citySlug: "bogota", category: "natural", imageGradient: "from-green-700 to-sky-400" },
  { id: "bolivar-square", name: "Plaza de Bolívar", lat: 4.598, lng: -74.0758, orientationAzimuth: 0, location: "Bogota, Colombia", citySlug: "bogota", category: "historic", imageGradient: "from-stone-600 to-amber-500" },
  { id: "gold-museum-bogota", name: "Museo del Oro (Gold Museum)", lat: 4.6019, lng: -74.0719, orientationAzimuth: 0, location: "Bogota, Colombia", citySlug: "bogota", category: "historic", imageGradient: "from-amber-600 to-yellow-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Museo_del_Oro%2C_Bogot%C3%A1.jpg/640px-Museo_del_Oro,_Bogotá.jpg" },
];



// ─── Cairo, Egypt ────────────────────────────────────────────────
const cairo: Landmark[] = [
  { id: "giza-pyramids", name: "Giza Pyramids", lat: 29.9792, lng: 31.1342, orientationAzimuth: 100, location: "Cairo, Egypt", citySlug: "cairo", category: "historic", imageGradient: "from-yellow-800 to-amber-600" },
  { id: "sphinx", name: "Great Sphinx of Giza", lat: 29.9753, lng: 31.1376, orientationAzimuth: 90, location: "Cairo, Egypt", citySlug: "cairo", category: "historic", imageGradient: "from-amber-700 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Great_Sphinx_of_Giza_-_20080716a.jpg/640px-Great_Sphinx_of_Giza_-_20080716a.jpg" },
  { id: "cairo-citadel", name: "Citadel of Saladin", lat: 30.0288, lng: 31.2599, orientationAzimuth: 0, location: "Cairo, Egypt", citySlug: "cairo", category: "historic", imageGradient: "from-stone-700 to-amber-500" },
  { id: "muhammad-ali-mosque", name: "Mosque of Muhammad Ali", lat: 30.0288, lng: 31.2595, orientationAzimuth: 315, location: "Cairo, Egypt", citySlug: "cairo", category: "religious", imageGradient: "from-white to-amber-300" },
  { id: "al-azhar-mosque", name: "Al-Azhar Mosque", lat: 30.0458, lng: 31.2626, orientationAzimuth: 135, location: "Cairo, Egypt", citySlug: "cairo", category: "religious", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Al-Azhar_Mosque_Entr%C3%A9e.jpg/640px-Al-Azhar_Mosque_Entrée.jpg" },
  { id: "khan-el-khalili", name: "Khan El Khalili Bazaar", lat: 30.0477, lng: 31.2625, orientationAzimuth: 0, location: "Cairo, Egypt", citySlug: "cairo", category: "historic", imageGradient: "from-amber-700 to-red-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Khan_el-Khalili%2C_Cairo.jpg/640px-Khan_el-Khalili,_Cairo.jpg" },
  { id: "cairo-tower", name: "Cairo Tower", lat: 30.0459, lng: 31.2243, orientationAzimuth: 0, location: "Cairo, Egypt", citySlug: "cairo", category: "modern", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Cairo_Tower_at_night.jpg/640px-Cairo_Tower_at_night.jpg" },
];

// ─── Johannesburg, South Africa ──────────────────────────────────
const johannesburg: Landmark[] = [
  { id: "apartheid-museum", name: "Apartheid Museum", lat: -26.2385, lng: 28.0107, orientationAzimuth: 0, location: "Johannesburg, South Africa", citySlug: "johannesburg", category: "historic", imageGradient: "from-stone-700 to-slate-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Apartheid_Museum_Gate.jpg/640px-Apartheid_Museum_Gate.jpg" },
  { id: "constitution-hill", name: "Constitution Hill", lat: -26.1853, lng: 28.0425, orientationAzimuth: 0, location: "Johannesburg, South Africa", citySlug: "johannesburg", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Constitutional_Court%2C_Johannesburg.jpg/640px-Constitutional_Court,_Johannesburg.jpg" },
  { id: "carlton-centre", name: "Carlton Centre", lat: -26.2057, lng: 28.0474, orientationAzimuth: 0, location: "Johannesburg, South Africa", citySlug: "johannesburg", category: "modern", imageGradient: "from-slate-700 to-slate-500" },
];

// ─── Cape Town, South Africa ─────────────────────────────────────
const capeTown: Landmark[] = [
  { id: "table-mountain", name: "Table Mountain", lat: -33.9628, lng: 18.4098, orientationAzimuth: 0, location: "Cape Town, South Africa", citySlug: "cape-town", category: "natural", imageGradient: "from-green-700 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Table_Mountain_DanieVDM.jpg/640px-Table_Mountain_DanieVDM.jpg" },
  { id: "cape-of-good-hope", name: "Cape of Good Hope", lat: -34.3568, lng: 18.4738, orientationAzimuth: 180, location: "Cape Town, South Africa", citySlug: "cape-town", category: "natural", imageGradient: "from-blue-700 to-sky-500" },
  { id: "robben-island", name: "Robben Island", lat: -33.8065, lng: 18.3663, orientationAzimuth: 0, location: "Cape Town, South Africa", citySlug: "cape-town", category: "historic", imageGradient: "from-stone-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Robben_Island_Cape_Town.jpg/640px-Robben_Island_Cape_Town.jpg" },
  { id: "v-and-a-waterfront", name: "V&A Waterfront", lat: -33.9036, lng: 18.4208, orientationAzimuth: 0, location: "Cape Town, South Africa", citySlug: "cape-town", category: "modern", imageGradient: "from-sky-500 to-blue-400" },
  { id: "bo-kaap", name: "Bo-Kaap", lat: -33.9208, lng: 18.4153, orientationAzimuth: 0, location: "Cape Town, South Africa", citySlug: "cape-town", category: "historic", imageGradient: "from-pink-400 to-blue-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bo-Kaap%2C_Cape_Town.jpg/640px-Bo-Kaap,_Cape_Town.jpg" },
];

// ─── Nairobi, Kenya ──────────────────────────────────────────────
const nairobi: Landmark[] = [
  { id: "nairobi-national-park", name: "Nairobi National Park", lat: -1.3732, lng: 36.858, orientationAzimuth: 0, location: "Nairobi, Kenya", citySlug: "nairobi", category: "natural", imageGradient: "from-green-600 to-amber-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lions_Nairobi_NP.jpg/640px-Lions_Nairobi_NP.jpg" },
  { id: "kenyatta-conference-centre", name: "Kenyatta International Convention Centre", lat: -1.2865, lng: 36.8201, orientationAzimuth: 0, location: "Nairobi, Kenya", citySlug: "nairobi", category: "modern", imageGradient: "from-amber-700 to-stone-600" },
  { id: "giraffe-centre", name: "Giraffe Centre", lat: -1.3782, lng: 36.747, orientationAzimuth: 0, location: "Nairobi, Kenya", citySlug: "nairobi", category: "natural", imageGradient: "from-amber-500 to-green-400" },
];

// ─── Lagos, Nigeria ──────────────────────────────────────────────
const lagos: Landmark[] = [
  { id: "lekki-conservation-centre", name: "Lekki Conservation Centre", lat: 6.4392, lng: 3.5369, orientationAzimuth: 0, location: "Lagos, Nigeria", citySlug: "lagos", category: "natural", imageGradient: "from-green-700 to-green-500" },
  { id: "nike-art-gallery", name: "Nike Art Gallery", lat: 6.4322, lng: 3.4745, orientationAzimuth: 0, location: "Lagos, Nigeria", citySlug: "lagos", category: "modern", imageGradient: "from-amber-600 to-red-500" },
  { id: "national-theatre-lagos", name: "National Theatre", lat: 6.4618, lng: 3.3895, orientationAzimuth: 0, location: "Lagos, Nigeria", citySlug: "lagos", category: "modern", imageGradient: "from-slate-600 to-stone-500" },
];

// ─── Addis Ababa, Ethiopia ───────────────────────────────────────
const addisAbaba: Landmark[] = [
  { id: "holy-trinity-cathedral-aa", name: "Holy Trinity Cathedral", lat: 9.0182, lng: 38.7631, orientationAzimuth: 90, location: "Addis Ababa, Ethiopia", citySlug: "addis-ababa", category: "religious", imageGradient: "from-green-700 to-amber-500" },
  { id: "national-museum-ethiopia", name: "National Museum of Ethiopia", lat: 9.0183, lng: 38.7501, orientationAzimuth: 0, location: "Addis Ababa, Ethiopia", citySlug: "addis-ababa", category: "historic", imageGradient: "from-stone-600 to-amber-500" },
];

// ─── Accra, Ghana ────────────────────────────────────────────────
const accra: Landmark[] = [
  { id: "independence-arch-accra", name: "Independence Arch", lat: 5.5427, lng: -0.1961, orientationAzimuth: 0, location: "Accra, Ghana", citySlug: "accra", category: "monument", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Independence_Arch_Accra.jpg/640px-Independence_Arch_Accra.jpg" },
  { id: "kwame-nkrumah-memorial", name: "Kwame Nkrumah Memorial Park", lat: 5.5392, lng: -0.2028, orientationAzimuth: 0, location: "Accra, Ghana", citySlug: "accra", category: "monument", imageGradient: "from-green-600 to-amber-400" },
];

// ─── Casablanca, Morocco ─────────────────────────────────────────
const casablanca: Landmark[] = [
  { id: "hassan-ii-mosque", name: "Hassan II Mosque", lat: 33.6086, lng: -7.6325, orientationAzimuth: 60, location: "Casablanca, Morocco", citySlug: "casablanca", category: "religious", imageGradient: "from-white to-sky-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Mosquée_Hassan_II_%283%29.jpg/640px-Mosquée_Hassan_II_(3).jpg" },
  { id: "old-medina-casablanca", name: "Old Medina", lat: 33.598, lng: -7.6122, orientationAzimuth: 0, location: "Casablanca, Morocco", citySlug: "casablanca", category: "historic", imageGradient: "from-amber-700 to-stone-600" },
];

// ─── Algiers, Algeria ────────────────────────────────────────────
const algiers: Landmark[] = [
  { id: "casbah-algiers", name: "Casbah of Algiers", lat: 36.7854, lng: 3.0583, orientationAzimuth: 0, location: "Algiers, Algeria", citySlug: "algiers", category: "historic", imageGradient: "from-white to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Casbah_d%27Alger.jpg/640px-Casbah_d'Alger.jpg" },
  { id: "makam-echahid", name: "Maqam Echahid (Martyrs' Memorial)", lat: 36.7516, lng: 3.0698, orientationAzimuth: 0, location: "Algiers, Algeria", citySlug: "algiers", category: "monument", imageGradient: "from-stone-600 to-green-500" },
];

// ─── Tunis, Tunisia ──────────────────────────────────────────────
const tunis: Landmark[] = [
  { id: "medina-of-tunis", name: "Medina of Tunis", lat: 36.7994, lng: 10.1703, orientationAzimuth: 0, location: "Tunis, Tunisia", citySlug: "tunis", category: "historic", imageGradient: "from-amber-600 to-stone-500" },
  { id: "bardo-museum", name: "Bardo National Museum", lat: 36.8095, lng: 10.1345, orientationAzimuth: 0, location: "Tunis, Tunisia", citySlug: "tunis", category: "historic", imageGradient: "from-stone-600 to-amber-500" },
];

// ─── Kinshasa, DR Congo ──────────────────────────────────────────
const kinshasa: Landmark[] = [
  { id: "palais-du-peuple", name: "Palais du Peuple", lat: -4.3246, lng: 15.3073, orientationAzimuth: 0, location: "Kinshasa, DR Congo", citySlug: "kinshasa", category: "historic", imageGradient: "from-stone-600 to-green-500" },
];

// ─── Luanda, Angola ──────────────────────────────────────────────
const luanda: Landmark[] = [
  { id: "fortaleza-sao-miguel", name: "Fortaleza de São Miguel", lat: -8.8241, lng: 13.2278, orientationAzimuth: 270, location: "Luanda, Angola", citySlug: "luanda", category: "historic", imageGradient: "from-stone-700 to-amber-500" },
];

// ─── Sydney, Australia ───────────────────────────────────────────
const sydney: Landmark[] = [
  { id: "sydney-opera-house", name: "Sydney Opera House", lat: -33.8568, lng: 151.2153, orientationAzimuth: 0, location: "Sydney, Australia", citySlug: "sydney", category: "modern", imageGradient: "from-white to-sky-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/640px-Sydney_Opera_House_-_Dec_2008.jpg" },
  { id: "sydney-harbour-bridge", name: "Sydney Harbour Bridge", lat: -33.8523, lng: 151.2108, orientationAzimuth: 90, location: "Sydney, Australia", citySlug: "sydney", category: "modern", imageGradient: "from-slate-600 to-slate-400" },
  { id: "bondi-beach", name: "Bondi Beach", lat: -33.8908, lng: 151.2743, orientationAzimuth: 90, location: "Sydney, Australia", citySlug: "sydney", category: "natural", imageGradient: "from-sky-400 to-blue-300", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Bondi_Beach%2C_Sydney%2C_Australia.jpg/640px-Bondi_Beach,_Sydney,_Australia.jpg" },
  { id: "taronga-zoo", name: "Taronga Zoo", lat: -33.8434, lng: 151.2414, orientationAzimuth: 180, location: "Sydney, Australia", citySlug: "sydney", category: "natural", imageGradient: "from-green-600 to-emerald-400" },
  { id: "darling-harbour", name: "Darling Harbour", lat: -33.8731, lng: 151.2006, orientationAzimuth: 0, location: "Sydney, Australia", citySlug: "sydney", category: "modern", imageGradient: "from-blue-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Darling_Harbour%2C_Sydney.jpg/640px-Darling_Harbour,_Sydney.jpg" },
  { id: "the-rocks-sydney", name: "The Rocks", lat: -33.8596, lng: 151.2086, orientationAzimuth: 0, location: "Sydney, Australia", citySlug: "sydney", category: "historic", imageGradient: "from-stone-600 to-amber-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/The_Rocks%2C_Sydney_2012.jpg/640px-The_Rocks,_Sydney_2012.jpg" },
];

// ─── Melbourne, Australia ────────────────────────────────────────
const melbourne: Landmark[] = [
  { id: "flinders-street-station", name: "Flinders Street Station", lat: -37.8183, lng: 144.9671, orientationAzimuth: 0, location: "Melbourne, Australia", citySlug: "melbourne", category: "historic", imageGradient: "from-amber-600 to-stone-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Flinders_Street_Station_at_Night.jpg/640px-Flinders_Street_Station_at_Night.jpg" },
  { id: "federation-square", name: "Federation Square", lat: -37.818, lng: 144.9691, orientationAzimuth: 0, location: "Melbourne, Australia", citySlug: "melbourne", category: "modern", imageGradient: "from-slate-500 to-amber-400" },
  { id: "royal-exhibition-building", name: "Royal Exhibition Building", lat: -37.8047, lng: 144.9717, orientationAzimuth: 180, location: "Melbourne, Australia", citySlug: "melbourne", category: "historic", imageGradient: "from-stone-600 to-stone-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Royal_Exhibition_Building_Melbourne.jpg/640px-Royal_Exhibition_Building_Melbourne.jpg" },
  { id: "shrine-of-remembrance", name: "Shrine of Remembrance", lat: -37.8305, lng: 144.9734, orientationAzimuth: 0, location: "Melbourne, Australia", citySlug: "melbourne", category: "monument", imageGradient: "from-stone-600 to-stone-400" },
  { id: "brighton-bathing-boxes", name: "Brighton Bathing Boxes", lat: -37.9186, lng: 144.9872, orientationAzimuth: 270, location: "Melbourne, Australia", citySlug: "melbourne", category: "historic", imageGradient: "from-blue-500 to-red-400" },
];

// ─── Brisbane, Australia ─────────────────────────────────────────
const brisbane: Landmark[] = [
  { id: "story-bridge", name: "Story Bridge", lat: -27.4613, lng: 153.0358, orientationAzimuth: 90, location: "Brisbane, Australia", citySlug: "brisbane", category: "modern", imageGradient: "from-slate-600 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Story_Bridge_Brisbane.jpg/640px-Story_Bridge_Brisbane.jpg" },
  { id: "south-bank-brisbane", name: "South Bank Parklands", lat: -27.4796, lng: 153.0211, orientationAzimuth: 0, location: "Brisbane, Australia", citySlug: "brisbane", category: "natural", imageGradient: "from-green-500 to-sky-400" },
  { id: "lone-pine-koala", name: "Lone Pine Koala Sanctuary", lat: -27.5332, lng: 152.9688, orientationAzimuth: 0, location: "Brisbane, Australia", citySlug: "brisbane", category: "natural", imageGradient: "from-green-600 to-emerald-400" },
];

// ─── Perth, Australia ────────────────────────────────────────────
const perth: Landmark[] = [
  { id: "kings-park", name: "Kings Park and Botanic Garden", lat: -31.9606, lng: 115.8328, orientationAzimuth: 0, location: "Perth, Australia", citySlug: "perth", category: "natural", imageGradient: "from-green-600 to-emerald-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Kings_Park_Perth_2012.jpg/640px-Kings_Park_Perth_2012.jpg" },
  { id: "bell-tower-perth", name: "The Bell Tower", lat: -31.9579, lng: 115.8596, orientationAzimuth: 0, location: "Perth, Australia", citySlug: "perth", category: "modern", imageGradient: "from-sky-500 to-blue-400" },
  { id: "cottesloe-beach", name: "Cottesloe Beach", lat: -31.9943, lng: 115.7514, orientationAzimuth: 270, location: "Perth, Australia", citySlug: "perth", category: "natural", imageGradient: "from-sky-400 to-orange-300" },
];

// ─── Auckland, New Zealand ───────────────────────────────────────
const auckland: Landmark[] = [
  { id: "sky-tower-auckland", name: "Sky Tower", lat: -36.8485, lng: 174.7621, orientationAzimuth: 0, location: "Auckland, New Zealand", citySlug: "auckland", category: "modern", imageGradient: "from-slate-600 to-sky-500", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Sky_Tower_Auckland.jpg/640px-Sky_Tower_Auckland.jpg" },
  { id: "auckland-harbour-bridge", name: "Auckland Harbour Bridge", lat: -36.8338, lng: 174.7425, orientationAzimuth: 90, location: "Auckland, New Zealand", citySlug: "auckland", category: "modern", imageGradient: "from-slate-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Auckland_Harbour_Bridge_2009.jpg/640px-Auckland_Harbour_Bridge_2009.jpg" },
  { id: "rangitoto-island", name: "Rangitoto Island", lat: -36.7868, lng: 174.8612, orientationAzimuth: 0, location: "Auckland, New Zealand", citySlug: "auckland", category: "natural", imageGradient: "from-green-700 to-sky-400" },
  { id: "mount-eden", name: "Mount Eden (Maungawhau)", lat: -36.8767, lng: 174.7641, orientationAzimuth: 0, location: "Auckland, New Zealand", citySlug: "auckland", category: "natural", imageGradient: "from-green-600 to-emerald-400" },
];

// ─── Wellington, New Zealand ─────────────────────────────────────
const wellington: Landmark[] = [
  { id: "te-papa-museum", name: "Te Papa Tongarewa (National Museum)", lat: -41.2904, lng: 174.782, orientationAzimuth: 0, location: "Wellington, New Zealand", citySlug: "wellington", category: "modern", imageGradient: "from-slate-500 to-sky-400", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Te_Papa_Wellington_2012.jpg/640px-Te_Papa_Wellington_2012.jpg" },
  { id: "wellington-cable-car", name: "Wellington Cable Car", lat: -41.2834, lng: 174.7685, orientationAzimuth: 0, location: "Wellington, New Zealand", citySlug: "wellington", category: "historic", imageGradient: "from-red-600 to-green-500" },
  { id: "beehive-parliament", name: "Beehive (Parliament)", lat: -41.2784, lng: 174.7763, orientationAzimuth: 270, location: "Wellington, New Zealand", citySlug: "wellington", category: "modern", imageGradient: "from-stone-500 to-stone-400" },
];

// ─── Existing landmarks without city association ─────────────────
const standalone: Landmark[] = [
  { id: "manhattanhenge", name: "Manhattanhenge", lat: 40.758, lng: -73.9855, orientationAzimuth: 299, location: "New York, USA", citySlug: "new-york", category: "technical", imageGradient: "from-slate-700 to-blue-900", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Manhattanhenge_2007.jpg/640px-Manhattanhenge_2007.jpg" },
  { id: "stonehenge-axis", name: "Stonehenge Solstice Axis", lat: 51.1789, lng: -1.8262, orientationAzimuth: 49, location: "Wiltshire, UK", category: "historic", imageGradient: "from-amber-900 to-stone-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Stonehenge%2C_Wiltshire.jpg/640px-Stonehenge,_Wiltshire.jpg" },
  { id: "abu-simbel-axis", name: "Abu Simbel Sun Temple Axis", lat: 22.3372, lng: 31.6258, orientationAzimuth: 106, location: "Nubia, Egypt", category: "historic", imageGradient: "from-orange-900 to-amber-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Abu_Simbel%2C_Egypt%2C_Oct_2004.jpg/640px-Abu_Simbel,_Egypt,_Oct_2004.jpg" },
  { id: "north-axis-study", name: "North Axis Study", lat: 40.7128, lng: -74.006, orientationAzimuth: 0, location: "New York, USA", citySlug: "new-york", category: "technical", imageGradient: "from-slate-600 to-slate-800", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Polaris_star_trail.jpg/640px-Polaris_star_trail.jpg" },
  { id: "stonehenge", name: "Stonehenge", lat: 51.1789, lng: -1.8262, orientationAzimuth: 49, location: "Wiltshire, UK", category: "historic", imageGradient: "from-amber-900 to-stone-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Stonehenge%2C_Wiltshire.jpg/640px-Stonehenge,_Wiltshire.jpg" },
  { id: "chichen-itza", name: "Chichén Itzá", lat: 20.6843, lng: -88.5678, orientationAzimuth: 66, location: "Yucatán, Mexico", category: "historic", imageGradient: "from-green-900 to-emerald-700", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/640px-Chichen_Itza_3.jpg" },
];


export const LANDMARKS_DATA: Landmark[] = [
  ...tokyo,
  ...osaka,
  ...nagoya,
  ...delhi,
  ...mumbai,
  ...bangalore,
  ...chennai,
  ...kolkata,
  ...hyderabad,
  ...surat,
  ...pune,
  ...ahmedabad,
  ...shanghai,
  ...beijing,
  ...hongKong,
  ...guangzhou,
  ...shenzhen,
  ...chengdu,
  ...nanjing,
  ...hangzhou,
  ...xian,
  ...wuhan,
  ...chongqing,
  ...harbin,
  ...tianjin,
  ...shenyang,
  ...dongguan,
  ...foshan,
  ...suzhou,
  ...seoul,
  ...bangkok,
  ...singapore,
  ...kualaLumpur,
  ...jakarta,
  ...hoChiMinh,
  ...manila,
  ...dhaka,
  ...karachi,
  ...lahore,
  ...tehran,
  ...istanbul,
  ...ankara,
  ...dubai,
  ...abuDhabi,
  ...riyadh,
  ...baghdad,
  ...jerusalem,
  ...london,
  ...paris,
  ...rome,
  ...milan,
  ...berlin,
  ...munich,
  ...hamburg,
  ...madrid,
  ...barcelona,
  ...valencia,
  ...lisbon,
  ...amsterdam,
  ...brussels,
  ...zurich,
  ...vienna,
  ...prague,
  ...warsaw,
  ...budapest,
  ...athens,
  ...moscow,
  ...dublin,
  ...oslo,
  ...stockholm,
  ...helsinki,
  ...copenhagen,
  ...newYork,
  ...losAngeles,
  ...chicago,
  ...sanFrancisco,
  ...washingtonDC,
  ...houston,
  ...dallas,
  ...miami,
  ...phoenix,
  ...seattle,
  ...boston,
  ...philadelphia,
  ...atlanta,
  ...detroit,
  ...toronto,
  ...montreal,
  ...vancouver,
  ...mexicoCity,
  ...saoPaulo,
  ...rio,
  ...buenosAires,
  ...santiago,
  ...lima,
  ...bogota,
  ...cairo,
  ...johannesburg,
  ...capeTown,
  ...nairobi,
  ...lagos,
  ...addisAbaba,
  ...accra,
  ...casablanca,
  ...algiers,
  ...tunis,
  ...kinshasa,
  ...luanda,
  ...sydney,
  ...melbourne,
  ...brisbane,
  ...perth,
  ...auckland,
  ...wellington,
  ...standalone,
];
