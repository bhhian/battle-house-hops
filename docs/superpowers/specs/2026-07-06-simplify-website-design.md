# Battle House Hops — Website Simplification & Redesign

**Date:** 2026-07-06
**Status:** Design — awaiting review
**Intent:** Production deliverable (live site at battlehousehops.ca via GitHub Pages)

---

## 1. Overview

The current site is text-heavy and spread across 5 nav pages + 8 product detail pages. This
redesign collapses it into **2 nav-reachable pages**, cuts roughly two-thirds of the copy,
makes photography the hero, and applies a new visual direction ("Fresh Cut" — modern, minimal).
It stays a hand-written static HTML/CSS/JS site with no build step, deployed as-is to GitHub Pages.

### Goals
- Fewer pages, far less text, big images.
- Keep the per-variety testing numbers (Alpha / Beta / HSI) — they matter to brewers.
- Collapse the shop's product detail pages into the Shop page itself.
- Adopt the "Fresh Cut" modern-minimal style (approved via visual mockups).
- Use the real brand assets (logo, farm/hop photos, packaging shot, merch).
- Make sold-out/status a live text element, not baked into images.

### Non-goals
- No framework, bundler, or CMS. Still plain HTML/CSS/JS.
- No e-commerce/cart. Shop remains informational + external links (as today).
- The **Brewers page stays orphaned and untouched** (not restyled, not linked).

---

## 2. Information architecture

**Before → After**

| Current | Fate |
|---|---|
| `index.html` (home) | **Rebuilt** — single-scroll home |
| `hops.html` | **Deleted** — hops fold into home (+ shop) |
| `farm.html` | **Deleted** — farm folds into home |
| `shop.html` | **Rebuilt** — self-contained, products inline |
| `products/*.html` (8 pages) | **Deleted** — collapsed into shop |
| `brewers.html` | **Untouched** — remains orphaned |

**Final nav:** Home · Shop · Contact (Contact = anchor/email, not a page).

**Result:** 5 nav pages + 8 product pages → **2 pages** (home + shop), plus the orphaned brewers page.

---

## 3. Page specs

### 3.1 `index.html` — single-scroll home

1. **Sticky nav** — crest mark + "BATTLE HOUSE HOPS" wordmark (left); Home / Shop / Contact (right); hamburger on mobile.
2. **Hero (split)** — left: kicker "FRESH · LOCAL · ONTARIO", oversized uppercase headline ("HOPS, GROWN RIGHT." or similar), one accent link → Shop. Right: full-bleed `hops-field.jpg` (sun-flare trellis). Stacks on mobile (image below text).
3. **Our Hops** — section head "OUR HOPS" + "3 varieties · tested yearly". Row of 3 cards: variety image (see §5), uppercase name, one short flavor line (≤12 words), and the three numbers (Alpha / Beta / HSI). Each links to its entry on the Shop page. No essays, no brewery lists, no style tags, no resource links.
4. **Farm** — full-width band: `battle-house.jpg` on one side; charcoal panel with "FROM FARM TO TAP", ~2-sentence heritage blurb (RCMP-training-ground → hop yard), and 3 stats (1,200 strings/yr · 20 acres · Est. 2021).
5. **Shop CTA** — one line + button → Shop.
6. **Contact** — short line + `mailto:ian@battlehousehops.ca` + Instagram/Facebook.
7. **Footer** — charcoal; `name.png` wordmark (inverted white); nav links; social; © line.

### 3.2 `shop.html` — self-contained

1. Same nav + footer.
2. **Header** — "SHOP".
3. **Status banner** — live text (e.g. "2025 HARVEST — SOLD OUT"), editable in markup.
4. **Fresh Hops** — 3 cards: variety image, name, the three numbers, a **live status pill** (In Stock / Almost Gone / Sold Out), and the short "available as / use / aroma" detail collapsed inline here (this is where the deeper per-variety copy from the old hops.html lives, trimmed). No separate detail pages.
5. **Apparel & Accessories** — grid of the 5 merch items (shirt, dept shirt, artist shirt, magnet, stickers): image, name, status/"view" text. Detail inline; external purchase links preserved where they exist.
6. Feature the `product.png` packaging shot prominently.

### 3.3 Deletions
`hops.html`, `farm.html`, `products/` (all 8), and the stray `css/Untitled` file. Redirect concern: these were not linked externally that we know of; internal links get repointed to `index.html`/`shop.html` anchors.

---

## 4. Visual design system — "Fresh Cut"

- **Type:** `Space Grotesk` (display — uppercase, tight tracking on big headings) + `Inter` (body). Replaces Playfair/Montserrat. Note: the existing logo's bold uppercase lettering pairs naturally with Space Grotesk.
- **Color:**
  - Warm white `#faf8f3` (page)
  - Charcoal `#141414` (text, dark panels, footer)
  - Hop-green accent `#5f8226` (links, kickers, rules, pills)
  - Neutral grays for meta text (`#8a8a8a`, `#9a9a9a`) and hairlines (`#e4e0d6`)
- **Layout:** generous whitespace, gallery feel, thin 1px dividers, section heads with a baseline rule, split/asymmetric hero, full-bleed image bands.
- **Components:** nav, split hero, section head (title + meta + rule), hop card (image / name / numbers), stat block, **status pill** (green=in stock, amber=almost gone, gray=sold out), text-link with accent underline, button, dark footer.
- **Motion:** minimal — subtle fade/slide on scroll (reuse/trim existing `main.js` behavior), hover states on links/cards.
- **Responsive:** desktop → single-column mobile; hero text-over-image or stacked; 3-up card rows become 1-up; hamburger menu retained.
- **Accessibility:** maintain color contrast (charcoal on warm white passes; check accent-on-white for text — use accent mainly for non-text/large text or darken if needed), alt text on all images, focus states.

---

## 5. Per-variety hop images (the one asset gap)

Decision: **AI-generated photography, produced by the user from prompts I provide.** Until final
images arrive, cards use a styled on-brand placeholder (tinted panel + crest + variety name) so the
site never looks broken.

- **Slots / filenames (1:1, ~1200×1200, `.jpg`):** `images/hop-cascade.jpg`, `images/hop-centennial.jpg`, `images/hop-galena.jpg`.
- **Placeholder:** `images/hop-placeholder` treatment via CSS (no missing-image state).
- **Do NOT reuse** `shop-cascade.png` / `shop-centennial.png` / `shop-galena.png` — they have "SOLD OUT" / "ALMOST GONE!" baked in. Status becomes a live pill instead.
- Consistent framing across all three so they read as a set; differentiation primarily via name + numbers, with a subtle real-brand prop for authenticity.

**Generation prompts (drop into Midjourney / DALL·E / Figma AI, 1:1):**

Shared base: *"Editorial product photograph of fresh green hop cones (Humulus lupulus), soft natural daylight, shallow depth of field, warm off-white background (#faf8f3), minimalist modern craft-agriculture aesthetic, square 1:1, high detail, no text overlays, no watermark."*

- **Valley Cascade** — base + *"a small hand-branded burnt-wood sign reading 'CASCADE' leaning beside a cluster of bright, freshly-picked cascade hop cones; airy, citrus-fresh feel."*
- **Lanark Centennial** — base + *"a small hand-branded burnt-wood sign reading 'CENTENNIAL' beside dense centennial hop cones with a sprig of pine; slightly cooler light."*
- **Northern Galena** — base + *"a small hand-branded burnt-wood sign reading 'GALENA' beside plump galena hop cones on weathered wood; earthy, robust feel."*

(The burnt-wood sign mirrors the farm's real "CENTENNIAL 21" markers for brand authenticity.)

---

## 6. Content rewrite guidance

- **Cut:** the "Demand Quality / Numbers Are Important / Understanding Beer" essays and resource links; per-variety brewery lists and beer-style tag clouds; the multi-section farm history essay.
- **Keep (trimmed):** one short flavor line per variety; Alpha/Beta/HSI numbers; a 2-sentence farm story; the 3 farm stats; OHGA membership can move to a small footer mention or drop.
- **Tone:** confident, spare, few words per section. Headlines uppercase; body short.

---

## 7. Technical approach

- Rework `css/styles.css` into the new design system (new tokens, remove unused rules from deleted pages). Keep Google Fonts via `<link>` (swap families).
- Rewrite `index.html` and `shop.html`. Nav + footer are duplicated inline per page (no templating) — keep them consistent by hand across both pages.
- Trim `js/main.js` to what's still used (mobile menu toggle, scroll reveal).
- Delete removed files; repoint internal links.
- No build/deploy changes — `deploy.yml`, `CNAME`, `package.json` (dev-server helpers) untouched.

---

## 8. Housekeeping (in scope, since we're in these files)
- Delete stray `css/Untitled`.
- Update `README.md` "Project Structure" (currently lists nonexistent `.svg` files and omits real pages) to reflect the new 2-page structure.

---

## 9. Out of scope / open items
- Merch product backgrounds are inconsistent (some on pale-green circles); left as-is for now, could be normalized later.
- No redirects/301s (static GitHub Pages) — deleted URLs will 404; acceptable given they weren't promoted.
- Final variety photos depend on the user running the prompts; site ships with placeholders until then.

---

## 10. Success criteria
- Site is **2 pages** (+ orphaned brewers), visibly lighter on text, image-forward.
- "Fresh Cut" style applied consistently (type, color, spacing, components).
- All real brand assets used; no baked-in status text; status is live.
- Numbers (Alpha/Beta/HSI) present on both home and shop.
- Loads and renders correctly on mobile and desktop; deploys cleanly to GitHub Pages.
