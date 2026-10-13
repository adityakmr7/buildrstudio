import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Wordmark from "../../../components/Wordmark";

const url = "https://www.buildrstudio.in/products/numa/help";
const title = "Numa Help & Support";
const description = "Get help with Numa, report a problem, share feedback, or contact us about your account and privacy.";
const email = "buildrstudioin@gmail.com";

export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website" },
  twitter: { card: "summary", title, description },
};

export default function NumaHelpPage() {
  return <div className="numa-help">
    <Script id="numa-help-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url }) }} />
    <header><Wordmark /><Link href="/products/numa">About Numa</Link></header>
    <main>
      <p className="label">Numa · Help & support</p>
      <h1>A little help,<br />when you need it.</h1>
      <p>Have a question about Numa, found a problem, or want to share an idea? We’d love to hear from you.</p>
      <section className="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact Numa support</h2>
        <p>Email us at <a href={`mailto:${email}?subject=Numa%20support`}>{email}</a>.</p>
        <p>For a technical problem, include your device model, Android version, Numa app version, and the steps that led to the issue. If there’s an error message, include its text or a screenshot with personal information hidden.</p>
        <p>Please don’t send passwords, recovery keys, or sensitive health records.</p>
      </section>
      <h2>Common questions</h2>
      <details><summary>How do I access the Android test?</summary><p>Numa is currently in Android internal testing. Open the testing link on the <Link href="/products/numa">Numa product page</Link> using your invited Google account. If Google Play says you don’t have access, check which account you’re signed into, then email support if you still need help.</p></details>
      <details><summary>What can I try if the app isn’t working?</summary><p>Close and reopen Numa, check for an update in Google Play, and restart your device if needed. If the problem continues, email us with the details above. Contact support before clearing app storage or uninstalling, as records saved only on your device may be lost.</p></details>
      <details><summary>How do I report a bug or suggest a feature?</summary><p>Email support with the subject “Numa feedback.” Tell us what you were trying to do, what happened, and what you expected. Features may change during internal testing, and your feedback helps us improve the app.</p></details>
      <details><summary>Who do I contact about privacy or account deletion?</summary><p>Email <a href={`mailto:${email}?subject=Numa%20privacy%20request`}>{email}</a> with the subject “Numa privacy request.” For account requests, send from your account email where possible so we can verify ownership. Never send your password or recovery key.</p></details>
    </main>
    <footer>A product by BuildrStudio · <Link href="/products/numa">Back to Numa</Link></footer>
    <style>{`
      .numa-help{min-height:100dvh;background:var(--bg);color:var(--text);font-family:var(--font-sans)}
      .numa-help header,.numa-help main,.numa-help footer{max-width:800px;margin:auto;padding:28px 24px}
      .numa-help header{display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid var(--border);font-size:14px}
      .numa-help main{padding-top:56px;padding-bottom:56px}.numa-help .label{font-size:12px;letter-spacing:.12em;text-transform:uppercase}
      .numa-help h1{font-family:Georgia,serif;font-size:clamp(38px,7vw,56px);font-weight:400;line-height:1.12;letter-spacing:-.03em;margin:18px 0 24px}
      .numa-help h2{font-size:23px;line-height:1.3;letter-spacing:-.02em;margin:40px 0 18px}
      .numa-help p{font-size:16px;line-height:1.75;color:var(--muted);margin:14px 0}
      .numa-help a{color:var(--accent);text-decoration:underline;text-underline-offset:4px;overflow-wrap:anywhere}.numa-help header a:first-child{text-decoration:none}
      .numa-help .contact{margin:32px 0 40px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:16px}.numa-help .contact h2{margin-top:0}
      .numa-help details{padding:20px 0;border-bottom:1px solid var(--border)}.numa-help summary{cursor:pointer;font-size:17px;font-weight:600;line-height:1.5}.numa-help details p{margin-bottom:0}
      .numa-help footer{border-top:1px solid var(--border);font-size:13px;color:var(--muted)}
      .numa-help a:focus-visible,.numa-help summary:focus-visible{outline:3px solid var(--accent);outline-offset:5px}
      @media(max-width:500px){.numa-help header,.numa-help main,.numa-help footer{padding-left:20px;padding-right:20px}.numa-help header{flex-wrap:wrap}.numa-help .contact{padding:20px}}
    `}</style>
  </div>;
}
