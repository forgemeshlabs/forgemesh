import type { Metadata } from 'next';
import { ArrowRight, Download } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { EDITIONS, WP_VERSION, WP_ZIP } from '@/lib/pay-per-crawl-editions';

const ZIP = WP_ZIP;
const REPO = 'https://github.com/forgemeshlabs/forgemesh-pay-per-crawl';
const RELEASES = 'https://github.com/forgemeshlabs/forgemesh-pay-per-crawl/releases';
const PRO = 'https://proxy.forgemesh.io/wp';
const TX_V1 = '0xe764d2affaca73fa225aecd383aff5969b5d9ff4e8035933b7561983f23ba7f5';
const TX_V2 = '0xc9755334a10b2370b2925492490fb8a3c17dbaf2f6e8661f647bb1f13cb781c2';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Pay-per-Crawl for WordPress | ForgeMesh Labs',
  description:
    'A free GPL WordPress plugin. Bot ledger plus an HTTP 402 price tag: see every AI, SEO and script crawler, keep search engines free, charge x402-capable agents in USDC on Base. Humans read free. Bot analytics in wp-admin.',
  keywords: [
    'pay per crawl WordPress', 'charge AI crawlers', 'WordPress x402 plugin', 'AI bot paywall',
    'AI crawler ledger', 'x402 USDC Base', 'llms.txt WordPress', 'bot analytics WordPress',
  ],
  alternates: { canonical: '/wordpress' },
  openGraph: {
    title: 'Pay-per-Crawl for WordPress',
    description:
      'Know who crawls your site. Charge the ones that can pay, in USDC on Base. You keep 100%. Free GPL plugin.',
    type: 'website',
    url: 'https://forgemesh.io/wordpress',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Pay-per-Crawl for WordPress',
    description: 'Know who crawls your site. Charge the ones that can pay. Free GPL plugin.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'ForgeMesh Pay-per-Crawl',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'WordPress',
      url: 'https://forgemesh.io/wordpress',
      downloadUrl: ZIP,
      license: 'https://www.gnu.org/licenses/gpl-2.0.html',
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', description: 'Plugin plus free hosted account: dashboard, crawler-intel feed, directory listing' },
        {
          '@type': 'Offer',
          name: 'Pro',
          url: 'https://proxy.forgemesh.io/wp',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '4.99',
            priceCurrency: 'USD',
            billingDuration: 'P1M',
            unitCode: 'MON',
          },
        },
      ],
      softwareVersion: WP_VERSION,
      description:
        'WordPress bot ledger with an HTTP 402 price tag: see every AI, SEO and script crawler, keep verified search engines free, and charge x402-capable agents in USDC on Base, paid directly to the site owner wallet.',
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Pay-per-Crawl for WordPress', item: 'https://forgemesh.io/wordpress' },
      ],
    },
  ],
};

const features = [
  ['You keep 100%', 'Payments settle on Base straight to the wallet you paste in. No custody, no account, no API key, no middleman cut.'],
  ['Only bots are priced', 'Humans and reverse-DNS-verified search engines read free. AI crawlers, SEO crawlers and scripts get an HTTP 402. x402-capable agents can pay it; the big AI labs\' crawlers do not yet.'],
  ['x402 plus MPP', 'The 402 challenge carries an x402 offer, with an MPP challenge alongside it, so more agent clients can pay.'],
  ['Bot analytics in wp-admin', 'Who is crawling, by name and class: hits, sources, paths, revenue, and settlements with transaction links.'],
  ['Monitor mode first', 'Watch real bot traffic without charging anyone, then switch to Charge when the numbers make sense.'],
  ['Discovery files', 'Serves /.well-known/x402.json, llms.txt and agents.txt so agents can find your terms.'],
];

const steps = [
  <>Download the zip below, then in wp-admin go to <strong className="text-slate-200">Plugins → Add New → Upload Plugin</strong> and activate it.</>,
  <>Open the plugin <strong className="text-slate-200">Settings</strong>. Paste your payout wallet (a 0x address on Base; no wallet yet? <a href="/wallet" className="text-blue-400 hover:text-blue-300">15-minute setup guide</a>) and set a price. The default is $0.01 per page.</>,
  <>Leave it in <strong className="text-slate-200">Monitor</strong> mode and watch <strong className="text-slate-200">Bot analytics</strong> to see who is crawling.</>,
  <>When you are ready, switch the mode to <strong className="text-slate-200">Charge</strong>.</>,
];

const btn =
  'inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white';

export default function WordPressPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Live on Base mainnet · Free GPL plugin
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Pay-per-Crawl for WordPress. Know who crawls your site. Charge the ones that can pay.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Pay-per-Crawl shows you every AI crawler, SEO crawler and script that fetches your pages, verifies the real search engines by reverse DNS so SEO is untouched, and lets you answer everything else with a standard HTTP 402 price in USDC on Base, paid to your own wallet.
              Be clear about what pays today: x402-capable agents do; the big AI labs&apos; crawlers (GPTBot, ClaudeBot, PerplexityBot and friends) do not yet pay anyone per page, and they simply get no content from a charging site. Until they do, this is an honest bot ledger with the price already on the door. You see who takes what, you can block or charge any of it, and when a crawler does pay, it goes straight to you. Nobody in between holds the money.
              You keep 100%. There is no custody, no account and no API key.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Your readers are untouched: humans and reverse-DNS-verified search engines read free.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={ZIP}
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                <Download className="h-4 w-4" aria-hidden /> Download plugin (free, v{WP_VERSION})
              </a>
              <a href={REPO} className={btn}>
                Source on GitHub <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              GPLv2 or later. All versions on the{' '}
              <a href={RELEASES} className="text-blue-400 hover:text-blue-300">releases page</a>.
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

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Install in four steps</h2>
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

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">What you see in wp-admin</h2>
            <figure className="mt-6">
              <img
                src="/wordpress/dashboard.png"
                alt="Pay-per-Crawl Bot analytics dashboard in wp-admin showing bot hits per day, who is crawling, paid fetches and revenue"
                width={1120}
                height={900}
                loading="lazy"
                decoding="async"
                className="w-full rounded border border-white/[0.08]"
              />
              <figcaption className="mt-2 text-sm text-slate-500">
                Bot analytics: who is crawling, what they read, what they paid.
              </figcaption>
            </figure>
            <figure className="mt-8">
              <img
                src="/wordpress/bot-directory.png"
                alt="Pay-per-Crawl bot directory: every known crawler grouped by purpose, searchable, with who runs it, its robots.txt token, how it is verified and what this site does with it"
                width={1120}
                height={900}
                loading="lazy"
                decoding="async"
                className="w-full rounded border border-white/[0.08]"
              />
              <figcaption className="mt-2 text-sm text-slate-500">
                Bot directory: every crawler explained for humans, grouped by what it is for, searchable, and it grows as new bots appear. Version 0.2.4.
              </figcaption>
            </figure>
            <figure className="mt-8">
              <img
                src="/wordpress/pricing-rules.png"
                alt="Pay-per-Crawl pricing rules editor: charge, free or block by post type, category, path, bot name, bot purpose or bot class, each with its own price"
                width={1120}
                height={760}
                loading="lazy"
                decoding="async"
                className="w-full rounded border border-white/[0.08]"
              />
              <figcaption className="mt-2 text-sm text-slate-500">
                Pricing rules (Pro): different prices for different parts of your site and different bots. First match wins. Version 0.2.4.
              </figcaption>
            </figure>
            <figure className="mt-8">
              <img
                src="/wordpress/audit.png"
                alt="Pay-per-Crawl AI Crawler Audit page: summary of requests, operators, bandwidth and value, with the one-time unlock for the full report"
                width={1120}
                height={900}
                loading="lazy"
                decoding="async"
                className="w-full rounded border border-white/[0.08]"
              />
              <figcaption className="mt-2 text-sm text-slate-500">
                AI Crawler Audit: who is taking your pages and what it is worth. Free summary; the full report is a one-time $19 unlock, verified offline. Version 0.2.4.
              </figcaption>
            </figure>
            <figure className="mt-8">
              <img
                src="/wordpress/settings.png"
                alt="Pay-per-Crawl settings page with payout wallet, price per page and mode selector"
                width={1100}
                height={1790}
                loading="lazy"
                decoding="async"
                className="w-full rounded border border-white/[0.08]"
              />
              <figcaption className="mt-2 text-sm text-slate-500">
                Settings: payout wallet, price per page, Monitor or Charge mode.
              </figcaption>
            </figure>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Proof it settles</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Real settlements on Base mainnet through the PayAI facilitator, October 2026, one for each
              protocol version:
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {[['x402 v1', TX_V1], ['x402 v2', TX_V2]].map(([label, tx]) => (
                <li key={tx} className="rounded border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <span className="mr-3 font-mono text-slate-500">{label}</span>
                  <a
                    href={`https://basescan.org/tx/${tx}`}
                    className="break-all font-mono text-[13px] text-blue-400 hover:text-blue-300"
                  >
                    {tx}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Free plugin, free hosted account, Pro</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The plugin is fully functional on its own. A free hosted account adds the parts that
              need a server we run. Pro adds pricing control and a revenue report on the same key.
              Payments never pass through ForgeMesh in any tier, and the hosted side only sees what
              the plugin reports: daily per-bot counts and settlement records, with no visitor IPs or
              page content.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="font-medium text-slate-100">Plugin</h3>
                <p className="mt-1 font-mono text-sm text-slate-500">$0, GPL, no account</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
                  <li>Bot ledger plus a 402 price tag for crawlers and scripts</li>
                  <li>Bot analytics and bot directory in wp-admin</li>
                  <li>Monitor and Charge modes</li>
                  <li>Discovery files (x402.json, llms.txt, agents.txt)</li>
                  <li>Any payment goes straight to your wallet</li>
                </ul>
              </div>
              <div className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="font-medium text-slate-100">Hosted account</h3>
                <p className="mt-1 font-mono text-sm text-slate-500">$0, email for a key, up to 5 sites</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
                  <li>Hosted dashboard for all sites, 13 months of history</li>
                  <li>Crawler-intelligence feed pulled daily into the plugin: new bot names, classes and impostor rules</li>
                  <li>Listing in the paid-sites directory plus a live SVG badge</li>
                </ul>
              </div>
              <div className="rounded border border-blue-500/40 bg-blue-500/[0.06] p-5">
                <h3 className="font-medium text-slate-100">Pro</h3>
                <p className="mt-1 font-mono text-sm text-blue-300/80">$4.99/month, same key</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
                  <li>Pricing rules: charge, free or block by post type, category, tag, path, bot name, purpose or class, each with its own price</li>
                  <li>Revenue report: this month, last month, all time, per site, plus a settlements CSV with a Base transaction hash on every row</li>
                  <li>Daily paywall monitoring as an AI-crawler user agent, with alerts when a 402 stops answering, the wallet changes, or the manifest disappears</li>
                  <li>Monday email digest</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              The free key is emailed, never shown on a page. Pro is a Stripe subscription that
              upgrades the same key; cancel from the dashboard and the key drops back to the free
              account. Paste the key in <strong className="text-slate-300">Pay-per-Crawl → Settings → Hosted account</strong>.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={PRO}
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Free key or Pro $4.99/mo <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="https://proxy.forgemesh.io/wp/sites" className={btn}>Paid-sites directory</a>
            </div>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Not on WordPress?</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The same paywall ships for other stacks, with the same crawler catalog, 402 shape and
              wallet-direct settlement. Full list on the{' '}
              <a href="/plugins" className="text-blue-400 hover:text-blue-300">plugins page</a>.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {EDITIONS.filter((e) => e.key !== 'wordpress').map((e) => (
                <li key={e.key} className="rounded border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-slate-100">{e.name}</span>
                    <span className="font-mono text-xs text-slate-500">v{e.version}</span>
                  </div>
                  <p className="mt-1 text-slate-400">{e.stack}</p>
                  <p className="mt-2 flex flex-wrap gap-x-3">
                    <a href={e.registry.url} className="text-blue-400 hover:text-blue-300">{e.registry.label}</a>
                    <a href={e.repo} className="text-blue-400 hover:text-blue-300">GitHub</a>
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={ZIP}
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                <Download className="h-4 w-4" aria-hidden /> Download plugin
              </a>
              <a href="/verified" className={btn}>x402 Verified index</a>
              <a href="mailto:hello@forgemesh.io" className={btn}>hello@forgemesh.io</a>
            </div>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
