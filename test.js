// === FÖRSVARSVILJA — Sprint 1 Tests (Node.js) ===

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
    { id: 'water', name: 'Vattenflaskor', baseCost: 10, fpPerSecond: 0.5, count: 0 },
    { id: 'cans', name: 'Konservburkar', baseCost: 50, fpPerSecond: 2, count: 0 },
    { id: 'stove', name: 'Stormkök & bränsle', baseCost: 200, fpPerSecond: 8, count: 0 },
    { id: 'radio', name: 'Ficklampa, radio & batterier', baseCost: 600, fpPerSecond: 30, count: 0 },
    { id: 'sleeping', name: 'Sovsäck & filtar', baseCost: 1500, fpPerSecond: 100, count: 0 },
    { id: 'kit', name: 'Hemberedskapskit', baseCost: 5000, fpPerSecond: 300, count: 0 },
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

// ============================================================
// TESTS
// ============================================================

console.log('\x1b[33m═══ FÖRSVARSVILJA — Sprint 1 Tests ═══\x1b[0m');

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

section('Upgrade Data Integrity');
{
  const ups = makeUpgrades();
  assertEq(ups.length, 6, '6 upgrades in Era 1');
  const ids = new Set(ups.map(u => u.id));
  assertEq(ids.size, 6, 'All IDs unique');
  for (let i = 1; i < ups.length; i++) {
    assert(ups[i].baseCost > ups[i - 1].baseCost, `${ups[i].name} costs more than ${ups[i - 1].name}`);
    assert(ups[i].fpPerSecond > ups[i - 1].fpPerSecond, `${ups[i].name} gives more FP/s`);
  }
}

section('Game Balance — Simulation');
{
  // Helper: buy best cost/FPS ratio upgrade that's affordable
  function buyBest(ups, fp) {
    let bestIdx = -1, bestRatio = Infinity;
    for (let i = 0; i < ups.length; i++) {
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

  // Sim 1: Time to buy every upgrade at least once (smart strategy, 3 cps)
  const ups1 = makeUpgrades();
  let fp1 = 0, totalFp1 = 0, fps1 = 0, sec1 = 0;
  while (sec1 < 600) {
    fp1 += 3 + fps1; totalFp1 += 3 + fps1; sec1++;
    let r = buyBest(ups1, fp1);
    while (r.bought) { fp1 = r.fp; fps1 = calcFpPerSecond(ups1); r = buyBest(ups1, fp1); }
    fp1 = r.fp;
    if (ups1.every(u => u.count >= 1)) break;
  }
  const m1 = sec1 / 60;
  assert(m1 >= 0.5, `All upgrades x1 takes ≥0.5 min (${m1.toFixed(1)} min)`);
  assert(m1 <= 8, `All upgrades x1 takes ≤8 min at 3cps (${m1.toFixed(1)} min)`);
  console.log(`  → All x1 in ${m1.toFixed(1)} min | FP/s: ${fps1.toFixed(1)} | total: ${formatNumber(totalFp1)}`);
}
{
  // Sim 2: Time to reach Era 2 (5000 FP) with 2 cps (casual player)
  const ups2 = makeUpgrades();
  let fp2 = 0, totalFp2 = 0, fps2 = 0, sec2 = 0;
  while (totalFp2 < 5000 && sec2 < 600) {
    fp2 += 2 + fps2; totalFp2 += 2 + fps2; sec2++;
    let bought = true;
    while (bought) {
      bought = false;
      for (const u of ups2) {
        const cost = getUpgradeCost(u);
        if (fp2 >= cost) { fp2 -= cost; u.count++; fps2 = calcFpPerSecond(ups2); bought = true; break; }
      }
    }
  }
  const m2 = sec2 / 60;
  assert(totalFp2 >= 5000, 'Reaches Era 2 threshold');
  assert(m2 >= 1, `Era 2 takes ≥1 min (${m2.toFixed(1)} min)`);
  assert(m2 <= 5, `Era 2 takes ≤5 min (${m2.toFixed(1)} min)`);
  console.log(`  → Era 2 in ${m2.toFixed(1)} min | FP/s: ${fps2.toFixed(1)}`);
}
{
  // Sim 3: First upgrade should be buyable within 10 clicks (10 sec at 1 cps)
  assert(10 >= makeUpgrades()[0].baseCost, 'First upgrade affordable within 10 clicks');
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
