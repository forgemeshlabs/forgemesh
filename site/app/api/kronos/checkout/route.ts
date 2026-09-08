import { NextResponse } from 'next/server';
import { createKronosCheckout } from '@/lib/stripe';
import { getFieldGuideOffer } from '@/lib/kronos-field-guide';

export const dynamic = 'force-dynamic';

// GET so the sales page can use a plain link. Picks launch/regular price by date at click time.
export async function GET() {
  try {
    const offer = getFieldGuideOffer();
    const session = await createKronosCheckout(offer.priceId);
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    console.error('[kronos-checkout]', (e as Error).message);
    return NextResponse.json({ error: 'Could not start checkout — try again in a moment.' }, { status: 500 });
  }
}
