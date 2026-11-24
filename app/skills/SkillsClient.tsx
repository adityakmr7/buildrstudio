"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SKILLS, CATEGORIES, GITHUB_REPO, RAW_INSTALL_URL, type Skill } from "./skills-data";

export default function SkillsClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"curl" | "npx" | "git">("curl");
  const [installCopied, setInstallCopied] = useState<boolean>(false);

  const installCommands = {
    curl: `curl -fsSL ${RAW_INSTALL_URL} | bash`,
    npx: "npx skills add adityakmr7/buildr-ios-skills",
    git: "git clone https://github.com/adityakmr7/buildr-ios-skills.git",
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCommands[activeTab]);
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  const handleCopyPrompt = (skill: Skill) => {
    navigator.clipboard.writeText(skill.prompt);
    setCopiedId(skill.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSkills = SKILLS.filter((skill) => {
    const matchesCategory =
      selectedCategory === "All" || skill.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="skills-page" style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100dvh" }}>
      {/* Navigation Header */}
      <header style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 30, background: "rgba(247, 249, 246, 0.92)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 500, fontSize: 18, color: "var(--text)", textDecoration: "none" }}>
            <Image src="/brand/assets/buildrstudio-mark.svg" alt="" width={32} height={32} />
            <span>buildrstudio</span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14 }}>
            <Link href="/#products" style={{ color: "var(--muted)", textDecoration: "none" }}>Products</Link>
            <Link href="/skills" style={{ color: "var(--text)", fontWeight: 600, textDecoration: "none" }}>Skills (21)</Link>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 100px" }}>
        <div style={{ maxWidth: 820, marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "var(--color-raised-2, #ECF1EB)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text)", marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#38775F", display: "inline-block" }} />
            21 Open-Source Agent Skills
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 68px)", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
            Buildr AI Skills.<br />
            <em style={{ fontStyle: "italic", fontFamily: "Georgia, serif", fontWeight: 400 }}>Thoughtfully crafted for iOS.</em>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "var(--muted)", lineHeight: 1.5, margin: 0, maxWidth: 680 }}>
            A modular suite of 21 AI Agent Skills for Swift 6, modern SwiftUI, StoreKit 2, SwiftData, and Apple HIG. Compatible with Claude Code, Cursor, and Google Antigravity.
          </p>
        </div>

        {/* 1-Line Universal Install Box */}
        <section style={{ background: "var(--surface, #FFFFFF)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 32px", marginBottom: 56, boxShadow: "0 4px 20px rgba(21, 62, 53, 0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Install the Full Suite</h2>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Installs all 21 skills across Claude Code, Cursor, and Antigravity in one go.</p>
            </div>
            {/* Tabs */}
            <div style={{ display: "inline-flex", padding: 4, background: "var(--color-raised-2, #ECF1EB)", borderRadius: 8, gap: 4 }}>
              {(["curl", "npx", "git"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "none",
                    background: activeTab === tab ? "var(--text)" : "transparent",
                    color: activeTab === tab ? "var(--bg)" : "var(--muted)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab === "curl" ? "Terminal (curl)" : tab === "npx" ? "npx skills" : "Git Clone"}
                </button>
              ))}
            </div>
          </div>

          {/* Command Code Bar */}
          <div style={{ display: "flex", alignItems: "center", background: "#0F2822", color: "#ECF1EB", borderRadius: 10, padding: "14px 18px", fontFamily: "var(--font-mono, monospace)", fontSize: 13, overflowX: "auto" }}>
            <span style={{ color: "#38775F", marginRight: 12, userSelect: "none" }}>$</span>
            <span style={{ flex: 1, whiteSpace: "nowrap" }}>{installCommands[activeTab]}</span>
            <button
              onClick={handleCopyInstall}
              style={{
                marginLeft: 16,
                padding: "6px 14px",
                borderRadius: 6,
                background: installCopied ? "#38775F" : "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {installCopied ? "Copied! ✓" : "Copy Command"}
            </button>
          </div>
        </section>

        {/* Filters & Search */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            {/* Category Filter Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: selectedCategory === cat ? "var(--text)" : "var(--border)",
                    background: selectedCategory === cat ? "var(--text)" : "var(--surface, #FFFFFF)",
                    color: selectedCategory === cat ? "var(--bg)" : "var(--text)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ minWidth: 260 }}>
              <input
                type="text"
                placeholder="Search skills, topics, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: "var(--surface, #FFFFFF)",
                  color: "var(--text)",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Showing {filteredSkills.length} of {SKILLS.length} skills
          </div>
        </section>

        {/* Skills Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
          {filteredSkills.map((skill) => {
            const isCopied = copiedId === skill.id;
            return (
              <article
                key={skill.id}
                style={{
                  background: "var(--surface, #FFFFFF)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "24px 24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.18s ease",
                  boxShadow: "0 2px 8px rgba(21, 62, 53, 0.02)",
                }}
              >
                <div>
                  {/* Card Header: Trigger badge + Category */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13, fontWeight: 600, color: "var(--color-cream, #153E35)", background: "var(--color-raised-2, #ECF1EB)", padding: "4px 10px", borderRadius: 6 }}>
                      {skill.id}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {skill.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 19, fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                    {skill.name}
                  </h3>

                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 16px" }}>
                    {skill.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          color: "var(--muted)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions: Copy Prompt + GitHub link */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <button
                    onClick={() => handleCopyPrompt(skill)}
                    style={{
                      flex: 1,
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: isCopied ? "#38775F" : "var(--text)",
                      color: "var(--bg)",
                      fontSize: 13,
                      fontWeight: 500,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{isCopied ? "Prompt Copied! ✓" : "Copy Prompt"}</span>
                  </button>

                  <a
                    href={`${GITHUB_REPO}/tree/main/${skill.githubPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View skill source on GitHub"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "var(--color-raised-2, #ECF1EB)",
                      color: "var(--text)",
                      fontSize: 12,
                      fontWeight: 500,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Source ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div style={{ marginTop: 80, padding: "48px 32px", borderRadius: 20, background: "var(--color-raised-2, #ECF1EB)", border: "1px solid var(--border)", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, margin: "0 0 12px", fontWeight: 600 }}>Contribute or Explore the Code</h2>
          <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 540, margin: "0 auto 24px" }}>
            All 21 skills are open-source under the MIT License on GitHub. Fork, customize, or contribute your own iOS workflows.
          </p>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 8,
              background: "var(--text)",
              color: "var(--bg)",
              fontWeight: 500,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Star on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "36px 32px", fontSize: 13, color: "var(--muted)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/brand/assets/buildrstudio-mark.svg" alt="" width={22} height={22} />
            <span>BuildrStudio © {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
            <Link href="/#products" style={{ color: "var(--muted)", textDecoration: "none" }}>Products</Link>
            <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
