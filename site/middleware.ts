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
          payTo: '0x850363a27F0aC6fEb9C7a3eC4C1d295262dF9432',
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

  // Crawler Atlas: the JSON twin of each bot profile is free for a person in a
  // browser and $0.005 for machines (x402, USDC on Base). Mirrors the VIN JSON
  // gate: non-browser clients always get the 402 here; payment settles at the
  // Utility Grid origin named in resource.url, never by header presence.
  let decodedPath = pathname;
  try { decodedPath = decodeURIComponent(pathname).toLowerCase(); } catch { decodedPath = pathname.toLowerCase(); }
  if (/^\/bots\/[a-z0-9-]+\/profile\.json$/.test(decodedPath)) {
    const accept = request.headers.get('accept') ?? '';
    const ua = request.headers.get('user-agent') ?? '';
    const browser = accept.includes('text/html') && /Mozilla\/5\.0/.test(ua) && !/bot|crawl|spider|python|curl|wget|java|go-http|node|fetch|axios/i.test(ua);
    if (!browser) {
      const slug = decodedPath.split('/')[2];
      const paidUrl = 'https://x402.forgemesh.io/atlas-profile';
      const body = {
        x402Version: 2,
        error: 'Payment required',
        resource: { url: paidUrl, description: `Crawler Atlas profile of ${slug}: operator, purpose, user agents, robots token, verification, whether it pays, and network observations. $0.005/call: POST {"slug":"${slug}"} to ${paidUrl}. Humans read it free at https://forgemesh.io/bots/${slug}.`, mimeType: 'application/json' },
        accepts: [{ scheme: 'exact', network: 'eip155:8453', amount: '5000', asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', payTo: '0x850363a27F0aC6fEb9C7a3eC4C1d295262dF9432', maxTimeoutSeconds: 300, extra: { name: 'USD Coin', version: '2' } }],
      };
      return new NextResponse(JSON.stringify(body), { status: 402, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Accept, User-Agent', 'PAYMENT-REQUIRED': btoa(JSON.stringify(body)) } });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
