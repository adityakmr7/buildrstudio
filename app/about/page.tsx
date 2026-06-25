import type { Metadata } from "next";
import AppHeader from "@/app/components/AppHeader";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Aditya Kumar",
  description:
    "Full-Stack Developer & Indie Maker. I build developer tools, mobile apps, and SaaS products. Currently open to full-time and freelance opportunities.",
  alternates: { canonical: "https://buildrstudio.in/about" },
  openGraph: {
    title: "Aditya Kumar — Full-Stack Developer & Indie Maker",
    description:
      "I build developer tools, mobile apps, and SaaS products. Creator of BuildrStudio, Anchor, and Flowzy.",
    url: "https://buildrstudio.in/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Kumar — Full-Stack Developer & Indie Maker",
    description:
      "I build developer tools, mobile apps, and SaaS products. Open to work.",
  },
};

export default function AboutPage() {
  return (
    <>
      <AppHeader activeRoute="home" />
      <AboutClient />
    </>
  );
}
