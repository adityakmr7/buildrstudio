"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import AppHeader from "../components/AppHeader";
import { PRICING_TIERS, type Tier } from "../lib/paddlePricingTiers";
import { getPaddleClientConfig } from "../lib/paddleClientConfig";

type Interval = "month" | "year";

interface PricingPreviewClientProps {
  initialCountryCode?: string;
  customerEmail?: string;
}

interface PriceDisplay {
  formattedTotal: string;
  currencyCode: string;
}

export default function PricingPreviewClient({
  initialCountryCode,
  customerEmail,
}: PricingPreviewClientProps) {
  const router = useRouter();

  const [paddle, setPaddle] = useState<Paddle | null>(null);

  // Config validation runs once, synchronously, during the initial render (via the
  // lazy useState initializer) rather than inside an effect — the effect below only
  // ever reads this result, it never needs to setState for the error case itself.
  const [{ config, error: configError }] = useState(() => {
    try {
      return { config: getPaddleClientConfig(), error: null as string | null };
    } catch (err) {
      return {
        config: null,
        error: err instanceof Error ? err.message : "Invalid Paddle configuration",
      };
    }
  });

  const [interval, setInterval] = useState<Interval>("month");
  const [prices, setPrices] = useState<Record<string, PriceDisplay>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [checkingOutTier, setCheckingOutTier] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Initialize Paddle.js exactly once, only if config validated successfully.
  useEffect(() => {
    if (!config) return;

    let cancelled = false;

    initializePaddle({
      environment: config.environment,
      token: config.token,
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          router.push("/welcome");
        }
        if (event.name === "checkout.closed") {
          setCheckingOutTier(null);
        }
      },
    }).then((instance) => {
      if (!cancelled && instance) setPaddle(instance);
    });

    return () => {
      cancelled = true;
    };
  }, [config, router]);

  // Fetch localized price previews whenever Paddle is ready, or the billing interval
  // changes. If initialCountryCode is undefined we omit `address` entirely so
  // PricePreview auto-detects location from the visitor's IP. The loading/error resets
  // are deferred a microtask so they don't fire synchronously within the effect body.
  useEffect(() => {
    if (!paddle) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoadingPrices(true);
      setPreviewError(null);
    });

    const items = PRICING_TIERS.map((tier) => ({
      priceId: tier.priceId[interval],
      quantity: 1,
    }));

    paddle
      .PricePreview({
        items,
        ...(initialCountryCode ? { address: { countryCode: initialCountryCode } } : {}),
      })
      .then((result) => {
        if (cancelled) return;
        const next: Record<string, PriceDisplay> = {};
        for (const lineItem of result.data.details.lineItems) {
          next[lineItem.price.id] = {
            formattedTotal: lineItem.formattedTotals.total,
            currencyCode: result.data.currencyCode,
          };
        }
        setPrices(next);
      })
      .catch((err) => {
        if (!cancelled) {
          setPreviewError(err instanceof Error ? err.message : "Failed to load prices");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPrices(false);
      });

    return () => {
      cancelled = true;
    };
  }, [paddle, interval, initialCountryCode]);

  const handleSubscribe = useCallback(
    (tier: Tier) => {
      if (!paddle) return;
      setCheckoutError(null);
      setCheckingOutTier(tier.name);

      try {
        paddle.Checkout.open({
          items: [{ priceId: tier.priceId[interval], quantity: 1 }],
          ...(customerEmail ? { customer: { email: customerEmail } } : {}),
          settings: {
            displayMode: "overlay",
            variant: "one-page",
            successUrl: `${window.location.origin}/welcome`,
          },
        });
      } catch (err) {
        setCheckingOutTier(null);
        setCheckoutError(err instanceof Error ? err.message : "Failed to open checkout");
      }
    },
    [paddle, interval, customerEmail],
  );

  const priceFor = useCallback(
    (tier: Tier) => prices[tier.priceId[interval]],
    [prices, interval],
  );

  // Launch Pack is a one-time purchase — Paddle has no billing_cycle for it, so the
  // same price ID is used for both the "month" and "year" keys on purpose (see
  // paddlePricingTiers.ts). Detect that here rather than hardcoding tier.name, so the
  // display logic stays correct if the catalog changes shape again.
  const isOneTime = useCallback(
    (tier: Tier) => tier.priceId.month === tier.priceId.year,
    [],
  );

  const topLevelError = configError ?? previewError ?? checkoutError;

  const tiers = useMemo(() => PRICING_TIERS, []);

  return (
    <>
      <style>{`
        .ppv-page {
          max-width: 760px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          font-family: var(--font);
          color: var(--text-1);
        }
        .ppv-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .ppv-header h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1.2px;
          margin-bottom: 10px;
        }
        .ppv-header p {
          font-size: 15px;
          color: var(--text-2);
        }
        .ppv-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 24px 0 40px;
        }
        .ppv-toggle button {
          border: 1.5px solid var(--border);
          background: var(--surface);
          color: var(--text-2);
          font-family: var(--font);
          font-size: 13px;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: var(--r-full, 999px);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .ppv-toggle button.active {
          background: var(--fill);
          color: var(--fill-text, #fff);
          border-color: var(--fill);
        }
        .ppv-error {
          max-width: 640px;
          margin: 0 auto 24px;
          padding: 12px 16px;
          border-radius: var(--r-md, 12px);
          border: 1px solid var(--border);
          background: var(--fill-subtle);
          color: var(--text-2);
          font-size: 13px;
          text-align: center;
        }
        .ppv-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 640px) {
          .ppv-grid {
            grid-template-columns: 1fr;
            max-width: 440px;
            margin: 0 auto;
          }
        }
        .ppv-card {
          border: 1.5px solid var(--border);
          border-radius: var(--r-lg, 16px);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--surface);
        }
        .ppv-card.pro {
          border-color: #a855f7;
          box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.15), 0 12px 40px rgba(168, 85, 247, 0.1);
        }
        .ppv-plan-name {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-3);
        }
        .ppv-price {
          display: flex;
          align-items: baseline;
          gap: 6px;
          min-height: 44px;
        }
        .ppv-amount {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -1.5px;
          color: var(--text-1);
        }
        .ppv-period {
          font-size: 14px;
          color: var(--text-3);
          font-weight: 500;
        }
        .ppv-skeleton {
          width: 90px;
          height: 30px;
          border-radius: var(--r-sm, 8px);
          background: var(--fill-subtle);
          animation: ppv-pulse 1.2s ease-in-out infinite;
        }
        @keyframes ppv-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .ppv-desc {
          font-size: 13px;
          color: var(--text-2);
          line-height: 1.6;
        }
        .ppv-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .ppv-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-2);
        }
        .ppv-check {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          flex-shrink: 0;
        }
      `}</style>

      <AppHeader />

      <div className="ppv-page">
        <div className="ppv-header">
          <h1>Pricing Preview</h1>
          <p>Sandbox test page — Paddle overlay checkout, country-localized pricing.</p>
        </div>

        {topLevelError && <div className="ppv-error">{topLevelError}</div>}

        <div className="ppv-toggle">
          <button
            type="button"
            className={interval === "month" ? "active" : ""}
            onClick={() => setInterval("month")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={interval === "year" ? "active" : ""}
            onClick={() => setInterval("year")}
          >
            Yearly
          </button>
        </div>

        <div className="ppv-grid">
          {tiers.map((tier) => {
            const price = priceFor(tier);
            const isCheckingOut = checkingOutTier === tier.name;

            return (
              <div key={tier.name} className={`ppv-card ${tier.name === "Pro" ? "pro" : ""}`}>
                <span className="ppv-plan-name">{tier.name}</span>

                <div className="ppv-price">
                  {loadingPrices || !price ? (
                    <div className="ppv-skeleton" aria-label="Loading price" />
                  ) : (
                    <>
                      <span className="ppv-amount">{price.formattedTotal}</span>
                      <span className="ppv-period">
                        {isOneTime(tier) ? "one-time" : `/${interval === "month" ? "mo" : "yr"}`}
                      </span>
                    </>
                  )}
                </div>

                <p className="ppv-desc">{tier.description}</p>

                <div className="ppv-features">
                  {tier.features.map((feature) => (
                    <div key={feature} className="ppv-feature">
                      <span className="ppv-check">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={tier.name === "Pro" ? "btn-fill" : "btn-outline"}
                  style={{ width: "100%", justifyContent: "center" }}
                  disabled={!paddle || isCheckingOut}
                  onClick={() => handleSubscribe(tier)}
                >
                  {isCheckingOut ? "Opening checkout…" : `Subscribe to ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
