/**
 * Build optimized rasters into .tmp-image-opt/, then (when --apply) copy over public/.
 * Usage:
 *   node scripts/optimize-all-images.mjs
 *   node scripts/optimize-all-images.mjs --apply
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public");
const OUT = path.join(process.cwd(), ".tmp-image-opt");
const APPLY = process.argv.includes("--apply");

function maxEdgeFor(relPosix) {
  if (relPosix.includes("/Carousel/xs/")) return 320;
  if (relPosix.includes("/Carousel/sm/")) return 480;
  if (relPosix.includes("/Carousel/")) return 480;
  if (relPosix.includes("/gallery/")) return 1200;
  if (relPosix.includes("/photo-booth/")) return 1400;
  if (relPosix.includes("/Flyer/")) return 1400;
  if (/loft442-banner-enhanced2\.webp$/.test(relPosix)) return 1920;
  if (/loft442-banner-enhanced2-mobile\.webp$/.test(relPosix)) return 900;
  if (/banner-opt\.webp$/.test(relPosix)) return 1920;
  return 1200;
}

function qualityFor(relPosix) {
  if (relPosix.includes("/Flyer/")) return 82;
  if (relPosix.includes("/Carousel/")) return 72;
  if (/banner|hero/i.test(relPosix)) return 78;
  return 76;
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(webp|png|jpe?g)$/i.test(entry.name)) acc.push(full);
  }
  return acc;
}

function rimraf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

if (!APPLY) {
  rimraf(OUT);
  fs.mkdirSync(OUT, { recursive: true });
}

let saved = 0;
let touched = 0;
let skipped = 0;
const planned = [];

const files = walk(ROOT);

for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const before = fs.statSync(file).size;

  if (rel === "images/Loft442-Banner-Enhanced2.png") {
    planned.push({ type: "delete", rel, before });
    continue;
  }

  if (before < 8 * 1024) {
    skipped += 1;
    continue;
  }

  const maxEdge = maxEdgeFor(`/${rel}`);
  const quality = qualityFor(`/${rel}`);

  try {
    // Read via buffer so we don't keep a long-lived handle on a locked path.
    const input = fs.readFileSync(file);
    const meta = await sharp(input, { failOn: "none" }).metadata();
    if (!meta.width || !meta.height) {
      skipped += 1;
      continue;
    }

    const longest = Math.max(meta.width, meta.height);
    let pipeline = sharp(input, { failOn: "none" }).rotate();

    if (longest > maxEdge) {
      pipeline = pipeline.resize({
        width: maxEdge,
        height: maxEdge,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const buffer = await pipeline.webp({ quality, effort: 6 }).toBuffer();
    const outRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");

    if (
      buffer.length >= before * 0.98 &&
      longest <= maxEdge &&
      file.toLowerCase().endsWith(".webp")
    ) {
      skipped += 1;
      continue;
    }

    if (!APPLY) {
      const dest = path.join(OUT, outRel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, buffer);
    }

    planned.push({ type: "replace", rel, outRel, before, after: buffer.length });
    saved += Math.max(0, before - buffer.length);
    touched += 1;
    console.log(
      "ok",
      rel,
      `${meta.width}x${meta.height}`,
      longest > maxEdge ? `→≤${maxEdge}` : "",
      `${(before / 1024).toFixed(0)}→${(buffer.length / 1024).toFixed(0)} KB`
    );
  } catch (err) {
    console.warn("fail", rel, err.message);
    skipped += 1;
  }
}

if (APPLY) {
  for (const item of planned) {
    if (item.type === "delete") {
      const target = path.join(ROOT, item.rel);
      try {
        fs.unlinkSync(target);
        console.log("deleted", item.rel);
      } catch (err) {
        console.warn("delete failed", item.rel, err.message);
      }
      continue;
    }
    const src = path.join(OUT, item.outRel);
    const dest = path.join(ROOT, item.outRel);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    if (item.rel !== item.outRel) {
      try {
        fs.unlinkSync(path.join(ROOT, item.rel));
      } catch {
        /* ignore */
      }
    }
  }
  rimraf(OUT);
  console.log("\nApplied optimized files into public/");
}

fs.writeFileSync(
  path.join(process.cwd(), "scripts", ".image-opt-manifest.json"),
  JSON.stringify({ touched, skipped, saved, planned }, null, 2)
);

console.log(
  `\nDone. touched=${touched} skipped=${skipped} saved≈${(saved / 1024).toFixed(0)} KB${APPLY ? " (applied)" : " (staged in .tmp-image-opt)"}`
);
