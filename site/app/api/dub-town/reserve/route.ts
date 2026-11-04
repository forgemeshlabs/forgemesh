import { NextResponse } from 'next/server';

// Old cached reservation forms must not promise a launch email or keep collecting leads.
export async function POST() {
  return NextResponse.json({ error: 'Dub Town is open. Visit dub.town and choose “Your site? Claim it for free” to receive your claim link.', claim_url: 'https://dub.town/?free=1' }, { status: 410 });
}
