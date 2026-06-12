import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "BuildrStudio — Apps by Aditya Kumar",
  description:
    "A collection of thoughtfully crafted apps designed and built by Aditya Kumar. Powered by the Ink Design System.",
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
        {children}
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


