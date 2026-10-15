// Server-only loader for the x402 Verified feed. Kept separate from lib/verified.ts
// (types + pure helpers) so client components never pull `fs` into their bundle.
import fs from 'fs';
import path from 'path';
import { EMPTY_FEED, EMPTY_UNCLAIMED, type UnclaimedFeed, type VerifiedFeed } from './verified';

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

/** Reads public/unclaimed.json (written by scripts/verified-sync.js from the x402-verified
 * repo's dist/unclaimed.json). Empty feed on any failure so /verified never 500s. */
// The feed is ~2 MB; parsing it per request is the dominant cost of /verified, so the parsed
// object is kept per process and reused until the file's mtime changes (sync rewrites it).
let unclaimedCache: { mtimeMs: number; feed: UnclaimedFeed } | null = null;

export function loadUnclaimed(): UnclaimedFeed {
  try {
    const file = path.join(process.cwd(), 'public', 'unclaimed.json');
    const { mtimeMs } = fs.statSync(file);
    if (unclaimedCache && unclaimedCache.mtimeMs === mtimeMs) return unclaimedCache.feed;
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (parsed && parsed.version === 1 && Array.isArray(parsed.rows)) {
      unclaimedCache = { mtimeMs, feed: parsed as UnclaimedFeed };
      return unclaimedCache.feed;
    }
    return EMPTY_UNCLAIMED;
  } catch {
    return EMPTY_UNCLAIMED;
  }
}
