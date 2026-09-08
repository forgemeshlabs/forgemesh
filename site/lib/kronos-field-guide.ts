// Price and checkout are deliberately unset until the operator approves them.
// Configure only a tested hosted checkout that discloses these terms before payment.
export const fieldGuideOffer: {
  priceLabel: string | null;
  checkoutUrl: string | null;
} = {
  priceLabel: null,
  checkoutUrl: null,
};

export const fieldGuideSimulationDisclosure =
  'The account figures shown are recorded paper-account observations, not actual investment returns. Simulated and retrospective studies have material limitations: execution assumptions, missing liquidity effects, imperfect fees and slippage, hindsight, selection bias, changing parameters and dependence among observations. A successful simulation does not demonstrate that a real account would achieve similar results. Past observations do not predict future results.';
