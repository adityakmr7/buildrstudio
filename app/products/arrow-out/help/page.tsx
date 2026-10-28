import Link from "next/link";
import Script from "next/script";
import { arrowMetadata, arrowJsonLd } from "../metadata";
import { siteConfig } from "../../../lib/siteConfig";

const title = "ArrowOut Help | Gameplay & support";
const description = "Get help with ArrowOut puzzles, hearts, hints, saved progress, iCloud, and restoring purchases.";
export const metadata = arrowMetadata("/help", title, description);

export default function HelpPage() {
  return (
    <article className="arrow-document">
      <Script id="arrow-help-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: arrowJsonLd("/help", title, description) }} />
      <Link className="arrow-back" href="/products/arrow-out">Back to ArrowOut</Link>
      <h1>A little help<br />finding your way.</h1>
      <p>Gameplay questions, saved progress, and support for ArrowOut: Clear & Escape.</p>
      <details open><summary>How do I play?</summary><p>Tap an arrow with a clear way out. Clear every arrow to finish the puzzle. A blocked move costs one of three hearts. Reset the board freely to try again. After dismissing the first-play card, the lightbulb highlights a legal move without spending a heart. Pinch to zoom and drag to pan.</p></details>
      <details><summary>Where is my progress saved?</summary><p>Your progress is saved on your device, including offline. With iCloud available, campaign progress can sync between devices using the same iCloud account. iCloud synchronization is automatic when your account is available. Contact us before deleting the app if your progress is only saved locally; deleting it may remove that progress.</p></details>
      <details><summary>Can I replay a completed puzzle?</summary><p>Open Pause → Puzzles to revisit completed boards. Replay attempts do not replace your current campaign attempt.</p></details>
      <details><summary>How do I restore Remove Ads?</summary><p>Open Settings → Restore purchases using the Apple Account you used to buy Remove Ads. It is a one-time purchase. If restoration fails, check your internet connection and Apple Account, then contact us with the app version and the message you see.</p><p>For refund requests on purchases billed by Apple, use <a href="https://reportaproblem.apple.com/">Apple’s purchase support</a>. Apple determines eligibility.</p></details>
      <details><summary>How do I change sound, vibration, or appearance?</summary><p>Open Settings to adjust sound, vibration, and dark mode independently. Sound respects your device’s silent mode. Animations adapt to the system Reduce Motion setting.</p></details>
      <details><summary>Where are the privacy controls?</summary><p>Manage iCloud and Game Center through Apple’s device settings. ArrowOut displays Ad privacy choices in Settings when the advertising consent service requires them. Read the <Link href="/products/arrow-out/privacy">privacy policy</Link> for more information.</p></details>
      <section className="arrow-contact" style={{ marginTop: 36 }}>
        <h2 style={{ marginTop: 0 }}>Still need a hand?</h2>
        <p>Email <a href={`mailto:${siteConfig.contact.email}?subject=ArrowOut%20support`}>{siteConfig.contact.email}</a>. Include your device model, iOS or iPadOS version, ArrowOut version, level number, and what happened. Please don’t send passwords or payment card details.</p>
      </section>
    </article>
  );
}
