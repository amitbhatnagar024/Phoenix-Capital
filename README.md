# Phoenix Capital: website

Static, multi-page marketing site for **phoenix-capital.uk**. Plain HTML, CSS and a small script with no frameworks, no third-party requests and no tracking. It is ready to host on Netlify, Cloudflare Pages, Vercel, GitHub Pages or any web server.

```
dist/          ← the finished website. Upload this folder's contents to your host.
src/config.mjs ← ALL editable content: placeholders, products, articles, team, contacts
src/pages.mjs  ← page layouts and copy
src/layout.mjs ← header, footer, cookie banner, SEO tags, schema, icons
src/static/    ← CSS, JS, fonts, images (copied into dist/ on build)
build.mjs      ← regenerates dist/ (requires Node 18+): `node build.mjs`
tools/         ← image, OG-card and PDF generators; screenshot script
```

## Preview mode (GitHub Pages copy)
`PREVIEW=1 node build.mjs` builds a preview copy. It shows a "Preview" bar, switches the forms off, and tells search engines not to index it (noindex, plus robots.txt `Disallow: /`). The `main` branch on GitHub currently holds this preview build. **For the real launch, build without PREVIEW** (`node build.mjs`).

## Preview locally
Open `dist/index.html` in a browser, or for exact production behaviour run `npx serve dist` (or `python3 -m http.server -d dist`) and visit http://localhost:3000.

## Before launch: checklist

**1. Logo (done).** Your supplied logo was converted from the PDF to vector SVG without any change to shape or colour: `src/static/assets/img/brand/phoenix-capital-logo.svg` (the original PDF is in `brand-source/`). It is used unaltered in the header, footer, social image and criteria sheet. The favicon and small brand mark (`favicon.svg`, `assets/img/brand/phoenix-mark.svg`) use only the ribbon "e" and red dot from the logo, because the full lock-up is unreadable at 16px. Swap these if your designer has an official icon version.

**Colour palette (taken from the logo):** grey #9BA1A9, red #EB3341, orange #F17823, amber #F6AE13, and black #231F20 for the tagline. The site uses light surfaces (#FFFFFF, #FAF8F5, #F4F1EC, #F1ECE5, #ECE6DD) with charcoal text #1E2227. Text accents are deepened versions of the logo colours (#C4202E red, #D2461C to #B8590F ember) so they pass WCAG AA on light backgrounds. The pure logo colours are used for lines, dots and the glow.

**2. Placeholders.** Everything in `[square brackets]` needs to be confirmed. You'll find them in `src/config.mjs`:
- `keyTerms`: headline loan size, LTV, term and decision time
- each product's `strip` and `criteria`. **Every criteria row is an indicative default and must be checked against your actual lending policy**, including charge type, borrower types and geography
- `phone`, `phoneHref`, `hours`, `responseTime`, `amlLine` (FRN), `icoLine`
- `email` / `brokerEmail`: confirm these mailboxes exist
- `cases` (transactions) and `testimonials`: replace **only** with genuine, consented material, then delete the "Placeholder" tags in `pages.mjs`
- `team`, `brokerContacts`, the About page founding story and funding approach, and the broker procuration fee terms
- To show an animated count-up on a number, use e.g. `<b data-count="75" data-suffix="%">75%</b>`

**3. Legal pages.** Privacy, Cookie, Terms of Use, Complaints and Important Information contain a suggested structure only, for your solicitor to complete (edit in `src/pages.mjs`, `legal` section). Remove the "Placeholder text" notice once they're final.

**4. Forms.** The enquiry and broker forms validate in the browser and currently run in demo mode: they show the thank-you message but **don't send anything**. Set `enquiryEndpoint` and `brokerEndpoint` in `config.mjs` to a form handler (Formspree, Basin, Netlify Forms, your CRM webhook or a serverless function). The handler must accept a `multipart/form-data` POST and return HTTP 200. A hidden `website` field is a spam honeypot, so discard any submission where it's filled. Add your endpoint's domain to `form-action` and `connect-src` in `dist/_headers` if you use those headers.

**5. Images.** The site uses eight free stock photographs from Unsplash, each free for commercial use under the Unsplash License (https://unsplash.com/license) with no attribution required. None are paid Unsplash+ images, and none show identifiable people. They're listed, with links to their Unsplash pages, in `photos` at the bottom of `src/config.mjs`. To swap one, replace its `id` (the `photo-…` part of the image address) and rebuild.

- **How they load now:** directly from Unsplash's image server. If a photo can't load, the original placeholder graphic appears instead, so the page never shows a broken image.
- **Recommended before launch:** host them yourself. This is faster, and visitors' browsers then don't contact Unsplash. On a computer with internet access, run `python3 tools/fetch_photos.py` then `node build.mjs`. The photos are saved to `src/static/assets/img/photo/stock/` and the build uses them automatically. Then delete the Unsplash sentence in the Privacy Policy, section 13.
- **Still placeholders:** the team portraits and the stone texture behind the map. Replace them with real photos using the same file names: `team-1…6` (450/900px wide, 4:5) and `stone-light`.

**6. Insights.** The five articles are original drafts written for this site. Review them, then edit or replace them in `config.mjs` (`articles`). Dates are ISO format. Categories drive the filters.

## Features
- **Pages (23):** Home, Lending overview, 6 product pages (overview, typical uses, criteria table, FAQ accordion), Brokers (registration form, contacts, criteria sheet), About, Insights (filterable) and 5 articles, Contact/enquiry form with click-to-load map, 5 legal pages, 404.
- **Compliance:** the business-purpose statement appears in every footer and directly under both forms. The risk warning appears on the lending, product and contact pages and in the footer. There's a required business-purpose checkbox with the exact wording, the legal entity line, AML/ICO placeholders and © year. Nothing states or implies FCA authorisation.
- **Cookie consent (UK GDPR/PECR):** Accept, Reject and Manage carry equal weight. Nothing optional loads before consent. The choice is stored in a single `pc_consent` cookie for 6 months, and a "Cookie settings" link in the footer reopens the panel. To add analytics later, add it as `<script type="text/plain" data-consent="analytics" src="…"></script>`; it will only run after consent. You can also use `window.phoenixConsent.onChange(fn)`.
- **Privacy by design:** the fonts (Cormorant Garamond, Inter; SIL OFL) are hosted on your own server, so there are no Google Fonts calls. The map loads only when the visitor clicks.
- **SEO:** unique titles and descriptions, canonical URLs, Open Graph/Twitter tags, `sitemap.xml`, `robots.txt`, and JSON-LD (Organization, FinancialService with a loan catalogue, Service, FAQPage, Article, BreadcrumbList).
- **Accessibility:** semantic landmarks, skip link, keyboard-operable menu with focus trap, native `<details>` FAQs, labelled fields with inline and summary errors, `prefers-reduced-motion` respected. Text colours are WCAG AA checked.
- **Performance:** about 52 KB CSS, 15 KB JS (deferred), lazy-loaded responsive images, preloaded fonts, long-cache headers in `_headers`.

## Hosting notes
- `_headers` (Netlify/Cloudflare Pages) sets security headers and asset caching. On other hosts, set the equivalent headers in your server config.
- Point your host's 404 page at `/404.html`.
- After going live, submit `https://phoenix-capital.uk/sitemap.xml` in Google Search Console and run Lighthouse against the live URL.
