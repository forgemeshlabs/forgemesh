#!/usr/bin/env node
// Payment Rules Watch — tracks who is writing the rules for AI agent
// payments (Agentic Payments Alliance, Visa TAP, Mastercard Agent Pay,
// x402/MPP standards) and, above all, whether anyone proposes PRICING
// rules — floors, fee caps, minimums — the one class of rule that would
// touch micro-priced x402 services.
//
// Polls publisher RSS feeds (their own syndication feeds, linked with
// attribution), keyword-filters for agentic-payments coverage, classifies
// each hit (pricing / rules / news), writes data/rules-watch.json (full)
// and public/rules-watch.json (trimmed, drives /payment-rules + homepage).
//
// Usage: node scripts/rules-watch.js [--digest] [--dry]
//   (no flag)  collect: poll feeds, store new entries. Pricing-class hits
//              are ALSO posted to Discord immediately (that's the alarm).
//   --digest   weekly brief: post a summary of the last 7 days to the
//              fm-brief Discord channel — only if there was any action.
//   --dry      print instead of posting to Discord.
//
// Cron:  35 7 * * *    collect daily (offset from gov-refresh + rail-pulse)
//        5 14 * * 1    weekly digest, Mondays 14:05 UTC
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const STATE_FILE = path.join(DATA_DIR, "rules-watch.json");
const PUBLIC_FILE = path.join(__dirname, "..", "public", "rules-watch.json");
const PUBLIC_LIMIT = 60;
const UA = "Mozilla/5.0 (compatible; ForgeMesh-RulesWatch/1.0; +https://forgemesh.io/payment-rules)";

const KODIAK_URL = "http://127.0.0.1:3999/notify";
const BRIEF_CHANNEL = "1539595933132791858"; // fm-brief

const FEEDS = [
  { id: "paymentsdive", name: "Payments Dive", url: "https://www.paymentsdive.com/feeds/news/" },
  { id: "finextra", name: "Finextra", url: "https://www.finextra.com/rss/headlines.aspx" },
  { id: "stripe", name: "Stripe blog", url: "https://stripe.com/blog/feed.rss" },
  { id: "coindesk", name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
];

// An item is relevant if it hits a direct term, or an agent-word AND a payments-word.
const DIRECT = /x402|\bmpp\b|machine payments|trusted agent protocol|\bagent pay\b|agentic payments|agentic commerce|payments alliance|acp\b.*checkout|agent checkout/i;
const AGENT = /\bagentic\b|\bai agents?\b|autonomous agents?/i;
const PAY = /payment|commerce|checkout|transact|settle|stablecoin|interchange|wallet/i;

// The alarm class: anything that smells like pricing rules.
const PRICING = /pric(e|ing) (floor|rule|standard|minimum|cap)|minimum (fee|charge|price|transaction)|fee (cap|floor|schedule)|interchange (rule|change|cap)|surcharge rule|mandat(e|ory) (fee|pric)/i;
// Standards/governance class.
const RULES = /\brules?\b|standard|protocol|regulat|complian|framework|alliance|consortium|specification|governance|interoperab/i;

const strip = (s) =>
  String(s || "")
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function parseRss(xml) {
  const items = [];
  const chunks = xml.split(/<item[\s>]/i).slice(1);
  for (const c of chunks) {
    const grab = (tag) => {
      const m = c.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? strip(m[1]) : "";
    };
    const title = grab("title");
    let link = grab("link");
    if (!link) {
      const m = c.match(/<link[^>]*href="([^"]+)"/i);
      link = m ? m[1] : "";
    }
    const pub = grab("pubDate") || grab("dc:date") || grab("published");
    const desc = grab("description") || grab("summary") || "";
    if (title && link) items.push({ title, link, pub, desc });
  }
  return items;
}

function classify(text) {
  if (PRICING.test(text)) return "pricing";
  if (RULES.test(text)) return "rules";
  return "news";
}

function relevant(text) {
  return DIRECT.test(text) || (AGENT.test(text) && PAY.test(text));
}

const idFor = (link, title) => {
  let h = 0;
  const s = (link || title).toLowerCase().replace(/[?#].*$/, "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

async function fetchFeed(feed) {
  const res = await fetch(feed.url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(25_000) });
  if (!res.ok) throw new Error(`${feed.id} ${res.status}`);
  return parseRss(await res.text());
}

async function postDiscord(content, dry) {
  if (dry) { console.log("--- DRY DISCORD POST ---\n" + content + "\n---"); return; }
  const res = await fetch(KODIAK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ channelId: BRIEF_CHANNEL, content }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`kodiak ${res.status}`);
}

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); }
  catch { return { seen: [], entries: [], lastChecked: null, firstRun: true }; }
}

function writePublic(state) {
  const entries = state.entries.slice(0, PUBLIC_LIMIT);
  const counts = entries.reduce((a, e) => ((a[e.category] = (a[e.category] || 0) + 1), a), {});
  fs.writeFileSync(PUBLIC_FILE, JSON.stringify({
    lastChecked: state.lastChecked,
    pricingRulesDetected: state.entries.some((e) => e.category === "pricing"),
    counts,
    entries,
  }, null, 2));
}

async function collect(dry) {
  const state = loadState();
  const seen = new Set(state.seen);
  const isFirstRun = !!state.firstRun || state.entries.length === 0;
  const fresh = [];

  for (const feed of FEEDS) {
    let items;
    try { items = await fetchFeed(feed); }
    catch (e) { console.error(`feed failed (non-fatal): ${e.message}`); continue; }
    let hits = 0;
    for (const it of items) {
      const text = `${it.title} ${it.desc}`;
      if (!relevant(text)) continue;
      const id = idFor(it.link, it.title);
      if (seen.has(id)) continue;
      seen.add(id);
      hits++;
      const date = it.pub ? new Date(it.pub) : new Date();
      fresh.push({
        id,
        date: isNaN(date) ? new Date().toISOString() : date.toISOString(),
        source: feed.name,
        title: it.title.slice(0, 200),
        url: it.link,
        summary: it.desc.slice(0, 280),
        category: classify(text),
        collected: new Date().toISOString(),
      });
    }
    console.log(`${feed.id}: ${items.length} items, ${hits} new relevant`);
  }

  state.seen = [...seen].slice(-3000);
  state.lastChecked = new Date().toISOString();
  if (fresh.length) {
    fresh.sort((a, b) => b.date.localeCompare(a.date));
    state.entries = [...fresh, ...state.entries];
  }
  delete state.firstRun;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  writePublic(state);
  console.log(`${fresh.length} new entries (${state.entries.length} total)`);

  // pricing-class hits are the alarm — post immediately, even between digests
  if (!isFirstRun) {
    for (const e of fresh.filter((x) => x.category === "pricing")) {
      try {
        await postDiscord(`🚨 **Payment Rules Watch: possible PRICING rule** — ${e.title}\n${e.url}\nTracked at https://forgemesh.io/payment-rules`, dry);
      } catch (err) { console.error(`notify failed: ${err.message}`); }
    }
  }
}

async function digest(dry) {
  const state = loadState();
  const weekAgo = Date.now() - 7 * 86_400_000;
  const recent = state.entries.filter((e) => new Date(e.collected).getTime() >= weekAgo);
  if (!recent.length) { console.log("no action this week — no digest posted"); return; }

  const pricing = recent.filter((e) => e.category === "pricing");
  const rules = recent.filter((e) => e.category === "rules");
  const news = recent.filter((e) => e.category === "news");
  const line = (e) => `→ ${e.title} (${e.source})\n   ${e.url}`;
  const parts = [
    `📜 **Payment Rules Watch — weekly digest** (${recent.length} item${recent.length === 1 ? "" : "s"})`,
    pricing.length
      ? `🚨 **Pricing-rule signals (${pricing.length}):**\n${pricing.slice(0, 3).map(line).join("\n")}`
      : `✅ No pricing rules proposed anywhere we watch. Micro-pricing stays ours.`,
    rules.length ? `**Standards & governance (${rules.length}):**\n${rules.slice(0, 4).map(line).join("\n")}` : "",
    news.length ? `**Also seen (${news.length}):**\n${news.slice(0, 3).map(line).join("\n")}` : "",
    `Full timeline: https://forgemesh.io/payment-rules`,
  ].filter(Boolean);
  await postDiscord(parts.join("\n\n").slice(0, 1900), dry);
  console.log(`digest posted: ${recent.length} items (${pricing.length} pricing)`);
}

const args = new Set(process.argv.slice(2));
(args.has("--digest") ? digest(args.has("--dry")) : collect(args.has("--dry"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
