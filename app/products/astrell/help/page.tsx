import Link from "next/link";
import { siteConfig } from "../../../lib/siteConfig";
import { astrellMetadata } from "../metadata";

export const metadata = astrellMetadata("/help", "Astrell Help & Support", "Get help with Astrell focus timers, app blocking, soundscapes, Screen Time reports, and account management.");

const questions = [
  ["How do I start a focus session?", "Open Launch, choose a duration from 15 to 180 minutes, and tap Start focus. You can also use Start focus in Cosmos, review the setup sheet, and hold to begin. Choose Timer only to focus without app blocking."],
  ["How do I block distracting apps?", "Allow Screen Time access in Astrell Settings, then create a block list containing apps, categories, or websites. Choose that list under Blocked Apps before starting your session. Screen Time protection requires a physical iPhone."],
  ["How do Mindful Orbit and Deep Space Lock work?", "Mindful Orbit offers Mindful pause or end in Launch. Complete the breathing pause and hold to confirm early exit. Deep Space Lock keeps the session active until its end. iPhone Screen Time authorization remains under your control."],
  ["Why are my Screen Time reports missing?", "Reports depend on the activity supplied by iOS. Check Screen Time access in Astrell Settings, then use the refresh arrow on the Screen Time or Notification insights card in Cosmos. Screen Time details also has a Refresh action. New access or an iOS report delay may take time to show data. Timer history is stored separately on your device."],
  ["What if app blocking stops working?", "Open Astrell Settings, confirm Screen Time access, and use Repair app blocking. Review your block list and enabled schedules in Satellites. If the issue continues, email support with your iPhone model, iOS version, Astrell version, and the steps that reproduce it."],
  ["Can I listen with my screen locked?", "Session soundscapes continue while your iPhone is locked or Astrell is in the background. Pause affects audio while the timer and protection continue. Disconnecting headphones pauses playback. Resume it in the soundscape player. Audio stops when the session expires."],
  ["How do I create a soundscape mix?", "Choose a soundscape in Launch and hold to start a session. In the player, use + to open Create Mix. Add up to three tracks, including the starting sound, then Apply. Edit Mix adjusts individual volumes. You can preview candidates and cancel changes."],
  ["Can I pause schedules while away?", "Open Satellites and turn off the schedules you want to pause. Turn them back on when you return. A session that is already running keeps its current end time."],
  ["How do I turn off notifications from another app?", "Open iPhone Settings, tap Notifications, select the app, and turn off Allow Notifications. Astrell’s completion-notification preference controls its own focus reminders."],
  ["Does signing in sync my focus history?", "Focus history, discoveries, preferences, and block lists are stored on this device. Signing in manages your optional account. It does not sync progress between devices. Removing Astrell can remove local records."],
  ["How do I delete my account?", "Open Astrell Settings, choose Manage account, then Delete account. If recent sign-in is required, sign out and sign back in before retrying. Deleting the account leaves focus history and block lists on your device. Email support from your account address if you need assistance. Never send your password."],
];

export default function AstrellHelpPage() {
  return (
    <main id="astrell-main" className="astrell-document astrell-wrap">
      <p className="astrell-eyebrow">Astrell support</p>
      <h1>A little help<br />finding your orbit.</h1>
      <p className="astrell-lead">Help with focus, sound, and the space in between.</p>
      <section className="astrell-contact">
        <h2>Contact BuildrStudio</h2>
        <p>Email <a href={`mailto:${siteConfig.contact.email}?subject=Astrell%20support`}>{siteConfig.contact.email}</a>.</p>
        <p>For a technical issue, include your device model, iOS version, Astrell version, what you expected, and what happened. Hide personal information in screenshots. Please keep passwords and sensitive Screen Time details out of your message.</p>
      </section>
      <section aria-labelledby="astrell-questions">
        <h2 id="astrell-questions">Common questions</h2>
        {questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      </section>
      <p>Read the <Link href="/products/astrell/privacy">privacy policy</Link> for information about local records and optional account data.</p>
    </main>
  );
}
