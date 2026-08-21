// BLOG POST TEMPLATE — copy this file to app/blog/<slug>/page.tsx and fill every ⟪PLACEHOLDER⟫.
// Full publishing checklist: app/blog/_template/BLOG-CHECKLIST.md
// The _template folder is underscore-prefixed so Next.js never routes it.
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const SLUG = '⟪slug-kebab-case⟫';
const PUBLISHED = '⟪YYYY-MM-DD⟫';
const TITLE = '⟪Post Title In Title Case⟫';
const DESCRIPTION = '⟪1-3 sentence description used for meta/OG/search. Concrete numbers beat adjectives.⟫';
// Hero image: 16:9, lives at public/blog/<slug>.png (1200×675+). Generate via
// ImageGen ($0.25 paid call — see checklist) or drop any PNG there. Delete the
// hero <img> block below if the post genuinely has no image.
const HERO = `/blog/${SLUG}.png`;
// Topic tags: 3-4, lowercase. MUST match the tags you register in lib/blog.ts
// (chips on the index + inline archive render from the registry). Fed into
// meta keywords, OG article:tag, and JSON-LD keywords below for SEO.
const TAGS = ['⟪tag⟫', '⟪tag⟫', '⟪tag⟫'];

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: `${TITLE} | ForgeMesh Labs`,
  description: DESCRIPTION,
  keywords: [...TAGS, '⟪extra keyword⟫', 'x402', 'agent payments', 'USDC micropayments', 'Base mainnet'],
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
    title: '⟪Punchier X-length title, can differ from TITLE⟫',
    description: '⟪X-card description, <200 chars⟫',
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
        { '@type': 'ListItem', position: 3, name: '⟪Short breadcrumb name⟫', item: `https://forgemesh.io/blog/${SLUG}` },
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
                ⟪Sentence-case headline. Can be longer and more conversational than TITLE.⟫
              </h1>

              <img
                src={HERO}
                alt="⟪Describe the image for screen readers⟫"
                className="mt-8 w-full rounded border border-white/[0.06]"
                width={1200}
                height={675}
              />

              <p className="mt-6 text-lg leading-8 text-slate-300">
                ⟪Lede paragraph. The hook — lead with the concrete thing that happened or the number
                that surprises. text-lg makes this the only large paragraph.⟫
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                ⟪Section heading⟫
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                ⟪Body copy. Repeat h2+p blocks as needed.⟫
              </p>

              {/* OPTIONAL: stat cards — delete if unused */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { n: '⟪stat⟫', d: '⟪what it means⟫' },
                  { n: '⟪stat⟫', d: '⟪what it means⟫' },
                  { n: '⟪stat⟫', d: '⟪what it means⟫' },
                ].map((s) => (
                  <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                  </div>
                ))}
              </div>

              {/* OPTIONAL: titled point cards (lists, checklists) — delete if unused */}
              <div className="mt-6 space-y-4">
                {[
                  { n: '⟪Point title⟫', d: '⟪Point body.⟫' },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>

              {/* CTA box — keep unless the post is pure news */}
              <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  ⟪CTA kicker⟫
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">⟪CTA copy.⟫</p>
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
                <a href="/blog/⟪related-slug⟫" className="text-blue-400 hover:text-blue-300">
                  ⟪related post description⟫
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

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
