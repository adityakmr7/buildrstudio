"use client";

import { useState } from "react";

const roadmapItems = [
  {
    key: "app-launch-image-generator",
    title: "App launch image generator",
    description: "Create polished launch visuals for Product Hunt, X, LinkedIn, and founder updates.",
    status: "Planned",
  },
  {
    key: "changelog-to-social-card-generator",
    title: "Changelog-to-social-card generator",
    description: "Turn release notes and product updates into clean social cards.",
    status: "Planned",
  },
  {
    key: "github-readme-visual-generator",
    title: "GitHub README visual generator",
    description: "Generate project banners, feature cards, and repo visuals for open-source pages.",
    status: "Planned",
  },
  {
    key: "product-update-carousel-generator",
    title: "Product update carousel generator",
    description: "Build multi-slide visual updates for LinkedIn, X, and launch communities.",
    status: "Planned",
  },
  {
    key: "app-store-screenshot-builder",
    title: "App store screenshot builder",
    description: "Compose App Store and Play Store-ready screenshots with device frames and captions.",
    status: "Planned",
  },
  {
    key: "tweet-thread-to-carousel-converter",
    title: "Tweet/thread-to-carousel converter",
    description: "Convert long posts and threads into shareable carousel assets.",
    status: "Planned",
  },
];

export default function RoadmapRequestForm() {
  const [email, setEmail] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(roadmapItems[0].key);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "roadmap_request",
          featureKey: selectedFeature,
          message,
          pathname: window.location.pathname,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save your request right now.");
      }

      setStatus("success");
      setStatusMessage("Request saved. I will use this to decide what gets built next.");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to save your request right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="roadmap-shell">
      <div className="roadmap-grid">
        {roadmapItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`roadmap-card ${selectedFeature === item.key ? "active" : ""}`}
            onClick={() => setSelectedFeature(item.key)}
          >
            <div className="roadmap-card-top">
              <span className="badge-pill">{item.status}</span>
              <span className="roadmap-select-dot" />
            </div>
            <h2 className="roadmap-card-title">{item.title}</h2>
            <p className="roadmap-card-desc">{item.description}</p>
          </button>
        ))}
      </div>

      <form className="roadmap-form comp-block" onSubmit={handleSubmit}>
        <div>
          <div className="comp-label">Request Access</div>
          <h2 className="ink-title" style={{ marginBottom: "6px" }}>Vote for the next tool</h2>
          <p className="ink-body" style={{ fontSize: "14px", color: "var(--text-2)" }}>
            Pick the tool you want most and leave your email for early access.
          </p>
        </div>

        <label>
          <span className="input-label">Email</span>
          <input
            type="email"
            required
            className="input-field"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoading}
          />
        </label>

        <label>
          <span className="input-label">Selected tool</span>
          <select
            className="input-field"
            value={selectedFeature}
            onChange={(event) => setSelectedFeature(event.target.value)}
            disabled={isLoading}
          >
            {roadmapItems.map((item) => (
              <option key={item.key} value={item.key}>
                {item.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="input-label">What would make this useful?</span>
          <textarea
            className="input-field"
            placeholder="Optional: tell me your use case"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isLoading}
            style={{ resize: "vertical" }}
          />
        </label>

        {statusMessage && (
          <div className={`roadmap-status ${status}`}>
            {statusMessage}
          </div>
        )}

        <button type="submit" className="btn-fill" disabled={isLoading}>
          {isLoading ? "Saving..." : "Request This Tool"}
        </button>
        <span className="roadmap-consent">Get BuildrStudio launch updates. No spam.</span>
      </form>
    </div>
  );
}

export { roadmapItems };
