'use client';

import { useEffect, useState } from 'react';

type TxWatchItem = {
  at: string;
  tag: string;
  title: string;
  link: string;
};

type TxWatchData = {
  updatedAt: string;
  items: TxWatchItem[];
};

const LABELS: Record<string, string> = {
  datacenter: 'Data Center',
  fab: 'Fab',
  grid: 'Grid',
  local: 'Local',
};

function parseTag(tag: string) {
  // "🏗️ TX/datacenter" -> "Data Center"
  const match = tag.match(/TX\/(\w+)/);
  const key = match ? match[1] : 'other';
  return LABELS[key] || key;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function TxWatchList() {
  const [data, setData] = useState<TxWatchData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/tx-watch.json')
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

  if (failed) {
    return (
      <p className="mt-8 text-sm text-slate-400">
        Feed unavailable right now — check back shortly.
      </p>
    );
  }

  if (!data || data.items.length === 0) {
    return <p className="mt-8 text-sm text-slate-400">No items tracked yet.</p>;
  }

  return (
    <div className="mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
        Last updated {fmtDate(data.updatedAt)}
      </p>
      <ul className="mt-6 space-y-3">
        {data.items.map((item, i) => (
          <li
            key={item.link + i}
            className="rounded border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-blue-500/30"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-blue-300">
                {parseTag(item.tag)}
              </span>
              <span className="text-xs text-slate-400">{fmtDate(item.at)}</span>
            </div>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm leading-6 text-slate-200 transition-colors hover:text-blue-300"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
