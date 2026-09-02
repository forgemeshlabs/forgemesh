#!/usr/bin/env node
// Congress Trades — retail-facing tracker feed for forgemesh.io/trades.
// Reads the stuffer's parsed House PTR dataset (refreshed daily 07:40 UTC by
// x402-forgemesh-stuffer/scripts/gov-refresh.js) and writes a trimmed public
// JSON for the /trades page. Served from disk by `next start` — no rebuild.
//
// Usage: node scripts/congress-trades.js
// Cron:  10 8 * * * (daily, after gov-refresh)
const fs = require("fs");
const path = require("path");

const SOURCE = "/home/ubuntu/repos/x402-forgemesh-stuffer/var/congress-trades.json";
const PUBLIC_FILE = path.join(__dirname, "..", "public", "congress-trades.json");

const LATEST_LIMIT = 300;
const TOP_LIMIT = 12;
const BIGGEST_LIMIT = 10;

function parseFilingDate(s) {
  // "2/9/2026" (M/D/YYYY)
  if (!s) return null;
  const m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  return new Date(Date.UTC(+m[3], +m[1] - 1, +m[2]));
}

function amountBounds(range) {
  // "$1,001 - $15,000" -> [1001, 15000]
  if (!range) return [0, 0];
  const nums = String(range).replace(/,/g, "").match(/\d+/g);
  if (!nums || nums.length === 0) return [0, 0];
  const min = +nums[0];
  const max = nums.length > 1 ? +nums[1] : min;
  return [min, max];
}

function isoDay(d) {
  return d.toISOString().slice(0, 10);
}

function main() {
  const raw = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const trades = (raw.trades || []).filter((t) => t.member && t.filing_date);
  const now = new Date();
  const daysAgo = (n) => new Date(now.getTime() - n * 864e5);

  const enriched = trades
    .map((t) => {
      const fd = parseFilingDate(t.filing_date);
      const [amtMin, amtMax] = amountBounds(t.amount_range);
      return { ...t, _fd: fd, _mid: (amtMin + amtMax) / 2, _max: amtMax };
    })
    .filter((t) => t._fd)
    .sort((a, b) => b._fd - a._fd);

  const within = (t, since) => t._fd >= since;
  const d30 = daysAgo(30);
  const d60 = daysAgo(60);
  const d90 = daysAgo(90);

  const last30 = enriched.filter((t) => within(t, d30));
  const buys30 = last30.filter((t) => t.type === "purchase").length;
  const sells30 = last30.filter((t) => t.type && t.type.startsWith("sale")).length;

  // Top members by 90d activity, with estimated mid-range dollar volume.
  const byMember = new Map();
  for (const t of enriched.filter((x) => within(x, d90))) {
    const cur = byMember.get(t.member) || {
      member: t.member,
      stateDistrict: t.state_district || null,
      trades: 0,
      estVolume: 0,
      buys: 0,
      sells: 0,
    };
    cur.trades += 1;
    cur.estVolume += t._mid;
    if (t.type === "purchase") cur.buys += 1;
    else if (t.type && t.type.startsWith("sale")) cur.sells += 1;
    byMember.set(t.member, cur);
  }
  const topMembers = [...byMember.values()]
    .sort((a, b) => b.trades - a.trades)
    .slice(0, TOP_LIMIT)
    .map((m) => ({ ...m, estVolume: Math.round(m.estVolume) }));

  // Top tickers over 30d.
  const byTicker = new Map();
  for (const t of last30) {
    if (!t.ticker) continue;
    const cur = byTicker.get(t.ticker) || { ticker: t.ticker, trades: 0, buys: 0, sells: 0 };
    cur.trades += 1;
    if (t.type === "purchase") cur.buys += 1;
    else if (t.type && t.type.startsWith("sale")) cur.sells += 1;
    byTicker.set(t.ticker, cur);
  }
  const topTickers = [...byTicker.values()]
    .sort((a, b) => b.trades - a.trades)
    .slice(0, TOP_LIMIT);

  // Biggest disclosed trades in the last 60 days by range ceiling.
  const biggest = enriched
    .filter((t) => within(t, d60))
    .sort((a, b) => b._max - a._max)
    .slice(0, BIGGEST_LIMIT)
    .map(trim);

  function trim(t) {
    return {
      member: t.member,
      stateDistrict: t.state_district || null,
      ticker: t.ticker || null,
      asset: t.asset || null,
      type: t.type,
      amountRange: t.amount_range || null,
      transactionDate: t.transaction_date || null,
      filingDate: isoDay(t._fd),
      docId: t.doc_id || null,
    };
  }

  const out = {
    generated: now.toISOString(),
    sourceGenerated: raw.generated || null,
    coverage: raw.coverage || null,
    stats: {
      totalTrades: enriched.length,
      members: new Set(enriched.map((t) => t.member)).size,
      latestFilingDate: enriched.length ? isoDay(enriched[0]._fd) : null,
      trades30d: last30.length,
      buys30d: buys30,
      sells30d: sells30,
    },
    topMembers,
    topTickers,
    biggest,
    latest: enriched.slice(0, LATEST_LIMIT).map(trim),
  };

  fs.writeFileSync(PUBLIC_FILE, JSON.stringify(out));
  console.log(
    `congress-trades: wrote ${out.latest.length} latest / ${out.stats.totalTrades} total trades, latest filing ${out.stats.latestFilingDate}`
  );
}

main();
