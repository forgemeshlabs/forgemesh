// iCalendar feed for the ForgeMesh calendar — lets readers add events to
// phone/desktop calendars. /calendar/ics downloads every event; ?e=<id>
// downloads one. Reads public/calendar.json per request, so new events flow
// into fresh downloads with no rebuild.
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

type CalEvent = {
  id?: string;
  date: string;
  endDate?: string;
  title: string;
  what: string;
  why: string;
  link?: string;
  post?: string;
};

function icsEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// All-day event: DTEND is exclusive, so add one day to the (inclusive) end date.
function dayAfter(date: string): string {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function toVevent(e: CalEvent): string {
  const uid = `${e.id || e.date}@forgemesh.io`;
  const start = e.date.replace(/-/g, '');
  const end = dayAfter(e.endDate || e.date).replace(/-/g, '');
  const desc = [e.what, '', `Why it matters: ${e.why}`, e.link ? `Source: ${e.link}` : '', e.post ? `Our coverage: https://forgemesh.io${e.post}` : '']
    .filter(Boolean)
    .join('\n');
  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsEscape(e.title)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    `URL:https://forgemesh.io/calendar`,
    'END:VEVENT',
  ].join('\r\n');
}

export async function GET(req: Request) {
  let events: CalEvent[] = [];
  try {
    events = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public', 'calendar.json'), 'utf8')
    ).events;
  } catch {}

  const id = new URL(req.url).searchParams.get('e');
  const selected = id ? events.filter((e) => e.id === id) : events;
  if (!selected.length) return new Response('Not found', { status: 404 });

  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ForgeMesh Labs//Agent Economy Calendar//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:ForgeMesh — Agent Economy Calendar',
    ...selected.map(toVevent),
    'END:VCALENDAR',
  ].join('\r\n');

  const fname = id ? `forgemesh-${id}.ics` : 'forgemesh-calendar.ics';
  return new Response(body, {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': `attachment; filename="${fname}"`,
      'cache-control': 'no-cache',
    },
  });
}
