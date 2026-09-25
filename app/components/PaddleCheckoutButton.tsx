"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "./Toast";
import { isDevAuthBypassEnabled, DEV_BYPASS_PROVIDER_ID } from "../lib/devAuth";

interface PaddleCheckoutButtonProps {
  agentId: string;
  tierId: string;
  paddlePriceId: string | null;
  label: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function PaddleCheckoutButton({
  agentId,
  tierId,
  paddlePriceId,
  label,
  style,
  className,
}: PaddleCheckoutButtonProps) {
  const { data: session, status } = useSession();
  const [paddle, setPaddle] = useState<Paddle>();
  const { toast } = useToast();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token || !paddlePriceId) return;
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox",
      token,
    }).then((instance) => setPaddle(instance));
  }, [paddlePriceId]);

  const handleClick = () => {
    if (status !== "authenticated") {
      signIn(isDevAuthBypassEnabled() ? DEV_BYPASS_PROVIDER_ID : "google");
      return;
    }
    if (!paddlePriceId) {
      toast("Pricing for this tier isn't live yet — email us and we'll get you set up.", "info");
      return;
    }
    if (!paddle) {
      toast("Checkout is still loading — try again in a moment.", "error");
      return;
    }
    paddle.Checkout.open({
      items: [{ priceId: paddlePriceId, quantity: 1 }],
      customer: session.user?.email ? { email: session.user.email } : undefined,
      customData: { userId: session.user.id, agentId, tierId },
      settings: {
        // Paddle redirects here once payment completes. The dashboard reads
        // ?welcome=1 to show a one-time confirmation banner, then strips it.
        successUrl: `${window.location.origin}/dashboard/integrations?welcome=1`,
      },
    });
  };

  return (
    <button onClick={handleClick} className={className} style={{ cursor: "pointer", border: "none", ...style }}>
      {label}
    </button>
  );
}
