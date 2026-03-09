import ThemeToggle from "../../components/ThemeToggle";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Anchor: Tiny Habits",
  description:
    "Anchor is private by design. Your habits live only on your device. Learn exactly what we collect and why.",
};

export default function AnchorPrivacy() {
  return (
    <>
      <style>{`
        /* ─── HEADER (matches homepage) ─── */
        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background .3s, border .3s;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .site-logo-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--fill);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          color: var(--fill-text);
          font-weight: 800;
        }
        .site-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -0.5px;
        }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          padding: 8px 14px;
          border-radius: var(--r-sm);
          transition: all .15s;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-link:hover { background: var(--fill-subtle); color: var(--text-1); }
        .nav-link.back {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link.back::before {
          content: '←';
          font-size: 15px;
        }

        /* ─── PAGE LAYOUT ─── */
        .pp-wrap {
          max-width: 780px;
          margin: 0 auto;
          padding: 48px 40px 80px;
        }

        /* ─── HERO ─── */
        .pp-hero {
          background: var(--fill);
          color: var(--fill-text);
          border-radius: var(--r-2xl);
          padding: 44px 40px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .pp-hero::after {
          content: '⚓';
          position: absolute;
          right: 28px; top: 16px;
          font-size: 88px;
          opacity: 0.07;
          line-height: 1;
          pointer-events: none;
        }
        .pp-hero-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: .5;
          margin-bottom: 14px;
        }
        .pp-hero h1 {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.8px;
          margin-bottom: 8px;
          line-height: 1.15;
        }
        .pp-hero-sub {
          font-size: 15px;
          opacity: .65;
          margin-bottom: 24px;
          line-height: 1.6;
          max-width: 480px;
        }
        .pp-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .pp-hero-meta-item { font-size: 12px; opacity: .5; }
        .pp-hero-meta-item strong { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; opacity: 1; }

        /* ─── TL;DR ─── */
        .tldr {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          padding: 24px 28px;
          margin-bottom: 16px;
        }
        .tldr-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .tldr-icon {
          width: 34px; height: 34px;
          border-radius: var(--r-sm);
          background: var(--fill-subtle);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .tldr-head h2 { font-size: 15px; font-weight: 700; color: var(--text-1); flex: 1; }
        .tldr-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: var(--r-xs);
          background: var(--fill-subtle);
          color: var(--text-3);
        }
        .tldr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 10px;
        }
        .tldr-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          background: var(--surface-2);
          border-radius: var(--r-md);
          padding: 12px;
        }
        .tldr-item-emoji { font-size: 18px; line-height: 1.3; flex-shrink: 0; }
        .tldr-item-text { font-size: 13px; color: var(--text-2); line-height: 1.5; }
        .tldr-item-text strong { display: block; color: var(--text-1); font-size: 12px; margin-bottom: 2px; }

        /* ─── SECTION ─── */
        .pp-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          padding: 28px 32px;
          margin-bottom: 16px;
        }
        .pp-section-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }
        .pp-num {
          width: 26px; height: 26px;
          border-radius: var(--r-xs);
          background: var(--fill);
          color: var(--fill-text);
          font-size: 11px;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-section h2 { font-size: 16px; font-weight: 700; color: var(--text-1); }

        .pp-section p {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.7;
          margin-bottom: 14px;
        }
        .pp-section p:last-child { margin-bottom: 0; }
        .pp-section p a { color: var(--text-1); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }

        .pp-section h3 {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-1);
          margin: 20px 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pp-section h3:first-child { margin-top: 0; }

        .pp-section ul, .pp-section ol { padding-left: 18px; margin-bottom: 14px; }
        .pp-section li { font-size: 14px; color: var(--text-2); margin-bottom: 6px; line-height: 1.6; }
        .pp-section li:last-child { margin-bottom: 0; }
        .pp-section li strong { color: var(--text-1); }
        .pp-section code {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-xs);
          padding: 1px 6px;
          font-size: 12px;
          font-family: 'SF Mono', 'Fira Code', monospace;
          color: var(--text-1);
        }

        /* ─── DATA TABLE ─── */
        .dt { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 13px; }
        .dt th {
          text-align: left;
          padding: 9px 14px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-3);
        }
        .dt td {
          padding: 10px 14px;
          border: 1px solid var(--border);
          color: var(--text-2);
          vertical-align: top;
          line-height: 1.5;
        }
        .dt td strong { color: var(--text-1); }
        .dt td a { color: var(--text-1); text-decoration: underline; text-underline-offset: 2px; }
        .dt tr:nth-child(even) td { background: var(--surface-2); }

        /* ─── CALLOUT BOX ─── */
        .box {
          border-radius: var(--r-md);
          padding: 13px 16px;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 14px;
          color: var(--text-2);
          border: 1px solid var(--border);
          background: var(--surface-2);
        }
        .box:last-child { margin-bottom: 0; }
        .box strong { color: var(--text-1); }

        /* ─── CONTACT CARD ─── */
        .contact-card {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contact-row { display: flex; align-items: baseline; gap: 12px; font-size: 14px; }
        .contact-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-3); width: 80px; flex-shrink: 0; }
        .contact-row a { color: var(--text-1); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
        .contact-row span { color: var(--text-2); }

        /* ─── FOOTER ─── */
        .site-footer {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 40px 64px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-left { font-size: 13px; color: var(--text-3); }
        .footer-left strong { color: var(--text-1); }
        .footer-right { font-size: 12px; color: var(--text-4); }
        .footer-links { display: flex; gap: 16px; align-items: center; }
        .footer-link { font-size: 12px; color: var(--text-3); text-decoration: none; transition: color .15s; }
        .footer-link:hover { color: var(--text-1); }
        .footer-sep { color: var(--text-4); font-size: 12px; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .site-header { padding: 16px 20px; }
          .pp-wrap { padding: 32px 20px 60px; }
          .pp-hero { padding: 32px 24px; }
          .pp-hero h1 { font-size: 24px; }
          .pp-section { padding: 22px 20px; }
          .tldr { padding: 20px; }
          .site-footer { padding: 20px; flex-direction: column; gap: 8px; text-align: center; }
          .footer-links { justify-content: center; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="site-header">
        <Link href="/" className="site-logo">
          <div className="site-logo-mark">B</div>
          <span className="site-logo-text">BuildrStudio</span>
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link back">Home</Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="pp-wrap">

        {/* ─── HERO ─── */}
        <div className="pp-hero">
          <div className="pp-hero-eyebrow">Anchor – Tiny Habits</div>
          <h1>Privacy Policy</h1>
          <p className="pp-hero-sub">
            We built Anchor to be private by design. Your habits live only on your device — we never upload them.
          </p>
          <div className="pp-hero-meta">
            <div className="pp-hero-meta-item"><strong>Effective</strong>March 9, 2026</div>
            <div className="pp-hero-meta-item"><strong>Updated</strong>March 9, 2026</div>
            <div className="pp-hero-meta-item"><strong>Developer</strong>Buildr Studio</div>
            <div className="pp-hero-meta-item"><strong>Contact</strong>dev.adityakmr@gmail.com</div>
          </div>
        </div>

        {/* ─── TL;DR ─── */}
        <div className="tldr">
          <div className="tldr-head">
            <div className="tldr-icon">⚡</div>
            <h2>The short version</h2>
            <span className="tldr-tag">TL;DR</span>
          </div>
          <div className="tldr-grid">
            <div className="tldr-item">
              <span className="tldr-item-emoji">📱</span>
              <div className="tldr-item-text"><strong>Local-first</strong>Habits, logs, and streaks live only on your device. Never uploaded.</div>
            </div>
            <div className="tldr-item">
              <span className="tldr-item-emoji">🚫</span>
              <div className="tldr-item-text"><strong>No ads, ever</strong>We don't sell your data or serve you ads. Period.</div>
            </div>
            <div className="tldr-item">
              <span className="tldr-item-emoji">👤</span>
              <div className="tldr-item-text"><strong>No account needed</strong>No email, no password. Use the app completely anonymously.</div>
            </div>
            <div className="tldr-item">
              <span className="tldr-item-emoji">🔔</span>
              <div className="tldr-item-text"><strong>Notifications optional</strong>Only requested if you tap "Enable reminders". Fully skippable.</div>
            </div>
            <div className="tldr-item">
              <span className="tldr-item-emoji">🔥</span>
              <div className="tldr-item-text"><strong>Firebase = anonymous</strong>Used for crash reports only — never to identify you personally.</div>
            </div>
            <div className="tldr-item">
              <span className="tldr-item-emoji">🗑️</span>
              <div className="tldr-item-text"><strong>Delete anytime</strong>Uninstalling the app permanently deletes all your data.</div>
            </div>
          </div>
        </div>

        {/* 1 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">1</div>
            <h2>Who We Are</h2>
          </div>
          <p>
            Anchor – Tiny Habits ("Anchor", "the app", "we", "us", "our") is developed and
            operated by <strong>Buildr Studio</strong>, an independent app studio by Aditya Kumar.
            This Privacy Policy explains how we handle information when you use our iOS and Android
            application.
          </p>
          <p>
            Questions? Email us at{" "}
            <a href="mailto:dev.adityakmr@gmail.com">dev.adityakmr@gmail.com</a> — we respond
            within 30 days.
          </p>
        </div>

        {/* 2 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">2</div>
            <h2>Data We Collect</h2>
          </div>

          <h3>2.1 Data you provide — stored locally on your device</h3>
          <p>
            Everything below is stored exclusively in a SQLite database on your device using{" "}
            <code>expo-sqlite</code>. It is never sent to our servers or any third party.
          </p>

          <table className="dt">
            <thead>
              <tr><th>Data</th><th>What it is</th><th>Sent off device?</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Your name</strong></td><td>The first name you enter on the welcome screen</td><td>No</td></tr>
              <tr><td><strong>Habit data</strong></td><td>Name, emoji, focus area, micro-habit, anchor moment, reminder time</td><td>No</td></tr>
              <tr><td><strong>Daily logs</strong></td><td>Done / skipped status and skip reason per habit per day</td><td>No</td></tr>
              <tr><td><strong>Streak data</strong></td><td>Current streak, longest streak, total completions</td><td>No</td></tr>
              <tr><td><strong>App preferences</strong></td><td>Theme (light/dark), notifications on/off, reminder time</td><td>No</td></tr>
            </tbody>
          </table>

          <div className="box">
            <strong>Plain language:</strong> Your habit data is yours. It never leaves your phone unless you back up your device via iCloud or Google Backup — which are governed by Apple&apos;s or Google&apos;s own privacy policies.
          </div>

          <h3>2.2 Data collected automatically</h3>

          <table className="dt">
            <thead>
              <tr><th>Data</th><th>What it is</th><th>Why</th><th>Third party</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Anonymous user ID</strong></td>
                <td>A random, non-identifying UID from Firebase Authentication</td>
                <td>Required to use Firebase; cannot be linked to you</td>
                <td>Google Firebase</td>
              </tr>
              <tr>
                <td><strong>Crash reports</strong></td>
                <td>Stack traces, device model, OS version when the app crashes</td>
                <td>Detect and fix bugs</td>
                <td>Firebase Crashlytics</td>
              </tr>
              <tr>
                <td><strong>Anonymous events</strong></td>
                <td>Events like "onboarding completed", "habit marked done" — no content</td>
                <td>Understand feature usage</td>
                <td>Firebase Analytics</td>
              </tr>
            </tbody>
          </table>

          <div className="box">
            <strong>About Firebase:</strong> Firebase anonymous auth creates a random UID with no connection to your name, email, or device serial. Usage events contain no habit names or personal content — only counts and flow steps.
          </div>
        </div>

        {/* 3 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">3</div>
            <h2>Data We Do NOT Collect</h2>
          </div>
          <ul>
            <li>Email address, phone number, or any contact information</li>
            <li>Location data (GPS or IP-based)</li>
            <li>Device contacts, camera, microphone, or photo library</li>
            <li>Payment or financial information</li>
            <li>Your actual habit names, log notes, or skip reasons (these stay local)</li>
            <li>Information about other apps on your device</li>
            <li>Any data for advertising, profiling, or third-party marketing</li>
          </ul>
        </div>

        {/* 4 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">4</div>
            <h2>How We Use Your Data</h2>
          </div>

          <h3>On-device data</h3>
          <ul>
            <li>Display your habit card, streak, and progress on the home screen</li>
            <li>Build your 35-day dashboard grid and completion statistics</li>
            <li>Schedule your daily reminder notification at your chosen time</li>
            <li>Resume onboarding if you exit the app mid-flow</li>
            <li>Remember your name and preferences between sessions</li>
          </ul>

          <h3>Firebase data</h3>
          <ul>
            <li><strong>Anonymous UID:</strong> Required to use Firebase services. Not used to identify you personally.</li>
            <li><strong>Crash reports:</strong> Used solely to detect and fix app crashes.</li>
            <li><strong>Anonymous analytics:</strong> Used to understand feature usage and improve the app. No personal information included.</li>
          </ul>

          <div className="box">
            <strong>We do not use your data to</strong> serve ads, build profiles, sell to third parties, or make automated decisions about you.
          </div>
        </div>

        {/* 5 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">5</div>
            <h2>Third-Party Services</h2>
          </div>
          <table className="dt">
            <thead>
              <tr><th>Service</th><th>Purpose</th><th>Privacy Policy</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Firebase Authentication</strong> · Google LLC</td>
                <td>Anonymous user sessions</td>
                <td><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">firebase.google.com/support/privacy</a></td>
              </tr>
              <tr>
                <td><strong>Firebase Analytics</strong> · Google LLC</td>
                <td>Anonymous usage analytics</td>
                <td><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">firebase.google.com/support/privacy</a></td>
              </tr>
              <tr>
                <td><strong>Firebase Crashlytics</strong> · Google LLC</td>
                <td>Crash reporting</td>
                <td><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">firebase.google.com/support/privacy</a></td>
              </tr>
              <tr>
                <td><strong>expo-notifications</strong> · Expo / Microsoft</td>
                <td>Local push notifications</td>
                <td><a href="https://expo.dev/privacy" target="_blank" rel="noopener noreferrer">expo.dev/privacy</a></td>
              </tr>
            </tbody>
          </table>
          <p>
            We do not use any advertising SDKs, social media SDKs, or cross-app tracking services.
            The above is the complete and exhaustive list.
          </p>
        </div>

        {/* 6 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">6</div>
            <h2>Notifications</h2>
          </div>
          <ul>
            <li><strong>Opt-in only.</strong> We request notification permission only if you tap "Enable reminders". You can skip this entirely.</li>
            <li><strong>Scheduled locally.</strong> Reminders are scheduled on your device via <code>expo-notifications</code>. No network required. Not sent through a push server.</li>
            <li><strong>Revocable.</strong> Disable anytime in Settings → Notifications → Anchor, or in the app&apos;s Profile tab.</li>
          </ul>
          <p>We do not send marketing notifications or any message beyond your one daily habit reminder.</p>
        </div>

        {/* 7 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">7</div>
            <h2>Data Storage &amp; Security</h2>
          </div>

          <h3>Local data</h3>
          <p>
            Your habit data is stored in the app&apos;s private storage sandbox — inaccessible to
            other apps and protected by your device&apos;s lock screen encryption.
          </p>

          <h3>Firebase data</h3>
          <p>
            Stored on Google&apos;s servers, certified under ISO 27001 and SOC 2. Encrypted in
            transit (TLS) and at rest.
          </p>

          <h3>Retention periods</h3>
          <ul>
            <li><strong>Local data:</strong> Until you uninstall the app or clear app data.</li>
            <li><strong>Firebase Analytics:</strong> Up to 14 months (Google default).</li>
            <li><strong>Crashlytics:</strong> 90 days.</li>
          </ul>

          <div className="box">
            <strong>To delete all your data:</strong> Uninstall the app. All locally stored habits, logs, and preferences are permanently deleted. Firebase anonymous session data expires automatically per Google&apos;s retention schedule.
          </div>
        </div>

        {/* 8 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">8</div>
            <h2>Your Rights &amp; Choices</h2>
          </div>
          <p>
            Regardless of your location, we offer the following controls to all users:
          </p>
          <table className="dt">
            <thead>
              <tr><th>Right</th><th>How to exercise it</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Access your data</strong></td>
                <td>All habit data is visible inside the app at all times.</td>
              </tr>
              <tr>
                <td><strong>Delete your data</strong></td>
                <td>Uninstall the app for local data. Email us to request deletion of Firebase session data.</td>
              </tr>
              <tr>
                <td><strong>Opt out of analytics</strong></td>
                <td>In-app toggle coming in a future update. Until then, contact us and we&apos;ll assist.</td>
              </tr>
              <tr>
                <td><strong>Opt out of notifications</strong></td>
                <td>Settings → Notifications → Anchor, or toggle in Profile tab.</td>
              </tr>
              <tr>
                <td><strong>Data portability</strong></td>
                <td>Your data is in a standard SQLite file on your device. Contact us if you need help exporting it.</td>
              </tr>
            </tbody>
          </table>
          <p>
            To exercise any right, email{" "}
            <a href="mailto:dev.adityakmr@gmail.com">dev.adityakmr@gmail.com</a>. We respond
            within 30 days.
          </p>
        </div>

        {/* 9 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">9</div>
            <h2>Children&apos;s Privacy</h2>
          </div>
          <p>
            Anchor is rated <strong>4+ (App Store)</strong> and{" "}
            <strong>Everyone (Google Play)</strong>. It is not specifically directed at children
            under 13. We do not knowingly collect personal information from children. Because we
            require no account creation or personal information, there is no meaningful way for a
            child to provide personal data through the app.
          </p>
          <p>
            If you believe a child has provided personal information to us, contact{" "}
            <a href="mailto:dev.adityakmr@gmail.com">dev.adityakmr@gmail.com</a> and we will take
            appropriate action.
          </p>
        </div>

        {/* 10 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">10</div>
            <h2>International Users</h2>
          </div>
          <p>
            Anchor is available worldwide. If you are outside India, your Firebase data may be
            processed on Google servers in the United States or other countries. By using the app
            you acknowledge this transfer.
          </p>
          <p>
            <strong>EU / UK users:</strong> Google LLC participates in the EU–U.S. Data Privacy
            Framework and provides Standard Contractual Clauses. See{" "}
            <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s privacy documentation
            </a>{" "}
            for details.
          </p>
        </div>

        {/* 11 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">11</div>
            <h2>iOS App Privacy Label</h2>
          </div>
          <table className="dt">
            <thead>
              <tr><th>Data type</th><th>Collected?</th><th>Linked to you?</th><th>Used for tracking?</th></tr>
            </thead>
            <tbody>
              <tr><td>Contact Info</td><td>No</td><td>—</td><td>—</td></tr>
              <tr><td>Health &amp; Fitness</td><td>No</td><td>—</td><td>—</td></tr>
              <tr><td>Location</td><td>No</td><td>—</td><td>—</td></tr>
              <tr><td>Identifiers</td><td>No</td><td>—</td><td>—</td></tr>
              <tr><td>Usage Data (anonymous)</td><td>Yes</td><td>No</td><td>No</td></tr>
              <tr><td>Diagnostics (crash logs)</td><td>Yes</td><td>No</td><td>No</td></tr>
            </tbody>
          </table>
        </div>

        {/* 12 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">12</div>
            <h2>Changes to This Policy</h2>
          </div>
          <p>
            We may update this policy from time to time. Material changes will be reflected in the{" "}
            <strong>Last Updated</strong> date above and communicated through the app or release
            notes. We will never retroactively permit sharing or selling of your data.
          </p>
        </div>

        {/* 13 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">13</div>
            <h2>Contact</h2>
          </div>
          <p>Questions, requests, or concerns — reach out anytime:</p>
          <div className="contact-card">
            <div className="contact-row"><span className="contact-lbl">Developer</span><span>Buildr Studio · Aditya Kumar</span></div>
            <div className="contact-row"><span className="contact-lbl">Email</span><a href="mailto:dev.adityakmr@gmail.com">dev.adityakmr@gmail.com</a></div>
            <div className="contact-row"><span className="contact-lbl">App</span><span>Anchor – Tiny Habits (in.buildrstudio.anchor)</span></div>
            <div className="contact-row"><span className="contact-lbl">Response</span><span>Within 30 days</span></div>
          </div>
        </div>

      </div>{/* /pp-wrap */}

      {/* ─── FOOTER ─── */}
      <footer className="site-footer">
        <div className="footer-left">
          <strong>BuildrStudio</strong> by Aditya Kumar · 2026
        </div>
        <div className="footer-links">
          <Link href="/" className="footer-link">Home</Link>
          <span className="footer-sep">·</span>
          <Link href="/anchor/support" className="footer-link">Support</Link>
          <span className="footer-sep">·</span>
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>Privacy Policy</span>
        </div>
      </footer>
    </>
  );
}
