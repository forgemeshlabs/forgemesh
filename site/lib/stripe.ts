// Minimal Stripe REST client (checkout create + retrieve) — no SDK dependency.
// Requires STRIPE_SECRET_KEY in .env.local (never expose client-side).

const STRIPE_API = 'https://api.stripe.com/v1';

function key(): string {
  const k = process.env.STRIPE_SECRET_KEY;
  if (!k) throw new Error('STRIPE_SECRET_KEY not configured');
  return k;
}

async function stripeRequest(method: 'GET' | 'POST', path: string, form?: Record<string, string>) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key()}`,
      ...(form ? { 'content-type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: form ? new URLSearchParams(form).toString() : undefined,
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Stripe ${res.status}: ${json?.error?.message || 'request failed'}`);
  }
  return json;
}

export async function createScanCheckout(scanUrl: string): Promise<{ id: string; url: string }> {
  const session = await stripeRequest('POST', '/checkout/sessions', {
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': '500',
    'line_items[0][price_data][product_data][name]': 'ForgeMesh Endpoint Scan Report',
    'line_items[0][price_data][product_data][description]': `Full x402/MPP health report with fixes for ${scanUrl}`,
    'metadata[scan_url]': scanUrl,
    success_url: 'https://forgemesh.io/scan/report?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://forgemesh.io/scan',
  });
  return { id: session.id, url: session.url };
}

export async function getCheckoutSession(sessionId: string): Promise<{ paid: boolean; scanUrl: string | null }> {
  if (!/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) throw new Error('invalid session id');
  const session = await stripeRequest('GET', `/checkout/sessions/${sessionId}`);
  return {
    paid: session.payment_status === 'paid',
    scanUrl: session.metadata?.scan_url ?? null,
  };
}

export async function createWatchCheckout(watchUrl: string): Promise<{ id: string; url: string }> {
  const session = await stripeRequest('POST', '/checkout/sessions', {
    mode: 'subscription',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': '500',
    'line_items[0][price_data][recurring][interval]': 'month',
    'line_items[0][price_data][product_data][name]': 'ForgeMesh Watch',
    'line_items[0][price_data][product_data][description]': `Daily health monitoring + alerts for ${watchUrl}`,
    'metadata[watch_url]': watchUrl,
    'subscription_data[metadata][watch_url]': watchUrl,
    success_url: 'https://forgemesh.io/watch/confirmed?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://forgemesh.io/scan',
  });
  return { id: session.id, url: session.url };
}

export async function getWatchSession(sessionId: string): Promise<{
  paid: boolean;
  watchUrl: string | null;
  subscriptionId: string | null;
  customerEmail: string | null;
}> {
  if (!/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) throw new Error('invalid session id');
  const session = await stripeRequest('GET', `/checkout/sessions/${sessionId}`);
  return {
    paid: session.payment_status === 'paid',
    watchUrl: session.metadata?.watch_url ?? null,
    subscriptionId: typeof session.subscription === 'string' ? session.subscription : (session.subscription?.id ?? null),
    customerEmail: session.customer_details?.email ?? null,
  };
}
