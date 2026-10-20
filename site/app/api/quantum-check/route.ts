import { NextRequest, NextResponse } from 'next/server';
import { cached, cleanDomain, runQuantumCheck, QuantumInputError } from '@/lib/quantum-check';
export const dynamic = 'force-dynamic';

// Free, rate-limited (cache misses only): 20 checks per IP per hour.
const WINDOW_MS = 60 * 60 * 1000; const MAX = 20;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(); const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX) { hits.set(ip, recent); return true; }
  recent.push(now); hits.set(ip, recent); if (hits.size > 10000) hits.clear(); return false;
}

export async function GET(req: NextRequest) {
  let domain: string;
  try { domain = cleanDomain(req.nextUrl.searchParams.get('domain') || ''); } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 400 }); }
  const warm = cached(domain);
  if (warm) return NextResponse.json({ ...warm, cached: true }, { headers: { 'Cache-Control': 'private, max-age=120' } });
  // All traffic reaches this origin through the Cloudflare tunnel, so cf-connecting-ip is the trusted client address; no header fallback.
  const ip = req.headers.get('cf-connecting-ip') || 'untrusted';
  if (limited(ip)) return NextResponse.json({ error: 'Rate limit: 20 checks per hour. Agents can use the paid route at x402.forgemesh.io/quantum-readiness.' }, { status: 429 });
  try {
    const report = await runQuantumCheck(domain);
    return NextResponse.json(report, { headers: { 'Cache-Control': 'private, max-age=120' } });
  } catch (e) {
    if (e instanceof QuantumInputError) return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: 'Check failed. Try again in a minute.' }, { status: 502 });
  }
}
