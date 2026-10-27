import Link from "next/link";
import Script from "next/script";
import { arrowMetadata, arrowJsonLd } from "../metadata";

const title = "ArrowOut Privacy Policy | Release review draft";
const description = "ArrowOut privacy information covering local progress, Apple services, advertising, diagnostics, and support.";
export const metadata = arrowMetadata("/privacy", title, description, true);

export default function PrivacyPage() {
  return (
    <article className="arrow-document">
      <Script id="arrow-privacy-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: arrowJsonLd("/privacy", title, description) }} />
      <Link className="arrow-back" href="/products/arrow-out">Back to ArrowOut</Link>
      <h1>Privacy policy</h1>
      <p>ArrowOut: Clear & Escape · Prepared 8 October 2026</p>
      <aside className="arrow-review">
        <p>Release review draft. This page describes the current app implementation. The final release’s advertising disclosures, retention periods, operator details, and regional privacy terms still need confirmation before App Store submission.</p>
      </aside>
      <h2>The game and your information</h2>
      <p>ArrowOut is developed by BuildrStudio, founded by Aditya Kumar. It does not require a separate ArrowOut account. Puzzle progress and settings are saved on your device. Contact us at <a href="mailto:hello@buildrstudio.in?subject=ArrowOut%20privacy">hello@buildrstudio.in</a> for privacy questions.</p>
      <h2>Apple services</h2>
      <p>When available, iCloud stores and synchronizes campaign progress using your iCloud account. Optional Game Center features use Apple authentication and achievements. Purchases and restoration use StoreKit and your Apple Account. BuildrStudio does not receive your payment card details through the game.</p>
      <p>These services are also covered by <a href="https://www.apple.com/legal/privacy/">Apple’s privacy policy</a>. Manage iCloud and Game Center in your Apple device settings.</p>
      <h2>Advertising and consent</h2>
      <p>The app includes Google Mobile Ads and Google’s User Messaging Platform. When ads are configured and enabled, the app requests non-personalized ads and presents consent choices when required. Non-personalized ads can still process information such as device identifiers, IP-derived approximate location, ad interactions, and diagnostics.</p>
      <p>See <a href="https://policies.google.com/privacy">Google’s privacy policy</a>. Ad privacy choices appear in ArrowOut Settings when required by the consent service. The final SDK data inventory and any advertising partners must be confirmed for the release; this draft is not a completed App Store privacy declaration.</p>
      <h2>Preferences and local diagnostics</h2>
      <p>Sound, vibration, and appearance preferences stay on your device. Optional local diagnostics write game events to operating-system logs in the current implementation. No Firebase analytics integration is present in the inspected game build.</p>
      <h2>Support and this website</h2>
      <p>If you email us, your message and the contact information you provide are used to respond to your request. Avoid sending sensitive information that is not needed to investigate an issue.</p>
      <p>This marketing website uses Vercel Analytics, Vercel Speed Insights, and Umami for website usage and performance measurement. Those website tools are separate from the game. Hosting and email services may process technical information needed to provide their services.</p>
      <h2>Your choices and requests</h2>
      <p>You can disable local diagnostics in the game, manage Apple services in device settings, and use available ad privacy choices. Contact us to ask about information you have sent to support or request its deletion. Deleting the app may remove local-only progress; iCloud data is managed separately through Apple services.</p>
      <h2>Before release</h2>
      <p>Retention schedules, support providers, security and international transfer details, applicable regional rights, and the intended audience must be confirmed against the final release. A reviewed policy and effective date will replace this draft when those details are settled.</p>
      <p>For gameplay help, visit <Link href="/products/arrow-out/help">ArrowOut Help</Link>.</p>
    </article>
  );
}
