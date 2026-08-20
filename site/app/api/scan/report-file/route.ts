import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getCheckoutSession } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

// Downloadable copy of a purchased scan report. Verifies the Stripe session
// before serving the persisted JSON — the session id is the access token.
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id') ?? '';
  if (!/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ error: 'invalid session id' }, { status: 400 });
  }
  try {
    const session = await getCheckoutSession(sessionId);
    if (!session.paid) return NextResponse.json({ error: 'payment not confirmed' }, { status: 403 });
  } catch {
    return NextResponse.json({ error: 'payment not confirmed' }, { status: 403 });
  }

  const file = path.join(process.cwd(), 'data', 'scan-reports', `${sessionId}.json`);
  try {
    const body = await fs.readFile(file, 'utf8');
    return new NextResponse(body, {
      headers: {
        'content-type': 'application/json',
        'content-disposition': 'attachment; filename="forgemesh-scan-report.json"',
        'x-robots-tag': 'noindex',
      },
    });
  } catch {
    return NextResponse.json({ error: 'No saved report yet — open your report page once first.' }, { status: 404 });
  }
}
