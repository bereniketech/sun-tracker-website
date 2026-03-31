/**
 * Script to add imageUrl to all landmarks in landmarks-data.ts that are missing it.
 * Run: node scripts/add-image-urls.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Compute the Wikimedia Commons thumb URL for a given filename.
 * rawFilename may be URL-encoded (e.g. "Merlion%2C_Singapore.jpg").
 * MediaWiki stores files with decoded names, and the hash
 * is computed on the decoded canonical filename.
 */
function wikimediaThumbUrl(rawFilename) {
  const decoded = decodeURIComponent(rawFilename).replace(/ /g, "_");
  const hash = crypto.createHash("md5").update(decoded).digest("hex");
  const a = hash[0];
  const ab = hash.slice(0, 2);
  const displayName = decoded;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${rawFilename}/640px-${displayName}`;
}

const filePath = path.join(__dirname, "../src/lib/landmarks-data.ts");
let content = fs.readFileSync(filePath, "utf8");

/** Map of landmark id → Wikimedia Commons image filename (raw, may be URL-encoded) */
const FILENAMES = {
  // Europe West — London
  "tower-bridge": "Tower_Bridge_from_Shad_Thames.jpg",
  "big-ben": "Clock_Tower_-_Palace_of_Westminster%2C_London_-_September_2006.jpg",
  "london-eye": "The_London_Eye_September_2009.jpg",
  "buckingham-palace": "Buckingham_Palace%2C_London_-_April_2009.jpg",
  "st-pauls-cathedral": "St_Pauls_Cathedral%2C_London%2C_England_-_Jan_2010.jpg",
  "tower-of-london": "Tower_of_London_viewed_from_the_River_Thames.jpg",
  "the-shard": "The_Shard%2C_London.jpg",
  "westminster-abbey": "Westminster_Abbey_Exterior%2C_London_-_Sept_2006.jpg",
  "trafalgar-square": "Trafalgar_Square%2C_London_2006.jpg",
  "greenwich-observatory": "Royal_Observatory_Greenwich.jpg",

  // Paris
  "eiffel-tower": "Tour_Eiffel_Wikimedia_Commons.jpg",
  "arc-de-triomphe": "Arc_de_Triomphe%2C_Paris_%282007%29.jpg",
  "notre-dame-paris": "Cath%C3%A9drale_Notre-Dame_de_Paris%2C_29_March_2014.jpg",
  "sacre-coeur": "Sacre_Coeur_Montmartre_church%2C_Paris_August_2017.jpg",
  "louvre-pyramid": "Louvre_Museum_Wikimedia_Commons.jpg",
  "pantheon-paris": "Paris_Pantheon_Facade.jpg",
  "place-de-la-concorde": "Place_de_la_Concorde_2007.jpg",
  "pont-alexandre-iii": "Pont_Alexandre_III%2C_Paris_2008.jpg",
  "tour-montparnasse": "Tour_Maine-Montparnasse_summer_2007.jpg",
  "musee-dorsay": "Mus%C3%A9e_d%27Orsay%2C_North_face.jpg",

  // Rome
  "colosseum": "Colosseo_2020.jpg",
  "st-peters-basilica": "Saint_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg",
  "trevi-fountain": "Fontana_di_Trevi_2015.jpg",
  "roman-forum": "Roman_Forum_2007.jpg",
  "pantheon-rome": "Pantheon%28Rome%29_from_outside.jpg",
  "castel-sant-angelo": "Castel_sant%27angelo.jpg",
  "spanish-steps": "Spanish_steps_in_Rome.jpg",
  "piazza-navona": "Piazza_navona_fountain_detail.jpg",

  // Milan
  "duomo-di-milano": "Duomo_Milano_2012_%285%29.jpg",
  "galleria-vittorio": "Galleria_Vittorio_Emanuele_II_2013_Interior.jpg",
  "castello-sforzesco": "Castello_Sforzesco_a_Milano.jpg",
  "bosco-verticale": "Bosco_Verticale_March_2014.jpg",

  // Berlin
  "brandenburg-gate": "Brandenburg_Gate_at_night_2.jpg",
  "berlin-tv-tower": "Fernsehturm_Berlin_2006.jpg",
  "reichstag": "Reichstag_building_Berlin_view_from_west_before_sunset.jpg",
  "berlin-cathedral": "Berliner_Dom_2021.jpg",
  "east-side-gallery": "East_Side_Gallery_Berlin_2010.jpg",
  "checkpoint-charlie": "Checkpoint_charlie_2004.jpg",
  "memorial-murdered-jews": "Memorial_to_the_Murdered_Jews_of_Europe.jpg",

  // Munich
  "frauenkirche-munich": "Muenchen_Frauenkirche_0097.JPG",
  "marienplatz": "Neues_Rathaus_Muenchen.jpg",
  "nymphenburg-palace": "Schloss_Nymphenburg_2013.jpg",
  "olympic-park-munich": "Olympiastadion_M%C3%BCnchen_Innen_Ost.JPG",

  // Hamburg
  "elbphilharmonie": "Elbphilharmonie.jpg",
  "speicherstadt": "Hamburg_Speicherstadt_at_sunset.jpg",
  "st-michaelis-church": "Hamburg_Michel.jpg",

  // Madrid
  "royal-palace-madrid": "Palacio_Real_de_Madrid_-_01.jpg",
  "puerta-del-sol": "Puerta_del_Sol_2018.jpg",
  "plaza-mayor-madrid": "Madrid_-_Plaza_Mayor_2012.jpg",
  "prado-museum": "Museo_del_Prado_2016_%2830474877060%29.jpg",
  "almudena-cathedral": "Almudena_Cathedral_%28Madrid%29_HDR.jpg",
  "retiro-park": "Parque_del_Buen_Retiro%2C_Madrid%2C_2014.jpg",

  // Barcelona
  "sagrada-familia": "Sagrada_Familia_01.jpg",
  "park-guell": "Park_G%C3%BCell%2C_Barcelona%2C_Spain_%2819%29.jpg",
  "casa-batllo": "Casa_Batll%C3%B3_%282006%29.jpg",
  "casa-mila": "BarcelonaCasaMila.jpg",
  "barceloneta-beach": "Barceloneta_Beach_%28Barcelona%2C_Spain%29.jpg",
  "montjuic-castle": "Castello_di_Montjuic.jpg",
  "gothic-quarter": "Barri_G%C3%B2tic_01.jpg",

  // Valencia
  "city-of-arts-sciences": "Valencia_Ciudad_de_las_Artes_y_las_Ciencias.jpg",
  "valencia-cathedral": "Catedral_de_Valencia.jpg",
  "lonja-de-la-seda": "Lonja_de_la_Seda_de_Valencia_2013.jpg",

  // Lisbon
  "tower-of-belem": "Belem_tower.JPG",
  "jeronimos-monastery": "Mos_Jer%C3%B3nimos_8175.jpg",
  "padrao-dos-descobrimentos": "Padrao_dos_Descobrimentos-Lissabon.jpg",
  "sao-jorge-castle": "Castelo_de_S%C3%A3o_Jorge%2C_Lisbon.jpg",
  "ponte-25-abril": "Ponte_25_de_Abril_%281%29.jpg",

  // Amsterdam
  "rijksmuseum": "Rijksmuseum_-_The_Garden_2016.jpg",
  "anne-frank-house": "Anne_Frank_House_2014.jpg",
  "dam-square": "Amsterdam_-_Dam_Square_2012.jpg",
  "westerkerk": "Westerkerk%2C_Amsterdam_-_April_2007.jpg",
  "amsterdam-canals": "Amsterdam_canal_reflection_1.jpg",

  // Brussels
  "grand-place-brussels": "Grand-Place%2C_Brussels%2C_Belgium_-_Jan_2006.jpg",
  "atomium": "Atomium_Brussels.jpg",
  "manneken-pis": "Manneken_Pis_Brussels.jpg",

  // Zurich
  "grossmunster": "Grossmunster.jpg",
  "fraumunster": "Zirich_-_Fr%C3%B6m%C3%BCnster_gnagelt.jpg",
  "lake-zurich": "ZurichSeen.jpg",

  // Europe East
  "stephansdom": "Stephansdom_Wien_Suedansicht.jpg",
  "schonbrunn-palace": "Schonbrunn_Palace%2C_Vienna%2C_August_2014.jpg",
  "belvedere-palace": "Oberes_Belvedere_Wien.jpg",
  "hofburg-palace": "Michaelerplatz%2C_Vienna.jpg",
  "prater-ferris-wheel": "Riesenrad_%28Wien%29.jpg",

  // Prague
  "charles-bridge": "Charles_Bridge_at_Dusk.jpg",
  "prague-castle": "Prazsky_hrad_2006.jpg",
  "old-town-square-prague": "Old_Town_Square%2C_Prague.jpg",
  "st-vitus-cathedral": "Cathédrale_Saint-Guy_de_Prague.jpg",
  "dancing-house": "Dancing_House_Prague.jpg",

  // Warsaw
  "palace-of-culture-warsaw": "Palace_of_Culture_and_Science_in_Warsaw%2C_2013.jpg",
  "old-town-warsaw": "Warsaw_Old_Town_2010.jpg",
  "royal-castle-warsaw": "Zamek_Kr%C3%B3lewski_w_Warszawie_2009.jpg",
  "wilanow-palace": "Palac_Wilanow_2008.jpg",

  // Budapest
  "hungarian-parliament": "Hungarian_Parliament_Building%2C_Budapest%2C_2014.jpg",
  "buda-castle": "Buda_Castle_from_Chain_Bridge.jpg",
  "chain-bridge": "Lanchid_Budapest.jpg",
  "fishermans-bastion": "Fishermans_Bastion_Budapest.jpg",
  "heroes-square-budapest": "Budapest_Heroes_Square.jpg",

  // Athens
  "acropolis": "The_Acropolis_of_Athens_viewed_from_the_Hill_of_the_Muses.jpg",
  "temple-of-olympian-zeus": "Olympieion_Athens.jpg",
  "plaka-district": "Plaka_district%2C_Athens.jpg",
  "panathenaic-stadium": "Panathinaiko_stadio.jpg",

  // Moscow
  "red-square": "Red_Square%2C_Moscow.jpg",
  "st-basils-cathedral": "Moscow_StBasil_asv2019img2.jpg",
  "moscow-kremlin": "Moscow_Kremlin_from_Kamenny_bridge.jpg",
  "christ-the-saviour": "Cathedral_of_Christ_the_Saviour_in_Moscow.jpg",
  "bolshoi-theatre": "Bolshoi_Theatre_September_2011.jpg",
  "moscow-state-university": "Moscow_State_University%2C_Main_building%2C_Panorama.jpg",

  // Dublin
  "trinity-college-dublin": "TrinityCollegeDublin_Front.jpg",
  "ha-penny-bridge": "Ha%27penny_Bridge%2C_Dublin.jpg",
  "st-patricks-cathedral": "St._Patrick%27s_Cathedral%2C_Dublin%2C_exterior_2.jpg",
  "dublin-castle": "Dublin_castle.jpg",

  // Oslo
  "oslo-opera-house": "Oslo_Opera_House_2008.jpg",
  "vigeland-park": "Vigeland_park_Oslo_August_2011.jpg",
  "akershus-fortress": "Akershus_Fortress_Norway.jpg",

  // Stockholm
  "gamla-stan": "Gamla_Stan_view_from_Monteliusv%C3%A4gen.jpg",
  "stockholm-city-hall": "Stockholm_City_Hall%2C_Sweden.jpg",
  "vasa-museum": "Vasamuseet_2013.jpg",
  "stockholm-royal-palace": "Stockholm_Palace_from_Skeppsholmen.jpg",

  // Helsinki
  "helsinki-cathedral": "Helsinki_Cathedral_-_June_2020.jpg",
  "suomenlinna": "Suomenlinna_fortress_Finland.jpg",
  "temppeliaukio-church": "Temppeliaukio_Church_Helsinki.jpg",

  // Copenhagen
  "little-mermaid": "Copenhagen_-_The_Little_Mermaid_statue.jpg",
  "nyhavn": "Nyhavn_Copenhagen.jpg",
  "tivoli-gardens": "Tivoli_Gardens_Copenhagen.jpg",
  "christiansborg-palace": "Christiansborg_Palace_Copenhagen.jpg",

    // Korea
    "gyeongbokgung": "Korean_palace_Gyeongbokgung_1.jpg",
    "namsan-tower": "N_Seoul_Tower_-_Seoul%2C_South_Korea_-_August_2011.jpg",
    "bukchon-hanok": "Bukchon_Hanok_Village.jpg",
    "changdeokgung": "Changdeokgung_Palace.jpg",
    "dongdaemun-design-plaza": "Seoul_-_Dongdaemun_Design_Plaza_01.jpg",
    "lotte-world-tower": "Lotte_World_Tower_2017.jpg",

    // Bangkok
    "grand-palace-bangkok": "Grand_Palace_Bangkok.jpg",
    "wat-arun": "Wat_Arun_temple.jpg",
    "wat-pho": "Reclining_Buddha_Wat_Pho_Bangkok.jpg",
    "wat-saket": "Wat_Saket_temple.jpg",
    "mahanakhon": "MahaNakhon_tower_2016.jpg",

    // Singapore
    "marina-bay-sands": "Marina_Bay_Sands_in_the_evening_-_20101120.jpg",
    "merlion": "Merlion%2C_Singapore%2C_Dec_2005.jpg",
    "gardens-by-the-bay": "Gardens_by_the_Bay%2C_Singapore_-_20130101-02.jpg",
    "supertree-grove": "Gardens_by_the_Bay%2C_Singapore_-_20130101-02.jpg",
    "esplanade-theatres": "Esplanade_Theatres_on_the_Bay%2C_Singapore.jpg",

    // Kuala Lumpur
    "petronas-towers": "Petronas_Twin_Towers%2C_Kuala_Lumpur.jpg",
    "kl-tower": "Menara_Kuala_Lumpur.jpg",
    "batu-caves": "Batu_Caves%2C_Kuala_Lumpur%2C_Malaysia.jpg",
    "sultan-abdul-samad-building": "Sultan_Abdul_Samad_Building.JPG",

    // Jakarta
    "monas": "National_Monument_of_Indonesia.jpg",
    "istiqlal-mosque": "Masjid_Istiqlal_Jakarta.jpg",
    "jakarta-cathedral": "Cathedral_of_Our_Lady_of_Assumption_Jakarta.jpg",

    // Ho Chi Minh
    "notre-dame-saigon": "Notre-Dame_Cathedral_Basilica_of_Saigon.jpg",
    "independence-palace": "Reunification_Palace_Ho_Chi_Minh_City.jpg",
    "bitexco-tower": "Bitexco_Financial_Tower_2010.jpg",

    // Manila
    "rizal-monument": "Rizal_Monument.jpg",
    "intramuros": "Fort_Santiago_gate.jpg",
    "san-agustin-church": "San_Agustin_Church_Manila.jpg",

    // Dhaka
    "lalbagh-fort": "Lalbagh_Fort.jpg",
    "national-parliament-dhaka": "National_Parliament_House_of_Bangladesh.jpg",
    "ahsan-manzil": "Ahsan_Manzil.jpg",

    // Karachi
    "quaid-e-azam-mausoleum": "Mazar-e-Quaid_Karachi_2.jpg",
    "clifton-beach": "Clifton_Beach%2C_Karachi.jpg",

    // Lahore
    "badshahi-mosque": "Badshahi_Mosque_-_Lahore.jpg",
    "lahore-fort": "Lahore_Fort.jpg",
    "minar-e-pakistan": "Minar-e-Pakistan.JPG",

    // Tehran
    "azadi-tower": "Azadi_Tower_2014.jpg",
    "milad-tower": "Milad_Tower_Tehran.jpg",
    "golestan-palace": "Iranian_Throne_%28Golestan_Palace%29.jpg",

    // Istanbul
    "hagia-sophia": "Hagia_Sophia_in_Istanbul_2023.jpg",
    "blue-mosque": "Blue_Mosque%2C_Istanbul%2C_Turkey.jpg",
    "topkapi-palace": "Topkapi_Palace_2007.jpg",
    "galata-tower": "Galata_Tower_-_P%C3%A9ter_Kis.jpg",
    "bosphorus-bridge": "Bosphorus_bridge.jpg",
    "basilica-cistern": "Basilica_Cistern_20041213_01.jpg",
    "grand-bazaar": "Grand_Bazaar_Istanbul.jpg",

    // Ankara
    "anitkabir": "Anitkabir.jpg",
    "kocatepe-mosque": "Kocatepe_Camii_2011.jpg",

    // Dubai
    "burj-khalifa": "Burj_Khalifa_by_Emaar.jpg",
    "burj-al-arab": "Burj_Al_Arab%2C_Dubai_by_Joi_Ito_Dec2007.jpg",
    "palm-jumeirah": "Palm_Jumeirah_aerial_view.jpg",
    "dubai-frame": "Dubai_Frame_2019.jpg",
    "dubai-mall": "Dubai_Mall.jpg",
    "museum-of-the-future": "Museum_of_the_Future_Dubai.jpg",

    // Abu Dhabi
    "sheikh-zayed-mosque": "Sheikh_Zayed_Grand_Mosque_Center.jpg",
    "louvre-abu-dhabi": "Louvre_Abu_Dhabi_-_from_the_sea_%2846948697812%29.jpg",
    "qasr-al-watan": "Qasr_Al_Watan_Palace_Abu_Dhabi_3.jpg",

    // Riyadh
    "kingdom-centre": "Kingdom_Centre_Tower_Riyadh.jpg",
    "masmak-fortress": "Masmak_fortress_in_Riyadh.JPG",

    // Baghdad
    "al-kadhimiya-mosque": "Al-Kadhimiya_Mosque.jpg",
    "baghdad-tower": "Baghdad_TV_Tower.jpg",

    // Jerusalem
    "dome-of-the-rock": "Dome_of_the_rock.jpg",
    "western-wall": "Western_Wall_-_Kotel.JPG",
    "church-holy-sepulchre": "Jerusalem_Holy_Sepulchre_BW_1.JPG",
    "tower-of-david": "Tower_of_David_Jerusalem.jpg",

    // Small Indian cities
    "surat-castle": "Surat_Castle.jpg",
    "shaniwar-wada": "Shaniwar_Wada.jpg",
    "aga-khan-palace": "Aga_Khan_Palace_Pune.JPG",
    "sabarmati-ashram": "Sabarmati_Ashram.jpg",
    "adalaj-stepwell": "Adalaj_Stepwell.JPG",

    // Small Chinese cities
    "tianjin-eye": "Tianjin_Eye.jpg",
    "shenyang-imperial-palace": "Shenyang_Imperial_Palace.jpg",
    "keyuan-garden": "Keyuan_Garden_%28Dongguan%29.jpg",
    "foshan-ancestral-temple": "Foshan_Zu_Miao_02.jpg",
    "humble-administrator-garden": "Humble_Administrator%27s_Garden_Suzhou.jpg",
    "tiger-hill": "Tiger_Hill_Suzhou.jpg",

  // Africa
  "pyramids-of-giza": "Gizeh_Plateau_Overview.jpg",
  "sphinx": "Great_Sphinx_of_Giza_-_20080716a.jpg",
  "cairo-tower": "Cairo_Tower_at_night.jpg",
  "al-azhar-mosque": "Al-Azhar_Mosque_Entr%C3%A9e.jpg",
  "egyptian-museum": "Egyptian_Museum%2C_Cairo.jpg",
  "khan-el-khalili": "Khan_el-Khalili%2C_Cairo.jpg",
  "saladin-citadel": "Mosque-Madrasa_of_Sultan_Hassan.jpg",

  "johannesburg-art-museum": "Johannesburg_Art_Gallery.jpg",
  "apartheid-museum": "Apartheid_Museum_Gate.jpg",
  "constitution-hill": "Constitutional_Court%2C_Johannesburg.jpg",

  "table-mountain": "Table_Mountain_DanieVDM.jpg",
  "cape-point": "Cape_of_Good_Hope_sign_2.jpg",
  "robben-island": "Robben_Island_Cape_Town.jpg",
  "cape-town-waterfront": "V%26A_Waterfront_Cape_Town.jpg",
  "bo-kaap": "Bo-Kaap%2C_Cape_Town.jpg",

  "nairobi-national-park": "Lions_Nairobi_NP.jpg",
  "kenyatta-conference-center": "KICC%2C_Nairobi.jpg",
  "karen-blixen-museum": "Karen_Blixen_Museum_Nairobi.jpg",

  "national-arts-theatre-lagos": "National_Arts_Theatre%2C_Lagos.jpg",
  "terra-kulture": "Terra_Kultere_Victoria_Island.jpg",
  "balogun-market": "Balogun_market_Lagos.jpg",

  "holy-trinity-cathedral-addis": "Holy_Trinity_Cathedral_Addis_Abeba.jpg",
  "national-museum-addis": "National_Museum_of_Ethiopia.jpg",

  "independence-arch-accra": "Independence_Arch_Accra.jpg",
  "national-theatre-accra": "National_Theatre_of_Ghana.jpg",

  "hassan-ii-mosque": "Mosquée_Hassan_II_%283%29.jpg",
  "medina-of-fes": "Fes_Bou_Inania_cropped.jpg",

  "notre-dame-d-afrique": "Notre-Dame_d%27Afrique%2C_Algiers.jpg",
  "casbah-algiers": "Casbah_d%27Alger.jpg",

  "carthage-ruins": "Carthage_Roman_Theatre.jpg",
  "zitouna-mosque": "Zitouna_Mosque_Tunis.jpg",

  "kinshasa-cathedral": "Cathedral_of_Our_Lady_of_Congo%2C_Kinshasa.jpg",
  "luanda-fortress": "Fortaleza_de_S%C3%A3o_Miguel%2C_Luanda.jpg",

  // Oceania
  "sydney-opera-house": "Sydney_Opera_House_-_Dec_2008.jpg",
  "harbour-bridge": "Sydney_Harbour_Bridge_pano.jpg",
  "bondi-beach": "Bondi_Beach%2C_Sydney%2C_Australia.jpg",
  "darling-harbour": "Darling_Harbour%2C_Sydney.jpg",
  "the-rocks-sydney": "The_Rocks%2C_Sydney_2012.jpg",
  "sydney-tower": "Sydney_Tower_Eye_2012.jpg",

  "flinders-street-station": "Flinders_Street_Station_at_Night.jpg",
  "eureka-tower": "Eureka_Tower_2_January_2008.jpg",
  "royal-exhibition-building": "Royal_Exhibition_Building_Melbourne.jpg",
  "crown-casino": "Crown_Casino_Melbourne.jpg",
  "acmi": "ACMI_Melbourne.jpg",

  "story-bridge": "Story_Bridge_Brisbane.jpg",
  "south-bank-parklands": "South_Bank_Parklands_Brisbane.jpg",
  "brisbane-city-hall": "Brisbane_City_Hall.jpg",

  "swanbell-tower": "Swan_Bell_Tower_Perth.jpg",
  "kings-park": "Kings_Park_Perth_2012.jpg",
  "fremantle-prison": "Fremantle_Prison.jpg",

  "sky-tower-auckland": "Sky_Tower_Auckland.jpg",
  "auckland-harbour-bridge": "Auckland_Harbour_Bridge_2009.jpg",
  "one-tree-hill": "One_Tree_Hill%2C_Auckland%2C_NZ.jpg",
  "auckland-war-memorial": "Auckland_War_Memorial_Museum.jpg",

  "beehive-wellington": "Beehive%2C_Wellington.jpg",
  "te-papa-museum": "Te_Papa_Wellington_2012.jpg",
  "carter-observatory": "Carter_Observatory_Wellington.jpg",

  // Americas — New York
  "brooklyn-bridge": "Brooklyn_Bridge_Postdlf.jpg",
  "times-square": "New_york_times_square-terabass.jpg",
  "one-world-trade": "One_World_Trade_Center%2C_Lower_Manhattan%2C_New_York_City.jpg",
  "flatiron-building": "Flatiron_Pano_ny.jpg",

  // Los Angeles
  "hollywood-sign": "Hollywood_Sign_%282020%29.jpg",
  "griffith-observatory": "Griffith_Observatory_-_Jan_2012.jpg",
  "getty-center": "Getty_Center_from_garden.jpg",
  "santa-monica-pier": "Santa_Monica_Pier.jpg",
  "the-broad": "The_Broad_art_museum_Los_Angeles.jpg",
  "la-coliseum": "Los_Angeles_Memorial_Coliseum%2C_2012.jpg",

  // Chicago
  "willis-tower": "Willis_Tower_2015.jpg",
  "cloud-gate": "Cloud_Gate_at_Night_2014.jpg",
  "navy-pier": "Navy_Pier_Chicago_Illinois_2012.jpg",
  "chicago-riverwalk": "Chicago_Riverwalk_2014.jpg",
  "millennium-park": "Millennium_Park_-_The_Bean.jpg",
  "wrigley-field": "Wrigley_Field_2014.jpg",

  // San Francisco
  "golden-gate-bridge": "Golden_Gate_1.jpg",
  "alcatraz": "Alcatraz_Island_photo_D_Ramey_Logan.jpg",
  "fishermans-wharf": "Fishermans_Wharf_San_Francisco.jpg",
  "painted-ladies": "Painted_Ladies_San_Francisco.jpg",
  "sf-city-hall": "San_Francisco_City_Hall_2012.jpg",

  // Washington DC
  "lincoln-memorial": "Lincoln_memorial.jpg",
  "washington-monument": "Washington_Monument_Dusk_Jan_2006.jpg",
  "us-capitol": "United_States_Capitol_west_front_edit2.jpg",
  "white-house": "White_House_Washington.jpg",
  "jefferson-memorial": "Jefferson_Memorial_Tidal_Basin.jpg",
  "smithsonian-castle": "Smithsonian_Institution_Building.jpg",

  // Houston
  "nasa-johnson-space-center": "Johnson_Space_Center.jpg",
  "houston-city-hall": "Houston_City_Hall_and_Hermann_Square.jpg",
  "menil-collection": "The_Menil_Collection_Houston.jpg",

  // Dallas
  "reunion-tower": "Reunion_Tower%2C_Dallas.jpg",
  "dealey-plaza": "Dealey_Plaza_2011.jpg",
  "at-t-stadium": "AT%26T_Stadium_aerial.jpg",

  // Miami
  "south-beach": "Miami_Beach_FL_USA.jpg",
  "art-deco-historic-district": "Ocean_Drive%2C_Miami%2C_Florida%2C_Art_Deco_buildings.jpg",
  "wynwood-walls": "Wynwood_Walls_Miami_2013.jpg",
  "american-airlines-arena": "AmericanAirlinesArena-Miami.jpg",

  // Phoenix
  "camelback-mountain": "Camelback_Mountain_Phoenix.jpg",
  "desert-botanical-garden": "Desert_Botanical_Garden_Phoenix.jpg",

  // Seattle
  "space-needle": "Space_Needle_2011-07-04.jpg",
  "pike-place-market": "Pike_Place_Market_Entrance.jpg",
  "seattle-central-library": "Seattle_Central_Library%2C_exterior.jpg",
  "chihuly-garden": "Chihuly_Garden_and_Glass_Seattle.jpg",

  // Boston
  "faneuil-hall": "Faneuil_Hall%2C_Boston%2C_Massachusetts.jpg",
  "bunker-hill-monument": "Bunker_Hill_Monument.jpg",
  "fenway-park": "Fenway_Park%2C_September_46%2C_2007.jpg",

  // Philadelphia
  "liberty-bell": "Liberty_Bell_2008.jpg",
  "independence-hall": "Independence_Hall%2C_Philadelphia%2C_PA.jpg",
  "rocky-steps": "Philadelphia_Museum_of_Art_from_Eakins_Oval.jpg",

  // Atlanta
  "cnn-center": "CNN_Center_2007.jpg",
  "georgia-aquarium": "Georgia_Aquarium_-_Outside.jpg",

  // Detroit
  "ford-piquette-avenue-plant": "Ford_Piquette_Avenue_Plant.jpg",
  "detroit-institute-of-arts": "Detroit_Institute_of_Arts.jpg",

  // Canada
  "cn-tower": "Toronto_-_ON_-_CN_Tower_at_Dusk.jpg",
  "rogers-centre": "Rogers_Centre_Toronto.jpg",
  "ripley-aquarium": "Ripley%27s_Aquarium_of_Canada.jpg",
  "distillery-district": "Distillery_District_Toronto.jpg",
  "toronto-city-hall": "Toronto_City_Hall_2016_%2830078706560%29.jpg",

  "notre-dame-basilica-montreal": "Notre-Dame_Basilica%2C_Montreal.jpg",
  "mont-royal": "Mont_Royal_belvedere_Camillien_Houde.jpg",
  "saint-joseph-oratory": "Saint_Joseph%27s_Oratory.jpg",
  "old-montreal": "Old_Montreal_at_dusk.jpg",

  "canada-place": "Canada_Place_Vancouver.jpg",
  "capilano-suspension-bridge": "Capilano_Suspension_Bridge%2C_2007.jpg",
  "granville-island": "Granville_Island%2C_Vancouver.jpg",
  "stanley-park": "Stanley_Park_Vancouver.jpg",

  // Mexico
  "palacio-de-bellas-artes": "Bellas_Artes_CDMX.jpg",
  "mexico-city-cathedral": "Metropolitan_Cathedral_of_Mexico_City_3.jpg",
  "angel-de-la-independencia": "Angel_de_la_Independencia_2.jpg",
  "chapultepec-castle": "Chapultepec_Castle_2014.jpg",
  "templo-mayor": "Templo_Mayor%2C_Mexico_City.jpg",
  "torre-latinoamericana": "Torre_Latinoamericana_2006.jpg",

  // Brazil
  "paulista-avenue": "Avenida_Paulista_by_drone_%282%29.jpg",
  "museu-do-ipiranga": "Museu_Paulista_-_Fachada.jpg",
  "ibirapuera-park": "Ibirapuera_sp_06_2006.jpg",
  "pinacoteca-do-estado": "Pinacoteca_do_Estado_de_S%C3%A3o_Paulo%2C_fachada.jpg",

  "christ-the-redeemer": "Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg",
  "sugarloaf-mountain": "Rio_de_Janeiro_Sugar_Loaf_Mountain_2009.jpg",
  "copacabana-beach": "Copacabana_Beach_aerial_view_2010.jpg",
  "maracana-stadium": "Maracana_2012.jpg",
  "rio-carnival": "Rio_Carnival_2013.jpg",
  "lapa-arches": "Arcos_da_Lapa.jpg",

  // Argentina
  "casa-rosada": "Casa_Rosada_2007.jpg",
  "obelisk-buenos-aires": "Obelisco_-_Buenos_Aires.jpg",
  "teatro-colon": "Teatro_Colon_Buenos_Aires_2014.jpg",
  "la-boca": "La_Boca_2008.jpg",
  "recoleta-cemetery": "Cementerio_de_la_Recoleta_2009.jpg",

  // Chile
  "palacio-la-moneda": "Palacio_La_Moneda.jpg",
  "gran-torre-santiago": "Costanera_Center_2014.jpg",
  "cerro-santa-lucia": "Cerro_Santa_Lucia_Santiago.jpg",

  // Peru
  "plaza-mayor-lima": "Plaza_de_Armas_Lima.jpg",
  "larco-museum": "Museo_Larco_Lima.jpg",
  "huaca-pucllana": "Huaca_Pucllana_Lima.jpg",

  // Colombia
  "plaza-bolivar-bogota": "Plaza_Bolivar_Bogota_2011.jpg",
  "gold-museum-bogota": "Museo_del_Oro%2C_Bogot%C3%A1.jpg",
  "monserrate-bogota": "Cerro_de_Monserrate_Bogota.jpg",

  // Standalone
  "manhattanhenge": "Manhattanhenge_2007.jpg",
  "stonehenge-axis": "Stonehenge%2C_Wiltshire.jpg",
  "abu-simbel-axis": "Abu_Simbel%2C_Egypt%2C_Oct_2004.jpg",
  "north-axis-study": "Polaris_star_trail.jpg",
  "stonehenge": "Stonehenge%2C_Wiltshire.jpg",
  "chichen-itza": "Chichen_Itza_3.jpg",
};

  let replaced = 0;
  let skipped = 0;

  for (const [id, rawFilename] of Object.entries(FILENAMES)) {
    const idEscaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match lines with this id that DON'T yet have imageUrl
    const pattern = new RegExp(
      `(\\{ id: "${idEscaped}",[^\\n]+imageGradient: "[^"]*" \\},)`,
      "g"
    );

    const newContent = content.replace(pattern, (match) => {
      if (match.includes("imageUrl:")) {
        skipped++;
        return match;
      }
      const url = wikimediaThumbUrl(rawFilename);
      replaced++;
      // Insert imageUrl just before the closing `" },`
      return match.replace(/" \},$/, `", imageUrl: "${url}" },`);
    });

    content = newContent;
  }

  console.log(`Replaced: ${replaced}, Skipped (already had imageUrl): ${skipped}`);

// Write back
fs.writeFileSync(filePath, content, "utf8");
console.log("Done! File updated.");
