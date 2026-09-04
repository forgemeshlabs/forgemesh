'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, Flame, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import type { VinReport, Recall } from '@/lib/vin-report';

// The '03 Accord: 2,013 complaints on file, POWER TRAIN 46% — shows the value
// of the page before anyone types a character.
export const DEMO_VIN = '1HGCM82633A004352';

// Warranty slot shows when one component dominates the complaint file.
const WARRANTY_SHARE_THRESHOLD = 25;

type Report = VinReport & { cached?: boolean };

const track = (event: string, data?: Record<string, string | number>) =>
  (window as unknown as { umami?: { track: (e: string, d?: object) => void } }).umami?.track(event, data);

const title = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
const prettyComponent = (s: string) => title(s.replace(/:/g, ' › '));
const prettyPlace = (v: Report['vehicle']) => {
  const parts = [v.plant.city, v.plant.state].filter(Boolean).map((p) => title(p!));
  const country = v.plant.country ? v.plant.country.replace(/\s*\(.*\)$/, '') : null;
  if (country) parts.push(country === 'UNITED STATES' ? 'USA' : title(country));
  return parts.join(', ');
};
const litres = (s: string | null) => (s ? `${(Math.round(Number(s) * 10) / 10).toFixed(1)}L` : null);
const fmtDate = (s: string) => {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return s;
  const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
  return isNaN(d.getTime()) ? s : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

function Stars({ value }: { value: string | null }) {
  const n = value ? Number(value) : 0;
  return (
    <span className="font-mono text-base tracking-[0.1em]" aria-label={value ? `${value} out of 5 stars` : 'not rated'}>
      {value ? (
        <>
          <span className="text-amber-300">{'★'.repeat(n)}</span>
          <span className="text-slate-700">{'★'.repeat(5 - n)}</span>
        </>
      ) : (
        <span className="text-slate-600">not rated</span>
      )}
    </span>
  );
}

function Skeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3.5 rounded bg-white/[0.06]" style={{ width: `${88 - (i % 3) * 18}%` }} />
      ))}
    </div>
  );
}

function SectionCard({
  kicker,
  heading,
  children,
  accent = 'border-white/[0.06]',
  id,
}: {
  kicker: string;
  heading?: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`rounded-2xl border ${accent} bg-white/[0.02] p-5 sm:p-6`}>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{kicker}</p>
      {heading ? <h3 className="mt-2 text-lg font-semibold text-slate-50">{heading}</h3> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Unavailable({ error }: { error: string }) {
  return <p className="text-sm leading-6 text-amber-300/80">{error}</p>;
}

function RecallRow({ r }: { r: Recall }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span>
          {r.park_it ? (
            <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-300">
              <ShieldAlert className="h-3 w-3" aria-hidden /> Do not drive
            </span>
          ) : null}
          {r.park_outside ? (
            <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-orange-300">
              <Flame className="h-3 w-3" aria-hidden /> Park outside
            </span>
          ) : null}
          <span className="text-sm text-slate-200">{prettyComponent(r.component)}</span>
        </span>
        <span className="shrink-0 font-mono text-[11px] text-slate-500">{fmtDate(r.report_date)}</span>
      </button>
      {open ? (
        <div className="mt-2 space-y-2 text-sm leading-6 text-slate-400">
          <p>{r.summary}</p>
          {r.consequence ? <p><span className="text-slate-500">Risk:</span> {r.consequence}</p> : null}
          {r.remedy ? <p><span className="text-slate-500">Fix:</span> {r.remedy}</p> : null}
          <p className="font-mono text-[11px] text-slate-600">
            Campaign {r.campaign_number}{r.over_the_air_update ? ' · over-the-air update' : ''} · recall work is free at any franchised dealer
          </p>
        </div>
      ) : null}
    </li>
  );
}

export function VinChecker() {
  const [vin, setVin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [showAllRecalls, setShowAllRecalls] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  async function lookup(raw: string, mode: 'typed' | 'demo' | 'link') {
    const cleaned = raw.trim().toUpperCase().replace(/[\s-]+/g, '');
    if (!cleaned) return;
    setVin(cleaned);
    setBusy(true);
    setError(null);
    setReport(null);
    setShowAllRecalls(false);
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('vin', cleaned);
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    } catch {}
    try {
      const res = await fetch(`/api/vin-report?vin=${encodeURIComponent(cleaned)}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Lookup failed — try again.');
      setReport(json as Report);
      track('vin_lookup', { mode, result: 'ok', year: json.vehicle?.model_year || '', make: json.vehicle?.make || '' });
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (e) {
      setError((e as Error).message);
      track('vin_lookup', { mode, result: 'error' });
    } finally {
      setBusy(false);
    }
  }

  // Deep links: /vin?vin=… runs immediately (shareable reports, the blog CTA).
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      const q = new URLSearchParams(window.location.search).get('vin');
      if (q) lookup(q, 'link');
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const v = report?.vehicle;
  const vehicleName = v ? [v.model_year, v.make ? title(v.make) : null, v.model].filter(Boolean).join(' ') : '';
  const topFailure = report?.failures.ok ? report.failures.data.top_failure_components[0] : null;
  const showWarranty = !!topFailure && topFailure.share_pct > WARRANTY_SHARE_THRESHOLD;
  const recalls = report?.recalls.ok ? report.recalls.data : null;
  const visibleRecalls = recalls ? (showAllRecalls ? recalls.recalls : recalls.recalls.slice(0, 5)) : [];

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(vin, 'typed');
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="vin-input" className="sr-only">Vehicle identification number</label>
        <input
          id="vin-input"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={20}
          required
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          placeholder="Enter a 17-character VIN"
          className="w-full rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 py-3.5 font-mono text-base tracking-[0.12em] text-slate-100 placeholder:tracking-normal placeholder:text-slate-500 focus:border-blue-500/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/15 px-6 py-3.5 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/25 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {busy ? 'Checking…' : 'Check VIN free'}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => lookup(DEMO_VIN, 'demo')}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-blue-400/90 hover:text-blue-300 disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> No VIN handy? Try the demo car
        </button>
        <span>Free · no signup · official U.S. government safety data</span>
      </div>

      {error ? (
        <p role="alert" className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/[0.06] px-4 py-3 text-sm leading-6 text-rose-200">
          {error}
        </p>
      ) : null}

      <div ref={resultsRef} className="scroll-mt-24" />

      {busy ? (
        <div className="mt-8 space-y-4" aria-busy="true" aria-live="polite">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Decoding VIN · pulling recalls, complaints, crash tests and fuel economy…
          </p>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <div className="h-6 w-2/3 animate-pulse rounded bg-white/[0.08]" />
            <Skeleton className="mt-4" lines={2} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {['Safety recalls', 'What actually breaks', 'Crash-test ratings', 'Fuel economy'].map((k) => (
              <div key={k} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600">{k}</p>
                <Skeleton className="mt-4" lines={4} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {report && v ? (
        <div className="mt-8 space-y-4">
          {/* ── Decoded vehicle ─────────────────────────────────────────── */}
          <section className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.05] p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
              Decoded · {report.vin}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              {vehicleName}
              {v.trim ? <span className="text-slate-400"> {v.trim}</span> : null}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs">
              {[
                v.body_class,
                [litres(v.engine.displacement_l), v.engine.cylinders ? `${v.engine.cylinders}-cyl` : null].filter(Boolean).join(' '),
                v.engine.horsepower ? `${v.engine.horsepower} hp` : null,
                v.engine.fuel_type,
                [v.transmission.style, v.transmission.speeds ? `${v.transmission.speeds}-spd` : null].filter(Boolean).join(' '),
                v.drive_type,
                v.doors ? `${v.doors} doors` : null,
              ]
                .filter((x) => x && String(x).trim())
                .map((chip) => (
                  <li key={String(chip)} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-slate-300">
                    {chip}
                  </li>
                ))}
            </ul>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {prettyPlace(v) ? (
                <div className="flex gap-2">
                  <dt className="shrink-0 text-slate-500">Built in</dt>
                  <dd className="text-slate-200">{prettyPlace(v)}</dd>
                </div>
              ) : null}
              {v.manufacturer ? (
                <div className="flex gap-2">
                  <dt className="shrink-0 text-slate-500">Manufacturer</dt>
                  <dd className="text-slate-200">{title(v.manufacturer)}</dd>
                </div>
              ) : null}
              {v.gvwr ? (
                <div className="flex gap-2 sm:col-span-2">
                  <dt className="shrink-0 text-slate-500">Weight class</dt>
                  <dd className="text-slate-200">{v.gvwr}</dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-4 font-mono text-[11px] text-slate-500">
              {v.check_digit_ok ? '✓ Check digit (position 9) verified — this VIN is internally consistent.' : v.decode_status ? `Decoder note: ${v.decode_status.replace(/^\d+\s*-\s*/, '')}` : null}
            </p>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            {/* ── Recalls ─────────────────────────────────────────────── */}
            <SectionCard
              kicker="Safety recalls"
              accent={recalls && recalls.do_not_drive > 0 ? 'border-rose-500/40' : recalls && recalls.park_outside > 0 ? 'border-orange-500/40' : undefined}
              heading={
                report.recalls.ok
                  ? recalls!.matched === 0
                    ? 'No safety recalls on file'
                    : `${recalls!.matched} recall${recalls!.matched === 1 ? '' : 's'} on this year, make and model`
                  : 'Safety recalls'
              }
            >
              {!report.recalls.ok ? (
                <Unavailable error={report.recalls.error} />
              ) : recalls!.matched === 0 ? (
                <p className="text-sm leading-6 text-slate-400">
                  Zero is a real answer: no recall campaign has been opened for this year, make and model. Sign up below and we&apos;ll tell you if that changes.
                </p>
              ) : (
                <>
                  {recalls!.do_not_drive > 0 || recalls!.park_outside > 0 ? (
                    <p className="mb-3 flex items-start gap-2 text-sm leading-6 text-rose-200">
                      <AlertTriangle className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                      <span>
                        {recalls!.do_not_drive > 0 ? `${recalls!.do_not_drive} campaign${recalls!.do_not_drive === 1 ? '' : 's'} carry a do-not-drive warning. ` : ''}
                        {recalls!.park_outside > 0 ? `${recalls!.park_outside} say park outside (fire risk). ` : ''}
                        Confirm whether this specific car had the repair done before you drive it.
                      </span>
                    </p>
                  ) : null}
                  <ul className="divide-y divide-white/[0.05]">
                    {visibleRecalls.map((r) => (
                      <RecallRow key={r.campaign_number + r.component} r={r} />
                    ))}
                  </ul>
                  {recalls!.recalls.length > 5 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllRecalls((s) => !s)}
                      className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                    >
                      {showAllRecalls ? 'Show fewer' : `Show all ${recalls!.recalls.length}`}
                    </button>
                  ) : null}
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {recalls!.matched_as ? <>Filed under {recalls!.matched_as.map(title).join(' / ')}. </> : null}
                    Recalls are issued per year/make/model. Whether <em>this</em> car had the fix done is a dealer or history-report question.
                  </p>
                </>
              )}
            </SectionCard>

            {/* ── What actually breaks (headliner) ─────────────────────── */}
            <SectionCard
              id="failures"
              kicker="What actually breaks on this car"
              accent="border-amber-400/25"
              heading={
                report.failures.ok
                  ? report.failures.data.total_complaints === 0
                    ? 'No owner complaints on file'
                    : `${report.failures.data.total_complaints.toLocaleString('en-US')} owner complaints on file`
                  : 'Owner complaints'
              }
            >
              {!report.failures.ok ? (
                <Unavailable error={report.failures.error} />
              ) : report.failures.data.total_complaints === 0 ? (
                <p className="text-sm leading-6 text-slate-400">
                  No owner has filed a defect complaint with the government for this year, make and model. That usually means a rare or very new vehicle, not a perfect one.
                </p>
              ) : (
                <>
                  <ol className="space-y-2.5">
                    {report.failures.data.top_failure_components.slice(0, 6).map((f, i) => (
                      <li key={f.component}>
                        <div className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate text-slate-200">
                            <span className="mr-2 font-mono text-[11px] text-slate-500">{i + 1}</span>
                            {prettyComponent(f.component)}
                          </span>
                          <span className="shrink-0 font-mono text-[12px] text-slate-400">
                            {f.complaints.toLocaleString('en-US')} · <span className={i === 0 ? 'text-amber-300' : ''}>{f.share_pct}%</span>
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                          <div
                            className={i === 0 ? 'h-full rounded-full bg-amber-400/80' : 'h-full rounded-full bg-blue-400/50'}
                            style={{ width: `${Math.max(2, f.share_pct)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ol>
                  <dl className="mt-4 grid grid-cols-4 gap-2 rounded-xl border border-white/[0.06] bg-black/20 p-3 text-center">
                    {(
                      [
                        ['Crashes', report.failures.data.severity_totals.crashes],
                        ['Fires', report.failures.data.severity_totals.fires],
                        ['Injuries', report.failures.data.severity_totals.injuries],
                        ['Deaths', report.failures.data.severity_totals.deaths],
                      ] as const
                    ).map(([k, n]) => (
                      <div key={k}>
                        <dd className={`font-mono text-lg ${n > 0 && (k === 'Deaths' || k === 'Fires') ? 'text-rose-300' : 'text-slate-100'}`}>{n.toLocaleString('en-US')}</dd>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{k}</dt>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {report.failures.data.matched_as ? <>Complaints filed under {report.failures.data.matched_as.map(title).join(' / ')}. </> : null}
                    Share = percentage of all complaints naming that component (one complaint can name several). Compare against the other cars on your shortlist.
                  </p>
                </>
              )}
            </SectionCard>

            {/* ── Crash-test ratings ───────────────────────────────────── */}
            <SectionCard kicker="Crash-test ratings" heading={report.ratings.ok && report.ratings.data ? report.ratings.data.rated_variant.description : 'Government crash tests'}>
              {!report.ratings.ok ? (
                <Unavailable error={report.ratings.error} />
              ) : !report.ratings.data ? (
                <p className="text-sm leading-6 text-slate-400">
                  This year, make and model was never crash-tested by the government program. Not every vehicle is — it says nothing about safety either way.
                </p>
              ) : (
                <>
                  <dl className="space-y-2.5">
                    {(
                      [
                        ['Overall', report.ratings.data.ratings.overall],
                        ['Frontal crash', report.ratings.data.ratings.front_crash],
                        ['Side crash', report.ratings.data.ratings.side_crash],
                        ['Rollover', report.ratings.data.ratings.rollover],
                      ] as const
                    ).map(([k, val]) => (
                      <div key={k} className="flex items-center justify-between gap-3 text-sm">
                        <dt className="text-slate-300">{k}</dt>
                        <dd><Stars value={val} /></dd>
                      </div>
                    ))}
                  </dl>
                  {report.ratings.data.ratings.rollover_probability ? (
                    <p className="mt-3 text-xs text-slate-500">Rollover risk in a single-vehicle crash: {report.ratings.data.ratings.rollover_probability}</p>
                  ) : null}
                  {report.ratings.data.other_variants.length ? (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Also tested: {report.ratings.data.other_variants.map((o) => o.description.replace(/^\d{4}\s+\S+\s+\S+\s*/, '')).join(', ')}
                    </p>
                  ) : null}
                </>
              )}
            </SectionCard>

            {/* ── Fuel economy ─────────────────────────────────────────── */}
            <SectionCard kicker="Fuel economy" heading={report.fuel.ok && report.fuel.data ? `${report.fuel.data.fuel_economy.combined_mpg ?? '—'} MPG combined` : 'Fuel economy'}>
              {!report.fuel.ok ? (
                <Unavailable error={report.fuel.error} />
              ) : !report.fuel.data ? (
                <p className="text-sm leading-6 text-slate-400">
                  No official fuel-economy record for this vehicle. The database covers 1984-and-newer light-duty cars and trucks, so heavy trucks, motorcycles and older cars come back empty.
                </p>
              ) : (
                <>
                  <dl className="grid grid-cols-3 gap-2 text-center">
                    {(
                      [
                        ['City', report.fuel.data.fuel_economy.city_mpg],
                        ['Highway', report.fuel.data.fuel_economy.highway_mpg],
                        ['Combined', report.fuel.data.fuel_economy.combined_mpg],
                      ] as const
                    ).map(([k, n]) => (
                      <div key={k} className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                        <dd className="font-mono text-xl text-slate-100">{n ?? '—'}</dd>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{k} mpg</dt>
                      </div>
                    ))}
                  </dl>
                  {report.fuel.data.fuel_economy.annual_fuel_cost_usd ? (
                    <p className="mt-4 text-sm text-slate-300">
                      About <span className="font-mono text-emerald-300">${report.fuel.data.fuel_economy.annual_fuel_cost_usd.toLocaleString('en-US')}</span> a year in fuel
                      <span className="text-slate-500"> (15,000 miles at current average prices)</span>
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Matched: {report.fuel.data.matched_variant.description}
                    {report.fuel.data.fuel_economy.fuel_type ? ` · ${report.fuel.data.fuel_economy.fuel_type}` : ''}
                    {report.fuel.data.other_variants.length ? ` · ${report.fuel.data.other_variants.length} other engine/transmission option${report.fuel.data.other_variants.length === 1 ? '' : 's'} exist for this model` : ''}
                  </p>
                </>
              )}
            </SectionCard>
          </div>

          {/* ── Monetization slot 1: history-report affiliates ──────────── */}
          <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">Next step</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-50">Want the full title, accident and odometer history for this exact car?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Everything above is about the year, make and model. Whether <em>this</em> VIN was wrecked, flooded, rolled back or branded salvage lives in licensed title databases. These partners sell that report per VIN:
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {[
                { key: 'bumper', label: 'Bumper vehicle history' },
                { key: 'epicvin', label: 'EpicVIN report' },
              ].map((p) => (
                <a
                  key={p.key}
                  href={`/go/${p.key}?vin=${encodeURIComponent(report.vin)}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  data-umami-event="affiliate_click"
                  data-umami-event-partner={p.key}
                  data-umami-event-slot="history"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-emerald-300/70 hover:bg-emerald-400/20"
                >
                  {p.label} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </section>

          {/* ── Monetization slot 2: warranty angle ─────────────────────── */}
          {showWarranty && topFailure ? (
            <section className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.04] p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300/80">Worth knowing</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                Worried about the {prettyComponent(topFailure.component).toLowerCase()}?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {topFailure.share_pct}% of all complaints on this {vehicleName} name it. A component that dominant is exactly what an extended warranty or service contract is priced around — read the exclusions before you sign anything.
              </p>
              <a
                href={`/go/warranty?vin=${encodeURIComponent(report.vin)}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                data-umami-event="affiliate_click"
                data-umami-event-partner="warranty"
                data-umami-event-slot="warranty"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-amber-300/70 hover:bg-amber-400/20"
              >
                Extended-warranty options <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </section>
          ) : null}

          {/* ── Monetization slot 3: recall alert email capture ─────────── */}
          <section className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.05] p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Free recall alerts</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-50">Get an email if a recall is ever issued for this VIN</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Recalls land years after a car is sold. We&apos;ll watch the {vehicleName} for you and email only when a new campaign opens. No newsletter, no spam.
            </p>
            <div className="mt-4">
              <RecallAlertSignup vin={report.vin} vehicle={vehicleName} />
            </div>
          </section>

          <p className="text-xs leading-5 text-slate-600">
            Source: {report.sources} Fetched {new Date(report.fetched_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            {report.cached ? ' (cached, refreshes every 30 min)' : ''}. Recalls, complaints and ratings apply to the year/make/model; this page does not know this specific car&apos;s title or repair history.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function RecallAlertSignup({ vin, vehicle }: { vin: string; vehicle: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'busy') return;
    setState('busy');
    try {
      const res = await fetch('/api/vin-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, vin, vehicle }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(body?.error ?? 'Something went wrong — try again.');
        return;
      }
      setState('done');
      setMessage(`Watching ${vin}. You'll hear from us only if a new recall opens for it.`);
      track('alert_signup', { source: 'vin' });
    } catch {
      setState('error');
      setMessage('Network error — try again.');
    }
  }

  if (state === 'done') return <p className="text-sm leading-7 text-emerald-300">{message}</p>;

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email for recall alerts"
        className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === 'busy'}
        className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-50"
      >
        {state === 'busy' ? 'Adding…' : 'Alert me'}
      </button>
      {state === 'error' ? <p className="text-sm text-rose-300 sm:w-full">{message}</p> : null}
    </form>
  );
}
