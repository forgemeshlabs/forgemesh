import { NextResponse } from 'next/server';
import { getLiveShopCatalog } from '@/lib/shop';

// Machine-readable feed for the Agent Shop — agents consume this instead of
// scraping /shop. coming_soon rows are withheld until they have a real
// destination.
export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  const products = getLiveShopCatalog();
  return NextResponse.json(
    { count: products.length, products },
    { headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=60' } },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
