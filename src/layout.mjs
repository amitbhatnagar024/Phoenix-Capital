// Shared layout, components and icons for the Phoenix Capital site.
import { site, compliance, products, photos } from "./config.mjs";
import { existsSync } from "node:fs";
import { dirname as _dn, join as _join } from "node:path";
import { fileURLToPath as _f2p } from "node:url";
const STATIC = _join(_dn(_f2p(import.meta.url)), "static");

export const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Relative link from the page being built (`from`, e.g. "lending/bridging-finance/") to `to` (e.g. "contact/").
export const relTo = (from) => (to = "") => {
  const depth = from.split("/").filter(Boolean).length;
  const prefix = "../".repeat(depth);
  const out = prefix + to;
  return out === "" ? "./" : out;
};

/* ------------------------------------------------------------------ images */
const IMG = {
  "hero-city-day": [[1200, 2400], 2400, 1600],
  "canary-wharf": [[1200, 2400], 2400, 1600, "hero-city-day"],
  "office-day": [[1000, 2000], 2000, 1400],
  "development-golden-hour": [[1200, 2400], 2400, 1500],
  "stone-light": [[1200, 2400], 2400, 1200],
  "townhouse-refurbishment": [[800, 1600], 1600, 2000],
  "townhouse-terrace": [[800, 1600], 1600, 2000],
  "period-door": [[800, 1600], 1600, 2000],
  "commercial-glass": [[1000, 2000], 2000, 1400],
  ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((n) => [`team-${n}`, [[450, 900], 900, 1100]])),
};
const STOCK_WIDTHS = [640, 960, 1280, 1920, 2560];
const unsplash = (id, w, extra = "") => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=72&w=${w}${extra}`;
// Photo source: self-hosted stock file > Unsplash CDN > generated placeholder.
const source = (r, name) => {
  const [widths, , , alias] = IMG[name];
  const local = (wd) => r(`assets/img/photo/${alias || name}-${wd}.jpg`);
  const fallback = local(widths[0]);
  const p = photos[name];
  if (p) {
    const self = STOCK_WIDTHS.filter((wd) => existsSync(_join(STATIC, `assets/img/photo/stock/${name}-${wd}.jpg`)));
    if (self.length) return { src: r(`assets/img/photo/stock/${name}-${self[Math.min(2, self.length - 1)]}.jpg`), srcset: self.map((wd) => `${r(`assets/img/photo/stock/${name}-${wd}.jpg`)} ${wd}w`).join(", "), fallback: null, alt: p.alt };
    return { src: unsplash(p.id, 1280), srcset: STOCK_WIDTHS.map((wd) => `${unsplash(p.id, wd)} ${wd}w`).join(", "), fallback, alt: p.alt };
  }
  return { src: fallback, srcset: widths.map((wd) => `${local(wd)} ${wd}w`).join(", "), fallback: null, alt: "" };
};
export const img = (r, name, { alt, sizes = "100vw", eager = false, cls = "", attrs = "" } = {}) => {
  const [, w, h] = IMG[name];
  const s = source(r, name);
  const a = alt === undefined ? s.alt : alt;
  const onerr = s.fallback ? ` onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${s.fallback}'"` : "";
  return `<img src="${s.src}" srcset="${s.srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(a)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ""}${onerr} ${attrs}>`;
};
// Absolute URL for social sharing images.
export const imgAbs = (name) => {
  const p = photos[name];
  if (p) {
    if (existsSync(_join(STATIC, `assets/img/photo/stock/${name}-1280.jpg`))) return `${site.domain}/assets/img/photo/stock/${name}-1280.jpg`;
    return unsplash(p.id, 1200, "&h=630");
  }
  const [widths, , , alias] = IMG[name];
  return `${site.domain}/assets/img/photo/${alias || name}-${widths[widths.length - 1]}.jpg`;
};
export const imgPath = (name) => `assets/img/photo/${name}-${IMG[name][0][IMG[name][0].length - 1]}.jpg`;

/* ------------------------------------------------------------------- icons */
const svg = (vb, body, cls = "", extra = "") => `<svg class="${cls}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ${extra}>${body}</svg>`;
export const ICONS = {
  bridging: `<path d="M3 30h42"/><path d="M8 30c5-11 27-11 32 0"/><path d="M16 23.6V30M24 21.8V30M32 23.6V30"/><path d="M8 30v10M40 30v10"/><path d="M3 40h42" opacity=".5"/>`,
  refurbishment: `<path d="M10 40V21L24 10l14 11v19"/><path d="M5 12v30M43 12v30M5 27h38M5 42h38"/><rect x="19" y="30" width="10" height="12"/><path d="M5 18l7-6M43 18l-7-6" opacity=".5"/>`,
  development: `<path d="M14 42V7"/><path d="M5 8h38"/><path d="M14 3l-9 5M14 3l29 5"/><path d="M35 8v11"/><rect x="31" y="19" width="8" height="5"/><path d="M22 42V29h18v13M22 35.5h18M31 29v13"/><path d="M3 42h42"/><path d="M14 14l3-3M14 20l3-3M14 26l3-3M14 32l3-3" opacity=".6"/>`,
  auction: `<path d="M9.5 19.5l10-10 6.5 6.5-10 10z"/><path d="M7 17l10-10M18.5 28.5l10-10"/><path d="M22.8 22.2l15.7 15.7"/><path d="M7 42h22M10 38h16"/>`,
  commercial: `<rect x="13" y="6" width="22" height="36"/><path d="M13 14h22M13 22h22M13 30h22M20.3 6v36M27.6 6v28"/><path d="M3 42h42"/><path d="M24 34v8" />`,
  business: `<rect x="5" y="15" width="38" height="25"/><path d="M18 15v-4.5h12V15"/><path d="M5 25h38"/><path d="M21 22.5h6v5h-6z"/>`,
  direct: `<path d="M4 24h38"/><path d="M34 16l8 8-8 8"/><circle cx="8" cy="24" r="3"/>`,
  judgement: `<path d="M24 6v36M14 42h20"/><path d="M8 12h32"/><path d="M8 12l-5 13h10z"/><path d="M40 12l-5 13h10z"/><circle cx="24" cy="8" r="2"/>`,
  speed: `<circle cx="24" cy="26" r="16"/><path d="M24 26V16M24 26l7 5"/><path d="M20 4h8M24 4v6"/>`,
  certainty: `<path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"/><path d="M17 24l5 5 9-10"/>`,
  people: `<circle cx="18" cy="16" r="6"/><path d="M6 40c0-7 5-12 12-12s12 5 12 12"/><circle cx="34" cy="18" r="5"/><path d="M32 28c6 0 10 4 10 10"/>`,
  document: `<path d="M10 4h20l10 10v30H10z"/><path d="M30 4v10h10"/><path d="M16 24h18M16 30h18M16 36h12"/>`,
  phone: `<path d="M10 6h8l4 10-5 3c2 5 6 9 11 11l3-5 10 4v8c0 2-2 4-4 4C20 41 7 28 6 10c0-2 2-4 4-4z"/>`,
};
export const icon = (name, cls = "") => svg("0 0 48 48", ICONS[name], cls);
export const arrow = `<svg class="arrow" viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true" focusable="false"><path d="M0 5h17M13 1l4 4-4 4"/></svg>`;
export const infoIcon = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8.5"/><path d="M10 9v5M10 6v.5"/></svg>`;

/* --------------------------------------------- phoenix mark and watermark */
const MARK_PATHS = `<path d="M24 54c0-13-6-20-2-33 2-6 4-10 2-17"/><path d="M23 52C10 46 4 32 8 13"/><path d="M23 49c-8-6-11-15-9-27"/><path d="M25 52c13-6 19-20 15-39"/><path d="M25 49c8-6 11-15 9-27"/><path d="M15 54h18"/>`;
export const mark = (cls = "") => svg("0 0 48 58", MARK_PATHS, cls);

const feather = () => {
  const paths = [];
  const bx = 300, by = 590;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 11; i++) {
      const t = i / 10;
      const a = ((10 + t * 66) * Math.PI) / 180;
      const L = 540 - t * 250;
      const tx = bx + side * Math.sin(a) * L, ty = by - Math.cos(a) * L;
      const c1x = bx + side * L * 0.06, c1y = by - L * 0.42;
      const c2x = bx + side * Math.sin(a) * L * 1.08, c2y = by - Math.cos(a) * L * 1.22;
      paths.push(`<path d="M${bx + side * 2} ${by}C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}" opacity="${(1 - t * 0.55).toFixed(2)}"/>`);
    }
  }
  paths.push(`<path d="M300 590c-14-120 30-190 4-300-12-50 10-100-4-170"/>`);
  paths.push(`<path d="M300 590c10-90-24-150-2-230" opacity=".6"/>`);
  return paths.join("");
};
const FEATHER = feather();
export const watermark = (cls = "phoenix-watermark") => `<svg class="${cls}" viewBox="0 0 600 600" fill="none" stroke="currentColor" stroke-width=".8" aria-hidden="true" focusable="false">${FEATHER}</svg>`;

/* -------------------------------------------------------------- brand/logo */
export const brand = (r, { cls = "" } = {}) =>
  `<a class="brand ${cls}" href="${r("")}" aria-label="Phoenix Capital, home"><img class="brand__logo" src="${r(site.logo.src)}" width="${site.logo.width}" height="${site.logo.height}" alt="Phoenix Capital"></a>`;
export const markImg = (r, cls = "brand-mark") => `<img class="${cls}" src="${r("assets/img/brand/phoenix-mark.svg")}" width="64" height="64" alt="" aria-hidden="true">`;

/* -------------------------------------------------------------------- nav */
export const NAV = [
  { label: "Lending", href: "lending/", key: "lending" },
  { label: "Brokers", href: "brokers/", key: "brokers" },
  { label: "About", href: "about/", key: "about" },
  { label: "Insights", href: "insights/", key: "insights" },
  { label: "Contact", href: "contact/", key: "contact" },
];

const header = (r, active) => `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" id="top">
  <div class="container">
    ${brand(r)}
    <nav class="nav" aria-label="Main">
      <ul class="nav__list">
        ${NAV.map((n) => `<li class="nav__item"><a class="nav__link" href="${r(n.href)}"${active === n.key ? ' aria-current="true"' : ""}>${n.label}</a>${
          n.key === "lending"
            ? `<ul class="nav__sub">${products.map((p) => `<li><a href="${r(`lending/${p.slug}/`)}">${p.name}${arrow}</a></li>`).join("")}</ul>`
            : ""
        }</li>`).join("")}
      </ul>
    </nav>
    <a class="btn btn--sm header-cta" href="${r("contact/")}">Submit an Enquiry</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  ${watermark("mobile-menu__watermark")}
  <nav aria-label="Mobile">
    <ul class="mobile-menu__list">
      ${NAV.map((n, i) => `<li><a href="${r(n.href)}"${active === n.key ? ' aria-current="true"' : ""}>${n.label}<small>0${i + 1}</small></a></li>`).join("")}
    </ul>
  </nav>
  <div class="mobile-menu__foot">
    <a class="btn" href="${r("contact/")}">Submit an Enquiry</a>
    <p class="mobile-menu__contact">${esc(site.phone)}<br><a href="mailto:${site.email}">${site.email}</a></p>
  </div>
</div>`;

/* ------------------------------------------------------------------ footer */
const footer = (r) => `
<footer class="site-footer">
  ${watermark()}
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        ${brand(r)}
        <p>Short-term, business-purpose property finance from a direct, decision-making lender.</p>
        <div class="mt-m"><a class="btn btn--sm" href="${r("contact/")}">Submit an Enquiry</a></div>
      </div>
      <div class="footer-col">
        <h2>Lending</h2>
        <ul>${products.map((p) => `<li><a class="u-link" href="${r(`lending/${p.slug}/`)}">${p.name}</a></li>`).join("")}</ul>
      </div>
      <div class="footer-col">
        <h2>Company</h2>
        <ul>
          <li><a class="u-link" href="${r("about/")}">About</a></li>
          <li><a class="u-link" href="${r("brokers/")}">Brokers</a></li>
          <li><a class="u-link" href="${r("insights/")}">Insights</a></li>
          <li><a class="u-link" href="${r("contact/")}">Contact</a></li>
          <li><a class="u-link" href="${r("complaints/")}">Complaints</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2>Contact</h2>
        <address>
          ${esc(site.phone)}<br>
          <a class="u-link" href="mailto:${site.email}">${site.email}</a><br><br>
          ${site.registeredOffice.street}<br>${site.registeredOffice.locality}, ${site.registeredOffice.region}<br>${site.registeredOffice.postcode}
        </address>
      </div>
    </div>
    <div class="footer-compliance">
      <div class="stack">
        <p class="key">${esc(compliance.businessPurpose)}</p>
        <p>${esc(compliance.risk)}</p>
      </div>
      <div class="stack">
        <p>${esc(compliance.legalLine)}</p>
        <p>${esc(site.amlLine)}</p>
        <p>${esc(site.icoLine)}</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="mb-0">© <span data-year>${new Date().getFullYear()}</span> ${site.legalEntity}. All rights reserved.</p>
      <ul>
        <li><a href="${r("privacy-policy/")}">Privacy Policy</a></li>
        <li><a href="${r("cookie-policy/")}">Cookie Policy</a></li>
        <li><a href="${r("terms-of-use/")}">Terms of Use</a></li>
        <li><a href="${r("complaints/")}">Complaints</a></li>
        <li><a href="${r("important-information/")}">Important Information</a></li>
        <li><button type="button" data-consent-action="manage">Cookie settings</button></li>
      </ul>
    </div>
  </div>
</footer>`;

/* -------------------------------------------------------- cookie consent */
const cookieUI = (r) => `
<section class="cookie-banner" id="cookie-banner" role="region" aria-label="Cookie consent" hidden>
  <h2>Your privacy</h2>
  <p>We use strictly necessary cookies to run this website. With your permission we would also like to use optional analytics cookies to understand how the site is used. You can accept, reject or choose. See our <a href="${r("cookie-policy/")}">Cookie Policy</a>.</p>
  <div class="btn-row">
    <button class="btn" type="button" data-consent-action="accept">Accept all</button>
    <button class="btn" type="button" data-consent-action="reject">Reject optional</button>
    <button class="btn btn--quiet" type="button" data-consent-action="manage">Manage preferences</button>
  </div>
</section>
<div class="modal" id="cookie-prefs" hidden>
  <div class="modal__backdrop" data-consent-action="close"></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="prefs-title" tabindex="-1">
    <button class="modal__close" type="button" data-consent-action="close" aria-label="Close preferences"></button>
    <p class="eyebrow">Cookie preferences</p>
    <h2 id="prefs-title">Manage your preferences</h2>
    <p class="small muted mb-m">Choose which optional cookies you allow. You can change your mind at any time using the Cookie settings link in the footer.</p>
    <div class="pref"><h3>Strictly necessary</h3><p>Required for the site to work, including remembering your cookie choices. Always on.</p><label class="switch"><input type="checkbox" checked disabled aria-label="Strictly necessary cookies, always on"><span></span></label></div>
    <div class="pref"><h3>Analytics</h3><p>Help us understand how visitors use the site so that we can improve it.</p><label class="switch"><input type="checkbox" id="pref-analytics" aria-label="Analytics cookies"><span></span></label></div>
    <div class="pref"><h3>Marketing</h3><p>Used to measure the effectiveness of our advertising. Not currently in use.</p><label class="switch"><input type="checkbox" id="pref-marketing" aria-label="Marketing cookies"><span></span></label></div>
    <div class="btn-row">
      <button class="btn" type="button" data-consent-action="save">Save preferences</button>
      <button class="btn btn--quiet" type="button" data-consent-action="accept">Accept all</button>
      <button class="btn btn--quiet" type="button" data-consent-action="reject">Reject optional</button>
    </div>
  </div>
</div>`;

/* --------------------------------------------------------------- schema */
export const orgSchema = () => {
  const o = site.registeredOffice;
  const address = { "@type": "PostalAddress", streetAddress: o.street, addressLocality: o.locality, addressRegion: o.region, postalCode: o.postcode, addressCountry: o.country };
  const org = {
    "@type": "Organization",
    "@id": `${site.domain}/#organization`,
    name: site.name,
    legalName: site.legalEntity,
    url: `${site.domain}/`,
    logo: `${site.domain}/assets/img/brand/phoenix-capital-logo.png`,
    email: site.email,
    address,
    identifier: { "@type": "PropertyValue", propertyID: "Companies House number", value: site.companyNumber },
  };
  if (!site.phone.includes("[")) org.telephone = site.phone;
  const fs = {
    "@type": "FinancialService",
    "@id": `${site.domain}/#financialservice`,
    name: site.name,
    url: `${site.domain}/`,
    image: `${site.domain}/assets/img/og-default.jpg`,
    description: "Short-term, business-purpose property finance: bridging, refurbishment, development, auction and commercial bridging loans, and secured business loans.",
    parentOrganization: { "@id": `${site.domain}/#organization` },
    address,
    areaServed: { "@type": "Country", name: "United Kingdom" },
    email: site.email,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Lending products",
      itemListElement: products.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "LoanOrCredit", name: p.name, url: `${site.domain}/lending/${p.slug}/` } })),
    },
  };
  if (!site.phone.includes("[")) fs.telephone = site.phone;
  return [org, fs];
};

/* ------------------------------------------------------------------ shell */
// Preview mode: build with `PREVIEW=1 node build.mjs` for a non-live copy (e.g. GitHub Pages).
// Adds a "Preview" bar, keeps search engines out and stops the forms from submitting.
export const PREVIEW = process.env.PREVIEW === "1";
const previewBar = `<div class="preview-bar" role="note"><strong>Preview</strong><span>This website is not yet live. Forms are switched off and enquiries cannot be sent.</span></div>`;
export const page = ({ path, title, description, active = "", body, schema = [], ogImage, noindex = false, ogType = "website" }) => {
  // 404.html is served at arbitrary URLs, so it uses root-absolute links.
  const r = path.endsWith(".html") ? (to = "") => "/" + to : relTo(path);
  const url = `${site.domain}/${path}`;
  const og = ogImage && /^https?:/.test(ogImage) ? ogImage : `${site.domain}/${ogImage || "assets/img/og-default.jpg"}`;
  const ld = { "@context": "https://schema.org", "@graph": [...orgSchema(), ...schema] };
  return `<!doctype html>
<html lang="en-GB"${PREVIEW ? ' data-preview="1"' : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${PREVIEW ? '<meta name="robots" content="noindex, nofollow">' : noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Phoenix Capital">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og}">
<meta name="theme-color" content="#FAF8F5">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="${r("favicon.svg")}" type="image/svg+xml">
<link rel="icon" href="${r("favicon-32.png")}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${r("apple-touch-icon.png")}">
<link rel="manifest" href="${r("site.webmanifest")}">
<link rel="preload" href="${r("assets/fonts/cormorant-garamond-latin-300-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r("assets/fonts/inter-latin-wght-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r("assets/css/main.css")}">
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body${PREVIEW ? ' class="is-preview"' : ""}>
${PREVIEW ? previewBar : ""}
${header(r, active)}
<main id="main">
${body(r)}
</main>
${footer(r)}
${cookieUI(r)}
<script src="${r("assets/js/main.js")}" defer></script>
</body>
</html>
`;
};

/* --------------------------------------------------------- shared blocks */
export const pageHero = (r, { crumbs = [], eyebrow, title, lead, image, meta = "", short = false, children = "" }) => `
<section class="page-hero theme-paper${short ? " page-hero--short" : ""}${image ? " page-hero--image" : ""}">
  <div class="ember-glow" aria-hidden="true"></div>
  ${watermark()}
  <div class="container">
    <div class="page-hero__grid">
      <div class="page-hero__text">
        ${crumbs.length ? `<nav aria-label="Breadcrumb"><ol class="breadcrumb" data-reveal>${[["Home", ""], ...crumbs].map(([l, h], i, a) => i === a.length - 1 ? `<li aria-current="page">${esc(l)}</li>` : `<li><a href="${r(h)}">${esc(l)}</a></li>`).join("")}</ol></nav>` : ""}
        ${eyebrow ? `<p class="eyebrow" data-reveal>${esc(eyebrow)}</p>` : ""}
        <h1 data-reveal style="--d:.08s">${title}</h1>
        ${lead ? `<p class="lead" data-reveal style="--d:.16s">${lead}</p>` : ""}
        ${meta}
        ${children}
      </div>
      ${image ? `<div class="page-hero__media" data-reveal style="--d:.2s"><figure class="frame">${img(r, image, { eager: true, sizes: "(min-width: 900px) 460px, 100vw" })}</figure></div>` : ""}
    </div>
  </div>
</section>`;

export const breadcrumbSchema = (crumbs) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", ""], ...crumbs].map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.domain}/${href}` })),
});

export const termsStrip = (items, theme = "theme-white") => `
<section class="${theme} terms-band" aria-label="Key terms">
  <div class="container">
    <ul class="terms">
      ${items.map((t, i) => `<li data-reveal style="--d:${i * 0.08}s"><span class="terms__label">${esc(t.label)}</span><span class="terms__value">${t.value}</span></li>`).join("")}
    </ul>
  </div>
</section>`;

export const riskNote = (text = compliance.risk) => `<p class="risk-note">${infoIcon}<span>${esc(text)}</span></p>`;

export const ctaBand = (r, { eyebrow = "Next steps", title = "Tell us about your next transaction.", lead = "Share the essentials and a member of our lending team will respond with a clear view." } = {}) => `
<section class="cta-band section theme-white">
  <div class="ember-glow" aria-hidden="true"></div>
  ${watermark()}
  <div class="container container--narrow">
    ${markImg(r)}
    <p class="eyebrow" data-reveal>${esc(eyebrow)}</p>
    <h2 data-reveal style="--d:.08s">${title}</h2>
    <p class="lead mt-m" data-reveal style="--d:.16s">${lead}</p>
    <div class="btn-row mt-l" data-reveal style="--d:.24s"><a class="btn" href="${r("contact/")}">Submit an Enquiry</a></div>
  </div>
</section>`;
