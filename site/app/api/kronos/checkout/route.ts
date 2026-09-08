import { NextResponse } from 'next/server';
import { createKronosCheckout } from '@/lib/stripe';
import { getFieldGuideOffer } from '@/lib/kronos-field-guide';
import { validateKronosAcceptance } from '@/lib/kronos-contract';

export const dynamic = 'force-dynamic';
// Old links return to the purchase form; GET never creates a payment session.
export async function GET() {
  return NextResponse.redirect('https://forgemesh.io/kronos/field-guide#purchase', 303);
}
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin !== new URL(request.url).origin) return NextResponse.json({error:'Please use the purchase form on this site.'}, {status:403});
  if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return NextResponse.json({error:'Use the purchase form.'}, {status:415});
  const body = await request.text();
  if (body.length > 4096) return NextResponse.json({error:'Purchase form too large.'}, {status:413});
  const form = new URLSearchParams(body);
  const acceptance = {termsVersion: form.get('terms_version') || '', termsAccepted: form.get('terms_accepted') === 'yes', immediateDelivery: form.get('immediate_delivery') === 'yes'};
  if (!validateKronosAcceptance(acceptance)) return NextResponse.json({error:'Review the current purchase terms and explicitly request immediate digital delivery before continuing.', purchaseUrl:'/kronos/field-guide#purchase'}, {status:400});
  try {
    const offer = getFieldGuideOffer();
    const session = await createKronosCheckout(offer.priceId, acceptance);
    return NextResponse.redirect(session.url, 303);
  } catch {
    // Provider error payloads can contain sensitive request data.
    console.error('[kronos-checkout] Session creation failed');
    return NextResponse.json({error:'Checkout is temporarily unavailable. No order has been confirmed. Try again or contact support@forgemesh.io.'}, {status:503});
  }
}
