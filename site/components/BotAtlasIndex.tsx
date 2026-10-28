'use client';
import { useMemo, useState } from 'react';
import type { Bot } from '@/lib/bots';

type Props = {
  bots: Bot[];
  purposes: Record<string, { title: string; short: string; blurb: string }>;
  order: string[];
  seen: Record<string, number>;
  fresh: Record<string, string>;
};

export function BotAtlasIndex({ bots, purposes, order, seen, fresh }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [all, setAll] = useState<boolean | null>(null);
  const t = q.trim().toLowerCase();
  const filtered = useMemo(
    () => bots.filter((b) => !t || [b.name, b.operator, b.purpose, b.robots, b.class, b.match.join(' ')].join(' ').toLowerCase().includes(t)),
    [bots, t],
  );
  const groups = order.map((p) => ({ key: p, ...purposes[p], items: filtered.filter((b) => b.purpose === p) })).filter((g) => g.items.length);
  const isOpen = (k: string) => (t ? true : all !== null ? all : open[k] ?? false);
  return (
    <div>
      <div className="sticky top-[64px] z-10 -mx-6 border-b border-white/[0.06] bg-[#050509]/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a bot, company, purpose or robots.txt token…"
            aria-label="Search bots"
            className="min-w-[260px] flex-1 rounded border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400/60 focus:outline-none"
          />
          <span className="font-mono text-xs text-slate-500">{filtered.length} / {bots.length}</span>
          <button type="button" onClick={() => { setAll(true); setOpen({}); }} className="rounded border border-white/[0.12] px-3 py-1.5 text-xs text-slate-300 hover:border-blue-400/50">Expand all</button>
          <button type="button" onClick={() => { setAll(false); setOpen({}); }} className="rounded border border-white/[0.12] px-3 py-1.5 text-xs text-slate-300 hover:border-blue-400/50">Collapse all</button>
        </div>
      </div>
      {groups.map((g) => (
        <section key={g.key} className="mt-6 rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <button
            type="button"
            onClick={() => { setAll(null); setOpen((o) => ({ ...o, [g.key]: !isOpen(g.key) })); }}
            aria-expanded={isOpen(g.key)}
            className="flex w-full flex-wrap items-baseline gap-3 px-5 py-4 text-left"
          >
            <span className="font-mono text-xs text-slate-500">{isOpen(g.key) ? '▾' : '▸'}</span>
            <span className="text-lg font-semibold text-slate-50">{g.title}</span>
            <span className="rounded-full bg-white/[0.08] px-2 py-0.5 font-mono text-xs text-slate-300">{g.items.length}</span>
            <span className="basis-full pl-6 text-sm text-slate-400">{g.blurb}</span>
          </button>
          {isOpen(g.key) && (
            <ul className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((b) => (
                <li key={b.slug}>
                  <a href={`/bots/${b.slug}`} className="block h-full rounded border border-white/[0.08] bg-[#0a0f1c] p-4 transition hover:border-blue-400/50">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-500/15 font-mono text-xs font-bold text-blue-200" aria-hidden>{b.name.slice(0, 2).toUpperCase()}</span>
                      <span className="truncate text-base font-semibold text-slate-50">{b.name}</span>
                      {fresh[b.name] && <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">new</span>}
                      {seen[b.name] ? <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] text-emerald-200" title="sites that saw it in the last 7 days">{seen[b.name]} sites</span> : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{b.operator || 'Unknown operator'} · {g.short}</p>
                    {b.note && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{b.note}</p>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {!groups.length && <p className="mt-10 rounded border border-dashed border-white/[0.12] p-6 text-center text-slate-400">Nothing matches. If a crawler hits your site under a name that is not here, it appears in the Atlas the day an opted-in site reports it.</p>}
    </div>
  );
}
