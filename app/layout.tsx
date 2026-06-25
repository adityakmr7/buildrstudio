import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "./components/Toast";
import AuthProvider from "./components/AuthProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildrstudio.in"),
  title: {
    default: "BuildrStudio — Free App Store Screenshot Generator",
    template: "%s — BuildrStudio",
  },
  description:
    "Free App Store screenshot generator — paste your app URL and get polished mockups with AI-generated marketing copy in seconds. No design skills needed.",
  authors: [{ name: "Aditya Kumar", url: "https://buildrstudio.in" }],
  keywords: [
    "app store screenshot generator",
    "app store mockup",
    "screenshot builder",
    "play store screenshot maker",
    "social media graphics",
    "developer tools",
    "app store optimization",
    "ASO screenshots",
    "BuildrStudio",
  ],
  openGraph: {
    type: "website",
    siteName: "BuildrStudio",
  },
  twitter: {
    card: "summary_large_image",
    site: "@adityakmr7",
    creator: "@adityakmr7",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        style={{ fontFamily: "var(--font)" }}
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


