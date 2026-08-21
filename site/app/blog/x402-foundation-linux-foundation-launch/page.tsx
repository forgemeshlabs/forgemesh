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
  title: 'x402 Foundation Launches Under the Linux Foundation | ForgeMesh',
  description:
    'The x402 Foundation is live under Linux Foundation governance with 40 members including Visa, Mastercard, and Stripe. What actually changed for sellers.',
  keywords: [
    'x402 Foundation', 'Linux Foundation x402', 'x402 news', 'agent payments standard',
    'x402 protocol governance', 'internet-native payments', 'AI agent payments',
  ],
  alternates: { canonical: '/blog/x402-foundation-linux-foundation-launch' },
  openGraph: {
    title: 'The Linux Foundation Now Governs x402 — and the Card Networks Just Joined',
    description:
      '40 members. Neutral governance. The payment layer for AI agents is being standardized. Operator analysis.',
    type: 'article',
    url: 'https://forgemesh.io/blog/x402-foundation-linux-foundation-launch',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/x402-foundation-linux-foundation-launch.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/x402-foundation-linux-foundation-launch.png'],
    title: 'The Linux Foundation Now Governs x402 — and the Card Networks Just Joined',
    description: '40 members, neutral governance, one payment layer for AI agents. Operator analysis.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NewsArticle',
      headline: 'The Linux Foundation Now Governs x402 — and Visa, Mastercard, and Stripe Just Joined',
      description:
        'The x402 Foundation launched operationally under Linux Foundation governance on July 14, 2026, with 40 member organizations.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of 11 x402 services and counting, with 500+ paid endpoints.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/x402-foundation-linux-foundation-launch',
      citation: [
        'https://www.prnewswire.com/news-releases/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications-302824778.html',
        'https://www.linuxfoundation.org/x402foundation/',
        'https://www.x402.org/',
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Linux Foundation launches x402 Foundation',
          item: 'https://forgemesh.io/blog/x402-foundation-linux-foundation-launch',
        },
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
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-12">
            <div className="min-w-0 max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Protocol news · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              The Linux Foundation now governs x402 — and Visa, Mastercard, and Stripe just joined
            </h1>

            <img
              src="/blog/x402-foundation-linux-foundation-launch.png"
              alt="Classical pillars whose surfaces are made of glowing circuit traces"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={675}
            />

            <ShareBar inline />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              On July 14, 2026, the Linux Foundation{' '}
              <a
                href="https://www.prnewswire.com/news-releases/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications-302824778.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                announced the operational launch of the x402 Foundation
              </a>
              , the body that will steward the{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">x402 protocol</a> — the
              open standard that lets AI agents, APIs, and applications pay for resources over
              HTTP. Forty organizations joined at launch. We’ve run x402 in production since
              before it was fashionable, so here’s the operator’s read on what actually
              changed.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The membership list is the story
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Press releases about foundations are usually noise. This one isn’t, because of
              who signed. The premier tier alone includes{' '}
              <strong className="text-slate-200">
                Visa, Mastercard, American Express, Stripe, Adyen, Fiserv, Google, AWS, Cloudflare,
                Shopify, Circle, Coinbase, MoonPay, Ripple
              </strong>
              , and the Monad, Solana, and Stellar foundations. General and associate members add
              Polygon Labs, NEAR, Fireblocks, LayerZero, Merit Systems (who run x402scan), KakaoPay,
              and the Cardano Foundation, among others — 40 organizations in total.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Read that list again: <em>all four major US card networks or their processors</em> are
              funding the standardization of a protocol whose dominant settlement rail today is USDC
              on Base. The card networks did not join because they love stablecoins. They joined
              because agent-driven purchasing is coming regardless, and the protocol that mediates
              it is being decided now. When incumbents and disruptors fund the same neutral table,
              the protocol has stopped being a bet and started being infrastructure.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              What &quot;operational launch&quot; actually means
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              x402 was created and open-sourced by Coinbase in May 2025. Coinbase and Cloudflare{' '}
              <a href="https://blog.cloudflare.com/x402/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                announced the foundation in September 2025
              </a>
              , but governance still lived close to its creators. The July 14 launch moves the
              protocol under neutral Linux Foundation governance — the same structure that hosts
              Kubernetes and Linux itself. Coinbase contributed the protocol; no single vendor now
              controls its direction. Linux Foundation CEO Jim Zemlin framed the mission as ensuring
              &quot;the payment layer of the internet remains neutral, highly interoperable and
              ready to support digital commerce.&quot;
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Concretely, the foundation stewards the spec at{' '}
              <a href="https://www.x402.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                x402.org
              </a>{' '}
              and coordinates work on payment schemes beyond fixed-price stablecoin settlement —
              including Cloudflare’s deferred scheme, which separates cryptographic
              verification from settlement so that traditional rails (yes, cards) can ride the same
              402 exchange. That is why the card networks are in the room. Official foundation page:{' '}
              <a href="https://www.linuxfoundation.org/x402foundation/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                linuxfoundation.org/x402foundation
              </a>
              .
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The timing is not a coincidence
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Two weeks before this announcement, Cloudflare{' '}
              <a href="https://blog.cloudflare.com/monetization-gateway/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                opened the waitlist for its Monetization Gateway
              </a>{' '}
              — charge for any page, API, dataset, or MCP tool behind Cloudflare, settled over x402.
              And on <strong className="text-slate-200">September 15, 2026</strong>, Cloudflare’s
              new default settings start blocking AI training and agent crawlers on ad-supported
              sites. The sequence is deliberate: first the standard, then the tooling, then the
              default that makes paying the norm. A meaningful share of the web is about to answer
              bots with{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                402 Payment Required
              </a>{' '}
              instead of 200 or 403.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              What we see from inside the ecosystem
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              ForgeMesh operates 11 x402 services and counting, with 500+ paid endpoints, and our crawler indexes
              the x402 Bazaar discovery catalog three times a day. Our own numbers as of July 18,
              2026: roughly <strong className="text-slate-200">25,000 live paid resources</strong>{' '}
              from <strong className="text-slate-200">1,136 unique sellers</strong> — seller count
              up from 1,100 just three days earlier. Over 27,000 distinct paid resources have passed
              through the catalog since we began tracking. This is pre-institutional growth: the
              sellers arriving now are mostly independents. The foundation launch is what invites
              the enterprises in.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              If you sell data, APIs, or content, the practical takeaway is simple: the standard
              your future agent-customers will speak has now been decided, and it is x402. The cost
              of exposing a paid endpoint is an afternoon. We’ve documented what we learned
              shipping 500+ of them in{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">our x402 guide</a>, and
              if you want the zero-code path,{' '}
              <a href="https://proxy.forgemesh.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                x402 Proxy
              </a>{' '}
              puts a 402 in front of any URL you control.
            </p>

            <div className="mt-12 rounded border border-blue-500/20 bg-blue-500/[0.06] p-6">
              <h2 className="text-lg font-semibold text-slate-100">Sources</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                <li>
                  <a href="https://www.prnewswire.com/news-releases/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications-302824778.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Linux Foundation press release (PR Newswire, July 14, 2026)
                  </a>
                </li>
                <li>
                  <a href="https://www.linuxfoundation.org/x402foundation/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    x402 Foundation — official page
                  </a>
                </li>
                <li>
                  <a href="https://www.x402.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    x402 protocol specification (x402.org)
                  </a>
                </li>
                <li>
                  <a href="https://blog.cloudflare.com/x402/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Cloudflare: Launching the x402 Foundation with Coinbase (Sept 23, 2025)
                  </a>
                </li>
                <li>
                  <a href="https://blog.cloudflare.com/monetization-gateway/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Cloudflare: Announcing the Monetization Gateway (July 2026)
                  </a>
                </li>
              </ul>
            </div>

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
              <a href="/blog/stripe-openrouter-genius-act-agent-payment-rules" className="text-blue-400 hover:text-blue-300">
                the week the rules for agent payments got written
              </a>{' '}
              and{' '}
              <a href="/blog/why-ai-agents-need-crypto" className="text-blue-400 hover:text-blue-300">
                why AI agents actually need crypto
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
            <BlogArchive current="x402-foundation-linux-foundation-launch" />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
