// ForgeMesh partners — networks, indexes, and directories ForgeMesh works with. Curated in
// forgemeshlabs/x402-verified under partners/*.json and synced into public/partners.json.
// Scored sellers live at /verified; this page is only for real ecosystem relationships.
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { loadVerified } from '@/lib/verified-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'ForgeMesh Partners — x402 Networks, Indexes and Directories',
  description:
    'Networks, indexes, and directories ForgeMesh works with in the x402 ecosystem. Scored sellers are listed separately on x402 Verified.',
  alternates: { canonical: '/partners' },
  openGraph: {
    title: 'ForgeMesh Partners',
    description: 'Networks, indexes, and directories ForgeMesh works with in the x402 ecosystem.',
    type: 'website',
    url: 'https://forgemesh.io/partners',
  },
};

export default function Page() {
  const feed = loadVerified();
  const partners = [...feed.partners].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-12 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">ForgeMesh partners</span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              Networks, indexes and directories we work with
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              The places ForgeMesh services are listed, routed, or settled through, and the programs ForgeMesh
              takes part in. None of these are scored sellers. For the independently checked seller index, see{' '}
              <a href="/verified" className="text-blue-400 hover:text-blue-300">x402 Verified</a>.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Partners · {partners.length}
            </h2>
            {partners.length ? (
              <ul className="mt-5 space-y-3">
                {partners.map((p) => (
                  <li key={p.slug} className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <a href={p.homepage} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-100 hover:text-blue-300">
                        {p.name}
                      </a>
                      <span className="rounded-full border border-white/[0.12] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        {p.kind}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                          p.status === 'live' ? 'border-emerald-500/40 text-emerald-300' : 'border-amber-500/40 text-amber-300'
                        }`}
                      >
                        {p.status === 'integration-pending' ? 'integration pending' : p.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{p.description}</p>
                    {p.status_note ? <p className="mt-1 text-xs text-slate-600">{p.status_note}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">None yet.</p>
            )}
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Work with ForgeMesh</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              Partnerships are reciprocal or usage-based: a listing for a listing, a route for a route, or a
              real settlement. Write to{' '}
              <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Listed on</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              Directories that carry a ForgeMesh listing. Not partners: a listing is not an integration.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-4">
              <li>
                <a href="https://launchnest.io/p/forgemesh-pay-per-crawl" target="_blank" rel="noopener">
                  <img
                    src="https://launchnest.io/badge/forgemesh-pay-per-crawl.svg?variant=listed"
                    alt="ForgeMesh Pay-per-Crawl on LaunchNest"
                    width={220}
                    height={56}
                    loading="lazy"
                  />
                </a>
              </li>
            </ul>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
