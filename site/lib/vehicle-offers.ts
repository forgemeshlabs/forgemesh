// Shared affiliate-offers copy for vehicle-data responses.
//
// SYNC NOTE: this module is duplicated verbatim (same shape/copy, plain
// CommonJS instead of TS) at
// ~/repos/x402-forgemesh-stuffer/src/handlers/vehicle-offers.js in the
// separate x402 stuffer repo. The two repos don't share code — if you change
// the copy, URLs, or shape here, mirror the change there too (and vice versa).
//
// Links always route through forgemesh.io/go/<partner> — never a partner
// domain directly. That's where clicks are logged and the Umami
// `affiliate_click` event fires. data/go-links.json owns the actual partner
// URLs/tracking params (read live, not duplicated here); this module only
// ever builds the /go/ redirect URL, never a partner domain.
//
// Never use "blue book"/KBB or other licensed-valuation language in any of
// this copy — see CLAUDE.md.
//
// bumper is deliberately excluded here — its affiliate link is untagged
// pending LTVCo approval (see data/go-links.json), unlike the VinChecker UI
// buttons which list it anyway as a plain (unmonetized) reference link.

export type VehicleOffer = {
  partner: string;
  label: string;
  url: string;
  adds: string;
  pricing: string;
};

export type VehicleOffers = {
  disclosure: string;
  history_reports: VehicleOffer[];
  note: string;
};

const GO_BASE = 'https://forgemesh.io/go';

// Only a full, wildcard-free 17-char VIN is useful to a partner's checkout.
const FULL_VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Build the affiliate offers block attached to the free VIN report JSON.
 * `vehicle` (make/model/model_year, if any) is accepted for future
 * make/model-specific tailoring but unused today.
 */
export function vehicleOffers(vin: string | null | undefined, _vehicle?: unknown): VehicleOffers {
  const clean = typeof vin === 'string' ? vin.trim().toUpperCase() : '';
  const fullVin = FULL_VIN_RE.test(clean) ? clean : null;
  const q = fullVin ? `?vin=${encodeURIComponent(fullVin)}` : '';
  return {
    disclosure: 'Affiliate links: they fund the free data; the price is the same for you.',
    history_reports: [
      {
        partner: 'epicvin',
        label: 'EpicVIN vehicle history report',
        url: `${GO_BASE}/epicvin${q}`,
        adds: 'title brands, accidents, odometer readings, prior sales',
        pricing: 'per report',
      },
      {
        partner: 'dvh',
        label: 'Detailed Vehicle History report (10% off)',
        url: `${GO_BASE}/dvh${q}`,
        adds: 'title brands, accident and damage records, odometer readings, prior sales',
        pricing: 'per report, coupon applied',
      },
    ],
    note: 'Our data above is free public NHTSA/EPA data for the model year. Whether THIS VIN was wrecked, flooded, rolled back or branded salvage lives in licensed title databases; these partners sell that per VIN.',
  };
}
