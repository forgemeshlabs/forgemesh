import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// tikbotshop.com is its own site (~/dev/tikbotshop, port 3975). Until the
// Cloudflare tunnel hostname is repointed to :3975, every request that
// arrives here with that host is proxied to the standalone app, so no
// forgemesh.io page is ever served under the tikbotshop.com hostname.
const TIKBOT_ORIGIN = 'http://127.0.0.1:3975';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase();
  if (host === 'tikbotshop.com' || host === 'www.tikbotshop.com' || host.startsWith('tikbotshop.com:') || host.startsWith('www.tikbotshop.com:')) {
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, TIKBOT_ORIGIN);
    return NextResponse.rewrite(url);
  }

  // Gate direct access to raw VIN-problems JSON files with x402.
  // HTML pages at /vin/[slug] remain free (SEO + affiliate funnel).
  // Programmatic structured-data consumers pay $0.005/call via the stuffer.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/vin-problems/') && pathname.endsWith('.json')) {
    const slug = pathname.slice('/vin-problems/'.length, -'.json'.length);
    const paidUrl = `https://x402.forgemesh.io/vehicle-problems/${slug}`;
    const body = {
      x402Version: 2,
      error: 'Payment required',
      resource: {
        url: paidUrl,
        description: `Structured NHTSA complaint, recall, and failure data for ${slug} — ranked components, severity rollup, and curated owner excerpts. $0.005/call.`,
        mimeType: 'application/json',
      },
      accepts: [
        {
          scheme: 'exact',
          network: 'eip155:8453',
          amount: '5000',
          asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          payTo: '0x1304EC1A8945365e43A5c18a734065f107B417cA',
          maxTimeoutSeconds: 300,
          extra: { name: 'USD Coin', version: '2' },
        },
      ],
    };
    return new NextResponse(JSON.stringify(body), {
      status: 402,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
