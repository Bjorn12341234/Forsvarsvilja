// === FÖRSVARSVILJA — Game Logic ===

// --- Game State ---
const game = {
  fp: 0,
  totalFp: 0,
  fpPerClick: 1,
  fpPerSecond: 0,
  totalClicks: 0,
  currentEra: 0,
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

// --- Upgrades (Era 1: Hemberedskap) ---
const upgrades = [
  {
    id: 'water',
    name: 'Vattenflaskor',
    description: '3 liter/person/dag i minst en vecka',
    baseCost: 10,
    fpPerSecond: 0.5,
    count: 0,
    era: 0,
  },
  {
    id: 'cans',
    name: 'Konservburkar',
    description: 'Mat som inte behöver kylskåp',
    baseCost: 50,
    fpPerSecond: 2,
    count: 0,
    era: 0,
  },
  {
    id: 'stove',
    name: 'Stormkök & bränsle',
    description: 'Laga mat utan el',
    baseCost: 200,
    fpPerSecond: 8,
    count: 0,
    era: 0,
  },
  {
    id: 'radio',
    name: 'Ficklampa, radio & batterier',
    description: 'Vevradio = guld värt vid strömavbrott',
    baseCost: 600,
    fpPerSecond: 30,
    count: 0,
    era: 0,
  },
  {
    id: 'sleeping',
    name: 'Sovsäck & filtar',
    description: 'Håll värmen om elementen slutar fungera',
    baseCost: 1500,
    fpPerSecond: 100,
    count: 0,
    era: 0,
  },
  {
    id: 'kit',
    name: 'Hemberedskapskit',
    description: 'Kontanter, mediciner, dokument, första hjälpen',
    baseCost: 5000,
    fpPerSecond: 300,
    count: 0,
    era: 0,
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
];

// --- DOM References ---
const dom = {
  fpCount: document.getElementById('fp-count'),
  fpPerSecond: document.getElementById('fp-per-second'),
  fpPerClick: document.getElementById('fp-per-click'),
  clickButton: document.getElementById('click-button'),
  upgradesList: document.getElementById('upgrades-list'),
  eraName: document.getElementById('era-name'),
  progressFill: document.getElementById('progress-fill'),
  eraProgressText: document.getElementById('era-progress-text'),
  tickerContent: document.getElementById('ticker-content'),
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

  const cost = getUpgradeCost(upgrade);
  if (game.fp < cost) return;

  game.fp -= cost;
  upgrade.count++;
  calculateFpPerSecond();
  updateUI();
}

// --- Render Upgrades ---
function renderUpgrades() {
  dom.upgradesList.innerHTML = '';
  for (const u of upgrades) {
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

// --- Update UI ---
function updateUI() {
  dom.fpCount.textContent = formatNumber(game.fp);
  dom.fpPerSecond.textContent = formatNumber(game.fpPerSecond);
  dom.fpPerClick.textContent = formatNumber(game.fpPerClick);
  updateEra();
  renderUpgrades();
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
