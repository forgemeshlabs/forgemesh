// Repo Watch — the decoded feed of x402 upstream releases. Data lives in
// public/repo-watch.json (written by scripts/repo-watch.js on a 6h cron);
// rendered server-side per request so it updates without a rebuild and
// search engines index each release entry.
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { RepoWatchList, type RepoWatchData } from '@/components/RepoWatch';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Repo Watch — x402 SDK Releases, Decoded | ForgeMesh',
  description:
    'Every significant x402 SDK release — Python, TypeScript core, and per-chain packages — triaged for what actually matters to builders: breaking changes, security fixes, new chains, new payment flows. Patch noise filtered.',
  alternates: { canonical: '/repo-watch' },
  openGraph: {
    title: 'Repo Watch: x402 releases, decoded',
    description:
      'Breaking changes, security fixes, new chains, new payment flows across the x402 SDKs — one feed, refreshed 4×/day.',
    type: 'website',
    url: 'https://forgemesh.io/repo-watch',
  },
};

function loadData(): RepoWatchData {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'repo-watch.json'), 'utf8'));
  } catch {
    return { lastChecked: null, entries: [] };
  }
}

export default function Page() {
  const { lastChecked, entries } = loadData();
  const sdks = Array.from(new Set(entries.map((e) => e.sdk))).sort();
  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.significance] = (acc[e.significance] ?? 0) + 1;
    return acc;
  }, {});

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
                Repo Watch
                {lastChecked ? (
                  <>
                    {' '}&middot; checked <time dateTime={lastChecked}>{lastChecked.slice(0, 16).replace('T', ' ')} UTC</time>
                  </>
                ) : null}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              x402 releases, decoded
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              The x402 monorepo ships dozens of tags a month across Python, TypeScript core, and a
              per-chain package for every rail. Most of it is patch noise. We watch every tag, pull
              the changelog, and surface only what changes your build — breaking changes, security
              fixes, new chains, new payment flows. Same idea as{' '}
              <a href="/#rail-pulse" className="text-blue-400 hover:text-blue-300">Rail Pulse</a>,
              pointed at the code instead of the ledger.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
              <span>{entries.length} tracked releases</span>
              {counts.breaking ? <span className="text-amber-300/80">{counts.breaking} breaking</span> : null}
              {counts.security ? <span className="text-rose-300/80">{counts.security} security</span> : null}
              {counts.chain ? <span className="text-emerald-300/80">{counts.chain} new chain</span> : null}
              <span>{sdks.length} packages watched</span>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <RepoWatchList entries={entries} />
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-12">
          <div className="mx-auto max-w-4xl text-sm leading-7 text-slate-400">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">How this works</p>
            <p className="mt-3">
              Source is{' '}
              <a
                href="https://github.com/x402-foundation/x402"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400/80 hover:text-blue-300"
              >
                x402-foundation/x402
              </a>
              , which publishes git tags rather than GitHub Releases. Every six hours we diff the tag list,
              fetch the matching CHANGELOG section for each package, and classify it. Patch-only tags are
              dropped. Entries with no published notes are still listed so you know the version exists. Raw
              feed at{' '}
              <a href="/repo-watch.json" className="font-mono text-blue-400/80 hover:text-blue-300">/repo-watch.json</a>.
              Want the deeper read on a release? That&rsquo;s what the{' '}
              <a href="/blog" className="text-blue-400/80 hover:text-blue-300">blog</a> and{' '}
              <a href="/brief" className="text-blue-400/80 hover:text-blue-300">The Brief</a> are for.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
