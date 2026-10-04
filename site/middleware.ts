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

  // Block direct access to raw VIN-problems JSON files.
  // HTML pages at /vin/[slug] remain free (SEO + affiliate funnel).
  // Programmatic structured-data access belongs behind the paid API.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/vin-problems/') && pathname.endsWith('.json')) {
    return new NextResponse(
      JSON.stringify({ error: 'Direct JSON access is not available. Use the /vin/[slug] page or the paid API endpoint.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
