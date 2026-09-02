'use client';

import { useMemo, useState } from 'react';

export type CongressTrade = {
  member: string;
  stateDistrict: string | null;
  ticker: string | null;
  asset: string | null;
  type: string;
  amountRange: string | null;
  transactionDate: string | null;
  filingDate: string;
  docId: string | null;
};

export type CongressTradesData = {
  generated: string;
  coverage: { chambers: string[]; note?: string } | null;
  stats: {
    totalTrades: number;
    members: number;
    latestFilingDate: string | null;
    trades30d: number;
    buys30d: number;
    sells30d: number;
  };
  topMembers: {
    member: string;
    stateDistrict: string | null;
    trades: number;
    estVolume: number;
    buys: number;
    sells: number;
  }[];
  topTickers: { ticker: string; trades: number; buys: number; sells: number }[];
  biggest: CongressTrade[];
  latest: CongressTrade[];
};

function typeLabel(t: string) {
  if (t === 'purchase') return 'Buy';
  if (t === 'sale') return 'Sell';
  if (t === 'sale_partial') return 'Sell (partial)';
  if (t === 'exchange') return 'Exchange';
  return t;
}

function TypeChip({ type }: { type: string }) {
  const buy = type === 'purchase';
  return (
    <span
      className={
        buy
          ? 'inline-flex rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-300'
          : 'inline-flex rounded-full bg-rose-400/10 px-2 py-0.5 font-mono text-[11px] font-medium text-rose-300'
      }
    >
      {typeLabel(type)}
    </span>
  );
}

function docUrl(docId: string | null, filingDate: string) {
  if (!docId) return null;
  const year = filingDate.slice(0, 4);
  return `https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/${year}/${docId}.pdf`;
}

export function TradesTable({ trades }: { trades: CongressTrade[] }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'purchase' | 'sale'>('all');
  const [shown, setShown] = useState(50);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trades.filter((t) => {
      if (typeFilter === 'purchase' && t.type !== 'purchase') return false;
      if (typeFilter === 'sale' && !t.type.startsWith('sale')) return false;
      if (!q) return true;
      return (
        t.member.toLowerCase().includes(q) ||
        (t.ticker ?? '').toLowerCase().includes(q) ||
        (t.asset ?? '').toLowerCase().includes(q)
      );
    });
  }, [trades, query, typeFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShown(50);
          }}
          placeholder="Filter by member, ticker, or asset…"
          aria-label="Filter trades"
          className="w-full max-w-xs rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400/50 focus:outline-none"
        />
        <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1 font-mono text-[11px] uppercase tracking-[0.1em]">
          {(['all', 'purchase', 'sale'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setTypeFilter(f);
                setShown(50);
              }}
              className={
                typeFilter === f
                  ? 'rounded-md bg-blue-400/15 px-3 py-1 text-blue-300'
                  : 'rounded-md px-3 py-1 text-slate-500 hover:text-slate-300'
              }
            >
              {f === 'all' ? 'All' : f === 'purchase' ? 'Buys' : 'Sells'}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
          {filtered.length} trades
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Traded</th>
              <th className="px-4 py-3 font-medium">Filed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, shown).map((t, i) => {
              const url = docUrl(t.docId, t.filingDate);
              return (
                <tr key={`${t.docId}-${i}`} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3">
                    <span className="text-slate-100">{t.member}</span>
                    {t.stateDistrict ? (
                      <span className="ml-2 font-mono text-[11px] text-slate-500">{t.stateDistrict}</span>
                    ) : null}
                  </td>
                  <td className="max-w-[240px] px-4 py-3">
                    {t.ticker ? <span className="font-mono text-blue-300">{t.ticker}</span> : null}
                    <span className="ml-2 line-clamp-1 inline text-slate-400">{t.asset}</span>
                  </td>
                  <td className="px-4 py-3">
                    <TypeChip type={t.type} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-slate-300">
                    {t.amountRange ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-slate-400">
                    {t.transactionDate ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-slate-400">
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300">
                        {t.filingDate}
                      </a>
                    ) : (
                      t.filingDate
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {shown < filtered.length ? (
        <button
          onClick={() => setShown((s) => s + 50)}
          className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-300 hover:border-blue-400/40 hover:text-blue-300"
        >
          Show more
        </button>
      ) : null}
    </div>
  );
}

export function AlertSignup() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'busy') return;
    setState('busy');
    try {
      const res = await fetch('/api/trades-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(body?.error ?? 'Something went wrong — try again.');
        return;
      }
      setState('done');
      setMessage("You're on the list. First alert lands when the next notable filing drops.");
    } catch {
      setState('error');
      setMessage('Network error — try again.');
    }
  }

  if (state === 'done') {
    return <p className="text-sm leading-7 text-emerald-300">{message}</p>;
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email for trade alerts"
        className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === 'busy'}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-50"
      >
        {state === 'busy' ? 'Adding…' : 'Get free alerts'}
      </button>
      {state === 'error' ? <p className="text-sm text-rose-300 sm:w-full">{message}</p> : null}
    </form>
  );
}
