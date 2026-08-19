import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

// TikTok OAuth redirect target. Register this exact URL in the TikTok developer
// portal: https://forgemesh.io/api/auth/tiktok/callback
// With TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET in .env.local it exchanges the
// code for tokens and stores them server-side (never echoed to the browser).
// Without them it stores the raw code so the exchange can be run manually.

const STORE = path.join(process.cwd(), 'data', 'tiktok-oauth.json');

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const error = params.get('error');
  if (error) {
    return new NextResponse(`TikTok authorization failed: ${error}. ${params.get('error_description') || ''}`, { status: 400 });
  }
  const code = params.get('code');
  if (!code) return new NextResponse('Missing code parameter.', { status: 400 });

  const record: Record<string, unknown> = { received_at: new Date().toISOString(), state: params.get('state') };

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (clientKey && clientSecret) {
    try {
      const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: 'https://forgemesh.io/api/auth/tiktok/callback',
        }).toString(),
        signal: AbortSignal.timeout(15000),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        record.exchange_error = json.error_description || json.error || `HTTP ${res.status}`;
      } else {
        record.token = json; // access_token, refresh_token, open_id, scope, expires_in
      }
    } catch (e) {
      record.exchange_error = (e as Error).message;
    }
  } else {
    record.pending_code = code; // no creds configured yet — keep for manual exchange
  }

  await fs.mkdir(path.dirname(STORE), { recursive: true });
  await fs.writeFile(STORE, JSON.stringify(record, null, 2), { mode: 0o600 });

  const ok = Boolean((record as { token?: unknown }).token);
  const pending = Boolean((record as { pending_code?: unknown }).pending_code);
  const msg = ok
    ? 'TikTok account connected. You can close this tab.'
    : pending
      ? 'Authorization code received and stored — token exchange will run once API credentials are configured.'
      : `Token exchange failed: ${(record as { exchange_error?: string }).exchange_error}`;
  return new NextResponse(msg, { status: ok || pending ? 200 : 502, headers: { 'content-type': 'text/plain' } });
}
