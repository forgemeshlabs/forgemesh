// Server-only loader for the x402 Verified feed. Kept separate from lib/verified.ts
// (types + pure helpers) so client components never pull `fs` into their bundle.
import fs from 'fs';
import path from 'path';
import { EMPTY_FEED, type VerifiedFeed } from './verified';

/** Reads public/partners.json (written by scripts/verified-sync.js). Falls back to an
 * empty, schema-shaped feed on any read/parse/shape failure so the page never 500s. */
export function loadVerified(): VerifiedFeed {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'partners.json'), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 2 && Array.isArray(parsed.sellers) && Array.isArray(parsed.partners)) {
      return parsed as VerifiedFeed;
    }
    return EMPTY_FEED;
  } catch {
    return EMPTY_FEED;
  }
}
