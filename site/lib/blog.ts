export type BlogPost = {
  slug: string;
  date: string; // YYYY-MM-DD
  title: string;
  excerpt: string;
  image?: string; // path under /public, e.g. '/blog/<slug>.png'
  tags: string[]; // shown as chips, fed into meta keywords / OG article:tag
};

export const POSTS: BlogPost[] = [
  {
    slug: 'free-agent-economy-scanners',
    date: '2026-08-24',
    title: 'Can Agents Find You, Trust You, and Pay You? Scan It. Free.',
    excerpt:
      'We run 19 paid MCP servers and measure everything that breaks. Our scanners — 30+ agent-readiness checks and a no-spend x402 endpoint audit — are free, and this week they learned our newest field findings: the 500-character cliff, the extensionless manifest rule, and why empty descriptions make you invisible to buying agents.',
    image: '/blog/free-agent-economy-scanners.png',
    tags: ['agent-readiness', 'x402', 'mcp', 'free-tools'],
  },
  {
    slug: 'x401-identity-protocol-agent-economy',
    date: '2026-08-22',
    title: '401 Asks Who You Are. 402 Asks You to Pay. The Agent Web Just Got Both.',
    excerpt:
      "Proof's x401 — backed by Circle, OpenAI, Google, and Okta — gives every website a standard way to ask which human is behind an AI agent, using the status code that sat next to 402 for thirty years. What it means for everyone selling to machines, why it would have blunted last week's wallet-impersonation attack, and the honest caveats.",
    image: '/blog/x401-identity-protocol-agent-economy.png',
    tags: ['protocol', 'identity', 'x401', 'news'],
  },
  {
    slug: 'address-poisoning-dust-attack-x402-agent-wallets',
    date: '2026-08-21',
    title: 'We Funded a Wallet at Breakfast. Scammers Impersonated It by Lunch.',
    excerpt:
      'Minutes into a routine payment sweep, our revenue feed pinged with two $0.00 "payments" from what looked like our own wallet. It was an address-poisoning attack: a lookalike address ground to match ours on the first and last four characters — the only ones anything displays. How the scam works in plain language, why agent operators are its perfect target, and the five boring habits that make it harmless.',
    image: '/blog/address-poisoning-dust-attack-x402-agent-wallets.png',
    tags: ['security', 'wallets', 'address poisoning', 'field report'],
  },
  {
    slug: 'x402-v1-v2-client-split-your-endpoint-may-be-unpayable',
    date: '2026-08-20',
    title: 'The x402 SDK Went v2. The Client Everyone Installs Didn’t. Your Endpoint May Be Unpayable.',
    excerpt:
      '@x402/core went v2 in December 2025 — the server SDK every current guide tells you to build on. x402-fetch, the most-installed client, last shipped April 16, 2026 as v1-only. Four silent wire-format breaks mean neither side ever sees an error while settlements quietly collapse. How we found it, and proved the fix with a real on-chain settlement.',
    image: '/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable.png',
    tags: ['protocol', 'interop', 'x402-fetch', 'field report'],
  },
  {
    slug: 'x402-bazaar-health-census-august-2026',
    date: '2026-08-19',
    title: 'We Health-Checked Every Seller in the x402 Bazaar. One in Four Can’t Take an Agent’s Money.',
    excerpt:
      'One probe per seller, all 1,225 of them: 74% pass, 206 are dead at their listed URL, 40 are serving their paid product for free without knowing it, and 15% already answer with both x402 and MPP challenges. The first health census of the agent economy — plus the measurement mistake we made on the way that explains half the problem.',
    image: '/blog/x402-bazaar-health-census-august-2026.png',
    tags: ['data', 'bazaar', 'ecosystem', 'census'],
  },
  {
    slug: 'stripe-openrouter-genius-act-agent-payment-rules',
    date: '2026-08-18',
    title: 'Three Different People Just Started Writing the Rules for How Agents Pay',
    excerpt:
      'In one week: Stripe reportedly bought OpenRouter for $7B+, Google’s AP2 protocol moved to FIDO Alliance governance, and Treasury published the GENIUS Act stablecoin licensing rules in the Federal Register. What each rulebook means for x402 and MPP sellers — and the first 24-hour read on the MPP rail since the acquisition news broke.',
    image: '/blog/stripe-openrouter-genius-act-agent-payment-rules.png',
    tags: ['news', 'regulation', 'stripe', 'mpp'],
  },
  {
    slug: 'x402-500-character-description-limit',
    date: '2026-08-04',
    title: 'The 500-Character Cliff: One Extra Byte Makes an x402 Listing Silently Unpayable',
    excerpt:
      'No error, no warning — a description one character over an undocumented limit makes an x402 resource silently unpurchasable. We measured the cliff at exactly 500 characters, credit the seller who filed the public report, and show the defense we run across 800+ listings. The upstream fix still hasn’t merged.',
    image: '/blog/x402-500-character-description-limit.png',
    tags: ['protocol', 'bazaar', 'gotcha', 'field report'],
  },
  {
    slug: 'x402-catalog-purge-overnight-july-2026',
    date: '2026-08-04',
    title: '43% of the x402 Catalog Vanished Overnight. Nobody Announced It.',
    excerpt:
      'Six days after we published the 40% whale, it was deleted — along with 10,700 other listings — between two of our crawler snapshots. The story of the silent late-July purge, the ground shifting under x402 sellers, our own zero-sale weekend, and the two new buyer wallets that showed up twelve hours after we fixed what nobody could see.',
    image: '/blog/x402-catalog-purge-overnight-july-2026.png',
    tags: ['data', 'bazaar', 'ecosystem'],
  },
  {
    slug: 'open-usd-circle-stablecoin-x402',
    date: '2026-07-18',
    title: 'Open USD Blindsided Circle — and Previewed the Fight Over Agent Money',
    excerpt:
      'On June 30, 140+ companies — Stripe, Visa, Mastercard, BlackRock, and Circle’s own partner Coinbase — launched a stablecoin that gives reserve yield back to participants. CRCL fell 17%. Why the attack is on the business model, not the token, and what it means for x402, where USDC settles ~98% of agent payments.',
    image: '/blog/open-usd-circle-stablecoin-x402.png',
    tags: ['news', 'stablecoins', 'usdc'],
  },
  {
    slug: 'why-ai-agents-need-crypto',
    date: '2026-07-18',
    title: 'AI × Blockchain Never Made Sense at Conferences. Then Agents Needed Wallets.',
    excerpt:
      'For years every conference coupled AI to crypto and none of it was coherent — models on-chain, tokens for compute. The real convergence came from the opposite direction: agents became economic actors and needed money without a human in the loop. That was crypto’s actual product all along.',
    image: '/blog/why-ai-agents-need-crypto.png',
    tags: ['essay', 'agent economy', 'crypto'],
  },
  {
    slug: 'x402-bazaar-economy-data-july-2026',
    date: '2026-07-18',
    title: 'The x402 Economy, Measured: One Seller Is 40% of the Catalog',
    excerpt:
      'Original data from our Bazaar crawler: 24,816 live paid resources, 1,136 sellers (+3% in three days), 98% on Base, two-thirds priced between $0.01–$0.10 — and a single wallet behind 40% of all listings. Honest measurements of a very young market.',
    image: '/blog/x402-bazaar-economy-data-july-2026.png',
    tags: ['data', 'bazaar', 'ecosystem'],
  },
  {
    slug: 'lessons-from-500-paid-x402-endpoints',
    date: '2026-07-18',
    title: 'Five Lessons From Running 500+ Paid x402 Endpoints',
    excerpt:
      'Upstream APIs will rug-pull you mid-build. An empty 402 body is a lost sale. Never charge a buyer for your own errors. Field notes on what selling to AI agents actually looks like, from the operators of 11 live x402 services and counting.',
    image: '/blog/lessons-from-500-paid-x402-endpoints.png',
    tags: ['guide', 'operations', 'field report'],
  },
  {
    slug: 'x402-foundation-linux-foundation-launch',
    date: '2026-07-18',
    title: 'The Linux Foundation Now Governs x402 — and Visa, Mastercard, and Stripe Just Joined',
    excerpt:
      'On July 14, 2026 the x402 Foundation went operational under Linux Foundation governance with 40 members spanning card networks, clouds, and crypto. Here is what actually changed, why the membership list matters more than the press release, and what it means if you sell — or plan to sell — to AI agents.',
    image: '/blog/x402-foundation-linux-foundation-launch.png',
    tags: ['news', 'governance', 'linux foundation'],
  },
];
