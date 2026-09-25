"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "./Toast";
import { isDevAuthBypassEnabled, DEV_BYPASS_PROVIDER_ID } from "../lib/devAuth";

interface RazorpayCheckoutButtonProps {
  tierId: string;
  label: string;
  style?: React.CSSProperties;
  className?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
  on(event: string, cb: (resp: { error?: { description?: string } }) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadCheckoutJs(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error("checkout.js failed to load"));
      };
      document.body.appendChild(s);
    });
  }
  return scriptPromise;
}

// INR subscription checkout (UPI AutoPay, cards, netbanking) via Razorpay's
// checkout.js. Access is granted server-side only: /api/razorpay/verify
// checks the signature and the subscription status with Razorpay, and the
// webhook does the same independently.
export default function RazorpayCheckoutButton({ tierId, label, style, className }: RazorpayCheckoutButtonProps) {
  const { status } = useSession();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (status !== "authenticated") {
      signIn(isDevAuthBypassEnabled() ? DEV_BYPASS_PROVIDER_ID : "google");
      return;
    }
    setBusy(true);
    try {
      const [res] = await Promise.all([
        fetch("/api/razorpay/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tierId }),
        }),
        loadCheckoutJs(),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't start checkout.");
      if (!window.Razorpay) throw new Error("Checkout didn't load. Check your connection and try again.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: data.name,
        description: data.description,
        prefill: data.prefill,
        theme: { color: "#e4b15a" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (resp: RazorpayHandlerResponse) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            const out = await v.json();
            if (!v.ok) throw new Error(out.error);
            if (out.status !== "active") {
              toast("Payment received. Your plan activates as soon as Razorpay confirms it, usually within a minute.", "info");
            }
          } catch {
            toast("Payment received. We're confirming it with Razorpay; your dashboard will update shortly.", "info");
          }
          window.location.href = "/dashboard/integrations?welcome=1";
        },
      });
      rzp.on("payment.failed", (resp) => {
        toast(resp.error?.description || "Payment failed. No money was taken; try again.", "error");
      });
      rzp.open();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't start checkout.", "error");
      setBusy(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={busy} className={className} style={{ cursor: busy ? "wait" : "pointer", border: "none", ...style }}>
      {busy ? "Opening checkout…" : label}
    </button>
  );
}
