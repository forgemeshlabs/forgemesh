'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';

type Check = { id: string; area: string; name: string; status: 'pass' | 'fail' | 'warn' | 'info'; severity: 'high' | 'medium' | 'low' | 'none' };
type Summary = {
  host: string; checked_at: string; score: number; grade: string; passed: number; total: number;
  high: number; medium: number; low: number; findings_count: number; headline: string[]; checks: Check[];
  cached?: boolean; price: string; report_enabled: boolean;
};

const track = (event: string, data?: Record<string, string | number>) =>
  (window as unknown as { umami?: { track: (e: string, d?: object) => void } }).umami?.track(event, data);

const CHECKOUT = 'https://proxy.forgemesh.io/api/sitecheck/checkout';
const dot: Record<Check['status'], string> = { pass: 'text-emerald-400', fail: 'text-rose-400', warn: 'text-amber-400', info: 'text-slate-600' };
const word: Record<Check['status'], string> = { pass: 'pass', fail: 'fail', warn: 'warn', info: 'n/a' };

export function SiteChecker({ initial = '' }: { initial?: string }) {
  const [domain, setDomain] = useState(initial);
  const [email, setEmail] = useState('');
  const [report, setReport] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(e?: React.FormEvent, d0?: string) {
    e?.preventDefault();
    const d = (d0 ?? domain).trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    if (!d) return;
    setLoading(true); setError(null); setReport(null);
    try {
      const res = await fetch(`/api/site-check?domain=${encodeURIComponent(d)}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      setReport(j); track('site-check', { grade: j.grade, findings: j.findings_count });
    } catch (err) { setError((err as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { if (initial) void run(undefined, initial); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [initial]);

  const good = report ? report.score >= 75 : false;
  const areas = report ? Array.from(new Set(report.checks.map((c) => c.area))) : [];

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="site-domain">Domain</label>
        <input id="site-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" autoComplete="off" spellCheck={false}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-base text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none" />
        <button type="submit" disabled={loading || !domain.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
          {loading ? 'Checking…' : 'Check'}
        </button>
      </form>
      <p className="text-xs leading-5 text-slate-500">Passive and read-only: a few DNS lookups, four TLS handshakes, three page fetches. About five seconds. Nothing is stored beyond a ten-minute cache. 20 checks per hour per visitor.</p>

      {error && <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.06] p-5 text-sm text-rose-200">{error}</div>}

      {report && (
        <div className="space-y-4" aria-live="polite">
          <div className={`rounded-2xl border p-5 sm:p-6 ${good ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-amber-500/30 bg-amber-500/[0.06]'}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{report.host}</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-slate-50">
                  {good ? <ShieldCheck className="h-6 w-6 text-emerald-400" aria-hidden /> : <ShieldAlert className="h-6 w-6 text-amber-400" aria-hidden />}
                  {report.findings_count === 0 ? 'Every check passed' : `${report.findings_count} finding${report.findings_count === 1 ? '' : 's'}: ${report.high} high, ${report.medium} medium, ${report.low} low`}
                </p>
                {report.headline.length > 0 && (
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Most important: {report.headline.join(', ')}.</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-mono text-4xl font-semibold text-slate-50">{report.grade}<span className="text-lg text-slate-500"> · {report.score}/100</span></p>
                <p className="text-xs text-slate-500">{report.passed} of {report.total} checks passed</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-50">Checks</h2>
            {areas.map((a) => (
              <div key={a} className="mt-3">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{a}</h3>
                <ul className="mt-1 divide-y divide-white/[0.06]">
                  {report.checks.filter((c) => c.area === a).map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                      <span className={c.status === 'pass' ? 'text-slate-200' : 'text-slate-300'}>
                        <span className={`mr-2 font-mono ${dot[c.status]}`} aria-hidden>●</span>{c.name}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-slate-500">{word[c.status]}{c.status !== 'pass' && c.status !== 'info' && c.severity !== 'none' ? ` · ${c.severity}` : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {report.findings_count > 0 && (
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.05] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-50">Full report with fixes, {report.price}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Every finding with the evidence we saw, what it means for your visitors and your email, and the exact DNS record, server line or CDN switch that fixes it. Ordered as a roadmap. Re-check free for 30 days while you work through it, then print to PDF for your host or your records.
              </p>
              {report.report_enabled ? (
                <form method="post" action={CHECKOUT} className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={() => track('site-check-checkout', { host: report.host })}>
                  <input type="hidden" name="host" value={report.host} />
                  <label className="sr-only" htmlFor="site-email">Email for the report link</label>
                  <input id="site-email" type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none" />
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 py-3 font-semibold text-slate-100 transition hover:border-blue-400/70 hover:bg-blue-500/20">
                    Get the report {report.price} <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </form>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Checkout is not available right now. Write to hello@forgemesh.io.</p>
              )}
              <p className="mt-3 text-xs leading-5 text-slate-500">Card via Stripe. The link arrives by email and opens the report for this domain only. No account.</p>
            </div>
          )}
          <p className="text-xs leading-5 text-slate-500">Checked {new Date(report.checked_at).toLocaleString()}{report.cached ? ' (cached)' : ''}. Public DNS, TLS and headers only. The application itself, its logins and its data handling are not tested.</p>
        </div>
      )}
    </div>
  );
}
