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
      verify: b.verify.length ? { rdns: b.verify } : null,
      docs: b.docs || null,
      pays: pays(b) ? { x402: true, networks: ['eip155:8453'] } : { x402: false },
      note: b.note || null,
    },
    observed,
  };
}
