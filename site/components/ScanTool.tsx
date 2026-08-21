'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

type Grade = 'A' | 'B' | 'C' | 'F';

type FreeScan = {
  mode?: 'single';
  url: string;
  grade: Grade;
  reachable: boolean;
  http_status: number | null;
  is_402: boolean;
  x402_envelope: 'header' | 'body' | 'missing';
  envelope_valid: boolean;
  mpp_dual_stack: boolean;
  method_used: string;
  response_time_ms: number;
  first_finding: string | null;
  findings_count: number;
};

type ServiceScan = {
  mode: 'service';
  origin: string;
  total_routes: number;
  scanned: number;
  summary: Record<Grade, number>;
  mpp_dual_stack_count: number;
  routes: Array<{ url: string; grade: Grade; http_status: number | null; mpp_dual_stack: boolean; first_finding: string | null }>;
};

const GRADE_STYLE: Record<Grade, { ring: string; text: string; label: string }> = {
  A: { ring: 'border-emerald-400/50 bg-emerald-400/10', text: 'text-emerald-300', label: 'Dual-stack healthy — x402 + MPP' },
  B: { ring: 'border-blue-400/50 bg-blue-400/10', text: 'text-blue-300', label: 'Healthy x402 — MPP not detected' },
  C: { ring: 'border-amber-400/50 bg-amber-400/10', text: 'text-amber-300', label: 'Challenges for payment, but agents can’t pay it' },
  F: { ring: 'border-red-400/50 bg-red-400/10', text: 'text-red-300', label: 'Not payable as configured' },
};

export function ScanTool() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FreeScan | null>(null);
  const [service, setService] = useState<ServiceScan | null>(null);

  // Umami is loaded globally from the root layout; window.umami is absent
  // when the tracker is blocked or not yet loaded — always optional-chain.
  const track = (event: string, data?: Record<string, string>) =>
    (window as unknown as { umami?: { track: (e: string, d?: object) => void } }).umami?.track(event, data);

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    setScanning(true);
    setError(null);
    setResult(null);
    setService(null);
    track('scan-start');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Scan failed');
      if (json.mode === 'service') setService(json as ServiceScan);
      else setResult(json as FreeScan);
      track('scan-complete', { mode: json.mode === 'service' ? 'service' : 'free' });
    } catch (e) {
      setError((e as Error).message);
      track('scan-error');
    } finally {
      setScanning(false);
    }
  }

  async function buy(endpoint: '/api/scan/checkout' | '/api/watch/checkout', buyUrl: string) {
    setBuying(true);
    setError(null);
    track('scan-buy-click', { product: endpoint.includes('watch') ? 'watch' : 'scan-report' });
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: buyUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Checkout failed');
      window.location.href = json.checkout_url;
    } catch (e) {
      setError((e as Error).message);
      setBuying(false);
    }
  }

  const g = result ? GRADE_STYLE[result.grade] : null;
  const hiddenFindings = result ? Math.max(0, result.findings_count - 1) : 0;

  return (
    <div>
      <form onSubmit={scan} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="your-api.com/route — or just the domain to scan the whole service"
          className="w-full rounded border border-white/[0.12] bg-white/[0.03] px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={scanning}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-6 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20 disabled:opacity-50"
        >
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {scanning ? 'Scanning…' : 'Scan free'}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded border border-red-400/30 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">{error}</p>
      ) : null}

      {service ? (
        <div className="mt-8 rounded border border-white/[0.08] bg-white/[0.02] p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Service scan · {service.origin}</p>
          <p className="mt-3 text-base text-slate-300">
            Scanned <strong className="text-slate-100">{service.scanned}</strong> of{' '}
            <strong className="text-slate-100">{service.total_routes}</strong> listed routes
            {service.mpp_dual_stack_count > 0 ? <> · {service.mpp_dual_stack_count} MPP dual-stack</> : null}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['A', 'B', 'C', 'F'] as const).map((gr) =>
              service.summary[gr] > 0 ? (
                <span key={gr} className={`rounded border px-3 py-1.5 font-mono text-xs ${GRADE_STYLE[gr].ring} ${GRADE_STYLE[gr].text}`}>
                  {gr} × {service.summary[gr]}
                </span>
              ) : null,
            )}
          </div>
          <ul className="mt-5 space-y-2">
            {service.routes.map((r) => (
              <li key={r.url} className="flex items-start gap-3 rounded border border-white/[0.05] bg-white/[0.015] p-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border font-mono text-sm ${GRADE_STYLE[r.grade].ring} ${GRADE_STYLE[r.grade].text}`}>
                  {r.grade}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-slate-300">{r.url.replace(service.origin, '')}</p>
                  {r.grade !== 'A' && r.first_finding ? (
                    <p className="mt-1 text-xs leading-5 text-slate-500">{r.first_finding.slice(0, 140)}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded border border-blue-500/25 bg-blue-500/[0.06] p-5">
            <p className="text-sm leading-7 text-slate-300">
              The <strong className="text-slate-100">$5 full service report</strong> scans up to 25 routes with every
              finding and fix — and re-scans the whole service free on every load.
            </p>
            <button
              onClick={() => buy('/api/scan/checkout', service.origin)}
              disabled={buying}
              className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20 disabled:opacity-50"
            >
              {buying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Full service report — $5 once <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <p className="mt-3 text-xs text-slate-500">Watching a service daily? Buy Watch on an individual route — scan one above.</p>
          </div>
        </div>
      ) : null}

      {result && g ? (
        <div className="mt-8 rounded border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex items-center gap-5">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded border text-4xl font-semibold ${g.ring} ${g.text}`}>
              {result.grade}
            </div>
            <div>
              <p className={`text-base font-medium ${g.text}`}>{g.label}</p>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {result.http_status ?? 'unreachable'} · envelope: {result.x402_envelope} · {result.method_used} ·{' '}
                {result.response_time_ms}ms{result.mpp_dual_stack ? ' · MPP ✓' : ''}
              </p>
            </div>
          </div>

          {result.first_finding ? (
            <p className="mt-5 border-l-2 border-white/[0.12] pl-4 text-sm leading-7 text-slate-300">{result.first_finding}</p>
          ) : null}

          <div className="mt-6 rounded border border-blue-500/25 bg-blue-500/[0.06] p-5">
            <p className="text-sm leading-7 text-slate-300">
              {hiddenFindings > 0 ? (
                <>
                  <strong className="text-slate-100">
                    {hiddenFindings} more finding{hiddenFindings === 1 ? '' : 's'}
                  </strong>{' '}
                  plus the exact fixes — code snippets, envelope examples, and the middleware checks that catch each
                  problem — in the full report.
                </>
              ) : (
                <>The full report adds fix guidance, your decoded payment terms, and a re-scannable link to verify after every deploy.</>
              )}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => result && buy('/api/scan/checkout', result.url)}
                disabled={buying}
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20 disabled:opacity-50"
              >
                {buying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Full report + fixes — $5 once <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                onClick={() => result && buy('/api/watch/checkout', result.url)}
                disabled={buying}
                className="inline-flex items-center justify-center gap-2 rounded border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-emerald-400/70 hover:bg-emerald-500/20 disabled:opacity-50"
              >
                {buying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Watch it daily — $5/mo
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Stripe checkout. The report is a permanent page that re-scans free on every load; Watch emails you the
              day anything breaks.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
