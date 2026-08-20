import type { Metadata } from 'next';
import { ArrowRight, Bot, CircleDollarSign, Globe, Landmark, Server, Zap } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

const LAST_UPDATED = '2026-07-18';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'What is x402? The Payment Protocol for AI Agents, Explained | ForgeMesh Labs',
  description:
    'x402 is an open protocol that lets AI agents and apps pay for web resources over HTTP using the 402 status code. Now governed by the Linux Foundation with 40 members including Visa, Mastercard, Stripe, Google, Cloudflare, and Coinbase. Written by operators of 11 live x402 services.',
  keywords: [
    'x402', 'what is x402', 'x402 protocol', 'x402 payments', 'HTTP 402',
    'AI agent payments', 'machine payments', 'agentic commerce', 'x402 Foundation',
    'USDC micropayments', 'pay per request API',
  ],
  alternates: { canonical: '/x402' },
  openGraph: {
    title: 'What is x402? The Payment Protocol for AI Agents, Explained',
    description:
      'The open protocol that lets AI agents pay for web resources over HTTP — now under Linux Foundation governance with Visa, Mastercard, Stripe, Google, Cloudflare, and Coinbase on board.',
    type: 'article',
    url: 'https://forgemesh.io/x402',
    publishedTime: '2026-07-18',
    modifiedTime: LAST_UPDATED,
    authors: ['ForgeMesh Labs'],
    images: ['/fm-nobg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/fm-nobg.png'],
    title: 'What is x402? The Payment Protocol for AI Agents, Explained',
    description:
      'How AI agents pay for web resources over HTTP — from an operator running 11 live x402 services.',
  },
};

const timeline = [
  {
    date: 'May 2025',
    event: 'Coinbase releases x402',
    detail:
      'Coinbase publishes x402 as an open-source protocol and whitepaper at x402.org, activating the HTTP 402 status code for machine-native payments with stablecoins.',
  },
  {
    date: 'September 23, 2025',
    event: 'Cloudflare and Coinbase announce the x402 Foundation',
    detail:
      'Cloudflare ships x402 support in its Agents SDK and MCP integrations, and proposes the deferred payment scheme that decouples cryptographic verification from settlement.',
  },
  {
    date: 'July 1, 2026',
    event: 'Cloudflare opens the Monetization Gateway waitlist',
    detail:
      'Any resource behind Cloudflare — pages, APIs, datasets, MCP tools — can charge agents per request, settling over x402.',
  },
  {
    date: 'July 14, 2026',
    event: 'Linux Foundation launches the x402 Foundation operationally',
    detail:
      '40 member organizations at launch, including Visa, Mastercard, American Express, Stripe, Adyen, Google, AWS, Shopify, Circle, Cloudflare, and Coinbase. The protocol moves to neutral, vendor-independent governance.',
  },
  {
    date: 'September 15, 2026',
    event: 'Cloudflare default bot policy changes',
    detail:
      'New Cloudflare defaults block AI training and agent crawlers on ad-supported sites. Paying for access via x402 becomes the sanctioned path for agents to reach a large share of the web.',
  },
];

const comparison = [
  {
    dim: 'Payment trigger',
    x402: 'HTTP 402 response with machine-readable payment requirements',
    keys: 'Signup form, dashboard, manually provisioned API key',
    mpp: 'Stripe-managed machine payment flow (MPP)',
  },
  {
    dim: 'Account required',
    x402: 'None — a funded wallet is the only prerequisite',
    keys: 'Account, billing profile, card on file',
    mpp: 'Stripe relationship for the seller',
  },
  {
    dim: 'Minimum viable price',
    x402: '$0.001 or lower (stablecoin settlement)',
    keys: 'Card fees make sub-$0.30 uneconomical',
    mpp: 'Sub-cent possible on stablecoin rails',
  },
  {
    dim: 'Settlement',
    x402: 'Atomic, on-chain (USDC on Base, Solana, and others)',
    keys: 'Monthly invoice or card batch',
    mpp: 'Stripe rails: cards or stablecoins',
  },
  {
    dim: 'Agent-friendly',
    x402: 'Yes — designed for autonomous clients',
    keys: 'No — checkout flows require a human',
    mpp: 'Yes — Stripe-centric',
  },
  {
    dim: 'Governance',
    x402: 'x402 Foundation under the Linux Foundation (40 members)',
    keys: 'Per-vendor',
    mpp: 'Stripe',
  },
];

const faqItems = [
  {
    question: 'What is x402 in one sentence?',
    answer:
      'x402 is an open protocol that lets software — especially AI agents — pay for web resources at request time over plain HTTP, using the 402 Payment Required status code to communicate the price and stablecoins or other rails to settle it.',
  },
  {
    question: 'Who created x402?',
    answer:
      'Coinbase created x402 and released it as open source in May 2025. In September 2025 Coinbase and Cloudflare announced the x402 Foundation, and on July 14, 2026 the Linux Foundation launched the foundation operationally with 40 member organizations, moving the protocol to neutral community governance.',
  },
  {
    question: 'Is x402 only for crypto payments?',
    answer:
      'No. Most production traffic today settles in USDC on networks like Base, but the protocol is payment-type agnostic by design, and the x402 Foundation explicitly supports multiple payment types from traditional cards to stablecoins. Cloudflare’s deferred scheme separates verification from settlement so traditional rails can participate.',
  },
  {
    question: 'What does an x402 payment cost?',
    answer:
      'Whatever the seller sets — there is no protocol-imposed minimum. In practice, live x402 endpoints price from $0.001 per call upward. ForgeMesh’s own 500+ paid endpoints range from $0.001 to $0.75 per request.',
  },
  {
    question: 'How is x402 related to HTTP error 402?',
    answer:
      'HTTP 402 Payment Required was reserved in the HTTP specification in 1997 "for future use" and sat mostly unused for nearly three decades. x402 is the first widely adopted standard to activate it: the 402 response carries structured payment requirements that a client can fulfill programmatically.',
  },
  {
    question: 'How many x402 services exist today?',
    answer:
      'ForgeMesh’s independent crawler has cataloged over 27,000 distinct paid x402 resources, with the live Bazaar discovery catalog fluctuating around 25,000 listings from more than 1,130 unique sellers as of July 18, 2026 — up from 1,100 sellers on July 15, 2026.',
  },
  {
    question: 'Do I need an API key to call an x402 API?',
    answer:
      'No. That is the point: an agent hits the endpoint, receives a 402 challenge describing the price and payment address, pays it (typically USDC), retries with the payment proof header, and gets the resource. No account, no signup, no key management.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What is x402? The Payment Protocol for AI Agents, Explained',
      description:
        'x402 is an open protocol that lets AI agents and applications pay for web resources over HTTP using the 402 status code.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of 11 x402 services and counting, with 500+ paid endpoints.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: '2026-07-18',
      dateModified: LAST_UPDATED,
      mainEntityOfPage: 'https://forgemesh.io/x402',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'What is x402?', item: 'https://forgemesh.io/x402' },
      ],
    },
  ],
};

export default function X402Page() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Hero + definition */}
        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Protocol guide · updated {LAST_UPDATED}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-6xl">
              What is x402?
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
              <strong className="text-slate-100">x402 is an open protocol that lets AI agents and
              applications pay for web resources over HTTP.</strong>{' '}
              When a client requests a paid resource, the server answers with the HTTP{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                402 Payment Required
              </a>{' '}
              status code and machine-readable payment instructions. The client pays — typically in
              USDC stablecoins, settled in seconds — retries with proof of payment, and receives the
              resource. No account, no API key, no checkout form.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Originally created by Coinbase in May 2025, x402 is now stewarded by the{' '}
              <a
                href="https://www.linuxfoundation.org/x402foundation/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                x402 Foundation under the Linux Foundation
              </a>{' '}
              with 40 member organizations, including Visa, Mastercard, American Express, Stripe,
              Google, AWS, Cloudflare, Circle, Shopify, and Coinbase. The protocol specification
              lives at{' '}
              <a
                href="https://www.x402.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                x402.org
              </a>
              .
            </p>
            <p className="mt-4 rounded border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-sm leading-6 text-slate-300">
              <strong className="text-blue-300">Why trust this page:</strong> ForgeMesh Labs operates
              11 x402 services and counting — 500+ paid endpoints priced from $0.001 —, and runs an
              independent crawler of the x402 discovery ecosystem. Everything here is written from
              first-hand operation, not summaries of summaries.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              How does x402 work?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              An x402 payment is a four-step HTTP exchange that completes in a few seconds:
            </p>
            <ol className="mt-8 space-y-5">
              {[
                {
                  icon: Bot,
                  title: '1. The agent requests a resource',
                  text: 'A client — usually an AI agent — sends an ordinary HTTP request to a paid endpoint, with no credentials of any kind.',
                },
                {
                  icon: CircleDollarSign,
                  title: '2. The server answers 402 Payment Required',
                  text: 'The response body and PAYMENT-REQUIRED header carry structured payment requirements: price, currency, network, receiving address, timeout, and often the input schema and a worked example.',
                },
                {
                  icon: Zap,
                  title: '3. The agent pays and retries',
                  text: 'The client signs a payment authorization from its wallet (commonly USDC on Base) and retries the same request with an X-PAYMENT header containing the proof.',
                },
                {
                  icon: Server,
                  title: '4. The server verifies, settles, and serves',
                  text: 'A facilitator verifies and settles the payment on-chain, and the server returns the resource. If the handler fails, settlement is cancelled — the buyer is not charged for errors.',
                },
              ].map((s) => (
                <li key={s.title} className="flex gap-4 rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <s.icon className="mt-1 h-5 w-5 shrink-0 text-blue-400" aria-hidden />
                  <div>
                    <h3 className="font-medium text-slate-100">{s.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              The protocol defines payment <em>schemes</em> — &quot;exact&quot; for fixed prices, with
              &quot;upto&quot; and Cloudflare&apos;s proposed &quot;deferred&quot; scheme extending it to
              usage-based pricing and settlement over traditional rails.
            </p>
          </div>
        </section>

        {/* History timeline */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              A brief history of x402
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.12] text-slate-300">
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Milestone</th>
                    <th className="py-3 font-medium">Why it matters</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((t) => (
                    <tr key={t.date} className="border-b border-white/[0.05] align-top">
                      <td className="whitespace-nowrap py-4 pr-4 font-mono text-xs text-blue-300/90">{t.date}</td>
                      <td className="py-4 pr-4 font-medium text-slate-200">{t.event}</td>
                      <td className="py-4 leading-6 text-slate-400">{t.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Sources:{' '}
              <a href="https://blog.cloudflare.com/x402/" target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300">Cloudflare (Sept 23, 2025)</a>,{' '}
              <a href="https://blog.cloudflare.com/monetization-gateway/" target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300">Cloudflare Monetization Gateway (July 2026)</a>,{' '}
              <a href="https://www.prnewswire.com/news-releases/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications-302824778.html" target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300">Linux Foundation press release (July 14, 2026)</a>.{' '}
              Read our full analysis:{' '}
              <a href="/blog/x402-foundation-linux-foundation-launch" className="text-blue-400 hover:text-blue-300">
                Linux Foundation takes over x402 →
              </a>
            </p>
          </div>
        </section>

        {/* Ecosystem stats — original data */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              How big is the x402 ecosystem?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              ForgeMesh runs an independent crawler of the x402 Bazaar discovery catalog three times
              a day. As of <strong className="text-slate-200">July 18, 2026</strong>, from our own
              measurements:
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { n: '27,000+', d: 'distinct paid x402 resources cataloged by our crawler since tracking began' },
                { n: '~25,000', d: 'live listings in the Bazaar discovery catalog at any given time' },
                { n: '1,136', d: 'unique sellers — up from 1,100 on July 15, 2026 (+3% in three days)' },
              ].map((s) => (
                <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Source: ForgeMesh Bazaar crawler (original data, refreshed 3× daily). Institutional
              adoption is moving equally fast: the x402 Foundation launched with 40 member
              organizations, and both{' '}
              <a href="https://www.infoq.com/news/2026/07/cloudflare-aws-x402-micropayment/" target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300">
                Cloudflare and AWS now embed x402 at the edge
              </a>
              .
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              x402 vs API keys vs Stripe MPP
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.12] text-slate-300">
                    <th className="py-3 pr-4 font-medium"></th>
                    <th className="py-3 pr-4 font-medium text-blue-300">x402</th>
                    <th className="py-3 pr-4 font-medium">API keys + cards</th>
                    <th className="py-3 font-medium">Stripe MPP</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.dim} className="border-b border-white/[0.05] align-top">
                      <td className="py-4 pr-4 font-medium text-slate-200">{row.dim}</td>
                      <td className="py-4 pr-4 leading-6 text-slate-300">{row.x402}</td>
                      <td className="py-4 pr-4 leading-6 text-slate-400">{row.keys}</td>
                      <td className="py-4 leading-6 text-slate-400">{row.mpp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Try it */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              See x402 in production
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              The fastest way to understand x402 is to trigger a real payment challenge. Every
              ForgeMesh endpoint answers unauthenticated requests with a live, spec-compliant 402:
            </p>
            <pre className="mt-6 overflow-x-auto rounded border border-white/[0.08] bg-black/40 p-5 font-mono text-xs leading-6 text-slate-300">
{`curl -X POST https://x402.forgemesh.io/current-time \\
  -H 'Content-Type: application/json' -d '{}'

# → HTTP 402 Payment Required
# → price, network, input schema, worked example,
#   and payment instructions — all machine-readable`}
            </pre>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://x402.forgemesh.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Explore 400+ live x402 endpoints <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://proxy.forgemesh.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Monetize your own URL with x402
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              x402: frequently asked questions
            </h2>
            <div className="mt-8 space-y-6">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-medium text-slate-100">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.answer}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-sm leading-6 text-slate-500">
              Go deeper:{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                the 30-year history of HTTP 402 Payment Required
              </a>{' '}
              ·{' '}
              <a href="/blog" className="text-blue-400 hover:text-blue-300">
                ForgeMesh blog
              </a>{' '}
              ·{' '}
              <a href="https://www.x402.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                official x402 specification
              </a>
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
