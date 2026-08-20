import type { Metadata } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { runScan, runServiceScan, fixGuides, type ScanResult, type ServiceScanResult } from '@/lib/scan';
import { getCheckoutSession } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Endpoint Scan Report | ForgeMesh Labs',
  robots: { index: false, follow: false },
};

const GRADE_STYLE: Record<ScanResult['grade'], { ring: string; text: string; label: string }> = {
  A: { ring: 'border-emerald-400/50 bg-emerald-400/10', text: 'text-emerald-300', label: 'Dual-stack healthy — x402 + MPP' },
  B: { ring: 'border-blue-400/50 bg-blue-400/10', text: 'text-blue-300', label: 'Healthy x402 — MPP not detected' },
  C: { ring: 'border-amber-400/50 bg-amber-400/10', text: 'text-amber-300', label: 'Challenges for payment, but agents can’t pay it' },
  F: { ring: 'border-red-400/50 bg-red-400/10', text: 'text-red-300', label: 'Not payable as configured' },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">{children}</div>
        </section>
        <Footer />
      </main>
    </>
  );
}

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-slate-50">No report session</h1>
        <p className="mt-4 text-slate-400">
          This page is reached after purchasing a scan report.{' '}
          <a href="/scan" className="text-blue-400 hover:text-blue-300">Run a free scan →</a>
        </p>
      </Shell>
    );
  }

  let paid = false;
  let scanUrl: string | null = null;
  try {
    const session = await getCheckoutSession(sessionId);
    paid = session.paid;
    scanUrl = session.scanUrl;
  } catch {
    /* fall through to the error branch below */
  }

  if (!paid || !scanUrl) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-slate-50">Payment not confirmed</h1>
        <p className="mt-4 leading-8 text-slate-400">
          We couldn&apos;t verify this checkout session. If you just paid, wait a few seconds and refresh — Stripe can
          take a moment. If it persists, reply to your Stripe receipt email and we&apos;ll make it right.
        </p>
      </Shell>
    );
  }

  let result: ScanResult | null = null;
  let serviceScan: ServiceScanResult | null = null;
  let scanError: string | null = null;
  try {
    result = await runScan(scanUrl);
    if (result.service_root_hint) {
      serviceScan = await runServiceScan(scanUrl, 25).catch(() => null);
    }
  } catch (e) {
    scanError = (e as Error).message;
  }

  // Persist every paid report render so purchased reports are never lost:
  // one file per checkout session, scan history appended (capped at 50).
  if (result) {
    try {
      const dir = path.join(process.cwd(), 'data', 'scan-reports');
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, `${sessionId}.json`);
      let record: { session_id: string; url: string; scans: Array<ScanResult & { ts: string }> } = {
        session_id: sessionId,
        url: scanUrl,
        scans: [],
      };
      try {
        record = JSON.parse(await fs.readFile(file, 'utf8'));
      } catch {
        /* first render for this session */
      }
      record.scans.push({ ...result, ...(serviceScan ? { service_scan: serviceScan } : {}), ts: new Date().toISOString() } as never);
      if (record.scans.length > 50) record.scans = record.scans.slice(-50);
      await fs.writeFile(file, JSON.stringify(record, null, 2), { mode: 0o600 });
    } catch (e) {
      console.error('[scan-report-store]', (e as Error).message);
    }
  }

  if (!result) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-slate-50">Scan error</h1>
        <p className="mt-4 leading-8 text-slate-400">
          Your payment is confirmed, but the scan hit an error: {scanError}. Refresh to retry — this page re-scans on
          every load, free, forever.
        </p>
      </Shell>
    );
  }

  const g = GRADE_STYLE[result.grade];
  const guides = fixGuides(result);

  return (
    <Shell>
      <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
        <ForgeMeshMark size={22} className="shrink-0" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Full scan report</span>
      </div>

      <h1 className="break-all font-mono text-xl text-slate-300 sm:text-2xl">{result.url}</h1>

      <div className="mt-8 flex items-center gap-5 rounded border border-white/[0.08] bg-white/[0.02] p-6">
        <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded border text-5xl font-semibold ${g.ring} ${g.text}`}>
          {result.grade}
        </div>
        <div>
          <p className={`text-lg font-medium ${g.text}`}>{g.label}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            HTTP {result.http_status ?? '—'} · envelope: {result.x402_envelope}
            {result.envelope_valid ? ' (valid)' : result.x402_envelope !== 'missing' ? ' (INVALID)' : ''} ·{' '}
            {result.method_used} · {result.response_time_ms}ms{result.mpp_dual_stack ? ' · MPP dual-stack ✓' : ''}
          </p>
        </div>
      </div>

      {serviceScan && serviceScan.scanned > 0 ? (
        <>
          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
            Full service scan — {serviceScan.scanned} of {serviceScan.total_routes} routes
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['A', 'B', 'C', 'F'] as const).map((gr) =>
              serviceScan.summary[gr] > 0 ? (
                <span key={gr} className={`rounded border px-3 py-1.5 font-mono text-xs ${GRADE_STYLE[gr].ring} ${GRADE_STYLE[gr].text}`}>
                  {gr} × {serviceScan.summary[gr]}
                </span>
              ) : null,
            )}
            {serviceScan.mpp_dual_stack_count > 0 ? (
              <span className="rounded border border-white/[0.1] px-3 py-1.5 font-mono text-xs text-slate-400">
                MPP × {serviceScan.mpp_dual_stack_count}
              </span>
            ) : null}
          </div>
          <ul className="mt-5 space-y-3">
            {serviceScan.routes.map((r) => (
              <li key={r.url} className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-start gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded border font-mono ${GRADE_STYLE[r.grade].ring} ${GRADE_STYLE[r.grade].text}`}>
                    {r.grade}
                  </span>
                  <div className="min-w-0 grow">
                    <p className="break-all font-mono text-xs text-slate-300">{r.url}</p>
                    {r.grade !== 'A' ? (
                      <ul className="mt-2 space-y-1">
                        {r.findings.map((f, i) => (
                          <li key={i} className="text-xs leading-6 text-slate-500">{f}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {serviceScan.total_routes > serviceScan.scanned ? (
            <p className="mt-4 text-xs text-slate-500">
              {serviceScan.total_routes - serviceScan.scanned} more routes listed in the manifest weren&apos;t scanned
              (report cap: 25 per load). Refresh to re-scan; scan individual routes free anytime.
            </p>
          ) : null}
        </>
      ) : null}

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
        {serviceScan ? `Root URL findings (${result.findings.length})` : `Findings (${result.findings.length})`}
      </h2>
      <ul className="mt-4 space-y-3">
        {result.findings.map((f, i) => (
          <li key={i} className="rounded border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-7 text-slate-300">
            {f}
          </li>
        ))}
      </ul>

      {result.envelope_errors.length > 0 ? (
        <>
          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">Envelope validation errors</h2>
          <ul className="mt-4 space-y-2">
            {result.envelope_errors.map((e, i) => (
              <li key={i} className="rounded border border-amber-400/25 bg-amber-400/[0.05] p-3 font-mono text-xs leading-6 text-amber-200">
                {e}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {result.accepts_summary.length > 0 ? (
        <>
          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">Advertised payment terms</h2>
          <div className="mt-4 overflow-x-auto rounded border border-white/[0.06]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-500">
                  {['scheme', 'network', 'asset', 'payTo', 'amount'].map((h) => (
                    <th key={h} className="px-4 py-3 font-normal uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.accepts_summary.map((a, i) => (
                  <tr key={i} className="border-b border-white/[0.04] text-slate-300">
                    <td className="px-4 py-3">{a.scheme ?? '—'}</td>
                    <td className="px-4 py-3">{a.network ?? '—'}</td>
                    <td className="max-w-[16ch] truncate px-4 py-3" title={a.asset ?? ''}>{a.asset ?? '—'}</td>
                    <td className="max-w-[16ch] truncate px-4 py-3" title={a.payTo ?? ''}>{a.payTo ?? '—'}</td>
                    <td className="px-4 py-3">{a.amount ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">How to fix it</h2>
      <div className="mt-4 space-y-4">
        {guides.map((guide, i) => (
          <div key={i} className="rounded border border-blue-500/20 bg-blue-500/[0.04] p-6">
            <h3 className="text-base font-semibold text-slate-100">{guide.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">{guide.body}</p>
            {guide.snippet ? (
              <pre className="mt-4 overflow-x-auto rounded bg-black/40 p-4 font-mono text-[12px] leading-6 text-slate-300">
                {guide.snippet}
              </pre>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm leading-7 text-slate-300">
          <strong className="text-slate-100">This page re-scans live on every load</strong> — bookmark it, apply your
          fixes, and refresh until the grade turns green. No extra charge, ever. Every scan is also archived on our
          side, and this page is not indexed by search engines — the link is yours alone.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <a
            href={`/api/scan/report-file?session_id=${encodeURIComponent(sessionId)}`}
            className="inline-flex items-center gap-2 rounded border border-white/[0.12] px-4 py-2.5 text-sm text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
          >
            Download report (JSON)
          </a>
          <a href="/scan" className="inline-flex items-center gap-2 px-1 py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300">
            Scan another endpoint <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </Shell>
  );
}
