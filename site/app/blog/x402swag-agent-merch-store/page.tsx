import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const SLUG = 'x402swag-agent-merch-store';
const PUBLISHED = '2026-08-25';
const TITLE = 'We Opened a Merch Store. Some of the Customers Might Not Be Human.';
const DESCRIPTION =
  'x402swag.com sells 49 designs of protocol merch — holographic 402 stickers, terminal mugs, robot tees — and every product can be bought two ways: by card, or by an AI agent paying USDC over x402 on Base. Same 402 flow as our paid APIs, pointed at a t-shirt.';
const SEO_TITLE = 'x402 Merch, Buyable by AI Agents | ForgeMesh';
const SEO_DESCRIPTION =
  'x402swag.com: protocol stickers, terminal mugs, and robot tees for the agent economy. Pay by card — or let an AI agent pay USDC over x402 on Base.';
const HERO = `/blog/${SLUG}.png`;
const TAGS = ['x402 merch', 'agent economy', 'usdc', 'field report'];

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [...TAGS, 'developer stickers', 'x402', 'agent payments', 'USDC micropayments', 'Base mainnet'],
  alternates: { canonical: `/blog/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: `https://forgemesh.io/blog/${SLUG}`,
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    tags: TAGS,
    images: [HERO],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: [HERO],
    title: 'The merch store where AI agents can buy shirts',
    description:
      '49 designs. Two ways to pay: card, or USDC over x402 on Base — the same 402 flow our paid APIs run, pointed at a t-shirt. x402swag.com',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      keywords: TAGS.join(', '),
      image: `https://forgemesh.io${HERO}`,
      mainEntityOfPage: `https://forgemesh.io/blog/${SLUG}`,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'x402 Swag', item: `https://forgemesh.io/blog/${SLUG}` },
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
                We opened a merch store. Some of the customers might not be human.
              </h1>

              <img
                src={HERO}
                alt="Black t-shirt with a small robot inserting a USDC coin into a vending machine labeled 402, captioned Insert USDC to Continue"
                className="mt-8 w-full rounded border border-white/[0.06]"
                width={1200}
                height={675}
              />

              <ShareBar inline />

              <p className="mt-6 text-lg leading-8 text-slate-300">
                <a
                  href="https://x402swag.com"
                  data-umami-event="swag-click"
                  className="text-blue-400 hover:text-blue-300"
                >
                  x402swag.com
                </a>{' '}
                sells holographic 402 stickers, terminal mugs, and robot tees — 49 designs of
                in-jokes for people building the agent economy. The unusual part is the checkout:
                every product can be bought by card like any normal store, <em>or</em> by paying
                USDC over x402 on Base. The same HTTP 402 flow our paid APIs run all day, pointed
                at a t-shirt.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                Why bolt machine payments onto a t-shirt store
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Partly because it&rsquo;s the funniest possible integration test. We spend all day
                writing about agents paying for API calls — structured data, deterministic
                responses, sub-cent prices. A physical hoodie is the exact opposite of all that,
                which makes it the honest stress test: order created, pay route answers HTTP 402
                with the payment requirements, USDC settles on Base, the store answers 200, and
                dropship fulfillment kicks off automatically. No human in the loop until someone
                opens a mailbox. If the rails can sell a mug, they can sell anything.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-400">
                And partly because the designs deserved to exist. &ldquo;sudo pay.&rdquo; &ldquo;402
                → OK.&rdquo; A robot ordering coffee: <span className="font-mono text-sm">GET
                /coffee → 402 → 200</span>. A robot buying its tired human a coffee. The kind of
                jokes that need zero explanation if you&rsquo;ve read this blog and infinite
                explanation if you haven&rsquo;t — which is what merch is for.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { n: '49', d: 'designs across holographic stickers, die-cuts, mugs, tees, and crew necks' },
                  { n: '2', d: 'ways to pay every product: card checkout, or USDC over x402 on Base' },
                  { n: '$3.99', d: 'where it starts — laptop stickers; nothing in the store needs a business case' },
                ].map((s) => (
                  <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                A few of the shelves
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: 'Holographic 402 stickers',
                    d: 'Rainbow-shift die-cuts: the 402 OK pill, "Automated Agents Only" toll gates, "No Pay No Prompt" pixel bots, "sudo pay" terminals. The laptop-lid tier of protocol advocacy.',
                  },
                  {
                    n: 'Terminal mugs',
                    d: '"sudo make coffee — permission denied." "How Agents Buy Coffee: GET /coffee → 402 → 200 OK." "You Look Tired Human," from a robot that bought you one. 11oz of dev-humor ceramics.',
                  },
                  {
                    n: 'Robot tees',
                    d: '"Hello Human." "Beep Boop Paid." "Insert USDC to Continue" — the vending-machine robot from this post\'s hero. Front logo, back joke, ForgeMesh sleeve.',
                  },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Humans welcome too
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  Card checkout works like any store. And if you&rsquo;d rather your agent handles
                  it — the pay route speaks fluent 402.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://x402swag.com"
                    data-umami-event="swag-click"
                    className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
                  >
                    Browse x402swag.com <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href="/blog/why-ai-agents-need-crypto"
                    className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
                  >
                    How agents pay: the background
                  </a>
                </div>
              </div>

              <p className="mt-10 text-base leading-8 text-slate-400">
                Related reading:{' '}
                <a href="/blog/lessons-from-500-paid-x402-endpoints" className="text-blue-400 hover:text-blue-300">
                  what running 500+ paid endpoints taught us about the rails this store runs on
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
            <BlogArchive current={SLUG} />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
