import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import AppHeader from "../components/AppHeader";
import {
  APPSTORE_DEVICES,
  PLAYSTORE_DEVICES,
} from "../screenshot-builder/lib/deviceSpecs";

export const metadata: Metadata = {
  title: "App Store Screenshot Sizes 2026 — Complete iOS & Android Guide",
  description:
    "Every required App Store and Google Play screenshot size for 2026: iPhone 6.7″, 6.5″, iPad 12.9″, Android phone and tablet dimensions — plus a free generator that exports them all at once.",
  alternates: { canonical: "https://buildrstudio.in/app-store-screenshot-sizes" },
  keywords: [
    "app store screenshot sizes",
    "app store screenshot dimensions",
    "iphone screenshot size app store",
    "google play screenshot size",
    "play store screenshot dimensions",
    "ios screenshot requirements 2026",
    "app store screenshot requirements",
  ],
  openGraph: {
    title: "App Store Screenshot Sizes 2026 — Complete iOS & Android Guide",
    description:
      "All required Apple App Store and Google Play screenshot dimensions in one place, with a free tool that exports every size at once.",
    type: "article",
    url: "https://buildrstudio.in/app-store-screenshot-sizes",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Store Screenshot Sizes 2026 — iOS & Android Guide",
    description:
      "Every required screenshot dimension for the App Store and Google Play, updated for 2026.",
  },
};

const FAQ_ITEMS = [
  {
    q: "What screenshot sizes are required for the Apple App Store in 2026?",
    a: "Apple requires 6.7-inch iPhone screenshots (1290 × 2796 px, iPhone 16 Pro Max) and 6.5-inch screenshots (1242 × 2688 px). If your app supports iPad, 12.9-inch iPad Pro screenshots (2048 × 2732 px) are also required. The 5.5-inch (1242 × 2208 px) and 11-inch iPad (1668 × 2388 px) sizes are optional.",
  },
  {
    q: "What screenshot sizes does Google Play require?",
    a: "Google Play requires phone screenshots — 1080 × 1920 px is the standard. 7-inch tablet (1200 × 1920 px) and 10-inch tablet (1920 × 1200 px) screenshots are optional but recommended if your app supports tablets.",
  },
  {
    q: "How many screenshots can I upload to each store?",
    a: "The Apple App Store allows up to 10 screenshots per device size. Google Play allows up to 8 screenshots per device type, with a minimum of 2.",
  },
  {
    q: "Do I need to design each size separately?",
    a: "No. Design once at the largest size and export every required dimension automatically — BuildrStudio's batch export produces all Apple and Google sizes with canonical store filenames in one click.",
  },
];

export default function ScreenshotSizesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://buildrstudio.in" },
          {
            "@type": "ListItem",
            position: 2,
            name: "App Store Screenshot Sizes",
            item: "https://buildrstudio.in/app-store-screenshot-sizes",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <Script
        id="sizes-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .sizes-page {
          max-width: 860px;
          margin: 0 auto;
          padding: 56px 24px 80px;
          font-family: var(--font);
          color: var(--text-1);
        }
        .sizes-page h1 {
          font-size: clamp(30px, 4.5vw, 44px);
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .sizes-intro {
          font-size: 16px;
          color: var(--text-2);
          line-height: 1.7;
          max-width: 640px;
          margin-bottom: 8px;
        }
        .sizes-updated {
          font-size: 13px;
          color: var(--text-3);
          margin-bottom: 40px;
        }
        .sizes-page h2 {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 48px 0 8px;
        }
        .sizes-section-sub {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .sizes-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          border: 1.5px solid var(--border);
          border-radius: var(--r-md, 12px);
          overflow: hidden;
        }
        .sizes-table th {
          text-align: left;
          padding: 12px 16px;
          background: var(--fill-subtle);
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-3);
          border-bottom: 1.5px solid var(--border);
        }
        .sizes-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          color: var(--text-2);
        }
        .sizes-table tr:last-child td { border-bottom: none; }
        .sizes-table td:first-child { font-weight: 600; color: var(--text-1); }
        .sizes-dim {
          font-variant-numeric: tabular-nums;
          font-weight: 600;
          color: var(--text-1);
        }
        .sizes-req {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 999px;
        }
        .sizes-req.required { background: rgba(34, 197, 94, 0.12); color: #16a34a; }
        .sizes-req.optional { background: var(--fill-subtle); color: var(--text-3); }
        .sizes-cta {
          margin: 48px 0;
          padding: 28px;
          border: 1.5px solid var(--border);
          border-radius: var(--r-lg, 16px);
          background: var(--surface);
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
        .sizes-cta h3 {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .sizes-cta p {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.6;
          margin: 0;
        }
        .sizes-faq-item { border-bottom: 1px solid var(--border); padding: 18px 0; }
        .sizes-faq-item:first-of-type { border-top: 1px solid var(--border); }
        .sizes-faq-q { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
        .sizes-faq-a { font-size: 14px; color: var(--text-2); line-height: 1.7; }
        .sizes-note {
          font-size: 13px;
          color: var(--text-3);
          line-height: 1.6;
          margin-top: 12px;
        }
      `}</style>

      <AppHeader activeRoute="home" />

      <div className="sizes-page">
        <h1>App Store Screenshot Sizes — 2026 Guide</h1>
        <p className="sizes-intro">
          Every screenshot dimension Apple and Google require for store submission, in one place.
          Design once, export every size — or keep reading for the exact pixel dimensions.
        </p>
        <p className="sizes-updated">Based on Apple and Google guidelines, June 2026.</p>

        <h2>Apple App Store screenshot sizes</h2>
        <p className="sizes-section-sub">
          Apple organizes screenshots by display size. Upload up to 10 per size; the 6.7″ and 6.5″
          sets are mandatory for iPhone apps.
        </p>
        <table className="sizes-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Dimensions (px)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {APPSTORE_DEVICES.map((d) => (
              <tr key={d.id}>
                <td>{d.label}</td>
                <td className="sizes-dim">
                  {d.canvasW} × {d.canvasH}
                </td>
                <td>
                  <span
                    className={`sizes-req ${d.detail.toLowerCase().startsWith("required") ? "required" : "optional"}`}
                  >
                    {d.detail.toLowerCase().startsWith("required") ? "Required" : "Optional"}
                  </span>{" "}
                  <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                    {d.detail.replace(/^(Required|Optional)( · )?/, "")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sizes-note">
          Portrait orientation shown. Apple accepts landscape variants at the transposed dimensions
          (e.g. 2796 × 1290 for 6.7″).
        </p>

        <h2>Google Play screenshot sizes</h2>
        <p className="sizes-section-sub">
          Google Play requires a minimum of 2 and a maximum of 8 screenshots per device type. Sides
          must be between 320 px and 3840 px.
        </p>
        <table className="sizes-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Dimensions (px)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PLAYSTORE_DEVICES.map((d) => (
              <tr key={d.id}>
                <td>{d.label}</td>
                <td className="sizes-dim">
                  {d.canvasW} × {d.canvasH}
                </td>
                <td>
                  <span
                    className={`sizes-req ${d.detail.toLowerCase().startsWith("required") ? "required" : "optional"}`}
                  >
                    {d.detail.toLowerCase().startsWith("required") ? "Required" : "Optional"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sizes-cta">
          <h3>Skip the manual resizing</h3>
          <p>
            BuildrStudio exports every size above in one click — device frames, gradients, AI
            headlines in 15+ languages, and canonical store filenames ready to upload. Free, no
            account required.
          </p>
          <Link href="/screenshot-builder" className="btn-fill btn-md" style={{ textDecoration: "none" }}>
            Generate all sizes free →
          </Link>
        </div>

        <h2>Frequently asked questions</h2>
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="sizes-faq-item">
            <div className="sizes-faq-q">{item.q}</div>
            <div className="sizes-faq-a">{item.a}</div>
          </div>
        ))}
      </div>
    </>
  );
}
