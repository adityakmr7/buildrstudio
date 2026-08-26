import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./components/AuthProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildrstudio.in"),
  title: {
    default: "Buildr Studio — The AI Agent Marketplace",
    template: "%s — Buildr Studio",
  },
  description:
    "Browse, buy, and embed AI agents on any website — support agents, knowledge assistants, workflow automation, and multi-agent systems. Install in minutes, no code required.",
  authors: [{ name: "Buildr Studio", url: "https://buildrstudio.in" }],
  keywords: [
    "AI agent marketplace",
    "embeddable AI chat widget",
    "AI support agent",
    "RAG knowledge assistant",
    "AI chatbot for website",
    "no-code AI agent",
    "workflow automation",
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
