// x402 Verified by ForgeMesh — types + pure helpers for the machine feed synced to
// public/partners.json by scripts/verified-sync.js from forgemeshlabs/x402-verified
// (dist/verified.json). Mirrors schema/verified-feed.schema.json and the record shape
// built by that repo's scripts/build.js. Read-only on the site: this repo never scores
// or pays anyone, it only renders what the x402-verified repo published.
//
// This module has no Node built-ins (no `fs`) on purpose so client components (e.g.
// VerifiedDirectory) can import its types and pure functions directly. The actual
// public/partners.json file read lives in lib/verified-data.ts (server-only).

export type ScoreBand = 'excellent' | 'ready' | 'friction' | 'at-risk';
export type SellerStatus = 'active' | 'degraded' | 'delisted';

export type VerifiedEndpoint = {
  url: string;
  method: 'GET' | 'POST';
  price_usdc: string;
  body?: Record<string, unknown>;
};

export type ScoreDetail = {
  dimension: 'payability' | 'reliability' | 'interoperability' | 'discoverability' | string;
  points: number;
  max: number;
  check: string;
  ok: boolean;
};

export type VerifiedProbe = {
  at: string;
  pass?: boolean;
  is_402?: boolean;
  envelope_valid?: boolean;
  payto_match?: boolean;
  header_envelope?: boolean;
  body_envelope?: boolean;
  x402_version_2?: boolean;
  mpp_header?: boolean;
  ms?: number | null;
  manifest_ok?: boolean;
  manifest_lists_route?: boolean;
  llms_ok?: boolean;
};

export type ProtocolCapability = {
  supported: boolean;
  verified: boolean;
  version?: number | null;
  note?: string;
};

export type ProtocolCapabilities = {
  x402: ProtocolCapability;
  mpp: ProtocolCapability;
};

export type ProofCheck = {
  ok: boolean;
  reason: string | null;
  tx_hash: string;
  block: number | null;
  block_time: string | null;
  amount_atomic: string | null;
  payer: string | null;
  confirmations: number | null;
  checked_at: string;
};

export type VerifiedSeller = {
  slug: string;
  name: string;
  homepage: string;
  description?: string;
  protocols: string[];
  endpoints: VerifiedEndpoint[];
  nominated_endpoint?: number;
  payTo: string;
  networks: string[];
  networks_detected?: string[];
  score: number;
  score_band: ScoreBand;
  dimensions: {
    payability: number;
    reliability: number;
    interoperability: number;
    discoverability: number;
  };
  score_details?: ScoreDetail[];
  status: SellerStatus;
  perfect: boolean;
  forgemesh_paid: boolean;
  forgemesh_paid_at?: string | null;
  forgemesh_paid_tx?: string | null;
  forgemesh_paid_amount_atomic?: string | null;
  forgemesh_paid_stale?: boolean;
  proof?: { tx_hash: string; endpoint: number; payer_kind: 'self' };
  proof_check?: ProofCheck | null;
  probes?: VerifiedProbe[];
  last_probe?: string | null;
  bazaar_listed?: boolean;
  protocol_capabilities: ProtocolCapabilities;
  contact?: string;
  added_at?: string;
  page?: string;
  badge?: string;
};

export type VerifiedPartner = {
  name: string;
  slug: string;
  homepage: string;
  description: string;
  kind: 'network' | 'index' | 'directory' | 'tooling';
  status: 'live' | 'integration-pending';
  status_note?: string;
  added_at: string;
};

export type VerifiedFeed = {
  version: 2;
  program: 'x402';
  generated_at: string;
  score_spec: string;
  disclaimer: string;
  marks?: Record<string, string>;
  sellers: VerifiedSeller[];
  partners: VerifiedPartner[];
};

export const DEFAULT_DISCLAIMER =
  'x402 Verified by ForgeMesh is an independent ForgeMesh program. It is not an x402 Foundation or Coinbase certification, endorsement, or official program. A listing records checks and a settled payment at a point in time; it is not a warranty or guarantee.';

export const EMPTY_FEED: VerifiedFeed = {
  version: 2,
  program: 'x402',
  generated_at: '',
  score_spec: '2.0',
  disclaimer: DEFAULT_DISCLAIMER,
  sellers: [],
  partners: [],
};

export function findSeller(feed: VerifiedFeed, slug: string): VerifiedSeller | undefined {
  return feed.sellers.find((s) => s.slug === slug);
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
export function isSlug(v: string): boolean {
  return SLUG_RE.test(v);
}

export const BAND_LABEL: Record<ScoreBand, string> = {
  excellent: 'Excellent',
  ready: 'Ready',
  friction: 'Friction',
  'at-risk': 'At Risk',
};

// Badge/UI color rule (operator spec, 2026-09-11): the score cell is colored by current
// band or status only. Perfect (★) is always gold. Paid ($) is always green. No mark
// changes another mark's color.
export const BAND_COLOR: Record<ScoreBand, string> = {
  excellent: '2ea44f',
  ready: '3b82f6',
  friction: 'e0a100',
  'at-risk': 'e05d44',
};
export const DELISTED_COLOR = '9f9f9f';
export const GOLD_COLOR = 'd4a017';
export const PAID_COLOR = '2ea44f';

export type Badge = { scoreText: string; scoreColor: string; perfect: boolean; paid: boolean };

/** The four independent signals, flattened for rendering: score text + its band/status
 * color, whether ★ (perfect, always gold) applies, whether $ (ForgeMesh Paid, always
 * green) applies. Never let one signal change another's color. */
export function badgeFor(
  seller: Pick<VerifiedSeller, 'status' | 'score' | 'score_band' | 'perfect' | 'forgemesh_paid'>,
): Badge {
  const delisted = seller.status === 'delisted';
  return {
    scoreText: delisted ? 'delisted' : `${seller.score}/100`,
    scoreColor: delisted ? DELISTED_COLOR : BAND_COLOR[seller.score_band],
    perfect: !!seller.perfect,
    paid: !!seller.forgemesh_paid,
  };
}

/** Single-string flattening for the shields.io endpoint fallback, which only carries one
 * message + one color. The SVG badge at /badge/x402/<slug> is the canonical, multi-cell
 * badge and should be preferred wherever a rendered image is possible. */
export function badgeMessage(b: Badge): string {
  const parts = [b.scoreText];
  if (b.perfect) parts.push('★');
  if (b.paid) parts.push('$');
  return parts.join(' · ');
}

export function cheapestEndpoint(seller: VerifiedSeller): VerifiedEndpoint | null {
  if (!seller.endpoints?.length) return null;
  return seller.endpoints.reduce((a, b) => (Number(a.price_usdc) <= Number(b.price_usdc) ? a : b));
}
