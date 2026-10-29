import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { GUIDES, guideBySlug } from '@/lib/pay-per-crawl-guides';

type Params = { slug: string };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  const title = `${g.title} | Pay-per-Crawl for ${g.name}`;
  const description = `${g.pitch} Free, open source, you keep 100%. Install, snippet, settings and a real Base settlement.`;
  return {
    metadataBase: new URL('https://forgemesh.io'),
    title,
    description,
    keywords: [`pay per crawl ${g.name}`, `charge AI crawlers ${g.name}`, `x402 ${g.name}`, 'AI bot paywall', `${g.name} middleware USDC`, 'GPTBot 402'],
    alternates: { canonical: `/plugins/${g.slug}` },
    openGraph: { title, description, type: 'article', url: `https://forgemesh.io/plugins/${g.slug}` },
    twitter: { card: 'summary_large_image', site: '@forgemeshlabs', title, description },
  };
}

const btn =
  'inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white';

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        name: g.title,
        description: g.pitch,
        step: g.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
        tool: { '@type': 'SoftwareApplication', name: `ForgeMesh Pay-per-Crawl for ${g.name}`, softwareVersion: g.version, url: g.registry.url, codeRepository: g.repo, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
          { '@type': 'ListItem', position: 2, name: 'Pay-per-Crawl plugins', item: 'https://forgemesh.io/plugins' },
          { '@type': 'ListItem', position: 3, name: g.name, item: `https://forgemesh.io/plugins/${g.slug}` },
        ],
      },
    ],
  };
  const others = GUIDES.filter((x) => x.slug !== g.slug);
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <nav className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              <a href="/plugins" className="hover:text-slate-300">Pay-per-Crawl plugins</a> / {g.name}
            </nav>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Pay-per-Crawl for {g.name} · v{g.version} · free, open source
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">{g.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">{g.pitch}</p>
            <p className="mt-3 text-sm text-slate-500">Works with: {g.stacks}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={g.registry.url} className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20">
                {g.registry.label} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href={g.repo} className={btn}>Source on GitHub</a>
              {g.more?.map((m) => <a key={m.url} href={m.url} className={btn}>{m.label}</a>)}
            </div>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Install</h2>
            <pre className="mt-4 overflow-x-auto rounded border border-white/[0.06] bg-black/40 px-4 py-3 font-mono text-[13px] text-blue-200">{g.install}</pre>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Add the gate</h2>
            {g.snippets.map((s) => (
              <figure key={s.label} className="mt-6">
                <figcaption className="mb-2 flex items-baseline justify-between text-sm text-slate-400">
                  <span>{s.label}</span>
                  {s.file && <span className="font-mono text-xs text-slate-600">{s.file}</span>}
                </figcaption>
                <pre className="overflow-x-auto rounded border border-white/[0.06] bg-black/40 px-4 py-3 font-mono text-[13px] leading-6 text-slate-200"><code>{s.code}</code></pre>
              </figure>
            ))}

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Turn it on</h2>
            <ol className="mt-6 space-y-4">
              {g.steps.map((s, i) => (
                <li key={i} className="flex gap-4 text-base leading-7 text-slate-400">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 font-mono text-xs text-blue-200">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Settings</h2>
            <div className="mt-6 overflow-x-auto rounded border border-white/[0.06]">
              <table className="w-full text-left text-sm">
                <tbody>
                  {g.env.map(([k, v]) => (
                    <tr key={k} className="border-b border-white/[0.06] last:border-0">
                      <th scope="row" className="whitespace-nowrap px-4 py-3 align-top font-mono text-[13px] font-normal text-blue-200">{k}</th>
                      <td className="px-4 py-3 leading-6 text-slate-400">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Things to know</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-7 text-slate-400">
              {g.gotchas.map((x, i) => <li key={i}>{x}</li>)}
            </ul>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Proof it settles</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Real settlements on Base mainnet through the PayAI facilitator, $0.01 each, October 2026:
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {g.settlements.map(([label, tx]) => (
                <li key={label} className="rounded border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <span className="mr-3 font-mono text-slate-500">{label}</span>
                  {tx && (
                    <a href={`https://basescan.org/tx/${tx}`} className="break-all font-mono text-[13px] text-blue-400 hover:text-blue-300">{tx}</a>
                  )}
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">Other stacks</h2>
            <p className="mt-4 flex flex-wrap gap-2">
              <a href="/wordpress" className={btn}>WordPress</a>
              {others.map((o) => <a key={o.slug} href={`/plugins/${o.slug}`} className={btn}>{o.name}</a>)}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="/plugins" className={btn}>All editions</a>
              <a href="https://proxy.forgemesh.io/wp" className={btn}>Free hosted dashboard</a>
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
