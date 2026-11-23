import Image from "next/image";
import Link from "next/link";
import { astrellMetadata } from "./metadata";

export const metadata = astrellMetadata(
  "", "Astrell — Focus Timer & App Blocking for iPhone",
  "Make space for focus with app blocking, calming soundscapes, and a solar system that grows with your completed focus sessions.",
);

export default function AstrellPage() {
  return (
    <main id="astrell-main">
      <section className="astrell-hero astrell-wrap">
        <div className="astrell-hero-copy">
          <p className="astrell-eyebrow">A focus companion for iPhone</p>
          <h1>Make space<br />for <em>focus.</em></h1>
          <p className="astrell-lead">A little less distraction.<br />A world built from your time.</p>
          <p>Choose the apps to block, settle into a soundscape, and give one thing your attention. Your completed focus sessions bring a solar system to life.</p>
          <div className="astrell-actions">
            <a className="astrell-button" href="#features">Explore Astrell <span aria-hidden="true">↓</span></a>
            <Link className="astrell-text-link" href="/products/astrell/help">Help & support ↗</Link>
          </div>
          <p className="astrell-availability">Preparing for the App Store · iPhone · iOS 17 or later</p>
        </div>
        <figure className="astrell-hero-visual">
          <div className="astrell-glow" aria-hidden="true" />
          <div className="astrell-phone">
            <Image src="/astrell/cosmos.png" alt="Astrell Cosmos with a solar system, focus score, Screen Time summary, and discovery" width={1206} height={2622} sizes="(max-width: 760px) 72vw, 300px" priority />
          </div>
          <figcaption>Cosmos · Sample focus activity</figcaption>
        </figure>
      </section>

      <section id="features" className="astrell-section astrell-wrap">
        <div className="astrell-section-intro">
          <p className="astrell-eyebrow">One session at a time</p>
          <h2>Give your attention<br />some room.</h2>
        </div>
        <div className="astrell-features">
          <article><span className="astrell-feature-icon" aria-hidden="true">◷</span><h3>Start with your time.</h3><p>Set a timer from 15 to 180 minutes, or choose a focus preset. Add an intention and start when you’re ready.</p></article>
          <article><span className="astrell-feature-icon" aria-hidden="true">◈</span><h3>Put distractions on hold.</h3><p>Create block lists for apps, categories, and websites. Use Mindful Orbit for a considered early exit, or Deep Space Lock for a session that runs to its end.</p></article>
          <article><span className="astrell-feature-icon" aria-hidden="true">≈</span><h3>Find your atmosphere.</h3><p>Choose from 14 soundscapes, mix up to three layers, and adjust each volume. Session audio continues while your screen is locked.</p></article>
        </div>
      </section>

      <section className="astrell-showcase astrell-wrap">
        <div className="astrell-art-panel">
          <Image src="/astrell/first-light.jpg" alt="Astrell’s First Light sun with a warm golden glow" width={1024} height={1024} sizes="(max-width: 760px) 85vw, 480px" />
        </div>
        <div>
          <p className="astrell-eyebrow">Your Cosmos</p>
          <h2>Let your focus<br /><em>take shape.</em></h2>
          <p>Begin with First Spark. As your completed focus time grows, discover a sun, planets, moons, and objects beyond the solar system.</p>
          <p>See today’s Screen Time and notification insights alongside your focus progress. Schedule sessions in Satellites to make space throughout the week.</p>
        </div>
      </section>

      <section className="astrell-local astrell-wrap">
        <p className="astrell-eyebrow">Your time, on your device</p>
        <h2>A quieter place to begin.</h2>
        <p>Your focus history and block lists stay on your iPhone. Use the timer without an account. Screen Time access enables app blocking and activity reports, and signing in is optional.</p>
        <Link className="astrell-text-link" href="/products/astrell/privacy">Read Astrell’s privacy policy ↗</Link>
      </section>
    </main>
  );
}
