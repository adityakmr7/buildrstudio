import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
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
      </body>
    </html>
  );
}
