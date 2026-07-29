// Comprime in-place las imágenes de public/images (JPEG/PNG grandes del scrape)
// a ~1600px máx y calidad web. Reduce ~79 MB a una fracción para Lighthouse.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "public", "images");
const MAX = 1600;
const exts = new Set([".jpg", ".jpeg", ".png"]);

let before = 0, after = 0, n = 0;

async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(full); continue; }
    const ext = path.extname(entry.name).toLowerCase();
    if (!exts.has(ext)) continue;
    const stat = fs.statSync(full);
    if (stat.size < 120 * 1024) continue; // ya liviana
    try {
      const input = fs.readFileSync(full); // buffer → evita lock del path en Windows
      const img = sharp(input, { failOn: "none" });
      const meta = await img.metadata();
      let pipe = img.rotate();
      if ((meta.width || 0) > MAX) pipe = pipe.resize({ width: MAX });
      const isPng = ext === ".png" && meta.hasAlpha;
      const out = isPng
        ? await pipe.png({ compressionLevel: 9, quality: 82 }).toBuffer()
        : await pipe.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
      if (out.length < stat.size) {
        fs.writeFileSync(full, out);
        before += stat.size; after += out.length; n++;
      }
    } catch (e) { console.log("skip", entry.name, e.message); }
  }
}
await walk(ROOT);
console.log(`comprimidas ${n} imágenes: ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`);
