"use client";

import { useState, useRef, useEffect } from "react";

const FILE_SYSTEM: Record<string, string> = {
  "help": `Available commands:
  ls          — list files in current directory
  cat <file>  — read a file
  skills      — view skill tree
  projects    — view shipped projects
  contact     — get contact info
  whoami      — who is this person?
  sudo hire   — 😏
  clear       — clear terminal`,

  "whoami": `Aditya Kumar  Class: Full-Stack Engineer · LVL 28
  Location: Bengaluru, India
  Status: 🟢 Open to Work

  Senior Software Engineer with 5+ years
  building fintech & SaaS products at scale.
  Currently at Groww.`,

  "ls": `📄 about.txt    📄 skills.json    📄 projects.md
📄 contact.txt  📄 resume.pdf     📁 secret/`,

  "cat about.txt": `I'm a Full-Stack Engineer who loves building
products that people actually use.

Started coding in 2020. Since then:
→ Shipped 10+ products to production
→ Published 3 apps on the App Store
→ Built open-source libraries used by thousands
→ Reduced UI latency by 40% at a fintech serving millions

I believe in shipping fast, iterating faster,
and writing code that doesn't need comments.`,

  "cat skills.json": `{
  "frontend": ["React/Next.js ★★★★★", "React Native ★★★★★", "TypeScript ★★★★☆"],
  "backend":  ["Node.js ★★★★☆", "GraphQL ★★★★☆", "REST APIs ★★★★★"],
  "ai":       ["LLM APIs ★★★★☆", "RAG Pipelines ★★★★☆", "Prompt Eng ★★★★☆"],
  "infra":    ["AWS ★★★★☆", "Docker ★★★★☆", "CI/CD ★★★★☆"]
}`,

  "skills": `⚔️ SKILL TREE
━━━━━━━━━━━━━━━━━━━━━━━
Frontend    ████████████████████ 95
React Native ███████████████████░ 92
TypeScript  ██████████████████░░ 90
Node.js     █████████████████░░░ 88
AI/LLM      █████████████████░░░ 85
GraphQL     ████████████████░░░░ 82`,

  "cat projects.md": `# Quest Log — Shipped Projects

## 🛠 BuildrStudio AI Platform [ACTIVE]
   AI-powered screenshot generator for indie devs
   Stack: Next.js, Gemini API, PostgreSQL
   XP: +2,500

## 💬 AI Customer Support Chatbot [COMPLETE]
   24/7 AI support agent with human escalation
   Stack: Next.js 16, Gemini, Vercel AI SDK
   XP: +1,600

## 🤖 AI Resume Assistant [COMPLETE]
   RAG pipeline for resume-job matching
   Stack: React, Node.js, LLM APIs
   XP: +1,800

## ⚓ Anchor — Tiny Habits [COMPLETE]
   iOS habit tracker with streaks
   Stack: Swift, SwiftUI, CoreData
   XP: +1,500

## 📦 React Native Toastify [MAINTAINED]
   Open-source notification library
   Stack: React Native, TypeScript
   XP: +1,200`,

  "projects": `# Quest Log — Shipped Projects

## 🛠 BuildrStudio AI Platform [ACTIVE]
   AI-powered screenshot generator for indie devs
   Stack: Next.js, Gemini API, PostgreSQL
   XP: +2,500

## 💬 AI Customer Support Chatbot [COMPLETE]
   24/7 AI support agent with human escalation
   Stack: Next.js 16, Gemini, Vercel AI SDK
   XP: +1,600

## 🤖 AI Resume Assistant [COMPLETE]
   RAG pipeline for resume-job matching
   Stack: React, Node.js, LLM APIs
   XP: +1,800

## ⚓ Anchor — Tiny Habits [COMPLETE]
   iOS habit tracker with streaks
   Stack: Swift, SwiftUI, CoreData
   XP: +1,500

## 📦 React Native Toastify [MAINTAINED]
   Open-source notification library
   Stack: React Native, TypeScript
   XP: +1,200`,

  "cat contact.txt": `📧 Email: adityakmr9672@gmail.com
🐙 GitHub: github.com/adityakmr7
𝕏 Twitter: x.com/adityakmr7
💼 LinkedIn: linkedin.com/in/adityakmr7

💡 Currently open to:
  → Senior Full-Stack roles (remote or Bengaluru)
  → React Native / AI Engineering
  → Freelance consulting`,

  "contact": `📧 Email: adityakmr9672@gmail.com
🐙 GitHub: github.com/adityakmr7
𝕏 Twitter: x.com/adityakmr7
💼 LinkedIn: linkedin.com/in/adityakmr7

💡 Currently open to:
  → Senior Full-Stack roles (remote or Bengaluru)
  → React Native / AI Engineering
  → Freelance consulting`,

  "cat resume.pdf": `Error: Nice try! 😄
Send me an email and I'll share the real one.
→ adityakmr9672@gmail.com`,

  "ls secret/": `🔒 Permission denied.
Just kidding — there's nothing here.
...or is there? 👀`,

  "cd secret": `🔒 Permission denied.
Just kidding — there's nothing here.
...or is there? 👀`,

  "sudo hire": `
  ╔══════════════════════════════════╗
  ║   🎉 CONGRATULATIONS! 🎉        ║
  ║                                  ║
  ║   You've made the right choice.  ║
  ║                                  ║
  ║   Email: adityakmr9672@gmail.com ║
  ║   Let's build something epic.    ║
  ╚══════════════════════════════════╝`,

  "clear": "__CLEAR__",
};

const WELCOME = `Welcome to Aditya's Terminal v1.0
Type 'help' to see available commands.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

export default function TerminalQuest() {
  const [history, setHistory] = useState<{ input?: string; output: string }[]>([{ output: WELCOME }]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === "clear") {
      setHistory([{ output: WELCOME }]);
      setInput("");
      return;
    }

    const output = FILE_SYSTEM[trimmed] || `Command not found: ${trimmed}\nType 'help' for available commands.`;

    setHistory(prev => [...prev, { input: cmd, output }]);
    setInput("");
  };

  return (
    <div
      style={{
        background: "#0d1117",
        borderRadius: "16px",
        border: "1.5px solid #30363d",
        overflow: "hidden",
        fontFamily: "ui-monospace, 'SF Mono', Monaco, 'Cascadia Mono', monospace",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "10px 16px", background: "#161b22",
        borderBottom: "1px solid #30363d",
      }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: "8px", fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>
          aditya@portfolio ~ zsh
        </span>
      </div>

      {/* Terminal body */}
      <div style={{
        padding: "16px",
        height: "320px",
        overflowY: "auto",
        fontSize: "13px",
        lineHeight: 1.6,
        color: "#e6edf3",
      }}>
        {history.map((entry, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            {entry.input && (
              <div>
                <span style={{ color: "#7ee787" }}>aditya</span>
                <span style={{ color: "#8b949e" }}>@</span>
                <span style={{ color: "#79c0ff" }}>portfolio</span>
                <span style={{ color: "#8b949e" }}> ~ $ </span>
                <span style={{ color: "#e6edf3" }}>{entry.input}</span>
              </div>
            )}
            <pre style={{
              margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word",
              color: "#8b949e", fontSize: "12px",
            }}>
              {entry.output}
            </pre>
          </div>
        ))}

        {/* Input line */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#7ee787" }}>aditya</span>
          <span style={{ color: "#8b949e" }}>@</span>
          <span style={{ color: "#79c0ff" }}>portfolio</span>
          <span style={{ color: "#8b949e" }}> ~ $ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCommand(input);
            }}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#e6edf3", fontSize: "13px", fontFamily: "inherit",
              caretColor: "#7ee787",
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
