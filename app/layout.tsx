import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./components/AuthProvider";
import { siteConfig } from "./lib/siteConfig";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "BuildrStudio — AI employees for your business",
    template: "%s — BuildrStudio",
  },
  description:
    "Skip the build. Keep the control. Deploy a pre-built AI agent for customer support or internal knowledge in minutes. One script tag, no AI team required.",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-ink font-sans text-cream" suppressHydrationWarning>
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
