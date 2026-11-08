// How to claim an unclaimed index row. Written for both an operator reading in a browser and
// an agent that landed here from the feed or the 402 body: one POST, one fee, two ways to prove
// ownership, nothing else. The route itself lives on router.forgemesh.io.
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { loadUnclaimed, loadVerified } from '@/lib/verified-data';
import { isSlug } from '@/lib/verified';

export const dynamic = 'force-dynamic';

type PageProps = { searchParams: Promise<{ slug?: string; src?: string }> };

// Per-slug titles turn the Google-indexed per-origin claim pages into vanity-search
// magnets: an owner searching their own domain finds "<host> — unclaimed x402 listing"
// instead of a generic page title. That search is how most owners will ever learn the
// row exists (the only other channels are their access log and our index page).
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const slug = params?.slug && isSlug(params.slug) ? params.slug : null;
  const row = slug ? loadUnclaimed().rows.find((r) => r.slug === slug) || null : null;
  const base = { metadataBase: new URL('https://forgemesh.io') };
  if (!row) {
    return {
      ...base,
      title: 'Claim Your x402 Verified Row — $5, One Call, No Account',
      description:
        'Your x402 service is already listed and scored in the index agents browse for paid APIs — with no contact, so buyers cannot reach you. $5 once: your contact, best routes, seller page, README badge, re-probes. Free PR path unchanged.',
      alternates: { canonical: '/verified/claim' },
    };
  }
  const host = String(row.origin || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  return {
    ...base,
    title: `${host} — unclaimed x402 listing, scored ${row.score}/85`,
    description: `${host} is listed in the x402 Verified index with ${row.routes_indexed} route${row.routes_indexed === 1 ? '' : 's'} and no owner contact. If it is yours, claim it for $5: contact, your best routes, seller page, README badge, re-probes on demand.`,
    alternates: { canonical: `/verified/claim?slug=${encodeURIComponent(row.slug)}` },
  };
}

// Every arrival on the claim guide is appended to data/claim-hits.jsonl (no IP, no cookie):
// src=probe means the visitor followed the link printed in the crawl's User-Agent, i.e. an
// operator who read their own access log. scripts/claim-funnel.js reads this for #fm-brief.
const HITS = path.join(process.cwd(), 'data', 'claim-hits.jsonl');

// Demand proof, from our own arrival log: how often this slug's claim page was opened in
// the last 30 days (people and agents, link-preview fetchers excluded). Cached 10 minutes
// so the force-dynamic page doesn't re-read a multi-MB JSONL on every request.
let hitCache: { at: number; total: number; bySlug: Map<string, number> } | null = null;
function opens30(slug: string | null): { total: number; forSlug: number } {
  const now = Date.now();
  if (!hitCache || now - hitCache.at > 10 * 60_000) {
    const bySlug = new Map<string, number>();
    let total = 0;
    try {
      const cut = new Date(now - 30 * 86_400_000).toISOString();
      for (const line of fs.readFileSync(HITS, 'utf8').split('\n')) {
        if (!line) continue;
        try {
          const h = JSON.parse(line);
          if ((h.ts || '') < cut) continue;
          if (/TelegramBot|TwitterBot|Slackbot|Discordbot|facebookexternalhit|WhatsApp|LinkedInBot|Iframely/i.test(h.ua || '')) continue;
          total += 1;
          if (h.slug) bySlug.set(h.slug, (bySlug.get(h.slug) || 0) + 1);
        } catch { /* skip bad line */ }
      }
    } catch { /* no log yet */ }
    hitCache = { at: now, total, bySlug };
  }
  return { total: hitCache.total, forSlug: slug ? hitCache.bySlug.get(slug) || 0 : 0 };
}

function logHit(entry: Record<string, unknown>) {
  try {
    fs.appendFileSync(HITS, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n');
  } catch {
    /* logging never blocks the page */
  }
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const feed = loadUnclaimed();
  const slug = params?.slug && isSlug(params.slug) ? params.slug : null;
  const h = await headers();
  logHit({
    src: typeof params?.src === 'string' ? params.src.slice(0, 32) : null,
    slug,
    ref: h.get('referer') || null,
    ua: (h.get('user-agent') || '').slice(0, 200),
  });
  const row = slug ? feed.rows.find((r) => r.slug === slug) || null : null;
  // A slug arrived but no row carries it: the origin dropped out of the index, or was never in it.
  const missing = !!(slug && !row);
  const demand = opens30(slug);
  const exampleSlug = row?.slug || 'your-host-com';
  const hostGuess = slug ? slug.replace(/-/g, '.') : '';
  const price = feed.claim.price_usdc;
  const liveSellers = loadVerified().sellers.filter((seller) => seller.status !== 'delisted');
  const exampleSeller = liveSellers[0];
  const unclaimedCount = feed.rows.length;

  const body = JSON.stringify({ slug: exampleSlug, contact: 'mailto:you@example.com' }, null, 2);

  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-10 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">x402 Verified · claim</span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              {row ? <>Claim <span className="text-blue-300">{row.name}</span></> : missing ? 'No row with that slug' : 'Make your x402 listing yours'}
            </h1>
            {missing ? (
              <p className="mt-6 rounded border border-amber-500/30 bg-amber-500/[0.06] p-4 text-sm leading-7 text-slate-300">
                Nothing in the unclaimed index is called <span className="font-mono text-slate-100">{slug}</span> right now.
                Either the origin stopped answering a valid 402 on the last weekly crawl, or it was never in the Bazaar.{' '}
                <a href={`/verified?q=${encodeURIComponent(hostGuess)}#unclaimed`} className="text-blue-400 hover:text-blue-300">Search the index for {hostGuess}</a>, or use one of the two ways in below.
              </p>
            ) : null}
            <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
              {row
                ? <>This origin is already listed and scored <strong className="text-slate-200">{row.score}/85</strong> in the index agents browse for paid x402 APIs — with {row.routes_indexed} crawler-picked route{row.routes_indexed === 1 ? '' : 's'}, <strong className="text-slate-200">no contact, and no badge</strong>. Anyone who finds it has no way to reach you. Claiming turns it into a seller page you control.</>
                : <>If your x402 service answers 402s and the Bazaar lists it, it is almost certainly one of the <a href="/verified#unclaimed" className="text-blue-400 hover:text-blue-300">{unclaimedCount.toLocaleString()} origins in the unclaimed index</a> — already scored, but with <strong className="text-slate-200">no contact and no badge</strong>, so buyers who find it cannot reach you. Claiming turns that row into a seller page you control.</>}
            </p>
            {row && demand.forSlug >= 5 ? (
              <p className="mt-4 rounded border border-blue-500/25 bg-blue-500/[0.06] p-4 text-sm leading-7 text-slate-200">
                This listing was opened <strong className="text-blue-300">{demand.forSlug.toLocaleString()} times in the last 30 days</strong> — by people and agents browsing the index. None of them could contact you.
              </p>
            ) : !row && demand.total >= 100 ? (
              <p className="mt-4 rounded border border-blue-500/25 bg-blue-500/[0.06] p-4 text-sm leading-7 text-slate-200">
                Listings in this index were opened <strong className="text-blue-300">{demand.total.toLocaleString()} times in the last 30 days</strong> — by people and agents who cannot contact an unclaimed seller.
              </p>
            ) : null}
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Five dollars, once, and minutes after payment: your contact is live, your five best routes replace the crawler&rsquo;s pick, you get a public seller page, the README badge, and re-probes on demand. Your score comes from the checks, never from the fee.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href={`https://kit.forgemesh.io/claim${row ? `?slug=${encodeURIComponent(row.slug)}` : ''}`} data-umami-event="verified-claim-card-click" data-umami-event-placement="hero" className="inline-flex items-center justify-center rounded bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400">
                Claim your listing by card · ${price} →
              </a>
              {exampleSeller ? <a href={`/verified/${encodeURIComponent(exampleSeller.slug)}`} data-umami-event="verified-claim-example-click" className="text-sm text-blue-300 hover:text-blue-200">See what {liveSellers.length > 1 ? `the ${liveSellers.length} claimed sellers get` : 'a claimed seller page looks like'} →</a> : null}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              One-time fee. After payment, publish a token to prove you control the service; a maintainer reviews the claim. Find your listing in the <a href="/verified#unclaimed" className="text-blue-400 hover:text-blue-300">unclaimed index</a> first if you don’t have its slug. You can also <a href={feed.free_path} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">list for free by pull request</a>.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">What a claim adds</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                <li>Your contact and your choice of up to five routes on the seller page, instead of the three the crawl picked.</li>
                <li>The README badge at <span className="font-mono text-slate-200">/badge/x402/{exampleSlug}</span> and a shields.io endpoint.</li>
                <li>The weekly reprobe plus re-probe on demand, and a row in the machine feed buyers filter on.</li>
                <li>No proof transaction needed to claim — you keep your full crawl score up to 85 immediately. The last 15 proof points stay free: add a proof transaction by pull request whenever you like to push toward 100 and the gold star.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">The call</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Any x402 client works. The first request answers 402 with the price and the fee wallet; pay and resend.
                Optional fields: <span className="font-mono">name</span>, <span className="font-mono">description</span>,{' '}
                <span className="font-mono">homepage</span>, <span className="font-mono">endpoints</span> (same origin),{' '}
                <span className="font-mono">nominated_endpoint</span>, <span className="font-mono">manifest</span>, <span className="font-mono">llms_txt</span>.
              </p>
              <pre className="mt-3 overflow-x-auto rounded border border-white/[0.08] bg-black/30 p-4 font-mono text-xs leading-6 text-slate-300">
{`POST ${feed.claim.url}
Content-Type: application/json

${body}`}
              </pre>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Schema and examples: <a href={feed.claim.docs} className="font-mono text-blue-400 hover:text-blue-300">{feed.claim.docs}</a>.
                Slugs: <a href="/unclaimed.json" className="font-mono text-blue-400 hover:text-blue-300">/unclaimed.json</a>.
              </p>
            </div>

            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Proving it is yours</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-300">
                <li>
                  <strong className="text-slate-100">Pay from the row&rsquo;s payTo wallet.</strong> The fee authorization is signed by the wallet that receives your sales, so ownership is settled on the spot. Status <span className="font-mono">queued</span>; the validator opens and merges the pull request within minutes.
                </li>
                <li>
                  <strong className="text-slate-100">Or publish a token.</strong> Paid from any other wallet, the response carries a <span className="font-mono">token</span>. Put that string anywhere in your <span className="font-mono">/.well-known/x402</span>, your <span className="font-mono">llms.txt</span>, or the README (or a <span className="font-mono">.forgemesh-claim</span> file) of the GitHub repo your manifest declares in a <span className="font-mono">repository</span> field, whose README also names your host. The intake checks every five minutes for seven days, then proceeds. Status <span className="font-mono">pending-proof</span> until then.
                </li>
                <li>
                  <strong className="text-slate-100">No wallet? Pay by card.</strong> A human can pay the same $5 at{' '}
                  <a href={`https://kit.forgemesh.io/claim${row ? `?slug=${encodeURIComponent(row.slug)}` : ''}`} data-umami-event="verified-claim-card-click" data-umami-event-placement="instructions" className="text-blue-400 hover:text-blue-300">kit.forgemesh.io/claim</a>{' '}
                  and gets the same token to publish. Card claims are merged by a maintainer once Stripe confirms the payment — usually the same day.
                </li>
              </ol>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Either way, poll the returned <span className="font-mono">status_url</span>. It is free. When it reads <span className="font-mono">created</span>, the pull request exists; when the check is green it merges itself and your page is live at <span className="font-mono">/verified/{exampleSlug}</span>.
              </p>
            </div>

            <div id="not-listed" className="rounded border border-blue-500/25 bg-blue-500/[0.06] p-5 scroll-mt-24">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Not listed? Two ways in</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                The index only holds origins the CDP Bazaar lists. If your service is not in the Bazaar, or it is there but not in the index yet, you do not claim a row, you create one. Both paths give the same seller record, page, badge and feed entry; both are checked by the same validator.
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-300">
                <li>
                  <strong className="text-slate-100">Free: open a pull request.</strong> One JSON file in{' '}
                  <a href={feed.free_path} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">forgemeshlabs/x402-verified</a>{' '}
                  with your routes, payTo and a proof transaction. CI probes you and merges on green. Humans and agents alike.
                </li>
                <li>
                  <strong className="text-slate-100">$0.05: let an agent submit for you.</strong>{' '}
                  <span className="font-mono text-slate-200">POST https://router.forgemesh.io/api/verified/submit</span> with the same fields, paid through x402 or MPP. The intake opens the pull request and it merges itself when the check passes. Schema in the{' '}
                  <a href="https://router.forgemesh.io/openapi.json" className="text-blue-400 hover:text-blue-300">router OpenAPI</a>.
                </li>
              </ol>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Before either: run your 402 through the <a href="/scan" className="text-blue-400 hover:text-blue-300">free scanner</a>. A submission that fails validation gets its reasons at the status URL, but the fee is not refunded.
              </p>
            </div>

            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Rules</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-400">
                <li>The score is never for sale. It is recomputed from protocol facts on every probe, claimed or not.</li>
                <li>Endpoints and homepage must sit on the claimed origin. The payTo is the one the Bazaar recorded.</li>
                <li>A claim that fails validation gets its reasons at the status URL and three automatic retries. Nothing is refunded for a failed validation, so probe your own 402 first with the <a href="/scan" className="text-blue-400 hover:text-blue-300">free scanner</a>.</li>
                <li>Not in the index yet? See <a href="#not-listed" className="text-blue-400 hover:text-blue-300">the two ways in</a> above: the free pull request, or the $0.05 submit route.</li>
              </ul>
            </div>

            <p className="text-sm text-slate-500">
              <a href="/verified#unclaimed" className="text-blue-400/80 hover:text-blue-300">← Back to the unclaimed index</a>
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
