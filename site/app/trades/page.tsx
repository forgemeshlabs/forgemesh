// Congress Trades — retail-facing tracker of US House stock trades from
// STOCK Act periodic transaction reports. Data lives in
// public/congress-trades.json (written by scripts/congress-trades.js daily
// after the stuffer's gov-refresh); rendered server-side per request so it
// updates without a rebuild and search engines index the trades.
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import {
  AlertSignup,
  TradesTable,
  type CongressTradesData,
} from '@/components/CongressTrades';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Congress Stock Trades Tracker — Live STOCK Act Filings, Free | ForgeMesh',
  description:
    'Track every stock trade disclosed by members of the US House — parsed daily from official STOCK Act periodic transaction reports. See what Pelosi and 128 other members are buying and selling, free. No login, updated every day.',
  keywords: [
    'congress stock trades', 'congressional stock trades tracker', 'pelosi stock trades',
    'STOCK Act filings', 'politician stock tracker', 'house stock trades',
    'congress trading disclosures', 'senator stock trades', 'periodic transaction reports',
  ],
  alternates: { canonical: '/trades' },
  openGraph: {
    title: 'Congress Stock Trades Tracker — Live STOCK Act Filings',
    description:
      'Every disclosed US House stock trade, parsed daily from official filings. See what 129 members of Congress are buying and selling — free.',
    type: 'website',
    url: 'https://forgemesh.io/trades',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Congress Stock Trades Tracker — Live STOCK Act Filings',
    description:
      'Every disclosed US House stock trade, parsed daily from official filings. Free, no login.',
  },
};

function loadData(): CongressTradesData | null {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public', 'congress-trades.json'), 'utf8'),
    );
  } catch {
    return null;
  }
}

function fmtUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

const faq = [
  {
    q: 'Where does this data come from?',
    a: 'Directly from official periodic transaction reports (PTRs) that members of the US House file under the STOCK Act. We parse the electronic filings from the House Clerk every day — no third-party data vendor in between, and every row links to the original PDF filing.',
  },
  {
    q: 'Why do members of Congress have to disclose their trades?',
    a: 'The STOCK Act (2012) requires members of Congress to report securities transactions over $1,000 within 45 days. The disclosures are public records — this page just makes them readable, searchable, and tracked in one place.',
  },
  {
    q: 'Why are amounts shown as ranges?',
    a: 'Filings only require a dollar range (like $1,001–$15,000), not exact amounts. We show exactly what was disclosed. Estimated volumes for member rankings use the midpoint of each range.',
  },
  {
    q: 'Is Senate data included?',
    a: 'Not yet — coverage today is the US House (electronic filings; paper filings are listed separately as unparsed). Senate coverage is planned.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. This is public disclosure data presented for transparency and research. Members file up to 45 days after trading, so disclosures always lag the trades themselves.',
  },
];

export default function Page() {
  const data = loadData();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        name: 'US House Congressional Stock Trades',
        description:
          'Stock trades disclosed by members of the US House of Representatives under the STOCK Act, parsed daily from official periodic transaction reports.',
        url: 'https://forgemesh.io/trades',
        isAccessibleForFree: true,
        creator: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
        distribution: {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: 'https://forgemesh.io/congress-trades.json',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-12 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(59,130,246,0.12),transparent_30%)]" />
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                Congress Trades
                {data?.stats.latestFilingDate ? (
                  <> &middot; latest filing {data.stats.latestFilingDate}</>
                ) : null}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              What Congress is trading
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Every stock trade disclosed by members of the US House, parsed daily from official
              STOCK Act filings. No paywall, no login — every row links back to the original filing
              PDF. The same feed the paid trackers charge $15–60/month for.
            </p>
            {data ? (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                <span>{data.stats.totalTrades.toLocaleString('en-US')} trades tracked</span>
                <span>{data.stats.members} members</span>
                <span>{data.stats.trades30d} filed in the last 30 days</span>
                <span className="text-emerald-300/80">{data.stats.buys30d} buys</span>
                <span className="text-rose-300/80">{data.stats.sells30d} sells</span>
              </div>
            ) : null}
          </div>
        </section>

        {data ? (
          <>
            <section className="border-t border-white/[0.06] px-6 py-14">
              <div className="mx-auto max-w-5xl">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Biggest disclosures &middot; last 60 days
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.biggest.slice(0, 6).map((t, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-slate-100">{t.member}</span>
                        <span className="font-mono text-[11px] text-slate-500">{t.stateDistrict}</span>
                      </div>
                      <div className="mt-2 text-sm text-slate-400">
                        {t.ticker ? <span className="font-mono text-blue-300">{t.ticker}</span> : null}{' '}
                        <span className="line-clamp-1">{t.asset}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={
                            t.type === 'purchase'
                              ? 'font-mono text-[12px] font-medium text-emerald-300'
                              : 'font-mono text-[12px] font-medium text-rose-300'
                          }
                        >
                          {t.type === 'purchase' ? 'BUY' : 'SELL'} {t.amountRange}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">filed {t.filingDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="border-t border-white/[0.06] px-6 py-14">
              <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Most active members &middot; 90 days
                  </h2>
                  <ul className="mt-5 divide-y divide-white/[0.04] rounded-xl border border-white/[0.06]">
                    {data.topMembers.slice(0, 8).map((m) => (
                      <li key={m.member} className="flex items-center justify-between px-4 py-3">
                        <span>
                          <span className="text-slate-100">{m.member}</span>
                          <span className="ml-2 font-mono text-[11px] text-slate-500">{m.stateDistrict}</span>
                        </span>
                        <span className="font-mono text-[12px] text-slate-400">
                          {m.trades} trades &middot; ~{fmtUsd(m.estVolume)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Hottest tickers &middot; 30 days
                  </h2>
                  <ul className="mt-5 divide-y divide-white/[0.04] rounded-xl border border-white/[0.06]">
                    {data.topTickers.slice(0, 8).map((t) => (
                      <li key={t.ticker} className="flex items-center justify-between px-4 py-3">
                        <span className="font-mono text-blue-300">{t.ticker}</span>
                        <span className="font-mono text-[12px] text-slate-400">
                          <span className="text-emerald-300/80">{t.buys} buys</span>
                          {' / '}
                          <span className="text-rose-300/80">{t.sells} sells</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="border-t border-white/[0.06] px-6 py-14">
              <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 sm:p-8">
                  <h2 className="text-xl font-semibold text-slate-50">
                    Get notable filings in your inbox
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">
                    Free alerts when a big trade drops — large disclosures, unusual clusters, and
                    what the most-watched members just filed. No spam, unsubscribe anytime.
                  </p>
                  <div className="mt-5">
                    <AlertSignup />
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-white/[0.06] px-6 py-14">
              <div className="mx-auto max-w-5xl">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Latest filings
                </h2>
                <div className="mt-6">
                  <TradesTable trades={data.latest} />
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="border-t border-white/[0.06] px-6 py-14">
            <div className="mx-auto max-w-5xl text-slate-400">
              Trade data is refreshing — check back in a few minutes.
            </div>
          </section>
        )}

        <section className="border-t border-white/[0.06] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">FAQ</h2>
            <dl className="mt-6 space-y-8">
              {faq.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-slate-100">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-7 text-slate-400">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-12">
          <div className="mx-auto max-w-4xl text-sm leading-7 text-slate-400">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              For developers
            </p>
            <p className="mt-3">
              Want this data in your agent or app? The raw feed is at{' '}
              <a href="/congress-trades.json" className="font-mono text-blue-400/80 hover:text-blue-300">
                /congress-trades.json
              </a>{' '}
              (latest 300 trades), and the full dataset — all {`10,000+`} trades plus campaign
              finance, lobbying, and federal contracts — is available per-call through the{' '}
              <a href="/gov-transparency" className="text-blue-400/80 hover:text-blue-300">
                Gov-Transparency API pack
              </a>
              . Not financial advice; disclosures lag trades by up to 45 days.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
