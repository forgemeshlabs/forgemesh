import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const PUBLISHED = '2026-08-04';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'x402’s 500-Character Limit Breaks Listings Silently | ForgeMesh',
  description:
    'One byte over an undocumented 500-character description limit makes an x402 listing silently unpayable. How we measured the cliff and defend 800+ listings.',
  keywords: [
    'x402 description limit', 'x402 silently unpayable', 'x402 bazaar troubleshooting',
    'x402 listing not indexed', 'x402 500 characters', 'agent economy', 'x402 debugging',
  ],
  alternates: { canonical: '/blog/x402-500-character-description-limit' },
  openGraph: {
    title: 'The 500-Character Cliff: One Extra Byte Makes an x402 Listing Silently Unpayable',
    description:
      'No error. No warning. The listing looks fine — and buys never come. We measured the cliff at exactly 500 characters.',
    type: 'article',
    url: 'https://forgemesh.io/blog/x402-500-character-description-limit',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/x402-500-character-description-limit.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/x402-500-character-description-limit.png'],
    title: 'The 500-Character Cliff',
    description: 'One extra byte makes an x402 listing silently unpayable. Measured, credited, and how to protect yourself.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'The 500-Character Cliff: One Extra Byte Makes an x402 Listing Silently Unpayable',
      description:
        'Empirical measurement of the undocumented x402 Bazaar description length limit: purchases succeed at 500 characters and fail silently at 501. Credit, upstream status, and seller-side protection.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of 13 x402 services with 800+ indexed paid resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/x402-500-character-description-limit',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'The 500-character cliff', item: 'https://forgemesh.io/blog/x402-500-character-description-limit' },
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
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-12">
            <div className="min-w-0 max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Field notes · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              The 500-character cliff: one extra byte makes an x402 listing silently unpayable
            </h1>

            <img
              src="/blog/x402-500-character-description-limit.png"
              alt="A glowing line of light ending abruptly at the edge of a dark cliff"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={675}
            />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              There is a class of bug in the agent economy that produces no stack trace, no 4xx, no
              alert — nothing. Your endpoint works. Your listing looks fine. And purchases simply
              never arrive. This is the story of the sharpest one we know: a description length
              limit that nobody documented, that still is not fixed upstream, and that we watched
              kill real purchases at <strong className="text-slate-200">exactly one character past
              500</strong>.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The symptom: everything works except revenue
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              An x402 resource declares itself to discovery catalogs with metadata — including a
              free-text description. Write a description over a certain length and the resource
              doesn’t get rejected. It doesn’t error. It becomes{' '}
              <em>silently unpayable</em>: dropped or broken in the catalog pipeline in a way
              neither the buyer nor the seller can see. To the seller, it looks exactly like &quot;no
              demand.&quot; We know how that feels from the inside — we once spent a weekend
              convinced our whole fleet was broken over a quietness that had a different cause
              entirely (
              <a href="/blog/x402-catalog-purge-overnight-july-2026" className="text-blue-400 hover:text-blue-300">
                that story here
              </a>
              ).
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The measurement: 500 works, 501 doesn’t
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              In our own testing, purchases against an affected route succeeded with the description
              at 500 characters and stopped the moment it crossed to 501. No behavior change
              anywhere else — same route, same price, same challenge. One byte of prose was the
              difference between a purchasable resource and a ghost.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Credit where it’s due: the public report that nailed this class of failure is{' '}
              <a
                href="https://github.com/x402-foundation/x402/issues/2993"
                className="text-blue-400 hover:text-blue-300"
              >
                issue #2993
              </a>{' '}
              by <strong className="text-slate-200">@sukrutkrdg</strong>, who ran the same style of
              controlled measurement on their own seller (402.com.tr) and asked for exactly the
              right two things: <em>document the limit, and give it a distinct error.</em> That is
              how infrastructure gets better — a seller who measures instead of shrugs.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Upstream status: still not fixed
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              As of publication: the issue is <strong className="text-slate-200">open</strong>. A
              code fix attempt (PR #2995) was closed without merging. A documentation fix —{' '}
              <a
                href="https://github.com/x402-foundation/x402/pull/2998"
                className="text-blue-400 hover:text-blue-300"
              >
                PR #2998
              </a>{' '}
              by @Echolonius, which would at least write the limits down and name the rejection —
              is still awaiting merge. Until one of those lands, every new x402 seller walks toward
              this cliff with no sign posted.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Protect yourself today
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The seller-side defense is simple, and we’re giving this one away in full:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-8 text-slate-400">
              <li className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                <strong className="text-slate-200">Keep every description at or under 500
                characters.</strong> Target 350–480 — long enough to rank in agent-facing search,
                safely under the cliff.
              </li>
              <li className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                <strong className="text-slate-200">Enforce it in code, not memory.</strong> If your
                descriptions are generated, make the generator throw — not truncate, not warn —
                when output exceeds the ceiling. A hard failure at build time beats a silent one in
                the catalog.
              </li>
              <li className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                <strong className="text-slate-200">Audit your live surfaces, not your source.</strong>{' '}
                Fetch your own deployed discovery documents and measure what’s actually being
                served — length bugs love to hide in the gap between repo and production.
              </li>
            </ul>
            <p className="mt-6 text-base leading-8 text-slate-400">
              The uncomfortable part: this is one of at least four failure modes we know of that
              delist or break an x402 resource with zero error output — length is just the only one
              with a number this clean. The full set, with the preflight checks and submission
              flows we run across our own 800+ listings, lives in the{' '}
              <a href="https://kit.forgemesh.io" className="text-blue-400 hover:text-blue-300">
                ForgeMesh x402 seller kits
              </a>{' '}
              — updated within a day of each discovery, because that is apparently the speed this
              ecosystem changes at.
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
            <BlogArchive current="x402-500-character-description-limit" />
          </div>
        </article>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
