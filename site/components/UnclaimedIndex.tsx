'use client';

// The unclaimed index: x402 origins the Bazaar lists, probed and scored by ForgeMesh with no
// seller input. Server-rendered list with client-side search, band filter and paging. Rows
// here carry no contact and no badge; a claim (router POST /api/verified/claim, $5) or the
// free PR path turns a row into a normal seller record.
import { useMemo, useState } from 'react';
import { BAND_COLOR, BAND_LABEL, type ScoreBand } from '@/lib/verified';

export type UnclaimedRowLite = {
  slug: string;
  origin: string;
  name: string;
  description?: string;
  score: number;
  score_band: ScoreBand;
  routes_indexed: number;
  cheapest_usdc: string;
  manifest_ok: boolean;
  llms_ok: boolean;
  mpp_detected: boolean;
  ms: number;
  last_probe: string;
};

type Band = 'all' | 'excellent' | 'ready';
const PAGE = 40;

export function UnclaimedIndex({ rows, claimPriceUsdc }: { rows: UnclaimedRowLite[]; claimPriceUsdc: string }) {
  const [q, setQ] = useState('');
  const [band, setBand] = useState<Band>('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (band !== 'all' && r.score_band !== band) return false;
      if (!needle) return true;
      return r.name.toLowerCase().includes(needle) || r.slug.includes(needle) || r.origin.toLowerCase().includes(needle) || (r.description || '').toLowerCase().includes(needle);
    });
  }, [rows, q, band]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = filtered.slice(cur * PAGE, cur * PAGE + PAGE);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(0); }}
          placeholder="Search by host or description"
          aria-label="Search unclaimed origins"
          className="w-full max-w-xs rounded border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
        />
        <div className="flex gap-1 font-mono text-[11px] uppercase tracking-[0.12em]">
          {(['all', 'excellent', 'ready'] as Band[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => { setBand(b); setPage(0); }}
              className={`rounded border px-2.5 py-1 ${band === b ? 'border-blue-500/50 bg-blue-500/10 text-blue-200' : 'border-white/[0.1] text-slate-500 hover:text-slate-300'}`}
            >
              {b === 'all' ? 'all' : BAND_LABEL[b]}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
          {filtered.length} origin{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      <ol className="mt-5 space-y-2">
        {slice.map((r) => {
          const color = BAND_COLOR[r.score_band];
          return (
            <li key={r.slug} className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <a href={r.origin} target="_blank" rel="noopener noreferrer nofollow" className="text-sm font-semibold text-slate-100 hover:text-blue-300">
                  {r.name}
                </a>
                <span
                  className="inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-semibold"
                  style={{ borderColor: `#${color}66`, color: `#${color}`, background: `#${color}1a` }}
                  title={`${BAND_LABEL[r.score_band]}: ${r.score} of a possible 85 without a proof tx`}
                >
                  {r.score}/85
                </span>
                <span className="rounded-full border border-amber-500/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-amber-300">
                  unclaimed
                </span>
                <a
                  href={`/verified/claim?slug=${encodeURIComponent(r.slug)}`}
                  className="ml-auto rounded border border-blue-500/40 bg-blue-500/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-blue-200 hover:bg-blue-500/20"
                >
                  Claim · ${claimPriceUsdc}
                </a>
              </div>
              {r.description ? <p className="mt-2 text-sm leading-6 text-slate-400">{r.description}</p> : null}
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
                <span>{r.routes_indexed} route{r.routes_indexed === 1 ? '' : 's'} indexed</span>
                <span>from ${r.cheapest_usdc}</span>
                <span>{r.manifest_ok ? 'manifest ✓' : 'no manifest'}</span>
                <span>{r.llms_ok ? 'llms.txt ✓' : 'no llms.txt'}</span>
                {r.mpp_detected ? <span>MPP detected</span> : null}
                <span>{r.ms} ms</span>
                <span className="normal-case tracking-normal">slug {r.slug}</span>
              </div>
            </li>
          );
        })}
      </ol>

      {pages > 1 ? (
        <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
          <button type="button" disabled={cur === 0} onClick={() => setPage(cur - 1)} className="rounded border border-white/[0.1] px-2.5 py-1 disabled:opacity-40">
            ← prev
          </button>
          <span>page {cur + 1} / {pages}</span>
          <button type="button" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} className="rounded border border-white/[0.1] px-2.5 py-1 disabled:opacity-40">
            next →
          </button>
        </div>
      ) : null}
    </div>
  );
}
