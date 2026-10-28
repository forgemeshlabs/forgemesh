import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { BOTS, PURPOSES, fetchObserved, logoFor, mugshotReasons } from '@/lib/bots';

export const revalidate = 600;

const title = 'Bot Mugshots: the crawlers to think twice about | Crawler Atlas';
const description = 'The wall of web crawlers that give site owners reasons to block or charge: unidentified scripts, trainers with no opt-out, bots that ignore robots.txt, names that get impersonated, and the ones most sites already block.';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title,
  description,
  keywords: ['bots to block', 'block AI crawlers', 'bad bots list', 'Bytespider block', 'robots.txt ignore', 'bot mugshot'],
  alternates: { canonical: '/bots/mugshots' },
  openGraph: { title, description, type: 'website', url: 'https://forgemesh.io/bots/mugshots' },
  twitter: { card: 'summary_large_image', site: '@forgemeshlabs', title, description },
};

export default async function MugshotsPage() {
  const rows = await Promise.all(BOTS.map(async (b) => ({ b, o: await fetchObserved(b.name) })));
  const wall = rows.map(({ b, o }) => ({ b, o, reasons: mugshotReasons(b, o) })).filter((x) => x.reasons.length).sort((a, c) => c.reasons.length - a.reasons.length || a.b.name.localeCompare(c.b.name));
  const robots = wall.filter((x) => x.b.robots).map((x) => `User-agent: ${x.b.robots}`);
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(245,158,11,0.14),transparent_32%)]" />
          <div className="mx-auto max-w-5xl">
            <nav className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500"><a href="/bots" className="hover:text-slate-300">Crawler Atlas</a> / Mugshots</nav>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber-400/20 bg-amber-500/[0.06] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/80">Bot mugshots · {wall.length} on the wall</span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">The crawlers to think twice about</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Not a blocklist. A wall of the bots that give you a reason: nobody identifies them, they train models with no opt-out, they ignore robots.txt, their name gets impersonated, or most sites that see them already block them. Each card says why, so you decide. Reasons from network observations update daily and are labelled by sample size.</p>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wall.map(({ b, reasons }) => (
                <li key={b.slug} className="rounded-lg border border-amber-400/20 bg-[#0b0a10] p-5">
                  <div className="flex items-center gap-3">
                    {logoFor(b.slug) ? <img src={logoFor(b.slug)!} alt="" width={48} height={48} className="h-12 w-12 rounded-lg border border-white/[0.12] bg-white/[0.04] object-contain p-1.5" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/10 font-mono text-base font-bold text-amber-100" aria-hidden>{b.name.slice(0, 2).toUpperCase()}</span>}
                    <div className="min-w-0">
                      <a href={`/bots/${b.slug}`} className="block truncate text-lg font-semibold text-slate-50 hover:underline">{b.name}</a>
                      <p className="truncate text-xs text-slate-500">{b.operator || 'Unknown operator'} · {PURPOSES[b.purpose]?.short ?? b.purpose}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-sm leading-6 text-amber-100/90">{reasons.map((r) => <li key={r} className="flex gap-2"><span aria-hidden>⚑</span><span>{r}</span></li>)}</ul>
                  {b.robots && <p className="mt-3 font-mono text-[12px] text-slate-500">robots.txt: User-agent: {b.robots}</p>}
                </li>
              ))}
            </ul>
            <section className="mt-14 rounded-lg border border-white/[0.08] bg-white/[0.02] p-6">
              <h2 className="text-xl font-semibold text-slate-50">Copy the wall into robots.txt</h2>
              <p className="mt-2 text-sm text-slate-400">Only the bots on this wall that honour a robots.txt token. The ones that ignore it, or have no token, need an edge rule or a paywall instead.</p>
              <pre className="mt-4 overflow-x-auto rounded border border-white/[0.06] bg-black/40 px-4 py-3 font-mono text-[13px] leading-6 text-slate-200">{robots.map((r) => `${r}\nDisallow: /`).join('\n\n')}</pre>
              <p className="mt-3 text-sm text-slate-400">Or charge them instead of blocking: the free <a href="/wordpress" className="text-blue-300 hover:underline">Pay-per-Crawl plugin</a> answers every bot on this wall with a price.</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
