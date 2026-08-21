import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const PUBLISHED = '2026-07-18';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'x402 Economy Data: One Seller Is 40% of the Catalog | ForgeMesh',
  description:
    'Original crawler data on the x402 Bazaar: 24,816 paid resources, 1,136 sellers, 98% on Base, most calls $0.01–$0.10 — and one wallet behind 40% of listings.',
  keywords: [
    'x402 statistics', 'x402 bazaar', 'x402 ecosystem data', 'agent economy data',
    'x402 sellers', 'AI agent payments statistics', 'x402 catalog',
  ],
  alternates: { canonical: '/blog/x402-bazaar-economy-data-july-2026' },
  openGraph: {
    title: 'The x402 Economy, Measured: One Seller Is 40% of the Catalog',
    description:
      '24,816 live paid resources, 1,136 sellers, 98% on Base — original crawler data on the young agent economy.',
    type: 'article',
    url: 'https://forgemesh.io/blog/x402-bazaar-economy-data-july-2026',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/x402-bazaar-economy-data-july-2026.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/x402-bazaar-economy-data-july-2026.png'],
    title: 'The x402 Economy, Measured: One Seller Is 40% of the Catalog',
    description: 'Original crawler data on the x402 agent economy, July 2026.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'The x402 Economy, Measured: One Seller Is 40% of the Catalog',
      description:
        'Original measurements of the x402 Bazaar discovery catalog: listings, sellers, networks, price distribution, and seller concentration as of July 18, 2026.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of 11 x402 services and counting, with 500+ paid endpoints.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/x402-bazaar-economy-data-july-2026',
    },
    {
      '@type': 'Dataset',
      name: 'ForgeMesh x402 Bazaar Catalog Measurements',
      description:
        'Snapshot statistics of the x402 Bazaar discovery catalog collected by the ForgeMesh crawler three times daily: live listings, unique sellers, network split, and price distribution.',
      creator: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      temporalCoverage: '2026-07-15/2026-07-18',
      variableMeasured: ['live listings', 'unique sellers', 'settlement network', 'price per call'],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'The x402 economy, measured', item: 'https://forgemesh.io/blog/x402-bazaar-economy-data-july-2026' },
      ],
    },
  ],
};

const priceRows = [
  { bucket: '≤ $0.001', count: '1,330', share: '5%' },
  { bucket: '$0.001 – $0.01', count: '5,250', share: '21%' },
  { bucket: '$0.01 – $0.10', count: '16,189', share: '65%' },
  { bucket: '$0.10 – $1.00', count: '1,807', share: '7%' },
  { bucket: '> $1.00', count: '240', share: '1%' },
];

export default function ArticlePage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <article className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-12">
            <div className="min-w-0 max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Original data · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              The x402 economy, measured: one seller is 40% of the catalog
            </h1>

            <img
              src="/blog/x402-bazaar-economy-data-july-2026.png"
              alt="A night bazaar with market stalls built from glowing bar-chart columns"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={675}
            />

            <ShareBar inline />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Our crawler indexes the x402 Bazaar discovery catalog three times a day. Most writing
              about the <a href="/x402" className="text-blue-400 hover:text-blue-300">x402 protocol</a>{' '}
              quotes the same press releases; almost nobody publishes measurements. Here is what the
              catalog actually looked like on July 18, 2026 — including the numbers that flatter
              nobody, ours included.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The headline numbers
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { n: '24,816', d: 'live paid resources listed in the Bazaar (12:15 UTC snapshot, July 18, 2026)' },
                { n: '1,136', d: 'unique seller wallets — up from 1,100 on July 15 (+3% in three days)' },
                { n: '27,015', d: 'distinct paid resources our crawler has cataloged since tracking began' },
                { n: '98%', d: 'of live listings settle on Base (24,320 of 24,816)' },
              ].map((s) => (
                <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              What does an x402 call cost? Mostly a few cents
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Price distribution across live listings with a parseable price (24,816 resources):
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.12] text-slate-300">
                    <th className="py-3 pr-4 font-medium">Price per call</th>
                    <th className="py-3 pr-4 font-medium">Listings</th>
                    <th className="py-3 font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {priceRows.map((r) => (
                    <tr key={r.bucket} className="border-b border-white/[0.05]">
                      <td className="py-3 pr-4 font-mono text-xs text-blue-300/90">{r.bucket}</td>
                      <td className="py-3 pr-4 text-slate-300">{r.count}</td>
                      <td className="py-3 text-slate-400">{r.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Two-thirds of the market prices between one and ten cents. This is the range card
              networks structurally cannot serve — the entire reason{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                HTTP 402 sat unused for 30 years
              </a>{' '}
              — and it is exactly where the agent economy is forming.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The uncomfortable number: 40% of listings are one wallet
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              A single seller wallet accounts for <strong className="text-slate-200">10,028 of the
              24,816 live listings — 40% of the entire catalog</strong>. The next-largest seller has
              1,646. Strip the whale out and the &quot;real&quot; distributed catalog is closer to
              15,000 resources across 1,135 sellers — a median seller with a handful of endpoints.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              We publish this because honest measurement beats hype: raw listing counts overstate
              the ecosystem’s diversity, and any agent (or investor) evaluating x402 should
              filter by seller concentration. It is also a very young-market signature — low listing
              costs invite bulk publishing, and discovery layers haven’t yet learned to rank by
              reputation. The seller-count trend is the better health metric: 1,100 → 1,136 in three
              days, all independents.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Smaller signals worth knowing
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-8 text-slate-400">
              <li>
                <strong className="text-slate-200">Network labeling is still wild-west.</strong>{' '}
                Base mainnet appears under two different identifiers — the CAIP-2 form
                (&quot;eip155:8453&quot;, 11,892 listings) and the bare label (&quot;base&quot;,
                12,428). Agents doing catalog work need to normalize both.
              </li>
              <li>
                <strong className="text-slate-200">Testnet listings pollute the live catalog.</strong>{' '}
                ~335 listings settle on Base Sepolia or other testnets — fine for demos, but a paid
                agent that doesn’t check the network field will waste calls on them.
              </li>
              <li>
                <strong className="text-slate-200">Solana is present but small</strong> — about 150
                listings on mainnet. The x402 Foundation’s membership (Solana Foundation is a
                premier member) suggests that share grows.
              </li>
            </ul>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Methodology
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              ForgeMesh crawls the public x402 Bazaar discovery catalog three times daily and stores
              per-resource records (price, network, seller wallet, description) plus per-snapshot
              totals. Numbers above are from the July 18, 2026 12:15 UTC snapshot; cumulative counts
              span July 15–18. We operate{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">
                11 x402 services and counting
              </a>{' '}
              ourselves, so our own listings appear in these counts — they are a rounding error
              against the totals. Want the data updated or sliced differently?{' '}
              <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">
                Ask
              </a>
              .
            </p>

            <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Selling to agents?
              </p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                We publish everything we learn operating 500+ paid x402 endpoints — including the
                incidents. The free scan checks whether stock agent clients can actually pay your
                endpoint, and the Server Starter Kit ships the settlement-proven dual-rail
                middleware we run in production, with updates dropped into buyers&rsquo; Discord as
                the ecosystem shifts.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://forgemesh.io/scan"
                  className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
                >
                  Run the free scan <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href="https://kit.forgemesh.io"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
                >
                  Get the Server Starter Kit — $49
                </a>
              </div>
            </div>

            <p className="mt-10 text-base leading-8 text-slate-400">
              Related reading:{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                our follow-up health census of every Bazaar seller
              </a>{' '}
              and{' '}
              <a href="/blog/x402-catalog-purge-overnight-july-2026" className="text-blue-400 hover:text-blue-300">
                the overnight purge that erased 43% of the catalog
              </a>
              .
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/x402"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                What is x402? The full guide <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                More from the blog
              </a>
            </div>
            </div>
            <BlogArchive current="x402-bazaar-economy-data-july-2026" />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
