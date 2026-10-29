import Image from "next/image";
import Script from "next/script";
import { clearStackMetadata, clearStackJsonLd } from "./metadata";
import "./clear-stack.css";

const title = "ClearStack — A clearer view of your Mac’s storage";
const description = "Find developer caches, review project dependencies, and clean on your terms. Native macOS app. $5 once for Pro, with downloads handled by Gumroad.";
const checkout = "https://adityakmr7.gumroad.com/l/clearstack";
export const metadata = clearStackMetadata("", title, description);

const steps = [
  { number: "01", title: "Scan", text: "See the space used by package caches, build outputs, dependencies, and local AI models.", detail: "Scanning does not delete files." },
  { number: "02", title: "Review", text: "Inspect paths in Finder, select what you no longer need, and protect projects you want to keep.", detail: "Your selections stay in your control." },
  { number: "03", title: "Clean", text: "Move selected folders to Trash, or explicitly confirm permanent deletion. Reinstall dependencies when you need them again.", detail: "Empty Trash separately to free space." },
];
const features = [
  { label: "Package & build caches", title: "Clear the files your tools can rebuild.", text: "Find npm, Bun, Yarn, Homebrew, Gradle, Cargo, and Xcode caches in one place. Close tools using these files before cleaning.", tag: "Included without activation" },
  { label: "Project dependencies", title: "Keep the project. Lose the weight.", text: "Review node_modules, Next.js caches, and recognized Rust build folders. Copy a reinstall command for when you return.", tag: "Pro" },
  { label: "Local AI models", title: "Make room for what you use next.", text: "Review Ollama models, Hugging Face weights, and Claude VM bundles. Remove assets only when you no longer need them.", tag: "Pro" },
  { label: "Project protection", title: "Give active work some space.", text: "Exclude projects and their subfolders from discovery. Reveal a target in Finder before deciding what to remove.", tag: "Included without activation" },
];
const tiers = [
  ["Scan caches, dependencies & models", "Included", "Included"],
  ["Clean package & build caches", "Included", "Included"],
  ["Protect projects & reveal paths", "Included", "Included"],
  ["Menu bar storage display", "Included", "Included"],
  ["Clean project dependencies", "—", "Included"],
  ["Clean local AI model folders", "—", "Included"],
];
const faqs = [
  { question: "Where do I download ClearStack?", answer: <>Purchases and downloads are handled by <a href={checkout}>Gumroad</a>. Already purchased? Get the latest release from your Gumroad receipt or Library.</> },
  { question: "What works without a Pro license?", answer: <>The app supports scanning, package and build cache cleanup, project protection, and the menu bar display without activation. A $5 one-time license unlocks project dependency and AI model cleanup. All downloads are provided through Gumroad.</> },
  { question: "Does ClearStack need an internet connection?", answer: <>Scans and cleanup run on your Mac, without uploading scan results or collecting analytics. Update checks contact BuildrStudio. Pro activation and verification at each launch contact Gumroad, so enabling Pro after launch requires internet access.</> },
  { question: "Can I undo a cleanup?", answer: <>Move to Trash is the default. Files remain in Trash until you empty it, and disk space is not freed until then. Permanent deletion requires confirmation and cannot be undone. Review paths and close tools using those files before cleaning.</> },
  { question: "What happens to my projects?", answer: <>Project discovery looks for recognized dependency and build folders, including node_modules, .next/cache, and Rust target directories. Protect projects you want excluded. Dependencies may need to be downloaded or rebuilt afterward. Docker disk deletion and simulator resets are disabled.</> },
  { question: "Which Macs are supported?", answer: <>ClearStack 1.0.1 supports macOS 14 or later on Apple Silicon and Intel. The distributed app is Developer ID signed and notarized by Apple.</> },
];

export default function ClearStackPage() {
  return <>
    <Script id="clearstack-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: clearStackJsonLd("", title, description) }} />
    <section className="cs-hero">
      <p className="cs-eyebrow">A little less clutter. A lot more room.</p>
      <h1>Shed the bloat.<br /><em>Keep the code.</em></h1>
      <p className="cs-hero-lead">Find the caches, forgotten dependencies, and local models taking up space on your Mac. Review what goes. Keep what matters.</p>
      <div className="cs-cta-group">
        <a className="cs-primary-button" href={checkout} target="_blank" rel="noopener noreferrer">Get ClearStack — $5 once <span aria-hidden="true">↗</span></a>
        <a className="cs-secondary-button" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
      </div>
      <p className="cs-checkout-note">One-time Pro license · Checkout and downloads through Gumroad</p>
      <ul className="cs-trust" aria-label="Compatibility and release verification">
        <li>macOS 14+</li><li>Apple Silicon & Intel</li><li>Signed & notarized</li>
      </ul>
    </section>

    <figure className="cs-product-preview">
      <a href="/clear-stack/current-release.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size ClearStack 1.0.1 dashboard screenshot">
        <Image src="/clear-stack/current-release.png" alt="ClearStack 1.0.1 dashboard showing available storage, scanned cache sizes, review controls, and project navigation" width={2880} height={1572} priority sizes="(max-width: 1200px) 100vw, 1144px" />
      </a>
      <figcaption><span>ClearStack 1.0.1 · Actual app capture</span><span>Illustrative scan results. Your storage will differ.</span></figcaption>
    </figure>

    <div className="cs-principles">
      <p><strong>Scans stay on your Mac.</strong><span>No uploaded scan results or analytics.</span></p>
      <p><strong>Review before removing.</strong><span>Inspect paths and protect active projects.</span></p>
      <p><strong>Native, through and through.</strong><span>Built with Swift and SwiftUI for macOS.</span></p>
    </div>

    <section id="how-it-works" className="cs-section">
      <div className="cs-section-header"><span className="cs-eyebrow">Three steps. Your decision.</span><h2>More room, on your terms.</h2><p>From finding the files to choosing what goes, you stay in control.</p></div>
      <ol className="cs-steps">{steps.map(step => <li key={step.number}><span className="cs-step-number" aria-hidden="true">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p><small>{step.detail}</small></li>)}</ol>
    </section>

    <section id="features" className="cs-section">
      <div className="cs-section-header"><span className="cs-eyebrow">Built around your tools</span><h2>The space between projects adds up.</h2><p>Look beyond everyday downloads to the files your developer stack leaves behind.</p></div>
      <div className="cs-feature-grid">{features.map(feature => <article className="cs-feature" key={feature.label}><div className="cs-feature-top"><span>{feature.label}</span><span className={`cs-tag${feature.tag === "Pro" ? " cs-tag-pro" : ""}`}>{feature.tag}</span></div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
    </section>

    <section id="pricing" className="cs-section">
      <div className="cs-section-header"><span className="cs-eyebrow">A small tool. A one-time purchase.</span><h2>Know exactly what Pro unlocks.</h2><p>Core scanning and cache cleanup work without activation. Pro adds deeper cleanup for projects and local AI models.</p></div>
      <div className="cs-plan-layout">
        <div className="cs-table-container"><table className="cs-table"><caption className="cs-visually-hidden">Features available without activation and with ClearStack Pro</caption><thead><tr><th scope="col">What you can do</th><th scope="col">Free</th><th scope="col">Pro</th></tr></thead><tbody>{tiers.map(([label, free, pro]) => <tr key={label}><th scope="row">{label}</th><td>{free === "—" ? <span aria-label="Not included">—</span> : free}</td><td className="cs-pro-cell">{pro}</td></tr>)}</tbody></table></div>
        <aside className="cs-pricing-box"><span className="cs-eyebrow">ClearStack Pro</span><h3>$5<span>once</span></h3><p>A lifetime Pro license.<br />No recurring subscription.</p><ul><li>Project dependency cleanup</li><li>Local AI model cleanup</li><li>Updates for version 1.x</li></ul><a className="cs-primary-button" href={checkout} target="_blank" rel="noopener noreferrer">Get Pro on Gumroad <span aria-hidden="true">↗</span></a><small>30-day money-back guarantee<br />Internet verification required for Pro at launch.</small></aside>
      </div>
      <p className="cs-purchase-help">Already own ClearStack? Download updates from your Gumroad receipt or Library.</p>
    </section>

    <section className="cs-section cs-faq" aria-labelledby="cs-faq-title"><div className="cs-section-header"><span className="cs-eyebrow">A few things to know</span><h2 id="cs-faq-title">Before you clean.</h2></div>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}<p className="cs-support">Need a hand? <a href="mailto:contact@buildrstudio.in">Contact support</a>.</p></section>
  </>;
}
