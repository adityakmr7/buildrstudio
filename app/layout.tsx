import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./components/AuthProvider";
import { siteConfig } from "./lib/siteConfig";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Buildr Studio — ${siteConfig.tagline}`,
    template: "%s — Buildr Studio",
  },
  description: siteConfig.description,
  authors: [{ name: "Buildr Studio", url: siteConfig.url }],
  keywords: [
    "AI employees for small business",
    "AI customer support agent",
    "embeddable AI chat widget",
    "RAG knowledge assistant",
    "AI chatbot for website",
    "no-code AI agent",
    "business automation",
    "Buildr Studio",
  ],
  openGraph: {
    type: "website",
    siteName: "Buildr Studio",
  },
  twitter: {
    card: "summary_large_image",
    site: "@buildrstudio",
    creator: "@buildrstudio",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{ fontFamily: "var(--font-dm-sans, sans-serif)", background: "#F5F8FC" }}
        className={dmSans.variable}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="3105d253-bd7c-430d-9271-4515c7f31a8e"
        />
      </body>
    </html>
  );
}
