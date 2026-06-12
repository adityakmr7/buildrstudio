import type { Metadata } from "next";
import ChangelogGenerator from "./ChangelogGenerator";

export const metadata: Metadata = {
  title: "Changelog Card Generator — Ink",
  description: "Generate beautiful social cards from your changelog entries.",
  openGraph: {
    title: "Changelog Card Generator",
    description: "Generate beautiful social cards from your changelog entries.",
  },
};

export default function ChangelogPage() {
  return <ChangelogGenerator />;
}
