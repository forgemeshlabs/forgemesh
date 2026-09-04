import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Affiliate redirect stubs for the free VIN checker (and anything else that
// needs a swappable outbound link). Destinations live in site/data/go-links.json
// — read per request, so a partner URL can be swapped in WITHOUT a rebuild or
// restart the moment an affiliate approval lands. Until then each partner
// falls back to a plain, untagged link. `{vin}` in a destination is replaced
// with the ?vin= query param. Every click is appended to data/go-clicks.jsonl
// for attribution independent of the browser-side Umami event.
const LINKS_FILE = path.join(process.cwd(), 'data', 'go-links.json');
const CLICKS = path.join(process.cwd(), 'data', 'go-clicks.jsonl');

// Plain fallbacks — no affiliate tags, honest destinations. Bumper + EpicVIN
// approvals pending (operator queue 2026-09-03); warranty partner unselected,
// so it points at the FTC's own consumer guide until one is wired.
const DEFAULTS: Record<string, string> = {
  bumper: 'https://www.bumper.com/',
  epicvin: 'https://epicvin.com/',
  warranty: 'https://consumer.ftc.gov/articles/auto-warranties-service-contracts',
};

function destinations(): Record<string, string> {
  try {
    const cfg = JSON.parse(fs.readFileSync(LINKS_FILE, 'utf8')) as Record<string, string>;
    return { ...DEFAULTS, ...cfg };
  } catch {
    return DEFAULTS;
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ partner: string }> }) {
  const { partner } = await params;
  const key = String(partner || '').toLowerCase();
  const dest = /^[a-z0-9-]{1,32}$/.test(key) ? destinations()[key] : undefined;
  if (!dest) return NextResponse.redirect(new URL('/vin', req.url), 302);

  const vin = (req.nextUrl.searchParams.get('vin') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
  const url = dest.replace('{vin}', encodeURIComponent(vin));

  try {
    fs.mkdirSync(path.dirname(CLICKS), { recursive: true });
    fs.appendFileSync(
      CLICKS,
      JSON.stringify({
        partner: key,
        vin: vin || null,
        ts: new Date().toISOString(),
        ref: req.headers.get('referer') || null,
        tagged: dest !== DEFAULTS[key],
      }) + '\n',
    );
  } catch {
    // logging is best-effort; never block the redirect
  }

  return NextResponse.redirect(url, { status: 302, headers: { 'Cache-Control': 'no-store' } });
}
