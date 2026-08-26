import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const SLUG = 'stack-basics-free-course';
const PUBLISHED = '2026-08-25';
const TITLE = 'Your Laptop Is Not a Vending Machine. Stack Basics Is Live — Free.';
const DESCRIPTION =
  'Stack Basics is our new free course: 5 modules on where your always-on machine lives, the plumbing that makes it reachable, the coding agents that build with you, and what AI models actually cost. No email gate, printable, free ebook included.';
// Search-facing versions (what Google shows). Keyword up front, no cleverness:
const SEO_TITLE = 'Free Course: Stack Basics for AI Builders | ForgeMesh';
const SEO_DESCRIPTION =
  'Stack Basics is a free 5-module course on hosting, DNS, tunnels, coding agents, and AI model costs — everything to set up before you build. No email gate.';
const HERO = `/blog/${SLUG}.png`;
const TAGS = ['free course', 'self-hosting', 'stack basics', 'agent economy'];

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [...TAGS, 'vps', 'x402', 'agent payments', 'USDC micropayments', 'Base mainnet'],
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
    title: 'Stack Basics: our free course on everything before the build',
    description:
      '5 modules — hosting, plumbing, coding agents, model costs, decisions. No email gate, printable, free ebook. The setup scars from 13 live services, given away.',
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
        { '@type': 'ListItem', position: 3, name: 'Stack Basics course', item: `https://forgemesh.io/blog/${SLUG}` },
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
                Your laptop is not a vending machine. Our new course is free — and it starts there.
              </h1>

              <img
                src={HERO}
                alt="A neon-lit vending machine pouring a glowing stream of coins while a line of small robots queues with baskets against a night city skyline"
                className="mt-8 w-full rounded border border-white/[0.06]"
                width={1200}
                height={675}
              />

              <ShareBar inline />

              <p className="mt-6 text-lg leading-8 text-slate-300">
                The most common request we get — on TikTok, in email replies, in the Discord — is some
                version of &ldquo;teach me how to actually build this.&rdquo; So we wrote it down.{' '}
                <a
                  href="https://kit.forgemesh.io/stack-basics"
                  data-umami-event="basics-course-click"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Stack Basics
                </a>{' '}
                is a free five-module course on everything that has to be true <em>before</em> the
                build: where your always-on machine lives, the plumbing that makes it reachable, the
                coding agents that do the typing now, and what running AI models actually costs. No
                email gate. Printable. There&rsquo;s a free ebook edition.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                Why the course starts before the code
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Running a fleet of paid services taught us an uncomfortable pattern: almost nothing
                that kills a first launch is a code problem. The endpoint gets built in a weekend —
                an AI coding agent will happily write it — and then it runs on a laptop that sleeps,
                behind a home router that hides it, with no domain, no TLS, and nothing to restart it
                when it dies at 4am. The agent economy is machines buying from machines around the
                clock; if your machine keeps banker&rsquo;s hours, there is no business. Professionals
                settle a short list of questions before they write a single line. Stack Basics is that
                list, with the honest tradeoffs attached.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { n: '5', d: 'short modules, each ending in one concrete decision you can make today' },
                  { n: '$0', d: 'no email gate, no signup — read it, print it, or download the free ebook PDF' },
                  { n: '13', d: 'live paid services behind the advice — these are our setup scars, written down' },
                ].map((s) => (
                  <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                What&rsquo;s inside
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: '1 · Your laptop is not a vending machine',
                    d: 'Why localhost fails as a business, and every realistic home for your always-on machine — cheap VPS, Mac mini on a shelf, Raspberry Pi, PaaS, free tiers — with the tradeoff table nobody prints.',
                  },
                  {
                    n: '2 · The plumbing',
                    d: 'Domains, DNS, tunnels, TLS, and keeping your process alive when it crashes at 4am — the part that turns "a machine that is on" into "a machine the internet can find."',
                  },
                  {
                    n: '3 · Coding agents',
                    d: 'Claude, Cursor, and friends do the typing now. How to direct them, what to never delegate, and why the skill that matters is deciding — not syntax.',
                  },
                  {
                    n: '4 · What models actually cost',
                    d: 'Tokens, context windows, and the pricing math that decides whether your idea is a business or a donation. Includes the hardware corner for the self-hosting route.',
                  },
                  {
                    n: '5 · The decisions nobody can make for you',
                    d: 'Build vs buy, hosted vs self-run, when to spend — the judgment calls, laid out so you can make them on purpose instead of by default.',
                  },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                The two free halves of a launch
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Stack Basics pairs with our other free tool, the{' '}
                <a href="https://kit.forgemesh.io/checklist" className="text-blue-400 hover:text-blue-300">
                  Idea-Fit Checklist
                </a>
                : the checklist scores whether your idea is worth building; the course builds the
                machine that ships it. Start with either — you need both halves before launch. And the
                honest fine print, stated in the course itself: a few links inside (hardware, hosting)
                are affiliate links. They fund the free stuff, and your price never changes.
              </p>

              <ShareBar inline />

              <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Free course · no email needed
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  Five modules, one sitting. Read it on the site or take the ebook with you — then
                  point your coding agent at module 1 and set up your always-on machine this week.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://kit.forgemesh.io/stack-basics"
                    data-umami-event="basics-course-click"
                    className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
                  >
                    Start Stack Basics — free <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href="https://kit.forgemesh.io/assets/course/stack-basics.pdf?v=20260825"
                    data-umami-event="basics-course-click"
                    className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
                  >
                    Download the free ebook (PDF)
                  </a>
                </div>
              </div>

              <p className="mt-10 text-base leading-8 text-slate-400">
                Related reading:{' '}
                <a href="/blog/lessons-from-500-paid-x402-endpoints" className="text-blue-400 hover:text-blue-300">
                  what running 500+ paid endpoints taught us about what actually breaks
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
