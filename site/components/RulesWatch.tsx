'use client';
// Payment Rules Watch — renders public/rules-watch.json, written by
// scripts/rules-watch.js (daily collect cron + Monday digest cron).
// RulesWatchList = full feed on /payment-rules; RulesWatchStrip = compact
// homepage status strip ("are pricing rules being written? no.").
import { useEffect, useState } from 'react';

export type RulesEntry = {
  id: string;
  date: string;
  source: string;
  title: string;
  url: string;
  summary?: string;
  category: 'pricing' | 'rules' | 'news';
};

export type RulesWatchData = {
  lastChecked: string | null;
  pricingRulesDetected: boolean;
  counts: Record<string, number>;
  entries: RulesEntry[];
};

const CHIP: Record<RulesEntry['category'], { label: string; cls: string }> = {
  pricing: { label: 'pricing signal', cls: 'border-rose-400/40 bg-rose-400/10 text-rose-300' },
  rules: { label: 'standards', cls: 'border-amber-400/40 bg-amber-400/10 text-amber-300' },
  news: { label: 'coverage', cls: 'border-sky-400/40 bg-sky-400/10 text-sky-300' },
};

function Chip({ category }: { category: RulesEntry['category'] }) {
  const c = CHIP[category] ?? CHIP.news;
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${c.cls}`}>
      {c.label}
    </span>
  );
}

export function RulesWatchList({ entries }: { entries: RulesEntry[] }) {
  if (!entries.length) {
    return (
      <p className="rounded border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-sm text-slate-400">
        Nothing caught yet — the watcher polls its sources daily. An empty feed is itself the answer:
        nobody is writing agent-payment pricing rules today.
      </p>
    );
  }
  return (
    <ol className="divide-y divide-white/[0.06] rounded border border-white/[0.06] bg-white/[0.02]">
      {entries.map((e) => (
        <li key={e.id} className="px-4 py-4" id={e.id}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-100 hover:text-blue-300"
            >
              {e.title}
            </a>
            <Chip category={e.category} />
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 font-mono text-[11px] text-slate-500">
            <span>{e.source}</span>
            {e.date ? <time dateTime={e.date}>{e.date.slice(0, 10)}</time> : null}
          </div>
          {e.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{e.summary}</p> : null}
        </li>
      ))}
    </ol>
  );
}

// Compact homepage strip: the pricing-rules status light + latest catches.
export function RulesWatchStrip() {
  const [data, setData] = useState<RulesWatchData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/rules-watch.json')
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
  const latest = data.entries.slice(0, 3);

  return (
    <section className="scroll-mt-24 w-full py-6 text-left" id="payment-rules-watch">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Payment Rules Watch</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
            who&rsquo;s writing the rules for agent payments &middot; checked daily
          </p>
        </div>
        <div className="rounded border border-white/[0.06] bg-white/[0.02]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-white/[0.06] px-4 py-2.5">
            {data.pricingRulesDetected ? (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-400" aria-hidden />
                <span className="text-sm font-medium text-rose-300">Pricing-rule signal detected — see the feed</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                <span className="text-sm font-medium text-emerald-300/90">
                  No agent-payment pricing rules proposed anywhere we watch
                </span>
              </>
            )}
            <span className="font-mono text-[11px] text-slate-500">
              standards bodies tracked: authorization &amp; fraud scope only
            </span>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {latest.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
                <a
                  href={`/payment-rules#${encodeURIComponent(e.id)}`}
                  className="min-w-0 flex-1 truncate text-sm text-slate-300 hover:text-blue-300"
                >
                  {e.title}
                </a>
                <Chip category={e.category} />
                {e.date ? <span className="font-mono text-[11px] text-slate-500">{e.date.slice(0, 10)}</span> : null}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          <a href="/payment-rules" className="text-blue-400/80 hover:text-blue-300">
            Full timeline &amp; the story so far →
          </a>{' '}
          Visa, Mastercard, the Agentic Payments Alliance, and what would actually threaten micro-pricing.
        </p>
      </div>
    </section>
  );
}
