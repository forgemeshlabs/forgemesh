import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'SEO Authority API — Open-Web Domain Authority, Priced Per Call | ForgeMesh Labs',
  description:
    'Domain authority computed from the current Common Crawl hyperlink graph — not scraped Google data. Ten paid x402 endpoints from $0.005 per call in USDC on Base: authority lookups, keyword opportunities, competitor gaps, content briefs, site audits. MCP server included.',
  keywords: [
    'SEO API', 'domain authority API', 'Common Crawl domain rank', 'open web authority',
    'keyword opportunity API', 'competitor gap analysis API', 'content brief API', 'site audit API',
    'x402 SEO', 'SEO MCP server', 'pay per call SEO', 'USDC micropayments',
  ],
  alternates: { canonical: '/seo' },
  openGraph: {
    title: 'SEO Authority API — Open-Web Domain Authority, Priced Per Call',
    description:
      'Authority from the Common Crawl hyperlink graph, ten paid endpoints from $0.005/call, MCP server included. No accounts, no API keys.',
    type: 'website',
    url: 'https://forgemesh.io/seo',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'SEO Authority API — Open-Web Domain Authority, Priced Per Call',
    description:
      'Authority from the Common Crawl hyperlink graph, ten paid endpoints from $0.005/call, MCP server included.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'SEO Authority API',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: 'https://seo.forgemesh.io',
      description:
        'x402-paid SEO API: domain authority from the Common Crawl hyperlink graph, keyword opportunity scoring, competitor gap analysis, content briefs, and site audits. USDC per call on Base.',
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'SEO Authority API', item: 'https://forgemesh.io/seo' },
      ],
    },
  ],
};

const routes = [
  { method: 'GET', path: '/v1/domain-authority', price: '$0.01', what: 'Authority score for any domain' },
  { method: 'POST', path: '/v1/authority-compare', price: '$0.02', what: 'Head-to-head authority comparison' },
  { method: 'POST', path: '/v1/url-seo-score', price: '$0.01', what: 'On-page SEO score for a URL' },
  { method: 'GET', path: '/v1/query-correct', price: '$0.005', what: 'Search-query spelling correction' },
  { method: 'GET', path: '/v1/query-expand', price: '$0.01', what: 'Query expansion & related terms' },
  { method: 'POST', path: '/v1/keyword-opportunity', price: '$0.05', what: 'Keyword opportunity scoring' },
  { method: 'POST', path: '/v1/competitor-gap', price: '$0.10', what: 'Competitor content-gap analysis' },
  { method: 'POST', path: '/v1/content-brief', price: '$0.10', what: 'Data-backed content brief' },
  { method: 'POST', path: '/v1/site-audit', price: '$0.15', what: 'Multi-signal site audit' },
  { method: 'POST', path: '/v1/internal-link-opportunities', price: '$0.05', what: 'Internal linking opportunities' },
];

export default function SeoAuthorityPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Live on Base mainnet · x402 v2
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              SEO Authority API. Open-web authority, priced per call.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Most &quot;domain authority&quot; numbers are proprietary black boxes — someone
              else&apos;s crawl, someone else&apos;s formula, licensed by the seat. This one is
              computed from the current{' '}
              <strong className="text-slate-200">Common Crawl hyperlink graph</strong>, the open
              web&apos;s own link structure, refreshed with each release. No scraped Google data,
              no seats, no subscription: an agent (or a curl command) pays per question in USDC on
              Base, from half a cent.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              And an honesty rule most SEO tools won&apos;t make: metrics we don&apos;t have are{' '}
              <strong className="text-slate-200">unavailable, never fabricated</strong>. The API
              reports its exact current graph coverage on every health check, and routes without a
              production data source stay unsold rather than returning invented numbers.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Ten endpoints, half a cent to fifteen cents
            </h2>
            <div className="mt-6 overflow-x-auto rounded border border-white/[0.06]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">What it answers</th>
                    <th className="px-4 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.path} className="border-b border-white/[0.04] last:border-0">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[13px] text-blue-200">
                        <span className="mr-2 text-slate-500">{r.method}</span>
                        {r.path}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">{r.what}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono text-slate-200">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Drop it straight into your agent
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The open-source MCP server{' '}
              <a
                href="https://github.com/forgemeshlabs/seo-authority-mcp"
                className="text-blue-400 hover:text-blue-300"
              >
                @forgemeshlabs/seo-authority-mcp
              </a>{' '}
              exposes all ten routes plus a free capabilities tool. Without a wallet key it returns
              the structured x402 challenge and spends nothing — safe to install and explore. With
              a key it settles automatically under a per-call spend cap (default $0.15), and it
              refuses to report success without a real transaction hash. Discovery metadata is
              published at{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">/.well-known/x402.json</code>{' '}
              for the standard agent indexes.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://seo.forgemesh.io"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Hit the API <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://github.com/forgemeshlabs/seo-authority-mcp"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                MCP server on GitHub
              </a>
              <a
                href="https://kit.forgemesh.io"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Build your own x402 service
              </a>
            </div>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
