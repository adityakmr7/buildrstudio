import type { Metadata } from "next";

export function clearStackMetadata(
  path: string,
  title: string,
  description: string
): Metadata {
  const url = `https://buildrstudio.in/products/clear-stack${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: "https://buildrstudio.in/clear-stack/preview.png",
          width: 1200,
          height: 780,
          alt: "ClearStack macOS Storage Optimizer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://buildrstudio.in/clear-stack/preview.png"],
    },
  };
}

export function clearStackJsonLd(
  path: string,
  title: string,
  description: string
) {
  const url = `https://buildrstudio.in/products/clear-stack${path}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ClearStack",
    operatingSystem: "macOS 14.0 or later (Apple Silicon & Intel)",
    applicationCategory: "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "5.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
    },
    description,
    url,
    image: "https://buildrstudio.in/clear-stack/preview.png",
    author: {
      "@type": "Organization",
      name: "BuildrStudio",
      url: "https://buildrstudio.in",
    },
  });
}
