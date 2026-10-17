import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { EDITIONS } from '@/lib/pay-per-crawl-editions';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Pay-per-Crawl plugins: WordPress, Python, JavaScript, Go, PHP | ForgeMesh Labs',
  description:
    'Charge AI crawlers per page in USDC on Base from any stack. Free, open-source Pay-per-Crawl editions for WordPress, Python, JavaScript, Go and PHP. Owner keeps 100%, no custody, no account.',
  keywords: [
    'pay per crawl', 'charge AI crawlers', 'x402 middleware', 'AI bot paywall', 'x402 python', 'x402 npm',
    'x402 go middleware', 'x402 laravel', 'x402 drupal', 'x402 cloudflare worker', 'x402 next.js', 'USDC Base',
  ],
  alternates: { canonical: '/plugins' },
  openGraph: {
    title: 'Pay-per-Crawl plugins for every stack',
    description: 'WordPress, Python, JavaScript, Go, PHP. Charge AI crawlers per page in USDC on Base. You keep 100%.',
    type: 'website',
    url: 'https://forgemesh.io/plugins',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Pay-per-Crawl plugins for every stack',
    description: 'WordPress, Python, JavaScript, Go, PHP. Charge AI crawlers per page in USDC on Base. You keep 100%.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      name: 'ForgeMesh Pay-per-Crawl editions',
      url: 'https://forgemesh.io/plugins',
      itemListElement: EDITIONS.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: `ForgeMesh Pay-per-Crawl for ${e.name}`,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: e.stack,
          softwareVersion: e.version,
          url: e.registry.url,
          codeRepository: e.repo,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Pay-per-Crawl plugins', item: 'https://forgemesh.io/plugins' },
      ],
    },
  ],
};

const shared = [
  ['Same behaviour everywhere', 'One crawler catalog, one 402 shape, the same classifier. Humans and reverse-DNS-verified search engines read free; AI crawlers and bots pay per page.'],
  ['You keep 100%', 'Each edition calls the facilitator itself: verify, then settle, then serve only on a transaction hash. Nothing routes through ForgeMesh.'],
  ['x402 v1 + v2 and MPP', 'Every 402 carries a PAYMENT-REQUIRED v2 header, a v1 JSON body and a WWW-Authenticate: Payment challenge, so more agent clients can pay.'],
  ['Discovery files', 'Each edition serves /.well-known/x402.json, llms.txt and agents.txt so agents can find your terms.'],
  ['Proven with real money', 'Every edition was verified with two live $0.01 settlements on Base mainnet, one per protocol version, before release.'],
  ['Optional Pro reporter', 'Point any edition at Pro for a hosted dashboard, Monday digest and paywall monitoring. Pro sees per-bot counts and settlements only.'],
];

const btn =
  'inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white';

export default function PluginsPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Live on Base mainnet · Free, open source
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Pay-per-Crawl for every stack.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              The WordPress plugin, ported to Python, JavaScript, Go and PHP. Drop one in front of your
              site and AI crawlers pay <strong className="text-slate-200">per page</strong> in USDC on Base,
              straight to your wallet. You keep 100%. No custody, no account, no API key.
            </p>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Pick your edition</h2>
            <ul className="mt-6 space-y-4">
              {EDITIONS.map((e) => (
                <li key={e.key} id={e.key} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-medium text-slate-100">{e.name}</h3>
                    <span className="font-mono text-xs text-slate-500">v{e.version}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{e.stack}</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-black/40 px-3 py-2 font-mono text-[13px] text-blue-200">
                    {e.install}
                  </pre>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={e.registry.url}
                      className="inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
                    >
                      {e.registry.label} <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                    <a href={e.repo} className={btn}>Source on GitHub</a>
                    {e.extra?.map((x) => (
                      <a key={x.url} href={x.url} className={btn}>{x.label}</a>
                    ))}
                  </div>
                  {e.note && <p className="mt-3 text-sm text-slate-500">{e.note}</p>}
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">What every edition shares</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {shared.map(([t, d]) => (
                <div key={t} className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                  <dt className="font-medium text-slate-100">{t}</dt>
                  <dd className="mt-1.5 text-sm leading-6 text-slate-400">{d}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Security notes</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Two hardening fixes shipped across all editions on 17 October 2026 and are in every version
              listed above: trusted <span className="font-mono text-slate-300">X-Forwarded-For</span> now uses
              the right-most hop, so a client cannot prepend a search-engine IP to read free, and path
              exemptions are anchored to exact files or slash-delimited prefixes, so a crafted path cannot
              match an allow rule. Report issues to{' '}
              <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="/wordpress" className={btn}>WordPress plugin page</a>
              <a href="https://proxy.forgemesh.io/wp" className={btn}>Pro dashboard $4.99/mo</a>
              <a href="/verified" className={btn}>x402 Verified index</a>
            </div>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
