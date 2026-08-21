import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Blog — x402, Agent Payments, and the Machine Economy | ForgeMesh Labs',
  description:
    'Field reports from operators of 11 x402 services and counting: protocol news, ecosystem data from our own crawler, and what it actually takes to sell to AI agents.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'ForgeMesh Labs Blog — x402 and the Machine Economy',
    description:
      'Protocol news and original ecosystem data from operators of 11 x402 services and counting.',
    type: 'website',
    url: 'https://forgemesh.io/blog',
    images: ['/fm-nobg.png'],
  },
};

export default function BlogIndex() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                ForgeMesh blog
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              Notes from the machine economy
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              We operate 11 x402 services and counting, with 500+ paid endpoints, and crawl the discovery ecosystem
              three times a day. This is where we publish what we learn — protocol news, original
              data, and operator field notes.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl space-y-6">
            {POSTS.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex gap-6 rounded border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-blue-500/40 hover:bg-blue-500/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <time dateTime={post.date} className="font-mono text-xs text-blue-300/80">
                    {post.date}
                  </time>
                  <h2 className="mt-2 text-xl font-semibold leading-snug text-slate-100 sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{post.excerpt}</p>
                  <ul aria-label="Topics" className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-slate-400"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400">
                    Read the analysis <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    width={224}
                    height={126}
                    className="hidden h-[126px] w-56 shrink-0 self-center rounded border border-white/[0.06] object-cover sm:block"
                  />
                ) : null}
              </a>
            ))}
            <p className="pt-4 text-sm leading-6 text-slate-500">
              Start with the fundamentals:{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">What is x402?</a> ·{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                The 30-year history of HTTP 402
              </a>
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
