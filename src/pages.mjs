// Page definitions. Each returns { path, title, description, active, body, schema }.
import { site, keyTerms, compliance, products, cases, testimonials, team, brokerContacts, articles, insightCategories } from "./config.mjs";
import { esc, img, icon, arrow, markImg, watermark, pageHero, termsStrip, riskNote, ctaBand, breadcrumbSchema, imgAbs, PREVIEW } from "./layout.mjs";

const fmtDate = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/* ============================================================== components */
const productCards = (r) => `
<div class="products">
  ${products.map((p, i) => `
  <article class="product" data-reveal style="--d:${(i % 3) * 0.08}s">
    <span class="product__num">0${i + 1}</span>
    ${icon(p.icon, "product__icon")}
    <h3>${p.name}</h3>
    <p>${esc(p.short)}</p>
    <a class="link stretched" href="${r(`lending/${p.slug}/`)}">View criteria ${arrow}<span class="sr-only"> for ${p.name}</span></a>
  </article>`).join("")}
</div>`;

const caseCards = (r) => `
<div class="cases">
  ${cases.map((c, i) => `
  <article class="case" data-reveal style="--d:${i * 0.08}s">
    <div class="case__media">${img(r, c.image, { alt: "", sizes: "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" })}<span class="tag-placeholder">Placeholder</span></div>
    <div class="case__body">
      <p class="case__loc mb-0">${esc(c.location)}</p>
      <h3>${esc(c.product)}: ${esc(c.title)}</h3>
      <dl class="facts">
        <div><dt>Loan amount</dt><dd>${esc(c.loan)}</dd></div>
        <div><dt>Loan to value</dt><dd>${esc(c.ltv)}</dd></div>
        <div><dt>Term</dt><dd>${esc(c.term)}</dd></div>
        <div><dt>Purpose</dt><dd>${esc(c.purpose)}</dd></div>
      </dl>
    </div>
  </article>`).join("")}
</div>`;

const articleCard = (r, a, i = 0) => `
<article class="article-card" data-category="${esc(a.category)}" data-reveal style="--d:${(i % 3) * 0.08}s">
  <div class="article-card__media">${img(r, a.image, { alt: "", sizes: "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" })}</div>
  <p class="article-card__meta"><span>${esc(a.category)}</span><time datetime="${a.date}">${fmtDate(a.date)}</time></p>
  <h3><a href="${r(`insights/${a.slug}/`)}">${esc(a.title)}</a></h3>
  <p>${esc(a.excerpt)}</p>
</article>`;

const complianceBlock = () => `
<div class="form-compliance">
  <p class="compliance-note"><strong>${esc(compliance.businessPurpose)}</strong></p>
  <p class="compliance-note">${esc(compliance.risk)}</p>
</div>`;

/* ------------------------------------------------------------ form fields */
const field = ({ id, label, type = "text", required = false, full = false, hint = "", attrs = "", options, prefix, autocomplete, msg }) => {
  const req = required ? " required" : "";
  const described = [hint ? `${id}-hint` : "", `${id}-error`].filter(Boolean).join(" ");
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : "";
  const dm = msg ? ` data-required="${esc(msg)}"` : "";
  let control;
  if (type === "select") {
    control = `<select id="${id}" name="${id}"${req} aria-describedby="${described}"${dm}><option value="">Select</option>${options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`;
  } else if (type === "textarea") {
    control = `<textarea id="${id}" name="${id}"${req} aria-describedby="${described}"${dm} ${attrs}></textarea>`;
  } else {
    control = `<input id="${id}" name="${id}" type="${type}"${req}${ac} aria-describedby="${described}"${dm} ${attrs}>`;
    if (prefix) control = `<div class="input-prefix"><span aria-hidden="true">${prefix}</span>${control}</div>`;
  }
  return `<div class="field${full ? " field--full" : ""}">
    <label for="${id}">${esc(label)}${required ? '<span class="req" aria-hidden="true">*</span>' : ""}</label>
    ${control}
    ${hint ? `<span class="field__hint" id="${id}-hint">${esc(hint)}</span>` : ""}
    <span class="field__error" id="${id}-error" aria-live="polite"></span>
  </div>`;
};
const radios = ({ id, label, options, required = true, full = true, msg }) => `
<div class="field${full ? " field--full" : ""}" role="radiogroup" aria-labelledby="${id}-label">
  <span class="label" id="${id}-label">${esc(label)}${required ? '<span class="req" aria-hidden="true">*</span>' : ""}</span>
  <div class="choice-group">${options.map((o, i) => `<label class="choice"><input type="radio" id="${id}${i ? "-" + i : ""}" name="${id}" value="${esc(o)}"${required ? " required" : ""}${msg ? ` data-required="${esc(msg)}"` : ""} aria-describedby="${id}-error"><span>${esc(o)}</span></label>`).join("")}</div>
  <span class="field__error" id="${id}-error" aria-live="polite"></span>
</div>`;
const checks = ({ id, label, options }) => `
<div class="field field--full">
  <span class="label">${esc(label)}</span>
  <div class="choice-group">${options.map((o, i) => `<label class="choice"><input type="checkbox" id="${id}-${i}" name="${id}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join("")}</div>
</div>`;
const consentBox = (id, text, msg) => `
<div class="field field--full">
  <label class="consent" for="${id}"><input type="checkbox" id="${id}" name="${id}" value="yes" required data-required="${esc(msg)}" aria-describedby="${id}-error"><span>${esc(text)}<span class="req" aria-hidden="true"> *</span></span></label>
  <span class="field__error" id="${id}-error" aria-live="polite"></span>
</div>`;
const previewNotice = PREVIEW ? `<p class="preview-notice" role="note"><strong>Preview:</strong> this form is switched off while the website is being finalised. Nothing you enter will be sent.</p>` : "";
const errorSummary = `<div class="form-errors" role="alert" tabindex="-1" hidden><strong>Please check the following:</strong><ul></ul></div>`;
const honeypot = `<div class="hp" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>`;

/* ================================================================== HOME */
const home = {
  path: "",
  title: "Phoenix Capital | Bridging & Development Finance Lender, UK",
  description: "Phoenix Capital is a UK direct lender providing short-term, business-purpose property finance: bridging, refurbishment, development, auction and commercial bridging loans.",
  active: "",
  body: (r) => `
<section class="hero theme-paper" aria-labelledby="hero-title">
  <div class="ember-glow" aria-hidden="true"></div>
  ${watermark()}
  <div class="hero__media">${img(r, "hero-city-day", { alt: "", eager: true, sizes: "(min-width: 900px) 46vw, 100vw", attrs: 'data-parallax="0.12"' })}<div class="embers" data-embers="14" aria-hidden="true"></div></div>
  <span class="hero__frame" aria-hidden="true"></span>
  <div class="container">
    <div class="hero__content">
      <p class="eyebrow" data-reveal>Specialist property finance</p>
      <h1 class="display hero__title" id="hero-title" data-reveal style="--d:.1s">Decisive capital for property <em>and business.</em></h1>
      <p class="lead hero__lead" data-reveal style="--d:.2s">Fast, flexible, business-purpose finance for investors, developers and companies, decided by the people who lend.</p>
      <div class="btn-row" data-reveal style="--d:.3s">
        <a class="btn" href="${r("contact/")}">Submit an Enquiry</a>
        <a class="link" href="${r("lending/")}">View Lending Criteria ${arrow}</a>
      </div>
    </div>
  </div>
  <a class="scroll-cue" href="#terms" aria-label="Scroll to key terms"><span class="scroll-cue__line"></span><span>Scroll</span></a>
</section>

<div id="terms">${termsStrip(keyTerms)}</div>

<section class="section theme-paper" aria-labelledby="intro-title">
  <div class="container grid">
    <div class="md-1-6">
      <p class="eyebrow" data-reveal>A direct lender</p>
      <h2 id="intro-title" data-reveal style="--d:.08s">Considered decisions, made by the people who lend.</h2>
      <div class="mt-l" data-reveal style="--d:.16s">
        <p class="lead">Phoenix Capital provides short-term finance secured against UK property, for business and investment purposes.</p>
        <p class="muted mt-m">The people who assess your proposal are the people who approve it. We look at the asset, the plan and the exit. Where a case makes sense, we say so early and set out terms plainly. Where it does not, we tell you quickly, so that you can move on.</p>
      </div>
      <div class="mt-l" data-reveal style="--d:.24s"><a class="link" href="${r("about/")}">About Phoenix Capital ${arrow}</a></div>
    </div>
    <div class="md-8-12" data-reveal style="--d:.12s">
      <figure class="frame">${img(r, "townhouse-terrace", { sizes: "(min-width: 900px) 420px, 100vw", cls: "aspect-portrait" })}</figure>
    </div>
  </div>
</section>

<section class="section theme-white" aria-labelledby="products-title">
  <div class="container">
    <div class="split-head">
      <div>
        <p class="eyebrow" data-reveal>Lending</p>
        <h2 id="products-title" data-reveal style="--d:.08s">Finance shaped to the transaction.</h2>
      </div>
      <a class="link" href="${r("lending/")}" data-reveal>All lending criteria ${arrow}</a>
    </div>
    ${productCards(r)}
  </div>
</section>

<section class="section theme-stone" aria-labelledby="process-title">
  <div class="container">
    <div class="split-head">
      <div>
        <p class="eyebrow" data-reveal>How it works</p>
        <h2 id="process-title" data-reveal style="--d:.08s">A clear path from enquiry to completion.</h2>
      </div>
      <p class="muted max-28" data-reveal>One point of contact throughout, and no surprises at the end.</p>
    </div>
    <ol class="steps">
      ${[
        ["Enquiry", "Share the property, the loan required and your exit. A short conversation is often enough for an initial view."],
        ["Terms issued", "We set out indicative terms in writing, with rates, fees and conditions stated plainly."],
        ["Valuation &amp; legals", "We instruct a valuation, and our solicitors work alongside yours to keep matters moving."],
        ["Funds released", "Once conditions are satisfied, funds are released on completion."],
      ].map(([t, d], i) => `<li class="step" data-reveal style="--d:${i * 0.1}s"><span class="step__num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}
    </ol>
  </div>
</section>

<section class="section theme-mist" aria-labelledby="why-title">
  <div class="container grid">
    <div class="md-1-5">
      <div class="sticky-col">
        <p class="eyebrow" data-reveal>Why Phoenix Capital</p>
        <h2 id="why-title" data-reveal style="--d:.08s">Judgement, pace and certainty.</h2>
        <p class="muted mt-m max-28" data-reveal style="--d:.16s">Short-term finance works best when the lender understands the plan and commits to it.</p>
      </div>
    </div>
    <div class="md-6-12">
      <div class="points">
        ${[
          ["direct", "Direct lender", "No panels and no layers between you and the credit decision. You speak to the people who decide."],
          ["judgement", "Common-sense underwriting", "We assess each case on its merits: the security, the borrower's experience and a credible route out. Not a scorecard."],
          ["speed", "Speed", `Decisions within ${esc(site.responseTime.replace("business hours", "hours"))} of a complete enquiry. Valuation and legal work run in parallel wherever possible.`],
          ["certainty", "Certainty", "When we issue terms, we intend to honour them. Conditions are set out at the start, not introduced at the end."],
        ].map(([ic, t, d], i) => `<div class="point" data-reveal style="--d:${(i % 2) * 0.1}s">${icon(ic, "point__icon")}<h3>${t}</h3><p>${d}</p></div>`).join("")}
      </div>
    </div>
  </div>
</section>

<section class="section theme-paper" aria-labelledby="cases-title">
  <div class="container">
    <div class="split-head">
      <div>
        <p class="eyebrow" data-reveal>Recent transactions</p>
        <h2 id="cases-title" data-reveal style="--d:.08s">Selected lending.</h2>
      </div>
      <p class="muted max-28 small" data-reveal><span class="tag-placeholder">Placeholder</span><br><br>Replace with completed transactions, published with the borrower's consent.</p>
    </div>
    ${caseCards(r)}
  </div>
</section>

<section class="split-band theme-stone" aria-labelledby="brokers-title">
  <div class="split-band__media">${img(r, "office-day", { sizes: "(min-width: 900px) 50vw, 100vw" })}</div>
  <div class="split-band__text">
    <div class="ember-glow" aria-hidden="true"></div>
    <p class="eyebrow" data-reveal>For introducers</p>
    <h2 id="brokers-title" data-reveal style="--d:.08s">A lender brokers can rely on.</h2>
    <p class="lead mt-m" data-reveal style="--d:.16s">Straight answers, early. A named contact for every case, and your client relationship respected throughout.</p>
    <div class="btn-row mt-l" data-reveal style="--d:.24s">
      <a class="btn" href="${r("brokers/")}#register">Register as a Broker</a>
      <a class="link" href="${r("brokers/")}">Working with us ${arrow}</a>
    </div>
  </div>
</section>

<section class="section theme-paper" aria-labelledby="quotes-title">
  <div class="container">
    <div class="split-head">
      <div>
        <p class="eyebrow" data-reveal>Testimonials</p>
        <h2 id="quotes-title" data-reveal style="--d:.08s">In their words.</h2>
      </div>
      <span class="tag-placeholder" data-reveal>Placeholder: genuine quotes only</span>
    </div>
    <div class="quotes">
      ${testimonials.map((t, i) => `<figure class="quote" data-reveal style="--d:${i * 0.1}s"><span class="quote__mark" aria-hidden="true">“</span><blockquote>${esc(t.quote)}</blockquote><figcaption>${esc(t.by)}</figcaption></figure>`).join("")}
    </div>
  </div>
</section>

${ctaBand(r)}`,
};

/* ================================================================ LENDING */
const lending = {
  path: "lending/",
  title: "Lending Criteria | Bridging, Refurbishment & Development Finance | Phoenix Capital",
  description: "Lending criteria for Phoenix Capital's short-term, business-purpose property finance: bridging, refurbishment, development, auction, commercial bridging and business loans.",
  active: "lending",
  schema: [breadcrumbSchema([["Lending", "lending/"]])],
  body: (r) => `
${pageHero(r, { crumbs: [["Lending", "lending/"]], eyebrow: "Lending", title: "Short-term finance for property <em>and business.</em>", lead: "Six facilities, one approach: understand the asset, agree the plan, commit to the terms.", image: "canary-wharf" })}
${termsStrip(keyTerms)}
<section class="section theme-paper" aria-labelledby="products-index">
  <div class="container">
    <div class="split-head">
      <div><p class="eyebrow" data-reveal>Our products</p><h2 id="products-index" data-reveal style="--d:.08s">Choose a facility.</h2></div>
      <p class="muted max-28" data-reveal>Each product page sets out typical uses, key criteria and common questions.</p>
    </div>
    <ul class="index-list">
      ${products.map((p, i) => `
      <li class="index-row" data-reveal>
        <span class="index-row__num">0${i + 1}</span>
        <h3><a href="${r(`lending/${p.slug}/`)}">${p.name}</a></h3>
        <p>${esc(p.short)}</p>
        <span class="index-row__go" aria-hidden="true">${arrow}</span>
      </li>`).join("")}
    </ul>
  </div>
</section>
<section class="section theme-mist" aria-labelledby="look-title">
  <div class="container grid">
    <div class="md-1-5">
      <p class="eyebrow" data-reveal>Across our lending</p>
      <h2 id="look-title" data-reveal style="--d:.08s">What we look for.</h2>
      <p class="muted mt-m" data-reveal style="--d:.16s">Criteria guide our decisions; they do not replace judgement. If a case falls outside the figures shown, we are still glad to discuss it.</p>
    </div>
    <div class="md-6-12">
      <ul class="rule-list" data-reveal>
        <li><div><h3 class="h3">Security</h3><p class="muted mt-s mb-0">Residential investment, commercial, semi-commercial and mixed-use property, and land in some cases.</p></div></li>
        <li><div><h3 class="h3">Borrowers</h3><p class="muted mt-s mb-0">Experienced and first-time investors, developers, limited companies, LLPs and special purpose vehicles.</p></div></li>
        <li><div><h3 class="h3">Purpose</h3><p class="muted mt-s mb-0">Business or investment purposes only. We do not lend on property that is, or will be, occupied by the borrower or their family.</p></div></li>
        <li><div><h3 class="h3">Exit</h3><p class="muted mt-s mb-0">A clear and evidenced route to repayment: typically a sale or a refinance.</p></div></li>
      </ul>
      <div class="mt-l">${riskNote()}</div>
    </div>
  </div>
</section>
${ctaBand(r)}`,
};

const productPage = (p) => {
  const path = `lending/${p.slug}/`;
  const others = products.filter((x) => x.slug !== p.slug).slice(0, 3);
  return {
    path,
    title: p.seoTitle,
    description: p.seoDesc,
    active: "lending",
    ogImage: imgAbs(p.image),
    schema: [
      breadcrumbSchema([["Lending", "lending/"], [p.name, path]]),
      { "@type": "FAQPage", mainEntity: p.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      { "@type": "Service", name: p.name, serviceType: p.name, provider: { "@id": `${site.domain}/#financialservice` }, areaServed: { "@type": "Country", name: "United Kingdom" }, description: p.seoDesc, url: `${site.domain}/${path}` },
    ],
    body: (r) => `
${pageHero(r, { crumbs: [["Lending", "lending/"], [p.name, path]], eyebrow: "Lending", title: p.name, lead: esc(p.lead), image: p.image,
  children: `<div class="btn-row mt-l" data-reveal style="--d:.24s"><a class="btn" href="${r("contact/")}">Submit an Enquiry</a><a class="link" href="#criteria">Key criteria ${arrow}</a></div>` })}
${termsStrip(p.strip)}
<section class="section theme-paper" aria-labelledby="what-title">
  <div class="container grid">
    <div class="md-1-6">
      <p class="eyebrow" data-reveal>Overview</p>
      <h2 id="what-title" data-reveal style="--d:.08s">What it is.</h2>
      <div class="mt-l" data-reveal style="--d:.16s">
        <p class="lead">${esc(p.what[0])}</p>
        ${p.what.slice(1).map((t) => `<p class="muted mt-m">${esc(t)}</p>`).join("")}
      </div>
    </div>
    <div class="md-8-12" data-reveal style="--d:.12s"><figure class="frame">${img(r, p.image2 || p.image, { alt: "", sizes: "(min-width: 900px) 420px, 100vw", cls: "aspect-portrait" })}</figure></div>
  </div>
</section>
<section class="section theme-stone" aria-labelledby="uses-title">
  <div class="container grid">
    <div class="md-1-5"><p class="eyebrow" data-reveal>Typical uses</p><h2 id="uses-title" data-reveal style="--d:.08s">When it is used.</h2></div>
    <div class="md-6-12"><ul class="rule-list" data-reveal>${p.uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul></div>
  </div>
</section>
<section class="section theme-white" id="criteria" aria-labelledby="criteria-title">
  <div class="container grid">
    <div class="md-1-4">
      <div class="sticky-col">
        <p class="eyebrow" data-reveal>Key criteria</p>
        <h2 id="criteria-title" data-reveal style="--d:.08s">The terms, plainly.</h2>
        <p class="muted mt-m small" data-reveal style="--d:.16s">Indicative only. Final terms depend on the property, the borrower and the plan.</p>
      </div>
    </div>
    <div class="md-5-12" data-reveal>
      <table class="criteria">
        <caption class="sr-only">${p.name} key criteria</caption>
        <tbody>${Object.entries(p.criteria).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody>
      </table>
      <div class="mt-l">${riskNote()}</div>
    </div>
  </div>
</section>
<section class="section theme-paper" aria-labelledby="faq-title">
  <div class="container grid">
    <div class="md-1-4"><p class="eyebrow" data-reveal>Questions</p><h2 id="faq-title" data-reveal style="--d:.08s">Frequently asked.</h2></div>
    <div class="md-5-12">
      <div class="faq" data-reveal>
        ${p.faqs.map(([q, a]) => `<details><summary>${esc(q)}<span class="faq__icon" aria-hidden="true"></span></summary><div class="faq__body"><p>${esc(a)}</p></div></details>`).join("")}
      </div>
    </div>
  </div>
</section>
<section class="section theme-mist" aria-labelledby="related-title">
  <div class="container">
    <div class="split-head"><div><p class="eyebrow" data-reveal>Related</p><h2 id="related-title" data-reveal style="--d:.08s">Other facilities.</h2></div><a class="link" href="${r("lending/")}" data-reveal>All lending ${arrow}</a></div>
    <div class="products">
      ${others.map((o, i) => `<article class="product" data-reveal style="--d:${i * 0.08}s">${icon(o.icon, "product__icon")}<h3>${o.name}</h3><p>${esc(o.short)}</p><a class="link stretched" href="${r(`lending/${o.slug}/`)}">View criteria ${arrow}<span class="sr-only"> for ${o.name}</span></a></article>`).join("")}
    </div>
  </div>
</section>
${ctaBand(r, { title: `Discuss a ${p.name.toLowerCase()} case.` })}`,
  };
};

/* ================================================================ BROKERS */
const brokers = {
  path: "brokers/",
  title: "For Brokers & Introducers | Bridging Finance Lender | Phoenix Capital",
  description: "Phoenix Capital works with finance brokers and introducers on bridging, refurbishment and development finance. Register to receive our criteria and a named lending contact.",
  active: "brokers",
  schema: [breadcrumbSchema([["Brokers", "brokers/"]])],
  body: (r) => `
${pageHero(r, { crumbs: [["Brokers", "brokers/"]], eyebrow: "Brokers & introducers", title: "Built to work <em>alongside you.</em>", lead: "Clear answers, a named contact and your client relationship respected from first call to completion.", image: "office-day",
  children: `<div class="btn-row mt-l" data-reveal style="--d:.24s"><a class="btn" href="#register">Register as a Broker</a><a class="link" href="#criteria-sheet">Criteria sheet ${arrow}</a></div>` })}
<section class="section theme-white" aria-labelledby="benefits-title">
  <div class="container grid">
    <div class="md-1-5"><div class="sticky-col"><p class="eyebrow" data-reveal>Working with us</p><h2 id="benefits-title" data-reveal style="--d:.08s">What introducers can expect.</h2></div></div>
    <div class="md-6-12">
      <div class="points">
        ${[
          ["people", "A decision-maker on every call", "Speak to someone who can give a view on the case, not only take the details."],
          ["direct", "Your client stays your client", "We keep you informed at every stage and do not approach your clients directly for future business."],
          ["speed", "Prompt, written terms", `Indicative terms within ${esc(site.responseTime.replace("business hours", "hours"))} of a complete enquiry, with fees and conditions set out clearly.`],
          ["certainty", "Procuration fees", "[Procuration fee terms to be confirmed: rate, basis and timing of payment.]"],
        ].map(([ic, t, d], i) => `<div class="point" data-reveal style="--d:${(i % 2) * 0.1}s">${icon(ic, "point__icon")}<h3>${t}</h3><p>${d}</p></div>`).join("")}
      </div>
    </div>
  </div>
</section>
<section class="section theme-mist" id="register" aria-labelledby="register-title">
  <div class="container grid">
    <div class="md-1-4">
      <p class="eyebrow" data-reveal>Registration</p>
      <h2 id="register-title" data-reveal style="--d:.08s">Register as a broker.</h2>
      <p class="muted mt-m" data-reveal style="--d:.16s">Complete the form and a member of our team will be in touch to confirm your registration and introduce your named contact.</p>
    </div>
    <div class="md-5-12">
      <form class="form" action="${site.brokerEndpoint}" method="post" novalidate data-validate data-success="broker-success">
        ${previewNotice}${errorSummary}
        <fieldset class="form__section"><legend><span>01</span> Your firm</legend>
          ${field({ id: "firm_name", label: "Firm name", required: true, autocomplete: "organization", msg: "Please enter your firm name." })}
          ${field({ id: "fca_frn", label: "FCA firm reference number", hint: "If applicable", attrs: 'inputmode="numeric" pattern="[0-9]{6,7}" data-pattern="FRNs are six or seven digits."' })}
          ${field({ id: "firm_postcode", label: "Office postcode", autocomplete: "postal-code" })}
          ${field({ id: "network", label: "Network or mortgage club", hint: "If applicable" })}
        </fieldset>
        <fieldset class="form__section"><legend><span>02</span> Your details</legend>
          ${field({ id: "contact_name", label: "Full name", required: true, autocomplete: "name", msg: "Please enter your name." })}
          ${field({ id: "role", label: "Role", autocomplete: "organization-title" })}
          ${field({ id: "broker_email", label: "Email", type: "email", required: true, autocomplete: "email", msg: "Please enter your email address." })}
          ${field({ id: "broker_phone", label: "Phone", type: "tel", required: true, autocomplete: "tel", msg: "Please enter a phone number." })}
        </fieldset>
        <fieldset class="form__section"><legend><span>03</span> Your business</legend>
          ${checks({ id: "deal_types", label: "Typical cases", options: products.map((p) => p.name) })}
          ${field({ id: "broker_message", label: "Anything else we should know", type: "textarea", full: true })}
          ${consentBox("broker_confirm", "I confirm that I am a professional introducer and that the cases I introduce will be for business or investment purposes.", "Please confirm to continue.")}
        </fieldset>
        ${honeypot}
        <div class="form__actions">
          <p class="form__privacy">We will use these details to manage your registration. See our <a href="${r("privacy-policy/")}">Privacy Policy</a>.</p>
          <button class="btn" type="submit">Register</button>
        </div>
      </form>
      <div class="form-success" id="broker-success" hidden><h3>Thank you.</h3><p class="muted">Your registration has been received. A member of our team will be in touch shortly.</p></div>
      ${complianceBlock()}
    </div>
  </div>
</section>
<section class="section theme-stone" aria-labelledby="contacts-title">
  <div class="container grid">
    <div class="md-1-4"><p class="eyebrow" data-reveal>Key contacts</p><h2 id="contacts-title" data-reveal style="--d:.08s">Who you will speak to.</h2><p class="mt-m"><span class="tag-placeholder">Placeholder</span></p></div>
    <div class="md-5-12">
      ${brokerContacts.map((c) => `<div class="contact-card" data-reveal><h3>${esc(c.name)}</h3><p class="member__role mb-m">${esc(c.role)}</p><p class="muted mb-0">${esc(c.phone)}<br>${esc(c.email)}</p></div>`).join("")}
      <div class="contact-card" data-reveal><h3>Broker enquiries</h3><p class="muted mb-0"><a class="u-link" href="mailto:${site.brokerEmail}">${site.brokerEmail}</a><br>${esc(site.phone)}</p></div>
    </div>
  </div>
</section>
<section class="section section--tight theme-paper" id="criteria-sheet" aria-labelledby="sheet-title">
  <div class="container">
    <div class="download-card" data-reveal>
      ${icon("document")}
      <div><h3 id="sheet-title">Lending criteria sheet</h3><p class="muted mb-0 mt-s">A one-page summary of our products and criteria for introducers. <span class="tag-placeholder">Placeholder document</span></p></div>
      <a class="btn" href="${r("assets/docs/phoenix-capital-criteria-sheet.pdf")}" download>Download PDF</a>
    </div>
  </div>
</section>
${ctaBand(r, { eyebrow: "Submit a case", title: "Have a case to discuss?", lead: "Send us the essentials and we will come back to you with a clear view." })}`,
};

/* ================================================================== ABOUT */
const about = {
  path: "about/",
  title: "About Phoenix Capital | Direct Property Finance Lender",
  description: "Phoenix Capital is a direct, decision-making lender providing short-term, business-purpose property finance across the UK. Our story, lending philosophy and team.",
  active: "about",
  schema: [breadcrumbSchema([["About", "about/"]])],
  body: (r) => `
${pageHero(r, { crumbs: [["About", "about/"]], eyebrow: "About us", title: "Capital with conviction, <em>applied with care.</em>", lead: "A direct lender for property investors, developers and businesses who value judgement and straight answers.", image: "townhouse-terrace" })}
<section class="section theme-white" aria-labelledby="story-title">
  <div class="container grid">
    <div class="md-1-6">
      <p class="eyebrow" data-reveal>Our story</p>
      <h2 id="story-title" data-reveal style="--d:.08s">Built around the decision.</h2>
      <div class="mt-l" data-reveal style="--d:.16s">
        <p class="lead">Phoenix Capital was established to give property investors and businesses a more direct route to short-term finance.</p>
        <p class="muted mt-m">[Founding story to be added: when the business was established, by whom, and the experience the founders bring. Two or three short paragraphs.]</p>
        <p class="muted">Our approach is simple. We take time to understand each proposal, we decide promptly, and we stand behind the terms we issue.</p>
      </div>
    </div>
    <div class="md-8-12" data-reveal style="--d:.12s"><figure class="frame">${img(r, "period-door", { sizes: "(min-width: 900px) 420px, 100vw", cls: "aspect-portrait" })}</figure></div>
  </div>
</section>
<section class="section theme-mist" aria-labelledby="philosophy-title">
  <div class="container grid">
    <div class="md-1-4"><p class="eyebrow" data-reveal>Lending philosophy</p><h2 id="philosophy-title" data-reveal style="--d:.08s">Three principles.</h2></div>
    <div class="md-5-12">
      <ol class="principles">
        ${[
          ["Judgement over formula", "Every property and every borrower is different. We read the whole proposal: the asset, the experience behind it and the route out. Criteria inform our decisions; they do not make them."],
          ["Plain terms, early", "We would rather give a clear answer quickly than a vague one slowly. Rates, fees and conditions are set out in writing at the start."],
          ["Commitment to the plan", "Once we have agreed to lend, we work to complete. If circumstances change during the term, we expect to talk, not to surprise."],
        ].map(([t, d], i) => `<li class="principle" data-reveal><span class="principle__num">0${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join("")}
      </ol>
    </div>
  </div>
</section>
<section class="section theme-stone" aria-labelledby="team-title">
  <div class="container">
    <div class="split-head"><div><p class="eyebrow" data-reveal>Our team</p><h2 id="team-title" data-reveal style="--d:.08s">The people who decide.</h2></div><span class="tag-placeholder" data-reveal>Placeholder photos and names</span></div>
    <div class="team">
      ${team.map((m, i) => `<article class="member" data-reveal style="--d:${(i % 3) * 0.08}s"><div class="member__photo">${img(r, `team-${i + 1}`, { alt: "Placeholder portrait", sizes: "(min-width: 900px) 380px, (min-width: 520px) 50vw, 100vw" })}</div><h3>${esc(m.name)}</h3><p class="member__role">${esc(m.role)}</p><p>[Short biography: background, experience and areas of focus.]</p></article>`).join("")}
    </div>
  </div>
</section>
<section class="section theme-paper" aria-labelledby="funding-title">
  <div class="container grid">
    <div class="md-1-5"><p class="eyebrow" data-reveal>Funding approach</p><h2 id="funding-title" data-reveal style="--d:.08s">Capital that is ready to lend.</h2></div>
    <div class="md-6-12" data-reveal style="--d:.12s">
      <p class="lead">Certainty of funding is central to certainty of completion.</p>
      <p class="muted mt-m">[Describe the funding model, for example private capital, family office or institutional facilities. Confirm all statements about funding with your solicitor before publishing.]</p>
      <p class="muted">We lend for business and investment purposes only, against UK property, with every loan reviewed and approved by our own credit team.</p>
    </div>
  </div>
</section>
${ctaBand(r)}`,
};

/* =============================================================== INSIGHTS */
const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));
const insights = {
  path: "insights/",
  title: "Insights | Bridging & Development Finance Guides | Phoenix Capital",
  description: "Guides and commentary on bridging loans, refurbishment and development finance, auction purchases and working with a specialist lender, from Phoenix Capital.",
  active: "insights",
  schema: [breadcrumbSchema([["Insights", "insights/"]])],
  body: (r) => `
${pageHero(r, { crumbs: [["Insights", "insights/"]], eyebrow: "Insights", title: "Notes on <em>property finance.</em>", lead: "Practical guidance for borrowers and introducers, written by our lending team.", short: true })}
<section class="section theme-white" aria-labelledby="articles-title">
  <div class="container">
    <h2 class="sr-only" id="articles-title">Articles</h2>
    <div class="filters" data-filters role="group" aria-label="Filter articles by category">
      <button class="filter" type="button" data-filter="all" aria-pressed="true">All</button>
      ${insightCategories.map((c) => `<button class="filter" type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}
    </div>
    <p class="sr-only" aria-live="polite" data-filter-status></p>
    <div class="articles articles--feature">${sortedArticles.map((a, i) => articleCard(r, a, i)).join("")}</div>
    <p class="empty-state" data-empty hidden>No articles in this category yet.</p>
  </div>
</section>
${ctaBand(r)}`,
};

const articlePage = (a) => {
  const path = `insights/${a.slug}/`;
  const related = sortedArticles.filter((x) => x.slug !== a.slug).slice(0, 3);
  return {
    path,
    title: `${a.title} | Phoenix Capital Insights`,
    description: a.excerpt,
    active: "insights",
    ogType: "article",
    ogImage: imgAbs(a.image),
    schema: [
      breadcrumbSchema([["Insights", "insights/"], [a.title, path]]),
      { "@type": "Article", headline: a.title, datePublished: a.date, dateModified: a.date, description: a.excerpt, image: imgAbs(a.image), author: { "@id": `${site.domain}/#organization` }, publisher: { "@id": `${site.domain}/#organization` }, mainEntityOfPage: `${site.domain}/${path}` },
    ],
    body: (r) => `
${pageHero(r, { crumbs: [["Insights", "insights/"], [a.title, path]], eyebrow: a.category, title: esc(a.title), lead: esc(a.excerpt), image: a.image,
  meta: `<p class="hero-meta" data-reveal style="--d:.24s"><time datetime="${a.date}">${fmtDate(a.date)}</time><span>${a.read} minute read</span><span>Phoenix Capital</span></p>` })}
<article class="section theme-white" aria-label="Article">
  <div class="container container--narrow">
    <div class="prose" data-reveal>${a.body}</div>
    <div class="signature-rule">${markImg(r, "")}</div>
    <p class="compliance-note">This article is for general information only and does not constitute financial, legal or tax advice. ${esc(compliance.businessPurpose)}</p>
  </div>
</article>
<section class="section theme-stone" aria-labelledby="more-title">
  <div class="container">
    <div class="split-head"><div><p class="eyebrow" data-reveal>Further reading</p><h2 id="more-title" data-reveal style="--d:.08s">More insights.</h2></div><a class="link" href="${r("insights/")}" data-reveal>All insights ${arrow}</a></div>
    <div class="articles">${related.map((x, i) => articleCard(r, x, i)).join("")}</div>
  </div>
</section>
${ctaBand(r)}`,
  };
};

/* ================================================================ CONTACT */
const contact = {
  path: "contact/",
  title: "Submit an Enquiry | Contact Phoenix Capital",
  description: "Submit a bridging, refurbishment, development or business loan enquiry to Phoenix Capital. A member of our lending team will respond with a clear view.",
  active: "contact",
  schema: [breadcrumbSchema([["Contact", "contact/"]])],
  body: (r) => `
${pageHero(r, { crumbs: [["Contact", "contact/"]], eyebrow: "Submit an enquiry", title: "Tell us about <em>the transaction.</em>", lead: `Share the essentials below. We aim to respond to complete enquiries within ${esc(site.responseTime)}.`, short: true })}
<section class="section theme-mist" aria-labelledby="form-title">
  <div class="container grid">
    <div class="md-1-8">
      <h2 class="sr-only" id="form-title">Deal enquiry form</h2>
      <form class="form" action="${site.enquiryEndpoint}" method="post" novalidate data-validate data-success="enquiry-success">
        ${previewNotice}${errorSummary}
        <fieldset class="form__section"><legend><span>01</span> About you</legend>
          ${field({ id: "name", label: "Full name", required: true, autocomplete: "name", msg: "Please enter your name." })}
          ${field({ id: "company", label: "Company", autocomplete: "organization", hint: "If applicable" })}
          ${field({ id: "email", label: "Email", type: "email", required: true, autocomplete: "email", msg: "Please enter your email address." })}
          ${field({ id: "phone", label: "Phone", type: "tel", required: true, autocomplete: "tel", msg: "Please enter a phone number." })}
          ${radios({ id: "applicant_type", label: "Are you a broker or a direct borrower?", options: ["Broker or introducer", "Direct borrower"], msg: "Please choose one option." })}
        </fieldset>
        <fieldset class="form__section"><legend><span>02</span> The loan</legend>
          ${field({ id: "loan_amount", label: "Loan amount", required: true, prefix: "£", attrs: 'inputmode="numeric" data-money', msg: "Please enter the loan amount required." })}
          ${field({ id: "property_value", label: "Property value", required: true, prefix: "£", attrs: 'inputmode="numeric" data-money', msg: "Please enter the estimated property value." })}
          <div class="ltv-readout" aria-live="polite">Indicative loan to value <output data-ltv>—</output></div>
          ${field({ id: "property_type", label: "Property type", type: "select", required: true, options: ["Residential investment", "House in multiple occupation", "Block of flats", "Semi-commercial / mixed use", "Commercial", "Land", "Development site", "Other"], msg: "Please choose a property type." })}
          ${field({ id: "location", label: "Property location", required: true, hint: "Town or postcode", autocomplete: "off", msg: "Please enter the property location." })}
          ${field({ id: "loan_purpose", label: "Loan purpose", type: "select", required: true, options: ["Purchase", "Auction purchase", "Refinance", "Refurbishment", "Development", "Capital raise for business", "Other"], msg: "Please choose the loan purpose." })}
          ${field({ id: "term", label: "Term required", type: "select", required: true, options: ["Up to 6 months", "6 to 12 months", "12 to 18 months", "18 to 24 months", "Over 24 months"], msg: "Please choose a term." })}
          ${field({ id: "exit_strategy", label: "Exit strategy", type: "select", required: true, full: true, options: ["Sale of the property", "Refinance to a term loan", "Sale of units on completion", "Refinance on completion of works", "Other (please explain below)"], msg: "Please choose an exit strategy." })}
          ${field({ id: "message", label: "Message", type: "textarea", full: true, hint: "Anything else that would help us assess the case: experience, timescales, works planned." })}
        </fieldset>
        <fieldset class="form__section"><legend><span>03</span> Confirmation</legend>
          ${consentBox("business_purpose", compliance.consent, "Please confirm the loan is for business or investment purposes.")}
        </fieldset>
        ${honeypot}
        <div class="form__actions">
          <p class="form__privacy">We will use your details to respond to your enquiry. See our <a href="${r("privacy-policy/")}">Privacy Policy</a>.</p>
          <button class="btn" type="submit">Submit Enquiry</button>
        </div>
      </form>
      <div class="form-success" id="enquiry-success" hidden><h3>Thank you.</h3><p class="muted">Your enquiry has been received. A member of our lending team will be in touch within ${esc(site.responseTime)}.</p></div>
      ${complianceBlock()}
    </div>
    <aside class="md-9-12" aria-label="Contact details">
      <div class="side-panel">
        <p class="eyebrow">Response time</p>
        <p class="h3">We aim to respond to complete enquiries within ${esc(site.responseTime)}.</p>
        <p class="muted small mt-m mb-0">For time-critical cases, such as auction purchases, please call as well as submitting the form.</p>
      </div>
      <div class="side-panel">
        <p class="eyebrow">Speak to us</p>
        <p class="mb-0">${esc(site.phone)}<br><a class="u-link" href="mailto:${site.email}">${site.email}</a></p>
        <p class="muted small mt-m mb-0">${esc(site.hours)}</p>
      </div>
      <div class="side-panel">
        <p class="eyebrow">Registered office</p>
        <address class="muted" style="font-style:normal">${site.legalEntity}<br>${site.registeredOffice.street}<br>${site.registeredOffice.locality}, ${site.registeredOffice.region}<br>${site.registeredOffice.postcode}</address>
      </div>
    </aside>
  </div>
</section>
<section class="section section--tight theme-white" aria-labelledby="map-title">
  <div class="container">
    <div class="split-head"><div><p class="eyebrow" data-reveal>Find us</p><h2 id="map-title" data-reveal style="--d:.08s">Office location.</h2></div><a class="link" href="${site.mapLink}" rel="noopener" target="_blank" data-reveal>Open in OpenStreetMap ${arrow}<span class="sr-only"> (opens in a new tab)</span></a></div>
    <div class="map-embed" data-src="${site.mapEmbedSrc}" data-title="Map showing the Phoenix Capital office" data-reveal>
      <div class="map-embed__gate">
        ${img(r, "stone-light", { alt: "" })}
        ${markImg(r)}
        <p>The map is provided by OpenStreetMap, a third-party service. Loading it will share your IP address with that service.</p>
        <button class="btn btn--sm" type="button" data-map-load>Load map</button>
      </div>
    </div>
  </div>
</section>`,
};

/* ================================================================== LEGAL */
const solicitorNote = `<p class="placeholder-note"><span class="tag-placeholder">Placeholder text</span><br><br>This page contains a suggested structure only. The final wording must be prepared or reviewed by Phoenix Capital's solicitor before publication.</p>`;
const legalPage = ({ slug, title, h1, description, updated = "[date]", body, note = solicitorNote }) => ({
  path: `${slug}/`,
  title: `${title} | Phoenix Capital`,
  description,
  schema: [breadcrumbSchema([[title, `${slug}/`]])],
  body: (r) => `
${pageHero(r, { crumbs: [[title, `${slug}/`]], eyebrow: "Legal", title: h1 || title, lead: `Last updated: ${updated}`, short: true })}
<section class="section theme-white">
  <div class="container container--narrow"><div class="prose">${note}${body(r)}</div></div>
</section>`,
});

const legal = [
  legalPage({
    slug: "privacy-policy", title: "Privacy Policy",
    description: "How Phoenix Capital collects, uses, shares and protects personal data, and your rights under UK data protection law.",
    note: "",
    body: (r) => {
      const o = site.registeredOffice;
      const addr = `${site.legalEntity}, ${o.street}, ${o.locality}, ${o.region}, ${o.postcode}`;
      return `
<p>This privacy policy explains how Phoenix Capital collects, uses, shares and protects personal data when you visit our website, make an enquiry, apply for or hold a loan with us, act as a guarantor or as a director, shareholder or beneficial owner of a borrower, or introduce business to us as a broker. It also explains your rights and how to exercise them.</p>
<p>We are committed to handling personal data fairly, lawfully and transparently, in line with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018 and the Privacy and Electronic Communications Regulations 2003, as amended by the Data (Use and Access) Act 2025.</p>

<h2>1. Who we are</h2>
<p>${esc(compliance.legalLine)}</p>
<p>${esc(site.legalEntity)} is the controller of your personal data. This means we decide how and why it is used, and we are responsible for looking after it. ${esc(site.icoLine)}.</p>
<p>If you have any questions about this policy or how we use your personal data, please contact our [Data Protection Lead]:</p>
<ul>
<li>Email: [privacy@phoenix-capital.uk]</li>
<li>Post: [Data Protection Lead], ${esc(addr)}</li>
<li>Telephone: ${esc(site.phone)}</li>
</ul>
<p>[We have / have not] appointed a Data Protection Officer. [If appointed, give their name and contact details.]</p>

<h2>2. Our lending is for business purposes</h2>
<p>${esc(compliance.businessPurpose)} Many of our borrowers are companies or other organisations, but we still collect personal data about the individuals connected to them, such as directors, shareholders, guarantors and beneficial owners. This policy applies to those individuals.</p>

<h2>3. The personal data we collect</h2>
<p>Depending on your relationship with us, we may collect and use the following categories of personal data:</p>
<ul>
<li><strong>Identity data:</strong> name, title, date of birth, nationality, and copies of identity documents such as a passport or driving licence.</li>
<li><strong>Contact data:</strong> postal address and address history, email address and telephone numbers.</li>
<li><strong>Financial data:</strong> bank details, assets and liabilities, income, credit history, property ownership, and information about existing borrowing.</li>
<li><strong>Transaction data:</strong> details of the loan requested or provided, the property offered as security, the purpose of the loan, the exit strategy, payments and arrears.</li>
<li><strong>Business data:</strong> your role in a borrowing company, shareholdings, directorships, beneficial ownership and business experience.</li>
<li><strong>Verification data:</strong> results of identity, anti-money laundering, sanctions, politically exposed person and fraud prevention checks.</li>
<li><strong>Communications data:</strong> correspondence, call notes and records of meetings [and call recordings, if applicable].</li>
<li><strong>Broker data:</strong> for introducers, firm name, FCA firm reference number, contact details and procuration fee payment details.</li>
<li><strong>Technical data:</strong> IP address, browser type and version, device information and pages visited. Optional analytics data is collected only with your consent.</li>
</ul>
<p><strong>Criminal offence data.</strong> As part of our anti-money laundering and fraud prevention checks, we may process information about criminal convictions, alleged offences or sanctions. We do so only where permitted by law, under the conditions in Schedule 1 of the Data Protection Act 2018, including preventing or detecting unlawful acts, preventing fraud and meeting regulatory requirements.</p>
<p>We do not intend to collect other special category data, such as health information. If it becomes relevant, for example where a borrower is in financial difficulty because of ill health, we will process it only where the law allows and with appropriate safeguards.</p>

<h2>4. How we collect your personal data</h2>
<ul>
<li><strong>Directly from you:</strong> when you complete an enquiry or registration form on our website, apply for a loan, provide documents, or speak or correspond with us.</li>
<li><strong>From brokers and introducers</strong> acting on your behalf.</li>
<li><strong>From third parties</strong> such as credit reference agencies, fraud prevention agencies, identity verification providers, Companies House, HM Land Registry, the electoral register and other public sources, valuers, solicitors and other lenders.</li>
<li><strong>From the borrower</strong>, where you are a director, shareholder, guarantor or beneficial owner of a borrowing company.</li>
<li><strong>Automatically</strong>, when you use our website. See section 13 and our <a href="${r("cookie-policy/")}">Cookie Policy</a>.</li>
</ul>
<p>If you give us personal data about another person, such as a fellow director or guarantor, please make sure they know you are doing so and point them to this policy.</p>

<h2>5. How we use your personal data, and our lawful bases</h2>
<p>We may only use personal data where we have a lawful basis for doing so. The table below sets out the main purposes and the lawful basis we rely on for each.</p>
<div class="legal-table-wrap"><table class="legal-table">
<thead><tr><th scope="col">Purpose</th><th scope="col">Lawful basis</th></tr></thead>
<tbody>
<tr><td>Responding to enquiries and providing indicative terms</td><td>Steps taken at your request before entering into a contract; our legitimate interests in responding to business enquiries</td></tr>
<tr><td>Assessing an application, including credit, affordability and security assessments</td><td>Contract; legitimate interests in lending responsibly and managing credit risk</td></tr>
<tr><td>Verifying identity and carrying out anti-money laundering, sanctions and fraud checks</td><td>Legal obligation, including the Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017; legitimate interests in preventing fraud and financial crime</td></tr>
<tr><td>Arranging valuations and legal work, and completing the loan</td><td>Contract; legitimate interests</td></tr>
<tr><td>Administering the loan, taking payments and managing arrears or recovery</td><td>Contract; legitimate interests in recovering money owed to us</td></tr>
<tr><td>Taking and enforcing personal guarantees and security</td><td>Contract (where you are the guarantor); legitimate interests</td></tr>
<tr><td>Registering and managing brokers and paying procuration fees</td><td>Contract; legitimate interests in working with introducers</td></tr>
<tr><td>Arranging or refinancing our own funding, including sharing loan information with funders, investors or purchasers of loans</td><td>Legitimate interests in funding our business</td></tr>
<tr><td>Meeting legal, tax, accounting and regulatory obligations, and responding to authorities</td><td>Legal obligation</td></tr>
<tr><td>Establishing, exercising or defending legal claims</td><td>Legitimate interests</td></tr>
<tr><td>Operating, securing and improving our website</td><td>Legitimate interests; consent for optional analytics cookies</td></tr>
<tr><td>Sending information about our products to brokers and business contacts [if applicable]</td><td>Legitimate interests or consent, as required by PECR. You can opt out at any time.</td></tr>
</tbody></table></div>
<p>Where we rely on legitimate interests, we have considered whether those interests are outweighed by your rights and freedoms. You can ask us for more information about this balancing test.</p>
<p>If you do not provide information we need to meet a legal obligation or to assess an application, we may be unable to provide a loan or continue a relationship with you.</p>

<h2>6. Credit reference and fraud prevention agencies</h2>
<p>[If applicable] To assess an application, verify identity and prevent fraud, we may search the files of credit reference agencies, such as [Experian / Equifax / TransUnion]. The agencies will record that a search has been made. [Confirm whether searches are soft or hard, and whether they are visible to other lenders.] The ways in which the credit reference agencies use and share personal information are explained in the Credit Reference Agency Information Notice (CRAIN), available on each agency's website.</p>
<p>[If applicable] We may also share information with fraud prevention agencies, such as [Cifas]. If fraud or money laundering is detected, you could be refused certain services, finance or employment. [Insert the fraud prevention agency's standard wording if you are a member.]</p>

<h2>7. Who we share your personal data with</h2>
<p>We share personal data only where necessary and lawful. Recipients may include:</p>
<ul>
<li>brokers and introducers involved in your application;</li>
<li>valuers and surveyors, including monitoring surveyors;</li>
<li>our solicitors and your solicitors, conveyancers and other professional advisers;</li>
<li>credit reference, fraud prevention and identity verification agencies;</li>
<li>our funders, investors, insurers and any purchaser or assignee of a loan, or anyone considering such a purchase;</li>
<li>receivers, asset managers, debt collection agents and other enforcement agents, where necessary to recover a loan;</li>
<li>IT, hosting, email, document storage, e-signature and payment service providers who process data on our behalf under contract;</li>
<li>our auditors, accountants and insurers;</li>
<li>HM Revenue &amp; Customs, the National Crime Agency, law enforcement agencies, courts, regulators and other public authorities, where required or permitted by law; and</li>
<li>a buyer or prospective buyer of our business or assets, under appropriate confidentiality terms.</li>
</ul>
<p>Service providers that act on our behalf may use your data only on our instructions and must keep it secure. We do not sell personal data.</p>

<h2>8. International transfers</h2>
<p>[We do not transfer personal data outside the UK.] / [Some of our service providers process personal data outside the UK, including in [countries]. Where this happens, we make sure the transfer is lawful. Either the country is recognised under UK law as providing adequate protection, or we use appropriate safeguards such as the UK International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual Clauses.] Contact us for more information.</p>

<h2>9. How long we keep your personal data</h2>
<p>We keep personal data only as long as necessary for the purposes described in this policy, including to meet legal, regulatory, tax and accounting requirements. As a guide:</p>
<ul>
<li><strong>Enquiries that do not proceed:</strong> [X] months from our last contact.</li>
<li><strong>Customer, guarantor and loan records:</strong> [X] years after the loan is repaid or the relationship ends.</li>
<li><strong>Anti-money laundering records:</strong> at least five years after the end of the business relationship, as required by the Money Laundering Regulations 2017.</li>
<li><strong>Broker records:</strong> [X] years after the relationship ends.</li>
<li><strong>Website analytics data:</strong> [X] months, where consented.</li>
</ul>
<p>We may keep data longer where needed for a legal claim or where the law requires. When data is no longer needed, we securely delete or anonymise it.</p>

<h2>10. Automated decision-making</h2>
<p>[We do not make decisions about you based solely on automated processing that produce legal or similarly significant effects. Every lending decision involves review by a member of our team.] [Confirm this is accurate.]</p>

<h2>11. Keeping your data secure</h2>
<p>We use appropriate technical and organisational measures to protect personal data against unauthorised access, loss, misuse or alteration. These include [access controls, encryption, secure storage and staff training]. Access is limited to people who need it to do their jobs. Where we use service providers, we require them to keep data secure. If a personal data breach is likely to result in a high risk to you, we will tell you and, where required, the ICO.</p>

<h2>12. Your rights</h2>
<p>Under UK data protection law you have the following rights, subject to certain conditions and exemptions:</p>
<ul>
<li><strong>Access:</strong> to ask for a copy of the personal data we hold about you.</li>
<li><strong>Rectification:</strong> to ask us to correct inaccurate data or complete incomplete data.</li>
<li><strong>Erasure:</strong> to ask us to delete your data in certain circumstances.</li>
<li><strong>Restriction:</strong> to ask us to limit how we use your data in certain circumstances.</li>
<li><strong>Objection:</strong> to object to our use of your data where we rely on legitimate interests, and to object at any time to direct marketing.</li>
<li><strong>Portability:</strong> to receive data you have provided to us in a structured, commonly used, machine-readable format, or to have it sent to another organisation, where processing is based on consent or contract and carried out by automated means.</li>
<li><strong>Withdraw consent:</strong> where we rely on consent, you can withdraw it at any time. This does not affect processing already carried out.</li>
<li><strong>Automated decisions:</strong> rights relating to decisions made solely by automated means.</li>
</ul>
<p>To exercise any of these rights, contact us using the details in section 1. There is usually no fee. We may need to verify your identity before responding. We will respond within one month of receiving your request. This may be extended by up to two further months for complex or numerous requests, in which case we will tell you why.</p>
<p>Some rights are limited where we must keep data to meet a legal obligation, for example under anti-money laundering law, or for a legal claim.</p>

<h2>13. Cookies and our website</h2>
<p>Our website uses strictly necessary cookies to function and to remember your cookie choices. We use optional analytics cookies only with your consent. For details, and to change your choices at any time, see our <a href="${r("cookie-policy/")}">Cookie Policy</a>.</p>
<p>Some photographs on our website are loaded from Unsplash, an image library. When they load, your browser connects to Unsplash, which receives your IP address and browser details. [Remove this sentence if the photographs are hosted on our own server.] Our website may also contain links to other websites, including the optional map on our contact page, which is provided by OpenStreetMap. We are not responsible for the privacy practices of other websites.</p>

<h2>14. Children</h2>
<p>Our services are for businesses and adults. We do not knowingly collect personal data from anyone under 18.</p>

<h2>15. How to complain</h2>
<p>If you are unhappy with how we have handled your personal data, please contact us first using the details in section 1. You can complain by any method, and you do not need to use particular wording. We will acknowledge your complaint within 30 days of receiving it, investigate it, and tell you the outcome without undue delay.</p>
<p>You also have the right to complain to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection:</p>
<ul>
<li>Website: <a href="https://ico.org.uk/make-a-complaint/" rel="noopener">ico.org.uk/make-a-complaint</a></li>
<li>Telephone: 0303 123 1113</li>
<li>Post: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</li>
</ul>
<p>We would appreciate the chance to address your concerns before you approach the ICO.</p>

<h2>16. Changes to this policy</h2>
<p>We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated shown at the top. Where changes are significant, we will take reasonable steps to let you know.</p>`;
    },
  }),
  legalPage({
    slug: "cookie-policy", title: "Cookie Policy",
    description: "Information about the cookies used on the Phoenix Capital website and how to manage your preferences.",
    body: () => `
<h2>What cookies are</h2><p>Cookies are small text files placed on your device when you visit a website. Some are essential for the site to work; others are optional and are only set with your consent.</p>
<h2>Cookies we use</h2>
<table class="criteria"><tbody>
<tr><th scope="row">pc_consent</th><td>Strictly necessary. Records your cookie preferences. Expires after 6 months.</td></tr>
<tr><th scope="row">[Analytics cookies]</th><td>[Optional. Name, provider, purpose and expiry, if analytics is added. Set only with consent.]</td></tr>
</tbody></table>
<h2>Third-party content</h2><p>The map on our contact page is provided by OpenStreetMap and is loaded only when you choose to view it.</p>
<h2>Managing your preferences</h2><p>You can change your choices at any time. <button class="link" type="button" data-consent-action="manage">Open cookie settings</button></p><p>You can also control cookies through your browser settings.</p>`,
  }),
  legalPage({
    slug: "terms-of-use", title: "Terms of Use",
    description: "The terms governing use of the Phoenix Capital website.",
    body: () => `
<h2>1. About these terms</h2><p>[Scope and acceptance of these terms. ${esc(compliance.legalLine)}]</p>
<h2>2. Information on this website</h2><p>[Information is for general guidance only and does not constitute an offer of finance. All loans are subject to status, valuation and underwriting.]</p>
<h2>3. Business purposes only</h2><p>${esc(compliance.businessPurpose)}</p>
<h2>4. Intellectual property</h2><p>[Ownership of content, design and trade marks.]</p>
<h2>5. Limitation of liability</h2><p>[To be drafted by solicitor.]</p>
<h2>6. Links to other websites</h2><p>[Standard wording.]</p>
<h2>7. Governing law</h2><p>[Laws of England and Wales; jurisdiction.]</p>`,
  }),
  legalPage({
    slug: "complaints", title: "Complaints",
    description: "How to raise a complaint with Phoenix Capital and how we will handle it.",
    body: () => `
<p>We aim to provide a high standard of service. If something has not gone as it should, we want to hear about it.</p>
<h2>How to complain</h2><p>[Contact details for complaints: named role, email, telephone and postal address.]</p>
<h2>What happens next</h2><p>[Acknowledgement timescale, investigation process and final response timescale.]</p>
<h2>If you remain dissatisfied</h2><p>[Escalation routes, if any. To be confirmed by solicitor, including whether any external dispute resolution scheme applies.]</p>`,
  }),
  legalPage({
    slug: "important-information", title: "Important Information",
    description: "Important information about Phoenix Capital, the regulatory status of our loans and the risks of secured borrowing.",
    body: () => `
<h2>Business purpose lending</h2><p>${esc(compliance.businessPurpose)}</p>
<h2>Risk warning</h2><p>${esc(compliance.risk)}</p>
<h2>Company information</h2><p>${esc(compliance.legalLine)}</p><p>${esc(site.amlLine)}</p><p>${esc(site.icoLine)}</p>
<h2>Further information</h2><p>[Any additional disclosures required, to be confirmed by solicitor.]</p>`,
  }),
];

/* ==================================================================== 404 */
const notFound = {
  path: "404.html",
  file: "404.html",
  noindex: true,
  title: "Page not found | Phoenix Capital",
  description: "The page you are looking for could not be found.",
  body: (r) => `
${pageHero(r, { eyebrow: "404", title: "This page could not <em>be found.</em>", lead: "It may have moved, or the address may be incorrect.",
  children: `<div class="btn-row mt-l"><a class="btn" href="${r("")}">Return home</a><a class="link" href="${r("lending/")}">View lending ${arrow}</a></div>` })}`,
};

export const pages = [home, lending, ...products.map(productPage), brokers, about, insights, ...articles.map(articlePage), contact, ...legal, notFound];
