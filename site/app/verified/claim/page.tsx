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
import { loadUnclaimed } from '@/lib/verified-data';
import { isSlug } from '@/lib/verified';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Claim Your x402 Verified Row — $5, One Call, No Account',
  description:
    'Your x402 service is already in the ForgeMesh unclaimed index. Claim the row with one paid x402 call: contact, routes, README badge and re-probe on demand. Listing by pull request stays free.',
  alternates: { canonical: '/verified/claim' },
};

type PageProps = { searchParams: Promise<{ slug?: string; src?: string }> };

// Every arrival on the claim guide is appended to data/claim-hits.jsonl (no IP, no cookie):
// src=probe means the visitor followed the link printed in the crawl's User-Agent, i.e. an
// operator who read their own access log. scripts/claim-funnel.js reads this for #fm-brief.
const HITS = path.join(process.cwd(), 'data', 'claim-hits.jsonl');
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
  const exampleSlug = row?.slug || 'your-host-com';
  const price = feed.claim.price_usdc;

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
              {row ? <>Claim <span className="text-blue-300">{row.name}</span></> : 'Claim your row'}
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
              {row
                ? <>This origin is in the unclaimed index at <strong className="text-slate-200">{row.score}/85</strong> with {row.routes_indexed} route{row.routes_indexed === 1 ? '' : 's'} indexed from the Bazaar. Nobody submitted it. Claiming turns it into a seller record you control.</>
                : <>If your x402 service answers 402s and the Bazaar lists it, it is probably already in the <a href="/verified#unclaimed" className="text-blue-400 hover:text-blue-300">unclaimed index</a>, scored, with no contact and no badge. Claiming turns that row into a seller record you control.</>}
            </p>
            {row ? (
              <p className="mt-5">
                <a href={`https://kit.forgemesh.io/claim?slug=${encodeURIComponent(row.slug)}`} className="inline-flex items-center justify-center rounded border border-white/[0.1] px-4 py-2.5 text-sm text-slate-300 transition-all hover:border-white/[0.2] hover:text-slate-100">
                  Human with a card? Claim for ${price} at checkout →
                </a>
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-7 text-slate-500">
              One POST, ${price} USDC on Base through x402 or MPP, no account, no form. Listing by pull request stays{' '}
              <a href={feed.free_path} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">free</a>; the claim buys speed and the skip of the proof-tx requirement, not points.
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
                <li>No proof transaction needed. The 15 proof points stay unearned until you add one by pull request, so a claimed row tops out at 85 until then.</li>
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
                  <a href={`https://kit.forgemesh.io/claim${row ? `?slug=${encodeURIComponent(row.slug)}` : ''}`} className="text-blue-400 hover:text-blue-300">kit.forgemesh.io/claim</a>{' '}
                  and gets the same token to publish. Card claims are merged by a maintainer after the payment is confirmed, so allow a day.
                </li>
              </ol>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Either way, poll the returned <span className="font-mono">status_url</span>. It is free. When it reads <span className="font-mono">created</span>, the pull request exists; when the check is green it merges itself and your page is live at <span className="font-mono">/verified/{exampleSlug}</span>.
              </p>
            </div>

            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Rules</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-400">
                <li>The score is never for sale. It is recomputed from protocol facts on every probe, claimed or not.</li>
                <li>Endpoints and homepage must sit on the claimed origin. The payTo is the one the Bazaar recorded.</li>
                <li>A claim that fails validation gets its reasons at the status URL and three automatic retries. Nothing is refunded for a failed validation, so probe your own 402 first with the <a href="/scan" className="text-blue-400 hover:text-blue-300">free scanner</a>.</li>
                <li>Not in the index yet? Use the free pull request, or <a href="https://router.forgemesh.io/openapi.json" className="text-blue-400 hover:text-blue-300">POST /api/verified/submit</a> at $0.05 if you cannot open one.</li>
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
