import type { MetadataRoute } from "next";
import { siteConfig } from "./lib/siteConfig";
import { PRODUCTS } from "./lib/products";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    ...PRODUCTS.map(product => ({ url: `${siteConfig.url}${product.href}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["privacy", "terms"].map(path => ({ url: `${siteConfig.url}/${path}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
