import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const SLUG = 'free-agent-economy-scanners';
const PUBLISHED = '2026-08-24';
const TITLE = 'Can Agents Find You, Trust You, and Pay You? Scan It. Free.';
const DESCRIPTION =
  'We run 19 paid MCP servers and measure everything that breaks. Our scanners — 30+ agent-readiness checks and a no-spend x402 endpoint audit — are free, and this week they learned our newest field findings: the 500-character cliff, the extensionless manifest rule, and why empty descriptions make you invisible.';
const SEO_TITLE = 'Free AI Agent Readiness Scanner | ForgeMesh';
const SEO_DESCRIPTION =
  'Free agent-readiness scan: 30+ checks for AI agent discovery, trust, and x402 payments — built by operators of 19 production MCP servers. No signup.';
const HERO = `/blog/${SLUG}.png`;
const TAGS = ['agent-readiness', 'x402', 'mcp', 'free-tools'];

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [...TAGS, 'aso', 'x402', 'agent payments', 'USDC micropayments', 'Base mainnet'],
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
    title: 'Can agents find, trust, and pay you? Scan it free.',
    description:
      '30+ agent-readiness checks + a no-spend x402 audit, free, from the operators of 19 production MCP servers. Now detecting the 500-char cliff.',
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
        { '@type': 'ListItem', position: 3, name: 'Free Scanners', item: `https://forgemesh.io/blog/${SLUG}` },
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
                Can agents find you, trust you, and pay you? Scan it. It&apos;s free.
              </h1>

              <img
                src={HERO}
                alt="A radar screen sweeping over a dark grid of website icons, some lighting up blue as the beam passes over them"
                className="mt-8 w-full rounded border border-white/[0.06]"
                width={1200}
                height={675}
              />

              <ShareBar inline />

              <p className="mt-6 text-lg leading-8 text-slate-300">
                One character over an undocumented 500-character limit makes an x402 listing silently
                unpurchasable. A manifest served at <code className="text-blue-300">.json</code> but
                not the extensionless path kills some crawlers mid-parse. Four missing boolean hints
                cap your trust grade in directories you never submitted to. We didn&apos;t read any of
                that in a spec — we hit every one of them operating 19 paid MCP servers in production.
                This week we taught all of it to our scanners. They&apos;re free, and they don&apos;t
                ask for a signup.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                Who is ForgeMesh, and why do we have scanners?
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                We&apos;re operators, not a tools startup. We run a fleet of paid x402 and MPP services
                on Base — government transparency data, crypto signals, TTS, travel, anomaly detection,
                image generation, and a dozen more — with 800+ indexed resources that real agents pay
                real USDC to use. Every scanner we publish started as an internal check we needed after
                something broke with money on the line. When a directory graded our servers before
                we&apos;d ever heard of it, we built the checks that would have passed. When 43% of the
                x402 catalog vanished overnight, our crawler snapshots were how anyone found out. The
                scanners are those instruments, pointed outward.
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                The free instruments
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: 'Endpoint Scanner — can agents actually pay you?',
                    d: 'Paste any URL at forgemesh.io/scan. A no-spend x402 v2 audit: nine weighted checks (402 status, payment-required header, base64 challenge, CAIP-2 networks, complete payment fields…) with a letter grade. It never signs a payment, so it can never spend anything — yours or ours.',
                  },
                  {
                    n: 'aso-audit-mcp — the full agent-readiness sweep (open source)',
                    d: '30+ checks across six categories: discoverability (robots.txt, llms.txt, DNS-AID), content accessibility, AI-bot access rules, API/auth/MCP surfaces (server cards, A2A agent cards, OAuth discovery), commerce (x402, MPP, UCP, ACP), and identity & trust. MIT-licensed, runs from npm, works in Claude Code, Cursor, or any MCP client.',
                  },
                  {
                    n: 'agent-readiness-mcp + aso-score-mcp — the score, portable',
                    d: 'The same framework as a single 0-100 Agent Signal Optimization score, as an MCP server your own agent can call. The framework definition and scoring model are public.',
                  },
                  {
                    n: 'The seller pre-flight checklist',
                    d: 'A free, no-code 16-point checklist for anyone about to ship a paid endpoint — the questions we wish someone had asked us before our first zero-sale weekend.',
                  },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                What the scanners just learned (v0.4.0)
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                This week&apos;s update folds our three newest field findings into the free audit —
                things no spec documents and no other scanner checks:
              </p>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: 'The 500-character cliff',
                    d: 'We measured the Bazaar indexer dropping any listing whose description exceeds exactly 500 characters — no error, no warning, the resource just becomes unpurchasable through discovery. The audit now counts your descriptions and flags every one over the line.',
                  },
                  {
                    n: 'The extensionless manifest rule',
                    d: 'Most ecosystem crawlers request /.well-known/x402 without the .json extension first — a survey in the x402 DNS-discovery spec thread found extensionless outnumbering .json 11-to-1, and at least one major indexer aborts mid-crawl on an HTML 404 there. Serving only the .json variant now scores partial, with the fix spelled out.',
                  },
                  {
                    n: 'Empty descriptions are invisible descriptions',
                    d: 'Discovery indexes rank listings on how closely descriptions match agent task language. A missing description isn’t neutral — it’s invisible. The audit now warns when your accepts[] carries none.',
                  },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { n: '30+', d: 'agent-readiness checks in the free open-source audit' },
                  { n: '$0', d: 'to scan — no signup, no wallet, no spend. The x402 audit is cryptographically unable to pay.' },
                  { n: '19', d: 'production MCP servers we run every check against first — we are our own test fleet' },
                ].map((s) => (
                  <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                Two tests, two questions — run the right one
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                They answer different questions, so don&apos;t stop at one.{' '}
                <strong className="text-slate-200">The payment test</strong> is for anyone selling a
                paid API: paste your x402 endpoint at{' '}
                <a href="https://forgemesh.io/scan" className="text-blue-400 hover:text-blue-300">
                  forgemesh.io/scan
                </a>{' '}
                and get the A–F grade on whether an agent&apos;s money can actually reach you.{' '}
                <strong className="text-slate-200">The readiness test</strong> is for any website,
                paid endpoint or not: the ASO sweep checks whether agents can find, crawl, trust, and
                cite you at all. Take the{' '}
                <a href="https://agentsignaloptimization.com/#scanner" className="text-blue-400 hover:text-blue-300">
                  free self-assessment
                </a>{' '}
                in the browser, or run the automated scanner from any MCP client —{' '}
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-300">
                  claude mcp add aso -- npx -y @forgemeshlabs/aso-audit-mcp
                </code>{' '}
                — then ask your agent to scan any domain. Your own site. Your competitors. The API
                you&apos;re about to build on. What it finds is yours.
              </p>

              <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  When the scan finds problems
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  The scan tells you what&apos;s broken for free. The Complete Bundle is the fix
                  manual: the Server Starter Kit plus the Distribution Playbook — every gotcha above
                  with its repair, the directory-by-directory listing chain, and living updates as we
                  hit the next one. And if you&apos;d rather have it handled than documented, email{' '}
                  <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">
                    hello@forgemesh.io
                  </a>{' '}
                  — done-for-you agent-readiness is what we do all day for our own fleet.
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
                    Get the Complete Bundle — $99
                  </a>
                </div>
              </div>

              <p className="mt-10 text-base leading-8 text-slate-400">
                Related reading:{' '}
                <a href="/blog/x402-500-character-description-limit" className="text-blue-400 hover:text-blue-300">
                  the full story of the 500-character cliff, measured at the boundary
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
