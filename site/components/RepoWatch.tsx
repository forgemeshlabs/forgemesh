// Repo Watch — decoded x402 upstream releases. Data comes from
// public/repo-watch.json, written by scripts/repo-watch.js every 6h.
// RepoWatchList is a plain (server-renderable) list. RepoWatchStrip is the
// compact client-fetched strip embedded in the Hero next to Rail Pulse.
'use client';

import { useEffect, useState } from 'react';

export type RepoWatchEntry = {
  tag: string;
  repo: string;
  sdk: string;
  pkg: 'pypi' | 'npm' | 'go' | string;
  version: string;
  significance: 'security' | 'breaking' | 'chain' | 'feature' | 'minor' | 'patch' | string;
  date: string | null;
  url: string;
  highlights: string[];
  collected: string;
};

export type RepoWatchData = { lastChecked: string | null; entries: RepoWatchEntry[] };

const SIG: Record<string, { label: string; cls: string; dot: string }> = {
  security: { label: 'security', cls: 'border-rose-500/40 text-rose-300', dot: 'bg-rose-400' },
  breaking: { label: 'breaking', cls: 'border-amber-500/40 text-amber-300', dot: 'bg-amber-400' },
  chain: { label: 'new chain', cls: 'border-emerald-500/40 text-emerald-300', dot: 'bg-emerald-400' },
  feature: { label: 'feature', cls: 'border-violet-500/40 text-violet-300', dot: 'bg-violet-400' },
  minor: { label: 'minor', cls: 'border-blue-500/40 text-blue-300', dot: 'bg-blue-400' },
  patch: { label: 'patch', cls: 'border-white/[0.12] text-slate-400', dot: 'bg-slate-500' },
};

const PKG_LABEL: Record<string, string> = { pypi: 'PyPI', npm: 'npm', go: 'Go' };

function semver(v: string) {
  return v.split('.').map((n) => parseInt(n, 10) || 0);
}

/** Newest first: by commit date when known, then semver within an SDK. */
export function sortEntries(entries: RepoWatchEntry[]) {
  return entries.slice().sort((a, b) => {
    const da = a.date ?? '';
    const db = b.date ?? '';
    if (da !== db) return db.localeCompare(da);
    if (a.sdk !== b.sdk) return a.sdk.localeCompare(b.sdk);
    const [am, an, ap] = semver(a.version);
    const [bm, bn, bp] = semver(b.version);
    return bm - am || bn - an || bp - ap;
  });
}

export function SigChip({ significance }: { significance: string }) {
  const s = SIG[significance] ?? SIG.patch;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function RepoWatchList({ entries, limit }: { entries: RepoWatchEntry[]; limit?: number }) {
  const list = sortEntries(entries).slice(0, limit ?? entries.length);
  if (!list.length) {
    return <p className="text-sm text-slate-500">No significant releases tracked yet.</p>;
  }
  return (
    <ol className="relative space-y-5 border-l border-white/[0.08] pl-6">
      {list.map((e, i) => {
        const s = SIG[e.significance] ?? SIG.patch;
        return (
          <li key={e.tag} id={e.tag} className="relative scroll-mt-24">
            <span
              className={`absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-blue-300' : s.dot}`}
              aria-hidden
            />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold tracking-tight text-slate-50 hover:text-blue-300"
              >
                {e.sdk}{' '}
                <span className="font-mono font-medium text-blue-300">v{e.version}</span>
              </a>
              <SigChip significance={e.significance} />
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                {PKG_LABEL[e.pkg] ?? e.pkg}
                {e.date ? (
                  <>
                    {' '}&middot; <time dateTime={e.date}>{e.date}</time>
                  </>
                ) : null}
              </span>
            </div>
            {e.highlights.length ? (
              <ul className="mt-2 space-y-1.5">
                {e.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm leading-6 text-slate-400">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-blue-300/60" aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-sm text-slate-500">
                No changelog notes published for this tag —{' '}
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300">
                  view on GitHub
                </a>
                .
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// Compact strip for the Hero: the 4 most recent significant releases, one line each.
export function RepoWatchStrip() {
  const [data, setData] = useState<RepoWatchData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/repo-watch.json')
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

  if (failed || !data || !data.entries?.length) return null;
  const latest = sortEntries(data.entries).slice(0, 4);

  return (
    <section className="scroll-mt-24 w-full py-6 text-left" id="repo-watch">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Repo Watch</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
            x402 upstream releases, decoded &middot; refreshed 4×/day
          </p>
        </div>
        <ul className="divide-y divide-white/[0.06] rounded border border-white/[0.06] bg-white/[0.02]">
          {latest.map((e) => (
            <li key={e.tag} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
              <a
                href={`/repo-watch#${encodeURIComponent(e.tag)}`}
                className="text-sm font-medium text-slate-100 hover:text-blue-300"
              >
                {e.sdk} <span className="font-mono text-blue-300">v{e.version}</span>
              </a>
              <SigChip significance={e.significance} />
              {e.date ? (
                <span className="font-mono text-[11px] text-slate-500">{e.date}</span>
              ) : null}
              {e.highlights[0] ? (
                <span className="hidden min-w-0 flex-1 truncate text-sm text-slate-400 sm:inline">
                  {e.highlights[0]}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          <a href="/repo-watch" className="text-blue-400/80 hover:text-blue-300">
            Full release feed →
          </a>{' '}
          Major, breaking, security and new-chain releases only. Patch noise filtered.
        </p>
      </div>
    </section>
  );
}
