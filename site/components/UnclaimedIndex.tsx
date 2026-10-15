// The unclaimed index: x402 origins the Bazaar lists, probed and scored by ForgeMesh with no
// seller input. Server-rendered, 40 rows per page, search and band filter as GET params so
// every page is a plain link a crawler or an agent can walk (/verified?u=3&q=railway#unclaimed).
// Rows here carry no contact and no badge; a claim (router POST /api/verified/claim) or the
// free PR path turns a row into a normal seller record.
import { BAND_COLOR, BAND_LABEL, type ScoreBand } from '@/lib/verified';

export type UnclaimedRowLite = {
  slug: string;
  origin: string;
  name: string;
  description?: string;
  score: number;
  score_band: ScoreBand;
  max_score: number;
  routes_indexed: number;
  cheapest_usdc: string;
  manifest_ok: boolean;
  llms_ok: boolean;
  mpp_detected: boolean;
  ms: number;
  last_probe: string;
};

export type UnclaimedBand = 'all' | 'excellent' | 'ready';
export const UNCLAIMED_PAGE = 40;

export type UnclaimedQuery = { q: string; band: UnclaimedBand; page: number };

/** Parses the three unclaimed params off the page's searchParams. Page is 1-based in the URL. */
export function parseUnclaimedQuery(p: { q?: string; band?: string; u?: string } | undefined): UnclaimedQuery {
  const q = (p?.q || '').toString().trim().slice(0, 80);
  const band: UnclaimedBand = p?.band === 'excellent' || p?.band === 'ready' ? p.band : 'all';
  const n = Number.parseInt((p?.u || '1').toString(), 10);
  return { q, band, page: Number.isFinite(n) && n > 0 ? n : 1 };
}

export function filterUnclaimed(rows: UnclaimedRowLite[], { q, band }: UnclaimedQuery): UnclaimedRowLite[] {
  const needle = q.toLowerCase();
  return rows.filter((r) => {
    if (band !== 'all' && r.score_band !== band) return false;
    if (!needle) return true;
    return (
      r.name.toLowerCase().includes(needle) ||
      r.slug.includes(needle) ||
      r.origin.toLowerCase().includes(needle) ||
      (r.description || '').toLowerCase().includes(needle)
    );
  });
}

function href(q: string, band: UnclaimedBand, page: number): string {
  const sp = new URLSearchParams();
  if (q) sp.set('q', q);
  if (band !== 'all') sp.set('band', band);
  if (page > 1) sp.set('u', String(page));
  const s = sp.toString();
  return `/verified${s ? `?${s}` : ''}#unclaimed`;
}

export function UnclaimedIndex({
  rows,
  query,
  claimPriceUsdc,
}: {
  rows: UnclaimedRowLite[];
  query: UnclaimedQuery;
  claimPriceUsdc: string;
}) {
  const filtered = filterUnclaimed(rows, query);
  const pages = Math.max(1, Math.ceil(filtered.length / UNCLAIMED_PAGE));
  const cur = Math.min(query.page, pages);
  const slice = filtered.slice((cur - 1) * UNCLAIMED_PAGE, cur * UNCLAIMED_PAGE);
  const { q, band } = query;

  return (
    <div>
      <form method="get" action="/verified#unclaimed" className="flex flex-wrap items-center gap-3">
        {band !== 'all' ? <input type="hidden" name="band" value={band} /> : null}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by host or description"
          aria-label="Search unclaimed origins"
          className="w-full max-w-xs rounded border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
        />
        <button type="submit" className="rounded border border-white/[0.1] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400 hover:text-slate-200">
          search
        </button>
        <div className="flex gap-1 font-mono text-[11px] uppercase tracking-[0.12em]">
          {(['all', 'excellent', 'ready'] as UnclaimedBand[]).map((b) => (
            <a
              key={b}
              href={href(q, b, 1)}
              aria-current={band === b ? 'page' : undefined}
              className={`rounded border px-2.5 py-1 ${band === b ? 'border-blue-500/50 bg-blue-500/10 text-blue-200' : 'border-white/[0.1] text-slate-500 hover:text-slate-300'}`}
            >
              {b === 'all' ? 'all' : BAND_LABEL[b]}
            </a>
          ))}
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
          {filtered.length} origin{filtered.length === 1 ? '' : 's'}
          {q ? (
            <>
              {' '}· <a href={href('', band, 1)} className="text-blue-400 hover:text-blue-300">clear</a>
            </>
          ) : null}
        </span>
      </form>

      {slice.length ? (
        <ol className="mt-5 space-y-2" start={(cur - 1) * UNCLAIMED_PAGE + 1}>
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
                    title={`${BAND_LABEL[r.score_band]}: ${r.score} of a possible ${r.max_score} without a proof tx`}
                  >
                    {r.score}/{r.max_score}
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
      ) : (
        <p className="mt-5 rounded border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-slate-500">
          No listed origin matches. Rows under the listing floor stay in{' '}
          <a href="/unclaimed.json" className="text-blue-400 hover:text-blue-300">/unclaimed.json</a>.
        </p>
      )}

      {pages > 1 ? (
        <nav aria-label="Unclaimed index pages" className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
          {cur > 1 ? (
            <a href={href(q, band, cur - 1)} rel="prev" className="rounded border border-white/[0.1] px-2.5 py-1 hover:text-slate-300">← prev</a>
          ) : (
            <span className="rounded border border-white/[0.1] px-2.5 py-1 opacity-40">← prev</span>
          )}
          <span>page {cur} / {pages}</span>
          {cur < pages ? (
            <a href={href(q, band, cur + 1)} rel="next" className="rounded border border-white/[0.1] px-2.5 py-1 hover:text-slate-300">next →</a>
          ) : (
            <span className="rounded border border-white/[0.1] px-2.5 py-1 opacity-40">next →</span>
          )}
          <span className="ml-2 flex flex-wrap gap-1.5">
            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === pages || Math.abs(n - cur) <= 2)
              .map((n, i, arr) => (
                <span key={n} className="flex items-center gap-1.5">
                  {i > 0 && arr[i - 1] !== n - 1 ? <span>…</span> : null}
                  {n === cur ? (
                    <span className="text-blue-200">{n}</span>
                  ) : (
                    <a href={href(q, band, n)} className="hover:text-slate-300">{n}</a>
                  )}
                </span>
              ))}
          </span>
        </nav>
      ) : null}
    </div>
  );
}
