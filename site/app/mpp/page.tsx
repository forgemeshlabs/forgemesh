import type { Metadata } from 'next';
import { ArrowRight, Bot, CircleDollarSign, Server, Zap } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

const LAST_UPDATED = '2026-08-20';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'What is MPP? Stripe’s Machine Payments Protocol for AI Agents, Explained | ForgeMesh Labs',
  description:
    'MPP (Machine Payments Protocol) is Stripe’s open protocol — built with Tempo — for AI agents to pay for APIs and content machine-to-machine over HTTP 402, settling in USDC on Base. How it works, how it compares to x402, and why 15% of x402 sellers already answer both.',
  keywords: [
    'MPP', 'what is MPP', 'Machine Payments Protocol', 'Stripe MPP', 'MPP vs x402',
    'WWW-Authenticate Payment', 'AI agent payments', 'HTTP 402', 'USDC on Base',
    'dual-stack x402 MPP', 'agentic commerce',
  ],
  alternates: { canonical: '/mpp' },
  openGraph: {
    title: 'What is MPP? Stripe’s Machine Payments Protocol for AI Agents, Explained',
    description:
      'Stripe’s open protocol for machine-to-machine payments over HTTP 402 — how it works, how it relates to x402, and why we run our whole fleet dual-stack.',
    type: 'article',
    url: 'https://forgemesh.io/mpp',
    publishedTime: LAST_UPDATED,
    modifiedTime: LAST_UPDATED,
    authors: ['ForgeMesh Labs'],
    images: ['/fm-nobg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/fm-nobg.png'],
    title: 'What is MPP? Stripe’s Machine Payments Protocol for AI Agents, Explained',
    description:
      'How Stripe’s Machine Payments Protocol works, how it compares to x402, and why 15% of x402 sellers already answer both on the same 402.',
  },
};

const comparison = [
  {
    dim: 'Challenge format',
    x402: 'Base64 payment-required header envelope, defined by the x402 spec',
    mpp: 'HTTP 402 plus a WWW-Authenticate: Payment header, following standard HTTP challenge conventions',
  },
  {
    dim: 'Discovery',
    x402: 'Bazaar catalog — crawlable, ~25,000 listings from 1,200+ sellers',
    mpp: 'No public catalog — distribution is SDK-embedded, built directly into agent frameworks',
  },
  {
    dim: 'Governance',
    x402: 'x402 Foundation under the Linux Foundation, 40 member organizations',
    mpp: 'Stripe',
  },
  {
    dim: 'Settlement',
    x402: 'USDC on Base (and other networks), atomic and on-chain',
    mpp: 'USDC on Base — the same settlement rail x402 uses',
  },
  {
    dim: 'How it reaches sellers',
    x402: 'Open spec — any facilitator or server can implement it independently',
    mpp: 'Ships inside Stripe and Tempo tooling, and the agent-framework SDKs Stripe integrates with',
  },
];

const faqItems = [
  {
    question: 'What is MPP in one sentence?',
    answer:
      'MPP — Machine Payments Protocol — is an open protocol, launched by Stripe together with Tempo in 2026, that lets AI agents pay for APIs and content machine-to-machine: a server challenges an unpaid request with HTTP 402 and a WWW-Authenticate: Payment header, the agent constructs and settles a payment, and retries with credentials.',
  },
  {
    question: 'Who created MPP?',
    answer:
      'Stripe, working with Tempo, launched MPP in 2026 as an open protocol for agent-native payments. It moved to the center of the conversation in August 2026 after Stripe’s reported $7B+ acquisition of OpenRouter put the same company in control of both a major model-routing layer and a settlement rail.',
  },
  {
    question: 'How does an MPP payment actually work?',
    answer:
      'An agent requests a resource with no credentials. The server answers 402 Payment Required with a WWW-Authenticate: Payment header describing what’s owed. The agent constructs a payment from that challenge — an EIP-3009-style authorization — settles it in USDC on Base, and retries the same request with payment credentials attached. The server verifies settlement and returns the resource.',
  },
  {
    question: 'Is MPP the same as x402?',
    answer:
      'No, but they’re close cousins rather than rivals in practice. Both trigger on HTTP 402 and both settle in USDC on Base — the same rail. They differ in challenge format and governance: x402 uses a base64 payment-required header envelope with Bazaar catalog discovery, under Linux Foundation governance since July 2026. MPP uses a WWW-Authenticate: Payment header and is pushed by Stripe directly into agent-framework SDKs, with no public discovery catalog.',
  },
  {
    question: 'What does "dual-stack" mean?',
    answer:
      'A server that answers a single 402 response with both an x402 payment envelope and an MPP WWW-Authenticate: Payment challenge in the same reply. One endpoint, two protocols — it reaches agents built for either rail without maintaining two separate services. In our August 2026 census of all 1,225 x402 Bazaar sellers, 15% (180 sellers) already do this.',
  },
  {
    question: 'Do I need a Stripe account to receive MPP payments?',
    answer:
      'MPP is Stripe-managed on the seller side — receiving payments over the rail runs through a Stripe relationship, unlike x402, where a funded wallet alone is enough to receive USDC. That’s the practical trade-off: x402 has no account requirement, MPP has Stripe’s infrastructure and distribution behind it.',
  },
  {
    question: 'How many x402 sellers already support MPP too?',
    answer:
      'In our August 19, 2026 health census of every seller in the x402 Bazaar catalog, 180 of 1,225 sellers — 15% — answered with both an x402 envelope and an MPP challenge on the same 402 response. Nobody was measuring dual-stack adoption before that census; we were the first to check.',
  },
  {
    question: 'Where can I see live MPP rail activity?',
    answer:
      'MPPscan (mppscan.com) is the public dashboard for MPP transaction and volume data. ForgeMesh’s own Rail Pulse tracks MPP transaction and volume snapshots daily, alongside our x402 Bazaar catalog crawl, on the ForgeMesh homepage.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What is MPP? Stripe’s Machine Payments Protocol for AI Agents, Explained',
      description:
        'MPP is Stripe’s open protocol, built with Tempo, for AI agents to pay for APIs and content machine-to-machine over HTTP 402, settling in USDC on Base.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources, all dual-stack.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: LAST_UPDATED,
      dateModified: LAST_UPDATED,
      mainEntityOfPage: 'https://forgemesh.io/mpp',
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
        { '@type': 'ListItem', position: 2, name: 'What is MPP?', item: 'https://forgemesh.io/mpp' },
      ],
    },
  ],
};

export default function MppPage() {
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
              What is MPP?
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
              <strong className="text-slate-100">MPP — Machine Payments Protocol — is Stripe’s open
              protocol for AI agents to pay for APIs and content machine-to-machine.</strong>{' '}
              When an agent requests a paid resource, the server answers with HTTP{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                402 Payment Required
              </a>{' '}
              and a <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">WWW-Authenticate: Payment</code>{' '}
              header describing what’s owed. The agent constructs and settles a payment — in USDC on
              Base — and retries with credentials attached. Same idea as x402, same settlement rail,
              different challenge format and a different company behind it.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Stripe launched MPP together with{' '}
              <a
                href="https://tempo.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Tempo
              </a>{' '}
              in 2026, and it moved to the center of the agent-payments conversation in August 2026
              after Stripe’s reported $7B+ acquisition of OpenRouter put one company in control of
              both a major model-routing layer and a settlement rail. Read our full take:{' '}
              <a href="/blog/stripe-openrouter-genius-act-agent-payment-rules" className="text-blue-400 hover:text-blue-300">
                three different people just started writing the rules for how agents pay →
              </a>
            </p>
            <p className="mt-4 rounded border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-sm leading-6 text-slate-300">
              <strong className="text-blue-300">Why trust this page:</strong> ForgeMesh Labs runs its
              entire fleet of paid endpoints dual-stack — answering both x402 and MPP on the same
              402 — and ran the first independent health census of MPP adoption across the x402
              Bazaar. This is written from first-hand operation, not a summary of a press release.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              How does an MPP payment actually flow?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Like x402, an MPP payment is a four-step HTTP exchange that completes in a few seconds
              — but the challenge lives in a standard HTTP header rather than a custom envelope:
            </p>
            <ol className="mt-8 space-y-5">
              {[
                {
                  icon: Bot,
                  title: '1. The agent requests a resource',
                  text: 'A client sends an ordinary HTTP request to a paid endpoint, with no credentials of any kind.',
                },
                {
                  icon: CircleDollarSign,
                  title: '2. The server answers 402 with a WWW-Authenticate: Payment challenge',
                  text: 'The response carries HTTP 402 Payment Required plus a WWW-Authenticate: Payment header — the machine-readable instructions for what to pay and how.',
                },
                {
                  icon: Zap,
                  title: '3. The agent constructs and settles a payment',
                  text: 'The client builds a payment from the challenge — an EIP-3009-style authorization — and settles it in USDC on Base, the same rail x402 uses.',
                },
                {
                  icon: Server,
                  title: '4. The agent retries, the server verifies and serves',
                  text: 'The client retries the original request with payment credentials attached. The server verifies settlement and returns the resource.',
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
          </div>
        </section>

        {/* MPP vs x402 */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              MPP vs x402
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              In practice these are complementary rails, not rivals. Both trigger on HTTP 402 and
              both settle in USDC on Base. What differs is who governs the spec, how a server
              advertises the challenge, and how agents find you in the first place.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.12] text-slate-300">
                    <th className="py-3 pr-4 font-medium"></th>
                    <th className="py-3 pr-4 font-medium">x402</th>
                    <th className="py-3 font-medium text-blue-300">MPP</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.dim} className="border-b border-white/[0.05] align-top">
                      <td className="py-4 pr-4 font-medium text-slate-200">{row.dim}</td>
                      <td className="py-4 pr-4 leading-6 text-slate-400">{row.x402}</td>
                      <td className="py-4 leading-6 text-slate-300">{row.mpp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 rounded border border-blue-500/20 bg-blue-500/[0.06] px-4 py-4 text-sm leading-6 text-slate-300">
              <strong className="text-blue-300">The practical answer is dual-stack.</strong> A server
              can answer both challenge types on the same 402 response — one endpoint reaching agents
              built for either protocol, with no separate infrastructure to run. Compare the full
              picture, including API-key alternatives, on{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">our x402 guide →</a>
            </p>
          </div>
        </section>

        {/* The numbers */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              How much of the x402 ecosystem already speaks MPP?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              On August 19, 2026 we ran the first independent health census of every seller in the
              x402 Bazaar catalog — probing one live endpoint per seller, all 1,225 of them, for
              exactly this question. Nobody had measured dual-stack adoption before.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="text-3xl font-semibold text-blue-300">15%</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  180 of 1,225 x402 Bazaar sellers already answer both an x402 envelope and an MPP
                  WWW-Authenticate: Payment challenge on the same 402 response
                </p>
              </div>
              <div className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="text-3xl font-semibold text-blue-300">Daily</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Rail Pulse on the ForgeMesh homepage tracks MPP transaction and volume snapshots
                  every day, alongside our x402 catalog crawl
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Full methodology and the rest of the census — dead listings, unenforced paywalls, and
              more — in{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                We health-checked every seller in the x402 Bazaar →
              </a>{' '}
              For public MPP rail data outside our own crawl, see{' '}
              <a href="https://mppscan.com" target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300">
                MPPscan
              </a>
              , the public dashboard for MPP transaction and volume activity, and our{' '}
              <a href="/#rail-pulse" className="text-blue-400/80 hover:text-blue-300">Rail Pulse</a>{' '}
              tracker.
            </p>
          </div>
        </section>

        {/* CTA: make your endpoint speak MPP */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Make your endpoint speak MPP
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              The fastest way to know where you stand is to test the endpoint you already run. Our
              free scanner checks any URL for the WWW-Authenticate: Payment header and tells you
              whether it’s MPP-ready, x402-ready, both, or neither.
            </p>
            <div className="mt-8 rounded border border-emerald-500/30 bg-emerald-500/[0.05] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                Technical Build package · $49
              </p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Knowing the four steps is not the same as shipping them. Adding a valid{' '}
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-emerald-200">
                  WWW-Authenticate: Payment
                </code>{' '}
                challenge alongside your existing x402 envelope — with correct EIP-3009 settlement, nonce and
                validity handling, and a facilitator that verifies both rails — is where sellers stall. Our Technical
                Build package ships the dual-stack middleware, the settlement wiring, and the exact envelope both
                stock clients accept, so one endpoint reaches both agent populations. We built our own fleet this way.
              </p>
              <a
                href="https://kit.forgemesh.io"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-emerald-400/70 hover:bg-emerald-500/20"
              >
                Get the Technical Build package <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/scan"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Scan your endpoint for MPP, free <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://kit.forgemesh.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Get the dual-stack seller kits
              </a>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Our own fleet runs dual-stack across every endpoint precisely so we don’t have to
              guess which rail wins. Read{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">what is x402?</a>{' '}
              for the other half of the story, or{' '}
              <a href="/brief" className="text-blue-400 hover:text-blue-300">subscribe to The Brief</a>{' '}
              for the next move in agent payments before it’s old news.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              MPP: frequently asked questions
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
              <a href="/x402" className="text-blue-400 hover:text-blue-300">
                what is x402?
              </a>{' '}
              ·{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                the dual-stack census
              </a>{' '}
              ·{' '}
              <a href="/blog" className="text-blue-400 hover:text-blue-300">
                ForgeMesh blog
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
