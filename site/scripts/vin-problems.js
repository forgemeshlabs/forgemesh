#!/usr/bin/env node
// VIN Problems collector — feeds the programmatic SEO pages at
// forgemesh.io/vin/<slug> ("<year> <make> <model> problems"). Pulls NHTSA
// complaints + recalls per year/make/model from a curated list of ~60
// high-search used-car models (2008-2022), computes ranked failure
// components, and writes one JSON per slug to public/vin-problems/ plus an
// index.json the [slug] page, the /vin/problems hub, and sitemap.ts read at
// request time — same "collector writes JSON, page reads it" pattern as
// rules-watch.js / congress-trades.js. No rebuild needed when data refreshes.
//
// Model-name resolution mirrors lib/vin-report.ts's fuzzy fallback: the
// complaints/recalls APIs answer 400 for a name they have no file under
// (e.g. "F-150" needs "F-150 SUPER CREW" / "F-150 REGULAR CAB", "Silverado"
// needs "Silverado 1500", "Ram 1500" needs bare "1500"). Ported here in
// plain JS rather than imported — this script runs standalone via cron/node
// and the repo has no ts-node/tsx to import a .ts lib directly.
//
// Idempotent + resumable: a slug whose JSON is < 7 days old is skipped
// (--force to refetch anyway). Sequential requests, ~150ms apart, one retry
// on a 5xx/network error, 400s are skipped and logged (unknown model name
// for that make/year — a real, expected outcome, not a bug).
//
// Usage: node scripts/vin-problems.js [--years=2012-2020] [--limit=25] [--force]
// Cron:  20 9 * * 0   (weekly, Sunday 09:20 UTC — offset from the other
//                       Sunday-adjacent collectors; NHTSA data moves slowly)
const fs = require('fs');
const path = require('path');

const NHTSA = 'https://api.nhtsa.gov';
const OUT_DIR = path.join(__dirname, '..', 'public', 'vin-problems');
const INDEX_FILE = path.join(OUT_DIR, 'index.json');
const UA = 'forgemesh.io VIN problems collector (hello@forgemesh.io)';
const DELAY_MS = 150;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Order matters: the first 25 are the highest-search models (task batch 1).
const MODELS = [
  ['Honda', 'Civic'], ['Honda', 'Accord'], ['Toyota', 'Camry'], ['Toyota', 'Corolla'], ['Toyota', 'RAV4'],
  ['Honda', 'CR-V'], ['Ford', 'F-150'], ['Chevrolet', 'Silverado'], ['Ram', 'Ram 1500'], ['Toyota', 'Tacoma'],
  ['Toyota', 'Tundra'], ['Nissan', 'Altima'], ['Nissan', 'Rogue'], ['Nissan', 'Sentra'], ['Ford', 'Escape'],
  ['Ford', 'Explorer'], ['Ford', 'Focus'], ['Ford', 'Fusion'], ['Chevrolet', 'Equinox'], ['Chevrolet', 'Malibu'],
  ['Chevrolet', 'Cruze'], ['Jeep', 'Wrangler'], ['Jeep', 'Grand Cherokee'], ['Jeep', 'Cherokee'], ['Hyundai', 'Elantra'],
  // remainder of the ~60
  ['Hyundai', 'Sonata'], ['Hyundai', 'Santa Fe'], ['Hyundai', 'Tucson'], ['Kia', 'Optima'], ['Kia', 'Sorento'],
  ['Kia', 'Soul'], ['Kia', 'Forte'], ['Subaru', 'Outback'], ['Subaru', 'Forester'], ['Subaru', 'Impreza'],
  ['Mazda', 'Mazda3'], ['Mazda', 'CX-5'], ['Toyota', 'Highlander'], ['Toyota', 'Sienna'], ['Honda', 'Odyssey'],
  ['Honda', 'Pilot'], ['Toyota', 'Prius'], ['Toyota', '4Runner'], ['Tesla', 'Model 3'], ['Tesla', 'Model Y'],
  ['Dodge', 'Charger'], ['Dodge', 'Challenger'], ['Dodge', 'Durango'], ['Dodge', 'Journey'], ['Nissan', 'Pathfinder'],
  ['Nissan', 'Frontier'], ['Chevrolet', 'Tahoe'], ['Chevrolet', 'Suburban'], ['Chevrolet', 'Traverse'], ['GMC', 'Acadia'],
  ['GMC', 'Terrain'], ['GMC', 'Sierra'], ['Chevrolet', 'Colorado'], ['Ford', 'Expedition'],
];

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);
const [yStart, yEnd] = String(args.years || '2008-2022').split('-').map(Number);
const YEARS = [];
for (let y = yStart; y <= yEnd; y++) YEARS.push(y);
const MODEL_LIST = args.limit ? MODELS.slice(0, Number(args.limit)) : MODELS;
const FORCE = !!args.force;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const normName = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function politeGet(url) {
  for (let attempt = 0; ; attempt++) {
    await sleep(DELAY_MS);
    let res;
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25_000) });
    } catch (err) {
      if (attempt < 1) continue;
      throw Object.assign(new Error(`network: ${err.message}`), { status: 0 });
    }
    if (res.status >= 500 && attempt < 1) continue;
    if (res.status === 400 || res.status === 404) throw Object.assign(new Error(`upstream ${res.status}`), { status: res.status });
    if (res.status !== 200) throw Object.assign(new Error(`upstream ${res.status}`), { status: res.status });
    return res.json();
  }
}

async function productModels(make, year, issueType) {
  try {
    const r = await politeGet(
      `${NHTSA}/products/vehicle/models?modelYear=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&issueType=${issueType}`,
    );
    return (r.results || []).map((x) => x.model);
  } catch {
    return [];
  }
}

// Same logic as lib/vin-report.ts's fuzzyModels, minus the VIN-specific body
// narrowing (we have no single decoded vehicle here — combine every cab
// style / trim variant that matches, so a "F-150 problems" page covers the
// whole model, not one cab).
function fuzzyModels(list, wantModel) {
  const want = normName(wantModel);
  const uniq = [...new Set(list.map((m) => String(m || '').trim()).filter(Boolean))];
  const exact = uniq.filter((m) => normName(m) === want);
  if (exact.length) return exact;
  return uniq
    .filter((m) => {
      const n = normName(m);
      return n.includes(want) || (want.length >= 4 && want.includes(n) && n.length >= 3);
    })
    .slice(0, 6);
}

async function complaintsFor(make, model, year) {
  try {
    const r = await politeGet(
      `${NHTSA}/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`,
    );
    return r.results || [];
  } catch (e) {
    if (e.status === 400 || e.status === 404) return null; // no file under this name
    throw e;
  }
}

async function recallsFor(make, model, year) {
  try {
    const r = await politeGet(
      `${NHTSA}/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`,
    );
    return r.results || [];
  } catch (e) {
    if (e.status === 400 || e.status === 404) return null;
    throw e;
  }
}

async function resolveAndFetch(make, model, year, kind) {
  const fetcher = kind === 'c' ? complaintsFor : recallsFor;
  const rows = await fetcher(make, model, year);
  if (rows !== null) return { rows, matchedAs: null };
  const candidates = fuzzyModels(await productModels(make, year, kind), model);
  if (!candidates.length) return { rows: [], matchedAs: null, unresolved: true };
  const lists = [];
  for (const c of candidates) lists.push((await fetcher(make, c, year)) || []);
  const flat = lists.flat();
  const matchedAs = candidates.filter((_, i) => lists[i].length);
  return { rows: flat, matchedAs: matchedAs.length ? matchedAs : null };
}

// Strip anything that looks like a name/phone/VIN from an owner-complaint
// excerpt before it goes on a public page (NHTSA already redacts most PII,
// this is a defensive second pass).
function scrub(text) {
  return String(text || '')
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[phone]')
    .replace(/\b[A-HJ-NPR-Z0-9]{17}\b/g, '[VIN]')
    .replace(/\b(Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+/g, '[name]')
    .trim()
    .slice(0, 200);
}

function parseIncidentYear(s) {
  const m = String(s || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? Number(m[3]) : null;
}

function computeFailures(rows) {
  const byComponent = new Map();
  const byIncidentYear = new Map();
  let crashes = 0, fires = 0, injuries = 0, deaths = 0;
  for (const x of rows) {
    crashes += x.crash ? 1 : 0;
    fires += x.fire ? 1 : 0;
    injuries += Number(x.numberOfInjuries) || 0;
    deaths += Number(x.numberOfDeaths) || 0;
    const iy = parseIncidentYear(x.dateOfIncident);
    if (iy) byIncidentYear.set(iy, (byIncidentYear.get(iy) || 0) + 1);
    for (let c of String(x.components || '').split(',')) {
      c = c.trim();
      if (!c || c === 'UNKNOWN OR OTHER') continue;
      if (!byComponent.has(c)) byComponent.set(c, { count: 0, excerpts: [] });
      const entry = byComponent.get(c);
      entry.count++;
      if (entry.excerpts.length < 3 && x.summary) entry.excerpts.push(scrub(x.summary));
    }
  }
  const top = [...byComponent.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([component, v]) => ({
      component,
      complaints: v.count,
      share_pct: rows.length ? Math.round((v.count / rows.length) * 1000) / 10 : 0,
      excerpts: v.excerpts,
    }));
  return {
    total_complaints: rows.length,
    top_failure_components: top,
    severity: { crashes, fires, injuries, deaths },
    trend_by_incident_year: [...byIncidentYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count })),
  };
}

function computeRecalls(rows) {
  return {
    count: rows.length,
    recalls: rows.slice(0, 30).map((x) => ({
      campaign_number: String(x.NHTSACampaignNumber || ''),
      component: String(x.Component || ''),
      summary: String(x.Summary || '').slice(0, 300),
      report_date: String(x.ReportReceivedDate || ''),
      park_it: !!x.parkIt,
      park_outside: !!x.parkOutSide,
    })),
  };
}

async function processOne(make, model, year) {
  const slug = `${year}-${slugify(make)}-${slugify(model)}`;
  const file = path.join(OUT_DIR, `${slug}.json`);
  if (!FORCE && fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < MAX_AGE_MS) {
    return { slug, skipped: true };
  }
  const yearStr = String(year);
  const c = await resolveAndFetch(make, model, yearStr, 'c');
  const r = await resolveAndFetch(make, model, yearStr, 'r');
  if (c.unresolved && r.unresolved) return { slug, unresolved: true };

  const failures = computeFailures(c.rows);
  const recalls = computeRecalls(r.rows);
  const data = {
    slug,
    year,
    make,
    model,
    matched_as: { complaints: c.matchedAs, recalls: r.matchedAs },
    failures,
    recalls,
    generated: new Date().toISOString(),
    source: 'NHTSA (api.nhtsa.gov) — complaints and recalls by vehicle',
  };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return { slug, complaint_count: failures.total_complaints, recall_count: recalls.count, top_component: failures.top_failure_components[0]?.component || null };
}

function rebuildIndex() {
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.json') && f !== 'index.json');
  const entries = files
    .map((f) => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(OUT_DIR, f), 'utf8'));
        return {
          slug: d.slug,
          year: d.year,
          make: d.make,
          model: d.model,
          complaint_count: d.failures.total_complaints,
          recall_count: d.recalls.count,
          top_component: d.failures.top_failure_components[0]?.component || null,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  entries.sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model) || a.year - b.year);
  fs.writeFileSync(INDEX_FILE, JSON.stringify({ generated: new Date().toISOString(), count: entries.length, entries }, null, 2));
  return entries.length;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let written = 0, skipped = 0, unresolved = 0, failed = 0;
  const unresolvedLog = [];
  for (const year of YEARS) {
    for (const [make, model] of MODEL_LIST) {
      try {
        const res = await processOne(make, model, year);
        if (res.skipped) skipped++;
        else if (res.unresolved) {
          unresolved++;
          unresolvedLog.push(`${year} ${make} ${model}`);
        } else {
          written++;
          console.log(`${res.slug}: ${res.complaint_count} complaints, ${res.recall_count} recalls, top=${res.top_component || 'none'}`);
        }
      } catch (err) {
        failed++;
        console.error(`${year} ${make} ${model} failed: ${err.message}`);
      }
    }
  }
  const total = rebuildIndex();
  if (unresolvedLog.length) console.log(`400 (no NHTSA file under that name), skipped:\n  ${unresolvedLog.join('\n  ')}`);
  console.log(`done: ${written} written, ${skipped} fresh-skipped, ${unresolved} unresolved-400, ${failed} failed, ${total} slugs on disk`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
