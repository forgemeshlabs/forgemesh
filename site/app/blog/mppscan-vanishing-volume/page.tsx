import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const SLUG = 'mppscan-vanishing-volume';
const PUBLISHED = '2026-08-25';
const TITLE = "MPPscan's all-time volume fell 97% in six days. Volume can't do that.";
const DESCRIPTION =
  'We log MPPscan\'s headline stats daily. The "all-time" MPP volume counter went from $94,874 to $2,370 in six days — a thing cumulative totals cannot do. What our logs show, and what it means for anyone quoting agent-payment stats.';
const SEO_TITLE = 'MPPscan Volume Drop Explained | ForgeMesh';
const SEO_DESCRIPTION =
  "MPPscan's all-time MPP volume fell from $94,874 to $2,370 in six days. Our daily logs show why a cumulative counter shrinking matters for agent-payment stats.";
const HERO = `/blog/${SLUG}.png`;
const TAGS = ['mpp', 'data-hygiene', 'agent-payments', 'field report'];

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [...TAGS, 'mppscan', 'x402', 'agent payments', 'USDC micropayments', 'Base mainnet'],
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
    title: "MPPscan's volume counter fell 97% in six days",
    description: 'Cumulative totals cannot shrink. Ours logs say this one did — six days straight. A field report on agent-economy data hygiene.',
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
        { '@type': 'ListItem', position: 3, name: 'MPPscan Vanishing Volume', item: `https://forgemesh.io/blog/${SLUG}` },
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
                MPPscan&apos;s all-time volume fell 97% in six days. Cumulative counters can&apos;t do that.
              </h1>

              <img
                src={HERO}
                alt="A dark navy dashboard chart whose line decays in daily steps toward zero, lit by a blue glow"
                className="mt-8 w-full rounded border border-white/[0.06]"
                width={1200}
                height={675}
              />

              <ShareBar inline />

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Tonight MPPscan&apos;s headline &quot;total volume&quot; reads about $2,370. On August 19 the same
                counter read $94,874. We know because we log it every day at 12:45 UTC for the rail
                pulse on our homepage — and for six straight days the all-time total has gone
                <em> down</em>. That is not a market move. Cumulative totals only ever grow. When one
                shrinks 97.5% in a week, the story isn&apos;t the volume — it&apos;s the counter.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                What our logs show
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                We snapshot MPPscan&apos;s server-rendered stats daily (the same numbers anyone sees on the
                site) and alert on ±5% moves between polls. The sequence: $94,874 on Aug 19 →
                $40,149 on Aug 23 → $22,466 on Aug 24 → $8,039 at Aug 25 midday — and then another
                −48.6% between two polls a few hours apart on Aug 25 evening, landing near $2,345.
                Transactions followed the same slope: 259,167 down to roughly 131,000. Both counters
                have since resumed ticking upward from their new, much lower floors.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { n: '−97.5%', d: '"All-time" MPP volume, Aug 19 → Aug 25 ($94,874 → ~$2,345), as logged daily by our rail pulse.' },
                  { n: '259k → 131k', d: 'The all-time transaction counter over the same six days — also a number that should only rise.' },
                  { n: '−0.8%', d: 'Change in live x402 catalog listings (15,145) over the same period, per our own crawler. The ecosystem itself barely moved.' },
                ].map((s) => (
                  <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                What it isn&apos;t: a collapse in real activity
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Our own vantage point on the agent economy stayed flat through the whole window. The
                x402 catalog our crawler indexes three times a day held near 15,100 live listings
                (−0.8% day-over-day). Settlement cadence across our own fleet wallets didn&apos;t change.
                Nothing we operate or index looks like a market that just lost half its history.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                Two explanations fit the shape
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: 'A rolling window wearing an all-time label',
                    d: 'If the counter is actually "trailing N days," a burst of activity in late July would age out of the window day by day — producing exactly this staircase decay while the counter keeps ticking up from each new floor. The daily-step pattern in our logs fits this best.',
                  },
                  {
                    n: 'An ongoing reindex or dedup',
                    d: 'Explorers restate history when they find double-counted transfers or drop a data source. That usually lands as one big correction, not six consecutive daily cuts — but a rolling backfill could look like this too.',
                  },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-base leading-8 text-slate-400">
                We genuinely don&apos;t know which it is — MPPscan doesn&apos;t publish a methodology page, and
                we&apos;d welcome a clarification from the team. Either way, the practical consequence is
                the same: anyone who quoted &quot;MPP volume&quot; off that headline number this week was off
                by up to 40× depending on which day they looked.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                The takeaway for agent-economy numbers
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                The agent-payment ecosystem is young enough that most of its &quot;market data&quot; comes from
                a handful of small dashboards, each self-reporting with unstated methodology. That&apos;s
                not a criticism — we run dashboards too — it&apos;s a reason to treat every headline stat
                as a claim, not a fact. Our rules after this week: log the source daily so restatements
                are visible; label every third-party number as self-reported (our rail pulse already
                does); and never cite a cumulative figure without knowing whether it can shrink. If a
                number that can only go up goes down, that&apos;s not noise. That&apos;s the story.
              </p>

              <ShareBar inline />

              <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Verify, then trust
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  We watch the agent-payment rails so you don&apos;t have to — catalog counts, settlement
                  activity, and the dashboards reporting on both. Run the free readiness scan or get
                  the kit that ships a monitored, payable server in an afternoon.
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
                <a href="/blog/solana-flips-base-x402-catalog" className="text-blue-400 hover:text-blue-300">
                  Solana just flipped Base on daily x402 transactions — our catalog data says it&apos;s not a builder exodus
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
