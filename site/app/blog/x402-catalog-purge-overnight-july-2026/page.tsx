import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

const PUBLISHED = '2026-08-04';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: '43% of the x402 Catalog Vanished Overnight. Nobody Announced It. | ForgeMesh Labs',
  description:
    'Between two of our crawler snapshots in late July 2026, the x402 Bazaar dropped from 24,925 listings to 14,193. The whale we reported on July 18 was gone. Here is what our monitoring caught, what broke quietly around the same time, and what it did to our own fleet of 13 paid services.',
  keywords: [
    'x402 bazaar purge', 'x402 catalog', 'x402 delisting', 'agent economy data',
    'x402 discovery', 'AI agent payments', 'x402 sellers', 'x402 monitoring',
  ],
  alternates: { canonical: '/blog/x402-catalog-purge-overnight-july-2026' },
  openGraph: {
    title: '43% of the x402 Catalog Vanished Overnight. Nobody Announced It.',
    description:
      'Our crawler snapshots the x402 Bazaar three times a day. One night in late July, 10,700 listings disappeared between snapshots — including the 40% whale we had published six days earlier.',
    type: 'article',
    url: 'https://forgemesh.io/blog/x402-catalog-purge-overnight-july-2026',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/fm-nobg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/fm-nobg.png'],
    title: '43% of the x402 Catalog Vanished Overnight. Nobody Announced It.',
    description:
      'Original crawler data on the July 2026 x402 catalog purge — and what it quietly broke for sellers.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '43% of the x402 Catalog Vanished Overnight. Nobody Announced It.',
      description:
        'Crawler-measured account of the late-July 2026 x402 Bazaar purge: 24,925 to 14,193 listings between snapshots, the removal of the 40% whale seller, the quiet ecosystem changes around the same window, and the operational aftermath for a 13-service x402 fleet.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of 13 x402 services with 800+ indexed paid resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/x402-catalog-purge-overnight-july-2026',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'The overnight catalog purge', item: 'https://forgemesh.io/blog/x402-catalog-purge-overnight-july-2026' },
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
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Original data · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              43% of the x402 catalog vanished overnight. Nobody announced it.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              On July 18 we published{' '}
              <a href="/blog/x402-bazaar-economy-data-july-2026" className="text-blue-400 hover:text-blue-300">
                measurements of the x402 Bazaar
              </a>{' '}
              showing one seller wallet behind 40% of all listings — 10,028 near-identical junk
              resources. Six days later, between two of our crawler’s thrice-daily snapshots,
              that seller was gone. So was a third of everything else.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The night the catalog shrank
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { n: '24,925', d: 'live listings in our 20:15 UTC snapshot, July 23' },
                { n: '14,193', d: 'live listings eight hours later, 04:15 UTC, July 24 — a 43% drop between snapshots' },
                { n: '~93%', d: 'of the purged listings traced to that single whale seller from our July 18 report' },
                { n: '880 → 1,079', d: 'unique sellers at the trough, and ten days later — the survivors kept growing' },
              ].map((s) => (
                <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base leading-8 text-slate-400">
              No blog post. No changelog entry. No status page incident. As far as we can tell, the
              only reason anyone can put timestamps on this event is that our crawler happened to be
              watching. The catalog operator cleaned house — correctly, in our view; the purged
              listings were overwhelmingly spam — and simply never said so.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              One number we can report with some satisfaction:{' '}
              <strong className="text-slate-200">
                every one of our own 800+ listings survived the night.
              </strong>{' '}
              Not by luck, and not by reacting fast — there was nothing to react to. The sweep was
              enforcing what turned out to be our existing checklist: canonical URLs, typed protocol
              versions, honest metadata, a real working endpoint behind every listing. Best
              practices are invisible right up until the night an unannounced purge selects for
              them. That week, they were the difference between our catalog and 43% of everyone
              else’s.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The same week, the ground moved
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The purge was not an isolated event. In the same late-July window, the protocol’s
              day-to-day home quietly shifted away from the single company that started it, the
              community moved venues — the old support links in the official docs now return
              &quot;Invite Invalid&quot; — and parts of the discovery API changed behavior without a
              deprecation notice. The endpoint many sellers used to verify their own listings began
              silently returning something different from what it used to. If your verification
              script still &quot;worked,&quot; it may have been telling you nothing at all.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              None of this was hidden, exactly. All of it was findable — in commit logs, in issue
              threads, in dead links. But nothing was announced, and that is the actual lesson: in
              the agent economy right now, <strong className="text-slate-200">the changes that
              affect your revenue ship silently</strong>. You either measure, or you find out weeks
              later the way we almost did.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Our quiet weekend, and what it wasn’t
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              In early August our own fleet — 13 paid services, 800+ listed resources — went a
              weekend without a single external sale. Given the timing, we assumed the worst: a
              payment-rail failure, a billing suspension, a delisting. The investigation found none
              of that. Settlement worked (our daily paid canary never missed). Every listing was
              intact. Probe traffic from crawlers was at record highs — 65,000 hits a day —
              while purchases sat at zero.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The on-chain forensics were humbling. Most of our historical &quot;buyers&quot; turned
              out to be short-lived evaluation wallets that sampled everything once and went dormant
              — census-takers, not customers. Meanwhile the wallets that were actively spending that
              same weekend — and they were spending, at sellers of cheap utilities and real-world
              goods — had simply never met us. The market wasn’t dark. We were unlit.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The silent failure modes
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Auditing our fleet against the post-purge reality, we found an entire class of
              problems that produce no error anywhere: a description a hair over an undocumented
              length limit that quietly makes a resource unpayable; URL shapes the indexer refuses
              without telling you; routes that answer buyers perfectly but are invisible to the
              health probers that decide whether you get surfaced at all. Several of these were live
              on our own services — services that passed every test we knew to run. The buyers see
              nothing. The seller sees nothing. The sale just doesn’t happen.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              We fixed our fleet in a day, re-indexed everything, and rewrote our machine-facing
              copy in the language buying agents actually search with. The first two never-before-seen
              buyer wallets arrived about twelve hours later — one of them came back four times the
              same morning, and one added us to a rotation of suppliers it hits daily. Six sales at
              $0.003 is not a business. Two wallets that chose us over a catalog of fourteen
              thousand, the morning after we became findable, is a signal.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              What we’d tell any x402 seller
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Agents don’t hold grudges and they don’t remember you — every task re-runs
              the supplier choice from scratch. That cuts both ways: you can be passed over a
              thousand times and still win tomorrow morning, but only if you are present in the
              places the choosing happens, legible to the software doing the choosing, and honest
              with yourself about which of your &quot;customers&quot; were ever customers at all.
              Measure everything. Assume the platform will change under you without a press release,
              because this month, it did.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The specific checks, fixes, and submission flows we now run — the exact commands, the
              limits with numbers attached, the launch checklist that catches the silent failure
              modes above — live in our{' '}
              <a href="https://kit.forgemesh.io" className="text-blue-400 hover:text-blue-300">
                x402 starter and distribution kits
              </a>
              , which we updated within a day of each of these discoveries. This post is the story;
              the kits are the operating manual.
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
        </article>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
