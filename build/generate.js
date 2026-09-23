/* =========================================================================
   BOKSWA — static page generator.
   Emits plain static HTML into ../site/. Run:  node build/generate.js
   index.html is hand-authored and is NOT touched by this script.
   ========================================================================= */
const fs = require("fs");
const path = require("path");
const { NAV, PRODUCTS } = require("./data.js");

const OUT = path.join(__dirname, "..", "site");
const TEL = "+256758381708", TEL_DISPLAY = "0758 381708";
const TEL2 = "+256393002926", TEL2_DISPLAY = "039 3002926";
const WA = "256758381708";
const EMAIL = "info@bokswa.co.ug";
const MAP = "https://www.google.com/maps/dir/?api=1&amp;destination=0.404263,32.700383";   // directions to the yard's exact pin

/* ---------- helpers ---------------------------------------------------- */
/* Any phone number or email written in copy becomes a one-tap link. */
const linkify = (s) => s
  .replace(/0758 381708/g, () => `<a class="bk-inline-link" href="tel:${TEL}">0758 381708</a>`)
  .replace(/039 3002926/g, () => `<a class="bk-inline-link" href="tel:${TEL2}">039 3002926</a>`)
  .replace(/info@bokswa\.co\.ug/g, () => `<a class="bk-inline-link" href="mailto:${EMAIL}">info@bokswa.co.ug</a>`);

/* `max` is the largest derivative that actually exists on disk for this image.
   Client-supplied photos often arrive too small to justify a 1200 or 1800 file,
   and advertising a width we never wrote makes the browser fetch a 404. */
const img = (p, alt, { sizes = "100vw", lazy = true, cls = "", max = 1800 } = {}) => {
  const widths = [800, 1200, 1800].filter(w => w <= max);
  const fallback = widths.includes(1200) ? 1200 : widths[widths.length - 1];
  return `<img${cls ? ` class="${cls}"` : ""} src="assets/img/${p}-${fallback}.jpg" ` +
    `srcset="${widths.map(w => `assets/img/${p}-${w}.jpg ${w}w`).join(", ")}" ` +
    `sizes="${sizes}" alt="${alt}"${lazy ? ' loading="lazy"' : ""}>`;
};

/* Dimensions we cast, printed under the product description. Renders nothing
   until real figures reach data.js — we do not publish a size we cannot stand behind. */
const dimsBlock = (p) => !p.dims || !p.dims.length ? "" : `        <p class="bk-eyebrow bk-reveal" data-d="4" style="margin-top:38px">Dimensions</p>
        <ul class="bk-dims bk-reveal" data-d="4">
${p.dims.map(([name, size]) => `          <li><b>${name}</b><span>${size}</span></li>`).join("\n")}
        </ul>${p.dimsNote ? `
        <p class="bk-body bk-reveal" data-d="4" style="font-size:var(--bk-t-caption);margin-top:14px">${linkify(p.dimsNote)}</p>` : ""}`;

/* The same sizes as one compact line, for cards and explorer panels. */
const dimsLine = (p) => !p.dims || !p.dims.length ? "" :
  `<p class="bk-dimline"><b>Sizes</b> <span>${p.dims.map(([, size]) => size).join(" &nbsp;/&nbsp; ")}</span></p>`;

const head = (o) => `<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className=document.documentElement.className.replace("no-js","js");</script>
<title>${o.title}</title>
<meta name="description" content="${o.meta}">
<link rel="canonical" href="https://bokswa.co.ug/${o.file}">
<meta property="og:type" content="website">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.meta}">
<meta property="og:image" content="assets/img/${o.ogImage || "texture/hero-poster"}-1200.jpg">
<meta name="theme-color" content="#0E100F">
<link rel="icon" href="assets/img/brand/favicon-64.png" type="image/png">
<link rel="apple-touch-icon" href="assets/img/brand/apple-touch-icon.png">
<link rel="stylesheet" href="assets/vendor/fontawesome/css/all.min.css">
<link rel="stylesheet" href="assets/css/bokswa.css">
${o.jsonld ? `<script type="application/ld+json">${JSON.stringify(o.jsonld, null, 2)}</script>` : ""}
</head>
<body>
<a class="bk-skip" href="#main">Skip to content</a>`;

const header = (active) => `
<header class="bk-header">
  <div class="bk-header__in">
    <a class="bk-logo" href="index.html" aria-label="BOKSWA Investments (U) Limited — home">
      <img src="assets/img/brand/bokswa-logo-light.png" alt="BOKSWA Investments (U) Limited logo" width="1200" height="364">
    </a>
    <nav class="bk-nav" aria-label="Main">
${NAV.map(([h, l]) => `      <a href="${h}"${h === active ? ' aria-current="page"' : ""}>${l}</a>`).join("\n")}
    </nav>
    <div class="bk-header__cta">
      <a class="bk-btn bk-btn--primary" href="contact.html#quote">Get a Quote <span class="bk-btn__ar">&rarr;</span></a>
      <button class="bk-burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobnav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="bk-mobnav" id="mobnav">
  <ul class="bk-mobnav__list">
${NAV.map(([h, l], i) => `    <li><a href="${h}">${l}</a></li>`).join("\n")}
  </ul>
  <div class="bk-mobnav__foot">
    <a class="bk-btn bk-btn--primary" href="contact.html#quote">Request a Quote</a>
    <a class="bk-btn bk-btn--wa" href="https://wa.me/${WA}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp Us</a>
    <a class="bk-btn bk-btn--ghost" href="tel:${TEL}"><i class="fas fa-phone-alt"></i> ${TEL_DISPLAY}</a>
  </div>
</div>

<aside class="bk-rail" aria-label="Quick contact">
  <a href="tel:${TEL}" data-rail="call" data-label="${TEL_DISPLAY}" aria-label="Call BOKSWA"><i class="fas fa-phone-alt"></i></a>
  <a href="https://wa.me/${WA}" target="_blank" rel="noopener" data-rail="whatsapp" data-label="WhatsApp" aria-label="Message BOKSWA on WhatsApp"><i class="fab fa-whatsapp"></i></a>
  <a href="contact.html#quote" data-rail="quote" data-label="Request a quote" aria-label="Request a quote"><i class="fas fa-file-invoice"></i></a>
</aside>
<nav class="bk-mobar" aria-label="Quick contact">
  <a href="tel:${TEL}" data-rail="call"><i class="fas fa-phone-alt"></i> Call</a>
  <a href="https://wa.me/${WA}" target="_blank" rel="noopener" data-rail="whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
  <a href="contact.html#quote" data-rail="quote"><i class="fas fa-file-invoice"></i> Quote</a>
</nav>

<main id="main">`;

const phero = (o) => `
<section class="bk-phero" id="top">
  <div class="bk-phero__media">
    ${img(o.image, o.imageAlt, { sizes: "100vw", lazy: false, max: o.imageMax || 1800 })}
  </div>
  <div class="bk-phero__in">
    <div class="bk-wrap bk-wrap--wide">
      <nav class="bk-crumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><i class="fas fa-chevron-right"></i>
        ${o.crumbMid ? `<a href="${o.crumbMid[1]}">${o.crumbMid[0]}</a><i class="fas fa-chevron-right"></i>` : ""}
        <span>${o.crumb}</span>
      </nav>
      <p class="bk-eyebrow">${o.eyebrow}</p>
      <h1 class="bk-h1" style="font-size:var(--bk-t-heading-lg)">${o.h1}</h1>
      ${o.lede ? `<p class="bk-lede">${o.lede}</p>` : ""}
    </div>
  </div>
</section>`;

const ctaBand = () => `
<section class="bk-cta" id="cta">
  <div class="bk-cta__bg"><img src="assets/img/texture/aggregate-macro-1800.jpg" alt="" aria-hidden="true" loading="lazy"></div>
  <div class="bk-wrap">
    <div class="bk-row bk-row--mid">
      <div class="bk-col bk-col--62 bk-col--pr">
        <h2 class="bk-h2 bk-reveal">Tell us what you<br>are building.</h2>
        <p class="bk-lede bk-cta__lede bk-reveal" data-d="1">Send the product, the quantity and where it is going. You will get a price and a delivery answer &mdash; not a brochure.</p>
      </div>
      <div class="bk-col bk-col--38">
        <div class="bk-btns bk-reveal" data-d="2" style="margin-top:0">
          <a class="bk-btn bk-btn--dark" style="background:var(--bk-white)" href="contact.html#quote">Request a quote <span class="bk-btn__ar">&rarr;</span></a>
          <a class="bk-btn bk-btn--wa" href="https://wa.me/${WA}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

const footer = () => `
</main>

<footer class="bk-footer">
  <div class="bk-wrap">
    <div class="bk-row">
      <div class="bk-col bk-col--38 bk-col--pr">
        <div class="bk-footer__logo">
          <img src="assets/img/brand/bokswa-logo-light.png" alt="BOKSWA Investments (U) Limited" width="1200" height="364">
        </div>
        <p style="max-width:38ch;opacity:.72;font-size: var(--bk-t-body-sm)">Ugandan manufacturer of high-durability concrete components. Strong materials for strong structures.</p>
        <div class="bk-footer__social">
          <a href="https://facebook.com/bokswainvestment" target="_blank" rel="noopener" data-social="facebook" aria-label="BOKSWA on Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://instagram.com/bokswainvestment" target="_blank" rel="noopener" data-social="instagram" aria-label="BOKSWA on Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.tiktok.com/@bokswa_investiments_ltd" target="_blank" rel="noopener" data-social="tiktok" aria-label="BOKSWA on TikTok"><i class="fab fa-tiktok"></i></a>
          <a href="https://wa.me/${WA}" target="_blank" rel="noopener" data-social="whatsapp" aria-label="BOKSWA on WhatsApp"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>
      <div class="bk-col bk-col--4 bk-col--pr">
        <h4>Products</h4>
        <ul>
${PRODUCTS.map(p => `          <li><a href="product-${p.slug}.html">${p.name}</a></li>`).join("\n")}
        </ul>
      </div>
      <div class="bk-col bk-col--4 bk-col--pr">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About BOKSWA</a></li>
          <li><a href="manufacturing.html">Manufacturing</a></li>
          <li><a href="projects.html">Projects</a></li>
          <li><a href="products.html">Full range</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="contact.html#quote">Request a quote</a></li>
        </ul>
      </div>
      <div class="bk-col bk-col--4">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${TEL2}"><i class="fas fa-phone-alt bk-or"></i>&nbsp; ${TEL2_DISPLAY}</a></li>
          <li><a href="tel:${TEL}"><i class="fas fa-mobile-alt bk-or"></i>&nbsp; ${TEL_DISPLAY}</a></li>
          <li><a href="mailto:${EMAIL}"><i class="fas fa-envelope bk-or"></i>&nbsp; ${EMAIL}</a></li>
          <li><a href="${MAP}" target="_blank" rel="noopener"><i class="fas fa-map-marker-alt bk-or"></i>&nbsp; Joggo, Bukerere Road</a></li>
          <li style="opacity:.6;font-size: var(--bk-t-caption)">P.O. Box 108098, Kampala, Uganda</li>
        </ul>
      </div>
    </div>
    <div class="bk-footer__bar">
      <div class="bk-row bk-row--between bk-row--mid">
        <p>&copy; <span data-year>2026</span> BOKSWA Investments (U) Limited</p>
        <p>Strong materials for strong structures</p>
      </div>
    </div>
    <div class="bk-footer__mark" aria-hidden="true"><span>BOKSWA</span></div>
  </div>
</footer>

<script src="assets/vendor/gsap.min.js"></script>
<script src="assets/vendor/ScrollTrigger.min.js"></script>
<script src="assets/vendor/lenis.min.js"></script>
<script src="assets/js/bokswa.js"></script>
</body>
</html>`;

const accordion = (items) => `
<div class="bk-acc">
${items.map(([q, a]) => `  <div class="bk-acc__item">
    <button class="bk-acc__head" aria-expanded="false"><span>${q}</span><i class="fas fa-plus"></i></button>
    <div class="bk-acc__panel"><div>${linkify(a)}</div></div>
  </div>`).join("\n")}
</div>`;

/* ---------- product pages --------------------------------------------- */
function productPage(p) {
  const others = PRODUCTS.filter(x => x.slug !== p.slug).slice(0, 3);
  return head({
    title: `${p.title} | BOKSWA Investments`,
    meta: p.meta,
    file: `product-${p.slug}.html`,
    ogImage: p.hero,
    jsonld: {
      "@context": "https://schema.org", "@type": "Product", name: p.name,
      description: p.meta, category: "Concrete building materials",
      brand: { "@type": "Brand", name: "BOKSWA Investments (U) Limited" },
      manufacturer: { "@type": "Organization", name: "BOKSWA Investments (U) Limited", address: "Joggo, Bukerere Road, Kampala, Uganda" }
    }
  }) + header("products.html") + phero({
    image: p.hero, imageAlt: p.heroAlt, imageMax: p.heroMax || 1800,
    crumb: p.name, crumbMid: ["Products", "products.html"],
    eyebrow: "Product", h1: p.name, lede: p.tagline
  }) + `

<!-- OVERVIEW + SPEC TABLE (standard section) -->
<section class="bk-section bk-dark" id="overview">
  <div class="bk-wrap">
    <div class="bk-row">
      <div class="bk-col bk-col--58 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">Overview</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">${p.lede}</h2>
${p.body.map((b, i) => `        <p class="bk-body bk-reveal" data-d="${i + 2}">${linkify(b)}</p>`).join("\n")}
${dimsBlock(p)}
        <div class="bk-btns bk-reveal" data-d="5">
          <a class="bk-btn bk-btn--primary" href="contact.html?product=${encodeURIComponent(p.quoteName)}#quote">Get a price for ${p.name.toLowerCase()} <span class="bk-btn__ar">&rarr;</span></a>
          <a class="bk-btn bk-btn--wa" href="https://wa.me/${WA}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Ask on WhatsApp</a>
        </div>
      </div>
      <div class="bk-col bk-col--42 bk-col--pl">
        <div class="bk-sticky">
          <p class="bk-eyebrow bk-reveal">Technical</p>
          <ul class="explorer-panel__specs bk-reveal" data-d="1" style="margin-top:0">
${p.specs.map(([k, v]) => `            <li><b>${k}</b><span${v === "TBD" ? ' class="is-tbd"' : ""}>${v === "TBD" ? "To confirm" : v}</span></li>`).join("\n")}
          </ul>
          <p class="bk-body bk-reveal" data-d="2" style="font-size: var(--bk-t-caption)">
            Figures marked <span class="bk-or">to confirm</span> are given by our yard on request, against the
            production run your order is drawn from. Call <a href="tel:${TEL}" class="bk-or">${TEL_DISPLAY}</a> for current specifications.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- WHERE IT IS USED (icon boxes — FA5 names) -->
<section class="bk-section bk-ink" id="applications">
  <div class="bk-wrap">
    <p class="bk-eyebrow bk-reveal">Where it is used</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">Applications</h2>
    <div class="bk-row">
${p.uses.map(([icon, t, d], i) => `      <div class="bk-col bk-col--4 bk-col--pad">
        <div class="bk-iconbox bk-reveal" data-d="${i}">
          <i class="fas ${icon}"></i>
          <h3 class="bk-h4">${t}</h3>
          <p>${d}</p>
        </div>
      </div>`).join("\n")}
    </div>
  </div>
</section>
${p.profiles ? `
<!-- PROFILE RANGE (gallery) -->
<section class="bk-section bk-dark" id="profiles">
  <div class="bk-wrap">
    <p class="bk-eyebrow bk-reveal">Profiles</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">Shapes we cast</h2>
    <div class="bk-row">
${p.profiles.map(([src, name], i) => `      <div class="bk-col bk-col--4 bk-col--pad">
        <div class="bk-card bk-reveal" data-d="${i % 4}">
          <div class="bk-card__media bk-card__media--square">${img(src, name.toLowerCase().includes("louver") ? `BOKSWA concrete ${name.toLowerCase()}` : `BOKSWA ${name} concrete paver profile`, { sizes: "(max-width:860px) 100vw, 25vw" })}</div>
          <div class="bk-card__body" style="padding:18px 20px 22px"><h3 class="bk-h4">${name}</h3></div>
        </div>
      </div>`).join("\n")}
    </div>
  </div>
</section>` : ""}

<!-- GALLERY -->
<section class="bk-section bk-ink" id="gallery">
  <div class="bk-wrap">
    <p class="bk-eyebrow bk-reveal">In the yard and on site</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">${p.name} in context</h2>
    <div class="bk-gal">
${p.gallery.map(([src, alt, max], i) => `      <div class="bk-gal__item"><figure class="bk-gal__fig">${img(src, alt, { sizes: "(max-width:600px) 100vw, (max-width:980px) 50vw, 33vw", max })}<figcaption>${alt}</figcaption></figure></div>`).join("\n")}
    </div>
  </div>
</section>

<!-- FAQ (accordion) -->
<section class="bk-section bk-dark" id="faq">
  <div class="bk-wrap bk-wrap--narrow">
    <p class="bk-eyebrow bk-reveal">Common questions</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">${p.name} &mdash; asked and answered</h2>
    <div class="bk-reveal" data-d="2">${accordion(p.faq)}</div>
  </div>
</section>

<!-- OTHER PRODUCTS -->
<section class="bk-section bk-ink" id="more">
  <div class="bk-wrap">
    <p class="bk-eyebrow bk-reveal">More from the range</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">Other lines</h2>
    <div class="bk-row">
${others.map((o, i) => `      <div class="bk-col bk-col--3 bk-col--pad">
        <div class="bk-card bk-reveal" data-d="${i}">
          <div class="bk-card__media">${img(o.hero, o.heroAlt, { sizes: "(max-width:860px) 100vw, 33vw", max: o.heroMax || 1800 })}</div>
          <div class="bk-card__body">
            <h3 class="bk-h3">${o.name}</h3>
            <p>${o.tagline}</p>
            ${dimsLine(o)}
            <a class="bk-link" href="product-${o.slug}.html">View product <span class="bk-btn__ar">&rarr;</span></a>
          </div>
        </div>
      </div>`).join("\n")}
    </div>
  </div>
</section>
` + ctaBand() + footer();
}

/* ---------- products index -------------------------------------------- */
function productsPage() {
  return head({
    title: "Our Products — Blocks, Pavers, Kerbs, Maxpans & Fence Poles | BOKSWA",
    meta: "The full BOKSWA range: hollow and solid concrete blocks, interlocking pavers and louvers, kerb stones, maxpans and reinforced fence poles. Manufactured in Kampala, Uganda.",
    file: "products.html", ogImage: "products/hollow-block"
  }) + header("products.html") + phero({
    image: "yard/blocks-field",
    imageAlt: "Rows of BOKSWA concrete blocks laid out across the production yard",
    crumb: "Products", eyebrow: "The range", h1: "Six lines.<br>One standard.",
    lede: "Every product below is cast at our own yard at Joggo, from the same batching discipline and the same curing process. Select a line to see what it is for and how it behaves."
  }) + `

<!-- PRODUCT EXPLORER [SHOWPIECE 3 — full instance] -->
<section class="bk-section bk-dark" id="explorer">
  <div class="bk-wrap">
    <div class="bk-explorer" data-start="p-hollow">
      <div class="bk-row">
        <div class="bk-col bk-col--38 bk-col--pr">
          <p class="bk-eyebrow">Select a product</p>
          <div class="bk-explorer__rail" role="tablist" aria-label="Product range">
${PRODUCTS.map(p => `            <button class="explorer-item" role="tab" data-target="p-${p.slug.split("-")[0]}" aria-controls="p-${p.slug.split("-")[0]}">
              <span class="explorer-item__t">${p.name}</span></button>`).join("\n")}
          </div>
        </div>
        <div class="bk-col bk-col--62">
          <div class="bk-explorer__stage">
${PRODUCTS.map((p, i) => `            <div class="explorer-panel" id="p-${p.slug.split("-")[0]}" role="tabpanel"${i ? " hidden" : ""}>
              <div class="explorer-panel__media">
                ${img(p.hero, p.heroAlt, { sizes: "(max-width:860px) 100vw, 55vw", max: p.heroMax || 1800 })}
              </div>
              <div class="explorer-panel__body">
                <h2 class="bk-h3" data-panel-in>${p.tagline}</h2>
                <p class="bk-body" data-panel-in>${p.lede}</p>
                ${dimsLine(p) ? `<div data-panel-in>${dimsLine(p)}</div>` : ""}
                <ul class="explorer-panel__specs" data-panel-in>
${p.specs.slice(0, 4).map(([k, v]) => `                  <li><b>${k}</b><span${v === "TBD" ? ' class="is-tbd"' : ""}>${v === "TBD" ? "To confirm" : v}</span></li>`).join("\n")}
                </ul>
                <div class="bk-btns" style="margin-top:8px" data-panel-in>
                  <a class="bk-btn bk-btn--primary" href="product-${p.slug}.html">Product detail <span class="bk-btn__ar">&rarr;</span></a>
                  <a class="bk-btn bk-btn--ghost" href="contact.html?product=${encodeURIComponent(p.quoteName)}#quote">Get a price</a>
                </div>
              </div>
            </div>`).join("\n")}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- HOVER INDEX (hybrid — native Image + Heading/link widgets; one behaviour hook)
     Each .bk-index__item[data-target] pairs with .bk-index__img[data-for].
     On mobile the preview hides and the list becomes plain tappable links. -->
<section class="bk-section bk-ink" id="all" data-index>
  <div class="bk-wrap">
    <div class="bk-row bk-row--end bk-head-gap">
      <div class="bk-col bk-col--62 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">All products</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">The full range</h2>
      </div>
      <div class="bk-col bk-col--38">
        <p class="bk-lede bk-reveal" data-d="2">Hover a line to see it. Select it to open the full specification.</p>
      </div>
    </div>
    <div class="bk-row bk-row--mid">
      <div class="bk-col bk-col--42 bk-col--pr">
        <div class="bk-index__stage bk-reveal">
${PRODUCTS.map(p => `          <img class="bk-index__img" data-for="ix-${p.slug}" src="assets/img/${p.hero}-1200.jpg" srcset="assets/img/${p.hero}-800.jpg 800w, assets/img/${p.hero}-1200.jpg 1200w" sizes="(max-width:860px) 1px, 42vw" alt="${p.heroAlt}" loading="lazy">`).join("\n")}
          <span class="bk-index__cap"></span>
        </div>
      </div>
      <div class="bk-col bk-col--58">
        <nav class="bk-index__list" aria-label="All products">
${PRODUCTS.map(p => `          <a class="bk-index__item" href="product-${p.slug}.html" data-target="ix-${p.slug}" data-caption="${p.tagline}">${p.name}</a>`).join("\n")}
        </nav>
      </div>
    </div>
  </div>
</section>

<!-- WHY (icon boxes) -->
<section class="bk-section bk-dark" id="why">
  <div class="bk-wrap">
    <div class="bk-row bk-row--end bk-head-gap">
      <div class="bk-col bk-col--62 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">Why it matters</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">One yard.<br>One standard.</h2>
      </div>
      <div class="bk-col bk-col--38">
        <p class="bk-lede bk-reveal" data-d="2">We are not a depot reselling whatever arrived this week. Every line comes off our own plant, which is why we can answer for it.</p>
      </div>
    </div>
    <div class="bk-row">
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal"><i class="fas fa-industry"></i><h3 class="bk-h4">Locally manufactured</h3><p>Cast at Joggo, not imported and marked up.</p></div></div>
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="1"><i class="fas fa-balance-scale"></i><h3 class="bk-h4">Consistent batching</h3><p>The same proportions every run, so units behave alike.</p></div></div>
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="2"><i class="fas fa-hard-hat"></i><h3 class="bk-h4">Safety-first yard</h3><p>PPE on every shift, plant operated by trained crew.</p></div></div>
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="3"><i class="fas fa-truck"></i><h3 class="bk-h4">Bulk dispatch</h3><p>3km off the highway, loading bay ready for volume.</p></div></div>
    </div>
  </div>
</section>
` + ctaBand() + footer();
}

/* ---------- manufacturing --------------------------------------------- */
function manufacturingPage() {
  const steps = [
    ["01", "Raw material selection", "Graded stone, sand and cement arrive and are moved by loader into the batching bays. What goes in decides what comes out, so inputs are checked before anything is mixed.", "yard/loader-aggregate", "Wheel loader moving crushed aggregate at the BOKSWA yard"],
    ["02", "Batching", "Proportioning is where consistency is won or lost. Every batch follows the same recipe, worked by crew in full protective equipment.", "yard/mixer-crew", "BOKSWA workers in protective equipment feeding the concrete mixer"],
    ["03", "Mixing & conveying", "Mixed concrete is conveyed to the moulding machine. From this point the material is on a clock and handling has to keep pace.", "yard/plant-conveyor", "Concrete batching plant and conveyor inside the BOKSWA production shed"],
    ["04", "Moulding & compaction", "Vibration and compression build density into each unit. This is the stage that decides whether a block holds its arris or crumbles under the trowel.", "yard/plant-loader", "Batching plant and wheel loader with freshly moulded blocks stacked in the yard"],
    ["05", "Curing", "Units are laid out in the open field and cured before they are stacked or loaded. Rushing this is the single most common cause of failure on site.", "yard/curing-field", "Rows of freshly cast concrete blocks curing in the open BOKSWA yard"],
    ["06", "Stacking & dispatch", "Cured units are stacked, counted and loaded. Our position off the Seeta–Jinja Highway keeps dispatch quick across central Uganda.", "yard/truck-loaded", "Loaded BOKSWA delivery truck at the production yard"]
  ];
  return head({
    title: "How We Manufacture — Inside the BOKSWA Yard | Kampala, Uganda",
    meta: "Aggregate to dispatch: how BOKSWA manufactures concrete blocks, pavers, kerbs and maxpans at our yard in Joggo, Bukerere Road, Kampala. Batching, moulding, curing and quality control.",
    file: "manufacturing.html", ogImage: "yard/plant-conveyor"
  }) + header("manufacturing.html") + phero({
    image: "yard/plant-conveyor",
    imageAlt: "Concrete batching plant and conveyor inside the BOKSWA production shed",
    crumb: "Manufacturing", eyebrow: "Inside the yard", h1: "We do not resell.<br>We manufacture.",
    lede: "A batching plant, a moulding line, a curing field, a loading bay, and the crew who run them. Here is what happens between aggregate arriving and a truck leaving."
  }) + `

<!-- PROCESS SEQUENCE (standard — alternating flex rows) -->
<section class="bk-section bk-dark" id="process">
  <div class="bk-wrap">
    <p class="bk-eyebrow bk-reveal">The process</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">Six stages,<br>every single run</h2>
${steps.map(([n, t, d, src, alt], i) => `
    <div class="bk-row bk-row--mid" style="margin-bottom:12px">
      <div class="bk-col bk-col--58${i % 2 ? " bk-col--pl" : ""}"${i % 2 ? ' style="order:2"' : ""}>
        <div class="bk-figure bk-figure--mid bk-mask">${img(src, alt, { sizes: "(max-width:860px) 100vw, 58vw" })}</div>
      </div>
      <div class="bk-col bk-col--42 ${i % 2 ? "bk-col--pr" : "bk-col--pl"}"${i % 2 ? ' style="order:1"' : ""}>
        <div class="bk-step bk-reveal" style="border-top:0">
          <h3 class="bk-h3" style="margin-top:14px">${t}</h3>
          <p style="font-size:1rem">${d}</p>
        </div>
      </div>
    </div>`).join("\n")}
  </div>
</section>

<!-- QUALITY (icon boxes) -->
<section class="bk-section bk-ink" id="quality">
  <div class="bk-wrap">
    <div class="bk-row bk-row--mid">
      <div class="bk-col bk-col--2 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">Quality &amp; safety</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">Density you can<br>see at the edge</h2>
        <p class="bk-lede bk-reveal" data-d="2">
          The quickest field test of a concrete unit is its arris &mdash; the cast edge. A block
          that crumbles there was under-compacted or under-cured, and it will keep costing
          your masons time all the way up the wall.
        </p>
        <p class="bk-body bk-reveal" data-d="3">
          We control that with consistent proportioning, proper compaction under vibration,
          and curing that is allowed to finish. Our crews work in protective equipment because
          a yard handling bulk aggregate, heavy plant and loaded trucks is only productive
          when it is run safely.
        </p>
      </div>
      <div class="bk-col bk-col--2 bk-col--pl">
        <div class="bk-row">
          <div class="bk-col bk-col--2 bk-col--pad"><div class="bk-iconbox bk-reveal"><i class="fas fa-balance-scale"></i><h3 class="bk-h4">Consistent mix</h3><p>Same proportions, every batch, every run.</p></div></div>
          <div class="bk-col bk-col--2 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="1"><i class="fas fa-compress-arrows-alt"></i><h3 class="bk-h4">Compaction</h3><p>Vibration and pressure build real density.</p></div></div>
          <div class="bk-col bk-col--2 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="2"><i class="fas fa-hourglass-half"></i><h3 class="bk-h4">Full curing</h3><p>Cured before stacking, not rushed to the truck.</p></div></div>
          <div class="bk-col bk-col--2 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="3"><i class="fas fa-hard-hat"></i><h3 class="bk-h4">PPE on shift</h3><p>Helmets, hi-vis and boots as standard.</p></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PLANT GALLERY -->
<section class="bk-section bk-dark" id="plant">
  <div class="bk-wrap">
    <p class="bk-eyebrow bk-reveal">The plant</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">Machinery &amp; handling</h2>
    <div class="bk-gal">
      <div class="bk-gal__item"><figure class="bk-gal__fig">${img("yard/plant-wide", "Wide view of the BOKSWA batching plant with wheel loader", { sizes: "(max-width:600px) 100vw, 33vw" })}<figcaption>Batching plant</figcaption></figure></div>
      <div class="bk-gal__item"><figure class="bk-gal__fig">${img("yard/plant-loader", "Wheel loader feeding the BOKSWA batching plant", { sizes: "(max-width:600px) 100vw, 33vw" })}<figcaption>Loader &amp; feed</figcaption></figure></div>
      <div class="bk-gal__item"><figure class="bk-gal__fig">${img("yard/mixer-crew-2", "BOKSWA worker operating the concrete mixer in protective equipment", { sizes: "(max-width:600px) 100vw, 33vw" })}<figcaption>Mixing</figcaption></figure></div>
      <div class="bk-gal__item"><figure class="bk-gal__fig">${img("yard/blocks-field", "Rows of BOKSWA blocks laid out across the curing field", { sizes: "(max-width:600px) 100vw, 33vw" })}<figcaption>Curing field</figcaption></figure></div>
      <div class="bk-gal__item"><figure class="bk-gal__fig">${img("yard/yard-wide", "Wide view of the BOKSWA production yard", { sizes: "(max-width:600px) 100vw, 33vw" })}<figcaption>The yard</figcaption></figure></div>
      <div class="bk-gal__item"><figure class="bk-gal__fig">${img("yard/truck-front", "Branded BOKSWA Investments delivery truck", { sizes: "(max-width:600px) 100vw, 33vw" })}<figcaption>Dispatch</figcaption></figure></div>
    </div>
  </div>
</section>
` + ctaBand() + footer();
}

/* ---------- projects --------------------------------------------------- */
function projectsPage() {
  /* Ordered so the gallery opens on finished work and ends at the yard —
     the page is called "where the material ends up", so it should not lead
     with pallets. `max` marks photos that only exist at 800px. */
  const items = [
    ["projects/apartments-build", "Apartment block under construction, block walling behind bamboo scaffolding", "Apartments under construction", "walling site", 1200],
    ["projects/roof-trusses", "Roof trusses being fixed over completed block walling", "Trusses over block walling", "walling site", 1200],
    ["projects/villa-paved-drive", "Completed two-storey house with a paved approach and driveway", "Completed villa and driveway", "paving walling", 800],
    ["projects/home-paved-compound", "Completed home with a fully paved compound", "Paved compound", "paving walling", 800],
    ["projects/paving-hex-drive", "Hexagonal pavers laid in red and grey along a compound driveway", "Hexagon pavers, red and grey", "paving", 800],
    ["projects/paver-laying", "Pavers being laid course by course on a levelled sand bed", "Pavers going down", "paving site", 800],
    ["projects/paver-bone-laid", "Bone-profile pavers laid in alternating grey and white courses", "Bone pavers laid", "paving", 800],
    ["projects/compound-pattern", "Paved compound laid in a red and grey panel pattern", "Patterned compound", "paving", 800],
    ["projects/bungalow-paved", "Completed bungalow with a paved frontage", "Paved frontage", "paving walling", 800],
    ["projects/terrace-paved", "Terrace of completed homes with a paved forecourt", "Paved forecourt", "paving walling", 800],
    ["projects/garden-path", "Paved path running through a landscaped garden", "Paved garden path", "paving", 800],
    ["projects/house-paved-drive", "Paved driveway leading to a finished house", "Driveway to the door", "paving", 800],
    ["projects/boundary-wall", "Hollow-block boundary wall with steel railing above", "Block boundary wall", "walling", 800],
    ["projects/perimeter-wall", "Rendered perimeter wall topped with an electric fence", "Perimeter wall", "walling", 800],
    ["projects/wall-building", "Block wall under construction using BOKSWA hollow blocks", "Walling in progress", "walling site", 1800],
    ["projects/blocks-site", "BOKSWA blocks stacked at an active construction site", "Delivered to site", "site", 1800],
    ["projects/block-wall-a", "Stacked BOKSWA hollow blocks beside a wall under construction", "Bulk supply on site", "walling site", 1800],
    ["projects/wall-site", "BOKSWA blocks at a residential construction site", "Residential build", "site", 1800],
    ["yard/curing-field", "Freshly cast BOKSWA blocks curing in the open yard", "Curing field", "yard", 1800],
    ["yard/truck-front", "Branded BOKSWA Investments delivery truck", "Dispatch fleet", "yard", 1800],
    ["products/kerb-yard", "Pallets of BOKSWA kerb stones ready for dispatch", "Kerb stock", "yard", 1800],
    ["texture/paver-walk-a", "Field of BOKSWA interlocking pavers stacked in the yard", "Paver stock", "yard", 1800]
  ];
  return head({
    title: "Projects — Built With BOKSWA | Kampala, Uganda",
    meta: "Walls, compounds, slabs and perimeters built with BOKSWA concrete blocks, pavers and kerb stones across Kampala, Mukono and central Uganda.",
    file: "projects.html", ogImage: "projects/apartments-build"
  }) + header("projects.html") + phero({
    image: "projects/apartments-build",
    imageAlt: "Apartment block under construction, block walling behind bamboo scaffolding",
    imageMax: 1200,
    crumb: "Projects", eyebrow: "Built with BOKSWA", h1: "Where the<br>material ends up",
    lede: "A product photograph tells you what something looks like. This tells you what it becomes."
  }) + `

<section class="bk-section bk-dark" id="gallery" data-gallery>
  <div class="bk-wrap">
    <div class="bk-filter bk-reveal">
      <button class="is-active" data-filter="all">All</button>
      <button data-filter="walling">Walling</button>
      <button data-filter="paving">Paving</button>
      <button data-filter="site">On site</button>
      <button data-filter="yard">Production &amp; dispatch</button>
    </div>
    <div class="bk-gal">
${items.map(([src, alt, cap, cat, max]) => `      <div class="bk-gal__item" data-cat="${cat}"><figure class="bk-gal__fig">${img(src, alt, { sizes: "(max-width:600px) 100vw, (max-width:980px) 50vw, 33vw", max })}<figcaption>${cap}</figcaption></figure></div>`).join("\n")}
    </div>
  </div>
</section>

<section class="bk-section bk-ink" id="supply">
  <div class="bk-wrap">
    <div class="bk-row bk-row--mid">
      <div class="bk-col bk-col--2 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">Supply</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">From our yard<br>to your wall</h2>
        <p class="bk-lede bk-reveal" data-d="2">
          We supply residential builds, commercial shells, compounds and infrastructure
          work across Kampala, Mukono and the neighbouring districts. Bulk quantities
          are stacked and dispatched from Joggo, 3km off the Seeta&ndash;Jinja Highway.
        </p>
        <div class="bk-row" style="margin-top:30px">
          <div class="bk-col bk-col--2"><div class="bk-stat bk-reveal" data-d="3"><b>Six</b><span>Product lines supplied</span></div></div>
          <div class="bk-col bk-col--2"><div class="bk-stat bk-reveal" data-d="4"><b>Bulk</b><span>Quantities to order</span></div></div>
        </div>
        <div class="bk-btns bk-reveal" data-d="5">
          <a class="bk-btn bk-btn--primary" href="contact.html#quote">Request a quote <span class="bk-btn__ar">&rarr;</span></a>
        </div>
      </div>
      <div class="bk-col bk-col--2 bk-col--pl">
        <div class="bk-figure bk-figure--tall bk-mask">${img("projects/roof-trusses", "Roof trusses being fixed over completed block walling", { sizes: "(max-width:860px) 100vw, 50vw", max: 1200 })}</div>
      </div>
    </div>
  </div>
</section>
` + ctaBand() + footer();
}

/* ---------- about ------------------------------------------------------ */
function aboutPage() {
  return head({
    title: "About BOKSWA Investments (U) Limited | Concrete Manufacturer, Kampala",
    meta: "BOKSWA Investments (U) Limited is a Ugandan construction-materials manufacturer supplying high-durability concrete components from its yard at Joggo, Bukerere Road, Kampala.",
    file: "about.html", ogImage: "people/team"
  }) + header("about.html") + phero({
    image: "people/team",
    imageAlt: "The BOKSWA production team in high-visibility vests and hard hats",
    crumb: "About", eyebrow: "The company", h1: "Strong materials.<br>Strong structures.",
    lede: "BOKSWA Investments (U) Limited manufactures the concrete components that hold Ugandan buildings up — and we do it locally, at our own yard."
  }) + `

<section class="bk-section bk-dark" id="story">
  <div class="bk-wrap">
    <div class="bk-row">
      <div class="bk-col bk-col--58 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">Who we are</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">A manufacturer,<br>not a middleman</h2>
        <p class="bk-body bk-reveal" data-d="2">
          BOKSWA Investments (U) Limited is a Ugandan construction manufacturing company
          supplying high-durability building materials for structural development. We work
          as a supply partner to residential, commercial and infrastructural projects across
          the region.
        </p>
        <p class="bk-body bk-reveal" data-d="3">
          The distinction that matters is this: we cast what we sell. A depot that buys in
          stock can tell you a price, but it cannot tell you how the units were proportioned,
          how long they cured or why a particular batch behaves the way it does. We can,
          because the plant is ours and the crew running it work for us.
        </p>
        <p class="bk-body bk-reveal" data-d="4">
          Producing locally also keeps money and skills in the country. Every block that
          leaves Joggo was made by a Ugandan workforce from Ugandan raw material, which is
          a quieter argument than price but a more durable one.
        </p>
      </div>
      <div class="bk-col bk-col--42 bk-col--pl">
        <div class="bk-figure bk-figure--tall bk-mask">${img("people/crew-stacking", "BOKSWA workers stacking freshly cast concrete blocks", { sizes: "(max-width:860px) 100vw, 42vw" })}</div>
      </div>
    </div>
  </div>
</section>

<!-- LEADERSHIP — General Manager (standard section, all native widgets) -->
<section class="bk-section bk-dark bk-leader" id="leadership">
  <div class="bk-wrap">
    <div class="bk-row bk-row--mid">
      <div class="bk-col bk-col--42 bk-col--pr">
        <figure class="bk-leader__portrait bk-mask">
          ${img("people/portrait-2", "General Manager of BOKSWA Investments (U) Limited in a branded vest and BOKSWA hard hat", { sizes: "(max-width:860px) 100vw, 42vw" })}
        </figure>
      </div>
      <div class="bk-col bk-col--58 bk-col--pl">
        <p class="bk-eyebrow bk-reveal">Leadership</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">Accountable from<br>the yard up</h2>
        <div class="bk-leader__id bk-reveal" data-d="2">
          <p class="bk-leader__name">General Manager</p>
          <p class="bk-leader__role">BOKSWA Investments (U) Limited</p>
        </div>
        <p class="bk-lede bk-reveal" data-d="3">
          Every order that leaves Joggo passes through one management team. Our General
          Manager leads the crew that runs the yard &mdash; batching, curing, quality and
          dispatch &mdash; so when a job needs a straight answer on quantity, timing or
          delivery, you reach the people responsible for it.
        </p>
        <blockquote class="bk-leader__principle bk-reveal" data-d="4">
          <p>Strong materials for strong structures.</p>
          <cite>The BOKSWA standard</cite>
        </blockquote>
        <div class="bk-btns bk-reveal" data-d="5">
          <a class="bk-btn bk-btn--primary" href="tel:${TEL}"><i class="fas fa-phone-alt"></i> Speak to management</a>
          <a class="bk-btn bk-btn--wa" href="https://wa.me/${WA}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bk-section bk-ink" id="values">
  <div class="bk-wrap">
    <p class="bk-eyebrow bk-reveal">What we hold to</p>
    <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">Our value proposition</h2>
    <div class="bk-row">
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal"><i class="fas fa-cubes"></i><h3 class="bk-h4">Structural integrity</h3><p>Components engineered to carry the loads they are specified for.</p></div></div>
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="1"><i class="fas fa-balance-scale"></i><h3 class="bk-h4">Uniform density</h3><p>Consistent proportioning so one unit behaves like the next.</p></div></div>
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="2"><i class="fas fa-hard-hat"></i><h3 class="bk-h4">Industrial safety</h3><p>A visible workforce in proper protective equipment, every shift.</p></div></div>
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal" data-d="3"><i class="fas fa-seedling"></i><h3 class="bk-h4">Local production</h3><p>Made in Uganda, supporting Ugandan construction and employment.</p></div></div>
    </div>
  </div>
</section>

<section class="bk-section bk-dark" id="people">
  <div class="bk-wrap">
    <div class="bk-row bk-row--mid">
      <div class="bk-col bk-col--2">
        <div class="bk-figure bk-figure--tall bk-mask">${img("people/team", "The BOKSWA production team in high-visibility vests and hard hats", { sizes: "(max-width:860px) 100vw, 50vw" })}<figcaption class="bk-figure__cap">The BOKSWA yard crew</figcaption></div>
      </div>
      <div class="bk-col bk-col--2 bk-col--pl">
        <p class="bk-eyebrow bk-reveal">The people</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">The crew behind<br>the product</h2>
        <p class="bk-lede bk-reveal" data-d="2">
          Uniform product density is not an accident of machinery. It is the result of people
          who follow a method every shift, on a yard where safety is treated as a condition
          of working rather than a poster on a wall.
        </p>
        <div class="bk-figure bk-mask" style="height:300px;margin-top:30px">
          ${img("people/portrait-1", "BOKSWA Investments team member in branded protective clothing at the yard office", { sizes: "(max-width:860px) 100vw, 50vw" })}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bk-section bk-ink" id="location">
  <div class="bk-wrap">
    <div class="bk-row bk-row--mid">
      <div class="bk-col bk-col--2 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">Location</p>
        <h2 class="bk-h2 bk-reveal" data-d="1">Joggo,<br>Bukerere Road</h2>
        <p class="bk-lede bk-reveal" data-d="2">
          Our manufacturing yard and distribution office sit along Bukerere Road in Joggo,
          about 3&nbsp;km off the main Seeta&ndash;Jinja Highway. That highway link is the
          reason we can move bulk material quickly to sites across central Uganda and the
          neighbouring districts.
        </p>
        <ul style="list-style:none;padding:0;margin:26px 0 0">
          <li class="bk-reveal" data-d="3" style="margin-bottom:10px"><i class="fas fa-map-marker-alt bk-or"></i>&nbsp; Joggo, Bukerere Road, 3km off Seeta&ndash;Jinja Highway, Kampala</li>
          <li class="bk-reveal" data-d="4" style="margin-bottom:10px"><i class="fas fa-envelope-open-text bk-or"></i>&nbsp; P.O. Box 108098, Kampala, Uganda</li>
          <li class="bk-reveal" data-d="5"><i class="fas fa-phone-alt bk-or"></i>&nbsp; <a href="tel:${TEL2}">${TEL2_DISPLAY}</a> / <a href="tel:${TEL}">${TEL_DISPLAY}</a></li>
        </ul>
        <div class="bk-btns bk-reveal" data-d="5">
          <a class="bk-btn bk-btn--primary" href="${MAP}" target="_blank" rel="noopener"><i class="fas fa-directions"></i> Get directions</a>
          <a class="bk-btn bk-btn--ghost" href="contact.html">Contact us</a>
        </div>
      </div>
      <div class="bk-col bk-col--2 bk-col--pl">
        <div class="bk-figure bk-figure--tall bk-mask">${img("yard/signboard", "BOKSWA Investments roadside signboard on Bukerere Road", { sizes: "(max-width:860px) 100vw, 50vw" })}<figcaption class="bk-figure__cap">Bukerere Road, Joggo</figcaption></div>
      </div>
    </div>
  </div>
</section>
` + ctaBand() + footer();
}

/* ---------- contact ---------------------------------------------------- */
function contactPage() {
  return head({
    title: "Contact BOKSWA & Request a Quote | Kampala, Uganda",
    meta: "Request a quote for concrete blocks, pavers, kerb stones, maxpans or fence poles. Call 0758 381708, WhatsApp us, or visit our yard at Joggo, Bukerere Road, Kampala.",
    file: "contact.html", ogImage: "yard/signboard",
    jsonld: {
      "@context": "https://schema.org", "@type": "LocalBusiness",
      name: "BOKSWA Investments (U) Limited",
      telephone: TEL2, email: EMAIL,
      geo: { "@type": "GeoCoordinates", latitude: 0.404263, longitude: 32.700383 },
      hasMap: "https://www.google.com/maps/search/?api=1&query=0.404263,32.700383",
      sameAs: ["https://facebook.com/bokswainvestment", "https://instagram.com/bokswainvestment", "https://www.tiktok.com/@bokswa_investiments_ltd", `https://wa.me/${WA}`],
      address: { "@type": "PostalAddress", streetAddress: "Joggo, along Bukerere Road, 3km off Seeta–Jinja Highway", addressLocality: "Kampala", addressCountry: "UG", postOfficeBoxNumber: "108098" }
    }
  }) + header("contact.html") + phero({
    image: "yard/signboard",
    imageAlt: "BOKSWA Investments roadside signboard listing blocks, pavers, maxpans, fence poles and kerb stones",
    crumb: "Contact", eyebrow: "Get in touch", h1: "Tell us what<br>you are building.",
    lede: "Send the product, the quantity and where it is going. You will get a price and a delivery answer."
  }) + `

<!-- QUICK CONTACT (icon boxes) -->
<section class="bk-section bk-section--tight bk-ink" id="reach">
  <div class="bk-wrap">
    <div class="bk-row">
      <div class="bk-col bk-col--4 bk-col--pad"><div class="bk-iconbox bk-reveal"><i class="fas fa-phone-alt"></i><h3 class="bk-h4">Call the yard</h3><p><a class="bk-inline-link" href="tel:${TEL}">${TEL_DISPLAY}</a><br><a class="bk-inline-link" href="tel:${TEL2}">${TEL2_DISPLAY}</a></p></div></div>
      <div class="bk-col bk-col--4 bk-col--pad"><a class="bk-iconbox bk-reveal" data-d="1" href="https://wa.me/${WA}" target="_blank" rel="noopener" style="text-decoration:none"><i class="fab fa-whatsapp"></i><h3 class="bk-h4">WhatsApp</h3><p>Fastest route to a price. Send your quantity.</p></a></div>
      <div class="bk-col bk-col--4 bk-col--pad"><a class="bk-iconbox bk-reveal" data-d="2" href="mailto:${EMAIL}" style="text-decoration:none"><i class="fas fa-envelope"></i><h3 class="bk-h4">Email</h3><p>${EMAIL}</p></a></div>
      <div class="bk-col bk-col--4 bk-col--pad"><a class="bk-iconbox bk-reveal" data-d="3" href="${MAP}" target="_blank" rel="noopener" style="text-decoration:none"><i class="fas fa-map-marker-alt"></i><h3 class="bk-h4">Visit the yard</h3><p>Joggo, Bukerere Road, Kampala</p></a></div>
    </div>
  </div>
</section>

<!-- QUOTE FLOW -->
<section class="bk-section bk-dark" id="quote">
  <div class="bk-wrap">
    <div class="bk-row">
      <div class="bk-col bk-col--58 bk-col--pr">
        <p class="bk-eyebrow bk-reveal">Request a quote</p>
        <h2 class="bk-h2 bk-reveal bk-head-gap" data-d="1">Four fields.<br>One answer.</h2>

        <form class="bk-form bk-reveal" data-d="2" data-quote-form novalidate>
          <div class="bk-field bk-field--h">
            <label for="q-product">Product</label>
            <select id="q-product" name="product" required>
              <option value="">Select a product…</option>
${PRODUCTS.map(p => `              <option value="${p.quoteName}">${p.name}</option>`).join("\n")}
              <option value="Mixed order">Mixed order / not sure</option>
            </select>
            <p class="bk-form__err">Please choose a product.</p>
          </div>
          <div class="bk-field bk-field--h">
            <label for="q-qty">Quantity</label>
            <input id="q-qty" name="quantity" type="text" placeholder="e.g. 2,000 blocks or 150 m²" required>
            <p class="bk-form__err">Please give us a rough quantity.</p>
          </div>
          <div class="bk-field bk-field--h">
            <label for="q-area">Delivery area</label>
            <input id="q-area" name="delivery_area" type="text" placeholder="e.g. Namugongo, Mukono" required>
            <p class="bk-form__err">Where is it going?</p>
          </div>
          <div class="bk-field bk-field--h">
            <label for="q-site">Site type</label>
            <select id="q-site" name="site_type">
              <option value="">Optional…</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Infrastructure">Infrastructure / roads</option>
              <option value="Landscaping">Compound / landscaping</option>
            </select>
          </div>
          <div class="bk-field bk-field--h">
            <label for="q-name">Your name</label>
            <input id="q-name" name="name" type="text" placeholder="Full name" required>
            <p class="bk-form__err">Please tell us your name.</p>
          </div>
          <div class="bk-field bk-field--h">
            <label for="q-phone">Phone</label>
            <input id="q-phone" name="phone" type="tel" placeholder="07XX XXX XXX" required>
            <p class="bk-form__err">We need a number to call you back.</p>
          </div>
          <div class="bk-field">
            <label for="q-msg">Anything else?</label>
            <textarea id="q-msg" name="message" placeholder="Timing, access, profile preference, whether you are collecting…"></textarea>
          </div>
          <p class="bk-form__note">
            Your details compose a message you send yourself &mdash; nothing is stored on this
            page. WhatsApp is usually fastest.
          </p>
          <div class="bk-btns" style="margin-top:0">
            <button class="bk-btn bk-btn--wa" type="button" data-quote-wa><i class="fab fa-whatsapp"></i> Send via WhatsApp</button>
            <button class="bk-btn bk-btn--ghost" type="button" data-quote-email><i class="fas fa-envelope"></i> Send by email</button>
          </div>
        </form>
      </div>

      <div class="bk-col bk-col--42 bk-col--pl">
        <div class="bk-sticky">
          <p class="bk-eyebrow bk-reveal">Getting here</p>
          <div class="bk-figure bk-mask" style="height:280px;margin-bottom:26px">${img("yard/signboard", "BOKSWA Investments roadside signboard on Bukerere Road", { sizes: "(max-width:860px) 100vw, 42vw" })}</div>
          <h3 class="bk-h3 bk-reveal" data-d="1">Joggo, Bukerere Road</h3>
          <p class="bk-body bk-reveal" data-d="2">
            Turn off the Seeta&ndash;Jinja Highway and follow Bukerere Road for roughly
            3&nbsp;km. Our signboard and yard are on the roadside. Collection is welcome
            during working hours &mdash; call ahead and we will have your order stacked.
          </p>
          <ul style="list-style:none;padding:0;margin:22px 0 0" class="bk-reveal" data-d="3">
            <li style="margin-bottom:10px"><i class="fas fa-map-marker-alt bk-or"></i>&nbsp; Joggo, Bukerere Road, Kampala</li>
            <li style="margin-bottom:10px"><i class="fas fa-envelope-open-text bk-or"></i>&nbsp; P.O. Box 108098, Kampala</li>
            <li style="margin-bottom:10px"><i class="fas fa-phone-alt bk-or"></i>&nbsp; <a href="tel:${TEL2}">${TEL2_DISPLAY}</a></li>
            <li><i class="fas fa-mobile-alt bk-or"></i>&nbsp; <a href="tel:${TEL}">${TEL_DISPLAY}</a></li>
          </ul>
          <div class="bk-btns bk-reveal" data-d="4">
            <a class="bk-btn bk-btn--primary" href="${MAP}" target="_blank" rel="noopener"><i class="fas fa-directions"></i> Open in Maps</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- MAP -->
<section class="bk-section--flush" id="map" aria-label="Map to the BOKSWA yard">
  <iframe
    title="Map showing the exact location of the BOKSWA yard at Joggo, Bukerere Road"
    src="https://www.google.com/maps?q=0.404263,32.700383&amp;z=16&amp;output=embed"
    width="100%" height="460" style="border:0;display:block;filter:grayscale(.35) contrast(1.05) brightness(.92)"
    loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</section>
` + footer();
}

/* ---------- write ------------------------------------------------------ */
const pages = [
  ["products.html", productsPage()],
  ["manufacturing.html", manufacturingPage()],
  ["projects.html", projectsPage()],
  ["about.html", aboutPage()],
  ["contact.html", contactPage()]
];
PRODUCTS.forEach(p => pages.push([`product-${p.slug}.html`, productPage(p)]));

pages.forEach(([file, html]) => {
  fs.writeFileSync(path.join(OUT, file), html, "utf8");
  console.log("wrote", file, Math.round(html.length / 1024) + "KB");
});
console.log("\n" + pages.length + " pages generated (index.html is hand-authored and untouched).");
