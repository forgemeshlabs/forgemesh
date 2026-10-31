import { ShieldCheck } from 'lucide-react';

/**
 * Compact entry box for the free Site Security Check. Plain GET form (no JS):
 * submits to /site-check?domain=..., which runs the scan on load.
 */
export function ScanCta({ id = 'scan-cta', className = '' }: { id?: string; className?: string }) {
  return (
    <section className={`px-6 py-14 ${className}`} aria-labelledby={`${id}-h`}>
      <div className="mx-auto max-w-3xl rounded-xl border border-blue-500/25 bg-blue-500/[0.05] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-300" aria-hidden />
          <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight text-slate-50">Check your site&apos;s security for free</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Email spoofing (SPF, DKIM, DMARC), old TLS, HSTS, CSP, clickjacking and security.txt. Over twenty passive checks, about five seconds, nothing touched. The full report with copy-paste fixes is $5.
        </p>
        <form action="/site-check" method="get" className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor={`${id}-domain`}>Domain to check</label>
          <input
            id={`${id}-domain`}
            name="domain"
            required
            placeholder="example.com"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-base text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none"
          />
          <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400">
            Check my site
          </button>
        </form>
      </div>
    </section>
  );
}
