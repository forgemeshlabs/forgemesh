'use client';

// The one canonical x402 Verified directory. Renders fully with initial props (no client
// fetch, no loading state) so it works without JS too — filters/sort are progressive
// enhancement on top of a complete server-rendered table.
import { useMemo, useState } from 'react';
import { Star, DollarSign } from 'lucide-react';
import {
  type VerifiedSeller,
  BAND_COLOR,
  BAND_LABEL,
  DELISTED_COLOR,
  GOLD_COLOR,
  PAID_COLOR,
  cheapestEndpoint,
} from '@/lib/verified';

type SortKey = 'score' | 'reliability' | 'price' | 'recent';
type BandFilter = 'all' | 'excellent' | 'ready' | 'friction' | 'at-risk';
type ProtocolFilter = 'all' | 'mpp-detected';

const NETWORK_LABEL: Record<string, string> = { 'eip155:8453': 'Base' };
function networkLabel(id: string): string {
  return NETWORK_LABEL[id] ?? id;
}

function StatusPill({ status }: { status: VerifiedSeller['status'] }) {
  const style =
    status === 'active'
      ? 'border-emerald-500/40 text-emerald-300'
      : status === 'degraded'
        ? 'border-amber-500/40 text-amber-300'
        : 'border-white/[0.15] text-slate-500';
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${style}`}>
      {status}
    </span>
  );
}

function ScoreChip({ seller }: { seller: VerifiedSeller }) {
  const delisted = seller.status === 'delisted';
  const color = delisted ? DELISTED_COLOR : BAND_COLOR[seller.score_band];
  const text = delisted ? 'delisted' : `${seller.score}/100`;
  return (
    <span
      className="inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-semibold"
      style={{ borderColor: `#${color}66`, color: `#${color}`, background: `#${color}1a` }}
      title={delisted ? 'delisted' : `${BAND_LABEL[seller.score_band]} (${seller.score}/100)`}
    >
      {text}
    </span>
  );
}

function SellerRow({ seller }: { seller: VerifiedSeller }) {
  const cheapest = cheapestEndpoint(seller);
  const declared = new Set(seller.networks);
  const extraDetected = (seller.networks_detected || []).filter((n) => !declared.has(n)).length;
  const mppDetected = !!seller.protocol_capabilities?.mpp?.supported;

  return (
    <li className="rounded border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-blue-500/30 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <a href={`/partners/${seller.slug}`} className="text-base font-semibold text-slate-100 hover:text-blue-300">
          {seller.name}
        </a>
        <ScoreChip seller={seller} />
        {seller.perfect ? (
          <span
            className="inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs font-semibold"
            style={{ borderColor: `#${GOLD_COLOR}66`, color: `#${GOLD_COLOR}`, background: `#${GOLD_COLOR}1a` }}
            title="Perfect: scores exactly 100/100"
          >
            <Star className="h-3 w-3 fill-current" aria-hidden /> Perfect
          </span>
        ) : null}
        {seller.forgemesh_paid ? (
          <span
            className="inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs font-semibold"
            style={{ borderColor: `#${PAID_COLOR}66`, color: `#${PAID_COLOR}`, background: `#${PAID_COLOR}1a` }}
            title="ForgeMesh Paid: ForgeMesh itself completed and verified a real x402 transaction with this seller"
          >
            <DollarSign className="h-3 w-3" aria-hidden /> ForgeMesh Paid
          </span>
        ) : null}
        <StatusPill status={seller.status} />
      </div>

      {seller.description ? <p className="mt-2 text-sm leading-6 text-slate-400">{seller.description}</p> : null}

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
        <span>
          Protocols: x402 ✓{mppDetected ? ' · MPP detected' : ''}
        </span>
        <span>
          Networks: {seller.networks.map(networkLabel).join(', ') || '—'}
          {extraDetected > 0 ? ` · +${extraDetected} detected` : ''}
        </span>
        {cheapest ? (
          <span>
            Cheapest: {cheapest.method} ${cheapest.price_usdc}
          </span>
        ) : null}
        <a href={seller.homepage} target="_blank" rel="noopener noreferrer" className="normal-case tracking-normal text-blue-400/80 hover:text-blue-300">
          {seller.homepage.replace(/^https?:\/\//, '')} ↗
        </a>
      </div>
    </li>
  );
}

export function VerifiedDirectory({
  sellers,
  initialPaidOnly = false,
}: {
  sellers: VerifiedSeller[];
  initialPaidOnly?: boolean;
}) {
  const [paidOnly, setPaidOnly] = useState(initialPaidOnly);
  const [perfectOnly, setPerfectOnly] = useState(false);
  const [band, setBand] = useState<BandFilter>('all');
  const [protocol, setProtocol] = useState<ProtocolFilter>('all');
  const [network, setNetwork] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('score');

  const networks = useMemo(() => {
    const set = new Set<string>();
    for (const s of sellers) {
      for (const n of s.networks) set.add(n);
      for (const n of s.networks_detected || []) set.add(n);
    }
    return [...set];
  }, [sellers]);

  const filtered = useMemo(() => {
    let rows = sellers;
    if (paidOnly) rows = rows.filter((s) => s.forgemesh_paid);
    if (perfectOnly) rows = rows.filter((s) => s.perfect);
    if (band !== 'all') rows = rows.filter((s) => s.score_band === band);
    if (protocol === 'mpp-detected') rows = rows.filter((s) => s.protocol_capabilities?.mpp?.supported);
    if (network !== 'all') {
      rows = rows.filter((s) => s.networks.includes(network) || (s.networks_detected || []).includes(network));
    }

    const sorted = rows.slice();
    if (sort === 'score') sorted.sort((a, b) => b.score - a.score);
    else if (sort === 'reliability') sorted.sort((a, b) => b.dimensions.reliability - a.dimensions.reliability);
    else if (sort === 'price') {
      sorted.sort((a, b) => {
        const pa = Number(cheapestEndpoint(a)?.price_usdc ?? Infinity);
        const pb = Number(cheapestEndpoint(b)?.price_usdc ?? Infinity);
        return pa - pb;
      });
    } else if (sort === 'recent') {
      sorted.sort((a, b) => (b.last_probe || '').localeCompare(a.last_probe || ''));
    }
    return sorted;
  }, [sellers, paidOnly, perfectOnly, band, protocol, network, sort]);

  const selectCls =
    'rounded border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 focus:border-blue-500/50 focus:outline-none';

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] pb-4">
        <label className="inline-flex items-center gap-2 text-xs text-slate-400">
          <input type="checkbox" checked={paidOnly} onChange={(e) => setPaidOnly(e.target.checked)} className="accent-emerald-500" />
          $ ForgeMesh Paid only
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-slate-400">
          <input type="checkbox" checked={perfectOnly} onChange={(e) => setPerfectOnly(e.target.checked)} className="accent-amber-500" />
          ★ Perfect only
        </label>
        <select value={band} onChange={(e) => setBand(e.target.value as BandFilter)} className={selectCls} aria-label="Filter by band">
          <option value="all">All bands</option>
          <option value="excellent">Excellent</option>
          <option value="ready">Ready</option>
          <option value="friction">Friction</option>
          <option value="at-risk">At Risk</option>
        </select>
        <select value={protocol} onChange={(e) => setProtocol(e.target.value as ProtocolFilter)} className={selectCls} aria-label="Filter by protocol">
          <option value="all">x402 (all)</option>
          <option value="mpp-detected">MPP detected</option>
        </select>
        {networks.length > 1 ? (
          <select value={network} onChange={(e) => setNetwork(e.target.value)} className={selectCls} aria-label="Filter by network">
            <option value="all">All networks</option>
            {networks.map((n) => (
              <option key={n} value={n}>
                {networkLabel(n)}
              </option>
            ))}
          </select>
        ) : null}
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectCls} aria-label="Sort by">
          <option value="score">Sort: score</option>
          <option value="reliability">Sort: reliability</option>
          <option value="price">Sort: cheapest route</option>
          <option value="recent">Sort: recently verified</option>
        </select>
        <span className="ml-auto font-mono text-[11px] text-slate-600">
          {filtered.length} of {sellers.length}
        </span>
      </div>

      {filtered.length ? (
        <ul className="mt-5 space-y-3">
          {filtered.map((s) => (
            <SellerRow key={s.slug} seller={s} />
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-slate-500">No sellers match these filters.</p>
      )}
    </div>
  );
}
