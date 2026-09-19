#!/usr/bin/env node
// Date Scan — the lookout for FUTURE dates the calendar doesn't know yet.
//
// Every other watcher (brief-radar, rules-watch, repo-watch) fires on
// "something moved". This one asks the opposite question of the same
// streams: "does this name a day that hasn't happened yet?" — comment
// deadlines, effective dates, FOMC meetings, exemption expiries, launch
// dates, conference agendas — and proposes calendar.json entries for them.
// Nothing lands on the live calendar without a 👍: proposals queue in
// data/calendar-proposed.json, get posted to #fm-brief, and
// date-approval-poller.js promotes what the operator approves.
//
// Sources (all keyless):
//   1. Federal Register API — structured comments_close_on / effective_on for
//      crypto / stablecoin / tokenization / digital-asset / AI docs (no LLM).
//   2. FOMC calendar page — meeting dates for this year and next (no LLM).
//   3. Feeds → LLM pass (OpenRouter free-first chain, same as factory-editor):
//      SEC press releases, CFTC press releases, Cloudflare blog, Stripe blog,
//      rules-watch entries (last 14 d), Hacker News (x402 / MPP / agent
//      payments / stablecoin). The model returns only explicit future dates
//      with a why-it-matters for the machine economy; vague ones are dropped.
//
// Dedup: against calendar.json (same date ± 1 day + title-token overlap) and
// against the `seen` map (source item ids, 30-day TTL) so a document is
// evaluated once. Every proposal keeps `source` + `link` so the operator can
// verify before approving.
//
// Usage:
//   node scripts/date-scan.js            # scan, queue new proposals, post to #fm-brief
//   node scripts/date-scan.js --dry      # scan + print, no queue write, no Discord
//   node scripts/date-scan.js --promote  # move approved-but-unpromoted items into calendar.json
//   node scripts/date-scan.js --add 1,3 | --skip 2 | --all   # CLI approvals (same as Discord)
// Cron: 55 7 * * *  (after rules-watch 07:35, before the 12:00 status pass)
const fs = require("fs");
const os = require("os");
const path = require("path");

const SITE = path.join(__dirname, "..");
const DATA_DIR = path.join(SITE, "data");
const QUEUE_FILE = path.join(DATA_DIR, "calendar-proposed.json");
const CALENDAR_FILE = path.join(SITE, "public", "calendar.json");
const RULES_WATCH = path.join(DATA_DIR, "rules-watch.json");
const BRIEF_CHANNEL = "1539595933132791858"; // #fm-brief
const UA = "ForgeMesh date-scan (hello@forgemesh.io)";
const SEEN_TTL_MS = 30 * 864e5;
const LOOKBACK_DAYS = 14;
const MAX_LLM_ITEMS = 40;
const HORIZON_DAYS = 730; // ignore dates further out than ~2 years
const FOMC_HORIZON_DAYS = 120; // the Fed publishes a year ahead; propose one meeting at a time-ish

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const TODAY = new Date().toISOString().slice(0, 10);

// Free-first chain, same shape factory-editor / the Etsy routing table use.
const MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct",
];

// Relevance gate for structured sources (FR) and the LLM candidate pool.
const RELEVANT = /stablecoin|digital[- ]asset|crypto|tokeni[sz]|blockchain|distributed ledger|bitcoin|payment|x402|mpp|agentic|ai agent|artificial intelligence|crawler|data center|datacenter|ercot|grid|money transmi|virtual currenc|decentrali[sz]ed finance|defi/i;

const TAGS = ["rails", "policy", "grid", "conference", "markets", "infrastructure", "grants"];

// ---------- helpers ----------
function loadJson(f, fallback) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return fallback; } }
function saveJson(f, v) { fs.writeFileSync(f, JSON.stringify(v, null, 2) + "\n"); }
function daysOut(d) { return Math.round((new Date(d + "T00:00:00Z") - new Date(TODAY + "T00:00:00Z")) / 864e5); }
function isFuture(d) { const n = daysOut(d); return n > 0 && n <= HORIZON_DAYS; }
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
function tokens(s) { return new Set(String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w.length > 3)); }
function overlap(a, b) { const A = tokens(a), B = tokens(b); let n = 0; for (const t of A) if (B.has(t)) n++; return n / Math.max(1, Math.min(A.size, B.size)); }
function stripHtml(s) { return String(s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/&nbsp;/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim(); }

async function get(url, opts = {}) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: opts.accept || "*/*" }, signal: AbortSignal.timeout(opts.timeout || 20000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return opts.json ? res.json() : res.text();
}

function openrouterKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  try {
    const rc = fs.readFileSync(path.join(os.homedir(), ".bashrc"), "utf8");
    const m = rc.match(/export OPENROUTER_API_KEY=["']?([^"'\n]+)/);
    if (m) return m[1];
  } catch {}
  return null;
}

// Walks the model chain until one returns a reply `validate` accepts.
async function llm(key, messages, validate) {
  for (const model of MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, max_tokens: 4000, temperature: 0.2 }),
        signal: AbortSignal.timeout(120000),
      });
      const data = await res.json().catch(() => null);
      const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!res.ok || !text) { console.log(`  [llm] ${model} -> ${res.status}${data && data.error ? " " + data.error.message : ""}`); continue; }
      const value = validate(text);
      if (value !== null) return { model, value };
      console.log(`  [llm] ${model} replied unparseable: ${String(text).slice(0, 160).replace(/\n/g, " ")}`);
    } catch (e) { console.log(`  [llm] ${model} failed: ${e.message}`); }
  }
  return null;
}

function parseJsonBlock(text) {
  const m = String(text).replace(/```(?:json)?/g, "").match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

function notifyBrief(content) {
  return new Promise((resolve) => {
    const http = require("http");
    const body = JSON.stringify({ channelId: BRIEF_CHANNEL, content });
    const req = http.request({
      hostname: process.env.KODIAK_NOTIFY_HOST || "127.0.0.1",
      port: Number(process.env.KODIAK_NOTIFY_PORT || 3999),
      path: "/notify", method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      timeout: 5000,
    });
    req.on("response", (r) => { r.resume(); r.on("end", () => resolve(r.statusCode)); });
    req.on("error", (e) => { console.error("[date-scan] discord failed:", e.message); resolve(0); });
    req.on("timeout", () => { req.destroy(); resolve(0); });
    req.end(body);
  });
}

// ---------- source 1: Federal Register (structured, no LLM) ----------
async function sourceFederalRegister(out) {
  const since = new Date(Date.now() - LOOKBACK_DAYS * 864e5).toISOString().slice(0, 10);
  const terms = ["stablecoin", '"digital asset"', '"crypto asset"', "tokenized", '"payment stablecoin"', '"artificial intelligence"'];
  const fields = ["title", "type", "abstract", "publication_date", "comments_close_on", "effective_on", "html_url", "document_number", "agency_names"];
  const seenDoc = new Set();
  for (const term of terms) {
    const q = new URLSearchParams({ per_page: "20", order: "newest", "conditions[term]": term, "conditions[publication_date][gte]": since });
    for (const f of fields) q.append("fields[]", f);
    let data;
    try { data = await get(`https://www.federalregister.gov/api/v1/documents.json?${q}`, { json: true }); }
    catch (e) { console.log(`  [fr] ${term}: ${e.message}`); continue; }
    for (const r of data.results || []) {
      if (seenDoc.has(r.document_number)) continue;
      seenDoc.add(r.document_number);
      const text = `${r.title} ${r.abstract || ""}`;
      if (!RELEVANT.test(text)) continue;
      // Skip the SRO fee-schedule / routine notice noise unless it names a crypto term outright.
      if (/^Self-Regulatory Organizations/i.test(r.title) && !/crypto|bitcoin|ether|digital asset|tokeni|stablecoin/i.test(text)) continue;
      const agency = (r.agency_names || [])[0] || "Federal Register";
      const kinds = [["comments_close_on", "comment period closes", "policy"], ["effective_on", "takes effect", "policy"]];
      for (const [field, verb, tag] of kinds) {
        const d = r[field];
        if (!d || !isFuture(d)) continue;
        out.push({
          id: `fr:${r.document_number}:${field}`,
          date: d, tag,
          title: `${agency}: ${r.title.length > 90 ? r.title.slice(0, 87) + "…" : r.title} — ${verb}`,
          what: `${r.type || "Document"} ${r.document_number}, published ${r.publication_date}. ${stripHtml(r.abstract || "").slice(0, 400)}`,
          why: field === "comments_close_on"
            ? "Comment dockets are the last cheap moment to shape a rule before it hardens — and the earliest signal of who is lobbying whom."
            : "An effective date is when the rulebook actually changes for anyone settling, custodying, or pricing on these rails.",
          link: r.html_url, source: "Federal Register", confidence: 0.95,
        });
      }
    }
  }
}

// ---------- source 2: FOMC calendar (structured, no LLM) ----------
async function sourceFomc(out) {
  let html;
  try { html = await get("https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"); } catch (e) { console.log(`  [fomc] ${e.message}`); return; }
  const text = stripHtml(html);
  const MONTHS = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
  const re = /(\d{4}) FOMC Meetings([\s\S]*?)(?=\d{4} FOMC Meetings|\* Meeting associated|Back to Top|$)/g;
  let m;
  while ((m = re.exec(text))) {
    const year = Number(m[1]);
    const body = m[2];
    const mre = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:-(\d{1,2}))?(\*)?/g;
    let mm;
    while ((mm = mre.exec(body))) {
      const mo = MONTHS[mm[1].toLowerCase()];
      const d1 = Number(mm[2]), d2 = mm[3] ? Number(mm[3]) : Number(mm[2]);
      const start = `${year}-${String(mo).padStart(2, "0")}-${String(d1).padStart(2, "0")}`;
      const end = `${year}-${String(mo).padStart(2, "0")}-${String(d2).padStart(2, "0")}`;
      if (!isFuture(end) || daysOut(end) > FOMC_HORIZON_DAYS) continue;
      const sep = Boolean(mm[4]);
      out.push({
        id: `fomc:${end}`,
        date: end, endDate: undefined, tag: "markets", track: true,
        title: `Fed interest-rate decision (FOMC ${mm[1]} meeting)`,
        time: `Meeting ${mm[1]} ${d1}${d2 !== d1 ? "–" + d2 : ""} · decision 2:00 PM ET · press conference 2:30 PM ET`,
        what: `Two-day FOMC meeting${sep ? " with a Summary of Economic Projections (dot plot)" : ""}; the statement lands on the second day at 2:00 PM ET.`,
        why: "Dollar rates set the price of the stablecoin float that every agent payment settles in.",
        link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm", source: "Federal Reserve", confidence: 0.98,
      });
    }
  }
}

// ---------- source 3: feeds → LLM ----------
function parseRss(xml, sourceName) {
  const items = [];
  for (const it of xml.match(/<item>[\s\S]*?<\/item>/g) || []) {
    const pick = (tag) => { const m = it.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)); return m ? stripHtml(m[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : ""; };
    const link = pick("link") || (it.match(/<guid[^>]*>([^<]+)</) || [])[1] || "";
    const pub = pick("pubDate");
    const when = pub ? new Date(pub) : null;
    items.push({ id: `rss:${link}`, source: sourceName, title: pick("title"), text: pick("description").slice(0, 600), link, at: when && !isNaN(when) ? when.toISOString() : null });
  }
  // Atom fallback
  if (!items.length) for (const it of xml.match(/<entry>[\s\S]*?<\/entry>/g) || []) {
    const pick = (tag) => { const m = it.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)); return m ? stripHtml(m[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : ""; };
    const link = (it.match(/<link[^>]*href="([^"]+)"/) || [])[1] || "";
    const pub = pick("published") || pick("updated");
    items.push({ id: `rss:${link}`, source: sourceName, title: pick("title"), text: (pick("summary") || pick("content")).slice(0, 600), link, at: pub || null });
  }
  return items;
}

async function sourceFeeds() {
  const feeds = [
    ["SEC press releases", "https://www.sec.gov/news/pressreleases.rss", true],
    ["CFTC press releases", "https://www.cftc.gov/RSS/RSSGP/rssgp.xml", true],
    ["Cloudflare blog", "https://blog.cloudflare.com/rss/", false],
    ["Stripe blog", "https://stripe.com/blog/feed.rss", false],
  ];
  const cutoff = Date.now() - LOOKBACK_DAYS * 864e5;
  const items = [];
  for (const [name, url, fetchBody] of feeds) {
    try {
      const xml = await get(url, { accept: "application/rss+xml, application/xml, text/xml, */*" });
      const parsed = parseRss(xml, name).filter((i) => i.link && (!i.at || new Date(i.at).getTime() >= cutoff));
      for (const i of parsed) i.fetchBody = fetchBody;
      items.push(...parsed);
      console.log(`  [feed] ${name}: ${parsed.length} recent`);
    } catch (e) { console.log(`  [feed] ${name}: ${e.message}`); }
  }
  // rules-watch entries (already keyword-filtered for agent-payment rules)
  const rw = loadJson(RULES_WATCH, { entries: [] });
  const rwItems = (rw.entries || []).filter((e) => new Date(e.collected || e.date).getTime() >= cutoff)
    .map((e) => ({ id: `rw:${e.id}`, source: `rules-watch/${e.source}`, title: e.title, text: (e.summary || "").slice(0, 600), link: e.url, at: e.date }));
  console.log(`  [feed] rules-watch: ${rwItems.length} recent`);
  items.push(...rwItems);
  // Hacker News — launch/announce posts often carry dates in the title
  // (Algolia has no OR; one cheap query per term).
  const hnSeen = new Set();
  for (const term of ["x402", "agent payments", "stablecoin", "tokenized stock"]) {
    try {
      const q = new URLSearchParams({ query: term, tags: "story", hitsPerPage: "15", numericFilters: `created_at_i>${Math.floor(cutoff / 1000)}` });
      const hn = await get(`https://hn.algolia.com/api/v1/search_by_date?${q}`, { json: true });
      for (const h of hn.hits || []) {
        if (!h.url || hnSeen.has(h.objectID) || !RELEVANT.test(h.title)) continue;
        hnSeen.add(h.objectID);
        items.push({ id: `hn:${h.objectID}`, source: "Hacker News", title: h.title, text: "", link: h.url, at: h.created_at });
      }
    } catch (e) { console.log(`  [feed] hacker news (${term}): ${e.message}`); }
  }
  console.log(`  [feed] hacker news: ${hnSeen.size} recent`);
  // Domain gate before any page fetch or model call: an item whose title+teaser
  // never mentions the machine economy can't yield a date we'd put on the calendar.
  const gated = items.filter((i) => RELEVANT.test(`${i.title} ${i.text}`));
  console.log(`  [feed] ${items.length} items, ${gated.length} pass the domain gate`);
  return gated;
}

async function enrich(item) {
  // SEC/CFTC press releases carry the dates in the body, not the teaser.
  if (!item.fetchBody) return item;
  try {
    const html = await get(item.link, { timeout: 15000 });
    const text = stripHtml(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>/gi, " "));
    // Keep the sentences that mention a date or a deadline; cap the payload.
    const sents = text.split(/(?<=[.!?])\s+/).filter((s) => /\b(20\d\d|deadline|comment|effective|expire|until|by [A-Z][a-z]+ \d|days after)\b/i.test(s));
    item.text = (item.text + " " + sents.join(" ")).slice(0, 2500);
  } catch (e) { console.log(`  [enrich] ${item.link}: ${e.message}`); }
  return item;
}

async function extractDates(items) {
  const key = openrouterKey();
  if (!key) { console.log("  [llm] no OPENROUTER_API_KEY — feed pass skipped"); return []; }
  if (!items.length) return [];
  const list = items.map((it, i) => `[${i}] (${it.source}, ${it.at ? it.at.slice(0, 10) : "undated"}) ${it.title}\n${it.text}`.trim()).join("\n\n");
  const system = `You extract FUTURE calendar dates from news for a data lab that tracks the machine economy: AI-agent payments (x402, MPP, stablecoins), US crypto/securities/commodities policy (SEC, CFTC, Treasury, Congress), payment rails (Stripe, Visa, Mastercard, Coinbase), Bitcoin market clocks, AI-crawler/web-access policy (Cloudflare), and data-center/grid decisions (ERCOT). Today is ${TODAY}.
Rules: only dates AFTER today that the text states explicitly or that follow from an explicit rule (e.g. "comments due 60 days after publication on 2026-09-17" => 2026-11-16). Never invent or guess a date. Ignore past dates and vague timing ("later this year"). One entry per distinct date+event. Prefer the primary event over restatements.
Relevance is strict: the event itself must touch crypto/digital assets/stablecoins/tokenization, agent or machine payments, payment rails, AI crawlers or web access, Bitcoin, or data-center power. A regulator's unrelated docket (proxy rules, whistleblower awards, agricultural conferences, accounting standards) is NOT relevant even though the regulator is — skip it. When in doubt, skip.
Return ONLY JSON: {"dates":[{"i":<item index>,"date":"YYYY-MM-DD","endDate":"YYYY-MM-DD or null","title":"<= 90 chars, concrete","tag":"one of ${TAGS.join("|")}","what":"1-2 sentences: what happens that day, with the numbers named in the source","why":"1 sentence: why it matters for agent money / rails / policy — plain, no hype","confidence":0.0-1.0}]}`;
  const res = await llm(key, [{ role: "system", content: system }, { role: "user", content: list }], (text) => {
    const j = parseJsonBlock(text);
    return j && Array.isArray(j.dates) ? j.dates : null;
  });
  if (!res) { console.log("  [llm] every model failed — feed pass skipped"); return []; }
  console.log(`  [llm] ${res.value.length} date(s) from ${res.model}`);
  const out = [];
  for (const d of res.value) {
    const src = items[Number(d.i)];
    if (!src || !/^\d{4}-\d{2}-\d{2}$/.test(d.date || "") || !isFuture(d.date)) continue;
    if (!d.title || !d.what) continue;
    out.push({
      id: `${src.id}:${d.date}`, date: d.date, endDate: /^\d{4}-\d{2}-\d{2}$/.test(d.endDate || "") && d.endDate > d.date ? d.endDate : undefined,
      tag: TAGS.includes(d.tag) ? d.tag : "policy",
      title: String(d.title).slice(0, 120), what: String(d.what).slice(0, 600), why: String(d.why || "").slice(0, 300),
      link: src.link, source: src.source, confidence: Math.max(0, Math.min(1, Number(d.confidence) || 0.5)),
    });
  }
  return out;
}

// ---------- dedup + queue ----------
function alreadyOnCalendar(cand, calendar, queue) {
  const near = (a, b) => Math.abs(daysOut(a) - daysOut(b)) <= 1;
  for (const e of calendar.events || []) {
    if (near(e.date, cand.date) && overlap(e.title, cand.title) >= 0.5) return `calendar:${e.id}`;
    if (cand.id.startsWith("fomc:") && e.id.startsWith("fomc") && near(e.date, cand.date)) return `calendar:${e.id}`;
  }
  for (const q of queue.queues || []) for (const it of q.items) {
    if (it.id === cand.id) return `queued:${q.date}#${it.n}`;
    if (near(it.date, cand.date) && overlap(it.title, cand.title) >= 0.5) return `queued:${q.date}#${it.n}`;
  }
  return null;
}

function formatQueuePost(q) {
  const lines = [`📅 **Date scan — queue for ${q.date}** (${q.items.length} new future date${q.items.length === 1 ? "" : "s"})`];
  for (const it of q.items) {
    const span = it.endDate ? `${it.date} → ${it.endDate}` : it.date;
    lines.push(`**${it.n}.** \`${span}\` (${daysOut(it.date)} d) · ${it.title}\n   ${it.what.slice(0, 220)}${it.what.length > 220 ? "…" : ""}\n   _${it.source}_ · conf ${it.confidence.toFixed(2)} · <${it.link}>`);
  }
  lines.push("👍 = add all to forgemesh.io/calendar · or reply `add 1, 3` / `skip 2` / `add all`");
  return lines.join("\n");
}

async function postChunks(text) {
  // Discord 2000-char cap; split on item boundaries.
  const parts = text.split(/\n(?=\*\*\d+\.\*\*|👍)/);
  let buf = "";
  for (const p of parts) {
    if ((buf + "\n" + p).length > 1900) { await notifyBrief(buf); buf = p; } else buf = buf ? buf + "\n" + p : p;
  }
  if (buf) await notifyBrief(buf);
}

// ---------- promote approved items into calendar.json ----------
function promote() {
  const queue = loadJson(QUEUE_FILE, { queues: [] });
  const calendar = loadJson(CALENDAR_FILE, { updatedAt: null, events: [] });
  const ids = new Set(calendar.events.map((e) => e.id));
  const added = [];
  for (const q of queue.queues || []) for (const it of q.items) {
    if (it.status !== "approved" || it.promotedAt) continue;
    let id = slug(it.title) || `event-${it.date}`;
    if (ids.has(id)) id = `${id}-${it.date}`;
    if (ids.has(id)) { it.status = "skipped"; it.note = "duplicate id"; continue; }
    const ev = { id, date: it.date, title: it.title, tag: it.tag, what: it.what, why: it.why, link: it.link };
    if (it.endDate) ev.endDate = it.endDate;
    if (it.track) { ev.track = true; ev.status = "scheduled"; ev.result = null; }
    if (it.time) ev.time = it.time;
    calendar.events.push(ev); ids.add(id);
    it.promotedAt = new Date().toISOString(); it.calendarId = id;
    added.push(`${it.date} ${it.title}`);
  }
  if (added.length) {
    calendar.events.sort((a, b) => a.date.localeCompare(b.date));
    calendar.updatedAt = new Date().toISOString();
    saveJson(CALENDAR_FILE, calendar);
    saveJson(QUEUE_FILE, queue);
  }
  return added;
}

function cliDecide(kind, spec) {
  const queue = loadJson(QUEUE_FILE, { queues: [] });
  const q = (queue.queues || []).find((x) => x.items.some((i) => i.status === "proposed"));
  if (!q) { console.log("nothing pending"); return; }
  const nums = spec === "all" ? q.items.filter((i) => i.status === "proposed").map((i) => i.n) : (String(spec).match(/\d+/g) || []).map(Number);
  for (const n of nums) { const it = q.items.find((i) => i.n === n); if (it && it.status === "proposed") it.status = kind; }
  if (!q.items.some((i) => i.status === "proposed")) q.decidedAt = new Date().toISOString();
  saveJson(QUEUE_FILE, queue);
  console.log(`${kind}: ${nums.join(", ")}`);
  if (kind === "approved") for (const a of promote()) console.log("  → calendar:", a);
}

// ---------- main ----------
(async () => {
  if (args.includes("--promote")) { const a = promote(); console.log(a.length ? "promoted:\n  " + a.join("\n  ") : "nothing to promote"); return; }
  const addI = args.indexOf("--add"), skipI = args.indexOf("--skip");
  if (args.includes("--all")) return cliDecide("approved", "all");
  if (addI >= 0) return cliDecide("approved", args[addI + 1]);
  if (skipI >= 0) return cliDecide("skipped", args[skipI + 1]);

  console.log(`${new Date().toISOString()} date-scan start (today ${TODAY})`);
  const queue = loadJson(QUEUE_FILE, { updatedAt: null, seen: {}, queues: [] });
  queue.seen ||= {}; queue.queues ||= [];
  const now = Date.now();
  for (const [k, t] of Object.entries(queue.seen)) if (now - t > SEEN_TTL_MS) delete queue.seen[k];
  const calendar = loadJson(CALENDAR_FILE, { events: [] });

  const cands = [];
  await sourceFederalRegister(cands);
  console.log(`  [fr] ${cands.length} structured date(s)`);
  const n0 = cands.length;
  await sourceFomc(cands);
  console.log(`  [fomc] ${cands.length - n0} meeting(s) ahead`);

  const feedItems = (await sourceFeeds()).filter((i) => !queue.seen[i.id]).slice(0, MAX_LLM_ITEMS);
  console.log(`  feed candidates for the LLM pass: ${feedItems.length}`);
  for (const it of feedItems) await enrich(it);
  const fromFeeds = await extractDates(feedItems);
  cands.push(...fromFeeds);

  // Everything evaluated is now seen (structured sources re-evaluate each run — they dedup by id below).
  if (!DRY) for (const it of feedItems) queue.seen[it.id] = now;

  const fresh = [];
  for (const c of cands) {
    if (queue.seen[c.id] && !c.id.startsWith("rss:") && !c.id.startsWith("hn:") && !c.id.startsWith("rw:")) continue;
    const dup = alreadyOnCalendar(c, calendar, queue);
    if (dup) { console.log(`  skip (${dup}): ${c.date} ${c.title}`); if (!DRY) queue.seen[c.id] = now; continue; }
    if (fresh.some((f) => Math.abs(daysOut(f.date) - daysOut(c.date)) <= 1 && overlap(f.title, c.title) >= 0.5)) continue;
    fresh.push(c);
    if (!DRY) queue.seen[c.id] = now;
  }
  fresh.sort((a, b) => a.date.localeCompare(b.date));

  if (!fresh.length) {
    console.log("  nothing new — no post");
    if (!DRY) { queue.updatedAt = new Date().toISOString(); saveJson(QUEUE_FILE, queue); }
    return;
  }
  const q = { date: TODAY, postedAt: null, items: fresh.map((c, i) => ({ n: i + 1, status: "proposed", ...c })) };
  const post = formatQueuePost(q);
  if (DRY) { console.log("\n" + post + "\n"); console.log(`(dry) ${fresh.length} proposal(s) not queued`); return; }
  const existing = queue.queues.find((x) => x.date === TODAY);
  if (existing) { // second run same day: append with continued numbering
    const base = existing.items.length;
    for (const it of q.items) { it.n += base; existing.items.push(it); }
    existing.postedAt = null;
  } else queue.queues.unshift(q);
  queue.queues = queue.queues.slice(0, 30);
  queue.updatedAt = new Date().toISOString();
  saveJson(QUEUE_FILE, queue);
  const target = existing || q;
  await postChunks(formatQueuePost(target));
  target.postedAt = new Date().toISOString();
  saveJson(QUEUE_FILE, queue);
  console.log(`  queued + posted ${fresh.length} proposal(s) for ${TODAY}`);
})().catch((e) => { console.error("date-scan failed:", e); process.exit(1); });
