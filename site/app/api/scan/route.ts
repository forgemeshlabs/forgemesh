import { NextRequest, NextResponse } from 'next/server';
import { runScan, runServiceScan, ScanInputError } from '@/lib/scan';

export const dynamic = 'force-dynamic';

// Free-tier scan: full grade, first finding, count of the rest.
// In-memory per-IP rate limit — resets on restart, good enough for v1.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

// Trusted internal callers (the ForgeMesh plugin MCP on the router) share one
// egress IP for every end user, so they get their own, larger bucket keyed by
// a secret header instead of the per-IP one. Key lives in FORGEMESH_INTERNAL_KEY.
const INTERNAL_MAX_PER_WINDOW = 300;
function internalCaller(req: NextRequest): boolean {
  const k = process.env.FORGEMESH_INTERNAL_KEY;
  return !!k && req.headers.get('x-forgemesh-internal') === k;
}
function rateLimited(ip: string, max = MAX_PER_WINDOW): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10000) hits.clear(); // crude memory cap
  return false;
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if ((internalCaller(req) ? rateLimited('internal:plugin', INTERNAL_MAX_PER_WINDOW) : rateLimited(ip))) {
    return NextResponse.json(
      { error: 'Rate limit reached — 10 free scans per hour. Agents can scan without limits via the paid x402 endpoint.' },
      { status: 429 },
    );
  }

  let url: string;
  try {
    const body = await req.json();
    url = String(body?.url ?? '');
  } catch {
    return NextResponse.json({ error: 'Send JSON: {"url": "https://..."}' }, { status: 400 });
  }

  try {
    const r = await runScan(url);

    // Scanned a service root (200 + discovery manifest)? Scan its actual routes
    // instead of scolding the user about a directory page — free tier caps at 8.
    if (r.service_root_hint) {
      const svc = await runServiceScan(url, 8);
      if (svc.scanned > 0) {
        return NextResponse.json({
          mode: 'service',
          origin: svc.origin,
          total_routes: svc.total_routes,
          scanned: svc.scanned,
          summary: svc.summary,
          mpp_dual_stack_count: svc.mpp_dual_stack_count,
          routes: svc.routes.map(({ findings: _findings, ...rest }) => rest),
        });
      }
    }

    return NextResponse.json({
      mode: 'single',
      url: r.url,
      grade: r.grade,
      reachable: r.reachable,
      http_status: r.http_status,
      is_402: r.is_402,
      x402_envelope: r.x402_envelope,
      envelope_valid: r.envelope_valid,
      mpp_dual_stack: r.mpp_dual_stack,
      method_used: r.method_used,
      response_time_ms: r.response_time_ms,
      first_finding: r.findings[0] ?? null,
      findings_count: r.findings.length,
    });
  } catch (e) {
    if (e instanceof ScanInputError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Scan failed — try again in a moment.' }, { status: 500 });
  }
}
