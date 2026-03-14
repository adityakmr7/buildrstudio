import ThemeToggle from "../../components/ThemeToggle";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support – Flowzy",
  description:
    "Get help with Flowzy – Focus Timer. Browse common questions or reach out to us directly.",
};

const FAQS = [
  {
    q: "The timer keeps stopping when I lock my screen.",
    a: "Flowzy uses background audio to keep the timer running when the screen locks. Make sure Background App Refresh is enabled for Flowzy in Settings → General → Background App Refresh. Also ensure Silent Mode is off, or turn up the volume — iOS requires active audio to allow background processing.",
  },
  {
    q: "My streak is gone — what happened?",
    a: "Streaks are calculated based on completed focus sessions. If you didn't complete at least one focus session on a given day, the streak resets. Streak data is stored locally — uninstalling the app will permanently erase it.",
  },
  {
    q: "How do I link a task to my focus session?",
    a: "On the Focus tab, tap the task pill just above the timer (it shows 'Link a task' when nothing is selected). A task picker will appear — select the task you're working on. The timer will then log focus time against that task.",
  },
  {
    q: "Can I set a custom focus duration?",
    a: "Custom session and break durations are a Premium feature. Free users get the standard 25-minute focus and 5-minute break. Upgrade to Premium in Settings → Premium, or tap the lock icon next to the duration pickers.",
  },
  {
    q: "I purchased Premium but features are still locked.",
    a: "Try tapping Restore Purchases on the Plan screen (Settings → Premium → Restore Purchases). If that doesn't work, make sure you're using the same Apple ID that was used to purchase. Still stuck? Email us and we'll sort it out.",
  },
  {
    q: "How do I cancel my Premium subscription?",
    a: "Go to Settings → [Your Name] → Subscriptions → Flowzy → Cancel Subscription. Your premium access continues until the end of the current billing period. We do not process cancellations directly — Apple manages all subscription billing.",
  },
  {
    q: "My tasks aren't showing up on the widget.",
    a: "The home screen widget syncs when you open the app. Try force-quitting and reopening Flowzy, then long-press your home screen and check if the widget is still added. If the widget is missing, add it again from the widget gallery.",
  },
  {
    q: "Can I use Flowzy on multiple devices?",
    a: "All data is stored locally on your device — there's no cloud sync between devices yet. Your Premium subscription works on any device signed in with the same Apple ID. Cross-device sync is on our roadmap.",
  },
  {
    q: "How do recurring tasks work?",
    a: "When you create a task, set Repeat to Daily, Weekdays, or Weekly. Each morning, Flowzy checks for due recurring tasks and automatically creates today's copy for you. You can find this setting in the task editor under Repeat.",
  },
  {
    q: "How do I delete all my data?",
    a: "Flowzy doesn't require an account. To delete all your data, simply uninstall the app. This permanently removes all tasks, sessions, streaks, and preferences from your device.",
  },
  {
    q: "Is Flowzy available on Android?",
    a: "Flowzy is currently iOS-only. Android support is planned for a future release.",
  },
  {
    q: "What ambient sounds are available?",
    a: "Flowzy includes Rain, Café, Ocean, Forest, and Focus (white noise) ambient sounds, which play during your focus sessions. Café, Ocean, Forest, and Focus are Premium features. Rain is available on the free tier.",
  },
];

export default function FlowzySupport() {
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
          transition: all .15s; text-decoration: none;
          display: flex; align-items: center; gap: 6px;
        }
        .nav-link:hover { background: var(--fill-subtle); color: var(--text-1); }
        .nav-link.back::before { content: '←'; font-size: 15px; }

        /* ─── LAYOUT ─── */
        .sp-wrap { max-width: 780px; margin: 0 auto; padding: 48px 40px 80px; }

        /* ─── HERO ─── */
        .sp-hero {
          background: var(--fill); color: var(--fill-text);
          border-radius: var(--r-2xl); padding: 44px 40px;
          margin-bottom: 28px; position: relative; overflow: hidden;
        }
        .sp-hero::after {
          content: '⏱'; position: absolute; right: 28px; top: 16px;
          font-size: 88px; opacity: .07; line-height: 1; pointer-events: none;
        }
        .sp-hero-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; opacity: .5; margin-bottom: 14px; display: inline-block;
        }
        .sp-hero h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 8px; line-height: 1.15; }
        .sp-hero-sub { font-size: 15px; opacity: .65; max-width: 460px; line-height: 1.6; margin-bottom: 24px; }
        .sp-hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--fill-text); color: var(--fill);
          border: none; border-radius: var(--r-md); padding: 12px 20px;
          font-size: 14px; font-weight: 700; font-family: var(--font);
          letter-spacing: -0.2px; cursor: pointer; text-decoration: none;
          transition: opacity .15s;
        }
        .sp-hero-cta:hover { opacity: .85; }

        /* ─── CARD ─── */
        .sp-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--r-xl); padding: 28px 32px; margin-bottom: 16px;
        }
        .sp-card-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border);
        }
        .sp-card-icon {
          width: 34px; height: 34px; border-radius: var(--r-sm);
          background: var(--fill-subtle);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .sp-card h2 { font-size: 16px; font-weight: 700; color: var(--text-1); }

        /* ─── CONTACT ITEMS ─── */
        .contact-grid { display: flex; flex-direction: column; gap: 10px; }
        .contact-item {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 16px 18px;
        }
        .contact-item-icon { font-size: 22px; line-height: 1.2; flex-shrink: 0; }
        .contact-item-body { flex: 1; }
        .contact-item-title { font-size: 14px; font-weight: 700; color: var(--text-1); margin-bottom: 3px; }
        .contact-item-desc { font-size: 13px; color: var(--text-3); margin-bottom: 8px; line-height: 1.5; }
        .contact-item-action {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--text-1);
          text-decoration: underline; text-underline-offset: 2px;
        }

        /* ─── FAQ ─── */
        .faq-list { display: flex; flex-direction: column; gap: 1px; }
        .faq-item {
          border: 1px solid var(--border); border-radius: var(--r-md);
          overflow: hidden; margin-bottom: 8px; background: var(--surface);
        }
        .faq-q {
          width: 100%; text-align: left; background: none; border: none;
          padding: 16px 20px; font-size: 14px; font-weight: 600; color: var(--text-1);
          font-family: var(--font); cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; line-height: 1.4;
        }
        .faq-q:hover { background: var(--fill-subtle); }
        .faq-q::after { content: '+'; font-size: 18px; font-weight: 300; color: var(--text-3); flex-shrink: 0; }
        details[open] .faq-q::after { content: '−'; }
        .faq-a {
          padding: 14px 20px 16px; font-size: 14px; color: var(--text-2);
          line-height: 1.7; border-top: 1px solid var(--border);
        }
        .faq-a a { color: var(--text-1); font-weight: 600; text-underline-offset: 2px; text-decoration: underline; }

        /* ─── LINK CARDS ─── */
        .pp-link-card {
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-xl); padding: 22px 28px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; text-decoration: none; transition: background .15s; margin-bottom: 16px;
        }
        .pp-link-card:hover { background: var(--fill-subtle); }
        .pp-link-left { display: flex; align-items: center; gap: 14px; }
        .pp-link-icon { font-size: 24px; }
        .pp-link-title { font-size: 15px; font-weight: 700; color: var(--text-1); margin-bottom: 2px; }
        .pp-link-sub { font-size: 13px; color: var(--text-3); }
        .pp-link-arrow { font-size: 20px; color: var(--text-3); }

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
          .sp-wrap { padding: 32px 20px 60px; }
          .sp-hero { padding: 32px 24px; }
          .sp-hero h1 { font-size: 24px; }
          .sp-card { padding: 22px 20px; }
          .pp-link-card { padding: 18px 20px; }
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

      <div className="sp-wrap">

        {/* ─── HERO ─── */}
        <div className="sp-hero">
          <div className="sp-hero-eyebrow">Flowzy – Focus Timer</div>
          <h1>Support</h1>
          <p className="sp-hero-sub">
            Browse common questions below, or reach out directly — we&apos;re happy to help.
          </p>
          <a href="mailto:adityakmr9672@gmail.com?subject=Flowzy%20Support" className="sp-hero-cta">
            ✉️ &nbsp;Email us
          </a>
        </div>

        {/* ─── CONTACT OPTIONS ─── */}
        <div className="sp-card">
          <div className="sp-card-head">
            <div className="sp-card-icon">📬</div>
            <h2>Get in touch</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-item">
              <span className="contact-item-icon">✉️</span>
              <div className="contact-item-body">
                <div className="contact-item-title">Email support</div>
                <div className="contact-item-desc">
                  Send us a message and we&apos;ll get back to you within 48 hours.
                </div>
                <a href="mailto:adityakmr9672@gmail.com?subject=Flowzy%20Support" className="contact-item-action">
                  adityakmr9672@gmail.com →
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-item-icon">🐛</span>
              <div className="contact-item-body">
                <div className="contact-item-title">Report a bug</div>
                <div className="contact-item-desc">
                  Found something broken? Tell us your device model, iOS version, and the steps to reproduce it.
                </div>
                <a href="mailto:adityakmr9672@gmail.com?subject=Flowzy%20Bug%20Report" className="contact-item-action">
                  Send bug report →
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-item-icon">💡</span>
              <div className="contact-item-body">
                <div className="contact-item-title">Feature requests</div>
                <div className="contact-item-desc">
                  Have an idea that would make Flowzy better? We read every suggestion and many end up in the app.
                </div>
                <a href="mailto:adityakmr9672@gmail.com?subject=Flowzy%20Feature%20Request" className="contact-item-action">
                  Share your idea →
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-item-icon">💳</span>
              <div className="contact-item-body">
                <div className="contact-item-title">Subscription &amp; billing</div>
                <div className="contact-item-desc">
                  Billing questions, failed restores, or issues with Premium. Include your Apple ID (not password) for faster help.
                </div>
                <a href="mailto:adityakmr9672@gmail.com?subject=Flowzy%20Subscription%20Help" className="contact-item-action">
                  Contact billing support →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FAQ ─── */}
        <div className="sp-card">
          <div className="sp-card-head">
            <div className="sp-card-icon">❓</div>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q">{item.q}</summary>
                <div className="faq-a">{item.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* ─── PRIVACY POLICY LINK ─── */}
        <Link href="/flowzy/privacy" className="pp-link-card">
          <div className="pp-link-left">
            <span className="pp-link-icon">🔒</span>
            <div>
              <div className="pp-link-title">Privacy Policy</div>
              <div className="pp-link-sub">Learn how Flowzy handles your data — and how little we actually collect.</div>
            </div>
          </div>
          <span className="pp-link-arrow">›</span>
        </Link>

        {/* ─── TERMS LINK ─── */}
        <Link href="/flowzy/terms" className="pp-link-card">
          <div className="pp-link-left">
            <span className="pp-link-icon">📋</span>
            <div>
              <div className="pp-link-title">Terms &amp; Conditions</div>
              <div className="pp-link-sub">Subscription terms, acceptable use, and your rights as a Flowzy user.</div>
            </div>
          </div>
          <span className="pp-link-arrow">›</span>
        </Link>

      </div>{/* /sp-wrap */}

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
          <Link href="/flowzy/terms" className="footer-link">Terms</Link>
          <span className="footer-sep">·</span>
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>Support</span>
        </div>
      </footer>
    </>
  );
}
