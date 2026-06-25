import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BuildrStudio — Free App Store Screenshot & Social Media Mockup Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f0a1e 0%, #1a1145 40%, #2d1b69 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow circles */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            top: "-150px",
            left: "-100px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)",
            bottom: "-100px",
            right: "-50px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
            top: "200px",
            right: "300px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px 70px",
            flex: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              B
            </div>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
              BuildrStudio
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              color: "#fff",
              maxWidth: "700px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>App Store Mockups</span>
            <span style={{ color: "#a78bfa" }}>in Seconds.</span>
          </div>

          {/* Subtext */}
          <div
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "550px",
              lineHeight: 1.5,
            }}
          >
            Paste your App Store URL and get polished screenshots with AI-generated marketing copy. Free.
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              buildrstudio.in
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>
              Free &nbsp;·&nbsp; No signup required &nbsp;·&nbsp; AI-powered
            </span>
          </div>
        </div>

        {/* Right side — mockup cards */}
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: "16px",
          }}
        >
          {[
            { bg: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)", text: "Your App" },
            { bg: "linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)", text: "Features" },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                width: "140px",
                height: "220px",
                borderRadius: "16px",
                background: card.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "16px",
                transform: i === 0 ? "translateY(-20px)" : "translateY(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", textAlign: "center" }}>
                {card.text}
              </span>
              <div
                style={{
                  width: "60px",
                  height: "100px",
                  borderRadius: "10px",
                  background: "rgba(0,0,0,0.3)",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
