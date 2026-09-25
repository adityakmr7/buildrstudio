"use client";

import { useEffect, useState } from "react";

export interface InrTier {
  tierId: string;
  tierName: string;
  priceLabel: string;
}
export interface RazorpayPlansState {
  enabled: boolean;
  suggestInr: boolean;
  tiers: InrTier[];
}

const OFF: RazorpayPlansState = { enabled: false, suggestInr: false, tiers: [] };
const cache = new Map<string, Promise<RazorpayPlansState>>();

// INR (Razorpay) availability for an agent, fetched client-side so agent
// pages stay static. Resolves to "off" on any error, which leaves the page
// showing Paddle only.
export function useRazorpayPlans(agentSlug: string | null): RazorpayPlansState {
  const [state, setState] = useState<RazorpayPlansState>(OFF);
  useEffect(() => {
    if (!agentSlug) return;
    let p = cache.get(agentSlug);
    if (!p) {
      p = fetch(`/api/razorpay/plans?agent=${encodeURIComponent(agentSlug)}`)
        .then((r) => (r.ok ? r.json() : OFF))
        .catch(() => OFF);
      cache.set(agentSlug, p);
    }
    let alive = true;
    p.then((s) => alive && setState(s));
    return () => {
      alive = false;
    };
  }, [agentSlug]);
  return state;
}
