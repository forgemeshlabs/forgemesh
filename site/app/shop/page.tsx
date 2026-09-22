import type { Metadata } from 'next';
import { ShoppingBag, Package } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { ShopGrid } from '@/components/ShopGrid';
import { getShopCatalog } from '@/lib/shop';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'The Agent Shop — Trending Products, Buyable by Humans and AI Agents | ForgeMesh',
  description:
    'A TikTok Shop for agents: trending products buyable by humans and AI agents. Agent wallets, AI services, dev tools, merch — buy now, or copy a ready prompt for your agent to buy it.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'The Agent Shop',
    description: 'Trending products. Buyable by humans and agents.',
    type: 'website',
    url: 'https://forgemesh.io/shop',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'The Agent Shop',
    description: 'Trending products. Buyable by humans and agents.',
  },
};

export default function ShopPage() {
  const products = getShopCatalog();
  const live = products.filter((p) => p.status === 'live');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The Agent Shop',
    url: 'https://forgemesh.io/shop',
    numberOfItems: live.length,
    itemListElement: live.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      description: p.why_hot,
      url: p.go_link ? (p.go_link.startsWith('http') ? p.go_link : `https://forgemesh.io${p.go_link}`) : 'https://forgemesh.io/shop',
    })),
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <section className="relative px-4 pb-14 pt-28 sm:px-6 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(45,212,191,0.14),transparent_32%)]" />
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-300/80">
                <ShoppingBag className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
                The Agent Shop
              </span>
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Trending products. Buyable by humans and agents.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
              Agent wallets, AI services, dev tools, and merch — curated for the agent economy. Buy it yourself,
              or hit &ldquo;Send to Agent&rdquo; to copy a ready prompt your AI can act on.
            </p>

            <div className="mt-10">
              <ShopGrid products={products} />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.07] bg-[#080810] px-6 py-14">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <Package className="mb-4 h-6 w-6 text-teal-300" strokeWidth={1.6} aria-hidden="true" />
              <h2 className="text-xl font-medium text-slate-100">Want your product here?</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Contact <a href="mailto:hello@forgemesh.io" className="text-teal-300 hover:text-teal-200">hello@forgemesh.io</a>{' '}
                to get listed, or wire the feed straight into your own agent with the affiliate router MCP.
              </p>
            </div>
            <a
              href="https://www.npmjs.com/package/affiliate-router-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-teal-400/40 hover:text-white active:translate-y-px"
            >
              affiliate-router-mcp on npm
            </a>
          </div>
          <p className="mx-auto mt-8 max-w-6xl text-xs leading-6 text-slate-500">
            Some links are affiliate links; ForgeMesh may earn a commission at no extra cost to you. The
            machine-readable feed is at{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-slate-300">/api/shop/catalog</code>.
          </p>
        </section>
      </main>
      <ShareBar />
      <Footer />
    </>
  );
}
