import { NextRequest, NextResponse } from 'next/server';
import { validateScanTarget, ScanInputError } from '@/lib/scan';
import { createWatchCheckout } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let url: string;
  try {
    const body = await req.json();
    url = String(body?.url ?? '');
  } catch {
    return NextResponse.json({ error: 'Send JSON: {"url": "https://..."}' }, { status: 400 });
  }

  try {
    const target = await validateScanTarget(url);
    const session = await createWatchCheckout(target.href);
    return NextResponse.json({ checkout_url: session.url });
  } catch (e) {
    if (e instanceof ScanInputError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error('[watch-checkout]', (e as Error).message);
    return NextResponse.json({ error: 'Could not start checkout — try again in a moment.' }, { status: 500 });
  }
}
