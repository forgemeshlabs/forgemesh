import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const SLUG = 'solana-flips-base-x402-catalog';
const PUBLISHED = '2026-08-25';
const TITLE = 'Solana flipped Base on daily x402 transactions. Our catalog says 96% of services still live on Base.';
const DESCRIPTION =
  'Crypto Briefing reports Solana passed Base in daily x402 transactions for the first time in six months. Our crawler indexes the x402 catalog three times a day: 14,669 live listings settle on Base, 217 on Solana. Both things can be true — here is how.';
const SEO_TITLE = 'Solana vs Base x402 Transactions | ForgeMesh';
const SEO_DESCRIPTION =
  'Solana passed Base in daily x402 transactions — but our crawler shows 96% of 15,145 live x402 services still settle on Base. Throughput is not builders.';
const HERO = `/blog/${SLUG}.png`;
const TAGS = ['x402', 'base', 'solana', 'field report'];

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [...TAGS, 'x402 transactions', 'agent payments', 'USDC micropayments', 'Base mainnet'],
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
    title: 'Solana flipped Base on x402 tx count — with 1.4% of the catalog',
    description: 'Daily transactions flipped. The builder base didn\'t: 14,669 Base listings vs 217 Solana in our crawler. Throughput ≠ builders.',
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
        { '@type': 'ListItem', position: 3, name: 'Solana Flips Base', item: `https://forgemesh.io/blog/${SLUG}` },
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
                Solana flipped Base on daily x402 transactions — with 1.4% of the catalog
              </h1>

              <img
                src={HERO}
                alt="Two glowing network towers on a dark navy field: one broad and heavily built, one thin but pulsing rapidly with traffic"
                className="mt-8 w-full rounded border border-white/[0.06]"
                width={1200}
                height={675}
              />

              <ShareBar inline />

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Crypto Briefing reported today that Solana passed Base in daily x402 transactions for
                the first time in six months. The headline invites one conclusion — builders are
                leaving Base. Our crawler, which indexes the public x402 catalog three times a day,
                says something different: of 15,145 live listings tonight, 14,669 settle on Base and
                217 on Solana. That&apos;s 96.9% versus 1.4%. Both facts can be true at once, and the gap
                between them is the actual story.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                The numbers, from our own index
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { n: '14,669', d: 'Live x402 listings settling on Base mainnet in our latest crawl (96.9% of the catalog).' },
                  { n: '217', d: 'Live listings settling on Solana mainnet — 1.4% of the catalog that reportedly just won the daily tx race.' },
                  { n: '40,242', d: 'Total resources our crawler has tracked across all snapshots, three crawls a day.' },
                ].map((s) => (
                  <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                How 1.4% of services can win the transaction count
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Transaction counts measure throughput, not adoption. In a micropayment protocol, one
                chatty consumer is worth thousands of quiet ones: a single agent polling a paid
                endpoint every few seconds produces more daily transactions than a hundred services
                each selling a handful of calls. Solana&apos;s fee floor makes exactly that pattern cheap —
                sub-cent settlement invites high-frequency, low-value traffic that would be
                economically silly elsewhere. A flip in daily tx count is what you&apos;d expect when a
                few high-frequency integrations go live on the cheaper chain. It says nothing yet
                about where services, wallets, and revenue actually live.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                What would actually signal an exodus
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: 'Catalog share moving',
                    d: 'Solana listings climbing from 1.4% toward 5-10% of the live catalog would mean builders are deploying there, not just routing traffic. We crawl three times a day; we\'ll see it move.',
                  },
                  {
                    n: 'Volume flipping, not counts',
                    d: 'Dollar volume weights each transaction by value. If that flips, real economic activity moved. (Mind which dashboard you quote for it — see our companion post on MPPscan\'s vanishing volume.)',
                  },
                  {
                    n: 'The facilitator map changing',
                    d: 'x402 settlement runs through facilitators. New Solana-first facilitators with real service counts behind them would be structural, not cyclical.',
                  },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-base leading-8 text-slate-400">
                Honest limits: we don&apos;t index Solana transaction-level data — the catalog is our lens,
                and it measures where sellers deploy, not where buyers click. That&apos;s exactly why we
                read the flip as a demand-side traffic pattern rather than a supply-side migration.
                If the catalog starts moving, we&apos;ll publish the update.
              </p>

              <ShareBar inline />

              <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Build where the catalog is
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  Whichever chain wins the traffic race, agents pay servers that are reachable,
                  payable, and monitored. Check yours with the free readiness scan, or ship one this
                  weekend with the kit.
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
                <a href="/blog/mppscan-vanishing-volume" className="text-blue-400 hover:text-blue-300">
                  MPPscan&apos;s all-time volume fell 97% in six days — a field report on agent-economy data hygiene
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
