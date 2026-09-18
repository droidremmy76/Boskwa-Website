# BOKSWA — Elementor build sheet

How to rebuild this static design in WordPress + Astra + Elementor + Xpro, section by section.
Written against the construction rules you set. Read the whole thing before Step 1.

---

## 1. Global Colors → Site Settings ▸ Global Colors

Never type a hex code into a widget. Set these once, then pick them from the global swatches.

| Elementor slot | Hex | Where it appears |
|---|---|---|
| **Primary** | `#FF7D24` | Buttons, technical markers, numbers, active states, hover |
| **Secondary** | `#201D1E` | Charcoal — dark buttons, rail background |
| **Text** | `#2A2A2C` | Body copy on light surfaces |
| **Accent** | `#FF7D24` | Same orange; Elementor uses this for links |
| Custom 1 — *Black* | `#0E100F` | Surface 0 — page canvas |
| Custom 2 — *Ink* | `#191919` | Surface 1 — nested panels, alternating sections |
| Custom 3 — *Concrete* | `#8A867C` | Muted secondary text, rest-state icons |
| Custom 4 — *Cream* | `#F1ECDB` | Surface 2 — primary text on dark, light sections |
| Custom 5 — *Cream Light* | `#FBF8EC` | Headings on dark surfaces |
| Custom 6 — *Hairline* | `#42433D` | Solid dividers and low-contrast outlines |
| Custom 7 — *On Orange* | `#201D1E` | **All text and icons sitting on orange** — buttons, tags, the CTA band |

**Never put white text on BOKSWA orange.** White on `#FF7D24` measures about 2.4:1 and fails WCAG AA even at large sizes. Charcoal on orange is about 7:1 — and black-on-orange is the visual language of construction safety signage, so it reads as on-brand rather than as a compromise. Every Button widget with an orange background uses *On Orange* for its text colour, switching to *Cream Light* on hover when the fill wipes to charcoal.

Orange and charcoal were sampled directly from `BOKSWA LOGOS.pdf`, so they match the printed identity exactly.

**Two rules that carry the whole feel:** never use pure `#FFFFFF` for text or pure `#000000` for background — the warmth of the cream against the slightly green-cast near-black is what stops this reading as generic dark UI. And orange stays an accent: it appears on the CTA band and interactive states only. One accent colour, no second hue anywhere.
## 2. Global Fonts → Site Settings ▸ Global Fonts

| Elementor slot | Family | Used for |
|---|---|---|
| **Primary** | Archivo — 900, uppercase, letter-spacing `-0.022em` | Hero display and H1 |
| **Secondary** | Archivo — 800/700, uppercase, letter-spacing `-0.011em` | H2/H3/H4 subheads |
| **Text** | Inter — 400, 19px, line-height 1.6 | Body copy |
| **Accent** | IBM Plex Mono — 500, uppercase, letter-spacing `0.15–0.2em` | Eyebrows, spec labels, buttons, breadcrumbs, stats |

### Type scale — create one Elementor typography preset per row

| Step | Size | Line height | Tracking |
|---|---|---|---|
| caption | 14px | 1.4 | `0.15em` (mono, uppercase) |
| body-sm | 16px | 1.4 | — |
| body | 18px, 72% cream | 1.7 | — |
| body-lg (lede) | 19–22px (fluid), 80% cream | 1.5 | `-0.005em` |
| H4 (card titles) | 20px Archivo 700 caps | 1.2 | `0.005em` |
| subheading (H3) | 30px | 1.06 | `-0.011em` |
| eyebrow | 14px mono caps, orange | — | `0.22em` |
| heading (H2) | 66px | 1.0 | `-0.011em` |
| heading-lg (H1) | 101px | 1.0 | `-0.022em` |
| display (hero) | up to 176px | 0.9 | `-0.022em` |

Display, heading and lede steps are fluid (`clamp`) so the headline fills the measure at any width. In Elementor, set the desktop value from this table and let the responsive controls handle tablet and mobile.

**14px is a hard floor.** Nothing on the site sits below it — the scale is deliberately binary between editorial display (34px and up) and compact UI (14–23px), with very little in between. If a label feels like it wants to be 11px, it belongs at 14px with more letter-spacing instead.

The mono layer is what makes the site read as *engineering* rather than *marketing*. Do not substitute it for a second sans.

Fonts are self-hosted in `site/assets/fonts/` (28 subsetted woff2 files, 647KB total). In WordPress, either load the same files via a local-fonts plugin or enable Elementor's Google Fonts — both render identically.

---

## 3. Page setup — do this on EVERY page before building

Both settings, every time:

1. **Elementor ▸ Page Settings ▸ Page Layout = "Elementor Full Width"** — not Canvas. Canvas removes the Xpro header and footer.
2. **Astra ▸ Content Layout = Full Width / Stretched, Sidebar = None.** Without this, Astra wraps everything in a narrow container and no hero runs edge to edge.

Verify both before moving to the next page.

## 4. Container rules

- Build every layout with **Containers set to Flexbox**. There is no CSS grid anywhere in this design, so nothing needs translating.
- **Container gap = 0.** All spacing lives in each column's own padding. A gap combined with percentage widths pushes past 100% and forces the row to wrap — that is the failure you described, and this design avoids it by construction.
- Column widths used: `50/50`, `33.3×3`, `25×4`, `38/62`, `42/58`. All total exactly 100%.
- Containers ignore the CSS Classes field, so **target containers by element ID**. Every section already carries the ID it needs (see §7).
- Card images: use the **Image widget's Height control plus `object-fit: cover`**. Card media, profile cards and gallery tiles all use a fixed **4:3 aspect ratio** (not a pixel height) with `object-fit: cover`, and `margin: 0` on the figure. Do not create custom image sizes.

## 5. Icons — Font Awesome 5 names only

Every icon in the design is FA5 Solid or Brands. These are the exact names used:

`fa-phone-alt` · `fa-mobile-alt` · `fa-envelope` · `fa-envelope-open-text` · `fa-map-marker-alt` · `fa-directions` · `fa-truck` · `fa-file-invoice` · `fa-chevron-right` · `fa-plus` · `fa-industry` · `fa-balance-scale` · `fa-hard-hat` · `fa-building` · `fa-th-large` · `fa-th` · `fa-shield-alt` · `fa-warehouse` · `fa-layer-group` · `fa-mountain` · `fa-weight-hanging` · `fa-border-all` · `fa-car` · `fa-home` · `fa-walking` · `fa-wind` · `fa-road` · `fa-shoe-prints` · `fa-parking` · `fa-seedling` · `fa-clock` · `fa-tree` · `fa-leaf` · `fa-compress-arrows-alt` · `fa-hourglass-half` · `fa-cubes`

Brands: `fa-whatsapp` · `fa-facebook-f` · `fa-instagram` · `fa-tiktok` (all available in FA 5.15)

No FA6-only names are used anywhere, so nothing will render as blank space.

## 6. Hover and transition states to recreate

Plugin defaults will not match. Reproduce these explicitly:

| Element | Behaviour |
|---|---|
| Buttons | Solid orange, **12px radius, no border**, Archivo 700 16px, padding 15px 26px, min-height 52px. Hover: charcoal fill wipes in from the left (520ms), text turns cream, button lifts 2px with a soft orange glow, arrow shifts +5px. Press: scales to 98%. Focus ring shows for keyboard users only |
| Nav links | Archivo 600 15px caps, 90% cream with a soft text shadow, over a dark top gradient on the transparent header. Hover/current: full cream + 2px rounded orange underline wiping left-to-right (420ms) |
| Footer links | 72% cream → full cream, with a 1px orange underline drawing in from the left (500ms); icons scale 1.15 |
| Inline phone/email links | Orange with an underline that retracts on hover. Every number and email on the site is a `tel:` / `mailto:` link |
| Images | Masked photos open with a clip wipe while settling from 120% to 106% scale over 2s; gallery tiles rise in with a 0 / 90 / 180ms stagger per row; large photos drift ±3% on scroll (desktop only) |
| Cards | Lift `-7px`, image `scale(1.07)` over 800ms, orange 2px top rule appears |
| Icon boxes | Lift `-6px` |
| Gallery tiles | Image `scale(1.08)`, caption slides up and fades in |
| Process steps | Orange top rule grows `0 → 100%` over 700ms |
| Accordion | `+` rotates 45° to `×`; panel height animates |
| Quote rail (desktop) | Rounded left corners; label slides out as a rounded orange (green for WhatsApp) tag; icon scales up |
| Sticky dock (mobile) | Floating bar 10px from the screen edges, 18px radius. Three 12px-radius buttons with icon + label: Call (charcoal), WhatsApp (#25D366), Quote (orange). Lift + icon tilt on hover, 96% press on tap |

Easing throughout: `cubic-bezier(.22, 1, .36, 1)`.

---

## 7. Section inventory — every section is native unless marked 🔶

### `index.html` — Home

| Anchor ID | Section | Build as |
|---|---|---|
| — | Preloader | 🔶 HTML widget (script + style only) |
| — | Header | Xpro header template |
| `#hero` | Hero (with rotating final word) | 🔶 **Showpiece 1** — see §8 and §14 |
| — | Capability marquee | 🔶 HTML widget (CSS animation only) |
| `#manifesto` | Manifesto statement | Native Text widget + one behaviour hook — see §14 |
| `#film` | Product → Application → Result | 🔶 **Showpiece 2** — see §8 |
| `#range` | Product explorer | 🔶 **Showpiece 3** — see §8 |
| `#yard` | Inside the yard | Native: Container + Heading + Text + Image + Button + 3 icon boxes |
| `#projects` | Built with BOKSWA | Native: Gallery widget + flex filter row |
| `#people` | The people | Native: Container + Image + Heading + Text + 2 stat blocks |
| `#leadership` | General Manager | Native: Container + Image + Heading + Text + Blockquote + 2 Buttons. Name line reads "General Manager" until his name is supplied |
| `#location` | Location & logistics | Native: Container + Image + 2 Icon Boxes + Button |
| `#cta` | Scatter CTA ("Let's build something strong.") | Native Heading/Text/Buttons + 6 absolutely positioned Image widgets + one behaviour hook — see §14 |
| — | Footer (with giant BOKSWA wordmark) | Xpro footer template — see §14 |

### `products.html`
`#explorer` 🔶 Showpiece 3 (full instance) · `#all` **hover index** — native Image + link widgets with one behaviour hook, see §14 · `#why` native icon boxes ×4

Inner pages keep the orange CTA band, now with charcoal text for contrast.

### `product-*.html` (six pages)
`#top` page hero · `#overview` native two-column + spec list · `#applications` native icon boxes ×4 · `#profiles` native card grid *(pavers page only)* · `#gallery` native Gallery widget · `#faq` native **Accordion widget** · `#more` native card grid ×3 · `#cta`

### `manufacturing.html`
`#process` native alternating rows ×6 (use Container `order` to flip sides) · `#quality` native text + icon boxes ×4 · `#plant` native Gallery ×6

### `projects.html`
`#gallery` native Gallery + filter row · `#supply` native two-column + stats

### `about.html`
`#story` · `#values` icon boxes ×4 · `#people` · `#location` — all native

### `contact.html`
`#reach` native icon boxes ×4 (linked) · `#quote` **WPForms** (see §9) · `#map` native HTML/embed widget for the Google Map iframe

---

## 8. The three showpieces — hybrid build

Each one follows the same pattern, exactly as you specified:

1. Add an **HTML widget** to the section. It contains **only** `<style>` and `<script>`. It renders nothing visible. Set it to a fixed `height: 0` so it does not affect layout.
2. Place the **visual layer** (video / images) in a Container positioned `absolute`, `z-index: 0`.
3. Every headline, paragraph, button, spec value and image stays a **native Elementor widget** on top at `z-index: 2`.
4. The script finds elements by class and animates them. It contains no text.

### Showpiece 1 — Hero (`#hero`)
**What the code does:** reveals each `.bk-line > span` from behind a mask on a staggered delay, fades in every `[data-hero-in]` element, scales the background media from 1.16 → 1.0, and drives a scroll-linked push-in. It also opts the video into autoplay on capable devices only.
**Content stays native:** the four headline lines (the last one rotating), the sub-paragraph and two buttons.
**Editing the headline in Elementor cannot break it** — the code animates whatever is inside `.bk-line > span`. Add a fourth line and it animates too.

### Showpiece 2 — The Film (`#film`)
**What the code does:** finds every `.film-frame` in DOM order, pins `.bk-film__stage`, and maps scroll progress onto the sequence — cross-fading frames, scaling `.film-frame__img`, driving `.film-caption` in and out, lighting the matching `.bk-film__step` in the HUD, and filling `.bk-film__bar b`.
**Content stays native:** every image, kicker, title, paragraph, spec list and button inside each frame.
**Adding a chapter:** duplicate a `.film-chapter` container with its `.film-frame` children. The timeline re-times itself from the frame count. No code change.
**Structure to reproduce:**
```
.bk-film
  .bk-film__stage            ← this is what gets pinned
    .bk-film__hud            ← 5 × .bk-film__step[data-stage]
    .bk-film__chapters
      .film-chapter          ← one Container per chapter
        .film-frame[data-stage]   ← one Container per frame
          img.film-frame__img
          .film-frame__veil
          .film-caption      ← native widgets live here
    .bk-film__bar > b
```

### Showpiece 3 — Product Explorer (`#range` / `#explorer`)
**What the code does:** pairs each `.explorer-item` button with the `.explorer-panel` whose `id` matches its `data-target`, toggles `is-active`, manages `aria-selected`/`hidden`, animates `[data-panel-in]` elements in, and supports arrow-key navigation.
**Content stays native:** the rail labels, and every heading, paragraph, spec row, image and button inside each panel.
**Adding a seventh product:** add one `.explorer-item` with `data-target="p-newthing"` and one `.explorer-panel` with `id="p-newthing"`. It works immediately.

---

## 9. Contact form — WPForms

Fields, in order: **Product** (dropdown, required) · **Quantity** (text, required) · **Delivery area** (text, required) · **Site type** (dropdown, optional) · **Name** (text, required) · **Phone** (tel, required) · **Message** (textarea, optional).

Style to match: transparent field background `rgba(255,255,255,.04)`, 1px border `rgba(255,255,255,.13)`, **border-radius 0**, orange focus border, mono uppercase labels in orange at 0.66rem / 0.15em tracking.

The static version composes a pre-filled WhatsApp message and a mailto fallback because a static page has no backend. In WordPress you can either keep that behaviour or let WPForms email `info@bokswa.co.ug` — **keep the WhatsApp button either way**, since it is the fastest route to an enquiry for this audience.

Product pages link through as `contact.html?product=Hollow%20Blocks#quote` and the field pre-selects. Preserve that query-parameter behaviour so the product pages keep converting.

## 10. Header, footer, menu

- Build both with **Xpro Theme Builder**. Use `assets/img/brand/bokswa-logo-light.png` — the real logo image, never a text logo.
- Save both to the Xpro library, set **Published** (not Draft), display conditions **Entire Site**. Confirm the Display Rules column shows the rule with no errors.
- Style nav links explicitly: mono, 0.72rem, 0.13em tracking, uppercase, `rgba(233,229,223,.76)` → white on hover. They inherit generic blue otherwise.
- Header height 78px, transparent at rest, `rgba(12,12,13,.93)` + 14px backdrop blur once scrolled past 40px.
- Mobile menu breakpoint: **1100px**.
- The **persistent quote rail** (desktop right edge) and **mobile bottom bar** belong in the footer template so they appear site-wide.
- **Create the navigation menu last**, after all 12 pages exist, and set the homepage last of all.

## 11. Anchor IDs

Every section already carries its ID. Keep them — the in-page buttons and nav links depend on them:

`#hero` `#manifesto` `#leadership` `#film` `#range` `#yard` `#projects` `#people` `#location` `#cta` `#top` `#overview` `#applications` `#profiles` `#gallery` `#faq` `#more` `#explorer` `#all` `#why` `#process` `#quality` `#plant` `#supply` `#story` `#values` `#reach` `#quote` `#map`

Anchor scrolling offsets by the 78px header automatically.

## 12. Still to supply

Carry these into the WordPress build — they are the same gaps that exist in the static site:

1. **Technical specifications.** Compressive strength, nominal dimensions, units per pallet and thickness are marked "To confirm" rather than invented. Replace them from your production records.
2. **Social URLs.** TikTok is confirmed: `@bokswa_investiments_ltd` (spelled "investiments" on TikTok — keep it exactly). Facebook and Instagram still use the assumed handle `bokswainvestment`; WhatsApp uses 0758 381708. LinkedIn was removed since it isn't one of BOKSWA's accounts. Confirm the exact handles, and add them to the `sameAs` list in the site's business schema too.
3. ~~Fence pole photography~~ — resolved. `_DSC3749` is a stack of fence poles (angled tops, pre-cast wire holes); it had been mislabelled as kerb stones and is now used on the Fence Poles page.
4. **Paver installation and finished-driveway photography.** This is the one gap that weakens the Product → Application → Result story, which is why the film runs the honest five-stage journey instead.
5. **Testimonials.** The design has a styled testimonial and star-rating component ready; no customer quotes were supplied.
6. **Names and roles for the two portraits on `about.html`.** One is captioned "General Manager"; his name is not yet known, and the second portrait has no role attached. Named leadership is a strong trust signal on a manufacturer's site — worth filling in.

---

## 13. Deliberate deviations from the reference style guide

The GSAP reference informed the craft here; these four points were adapted rather than copied, and the reasoning should survive into the WordPress build:

- **Buttons use a 12px radius** (your call, replacing the original square edges) — rounded, but deliberately short of the reference's 100px pill.
- **The primary CTA stays a filled orange.** The reference forbids filled CTAs because its visitors arrive already sold. BOKSWA has to convert a contractor who needs a price, so "Request a Quote" stays unmistakable. Secondary and tertiary actions are ghost-outlined per the reference.
- **Three type families, not one.** The reference runs a single family; here the IBM Plex Mono technical layer is load-bearing — it is what makes spec tables and dimension callouts read as engineering rather than marketing.
- **Body line-height is 1.6, not 1.15.** The reference's tight leading suits short UI strings. This site has real paragraphs about curing and compaction, and 1.15 would hurt readability badly.

The five-discipline colour taxonomy (pink / lilac / blue / green) was not adopted at all — a single accent is correct for a construction manufacturer, and those hues would have read as a software product.

---

## 14. Components adapted from the studio-size.com reference

Each follows the same rule as the showpieces: content lives in native widgets, and a hidden HTML widget carries only behaviour that finds them by class or data-attribute.

| Component | Where | What the code does | Content that stays native |
|---|---|---|---|
| **Rotating hero word** | `#hero`, last headline line | Splits each `.bk-rotator__word` into letters and rolls them out/in every 2.6s; pauses when the hero is off screen | Every word is its own span in the heading. **Native alternative:** Elementor Pro's *Animated Headline* widget (Rotating → "Slide Down" or "Typing") does this with zero custom code — prefer it if available |
| **Manifesto** | `#manifesto` | Wraps each word of `[data-reveal-words]` by walking text nodes (inline highlights survive), then brightens words as the paragraph scrolls | The whole paragraph is a Text Editor widget. The orange closing phrase is a normal `<span class="bk-or">` |
| **Hover index** | `products.html #all` | Pairs `.bk-index__item[data-target]` with `.bk-index__img[data-for]`; hover or keyboard focus swaps the preview and caption | Six link widgets (names) and six Image widgets (previews); caption text comes from each link's `data-caption`. On phones the preview hides and names become plain tappable links |
| **Scatter CTA** | `index.html #cta` | Drifts each `.bk-scatter__img` at its own `data-depth`, starting from the `--r` rotation set in its style | Headline, lede, three buttons, and six Image widgets positioned absolutely via `--x` / `--y` / `--w` / `--r`. Three are hidden on phones via `data-mob="hide"` |
| **Arrow-chip links** | Everywhere `.bk-link` appears | None — pure CSS | Text plus a square 44px chip; chip fills orange on hover |
| **Footer wordmark** | Every page footer | Sizes the text in `.bk-footer__mark` to fill its container exactly, then rises it in on scroll | A Heading widget containing "BOKSWA" — change the text and it re-fits itself |
| **Smooth scroll** | Site-wide, desktop only | Lenis, driven by GSAP's ticker so the pinned film stays in sync; off on phones and reduced-motion | — |

### Taken from the reference vs. deliberately not

**Adopted:** rotating final word in the hero; a sentence-case statement paragraph as its own section; the hover-to-preview index; text-plus-chip links; the closing CTA with photographs scattered around a giant headline; the full-width footer wordmark; smooth scrolling.

**Not adopted, on purpose:**
- **6px rounded corners on media.** The brick geometry of the BOKSWA mark is square; rounding the photography softens the industrial tone. Everything stays at 0px.
- **Sentence case headings throughout.** Uppercase Archivo reads as industrial signage, which is right for a manufacturer. Sentence case is used in exactly one place — the manifesto — where the contrast is the point.
- **Round arrow buttons.** Kept square, same reason as the corners.
- **Pure black canvas.** The warmer `#0E100F` from the GSAP reference stays.

---

## 15. Headline system and alignment

- **H1/H2:** Archivo **900**, tracking `-0.022em`, line-height `0.96` — set on the Global Font, not per widget.
- **One heading gap:** every section heading block sits `clamp(40px, 4.5vw, 64px)` above its content (`.bk-head-gap`). In Elementor, set this once as the heading container's bottom padding and reuse it; do not hand-tune per section. It replaces thirteen one-off values that ranged from 34px to 60px.
- **Label → heading → lead:** 20px, then 24px. Always the same.
- **Optical alignment (behaviour hook):** large capitals carry built-in left space — about 5.5% of the font size in Archivo, 0% on "W", up to 7% on others — so 17 of 24 headlines sat 3–6px right of the text below them. `bokswa.js` measures each headline's actual first letter and offsets it exactly, re-running on resize, on font load and whenever the hero's rotating word changes. It reads whatever text is in the widget, so editing a headline in Elementor re-aligns automatically. Put it in the same hidden HTML widget as the other behaviour code. Centered headings are skipped.