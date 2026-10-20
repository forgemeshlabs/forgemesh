'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { QuantumReport } from '@/lib/quantum-check';

const track = (event: string, data?: Record<string, string | number>) =>
  (window as unknown as { umami?: { track: (e: string, d?: object) => void } }).umami?.track(event, data);

const verdictLabel: Record<QuantumReport['verdict'], string> = {
  ready: 'Ready', 'ready-with-gaps': 'Ready, with gaps', partial: 'Partial', exposed: 'Exposed',
};

export function QuantumChecker({ initial = '' }: { initial?: string }) {
  const [domain, setDomain] = useState(initial);
  const [report, setReport] = useState<QuantumReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    const d = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    if (!d) return;
    setLoading(true); setError(null); setReport(null);
    track('quantum-check', { domain: d });
    try {
      const res = await fetch(`/api/quantum-check?domain=${encodeURIComponent(d)}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      setReport(j);
    } catch (err) { setError((err as Error).message); } finally { setLoading(false); }
  }

  const protectedHost = report?.hndl_exposure === 'protected';

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="quantum-domain">Hostname</label>
        <input id="quantum-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" autoComplete="off" spellCheck={false}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-base text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none" />
        <button type="submit" disabled={loading || !domain.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
          {loading ? 'Probing…' : 'Check'}
        </button>
      </form>
      <p className="text-xs leading-5 text-slate-500">Four live TLS handshakes, one header fetch, one DNS lookup. Read-only, about two seconds, nothing stored. 20 checks per hour per visitor.</p>

      {error && <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.06] p-5 text-sm text-rose-200">{error}</div>}

      {report && (
        <div className="space-y-4" aria-live="polite">
          <div className={`rounded-2xl border p-5 sm:p-6 ${protectedHost ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-amber-500/30 bg-amber-500/[0.06]'}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{report.domain}</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-slate-50">
                  {protectedHost ? <ShieldCheck className="h-6 w-6 text-emerald-400" aria-hidden /> : <ShieldAlert className="h-6 w-6 text-amber-400" aria-hidden />}
                  {verdictLabel[report.verdict]}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{report.hndl_meaning}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-4xl font-semibold text-slate-50">{report.score}<span className="text-lg text-slate-500">/{report.max_score_today}</span></p>
                <p className="text-xs text-slate-500">10 points reserved for PQ certificates</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-50">Checks</h2>
            <ul className="mt-3 divide-y divide-white/[0.06]">
              {report.checks.map((c) => (
                <li key={c.check} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                  <span className={c.ok ? 'text-slate-200' : 'text-slate-400'}>
                    <span className={`mr-2 font-mono ${c.ok ? 'text-emerald-400' : 'text-slate-600'}`} aria-hidden>{c.ok ? '✓' : '–'}</span>
                    {c.check}{c.note ? <span className="block text-xs text-slate-500">{c.note}</span> : null}
                  </span>
                  <span className="shrink-0 font-mono text-slate-400">{c.points}/{c.max}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-400 sm:grid-cols-3">
              <div><dt className="text-slate-500">Negotiated</dt><dd className="font-mono text-slate-200">{report.findings.protocol} · {report.findings.classical_group || '?'}</dd></div>
              <div><dt className="text-slate-500">Cipher</dt><dd className="font-mono text-slate-200">{report.findings.cipher}</dd></div>
              <div><dt className="text-slate-500">Certificate</dt><dd className="font-mono text-slate-200">{report.findings.cert?.key || '?'} · {report.findings.cert?.issuer || '?'} · {report.findings.cert_days_left ?? '?'}d</dd></div>
              <div><dt className="text-slate-500">TLS 1.2</dt><dd className="font-mono text-slate-200">{report.findings.tls12_accepted ? 'accepted' : 'refused'}</dd></div>
              <div><dt className="text-slate-500">HSTS</dt><dd className="font-mono text-slate-200">{report.findings.hsts_max_age != null ? `${Math.round(report.findings.hsts_max_age / 86400)}d` : 'none'}</dd></div>
              <div><dt className="text-slate-500">x402 seller</dt><dd className="font-mono text-slate-200">{report.findings.x402_seller ? 'yes' : 'no'}</dd></div>
            </dl>
          </div>

          {report.recommendations.length > 0 && (
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.05] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-50">What to change</h2>
              <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-6 text-slate-300">
                {report.recommendations.map((r) => <li key={r}>{r}</li>)}
              </ol>
            </div>
          )}
          <p className="text-xs leading-5 text-slate-500">Checked {new Date(report.checked_at).toLocaleString()} in {report.elapsed_ms} ms{report.cached ? ' (cached)' : ''}. Key exchange decides harvest-now-decrypt-later exposure; certificate signatures stay classical everywhere until post-quantum certificates ship.</p>
        </div>
      )}
    </div>
  );
}
