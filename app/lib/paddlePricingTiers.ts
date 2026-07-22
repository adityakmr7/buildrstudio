// Edit this file to change what the /pricing-preview page sells. Each tier maps to a
// Paddle product that exists in BOTH the sandbox and live Paddle accounts — these are
// two entirely separate catalogs (separate products/prices, since Paddle sandbox and
// live are different accounts), kept in lockstep by hand. Country price overrides
// (GB/IE/AU/IN) and trial periods live on the Paddle price entities themselves —
// Paddle.js PricePreview/Checkout resolve the right one automatically based on the
// customer's location, so nothing here needs to change to support that.
//
// Which set of IDs is actually used is decided at runtime by NEXT_PUBLIC_PADDLE_ENVIRONMENT
// (see paddleClientConfig.ts) — never by editing this file. That's what makes flipping
// the site from sandbox to live a single env var change instead of a code deploy: the
// live IDs below sit inert and unused for as long as NEXT_PUBLIC_PADDLE_ENVIRONMENT stays
// "sandbox", so having them here ahead of time is safe and doesn't affect the currently
// running sandbox checkout.
export type PaddleTierEnvironment = "sandbox" | "production";

export interface Tier {
  name: "Launch Pack" | "Pro";
  description: string;
  features: string[];
  priceId: Record<PaddleTierEnvironment, { month: string; year: string }>;
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
      sandbox: {
        month: "pri_01ky5arp6maxw4g7f3j9m3y6t4",
        year: "pri_01ky5arp6maxw4g7f3j9m3y6t4",
      },
      production: {
        month: "pri_01ky4766t6gxxtsayy6bqv5a5a",
        year: "pri_01ky4766t6gxxtsayy6bqv5a5a",
      },
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
      sandbox: {
        month: "pri_01ky5arps1f5yg38s007ktkj1w",
        year: "pri_01ky5axmk7qkvgkhgksw8g36py",
      },
      production: {
        month: "pri_01ky472xxs5pqr3jypk0rpbrt7",
        year: "pri_01ky5khtv6r6gxn9m2641mqzsy",
      },
    },
  },
];
