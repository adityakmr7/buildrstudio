import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import "./shelflet.css";

export const metadata: Metadata = {
  title: "Shelflet — A clearer place for your files",
  description: "A native Mac file library for browsing, finding, organizing, and reviewing large collections. Free beta, with local processing and automatic local-storage scanning.",
  robots: { index: false, follow: false },
};
const cards = [
  ["See your collection", "Browse images, videos, audio, documents, and archives in a grid or list. Keep normal folder navigation alongside your visual library."],
  ["Find the right file", "Try “pdf files from last week,” a camera or date, or text from a screenshot. Shelflet recognizes supported local filters and searches filenames, paths, and indexed text."],
  ["Make room thoughtfully", "Compare exact duplicates, review visually similar photos, and review large files or old installers. Nothing is selected automatically in duplicate results."],
  ["Keep your workflow", "Rename, copy, move, reveal, and preview with native Mac tools. Project and cache inspection lives in a separate developer toolbox."],
];
export default function ShelfletPage() {
  return <main className="shelflet-site">
    <nav><Link href="/">BuildrStudio</Link><Link href="/products/shelflet/privacy">App privacy</Link></nav>
    <header><Image src="/shelflet/icon.png" alt="Shelflet bookshelf icon" width={100} height={100} priority /><p className="sl-eyebrow">Shelflet · Free beta</p><h1>A clearer place<br />for your files.</h1><p className="sl-lead">Find the footage, documents, downloads, and projects that matter. See what takes space. Decide what goes.</p><span className="sl-beta-status">Beta in preparation</span><p className="sl-note">Downloads will be provided through a separate free Gumroad listing after release checks. No ClearStack license required.</p><div className="sl-specs"><span>macOS 14+</span><span>Apple Silicon & Intel</span><span>No sign-in or expiry</span></div></header>
    <section className="sl-workflow"><h2>Your Mac. Your decision.</h2><div><article><b>01 · Scan</b><p>Shelflet scans local storage on launch without a folder chooser. macOS controls protected-file access; enable Full Disk Access for broader coverage. External drives can be added separately.</p></article><article><b>02 · Explore</b><p>Browse categories, folders, thumbnails, and previews. Cloud-only files stay cloud-only.</p></article><article><b>03 · Review</b><p>Review exact paths before moving files to Trash. Shelflet cannot permanently delete files or empty Trash.</p></article></div></section>
    <section className="sl-cards">{cards.map(([title,copy]) => <article key={title}><h2>{title}</h2><p>{copy}</p></article>)}</section>
    <section className="sl-details"><h2>Built for files of all sizes.</h2><p>Shelflet keeps an index on your Mac and refreshes affected directories while it is open. Vision OCR reads supported image and screenshot text locally, so you can find a tracking number or Wi-Fi password without uploading it. Use ⇧⌘Space for Quick Search while Shelflet is running. Pause Mac Storage or stop a scan at any time. Removing an added source never removes its files. Protected or unreadable paths are reported as access limits; virtual filesystems, Trash, and duplicate system volume views are excluded.</p><p>Exact duplicate checks read content in bounded chunks. Similar-photo results are visual suggestions, not a claim that images are interchangeable. Age-based cleanup lists describe file age, not whether footage or project assets are still needed. Sizes are estimates; Trash, APFS clones, and snapshots can affect actual free space.</p><h2>A beta with clear boundaries.</h2><p>This beta interprets supported type, date, size, camera, and download-source phrases locally. Other words search filenames, paths, tags, and locally indexed text. Downloaded From uses available website metadata; it does not establish which application created a file. Automatic cleanup and automatic update installation are outside this beta. Copy cancellation waits for the current file. Across-drive moves retain originals in Trash after a verified copy.</p></section>
    <footer><Link href="/products/shelflet/privacy">Shelflet privacy</Link><a href="mailto:contact@buildrstudio.in?subject=Shelflet%20beta">Contact support</a><p>A new product by BuildrStudio. Shelflet and ClearStack are separate apps.</p></footer>
  </main>;
}
