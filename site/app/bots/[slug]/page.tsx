import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { BOTS, PURPOSES, botBySlug, fetchObserved, pays } from '@/lib/bots';

type Params = { slug: string };
export const revalidate = 600;

export function generateStaticParams() {
  return BOTS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const b = botBySlug(slug);
  if (!b) return {};
  const p = PURPOSES[b.purpose];
  const title = `${b.name}: What It Is, How to Block and Verify It | Crawler Atlas`;
  const description = `${b.name} is ${b.operator ? `run by ${b.operator}` : 'an unidentified crawler'} for ${p?.short ?? b.purpose}. ${b.note} Robots.txt token, verification, whether it pays, and what sites observe.`.slice(0, 300);
  return {
    metadataBase: new URL('https://forgemesh.io'),
    title,
    description,
    keywords: [`what is ${b.name}`, `${b.name} user agent`, `block ${b.name}`, `${b.name} robots.txt`, `verify ${b.name}`, b.operator, 'crawler atlas'].filter(Boolean) as string[],
    alternates: { canonical: `/bots/${b.slug}`, types: { 'application/json': `/bots/${b.slug}/profile.json` } },
    openGraph: { title, description, type: 'article', url: `https://forgemesh.io/bots/${b.slug}` },
    twitter: { card: 'summary_large_image', site: '@forgemeshlabs', title, description },
  };
}

const pct = (v: number | null) => (v == null ? '—' : `${Math.round(v * 100)}%`);

export default async function BotPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const b = botBySlug(slug);
  if (!b) notFound();
  const p = PURPOSES[b.purpose];
  const o = await fetchObserved(b.name);
  const docsHost = b.docs ? new URL(b.docs).host : '';
  const canPay = pays(b);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: `${b.name} crawler profile`, url: `https://forgemesh.io/bots/${b.slug}`, description: b.note, isPartOf: { '@type': 'WebSite', name: 'Crawler Atlas', url: 'https://forgemesh.io/bots' } },
      { '@type': 'DefinedTerm', name: b.name, description: b.note, inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Crawler Atlas', url: 'https://forgemesh.io/bots' }, url: `https://forgemesh.io/bots/${b.slug}` },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' }, { '@type': 'ListItem', position: 2, name: 'Crawler Atlas', item: 'https://forgemesh.io/bots' }, { '@type': 'ListItem', position: 3, name: b.name, item: `https://forgemesh.io/bots/${b.slug}` }] },
    ],
  };
  const Row = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <tr className="border-b border-white/[0.06] last:border-0"><th scope="row" className="w-44 whitespace-nowrap px-4 py-3 align-top font-mono text-[12px] font-normal uppercase tracking-wide text-slate-500">{k}</th><td className="px-4 py-3 text-sm leading-6 text-slate-200">{children}</td></tr>
  );
  const siblings = BOTS.filter((x) => x.purpose === b.purpose && x.slug !== b.slug).slice(0, 8);
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%)]" />
          <div className="mx-auto max-w-3xl">
            <nav className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500"><a href="/bots" className="hover:text-slate-300">Crawler Atlas</a> / {p?.title ?? b.purpose} / {b.name}</nav>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/15 font-mono text-xl font-bold text-blue-100" aria-hidden>{b.name.slice(0, 2).toUpperCase()}</span>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-4xl">What is {b.name}?</h1>
                <p className="mt-1 text-sm text-slate-400">{b.operator || 'Unknown operator'} · {p?.short ?? b.purpose} · class <span className="font-mono">{b.class}</span></p>
              </div>
            </div>
            <p className="mt-6 text-lg leading-8 text-slate-300">{b.note || `${b.name} is a ${p?.short ?? b.purpose} crawler.`}</p>
            <div className="mt-6 rounded border border-emerald-400/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-100"><span className="font-semibold">Verdict:</span> {p?.verdict}</div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">Profile</h2>
            <p className="mt-2 text-xs text-slate-500">Compiled by Crawler Atlas from the operator&apos;s published documentation. Not yet declared by the operator. <a href={`/bots/${b.slug}/profile.json`} className="text-blue-300 hover:underline">JSON</a></p>
            <div className="mt-4 overflow-x-auto rounded border border-white/[0.06]"><table className="w-full text-left"><tbody>
              <Row k="Operator">{b.operator || 'Unknown'}{docsHost && <> · <a href={`https://${docsHost}`} className="text-blue-300 hover:underline" rel="nofollow noopener">{docsHost}</a></>}</Row>
              <Row k="Purpose">{p?.title ?? b.purpose}. {p?.blurb}</Row>
              <Row k="User-agent contains"><code className="font-mono text-[13px] text-blue-200">{b.match.join('  ·  ')}</code></Row>
              <Row k="robots.txt">{b.robots ? <><code className="font-mono text-[13px] text-blue-200">User-agent: {b.robots}</code><br /><code className="font-mono text-[13px] text-blue-200">Disallow: /</code></> : 'No documented token. Block at the edge or by user-agent match.'}</Row>
              <Row k="How to verify">{b.verify.length ? <>Reverse DNS on the client address must end in <code className="font-mono text-[13px] text-blue-200">{b.verify.join(', ')}</code> and resolve forward to the same address. A request that claims this name and fails the check is an impostor.</> : 'No published verification method. Treat the name as a claim, not proof.'}</Row>
              <Row k="Should you block it?">{p?.verdict}</Row>
              <Row k="Does it pay?">{canPay ? 'Yes. This client understands HTTP 402 and pays per page with x402 (USDC on Base).' : 'No. It does not carry a wallet and cannot answer a 402. A site that charges simply serves it nothing.'}</Row>
              <Row k="Docs">{b.docs ? <a href={b.docs} className="text-blue-300 hover:underline" rel="nofollow noopener">{b.docs}</a> : 'None published'}</Row>
            </tbody></table></div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">Observed on the network</h2>
            <p className="mt-2 text-xs text-slate-500">Anonymous daily counts from sites running Pay-per-Crawl that opted in, plus the ForgeMesh fleet. Last 7 days.{o?.sample_note ? ` ${o.sample_note[0].toUpperCase()}${o.sample_note.slice(1)}: ${o.sites_reporting} sites reporting.` : ''}</p>
            {o && o.sites_seen > 0 ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Sites that saw it', `${o.sites_seen} of ${o.sites_reporting}`],
                  ['Fetches', o.hits.toLocaleString()],
                  ['Impostor rate', pct(o.impostor_rate)],
                  ['Paid fetches', o.paid_fetches.toLocaleString()],
                  ['Sites charging it', pct(o.share_charged)],
                  ['Sites blocking it', pct(o.share_blocked)],
                  ['Median price', o.median_price_usd != null ? `$${o.median_price_usd}` : '—'],
                  ['First seen', o.first_seen ?? '—'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded border border-white/[0.08] bg-white/[0.02] p-3"><dt className="text-[11px] uppercase tracking-wide text-slate-500">{k}</dt><dd className="mt-1 text-lg font-semibold text-slate-100">{v}</dd></div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 rounded border border-dashed border-white/[0.12] p-4 text-sm text-slate-400">No sightings reported yet. {b.name} appears here the day an opted-in site sees it.</p>
            )}

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">Do something about it</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-400">
              <li>See it in your own logs, verify it, and charge, allow or block it by name with the free <a href="/wordpress" className="text-blue-300 hover:underline">Pay-per-Crawl plugin</a> (WordPress, Python, JavaScript, Go, PHP).</li>
              <li>Run this crawler? <a href="https://github.com/forgemeshlabs" className="text-blue-300 hover:underline">Publish a crawler-profile.json</a> on your domain and this page shows your declared profile with a verified badge.</li>
              <li>Machine-readable twin: <a href={`/bots/${b.slug}/profile.json`} className="font-mono text-blue-300 hover:underline">/bots/{b.slug}/profile.json</a> (free in a browser; bots pay $0.005 per call).</li>
            </ul>

            {siblings.length > 0 && (
              <>
                <h2 className="mt-12 text-xl font-semibold tracking-tight text-slate-50">Also in {p?.title.toLowerCase()}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {siblings.map((s) => <li key={s.slug}><a href={`/bots/${s.slug}`} className="rounded-full border border-white/[0.12] px-3 py-1 text-sm text-slate-300 hover:border-blue-400/50">{s.name}</a></li>)}
                </ul>
              </>
            )}
            <p className="mt-12 text-xs text-slate-600"><ForgeMeshMark size={14} className="mr-1 inline-block align-middle" /> Crawler Atlas is maintained by ForgeMesh. Names and marks belong to their operators and are used to identify their crawlers.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
