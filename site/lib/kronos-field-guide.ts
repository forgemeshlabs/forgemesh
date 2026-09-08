// Kronos Field Guide offer. Price switches automatically: launch price until
// LAUNCH_ENDS_AT (UTC), regular price after. The checkout route reads the same
// function at click time, so the charge always matches the label.
export const KRONOS_PRICE_LAUNCH = 'price_1UDSjtDgD879ZmySMNmw4Jpu'; // $19
export const KRONOS_PRICE_REGULAR = 'price_1UDSjtDgD879ZmySBJttpk10'; // $29
export const LAUNCH_ENDS_AT = Date.UTC(2026, 8, 15, 23, 59, 59); // 2026-09-15 23:59:59 UTC

export type FieldGuideOffer = {
  priceId: string;
  amountUsd: number;
  priceLabel: string;
  launch: boolean;
  launchNote: string | null;
  checkoutUrl: string;
};

export function getFieldGuideOffer(now: number = Date.now()): FieldGuideOffer {
  const launch = now <= LAUNCH_ENDS_AT;
  return {
    priceId: launch ? KRONOS_PRICE_LAUNCH : KRONOS_PRICE_REGULAR,
    amountUsd: launch ? 19 : 29,
    priceLabel: launch ? '$19' : '$29',
    launch,
    launchNote: launch ? 'Launch price through September 15, 2026 (UTC). Regular price $29 after that.' : null,
    checkoutUrl: '/api/kronos/checkout',
  };
}

export const fieldGuideSimulationDisclosure =
  'The account figures shown are recorded paper-account observations, not actual investment returns. Simulated and retrospective studies have material limitations: execution assumptions, missing liquidity effects, imperfect fees and slippage, hindsight, selection bias, changing parameters and dependence among observations. A successful simulation does not demonstrate that a real account would achieve similar results. Past observations do not predict future results.';
