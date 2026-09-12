// x402 Verified by ForgeMesh — shields.io endpoint JSON fallback. Single-color by design
// (shields flattens score/perfect/paid into one message string), so the SVG badge at
// /badge/x402/<slug> is the canonical, multi-cell badge; this exists for zero-infra embeds
// (e.g. the mirrored badges/<slug>.json in the x402-verified repo itself).
import { findSeller, isSlug, badgeFor, badgeMessage, DELISTED_COLOR } from '@/lib/verified';
import { loadVerified } from '@/lib/verified-data';

export const dynamic = 'force-dynamic';

function headers() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400',
    'access-control-allow-origin': '*',
  };
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;

  const notListed = {
    schemaVersion: 1,
    label: 'x402 Verified by ForgeMesh',
    message: 'not listed',
    color: DELISTED_COLOR,
    cacheSeconds: 300,
  };

  if (!isSlug(slug)) {
    return Response.json(notListed, { status: 200, headers: headers() });
  }

  const feed = loadVerified();
  const seller = findSeller(feed, slug);
  if (!seller) {
    return Response.json(notListed, { status: 200, headers: headers() });
  }

  const b = badgeFor(seller);
  return Response.json(
    {
      schemaVersion: 1,
      label: 'x402 Verified by ForgeMesh',
      message: badgeMessage(b),
      color: b.scoreColor,
      cacheSeconds: 300,
    },
    { status: 200, headers: headers() },
  );
}
