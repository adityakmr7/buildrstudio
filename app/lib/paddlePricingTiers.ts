// Edit this file to change what the /pricing-preview page sells. Each tier maps to a
// Paddle product in the sandbox catalog. Country price overrides (GB/IE/AU/IN) live on
// the Paddle price entities themselves — Paddle.js PricePreview resolves the right one
// automatically based on the customer's location, so nothing here needs to change to
// support that.

export interface Tier {
  name: "Launch Pack" | "Pro";
  description: string;
  features: string[];
  priceId: { month: string; year: string };
}

export const PRICING_TIERS: Tier[] = [
  {
    name: "Launch Pack",
    description: "Pay once, keep it forever — no subscription.",
    features: [
      "All core tools, unlimited exports",
      "Watermark-free",
      "Lifetime access — one payment",
    ],
    priceId: {
      // Launch Pack is a one-time purchase (no billing_cycle in Paddle), so it has no
      // separate monthly/annual price — the monthly/yearly toggle doesn't apply to it.
      // Both keys point at the same one-time price on purpose; the UI shows this price
      // unchanged regardless of which billing interval is selected.
      month: "pri_01ky5arp6maxw4g7f3j9m3y6t4",
      year: "pri_01ky5arp6maxw4g7f3j9m3y6t4",
    },
  },
  {
    name: "Pro",
    description: "For teams shipping regularly and iterating fast.",
    features: [
      "Everything in Launch Pack",
      "Priority support",
      "Cancel anytime",
    ],
    priceId: {
      month: "pri_01ky5arps1f5yg38s007ktkj1w",
      year: "pri_01ky5axmk7qkvgkhgksw8g36py",
    },
  },
];
