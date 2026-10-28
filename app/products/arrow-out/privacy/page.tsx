import Link from "next/link";
import Script from "next/script";
import { arrowMetadata, arrowJsonLd } from "../metadata";

const title = "ArrowOut Privacy Policy";
const description = "ArrowOut privacy information covering local progress, Apple services, advertising, diagnostics, and support.";
export const metadata = arrowMetadata("/privacy", title, description, true);

export default function PrivacyPage() {
  return (
    <article className="arrow-document">
      <Script id="arrow-privacy-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: arrowJsonLd("/privacy", title, description) }} />
      <Link className="arrow-back" href="/products/arrow-out">Back to ArrowOut</Link>
      <h1>Privacy policy</h1>
      <p>ArrowOut: Clear & Escape · Updated 28 October 2026</p>
      <h2>The game and your information</h2>
      <p>ArrowOut is developed by BuildrStudio, founded by Aditya Kumar. It does not require a separate ArrowOut account. Puzzle progress and settings are saved on your device. Contact us at <a href="mailto:hello@buildrstudio.in?subject=ArrowOut%20privacy">hello@buildrstudio.in</a> for privacy questions.</p>
      <h2>Apple services</h2>
      <p>When available, iCloud stores and synchronizes campaign progress using your iCloud account. Optional Game Center features use Apple authentication and achievements. Purchases and restoration use StoreKit and your Apple Account. BuildrStudio does not receive your payment card details through the game.</p>
      <p>These services are also covered by <a href="https://www.apple.com/legal/privacy/">Apple’s privacy policy</a>. Manage iCloud and Game Center in your Apple device settings.</p>
      <h2>Advertising and consent</h2>
      <p>The app includes Google Mobile Ads and Google’s User Messaging Platform. When ads are configured and enabled, the app requests non-personalized ads and presents consent choices when required. Non-personalized ads can still process information such as device identifiers, IP-derived approximate location, ad interactions, and diagnostics.</p>
      <p>See <a href="https://policies.google.com/privacy">Google’s privacy policy</a>. Ad privacy choices appear in ArrowOut Settings when required by the consent service. Advertising providers process data according to their privacy policies and your applicable consent choices.</p>
      <h2>Preferences, optional analytics and crash reports</h2>
      <p>Sound, vibration, appearance and privacy preferences stay on your device. The Help improve Arrow Out control in Settings enables optional Google Analytics for Firebase and Firebase Crashlytics. Collection is off by default. Older individual analytics and crash-report choices may be retained until you change this combined control.</p>
      <p>When analytics is enabled, gameplay events can include puzzle identifiers and revision, starts, completions, blocked moves, hints, resets, active play time, ad impressions and verified ad-removal purchases. Firebase can process app-instance identifiers, device and operating-system information and usage statistics. Advertising personalization, IDFA support and IDFV collection are disabled in this integration. Application code does not attach your iCloud or Game Center account identity or saved arrow-removal data.</p>
      <p>When crash reporting is enabled, Crashlytics receives technical diagnostics such as crash traces, app/device versions and puzzle identifiers. Turning off Help improve Arrow Out stops future optional analytics and crash-report collection; it does not automatically delete reports already received. See <a href="https://firebase.google.com/support/privacy">Firebase privacy information</a> for provider processing and retention practices.</p>
      <h2>Optional puzzle notifications</h2>
      <p>If you enable New puzzle notifications and grant iOS permission, Firebase Cloud Messaging and Apple Push Notification service process installation identifiers, push tokens and technical delivery information to send puzzle updates. Opening a notification can be recorded when analytics is enabled. You can disable notifications in ArrowOut or in device Settings. Firebase is not used as the progress database or app sign-in service.</p>
      <h2>Support and this website</h2>
      <p>If you email us, your message and the contact information you provide are used to respond to your request. Avoid sending sensitive information that is not needed to investigate an issue.</p>
      <p>This marketing website uses Vercel Analytics, Vercel Speed Insights, and Umami for website usage and performance measurement. Those website tools are separate from the game. Hosting and email services may process technical information needed to provide their services.</p>
      <h2>Your choices and requests</h2>
      <p>You can disable Help improve Arrow Out and New puzzle notifications in the game, manage Apple services in device settings, and use available ad privacy choices. Contact us to ask about information you have sent to support or request its deletion. Deleting the app may remove local-only progress; iCloud data is managed separately through Apple services.</p>
      <h2>Retention and requests</h2>
      <p>Local progress remains on your device until removed; iCloud progress is managed through Apple services. Google and Apple apply their respective retention and deletion controls to data processed through their services. Contact hello@buildrstudio.in with privacy questions or requests about information you have provided to BuildrStudio.</p>
      <p>For gameplay help, visit <Link href="/products/arrow-out/help">ArrowOut Help</Link>.</p>
    </article>
  );
}
