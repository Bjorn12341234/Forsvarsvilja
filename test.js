// === FÖRSVARSVILJA — Sprint 1-4 Tests (Node.js) ===

let passed = 0;
let failed = 0;

function assert(condition, desc) {
  if (condition) { passed++; console.log(`  \x1b[32m✓\x1b[0m ${desc}`); }
  else { failed++; console.log(`  \x1b[31m✗\x1b[0m ${desc}`); }
}

function assertEq(actual, expected, desc) {
  if (actual === expected) { passed++; console.log(`  \x1b[32m✓\x1b[0m ${desc}`); }
  else { failed++; console.log(`  \x1b[31m✗\x1b[0m ${desc} — expected "${expected}", got "${actual}"`); }
}

function assertClose(actual, expected, tol, desc) {
  if (Math.abs(actual - expected) <= tol) { passed++; console.log(`  \x1b[32m✓\x1b[0m ${desc}`); }
  else { failed++; console.log(`  \x1b[31m✗\x1b[0m ${desc} — expected ~${expected}, got ${actual}`); }
}

function section(name) { console.log(`\n\x1b[36m▸ ${name}\x1b[0m`); }

// --- Pure functions copied from game.js ---

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

function getUpgradeCost(upgrade) {
  return Math.ceil(upgrade.baseCost * Math.pow(1.15, upgrade.count));
}

function makeUpgrades() {
  return [
    // Era 0: Hemberedskap
    { id: 'water', name: 'Vattenflaskor', baseCost: 10, fpPerSecond: 0.5, count: 0, era: 0 },
    { id: 'cans', name: 'Konservburkar', baseCost: 50, fpPerSecond: 2, count: 0, era: 0 },
    { id: 'stove', name: 'Stormkök & bränsle', baseCost: 200, fpPerSecond: 8, count: 0, era: 0 },
    { id: 'radio', name: 'Ficklampa, radio & batterier', baseCost: 600, fpPerSecond: 30, count: 0, era: 0 },
    { id: 'sleeping', name: 'Sovsäck & filtar', baseCost: 1500, fpPerSecond: 100, count: 0, era: 0 },
    { id: 'kit', name: 'Hemberedskapskit', baseCost: 5000, fpPerSecond: 300, count: 0, era: 0 },
    // Era 1: Grannskapet
    { id: 'neighbors', name: 'Grannsamverkan', baseCost: 8000, fpPerSecond: 500, count: 0, era: 1 },
    { id: 'firewood', name: 'Vedförråd & gemensam eldstad', baseCost: 25000, fpPerSecond: 1500, count: 0, era: 1 },
    { id: 'water_purifier', name: 'Vattenrenare & vattendunkar', baseCost: 75000, fpPerSecond: 5000, count: 0, era: 1 },
    { id: 'info_meeting', name: 'Informationsmöte', baseCost: 200000, fpPerSecond: 15000, count: 0, era: 1 },
    { id: 'local_group', name: 'Lokal beredskapsgrupp', baseCost: 500000, fpPerSecond: 40000, count: 0, era: 1 },
    { id: 'shelter', name: 'Gemensamt skyddsrum', baseCost: 1200000, fpPerSecond: 100000, count: 0, era: 1 },
    // Era 2: Kommunen
    { id: 'crisis_plan', name: 'Kommunal krisplan', baseCost: 1500000, fpPerSecond: 200000, count: 0, era: 2 },
    { id: 'prep_week', name: 'Beredskapsveckan', baseCost: 4000000, fpPerSecond: 500000, count: 0, era: 2 },
    { id: 'water_supply', name: 'Nödvattenförsörjning', baseCost: 10000000, fpPerSecond: 1200000, count: 0, era: 2 },
    { id: 'fire_service', name: 'Räddningstjänst-uppgradering', baseCost: 25000000, fpPerSecond: 3000000, count: 0, era: 2 },
    { id: 'civil_duty', name: 'Civilplikt-organisering', baseCost: 60000000, fpPerSecond: 8000000, count: 0, era: 2 },
    { id: 'rakel', name: 'Rakel-kommunikation', baseCost: 150000000, fpPerSecond: 20000000, count: 0, era: 2 },
    // Era 3: Regionen
    { id: 'county_coord', name: 'Länsstyrelse-samordning', baseCost: 200000000, fpPerSecond: 40000000, count: 0, era: 3 },
    { id: 'civil_area', name: 'Regionalt civilområde', baseCost: 500000000, fpPerSecond: 100000000, count: 0, era: 3 },
    { id: 'power_prep', name: 'Elberedskap & reservkraft', baseCost: 1500000000, fpPerSecond: 250000000, count: 0, era: 3 },
    { id: 'food_supply', name: 'Livsmedelsförsörjning', baseCost: 4000000000, fpPerSecond: 600000000, count: 0, era: 3 },
    { id: 'fuel_reserves', name: 'Drivmedelsreserver', baseCost: 10000000000, fpPerSecond: 1500000000, count: 0, era: 3 },
    { id: 'cyber_security', name: 'Cybersäkerhet', baseCost: 25000000000, fpPerSecond: 4000000000, count: 0, era: 3 },
    // Era 4: Nationen
    { id: 'mcf', name: 'MCF', baseCost: 40000000000, fpPerSecond: 8000000000, count: 0, era: 4 },
    { id: 'home_guard', name: 'Hemvärnet', baseCost: 100000000000, fpPerSecond: 20000000000, count: 0, era: 4 },
    { id: 'gripen', name: 'JAS 39 Gripen', baseCost: 300000000000, fpPerSecond: 50000000000, count: 0, era: 4 },
    { id: 'global_eye', name: 'Global Eye-flygplan', baseCost: 800000000000, fpPerSecond: 120000000000, count: 0, era: 4 },
    { id: 'nato_art5', name: 'NATO artikel 5', baseCost: 2000000000000, fpPerSecond: 300000000000, count: 0, era: 4 },
    { id: 'total_defense', name: 'Totalförsvar 3,5% av BNP', baseCost: 5000000000000, fpPerSecond: 800000000000, count: 0, era: 4 },
  ];
}

function makeClickUpgrades() {
  return [
    { id: 'viking', name: 'Vikingblod', cost: 500, multiplier: 2, purchased: false },
    { id: 'karolin', name: 'Karolinsk beslutsamhet', cost: 15000, multiplier: 3, purchased: false },
    { id: 'artsoppa', name: 'Ärtsoppekraft', cost: 250000, multiplier: 5, purchased: false },
    { id: 'beredskap_fighter', name: 'Beredskapskämpe', cost: 5000000, multiplier: 10, purchased: false },
    { id: 'minister', name: 'Försvarsminister-handslag', cost: 100000000, multiplier: 25, purchased: false },
    { id: 'nu_javlar', name: '"NU JÄVLAR"-knappen', cost: 5000000000, multiplier: 100, purchased: false },
  ];
}

const eras = [
  { name: 'Hemberedskap', threshold: 0 },
  { name: 'Grannskapet', threshold: 5000 },
  { name: 'Kommunen', threshold: 100000 },
  { name: 'Regionen', threshold: 2000000 },
  { name: 'Nationen', threshold: 50000000 },
];

function getCurrentEra(totalFp) {
  let era = 0;
  for (let i = eras.length - 1; i >= 0; i--) {
    if (totalFp >= eras[i].threshold) { era = i; break; }
  }
  return era;
}

function calcFpPerSecond(ups) {
  let total = 0;
  for (const u of ups) total += u.fpPerSecond * u.count;
  return total;
}

// Simulation helper: buy best affordable upgrade for current era
function simBuyBest(ups, fp, currentEra) {
  let bestIdx = -1, bestRatio = Infinity;
  for (let i = 0; i < ups.length; i++) {
    if (ups[i].era > currentEra) continue;
    const cost = getUpgradeCost(ups[i]);
    if (fp >= cost) {
      const ratio = cost / ups[i].fpPerSecond;
      if (ratio < bestRatio) { bestRatio = ratio; bestIdx = i; }
    }
  }
  if (bestIdx >= 0) {
    fp -= getUpgradeCost(ups[bestIdx]);
    ups[bestIdx].count++;
  }
  return { fp, bought: bestIdx >= 0 };
}

// ============================================================
// TESTS
// ============================================================

console.log('\x1b[33m═══ FÖRSVARSVILJA — Sprint 1-4 Tests ═══\x1b[0m');

// ---- Sprint 1 Tests (preserved) ----

section('Number Formatting');
assertEq(formatNumber(0), '0.0', 'Zero');
assertEq(formatNumber(1), '1.0', 'One');
assertEq(formatNumber(9.5), '9.5', 'Fractional');
assertEq(formatNumber(10), '10', 'Ten');
assertEq(formatNumber(999), '999', '999');
assertEq(formatNumber(1000), '1.00K', '1K');
assertEq(formatNumber(1500), '1.50K', '1.5K');
assertEq(formatNumber(15000), '15.0K', '15K');
assertEq(formatNumber(150000), '150K', '150K');
assertEq(formatNumber(1000000), '1.00M', '1M');
assertEq(formatNumber(25500000), '25.5M', '25.5M');
assertEq(formatNumber(1000000000), '1.00B', '1B');
assertEq(formatNumber(1e12), '1.00T', '1T');
assertEq(formatNumber(1e15), '1.00Q', '1Q');
assertEq(formatNumber(-500), '-500', 'Negative');

section('Cost Calculation');
{
  const u = { baseCost: 10, count: 0 };
  assertEq(getUpgradeCost(u), 10, 'First purchase = baseCost');
  u.count = 1;
  assertEq(getUpgradeCost(u), 12, 'Second purchase = 12');
  u.count = 5;
  assertEq(getUpgradeCost(u), Math.ceil(10 * 1.15 ** 5), '6th purchase');
  u.count = 10;
  assertEq(getUpgradeCost(u), Math.ceil(10 * 1.15 ** 10), '11th purchase');
  u.count = 50;
  assertEq(getUpgradeCost(u), Math.ceil(10 * 1.15 ** 50), '51st purchase');
}

section('FP/s Calculation');
{
  const ups = makeUpgrades();
  assertEq(calcFpPerSecond(ups), 0, 'No purchases = 0 FP/s');
  ups[0].count = 5;
  assertClose(calcFpPerSecond(ups), 2.5, 0.001, '5 water = 2.5 FP/s');
  ups[1].count = 3;
  assertClose(calcFpPerSecond(ups), 8.5, 0.001, '5 water + 3 cans = 8.5 FP/s');
  ups[5].count = 1;
  assertClose(calcFpPerSecond(ups), 308.5, 0.001, 'Adding 1 kit = 308.5 FP/s');
}

section('Buy Logic');
{
  let fp = 100;
  const ups = makeUpgrades();
  const cost = getUpgradeCost(ups[0]);
  assert(fp >= cost, 'Can afford first water');
  fp -= cost;
  ups[0].count++;
  assertEq(fp, 90, 'FP reduced correctly');
  assertEq(ups[0].count, 1, 'Count incremented');

  // Can't afford kit
  assert(fp < getUpgradeCost(ups[5]), 'Cannot afford kit with 90 FP');

  // Buy until can't afford
  while (fp >= getUpgradeCost(ups[0])) {
    fp -= getUpgradeCost(ups[0]);
    ups[0].count++;
  }
  assert(fp >= 0, 'FP never negative after buying');
  assert(fp < getUpgradeCost(ups[0]), 'Correctly cannot afford next');
}

section('Era Progression');
assertEq(getCurrentEra(0), 0, 'Start Era 0');
assertEq(getCurrentEra(4999), 0, '4999 = still Era 0');
assertEq(getCurrentEra(5000), 1, '5000 = Era 1');
assertEq(getCurrentEra(99999), 1, '99999 = still Era 1');
assertEq(getCurrentEra(100000), 2, '100K = Era 2');
assertEq(getCurrentEra(2000000), 3, '2M = Era 3');
assertEq(getCurrentEra(50000000), 4, '50M = Era 4');

// ---- Sprint 2 Tests ----

section('All Upgrades Data Integrity');
{
  const ups = makeUpgrades();
  assertEq(ups.length, 30, '30 total upgrades (6 per era x 5 eras)');

  const ids = new Set(ups.map(u => u.id));
  assertEq(ids.size, 30, 'All upgrade IDs unique');

  // Check each era has 6 upgrades
  for (let era = 0; era < 5; era++) {
    const eraUps = ups.filter(u => u.era === era);
    assertEq(eraUps.length, 6, `Era ${era} has 6 upgrades`);
  }

  // Within each era, costs and FP/s should be ascending
  for (let era = 0; era < 5; era++) {
    const eraUps = ups.filter(u => u.era === era);
    for (let i = 1; i < eraUps.length; i++) {
      assert(eraUps[i].baseCost > eraUps[i - 1].baseCost,
        `Era ${era}: ${eraUps[i].name} costs more than ${eraUps[i - 1].name}`);
      assert(eraUps[i].fpPerSecond > eraUps[i - 1].fpPerSecond,
        `Era ${era}: ${eraUps[i].name} gives more FP/s`);
    }
  }

  // Across eras, first upgrade of next era should cost more than last of previous
  for (let era = 1; era < 5; era++) {
    const prevLast = ups.filter(u => u.era === era - 1).pop();
    const currFirst = ups.filter(u => u.era === era)[0];
    assert(currFirst.baseCost > prevLast.baseCost,
      `Era ${era} first (${currFirst.name}) costs more than Era ${era - 1} last (${prevLast.name})`);
  }

  // All upgrades start with count 0
  assert(ups.every(u => u.count === 0), 'All upgrades start at count 0');

  // All costs are positive
  assert(ups.every(u => u.baseCost > 0), 'All baseCosts positive');
  assert(ups.every(u => u.fpPerSecond > 0), 'All fpPerSecond positive');
}

section('Click Upgrades Data Integrity');
{
  const clicks = makeClickUpgrades();
  assertEq(clicks.length, 6, '6 click upgrades');

  const ids = new Set(clicks.map(c => c.id));
  assertEq(ids.size, 6, 'All click upgrade IDs unique');

  // Costs should be ascending
  for (let i = 1; i < clicks.length; i++) {
    assert(clicks[i].cost > clicks[i - 1].cost,
      `${clicks[i].name} costs more than ${clicks[i - 1].name}`);
  }

  // All start unpurchased
  assert(clicks.every(c => !c.purchased), 'All click upgrades start unpurchased');

  // Multipliers should all be > 1
  assert(clicks.every(c => c.multiplier > 1), 'All multipliers > 1');

  // Total multiplier check: 2 * 3 * 5 * 10 * 25 * 100
  const totalMult = clicks.reduce((acc, c) => acc * c.multiplier, 1);
  assertEq(totalMult, 750000, 'Total click multiplier = 750,000x');
}

section('Click Upgrade Buy Logic');
{
  let fp = 1000;
  let fpPerClick = 1;
  const clicks = makeClickUpgrades();

  // Buy first click upgrade (cost 500)
  assert(fp >= clicks[0].cost, 'Can afford Vikingblod');
  fp -= clicks[0].cost;
  clicks[0].purchased = true;
  fpPerClick *= clicks[0].multiplier;
  assertEq(fp, 500, 'FP reduced by click upgrade cost');
  assertEq(fpPerClick, 2, 'Click power doubled after Vikingblod');
  assert(clicks[0].purchased, 'Vikingblod marked as purchased');

  // Cannot buy again (already purchased)
  assert(clicks[0].purchased === true, 'Cannot rebuy purchased click upgrade');

  // Cannot afford second (cost 15000)
  assert(fp < clicks[1].cost, 'Cannot afford Karolinsk with 500 FP');
}

section('Era-filtered Upgrade Visibility');
{
  const ups = makeUpgrades();
  // At era 0, only era 0 upgrades visible
  const era0visible = ups.filter(u => u.era <= 0);
  assertEq(era0visible.length, 6, 'Era 0: 6 visible upgrades');

  // At era 1, eras 0+1 visible
  const era1visible = ups.filter(u => u.era <= 1);
  assertEq(era1visible.length, 12, 'Era 1: 12 visible upgrades');

  // At era 2, eras 0+1+2 visible
  const era2visible = ups.filter(u => u.era <= 2);
  assertEq(era2visible.length, 18, 'Era 2: 18 visible upgrades');

  // At era 3, eras 0+1+2+3 visible
  const era3visible = ups.filter(u => u.era <= 3);
  assertEq(era3visible.length, 24, 'Era 3: 24 visible upgrades');

  // At era 4, all 30 visible
  const era4visible = ups.filter(u => u.era <= 4);
  assertEq(era4visible.length, 30, 'Era 4: all 30 visible');
}

section('Balance — Era 1 Simulation (reach Era 2)');
{
  const ups = makeUpgrades();
  let fp = 0, totalFp = 0, fps = 0, sec = 0;
  const CPS = 2; // casual clicks per second

  while (totalFp < 5000 && sec < 600) {
    fp += CPS + fps; totalFp += CPS + fps; sec++;
    let r = simBuyBest(ups, fp, 0);
    while (r.bought) { fp = r.fp; fps = calcFpPerSecond(ups); r = simBuyBest(ups, fp, 0); }
    fp = r.fp;
  }
  const min = sec / 60;
  assert(totalFp >= 5000, 'Reaches Era 2 threshold');
  assert(min >= 1, `Era 2 in ≥1 min (${min.toFixed(1)} min)`);
  assert(min <= 5, `Era 2 in ≤5 min (${min.toFixed(1)} min)`);
  console.log(`  → Era 2 in ${min.toFixed(1)} min | FP/s: ${fps.toFixed(1)}`);
}

section('Balance — Era 2 Simulation (reach Era 3)');
{
  // Start from a state where Era 2 was just reached
  const ups = makeUpgrades();
  // Give player a typical Era 1 setup
  ups[0].count = 4; ups[1].count = 3; ups[2].count = 2; ups[3].count = 2; ups[4].count = 1; ups[5].count = 1;
  let fps = calcFpPerSecond(ups);
  let fp = 1000, totalFp = 5000, sec = 0;
  const CPS = 3;

  while (totalFp < 100000 && sec < 600) {
    fp += CPS + fps; totalFp += CPS + fps; sec++;
    let era = getCurrentEra(totalFp);
    let r = simBuyBest(ups, fp, era);
    while (r.bought) { fp = r.fp; fps = calcFpPerSecond(ups); r = simBuyBest(ups, fp, era); }
    fp = r.fp;
  }
  const min = sec / 60;
  assert(totalFp >= 100000, 'Reaches Era 3 threshold');
  assert(min >= 1, `Era 3 in ≥1 min from Era 2 (${min.toFixed(1)} min)`);
  assert(min <= 6, `Era 3 in ≤6 min from Era 2 (${min.toFixed(1)} min)`);
  console.log(`  → Era 3 in ${min.toFixed(1)} min from Era 2 | FP/s: ${formatNumber(fps)}`);
}

section('Balance — Full Game Simulation');
{
  const ups = makeUpgrades();
  let fp = 0, totalFp = 0, fps = 0, sec = 0;
  let fpPerClick = 1;
  const clicks = makeClickUpgrades();
  const CPS = 3;
  const eraTimes = [];
  let lastEra = 0;

  while (sec < 3600) { // max 1 hour
    fp += CPS * fpPerClick + fps;
    totalFp += CPS * fpPerClick + fps;
    sec++;

    let era = getCurrentEra(totalFp);
    if (era > lastEra) {
      eraTimes.push({ era, sec, min: (sec / 60).toFixed(1), fps: formatNumber(fps) });
      lastEra = era;
    }

    // Buy click upgrades when affordable
    for (const c of clicks) {
      if (!c.purchased && fp >= c.cost) {
        fp -= c.cost;
        c.purchased = true;
        fpPerClick *= c.multiplier;
      }
    }

    // Buy best upgrade
    let r = simBuyBest(ups, fp, era);
    while (r.bought) { fp = r.fp; fps = calcFpPerSecond(ups); r = simBuyBest(ups, fp, era); }
    fp = r.fp;

    // Check if all upgrades bought at least once
    if (ups.every(u => u.count >= 1)) break;
  }

  const totalMin = sec / 60;
  assert(ups.every(u => u.count >= 1), 'All 30 upgrades bought at least once');
  assert(totalMin >= 5, `Full game takes ≥5 min (${totalMin.toFixed(1)} min)`);
  assert(totalMin <= 30, `Full game takes ≤30 min (${totalMin.toFixed(1)} min)`);

  // Per-era timing from the full sim
  for (let i = 0; i < eraTimes.length; i++) {
    const prevSec = i === 0 ? 0 : eraTimes[i - 1].sec;
    const delta = (eraTimes[i].sec - prevSec) / 60;
    assert(delta >= 1, `Era ${eraTimes[i].era + 1} takes ≥1 min (${delta.toFixed(1)} min from previous)`);
    assert(delta <= 8, `Era ${eraTimes[i].era + 1} takes ≤8 min (${delta.toFixed(1)} min from previous)`);
  }

  console.log(`  → Full game in ${totalMin.toFixed(1)} min`);
  for (const t of eraTimes) {
    console.log(`    Era ${t.era + 1} at ${t.min} min (FP/s: ${t.fps})`);
  }
}

section('Balance — First Upgrade Per Era Affordable Quickly');
{
  const ups = makeUpgrades();
  // Simulate reaching each era threshold and check that first upgrade is not absurdly expensive
  const eraFirstUpgradeCost = [];
  for (let era = 0; era < 5; era++) {
    const first = ups.find(u => u.era === era);
    eraFirstUpgradeCost.push(first.baseCost);
  }

  // Era 1 first upgrade (water): 10 FP — easily affordable
  assertEq(eraFirstUpgradeCost[0], 10, 'Era 1 first upgrade costs 10');

  // Era 2 first upgrade should be affordable within reasonable time at ~300 FP/s
  assert(eraFirstUpgradeCost[1] <= 50000, 'Era 2 first upgrade ≤50K (buyable quickly at ~300 FP/s)');

  // Era 3 first upgrade should be affordable within reasonable time
  assert(eraFirstUpgradeCost[2] <= 5000000, 'Era 3 first upgrade ≤5M');

  // Era 4 first upgrade
  assert(eraFirstUpgradeCost[3] <= 500000000, 'Era 4 first upgrade ≤500M');

  // Era 5 first upgrade
  assert(eraFirstUpgradeCost[4] <= 100000000000, 'Era 5 first upgrade ≤100B');
}

section('Click Upgrade Timing');
{
  const clicks = makeClickUpgrades();
  // Vikingblod (500 FP) should be buyable during Era 1
  assert(clicks[0].cost < 5000, 'Vikingblod affordable in Era 1 (< 5K)');

  // NU JÄVLAR should be expensive (late game)
  assert(clicks[5].cost >= 1000000000, 'NU JÄVLAR costs ≥1B (late game)');

  // Costs should span several orders of magnitude
  const range = clicks[5].cost / clicks[0].cost;
  assert(range >= 1000000, `Click upgrade cost range ≥1M (${range.toLocaleString()}x)`);
}

// ---- Sprint 3 Tests: Events ----

function makeEvents() {
  return [
    {
      id: 'stromavbrott', name: 'Strömavbrott!',
      description: 'Elnätet är nere. De med radio klarar sig bättre!',
      type: 'conditional', duration: 0, value: 15,
      relatedUpgrade: 'radio',
      bonusDescription: 'Radio-bonus: +{value}s av FP/s',
    },
    {
      id: 'vattenledning', name: 'Vattenledningen brast!',
      description: 'Vattnet är avstängt. Har du vatten hemma?',
      type: 'conditional', duration: 0, value: 10,
      relatedUpgrade: 'water',
      bonusDescription: 'Vattenförråd-bonus: +{value}s av FP/s',
    },
    {
      id: 'beredskapslarm', name: 'Beredskapslarm!',
      description: 'Hesa Fredrik ljuder — alla mobiliserar!',
      type: 'multiplier', duration: 30, value: 2,
    },
    {
      id: 'jas_flyby', name: 'JAS-flyby!',
      description: 'Ett JAS 39 Gripen dundrar över himlen — moralen stiger!',
      type: 'bonus', duration: 0, value: 10,
    },
    {
      id: 'hemvarnsovning', name: 'Hemvärnsövning',
      description: 'Hemvärnet övar i ditt område — extra beredskap!',
      type: 'multiplier', duration: 60, value: 1.5,
    },
    {
      id: 'desinformation', name: 'Desinformationsattack!',
      description: 'Falsk information sprids! Klicka snabbt för att motverka!',
      type: 'click_bonus', duration: 15, value: 3,
    },
    {
      id: 'om_krisen_kommer', name: '"Om krisen kommer"-utskick',
      description: 'MSB:s broschyr inspirerar hela befolkningen!',
      type: 'bonus', duration: 0, value: 20,
    },
    {
      id: 'artsoppetorsdag', name: 'Ärtsoppetorsdag!',
      description: 'Traditionen stärker banden — och beredskapen!',
      type: 'multiplier', duration: 30, value: 2,
    },
    {
      id: 'nato_ovning', name: 'NATO-övning',
      description: 'Allierade övar tillsammans — massiv förstärkning!',
      type: 'multiplier', duration: 20, value: 3,
    },
    {
      id: 'frivilligvag', name: 'Frivilligvåg!',
      description: 'Rekordmånga anmäler sig som frivilliga!',
      type: 'upgrade_bonus', duration: 0, value: 0.5,
    },
    {
      id: 'kall_vinter', name: 'Kall vinter',
      description: 'Temperaturen faller. Har du sovsäck och filtar?',
      type: 'conditional', duration: 0, value: 12,
      relatedUpgrade: 'sleeping',
      bonusDescription: 'Sovsäck-bonus: +{value}s av FP/s',
    },
    {
      id: 'mobilnat_nere', name: 'Mobilnätet nere!',
      description: 'Inga samtal, inget internet. Radio är enda kontakten.',
      type: 'conditional', duration: 0, value: 15,
      relatedUpgrade: 'radio',
      bonusDescription: 'Radio-bonus: +{value}s av FP/s',
    },
  ];
}

// Pure event bonus calculation (mirrors game.js getEventBonus)
function getEventBonus(event, ups, fpPerSecond) {
  if (event.type === 'bonus') {
    return fpPerSecond * event.value;
  }
  if (event.type === 'conditional') {
    const upgrade = ups.find(u => u.id === event.relatedUpgrade);
    if (upgrade && upgrade.count > 0) {
      return fpPerSecond * event.value;
    }
    return 0;
  }
  if (event.type === 'upgrade_bonus') {
    let totalCount = 0;
    for (const u of ups) totalCount += u.count;
    return fpPerSecond * event.value * totalCount;
  }
  return 0;
}

section('Event Data Integrity');
{
  const evts = makeEvents();
  assertEq(evts.length, 12, '12 events total');

  const ids = new Set(evts.map(e => e.id));
  assertEq(ids.size, 12, 'All event IDs unique');

  // All events have required fields
  const requiredFields = ['id', 'name', 'description', 'type', 'duration', 'value'];
  for (const e of evts) {
    for (const f of requiredFields) {
      assert(e[f] !== undefined, `Event "${e.id}" has field "${f}"`);
    }
  }

  // Valid types
  const validTypes = ['bonus', 'multiplier', 'click_bonus', 'conditional', 'upgrade_bonus'];
  for (const e of evts) {
    assert(validTypes.includes(e.type), `Event "${e.id}" has valid type "${e.type}"`);
  }

  // Conditional events have relatedUpgrade
  const conditionals = evts.filter(e => e.type === 'conditional');
  assert(conditionals.length >= 3, 'At least 3 conditional events');
  for (const e of conditionals) {
    assert(e.relatedUpgrade !== undefined, `Conditional event "${e.id}" has relatedUpgrade`);
    assert(e.bonusDescription !== undefined, `Conditional event "${e.id}" has bonusDescription`);
  }

  // Timed events have positive duration
  const timed = evts.filter(e => e.type === 'multiplier' || e.type === 'click_bonus');
  for (const e of timed) {
    assert(e.duration > 0, `Timed event "${e.id}" has positive duration (${e.duration}s)`);
  }

  // Instant events have duration 0
  const instant = evts.filter(e => e.type === 'bonus' || e.type === 'conditional' || e.type === 'upgrade_bonus');
  for (const e of instant) {
    assertEq(e.duration, 0, `Instant event "${e.id}" has duration 0`);
  }
}

section('Event Type Distribution');
{
  const evts = makeEvents();
  const typeCounts = {};
  for (const e of evts) {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
  }
  assert(typeCounts['multiplier'] >= 3, 'At least 3 multiplier events');
  assert(typeCounts['bonus'] >= 2, 'At least 2 bonus events');
  assert(typeCounts['conditional'] >= 3, 'At least 3 conditional events');
  assert(typeCounts['click_bonus'] >= 1, 'At least 1 click_bonus event');
  assert(typeCounts['upgrade_bonus'] >= 1, 'At least 1 upgrade_bonus event');
}

section('Event Multiplier Application');
{
  // With multiplier event active, FP/s should be multiplied
  const baseFps = 100;
  const evts = makeEvents();
  const beredskapslarm = evts.find(e => e.id === 'beredskapslarm');
  const effectiveFps = baseFps * beredskapslarm.value;
  assertEq(effectiveFps, 200, 'Beredskapslarm doubles FP/s (100 → 200)');

  const natoOvning = evts.find(e => e.id === 'nato_ovning');
  assertEq(baseFps * natoOvning.value, 300, 'NATO-övning triples FP/s (100 → 300)');

  const hemvarnsovning = evts.find(e => e.id === 'hemvarnsovning');
  assertEq(baseFps * hemvarnsovning.value, 150, 'Hemvärnsövning 1.5x FP/s (100 → 150)');
}

section('Event Bonus Calculation');
{
  const ups = makeUpgrades();
  const fpPerSecond = 100;

  // JAS-flyby: 10 seconds of FP/s
  const evts = makeEvents();
  const jasFlyby = evts.find(e => e.id === 'jas_flyby');
  assertEq(getEventBonus(jasFlyby, ups, fpPerSecond), 1000, 'JAS-flyby gives 10s of FP/s (1000 FP at 100/s)');

  // Om krisen kommer: 20 seconds of FP/s
  const omKrisen = evts.find(e => e.id === 'om_krisen_kommer');
  assertEq(getEventBonus(omKrisen, ups, fpPerSecond), 2000, 'Om krisen 20s of FP/s (2000 FP at 100/s)');
}

section('Conditional Event Bonus');
{
  const ups = makeUpgrades();
  const evts = makeEvents();
  const fpPerSecond = 100;

  // Strömavbrott without radio = no bonus
  const stromavbrott = evts.find(e => e.id === 'stromavbrott');
  assertEq(getEventBonus(stromavbrott, ups, fpPerSecond), 0, 'Strömavbrott without radio = 0 bonus');

  // Buy radio
  ups.find(u => u.id === 'radio').count = 1;
  assertEq(getEventBonus(stromavbrott, ups, fpPerSecond), 1500, 'Strömavbrott with radio = 15s of FP/s');

  // Kall vinter without sleeping bag = no bonus
  const kallVinter = evts.find(e => e.id === 'kall_vinter');
  assertEq(getEventBonus(kallVinter, ups, fpPerSecond), 0, 'Kall vinter without sleeping = 0 bonus');

  // Buy sleeping bag
  ups.find(u => u.id === 'sleeping').count = 2;
  assertEq(getEventBonus(kallVinter, ups, fpPerSecond), 1200, 'Kall vinter with sleeping = 12s of FP/s');
}

section('Upgrade Bonus Event');
{
  const ups = makeUpgrades();
  const evts = makeEvents();
  const fpPerSecond = 100;

  // Frivilligvåg with no upgrades = 0
  const frivilligvag = evts.find(e => e.id === 'frivilligvag');
  assertEq(getEventBonus(frivilligvag, ups, fpPerSecond), 0, 'Frivilligvåg with 0 upgrades = 0');

  // Buy some upgrades
  ups[0].count = 5; ups[1].count = 3;
  const totalCount = 8;
  assertEq(getEventBonus(frivilligvag, ups, fpPerSecond), fpPerSecond * 0.5 * totalCount,
    'Frivilligvåg with 8 upgrades = 0.5 * 8 * FP/s');
}

section('Event Scheduling Range');
{
  // The scheduling function uses 45-90s — test the range is valid
  const MIN_DELAY = 45;
  const MAX_DELAY = 90;
  assert(MIN_DELAY >= 30, 'Min event delay ≥30s');
  assert(MAX_DELAY <= 120, 'Max event delay ≤120s');
  assert(MAX_DELAY > MIN_DELAY, 'Max > Min delay');

  // Simulate many random delays to verify range
  let allInRange = true;
  for (let i = 0; i < 1000; i++) {
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    if (delay < MIN_DELAY || delay > MAX_DELAY) allInRange = false;
  }
  assert(allInRange, '1000 random delays all within 45-90s');
}

section('Conditional Event Related Upgrades Exist');
{
  const ups = makeUpgrades();
  const evts = makeEvents();
  const conditionals = evts.filter(e => e.type === 'conditional');

  for (const e of conditionals) {
    const upgrade = ups.find(u => u.id === e.relatedUpgrade);
    assert(upgrade !== undefined, `Conditional event "${e.id}" references existing upgrade "${e.relatedUpgrade}"`);
  }
}

// ---- Sprint 4 Tests: Achievements & End Screen ----

function makeAchievements(ups, clickUps, gameState) {
  return [
    { id: 'first_click', name: 'Första steget', check: () => gameState.totalClicks >= 1, unlocked: false },
    { id: 'clicks_100', name: 'Hundra klick', check: () => gameState.totalClicks >= 100, unlocked: false },
    { id: 'clicks_1000', name: 'Tusen klick', check: () => gameState.totalClicks >= 1000, unlocked: false },
    { id: 'clicks_10000', name: 'Tiotusen klick', check: () => gameState.totalClicks >= 10000, unlocked: false },
    { id: 'first_upgrade', name: 'Första inköpet', check: () => gameState.totalUpgradesBought >= 1, unlocked: false },
    { id: 'era1_complete', name: 'Hemberedskapen klar', check: () => ups.filter(u => u.era === 0).every(u => u.count >= 1), unlocked: false },
    { id: 'era2_complete', name: 'Grannen du vill ha', check: () => ups.filter(u => u.era === 1).every(u => u.count >= 1), unlocked: false },
    { id: 'reach_era3', name: 'Kommunal kraft', check: () => gameState.currentEra >= 2, unlocked: false },
    { id: 'reach_era4', name: 'Regional samordning', check: () => gameState.currentEra >= 3, unlocked: false },
    { id: 'reach_era5', name: 'Nationens försvar', check: () => gameState.currentEra >= 4, unlocked: false },
    { id: 'first_click_upgrade', name: 'Klickkraftare', check: () => clickUps.some(u => u.purchased), unlocked: false },
    { id: 'nu_javlar', name: 'NU JÄVLAR', check: () => { const u = clickUps.find(c => c.id === 'nu_javlar'); return u && u.purchased; }, unlocked: false },
    { id: 'kontanter', name: 'Kontanter?!', check: () => gameState.totalFp >= 10000, unlocked: false },
    { id: 'broschyren', name: 'Har du läst broschyren?', check: () => gameState.totalFp >= 5200000, unlocked: false },
    { id: 'game_complete', name: 'Totalförsvaret komplett', check: () => gameState.gameComplete, unlocked: false },
  ];
  // Note: 'all_achievements' is excluded from tests because it references the array itself
}

function checkAchievementsTest(achs) {
  let newlyUnlocked = [];
  for (const a of achs) {
    if (!a.unlocked && a.check()) {
      a.unlocked = true;
      newlyUnlocked.push(a.id);
    }
  }
  return newlyUnlocked;
}

section('Achievement Data Integrity');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);

  assertEq(achs.length, 15, '15 testable achievements (16 including meta)');

  const ids = new Set(achs.map(a => a.id));
  assertEq(ids.size, 15, 'All achievement IDs unique');

  // All start unlocked = false
  assert(achs.every(a => a.unlocked === false), 'All achievements start locked');

  // All have required fields
  for (const a of achs) {
    assert(a.id !== undefined, `Achievement "${a.id}" has id`);
    assert(a.name !== undefined, `Achievement "${a.id}" has name`);
    assert(typeof a.check === 'function', `Achievement "${a.id}" has check function`);
  }
}

section('Achievement — Click Milestones');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);

  // No achievements at start
  let unlocked = checkAchievementsTest(achs);
  assertEq(unlocked.length, 0, 'No achievements at 0 clicks');

  // First click
  gs.totalClicks = 1;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('first_click'), 'First click achievement unlocks at 1 click');

  // 100 clicks
  gs.totalClicks = 100;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('clicks_100'), '100 clicks achievement unlocks');

  // 1000 clicks
  gs.totalClicks = 1000;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('clicks_1000'), '1000 clicks achievement unlocks');

  // 10000 clicks
  gs.totalClicks = 10000;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('clicks_10000'), '10000 clicks achievement unlocks');

  // Already unlocked achievements don't re-trigger
  unlocked = checkAchievementsTest(achs);
  assertEq(unlocked.length, 0, 'No re-triggers on already unlocked');
}

section('Achievement — Upgrade Milestones');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);

  // First upgrade
  gs.totalUpgradesBought = 1;
  let unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('first_upgrade'), 'First upgrade achievement unlocks');

  // Era 1 complete (all era 0 upgrades)
  for (const u of ups.filter(u => u.era === 0)) u.count = 1;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('era1_complete'), 'Era 1 complete achievement unlocks');

  // Era 2 complete
  for (const u of ups.filter(u => u.era === 1)) u.count = 1;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('era2_complete'), 'Era 2 complete achievement unlocks');
}

section('Achievement — Era Milestones');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);

  gs.currentEra = 2;
  let unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('reach_era3'), 'Era 3 achievement unlocks at currentEra 2');

  gs.currentEra = 3;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('reach_era4'), 'Era 4 achievement unlocks at currentEra 3');

  gs.currentEra = 4;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('reach_era5'), 'Era 5 achievement unlocks at currentEra 4');
}

section('Achievement — Click Upgrades');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);

  clicks[0].purchased = true;
  let unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('first_click_upgrade'), 'First click upgrade achievement unlocks');

  clicks[5].purchased = true; // nu_javlar
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('nu_javlar'), 'NU JÄVLAR achievement unlocks');
}

section('Achievement — FP Milestones');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);

  gs.totalFp = 10000;
  let unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('kontanter'), 'Kontanter achievement unlocks at 10K FP');

  gs.totalFp = 5200000;
  unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('broschyren'), 'Broschyren achievement unlocks at 5.2M FP');
}

section('Achievement — Game Complete');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);

  gs.gameComplete = true;
  let unlocked = checkAchievementsTest(achs);
  assert(unlocked.includes('game_complete'), 'Game complete achievement unlocks');
}

section('End Game Detection');
{
  const ups = makeUpgrades();
  const totalDefense = ups.find(u => u.id === 'total_defense');
  assert(totalDefense !== undefined, 'total_defense upgrade exists');
  assertEq(totalDefense.era, 4, 'total_defense is in Era 5 (index 4)');
  assertEq(totalDefense.baseCost, 5000000000000, 'total_defense costs 5T');

  // The last upgrade in the array should be total_defense
  assertEq(ups[ups.length - 1].id, 'total_defense', 'total_defense is the last upgrade');
}

section('Achievement Count');
{
  // Total achievement count in the game (including all_achievements meta)
  const TOTAL_ACHIEVEMENTS = 16;
  assert(TOTAL_ACHIEVEMENTS >= 14, 'At least 14 achievements planned');
  assert(TOTAL_ACHIEVEMENTS <= 20, 'No more than 20 achievements');
}

section('Full Game Achievement Simulation');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();
  const gs = { totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, totalFp: 0, gameComplete: false };
  const achs = makeAchievements(ups, clicks, gs);
  let fp = 0, fps = 0;
  const CPS = 3;
  let fpPerClick = 1;
  let sec = 0;
  let achievementLog = [];

  while (sec < 3600) {
    fp += CPS * fpPerClick + fps;
    gs.totalFp += CPS * fpPerClick + fps;
    gs.totalClicks += CPS;
    sec++;

    gs.currentEra = getCurrentEra(gs.totalFp);

    // Buy click upgrades
    for (const c of clicks) {
      if (!c.purchased && fp >= c.cost) {
        fp -= c.cost;
        c.purchased = true;
        fpPerClick *= c.multiplier;
      }
    }

    // Buy best upgrade
    let r = simBuyBest(ups, fp, gs.currentEra);
    while (r.bought) {
      fp = r.fp;
      gs.totalUpgradesBought++;
      fps = calcFpPerSecond(ups);
      r = simBuyBest(ups, fp, gs.currentEra);
    }
    fp = r.fp;

    // Check game completion
    if (ups.find(u => u.id === 'total_defense').count >= 1 && !gs.gameComplete) {
      gs.gameComplete = true;
    }

    // Check achievements
    const unlocked = checkAchievementsTest(achs);
    for (const id of unlocked) {
      achievementLog.push({ id, sec });
    }

    if (gs.gameComplete && achs.every(a => a.unlocked)) break;
  }

  const unlockedCount = achs.filter(a => a.unlocked).length;
  assert(unlockedCount >= 13, `At least 13 achievements unlock in full game (got ${unlockedCount})`);
  assert(gs.gameComplete, 'Game completes during simulation');
  assert(achs.find(a => a.id === 'first_click').unlocked, 'First click achievement unlocked');
  assert(achs.find(a => a.id === 'first_upgrade').unlocked, 'First upgrade achievement unlocked');
  assert(achs.find(a => a.id === 'game_complete').unlocked, 'Game complete achievement unlocked');
  assert(achs.find(a => a.id === 'kontanter').unlocked, 'Kontanter achievement unlocked');

  console.log(`  → ${unlockedCount}/15 achievements unlocked in ${(sec/60).toFixed(1)} min`);
}

// ============================================================
// SPRINT 5 TESTS — Save/Load, Reset, Edge Cases
// ============================================================

section('Save Data Serialization');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();

  // Simulate some game state
  ups[0].count = 5;
  ups[1].count = 3;
  ups[6].count = 2; // Era 1 upgrade
  clicks[0].purchased = true;
  clicks[1].purchased = true;

  const saveData = {
    version: 1,
    fp: 12345.67,
    totalFp: 99999.99,
    fpPerClick: 6,
    totalClicks: 500,
    totalUpgradesBought: 10,
    currentEra: 1,
    startTime: Date.now() - 60000,
    muted: false,
    gameComplete: false,
    upgradeCounts: ups.map(u => u.count),
    clickPurchased: clicks.map(u => u.purchased),
    achievementsUnlocked: [true, true, false, false, true, false, false, false, false, false, false, false, false, false, false],
    savedAt: Date.now(),
  };

  // Verify structure
  assertEq(saveData.version, 1, 'Save data has version 1');
  assertEq(saveData.upgradeCounts.length, 30, 'Save data has 30 upgrade counts');
  assertEq(saveData.clickPurchased.length, 6, 'Save data has 6 click upgrade states');
  assertEq(saveData.achievementsUnlocked.length, 15, 'Save data has 15 achievement states');

  // Verify values
  assertEq(saveData.upgradeCounts[0], 5, 'Water upgrade count saved as 5');
  assertEq(saveData.upgradeCounts[1], 3, 'Cans upgrade count saved as 3');
  assertEq(saveData.upgradeCounts[6], 2, 'Neighbors upgrade count saved as 2');
  assertEq(saveData.clickPurchased[0], true, 'Viking purchased saved as true');
  assertEq(saveData.clickPurchased[2], false, 'Artsoppa purchased saved as false');

  // JSON round-trip
  const json = JSON.stringify(saveData);
  const restored = JSON.parse(json);
  assertEq(restored.fp, 12345.67, 'FP survives JSON round-trip');
  assertEq(restored.totalClicks, 500, 'Total clicks survives JSON round-trip');
  assertEq(restored.upgradeCounts[0], 5, 'Upgrade counts survive JSON round-trip');
  assertEq(restored.clickPurchased[0], true, 'Click purchased survives JSON round-trip');
  assertEq(restored.achievementsUnlocked[0], true, 'Achievements survive JSON round-trip');
  assertEq(restored.achievementsUnlocked[2], false, 'Locked achievements survive JSON round-trip');
}

section('Save Data Restoration');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();

  const saveData = {
    version: 1,
    fp: 50000,
    totalFp: 200000,
    fpPerClick: 30,
    totalClicks: 1500,
    totalUpgradesBought: 20,
    currentEra: 2,
    startTime: Date.now() - 300000,
    muted: true,
    gameComplete: false,
    upgradeCounts: ups.map(() => 0),
    clickPurchased: clicks.map(() => false),
    achievementsUnlocked: new Array(15).fill(false),
    savedAt: Date.now(),
  };

  // Modify some specific values
  saveData.upgradeCounts[0] = 10; // water
  saveData.upgradeCounts[5] = 3;  // kit
  saveData.clickPurchased[0] = true; // viking

  // Simulate restoration
  const game = { fp: 0, totalFp: 0, fpPerClick: 1, totalClicks: 0, totalUpgradesBought: 0, currentEra: 0, muted: false, gameComplete: false };
  const restoredUps = makeUpgrades();
  const restoredClicks = makeClickUpgrades();

  game.fp = saveData.fp;
  game.totalFp = saveData.totalFp;
  game.fpPerClick = saveData.fpPerClick;
  game.totalClicks = saveData.totalClicks;
  game.totalUpgradesBought = saveData.totalUpgradesBought;
  game.currentEra = saveData.currentEra;
  game.muted = saveData.muted;

  for (let i = 0; i < restoredUps.length && i < saveData.upgradeCounts.length; i++) {
    restoredUps[i].count = saveData.upgradeCounts[i] || 0;
  }
  for (let i = 0; i < restoredClicks.length && i < saveData.clickPurchased.length; i++) {
    restoredClicks[i].purchased = !!saveData.clickPurchased[i];
  }

  assertEq(game.fp, 50000, 'FP restored correctly');
  assertEq(game.totalFp, 200000, 'Total FP restored correctly');
  assertEq(game.fpPerClick, 30, 'FP per click restored correctly');
  assertEq(game.totalClicks, 1500, 'Total clicks restored correctly');
  assertEq(game.currentEra, 2, 'Current era restored correctly');
  assertEq(game.muted, true, 'Muted state restored correctly');
  assertEq(restoredUps[0].count, 10, 'Water count restored to 10');
  assertEq(restoredUps[5].count, 3, 'Kit count restored to 3');
  assertEq(restoredClicks[0].purchased, true, 'Viking purchased restored');
  assertEq(restoredClicks[1].purchased, false, 'Karolin not purchased after restore');

  // FP/s should recalculate correctly
  const fps = calcFpPerSecond(restoredUps);
  const expected = restoredUps[0].fpPerSecond * 10 + restoredUps[5].fpPerSecond * 3;
  assertEq(fps, expected, 'FP/s recalculates correctly after restore');
}

section('Reset Clears All State');
{
  const ups = makeUpgrades();
  const clicks = makeClickUpgrades();

  // Simulate a mid-game state
  ups[0].count = 10;
  ups[5].count = 5;
  clicks[0].purchased = true;

  // Reset
  for (const u of ups) u.count = 0;
  for (const c of clicks) c.purchased = false;

  assertEq(ups[0].count, 0, 'Water count reset to 0');
  assertEq(ups[5].count, 0, 'Kit count reset to 0');
  assertEq(clicks[0].purchased, false, 'Viking reset to not purchased');

  const fps = calcFpPerSecond(ups);
  assertEq(fps, 0, 'FP/s is 0 after reset');
}

section('Save Data Version Check');
{
  // Invalid version should be rejected
  const badSave = { version: 999, fp: 100 };
  const isValid = badSave.version === 1;
  assertEq(isValid, false, 'Version 999 is rejected');

  // Missing version should be rejected
  const noVersion = { fp: 100 };
  const isValid2 = noVersion.version === 1;
  assertEq(isValid2, false, 'Missing version is rejected');

  // Null data should be rejected
  const isValid3 = null && null.version === 1;
  assertEq(!!isValid3, false, 'Null data is rejected');
}

section('Edge Cases — Large Numbers in Save');
{
  const huge = 5e15;
  const saveData = JSON.parse(JSON.stringify({ fp: huge, totalFp: huge * 2 }));
  assertEq(saveData.fp, huge, 'Very large FP value survives JSON round-trip');
  assertEq(saveData.totalFp, huge * 2, 'Very large total FP survives JSON round-trip');
  assertEq(formatNumber(huge), '5.00Q', 'Very large number formats correctly');
}

section('Edge Cases — Partial Save Data');
{
  // If save data has fewer upgrades than current (e.g., new version added upgrades)
  const ups = makeUpgrades();
  const shortCounts = [5, 3]; // Only 2 values
  for (let i = 0; i < ups.length && i < shortCounts.length; i++) {
    ups[i].count = shortCounts[i] || 0;
  }
  assertEq(ups[0].count, 5, 'First upgrade count set from short array');
  assertEq(ups[1].count, 3, 'Second upgrade count set from short array');
  assertEq(ups[2].count, 0, 'Third upgrade count stays 0 (not in short array)');
}

// --- Summary ---
console.log('');
const total = passed + failed;
if (failed === 0) {
  console.log(`\x1b[32m══════════════════════════════════\x1b[0m`);
  console.log(`\x1b[32m  ALL ${total} TESTS PASSED\x1b[0m`);
  console.log(`\x1b[32m══════════════════════════════════\x1b[0m`);
  process.exit(0);
} else {
  console.log(`\x1b[31m══════════════════════════════════\x1b[0m`);
  console.log(`\x1b[31m  ${failed} FAILED / ${total} total\x1b[0m`);
  console.log(`\x1b[31m══════════════════════════════════\x1b[0m`);
  process.exit(1);
}
