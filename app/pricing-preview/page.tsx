import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/auth";
import PricingPreviewClient from "./PricingPreviewClient";

export const metadata: Metadata = {
  title: "Pricing Preview (Sandbox)",
  description: "Sandbox test page for the Paddle overlay checkout integration.",
  robots: { index: false, follow: false },
};

export default async function PricingPreviewPage() {
  // Vercel sets x-vercel-ip-country on every request; other hosts may not send it.
  // When it's absent we intentionally pass no country to the client — Paddle.js
  // PricePreview() auto-detects location from the visitor's IP in that case.
  const hdrs = await headers();
  const countryHeader = hdrs.get("x-vercel-ip-country");
  const initialCountryCode = countryHeader && countryHeader !== "" ? countryHeader : undefined;

  const session = await auth();
  const customerEmail = session?.user?.email ?? undefined;

  return (
    <PricingPreviewClient
      initialCountryCode={initialCountryCode}
      customerEmail={customerEmail}
    />
  );
}
