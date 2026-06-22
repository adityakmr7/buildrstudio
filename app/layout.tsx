import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "./components/Toast";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildrstudio.in"),
  title: {
    default: "BuildrStudio — Developer Tools by Aditya Kumar",
    template: "%s — BuildrStudio",
  },
  description:
    "BuildrStudio is a suite of free developer tools — turn raw screenshots into stunning social media graphics, track habits with Anchor, and stay focused with Flowzy.",
  authors: [{ name: "Aditya Kumar", url: "https://buildrstudio.in" }],
  keywords: [
    "screenshot optimizer",
    "social media graphics",
    "developer tools",
    "screenshot to social",
    "habit tracker",
    "focus timer",
    "pomodoro",
    "BuildrStudio",
    "Aditya Kumar",
  ],
  openGraph: {
    type: "website",
    siteName: "BuildrStudio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio — Developer Tools by Aditya Kumar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@adityakmr7",
    creator: "@adityakmr7",
    images: ["/og-image.png"],
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
        <ToastProvider>
          {children}
        </ToastProvider>
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


