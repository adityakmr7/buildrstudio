import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./components/AuthProvider";
import { siteConfig } from "./lib/siteConfig";
import "./globals.css";

const geistSans = localFont({
  src: "../public/brand/assets/geist.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "../public/brand/assets/geist-mono.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "BuildrStudio | Thoughtfully built. Human at heart.",
    template: "%s — BuildrStudio",
  },
  description: siteConfig.description,
  authors: [{ name: "BuildrStudio", url: siteConfig.url }],
  keywords: ["BuildrStudio", "independent product company", "Numa", "pregnancy companion"],
  openGraph: {
    type: "website",
    siteName: "BuildrStudio",
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
      <body  suppressHydrationWarning>
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
