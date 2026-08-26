// The Dates — a running calendar of the days that decide the agent economy.
// Data lives in public/calendar.json (served from disk; edit it and the page
// updates on the next request — no rebuild). Rendered server-side per request
// so search engines index the events and countdowns stay current.
// /calendar/ics serves the whole thing (or ?e=<id> for one event) as an
// iCalendar file readers can add to phone/desktop calendars.
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const dynamic = 'force-dynamic';

type CalEvent = {
  id?: string;
  date: string; // YYYY-MM-DD (start)
  endDate?: string; // inclusive, for multi-day events
  title: string;
  tag: 'rails' | 'policy' | 'grid' | 'conference' | 'markets';
  what: string;
  why: string;
  link?: string;
  post?: string; // related forgemesh.io blog path
};

const TAG_STYLE: Record<CalEvent['tag'], { label: string; cls: string; dot: string }> = {
  rails: { label: '⚡ rails', cls: 'border-blue-500/40 text-blue-300', dot: 'bg-blue-400' },
  policy: { label: '🏛️ policy', cls: 'border-violet-500/40 text-violet-300', dot: 'bg-violet-400' },
  grid: { label: '🏗️ grid', cls: 'border-amber-500/40 text-amber-300', dot: 'bg-amber-400' },
  conference: { label: '🎤 conference', cls: 'border-emerald-500/40 text-emerald-300', dot: 'bg-emerald-400' },
  markets: { label: '📈 markets', cls: 'border-rose-500/40 text-rose-300', dot: 'bg-rose-400' },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Agent Economy Calendar — Dates That Matter | ForgeMesh',
  description:
    'The running calendar of dates that decide the machine economy: Cloudflare AI-crawler deadlines, CLARITY Act votes, stablecoin dockets, ERCOT data-center audits, TOKEN2049, the Bitcoin cycle window. Downloadable to your own calendar.',
  alternates: { canonical: '/calendar' },
  openGraph: {
    title: 'The Dates That Decide the Agent Economy',
    description:
      'Crawler deadlines, floor votes, stablecoin dockets, grid audits, conferences, the Bitcoin cycle clock — one running calendar, downloadable to yours.',
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

function fmtShort(date: string): string {
  return new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function Countdown({ e }: { e: CalEvent }) {
  const d = daysOut(e.date);
  const dEnd = daysOut(e.endDate || e.date);
  if (d > 1) return <span className="font-mono text-sm text-blue-300">in {d} days</span>;
  if (d === 1) return <span className="font-mono text-sm text-blue-200">tomorrow</span>;
  if (d <= 0 && dEnd >= 0)
    return <span className="font-mono text-sm font-semibold text-blue-100">{d === 0 ? 'TODAY' : 'HAPPENING NOW'}</span>;
  return <span className="font-mono text-sm text-slate-500">{-dEnd}d ago</span>;
}

// ---- month grid -------------------------------------------------------------
function monthsSpanned(events: CalEvent[]): string[] {
  if (!events.length) return [];
  const months = new Set<string>();
  const first = events[0].date.slice(0, 7);
  const last = events[events.length - 1].date.slice(0, 7);
  let [y, m] = first.split('-').map(Number);
  while (true) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    months.add(key);
    if (key === last) break;
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return [...months];
}

function MonthGrid({ month, events }: { month: string; events: CalEvent[] }) {
  const [y, m] = month.split('-').map(Number);
  const firstDow = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0=Sun
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const monthName = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  // day -> events covering it (start..endDate inclusive)
  const byDay = new Map<number, CalEvent[]>();
  for (const e of events) {
    const start = new Date(e.date + 'T12:00:00Z');
    const end = new Date((e.endDate || e.date) + 'T12:00:00Z');
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      if (d.getUTCFullYear() === y && d.getUTCMonth() === m - 1) {
        const day = d.getUTCDate();
        byDay.set(day, [...(byDay.get(day) || []), e]);
      }
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  return (
    <div className="rounded border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">{monthName}</p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="font-mono text-[10px] text-slate-600">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`b${i}`} />;
          const iso = `${month}-${String(day).padStart(2, '0')}`;
          const evs = byDay.get(day);
          const isToday = iso === today;
          const inner = (
            <span
              className={`relative mx-auto flex h-8 w-8 flex-col items-center justify-center rounded text-xs ${
                isToday
                  ? 'border border-blue-400/60 text-blue-200'
                  : evs
                    ? 'bg-white/[0.05] text-slate-100'
                    : 'text-slate-600'
              }`}
            >
              {day}
              {evs ? (
                <span className="absolute bottom-0.5 flex gap-0.5">
                  {evs.slice(0, 3).map((e, j) => (
                    <span key={j} className={`h-1 w-1 rounded-full ${(TAG_STYLE[e.tag] ?? TAG_STYLE.rails).dot}`} />
                  ))}
                </span>
              ) : null}
            </span>
          );
          return evs ? (
            <a key={iso} href={`#${evs[0].id || evs[0].date}`} title={evs.map((e) => e.title).join(' · ')}>
              {inner}
            </a>
          ) : (
            <span key={iso}>{inner}</span>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const { updatedAt, events } = loadEvents();
  const sorted = events.slice().sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((e) => daysOut(e.endDate || e.date) >= 0);
  const past = sorted.filter((e) => daysOut(e.endDate || e.date) < 0).reverse();
  const months = monthsSpanned(sorted);

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
                The calendar{updatedAt ? <> · updated <time dateTime={updatedAt}>{updatedAt.slice(0, 10)}</time></> : null}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              The dates that decide the agent economy
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Crawler walls, floor votes, comment dockets, grid audits, the conference corridor, the
              Bitcoin cycle clock — the machine economy gets shaped on specific days. We track them
              here, same as we track the rails on{' '}
              <a href="/#rail-pulse" className="text-blue-400 hover:text-blue-300">Rail Pulse</a> and
              the grid on <a href="/texas" className="text-blue-400 hover:text-blue-300">Texas Watch</a>.
              Sources linked on every entry.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/calendar/ics"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                📅 Add all to your calendar (.ics)
              </a>
              <span className="self-center text-xs text-slate-500">
                Works with Google Calendar, Apple Calendar, and Outlook — or grab single events below.
              </span>
            </div>
          </div>
        </section>

        {months.length ? (
          <section className="border-t border-white/[0.06] px-6 py-10" aria-label="Month view">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {months.map((mo) => (
                  <MonthGrid key={mo} month={mo} events={sorted} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-white/[0.06] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <ol className="relative space-y-6 border-l border-white/[0.08] pl-6">
              {upcoming.map((e, i) => {
                const d = daysOut(e.date);
                const tag = TAG_STYLE[e.tag] ?? TAG_STYLE.rails;
                return (
                  <li key={e.id || e.date + e.title} id={e.id || e.date} className="relative scroll-mt-24">
                    <span
                      className={`absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full ${
                        d <= 0 ? 'bg-blue-300' : i === 0 ? 'bg-blue-400' : 'bg-slate-600'
                      }`}
                      aria-hidden
                    />
                    <div className="rounded border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-blue-500/30">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <time dateTime={e.date} className="font-mono text-sm font-semibold text-slate-200">
                          {fmtDate(e.date)}{e.endDate ? ` – ${fmtShort(e.endDate)}` : ''}
                        </time>
                        <Countdown e={e} />
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
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        {e.link ? (
                          <a href={e.link} className="text-blue-400 hover:text-blue-300">Source →</a>
                        ) : null}
                        {e.post ? (
                          <a href={e.post} className="text-blue-400 hover:text-blue-300">Our coverage →</a>
                        ) : null}
                        {e.id ? (
                          <a href={`/calendar/ics?e=${e.id}`} className="text-slate-400 hover:text-blue-300">
                            📅 Add to calendar
                          </a>
                        ) : null}
                      </div>
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
                <ul className="mt-4 space-y-3">
                  {past.slice(0, 10).map((e) => (
                    <li key={e.id || e.date + e.title} id={e.id || e.date} className="scroll-mt-24 text-sm leading-6">
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <time dateTime={e.date} className="font-mono text-slate-500">{e.date}</time>
                        <span className="text-slate-300">{e.title}</span>
                        {e.link ? (
                          <a href={e.link} className="text-blue-400/80 hover:text-blue-300">source ↗</a>
                        ) : null}
                        {e.post ? (
                          <a href={e.post} className="text-blue-400/80 hover:text-blue-300">our coverage ↗</a>
                        ) : null}
                      </span>
                      <span className="block text-slate-500">{e.what}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <p className="mt-12 text-sm leading-6 text-slate-500">
              Kept current by the same collectors that feed our{' '}
              <a href="/brief" className="text-blue-400 hover:text-blue-300">Brief</a> — when a date
              moves or lands, this page updates. Educational material, not legal, financial, or
              investment advice; pattern projections are patterns, not predictions.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
