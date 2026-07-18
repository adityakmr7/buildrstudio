"use client";

interface PostExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportCount: number;
  projectName: string;
}

export default function PostExportShareModal({
  isOpen,
  onClose,
  exportCount,
  projectName,
}: PostExportShareModalProps) {
  if (!isOpen) return null;

  const appName = projectName && projectName !== "Untitled Project" ? projectName : "my app";
  const tweetText = `Just built App Store screenshots for ${appName} in seconds using @BuildrStudio. Free browser tool, no Figma needed 🚀`;
  const tweetUrl = "https://buildrstudio.in";
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(tweetUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(tweetUrl)}`;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(10,10,10,0.45)", backdropFilter: "blur(8px)",
        animation: "psm-fade 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="card-default"
        style={{
          width: "90%", maxWidth: "400px",
          padding: "32px",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "20px", textAlign: "center",
          animation: "psm-scale 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "var(--fill-subtle)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--fill)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>

        {/* Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-1)" }}>
            {exportCount > 1 ? `${exportCount} screenshots exported!` : "Screenshot exported!"}
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-3)", lineHeight: 1.5 }}>
            Help other indie makers find BuildrStudio. Takes 10 seconds.
          </p>
        </div>

        {/* Share buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fill btn-md"
            style={{
              textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "8px", fontWeight: 700,
              background: "#000", color: "#fff",
              border: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X
          </a>

          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline btn-md"
            style={{
              textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "8px", fontWeight: 600,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            Share on LinkedIn
          </a>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: "var(--text-3)", padding: "4px",
            }}
          >
            No thanks
          </button>
        </div>
      </div>

      <style>{`
        @keyframes psm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes psm-scale { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
