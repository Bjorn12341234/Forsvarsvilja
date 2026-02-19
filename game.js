// === FÖRSVARSVILJA — Game Logic ===

// --- Game State ---
const game = {
  fp: 0,
  totalFp: 0,
  fpPerClick: 1,
  fpPerSecond: 0,
  totalClicks: 0,
  currentEra: 0,
  lastEra: 0,
  startTime: Date.now(),
};

// --- Era Definitions ---
const eras = [
  { name: 'Hemberedskap', threshold: 0 },
  { name: 'Grannskapet', threshold: 5000 },
  { name: 'Kommunen', threshold: 100000 },
  { name: 'Regionen', threshold: 2000000 },
  { name: 'Nationen', threshold: 50000000 },
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
    baseCost: 40000000000, fpPerSecond: 8000000000, count: 0, era: 4,
  },
  {
    id: 'home_guard', name: 'Hemvärnet',
    description: '9 842 ansökte på EN vecka efter Ukraina-invasionen',
    baseCost: 100000000000, fpPerSecond: 20000000000, count: 0, era: 4,
  },
  {
    id: 'gripen', name: 'JAS 39 Gripen',
    description: 'Sveriges stolthet i luften',
    baseCost: 300000000000, fpPerSecond: 50000000000, count: 0, era: 4,
  },
  {
    id: 'global_eye', name: 'Global Eye-flygplan',
    description: '3 st anskaffas — ser allt, överallt',
    baseCost: 800000000000, fpPerSecond: 120000000000, count: 0, era: 4,
  },
  {
    id: 'nato_art5', name: 'NATO artikel 5',
    description: 'En för alla, alla för en',
    baseCost: 2000000000000, fpPerSecond: 300000000000, count: 0, era: 4,
  },
  {
    id: 'total_defense', name: 'Totalförsvar 3,5% av BNP',
    description: 'Den kraftfullaste förstärkningen sedan kalla kriget',
    baseCost: 5000000000000, fpPerSecond: 800000000000, count: 0, era: 4,
  },
];

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
  return Math.ceil(upgrade.baseCost * Math.pow(1.15, upgrade.count));
}

// --- FP/s Calculation ---
function calculateFpPerSecond() {
  let total = 0;
  for (const u of upgrades) {
    total += u.fpPerSecond * u.count;
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
  setTimeout(() => {
    dom.eraUnlockOverlay.classList.remove('visible');
  }, 2500);
}

// --- Click Handler ---
function handleClick() {
  game.fp += game.fpPerClick;
  game.totalFp += game.fpPerClick;
  game.totalClicks++;

  // Visual feedback
  dom.clickButton.classList.add('clicking');
  setTimeout(() => dom.clickButton.classList.remove('clicking'), 100);

  updateUI();
}

// --- Buy Upgrade ---
function buyUpgrade(id) {
  const upgrade = upgrades.find(u => u.id === id);
  if (!upgrade) return;
  if (upgrade.era > game.currentEra) return;

  const cost = getUpgradeCost(upgrade);
  if (game.fp < cost) return;

  game.fp -= cost;
  upgrade.count++;
  calculateFpPerSecond();
  updateUI();
}

// --- Buy Click Upgrade ---
function buyClickUpgrade(id) {
  const upgrade = clickUpgrades.find(u => u.id === id);
  if (!upgrade || upgrade.purchased) return;
  if (game.fp < upgrade.cost) return;

  game.fp -= upgrade.cost;
  upgrade.purchased = true;
  game.fpPerClick *= upgrade.multiplier;
  updateUI();
}

// --- Render Upgrades ---
function renderUpgrades() {
  dom.upgradesList.innerHTML = '';

  let lastEra = -1;
  for (const u of upgrades) {
    if (u.era > game.currentEra) break;

    // Add era header
    if (u.era !== lastEra) {
      lastEra = u.era;
      const header = document.createElement('div');
      header.className = 'era-header';
      header.textContent = eras[u.era].name;
      dom.upgradesList.appendChild(header);
    }

    const cost = getUpgradeCost(u);
    const canAfford = game.fp >= cost;

    const card = document.createElement('div');
    card.className = 'upgrade-card' + (canAfford ? '' : ' disabled');
    card.innerHTML = `
      <div class="upgrade-name">${u.name}</div>
      <div class="upgrade-count">${u.count > 0 ? u.count : ''}</div>
      <div class="upgrade-desc">${u.description}</div>
      <div class="upgrade-stats">
        <span class="upgrade-fps">+${formatNumber(u.fpPerSecond)} FP/s</span>
        <span class="upgrade-cost">${formatNumber(cost)} FP</span>
      </div>
    `;
    card.addEventListener('click', () => buyUpgrade(u.id));
    dom.upgradesList.appendChild(card);
  }
}

// --- Render Click Upgrades ---
function renderClickUpgrades() {
  dom.clickUpgradesList.innerHTML = '';

  for (const u of clickUpgrades) {
    const canAfford = game.fp >= u.cost;
    const card = document.createElement('div');

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
}

// --- Update UI ---
function updateUI() {
  dom.fpCount.textContent = formatNumber(game.fp);
  dom.fpPerSecond.textContent = formatNumber(game.fpPerSecond);
  dom.fpPerClick.textContent = formatNumber(game.fpPerClick);
  updateEra();
  renderUpgrades();
  renderClickUpgrades();
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

// --- Game Loop ---
function startGameLoop() {
  setInterval(() => {
    if (game.fpPerSecond > 0) {
      const gain = game.fpPerSecond / 10;
      game.fp += gain;
      game.totalFp += gain;
      updateUI();
    }
  }, 100);
}

// --- Initialize ---
function init() {
  dom.clickButton.addEventListener('click', handleClick);
  setupTicker();
  calculateFpPerSecond();
  updateUI();
  startGameLoop();
}

init();
