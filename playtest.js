#!/usr/bin/env node
// FÖRSVARSVILJA — Headless Playtest Simulation
// Run: node playtest.js [cps] [--verbose]
// Examples:
//   node playtest.js          # default: 3 CPS
//   node playtest.js 0        # idle-only (no clicks)
//   node playtest.js 8        # active player
//   node playtest.js 3 --verbose  # show every upgrade buy

'use strict';

// ============================================================
// GAME DATA — extracted from game.js
// ============================================================

const eras = [
  { name: 'Hemberedskap', threshold: 0 },
  { name: 'Grannskapet', threshold: 5000 },
  { name: 'Kommunen', threshold: 100000 },
  { name: 'Regionen', threshold: 2000000 },
  { name: 'Nationen', threshold: 50000000 },
];

const upgradeData = [
  { id: 'water', name: 'Vattenflaskor', baseCost: 10, fpPerSecond: 0.5, era: 0 },
  { id: 'cans', name: 'Konservburkar', baseCost: 50, fpPerSecond: 2, era: 0 },
  { id: 'stove', name: 'Stormkök', baseCost: 200, fpPerSecond: 8, era: 0 },
  { id: 'radio', name: 'Radio & batterier', baseCost: 600, fpPerSecond: 30, era: 0 },
  { id: 'sleeping', name: 'Sovsäck & filtar', baseCost: 1500, fpPerSecond: 100, era: 0 },
  { id: 'kit', name: 'Hemberedskapskit', baseCost: 5000, fpPerSecond: 300, era: 0 },
  { id: 'neighbors', name: 'Grannsamverkan', baseCost: 8000, fpPerSecond: 500, era: 1 },
  { id: 'firewood', name: 'Vedförråd', baseCost: 25000, fpPerSecond: 1500, era: 1 },
  { id: 'water_purifier', name: 'Vattenrenare', baseCost: 75000, fpPerSecond: 5000, era: 1 },
  { id: 'info_meeting', name: 'Informationsmöte', baseCost: 200000, fpPerSecond: 15000, era: 1 },
  { id: 'local_group', name: 'Beredskapsgrupp', baseCost: 500000, fpPerSecond: 40000, era: 1 },
  { id: 'shelter', name: 'Skyddsrum', baseCost: 1200000, fpPerSecond: 100000, era: 1 },
  { id: 'crisis_plan', name: 'Kommunal krisplan', baseCost: 1500000, fpPerSecond: 200000, era: 2 },
  { id: 'prep_week', name: 'Beredskapsveckan', baseCost: 4000000, fpPerSecond: 500000, era: 2 },
  { id: 'water_supply', name: 'Nödvatten', baseCost: 10000000, fpPerSecond: 1200000, era: 2 },
  { id: 'fire_service', name: 'Räddningstjänst', baseCost: 25000000, fpPerSecond: 3000000, era: 2 },
  { id: 'civil_duty', name: 'Civilplikt', baseCost: 60000000, fpPerSecond: 8000000, era: 2 },
  { id: 'rakel', name: 'Rakel-komm.', baseCost: 150000000, fpPerSecond: 20000000, era: 2 },
  { id: 'county_coord', name: 'Länsstyrelse', baseCost: 200000000, fpPerSecond: 40000000, era: 3 },
  { id: 'civil_area', name: 'Civilområde', baseCost: 500000000, fpPerSecond: 100000000, era: 3 },
  { id: 'power_prep', name: 'Elberedskap', baseCost: 1500000000, fpPerSecond: 250000000, era: 3 },
  { id: 'food_supply', name: 'Livsmedel', baseCost: 4000000000, fpPerSecond: 600000000, era: 3 },
  { id: 'fuel_reserves', name: 'Drivmedel', baseCost: 10000000000, fpPerSecond: 1500000000, era: 3 },
  { id: 'cyber_security', name: 'Cybersäkerhet', baseCost: 25000000000, fpPerSecond: 4000000000, era: 3 },
  { id: 'mcf', name: 'MCF', baseCost: 40000000000, fpPerSecond: 8000000000, era: 4 },
  { id: 'home_guard', name: 'Hemvärnet', baseCost: 100000000000, fpPerSecond: 20000000000, era: 4 },
  { id: 'gripen', name: 'JAS 39 Gripen', baseCost: 300000000000, fpPerSecond: 50000000000, era: 4 },
  { id: 'global_eye', name: 'Global Eye', baseCost: 800000000000, fpPerSecond: 120000000000, era: 4 },
  { id: 'nato_art5', name: 'NATO artikel 5', baseCost: 2000000000000, fpPerSecond: 300000000000, era: 4 },
  { id: 'total_defense', name: 'Totalförsvar 3,5%', baseCost: 5000000000000, fpPerSecond: 800000000000, era: 4 },
];

const clickUpgradeData = [
  { id: 'viking', name: 'Vikingblod', cost: 500, multiplier: 2 },
  { id: 'karolin', name: 'Karolinsk beslutsamhet', cost: 15000, multiplier: 3 },
  { id: 'artsoppa', name: 'Ärtsoppekraft', cost: 250000, multiplier: 5 },
  { id: 'beredskap_fighter', name: 'Beredskapskämpe', cost: 5000000, multiplier: 10 },
  { id: 'minister', name: 'Försvarsminister', cost: 100000000, multiplier: 25 },
  { id: 'nu_javlar', name: '"NU JÄVLAR"', cost: 5000000000, multiplier: 100 },
];

// ============================================================
// HELPERS
// ============================================================

function formatNumber(n) {
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000) return n < 10 ? n.toFixed(1) : Math.floor(n).toString();
  const tiers = [
    { t: 1e15, s: 'Q' }, { t: 1e12, s: 'T' }, { t: 1e9, s: 'B' },
    { t: 1e6, s: 'M' }, { t: 1e3, s: 'K' },
  ];
  for (const { t, s } of tiers) {
    if (n >= t) {
      const v = n / t;
      return (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.floor(v)) + s;
    }
  }
  return Math.floor(n).toString();
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function getCost(baseCost, count) {
  return Math.ceil(baseCost * Math.pow(1.15, count));
}

// ============================================================
// SIMULATION
// ============================================================

function simulate(cps, verbose) {
  // Game state
  let fp = 0;
  let totalFp = 0;
  let fpPerClick = 1;
  let fpPerSecond = 0;
  let currentEra = 0;
  let totalClicks = 0;
  let totalUpgradesBought = 0;
  let fpFromClicks = 0;
  let fpFromIdle = 0;
  let gameTime = 0;

  // Clone upgrade state
  const upgrades = upgradeData.map(u => ({ ...u, count: 0 }));
  const clickUpgrades = clickUpgradeData.map(u => ({ ...u, purchased: false }));

  // Tracking
  const eraLog = [{ era: 0, name: eras[0].name, time: 0, fps: 0, fpc: 1, totalFp: 0 }];
  const buyLog = [];

  const TICK = 0.1; // 100ms ticks, matching the real game loop
  const MAX_TIME = 3600; // 1 hour safety limit

  function recalcFps() {
    fpPerSecond = 0;
    for (const u of upgrades) fpPerSecond += u.fpPerSecond * u.count;
  }

  function getEra() {
    for (let i = eras.length - 1; i >= 0; i--) {
      if (totalFp >= eras[i].threshold) return i;
    }
    return 0;
  }

  function buyBest() {
    // Click upgrades first
    for (const u of clickUpgrades) {
      if (!u.purchased && fp >= u.cost) {
        fp -= u.cost;
        u.purchased = true;
        fpPerClick *= u.multiplier;
        if (verbose) buyLog.push({ time: gameTime, name: u.name, type: 'click', mult: u.multiplier + 'x' });
      }
    }

    // Regular upgrades — best FP/s per cost ratio
    let bought = true;
    let safety = 0;
    while (bought && safety++ < 500) {
      bought = false;
      let best = null;
      let bestRatio = -1;
      for (const u of upgrades) {
        if (u.era > currentEra) continue;
        const cost = getCost(u.baseCost, u.count);
        if (fp < cost) continue;
        const ratio = u.fpPerSecond / cost;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = u;
        }
      }
      if (best) {
        const cost = getCost(best.baseCost, best.count);
        fp -= cost;
        best.count++;
        totalUpgradesBought++;
        recalcFps();
        bought = true;
        if (verbose) buyLog.push({ time: gameTime, name: best.name, type: 'upgrade', count: best.count, cost: formatNumber(cost) });

        if (best.id === 'total_defense') return true; // game complete
      }
    }
    return false;
  }

  // === Main simulation loop ===
  while (gameTime < MAX_TIME) {
    // Idle production
    const idle = fpPerSecond * TICK;
    fp += idle;
    totalFp += idle;
    fpFromIdle += idle;

    // Clicks
    const clicks = cps * TICK;
    const clickFp = fpPerClick * clicks;
    fp += clickFp;
    totalFp += clickFp;
    totalClicks += clicks;
    fpFromClicks += clickFp;

    // Buy upgrades
    const complete = buyBest();

    // Era check
    const newEra = getEra();
    if (newEra > currentEra) {
      for (let e = currentEra + 1; e <= newEra; e++) {
        eraLog.push({
          era: e, name: eras[e].name, time: gameTime,
          fps: fpPerSecond, fpc: fpPerClick, totalFp,
        });
      }
      currentEra = newEra;
    }

    if (complete) break;

    gameTime += TICK;
  }

  return {
    gameTime, totalClicks: Math.floor(totalClicks), totalUpgradesBought,
    clickUpgradesBought: clickUpgrades.filter(u => u.purchased).length,
    fpPerSecond, fpPerClick, totalFp, fpFromClicks, fpFromIdle,
    eraLog, buyLog, upgrades, clickUpgrades,
  };
}

// ============================================================
// REPORT
// ============================================================

function printReport(cps, result) {
  const { gameTime, totalClicks, totalUpgradesBought, clickUpgradesBought,
    fpPerSecond, totalFp, fpFromClicks, fpFromIdle, eraLog, buyLog } = result;

  const w = 56;
  const hr = '═'.repeat(w);
  const ln = s => '║  ' + s.padEnd(w - 2) + '║';
  const sep = () => '╠' + hr + '╣';

  const lines = [];
  lines.push('╔' + hr + '╗');
  lines.push('║' + '  FÖRSVARSVILJA — PLAYTEST REPORT'.padEnd(w) + '║');
  lines.push(sep());
  lines.push(ln('Bot CPS:         ' + cps + ' clicks/sec'));
  lines.push(ln('Strategy:        Best FP/s per cost'));
  lines.push(ln('Events:          Disabled (deterministic)'));
  lines.push(ln('Tick rate:       100ms (matches game loop)'));
  lines.push(sep());
  lines.push(ln('RESULTS'));
  lines.push(ln('Game time:       ' + fmtTime(gameTime)));
  lines.push(ln('Total clicks:    ' + Math.floor(totalClicks).toLocaleString()));
  lines.push(ln('Upgrades bought: ' + totalUpgradesBought));
  lines.push(ln('Click upgrades:  ' + clickUpgradesBought + '/' + clickUpgradeData.length));
  lines.push(ln('Final FP/s:      ' + formatNumber(fpPerSecond)));
  lines.push(ln('Final FP/click:  ' + formatNumber(result.fpPerClick)));
  lines.push(ln('Total FP:        ' + formatNumber(totalFp)));
  const clickPct = (fpFromClicks + fpFromIdle) > 0
    ? (fpFromClicks / (fpFromClicks + fpFromIdle) * 100).toFixed(1) : '0.0';
  const idlePct = (fpFromClicks + fpFromIdle) > 0
    ? (fpFromIdle / (fpFromClicks + fpFromIdle) * 100).toFixed(1) : '0.0';
  lines.push(ln('FP from clicks:  ' + clickPct + '%'));
  lines.push(ln('FP from idle:    ' + idlePct + '%'));
  lines.push(sep());
  lines.push(ln('ERA PROGRESSION'));
  lines.push(ln('Era  Name                 Time     FP/s'));
  lines.push(ln('─'.repeat(w - 4)));
  for (const e of eraLog) {
    lines.push(ln(
      String(e.era + 1).padEnd(5) +
      e.name.padEnd(22) +
      fmtTime(e.time).padEnd(9) +
      formatNumber(e.fps)
    ));
  }
  lines.push(ln(
    '✓'.padEnd(5) +
    'COMPLETE'.padEnd(22) +
    fmtTime(gameTime).padEnd(9) +
    formatNumber(fpPerSecond)
  ));
  lines.push(sep());
  lines.push(ln('ERA DURATIONS'));
  for (let i = 1; i < eraLog.length; i++) {
    const dur = eraLog[i].time - eraLog[i - 1].time;
    lines.push(ln(
      'Era ' + (eraLog[i - 1].era + 1) + ' → ' + (eraLog[i].era + 1) + ':    ' +
      fmtTime(dur) + '  (' + dur.toFixed(0) + 's)'
    ));
  }
  const lastEra = eraLog[eraLog.length - 1];
  const lastDur = gameTime - lastEra.time;
  lines.push(ln('Era ' + (lastEra.era + 1) + ' → End:  ' + fmtTime(lastDur) + '  (' + lastDur.toFixed(0) + 's)'));

  lines.push('╚' + hr + '╝');
  console.log(lines.join('\n'));

  // Verbose: show buy log
  if (buyLog.length > 0) {
    console.log('\n── Upgrade Buy Log (' + buyLog.length + ' purchases) ──');
    for (const b of buyLog) {
      if (b.type === 'click') {
        console.log('  ' + fmtTime(b.time) + '  🖱  ' + b.name + ' (' + b.mult + ')');
      } else {
        console.log('  ' + fmtTime(b.time) + '  ⬆  ' + b.name + ' #' + b.count + '  (' + b.cost + ' FP)');
      }
    }
  }
}

// ============================================================
// MULTI-CPS COMPARISON
// ============================================================

function runComparison() {
  const cpsValues = [0, 1, 3, 5, 8];
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  FÖRSVARSVILJA — CPS COMPARISON                        ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  CPS   Game Time   Clicks    Click%  Idle%   FP/s end  ║');
  console.log('║  ────  ─────────   ──────    ──────  ─────   ────────  ║');

  for (const cps of cpsValues) {
    const r = simulate(cps, false);
    const clickPct = (r.fpFromClicks + r.fpFromIdle) > 0
      ? (r.fpFromClicks / (r.fpFromClicks + r.fpFromIdle) * 100).toFixed(1) : '0.0';
    const idlePct = (r.fpFromClicks + r.fpFromIdle) > 0
      ? (r.fpFromIdle / (r.fpFromClicks + r.fpFromIdle) * 100).toFixed(1) : '0.0';
    const row = '  ' +
      String(cps).padEnd(7) +
      fmtTime(r.gameTime).padEnd(12) +
      String(r.totalClicks.toLocaleString()).padEnd(10) +
      (clickPct + '%').padEnd(8) +
      (idlePct + '%').padEnd(8) +
      formatNumber(r.fpPerSecond);
    console.log('║' + row.padEnd(58) + '║');
  }
  console.log('╚══════════════════════════════════════════════════════════╝');

  // Era timing comparison
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  ERA TIMING BY CPS (minutes:seconds)                   ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  let header = '  CPS   ';
  for (let i = 0; i < eras.length; i++) header += ('Era ' + (i + 1)).padEnd(8);
  header += 'Total';
  console.log('║' + header.padEnd(58) + '║');
  console.log('║  ' + '─'.repeat(54) + '  ║');

  for (const cps of cpsValues) {
    const r = simulate(cps, false);
    let row = '  ' + String(cps).padEnd(8);
    for (let i = 0; i < eras.length; i++) {
      const entry = r.eraLog.find(e => e.era === i);
      row += (entry ? fmtTime(entry.time) : '—').padEnd(8);
    }
    row += fmtTime(r.gameTime);
    console.log('║' + row.padEnd(58) + '║');
  }
  console.log('╚══════════════════════════════════════════════════════════╝');
}

// ============================================================
// MAIN
// ============================================================

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const cpsArg = args.find(a => !a.startsWith('-'));
const cps = cpsArg !== undefined ? parseInt(cpsArg, 10) : 3;

if (isNaN(cps) || cps < 0) {
  console.error('Usage: node playtest.js [cps] [--verbose]');
  process.exit(1);
}

console.log('\n🤖 FÖRSVARSVILJA Playtest — simulating with ' + cps + ' CPS...\n');

const start = Date.now();
const result = simulate(cps, verbose);
const elapsed = Date.now() - start;

printReport(cps, result);
console.log('\n⏱  Simulation completed in ' + elapsed + 'ms\n');

// Always run the comparison table
runComparison();
