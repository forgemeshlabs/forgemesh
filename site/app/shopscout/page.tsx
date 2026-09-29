import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'ShopScout — Let Your Agent Shop and Compare | ForgeMesh Labs',
  description:
    'Product discovery and offer comparison over the Shopify Global Catalog, plus a shipping-plan comparator for agents. Four paid x402 endpoints at $0.01 in USDC on Base: search, product refresh, offer comparison, shipping-plan comparison. No purchases, no tax or landed-cost claims.',
  keywords: [
    'x402 shopping API', 'agent commerce API', 'Shopify catalog search API', 'offer comparison API',
    'shipping comparison API', 'AI agent shopping', 'USDC micropayments', 'x402 bazaar discovery',
    'offer receipt EIP-712', 'agent shopping tool',
  ],
  alternates: { canonical: '/shopscout' },
  openGraph: {
    title: 'ShopScout — Let Your Agent Shop and Compare',
    description:
      'Four paid x402 endpoints at $0.01/call: search the Shopify Global Catalog, refresh a product, compare offers, compare shipping plans. No purchases, no cost invented.',
    type: 'website',
    url: 'https://forgemesh.io/shopscout',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'ShopScout — Let Your Agent Shop and Compare',
    description:
      'Four paid x402 endpoints at $0.01/call: search, product refresh, offer comparison, shipping-plan comparison.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'ShopScout',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: 'https://shopscout.forgemesh.io',
      description:
        'x402-paid product discovery and offer comparison over the Shopify Global Catalog, plus a shipping-plan comparator ranking single-seller vs. split baskets against caller-supplied rules. USDC per call on Base.',
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'ShopScout', item: 'https://forgemesh.io/shopscout' },
      ],
    },
  ],
};

const routes = [
  { method: 'POST', path: '/v1/search', price: '$0.01', what: 'Search the Shopify Global Catalog by query, country, currency, price bounds, and pagination' },
  { method: 'POST', path: '/v1/products/get', price: '$0.01', what: 'Refresh a product or variant by Shopify id, with option selection' },
  { method: 'POST', path: '/v1/compare', price: '$0.01', what: 'Rank 2–10 variant ids by item price in one currency' },
  { method: 'POST', path: '/v1/shipping/compare', price: '$0.01', what: 'Rank single-seller vs. split-basket shipping plans against caller-supplied rules' },
];

export default function ShopScoutPage() {
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
              ShopScout. Let your agent shop and compare.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Product discovery and offer comparison over the{' '}
              <strong className="text-slate-200">Shopify Global Catalog</strong>, plus a
              shipping-plan comparator that ranks single-seller vs. split baskets against
              shipping rules the caller supplies — free-shipping thresholds, delivery
              constraints. Four routes, $0.01 in USDC on Base each, no accounts, no API keys.
            </p>

            <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-400/[0.04] p-5">
              <p className="text-sm font-medium text-amber-200/90">What ShopScout does not do</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-400">
                <li>Does not buy anything — there is no checkout or purchase route.</li>
                <li>Does not verify tax, duties, or landed cost — shipping estimates exclude both.</li>
                <li>Does not claim product equivalence between variants or listings.</li>
                <li>Does not cache or store catalog results between calls.</li>
              </ul>
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Four endpoints, $0.01 each
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
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Empty search results are still charged — a search is billed for the query, not the
              hit count. Upstream failures are not settled: if the catalog connector errors out,
              the call is not charged.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              x402 extensions
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              ShopScout ships three live x402 extensions beyond the base payment flow:{' '}
              <strong className="text-slate-200">bazaar discovery</strong> for agent indexes,{' '}
              <strong className="text-slate-200">payment-identifier</strong> (an optional
              idempotency key that rejects a duplicate logical request rather than replaying a
              cached result), and{' '}
              <strong className="text-slate-200">offer-receipt</strong> — EIP-712 signed offers
              and receipts, with the signing key published at{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">
                /.well-known/receipt-signers.json
              </code>{' '}
              so a caller can pin it independently of the request path.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Price watches, stock alerts, and purchase planning are listed as{' '}
              <strong className="text-slate-200">planned</strong> in{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">
                /v1/capabilities
              </code>{' '}
              — they answer HTTP 501 today and are never charged. An MCP wrapper,{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">
                @forgemeshlabs/shopscout-mcp
              </code>
              , exists but is not yet published to npm.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Discovery
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Free, unpaid discovery surfaces:{' '}
              <a href="https://shopscout.forgemesh.io/llms.txt" className="text-blue-400 hover:text-blue-300">
                /llms.txt
              </a>
              ,{' '}
              <a href="https://shopscout.forgemesh.io/openapi.json" className="text-blue-400 hover:text-blue-300">
                /openapi.json
              </a>
              ,{' '}
              <a href="https://shopscout.forgemesh.io/.well-known/x402.json" className="text-blue-400 hover:text-blue-300">
                /.well-known/x402.json
              </a>
              , and{' '}
              <a href="https://shopscout.forgemesh.io/v1/capabilities" className="text-blue-400 hover:text-blue-300">
                /v1/capabilities
              </a>
              .
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://shopscout.forgemesh.io"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Hit the API <ArrowRight className="h-4 w-4" aria-hidden />
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
