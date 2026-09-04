// The whole ForgeMesh catalog as one flat table — rendered at /tools and
// used to pick the "featured" subsets the NavBar dropdowns show.
// Rule (operator, 2026-09-04): new tools/products get a row HERE, not a nav
// slot. Keep `what` to one line — this reads like a README table.

export type Cost = 'free' | 'paid' | 'npm';
export type Audience = 'humans' | 'agents' | 'builders';

export type ToolRow = {
  name: string;
  href: string;
  what: string;
  cost: Cost;
  price?: string; // shown for paid rows, e.g. "$0.005/call"
  for: Audience[];
  featured?: boolean; // appears in the NavBar dropdown
};

export type ToolGroup = {
  id: string;
  title: string;
  blurb: string;
  rows: ToolRow[];
};

export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: 'free',
    title: 'Free tools',
    blurb: 'Use in the browser. No account, no wallet.',
    rows: [
      { name: 'Free VIN check', href: '/vin', what: 'Any VIN → recalls, crash stars, fuel cost, and what actually breaks on that car', cost: 'free', for: ['humans'], featured: true },
      { name: 'Congress Trades', href: '/trades', what: 'Every US House stock trade from STOCK Act filings, updated daily', cost: 'free', for: ['humans'], featured: true },
      { name: 'Endpoint scanner', href: '/scan', what: 'Grade any x402 / MPP endpoint: payable, envelope valid, dual-stack', cost: 'free', for: ['builders'], featured: true },
      { name: 'Seller pre-flight checklist', href: '/checklist', what: 'Everything to verify before listing a paid endpoint', cost: 'free', for: ['builders'], featured: true },
      { name: 'Seller kits + guides', href: 'https://kit.forgemesh.io', what: 'Free x402 checklist, Stack Basics course, build kits', cost: 'free', for: ['builders'], featured: true },
      { name: 'Calendar', href: '/calendar', what: 'Dates that matter in the agent economy, with .ics feed', cost: 'free', for: ['humans', 'builders'] },
      { name: 'The Brief', href: '/brief', what: 'Weekly newsletter: what moved in agent payments, decoded', cost: 'free', for: ['humans', 'builders'] },
      { name: 'Blog', href: '/blog', what: 'Field reports from running 500+ paid endpoints', cost: 'free', for: ['humans', 'builders'] },
    ],
  },
  {
    id: 'watch',
    title: 'Live data and watches',
    blurb: 'Collected on a schedule, published free, also machine-readable.',
    rows: [
      { name: 'Rail Pulse', href: '/#rail-pulse', what: 'Live x402 and MPP transaction and volume telemetry, refreshed 4×/day', cost: 'free', for: ['humans', 'agents'] },
      { name: 'Repo Watch', href: '/repo-watch', what: 'Every x402 release across the ecosystem, tagged breaking / security / chain', cost: 'free', for: ['builders'], featured: true },
      { name: 'Payment Rules Watch', href: '/payment-rules', what: 'Are Visa, Mastercard or Stripe proposing agent-payment pricing rules? Status light + feed', cost: 'free', for: ['builders'] },
      { name: 'Texas Watch', href: '/texas', what: 'ERCOT grid vs. the data-center queue, tracked', cost: 'free', for: ['humans'] },
      { name: '402 Payment Required', href: '/402-payment-required', what: 'The status code explained, with live examples', cost: 'free', for: ['builders'] },
      { name: 'Congress trades JSON', href: '/congress-trades.json', what: 'Latest 300 trades as a raw feed', cost: 'free', for: ['agents', 'builders'] },
      { name: 'llms.txt / index.json', href: '/llms.txt', what: 'Discovery surfaces for AI crawlers and agent indexes', cost: 'free', for: ['agents'] },
    ],
  },
  {
    id: 'paid',
    title: 'Paid APIs (x402 + MPP)',
    blurb: 'Pay per call in USDC on Base. No accounts, no API keys. Same 402 challenge answers both rails.',
    rows: [
      { name: 'Vehicle Intelligence Pack', href: '/vehicle-intelligence', what: 'VIN decode, recalls, crash ratings, complaints, ranked failure report, fuel economy', cost: 'paid', price: 'from $0.005', for: ['agents'], featured: true },
      { name: 'Gov-Transparency Pack', href: '/gov-transparency', what: 'Congress trades, campaign finance, lobbying, federal contracts, bills, regulations', cost: 'paid', price: 'from $0.005', for: ['agents'], featured: true },
      { name: 'x402 Utility Grid', href: 'https://x402.forgemesh.io', what: '400+ utility routes: data lookups, math, games, text, gov, vehicles', cost: 'paid', price: 'from $0.005', for: ['agents'], featured: true },
      { name: 'SEO Authority API', href: '/seo', what: 'Domain authority and backlink signals from Common Crawl', cost: 'paid', price: 'per call', for: ['agents', 'builders'], featured: true },
      { name: 'BotBoard', href: '/botboard', what: 'Public message wall where every post costs $0.001 — the spam filter is a price tag', cost: 'paid', price: '$0.001/post', for: ['agents'], featured: true },
      { name: 'ForgeMesh Library', href: 'https://library.forgemesh.io', what: '61,000 public-domain books, searchable and readable per call', cost: 'paid', price: 'per call', for: ['agents'], featured: true },
      { name: 'x402 Proxy', href: 'https://proxy.forgemesh.io', what: 'Paywall any URL, no code; 85/15 non-custodial split to your wallet', cost: 'paid', price: '15% of sales', for: ['builders'] },
      { name: 'Voice', href: 'https://voice.forgemesh.io', what: 'Text-to-speech with 300+ sample voices', cost: 'paid', price: 'per synth', for: ['agents'] },
      { name: 'ImageGen', href: 'https://imagegen.coinopai.com', what: 'Image generation, four tiers', cost: 'paid', price: 'from $0.25', for: ['agents'] },
      { name: 'Disruption Intel', href: 'https://disruption.forgemesh.io', what: 'WARN-notice and layoff ripple reports', cost: 'paid', price: 'per report', for: ['agents'] },
      { name: 'Anomaly Tracker', href: 'https://anomaly.forgemesh.io', what: 'Sequence-mined anomalies across 11 endpoints, 3 domains', cost: 'paid', price: 'per call', for: ['agents'] },
      { name: 'Ads and Intent Network', href: 'https://ads.forgemesh.io', what: 'Machine-buyable ad slots and intent signals', cost: 'paid', price: 'per impression', for: ['agents', 'builders'] },
      { name: 'Travel Agent', href: 'https://travel-agent.forgemesh.io', what: 'Fare intelligence and trip planning', cost: 'paid', price: 'per call', for: ['agents'] },
      { name: 'Notary', href: 'https://notary.forgemesh.io', what: 'On-chain timestamp and hash attestation', cost: 'paid', price: 'per notarization', for: ['agents'] },
      { name: 'CoinOpAI API', href: 'https://x402.coinopai.com', what: 'Crypto intelligence and prompt utilities', cost: 'paid', price: 'per call', for: ['agents'] },
      { name: 'Kronos', href: '/kronos', what: 'Calibrated crypto price ranges, risk context, decision audits', cost: 'paid', price: '$0.02–0.15', for: ['agents'] },
      { name: 'ClawVoice', href: '/clawvoice', what: 'Voice for OpenClaw / ClawHub agents', cost: 'paid', price: 'per synth', for: ['agents'] },
      { name: 'x402 Swag', href: 'https://x402swag.com', what: 'Merch an agent can buy: card or USDC over x402', cost: 'paid', price: 'retail', for: ['humans', 'agents'] },
    ],
  },
  {
    id: 'mcp',
    title: 'MCP servers (npm)',
    blurb: 'Install with npx. Without a wallet key they return the 402 challenge and spend nothing.',
    rows: [
      { name: '@forgemeshlabs/utility-grid-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/utility-grid-mcp', what: 'Every Utility Grid route as an agent tool', cost: 'npm', for: ['agents', 'builders'] },
      { name: '@forgemeshlabs/x402-scan-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/x402-scan-mcp', what: 'The endpoint scanner as a tool', cost: 'npm', for: ['builders'], featured: true },
      { name: '@forgemeshlabs/aso-audit-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/aso-audit-mcp', what: 'Agent Signal Optimization audit + score', cost: 'npm', for: ['builders'] },
      { name: '@forgemeshlabs/agent-readiness-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/agent-readiness-mcp', what: 'Is a website agent-friendly? Checks and fixes', cost: 'npm', for: ['builders'] },
      { name: '@forgemeshlabs/kronos-forgemesh-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/kronos-forgemesh-mcp', what: 'Kronos market intelligence, 8 tools', cost: 'npm', for: ['agents'] },
      { name: '@forgemeshlabs/x402-notary-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/x402-notary-mcp', what: 'Notary as a tool', cost: 'npm', for: ['agents'] },
      { name: '@forgemeshlabs/anomaly-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/anomaly-mcp', what: 'Anomaly Tracker as a tool', cost: 'npm', for: ['agents'] },
      { name: '@forgemeshlabs/disruption-intelligence-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/disruption-intelligence-mcp', what: 'Disruption Intel as a tool', cost: 'npm', for: ['agents'] },
      { name: '@forgemeshlabs/travel-agent-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/travel-agent-mcp', what: 'Travel Agent as a tool', cost: 'npm', for: ['agents'] },
      { name: '@forgemeshlabs/library-mcp', href: 'https://www.npmjs.com/package/@forgemeshlabs/library-mcp', what: 'Library search and reading as tools', cost: 'npm', for: ['agents'] },
      { name: 'coinopai-mcp', href: 'https://www.npmjs.com/package/coinopai-mcp', what: 'CoinOpAI crypto intelligence, 9 tools', cost: 'npm', for: ['agents'] },
      { name: 'forgemesh-imagegen', href: 'https://www.npmjs.com/package/forgemesh-imagegen', what: 'ImageGen as a tool', cost: 'npm', for: ['agents'] },
      { name: 'affiliate-router-mcp', href: 'https://www.npmjs.com/package/affiliate-router-mcp', what: 'Vendor-neutral affiliate link routing, 8 tools', cost: 'npm', for: ['builders'] },
      { name: 'x402-ads-mcp', href: 'https://www.npmjs.com/package/x402-ads-mcp', what: 'Ads and Intent Network as a tool', cost: 'npm', for: ['agents'] },
      { name: 'forgemesh', href: 'https://www.npmjs.com/package/forgemesh', what: 'Registry client and utilities for the fleet', cost: 'npm', for: ['builders'] },
    ],
  },
  {
    id: 'learn',
    title: 'Learn',
    blurb: 'Start here if the words above are new.',
    rows: [
      { name: 'New here? Start', href: '/new-here', what: 'What ForgeMesh is and where to click first', cost: 'free', for: ['humans'], featured: true },
      { name: 'What is x402?', href: '/x402', what: 'The HTTP 402 payment protocol, explained', cost: 'free', for: ['humans', 'builders'], featured: true },
      { name: 'What is MPP?', href: '/mpp', what: 'Stripe’s Machine Payments Protocol, and how it sits next to x402', cost: 'free', for: ['humans', 'builders'], featured: true },
      { name: 'MCP servers', href: '/#mcp', what: 'One-line installs for every server above', cost: 'free', for: ['builders'], featured: true },
      { name: 'Philosophy', href: '/#philosophy', what: 'Why every builder belongs', cost: 'free', for: ['humans'], featured: true },
      { name: 'Discovery', href: '/#discovery', what: 'How agents find paid endpoints: Bazaar, .well-known, llms.txt', cost: 'free', for: ['builders'], featured: true },
      { name: 'Privacy / Terms', href: '/privacy', what: 'The fine print', cost: 'free', for: ['humans'] },
    ],
  },
];

export const featured = (id: string) => TOOL_GROUPS.find((g) => g.id === id)?.rows.filter((r) => r.featured) ?? [];
export const TOOL_COUNT = TOOL_GROUPS.reduce((n, g) => n + g.rows.length, 0);
