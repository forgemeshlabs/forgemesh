'use client';
// Home-page countdown strip (temporary by design — sits above Rail Pulse).
// Reads /calendar.json (same file that powers /calendar) and shows every
// upcoming event flagged `home: true`, soonest first. Cards expire on their
// own: an event drops off once its last day (UTC) has passed, and the whole
// strip disappears when nothing is left. Edit public/calendar.json — no rebuild.
import { useEffect, useState } from 'react';

type CalEvent = {
  id?: string;
  date: string;
  endDate?: string;
  title: string;
  time?: string;
  home?: boolean;
  status?: string;
  result?: string | null;
};

function daysOut(date: string): number {
  const today = new Date().toISOString().slice(0, 10);
  return Math.round((new Date(date).getTime() - new Date(today).getTime()) / 864e5);
}

function fmtShort(date: string): string {
  return new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function label(e: CalEvent): { text: string; cls: string } {
  const d = daysOut(e.date);
  const dEnd = daysOut(e.endDate || e.date);
  if (d > 1) return { text: `${d} days`, cls: 'text-blue-200' };
  if (d === 1) return { text: 'tomorrow', cls: 'text-blue-100' };
  if (d <= 0 && dEnd >= 0) return { text: 'today', cls: 'text-blue-50' };
  return { text: 'done', cls: 'text-slate-500' }; // unreachable after the >= 0 filter; kept for safety
}

export function CalendarStrip() {
  const [events, setEvents] = useState<CalEvent[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/calendar.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (cancelled) return;
        const list: CalEvent[] = (d?.events || [])
          .filter((e: CalEvent) => e.home && daysOut(e.endDate || e.date) >= 0)
          .sort((a: CalEvent, b: CalEvent) => a.date.localeCompare(b.date))
          .slice(0, 3);
        setEvents(list);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!events || !events.length) return null;

  return (
    <section className="scroll-mt-24 w-full py-6 text-left" id="the-dates" aria-label="Countdown">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">The Dates</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
            days that decide the agent economy &middot;{' '}
            <a href="/calendar" className="text-blue-400 hover:text-blue-300">full calendar &rarr;</a>
          </p>
        </div>
        <div className={`grid gap-3 ${events.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
          {events.map((e) => {
            const l = label(e);
            const href = `/calendar#${e.id || e.date}`;
            return (
              <a
                key={e.id || e.date + e.title}
                href={href}
                className="group flex items-center gap-4 rounded border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-all hover:border-blue-500/40"
              >
                <span className="flex min-w-[4.5rem] flex-col items-center justify-center rounded border border-blue-500/30 bg-blue-500/[0.08] px-2 py-2">
                  <span className={`font-mono text-2xl font-semibold leading-none ${l.cls}`}>{l.text.split(' ')[0]}</span>
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {l.text.includes(' ') ? l.text.split(' ').slice(1).join(' ') : 'countdown'}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-snug text-slate-100 group-hover:text-blue-200">{e.title}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-slate-500">
                    {fmtShort(e.date)}{e.endDate ? `–${fmtShort(e.endDate)}` : ''}{e.time ? ` · ${e.time}` : ''}
                  </span>
                  {e.result ? <span className="mt-0.5 block text-xs text-emerald-300/90">{e.result}</span> : null}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
