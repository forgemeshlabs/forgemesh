import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { BotAtlasIndex } from '@/components/BotAtlasIndex';
import { BOTS, PURPOSES, PURPOSE_ORDER, fetchLeaderboard } from '@/lib/bots';

export const revalidate = 600;

const title = 'Crawler Atlas: every bot that reads the web, explained';
const description = 'A free, ever-growing profile of every web crawler and bot: who runs it, what it does with your pages, its robots.txt token, how to verify it, whether it pays, and what sites across the network observe.';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title,
  description,
  keywords: ['list of AI crawlers', 'bot user agent list', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bytespider', 'CCBot', 'verify Googlebot', 'block AI crawlers robots.txt', 'web crawler directory', 'crawler atlas'],
  alternates: { canonical: '/bots' },
  openGraph: { title, description, type: 'website', url: 'https://forgemesh.io/bots' },
  twitter: { card: 'summary_large_image', site: '@forgemeshlabs', title, description },
};

export default async function BotsPage() {
  const lb = await fetchLeaderboard();
  const seen: Record<string, number> = {};
  const fresh: Record<string, string> = {};
  for (const b of lb?.bots ?? []) seen[b.bot_name] = b.sites;
  for (const n of lb?.new_arrivals ?? []) fresh[n.bot_name] = n.first_seen;
  const stats = lb?.stats;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: title, description, url: 'https://forgemesh.io/bots' },
      { '@type': 'ItemList', name: 'Crawler Atlas', numberOfItems: BOTS.length, itemListElement: BOTS.slice(0, 50).map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, url: `https://forgemesh.io/bots/${b.slug}` })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' }, { '@type': 'ListItem', position: 2, name: 'Crawler Atlas', item: 'https://forgemesh.io/bots' }] },
    ],
  };
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Crawler Atlas · free · ever-growing</span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">Every bot that reads the web, explained</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Most of a website&apos;s traffic is not people. This is the profile of each thing that is: who runs it, what it does with your pages, its robots.txt line, how to verify it, whether it can pay, and what sites across the network actually observe. Same card for every bot, so you learn the shape once.
            </p>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
              <div><dt className="inline font-semibold text-slate-100">{BOTS.length}</dt> <dd className="inline">bots profiled</dd></div>
              <div><dt className="inline font-semibold text-slate-100">{stats?.reporters ?? 0}</dt> <dd className="inline">sites reporting sightings</dd></div>
              <div><dt className="inline font-semibold text-slate-100">{lb?.new_arrivals.length ?? 0}</dt> <dd className="inline">new in the last 14 days</dd></div>
              <div className="basis-full text-xs text-slate-500">Network numbers come from sites running <a href="/wordpress" className="text-blue-300 hover:underline">Pay-per-Crawl</a> that opted in to share anonymous daily counts, plus the ForgeMesh fleet. Small samples are labelled as such.</div>
            </dl>
            <BotAtlasIndex bots={BOTS} purposes={PURPOSES} order={PURPOSE_ORDER} seen={seen} fresh={fresh} />
            <section className="mt-16 rounded-lg border border-white/[0.08] bg-white/[0.02] p-6">
              <h2 className="text-xl font-semibold text-slate-50">Run a crawler? Publish your own profile.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Put a <code className="font-mono text-blue-200">crawler-profile.json</code> at <code className="font-mono text-blue-200">/.well-known/</code> on your domain and the Atlas shows your words next to what sites observe, with a verified badge. No signup; the domain is the proof. Spec and generator: <a href="https://github.com/forgemeshlabs" className="text-blue-300 hover:underline">github.com/forgemeshlabs</a>. Missing a bot? Email <a href="mailto:hello@forgemesh.io" className="text-blue-300 hover:underline">hello@forgemesh.io</a> (free) or submit over the API ($0.005, x402).
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
