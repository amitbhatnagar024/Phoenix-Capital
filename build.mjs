// Build the static site into ./dist.  Usage: node build.mjs
import { rmSync, mkdirSync, writeFileSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { site } from "./src/config.mjs";
import { page } from "./src/layout.mjs";
import { pages } from "./src/pages.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const write = (rel, content) => { const f = join(DIST, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); };

rmSync(DIST, { recursive: true, force: true });
cpSync(join(ROOT, "src/static"), DIST, { recursive: true });

// Pages
for (const p of pages) {
  const html = page(p);
  write(p.file || join(p.path, "index.html"), html);
}

// Favicon: src/static/favicon.svg (the ribbon "e" and dot from the supplied logo)
try {
  execSync(`rsvg-convert -w 32 -h 32 "${join(DIST, "favicon.svg")}" -o "${join(DIST, "favicon-32.png")}"`);
  execSync(`rsvg-convert -w 180 -h 180 "${join(DIST, "favicon.svg")}" -o "${join(DIST, "apple-touch-icon.png")}"`);
  execSync(`rsvg-convert -w 512 -h 512 "${join(DIST, "favicon.svg")}" -o "${join(DIST, "icon-512.png")}"`);
  execSync(`rsvg-convert -w 1200 "${join(DIST, "assets/img/brand/phoenix-capital-logo.svg")}" -o "${join(DIST, "assets/img/brand/phoenix-capital-logo.png")}"`);
} catch (e) { console.warn("PNG icons skipped (rsvg-convert not available). Commit PNGs manually."); }

write("site.webmanifest", JSON.stringify({
  name: "Phoenix Capital", short_name: "Phoenix Capital", start_url: "/", display: "browser",
  background_color: "#FAF8F5", theme_color: "#FAF8F5",
  icons: [{ src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
}, null, 2));

// SEO files
const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => !p.noindex).map((p) => {
  const pr = p.path === "" ? "1.0" : p.path.split("/").filter(Boolean).length === 1 ? "0.8" : "0.6";
  return `  <url><loc>${site.domain}/${p.path}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`;
});
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);

// Hosting helpers: security headers (Netlify / Cloudflare Pages format)
write("_headers", `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://images.unsplash.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://www.openstreetmap.org; connect-src 'self' https:; form-action 'self' https:; base-uri 'self'

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);

console.log(`Built ${pages.length} pages into dist/`);
if (!existsSync(join(DIST, "assets/img/og-default.jpg"))) console.warn("Note: assets/img/og-default.jpg missing — run tools/render_assets.py");
