import bots from '@/lib/bots-data.json';

export type Bot = {
  slug: string;
  name: string;
  class: string;
  purpose: string;
  operator: string;
  docs: string;
  robots: string;
  note: string;
  match: string[];
  verify: string[];
};

export type Observed = {
  window_days: number;
  sites_seen: number;
  sites_reporting: number;
  hits: number;
  verified_rate: number | null;
  impostor_rate: number | null;
  paid_fetches: number;
  share_charged: number | null;
  share_free: number | null;
  share_blocked: number | null;
  median_price_usd: number | null;
  first_seen: string | null;
  sample_note: string | null;
};

export const BOTS: Bot[] = (bots as Bot[]).slice().sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

export const PURPOSES: Record<string, { title: string; short: string; blurb: string; verdict: string }> = {
  'search-index': { title: 'Search engines', short: 'search index', blurb: 'Index pages for search results. Verified by reverse DNS and free by default; blocking them removes you from search.', verdict: 'Let it in. Verify it.' },
  training: { title: 'AI training crawlers', short: 'AI training', blurb: 'Collect pages to train models. Bulk, periodic, and the ones most owners want to charge or block.', verdict: 'Charge it or block it. It does not pay yet.' },
  'ai-search': { title: 'AI search indexers', short: 'AI search', blurb: 'Build the index behind AI answers and cite you. Blocking them removes you from those answers, not from training.', verdict: 'Your call: visibility in AI answers versus free use.' },
  'user-fetch': { title: 'Fetchers for an AI user', short: 'user fetch', blurb: 'One request because a person asked an assistant about your page. Not bulk crawling; some ignore robots.txt because a human triggered them.', verdict: 'Usually let it in; it is a reader with an assistant.' },
  'agent-retrieval': { title: 'Agent tooling', short: 'agent retrieval', blurb: 'Services that fetch pages for AI agents on request. The agents behind them can carry wallets: these are the likeliest payers.', verdict: 'Charge it. These are the ones that can pay.' },
  seo: { title: 'SEO and backlink crawlers', short: 'SEO', blurb: 'Commercial indexes sold to marketers. Blocking them hides you from their customers, not from Google.', verdict: 'Charge it; it is a commercial product built on your pages.' },
  archive: { title: 'Archives and research', short: 'archive', blurb: 'Preservation and open corpora. Non-profit, but their datasets feed AI training downstream.', verdict: 'Let it in if you value preservation; know where the corpus goes.' },
  social: { title: 'Link previewers', short: 'link preview', blurb: 'Fetch a page once to draw the card when someone shares a link. Free by default so your links look right.', verdict: 'Let it in.' },
  monitor: { title: 'Monitors and readers', short: 'monitor', blurb: 'Uptime checks, feed readers, WordPress itself. Free by default.', verdict: 'Let it in.' },
  scraping: { title: 'Scripts and scrapers', short: 'script', blurb: 'Bare HTTP libraries, scraping frameworks, headless browsers. Nobody identified themselves; paid by default.', verdict: 'Charge it or block it. It did not say who it was.' },
};

export const PURPOSE_ORDER = Object.keys(PURPOSES);

// Published IP-range lists (operators' own URLs). Reverse DNS suffixes live in
// the catalog; these are the second verification path many operators document.
export const IP_RANGES: Record<string, string> = {
  GPTBot: 'https://openai.com/gptbot.json',
  'ChatGPT-User': 'https://openai.com/chatgpt-user.json',
  'OAI-SearchBot': 'https://openai.com/searchbot.json',
  PerplexityBot: 'https://www.perplexity.com/perplexitybot.json',
  'Perplexity-User': 'https://www.perplexity.com/perplexity-user.json',
  CCBot: 'https://index.commoncrawl.org/ccbot.json',
  Applebot: 'https://search.developer.apple.com/applebot.json',
  Bingbot: 'https://www.bing.com/toolbox/bingbot.json',
  Googlebot: 'https://developers.google.com/static/search/apis/ipranges/googlebot.json',
  'Google-InspectionTool': 'https://developers.google.com/static/search/apis/ipranges/special-crawlers.json',
  GoogleOther: 'https://developers.google.com/static/search/apis/ipranges/special-crawlers.json',
  DuckDuckBot: 'https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot/',
  Amazonbot: 'https://developer.amazon.com/amazonbot',
};

import fs from 'node:fs';
import path from 'node:path';
// Re-hosted operator marks, PNG or WebP only, under public/bots/logos/<slug>.(png|webp).
// Never SVG, never hotlinked: the feed may carry a filename, never a URL.
export function logoFor(slug: string): string | null {
  for (const ext of ['png', 'webp']) {
    try { if (fs.existsSync(path.join(process.cwd(), 'public', 'bots', 'logos', `${slug}.${ext}`))) return `/bots/logos/${slug}.${ext}`; } catch { /* ignore */ }
  }
  return null;
}

// Mugshot criteria: bots a site owner should think twice about. Data-driven where
// observations exist, documentation-driven otherwise.
export function mugshotReasons(b: Bot, o: Observed | null): string[] {
  const r: string[] = [];
  if (b.purpose === 'scraping' && !b.docs) r.push('Unidentified: no operator, no documentation');
  if (b.purpose === 'training' && !b.docs) r.push('Trains models with no published policy or opt-out');
  if (/no published/i.test(b.note) && b.purpose !== 'scraping') r.push('No published crawler documentation');
  if (!b.verify.length && !IP_RANGES[b.name] && (b.purpose === 'training' || b.purpose === 'ai-search') && !/openai|anthropic|perplexity|google|apple|microsoft|common crawl/i.test(b.operator)) r.push('No published way to verify a request is really this crawler');
  if (/ignores robots\.txt|generally ignores/i.test(b.note)) r.push('Documented as ignoring robots.txt');
  if (o && o.impostor_rate != null && o.impostor_rate >= 0.5 && o.hits >= 20) r.push(`Impersonated: ${Math.round(o.impostor_rate * 100)}% of requests using this name failed verification`);
  if (o && o.share_blocked != null && o.share_blocked >= 0.5 && o.sites_seen >= 5) r.push(`${Math.round(o.share_blocked * 100)}% of sites that see it block it`);
  return r;
}

export function botBySlug(slug: string): Bot | undefined {
  return BOTS.find((b) => b.slug === slug);
}

export function pays(b: Bot): boolean {
  return b.purpose === 'agent-retrieval' && /x402/i.test(b.name);
}

const ATLAS_API = process.env.ATLAS_API_BASE || 'https://proxy.forgemesh.io';

export async function fetchObserved(name: string): Promise<Observed | null> {
  try {
    const r = await fetch(`${ATLAS_API}/api/atlas/bots/${encodeURIComponent(name)}/observed?days=7`, { next: { revalidate: 600 }, signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const j = await r.json();
    return j.observed as Observed;
  } catch {
    return null;
  }
}

export async function fetchLeaderboard(): Promise<{ bots: { bot_name: string; sites: number; hits: number; impostor: number; slug: string }[]; new_arrivals: { bot_name: string; first_seen: string }[]; stats: { reporters: number; bots: number; sightings: number } } | null> {
  try {
    const r = await fetch(`${ATLAS_API}/api/atlas/leaderboard?days=7`, { next: { revalidate: 600 }, signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export function profileJson(b: Bot, observed: Observed | null) {
  return {
    version: '0.1',
    source: 'compiled by Crawler Atlas (forgemesh.io/bots); not yet declared by the operator',
    url: `https://forgemesh.io/bots/${b.slug}`,
    operator: { name: b.operator || null, homepage: b.docs ? `https://${new URL(b.docs).host}` : null, policy: b.docs || null },
    crawler: {
      name: b.name,
      class: b.class,
      purpose: b.purpose,
      user_agent_contains: b.match,
      robots_token: b.robots || null,
      verify: b.verify.length || IP_RANGES[b.name] ? { ...(b.verify.length ? { rdns: b.verify } : {}), ...(IP_RANGES[b.name] ? { ip_ranges: IP_RANGES[b.name] } : {}) } : null,
      docs: b.docs || null,
      pays: pays(b) ? { x402: true, networks: ['eip155:8453'] } : { x402: false },
      note: b.note || null,
    },
    observed,
  };
}
