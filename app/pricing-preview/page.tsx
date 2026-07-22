import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { getPaddleCustomerByEmail } from "@/app/lib/paddleDb";
import PricingPreviewClient from "./PricingPreviewClient";

export const metadata: Metadata = {
  title: "Checkout — BuildrStudio",
  description: "Choose Launch Pack or Pro and check out securely via Paddle.",
  alternates: { canonical: "https://buildrstudio.in/pricing-preview" },
};

interface PricingPreviewPageProps {
  searchParams?: Promise<{ interval?: string }>;
}

export default async function PricingPreviewPage({ searchParams }: PricingPreviewPageProps) {
  // Vercel sets x-vercel-ip-country on every request; other hosts may not send it.
  // When it's absent we intentionally pass no country to the client — Paddle.js
  // PricePreview() auto-detects location from the visitor's IP in that case.
  const hdrs = await headers();
  const countryHeader = hdrs.get("x-vercel-ip-country");
  const initialCountryCode = countryHeader && countryHeader !== "" ? countryHeader : undefined;

  const session = await auth();
  const customerEmail = session?.user?.email ?? undefined;

  // Resolves this signed-in user's Paddle customer ID (ctm_...), if we've ever mirrored
  // one for their email from a webhook — used to pass `pwCustomer` to Paddle.Initialize()
  // for Paddle Retain (dunning/recovery emails), which needs the actual Paddle customer
  // ID, never our internal user ID or a bare email. A brand-new user who's never
  // checked out yet simply has no mirrored customer, so this resolves to undefined and
  // pwCustomer is omitted — Retain has nothing to key off until their first checkout
  // creates a Paddle customer.
  const paddleCustomer = customerEmail
    ? await getPaddleCustomerByEmail(customerEmail).catch(() => null)
    : null;

  // Lets /pricing deep-link straight into the annual toggle (e.g. /pricing-preview?interval=year)
  // instead of always landing on monthly. Anything other than exactly "year" falls back to the
  // default "month" — this only ever affects which toggle is pre-selected, never which prices exist.
  const resolvedSearchParams = await searchParams;
  const initialInterval = resolvedSearchParams?.interval === "year" ? "year" : "month";

  return (
    <PricingPreviewClient
      initialCountryCode={initialCountryCode}
      customerEmail={customerEmail}
      paddleCustomerId={paddleCustomer?.customerId}
      initialInterval={initialInterval}
    />
  );
}
