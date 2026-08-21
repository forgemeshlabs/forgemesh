import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const PUBLISHED = '2026-08-20';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'x402 v1/v2 Client Split: Why Endpoints Go Unpayable | ForgeMesh',
  description:
    '@x402/core went v2; x402-fetch still speaks v1. Four silent wire-format breaks make correct servers unpayable. How we found and fixed it on-chain.',
  keywords: [
    'x402 v2', 'x402-fetch', '@x402/core', 'x402 breaking changes', 'x402 wire format',
    'x402 client compatibility', 'x402 402 challenge', 'agent payments', 'MPP dual-stack',
    'x402 settlement', 'USDC micropayments', 'Base mainnet',
  ],
  alternates: { canonical: '/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable' },
  openGraph: {
    title: 'The x402 SDK Went v2. The Client Everyone Installs Didn’t. Your Endpoint May Be Unpayable.',
    description:
      'Four silent wire-format breaks separate the x402 v2 server SDK from x402-fetch, the most-installed client — still v1-only as of its April 2026 release. No error on either side. We found it trying to pay our own endpoint, and proved the fix with a real on-chain settlement.',
    type: 'article',
    url: 'https://forgemesh.io/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable.png'],
    title: 'Your v2 x402 server can’t hear the client everyone installs',
    description:
      '@x402/core went v2 in December 2025. x402-fetch, the most-installed client, is still v1-only. Four silent wire-format breaks, no error on either side — and what it did to our settlement numbers.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'The x402 SDK Went v2. The Client Everyone Installs Didn’t. Your Endpoint May Be Unpayable.',
      description:
        'Field report on the x402 v1/v2 client-server split: @x402/core went v2 in December 2025, x402-fetch (the most-installed client) last shipped April 16, 2026 as v1-only, and four silent wire-format breaks mean a correct v2 server and the market-standard client fail with no error anywhere. Includes fleet-wide settlement data and a proven on-chain fix.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'The x402 v1/v2 client split', item: 'https://forgemesh.io/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable' },
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
                Field notes · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              The x402 SDK went v2. The client everyone installs didn’t. Your endpoint may be
              unpayable.
            </h1>

            <img
              src="/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable.png"
              alt="Two glowing cable connectors with mismatched incompatible plugs"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={675}
            />

            <ShareBar inline />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              In December 2025 the x402 server SDK, <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200">@x402/core</code>,
              shipped a v2 major version — the correct move, and the one every current guide tells
              you to make. x402-fetch, the most-installed x402 client on npm, last published on
              April 16, 2026. It has only ever spoken v1. No v2 build of x402-fetch exists today.
              Build a server on the current SDK, the choice every tutorial recommends, and you are
              speaking a dialect the most common client in the ecosystem cannot hear.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The numbers
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { n: 'Dec 2025', d: '@x402/core ships v2 — the server SDK every current guide tells you to build on' },
                { n: 'Apr 16, 2026', d: 'last publish date of x402-fetch, the most-installed x402 client on npm — still v1 only, no v2 release exists' },
                { n: '4', d: 'silent wire-format breaks between the two dialects, and not one of them raises an error on either side' },
                { n: '~98%', d: 'the settlement collapse our own fleet’s analytics showed over two months, while 402 challenge volume held steady in the hundreds of thousands a month' },
              ].map((s) => (
                <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Four breaks, and every one of them is quiet
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              None of these throws an exception. None returns a status code that says what went
              wrong. Each one is a place where the v1 client and the v2 server each do exactly what
              their own spec says, and simply stop understanding each other.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { n: 'The challenge moved', d: 'the 402 payment challenge moved from the JSON response body to a base64-encoded header. The v1 client reads bodies. It sees a 402 with nothing in it to parse.' },
                { n: 'Network IDs changed shape', d: 'networks went from plain names like "base" to CAIP-2 identifiers like "eip155:8453". The v1 client’s own validation rejects the new format outright — a well-formed v2 challenge fails before it reaches the wallet step.' },
                { n: 'Fields got renamed', d: 'maxAmountRequired became amount, and resource metadata moved from a flat structure to nested. A client reading the old field names finds nothing there and treats the requirement as missing.' },
                { n: 'The payment vanishes', d: 'even when a v1 client assembles a valid payment, it sends it back in a header the v2 server never reads. The payment is real and correctly signed. The server just re-serves the paywall.' },
              ].map((b) => (
                <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-base font-semibold text-blue-300">{b.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The failure is silent on both sides
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              An agent running the stock client hits a v2 endpoint, gets a 402 it can’t fully
              parse — or sends a payment that never lands — and does exactly what it’s built to do:
              treats the resource as unavailable and moves to the next supplier. No error surfaces
              anywhere in its logs. On the seller’s side, the dashboard looks healthy: the challenge
              fired, the request was answered, the endpoint is up. The only place the problem shows
              up is the one number nobody watches closely enough — settlements, quietly cratering
              while challenge traffic stays flat. That is exactly what our own fleet analytics
              showed: challenge volume steady in the hundreds of thousands a month, settlements down
              roughly 98% over two months, and nothing in any log to explain why.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              How we found it
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              We found this the way most sellers won’t: we tried to pay our own endpoint with the
              stock client. Off-the-shelf x402-fetch, no modifications, against our own v2 server.
              The payment attempt produced no error — it just didn’t settle. Tracing it meant
              capturing the raw request and response on both sides of the exchange and diffing them
              field by field against the v1 and v2 specs. That’s the whole methodology, and it’s one
              any seller can run against their own endpoint: log the raw wire traffic a stock client
              actually sends, log what your server actually reads, and look for the gap.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              What we did, and the proof
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              We rebuilt all 19 services in our fleet to answer both dialects on the same endpoint
              — a v1 request gets a v1-shaped response, a v2 request gets v2, and a payment sent
              either way actually gets read and settled. Then we proved it rather than assumed it:
              a real $0.05 USDC payment on Base, initiated by unmodified stock x402-fetch 1.2.0,
              settled on-chain, with the receipt correctly decoded by that same client. Transaction:{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200 break-all">
                0x30101fb985fb33334e494dc536b09566fa518a28f50faf99bf79ab20cd6b5633
              </code>
              . No custom client, no patched SDK — the exact library the widest slice of the agent
              economy already has installed, paying an endpoint built on the newest server SDK,
              settling and reconciling cleanly.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              You can outrun the market
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Building on the current spec was the right call by every engineering standard we
              know. It also made our fleet technically correct and commercially invisible for two
              months, because protocol correctness and payability are not the same property, and
              nothing in a passing test suite tells you which one you have. The fix isn’t choosing
              the older, safer SDK — it’s serving both: ship current because that’s where the
              protocol is going, keep answering legacy because that’s who’s actually knocking today,
              and test payability with the clients your buyers run, not the ones already sitting in
              your own stack. You will not catch this bug by testing against tooling that already
              agrees with your server about the spec version.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The same shape of problem is showing up one layer over, with MPP as a second payment
              rail growing alongside x402 —{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                about 15% of Bazaar sellers already answer both challenge types on the same 402
              </a>
              , for the identical reason: the buyer you can’t see is running something other than
              what you built against.
            </p>

            <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Check your own door
              </p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                We turned the diagnostic above into a free scan — it checks whether stock clients
                can actually pay you, not just whether your server statuses look right. If it finds
                you’re v1-blind, the fix is in the x402 Server Starter Kit: the settlement-proven
                dual-dialect middleware plus MPP dual-stack support, with updates dropped into
                buyers’ Discord as the ecosystem shifts again — because it will.
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
              <a href="/blog/x402-500-character-description-limit" className="text-blue-400 hover:text-blue-300">
                the 500-character cliff that silently breaks listings
              </a>{' '}
              and{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                our health census of every seller in the x402 Bazaar
              </a>
              .
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                More from the blog
              </a>
            </div>
            </div>
            <BlogArchive current="x402-v1-v2-client-split-your-endpoint-may-be-unpayable" />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
