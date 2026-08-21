import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Gov-Transparency Pack — Watch the Watchers, Priced Per Call | ForgeMesh Labs',
  description:
    'Nine x402-paid endpoints giving AI agents structured access to US government accountability data: congressional stock trades from STOCK Act filings, campaign finance, lobbying disclosures, federal contracts, bill status, and regulations. Half a cent to two cents per call in USDC on Base.',
  keywords: [
    'congressional stock trades API', 'STOCK Act API', 'campaign finance API', 'FEC API',
    'government transparency API', 'lobbying disclosure API', 'federal contracts API',
    'USAspending API', 'x402 government data', 'pay per call government API',
    'USDC micropayments', 'Base mainnet',
  ],
  alternates: { canonical: '/gov-transparency' },
  openGraph: {
    title: 'Gov-Transparency Pack — Watch the Watchers, Priced Per Call',
    description:
      'Nine x402-paid endpoints for US government accountability data: congressional stock trades, campaign finance, lobbying, federal contracts. Half a cent to two cents per call.',
    type: 'website',
    url: 'https://forgemesh.io/gov-transparency',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Gov-Transparency Pack — Watch the Watchers, Priced Per Call',
    description:
      'Nine x402-paid endpoints for US government accountability data. Half a cent to two cents per call in USDC on Base.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Gov-Transparency Pack',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: 'https://x402.forgemesh.io',
      description:
        'x402-paid government transparency API pack: congressional stock trades from STOCK Act filings, campaign finance totals, lobbying disclosures, federal contract awards, bill status, and regulatory activity. USDC per call on Base.',
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Gov-Transparency Pack', item: 'https://forgemesh.io/gov-transparency' },
      ],
    },
  ],
};

const routes = [
  { method: 'POST', path: '/congress-stock-trades', price: '$0.02', what: 'Congressional stock trade disclosures from STOCK Act filings' },
  { method: 'POST', path: '/congress-trade-filings', price: '$0.01', what: 'House financial-disclosure filing index with PDF links' },
  { method: 'POST', path: '/congress-bill-lookup', price: '$0.005', what: 'US bill status — sponsor, latest action, policy area' },
  { method: 'POST', path: '/fec-candidate-lookup', price: '$0.005', what: 'Federal candidate search with IDs and committee links' },
  { method: 'POST', path: '/fec-candidate-money', price: '$0.01', what: 'Campaign finance totals — receipts, spending, cash on hand' },
  { method: 'POST', path: '/federal-contracts-search', price: '$0.01', what: 'Federal contract awards by company' },
  { method: 'POST', path: '/federal-contractor-profile', price: '$0.01', what: 'Contractor profile — UEI, parent, award totals' },
  { method: 'POST', path: '/federal-register-watch', price: '$0.005', what: 'New regulations and notices by topic' },
  { method: 'POST', path: '/lobbying-filings', price: '$0.01', what: 'Who is lobbying, for whom, and on what' },
];

export default function GovTransparencyPage() {
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
              Gov-Transparency Pack. They watch us — let&apos;s watch them.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Nine x402-paid endpoints that give AI agents structured access to US government
              accountability data: congressional stock trades parsed from{' '}
              <strong className="text-slate-200">STOCK Act filings</strong>, campaign finance
              totals, lobbying disclosures, federal contract awards, bill status, and regulatory
              activity. All sourced from official public-domain APIs — USAspending, FEC,
              Congress.gov, Federal Register, House Clerk disclosures.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              No licensing risk, no API keys, no subscriptions: pay per call in USDC on Base, from
              half a cent. Commercial rivals charge monthly subscriptions for this data (QuiverQuant,
              Unusual Whales) — here it&apos;s{' '}
              <strong className="text-slate-200">per-call for agents</strong>.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Nine endpoints, half a cent to two cents
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
              Part of the Utility Grid
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              These nine routes live on the{' '}
              <a
                href="https://x402.forgemesh.io"
                className="text-blue-400 hover:text-blue-300"
              >
                ForgeMesh Utility Grid
              </a>{' '}
              alongside dozens of other paid utilities. The open-source MCP server{' '}
              <a
                href="https://www.npmjs.com/package/@forgemeshlabs/utility-grid-mcp"
                className="text-blue-400 hover:text-blue-300"
              >
                @forgemeshlabs/utility-grid-mcp
              </a>{' '}
              exposes all grid routes as agent tools. Without a wallet key it returns the structured
              x402 challenge and spends nothing — safe to install and explore. Discovery metadata is
              published at{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">/.well-known/x402.json</code>{' '}
              for the standard agent indexes.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://x402.forgemesh.io"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Hit the API <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://www.npmjs.com/package/@forgemeshlabs/utility-grid-mcp"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Utility Grid MCP
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
