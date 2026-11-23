// ============================================================================
// Phoenix Capital — site content & settings
// Edit this file to change placeholders, products, articles and contacts,
// then run `node build.mjs` to regenerate the site in /dist.
// Anything in [square brackets] is a placeholder to be confirmed before launch.
// ============================================================================

export const site = {
  name: "Phoenix Capital",
  domain: "https://phoenix-capital.uk",
  legalEntity: "Phoenix Accountancy Service Ltd",
  companyNumber: "08778431",
  registeredOffice: { street: "21 Heath Drive", locality: "Romford", region: "Essex", postcode: "RM2 5QH", country: "GB" },
  // Logo supplied by Phoenix Capital (vector, converted from the original PDF without changes).
  logo: { src: "assets/img/brand/phoenix-capital-logo.svg", width: 631, height: 218 },
  phone: "[020 XXXX XXXX]",
  phoneHref: "", // e.g. "+442000000000" — leave empty while the number is a placeholder
  email: "enquiries@phoenix-capital.uk", // confirm mailbox exists
  brokerEmail: "brokers@phoenix-capital.uk", // confirm mailbox exists
  hours: "[Monday to Friday, 9.00am to 5.30pm]",
  responseTime: "[X] business hours",
  amlLine: "[Registered with the FCA for anti-money laundering purposes only, FRN XXXXXX]",
  icoLine: "ICO registration: [number]",
  // Form endpoints. Leave as "#" for demo mode (shows the success message without sending).
  // Point these at your form handler (e.g. Formspree, Basin, your CRM webhook or a serverless function).
  enquiryEndpoint: "#",
  brokerEndpoint: "#",
  mapEmbedSrc: "https://www.openstreetmap.org/export/embed.html?bbox=0.1940%2C51.5780%2C0.2140%2C51.5900&layer=mapnik",
  mapLink: "https://www.openstreetmap.org/search?query=RM2%205QH",
};

// Headline lending terms — PLACEHOLDERS. Shown in the home page strip and lending overview.
export const keyTerms = [
  { label: "Loan size", value: "£[X] – £[Y]" },
  { label: "Loan to value", value: "Up to <b>[X]%</b>" },
  { label: "Terms", value: "[X] – [Y] months" },
  { label: "Decision in", value: "<b>[X]</b> hours" },
];

export const compliance = {
  businessPurpose:
    "Phoenix Capital provides loans for business and investment purposes only. Our loans are not regulated by the Financial Conduct Authority. We do not lend on properties that are, or will be, occupied by the borrower or a member of their family.",
  consent:
    "I confirm this loan is for business or investment purposes and the property will not be occupied by me or a member of my family.",
  risk:
    "All loans are subject to status, valuation and underwriting. Your property may be repossessed if you do not keep up repayments on a loan secured on it.",
  legalLine:
    "Phoenix Capital is a trading name of Phoenix Accountancy Service Ltd. Registered in England and Wales, company number 08778431. Registered office: 21 Heath Drive, Romford, Essex, RM2 5QH.",
};

// ---------------------------------------------------------------------------
// Lending products. Add, remove or reorder freely; pages and menus follow.
// ---------------------------------------------------------------------------
const commonCriteria = (overrides = {}) => ({
  "Loan size": "£[X] – £[Y]",
  "Maximum loan to value": "Up to [X]% of open market value",
  "Term": "[X] – [Y] months",
  "Interest": "From [X]% per month; retained, rolled up or serviced",
  "Arrangement fee": "[X]% of the gross loan",
  "Exit fee": "[None / X%]",
  "Charge": "[First charge; second charge considered]",
  "Borrowers": "[Individuals, limited companies, LLPs and SPVs, UK and overseas]",
  "Geography": "[England and Wales]",
  "Valuation": "RICS valuation from our approved panel",
  ...overrides,
});

export const products = [
  {
    slug: "bridging-finance",
    image2: "period-door",
    name: "Bridging Finance",
    icon: "bridging",
    short: "Short-term loans secured on property, to bridge a purchase, a refinance or a timing gap.",
    seoTitle: "Bridging Finance UK | Unregulated Bridging Loans | Phoenix Capital",
    seoDesc: "Short-term, business-purpose bridging finance from a direct UK lender. Unregulated bridging loans for investors, landlords and companies, with clear terms and quick decisions.",
    lead: "Short-term capital secured on property, arranged quickly and repaid from a clear exit.",
    image: "townhouse-terrace",
    strip: [
      { label: "Loan size", value: "£[X] – £[Y]" },
      { label: "Loan to value", value: "Up to <b>[X]%</b>" },
      { label: "Term", value: "[X] – [Y] months" },
      { label: "Rates from", value: "<b>[X]%</b> pm" },
    ],
    what: [
      "A bridging loan provides funds against property for a short period, typically while a longer-term arrangement is put in place or an asset is sold.",
      "We lend on residential investment, commercial and mixed-use property, and on land in some cases. Each loan is assessed on the strength of the security and a realistic route to repayment.",
    ],
    uses: [
      "Purchasing an investment property before a sale or refinance completes",
      "Securing a below-market or time-sensitive opportunity",
      "Refinancing an existing short-term loan approaching maturity",
      "Raising capital against an unencumbered asset for a business purpose",
      "Breaking a chain on an investment purchase",
    ],
    criteria: commonCriteria(),
    faqs: [
      ["How quickly can a bridging loan complete?", "Timescales depend mainly on the valuation and the legal work. We aim to issue terms within [X] hours of a complete enquiry and work alongside your solicitors and valuer to keep matters moving."],
      ["What exit strategies do you accept?", "Most commonly a sale of the property or a refinance onto a longer-term facility. We will want to understand the exit at the outset, together with any evidence that supports it."],
      ["Can interest be rolled up?", "Yes. Interest can be retained from the advance, rolled up and repaid at redemption, or serviced monthly, depending on the case."],
      ["Do you lend on properties I will live in?", "No. We lend for business and investment purposes only, and do not lend on property that is, or will be, occupied by the borrower or a member of their family."],
    ],
  },
  {
    slug: "refurbishment-finance",
    image2: "townhouse-terrace",
    name: "Refurbishment Finance",
    icon: "refurbishment",
    short: "Funding for light and heavy works, with staged drawdowns released as the project progresses.",
    seoTitle: "Refurbishment Finance | Light & Heavy Refurb Loans | Phoenix Capital",
    seoDesc: "Refurbishment finance for property investors and developers. Light and heavy refurbishment loans with staged drawdowns from a direct, decision-making lender.",
    lead: "Capital for the purchase and the works, structured around a schedule you can deliver.",
    image: "townhouse-refurbishment",
    strip: [
      { label: "Loan size", value: "£[X] – £[Y]" },
      { label: "Day-one LTV", value: "Up to <b>[X]%</b>" },
      { label: "Works funded", value: "Up to <b>[X]%</b>" },
      { label: "Term", value: "[X] – [Y] months" },
    ],
    what: [
      "Refurbishment finance funds the acquisition or refinance of a property together with the cost of improving it. The loan is assessed against both the current value and the value once works are complete.",
      "We consider cosmetic projects as well as structural works, conversions and changes of use. Works funding is released in stages, verified by a monitoring surveyor where appropriate.",
    ],
    uses: [
      "Modernising a dated or uninhabitable property for letting or sale",
      "Converting a house into flats or a house in multiple occupation",
      "Change of use, for example from commercial to residential",
      "Extending or reconfiguring a property to add value",
    ],
    criteria: commonCriteria({
      "Maximum loan to value": "Up to [X]% of current value; up to [X]% of gross development value",
      "Works funding": "Up to [X]% of costs, released in arrears in stages",
      "Monitoring": "[Independent monitoring surveyor on heavier schemes]",
    }),
    faqs: [
      ["What is the difference between light and heavy refurbishment?", "Light refurbishment usually means cosmetic work that does not require planning permission or structural alteration. Heavy refurbishment involves structural change, planning consent or building regulations sign-off. We fund both."],
      ["How are works funds released?", "In stages against an agreed schedule of works. Each drawdown follows an inspection confirming progress."],
      ["Do I need prior experience?", "Experience helps, particularly on heavier schemes, but it is not a fixed requirement. We look at the project, the team you have in place and the exit."],
    ],
  },
  {
    slug: "development-finance",
    image2: "canary-wharf",
    name: "Development Finance",
    icon: "development",
    short: "Ground-up and conversion finance for residential and mixed-use schemes, drawn as you build.",
    seoTitle: "Development Finance Lender UK | Property Development Loans | Phoenix Capital",
    seoDesc: "Development finance for ground-up builds and conversions. A UK development finance lender offering staged funding, experienced underwriting and clear terms.",
    lead: "Staged funding for ground-up schemes and conversions, from site purchase to practical completion.",
    image: "development-golden-hour",
    strip: [
      { label: "Facility size", value: "£[X] – £[Y]" },
      { label: "Loan to GDV", value: "Up to <b>[X]%</b>" },
      { label: "Loan to cost", value: "Up to <b>[X]%</b>" },
      { label: "Term", value: "[X] – [Y] months" },
    ],
    what: [
      "Development finance provides funds for land acquisition and construction, drawn in stages as the build progresses. Facilities are sized against the gross development value and total costs of the scheme.",
      "We work with developers on residential, mixed-use and conversion schemes, and take a practical view of programme, contingency and the route to exit through sales or refinance.",
    ],
    uses: [
      "Ground-up residential schemes, from a single house to small blocks",
      "Conversions of commercial buildings to residential use",
      "Mixed-use schemes with commercial space at ground floor",
      "Completing a stalled scheme or refinancing another lender",
    ],
    criteria: commonCriteria({
      "Loan size": "£[X] – £[Y] facility",
      "Maximum loan to value": "Up to [X]% of gross development value; up to [X]% of total costs",
      "Planning": "Full planning consent or permitted development in place",
      "Monitoring": "Independent monitoring surveyor throughout",
    }),
    faqs: [
      ["What information do you need to assess a scheme?", "A development appraisal, planning documents, a cost plan, the build programme and details of the professional team. A summary of your track record is also helpful."],
      ["Do you fund land without planning?", "Our development facilities require planning consent. We may consider a bridging loan to acquire a site while planning is pursued, on its merits."],
      ["How is interest handled during the build?", "Interest is normally rolled up or retained so that the project is not burdened with monthly payments during construction."],
    ],
  },
  {
    slug: "auction-finance",
    image2: "townhouse-terrace",
    name: "Auction Finance",
    icon: "auction",
    short: "Finance arranged to meet auction completion deadlines, with terms agreed before the hammer falls.",
    seoTitle: "Auction Finance | Fast Property Auction Bridging Loans | Phoenix Capital",
    seoDesc: "Auction finance for property investors who need certainty before bidding. Short-term, business-purpose loans arranged to meet auction completion deadlines.",
    lead: "Certainty before you bid, and funds in place to complete within the auction timetable.",
    image: "period-door",
    strip: [
      { label: "Loan size", value: "£[X] – £[Y]" },
      { label: "Loan to value", value: "Up to <b>[X]%</b>" },
      { label: "Term", value: "[X] – [Y] months" },
      { label: "Decision in", value: "<b>[X]</b> hours" },
    ],
    what: [
      "Auction purchases usually require completion within a fixed period after exchange, commonly 28 days at a traditional auction. Auction finance is a bridging loan arranged with that timetable in mind.",
      "The most effective approach is to speak to us before the auction. We can review the legal pack, agree indicative terms and arrange a valuation so that funds are ready when you need them.",
    ],
    uses: [
      "Purchasing a lot at a traditional or modern method auction",
      "Acquiring properties unsuitable for conventional lending at the time of purchase",
      "Funding a purchase that will be refurbished and refinanced",
    ],
    criteria: commonCriteria({ "Pre-auction review": "Legal pack review and indicative terms before bidding" }),
    faqs: [
      ["When should I contact you?", "Ideally once you have identified a lot and before the auction day. Early contact gives time to review the legal pack and instruct a valuation."],
      ["Can you help after I have already bought?", "Yes, provided there is enough time remaining before completion. Contact us as soon as possible after exchange."],
      ["Will you lend on properties that need work?", "Often, yes. Many auction lots need refurbishment; we look at the property's value as it stands and the plan for it."],
    ],
  },
  {
    slug: "commercial-bridging",
    image2: "office-day",
    name: "Commercial Bridging",
    icon: "commercial",
    short: "Short-term loans against offices, retail, industrial and mixed-use property.",
    seoTitle: "Commercial Bridging Loans | Semi-Commercial Bridging | Phoenix Capital",
    seoDesc: "Commercial bridging loans against offices, retail, industrial and mixed-use property. Business-purpose finance from a direct UK lender with experienced underwriting.",
    lead: "Short-term finance secured on commercial and semi-commercial property, assessed on its merits.",
    image: "commercial-glass",
    strip: [
      { label: "Loan size", value: "£[X] – £[Y]" },
      { label: "Loan to value", value: "Up to <b>[X]%</b>" },
      { label: "Term", value: "[X] – [Y] months" },
      { label: "Rates from", value: "<b>[X]%</b> pm" },
    ],
    what: [
      "Commercial bridging provides short-term funding against property used for business, including offices, shops, industrial units and buildings with a mix of commercial and residential space.",
      "We consider vacant and income-producing assets, and we take time to understand the tenancy position, the condition of the building and the strategy for the property.",
    ],
    uses: [
      "Acquiring a commercial property ahead of a longer-term facility",
      "Re-letting or repositioning a vacant or under-let asset",
      "Refinancing to release capital for a business purpose",
      "Purchasing a mixed-use building with flats above a shop or office",
    ],
    criteria: commonCriteria({ "Security": "[Offices, retail, industrial, leisure and mixed-use]" }),
    faqs: [
      ["Do you lend on vacant commercial property?", "Yes, subject to the property, its location and a credible plan to let, sell or refinance."],
      ["Is a semi-commercial property treated as commercial?", "We assess mixed-use buildings as a whole, taking account of both the commercial and residential elements."],
      ["What exit routes are typical?", "A sale, or a refinance onto a commercial mortgage once the property is let or stabilised."],
    ],
  },
  {
    slug: "business-loans",
    image2: "commercial-glass",
    name: "Business Loans",
    icon: "business",
    short: "Secured funding for working capital, acquisitions and growth, backed by property.",
    seoTitle: "Secured Business Loans | Property-Backed Business Finance | Phoenix Capital",
    seoDesc: "Secured business loans for UK companies and SMEs. Short-term, property-backed finance for working capital, acquisitions, tax liabilities and growth.",
    lead: "Property-backed capital for businesses, arranged with the speed that commercial decisions require.",
    image: "office-day",
    strip: [
      { label: "Loan size", value: "£[X] – £[Y]" },
      { label: "Loan to value", value: "Up to <b>[X]%</b>" },
      { label: "Term", value: "[X] – [Y] months" },
      { label: "Decision in", value: "<b>[X]</b> hours" },
    ],
    what: [
      "Our business loans are short-term facilities secured against property, used to fund a genuine business need. Security can be commercial or residential investment property owned by the business or its directors.",
      "Because the loan is secured, we can often move faster and look at a wider range of situations than unsecured lenders, including businesses going through change.",
    ],
    uses: [
      "Working capital and cash flow during a period of growth",
      "Acquiring a business, a competitor or a key asset",
      "Settling a tax liability or a time-critical commitment",
      "Funding a management buy-out or a shareholder exit",
    ],
    criteria: commonCriteria({ "Purpose": "Any legitimate business purpose", "Security": "[Commercial or residential investment property]" }),
    faqs: [
      ["Can I use my home as security?", "We do not lend on property that is, or will be, occupied by the borrower or a member of their family. Security must be investment or commercial property."],
      ["What will you need to see?", "Details of the business and the purpose of the loan, information about the security property and how the loan will be repaid."],
      ["Can the business be loss-making?", "Each case is considered individually. We focus on the security and the strength of the repayment plan."],
    ],
  },
];

// ---------------------------------------------------------------------------
// Placeholder transactions — replace only with genuine, consented deals.
// ---------------------------------------------------------------------------
export const cases = [
  { product: "Bridging Finance", location: "[Town], [County]", title: "[Transaction headline]", loan: "£[X]", ltv: "[X]%", term: "[X] months", purpose: "[Purpose]", image: "townhouse-terrace" },
  { product: "Refurbishment Finance", location: "[Town], [County]", title: "[Transaction headline]", loan: "£[X]", ltv: "[X]%", term: "[X] months", purpose: "[Purpose]", image: "townhouse-refurbishment" },
  { product: "Development Finance", location: "[Town], [County]", title: "[Transaction headline]", loan: "£[X]", ltv: "[X]%", term: "[X] months", purpose: "[Purpose]", image: "development-golden-hour" },
];

export const testimonials = [
  { quote: "[Genuine client testimonial to be inserted. Use only real, attributable quotes published with written permission.]", by: "[Name], [Role], [Company]" },
  { quote: "[Genuine broker testimonial to be inserted. Use only real, attributable quotes published with written permission.]", by: "[Name], [Role], [Firm]" },
  { quote: "[Genuine client testimonial to be inserted. Use only real, attributable quotes published with written permission.]", by: "[Name], [Role], [Company]" },
];

export const team = [
  { name: "[Name]", role: "[Managing Director]" },
  { name: "[Name]", role: "[Head of Lending]" },
  { name: "[Name]", role: "[Credit Director]" },
  { name: "[Name]", role: "[Senior Underwriter]" },
  { name: "[Name]", role: "[Business Development Director]" },
  { name: "[Name]", role: "[Operations Manager]" },
];

export const brokerContacts = [
  { name: "[Name]", role: "[Business Development Director]", phone: "[07XXX XXXXXX]", email: "[name]@phoenix-capital.uk" },
  { name: "[Name]", role: "[Head of Lending]", phone: "[07XXX XXXXXX]", email: "[name]@phoenix-capital.uk" },
];

// ---------------------------------------------------------------------------
// Insights. Body is simple HTML. Dates are ISO (YYYY-MM-DD).
// ---------------------------------------------------------------------------
export const insightCategories = ["Bridging", "Development", "Auction", "Broker guides"];

export const articles = [
  {
    slug: "the-exit-comes-first",
    title: "The exit comes first: how we assess a bridging loan",
    category: "Bridging",
    date: "2026-11-10",
    read: 4,
    image: "townhouse-terrace",
    excerpt: "Every short-term loan is defined by how it ends. Why the exit sits at the centre of our underwriting, and how to present it well.",
    body: `
<p>A bridging loan is, by design, temporary. It exists to carry a borrower from one position to another: from purchase to sale, from acquisition to refinance, from opportunity to stability. For that reason the first question we ask is not how much is needed, but how the loan will be repaid.</p>
<h2>What a credible exit looks like</h2>
<p>The two most common exits are a sale of the property and a refinance onto a longer-term facility. Both can be entirely sound. What distinguishes a strong proposal is evidence that the exit is realistic within the term requested.</p>
<ul>
<li>For a sale, comparable evidence that supports the expected price, and a sensible view on how long a sale might take.</li>
<li>For a refinance, an understanding of the criteria the refinancing lender is likely to apply, including rental cover where relevant.</li>
<li>For a project, a programme that allows for the time works genuinely take, with some margin.</li>
</ul>
<h2>Building in time</h2>
<p>Most difficulties in short-term lending arise not from a failed plan but from a delayed one. Planning decisions, contractor availability and conveyancing timescales all vary. We would rather agree a term with headroom at the outset than see a borrower under pressure as the loan approaches maturity.</p>
<h2>Why it matters to you</h2>
<p>A clearly evidenced exit allows us to decide quickly and with confidence. It also protects the borrower: a loan sized and termed around a realistic plan is a loan that is far more likely to end well.</p>
<blockquote>The question is not only whether a deal works on day one, but whether it still works on the last day of the term.</blockquote>
<p>If you are considering a bridging loan, we are happy to discuss the exit early, before an application is made.</p>`,
  },
  {
    slug: "light-or-heavy-refurbishment",
    title: "Light or heavy: understanding refurbishment finance",
    category: "Bridging",
    date: "2026-10-27",
    read: 4,
    image: "townhouse-refurbishment",
    excerpt: "The distinction between light and heavy works shapes how a refurbishment loan is structured. A plain guide to the difference.",
    body: `
<p>Refurbishment finance funds the purchase or refinance of a property together with the cost of improving it. How the facility is structured depends largely on the nature of the works.</p>
<h2>Light refurbishment</h2>
<p>Light works are generally cosmetic: new kitchens and bathrooms, redecoration, flooring, and replacement windows. They typically do not require planning permission or structural alteration, and can often be completed within a few months.</p>
<h2>Heavy refurbishment</h2>
<p>Heavy works involve structural change, extensions, reconfiguration, conversions or a change of use. They may require planning consent and building regulations approval, and they carry more programme risk. Funding is usually released in stages, after inspection.</p>
<h2>What we look at</h2>
<ul>
<li>A schedule of works with realistic costs and a contingency.</li>
<li>The team delivering the project, and their relevant experience.</li>
<li>The expected value on completion, supported by comparable evidence.</li>
<li>The exit: sale, or a refinance onto a term facility.</li>
</ul>
<p>Whether a scheme is light or heavy, a clear plan shortens the path to a decision.</p>`,
  },
  {
    slug: "preparing-a-development-appraisal",
    title: "Funding a development: preparing a credible appraisal",
    category: "Development",
    date: "2026-10-08",
    read: 5,
    image: "development-golden-hour",
    excerpt: "A considered appraisal is the foundation of any development facility. What we expect to see, and the assumptions we test.",
    body: `
<p>A development appraisal is the single most important document in a funding request. It sets out what the scheme will cost, what it will be worth and how much margin there is between the two.</p>
<h2>The core elements</h2>
<ul>
<li><strong>Gross development value.</strong> The expected value of the completed scheme, supported by comparable sales or a valuer's opinion.</li>
<li><strong>Land and acquisition costs.</strong> Including stamp duty, legal and agency fees.</li>
<li><strong>Build costs.</strong> Ideally from a quantity surveyor or a priced tender, with a contingency.</li>
<li><strong>Professional fees and finance costs.</strong> Often underestimated in early drafts.</li>
<li><strong>Programme.</strong> Construction time plus a realistic sales or refinance period.</li>
</ul>
<h2>The assumptions we test</h2>
<p>We look carefully at values, costs and time. Small changes in any of the three can have a significant effect on profit. A scheme that remains viable under modest stress is one we can support with confidence.</p>
<h2>Presenting the team</h2>
<p>Alongside the numbers, we want to understand who is delivering the project: the developer's track record, the contractor and the professional team. Experience is valuable, but so is a well-chosen team around a less experienced developer.</p>
<p>We welcome early conversations on schemes at the appraisal stage.</p>`,
  },
  {
    slug: "auction-finance-timetable",
    title: "Buying at auction: a timetable for finance",
    category: "Auction",
    date: "2026-09-22",
    read: 3,
    image: "period-door",
    excerpt: "Auction purchases run to a fixed clock. A practical sequence for arranging finance before and after the hammer falls.",
    body: `
<p>At a traditional property auction, the fall of the hammer creates a binding contract. Completion usually follows within a fixed period, commonly 28 days. Finance needs to be ready within that window.</p>
<h2>Before the auction</h2>
<ul>
<li>Speak to your lender once you have shortlisted a lot.</li>
<li>Share the legal pack so that title and special conditions can be reviewed.</li>
<li>Agree indicative terms and, where possible, instruct a valuation.</li>
<li>Have your solicitor review the pack and be ready to act.</li>
</ul>
<h2>After the auction</h2>
<p>Confirm the purchase with your lender straight away. With the groundwork done, the remaining steps are largely legal, and the time to completion can be used productively rather than anxiously.</p>
<h2>Modern method auctions</h2>
<p>Some auctions operate on a reservation basis with a longer period to exchange and complete. The same principle applies: arrange finance early, and read the terms of sale carefully.</p>`,
  },
  {
    slug: "packaging-a-case",
    title: "Packaging a case: what helps us decide quickly",
    category: "Broker guides",
    date: "2026-09-04",
    read: 3,
    image: "office-day",
    excerpt: "For introducers: the information that allows us to issue terms promptly, and the questions we are most likely to ask.",
    body: `
<p>We aim to give brokers a clear answer early. The fastest decisions come from enquiries that set out the essentials in one place.</p>
<h2>The essentials</h2>
<ul>
<li>The borrower: individual or company, experience and any adverse history.</li>
<li>The security: address, type, tenure, condition and estimated value.</li>
<li>The loan: amount, term and purpose.</li>
<li>The exit: how and when the loan will be repaid, with supporting evidence.</li>
</ul>
<h2>Questions we often ask</h2>
<p>Where is the deposit or contribution coming from? Is there existing borrowing on the property? Are there works planned, and who will carry them out? Answering these at the outset saves a round of correspondence.</p>
<h2>Working together</h2>
<p>Every case has a named contact at Phoenix Capital, and we keep introducers informed at each stage. Your client relationship is respected throughout.</p>`,
  },
];

// ---------------------------------------------------------------------------
// Stock photography — free to use under the Unsplash License (no Unsplash+ images).
// Photos load from Unsplash's image CDN. To self-host them instead (recommended
// for production), run `python3 tools/fetch_photos.py` and rebuild: any photo
// found in assets/img/photo/stock/ is then served from your own server.
// If a remote photo cannot load, the original placeholder is shown instead.
// ---------------------------------------------------------------------------
export const photos = {
  "hero-city-day": { id: "photo-1514557718210-26e452f8fab0", page: "https://unsplash.com/photos/shard-and-30-st-mary-axe-ON6Xw8XEUQ8", alt: "The Shard and 30 St Mary Axe on the London skyline" },
  "canary-wharf": { id: "photo-1626289296186-bb511ef4285b", page: "https://unsplash.com/photos/O-J600qm45U", alt: "Canary Wharf across the water in daylight" },
  "townhouse-terrace": { id: "photo-1787047049857-1ed45e801f71", page: "https://unsplash.com/photos/white-victorian-townhouses-with-iron-balconies-FQtg6OeYa4o", alt: "A row of white Victorian townhouses with black iron balconies" },
  "townhouse-refurbishment": { id: "photo-1635961134620-5da36ab4ad72", page: "https://unsplash.com/photos/a-red-building-with-scaffolding-around-it-hJ1G1KJpe0w", alt: "A brick building wrapped in scaffolding during refurbishment" },
  "development-golden-hour": { id: "photo-1535732759880-bbd5c7265e3f", page: "https://unsplash.com/photos/low-angle-photography-of-gray-tower-crane-ESZRBtkQ_f8", alt: "A tower crane over a building site at golden hour" },
  "period-door": { id: "photo-1732721176814-c0bc82db3971", page: "https://unsplash.com/photos/a-red-brick-house-with-white-windows-and-a-black-door-Hw67HuisCtU", alt: "A red brick period house with white windows and a black front door" },
  "commercial-glass": { id: "photo-1576731753569-3e93a228048c", page: "https://unsplash.com/photos/modern-glass-office-building-corner-nBRHY7YZ3M0", alt: "The corner of a modern glass office building against a blue sky" },
  "office-day": { id: "photo-1523477593243-78bbf626fd3b", page: "https://unsplash.com/photos/architectural-photography-of-glass-building-T0iFfJw-rB0", alt: "A glazed office facade in daylight" },
};
