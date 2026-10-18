import type { Metadata } from 'next';
import { ArrowRight, Download } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { EDITIONS, WP_VERSION, WP_ZIP } from '@/lib/pay-per-crawl-editions';

const PRO = 'https://proxy.forgemesh.io/wp';
const WALLET = '0x13C3C28c64cc9d60eEb8a675F3fe27eBC6a4Cd09';

// Real $0.01 settlements on Base mainnet (PayAI facilitator), one per protocol version, October 2026.
const PROOF: { name: string; v1: string; v2: string }[] = [
  { name: 'WordPress', v1: '0xe764d2affaca73fa225aecd383aff5969b5d9ff4e8035933b7561983f23ba7f5', v2: '0xc9755334a10b2370b2925492490fb8a3c17dbaf2f6e8661f647bb1f13cb781c2' },
  { name: 'Python', v1: '0x49f0f05b3509545e5134aa6cf091ff7eab4e4f1e1b9aef9bf28280c231e2a945', v2: '0x15d95ad90c9530e4816016f65681ddd4a79730373634c991c57afa2b88a8b44b' },
  { name: 'JavaScript', v1: '0x5eb3ae89264f754793de655ade581cf9e4b885946d415d1d29d8d9e079077e7c', v2: '0x6f6e08909ef5e70e023649501721536e5e619a1008e2446f8a02830fdcc066c1' },
  { name: 'Go', v1: '0x948aa9522f9feed31a1a8bc77e7c1de88699b1e629759f5677bd6a2e3117c4e8', v2: '0x80b5b56043bba8b4b17c95eb9759415affbf9857f8a22a249b841ac16260aebc' },
  { name: 'PHP', v1: '0xfc7d0a33ab2baeb50f91109db26d4e882e627f66c0cb68b13363a8f7b09e3b68', v2: '0xff1dfa134999dc4ad19bd8a9f9ae05e286e5c9e9714bc13c4979a3c073d7b63d' },
];

// Minimal wiring per edition, taken from each README. Monitor mode first, then gate.
const SNIPPETS: Record<string, { lang: string; code: string }> = {
  python: {
    lang: 'FastAPI',
    code: `from forgemesh_pay_per_crawl import Config
from forgemesh_pay_per_crawl.asgi import PayPerCrawlMiddleware

app.add_middleware(PayPerCrawlMiddleware,
    config=Config(pay_to="0xYourWalletOnBase", mode="gate", price_usd=0.01))`,
  },
  javascript: {
    lang: 'Next.js middleware.js',
    code: `import { createPayPerCrawl } from "@forgemeshlabs/pay-per-crawl-next";

const ppc = createPayPerCrawl({ siteName: "My Site" }); // PAY_TO, PRICE_USD, MODE from env
export const middleware = ppc.middleware;
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };`,
  },
  go: {
    lang: 'net/http',
    code: `http.ListenAndServe(":8080", middleware.Handler(paypercrawl.Config{
    PayTo:    "0xYourWalletOnBase",
    PriceUSD: 0.01,
}, site))`,
  },
  php: {
    lang: 'Plain PHP',
    code: `$gate = new Gate(settings: ['mode' => 'gate', 'pay_to' => '0xYourWalletOnBase', 'price_usd' => 0.01, 'mpp_secret' => 'long-random-string'],
    cache: $cache, http: new NativeHttpClient());
$result = $gate->handle(new Request($method, $uri, $absoluteUrl, $headers, $remoteIp));
if ($result->respond) { /* send 402 and stop */ }`,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Pay-per-Crawl plugins: WordPress, Python, JavaScript, Go, PHP | ForgeMesh Labs',
  description:
    'Let AI crawlers pay for your pages. Free, open-source Pay-per-Crawl plugins for WordPress, Python, JavaScript, Go and PHP charge bots per page in USDC on Base, straight to your wallet. Humans read free. You keep 100%.',
  keywords: [
    'pay per crawl', 'charge AI crawlers', 'AI bot paywall', 'monetize AI scrapers', 'x402 middleware',
    'x402 python', 'x402 npm', 'x402 go middleware', 'x402 laravel', 'x402 drupal', 'x402 cloudflare worker',
    'x402 next.js', 'WordPress x402 plugin', 'USDC Base',
  ],
  alternates: { canonical: '/plugins' },
  openGraph: {
    title: 'Pay-per-Crawl plugins for every stack',
    description: 'Let AI crawlers pay for your pages. WordPress, Python, JavaScript, Go, PHP. USDC on Base, straight to your wallet. You keep 100%.',
    type: 'website',
    url: 'https://forgemesh.io/plugins',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Pay-per-Crawl plugins for every stack',
    description: 'Let AI crawlers pay for your pages. WordPress, Python, JavaScript, Go, PHP. You keep 100%.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      name: 'ForgeMesh Pay-per-Crawl editions',
      url: 'https://forgemesh.io/plugins',
      itemListElement: EDITIONS.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: `ForgeMesh Pay-per-Crawl for ${e.name}`,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: e.stack,
          softwareVersion: e.version,
          url: e.registry.url,
          codeRepository: e.repo,
          license: e.key === 'wordpress' ? 'https://www.gnu.org/licenses/gpl-2.0.html' : 'https://opensource.org/licenses/MIT',
          offers: [
            { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
            {
              '@type': 'Offer',
              name: 'Pro',
              url: PRO,
              priceSpecification: { '@type': 'UnitPriceSpecification', price: '4.99', priceCurrency: 'USD', billingDuration: 'P1M', unitCode: 'MON' },
            },
          ],
          publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Pay-per-Crawl?',
          acceptedAnswer: { '@type': 'Answer', text: 'A small plugin or middleware for your website that answers AI crawlers and bots with an HTTP 402 Payment Required and serves the page once they pay a few cents in USDC on Base, directly to your wallet. Humans and verified search engines keep reading free.' },
        },
        {
          '@type': 'Question',
          name: 'Does it cost anything?',
          acceptedAnswer: { '@type': 'Answer', text: 'The plugins are free and open source. Payments go straight from the crawler to your wallet; ForgeMesh takes no cut. An optional Pro plan ($4.99/month) adds a hosted dashboard, weekly digest and paywall monitoring.' },
        },
        {
          '@type': 'Question',
          name: 'Will it block my readers or Google?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. Humans and reverse-DNS-verified search engines such as Googlebot and Bingbot read free. Only AI crawlers and other bots get the 402. Start in Monitor mode to watch traffic before charging anyone.' },
        },
        {
          '@type': 'Question',
          name: 'Which platforms are supported?',
          acceptedAnswer: { '@type': 'Answer', text: 'WordPress, Python (FastAPI, Flask, Django), JavaScript (Cloudflare Workers, Next.js, Express, Fastify, Hono, Koa, nginx), Go (net/http, Caddy, Traefik) and PHP (plain PHP, Laravel, Drupal).' },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Pay-per-Crawl plugins', item: 'https://forgemesh.io/plugins' },
      ],
    },
  ],
};

const features = [
  ['You keep 100%', 'Payments settle on Base straight to the wallet you paste in. No custody, no account, no API key, no middleman cut.'],
  ['Only bots pay', 'Humans and reverse-DNS-verified search engines read free. AI crawlers and other bots get an HTTP 402 and pay per page.'],
  ['Monitor mode first', 'Watch real bot traffic and what it would have paid without charging anyone, then switch to Charge when the numbers make sense.'],
  ['Same behaviour on every stack', 'One crawler catalog (85 known agents), one 402 shape, one classifier. Pick the edition that matches your site and get the same result.'],
  ['x402 plus MPP', 'Every 402 carries an x402 v1 and v2 offer and an MPP challenge alongside it, so more agent clients can pay.'],
  ['Discovery files', 'Each edition serves /.well-known/x402.json, llms.txt and agents.txt so agents can find your terms.'],
];

const steps = [
  <>Install the edition for your stack below: a WordPress zip, or one <strong className="text-slate-200">pip</strong>, <strong className="text-slate-200">npm</strong>, <strong className="text-slate-200">go get</strong> or <strong className="text-slate-200">composer</strong> command.</>,
  <>Paste your payout wallet (a 0x address on Base) and set a price. The default is <strong className="text-slate-200">$0.01 per page</strong>.</>,
  <>Leave it in <strong className="text-slate-200">Monitor</strong> mode for a few days and see who is crawling and what they would have paid.</>,
  <>When you are ready, switch the mode to <strong className="text-slate-200">Charge</strong>. Bots pay, you get USDC, readers notice nothing.</>,
];

const btn =
  'inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white';
const btnSm =
  'inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white';
const primary =
  'inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20';

export default function PluginsPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Live on Base mainnet · Free, open source
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Pay-per-Crawl for every stack. Let AI crawlers pay for your pages.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              AI companies read your site to train and answer, and you get nothing back. Drop one of
              these plugins in front of your site and AI crawlers and bots pay{' '}
              <strong className="text-slate-200">per page</strong> with x402 USDC micropayments on Base,
              straight to your wallet. You keep 100%. There is no custody, no account and no API key.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Your readers are untouched: humans and reverse-DNS-verified search engines read free.
              WordPress, Python, JavaScript, Go and PHP, all free and open source.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#editions" className={primary}>
                Pick your stack <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="/wordpress" className={btn}>
                <Download className="h-4 w-4" aria-hidden /> WordPress plugin
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Every edition was verified with real $0.01 settlements on Base mainnet before release.{' '}
              <a href="#proof" className="text-blue-400 hover:text-blue-300">See the transactions</a>.
            </p>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">What it does</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {features.map(([t, d]) => (
                <div key={t} className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                  <dt className="font-medium text-slate-100">{t}</dt>
                  <dd className="mt-1.5 text-sm leading-6 text-slate-400">{d}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Set up in four steps</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4 text-base leading-7 text-slate-400">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 font-mono text-xs text-blue-200">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            <h2 id="editions" className="mt-14 scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-50">Pick your stack</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Same paywall, same crawler catalog, same wallet-direct settlement. Only the install step differs.
            </p>
            <ul className="mt-6 space-y-4">
              {EDITIONS.map((e) => {
                const snip = SNIPPETS[e.key];
                return (
                  <li key={e.key} id={e.key} className="scroll-mt-28 rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-medium text-slate-100">{e.name}</h3>
                      <span className="font-mono text-xs text-slate-500">
                        v{e.version} · {e.key === 'wordpress' ? 'GPLv2' : 'MIT'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{e.stack}</p>
                    <pre className="mt-3 overflow-x-auto rounded bg-black/40 px-3 py-2 font-mono text-[13px] text-blue-200">
                      {e.install}
                    </pre>
                    {snip && (
                      <details className="mt-3 group">
                        <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-200">
                          Show wiring ({snip.lang})
                        </summary>
                        <pre className="mt-2 overflow-x-auto rounded bg-black/40 px-3 py-2 font-mono text-[12px] leading-5 text-slate-300">
                          {snip.code}
                        </pre>
                      </details>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={e.registry.url}
                        className="inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
                      >
                        {e.registry.label} <ArrowRight className="h-4 w-4" aria-hidden />
                      </a>
                      <a href={e.repo} className={btnSm}>Source on GitHub</a>
                      {e.extra?.map((x) => (
                        <a key={x.url} href={x.url} className={btnSm}>{x.label}</a>
                      ))}
                    </div>
                    {e.note && <p className="mt-3 text-sm text-slate-500">{e.note}</p>}
                  </li>
                );
              })}
            </ul>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">What you see</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Every edition logs who is crawling, by name and class, what they read and what they paid.
              WordPress shows it in wp-admin; the other editions expose the same hit log to your app, and
              Pro turns it into a hosted dashboard for any edition.
            </p>
            <figure className="mt-6">
              <img
                src="/wordpress/dashboard.png"
                alt="Pay-per-Crawl Bot analytics dashboard showing bots by name and class, hits, paths, revenue and settlements"
                width={1100}
                height={2658}
                loading="lazy"
                decoding="async"
                className="w-full rounded border border-white/[0.08]"
              />
              <figcaption className="mt-2 text-sm text-slate-500">
                Bot analytics in the WordPress edition: who is crawling, what they read, what they paid.
              </figcaption>
            </figure>

            <h2 id="proof" className="mt-14 scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-50">Proof it settles</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Real $0.01 settlements on Base mainnet through the PayAI facilitator, October 2026. One per
              edition per protocol version, all paid to{' '}
              <a href={`https://basescan.org/address/${WALLET}`} className="break-all font-mono text-[13px] text-blue-400 hover:text-blue-300">{WALLET}</a>.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {PROOF.map((p) => (
                <li key={p.name} className="rounded border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="font-medium text-slate-100">{p.name}</div>
                  {[['x402 v1', p.v1], ['x402 v2', p.v2]].map(([label, tx]) => (
                    <div key={tx} className="mt-1.5">
                      <span className="mr-3 font-mono text-slate-500">{label}</span>
                      <a href={`https://basescan.org/tx/${tx}`} className="break-all font-mono text-[12px] text-blue-400 hover:text-blue-300">{tx}</a>
                    </div>
                  ))}
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Free and Pro</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Every edition is fully functional on its own. Pro adds hosted tools on top and works with
              any edition: paste the license key into the WordPress settings or set it as the Pro key
              option in Python, JavaScript, Go or PHP. Payments never pass through ForgeMesh in either
              tier, and Pro only sees what the plugin reports: daily per-bot counts and settlement
              records, with no visitor IPs or page content.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="font-medium text-slate-100">Free</h3>
                <p className="mt-1 font-mono text-sm text-slate-500">$0, open source</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
                  <li>402 paywall for AI crawlers and bots</li>
                  <li>Bot classification and hit log</li>
                  <li>Monitor and Charge modes</li>
                  <li>Discovery files (x402.json, llms.txt, agents.txt)</li>
                  <li>Payments straight to your wallet</li>
                </ul>
              </div>
              <div className="rounded border border-blue-500/40 bg-blue-500/[0.06] p-5">
                <h3 className="font-medium text-slate-100">Pro</h3>
                <p className="mt-1 font-mono text-sm text-blue-300/80">$4.99/month, up to 5 sites, any edition</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
                  <li>Hosted dashboard for all sites, 13 months of history</li>
                  <li>Monday email digest: bot hits, paid fetches, revenue, and what monitor-mode sites would have earned</li>
                  <li>Daily paywall monitoring as an AI-crawler user agent, with alerts when a 402 stops answering, the wallet in the challenge changes, or the manifest disappears</li>
                  <li>Crawler-intelligence feed pulled daily: new bot names, classes and impostor rules</li>
                  <li>Listing in the paid-sites directory plus a live SVG badge</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={PRO} className={primary}>
                Start Pro $4.99/mo <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="https://proxy.forgemesh.io/wp/sites" className={btn}>Paid-sites directory</a>
            </div>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Security notes</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Two hardening fixes shipped across all editions on 17 October 2026 and are in every version
              listed above: trusted <span className="font-mono text-slate-300">X-Forwarded-For</span> now uses
              the right-most hop, so a client cannot prepend a search-engine IP to read free, and path
              exemptions are anchored to exact files or slash-delimited prefixes, so a crafted path cannot
              match an allow rule. Report issues to{' '}
              <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#editions" className={primary}>
                Pick your stack <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href={WP_ZIP} className={btn}>
                <Download className="h-4 w-4" aria-hidden /> WordPress zip v{WP_VERSION}
              </a>
              <a href="/verified" className={btn}>x402 Verified index</a>
            </div>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
