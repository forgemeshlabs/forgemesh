import { NextRequest, NextResponse } from 'next/server';
import { buildVinReport, cachedReport, cleanVin, VinInputError } from '@/lib/vin-report';

export const dynamic = 'force-dynamic';

// Free VIN report for humans (forgemesh.io/vin). Hits the free gov upstreams
// server-side — never our own paid x402 endpoints. Per-IP rate limit counts
// only cache MISSES (those are the calls that touch government servers);
// re-viewing a warm VIN is free. In-memory, resets on restart.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10000) hits.clear(); // crude memory cap
  return false;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('vin') || '';
  let vin: string;
  try {
    vin = cleanVin(raw);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  const warm = cachedReport(vin);
  if (warm) return NextResponse.json({ ...warm, cached: true }, { headers: { 'Cache-Control': 'private, max-age=300' } });

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'That is 10 fresh lookups in an hour — the government sources ask us to go easy. Try again a little later, or use the pay-per-call API for volume.' },
      { status: 429 },
    );
  }

  try {
    const report = await buildVinReport(vin);
    return NextResponse.json({ ...report, cached: false }, { headers: { 'Cache-Control': 'private, max-age=300' } });
  } catch (err) {
    if (err instanceof VinInputError) return NextResponse.json({ error: err.message }, { status: 400 });
    return NextResponse.json(
      { error: 'The vehicle decoder is not answering right now — try again in a minute.' },
      { status: 503 },
    );
  }
}
