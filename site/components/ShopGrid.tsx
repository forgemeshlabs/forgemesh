'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bot, Camera, Check, ListChecks, Server, ShoppingBag, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import type { ShopProduct } from '@/lib/shop';

const TABS: { label: string; category: string | 'all' }[] = [
  { label: 'All', category: 'all' },
  { label: 'Agent Wallets', category: 'agent-wallets' },
  { label: 'AI Services', category: 'ai-services' },
  { label: 'Dev Tools', category: 'dev-tools' },
  { label: 'Merch', category: 'merch' },
  { label: 'Creator Gear', category: 'creator-gear' },
  { label: 'Trending', category: 'trending' },
];

const CATEGORY_ICON: Record<string, typeof Wallet> = {
  'agent-wallets': Wallet,
  'ai-services': Sparkles,
  'dev-tools': Server,
  merch: ShoppingBag,
  'creator-gear': Camera,
  trending: TrendingUp,
  guides: ListChecks,
  'ai-tools': Bot,
  productivity: ListChecks,
};

const CATEGORY_GRADIENT: Record<string, string> = {
  'agent-wallets': 'from-blue-500/25 via-blue-500/5 to-transparent',
  'ai-services': 'from-teal-400/25 via-teal-400/5 to-transparent',
  'dev-tools': 'from-cyan-400/25 via-cyan-400/5 to-transparent',
  merch: 'from-amber-400/25 via-amber-400/5 to-transparent',
  'creator-gear': 'from-fuchsia-400/20 via-fuchsia-400/5 to-transparent',
  trending: 'from-emerald-400/25 via-emerald-400/5 to-transparent',
  guides: 'from-indigo-400/25 via-indigo-400/5 to-transparent',
  'ai-tools': 'from-sky-400/25 via-sky-400/5 to-transparent',
  productivity: 'from-slate-400/20 via-slate-400/5 to-transparent',
};

function categoryLabel(category: string) {
  return category
    .split('-')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}

function track(event: string, data?: Record<string, string>) {
  (window as unknown as { umami?: { track: (e: string, d?: object) => void } }).umami?.track(event, data);
}

function buyHref(product: ShopProduct): string {
  if (!product.go_link) return '#';
  return product.go_link;
}

function absoluteUrl(link: string): string {
  if (link.startsWith('http')) return link;
  return `https://forgemesh.io${link}`;
}

function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const Icon = CATEGORY_ICON[product.category] ?? Sparkles;
  const gradient = CATEGORY_GRADIENT[product.category] ?? 'from-slate-500/20 via-slate-500/5 to-transparent';
  const comingSoon = product.status === 'coming_soon';
  const [copied, setCopied] = useState(false);

  async function sendToAgent() {
    const url = product.go_link ? absoluteUrl(product.go_link) : 'https://forgemesh.io/shop';
    const prompt = `Buy me ${product.name} from ${url}`;
    track('shop_agent_copy', { product_id: product.id });
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.03 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-[#0a0a12] transition-colors hover:border-teal-400/30"
    >
      {comingSoon ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050509]/75 backdrop-blur-[2px]">
          <span className="rounded-full border border-white/[0.15] bg-white/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-slate-300">
            Coming Soon
          </span>
        </div>
      ) : null}

      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <Icon className="h-10 w-10 text-slate-100/80" strokeWidth={1.4} aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-medium leading-snug text-slate-100">{product.name}</h3>
          {product.price ? (
            <span className="shrink-0 rounded-full border border-white/[0.12] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-slate-200">
              {product.price}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-6 text-slate-400">{product.why_hot}</p>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-300/25 bg-teal-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-teal-200">
          {categoryLabel(product.category)}
        </span>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <a
            href={buyHref(product)}
            target={product.go_link?.startsWith('http') ? '_blank' : undefined}
            rel={product.go_link?.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-disabled={comingSoon}
            onClick={(e) => {
              if (comingSoon) { e.preventDefault(); return; }
              track('shop_buy', { partner: product.affiliate_partner ?? 'direct', product_id: product.id });
            }}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              comingSoon
                ? 'pointer-events-none bg-white/[0.04] text-slate-500'
                : 'bg-slate-100 text-slate-950 hover:bg-teal-100 active:translate-y-px'
            }`}
          >
            Buy Now <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            disabled={comingSoon}
            onClick={sendToAgent}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              comingSoon
                ? 'cursor-not-allowed border-white/[0.06] text-slate-600'
                : 'border-white/[0.14] text-slate-200 hover:border-teal-400/40 hover:text-white active:translate-y-px'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" /> : null}
            {copied ? 'Copied' : 'Send to Agent'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function ShopGrid({ products }: { products: ShopProduct[] }) {
  const [active, setActive] = useState<string>('all');

  const filtered = useMemo(
    () => (active === 'all' ? products : products.filter((p) => p.category === active)),
    [products, active],
  );

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.map((tab) => (
          <button
            key={tab.category}
            type="button"
            onClick={() => setActive(tab.category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              active === tab.category
                ? 'border-teal-400/50 bg-teal-400/10 text-teal-100'
                : 'border-white/[0.1] text-slate-400 hover:border-white/[0.2] hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-slate-500">Nothing in this category yet — check back soon.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
