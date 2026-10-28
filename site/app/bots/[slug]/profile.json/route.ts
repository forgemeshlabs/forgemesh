import { NextResponse } from 'next/server';
import { botBySlug, fetchObserved, profileJson } from '@/lib/bots';

export const dynamic = 'force-dynamic';

// The machine-readable twin of /bots/[slug]. Bots and agents pay $0.005 for it
// (middleware answers 402 to non-browser clients); humans in a browser read it free.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = botBySlug(slug);
  if (!b) return NextResponse.json({ error: 'unknown bot' }, { status: 404 });
  const observed = await fetchObserved(b.name);
  return NextResponse.json(profileJson(b, observed), { headers: { 'cache-control': 'public, max-age=600' } });
}
