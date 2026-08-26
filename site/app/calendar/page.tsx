// The Dates — a running calendar of the days that decide the agent economy.
// Data lives in public/calendar.json (served from disk; edit it and the page
// updates on the next request — no rebuild). Rendered server-side per request
// so search engines index the events and countdowns stay current.
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const dynamic = 'force-dynamic';

type CalEvent = {
  date: string; // YYYY-MM-DD
  title: string;
  tag: 'rails' | 'policy' | 'grid';
  what: string;
  why: string;
  link?: string;
};

const TAG_STYLE: Record<CalEvent['tag'], { label: string; cls: string }> = {
  rails: { label: '⚡ rails', cls: 'border-blue-500/40 text-blue-300' },
  policy: { label: '🏛️ policy', cls: 'border-violet-500/40 text-violet-300' },
  grid: { label: '🏗️ grid', cls: 'border-amber-500/40 text-amber-300' },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Agent Economy Calendar — Dates That Matter | ForgeMesh',
  description:
    'The running calendar of dates that decide the machine economy: Cloudflare AI-crawler deadlines, CLARITY Act votes, stablecoin rule dockets, ERCOT data-center audits.',
  alternates: { canonical: '/calendar' },
  openGraph: {
    title: 'The Dates That Decide the Agent Economy',
    description:
      'Cloudflare crawler deadlines, CLARITY Act votes, stablecoin dockets, ERCOT audits — one running calendar, kept current.',
    type: 'website',
    url: 'https://forgemesh.io/calendar',
  },
};

function loadEvents(): { updatedAt: string; events: CalEvent[] } {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public', 'calendar.json'), 'utf8')
    );
  } catch {
    return { updatedAt: '', events: [] };
  }
}

function daysOut(date: string): number {
  const today = new Date().toISOString().slice(0, 10);
  return Math.round((new Date(date).getTime() - new Date(today).getTime()) / 864e5);
}

function fmtDate(date: string): string {
  return new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function Countdown({ d }: { d: number }) {
  if (d > 1)
    return <span className="font-mono text-sm text-blue-300">in {d} days</span>;
  if (d === 1) return <span className="font-mono text-sm text-blue-200">tomorrow</span>;
  if (d === 0)
    return <span className="font-mono text-sm font-semibold text-blue-100">TODAY</span>;
  return <span className="font-mono text-sm text-slate-500">{-d}d ago</span>;
}

export default function Page() {
  const { updatedAt, events } = loadEvents();
  const sorted = events.slice().sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((e) => daysOut(e.date) >= 0);
  const past = sorted.filter((e) => daysOut(e.date) < 0).reverse();

  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                The calendar{updatedAt ? <> · updated <time dateTime={updatedAt}>{updatedAt.slice(0, 10)}</time></> : null}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              The dates that decide the agent economy
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Crawler walls, floor votes, comment dockets, grid audits — the machine economy gets
              shaped on specific days. We track them here, same as we track the rails on{' '}
              <a href="/#rail-pulse" className="text-blue-400 hover:text-blue-300">Rail Pulse</a> and
              the grid on <a href="/texas" className="text-blue-400 hover:text-blue-300">Texas Watch</a>.
              Sources linked on every entry.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <ol className="relative space-y-6 border-l border-white/[0.08] pl-6">
              {upcoming.map((e, i) => {
                const d = daysOut(e.date);
                const tag = TAG_STYLE[e.tag] ?? TAG_STYLE.rails;
                return (
                  <li key={e.date + e.title} className="relative">
                    <span
                      className={`absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full ${
                        d === 0 ? 'bg-blue-300' : i === 0 ? 'bg-blue-400' : 'bg-slate-600'
                      }`}
                      aria-hidden
                    />
                    <div className="rounded border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-blue-500/30">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <time dateTime={e.date} className="font-mono text-sm font-semibold text-slate-200">
                          {fmtDate(e.date)}
                        </time>
                        <Countdown d={d} />
                        <span className={`ml-auto rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tag.cls}`}>
                          {tag.label}
                        </span>
                      </div>
                      <h2 className="mt-2 text-lg font-semibold leading-snug text-slate-100">
                        {e.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{e.what}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-blue-300/80">why it matters · </span>
                        {e.why}
                      </p>
                      {e.link ? (
                        <a href={e.link} className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300">
                          Source →
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>

            {past.length ? (
              <>
                <h2 className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Recently passed
                </h2>
                <ul className="mt-4 space-y-2">
                  {past.slice(0, 10).map((e) => (
                    <li key={e.date + e.title} className="flex flex-wrap items-baseline gap-x-3 text-sm">
                      <time dateTime={e.date} className="font-mono text-slate-500">{e.date}</time>
                      <span className="text-slate-400">{e.title}</span>
                      {e.link ? (
                        <a href={e.link} className="text-blue-400/80 hover:text-blue-300">↗</a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <p className="mt-12 text-sm leading-6 text-slate-500">
              Kept current by the same collectors that feed our{' '}
              <a href="/brief" className="text-blue-400 hover:text-blue-300">Brief</a> — when a date
              moves or lands, this page updates. Educational material, not legal or financial advice.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
