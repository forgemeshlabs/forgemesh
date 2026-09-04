// Free human-facing VIN report — server-side port of the stuffer's vehicle
// shelf (x402-forgemesh-stuffer/src/handlers/vehicle.js). Hits the free,
// keyless, public-domain US government upstreams directly; never our own paid
// x402 endpoints. Sources: vpic.nhtsa.dot.gov (decode), api.nhtsa.gov
// (recalls / ratings / complaints), fueleconomy.gov (MPG + fuel cost).
//
// Landmines (operator rules): no KBB / "blue book" / NADA naming, no licensed
// valuation data, no vehicle-history (title/odometer) claims — those are the
// affiliate partners' product.

const VPIC = 'https://vpic.nhtsa.dot.gov/api/vehicles';
const NHTSA = 'https://api.nhtsa.gov';
const FUELECON = 'https://www.fueleconomy.gov/ws/rest';

export const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_MAX = 500;
const UA = 'forgemesh.io free VIN checker (hello@forgemesh.io)';

// ── shared GET with TTL cache (gov data is static-ish; 30 min is plenty) ─────
type CacheEntry = { exp: number; value: unknown };
const urlCache = new Map<string, CacheEntry>();

class UpstreamError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function getJson<T = unknown>(url: string, opts: { headers?: Record<string, string>; timeoutMs?: number } = {}): Promise<T> {
  const hit = urlCache.get(url);
  if (hit && hit.exp > Date.now()) return hit.value as T;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': UA, ...(opts.headers || {}) },
      signal: AbortSignal.timeout(opts.timeoutMs ?? 25_000),
      cache: 'no-store',
    });
  } catch (err) {
    throw new UpstreamError(`upstream unavailable: ${(err as Error).message}`, 503);
  }
  if (res.status === 404) throw new UpstreamError('not found upstream', 404);
  if (res.status === 400 || res.status === 422) throw new UpstreamError(`upstream rejected query (${res.status})`, 400);
  if (res.status !== 200) throw new UpstreamError(`upstream ${res.status}`, 503);
  const text = await res.text();
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new UpstreamError('upstream returned non-JSON', 503);
  }
  if (urlCache.size >= CACHE_MAX) urlCache.delete(urlCache.keys().next().value as string);
  urlCache.set(url, { exp: Date.now() + CACHE_TTL_MS, value });
  return value as T;
}

// ── VIN validation ──────────────────────────────────────────────────────────
// Humans type full 17-char VINs; I, O, Q never appear in a VIN.
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export class VinInputError extends Error {}

export function cleanVin(raw: unknown): string {
  const vin = String(raw || '').trim().toUpperCase().replace(/[\s-]+/g, '');
  if (!vin) throw new VinInputError('Enter a VIN — the 17-character code on the driver-side dash or door jamb.');
  if (vin.length !== 17) throw new VinInputError(`A VIN is exactly 17 characters — you entered ${vin.length}.`);
  if (/[IOQ]/.test(vin)) throw new VinInputError('The letters I, O and Q never appear in a VIN — check for a 1 or 0 instead.');
  if (!VIN_RE.test(vin)) throw new VinInputError('A VIN only contains letters and digits.');
  return vin;
}

const nz = (v: unknown): string | null => {
  const s = String(v ?? '').trim();
  return s && s !== 'Not Applicable' ? s : null;
};

// ── types ───────────────────────────────────────────────────────────────────
export type Vehicle = {
  make: string | null;
  model: string | null;
  model_year: string | null;
  trim: string | null;
  series: string | null;
  body_class: string | null;
  body_cab_type: string | null;
  vehicle_type: string | null;
  doors: string | null;
  drive_type: string | null;
  engine: {
    cylinders: string | null;
    displacement_l: string | null;
    horsepower: string | null;
    fuel_type: string | null;
    fuel_type_secondary: string | null;
  };
  transmission: { style: string | null; speeds: string | null };
  manufacturer: string | null;
  plant: { city: string | null; state: string | null; country: string | null };
  gvwr: string | null;
  decode_status: string | null;
  check_digit_ok: boolean;
};

export type Recall = {
  campaign_number: string;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  report_date: string;
  park_it: boolean;
  park_outside: boolean;
  over_the_air_update: boolean;
};

export type RecallsSection = {
  matched: number;
  matched_as: string[] | null; // source model names used when the decoder's name had no file
  recalls: Recall[];
  do_not_drive: number;
  park_outside: number;
};

export type RatingsSection = {
  rated_variant: { vehicle_id: number; description: string };
  other_variants: { vehicle_id: number; description: string }[];
  ratings: {
    overall: string | null;
    front_crash: string | null;
    side_crash: string | null;
    rollover: string | null;
    rollover_probability: string | null;
  };
  safety_features: {
    electronic_stability_control: string | null;
    forward_collision_warning: string | null;
    lane_departure_warning: string | null;
  };
} | null; // null = this vehicle was never crash-tested (a real answer)

export type FailuresSection = {
  total_complaints: number;
  matched_as: string[] | null;
  top_failure_components: { component: string; complaints: number; share_pct: number }[];
  severity_totals: { crashes: number; fires: number; injuries: number; deaths: number };
};

export type FuelSection = {
  matched_variant: { vehicle_id: number; description: string };
  other_variants: { vehicle_id: number; description: string }[];
  model_matched_as: string | null;
  fuel_economy: {
    city_mpg: number | null;
    highway_mpg: number | null;
    combined_mpg: number | null;
    fuel_type: string | null;
    annual_fuel_cost_usd: number | null;
    co2_tailpipe_g_per_mi: number | null;
  };
} | null; // null = no fuel-economy record (database covers 1984+ light-duty)

// A section either resolved (ok, data — data may be empty/null) or the
// upstream failed. Empty results are real answers; failures are not.
export type Section<T> = { ok: true; data: T } | { ok: false; error: string };

export type VinReport = {
  vin: string;
  vehicle: Vehicle;
  recalls: Section<RecallsSection>;
  ratings: Section<RatingsSection>;
  failures: Section<FailuresSection>;
  fuel: Section<FuelSection>;
  fetched_at: string;
  sources: string;
};

// ── decode ──────────────────────────────────────────────────────────────────
type VpicRow = Record<string, string>;

async function decodeVin(vin: string): Promise<Vehicle> {
  const r = await getJson<{ Results?: VpicRow[] }>(`${VPIC}/DecodeVinValues/${encodeURIComponent(vin)}?format=json`);
  const d = r.Results?.[0];
  if (!d) throw new UpstreamError('decoder returned no result', 503);
  const v: Vehicle = {
    make: nz(d.Make),
    model: nz(d.Model),
    model_year: nz(d.ModelYear),
    trim: nz(d.Trim),
    series: nz(d.Series),
    body_class: nz(d.BodyClass),
    body_cab_type: nz(d.BodyCabType),
    vehicle_type: nz(d.VehicleType),
    doors: nz(d.Doors),
    drive_type: nz(d.DriveType),
    engine: {
      cylinders: nz(d.EngineCylinders),
      displacement_l: nz(d.DisplacementL),
      horsepower: nz(d.EngineHP),
      fuel_type: nz(d.FuelTypePrimary),
      fuel_type_secondary: nz(d.FuelTypeSecondary),
    },
    transmission: { style: nz(d.TransmissionStyle), speeds: nz(d.TransmissionSpeeds) },
    manufacturer: nz(d.Manufacturer),
    plant: { city: nz(d.PlantCity), state: nz(d.PlantState), country: nz(d.PlantCountry) },
    gvwr: nz(d.GVWR),
    decode_status: nz(d.ErrorText),
    check_digit_ok: /check digit .*is correct/i.test(String(d.ErrorText || '')),
  };
  if (!v.make && !v.model) {
    throw new VinInputError(
      `That VIN did not decode to a vehicle${v.decode_status ? ` (${v.decode_status.replace(/^\d+\s*-\s*/, '')})` : ''}. Double-check it against the dash plate.`,
    );
  }
  return v;
}

// ── model-name resolution ───────────────────────────────────────────────────
// The decoder says "F-150"; the recall/complaint/ratings databases file the
// same truck as "F-150 REGULAR CAB" / "F-150 SUPER CREW" / "F-150 SUPERCAB".
// Try the exact name first; if a source has nothing under it, fuzzy-match the
// source's own model list and narrow by the decoded cab style / body / drive.
const normName = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function narrowByBody(names: string[], v: Vehicle): string[] {
  const cab = (v.body_cab_type || '').toLowerCase();
  const prefer: RegExp[] = [];
  if (/crew/.test(cab)) prefer.push(/CREW/i);
  else if (/extended|super ?cab|club|access|king|quad|double/.test(cab)) prefer.push(/SUPERCAB|EXT|EXTENDED|CLUB|ACCESS|KING|QUAD|DOUBLE/i);
  else if (/regular|standard/.test(cab)) prefer.push(/REGULAR|STANDARD|REG CAB/i);
  const bc = (v.body_class || '').toLowerCase();
  if (/coupe/.test(bc)) prefer.push(/COUPE|2-?DR/i);
  else if (/convertible/.test(bc)) prefer.push(/CONV/i);
  else if (/wagon/.test(bc)) prefer.push(/WAGON/i);
  else if (/hatch/.test(bc)) prefer.push(/HATCH|5-?DR/i);
  for (const re of prefer) {
    const hit = names.filter((n) => re.test(n));
    if (hit.length) return hit;
  }
  return names;
}

function fuzzyModels(list: string[], v: Vehicle): string[] {
  const want = normName(v.model!);
  const uniq = [...new Set(list.map((m) => String(m || '').trim()).filter(Boolean))];
  const exact = uniq.filter((m) => normName(m) === want);
  if (exact.length) return exact;
  const loose = uniq.filter((m) => {
    const n = normName(m);
    return n.includes(want) || (want.length >= 4 && want.includes(n) && n.length >= 3);
  });
  return narrowByBody(loose, v).slice(0, 4);
}

async function productModels(make: string, year: string, issueType: 'c' | 'r'): Promise<string[]> {
  try {
    const r = await getJson<{ results?: { model: string }[] }>(
      `${NHTSA}/products/vehicle/models?modelYear=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&issueType=${issueType}`,
    );
    return (r.results || []).map((x) => x.model);
  } catch {
    return [];
  }
}

// ── recalls ─────────────────────────────────────────────────────────────────
type RecallRow = Record<string, unknown>;

async function recallsFor(make: string, model: string, year: string): Promise<RecallRow[]> {
  try {
    const r = await getJson<{ results?: RecallRow[] }>(
      `${NHTSA}/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`,
    );
    return r.results || [];
  } catch (err) {
    if ((err as UpstreamError).status === 400 || (err as UpstreamError).status === 404) return [];
    throw err;
  }
}

async function fetchRecalls(v: Vehicle): Promise<RecallsSection> {
  const make = v.make!, model = v.model!, year = v.model_year!;
  let raw = await recallsFor(make, model, year);
  let matchedAs: string[] = [];
  if (!raw.length) {
    const candidates = fuzzyModels(await productModels(make, year, 'r'), v).filter((m) => normName(m) !== normName(model));
    if (candidates.length) {
      const lists = await Promise.all(candidates.map((m) => recallsFor(make, m, year)));
      raw = lists.flat();
      matchedAs = candidates.filter((_, i) => lists[i].length);
    }
  }
  // Same campaign can be filed under several cab styles — dedupe.
  const seen = new Set<string>();
  raw = raw.filter((x) => {
    const k = String(x.NHTSACampaignNumber || '') + '|' + String(x.Component || '');
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const rows: Recall[] = raw.map((x) => ({
    campaign_number: String(x.NHTSACampaignNumber || ''),
    component: String(x.Component || ''),
    summary: String(x.Summary || '').slice(0, 400),
    consequence: String(x.Consequence || '').slice(0, 300),
    remedy: String(x.Remedy || '').slice(0, 300),
    report_date: String(x.ReportReceivedDate || ''),
    park_it: !!x.parkIt,
    park_outside: !!x.parkOutSide,
    over_the_air_update: !!x.overTheAirUpdate,
  }));
  // Do-not-drive / fire-risk campaigns first, then newest first.
  const dateKey = (s: string) => {
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    return m ? `${m[3]}-${m[1]}-${m[2]}` : s;
  };
  rows.sort((a, b) => {
    const fa = (a.park_it ? 2 : 0) + (a.park_outside ? 1 : 0);
    const fb = (b.park_it ? 2 : 0) + (b.park_outside ? 1 : 0);
    if (fa !== fb) return fb - fa;
    return dateKey(b.report_date).localeCompare(dateKey(a.report_date));
  });
  return {
    matched: rows.length,
    matched_as: matchedAs.length ? matchedAs : null,
    recalls: rows.slice(0, 50),
    do_not_drive: rows.filter((x) => x.park_it).length,
    park_outside: rows.filter((x) => x.park_outside).length,
  };
}

// ── crash-test ratings ──────────────────────────────────────────────────────
const rating = (v: unknown): string | null => {
  const s = nz(v);
  return s && s !== 'Not Rated' ? s : null;
};

async function ratingVariants(make: string, model: string, year: string) {
  try {
    const list = await getJson<{ Results?: { VehicleId: number; VehicleDescription: string }[] }>(
      `${NHTSA}/SafetyRatings/modelyear/${encodeURIComponent(year)}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}`,
    );
    return (list.Results || []).map((x) => ({ vehicle_id: x.VehicleId, description: x.VehicleDescription }));
  } catch (err) {
    if ((err as UpstreamError).status === 400 || (err as UpstreamError).status === 404) return [];
    throw err;
  }
}

async function fetchRatings(v: Vehicle): Promise<RatingsSection> {
  const make = v.make!, model = v.model!, year = v.model_year!;
  const bodyClass = v.body_class, doors = v.doors;
  let variants = await ratingVariants(make, model, year);
  if (!variants.length) {
    const menu = await getJson<{ Results?: { Model: string }[] }>(
      `${NHTSA}/SafetyRatings/modelyear/${encodeURIComponent(year)}/make/${encodeURIComponent(make)}`,
    ).catch(() => ({ Results: [] as { Model: string }[] }));
    const candidates = fuzzyModels((menu.Results || []).map((x) => x.Model), v).filter((m) => normName(m) !== normName(model));
    if (candidates.length) {
      variants = (await Promise.all(candidates.map((m) => ratingVariants(make, m, year)))).flat();
    }
  }
  if (!variants.length) return null;
  // Narrow by drivetrain when the tested variants split on it (4x2 vs 4x4).
  const drive = (v.drive_type || '').toLowerCase();
  if (/4wd|4x4|awd/.test(drive)) {
    const hit = variants.filter((x) => /4x4|4WD|AWD/i.test(x.description));
    if (hit.length) variants = hit;
  } else if (/2wd|4x2|fwd|rwd/.test(drive)) {
    const hit = variants.filter((x) => /4x2|2WD|FWD|RWD/i.test(x.description));
    if (hit.length) variants = hit;
  }
  // Pick the variant that best matches the decoded body (2-DR vs 4-DR, etc.);
  // fall back to the first one the way the paid endpoint does.
  const wantDoors = doors ? `${doors}-DR` : null;
  const bc = (bodyClass || '').toLowerCase();
  const pick =
    variants.find((v) => wantDoors && v.description.includes(wantDoors) && /w\/SAB/i.test(v.description)) ||
    variants.find((v) => wantDoors && v.description.includes(wantDoors)) ||
    variants.find((v) => bc.includes('coupe') && /2-DR/.test(v.description)) ||
    variants.find((v) => bc.includes('sedan') && /4-DR/.test(v.description)) ||
    variants[0];
  const rr = await getJson<{ Results?: Record<string, unknown>[] }>(`${NHTSA}/SafetyRatings/VehicleId/${pick.vehicle_id}`);
  const d = rr.Results?.[0];
  if (!d) return null;
  return {
    rated_variant: { vehicle_id: pick.vehicle_id, description: String(d.VehicleDescription || pick.description) },
    other_variants: variants.filter((v) => v.vehicle_id !== pick.vehicle_id),
    // Pre-2011 test records leave the "Overall*" fields Not Rated and carry
    // the stars in the driver-side / RolloverRating2 fields — fall through.
    ratings: {
      overall: rating(d.OverallRating),
      front_crash: rating(d.OverallFrontCrashRating) ?? rating(d.FrontCrashDriversideRating),
      side_crash: rating(d.OverallSideCrashRating) ?? rating(d.SideCrashDriversideRating),
      rollover: rating(d.RolloverRating) ?? rating(d.RolloverRating2),
      rollover_probability: (() => {
        const p = Number(d.RolloverPossibility) || Number(d.RolloverPossibility2) || 0;
        return p > 0 ? `${Math.round(p * 1000) / 10}%` : null;
      })(),
    },
    safety_features: {
      electronic_stability_control: nz(d.NHTSAElectronicStabilityControl),
      forward_collision_warning: nz(d.NHTSAForwardCollisionWarning),
      lane_departure_warning: nz(d.NHTSALaneDepartureWarning),
    },
  };
}

// ── complaints → top failure components (the headliner) ─────────────────────
type ComplaintRow = Record<string, unknown>;

async function complaintsFor(make: string, model: string, year: string): Promise<ComplaintRow[]> {
  try {
    const r = await getJson<{ results?: ComplaintRow[] }>(
      `${NHTSA}/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`,
      { timeoutMs: 30_000 },
    );
    return r.results || [];
  } catch (err) {
    // The complaints API answers 400 for a model name it has no file under.
    if ((err as UpstreamError).status === 400 || (err as UpstreamError).status === 404) return [];
    throw err;
  }
}

async function fetchFailures(v: Vehicle): Promise<FailuresSection> {
  const make = v.make!, model = v.model!, year = v.model_year!;
  let rows = await complaintsFor(make, model, year);
  let matchedAs: string[] = [];
  if (!rows.length) {
    const candidates = fuzzyModels(await productModels(make, year, 'c'), v).filter((m) => normName(m) !== normName(model));
    if (candidates.length) {
      const lists = await Promise.all(candidates.map((m) => complaintsFor(make, m, year)));
      rows = lists.flat();
      matchedAs = candidates.filter((_, i) => lists[i].length);
    }
  }
  const byComponent = new Map<string, number>();
  let crashes = 0, fires = 0, injuries = 0, deaths = 0;
  for (const x of rows) {
    crashes += x.crash ? 1 : 0;
    fires += x.fire ? 1 : 0;
    injuries += Number(x.numberOfInjuries) || 0;
    deaths += Number(x.numberOfDeaths) || 0;
    for (let c of String(x.components || '').split(',')) {
      c = c.trim();
      if (!c || c === 'UNKNOWN OR OTHER') continue;
      byComponent.set(c, (byComponent.get(c) || 0) + 1);
    }
  }
  const top = [...byComponent.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([component, count]) => ({
      component,
      complaints: count,
      share_pct: rows.length ? Math.round((count / rows.length) * 1000) / 10 : 0,
    }));
  return {
    total_complaints: rows.length,
    matched_as: matchedAs.length ? matchedAs : null,
    top_failure_components: top,
    severity_totals: { crashes, fires, injuries, deaths },
  };
}

// ── fuel economy (menu chain with fuzzy model fallback) ─────────────────────
const titleCase = (s: string) => String(s || '').toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
type MenuItem = { text: string; value: string };
const menuArr = (r: { menuItem?: MenuItem | MenuItem[] } | null | undefined): MenuItem[] => {
  const m = r?.menuItem;
  return Array.isArray(m) ? m : m ? [m] : [];
};
const JSON_HDR = { Accept: 'application/json' };

async function feOptions(year: string, make: string, model: string): Promise<MenuItem[]> {
  try {
    const r = await getJson<{ menuItem?: MenuItem | MenuItem[] }>(
      `${FUELECON}/vehicle/menu/options?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
      { headers: JSON_HDR },
    );
    return menuArr(r);
  } catch (err) {
    if ((err as UpstreamError).status === 404) return [];
    throw err;
  }
}

function pickFuelVariant(options: MenuItem[], v: Vehicle): MenuItem {
  // Match the decoded engine/transmission against option text like
  // "Auto 5-spd, 6 cyl, 3.0 L" so a V6 coupe doesn't get the 4-cyl figure.
  const cyl = v.engine.cylinders ? `${v.engine.cylinders} cyl` : null;
  const disp = v.engine.displacement_l ? `${(Math.round(Number(v.engine.displacement_l) * 10) / 10).toFixed(1)} L` : null;
  const auto = v.transmission.style ? /auto|cvt/i.test(v.transmission.style) : null;
  const score = (o: MenuItem) => {
    let s = 0;
    if (cyl && o.text.includes(cyl)) s += 2;
    if (disp && o.text.includes(disp)) s += 2;
    if (auto !== null) s += (auto ? /^Auto/i.test(o.text) : /^Man/i.test(o.text)) ? 1 : 0;
    return s;
  };
  return [...options].sort((a, b) => score(b) - score(a))[0];
}

async function fetchFuel(v: Vehicle): Promise<FuelSection> {
  const make = titleCase(v.make!);
  const year = v.model_year!;
  let usedModel = v.model!;
  let options = await feOptions(year, make, usedModel);
  if (!options.length) {
    const modelsR = await getJson<{ menuItem?: MenuItem | MenuItem[] }>(
      `${FUELECON}/vehicle/menu/model?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}`,
      { headers: JSON_HDR },
    ).catch((err) => {
      if ((err as UpstreamError).status === 404) return null;
      throw err;
    });
    const models = menuArr(modelsR).map((m) => m.value);
    const want = normName(v.model!);
    const matches = models.filter((m) => {
      const n = normName(m);
      return n.includes(want) || want.includes(n);
    });
    // For humans, pick the shortest match (usually the base model) rather than
    // bouncing a candidate list back like the API does.
    if (matches.length) {
      usedModel = [...matches].sort((a, b) => a.length - b.length)[0];
      options = await feOptions(year, make, usedModel);
    }
  }
  if (!options.length) return null;
  const chosen = pickFuelVariant(options, v);
  const record = await getJson<Record<string, unknown>>(`${FUELECON}/vehicle/${encodeURIComponent(chosen.value)}`, { headers: JSON_HDR });
  const num = (x: unknown) => {
    const n = Number(x);
    return Number.isFinite(n) && n > 0 ? n : null;
  };
  return {
    matched_variant: {
      vehicle_id: Number(record.id),
      description: `${record.year} ${record.make} ${record.model} — ${record.trany || ''} ${record.displ ? record.displ + 'L' : ''}`.trim(),
    },
    other_variants: options.filter((o) => o.value !== chosen.value).map((o) => ({ vehicle_id: Number(o.value), description: o.text })),
    model_matched_as: usedModel !== v.model ? usedModel : null,
    fuel_economy: {
      city_mpg: num(record.city08),
      highway_mpg: num(record.highway08),
      combined_mpg: num(record.comb08),
      fuel_type: (record.fuelType as string) || null,
      annual_fuel_cost_usd: num(record.fuelCost08),
      co2_tailpipe_g_per_mi: num(record.co2TailpipeGpm),
    },
  };
}

// ── the report ──────────────────────────────────────────────────────────────
const reportCache = new Map<string, { exp: number; value: VinReport }>();

export function cachedReport(vin: string): VinReport | null {
  const hit = reportCache.get(vin);
  return hit && hit.exp > Date.now() ? hit.value : null;
}

async function section<T>(p: Promise<T>): Promise<Section<T>> {
  try {
    return { ok: true, data: await p };
  } catch (err) {
    const e = err as UpstreamError;
    // A 404 from the ratings/fuel menus means "no record", which the fetchers
    // already translate to null; anything reaching here is a real failure.
    return { ok: false, error: e.status === 404 ? 'No record found upstream.' : 'Source temporarily unavailable — try again in a minute.' };
  }
}

export async function buildVinReport(rawVin: string): Promise<VinReport> {
  const vin = cleanVin(rawVin);
  const cached = cachedReport(vin);
  if (cached) return cached;

  const vehicle = await decodeVin(vin);
  const { make, model, model_year: year } = vehicle;
  const canChain = !!(make && model && year);
  const unavailable = <T,>(): Promise<Section<T>> =>
    Promise.resolve({ ok: false, error: 'Vehicle decoded without a make/model/year, so history lookups are not possible.' });

  const [recalls, ratings, failures, fuel] = canChain
    ? await Promise.all([
        section(fetchRecalls(vehicle)),
        section(fetchRatings(vehicle)),
        section(fetchFailures(vehicle)),
        section(fetchFuel(vehicle)),
      ])
    : await Promise.all([unavailable<RecallsSection>(), unavailable<RatingsSection>(), unavailable<FailuresSection>(), unavailable<FuelSection>()]);

  const report: VinReport = {
    vin,
    vehicle,
    recalls,
    ratings,
    failures,
    fuel,
    fetched_at: new Date().toISOString(),
    sources: 'Official U.S. government vehicle safety, complaint, and fuel-economy data (public domain).',
  };
  // Only cache reports where every section resolved, so a transient upstream
  // blip doesn't get pinned for 30 minutes.
  if (recalls.ok && ratings.ok && failures.ok && fuel.ok) {
    if (reportCache.size >= 200) reportCache.delete(reportCache.keys().next().value as string);
    reportCache.set(vin, { exp: Date.now() + CACHE_TTL_MS, value: report });
  }
  return report;
}
