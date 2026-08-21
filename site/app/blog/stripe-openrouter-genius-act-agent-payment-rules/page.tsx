import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const PUBLISHED = '2026-08-18';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Stripe, AP2, GENIUS Act: New Agent Payment Rules | ForgeMesh',
  description:
    'Stripe reportedly buys OpenRouter, Google’s AP2 moves to FIDO, and GENIUS Act stablecoin rules land — what each means for x402 and MPP sellers.',
  keywords: [
    'Stripe OpenRouter acquisition', 'GENIUS Act stablecoin rules', 'MPP machine payments protocol',
    'AP2 FIDO Alliance', 'agent payments regulation', 'x402', 'stablecoin issuer license',
    'agent economy', 'AI agent payments',
  ],
  alternates: { canonical: '/blog/stripe-openrouter-genius-act-agent-payment-rules' },
  openGraph: {
    title: 'Three Different People Just Started Writing the Rules for How Agents Pay',
    description:
      'Stripe buys the routing layer, Google hands its payments protocol to a standards body, and Treasury publishes the stablecoin licensing rules — all in one week. What it means for agent-payment sellers.',
    type: 'article',
    url: 'https://forgemesh.io/blog/stripe-openrouter-genius-act-agent-payment-rules',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/stripe-openrouter-genius-act-agent-payment-rules.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/stripe-openrouter-genius-act-agent-payment-rules.png'],
    title: 'Three Different People Just Started Writing the Rules for How Agents Pay',
    description:
      'Stripe × OpenRouter, AP2 → FIDO, and the GENIUS Act stablecoin rules — one week, three rulebooks, and the first 24-hour read on the MPP rail.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Three Different People Just Started Writing the Rules for How Agents Pay',
      description:
        'Analysis of three concurrent governance shifts in agent payments: Stripe’s reported $7B+ acquisition of OpenRouter, Google’s donation of the AP2 protocol to the FIDO Alliance, and Treasury’s GENIUS Act stablecoin issuance NPRM published August 18, 2026 — with same-week MPP rail activity data.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/stripe-openrouter-genius-act-agent-payment-rules',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'Who writes the rules for agent payments', item: 'https://forgemesh.io/blog/stripe-openrouter-genius-act-agent-payment-rules' },
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
                From The Brief · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Three different people just started writing the rules for how agents pay.
            </h1>

            <img
              src="/blog/stripe-openrouter-genius-act-agent-payment-rules.png"
              alt="Three glowing rulebooks standing on a dark reflective table"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={675}
            />

            <ShareBar inline />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              In the span of one week: a payments company reportedly bought the biggest AI model
              routing layer, Google handed its agent-payments protocol to a standards body, and the
              U.S. Treasury published the actual licensing rules for who gets to issue the money.
              None of these three moves referenced the others. All of them are about the same
              question — and if you sell to agents on x402 or MPP, all three land on you.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              1. The company that bought the routing layer
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Stripe’s reported $7B+ acquisition of OpenRouter — first reported by{' '}
              <a
                href="https://fortune.com/2026/08/16/stripe-7-billion-deal-ai-firm-openrouter-acquisition/"
                className="text-blue-400 hover:text-blue-300"
              >
                Bloomberg and Fortune on August 16
              </a>{' '}
              and not yet self-confirmed by either company — puts one firm in control of both model
              routing (400+ models, roughly $1B in annualized inference volume) and a settlement
              rail, MPP. Developer reaction has been cautious rather than celebratory, and the
              concern is specific: gateway neutrality, now that the same company owns the pipe and
              the meter. A router that also settles payments has opinions about which payments are
              easy to settle.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              2. Google didn’t wait to see how that plays out
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Back in May, Google{' '}
              <a
                href="https://blog.google/products-and-platforms/platforms/google-pay/agent-payments-protocol-fido-alliance/"
                className="text-blue-400 hover:text-blue-300"
              >
                donated its Agent Payments Protocol (AP2) to the FIDO Alliance
              </a>{' '}
              for open, vendor-neutral governance — with Mastercard, Visa, PayPal, Coinbase, and
              some sixty other organizations joining the working groups — and shipped a v0.2 adding
              &quot;Human Not Present&quot; autonomous payment flows. Read on its own in May, that
              was a standards announcement. Read next to this week’s news, it looks like a
              hedge: nobody wants one company holding both the routing layer and the rulebook. The
              protocol landscape is now splitting three ways — x402’s registry-and-crawler
              model under the{' '}
              <a href="/blog/x402-foundation-linux-foundation-launch" className="text-blue-400 hover:text-blue-300">
                Linux Foundation
              </a>
              , MPP pushed by Stripe directly into agent-framework SDKs, and AP2 under a
              standards body.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              3. And this week, the permit process for the money itself
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              On August 18, Treasury published its{' '}
              <a
                href="https://www.federalregister.gov/documents/2026/08/18/2026-16796/genius-act-regulations-on-payment-stablecoin-issuance-offer-and-sale"
                className="text-blue-400 hover:text-blue-300"
              >
                GENIUS Act stablecoin rules in the Federal Register
              </a>{' '}
              — the proposed licensing regime for who may issue, offer, and sell payment
              stablecoins in the United States, following earlier proposals from the OCC and FDIC
              this year. Two things to keep straight: it covers <em>issuers</em>, not facilitators,
              so this is not new rules for x402 or MPP sellers directly. But nearly every agent
              payment on both rails settles in a stablecoin — so the licensing status of the entity
              behind your settlement asset just became a live variable in your stack. Comments
              close October 19; the Act takes effect January 2027. This is the fight over agent
              money we wrote about{' '}
              <a href="/blog/open-usd-circle-stablecoin-x402" className="text-blue-400 hover:text-blue-300">
                when Open USD launched
              </a>
              , moving from press releases into the Federal Register.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The number that moved
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              We snapshot the public MPPscan dashboard the way we crawl the x402 catalog — because
              announced numbers and measured numbers are different genres. In the 24 hours after
              the acquisition news broke, between our August 17 and August 18 snapshots:
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { n: '+7.5%', d: 'transactions on the MPP rail — 238,000 → 255,900 between snapshots' },
                { n: '+11.5%', d: 'settled volume — $86,800 → $96,780' },
                { n: '+11.2%', d: 'unique paying agents — 42,900 → 47,700' },
                { n: '−0.8%', d: 'registered servers — 360 → 357, the one metric that held flat' },
              ].map((s) => (
                <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base leading-8 text-slate-400">
              The honest caveats: the dashboard is self-reported by a self-service registry, and
              one day is a data point, not a trend. But usage growing double digits while server
              count holds flat is the shape you’d expect if existing services are getting more
              agent traffic — and it’s the first read on the rail since the news. We run our
              fleet dual-stack across both x402 and MPP precisely so we don’t have to guess
              which rulebook wins.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              What we’d watch this week
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Whichever settlement rail your service runs on, check whether your stablecoin’s
              issuer shows up in the comment docket on the Treasury rule. That’s the earliest
              signal for who ends up licensed, who ends up restructuring — and whose rail gets
              complicated. The changes that affect your revenue in this ecosystem{' '}
              <a href="/blog/x402-catalog-purge-overnight-july-2026" className="text-blue-400 hover:text-blue-300">
                usually ship silently
              </a>
              ; this one, for once, comes with a comment period.
            </p>

            <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                The ForgeMesh Brief
              </p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Brief subscribers read this analysis on August 18 — the day the Treasury rule hit
                the Federal Register. The Brief only sends when something in the agent-payments
                ecosystem actually moves. Next time it does, be first.
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
              <a href="/blog/x402-foundation-linux-foundation-launch" className="text-blue-400 hover:text-blue-300">
                the x402 Foundation launching under Linux Foundation governance
              </a>{' '}
              and{' '}
              <a href="/blog/open-usd-circle-stablecoin-x402" className="text-blue-400 hover:text-blue-300">
                how Open USD blindsided Circle
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
            <BlogArchive current="stripe-openrouter-genius-act-agent-payment-rules" />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
