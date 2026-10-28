// x402 Verified by ForgeMesh — the human index at /verified (was /partners until 2026-10-15). Data comes from public/partners.json
// (synced from forgemeshlabs/x402-verified by scripts/verified-sync.js); this page never
// scores or verifies anyone itself, it only renders what that repo published.
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { VerifiedDirectory } from '@/components/VerifiedDirectory';
import { badgeFor } from '@/lib/verified';
import { loadUnclaimed, loadVerified } from '@/lib/verified-data';
import { UnclaimedIndex, parseUnclaimedQuery, type UnclaimedRowLite } from '@/components/UnclaimedIndex';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'x402 Verified by ForgeMesh — x402 Sellers, Independently Checked',
  description:
    'Every seller here has a settled on-chain payment behind it: a recomputable 0-100 ForgeMesh Verified Score, a $ mark when ForgeMesh itself has transacted with the seller, a ★ mark at a perfect score, and a live README badge. Independent, not an x402 Foundation or Coinbase program.',
  alternates: { canonical: '/verified' },
  openGraph: {
    title: 'x402 Verified by ForgeMesh',
    description:
      'x402 sellers with a settled on-chain payment behind every row, scored 0-100, with a $ mark when ForgeMesh has paid them and a live README badge.',
    type: 'website',
    url: 'https://forgemesh.io/verified',
  },
};

type PageProps = { searchParams: Promise<{ paid?: string; q?: string; band?: string; u?: string }> };

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPaidOnly = params?.paid === '1';

  const feed = loadVerified();
  const live = feed.sellers.filter((s) => s.status !== 'delisted');
  const delisted = feed.sellers.filter((s) => s.status === 'delisted');
  const paidCount = feed.sellers.filter((s) => s.forgemesh_paid).length;
  const unclaimed = loadUnclaimed();
  const unclaimedQuery = parseUnclaimedQuery(params);
  // Only the 40 rows of the requested page reach the HTML; the feed stays server-side.
  const unclaimedRows: UnclaimedRowLite[] = unclaimed.rows
    .filter((r) => r.listed)
    .map((r) => ({
      slug: r.slug, origin: r.origin, name: r.name, description: r.description, score: r.score, score_band: r.score_band,
      max_score: r.max_score || 85, routes_indexed: r.routes_indexed, cheapest_usdc: r.cheapest_usdc, manifest_ok: r.manifest_ok,
      llms_ok: r.llms_ok, mpp_detected: r.mpp_detected, ms: r.ms, last_probe: r.last_probe,
    }));

  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-12 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                x402 Verified by ForgeMesh
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              x402 sellers, independently checked
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Every seller listed here has a settled on-chain payment behind it — either the seller&rsquo;s own
              submitted proof, or a real purchase ForgeMesh made itself. Each gets a recomputable{' '}
              <strong className="text-slate-200">ForgeMesh Verified Score</strong> (0-100), rechecked on a
              schedule, with a live README badge.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Merged sellers get a row here, a page at /verified/&lt;slug&gt; with the score breakdown and probe
              history, an SVG badge at /badge/x402/&lt;slug&gt; plus a shields.io endpoint, and an entry in the
              machine feed. The first probe is recorded at merge; the weekly reprobe runs Mondays 05:30 UTC and
              keeps the last eight runs. Badges and the feed refresh within six hours of every probe.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">{feed.disclaimer}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Run a WordPress site? The free{' '}
              <a href="/wordpress" className="text-slate-300 underline decoration-blue-500/50 underline-offset-2 hover:text-white">
                Pay-per-Crawl plugin
              </a>{' '}
              prices every bot fetch with HTTP 402; search engines stay free and you keep 100% of what x402-capable agents pay.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/forgemeshlabs/x402-verified/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Get verified (free PR) →
              </a>
              <a
                href="https://github.com/forgemeshlabs/x402-verified"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.1] px-4 py-2.5 text-sm text-slate-300 transition-all hover:border-white/[0.2] hover:text-slate-100"
              >
                Source on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* One claim per signal — the four marks are independent, never combined into a
            single "tier". */}
        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">One claim per signal</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="font-mono text-xs font-semibold text-blue-300">Score, 0-100</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  Current technical quality of the x402 implementation. Recomputable from public data.
                </p>
              </div>
              <div className="rounded border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="font-mono text-xs font-semibold text-emerald-400">$ ForgeMesh Paid</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  ForgeMesh itself completed and independently verified a real x402 transaction with the
                  seller. Always green, regardless of current score or status.
                </p>
              </div>
              <div className="rounded border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="font-mono text-xs font-semibold text-amber-400">★ Perfect</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  The seller currently scores exactly 100/100. &ldquo;Gold tier&rdquo; does not exist — this is
                  the only meaning of the star.
                </p>
              </div>
              <div className="rounded border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="font-mono text-xs font-semibold text-slate-300">Status</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  active / degraded / delisted — current operating health, checked on a recurring schedule.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">For agents</p>
            <div className="mt-4 rounded border border-blue-500/25 bg-blue-500/[0.06] p-5">
              <p className="text-sm leading-7 text-slate-300">
                Machine feed:{' '}
                <a href="/partners.json" className="font-mono text-blue-400 hover:text-blue-300">
                  https://forgemesh.io/partners.json
                </a>{' '}
                — the same records rendered below, for a router or a buying agent to filter directly.
              </p>
              <pre className="mt-4 overflow-x-auto rounded border border-white/[0.08] bg-black/30 p-4 font-mono text-xs text-slate-300">
{`{
  "protocol": "x402",
  "status": "active",
  "minimum_score": 85,
  "prefer_forgemesh_paid": true,
  "max_price_usdc": 0.05
}`}
              </pre>
            </div>
          </div>
        </section>

        <section id="directory" className="border-t border-white/[0.06] px-6 py-10 scroll-mt-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                The directory · {live.length} seller{live.length === 1 ? '' : 's'}
              </h2>
              {paidCount > 0 ? (
                <a href="/verified?paid=1#directory" className="text-sm text-emerald-400 hover:text-emerald-300">
                  {paidCount} ForgeMesh Paid seller{paidCount === 1 ? '' : 's'} → view filter
                </a>
              ) : null}
            </div>

            <div className="mt-5">
              {live.length ? (
                <VerifiedDirectory sellers={live} initialPaidOnly={initialPaidOnly} />
              ) : (
                <p className="rounded border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-slate-500">
                  No sellers yet. Be the first — see{' '}
                  <a
                    href="https://github.com/forgemeshlabs/x402-verified/blob/main/CONTRIBUTING.md"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    CONTRIBUTING.md
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="unclaimed" className="border-t border-white/[0.06] px-6 py-10 scroll-mt-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Unclaimed · {unclaimed.counts.listed} of {unclaimed.counts.payable} payable origins
              </h2>
              <a href="/unclaimed.json" className="font-mono text-xs text-blue-400 hover:text-blue-300">/unclaimed.json</a>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              Every x402 origin the CDP Bazaar lists, probed by ForgeMesh and scored on protocol facts alone. Nobody
              submitted these rows. They carry no contact, no badge and no proof transaction, so the ceiling is 85.
              Rows below {unclaimed.list_min_score} stay in the feed but not on this page.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              <strong className="text-slate-200">Yours?</strong> Claim it for ${unclaimed.claim.price_usdc} in one x402 call, no account:{' '}
              <a href="/verified/claim" className="text-blue-400 hover:text-blue-300">how to claim</a>. A claim adds your
              contact and routes, the README badge and re-probe on demand. Listing by pull request stays{' '}
              <a href={unclaimed.free_path} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">free</a>.
            </p>
            <div className="mt-5">
              {unclaimedRows.length ? (
                <UnclaimedIndex rows={unclaimedRows} query={unclaimedQuery} claimPriceUsdc={unclaimed.claim.price_usdc} />
              ) : (
                <p className="rounded border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-slate-500">
                  The unclaimed index is being rebuilt. Check back shortly.
                </p>
              )}
            </div>
            {unclaimed.generated_at ? (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600">
                Rebuilt {unclaimed.generated_at.slice(0, 10)} · weekly · score spec {unclaimed.score_spec}
              </p>
            ) : null}
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Where else these sellers appear</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Networks, indexes, and directories ForgeMesh works with are listed on the{' '}
              <a href="/partners" className="text-blue-400 hover:text-blue-300">partners page</a>. They are not
              scored sellers and carry no ForgeMesh Verified Score.
            </p>
          </div>
        </section>

        {delisted.length ? (
          <section className="border-t border-white/[0.06] px-6 py-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Delisted</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Three consecutive failed weekly probes delist a seller. A ForgeMesh Paid mark on a delisted
                row records a fact from when the transaction happened — it does not change with health, and
                the score cell here always reads &ldquo;delisted&rdquo; regardless of the underlying number.
              </p>
              <ul className="mt-5 space-y-3">
                {delisted.map((s) => {
                  const b = badgeFor(s);
                  return (
                    <li key={s.slug} className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <a href={`/verified/${s.slug}`} className="font-semibold text-slate-300 hover:text-blue-300">
                          {s.name}
                        </a>
                        <span
                          className="rounded border px-2 py-0.5 font-mono text-xs font-semibold"
                          style={{ borderColor: `#${b.scoreColor}66`, color: `#${b.scoreColor}`, background: `#${b.scoreColor}1a` }}
                        >
                          {b.scoreText}
                        </span>
                        {b.paid ? (
                          <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                            $ ForgeMesh Paid
                          </span>
                        ) : null}
                      </div>
                      {s.description ? <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
