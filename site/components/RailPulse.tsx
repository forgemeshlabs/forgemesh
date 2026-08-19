'use client';

import { useEffect, useState } from 'react';

type RailPulseData = {
  updatedAt: string;
  latest: {
    date: string;
    mppTx: number;
    mppVol: number;
    mppTxDeltaPct: number | null;
    mppVolDeltaPct: number | null;
    x402Tx: number | null;
    analysis: string;
  };
  history: { date: string; mppTx: number; mppVol: number; x402Tx: number | null }[];
};

function fmtInt(n: number) {
  return n.toLocaleString('en-US');
}

function fmtDelta(pct: number | null) {
  if (pct === null) return null;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 240;
  const h = 40;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full max-w-[240px]" aria-hidden="true">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="rgba(147,197,253,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RailPulse() {
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
  const txDelta = fmtDelta(latest.mppTxDeltaPct);

  return (
    <section className="border-b border-white/[0.06] bg-[#050509] px-6 py-6" id="rail-pulse">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 rounded border border-white/[0.06] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
              Rail Pulse &middot; {latest.date}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-semibold tracking-tight text-slate-50">
                {fmtInt(latest.mppTx)}
              </span>
              <span className="text-sm text-slate-400">MPP transactions</span>
              {txDelta && (
                <span
                  className={
                    latest.mppTxDeltaPct !== null && latest.mppTxDeltaPct >= 0
                      ? 'text-sm text-blue-300'
                      : 'text-sm text-slate-400'
                  }
                >
                  {txDelta} vs prior day
                </span>
              )}
              {latest.x402Tx !== null && (
                <span className="text-sm text-slate-400">
                  &middot; {fmtInt(latest.x402Tx)} x402 tx
                </span>
              )}
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{latest.analysis}</p>
          </div>
          <div className="flex shrink-0 items-end">
            <Sparkline values={history.map((h) => h.mppTx)} />
          </div>
        </div>
      </div>
    </section>
  );
}
