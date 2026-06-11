import type { Metadata } from "next";
import WorkspaceHub from "./components/WorkspaceHub";

export const metadata: Metadata = {
  title: "Screenshot-to-Social Media Graphic Optimizer — BuildrStudio",
  description:
    "Instantly convert raw developer screenshots, terminal outputs, and code captures into beautiful social media images optimized for X/Twitter, LinkedIn, and Instagram.",
  openGraph: {
    title: "Screenshot-to-Social Media Graphic Optimizer — BuildrStudio",
    description:
      "Instantly convert raw developer screenshots, terminal outputs, and code captures into beautiful social media images.",
    type: "website",
    url: "https://buildrstudio.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Screenshot-to-Social Media Graphic Optimizer — BuildrStudio",
    description:
      "Instantly convert raw developer screenshots, terminal outputs, and code captures into beautiful social media images.",
  },
};

export default function Home() {
  return <WorkspaceHub />;
}
