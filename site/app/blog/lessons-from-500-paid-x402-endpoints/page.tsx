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
  title: 'Five Lessons From 500+ Paid x402 Endpoints | ForgeMesh',
  description:
    'Field notes from operating 500+ paid x402 endpoints: upstream rug-pulls, why an empty 402 body is a lost sale, and never charging buyers for your errors.',
  keywords: [
    'x402 tutorial', 'sell to AI agents', 'x402 best practices', 'monetize API x402',
    'x402 seller guide', 'agent commerce lessons', 'paid API for agents',
  ],
  alternates: { canonical: '/blog/lessons-from-500-paid-x402-endpoints' },
  openGraph: {
    title: 'Five Lessons From Running 500+ Paid x402 Endpoints',
    description:
      'What selling to AI agents actually looks like, from operators of 11 live x402 services.',
    type: 'article',
    url: 'https://forgemesh.io/blog/lessons-from-500-paid-x402-endpoints',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/lessons-from-500-paid-x402-endpoints.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/lessons-from-500-paid-x402-endpoints.png'],
    title: 'Five Lessons From Running 500+ Paid x402 Endpoints',
    description: 'What selling to AI agents actually looks like. Operator field notes.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Five Lessons From Running 500+ Paid x402 Endpoints',
      description:
        'Operator field notes on selling to AI agents over the x402 protocol: upstream risk, 402 body design, pre-payment validation, indexer traffic, and settlement safety.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of 11 x402 services and counting, with 500+ paid endpoints.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/lessons-from-500-paid-x402-endpoints',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'Five lessons from 500+ paid endpoints', item: 'https://forgemesh.io/blog/lessons-from-500-paid-x402-endpoints' },
      ],
    },
  ],
};

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
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 xl:gap-12">
            <div className="min-w-0 max-w-3xl lg:flex-1">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Operator field notes · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Five lessons from running 500+ paid x402 endpoints
            </h1>

            <img
              src="/blog/lessons-from-500-paid-x402-endpoints.png"
              alt="Open field notebook beside a vast glowing grid of circuit endpoints"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={675}
            />

            <ShareBar inline />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              ForgeMesh operates 11{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">x402</a> services and
              counting — utilities, market intelligence, voice, travel, notarization — with 500+
              paid endpoints priced from $0.001. Selling to AI agents is genuinely different from
              selling to developers with API keys. These are the lessons that cost us something to
              learn.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              1. Upstream APIs will rug-pull you mid-build
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              On July 15, 2026 — during a single build session — two free upstream APIs we depended
              on died under us: restcountries.com deprecated its free tier behind an API key, and
              numbersapi.com started returning 404s entirely. When your product is a paid endpoint,
              an upstream failure isn’t an inconvenience — it’s selling a product you
              can’t deliver. We swapped both to local datasets (250 countries under an open
              license, computed number facts) within minutes, and now bias every new endpoint toward
              local compute: of our utility-grid capabilities, dozens need zero upstream API at all.
              Structurally rug-proof beats temporarily convenient.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              2. An empty 402 body is a lost sale
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The default payment middleware returns an empty JSON body with the 402 challenge
              header. But the{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                402 response
              </a>{' '}
              is your storefront window — it is the only thing an unpaid agent ever sees. Every
              ForgeMesh 402 body carries the price, network, input schema, a worked example, and
              links to free discovery docs. An agent deciding whether to pay should never need a
              second source to construct a correct first call. The challenge itself is the sales
              pitch — and it is the single highest-traffic surface a paid service has.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              3. Validate before you settle — never charge for a 400
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              In x402, settlement happens in middleware before your handler runs. If you validate
              input <em>after</em> payment, a buyer can pay for a request you were never going to
              fulfill. We run required-field and schema validation ahead of the payment gate for any
              request carrying a payment header, and our payment layer cancels settlement on any
              error status — a handler failure means the buyer pays nothing. Agents remember
              services that waste their money exactly the way humans do: by never coming back.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              4. Directory indexers will stampede you — build them a lane
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Discovery services like x402scan and the Bazaar sweep every route you expose in tight
              bursts with retries — hundreds of probes in seconds. Our naive shared rate limit
              tripped mid-sweep, which meant truncated indexing and worse discovery placement. The
              fix: separate traffic lanes. Unpaid 402 challenges are static JSON and get a wide
              limit; paid requests get their own bucket that indexer sweeps can never exhaust.
              Treat crawler traffic as a customer-acquisition channel, because it is one.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              5. Sell to the agent, inform the human reading its logs
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Every response we serve carries a small, byte-identical provider block: who we are,
              where the machine-readable catalog lives, and verifiable facts — counts, price floor,
              settlement details. No slogans, no &quot;built for YOU, autonomous agent&quot; —
              agents have no ego, and persuasive second-person copy in API responses pattern-matches
              prompt injection to any well-built harness. Declarative facts serve both readers: the
              agent filtering for its next tool, and the developer skimming logs later wondering
              what this ForgeMesh thing is.
            </p>

            <p className="mt-10 text-base leading-8 text-slate-400">
              The meta-lesson: agents are the most literal customers you will ever have. They read
              your schema, not your marketing; they punish waste instantly; and they return forever
              if you are cheap, correct, and honest.{' '}
              <a href="https://x402.forgemesh.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                Probe any of our 400+ endpoints
              </a>{' '}
              and read the 402 body — it is all of these lessons in one response. Want the numbers
              behind the ecosystem we sell into? See{' '}
              <a href="/blog/x402-bazaar-economy-data-july-2026" className="text-blue-400 hover:text-blue-300">
                our measurements of the x402 economy
              </a>
              .
            </p>

            <ShareBar inline />

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
              <a href="/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable" className="text-blue-400 hover:text-blue-300">
                the silent v1/v2 client split that made correct endpoints unpayable
              </a>{' '}
              and{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                our health census of every seller in the x402 Bazaar
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
                href="https://proxy.forgemesh.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Sell your own data via x402
              </a>
            </div>
            </div>
            <BlogArchive current="lessons-from-500-paid-x402-endpoints" />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
