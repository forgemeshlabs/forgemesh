import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const PUBLISHED = '2026-08-19';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'x402 Bazaar Health Census: 1 in 4 Sellers Can’t Sell | ForgeMesh',
  description:
    'We probed all 1,225 x402 Bazaar sellers: 74% pass, 206 dead URLs, 40 giving paid products away free. The first health census of the agent economy.',
  keywords: [
    'x402 Bazaar', 'x402 health check', 'agent economy data', 'x402 endpoint audit',
    'MPP dual-stack adoption', 'x402 sellers', 'agent payments', 'x402 catalog census',
    'machine payments protocol', 'AI agent APIs',
  ],
  alternates: { canonical: '/blog/x402-bazaar-health-census-august-2026' },
  openGraph: {
    title: 'We Health-Checked Every Seller in the x402 Bazaar. One in Four Can’t Take an Agent’s Money.',
    description:
      'One probe per seller, all 1,225 of them: 206 dead at their listed URL, 40 giving their paid product away for free, 15% already dual-stack on x402 + MPP. The first health census of the agent economy.',
    type: 'article',
    url: 'https://forgemesh.io/blog/x402-bazaar-health-census-august-2026',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/x402-bazaar-health-census-august-2026.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/x402-bazaar-health-census-august-2026.png'],
    title: 'One in four x402 sellers can’t actually take an agent’s money',
    description:
      'We probed all 1,225 sellers in the x402 Bazaar: 206 dead, 40 serving paid content for free, 15% already dual-stack x402 + MPP. The first health census of the agent economy.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'We Health-Checked Every Seller in the x402 Bazaar. One in Four Can’t Take an Agent’s Money.',
      description:
        'First full health census of the x402 Bazaar: one live-endpoint probe per seller across all 1,225 sellers in the catalog on August 19, 2026. Results: 74% healthy, 17% dead at their listed URL, 40 sellers serving paid content without a paywall, 15% dual-stack x402 + MPP.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/x402-bazaar-health-census-august-2026',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'x402 Bazaar health census, August 2026', item: 'https://forgemesh.io/blog/x402-bazaar-health-census-august-2026' },
      ],
    },
  ],
};

export default function Page() {
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
                Original data · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              We health-checked every seller in the x402 Bazaar. One in four can’t take an
              agent’s money.
            </h1>

            <img
              src="/blog/x402-bazaar-health-census-august-2026.png"
              alt="A row of glowing storefronts at night with every fourth one dark"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={675}
            />

            <ShareBar inline />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              The x402 Bazaar catalog lists 15,092 resources from 1,225 sellers as of this morning.
              A catalog tells you what’s <em>listed</em>. It doesn’t tell you what{' '}
              <em>works</em> — whether an agent that shows up wallet-in-hand can actually complete
              a purchase. So we checked. On August 19 we probed one live endpoint from every single
              seller in the catalog: all 1,225 of them.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The numbers
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { n: '74%', d: '905 sellers pass: reachable, correct HTTP 402, and a parseable x402 payment envelope a client can actually pay against' },
                { n: '206', d: 'sellers (17%) are dead — their listed endpoint returns 404. The listing is a storefront with no store behind it' },
                { n: '40', d: 'sellers return their paid product with HTTP 200 and no payment challenge — the paywall never fires, and agents get the goods for free' },
                { n: '15%', d: '180 sellers already answer with both an x402 envelope and an MPP challenge on the same 402 — dual-stack adoption is real and nobody was measuring it' },
              ].map((s) => (
                <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              How we measured — and how we almost got it wrong
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Each seller got one GET request to one of their listed resources, 8-second timeout,
              honest User-Agent. A healthy x402 endpoint answers HTTP 402 with a machine-parseable
              payment envelope — most sellers put it in the base64{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200">payment-required</code>{' '}
              header, some in the response body; we accepted either. Our first pass only checked
              bodies and flagged nearly half the catalog as broken — including our own fleet. The
              envelope was in the header the whole time. We’re publishing that mistake because
              it’s the point: <em>even people who run x402 services for a living misread a 402
              at first glance.</em> An agent’s client library gets no second glance.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              We were also careful with the 143 sellers who answered 405 to a GET: those are mostly
              POST-only services, so each got a second probe as POST before judgment. 128 of them
              turned out perfectly healthy — they’re counted in the 74%, not shamed in the
              failure column. The remaining failures are the quiet ones: endpoints demanding API
              keys with a 401 (an agent with money but no key walks away), redirect loops, 5xxs,
              and two sellers whose 402 carries no envelope at all in header or body — a paywall
              that names no price a machine can read.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The 40 sellers giving it away
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The strangest cohort isn’t the dead listings — dead projects are normal in any
              young ecosystem. It’s the 40 sellers whose endpoints return the product with a
              clean HTTP 200 and no challenge. They did the hard part: built a service, listed it,
              kept the server up. Then the paywall silently never fired — a middleware ordering
              bug, an env var that didn’t load, a route added after the payment layer was
              configured. Every one of those sellers believes they’re in business. They’re
              running a free API with extra steps, and nothing in their logs looks wrong.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The catalog is a river, not a lake
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Our crawler has watched the Bazaar three times a day since early summer, and the
              churn is bigger than the catalog: <strong className="text-slate-200">23,847
              listings from 1,092 distinct sellers</strong> have appeared and vanished from the
              index over that window — more listings have left than the 15,092 that remain. Some
              of that is the{' '}
              <a href="/blog/x402-catalog-purge-overnight-july-2026" className="text-blue-400 hover:text-blue-300">
                silent purges we’ve written about
              </a>
              ; most is sellers shipping, breaking, and drifting away without ever knowing what
              broke. Against that backdrop, the 15% who’ve already gone dual-stack — answering
              x402 and MPP challenges on the same 402, as{' '}
              <a href="/blog/stripe-openrouter-genius-act-agent-payment-rules" className="text-blue-400 hover:text-blue-300">
                three different rulebooks get written around them
              </a>{' '}
              — are the cohort betting on the ecosystem hardest. We run our own fleet dual-stack,
              so we notice the company.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The honest caveats
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              One endpoint per seller is a health check, not a full audit — a seller with one dead
              route among fifty healthy ones can be misjudged in either direction, and a single
              afternoon is a snapshot, not a trend. We’ll re-run the census on a schedule and
              publish the movement. But even as a snapshot, the shape is clear: a quarter of the
              storefronts in the agent economy’s biggest catalog can’t complete a sale to
              the customers the catalog exists to bring them.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              If you sell on x402: check your own door
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Three checks that would have caught almost every failure in this census: hit your own
              listed URL from outside your network and confirm you get a 402 (not a 200, not a
              404); base64-decode your{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200">payment-required</code>{' '}
              header and confirm it parses with{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200">x402Version</code>{' '}
              and a non-empty{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200">accepts</code>{' '}
              array; and if your routes are POST-only, make sure a GET still answers with the
              challenge rather than a bare 405 — you don’t know which method a discovering
              agent tries first. We’re turning the census probe into a public scan tool — free
              in the browser for humans, and as a paid x402 endpoint agents can call on their own
              (yes, an x402 API for checking x402 APIs). It ships this week; Brief subscribers hear
              first.
            </p>

            <ShareBar inline />

            <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                The ForgeMesh Brief
              </p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                This census is the kind of thing The Brief exists for: original data from our own
                crawler and fleet, sent only when something in the agent-payments ecosystem
                actually moves. The scan tool launch and the next census land there first.
              </p>
              <a
                href="/brief"
                className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Subscribe to The Brief <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Selling to agents?
              </p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Check whether stock agent clients can actually pay your endpoint with the free scan,
                or ship the settlement-proven dual-rail middleware we run in production.
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
                the v1/v2 client split behind many failing sellers
              </a>{' '}
              and{' '}
              <a href="/blog/x402-bazaar-economy-data-july-2026" className="text-blue-400 hover:text-blue-300">
                our original measurement of the x402 economy
              </a>
              .
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://kit.forgemesh.io"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Get the x402 seller kits <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                More from the blog
              </a>
            </div>
            </div>
            <BlogArchive current="x402-bazaar-health-census-august-2026" />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
