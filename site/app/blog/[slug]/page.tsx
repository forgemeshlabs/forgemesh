// Dynamic blog route — renders posts published at runtime from content/posts/
// (via scripts/publish-post.mjs) with no rebuild. Built app/blog/<slug>/
// folders always shadow this route, so it only ever serves post-build posts.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';
import { loadRuntimePost } from '@/lib/runtime-blog';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

// Minimal inline markup for post paras: **bold**, *italic*, [text](url).
function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={k++} className="text-slate-200">{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<em key={k++}>{m[2]}</em>);
    else out.push(
      <a key={k++} href={m[4]} className="text-blue-400 hover:text-blue-300">{m[3]}</a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = loadRuntimePost(slug);
  if (!post) return {};
  const hero = post.image || null;
  return {
    metadataBase: new URL('https://forgemesh.io'),
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: [...post.tags, 'x402', 'agent payments', 'USDC micropayments', 'Base mainnet'],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://forgemesh.io/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['ForgeMesh Labs'],
      tags: post.tags,
      images: hero ? [hero] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@forgemeshlabs',
      images: hero ? [hero] : undefined,
      title: post.twitterTitle || post.title,
      description: post.twitterDescription || post.seoDescription,
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const post = loadRuntimePost(slug);
  if (!post) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        author: {
          '@type': 'Organization',
          name: 'ForgeMesh Labs',
          url: 'https://forgemesh.io',
          description:
            'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources.',
        },
        publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
        datePublished: post.date,
        dateModified: post.date,
        keywords: post.tags.join(', '),
        image: post.image ? `https://forgemesh.io${post.image}` : undefined,
        mainEntityOfPage: `https://forgemesh.io/blog/${post.slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.breadcrumb || post.title,
            item: `https://forgemesh.io/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />

        <article className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 xl:gap-12">
            <div className="min-w-0 max-w-3xl lg:flex-1">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                <ForgeMeshMark size={22} className="shrink-0" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Field notes · <time dateTime={post.date}>{post.date}</time>
                </span>
              </div>

              <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
                {post.title}
              </h1>

              {post.image ? (
                <img
                  src={post.image}
                  alt={post.heroAlt}
                  className="mt-8 w-full rounded border border-white/[0.06]"
                  width={1200}
                  height={675}
                />
              ) : null}

              <ShareBar inline />

              <p className="mt-6 text-lg leading-8 text-slate-300">{renderInline(post.lede)}</p>

              {post.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                    {s.heading}
                  </h2>
                  {s.paras.map((p, i) => (
                    <p key={i} className="mt-4 text-base leading-8 text-slate-400">
                      {renderInline(p)}
                    </p>
                  ))}
                  {s.stats?.length ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {s.stats.map((st) => (
                        <div key={st.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                          <div className="text-3xl font-semibold text-blue-300">{st.n}</div>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{st.d}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}

              {post.cta ? (
                <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                    {post.cta.kicker}
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-300">{renderInline(post.cta.copy)}</p>
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
              ) : null}

              {post.related?.length ? (
                <p className="mt-10 text-base leading-8 text-slate-400">
                  Related reading:{' '}
                  {post.related.map((r, i) => (
                    <span key={r.slug}>
                      {i > 0 ? ' and ' : ''}
                      <a href={`/blog/${r.slug}`} className="text-blue-400 hover:text-blue-300">
                        {r.text}
                      </a>
                    </span>
                  ))}
                  .
                </p>
              ) : null}

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
                >
                  More from the blog
                </a>
              </div>
            </div>
            <BlogArchive current={post.slug} />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
