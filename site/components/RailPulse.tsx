'use client';

import { useEffect, useId, useState } from 'react';

type RailPulseData = {
  updatedAt: string;
  latest: {
    date: string;
    mppTx: number;
    mppVol: number;
    mppTxDeltaPct: number | null;
    mppVolDeltaPct: number | null;
    x402Tx: number | null;
    x402Listings: number | null;
    x402ListingsDeltaPct: number | null;
    x402Tx30d?: number | null;
    x402Vol30d?: number | null;
    x402TxDeltaPct?: number | null;
    x402VolDeltaPct?: number | null;
    x402TxSpark?: number[] | null;
    x402VolSpark?: number[] | null;
    baseListings?: number | null;
    solanaListings?: number | null;
    analysis: string;
    analysisParts?: string[];
    sourceNote?: string;
  };
  history: { date: string; mppTx: number; mppVol: number; x402Tx: number | null; x402Listings?: number | null }[];
};

function fmtInt(n: number) {
  return n.toLocaleString('en-US');
}

function fmtUsd(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 10000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function DeltaChip({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct >= 0;
  const sign = up ? '▲' : '▼';
  return (
    <span
      className={
        up
          ? 'inline-flex items-center gap-1 rounded-full bg-blue-400/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-300'
          : 'inline-flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-0.5 font-mono text-[11px] font-medium text-rose-300'
      }
    >
      <span aria-hidden="true">{sign}</span>
      {Math.abs(pct).toFixed(1)}%
      <span className="font-normal text-slate-500">d/d</span>
    </span>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const gradId = useId();
  if (values.length < 2) return null;
  const w = 240;
  const h = 56;
  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / span) * (h - pad * 2),
  }));
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${pad},${h} ${line} ${w - pad},${h}`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-14 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(147,197,253,0.28)" />
          <stop offset="100%" stopColor="rgba(147,197,253,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline
        points={line}
        fill="none"
        stroke="rgba(147,197,253,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="3" fill="#93c5fd" />
    </svg>
  );
}

function Tile({
  label,
  value,
  delta,
  spark,
  children,
}: {
  label: string;
  value?: string;
  delta?: number | null;
  spark?: number[];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      {value !== undefined && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-[26px] font-semibold leading-none tracking-tight text-slate-50 tabular-nums">
            {value}
          </span>
          {delta !== undefined && <DeltaChip pct={delta} />}
        </div>
      )}
      {spark && <Sparkline values={spark} />}
      {children}
    </div>
  );
}

// embedded: rendered inside the Hero under the "Every Builder Belongs" link —
// drops the standalone section chrome (border, bg, px) and forces text-left.
export function RailPulse({ embedded = false }: { embedded?: boolean }) {
  const [data, setData] = useState<RailPulseData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/rail-pulse.json')
      .then((r) => {
        if (!r.ok) throw new Error(`status ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || !data) return null;

  const { latest, history } = data;
  const base = latest.baseListings ?? null;
  const sol = latest.solanaListings ?? null;
  const railTotal = base !== null && sol !== null ? Math.max(1, base + sol) : null;
  const basePct = railTotal !== null && base !== null ? (base / railTotal) * 100 : null;
  const solPct = railTotal !== null && sol !== null ? (sol / railTotal) * 100 : null;

  return (
    <section
      className={
        embedded
          ? 'scroll-mt-24 w-full py-6 text-left'
          : 'scroll-mt-24 border-b border-white/[0.06] bg-[#050509] px-6 py-8'
      }
      id="rail-pulse"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-300" />
            </span>
            Rail Pulse
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
            {latest.date} &middot; live agent-payment telemetry, refreshed 4×/day
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Tile
            label="MPP transactions"
            value={fmtInt(latest.mppTx)}
            delta={latest.mppTxDeltaPct}
            spark={history.map((h) => h.mppTx)}
          />
          <Tile
            label="MPP volume (USDC)"
            value={fmtUsd(latest.mppVol)}
            delta={latest.mppVolDeltaPct}
            spark={history.map((h) => h.mppVol)}
          />
          {latest.x402Tx30d != null && (
            <Tile
              label="x402 transactions · 30d"
              value={fmtInt(latest.x402Tx30d)}
              delta={latest.x402TxDeltaPct ?? null}
              spark={latest.x402TxSpark ?? undefined}
            />
          )}
          {latest.x402Vol30d != null && (
            <Tile
              label="x402 volume (USDC) · 30d"
              value={fmtUsd(latest.x402Vol30d)}
              delta={latest.x402VolDeltaPct ?? null}
              spark={latest.x402VolSpark ?? undefined}
            />
          )}
          {latest.x402Listings !== null && (
            <Tile
              label="x402 catalog listings"
              value={fmtInt(latest.x402Listings)}
              delta={latest.x402ListingsDeltaPct}
              spark={
                history.every((h) => typeof h.x402Listings === 'number')
                  ? history.map((h) => h.x402Listings as number)
                  : undefined
              }
            />
          )}
          {basePct !== null && solPct !== null && (
            <Tile label="Live listings by rail">
              <div className="mt-3 flex h-2.5 w-full gap-[2px]" role="img" aria-label={`Base ${basePct.toFixed(1)} percent, Solana ${solPct.toFixed(1)} percent of live listings`}>
                <span className="rounded-full bg-blue-300" style={{ width: `${basePct}%` }} />
                <span className="min-w-[4px] rounded-full bg-slate-500" style={{ width: `${solPct}%` }} />
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-blue-300" aria-hidden="true" />
                  Base
                  <span className="ml-auto font-semibold text-slate-50 tabular-nums">{basePct.toFixed(1)}%</span>
                </p>
                <p className="flex items-center gap-2 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-slate-500" aria-hidden="true" />
                  Solana
                  <span className="ml-auto font-semibold text-slate-300 tabular-nums">{solPct.toFixed(1)}%</span>
                </p>
              </div>
            </Tile>
          )}
        </div>

        <div className="mt-4 max-w-3xl">
          <ul className="space-y-1.5">
            {(latest.analysisParts ?? latest.analysis.replace(/\.\s*Self-reported[^.]*\.\s*$/, '').split(/;\s+/)).map(
              (part) => (
                <li key={part} className="flex gap-2.5 text-sm leading-6 text-slate-400">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-blue-300/60" aria-hidden="true" />
                  <span>{part.replace(/\.\s*$/, '')}</span>
                </li>
              )
            )}
          </ul>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600">
            {latest.sourceNote ?? 'Self-reported dashboard data.'}
          </p>
        </div>
      </div>
    </section>
  );
}
