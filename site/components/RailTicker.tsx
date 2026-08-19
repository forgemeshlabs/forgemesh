'use client';

import { useEffect, useState } from 'react';

type Pulse = {
  updatedAt: string;
  latest: {
    date: string;
    mppTx: number | null;
    mppVol: number | null;
    mppTxDeltaPct: number | null;
    mppVolDeltaPct: number | null;
    x402Listings: number | null;
    x402ListingsDeltaPct: number | null;
  };
};

function fmt(n: number | null): string {
  if (n == null) return '—';
  return n >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 0 }) : String(n);
}

function delta(pct: number | null) {
  if (pct == null) return null;
  const up = pct >= 0;
  return (
    <span className={up ? 'text-emerald-400/90' : 'text-rose-400/90'}>
      {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

// Site-wide rail ticker under the nav bar — reads the same /rail-pulse.json the
// daily cron rewrites, so it stays current with zero rebuilds. Renders nothing
// until data arrives; marquee pauses on hover and disables for reduced motion.
export function RailTicker() {
  const [pulse, setPulse] = useState<Pulse | null>(null);

  useEffect(() => {
    fetch('/rail-pulse.json')
      .then((r) => (r.ok ? r.json() : null))
      .then(setPulse)
      .catch(() => {});
  }, []);

  if (!pulse?.latest) return null;
  const l = pulse.latest;

  const items = (
    <>
      <span className="mx-6 inline-flex items-center gap-2">
        <span className="text-slate-500">MPP TX</span>
        <span className="text-blue-300">{fmt(l.mppTx)}</span>
        {delta(l.mppTxDeltaPct)}
      </span>
      <span className="mx-6 inline-flex items-center gap-2">
        <span className="text-slate-500">MPP VOL</span>
        <span className="text-blue-300">${fmt(l.mppVol)}</span>
        {delta(l.mppVolDeltaPct)}
      </span>
      <span className="mx-6 inline-flex items-center gap-2">
        <span className="text-slate-500">X402 LISTINGS</span>
        <span className="text-blue-300">{fmt(l.x402Listings)}</span>
        {delta(l.x402ListingsDeltaPct)}
      </span>
      <span className="mx-6 inline-flex items-center gap-2 text-slate-600">
        AS OF {l.date} · RAIL PULSE
      </span>
    </>
  );

  return (
    <a
      href="/#rail-pulse"
      aria-label="Rail Pulse — daily MPP and x402 rail stats"
      className="block overflow-hidden border-t border-white/[0.06] bg-[#050509]/90 backdrop-blur-md"
    >
      <div className="flex h-7 w-max items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-widest rail-ticker-track motion-reduce:animate-none hover:[animation-play-state:paused]">
        {/* content twice for a seamless loop */}
        <span className="flex items-center">{items}</span>
        <span className="flex items-center" aria-hidden="true">{items}</span>
      </div>
    </a>
  );
}
