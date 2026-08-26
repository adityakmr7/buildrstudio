import type { MetadataRoute } from "next";
import { AGENT_CATALOG } from "./lib/agentCatalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://buildrstudio.in";
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/agents`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...AGENT_CATALOG.map((product) => ({
      url: `${base}/agents/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
