import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "../components/AppHeader";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <>
      <AppHeader />
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "100px 24px",
          textAlign: "center",
          fontFamily: "var(--font)",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎉</div>
        <h1
          className="ink-title"
          style={{ fontSize: "28px", letterSpacing: "-0.8px", marginBottom: "12px" }}
        >
          You&apos;re in!
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "28px" }}>
          Your checkout completed successfully. Thanks for subscribing — you&apos;re all set.
        </p>
        <Link href="/" className="btn-fill">
          Back to home
        </Link>
      </div>
    </>
  );
}
