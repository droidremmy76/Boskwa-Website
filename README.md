# BOKSWA Investments (U) Limited — website

Static HTML build. 12 pages, no build step required to view. Serve the `site/` folder
over HTTP so the video and fonts load with the right types — a zero-dependency server
is included:

```bash
node build/serve.js
```

Then open http://localhost:8731. Opening `site/index.html` directly from disk also
works, but the hero video may not seek properly without a server.

---

## Structure

```
site/
  index.html                    Home — hand-authored (the showpiece-heavy page)
  products.html                 Full range + product explorer
  product-hollow-blocks.html    ┐
  product-solid-blocks.html     │
  product-pavers-louvers.html   ├─ six product detail pages
  product-kerb-stones.html      │
  product-maxpans.html          │
  product-fence-poles.html      ┘
  manufacturing.html            Aggregate → dispatch, six stages
  projects.html                 Filterable application gallery
  about.html                    Company, people, location
  contact.html                  Contact + request-a-quote flow
  assets/
    css/bokswa.css              All styling. Tokens at the top.
    css/fonts.css               Self-hosted @font-face declarations
    js/bokswa.js                All behaviour. Contains no content.
    img/                        183 responsive JPEGs (800 / 1200 / 1800px)
    video/bokswa-yard.mp4       Hero loop, 4.46MB
    fonts/                      28 subsetted woff2 files
    vendor/                     GSAP + ScrollTrigger + Lenis + Font Awesome 5 (all local)
build/
  data.js                       All page copy and product data
  generate.js                   Regenerates the 11 non-home pages
  serve.js                      Local preview server (no dependencies)
ELEMENTOR-BUILD.md              WordPress / Elementor translation sheet
```

Nothing loads from a remote URL. Fonts, icons and GSAP are all vendored locally,
so the site works offline and nothing breaks when it moves to WordPress.

## Regenerating pages

`index.html` is hand-authored and is never touched by the generator. The other 11
pages are built from `build/data.js`:

```bash
node build/generate.js
```

Edit copy in `build/data.js`, re-run, and all 11 pages update consistently.
If you change the navigation, update `NAV` in `data.js` **and** the header block in
`index.html`.

## Contact points — change in one place each

| What | Where |
|---|---|
| Phone, WhatsApp, email (runtime) | `BOKSWA` object at the top of `assets/js/bokswa.js` |
| Phone, WhatsApp, email (markup) | `TEL` / `TEL2` / `WA` / `EMAIL` constants in `build/generate.js`, then regenerate |
| Social handles | `data-social` links in the footer — currently `bokswainvestment` |

Real `href`s are written into the HTML as well as held in JS, so every call,
WhatsApp and email link works with JavaScript disabled.

## Performance

| | Initial load |
|---|---|
| Mobile (375px) | **2.7MB** — no video downloaded at all |
| Desktop (1440px) | **11.7MB** — includes the hero video and twelve 1800px film frames |

The hero video carries no `autoplay` or `preload` attribute in the markup; JavaScript
opts capable devices in. Phones and reduced-motion visitors get the poster frame only.

Desktop is deliberately image-heavy because the film section is the signature of the
site. If you want it lighter, the single biggest lever is dropping the film frames
from the 1800px tier to 1200px in `index.html`.

## Accessibility and motion

- `prefers-reduced-motion` disables all animation and reveals content immediately.
- A lightweight mode (`html.bk-lite`) triggers on screens under 861px, on reduced-motion,
  and on very low-core devices. The pinned film degrades to a stacked photo-essay that
  reads well on its own rather than looking like a broken desktop layout.
- The product explorer is a proper ARIA tablist with arrow-key navigation.
- Skip link, focus-visible outlines, and alt text on every content image.

## Known gaps

Listed in full at the end of `ELEMENTOR-BUILD.md`. In short: technical specs are marked
"To confirm" rather than invented, social URLs are assumed, and there is no fence-pole
or finished-driveway photography in the supplied media.
