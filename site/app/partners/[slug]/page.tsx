// x402 Verified by ForgeMesh — one seller's page. Data comes from public/partners.json
// (synced from forgemeshlabs/x402-verified by scripts/verified-sync.js); this route never
// scores or verifies anyone itself, it only renders what that repo published.
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { VerifiedBadgeSnippet } from '@/components/VerifiedBadgeSnippet';
import { findSeller, isSlug, badgeFor, BAND_LABEL, cheapestEndpoint, type VerifiedSeller } from '@/lib/verified';
import { loadVerified } from '@/lib/verified-data';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const feed = loadVerified();
  const seller = findSeller(feed, slug);
  if (!seller) return {};
  const b = badgeFor(seller);
  return {
    metadataBase: new URL('https://forgemesh.io'),
    title: `${seller.name}: x402 Verified by ForgeMesh`,
    description: `${seller.name} — ForgeMesh Verified Score ${b.scoreText}${b.paid ? ', ForgeMesh Paid' : ''}${b.perfect ? ', Perfect' : ''}. Status: ${seller.status}. ${seller.description || ''}`.trim(),
    alternates: { canonical: `/partners/${seller.slug}` },
    openGraph: {
      title: `${seller.name}: x402 Verified by ForgeMesh`,
      description: `ForgeMesh Verified Score ${b.scoreText} · status ${seller.status}`,
      type: 'website',
      url: `https://forgemesh.io/partners/${seller.slug}`,
    },
  };
}

const NETWORK_LABEL: Record<string, string> = { 'eip155:8453': 'Base' };
const networkLabel = (id: string) => NETWORK_LABEL[id] ?? id;

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded border border-white/[0.08] bg-white/[0.02] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-100">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}

function DimensionTable({ seller }: { seller: VerifiedSeller }) {
  const dims: Array<{ key: keyof VerifiedSeller['dimensions']; label: string; max: number }> = [
    { key: 'payability', label: 'Payability', max: 40 },
    { key: 'reliability', label: 'Reliability', max: 20 },
    { key: 'interoperability', label: 'Interoperability', max: 20 },
    { key: 'discoverability', label: 'Discoverability', max: 20 },
  ];
  return (
    <div className="overflow-x-auto rounded border border-white/[0.08]">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-2 font-medium">Dimension</th>
            <th className="px-4 py-2 font-medium">Points</th>
            <th className="px-4 py-2 font-medium">Check</th>
          </tr>
        </thead>
        <tbody>
          {dims.map((d) => (
            <Fragment key={d.key}>
              <tr className="border-b border-white/[0.05] bg-white/[0.015]">
                <td className="px-4 py-2 font-semibold text-slate-200" colSpan={2}>
                  {d.label}
                </td>
                <td className="px-4 py-2 text-right font-mono text-slate-300">
                  {seller.dimensions[d.key]}/{d.max}
                </td>
              </tr>
              {(seller.score_details || [])
                .filter((s) => s.dimension === d.key)
                .map((s, i) => (
                  <tr key={`${d.key}-${i}`} className="border-b border-white/[0.03]">
                    <td className="px-4 py-2 text-slate-400" colSpan={2}>
                      <span className={s.ok ? 'text-emerald-400' : 'text-slate-600'}>{s.ok ? '✓' : '·'}</span>{' '}
                      {s.check}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-xs text-slate-500">
                      {s.points}/{s.max}
                    </td>
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const feed = loadVerified();
  const seller = findSeller(feed, slug);
  if (!seller) notFound();

  const b = badgeFor(seller);
  const cheapest = cheapestEndpoint(seller);
  const declared = new Set(seller.networks);
  const extraNetworks = (seller.networks_detected || []).filter((n) => !declared.has(n));
  const probes = (seller.probes || []).slice(-8).reverse();

  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-10 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                x402 Verified by ForgeMesh
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-4xl">
              {seller.name}
            </h1>
            {seller.description ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{seller.description}</p>
            ) : null}
            <p className="mt-3">
              <a href={seller.homepage} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300">
                {seller.homepage.replace(/^https?:\/\//, '')} ↗
              </a>
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="ForgeMesh Verified Score" value={b.scoreText} sub={seller.status === 'delisted' ? undefined : BAND_LABEL[seller.score_band]} />
              <StatCard label="Perfect" value={b.perfect ? '★ Yes' : 'No'} />
              <StatCard label="ForgeMesh Paid" value={b.paid ? '$ Yes' : 'Not yet'} sub={seller.forgemesh_paid_stale ? 'evidence is stale' : undefined} />
              <StatCard label="Status" value={seller.status} />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Score breakdown</h2>
            <div className="mt-4">
              <DimensionTable seller={seller} />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Protocols &amp; networks</h2>
            <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
              <p>
                Protocols: x402 ✓{seller.protocol_capabilities?.mpp?.supported ? ' · MPP detected' : ''}
                {seller.protocol_capabilities?.x402?.version ? ` (x402Version ${seller.protocol_capabilities.x402.version})` : ''}
              </p>
              <p>
                Networks declared: {seller.networks.map(networkLabel).join(', ') || '—'}
                {extraNetworks.length ? <> · detected: {extraNetworks.map(networkLabel).join(', ')}</> : null}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Endpoints</h2>
            <div className="mt-4 overflow-x-auto rounded border border-white/[0.08]">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-2 font-medium">Method</th>
                    <th className="px-4 py-2 font-medium">URL</th>
                    <th className="px-4 py-2 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {seller.endpoints.map((e, i) => (
                    <tr key={i} className="border-b border-white/[0.05] last:border-0">
                      <td className="px-4 py-2 font-mono text-xs text-slate-400">
                        {e.method}
                        {i === (seller.nominated_endpoint ?? 0) ? <span className="ml-1 text-blue-400">★</span> : null}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-slate-300">{e.url}</td>
                      <td className="px-4 py-2 font-mono text-xs text-slate-300">${e.price_usdc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cheapest ? <p className="mt-2 text-xs text-slate-500">Cheapest route: {cheapest.method} ${cheapest.price_usdc}</p> : null}
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
            <div className="rounded border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Seller proof</p>
              {seller.proof ? (
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  <a
                    href={`https://basescan.org/tx/${seller.proof.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-blue-400 hover:text-blue-300"
                  >
                    {seller.proof.tx_hash.slice(0, 10)}…{seller.proof.tx_hash.slice(-8)} ↗
                  </a>
                  <br />
                  {seller.proof_check?.ok
                    ? `Verified: ${seller.proof_check.confirmations ?? '—'} confirmations, checked ${seller.proof_check.checked_at?.slice(0, 10) ?? '—'}.`
                    : `Not currently verified${seller.proof_check?.reason ? `: ${seller.proof_check.reason}.` : '.'}`}
                </p>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No proof on file.</p>
              )}
            </div>

            <div className="rounded border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">ForgeMesh Paid</p>
              {b.paid ? (
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {seller.forgemesh_paid_tx ? (
                    <a
                      href={`https://basescan.org/tx/${seller.forgemesh_paid_tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-blue-400 hover:text-blue-300"
                    >
                      {seller.forgemesh_paid_tx.slice(0, 10)}…{seller.forgemesh_paid_tx.slice(-8)} ↗
                    </a>
                  ) : null}
                  <br />
                  Paid {seller.forgemesh_paid_at?.slice(0, 10) ?? '—'}
                  {seller.forgemesh_paid_amount_atomic ? ` · ${Number(seller.forgemesh_paid_amount_atomic) / 1e6} USDC` : ''}
                  {seller.forgemesh_paid_stale ? ' · this evidence is stale (older than 90 days)' : ''}
                </p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Not yet: ForgeMesh only pays a seller after it scores 85+, stays active, and passes two
                  independent probe runs at least an hour apart. Eligibility is not entitlement.
                </p>
              )}
            </div>
          </div>
        </section>

        {probes.length ? (
          <section className="border-t border-white/[0.06] px-6 py-10">
            <div className="mx-auto max-w-4xl">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Last {probes.length} probes {seller.last_probe ? <>· last verified {seller.last_probe.slice(0, 10)}</> : null}
              </h2>
              <div className="mt-4 overflow-x-auto rounded border border-white/[0.08]">
                <table className="w-full min-w-[420px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-2 font-medium">At</th>
                      <th className="px-4 py-2 font-medium">Pass</th>
                      <th className="px-4 py-2 font-medium">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {probes.map((p, i) => (
                      <tr key={i} className="border-b border-white/[0.05] last:border-0">
                        <td className="px-4 py-2 font-mono text-xs text-slate-400">{p.at.slice(0, 16).replace('T', ' ')}</td>
                        <td className="px-4 py-2">
                          <span className={p.pass ? 'text-emerald-400' : 'text-rose-400'}>{p.pass ? '✓ pass' : '✗ fail'}</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-slate-400">{p.ms != null ? `${p.ms}ms` : 'n/a'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">README badge</h2>
            <div className="mt-4">
              <VerifiedBadgeSnippet slug={seller.slug} />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-8">
          <div className="mx-auto max-w-4xl text-xs leading-6 text-slate-600">
            <p>{feed.disclaimer}</p>
            <p className="mt-2">
              <a href="/partners" className="text-blue-400/80 hover:text-blue-300">← Back to x402 Verified</a>
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
