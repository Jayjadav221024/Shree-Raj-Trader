# Changelog — Content & Assets Pass

Content and asset localisation against the live reference site
<https://shreerajtraders.in>. **No layout, colour, typography, spacing or
component-structure changes** were made to existing sections.

---

## 1. Images localised

All 64 images are now local `.webp` files under `src/assets/`, imported through
the generated module `src/data/images.js` (which carries `src`, `width` and
`height` for every asset so components can set intrinsic dimensions).

**Zero remote `<img src>` remain.** Total weight **5.36 MB → 1.80 MB (−66%)**.

| Group | Count | Directory |
|---|---|---|
| Site chrome | 3 | `src/assets/site/` |
| Brands | 5 | `src/assets/brands/` |
| Products | 16 | `src/assets/products/` |
| Clients | 13 | `src/assets/clients/` |
| Group companies | 4 | `src/assets/group/` |
| Team | 9 | `src/assets/team/` |
| Gallery | 7 | `src/assets/gallery/` |
| Blog | 7 | `src/assets/blog/` |

`loading="lazy"` is set on every below-the-fold image; `width`/`height` are set
on all of them.

### Site chrome — added
| File | Source | Use |
|---|---|---|
| `site/logo-mini.webp` | `2025/02/logo-mini.png` | Replaces the "SR" text mark in header **and** footer (same container, unchanged size) |
| `site/fav-icon.webp` + `public/favicon.png` | `2025/02/fav-icon.png` | Favicon (was hot-linked to a WP `-150x150` derivative) |
| `site/about-facility.webp` | `2025/05/image-5.jpg` | Photo in `#about` |

### Brands — added
`siemens`, `crompton-greaves`, `hindustan-electric`, `rotomotive` localised;
**`innomotics.webp` added as the missing 5th partner.**

### Products — 1 unique image per card (was 5 shared category images)
| Product | Image |
|---|---|
| siemens-switchgear-low-voltage-power-distribution-product | `Low-Voltage-Power-Distribution-Product.png` |
| low-voltage-control-product | `Low-Voltage-Control-Product.png` |
| mcb | `MCB.png` |
| sinnova | `Sinnova.png` |
| siemens-motor | `siemens-motor-1.png` |
| crompton-greaves-motor | `Crompton-Greaves-Motor.jpg` |
| hindustan-electric-motor | `Hindustan-Electric-Motor.png` |
| grit-top | `Grit-Top.jpg` |
| cheker-plate | `Cheker-Plate.jpg` |
| ladder-type-cable-tray | `Cable-Ladder-1.png` |
| perforated-cable-tray | `WhatsApp-Image-2024-10-16-at-13.27.35.jpeg` → renamed `perforated-cable-tray.webp` |
| meniscus-top | **falls back to `cat-frp-gratings`** — see Live-site bugs |
| gear-box | `gear-box.png` — see TODOs |

The 5 category images were **kept** as category/filter thumbnails
(`cat-switchgears`, `cat-motors`, `cat-gear-box`, `cat-frp-gratings`,
`cat-frp-cable-tray`), as instructed.

### Clients — 13 text names replaced with real logos
Shiva Pharma, Anupam, GEA, GSFC, GACL, Hero, PI Industries, TBEA, Alembic,
Aerzen, R K Bio, Hi-Make, Nayara. Grid markup unchanged.

### Group of Companies — 4 logos added to the existing cards
`Company-Logos-6.jpg`, `Company-Logos-2.jpg`, `Company-Logos-3.jpg`,
`TransPower-Technologies-Logo-PNG-2.png`.

### Team — 9 photos added (not in the original brief; they exist on live)
Dharak Parikh, Abhay Dave, Parag Parikh, Dixit Desai, Naina Mehta,
Jayesh Yadav, Dinesh Padhiyar, Kamal Kushwah, Krunal Soni.

### Gallery — 7 facility photos
`2025/05/image-1` … `image-7` (`image-1`/`image-2` exist only as `-scaled`
originals upstream).

### Blog — 7 featured images
Taken from the WordPress REST API rather than the brief's list, because three
of the filenames in the brief did not match what live actually serves.

### Not imported (as instructed)
WordPress derivative sizes (`-300x157`, `-1024x535`, `-150x150`, …), the GDPR
cookie-plugin logo, and `cropped-Company-Logos-1.jpg`.

### Removed
`public/favicon.svg`, `public/icons.svg` (unused Vite scaffolding).
`src/assets/hero.png` **kept** — no real hero photo was supplied; a `TODO(client)`
sits above its import in `Hero.jsx`.

---

## 2. Data added

All content now lives in `src/data/` — no content strings remain in components.

| Module | Contents |
|---|---|
| `images.js` | Generated: 64 imports + dimensions |
| `products.js` | Generated: 13 products / 5 categories, verbatim live write-ups |
| `blog.js` | Generated: 7 posts, verbatim article text from the WP REST API |
| `team.js` | 3 leadership messages, 9 team members, careers block |
| `content.js` | **Unverified content pending client approval** (see §4) |
| `siteData.js` | Company info, routes, nav, brands, clients, group, gallery, domains |

**Added:**
- **Innomotics** as the 5th brand partner.
- **Long-form product descriptions** for all 13 products, behind the existing
  **SPECS** control — no new UI, the existing panel is just populated. Live spec
  lists render as a "Specifications" list within the same panel.
- **Team block** in `#leadership`, reusing the existing card component: Words
  From Director (Mr. Hemant Patel), Words From Associate Partner
  (Mr. Dharak Parikh), General Manager (Mr. Kiran Parekh — on live, not in the
  brief), the 9 team members, and the "Life @ Shree Raj Traders" careers block
  with CV email `info@shreerajtraders.in`.
- **`/gallery/` route** — 7 photos with lightbox, built from the existing card.
- **`/blog/` and `/blog/:slug/` routes** — 7 posts with verbatim body copy.
- **Footer corporate profile paragraph**, verbatim from the live footer.
- **Footer copyright** → `© Copyright 2012 Shreerajtraders` (exact live wording).

`react-router-dom@7` was added to serve `/gallery/` and `/blog/`, which the
header already linked to. Homepage section markup is unchanged and still renders
at `/`.

---

## 3. Data fixed / removed

| Item | Before | After |
|---|---|---|
| Domain 5 title | "Electrical Distribution" | **"Electrical Components"** (live wording) |
| Domain 6 title | "Logistics Network" | **"Distribution Services"** (live wording) |
| RFQ summary | Hard-coded demo values: "Client: Valued Customer", "Ahmedabad, Gujarat", "2 units", "15 HP @ 1500 RPM" | **Empty state** until the user selects; send/copy disabled while empty |
| Footer copyright | "© Copyright 2012 Shree Raj Traders. All Rights Reserved." | "© Copyright 2012 Shreerajtraders" |
| Favicon | Hot-linked WP `-150x150` derivative | Local `/favicon.png` |

### Contact details verified against live — all already correct
- `+91 97267 88690` / `+91 98256 88690` ✓
- `39, Mahalaxmi Industrial Estate, Near Ghodasar Railway Crossing, Bombay Conductor Road, Vatva, Phase 1, Ahmedabad, Gujarat.` ✓
- `sales@shreerajtraders.in`, `finance@shreerajtraders.in` ✓

---

## 4. Flagged for client approval — `src/data/content.js`

Kept on the site but **not published on live**, and collected in one editable
file. Blank or disable any entry there to drop it from the site.

- Stat counters — `60+`, `8,000+`, `99%`, `10,000+ SKUs`
- EPC Division block (`enabled: true` toggle)
- FAQ section (4 questions)
- Third email `shreerajtraders@rediffmail.com` (live footer lists only two)
- FRP grating figures `Mesh 3838`, `25/30/38 mm`
- Domain card descriptive copy (titles are live; descriptions are not)

Numeric specs **that do appear on live** (`0.5–425 HP`, `16A–1250A`,
`16–55 kA`, `4300 Nm`, `IP55/56/65`) are recorded with `status: 'live'` for
traceability.

---

## 5. Live-site bugs found — flagged, not replicated

1. **Duplicate blog title.** `when-to-replace-industrial-switchgear`
   (2026-08-06) carries the WordPress title *"Why Buy Siemens Motors from an
   Authorized Dealer in Ahmedabad?"* — identical to the 2026-07-31 post. The
   article's own H1 is *"When Should You Replace Industrial Switchgear? 7
   Warning Signs"*. We render the H1; the incorrect WP title is preserved as
   `wpTitle` in `blog.js` so it stays auditable.

2. **Wrong product photo on `/products/meniscus-top/`.** Live serves
   `FRP-Cable-Tray.jpg` — a cable tray, not a grating. We fall back to the FRP
   grating category image pending a correct photo.

3. **Blog slug in the brief was wrong.** `frp-cable-trays-key-features` 404s;
   the real 2026-05-27 slug is **`top-key-features-of-frp-cable-trays`**.

4. **"Electric Drives" is not a product category.** The brief asked for it as a
   6th category, but live exposes exactly five
   (`switchgears`, `motors`, `gear-box`, `frp-gratings`, `frp-cable-tray`) and
   "Electric Drives" appears only as a homepage carousel slide. **Not added as a
   category** — adding one would have invented a taxonomy live does not have.

5. **Typo on the live MCB page** — "ISI markinh". Corrected to "marking" in our
   spec data; the long-form description is otherwise verbatim.

---

## 6. Outstanding TODOs

- `TODO(client)` — real hero photograph (placeholder `hero.png` retained).
- `TODO(client)` — real photos for **Meniscus Top** and for the **ROBUS / QUBO**
  gearbox variants (both currently share the `gear-box` image).
- Live exposes a single `/products/gear-box/` page rather than separate ROBUS and
  QUBO pages, so the Gear Box category holds one product. The nav submenu still
  lists both series; split into two products when the client supplies separate pages.
- `/about-us/`, `/our-team/`, `/contact/`, `/products/` and the
  `/products_category/*` and `/products/*` URLs still resolve to homepage
  anchors. Their canonical paths are recorded in `routes` and
  `productCategoryRoutes` in `siteData.js` and can be promoted to real routes
  now that the router is in place.

---

## 7. Verification

- `npm run build` — passes; 64 images bundled.
- `npm run lint` — clean, zero warnings.
- Routes return HTTP 200: `/`, `/gallery/`, `/blog/`,
  `/blog/when-to-replace-industrial-switchgear/`, `/favicon.png`.
- No remote `wp-content` image references remain in `src/`.

**Not verified:** rendered appearance. No browser/screenshot tool was available
in this session, so the visual result of the new content has not been inspected.
