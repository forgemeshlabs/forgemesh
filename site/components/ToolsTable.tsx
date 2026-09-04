'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { ToolGroup, ToolRow } from '@/lib/tools-catalog';

const COST_CHIP: Record<ToolRow['cost'], { label: string; cls: string }> = {
  free: { label: 'free', cls: 'text-emerald-300 bg-emerald-400/10' },
  paid: { label: 'paid', cls: 'text-amber-300 bg-amber-400/10' },
  npm: { label: 'npm', cls: 'text-blue-300 bg-blue-400/10' },
};

const FOR_LABEL: Record<ToolRow['for'][number], string> = { humans: 'people', agents: 'agents', builders: 'builders' };

function matches(r: ToolRow, q: string) {
  if (!q) return true;
  const hay = `${r.name} ${r.what} ${r.cost} ${r.price ?? ''} ${r.for.join(' ')}`.toLowerCase();
  return q.split(/\s+/).every((t) => hay.includes(t));
}

export function ToolsTable({ groups }: { groups: ToolGroup[] }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const visible = useMemo(
    () => groups.map((g) => ({ ...g, rows: g.rows.filter((r) => matches(r, q)) })).filter((g) => g.rows.length),
    [groups, q],
  );
  const shown = visible.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div>
      <div className="sticky top-[6rem] z-30 -mx-4 bg-[#050509]/95 px-4 py-3 backdrop-blur-md sm:-mx-0 sm:px-0">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter: vin, recalls, mcp, free, agents…"
            aria-label="Filter the catalog"
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500/60 focus:outline-none"
          />
        </label>
        <div className="-mx-4 mt-2 flex gap-x-4 overflow-x-auto whitespace-nowrap px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 sm:mx-0 sm:flex-wrap sm:px-0">
          <span className="shrink-0">{shown} rows</span>
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="shrink-0 hover:text-slate-300">
              {g.title}
            </a>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-slate-400">Nothing matches “{query}”. Try a shorter word.</p>
      ) : null}

      {visible.map((g) => (
        <section key={g.id} id={g.id} className="mt-8 scroll-mt-36">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-lg font-semibold text-slate-50">{g.title}</h2>
            <p className="text-xs text-slate-500">{g.blurb}</p>
          </div>
          <div className="mt-3 overflow-x-auto rounded-lg border border-white/[0.08]">
            <table className="w-full text-left text-sm sm:min-w-[520px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="w-[42%] px-3 py-2 font-medium sm:w-auto">Name</th>
                  <th className="px-3 py-2 font-medium">What it does</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">Cost</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">For</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => {
                  const ext = r.href.startsWith('http');
                  const chip = COST_CHIP[r.cost];
                  return (
                    <tr key={r.href + r.name} className="border-b border-white/[0.04] align-top last:border-0 hover:bg-blue-500/[0.04]">
                      <td className="px-3 py-2 sm:whitespace-nowrap">
                        <a
                          href={r.href}
                          target={ext ? '_blank' : undefined}
                          rel={ext ? 'noopener noreferrer' : undefined}
                          className={`${r.cost === 'npm' ? 'break-all font-mono text-[12px]' : ''} text-blue-300 hover:text-blue-200`}
                        >
                          {r.name}
                        </a>
                        {ext ? <span className="ml-1 text-slate-600" aria-hidden>↗</span> : null}
                        <div className="mt-1 sm:hidden">
                          <span className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] uppercase ${chip.cls}`}>{chip.label}</span>
                          {r.price ? <span className="ml-1.5 font-mono text-[11px] text-slate-400">{r.price}</span> : null}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-300">{r.what}</td>
                      <td className="hidden whitespace-nowrap px-3 py-2 sm:table-cell">
                        <span className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] uppercase ${chip.cls}`}>{chip.label}</span>
                        {r.price ? <span className="ml-1.5 font-mono text-[11px] text-slate-400">{r.price}</span> : null}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-2 font-mono text-[11px] text-slate-500 sm:table-cell">
                        {r.for.map((f) => FOR_LABEL[f]).join(', ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
