import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <>
      <style>{`
        /* ─── HEADER ─── */
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
        }
        .site-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--fill);
          display: flex;
          align-items: center;
          justify-content: center;
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
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          padding: 8px 14px;
          border-radius: var(--r-sm);
          transition: all .15s;
          cursor: pointer;
        }
        .nav-link:hover {
          background: var(--fill-subtle);
          color: var(--text-1);
        }

        /* ─── APP CARD ─── */
        .app-card {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .app-card-inner {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-2xl);
          overflow: hidden;
          transition: background .3s, border .3s;
        }
        .app-card-top {
          padding: 48px 48px 40px;
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .app-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: var(--fill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: var(--fill-text);
          flex-shrink: 0;
        }
        .app-info {
          flex: 1;
        }
        .app-name {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -1px;
          margin-bottom: 6px;
          line-height: 1.1;
        }
        .app-tagline {
          font-size: 16px;
          color: var(--text-2);
          line-height: 1.5;
          margin-bottom: 16px;
          max-width: 520px;
        }
        .app-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .app-desc {
          font-size: 15px;
          color: var(--text-2);
          line-height: 1.7;
          max-width: 560px;
          margin-bottom: 28px;
        }

        /* ─── DOWNLOAD BUTTONS ─── */
        .download-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .store-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--fill);
          color: var(--fill-text);
          border: none;
          border-radius: var(--r-md);
          padding: 14px 24px;
          cursor: pointer;
          font-family: var(--font);
          transition: opacity .15s;
          text-decoration: none;
        }
        .store-btn:hover { opacity: .85; }
        .store-btn-icon {
          font-size: 24px;
          line-height: 1;
        }
        .store-btn-text {
          display: flex;
          flex-direction: column;
        }
        .store-btn-label {
          font-size: 10px;
          font-weight: 500;
          opacity: .7;
          letter-spacing: 0.3px;
        }
        .store-btn-name {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .store-btn.outline {
          background: transparent;
          border: 1.5px solid var(--border-strong);
          color: var(--text-1);
        }
        .store-btn.outline:hover {
          border-color: var(--text-1);
          opacity: 1;
        }

        /* ─── FEATURE STRIP ─── */
        .feature-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--border);
        }
        .feature-cell {
          padding: 24px 28px;
          border-right: 1px solid var(--border);
          transition: background .15s;
        }
        .feature-cell:last-child { border-right: none; }
        .feature-cell:hover { background: var(--fill-subtle); }
        .feature-cell-icon {
          font-size: 20px;
          margin-bottom: 10px;
        }
        .feature-cell-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-1);
          margin-bottom: 3px;
        }
        .feature-cell-desc {
          font-size: 12px;
          color: var(--text-3);
          line-height: 1.4;
        }

        /* ─── PREVIEW AREA ─── */
        .preview-area {
          border-top: 1px solid var(--border);
          padding: 36px 48px;
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          background: var(--surface-2);
          transition: background .3s;
        }
        .phone-frame {
          width: 240px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-2xl);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all .2s;
        }
        .phone-frame:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }
        .phone-status-bar {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: var(--text-3);
          margin-bottom: 2px;
        }
        .phone-screen-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -0.5px;
          margin-bottom: 2px;
        }
        .phone-subtitle {
          font-size: 11px;
          color: var(--text-3);
          margin-bottom: 8px;
        }

        /* ─── SECTION SPACING ─── */
        .spacing-xl { height: 64px; }
        .spacing-lg { height: 48px; }
        .spacing-md { height: 32px; }

        /* ─── SECTION LABEL ─── */
        .section-label {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px 16px;
        }

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
        .footer-left {
          font-size: 13px;
          color: var(--text-3);
        }
        .footer-left strong {
          color: var(--text-1);
        }
        .footer-right {
          font-size: 12px;
          color: var(--text-4);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .site-header { padding: 16px 20px; }
          .app-card { padding: 0 20px; }
          .app-card-top { padding: 28px 24px 24px; flex-direction: column; gap: 20px; }
          .app-name { font-size: 24px; }
          .feature-strip { grid-template-columns: 1fr 1fr; }
          .feature-cell:nth-child(2) { border-right: none; }
          .feature-cell:nth-child(1), .feature-cell:nth-child(2) { border-bottom: 1px solid var(--border); }
          .preview-area { padding: 24px 20px; }
          .phone-frame { width: 100%; max-width: 280px; }
          .download-row { flex-direction: column; }
          .store-btn { justify-content: center; }
          .site-footer { padding: 20px; flex-direction: column; gap: 8px; text-align: center; }
          .section-label { padding: 0 20px 16px; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="site-header">
        <div className="site-logo">
          <div className="site-logo-mark">B</div>
          <span className="site-logo-text">BuildrStudio</span>
        </div>
        <div className="nav-links">
          <a href="#anchor" className="nav-link">Apps</a>
          <ThemeToggle />
        </div>
      </header>

      {/* ─── VERTICAL SPACER ─── */}
      <div className="spacing-xl" />

      {/* ─── SECTION: ANCHOR ─── */}
      <div className="section-label">
        <span className="ink-label">Our Apps</span>
      </div>

      <div className="app-card" id="anchor">
        <div className="app-card-inner">
          {/* Top: Icon + Info + Download */}
          <div className="app-card-top">
            <div className="app-icon">⚓</div>
            <div className="app-info">
              <h2 className="app-name">Anchor</h2>
              <p className="app-tagline">
                Build better habits with intention. A minimal habit tracker that makes consistency effortless.
              </p>
              <div className="app-tags">
                <span className="chip-filled">Habit Tracker</span>
                <span className="chip-subtle">iOS</span>
                <span className="chip-subtle">Android</span>
              </div>
              <p className="app-desc">
                Designed around the two-minute rule and cue-based habit stacking.
                Start small, stay consistent, let compound growth do the rest.
              </p>
              <div className="download-row">
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="store-btn">
                  <span className="store-btn-icon"></span>
                  <span className="store-btn-text">
                    <span className="store-btn-label">Download on the</span>
                    <span className="store-btn-name">App Store</span>
                  </span>
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="store-btn outline">
                  <span className="store-btn-icon">▶</span>
                  <span className="store-btn-text">
                    <span className="store-btn-label">Get it on</span>
                    <span className="store-btn-name">Google Play</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Feature strip */}
          <div className="feature-strip">
            <div className="feature-cell">
              <div className="feature-cell-icon">🎯</div>
              <div className="feature-cell-title">Onboarding</div>
              <div className="feature-cell-desc">Guided setup that builds your first habit in under 2 minutes.</div>
            </div>
            <div className="feature-cell">
              <div className="feature-cell-icon">🧱</div>
              <div className="feature-cell-title">Habit Design</div>
              <div className="feature-cell-desc">Cue → routine → reward loop attached to existing behaviours.</div>
            </div>
            <div className="feature-cell">
              <div className="feature-cell-icon">📊</div>
              <div className="feature-cell-title">Progress</div>
              <div className="feature-cell-desc">Visual habit grid, streaks, and completion rates at a glance.</div>
            </div>
            <div className="feature-cell">
              <div className="feature-cell-icon">🌙</div>
              <div className="feature-cell-title">Daily Flow</div>
              <div className="feature-cell-desc">Morning check-in, habit list, and evening reflection.</div>
            </div>
          </div>

          {/* Phone previews */}
          <div className="preview-area">
            {/* Screen 1: Home */}
            <div className="phone-frame">
              <div className="phone-status-bar">
                <span>9:41</span>
                <span>●●●</span>
              </div>
              <div className="phone-screen-title">Good morning</div>
              <div className="phone-subtitle">3 habits today · 1 done</div>
              <div style={{ marginBottom: 6 }}>
                <div className="pb-label-row">
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)" }}>Today</span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>33%</span>
                </div>
                <div className="pb-track">
                  <div className="pb-fill" style={{ width: "33%" }} />
                </div>
              </div>
              <div className="list-item">
                <div className="li-icon">🏃</div>
                <div className="li-info">
                  <div className="li-title">Morning Walk</div>
                  <div className="li-sub">After tea · 2 min</div>
                </div>
                <div className="li-check checked">✓</div>
              </div>
              <div className="list-item">
                <div className="li-icon">📖</div>
                <div className="li-info">
                  <div className="li-title">Read 1 page</div>
                  <div className="li-sub">After lunch</div>
                </div>
                <div className="li-check" />
              </div>
              <div className="list-item">
                <div className="li-icon">🧘</div>
                <div className="li-info">
                  <div className="li-title">Breathe 2 min</div>
                  <div className="li-sub">Before bed</div>
                </div>
                <div className="li-check" />
              </div>
            </div>

            {/* Screen 2: Dashboard */}
            <div className="phone-frame">
              <div className="phone-status-bar">
                <span>9:41</span>
                <span>●●●</span>
              </div>
              <div className="phone-screen-title">Dashboard</div>
              <div className="phone-subtitle">Your progress this week</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <div className="stat-card inv">
                  <div className="sc-val">🔥 21</div>
                  <div className="sc-lbl">Streak</div>
                </div>
                <div className="stat-card">
                  <div className="sc-val">86%</div>
                  <div className="sc-lbl">Completion</div>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: 6 }}>
                  Habit Grid
                </div>
                <div className="hgrid">
                  <div className="hcell done" /><div className="hcell done" /><div className="hcell mid" />
                  <div className="hcell done" /><div className="hcell miss">✕</div><div className="hcell done" />
                  <div className="hcell mid" /><div className="hcell done" /><div className="hcell mid" />
                  <div className="hcell done" /><div className="hcell miss">✕</div><div className="hcell done" />
                  <div className="hcell done" /><div className="hcell" /><div className="hcell mid" />
                  <div className="hcell done" /><div className="hcell done" /><div className="hcell mid" />
                  <div className="hcell done" /><div className="hcell" /><div className="hcell" />
                </div>
              </div>
            </div>

            {/* Screen 3: Habit Design */}
            <div className="phone-frame">
              <div className="phone-status-bar">
                <span>9:41</span>
                <span>●●●</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: 10 }}>
                Habit Design · Step 2
              </div>
              <div className="phone-screen-title">When?</div>
              <div className="phone-subtitle">Attach this habit to a cue</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="sel-row active">
                  <span style={{ fontSize: 16 }}>🌅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Morning</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>6am – 10am</div>
                  </div>
                  <div className="sel-check">✓</div>
                </div>
                <div className="sel-row">
                  <span style={{ fontSize: 16 }}>☀️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Afternoon</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>12pm – 4pm</div>
                  </div>
                  <div className="sel-check" />
                </div>
                <div className="sel-row">
                  <span style={{ fontSize: 16 }}>🌙</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Evening</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>7pm – 10pm</div>
                  </div>
                  <div className="sel-check" />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="step-dots">
                  <div className="sdot done" />
                  <div className="sdot active" />
                  <div className="sdot" />
                  <div className="sdot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SPACER ─── */}
      <div className="spacing-xl" />

      {/* ─── FOOTER ─── */}
      <footer className="site-footer">
        <div className="footer-left">
          <strong>BuildrStudio</strong> by Aditya Kumar · 2026
        </div>
        <div className="footer-right">
          Powered by Ink Design System
        </div>
      </footer>
    </>
  );
}
