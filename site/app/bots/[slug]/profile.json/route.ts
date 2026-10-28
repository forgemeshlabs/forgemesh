import { NextResponse } from 'next/server';
import { botBySlug, fetchObserved, profileJson } from '@/lib/bots';

export const dynamic = 'force-dynamic';

// The machine-readable twin of /bots/[slug]. Humans in a browser read it free;
// the middleware answers 402 to every other client and points payers at the
// Utility Grid origin, which settles and serves the same JSON.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = botBySlug(slug);
  if (!b) return NextResponse.json({ error: 'unknown bot' }, { status: 404 });
  const observed = await fetchObserved(b.name);
  // Served only to browsers (the middleware answers 402 to everything else), so never let a shared cache hand it to a bot.
  return NextResponse.json(profileJson(b, observed), { headers: { 'cache-control': 'private, no-store', vary: 'Accept, User-Agent' } });
}
