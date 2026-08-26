#!/usr/bin/env node
// Rail Pulse — MPP + x402 transaction/volume snapshot (4 runs/day).
// Moved here from x402-swag/shop 2026-08-26: forgemesh parts live in the
// forgemesh repo; state in site/data/, output in site/public/.
// Scrapes mppscan.com's SSR payload, appends one point/day to
// data/rail-stats.json, and writes a trimmed public copy for the forgemesh.io
// homepage strip at ../../forgemesh/site/public/rail-pulse.json.
//
// Usage: node scripts/rail-pulse.js
// Cron:  45 12 * * * (see crontab) — daily, no site rebuild needed since
// public/*.json is served from disk by `next start`.
const fs = require("fs");
const path = require("path");
const https = require("https");
const { execFileSync } = require("child_process");

const BAZAAR_DB = "/home/ubuntu/repos/x402-forgemesh-stuffer/var/bazaar.db";
const SQLITE3_BIN = "/home/linuxbrew/.linuxbrew/bin/sqlite3";

const DATA_DIR = path.join(__dirname, "..", "data");
const STATS_FILE = path.join(DATA_DIR, "rail-stats.json");
const PUBLIC_FILE = path.join(__dirname, "..", "public", "rail-pulse.json");
const HISTORY_LIMIT = 360; // ~90 days at 4 collector runs/day
const UA = "Mozilla/5.0 (compatible; ForgeMesh-RailPulse/1.0; +https://forgemesh.io)";

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchText(res.headers.location).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`${url} -> HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve(body));
    }).on("error", reject);
  });
}

async function fetchMppStats() {
  const html = await fetchText("https://mppscan.com");
  const txMatch = /totalTransactions\\":([0-9.]+)/.exec(html);
  const volMatch = /totalVolume\\":([0-9.]+)/.exec(html);
  if (!txMatch || !volMatch) {
    throw new Error("mppscan.com: could not find totalTransactions/totalVolume in SSR payload");
  }
  return { mppTx: Number(txMatch[1]), mppVol: Number(volMatch[1]) };
}

// x402scan.com is fully client-rendered (redirects to www., no __NEXT_DATA__,
// no discoverable /api/*stats route as of 2026-08-19). No reliable x402
// transaction-count source found. Leave x402Tx: null — wire up if/when
// x402scan (or another indexer) exposes one.
async function fetchX402Tx() {
  return null;
}

// x402scan.com started server-rendering its stats (found 2026-08-26): the SSR
// payload carries cumulative all-time totals plus a 30-day chart of ~15h
// buckets with total_transactions and total_amount (USDC atomic units, 1e6).
// The trailing bucket is the still-filling current window — dropped so the
// 30d sums don't wobble intra-day. Soft-fails to null.
async function fetchX402Scan() {
  try {
    const html = await fetchText("https://www.x402scan.com");
    const overall =
      /\{\\"total_transactions\\":(\d+),\\"total_amount\\":(\d+),\\"unique_buyers\\":(\d+),\\"unique_sellers\\":(\d+),\\"latest_block_timestamp\\"/.exec(html);
    const buckets = [];
    const re = /\{\\"bucket_start\\":\\"([^"\\]+)\\",\\"total_transactions\\":(\d+),\\"total_amount\\":(\d+)/g;
    let m;
    while ((m = re.exec(html))) {
      buckets.push({ at: m[1], tx: Number(m[2]), vol: Number(m[3]) / 1e6 });
    }
    if (!buckets.length && !overall) return null;
    const complete = buckets.length > 1 ? buckets.slice(0, -1) : buckets;
    return {
      cumTx: overall ? Number(overall[1]) : null,
      cumVol: overall ? Number(overall[2]) / 1e6 : null,
      tx30d: complete.reduce((s, b) => s + b.tx, 0) || null,
      vol30d: complete.reduce((s, b) => s + b.vol, 0) || null,
      txSpark: complete.map((b) => b.tx),
      volSpark: complete.map((b) => Math.round(b.vol)),
    };
  } catch (e) {
    console.error("rail-pulse: x402scan fetch failed:", e.message);
    return null;
  }
}

// x402 Bazaar catalog size — read from the fleet's own bazaar-collector
// snapshot db (x402-forgemesh-stuffer, cron 3x/day). Ecosystem-wide listing
// count, not a transaction figure; soft-fails to null if the collector db
// or sqlite3 binary is unavailable.
function fetchX402Listings() {
  try {
    const out = execFileSync(
      SQLITE3_BIN,
      [BAZAAR_DB, "SELECT total_listed FROM snapshots ORDER BY id DESC LIMIT 1;"],
      { encoding: "utf8", timeout: 5000 }
    ).trim();
    const n = Number(out);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch (e) {
    console.error("rail-pulse: x402 listings read failed:", e.message);
    return null;
  }
}

// Base-vs-Solana split of LIVE catalog listings (same collector db). The
// Solana-flips-Base news cycle (2026-08-25) made this the number to watch:
// tx counts flip on throughput, but catalog share is where builders deploy.
function fetchNetworkSplit() {
  try {
    const out = execFileSync(
      SQLITE3_BIN,
      [BAZAAR_DB,
        "SELECT SUM(CASE WHEN network LIKE 'eip155:8453' OR network='base' THEN 1 ELSE 0 END)," +
        " SUM(CASE WHEN network LIKE 'solana:%' OR network='solana' THEN 1 ELSE 0 END)" +
        " FROM resources WHERE last_seen_snapshot=(SELECT MAX(id) FROM snapshots);"],
      { encoding: "utf8", timeout: 5000 }
    ).trim();
    const [base, solana] = out.split("|").map(Number);
    if (!Number.isFinite(base) || !Number.isFinite(solana)) return null;
    return { base, solana };
  } catch (e) {
    console.error("rail-pulse: network split read failed:", e.message);
    return null;
  }
}

function loadJson(f, fallback) {
  try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return fallback; }
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function pctDelta(curr, prev) {
  if (prev === null || prev === undefined || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

function fmtPct(p) {
  if (p === null) return null;
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
}

function buildAnalysisParts(txDelta, volDelta, x402Listings, x402ListingsDeltaPct, x402scan, x402TxDeltaPct) {
  const parts = [];
  if (txDelta === null) {
    parts.push("MPP transactions: first snapshot, no prior day to compare");
  } else {
    const txWord = Math.abs(txDelta) < 0.5 ? "roughly flat" : `${fmtPct(txDelta)} day-over-day`;
    parts.push(`MPP transactions ${txWord}`);
  }
  if (volDelta !== null) {
    const volWord = Math.abs(volDelta) < 0.5 ? "MPP volume roughly flat" : `MPP volume ${fmtPct(volDelta)}`;
    parts.push(volWord);
  }
  if (x402scan && x402scan.tx30d !== null) {
    const deltaSuffix = x402TxDeltaPct === null ? "" : ` (${fmtPct(x402TxDeltaPct)} d/d)`;
    parts.push(
      `x402 rail settled ${x402scan.tx30d.toLocaleString("en-US")} tx over the last 30 days${deltaSuffix}`
    );
  }
  if (x402Listings !== null) {
    const deltaSuffix = x402ListingsDeltaPct === null ? "" : ` (${fmtPct(x402ListingsDeltaPct)} d/d)`;
    parts.push(`x402 catalog at ${x402Listings.toLocaleString("en-US")} listings${deltaSuffix}`);
  }
  return parts;
}

async function main() {
  const mpp = await fetchMppStats();
  const x402Tx = await fetchX402Tx();
  const x402scan = await fetchX402Scan();
  const x402Listings = fetchX402Listings();
  const networkSplit = fetchNetworkSplit();
  const date = todayUTC();
  const at = new Date().toISOString();

  const stats = loadJson(STATS_FILE, []);
  // Per-run points (since 2026-08-26, cron 4x/day): every run APPENDS, so an
  // intraday spike caught at 12:45 keeps the 06:45 point next to it on the
  // graph instead of overwriting it. Delta chips stay day-over-day: they
  // compare against yesterday's FINAL point, not the previous run.
  const prevDayPoints = stats.filter((p) => p.date < date);
  const prevPoint = prevDayPoints.length ? prevDayPoints[prevDayPoints.length - 1] : null;

  const point = {
    date, at, mppTx: mpp.mppTx, mppVol: mpp.mppVol, x402Tx, x402Listings,
    x402Tx30d: x402scan ? x402scan.tx30d : null,
    x402Vol30d: x402scan ? x402scan.vol30d : null,
    x402CumTx: x402scan ? x402scan.cumTx : null,
    x402CumVol: x402scan ? x402scan.cumVol : null,
  };
  stats.push(point);
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));

  const mppTxDeltaPct = prevPoint ? pctDelta(point.mppTx, prevPoint.mppTx) : null;
  const mppVolDeltaPct = prevPoint ? pctDelta(point.mppVol, prevPoint.mppVol) : null;
  const x402ListingsDeltaPct = (prevPoint && prevPoint.x402Listings != null && point.x402Listings != null)
    ? pctDelta(point.x402Listings, prevPoint.x402Listings)
    : null;
  const x402TxDeltaPct = (prevPoint && prevPoint.x402Tx30d != null && point.x402Tx30d != null)
    ? pctDelta(point.x402Tx30d, prevPoint.x402Tx30d)
    : null;
  const x402VolDeltaPct = (prevPoint && prevPoint.x402Vol30d != null && point.x402Vol30d != null)
    ? pctDelta(point.x402Vol30d, prevPoint.x402Vol30d)
    : null;
  const analysisParts = buildAnalysisParts(
    mppTxDeltaPct, mppVolDeltaPct, x402Listings, x402ListingsDeltaPct, x402scan, x402TxDeltaPct
  );
  const analysis = analysisParts.join("; ") + ". Self-reported dashboard data.";

  const history = stats.slice(-HISTORY_LIMIT);
  const publicPayload = {
    updatedAt: at,
    latest: {
      date,
      mppTx: point.mppTx,
      mppVol: point.mppVol,
      mppTxDeltaPct,
      mppVolDeltaPct,
      x402Tx,
      x402Listings,
      x402ListingsDeltaPct,
      // x402 rail financials — 30d rolling window from x402scan's chart buckets.
      x402Tx30d: point.x402Tx30d,
      x402Vol30d: point.x402Vol30d,
      x402TxDeltaPct,
      x402VolDeltaPct,
      // Per-bucket (~15h) activity over the same 30d window, for sparklines.
      x402TxSpark: x402scan ? x402scan.txSpark : null,
      x402VolSpark: x402scan ? x402scan.volSpark : null,
      // Base (USDC) vs Solana share of live catalog listings.
      baseListings: networkSplit ? networkSplit.base : null,
      solanaListings: networkSplit ? networkSplit.solana : null,
      analysis,
      analysisParts,
      sourceNote: "Self-reported dashboard and indexer data.",
    },
    history,
  };
  fs.mkdirSync(path.dirname(PUBLIC_FILE), { recursive: true });
  fs.writeFileSync(PUBLIC_FILE, JSON.stringify(publicPayload, null, 2));

  console.log(`rail-pulse: ${date} mppTx=${point.mppTx} mppVol=${point.mppVol.toFixed(2)} x402Tx30d=${point.x402Tx30d} x402Vol30d=${point.x402Vol30d === null ? null : point.x402Vol30d.toFixed(0)} x402Listings=${x402Listings} — ${analysis}`);
}

main().catch((e) => {
  console.error("rail-pulse error:", e.message);
  process.exit(1);
});
