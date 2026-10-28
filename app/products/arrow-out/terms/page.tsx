import Link from "next/link";
import Script from "next/script";
import { arrowMetadata, arrowJsonLd } from "../metadata";

const title = "ArrowOut Terms";
const description = "ArrowOut terms covering the app license, optional purchases, availability, saved progress, and support.";
export const metadata = arrowMetadata("/terms", title, description, true);

export default function TermsPage() {
  return (
    <article className="arrow-document">
      <Script id="arrow-terms-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: arrowJsonLd("/terms", title, description) }} />
      <Link className="arrow-back" href="/products/arrow-out">Back to ArrowOut</Link>
      <h1>Terms of use</h1>
      <p>ArrowOut: Clear & Escape · Updated 28 October 2026</p>
      <h2>About ArrowOut</h2>
      <p>ArrowOut is a puzzle game developed by BuildrStudio, founded by Aditya Kumar, for personal entertainment. Questions can be sent to <a href="mailto:hello@buildrstudio.in?subject=ArrowOut%20terms">hello@buildrstudio.in</a>.</p>
      <h2>Your app license</h2>
      <p>For an App Store release, <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Apple’s Standard End User License Agreement</a> applies unless a custom agreement is provided with the app. It covers the app license, permitted use, intellectual property, termination, warranties, and liability. These product notes do not replace that license or your mandatory consumer rights.</p>
      <h2>Optional purchases</h2>
      <p>Remove Ads is an optional one-time, non-consumable purchase handled by Apple. The localized price displayed before purchase applies. Use Settings → Restore purchases with the same Apple Account to restore eligible purchases.</p>
      <p>Apple’s purchase policies apply to transactions billed by Apple. You can request a refund through <a href="https://reportaproblem.apple.com/">Apple’s purchase support</a>; eligibility is determined by Apple and applicable consumer protections.</p>
      <h2>Availability and saved progress</h2>
      <p>Bundled puzzles work offline. Purchases, advertising, iCloud synchronization, Game Center, and downloading additional puzzles depend on connectivity and the availability of their providers. Additional puzzle releases are not guaranteed.</p>
      <p>Progress may become unavailable if local device data is removed or cloud services cannot be accessed. Check your iCloud status before deleting the app or changing devices.</p>
      <h2>Respectful use</h2>
      <p>Use the game in accordance with its license and applicable law. Do not interfere with its services, misuse them, or infringe other people’s rights.</p>
      <h2>Privacy and support</h2>
      <p>See the <Link href="/products/arrow-out/privacy">ArrowOut privacy policy</Link> for information about data processing, and <Link href="/products/arrow-out/help">ArrowOut Help</Link> for gameplay and purchase support.</p>
    </article>
  );
}
