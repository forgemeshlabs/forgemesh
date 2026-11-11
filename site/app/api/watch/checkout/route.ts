import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ForgeMesh Watch is shelved (operator decision 2026-11-11). The subscription could be
// bought through this route while the product behind it did not reliably record
// subscribers, detect dead hosts, or offer a way to cancel. Nothing may start a paid
// Watch checkout until that is built and tested end to end.
export async function POST() {
  return NextResponse.json({ error: 'ForgeMesh Watch is not available.' }, { status: 410 });
}
