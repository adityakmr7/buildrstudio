// Builds public/downloads/buildrstudio-wordpress.zip from
// integrations/wordpress/buildrstudio/ (folder "buildrstudio/" at the zip root,
// which is what WordPress's "Upload Plugin" expects).
//
// The zip is committed, so the site serves it as a static file without a build
// step. Re-run `npm run zip:wordpress` after editing the plugin and commit the
// result. `--check` exits non-zero if the committed zip is stale (use in CI).
// Output is deterministic (sorted entries, fixed timestamps), so an unchanged
// plugin gives a byte-identical zip.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import JSZip from "jszip";

const root = new URL("..", import.meta.url).pathname;
const src = join(root, "integrations/wordpress/buildrstudio");
const outDir = join(root, "public/downloads");
const out = join(outDir, "buildrstudio-wordpress.zip");
const FIXED_DATE = new Date("2026-01-01T00:00:00Z");

function walk(dir) {
  return readdirSync(dir)
    .sort()
    .flatMap((name) => {
      const p = join(dir, name);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
}

const zip = new JSZip();
// Explicit directory entry; otherwise JSZip adds one stamped with "now".
zip.file("buildrstudio/", null, { dir: true, date: FIXED_DATE, unixPermissions: 0o755 });
for (const file of walk(src)) {
  const rel = relative(src, file).split(sep).join("/");
  zip.file(`buildrstudio/${rel}`, readFileSync(file), { date: FIXED_DATE, unixPermissions: 0o644 });
}
const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 }, platform: "UNIX" });

if (process.argv.includes("--check")) {
  const same = existsSync(out) && Buffer.compare(readFileSync(out), buf) === 0;
  console.log(same ? "WordPress plugin zip is up to date." : "WordPress plugin zip is stale: run `npm run zip:wordpress`.");
  process.exit(same ? 0 : 1);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(out, buf);
console.log(`Wrote ${relative(root, out)} (${buf.length} bytes)`);
