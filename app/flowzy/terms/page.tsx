import ThemeToggle from "../../components/ThemeToggle";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions – Flowzy",
  description:
    "Terms and conditions for using Flowzy – Focus Timer. Covers subscription terms, acceptable use, and your rights.",
};

export default function FlowzyTerms() {
  return (
    <>
      <style>{`
        /* ─── HEADER ─── */
        .site-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 40px; border-bottom: 1px solid var(--border);
          background: var(--surface); position: sticky; top: 0; z-index: 100;
          transition: background .3s, border .3s;
        }
        .site-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .site-logo-mark {
          width: 36px; height: 36px; border-radius: 10px; background: var(--fill);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: var(--fill-text); font-weight: 800;
        }
        .site-logo-text { font-size: 18px; font-weight: 800; color: var(--text-1); letter-spacing: -0.5px; }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          font-size: 14px; font-weight: 500; color: var(--text-2);
          padding: 8px 14px; border-radius: var(--r-sm);
          transition: all .15s; cursor: pointer; text-decoration: none;
          display: flex; align-items: center; gap: 6px;
        }
        .nav-link:hover { background: var(--fill-subtle); color: var(--text-1); }
        .nav-link.back::before { content: '←'; font-size: 15px; }

        /* ─── PAGE LAYOUT ─── */
        .pp-wrap { max-width: 780px; margin: 0 auto; padding: 48px 40px 80px; }

        /* ─── HERO ─── */
        .pp-hero {
          background: var(--fill); color: var(--fill-text);
          border-radius: var(--r-2xl); padding: 44px 40px;
          margin-bottom: 28px; position: relative; overflow: hidden;
        }
        .pp-hero::after {
          content: '📋'; position: absolute; right: 28px; top: 16px;
          font-size: 88px; opacity: 0.07; line-height: 1; pointer-events: none;
        }
        .pp-hero-eyebrow {
          display: inline-block; font-size: 11px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase; opacity: .5; margin-bottom: 14px;
        }
        .pp-hero h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 8px; line-height: 1.15; }
        .pp-hero-sub { font-size: 15px; opacity: .65; margin-bottom: 24px; line-height: 1.6; max-width: 480px; }
        .pp-hero-meta { display: flex; flex-wrap: wrap; gap: 20px; }
        .pp-hero-meta-item { font-size: 12px; opacity: .5; }
        .pp-hero-meta-item strong { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; opacity: 1; }

        /* ─── SECTION ─── */
        .pp-section {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--r-xl); padding: 28px 32px; margin-bottom: 16px;
        }
        .pp-section-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border);
        }
        .pp-num {
          width: 26px; height: 26px; border-radius: var(--r-xs);
          background: var(--fill); color: var(--fill-text);
          font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pp-section h2 { font-size: 16px; font-weight: 700; color: var(--text-1); }
        .pp-section p { font-size: 14px; color: var(--text-2); line-height: 1.7; margin-bottom: 14px; }
        .pp-section p:last-child { margin-bottom: 0; }
        .pp-section p a { color: var(--text-1); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
        .pp-section h3 { font-size: 13px; font-weight: 700; color: var(--text-1); margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .pp-section h3:first-child { margin-top: 0; }
        .pp-section ul, .pp-section ol { padding-left: 18px; margin-bottom: 14px; }
        .pp-section li { font-size: 14px; color: var(--text-2); margin-bottom: 6px; line-height: 1.6; }
        .pp-section li:last-child { margin-bottom: 0; }
        .pp-section li strong { color: var(--text-1); }

        /* ─── CALLOUT BOX ─── */
        .box {
          border-radius: var(--r-md); padding: 13px 16px; font-size: 13px;
          line-height: 1.6; margin-bottom: 14px; color: var(--text-2);
          border: 1px solid var(--border); background: var(--surface-2);
        }
        .box:last-child { margin-bottom: 0; }
        .box strong { color: var(--text-1); }

        /* ─── CONTACT CARD ─── */
        .contact-card {
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 18px 20px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .contact-row { display: flex; align-items: baseline; gap: 12px; font-size: 14px; }
        .contact-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-3); width: 80px; flex-shrink: 0; }
        .contact-row a { color: var(--text-1); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
        .contact-row span { color: var(--text-2); }

        /* ─── FOOTER ─── */
        .site-footer {
          max-width: 1100px; margin: 0 auto; padding: 24px 40px 64px;
          border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-left { font-size: 13px; color: var(--text-3); }
        .footer-left strong { color: var(--text-1); }
        .footer-links { display: flex; gap: 16px; align-items: center; }
        .footer-link { font-size: 12px; color: var(--text-3); text-decoration: none; transition: color .15s; }
        .footer-link:hover { color: var(--text-1); }
        .footer-sep { color: var(--text-4); font-size: 12px; }

        @media (max-width: 768px) {
          .site-header { padding: 16px 20px; }
          .pp-wrap { padding: 32px 20px 60px; }
          .pp-hero { padding: 32px 24px; }
          .pp-hero h1 { font-size: 24px; }
          .pp-section { padding: 22px 20px; }
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
          <div className="pp-hero-eyebrow">Flowzy – Focus Timer</div>
          <h1>Terms &amp; Conditions</h1>
          <p className="pp-hero-sub">
            By downloading or using Flowzy, you agree to these terms. Please read them carefully — they&apos;re written to be clear, not to confuse.
          </p>
          <div className="pp-hero-meta">
            <div className="pp-hero-meta-item"><strong>Effective</strong>March 14, 2026</div>
            <div className="pp-hero-meta-item"><strong>Updated</strong>March 14, 2026</div>
            <div className="pp-hero-meta-item"><strong>Developer</strong>Buildr Studio</div>
            <div className="pp-hero-meta-item"><strong>Contact</strong>adityakmr9672@gmail.com</div>
          </div>
        </div>

        {/* 1 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">1</div>
            <h2>Acceptance of Terms</h2>
          </div>
          <p>
            These Terms &amp; Conditions ("Terms") govern your use of <strong>Flowzy</strong> ("the
            app"), developed by <strong>Buildr Studio</strong>, an independent app studio by Aditya
            Kumar ("we", "us", "our"). By downloading, installing, or using the app you agree to be
            bound by these Terms.
          </p>
          <p>
            If you do not agree to these Terms, do not download or use the app. We may update these
            Terms from time to time — continued use after changes constitutes acceptance of the
            updated Terms.
          </p>
        </div>

        {/* 2 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">2</div>
            <h2>The App &amp; Free Tier</h2>
          </div>
          <p>
            Flowzy is a Pomodoro focus timer and task manager. A free tier is available to all
            users with the following limitations:
          </p>
          <ul>
            <li><strong>Task limit:</strong> Up to 7 tasks may be created per day.</li>
            <li><strong>Session duration:</strong> Fixed focus duration (25 minutes) and break duration (5 minutes).</li>
            <li><strong>Analytics:</strong> Weekly focus history only (last 7 days).</li>
          </ul>
          <p>
            These limits exist to sustain development of the app. They may change in future
            versions with reasonable notice.
          </p>
        </div>

        {/* 3 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">3</div>
            <h2>Premium Subscription</h2>
          </div>

          <h3>What&apos;s included</h3>
          <p>
            The <strong>Flowzy Premium</strong> subscription unlocks: custom session and break
            durations, full monthly analytics history, and unlimited daily tasks.
          </p>

          <h3>Billing</h3>
          <ul>
            <li>Subscription is billed monthly through the <strong>Apple App Store</strong>.</li>
            <li>Payment is charged to your Apple ID at confirmation of purchase.</li>
            <li>The subscription automatically renews unless cancelled at least 24 hours before the renewal date.</li>
            <li>Your Apple ID account will be charged for renewal within 24 hours prior to the end of the current period.</li>
          </ul>

          <h3>Cancellation</h3>
          <ul>
            <li>Cancel anytime via <strong>Settings → Apple ID → Subscriptions → Flowzy</strong>.</li>
            <li>Cancelling stops future renewals. You retain access to premium features until the end of the current billing period.</li>
            <li>No partial refunds are provided for unused days within a billing period.</li>
          </ul>

          <h3>Refunds</h3>
          <p>
            All refund requests are handled directly by Apple at{" "}
            <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer">
              reportaproblem.apple.com
            </a>
            . We are unable to process refunds directly.
          </p>

          <h3>Restore purchases</h3>
          <p>
            If you reinstall the app or switch devices, tap <strong>Restore Purchases</strong> on
            the plan screen, or sign in with Apple to restore automatically. Purchases are linked to
            your Apple ID — not your device.
          </p>

          <div className="box">
            <strong>Apple&apos;s billing terms govern.</strong> By subscribing you also agree to{" "}
            <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">
              Apple&apos;s Standard End User License Agreement
            </a>.
          </div>
        </div>

        {/* 4 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">4</div>
            <h2>Acceptable Use</h2>
          </div>
          <p>You may use Flowzy for personal productivity purposes. You agree not to:</p>
          <ul>
            <li>Reverse-engineer, decompile, or disassemble the app</li>
            <li>Attempt to circumvent free-tier limitations through technical means</li>
            <li>Use the app in any way that violates applicable laws or regulations</li>
            <li>Resell, sublicense, or redistribute the app or its content</li>
            <li>Interfere with the proper functioning of the app or its associated services</li>
          </ul>
        </div>

        {/* 5 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">5</div>
            <h2>Intellectual Property</h2>
          </div>
          <p>
            Flowzy, its name, logo, design, code, and all associated content are owned by
            Buildr Studio / Aditya Kumar and protected by applicable intellectual property laws.
            These Terms do not grant you any ownership rights.
          </p>
          <p>
            All data you create within the app (tasks, session notes, etc.) belongs to you. We
            claim no intellectual property rights over your content.
          </p>
        </div>

        {/* 6 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">6</div>
            <h2>Disclaimer of Warranties</h2>
          </div>
          <p>
            Flowzy is provided <strong>"as is"</strong> and <strong>"as available"</strong> without
            warranties of any kind, express or implied, including but not limited to warranties of
            merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p>
            We do not warrant that the app will be uninterrupted, error-free, or free of viruses
            or other harmful components. We do not warrant that any defects will be corrected.
          </p>
          <div className="box">
            <strong>Data loss:</strong> Because all data is stored locally on your device, we are
            not responsible for data loss resulting from device failure, operating system updates,
            app deletion, or any other cause. We strongly recommend enabling iCloud or device
            backups.
          </div>
        </div>

        {/* 7 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">7</div>
            <h2>Limitation of Liability</h2>
          </div>
          <p>
            To the maximum extent permitted by applicable law, Buildr Studio and Aditya Kumar shall
            not be liable for any indirect, incidental, special, consequential, or punitive damages,
            including but not limited to loss of data, loss of productivity, or loss of revenue,
            arising out of or in connection with your use of Flowzy.
          </p>
          <p>
            Our total liability to you for any claims arising under these Terms shall not exceed the
            amount you paid for a Premium subscription in the 12 months preceding the claim.
          </p>
        </div>

        {/* 8 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">8</div>
            <h2>Third-Party Services</h2>
          </div>
          <p>
            Flowzy integrates third-party services including Firebase (Google LLC), RevenueCat Inc.,
            and Apple Inc. Your use of these services is governed by their respective terms and
            privacy policies. We are not responsible for the practices of these third parties.
          </p>
          <ul>
            <li><a href="https://firebase.google.com/terms" target="_blank" rel="noopener noreferrer">Firebase Terms of Service</a></li>
            <li><a href="https://www.revenuecat.com/terms" target="_blank" rel="noopener noreferrer">RevenueCat Terms of Service</a></li>
            <li><a href="https://www.apple.com/legal/internet-services/itunes/" target="_blank" rel="noopener noreferrer">Apple Media Services Terms</a></li>
          </ul>
        </div>

        {/* 9 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">9</div>
            <h2>Changes to the App &amp; Terms</h2>
          </div>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the app at any time
            without notice. We may update these Terms from time to time — material changes will be
            communicated through the app or release notes.
          </p>
          <p>
            We may adjust free-tier limits or premium pricing with at least 30 days&apos; notice to
            existing subscribers. Continued use of the app after such changes constitutes your
            acceptance.
          </p>
        </div>

        {/* 10 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">10</div>
            <h2>Governing Law</h2>
          </div>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of{" "}
            <strong>India</strong>, without regard to its conflict of law provisions. Any disputes
            arising under these Terms shall be subject to the exclusive jurisdiction of the courts
            located in India.
          </p>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions
            will continue in full force and effect.
          </p>
        </div>

        {/* 11 */}
        <div className="pp-section">
          <div className="pp-section-head">
            <div className="pp-num">11</div>
            <h2>Contact</h2>
          </div>
          <p>Questions or concerns about these Terms — reach out anytime:</p>
          <div className="contact-card">
            <div className="contact-row"><span className="contact-lbl">Developer</span><span>Buildr Studio · Aditya Kumar</span></div>
            <div className="contact-row"><span className="contact-lbl">Email</span><a href="mailto:adityakmr9672@gmail.com">adityakmr9672@gmail.com</a></div>
            <div className="contact-row"><span className="contact-lbl">App</span><span>Flowzy – Focus Timer (com.focus25.app)</span></div>
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
          <Link href="/flowzy/privacy" className="footer-link">Privacy Policy</Link>
          <span className="footer-sep">·</span>
          <Link href="/flowzy/support" className="footer-link">Support</Link>
          <span className="footer-sep">·</span>
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>Terms</span>
        </div>
      </footer>
    </>
  );
}
