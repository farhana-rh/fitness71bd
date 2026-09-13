# The Fitness 71 — Website

Static marketing site for The Fitness 71, a gym in Banani, Dhaka.

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no
dependencies to install. Open `index.html` in a browser and it works.

---

## 1. Before you launch — replace these

Everything below is realistic **placeholder** content. Search for the value in
the left column across all `.html` files and replace it.

| What | Placeholder currently in the files | Where |
|---|---|---|
| **Logo** | `assets/img/logo-mark.svg` | See §2 |
| Phone | `+880 1700-000071` and `+8801700000071` | Every page (top bar, header, footer, contact, JSON-LD) |
| WhatsApp | `https://wa.me/8801700000071` | Footer, contact |
| Email | `info@thefitness71.com`, `careers@thefitness71.com` | Footer, contact, trainers |
| Address | `House 42, Road 11, Banani, Dhaka 1213` | Every page |
| Map coordinates | `23.7936, 90.4043` | JSON-LD in `index.html`, `contact.html` |
| Domain | `https://www.thefitness71.com` | `<link rel="canonical">`, Open Graph tags, `sitemap.xml`, `robots.txt` |
| Social links | `facebook.com/thefitness71`, `instagram.com/thefitness71`, `youtube.com/@thefitness71` | Top bar, footer, trainer cards |
| Opening hours | Sat–Thu 6:00 AM – 11:00 PM · Fri 4:00 PM – 10:00 PM · Ladies 2:00–5:00 PM | Top bar, footer, contact, pricing FAQ, JSON-LD |
| Founding year | `2019` / `Since 2019` | `index.html`, `about.html` |
| **Prices** | `X,XXX` / `XX,XXX` / `XXX` / `XX%` | See §3 |
| Statistics | `5` years, `500` members, `40` stations, `8` coaches | `data-count` attributes in `index.html`, `about.html` |
| **Trainers** | 6 profiles with names, bios and certifications | `trainers.html`, plus 4 on `index.html` |
| **Testimonials** | 3 member quotes | `index.html` |
| Google Map | Generic Banani embed | `contact.html` — see §5 |

Sections holding obviously fake content are marked on-page with a dashed
**"Placeholder …"** note. Delete those notes once the real content is in.

> The legal pages (`privacy.html`, `terms.html`) are **template wording**. Have a
> lawyer review them before publishing — they carry an on-page warning too.

---

## 2. The logo

The crest at `assets/img/logo-mark.svg` was drawn to match the described brand —
Spartan helm, flame crest, navy shield, red/orange/yellow palette. **It is a
stand-in for your real logo file.**

**To swap it in — two options:**

**A. Your logo is just the crest/symbol** (no wordmark baked in)
Replace `assets/img/logo-mark.svg` with your file, keeping the same filename.
SVG is best; a transparent PNG at ~300×350 also works. Nothing else to change —
the "THE FITNESS 71" wordmark next to it is HTML text and stays.

**B. Your logo already contains the wordmark**
Replace the file as above, then add `brand--full` to the brand link in every
page's header and footer so the HTML wordmark is hidden:

```html
<a class="brand brand--full" href="index.html" aria-label="The Fitness 71 — home">
```

Also replace `assets/img/favicon.svg` (a flattened, higher-contrast version of
the mark that stays legible at 16px).

The crest is reused as a faint watermark behind the home hero. That picks up your
new file automatically.

---

## 3. Editing prices

Prices are **not** hardcoded in the visible text. Each membership card on
`pricing.html` and `index.html` carries its four term prices as data attributes:

```html
<div class="plan"
     data-price-1="4,500"      <!-- 1 month   -->
     data-price-3="12,800"     <!-- 3 months  -->
     data-price-6="24,300"     <!-- 6 months  -->
     data-price-12="45,900"    <!-- 12 months -->
     data-save-3="Save 5% vs monthly"
     data-save-6="Save 10% vs monthly"
     data-save-12="Save 15% vs monthly">
```

Edit those values and the term toggle picks them up. Also update the fallback
inside `<span class="plan__amount">…</span>` on the same card — that is what
shows before JavaScript runs and what search engines read.

The `৳` sign is a separate `<span class="plan__cur">` so it can be styled
independently (Anton has no Bengali glyph). Leave it outside `plan__amount`.

Personal-training packages, day pass, student and corporate rates are plain text
further down `pricing.html`.

---

## 4. Connecting the contact form

`assets/js/main.js` validates the form and then shows a success message. **It does
not send anything yet.** Find this block near the end of section 7:

```js
// --- Replace this block with a real POST to your backend / form service.
```

Options, cheapest first:

- **Formspree / Web3Forms / Getform** — replace the `<form>` tag on
  `contact.html` with `<form action="https://formspree.io/f/XXXX" method="POST">`
  and delete the `e.preventDefault()` line.
- **Your own PHP endpoint** — POST the fields to a script that emails reception.
- **WhatsApp hand-off** — build a `wa.me` link from the field values.

Field names are already set: `name`, `phone`, `email`, `plan`, `message`, `consent`.

---

## 5. The Google Map

`contact.html` embeds a generic map of Road 11, Banani. To point it at your real
listing: Google Maps → find your business → **Share** → **Embed a map** → copy the
`src` and paste it over the existing `src` on the `<iframe>`.

A styled address block sits behind the iframe and shows automatically if the
embed is blocked or fails to load.

---

## 6. File structure

```
index.html          Home
about.html          About / story / mission
facilities.html     12 facilities + 8 services
trainers.html       6 coach profiles
pricing.html        Plans, PT packages, FAQ
gallery.html        26 photos, filterable, lightbox
contact.html        Details, form, map, directions
privacy.html        Privacy policy (template)
terms.html          Terms & conditions (template)
404.html            Not-found page
robots.txt          Crawler rules
sitemap.xml         Update <lastmod> when you edit pages
site.webmanifest    App icon / theme colour
assets/css/style.css   One stylesheet, sectioned and commented
assets/js/main.js      One script, no dependencies
assets/img/            53 images (see §8)
```

The header and footer are repeated in each HTML file — there is no template
engine. **If you change a nav link, change it in all ten files.**

---

## 7. Design system

Defined as CSS custom properties at the top of `assets/css/style.css`.

| Role | Token | Value |
|---|---|---|
| Page ground | `--ink-900` | `#070A12` near-black navy |
| Surface / cards | `--ink-800` | `#0E1421` |
| Borders | `--ink-600` | `#1F2A40` |
| **Brand red** (accents, rules, large type) | `--red` | `#E8232B` |
| **Button red** (AA contrast with white) | `--red-deep` | `#CE1A20` |
| Orange accent | `--orange` | `#F26B1D` |
| Yellow accent (small text, labels) | `--yellow` | `#FFC21A` |
| Light section | `--bone` | `#F4F2EE` |
| Body text on dark | `--text-mut` | `#AEB6C8` |

**Type:** [Anton](https://fonts.google.com/specimen/Anton) for headings (athletic,
condensed, uppercase) and [Inter](https://fonts.google.com/specimen/Inter) for
body and UI. Loaded from Google Fonts.

**Rules the design follows**, worth keeping if you extend it:

- Square corners everywhere — no rounded cards.
- Red is for emphasis and structure, never large fills except buttons.
- Yellow carries small uppercase labels (it hits ~11:1 contrast on the dark ground;
  red only reaches ~4.2:1, so red is reserved for large text and UI elements).
- Dark by default. Light `--bone` sections are used only for *informational*
  content (why-choose-us, services, FAQ) as a deliberate change of pace.
- One marquee, one watermark per page. Motion stays subtle.

---

## 8. Images

All 53 photographs came from [Pexels](https://www.pexels.com) under the
[Pexels License](https://www.pexels.com/license/) — free for commercial use, no
attribution required. **They are placeholders.** Replace them with real
photographs of the gym as soon as you have them; that is the single biggest thing
that will make this site feel like your gym rather than a template.

Filenames say what each slot is for (`fac-cardio.jpg`, `trainer-3.jpg`,
`hero-about.jpg`). Keep the filename and the aspect ratio and nothing else needs
to change:

| Group | Size | Notes |
|---|---|---|
| `hero-*.jpg`, `cta-band.jpg` | 1920×900 (home 1920×1080) | Dark or mid-tone; text sits on the left |
| `fac-*.jpg` | 1100×800 | Landscape |
| `trainer-*.jpg` | 800×1000 | Portrait, face in the upper third |
| `gal-*.jpg` | 1400 wide, any height | Masonry handles mixed heights |
| `about-*.jpg` | 1200×1400 / 1200×900 | |

Every `<img>` has explicit `width`/`height` (no layout shift), `loading="lazy"`
below the fold, and descriptive `alt` text — **rewrite the alt text** when you swap
in real photos.

---

## 9. Accessibility & browser support

- Skip link, single `<h1>` per page, ordered heading levels.
- Keyboard operable throughout; visible yellow focus rings.
- Mobile nav, FAQ accordion and lightbox carry `aria-expanded` / `aria-current` /
  `aria-hidden`; the lightbox closes on `Esc` and moves with arrow keys.
- FAQ uses native `<details>`, so it still opens with JavaScript disabled.
- Scroll animations are disabled entirely under `prefers-reduced-motion`, and are
  scoped to a `.js` class so nothing is hidden when JavaScript is off.
- Tested Chromium desktop / tablet / mobile at 390px, 820px, 1280px and 1440px.
  Uses `clip-path`-free layouts, CSS custom properties, `clamp()`, grid and
  `IntersectionObserver` — all supported in current Chrome, Edge, Firefox and
  Safari.

---

## 10. Deploying

It is a static site, so anything works: Netlify, Vercel, Cloudflare Pages, GitHub
Pages, or plain cPanel hosting. Upload the whole folder.

After deploying:

1. Point `404.html` at your host's not-found handler (Netlify and Cloudflare pick
   it up automatically; on Apache add `ErrorDocument 404 /404.html`).
2. Submit `sitemap.xml` in Google Search Console.
3. Create the Google Business Profile for the gym and make sure the name, address,
   phone and hours match this site **exactly** — that consistency is what local
   search ranks on.

### SEO already in place

Unique titles and meta descriptions per page, canonical URLs, Open Graph and
Twitter card tags, `LocalBusiness`/`ExerciseGym` structured data on the home and
contact pages, `BreadcrumbList` on inner pages, and `FAQPage` structured data on
the pricing FAQ. Update the JSON-LD blocks when you change the address, phone or
hours — they are in the `<head>` of `index.html` and `contact.html`.
