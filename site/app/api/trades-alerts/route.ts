import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Congress Trades alert signups. Appends to site/data/trades-alerts.jsonl —
// the send side is a separate script; this just captures and dedupes.
const STORE = path.join(process.cwd(), 'data', 'trades-alerts.jsonl');

// In-memory per-IP rate limit — resets on restart, good enough for v1.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many signups from this address — try later.' }, { status: 429 });
  }

  let email: string;
  try {
    const body = await req.json();
    email = String(body?.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Send JSON: {"email": "you@example.com"}' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'That does not look like a valid email.' }, { status: 400 });
  }

  try {
    fs.mkdirSync(path.dirname(STORE), { recursive: true });
    // Dedupe: file stays small (one line per signup).
    if (fs.existsSync(STORE)) {
      const existing = fs.readFileSync(STORE, 'utf8');
      if (existing.includes(`"email":${JSON.stringify(email)}`)) {
        return NextResponse.json({ ok: true, already: true });
      }
    }
    fs.appendFileSync(
      STORE,
      JSON.stringify({ email, ts: new Date().toISOString(), source: 'trades' }) + '\n',
    );
  } catch {
    return NextResponse.json({ error: 'Could not save — try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
