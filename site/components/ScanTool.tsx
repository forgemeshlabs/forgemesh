'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

type FreeScan = {
  url: string;
  grade: 'A' | 'B' | 'C' | 'F';
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

const GRADE_STYLE: Record<FreeScan['grade'], { ring: string; text: string; label: string }> = {
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

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    setScanning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Scan failed');
      setResult(json as FreeScan);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setScanning(false);
    }
  }

  async function buyReport() {
    if (!result) return;
    setBuying(true);
    setError(null);
    try {
      const res = await fetch('/api/scan/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: result.url }),
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
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-api.com/your-x402-route"
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
            <button
              onClick={buyReport}
              disabled={buying}
              className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20 disabled:opacity-50"
            >
              {buying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Full report + fixes — $5 <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <p className="mt-3 text-xs text-slate-500">One-time payment via Stripe. Re-scan the same URL free from your report page.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
