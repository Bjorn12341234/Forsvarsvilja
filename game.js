// === FÖRSVARSVILJA — Game Logic ===

// --- Game State ---
const game = {
  fp: 0,
  totalFp: 0,
  fpPerClick: 1,
  fpPerSecond: 0,
  totalClicks: 0,
  totalUpgradesBought: 0,
  currentEra: 0,
  lastEra: 0,
  startTime: Date.now(),
  muted: false,
  activeEvent: null,
  eventMultiplier: 1,
  eventTimer: null,
  eventEndTime: 0,
  gameComplete: false,
  activeTab: 0,
  tabsUnlocked: [true, false, false, false, false],
  threatLevel: 0,
  threatStartTime: Date.now(),
  resources: { supply: 80, comms: 80, community: 80 },
  dilemmaHistory: [],
  dilemmaFpMultiplier: 1,
  dilemmaFpMultiplierEnd: 0,
  // Sprint 4: tracking for achievements and end screen
  resourceMin: { supply: 80, comms: 80, community: 80 },
  resourceZeroCount: { supply: 0, comms: 0, community: 0 },
  crisesTotal: 0,
};

// --- Era Definitions ---
const eras = [
  { name: 'Hemberedskap', threshold: 0 },
  { name: 'Grannskapet', threshold: 5000 },
  { name: 'Kommunen', threshold: 100000 },
  { name: 'Regionen', threshold: 2000000 },
  { name: 'Nationen', threshold: 50000000 },
];

// --- Threat Level Definitions ---
const threatLevels = [
  { id: 'vardag', name: 'Vardag', color: '#33AA55', time: 0 },
  { id: 'oro', name: 'Oro', color: '#CCAA00', time: 300 },
  { id: 'storning', name: 'Störning', color: '#CC7700', time: 720 },
  { id: 'kris', name: 'Kris', color: '#CC3333', time: 1200 },
  { id: 'uppbyggnad', name: 'Uppbyggnad', color: '#3388CC', time: 1680 },
];

// Resource drain rates per threat level (per minute)
const drainRates = [0, 0.5, 1.5, 3, 0.5];

// --- Synergy System (Sprint 4) ---
// Returns number of distinct upgrades owned in a given tab
function getTabUpgradeCount(tabIndex) {
  let count = 0;
  for (const u of upgrades) {
    if (u.tab === tabIndex && u.count > 0) count++;
  }
  return count;
}

// Tab 2 (Grannar) synergy: reduces community drain by 5% per unique upgrade owned
function getCommunityDrainReduction() {
  return getTabUpgradeCount(2) * 0.05;
}

// Tab 3 (Kommun) synergy: reduces ALL drain by 3% per unique upgrade owned
function getAllDrainReduction() {
  return getTabUpgradeCount(3) * 0.03;
}

// Tab 4 (Nationen) synergy: global FPS multiplier (1 + 0.05 per unique upgrade)
function getNationFpsMultiplier() {
  return 1 + getTabUpgradeCount(4) * 0.05;
}

// Tab 1 (Info) synergy: number of info upgrades → dilemma hint quality
function getInfoSynergyLevel() {
  return getTabUpgradeCount(1);
}

// --- Tab Definitions (v2) ---
const tabs = [
  { id: 'home', name: 'Hemmet', icon: '\u{1F3E0}', unlockEra: 0, unlockThreat: 0 },
  { id: 'info', name: 'Info & Komm', icon: '\u{1F4FB}', unlockEra: 1, unlockThreat: 1 },
  { id: 'family', name: 'Grannar', icon: '\u{1F91D}', unlockEra: 1, unlockThreat: 2 },
  { id: 'municipality', name: 'Kommun', icon: '\u{1F3DB}', unlockEra: 2, unlockThreat: 3 },
  { id: 'nation', name: 'Nationen', icon: '\u2B50', unlockEra: 4, unlockThreat: 4 },
];

// --- Upgrades (All Eras) ---
const upgrades = [
  // Era 0: Hemberedskap
  {
    id: 'water', name: 'Vattenflaskor',
    description: '3 liter/person/dag i minst en vecka',
    baseCost: 10, fpPerSecond: 0.5, count: 0, era: 0,
  },
  {
    id: 'cans', name: 'Konservburkar',
    description: 'Mat som inte behöver kylskåp',
    baseCost: 50, fpPerSecond: 2, count: 0, era: 0,
  },
  {
    id: 'stove', name: 'Stormkök & bränsle',
    description: 'Laga mat utan el',
    baseCost: 200, fpPerSecond: 8, count: 0, era: 0,
  },
  {
    id: 'radio', name: 'Ficklampa, radio & batterier',
    description: 'Vevradio = guld värt vid strömavbrott',
    baseCost: 600, fpPerSecond: 30, count: 0, era: 0,
  },
  {
    id: 'sleeping', name: 'Sovsäck & filtar',
    description: 'Håll värmen om elementen slutar fungera',
    baseCost: 1500, fpPerSecond: 100, count: 0, era: 0,
  },
  {
    id: 'kit', name: 'Hemberedskapskit',
    description: 'Kontanter, mediciner, dokument, första hjälpen',
    baseCost: 5000, fpPerSecond: 300, count: 0, era: 0,
  },
  // Era 1: Grannskapet
  {
    id: 'neighbors', name: 'Grannsamverkan',
    description: 'Kolla till varandra vid kris',
    baseCost: 8000, fpPerSecond: 500, count: 0, era: 1,
  },
  {
    id: 'firewood', name: 'Vedförråd & gemensam eldstad',
    description: 'Värme till hela kvarteret',
    baseCost: 25000, fpPerSecond: 1500, count: 0, era: 1,
  },
  {
    id: 'water_purifier', name: 'Vattenrenare & vattendunkar',
    description: 'Rent vatten även om kranen slutar fungera',
    baseCost: 75000, fpPerSecond: 5000, count: 0, era: 1,
  },
  {
    id: 'info_meeting', name: 'Informationsmöte',
    description: 'Prata igenom: vad gör vi om strömmen går?',
    baseCost: 200000, fpPerSecond: 15000, count: 0, era: 1,
  },
  {
    id: 'local_group', name: 'Lokal beredskapsgrupp',
    description: 'Organisera roller: vem har generator? Vem kan första hjälpen?',
    baseCost: 500000, fpPerSecond: 40000, count: 0, era: 1,
  },
  {
    id: 'shelter', name: 'Gemensamt skyddsrum',
    description: 'Sverige har ~65 000 skyddsrum',
    baseCost: 1200000, fpPerSecond: 100000, count: 0, era: 1,
  },
  // Era 2: Kommunen
  {
    id: 'crisis_plan', name: 'Kommunal krisplan',
    description: 'Varje kommun ska ha en plan för höjd beredskap',
    baseCost: 1500000, fpPerSecond: 200000, count: 0, era: 2,
  },
  {
    id: 'prep_week', name: 'Beredskapsveckan',
    description: 'Årlig övning sedan 2017',
    baseCost: 4000000, fpPerSecond: 500000, count: 0, era: 2,
  },
  {
    id: 'water_supply', name: 'Nödvattenförsörjning',
    description: 'Drickvattenberedskap för hela kommunen',
    baseCost: 10000000, fpPerSecond: 1200000, count: 0, era: 2,
  },
  {
    id: 'fire_service', name: 'Räddningstjänst-uppgradering',
    description: 'Starkare räddningstjänst för svårare tider',
    baseCost: 25000000, fpPerSecond: 3000000, count: 0, era: 2,
  },
  {
    id: 'civil_duty', name: 'Civilplikt-organisering',
    description: 'Alla yrken kan krigsplaceras',
    baseCost: 60000000, fpPerSecond: 8000000, count: 0, era: 2,
  },
  {
    id: 'rakel', name: 'Rakel-kommunikation',
    description: 'Radiosystem som fungerar när mobilnätet är nere',
    baseCost: 150000000, fpPerSecond: 20000000, count: 0, era: 2,
  },
  // Era 3: Regionen
  {
    id: 'county_coord', name: 'Länsstyrelse-samordning',
    description: 'Sex civilområden i Sverige',
    baseCost: 200000000, fpPerSecond: 40000000, count: 0, era: 3,
  },
  {
    id: 'civil_area', name: 'Regionalt civilområde',
    description: 'Samordning över hela regionen',
    baseCost: 500000000, fpPerSecond: 100000000, count: 0, era: 3,
  },
  {
    id: 'power_prep', name: 'Elberedskap & reservkraft',
    description: 'Håll elnätet igång eller bygg alternativ',
    baseCost: 1500000000, fpPerSecond: 250000000, count: 0, era: 3,
  },
  {
    id: 'food_supply', name: 'Livsmedelsförsörjning',
    description: 'Centrallager och dagligvaruhandel vid kris',
    baseCost: 4000000000, fpPerSecond: 600000000, count: 0, era: 3,
  },
  {
    id: 'fuel_reserves', name: 'Drivmedelsreserver',
    description: 'Samhället stannar utan bränsle',
    baseCost: 10000000000, fpPerSecond: 1500000000, count: 0, era: 3,
  },
  {
    id: 'cyber_security', name: 'Cybersäkerhet',
    description: 'IT-incidenthantering och skydd mot cyberhot',
    baseCost: 25000000000, fpPerSecond: 4000000000, count: 0, era: 3,
  },
  // Era 4: Nationen
  {
    id: 'mcf', name: 'MCF',
    description: 'Myndigheten för civilt försvar (f.d. MSB)',
    baseCost: 15000000000, fpPerSecond: 5000000000, count: 0, era: 4,
  },
  {
    id: 'home_guard', name: 'Hemvärnet',
    description: '9 842 ansökte på EN vecka efter Ukraina-invasionen',
    baseCost: 40000000000, fpPerSecond: 12000000000, count: 0, era: 4,
  },
  {
    id: 'gripen', name: 'JAS 39 Gripen',
    description: 'Sveriges stolthet i luften',
    baseCost: 100000000000, fpPerSecond: 30000000000, count: 0, era: 4,
  },
  {
    id: 'global_eye', name: 'Global Eye-flygplan',
    description: '3 st anskaffas — ser allt, överallt',
    baseCost: 300000000000, fpPerSecond: 80000000000, count: 0, era: 4,
  },
  {
    id: 'nato_art5', name: 'NATO artikel 5',
    description: 'En för alla, alla för en',
    baseCost: 800000000000, fpPerSecond: 200000000000, count: 0, era: 4,
  },
  {
    id: 'total_defense', name: 'Totalförsvar 3,5% av BNP',
    description: 'Den kraftfullaste förstärkningen sedan kalla kriget',
    baseCost: 2000000000000, fpPerSecond: 500000000000, count: 0, era: 4,
  },
];

// --- Tab Assignments & New Upgrades (v2) ---
(function setupTabs() {
  const tabMap = {
    // Tab 0: Hemmet
    water: 0, cans: 0, stove: 0, sleeping: 0, kit: 0,
    // Tab 1: Info & Kommunikation
    radio: 1, rakel: 1, cyber_security: 1, faktakoll: 1,
    // Tab 2: Familj & Grannar
    neighbors: 2, firewood: 2, shared_cooking: 2, water_purifier: 2, info_meeting: 2, safety_walks: 2, local_group: 2, shelter: 2,
    // Tab 3: Kommun & Region
    crisis_plan: 3, prep_week: 3, water_supply: 3, fire_service: 3, civil_duty: 3,
    county_coord: 3, civil_area: 3, power_prep: 3, food_supply: 3, fuel_reserves: 3,
    // Tab 4: Nationen
    mcf: 4, home_guard: 4, gripen: 4, global_eye: 4, nato_art5: 4, total_defense: 4,
  };
  for (const u of upgrades) u.tab = tabMap[u.id] ?? 0;

  // Resource bonuses per upgrade (scaled by tab and cost tier)
  const resourceBonuses = {
    // Tab 0 (Hemmet) → supply
    water: { supply: 5 }, cans: { supply: 7 }, stove: { supply: 8 },
    sleeping: { supply: 10 }, kit: { supply: 15 },
    // Tab 1 (Info) → comms
    radio: { comms: 5 }, neighbor_list: { comms: 7 }, crank_radio_net: { comms: 10 },
    crisis_app: { comms: 12 }, faktakoll: { comms: 13 }, rakel: { comms: 15 }, cyber_security: { comms: 15 },
    // Tab 2 (Grannar) → community
    neighbors: { community: 5 }, firewood: { community: 7 }, shared_cooking: { community: 7 },
    water_purifier: { community: 8 }, info_meeting: { community: 10 }, safety_walks: { community: 11 },
    local_group: { community: 12 }, shelter: { community: 15 },
    // Tab 3 (Kommun) → all three
    crisis_plan: { supply: 5, comms: 5, community: 5 },
    prep_week: { supply: 5, comms: 5, community: 5 },
    water_supply: { supply: 5, comms: 5, community: 5 },
    fire_service: { supply: 5, comms: 5, community: 5 },
    civil_duty: { supply: 5, comms: 5, community: 5 },
    county_coord: { supply: 5, comms: 5, community: 5 },
    civil_area: { supply: 5, comms: 5, community: 5 },
    power_prep: { supply: 5, comms: 5, community: 5 },
    food_supply: { supply: 5, comms: 5, community: 5 },
    fuel_reserves: { supply: 5, comms: 5, community: 5 },
    // Tab 4 (Nationen) → all three (smaller)
    mcf: { supply: 3, comms: 3, community: 3 },
    home_guard: { supply: 3, comms: 3, community: 3 },
    gripen: { supply: 3, comms: 3, community: 3 },
    global_eye: { supply: 3, comms: 3, community: 3 },
    nato_art5: { supply: 3, comms: 3, community: 3 },
    total_defense: { supply: 3, comms: 3, community: 3 },
    // Tab 0 extra
    backup_power: { supply: 6 },
  };
  for (const u of upgrades) {
    u.resourceBonus = resourceBonuses[u.id] || null;
  }

  const newUpgrades = [
    {
      id: 'backup_power', name: 'Reservkraft',
      description: 'Powerbank och liten generator — håll det viktigaste igång',
      baseCost: 800, fpPerSecond: 35, count: 0, era: 0, tab: 0,
    },
    {
      id: 'neighbor_list', name: 'Grannlista',
      description: 'Vet du ens vad dina grannar heter?',
      baseCost: 3000, fpPerSecond: 150, count: 0, era: 0, tab: 1,
    },
    {
      id: 'crank_radio_net', name: 'Vevradio-nätverk',
      description: 'Varje kvarter behöver minst en vevradio',
      baseCost: 20000, fpPerSecond: 1000, count: 0, era: 1, tab: 1,
    },
    {
      id: 'crisis_app', name: 'Krisapp',
      description: 'MCF:s app — varningar direkt i fickan',
      baseCost: 100000, fpPerSecond: 8000, count: 0, era: 2, tab: 1,
    },
    {
      id: 'faktakoll', name: 'Faktakoll-grupp',
      description: 'Grannarna delar verifierad information — rykten har svårare att spridas',
      baseCost: 400000, fpPerSecond: 30000, count: 0, era: 2, tab: 1,
    },
    {
      id: 'shared_cooking', name: 'Gemensam matlagning',
      description: 'Dela resurser och laga mat tillsammans — räcker längre för alla',
      baseCost: 50000, fpPerSecond: 3000, count: 0, era: 1, tab: 2,
    },
    {
      id: 'safety_walks', name: 'Trygghetsvandringar',
      description: 'Gå runt i kvarteret och kolla att alla mår bra',
      baseCost: 350000, fpPerSecond: 25000, count: 0, era: 1, tab: 2,
    },
  ];
  upgrades.push(...newUpgrades);
  upgrades.sort((a, b) => a.tab - b.tab || a.era - b.era || a.baseCost - b.baseCost);
})();

// --- Click Power Upgrades (one-time purchases) ---
const clickUpgrades = [
  {
    id: 'viking', name: 'Vikingblod',
    description: 'Vikingastyrka i varje klick',
    cost: 500, multiplier: 2, purchased: false,
  },
  {
    id: 'karolin', name: 'Karolinsk beslutsamhet',
    description: 'Stormaktstidens envishet',
    cost: 15000, multiplier: 3, purchased: false,
  },
  {
    id: 'artsoppa', name: 'Ärtsoppekraft',
    description: 'Torsdagstraditionens dolda styrka',
    cost: 250000, multiplier: 5, purchased: false,
  },
  {
    id: 'beredskap_fighter', name: 'Beredskapskämpe',
    description: 'Beredd på allt, alltid',
    cost: 5000000, multiplier: 10, purchased: false,
  },
  {
    id: 'minister', name: 'Försvarsminister-handslag',
    description: 'Med hela regeringens kraft bakom varje klick',
    cost: 100000000, multiplier: 25, purchased: false,
  },
  {
    id: 'folkforankring', name: 'Folkförankring',
    description: 'Hela folkets kraft i varje klick',
    cost: 1000000000, multiplier: 50, purchased: false,
    resourceBonus: { community: 10 },
  },
  {
    id: 'nu_javlar', name: '"NU JÄVLAR"-knappen',
    description: 'Nu. Jävlar.',
    cost: 5000000000, multiplier: 100, purchased: false,
  },
];

// --- News Ticker Messages ---
const tickerMessages = [
  'Har du vatten hemma för minst en vecka? Räkna 3 liter per person per dag.',
  'Ha mat hemma som inte behöver kylskåp eller spis. Konserver, knäckebröd, müsli.',
  'Kontanter! Swish fungerar inte utan el och internet.',
  'En vevdriven radio ger dig information även vid strömavbrott.',
  'Ha en ficklampa med extra batterier — stearinljus är en brandrisk.',
  'Hur håller du dig varm om värmen försvinner? Sovsäck, filtar, varma kläder.',
  'Stormkök eller friluftskök — så lagar du mat utan el.',
  'Vet du var ditt närmaste skyddsrum är? Sverige har cirka 65 000.',
  'Ha viktiga mediciner hemma för minst en veckas förbrukning.',
  'Prata med dina grannar: vem kan hjälpa vem vid kris?',
  'Totalförsvar = militärt försvar + civilt försvar. Du är en del av det.',
  'Broschyren "Om krisen eller kriget kommer" skickades till 5,2 miljoner hushåll.',
  'Försvarsbudgeten ska nå 3,5% av BNP till 2030.',
  'Kopior på viktiga dokument: pass, försäkring, recept.',
  'Värnpliktsmålet: minst 10 000 per år till 2030.',
  'Visste du att MSB blev MCF den 1 januari 2026?',
  'Vattenrening: koka vattnet i minst 3 minuter om du är osäker.',
  'Ladda powerbank — din mobil är din länk till omvärlden.',
  'Brandsläckare och brandvarnare — grunden i alla hem.',
  'Kan du första hjälpen? En kurs kan rädda liv.',
  'Bränsle i bilen — kör inte på tomma tanken i oroliga tider.',
  'Ha en plan med din familj: var träffas ni om ni tappar kontakten?',
  'NATO artikel 5: en för alla, alla för en.',
  '9 842 ansökte till Hemvärnet på EN vecka efter Ukraina-invasionen.',
  'Beredskapsveckan har hållits årligen sedan 2017.',
];

// --- Random Events ---
const bonusEvents = [
  {
    id: 'bonus_stromavbrott', category: 'bonus',
    name: 'Strömavbrott!',
    description: 'Elnätet är nere. De med radio klarar sig bättre!',
    type: 'conditional', duration: 0, value: 15,
    relatedUpgrade: 'radio',
    bonusDescription: 'Radio-bonus: +{value}s av FP/s',
  },
  {
    id: 'bonus_vattenledning', category: 'bonus',
    name: 'Vattenledningen brast!',
    description: 'Vattnet är avstängt. Har du vatten hemma?',
    type: 'conditional', duration: 0, value: 10,
    relatedUpgrade: 'water',
    bonusDescription: 'Vattenförråd-bonus: +{value}s av FP/s',
  },
  {
    id: 'bonus_beredskapslarm', category: 'bonus',
    name: 'Beredskapslarm!',
    description: 'Hesa Fredrik ljuder — alla mobiliserar!',
    type: 'multiplier', duration: 30, value: 2,
  },
  {
    id: 'bonus_jas_flyby', category: 'bonus',
    name: 'JAS-flyby!',
    description: 'Ett JAS 39 Gripen dundrar över himlen — moralen stiger!',
    type: 'bonus', duration: 0, value: 10,
  },
  {
    id: 'bonus_hemvarnsovning', category: 'bonus',
    name: 'Hemvärnsövning',
    description: 'Hemvärnet övar i ditt område — extra beredskap!',
    type: 'multiplier', duration: 60, value: 1.5,
  },
  {
    id: 'bonus_desinformation', category: 'bonus',
    name: 'Desinformationsattack!',
    description: 'Falsk information sprids! Klicka snabbt för att motverka!',
    type: 'click_bonus', duration: 15, value: 3,
  },
  {
    id: 'bonus_broschyr', category: 'bonus',
    name: '"Om krisen kommer"-utskick',
    description: 'Broschyren inspirerar hela befolkningen!',
    type: 'bonus', duration: 0, value: 20,
  },
  {
    id: 'bonus_artsoppetorsdag', category: 'bonus',
    name: 'Ärtsoppetorsdag!',
    description: 'Traditionen stärker banden — och beredskapen!',
    type: 'multiplier', duration: 30, value: 2,
  },
  {
    id: 'bonus_nato_ovning', category: 'bonus',
    name: 'NATO-övning',
    description: 'Allierade övar tillsammans — massiv förstärkning!',
    type: 'multiplier', duration: 20, value: 3,
  },
  {
    id: 'bonus_frivilligvag', category: 'bonus',
    name: 'Frivilligvåg!',
    description: 'Rekordmånga anmäler sig som frivilliga!',
    type: 'upgrade_bonus', duration: 0, value: 0.5,
  },
  {
    id: 'bonus_kall_vinter', category: 'bonus',
    name: 'Kall vinter',
    description: 'Temperaturen faller. Har du sovsäck och filtar?',
    type: 'conditional', duration: 0, value: 12,
    relatedUpgrade: 'sleeping',
    bonusDescription: 'Sovsäck-bonus: +{value}s av FP/s',
  },
  {
    id: 'bonus_mobilnat_nere', category: 'bonus',
    name: 'Mobilnätet nere!',
    description: 'Inga samtal, inget internet. Radio är enda kontakten.',
    type: 'conditional', duration: 0, value: 15,
    relatedUpgrade: 'radio',
    bonusDescription: 'Radio-bonus: +{value}s av FP/s',
  },
];

const crisisEvents = [
  { id: 'crisis_strom', category: 'crisis', name: 'Strömavbrott', description: 'Elen försvinner i hela området.', effects: { supply: -20 } },
  { id: 'crisis_vatten', category: 'crisis', name: 'Vattenledning brast', description: 'Dricksvattenleveransen avbryts.', effects: { supply: -25 } },
  { id: 'crisis_mobilnat', category: 'crisis', name: 'Mobilnätet nere', description: 'Ingen når varandra via mobilnätet.', effects: { comms: -30 } },
  { id: 'crisis_storm', category: 'crisis', name: 'Stormen Gudrun 2.0', description: 'Kraftiga skador i flera län.', effects: { supply: -10, comms: -10, community: -10 } },
  { id: 'crisis_matbrist', category: 'crisis', name: 'Matbrist i butikerna', description: 'Tomma hyllor skapar oro.', effects: { supply: -15, community: -5 } },
  { id: 'crisis_cyber', category: 'crisis', name: 'Cyberangrepp mot myndigheter', description: 'Viktiga system ligger nere.', effects: { comms: -25 } },
  { id: 'crisis_desinfo', category: 'crisis', name: 'Desinformationsvåg', description: 'Falska rykten splittrar människor.', effects: { comms: -15, community: -10 } },
  {
    id: 'crisis_kyla', category: 'crisis', name: 'Kyla utan el',
    description: 'Kylan tränger in när värmen försvinner.',
    effects: { supply: -20 },
    conditional: { resource: 'supply', lt: 30, effects: { supply: -10 }, text: 'Låga reserver förvärrar läget: extra -10 Försörjning.' },
  },
  { id: 'crisis_grannbrak', category: 'crisis', name: 'Grannbråk om resurser', description: 'Spänningar i bostadsområdet ökar.', effects: { community: -20 } },
  { id: 'crisis_sjukdom', category: 'crisis', name: 'Sjukdomsutbrott', description: 'Många blir sjuka samtidigt.', effects: { supply: -15, community: -10 } },
  { id: 'crisis_bransle', category: 'crisis', name: 'Bränslebrist', description: 'Transporter stannar av.', effects: { supply: -15 } },
  { id: 'crisis_felalarm', category: 'crisis', name: 'Felaktigt larm', description: 'Förvirring om vad som gäller skadar tilliten.', effects: { comms: -10, community: -10 } },
];

const dilemmaEvents = [
  {
    id: 'dilemma_vatten_granne', category: 'dilemma', name: 'Grannen behöver vatten',
    description: 'En granne ber om en del av ditt vattenlager.',
    choiceA: { label: 'Dela', preview: '-10 Försörjning, +15 Samhörighet', effects: { resources: { supply: -10, community: +15 } } },
    choiceB: { label: 'Behåll', preview: '-5 Samhörighet', effects: { resources: { community: -5 } } },
  },
  {
    id: 'dilemma_rykten', category: 'dilemma', name: 'Rykten om förorenat vatten',
    description: 'Gruppchatten fylls av motstridiga uppgifter.',
    choiceA: { label: 'Kolla fakta', preview: '-5 Samband', effects: { resources: { comms: -5 } } },
    choiceB: { label: 'Hamstra', preview: '-20 FP, +10 Försörjning', effects: { fp: -20, resources: { supply: +10 } } },
  },
  {
    id: 'dilemma_frivilliga', category: 'dilemma', name: 'Kommunen söker frivilliga',
    description: 'De behöver folk till ett akut bemanningspass.',
    choiceA: { label: 'Ställ upp', preview: 'FP/s -20% i 60s, +20 Samhörighet', effects: { tempFpMultiplier: 0.8, duration: 60, resources: { community: +20 } } },
    choiceB: { label: 'Avböj', preview: 'Ingen direkt effekt', effects: {} },
  },
  {
    id: 'dilemma_okand_hjalp', category: 'dilemma', name: 'Okänd bankar på',
    description: 'En okänd person ber om hjälp med mat.',
    choiceA: { label: 'Öppna', preview: '-10 Försörjning, +10 Samhörighet', effects: { resources: { supply: -10, community: +10 } } },
    choiceB: { label: 'Ignorera', preview: '-5 Samhörighet', effects: { resources: { community: -5 } } },
  },
  {
    id: 'dilemma_tonaring', category: 'dilemma', name: 'Tonåringen vill hjälpa grannar',
    description: 'Du tvekar mellan oro och ansvar.',
    choiceA: { label: 'Tillåt', preview: '+5 Samhörighet', effects: { resources: { community: +5 } } },
    choiceB: { label: 'Neka', preview: '-10 Samhörighet', effects: { resources: { community: -10 } } },
  },
  {
    id: 'dilemma_bensin_mat', category: 'dilemma', name: 'Bensin mot mat',
    description: 'Grannen vill byta bränsle mot konserver.',
    choiceA: { label: 'Byt', preview: '+5 Försörjning, +10 Samhörighet', effects: { resources: { supply: +5, community: +10 } } },
    choiceB: { label: 'Avböj', preview: 'Ingen direkt effekt', effects: {} },
  },
  {
    id: 'dilemma_falsk_info', category: 'dilemma', name: 'Falsk info i gruppen',
    description: 'Någon driver en uppenbart falsk berättelse.',
    choiceA: { label: 'Konfrontera', preview: '-10 Samhörighet, +15 Samband', effects: { resources: { community: -10, comms: +15 } } },
    choiceB: { label: 'Ignorera', preview: '-10 Samband', effects: { resources: { comms: -10 } } },
  },
  {
    id: 'dilemma_arbetsgivare', category: 'dilemma', name: 'Arbetsgivaren kallar in dig',
    description: 'Du behövs på plats trots oroligt läge.',
    choiceA: { label: 'Gå', preview: 'FP/s +20% i 60s, -10 Samhörighet', effects: { tempFpMultiplier: 1.2, duration: 60, resources: { community: -10 } } },
    choiceB: { label: 'Stanna hemma', preview: '+10 Samhörighet', effects: { resources: { community: +10 } } },
  },
  {
    id: 'dilemma_medicin', category: 'dilemma', name: 'Äldre granne behöver medicin',
    description: 'Du har extra läkemedel hemma.',
    choiceA: { label: 'Dela', preview: '-10 Försörjning, +15 Samhörighet', effects: { resources: { supply: -10, community: +15 } } },
    choiceB: { label: 'Behåll', preview: '-5 Samhörighet', effects: { resources: { community: -5 } } },
  },
  {
    id: 'dilemma_fordon', category: 'dilemma', name: 'Räddningstjänsten behöver ditt fordon',
    description: 'Din bil kan användas för akut transporter.',
    choiceA: { label: 'Lämna ut', preview: '-15 Försörjning, +20 Samhörighet, +100 FP', effects: { resources: { supply: -15, community: +20 }, fp: +100 } },
    choiceB: { label: 'Neka', preview: '-10 Samhörighet', effects: { resources: { community: -10 } } },
  },
];

const eventPools = {
  bonus: bonusEvents,
  crisis: crisisEvents,
  dilemma: dilemmaEvents,
};

const threatEventConfig = [
  { weights: { bonus: 0.8, crisis: 0.2, dilemma: 0.0 }, delayRange: [45, 90] },
  { weights: { bonus: 0.5, crisis: 0.4, dilemma: 0.1 }, delayRange: [30, 60] },
  { weights: { bonus: 0.2, crisis: 0.4, dilemma: 0.4 }, delayRange: [20, 45] },
  { weights: { bonus: 0.1, crisis: 0.5, dilemma: 0.4 }, delayRange: [15, 30] },
  { weights: { bonus: 0.4, crisis: 0.2, dilemma: 0.4 }, delayRange: [30, 60] },
];

// --- Achievements ---
const achievements = [
  {
    id: 'first_click', name: 'Första steget',
    description: 'Gör ditt första klick',
    check: () => game.totalClicks >= 1,
    unlocked: false,
  },
  {
    id: 'clicks_100', name: 'Hundra klick',
    description: '100 klick — du menar allvar!',
    check: () => game.totalClicks >= 100,
    unlocked: false,
  },
  {
    id: 'clicks_1000', name: 'Tusen klick',
    description: '1 000 klick — fingret darrar',
    check: () => game.totalClicks >= 1000,
    unlocked: false,
  },
  {
    id: 'clicks_10000', name: 'Tiotusen klick',
    description: '10 000 klick — ren försvarsvilja',
    check: () => game.totalClicks >= 10000,
    unlocked: false,
  },
  {
    id: 'first_upgrade', name: 'Första inköpet',
    description: 'Köp din första uppgradering',
    check: () => game.totalUpgradesBought >= 1,
    unlocked: false,
  },
  {
    id: 'era1_complete', name: 'Hemberedskapen klar',
    description: 'Alla uppgraderingar i Hemmet — du klarar en vecka!',
    check: () => upgrades.filter(u => u.tab === 0).every(u => u.count >= 1),
    unlocked: false,
  },
  {
    id: 'era2_complete', name: 'Grannen du vill ha',
    description: 'Alla uppgraderingar i Familj & Grannar',
    check: () => upgrades.filter(u => u.tab === 2).every(u => u.count >= 1),
    unlocked: false,
  },
  {
    id: 'reach_era3', name: 'Kommunal kraft',
    description: 'Nå Era 3: Kommunen',
    check: () => game.currentEra >= 2,
    unlocked: false,
  },
  {
    id: 'reach_era4', name: 'Regional samordning',
    description: 'Nå Era 4: Regionen',
    check: () => game.currentEra >= 3,
    unlocked: false,
  },
  {
    id: 'reach_era5', name: 'Nationens försvar',
    description: 'Nå Era 5: Nationen',
    check: () => game.currentEra >= 4,
    unlocked: false,
  },
  {
    id: 'first_click_upgrade', name: 'Klickkraftare',
    description: 'Köp din första klickkraft-uppgradering',
    check: () => clickUpgrades.some(u => u.purchased),
    unlocked: false,
  },
  {
    id: 'nu_javlar', name: 'NU JÄVLAR',
    description: '"NU JÄVLAR"-knappen köpt — nu jävlar.',
    check: () => clickUpgrades.find(u => u.id === 'nu_javlar')?.purchased === true,
    unlocked: false,
  },
  {
    id: 'kontanter', name: 'Kontanter?!',
    description: 'Nå 10 000 FP — Swish fungerar inte utan el',
    check: () => game.totalFp >= 10000,
    unlocked: false,
  },
  {
    id: 'broschyren', name: 'Har du läst broschyren?',
    description: 'Nå 5 200 000 FP — en för varje hushåll',
    check: () => game.totalFp >= 5200000,
    unlocked: false,
  },
  {
    id: 'game_complete', name: 'Totalförsvaret komplett',
    description: 'Slutför spelet — du har byggt Sveriges totalförsvar!',
    check: () => game.gameComplete,
    unlocked: false,
  },
  {
    id: 'resursstark', name: 'Resursstark',
    description: 'Alla resurser över 50 under hela spelet',
    check: () => game.gameComplete && game.resourceMin.supply > 50 && game.resourceMin.comms > 50 && game.resourceMin.community > 50,
    unlocked: false,
  },
  {
    id: 'medmanniska', name: 'Medmänniska',
    description: 'Valt det generösa alternativet i minst 5 dilemman',
    check: () => game.dilemmaHistory.filter(d => d.choice === 'a').length >= 5,
    unlocked: false,
  },
  {
    id: 'kriserfaren', name: 'Kriserfaren',
    description: 'Överlevt 10 kriser',
    check: () => game.crisesTotal >= 10,
    unlocked: false,
  },
  {
    id: 'informerad', name: 'Informerad',
    description: 'Alla Info & Komm-uppgraderingar köpta',
    check: () => upgrades.filter(u => u.tab === 1).every(u => u.count >= 1),
    unlocked: false,
  },
  {
    id: 'nollgangar', name: 'Nollgångar',
    description: 'En resurs nådde 0 minst 3 gånger — men du överlevde',
    check: () => game.gameComplete && (game.resourceZeroCount.supply >= 3 || game.resourceZeroCount.comms >= 3 || game.resourceZeroCount.community >= 3),
    unlocked: false,
  },
  {
    id: 'synergi', name: 'Synergieffekt',
    description: 'Minst 3 uppgraderingar i varje flik',
    check: () => [0, 1, 2, 3, 4].every(tab => getTabUpgradeCount(tab) >= 3),
    unlocked: false,
  },
  {
    id: 'all_achievements', name: 'Fullständig beredskap',
    description: 'Alla andra achievements upplåsta — du är helt beredd',
    check: () => achievements.filter(a => a.id !== 'all_achievements').every(a => a.unlocked),
    unlocked: false,
  },
];

// --- DOM References ---
const dom = {
  fpCount: document.getElementById('fp-count'),
  fpPerSecond: document.getElementById('fp-per-second'),
  fpPerClick: document.getElementById('fp-per-click'),
  clickButton: document.getElementById('click-button'),
  upgradesList: document.getElementById('upgrades-list'),
  clickUpgradesList: document.getElementById('click-upgrades-list'),
  eraName: document.getElementById('era-name'),
  progressFill: document.getElementById('progress-fill'),
  eraProgressText: document.getElementById('era-progress-text'),
  tickerContent: document.getElementById('ticker-content'),
  eraUnlockOverlay: document.getElementById('era-unlock-overlay'),
  eraUnlockName: document.getElementById('era-unlock-name'),
  muteBtn: document.getElementById('mute-btn'),
  eventOverlay: document.getElementById('event-overlay'),
  eventCard: document.querySelector('#event-overlay .event-card'),
  eventName: document.getElementById('event-name'),
  eventDesc: document.getElementById('event-desc'),
  eventTimerFill: document.getElementById('event-timer-fill'),
  eventChoices: document.getElementById('event-choices'),
  eventChoiceA: document.getElementById('event-choice-a'),
  eventChoiceB: document.getElementById('event-choice-b'),
  eventConsequence: document.getElementById('event-consequence'),
  activeBonus: document.getElementById('active-bonus'),
  activeBonusText: document.getElementById('active-bonus-text'),
  activeBonusTime: document.getElementById('active-bonus-time'),
  achievementBtn: document.getElementById('achievement-btn'),
  achievementCount: document.getElementById('achievement-count'),
  achievementPanel: document.getElementById('achievement-panel'),
  achievementList: document.getElementById('achievement-list'),
  achievementProgress: document.getElementById('achievement-progress'),
  toastContainer: document.getElementById('toast-container'),
  endScreen: document.getElementById('end-screen'),
  endStatClicks: document.getElementById('end-stat-clicks'),
  endStatTime: document.getElementById('end-stat-time'),
  endStatFp: document.getElementById('end-stat-fp'),
  endStatUpgrades: document.getElementById('end-stat-upgrades'),
  endStatAchievements: document.getElementById('end-stat-achievements'),
  tabBar: document.getElementById('tab-bar'),
  threatLevelText: document.getElementById('threat-level'),
  threatUnlockOverlay: document.getElementById('threat-unlock-overlay'),
  threatUnlockName: document.getElementById('threat-unlock-name'),
  resourceSupplyFill: document.getElementById('resource-supply-fill'),
  resourceSupplyValue: document.getElementById('resource-supply-value'),
  resourceCommsFill: document.getElementById('resource-comms-fill'),
  resourceCommsValue: document.getElementById('resource-comms-value'),
  resourceCommunityFill: document.getElementById('resource-community-fill'),
  resourceCommunityValue: document.getElementById('resource-community-value'),
};

// --- Number Formatting ---
function formatNumber(n) {
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000) {
    return n < 10 ? n.toFixed(1) : Math.floor(n).toString();
  }
  const tiers = [
    { threshold: 1e15, suffix: 'Q' },
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' },
  ];
  for (const tier of tiers) {
    if (n >= tier.threshold) {
      const value = n / tier.threshold;
      return (value < 10 ? value.toFixed(2) : value < 100 ? value.toFixed(1) : Math.floor(value)) + tier.suffix;
    }
  }
  return Math.floor(n).toString();
}

// --- Cost Calculation ---
function getUpgradeCost(upgrade) {
  let cost = Math.ceil(upgrade.baseCost * Math.pow(1.15, upgrade.count));
  if (game.resources.community === 0) {
    cost = Math.ceil(cost * 1.5);
  }
  return cost;
}

// --- FP/s Calculation ---
function calculateFpPerSecond() {
  let total = 0;
  for (const u of upgrades) {
    total += u.fpPerSecond * u.count;
  }
  // Nation synergy: global FPS multiplier
  total *= getNationFpsMultiplier();
  if (game.resources.supply === 0) {
    total *= 0.5;
  }
  game.fpPerSecond = total;
}

// --- Era Calculation ---
function updateEra() {
  let newEra = 0;
  for (let i = eras.length - 1; i >= 0; i--) {
    if (game.totalFp >= eras[i].threshold) {
      newEra = i;
      break;
    }
  }

  // Check for era unlock
  if (newEra > game.currentEra) {
    showEraUnlock(newEra);
  }

  game.currentEra = newEra;

  // Check for tab unlocks
  updateTabUnlocks();

  const era = eras[game.currentEra];
  const nextEra = eras[game.currentEra + 1];

  dom.eraName.textContent = `Era ${game.currentEra + 1}: ${era.name}`;

  if (nextEra) {
    const progress = Math.min(
      ((game.totalFp - era.threshold) / (nextEra.threshold - era.threshold)) * 100,
      100
    );
    dom.progressFill.style.width = progress + '%';
    dom.eraProgressText.textContent = `${formatNumber(game.totalFp)} / ${formatNumber(nextEra.threshold)}`;
  } else {
    dom.progressFill.style.width = '100%';
    dom.eraProgressText.textContent = 'MAX';
  }
}

// --- Era Unlock Notification ---
function showEraUnlock(eraIndex) {
  const era = eras[eraIndex];
  dom.eraUnlockName.textContent = `Era ${eraIndex + 1}: ${era.name}`;
  dom.eraUnlockOverlay.classList.add('visible');
  playSound('era');
  setTimeout(() => {
    dom.eraUnlockOverlay.classList.remove('visible');
  }, 2500);
}

// --- Tab System ---
function switchTab(tabIndex) {
  if (tabIndex < 0 || tabIndex >= tabs.length) return;
  if (!game.tabsUnlocked[tabIndex]) return;
  game.activeTab = tabIndex;
  markUpgradesDirty();
  renderTabs();
  updateUI();
}

function renderTabs() {
  dom.tabBar.innerHTML = '';
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    if (i === game.activeTab) btn.classList.add('active');
    if (!game.tabsUnlocked[i]) {
      btn.classList.add('locked');
      btn.textContent = '\u{1F512}';
      btn.title = 'L\u00e5st';
    } else {
      btn.textContent = tab.icon + ' ' + tab.name;
      btn.addEventListener('click', () => switchTab(i));
    }
    dom.tabBar.appendChild(btn);
  }
}

function updateTabUnlocks() {
  let anyNew = false;
  for (let i = 0; i < tabs.length; i++) {
    if (!game.tabsUnlocked[i] && game.threatLevel >= tabs[i].unlockThreat) {
      game.tabsUnlocked[i] = true;
      anyNew = true;
    }
  }
  if (anyNew) renderTabs();
}

// --- Threat Level System ---
function updateThreatLevel() {
  const elapsed = (Date.now() - game.threatStartTime) / 1000;
  let newLevel = 0;
  for (let i = threatLevels.length - 1; i >= 0; i--) {
    if (elapsed >= threatLevels[i].time) {
      newLevel = i;
      break;
    }
  }
  if (newLevel > game.threatLevel) {
    game.threatLevel = newLevel;
    playSound('threat');
    showThreatNotification(newLevel);
    updateTabUnlocks();
    calculateFpPerSecond();
  }
}

function showThreatNotification(levelIndex) {
  const level = threatLevels[levelIndex];
  dom.threatUnlockName.textContent = level.name;
  dom.threatUnlockName.style.color = level.color;
  dom.threatUnlockOverlay.classList.add('visible');
  setTimeout(() => {
    dom.threatUnlockOverlay.classList.remove('visible');
  }, 2500);
}

// --- Resource System ---
function updateResources() {
  const baseDrain = drainRates[game.threatLevel] / 60 / 10; // per tick (100ms)
  if (baseDrain > 0) {
    // Tab 3 synergy: reduce ALL drain
    const allReduction = getAllDrainReduction();
    // Tab 2 synergy: extra community drain reduction
    const communityReduction = getCommunityDrainReduction();

    const supplyDrain = baseDrain * Math.max(0, 1 - allReduction);
    const commsDrain = baseDrain * Math.max(0, 1 - allReduction);
    const communityDrain = baseDrain * Math.max(0, 1 - allReduction - communityReduction);

    const wasDepleted = {
      supply: game.resources.supply === 0,
      comms: game.resources.comms === 0,
      community: game.resources.community === 0,
    };
    game.resources.supply = Math.max(0, game.resources.supply - supplyDrain);
    game.resources.comms = Math.max(0, game.resources.comms - commsDrain);
    game.resources.community = Math.max(0, game.resources.community - communityDrain);

    // Track resource minimums
    for (const key of ['supply', 'comms', 'community']) {
      if (game.resources[key] < game.resourceMin[key]) {
        game.resourceMin[key] = game.resources[key];
      }
      // Track zero transitions
      if (!wasDepleted[key] && game.resources[key] === 0) {
        game.resourceZeroCount[key]++;
      }
    }

    // Recalculate FP/s if supply just hit 0 or recovered
    if (wasDepleted.supply !== (game.resources.supply === 0)) {
      calculateFpPerSecond();
    }
  }
}

function updateResourceMeters() {
  const resources = ['supply', 'comms', 'community'];
  for (const res of resources) {
    const val = game.resources[res];
    const fill = dom['resource' + res.charAt(0).toUpperCase() + res.slice(1) + 'Fill'];
    const valueEl = dom['resource' + res.charAt(0).toUpperCase() + res.slice(1) + 'Value'];
    if (fill) {
      fill.style.width = val + '%';
      // Color coding
      if (val > 60) {
        fill.className = 'resource-fill resource-green';
      } else if (val > 30) {
        fill.className = 'resource-fill resource-yellow';
      } else if (val > 15) {
        fill.className = 'resource-fill resource-red';
      } else {
        fill.className = 'resource-fill resource-critical';
      }
    }
    if (valueEl) {
      valueEl.textContent = Math.round(val);
    }
  }
}

function updateThreatDisplay() {
  const level = threatLevels[game.threatLevel];
  if (dom.threatLevelText) {
    dom.threatLevelText.textContent = level.name;
    dom.threatLevelText.style.color = level.color;
  }
}

// --- Particle Effects ---
function spawnParticles(x, y) {
  const count = 6 + Math.floor(Math.random() * 5); // 6-10
  const colors = ['#FECC02', '#FFD633', '#E6B800', '#FFF2AA', '#D4A800'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const dist = 40 + Math.random() * 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const size = 3 + Math.random() * 5;
    const duration = 0.4 + Math.random() * 0.4;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty('--dx', dx + 'px');
    p.style.setProperty('--dy', dy + 'px');
    p.style.setProperty('--duration', duration + 's');
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
    setTimeout(() => { if (p.parentNode) p.remove(); }, 1500);
  }
}

// --- Float Text ---
function spawnFloatText(x, y, text) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
  setTimeout(() => { if (el.parentNode) el.remove(); }, 1500);
}

// --- Sound System ---
let audioCtx = null;

function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (game.muted) return;
  const ctx = ensureAudioCtx();
  const now = ctx.currentTime;

  if (type === 'click') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'buy') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'era') {
    // Three ascending tones
    [0, 0.12, 0.24].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime([523, 659, 784][i], now + offset);
      gain.gain.setValueAtTime(0.15, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  } else if (type === 'achievement') {
    // Triumphant ascending arpeggio
    [0, 0.1, 0.2, 0.35].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime([523, 659, 784, 1047][i], now + offset);
      gain.gain.setValueAtTime(i === 3 ? 0.18 : 0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.25);
    });
  } else if (type === 'complete') {
    // Grand fanfare for game completion
    [0, 0.15, 0.3, 0.5, 0.7].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime([523, 659, 784, 1047, 1319][i], now + offset);
      gain.gain.setValueAtTime(0.15, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.4);
    });
  } else if (type === 'threat') {
    // Ascending ominous two-note sound
    [0, 0.15].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime([220, 330][i], now + offset);
      gain.gain.setValueAtTime(0.1, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.3);
    });
  } else if (type === 'event') {
    // Two quick notes
    [0, 0.08].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime([600, 900][i], now + offset);
      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  } else if (type === 'crisis') {
    [0, 0.12].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime([260, 170][i], now + offset);
      gain.gain.setValueAtTime(0.11, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.25);
    });
  } else if (type === 'dilemma') {
    [0, 0.1].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime([420, 480][i], now + offset);
      gain.gain.setValueAtTime(0.09, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  }
}

// --- Click Handler ---
function handleClick(e) {
  game.fp += game.fpPerClick;
  game.totalFp += game.fpPerClick;
  game.totalClicks++;

  // Visual feedback
  dom.clickButton.classList.add('clicking');
  setTimeout(() => dom.clickButton.classList.remove('clicking'), 100);

  // Particles and float text
  const rect = dom.clickButton.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  spawnParticles(cx, cy);
  spawnFloatText(cx + (Math.random() - 0.5) * 40, cy - 20, '+' + formatNumber(game.fpPerClick) + ' FP');

  playSound('click');
  updateUI();
}

// --- Buy Upgrade ---
function buyUpgrade(id) {
  const upgrade = upgrades.find(u => u.id === id);
  if (!upgrade) return;
  if (upgrade.era > game.currentEra) return;
  if (!game.tabsUnlocked[upgrade.tab]) return;

  // Resource gate: total_defense requires all resources > 20
  if (upgrade.id === 'total_defense') {
    if (game.resources.supply <= 20 || game.resources.comms <= 20 || game.resources.community <= 20) return;
  }

  const cost = getUpgradeCost(upgrade);
  if (game.fp < cost) return;

  game.fp -= cost;
  upgrade.count++;
  game.totalUpgradesBought++;

  // Apply resource bonus
  if (upgrade.resourceBonus) {
    for (const [res, val] of Object.entries(upgrade.resourceBonus)) {
      game.resources[res] = Math.min(100, game.resources[res] + val);
    }
  }

  calculateFpPerSecond();
  markUpgradesDirty();
  playSound('buy');
  updateUI();

  // Check for game completion
  if (upgrade.id === 'total_defense') {
    showEndScreen();
  }
}

// --- Buy Click Upgrade ---
function buyClickUpgrade(id) {
  const upgrade = clickUpgrades.find(u => u.id === id);
  if (!upgrade || upgrade.purchased) return;
  if (game.fp < upgrade.cost) return;

  game.fp -= upgrade.cost;
  upgrade.purchased = true;
  game.fpPerClick *= upgrade.multiplier;

  // Apply resource bonus if any (Sprint 4)
  if (upgrade.resourceBonus) {
    for (const [res, val] of Object.entries(upgrade.resourceBonus)) {
      game.resources[res] = Math.min(100, game.resources[res] + val);
    }
  }

  markClickUpgradesDirty();
  playSound('buy');
  updateUI();
}

// --- Render Upgrades ---
// Track whether a full rebuild is needed (e.g. new era unlocked, upgrade bought, tab switched)
let _upgradesNeedRebuild = true;
let _clickUpgradesNeedRebuild = true;
let _lastVisibleEra = -1;
let _lastVisibleTab = -1;

function markUpgradesDirty() { _upgradesNeedRebuild = true; }
function markClickUpgradesDirty() { _clickUpgradesNeedRebuild = true; }

function buildUpgrades() {
  dom.upgradesList.innerHTML = '';
  _lastVisibleEra = game.currentEra;
  _lastVisibleTab = game.activeTab;

  for (const u of upgrades) {
    if (u.tab !== game.activeTab) continue;
    if (u.era > game.currentEra) continue;

    const cost = getUpgradeCost(u);
    const canAfford = game.fp >= cost;
    const resourceGated = u.id === 'total_defense' &&
      (game.resources.supply <= 20 || game.resources.comms <= 20 || game.resources.community <= 20);

    const card = document.createElement('div');
    card.className = 'upgrade-card' + (canAfford && !resourceGated ? '' : ' disabled');
    if (resourceGated) card.classList.add('resource-gated');
    card.dataset.id = u.id;
    const gateHint = resourceGated ? '<div class="upgrade-gate">Kräver alla resurser &gt; 20</div>' : '';
    card.innerHTML = `
      <div class="upgrade-name">${u.name}</div>
      <div class="upgrade-count">${u.count > 0 ? u.count : ''}</div>
      <div class="upgrade-desc">${u.description}</div>
      ${gateHint}
      <div class="upgrade-stats">
        <span class="upgrade-fps">+${formatNumber(u.fpPerSecond)} FP/s</span>
        <span class="upgrade-cost">${formatNumber(cost)} FP</span>
      </div>
    `;
    card.addEventListener('click', () => buyUpgrade(u.id));
    dom.upgradesList.appendChild(card);
  }
  _upgradesNeedRebuild = false;
}

function refreshUpgrades() {
  // Check if era or tab changed — need full rebuild
  if (game.currentEra !== _lastVisibleEra || game.activeTab !== _lastVisibleTab) {
    _upgradesNeedRebuild = true;
  }
  if (_upgradesNeedRebuild) {
    buildUpgrades();
    return;
  }
  // Just update affordability and counts in-place
  const cards = dom.upgradesList.querySelectorAll('.upgrade-card');
  for (const card of cards) {
    const id = card.dataset.id;
    const u = upgrades.find(up => up.id === id);
    if (!u) continue;
    const cost = getUpgradeCost(u);
    const canAfford = game.fp >= cost;
    if (canAfford) card.classList.remove('disabled');
    else card.classList.add('disabled');
    const countEl = card.querySelector('.upgrade-count');
    if (countEl) countEl.textContent = u.count > 0 ? u.count : '';
    const costEl = card.querySelector('.upgrade-cost');
    if (costEl) costEl.textContent = formatNumber(cost) + ' FP';
  }
}

// --- Render Click Upgrades ---
function buildClickUpgrades() {
  dom.clickUpgradesList.innerHTML = '';

  for (const u of clickUpgrades) {
    const canAfford = game.fp >= u.cost;
    const card = document.createElement('div');
    card.dataset.id = u.id;

    if (u.purchased) {
      card.className = 'upgrade-card click-upgrade purchased';
      card.innerHTML = `
        <div class="upgrade-name">${u.name} <span class="purchased-check">\u2713</span></div>
        <div class="upgrade-count">${u.multiplier}x</div>
        <div class="upgrade-desc">${u.description}</div>
      `;
    } else {
      card.className = 'upgrade-card click-upgrade' + (canAfford ? '' : ' disabled');
      card.innerHTML = `
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-count">${u.multiplier}x</div>
        <div class="upgrade-desc">${u.description}</div>
        <div class="upgrade-stats">
          <span class="upgrade-fps">${u.multiplier}x klick</span>
          <span class="upgrade-cost">${formatNumber(u.cost)} FP</span>
        </div>
      `;
      card.addEventListener('click', () => buyClickUpgrade(u.id));
    }

    dom.clickUpgradesList.appendChild(card);
  }
  _clickUpgradesNeedRebuild = false;
}

function refreshClickUpgrades() {
  if (_clickUpgradesNeedRebuild) {
    buildClickUpgrades();
    return;
  }
  const cards = dom.clickUpgradesList.querySelectorAll('.upgrade-card');
  for (const card of cards) {
    const id = card.dataset.id;
    const u = clickUpgrades.find(up => up.id === id);
    if (!u || u.purchased) continue;
    const canAfford = game.fp >= u.cost;
    if (canAfford) card.classList.remove('disabled');
    else card.classList.add('disabled');
  }
}

// --- Update UI ---
function updateUI() {
  dom.fpCount.textContent = formatNumber(game.fp);
  dom.fpPerSecond.textContent = formatNumber(game.fpPerSecond);
  dom.fpPerClick.textContent = formatNumber(game.fpPerClick);
  updateEra();
  refreshUpgrades();
  refreshClickUpgrades();
  updateResourceMeters();
  updateThreatDisplay();
}

// --- News Ticker ---
function setupTicker() {
  // Duplicate messages for seamless loop
  const allMessages = [...tickerMessages, ...tickerMessages];
  dom.tickerContent.innerHTML = allMessages
    .map(msg => `<span>${msg}</span>`)
    .join('');

  // Adjust animation duration based on content width
  requestAnimationFrame(() => {
    const contentWidth = dom.tickerContent.scrollWidth;
    const duration = contentWidth / 60; // ~60px per second
    dom.tickerContent.style.animationDuration = duration + 's';
  });
}

// --- Event System ---
function getEventBonus(event, ups) {
  if (game.resources.comms === 0) return 0;
  if (event.type === 'bonus') {
    // Instant FP bonus: value seconds of current FP/s
    return game.fpPerSecond * event.value;
  }
  if (event.type === 'conditional') {
    const upgrade = ups.find(u => u.id === event.relatedUpgrade);
    if (upgrade && upgrade.count > 0) {
      return game.fpPerSecond * event.value;
    }
    return 0;
  }
  if (event.type === 'upgrade_bonus') {
    // Bonus based on total upgrade count
    let totalCount = 0;
    for (const u of ups) totalCount += u.count;
    return game.fpPerSecond * event.value * totalCount;
  }
  return 0;
}

function getThreatEventConfig() {
  return threatEventConfig[game.threatLevel] || threatEventConfig[0];
}

function chooseWeightedCategory(weights) {
  const roll = Math.random();
  let sum = 0;
  for (const key of ['bonus', 'crisis', 'dilemma']) {
    sum += weights[key] || 0;
    if (roll <= sum) return key;
  }
  return 'bonus';
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickEventForThreat() {
  const cfg = getThreatEventConfig();
  let category = chooseWeightedCategory(cfg.weights);
  if (!eventPools[category] || eventPools[category].length === 0) category = 'bonus';
  const pool = eventPools[category] || bonusEvents;
  return pickRandom(pool);
}

function getEventDelayMs() {
  const cfg = getThreatEventConfig();
  const [minSec, maxSec] = cfg.delayRange;
  return (minSec + Math.random() * (maxSec - minSec)) * 1000;
}

function applyResourceDelta(delta) {
  if (!delta) return;
  const wasSupplyZero = game.resources.supply === 0;
  for (const key of ['supply', 'comms', 'community']) {
    if (typeof delta[key] === 'number') {
      game.resources[key] = Math.max(0, Math.min(100, game.resources[key] + delta[key]));
    }
  }
  if (wasSupplyZero !== (game.resources.supply === 0)) {
    calculateFpPerSecond();
  }
}

function formatResourceDeltaText(delta) {
  const names = { supply: 'Försörjning', comms: 'Samband', community: 'Samhörighet' };
  const parts = [];
  for (const key of ['supply', 'comms', 'community']) {
    if (typeof delta[key] === 'number' && delta[key] !== 0) {
      const sign = delta[key] > 0 ? '+' : '';
      parts.push(`${sign}${Math.round(delta[key])} ${names[key]}`);
    }
  }
  return parts.join(', ');
}

function getDilemmaResourceScore(choice) {
  let score = 0;
  if (choice.effects?.resources) {
    for (const val of Object.values(choice.effects.resources)) {
      score += val;
    }
  }
  return score;
}

function setEventMode(event) {
  dom.eventOverlay.classList.remove('dilemma-mode');
  dom.eventCard.classList.remove('crisis', 'dilemma');
  if (event.category === 'crisis') dom.eventCard.classList.add('crisis');
  if (event.category === 'dilemma') {
    dom.eventCard.classList.add('dilemma');
    dom.eventOverlay.classList.add('dilemma-mode');
  }
}

function resolveDilemma(choiceKey) {
  if (!game.activeEvent || game.activeEvent.category !== 'dilemma') return;
  const event = game.activeEvent;
  const choice = choiceKey === 'a' ? event.choiceA : event.choiceB;
  if (!choice) return;

  let consequenceText = '';
  if (choice.effects?.resources) {
    applyResourceDelta(choice.effects.resources);
    const deltaText = formatResourceDeltaText(choice.effects.resources);
    if (deltaText) consequenceText = deltaText;
  }

  if (typeof choice.effects?.fp === 'number' && choice.effects.fp !== 0) {
    const fpChange = choice.effects.fp;
    game.fp = Math.max(0, game.fp + fpChange);
    game.totalFp = Math.max(0, game.totalFp + Math.max(0, fpChange));
    const fpText = `${fpChange > 0 ? '+' : ''}${Math.round(fpChange)} FP`;
    consequenceText = consequenceText ? `${consequenceText}, ${fpText}` : fpText;
  }

  if (typeof choice.effects?.tempFpMultiplier === 'number' && typeof choice.effects?.duration === 'number') {
    game.dilemmaFpMultiplier = choice.effects.tempFpMultiplier;
    game.dilemmaFpMultiplierEnd = Date.now() + choice.effects.duration * 1000;
    showActiveBonus(`${choice.effects.tempFpMultiplier}x FP/s`, choice.effects.duration);
  }

  game.dilemmaHistory.push({
    eventId: event.id,
    choice: choiceKey,
    time: Date.now(),
  });

  dom.eventConsequence.textContent = consequenceText ? `Konsekvens: ${consequenceText}` : 'Val registrerat.';
  dom.eventChoiceA.disabled = true;
  dom.eventChoiceB.disabled = true;
  updateUI();

  setTimeout(() => {
    endEvent();
  }, 900);
}

function triggerEvent(event) {
  game.activeEvent = event;
  playSound(event.category || 'event');
  clearTimeout(game._eventDismissTimer);

  setEventMode(event);
  dom.eventName.textContent = event.name;
  dom.eventConsequence.textContent = '';
  dom.eventChoiceA.disabled = false;
  dom.eventChoiceB.disabled = false;

  let desc = event.description;
  if (event.category === 'bonus' && event.type === 'conditional') {
    const upgrade = upgrades.find(u => u.id === event.relatedUpgrade);
    if (upgrade && upgrade.count > 0) {
      desc += '\n' + event.bonusDescription.replace('{value}', event.value);
    } else {
      desc += '\nIngen bonus — du saknar rätt utrustning!';
    }
  }
  if (event.category === 'crisis' && event.conditional) {
    desc += '\n' + event.conditional.text;
  }
  dom.eventDesc.textContent = desc;

  dom.eventTimerFill.style.width = '0%';
  dom.eventChoiceA.onclick = null;
  dom.eventChoiceB.onclick = null;

  if (event.category === 'dilemma') {
    dom.eventChoiceA.textContent = `${event.choiceA.label}: ${event.choiceA.preview}`;
    dom.eventChoiceB.textContent = `${event.choiceB.label}: ${event.choiceB.preview}`;
    dom.eventChoiceA.onclick = () => resolveDilemma('a');
    dom.eventChoiceB.onclick = () => resolveDilemma('b');
    // Info synergy: show hint about which choice benefits resources more
    const infoLevel = getInfoSynergyLevel();
    if (infoLevel >= 3) {
      const scoreA = getDilemmaResourceScore(event.choiceA);
      const scoreB = getDilemmaResourceScore(event.choiceB);
      if (scoreA !== scoreB) {
        const hint = scoreA > scoreB ? event.choiceA.label : event.choiceB.label;
        dom.eventConsequence.textContent = `\u{1F4E1} Info-nätverk: "${hint}" ger bättre resursutfall`;
      }
    }
    game.eventEndTime = 0;
  } else if (event.category === 'crisis') {
    game.crisesTotal++;
    applyResourceDelta(event.effects);
    let extraText = '';
    if (event.conditional) {
      const res = event.conditional.resource;
      if (game.resources[res] < event.conditional.lt) {
        applyResourceDelta(event.conditional.effects);
        extraText = ` Extra effekt: ${formatResourceDeltaText(event.conditional.effects)}.`;
      }
    }
    game.eventEndTime = 0;
    dom.eventConsequence.textContent = `Resurseffekt: ${formatResourceDeltaText(event.effects)}.${extraText}`.trim();
  } else if (event.type === 'multiplier') {
    game.eventMultiplier = event.value;
    game.eventEndTime = Date.now() + event.duration * 1000;
    dom.eventTimerFill.style.width = '100%';
    showActiveBonus(event.value + 'x FP/s', event.duration);
  } else if (event.type === 'click_bonus') {
    game.eventMultiplier = 1;
    game.fpPerClick *= event.value;
    game.eventEndTime = Date.now() + event.duration * 1000;
    dom.eventTimerFill.style.width = '100%';
    showActiveBonus(event.value + 'x klick', event.duration);
    game._clickBonusValue = event.value;
  } else {
    const bonus = getEventBonus(event, upgrades);
    if (bonus > 0) {
      game.fp += bonus;
      game.totalFp += bonus;
      dom.eventConsequence.textContent = `Bonus: +${formatNumber(bonus)} FP`;
    }
    game.eventEndTime = 0;
  }

  dom.eventOverlay.classList.add('visible');

  if (event.category !== 'dilemma') {
    const dismissTime = event.duration > 0 ? Math.min(event.duration * 1000, 4000) : 4000;
    game._eventDismissTimer = setTimeout(() => {
      dom.eventOverlay.classList.remove('visible');
    }, dismissTime);
  }
}

function endEvent() {
  if (!game.activeEvent) return;
  const event = game.activeEvent;

  if (event.type === 'multiplier') {
    game.eventMultiplier = 1;
  } else if (event.type === 'click_bonus' && game._clickBonusValue) {
    game.fpPerClick /= game._clickBonusValue;
    game._clickBonusValue = 0;
  }

  game.activeEvent = null;
  game.eventEndTime = 0;
  dom.eventChoiceA.onclick = null;
  dom.eventChoiceB.onclick = null;
  dom.eventOverlay.classList.remove('dilemma-mode');
  dom.eventCard.classList.remove('crisis', 'dilemma');
  dom.activeBonus.classList.remove('visible');
  dom.eventOverlay.classList.remove('visible');
}

function showActiveBonus(text, duration) {
  dom.activeBonusText.textContent = text;
  dom.activeBonusTime.textContent = duration + 's';
  dom.activeBonus.classList.add('visible');
}

function updateActiveBonus() {
  if (game.dilemmaFpMultiplierEnd > 0) {
    const remainingDilemma = Math.max(0, Math.ceil((game.dilemmaFpMultiplierEnd - Date.now()) / 1000));
    if (remainingDilemma <= 0) {
      game.dilemmaFpMultiplier = 1;
      game.dilemmaFpMultiplierEnd = 0;
      dom.activeBonus.classList.remove('visible');
    } else if (!game.activeEvent || game.eventEndTime <= 0) {
      dom.activeBonusTime.textContent = remainingDilemma + 's';
    }
  }
  if (!game.activeEvent || game.eventEndTime <= 0) return;
  const remaining = Math.max(0, Math.ceil((game.eventEndTime - Date.now()) / 1000));
  dom.activeBonusTime.textContent = remaining + 's';

  // Update timer bar in overlay
  const event = game.activeEvent;
  if (event.duration > 0) {
    const pct = (remaining / event.duration) * 100;
    dom.eventTimerFill.style.width = pct + '%';
  }

  if (remaining <= 0) {
    endEvent();
  }
}

function scheduleNextEvent() {
  const delay = getEventDelayMs();
  game.eventTimer = setTimeout(() => {
    if (!game.activeEvent) {
      const event = pickEventForThreat();
      triggerEvent(event);
    }
    scheduleNextEvent();
  }, delay);
}

// --- Mute Toggle ---
function toggleMute() {
  game.muted = !game.muted;
  dom.muteBtn.textContent = game.muted ? '\u{1F507}' : '\u{1F50A}';
  dom.muteBtn.classList.toggle('muted', game.muted);
}

// --- Achievement System ---
const _toastQueue = [];
let _toastActive = false;

function checkAchievements() {
  for (const a of achievements) {
    if (!a.unlocked && a.check()) {
      a.unlocked = true;
      showAchievementToast(a);
      playSound('achievement');
      updateAchievementBtn();
    }
  }
}

function showAchievementToast(achievement) {
  _toastQueue.push(achievement);
  if (!_toastActive) processToastQueue();
}

function processToastQueue() {
  if (_toastQueue.length === 0) { _toastActive = false; return; }
  _toastActive = true;
  const a = _toastQueue.shift();
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `<div class="toast-icon">\u{1F3C6}</div><div class="toast-body"><div class="toast-title">${a.name}</div><div class="toast-desc">${a.description}</div></div>`;
  dom.toastContainer.appendChild(toast);
  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => { toast.remove(); processToastQueue(); }, 400);
  }, 3000);
}

function updateAchievementBtn() {
  const unlocked = achievements.filter(a => a.unlocked).length;
  dom.achievementCount.textContent = `${unlocked}/${achievements.length}`;
}

function toggleAchievementPanel() {
  const isVisible = dom.achievementPanel.classList.toggle('visible');
  if (isVisible) renderAchievementPanel();
}

function renderAchievementPanel() {
  const unlocked = achievements.filter(a => a.unlocked).length;
  dom.achievementProgress.textContent = `${unlocked} / ${achievements.length}`;
  dom.achievementList.innerHTML = '';
  for (const a of achievements) {
    const el = document.createElement('div');
    el.className = 'achievement-item' + (a.unlocked ? ' unlocked' : '');
    el.innerHTML = `<div class="achievement-icon">${a.unlocked ? '\u{1F3C6}' : '\u{1F512}'}</div><div class="achievement-info"><div class="achievement-name">${a.unlocked ? a.name : '???'}</div><div class="achievement-desc">${a.unlocked ? a.description : 'Ännu ej upplåst'}</div></div>`;
    dom.achievementList.appendChild(el);
  }
}

// --- End Screen ---
function showEndScreen() {
  if (game.gameComplete) return;
  game.gameComplete = true;
  playSound('complete');

  const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  dom.endStatClicks.textContent = game.totalClicks.toLocaleString();
  dom.endStatTime.textContent = `${minutes} min ${seconds} sek`;
  dom.endStatFp.textContent = formatNumber(game.totalFp);
  dom.endStatUpgrades.textContent = game.totalUpgradesBought;
  dom.endStatAchievements.textContent = `${achievements.filter(a => a.unlocked).length}/${achievements.length}`;

  // Delay to let the buy animation finish
  setTimeout(() => {
    dom.endScreen.classList.add('visible');
  }, 500);

  // Check achievements one more time (game_complete + all_achievements)
  setTimeout(() => checkAchievements(), 600);
}

function resetGame() {
  deleteSave();

  // Clear event timers
  clearTimeout(game.eventTimer);
  clearTimeout(game._eventDismissTimer);

  // Reset game state
  game.fp = 0;
  game.totalFp = 0;
  game.fpPerClick = 1;
  game.fpPerSecond = 0;
  game.totalClicks = 0;
  game.totalUpgradesBought = 0;
  game.currentEra = 0;
  game.lastEra = 0;
  game.startTime = Date.now();
  game.activeEvent = null;
  game.eventMultiplier = 1;
  game.eventEndTime = 0;
  game._clickBonusValue = 0;
  game.gameComplete = false;
  game.activeTab = 0;
  game.tabsUnlocked = [true, false, false, false, false];
  game.threatLevel = 0;
  game.threatStartTime = Date.now();
  game.resources = { supply: 80, comms: 80, community: 80 };
  game.dilemmaHistory = [];
  game.dilemmaFpMultiplier = 1;
  game.dilemmaFpMultiplierEnd = 0;
  game.resourceMin = { supply: 80, comms: 80, community: 80 };
  game.resourceZeroCount = { supply: 0, comms: 0, community: 0 };
  game.crisesTotal = 0;

  // Reset upgrades
  for (const u of upgrades) u.count = 0;
  for (const u of clickUpgrades) u.purchased = false;
  for (const a of achievements) a.unlocked = false;

  // Clean up floating DOM elements (particles, float text)
  document.querySelectorAll('.particle, .float-text').forEach(el => el.remove());

  // Hide overlays
  dom.endScreen.classList.remove('visible');
  dom.activeBonus.classList.remove('visible');
  dom.eventOverlay.classList.remove('visible');
  dom.threatUnlockOverlay.classList.remove('visible');

  calculateFpPerSecond();
  markUpgradesDirty();
  markClickUpgradesDirty();
  updateAchievementBtn();
  renderTabs();
  updateUI();

  // Restart event scheduling
  scheduleNextEvent();
}

// --- Save / Load ---
const SAVE_KEY = 'forsvarsvilja_save';

// v1 upgrade order (for save migration)
const V1_UPGRADE_IDS = [
  'water', 'cans', 'stove', 'radio', 'sleeping', 'kit',
  'neighbors', 'firewood', 'water_purifier', 'info_meeting', 'local_group', 'shelter',
  'crisis_plan', 'prep_week', 'water_supply', 'fire_service', 'civil_duty', 'rakel',
  'county_coord', 'civil_area', 'power_prep', 'food_supply', 'fuel_reserves', 'cyber_security',
  'mcf', 'home_guard', 'gripen', 'global_eye', 'nato_art5', 'total_defense',
];
const V1_CLICK_IDS = ['viking', 'karolin', 'artsoppa', 'beredskap_fighter', 'minister', 'nu_javlar'];
const V1_ACHIEVEMENT_IDS = [
  'first_click', 'clicks_100', 'clicks_1000', 'clicks_10000', 'first_upgrade',
  'era1_complete', 'era2_complete', 'reach_era3', 'reach_era4', 'reach_era5',
  'first_click_upgrade', 'nu_javlar', 'kontanter', 'broschyren', 'game_complete', 'all_achievements',
];

function getSaveData() {
  return {
    version: 2,
    fp: game.fp,
    totalFp: game.totalFp,
    fpPerClick: game.fpPerClick,
    totalClicks: game.totalClicks,
    totalUpgradesBought: game.totalUpgradesBought,
    currentEra: game.currentEra,
    startTime: game.startTime,
    muted: game.muted,
    gameComplete: game.gameComplete,
    upgradeCounts: Object.fromEntries(upgrades.map(u => [u.id, u.count])),
    clickPurchased: Object.fromEntries(clickUpgrades.map(u => [u.id, u.purchased])),
    achievementsUnlocked: Object.fromEntries(achievements.map(a => [a.id, a.unlocked])),
    activeTab: game.activeTab,
    tabsUnlocked: [...game.tabsUnlocked],
    threatLevel: game.threatLevel,
    threatStartTime: game.threatStartTime,
    resources: { ...game.resources },
    dilemmaHistory: [...game.dilemmaHistory],
    resourceMin: { ...game.resourceMin },
    resourceZeroCount: { ...game.resourceZeroCount },
    crisesTotal: game.crisesTotal,
    savedAt: Date.now(),
  };
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(getSaveData()));
  } catch (e) {
    // localStorage full or unavailable — silently ignore
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !data.version) return false;

    // Common fields
    game.fp = data.fp || 0;
    game.totalFp = data.totalFp || 0;
    game.fpPerClick = data.fpPerClick || 1;
    game.totalClicks = data.totalClicks || 0;
    game.totalUpgradesBought = data.totalUpgradesBought || 0;
    game.currentEra = data.currentEra || 0;
    game.startTime = data.startTime || Date.now();
    game.muted = data.muted || false;
    game.gameComplete = data.gameComplete || false;
    game.dilemmaHistory = [];
    game.dilemmaFpMultiplier = 1;
    game.dilemmaFpMultiplierEnd = 0;

    if (data.version === 1) {
      // v1 migration: index-based arrays → ID-based objects
      if (Array.isArray(data.upgradeCounts)) {
        for (let i = 0; i < V1_UPGRADE_IDS.length && i < data.upgradeCounts.length; i++) {
          const u = upgrades.find(u => u.id === V1_UPGRADE_IDS[i]);
          if (u) u.count = data.upgradeCounts[i] || 0;
        }
      }
      if (Array.isArray(data.clickPurchased)) {
        for (let i = 0; i < V1_CLICK_IDS.length && i < data.clickPurchased.length; i++) {
          const u = clickUpgrades.find(u => u.id === V1_CLICK_IDS[i]);
          if (u) u.purchased = !!data.clickPurchased[i];
        }
      }
      if (Array.isArray(data.achievementsUnlocked)) {
        for (let i = 0; i < V1_ACHIEVEMENT_IDS.length && i < data.achievementsUnlocked.length; i++) {
          const a = achievements.find(a => a.id === V1_ACHIEVEMENT_IDS[i]);
          if (a) a.unlocked = !!data.achievementsUnlocked[i];
        }
      }
      game.activeTab = 0;
      game.tabsUnlocked = [true, false, false, false, false];
    } else {
      // v2+: ID-based objects
      if (data.upgradeCounts && typeof data.upgradeCounts === 'object' && !Array.isArray(data.upgradeCounts)) {
        for (const u of upgrades) u.count = data.upgradeCounts[u.id] || 0;
      }
      if (data.clickPurchased && typeof data.clickPurchased === 'object' && !Array.isArray(data.clickPurchased)) {
        for (const u of clickUpgrades) u.purchased = !!data.clickPurchased[u.id];
      }
      if (data.achievementsUnlocked && typeof data.achievementsUnlocked === 'object' && !Array.isArray(data.achievementsUnlocked)) {
        for (const a of achievements) a.unlocked = !!data.achievementsUnlocked[a.id];
      }
      game.activeTab = data.activeTab || 0;
      game.tabsUnlocked = Array.isArray(data.tabsUnlocked) ? [...data.tabsUnlocked] : [true, false, false, false, false];

      // Sprint 2 fields (may be missing in older v2 saves)
      game.threatLevel = data.threatLevel || 0;
      game.threatStartTime = data.threatStartTime || Date.now();
      if (data.resources && typeof data.resources === 'object') {
        game.resources = {
          supply: data.resources.supply ?? 80,
          comms: data.resources.comms ?? 80,
          community: data.resources.community ?? 80,
        };
      } else {
        game.resources = { supply: 80, comms: 80, community: 80 };
      }
      game.dilemmaHistory = Array.isArray(data.dilemmaHistory) ? [...data.dilemmaHistory] : [];

      // Sprint 4 fields (may be missing in older saves)
      if (data.resourceMin && typeof data.resourceMin === 'object') {
        game.resourceMin = {
          supply: data.resourceMin.supply ?? 80,
          comms: data.resourceMin.comms ?? 80,
          community: data.resourceMin.community ?? 80,
        };
      } else {
        game.resourceMin = { supply: 80, comms: 80, community: 80 };
      }
      if (data.resourceZeroCount && typeof data.resourceZeroCount === 'object') {
        game.resourceZeroCount = {
          supply: data.resourceZeroCount.supply ?? 0,
          comms: data.resourceZeroCount.comms ?? 0,
          community: data.resourceZeroCount.community ?? 0,
        };
      } else {
        game.resourceZeroCount = { supply: 0, comms: 0, community: 0 };
      }
      game.crisesTotal = data.crisesTotal || 0;
    }

    // Recalculate derived state
    calculateFpPerSecond();

    // Recalculate tab unlocks based on threat level
    for (let i = 0; i < tabs.length; i++) {
      if (game.threatLevel >= tabs[i].unlockThreat) game.tabsUnlocked[i] = true;
    }

    // Validate activeTab
    if (!game.tabsUnlocked[game.activeTab]) game.activeTab = 0;

    // Apply mute state
    if (game.muted) {
      dom.muteBtn.textContent = '\u{1F507}';
      dom.muteBtn.classList.add('muted');
    }

    // Show end screen if game was already complete
    if (game.gameComplete) {
      setTimeout(() => dom.endScreen.classList.add('visible'), 100);
    }

    return true;
  } catch (e) {
    return false;
  }
}

function deleteSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
}

// --- Game Loop ---
function startGameLoop() {
  setInterval(() => {
    updateThreatLevel();
    updateResources();
    if (game.fpPerSecond > 0) {
      const gain = (game.fpPerSecond * game.eventMultiplier * game.dilemmaFpMultiplier) / 10;
      game.fp += gain;
      game.totalFp += gain;
      updateUI();
    }
    updateResourceMeters();
    updateThreatDisplay();
    updateActiveBonus();
  }, 100);

  // Check achievements every second
  setInterval(checkAchievements, 1000);

  // Auto-save every 30 seconds
  setInterval(saveGame, 30000);
}

// --- Initialize ---
function init() {
  // Prevent double-tap zoom on click button
  let _touchHandled = false;
  dom.clickButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    _touchHandled = true;
    handleClick(e);
  }, { passive: false });
  dom.clickButton.addEventListener('click', (e) => {
    if (_touchHandled) { _touchHandled = false; return; }
    handleClick(e);
  });
  dom.muteBtn.addEventListener('click', toggleMute);
  dom.achievementBtn.addEventListener('click', toggleAchievementPanel);
  dom.achievementPanel.addEventListener('click', (e) => {
    if (e.target === dom.achievementPanel) dom.achievementPanel.classList.remove('visible');
  });
  dom.eventOverlay.addEventListener('click', () => {
    if (game.activeEvent && game.activeEvent.category === 'dilemma') return;
    dom.eventOverlay.classList.remove('visible');
  });
  document.getElementById('play-again-btn').addEventListener('click', resetGame);
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Vill du verkligen nollställa spelet? All progress försvinner.')) {
      resetGame();
    }
  });

  // Load saved game
  loadGame();

  // Build tabs
  renderTabs();

  setupTicker();
  calculateFpPerSecond();
  updateAchievementBtn();
  updateUI();
  startGameLoop();
  scheduleNextEvent();

  // Save on page unload
  window.addEventListener('beforeunload', saveGame);
}

init();
