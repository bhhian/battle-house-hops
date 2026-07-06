# Battle House Hops — Website Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the site to two image-forward pages (single-scroll home + self-contained shop) in the modern-minimal "Fresh Cut" style, using real brand assets.

**Architecture:** Hand-written static HTML/CSS/JS, no build step. One shared stylesheet (`css/styles.css`) defines the design system; `index.html` and `shop.html` each inline the same nav + footer markup (no templating). `js/main.js` handles the mobile menu and scroll reveal. Deploys as-is to GitHub Pages on push to `main`.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, `clamp()`), vanilla JS (IntersectionObserver), Google Fonts (Space Grotesk + Inter). No dependencies, no bundler.

## Global Constraints

- Fonts: `Space Grotesk` (display, uppercase headings) + `Inter` (body). Load via one Google Fonts `<link>`. Remove Playfair Display / Montserrat.
- Palette (exact): page `#faf8f3`, ink `#141414`, accent `#5f8226`, accent-bright `#9cbf5f`, muted `#8a8a8a` / `#9a9a9a`, hairline `#e4e0d6`, panel `#efece3`.
- Two nav-reachable pages only: **Home** (`index.html`) + **Shop** (`shop.html`). Nav = Home · Shop · Contact (Contact is an anchor `index.html#contact`, not a page).
- `brewers.html` is **not touched** and **not linked**.
- Per-variety testing numbers must appear on both pages: Cascade α4.9 / β6.4 / HSI 0.13; Centennial α10.9 / β3.2 / HSI 0.22; Galena α9.8 / β7.6 / HSI 0.17.
- Sold-out/status is a **live text pill in markup**, never baked into an image. Do not reuse `shop-cascade.png` / `shop-centennial.png` / `shop-galena.png` (they have status baked in).
- Per-variety photos are pending (user-generated). Cards ship with an auto-upgrading placeholder; expected files: `images/hop-cascade.jpg`, `images/hop-centennial.jpg`, `images/hop-galena.jpg` (1:1). These three are the ONLY intentionally-missing assets.
- Commit after every task. Work stays on branch `redesign/simplify-fresh-cut`. Do not push (user decides when to merge).

---

## File Structure

- `css/styles.css` — **rewritten**: the entire Fresh Cut design system (tokens, base, nav, hero, hops, farm, cta, contact, shop, merch, footer, status pill, reveal, responsive).
- `index.html` — **rewritten**: single-scroll home (nav, hero, hops, farm, cta, contact, footer).
- `shop.html` — **rewritten**: nav, page head, announce, shop feature, fresh-hops, apparel, footer.
- `js/main.js` — **rewritten**: mobile menu toggle + IntersectionObserver reveal. (Drops the old contact-form/notification code — there is no form.)
- `README.md` — **updated**: Project Structure section.
- **Deleted:** `hops.html`, `farm.html`, `products/` (8 files), `css/Untitled`.
- **Untouched:** `brewers.html`, `CNAME`, `.github/workflows/deploy.yml`, `package.json`, `images/*` (existing).

### Standard verification helpers (used by tasks)

Serve the site from the repo root in the background, then curl/grep. Run from repo root:

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 &
echo $! > /tmp/bhh-serve.pid
sleep 1
```

Stop it when done:

```bash
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Asset-existence check for a page (flags broken local `src`/`href`, ignoring the three known-pending hop photos):

```bash
check_assets(){ grep -oE '(src|href)="[^":#]+\.(png|jpg|jpeg|svg|css|js)"' "$1" \
  | sed -E 's/.*="([^"]+)"/\1/' | sort -u \
  | while read -r a; do [ -f "$a" ] || echo "MISSING: $a"; done; }
# usage: check_assets index.html   (expected output: nothing, except possibly the hop-*.jpg slots)
```

Also confirm a browser render manually when possible (`npm run dev` → http://localhost:3000).

---

## Task 1: Design system CSS + page shell (nav + footer)

Rewrites the stylesheet with the full design system and rebuilds `index.html` down to an empty `<main>` so the nav, footer, fonts, and tokens are viewable.

**Files:**
- Modify (replace contents): `css/styles.css`
- Modify (replace contents): `index.html`

**Interfaces:**
- Produces (CSS classes consumed by later tasks): `.wrap`, `.kicker`, `.rule`, `.link-accent`, `.btn`/`.btn--solid`, `.site-nav`+`.site-nav__in`+`.brand`+`.brand__wm`+`.nav-links`+`.nav-toggle`, `.section`, `.section-head`, `.status`/`.status--in`/`.status--low`/`.status--out`, `.site-footer`+`.site-footer__in`+`.footer-nav`+`.footer-social`+`.footer-copy`, `.reveal`/`.reveal.in`, and `img.brand-lockup`.
- Produces (shared markup): the `<header class="site-nav">…</header>` and `<footer class="site-footer">…</footer>` blocks, copied verbatim into `shop.html` in Task 6.

- [ ] **Step 1: Replace `css/styles.css` with the design system**

```css
/* ===========================================================
   Battle House Hops — "Fresh Cut" design system
   =========================================================== */
:root{
  --white:#faf8f3; --ink:#141414; --accent:#5f8226; --accent-bright:#9cbf5f;
  --muted:#8a8a8a; --muted-2:#9a9a9a; --hair:#e4e0d6; --panel:#efece3;
  --font-display:'Space Grotesk',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
  --wrap:1160px; --pad:clamp(20px,5vw,40px);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font-body);color:var(--ink);background:var(--white);line-height:1.6;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
h1,h2,h3,h4{font-family:var(--font-display);font-weight:700;line-height:1.02;letter-spacing:-.01em}
[id]{scroll-margin-top:84px}

.wrap{max-width:var(--wrap);margin:0 auto;padding-left:var(--pad);padding-right:var(--pad)}
.kicker{font:600 11px/1 var(--font-body);letter-spacing:.22em;text-transform:uppercase;color:var(--accent)}
.rule{width:52px;height:3px;background:var(--accent)}
.link-accent{font:600 13px/1 var(--font-display);text-transform:uppercase;letter-spacing:.1em;border-bottom:2px solid var(--accent);padding-bottom:5px;display:inline-block;transition:color .2s}
.link-accent:hover{color:var(--accent)}
.btn{display:inline-block;font:600 13px/1 var(--font-display);text-transform:uppercase;letter-spacing:.08em;padding:15px 28px;border:2px solid var(--ink);background:transparent;color:var(--ink);cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.btn:hover{background:var(--ink);color:var(--white)}
.btn--solid{background:var(--ink);color:var(--white)}
.btn--solid:hover{background:var(--accent);border-color:var(--accent);color:var(--white)}

/* ---- nav ---- */
.site-nav{position:sticky;top:0;z-index:50;background:var(--white);border-bottom:1px solid var(--hair)}
.site-nav__in{display:flex;align-items:center;justify-content:space-between;padding:14px var(--pad);max-width:var(--wrap);margin:0 auto}
.brand{display:flex;align-items:center;gap:12px}
.brand img{width:32px;height:32px}
.brand__wm{font:700 13px/1 var(--font-display);letter-spacing:.24em;text-transform:uppercase}
.nav-links{display:flex;gap:26px;list-style:none}
.nav-links a{font:500 11px/1 var(--font-body);letter-spacing:.13em;text-transform:uppercase;padding:6px 0;border-bottom:2px solid transparent;transition:border-color .2s}
.nav-links a:hover,.nav-links a.active{border-color:var(--accent)}
.nav-toggle{display:none;background:none;border:0;cursor:pointer;width:28px;height:22px;position:relative}
.nav-toggle span,.nav-toggle span::before,.nav-toggle span::after{content:"";position:absolute;left:0;width:28px;height:2px;background:var(--ink);transition:.25s}
.nav-toggle span{top:10px}
.nav-toggle span::before{top:-8px}
.nav-toggle span::after{top:8px}

/* ---- section + section head ---- */
.section{padding:clamp(40px,7vw,64px) 0}
.section-head{display:flex;align-items:baseline;justify-content:space-between;gap:20px;border-bottom:1px solid var(--ink);padding-bottom:12px;margin-bottom:clamp(24px,4vw,34px)}
.section-head h2{font-size:clamp(17px,2.4vw,20px);text-transform:uppercase;letter-spacing:.16em}
.section-head span{font:500 11px/1 var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);white-space:nowrap}

/* ---- hero ---- */
.hero{display:grid;grid-template-columns:1fr 1.05fr;min-height:min(78vh,620px)}
.hero__text{display:flex;flex-direction:column;justify-content:center;gap:18px;padding:clamp(32px,6vw,64px) var(--pad)}
.hero h1{font-size:clamp(40px,7vw,72px);text-transform:uppercase}
.hero__media{background:center/cover no-repeat}

/* ---- hops (home) ---- */
.hops-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(20px,3vw,34px)}
.hop{display:block}
.hop__figure{position:relative;aspect-ratio:1/1;background:var(--panel);overflow:hidden}
.hop__figure::before{content:"";position:absolute;inset:0;background:url(../images/crest.png) center/38% no-repeat;opacity:.10}
.hop__figure::after{content:attr(data-variety);position:absolute;left:0;right:0;bottom:16px;text-align:center;font:600 11px/1 var(--font-display);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.hop__figure img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .4s}
.hop:hover .hop__figure img{transform:scale(1.03)}
.hop__name{font-size:16px;text-transform:uppercase;letter-spacing:.03em;margin:14px 0 8px}
.hop__flavor{font-size:13px;color:#555;margin-bottom:14px}
.nums{display:flex;gap:20px;border-top:1px solid var(--hair);padding-top:12px}
.num__k{display:block;font:500 9px/1 var(--font-body);letter-spacing:.1em;text-transform:uppercase;color:var(--muted-2);margin-bottom:4px}
.num__v{font:600 16px/1 var(--font-display)}

/* ---- farm ---- */
.farm{display:grid;grid-template-columns:1.1fr 1fr}
.farm__media{min-height:340px;background:center/cover no-repeat}
.farm__body{background:var(--ink);color:var(--white);display:flex;flex-direction:column;justify-content:center;gap:16px;padding:clamp(36px,5vw,56px) var(--pad)}
.farm__body .kicker{color:var(--accent-bright)}
.farm__body h2{font-size:clamp(26px,4vw,34px);text-transform:uppercase}
.farm__body p{font-size:14px;color:#d8d5cc;max-width:42ch}
.stats{display:flex;gap:32px;margin-top:8px}
.stat__n{font:700 26px/1 var(--font-display)}
.stat__l{font:500 9.5px/1 var(--font-body);letter-spacing:.12em;text-transform:uppercase;color:var(--muted-2);margin-top:6px;display:block}

/* ---- cta + contact ---- */
.cta{text-align:center;padding:clamp(48px,7vw,72px) 0}
.cta h2{font-size:clamp(24px,4vw,34px);text-transform:uppercase;margin-bottom:14px}
.cta p{color:#555;margin-bottom:24px}
.contact{text-align:center;padding:clamp(40px,6vw,64px) 0;border-top:1px solid var(--hair)}
.contact h2{font-size:clamp(24px,4vw,34px);text-transform:uppercase;margin-bottom:14px}
.contact p{color:#555;margin-bottom:22px}
.socials{display:flex;gap:14px;justify-content:center;margin-top:20px}
.socials a{width:40px;height:40px;border-radius:50%;border:1px solid var(--hair);display:grid;place-items:center;transition:border-color .2s}
.socials a:hover{border-color:var(--accent)}
.socials img{width:18px;height:18px}

/* ---- shop ---- */
.announce{background:var(--ink);color:var(--white);text-align:center;font:600 11px/1 var(--font-display);letter-spacing:.14em;text-transform:uppercase;padding:14px}
.page-head{padding:clamp(36px,6vw,64px) 0 0}
.page-head h1{font-size:clamp(40px,8vw,80px);text-transform:uppercase}
.shop-feature{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,44px);align-items:center;padding:clamp(32px,5vw,56px) 0}
.shop-feature__pic{background:#fff;border:1px solid var(--hair);display:grid;place-items:center;padding:22px}
.shop-feature__pic img{max-height:340px;width:auto}
.shop-feature__body h2{font-size:clamp(26px,4vw,36px);text-transform:uppercase;margin-bottom:14px}
.shop-feature__body p{color:#555;max-width:38ch;margin-bottom:22px}
.shop-hops{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(20px,3vw,34px)}
.shop-hop__top{display:flex;align-items:center;justify-content:space-between;margin:14px 0 6px}
.shop-hop__name{font-size:16px;text-transform:uppercase}
.detail{margin-top:10px;border-top:1px solid var(--hair);padding-top:12px;display:grid;gap:8px}
.detail__row{font-size:12.5px;color:#555}
.detail__row b{font:600 10px/1 var(--font-display);color:var(--ink);text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:3px}
.merch-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(18px,2.5vw,28px)}
.merch__figure{aspect-ratio:1/1;background:var(--panel);overflow:hidden}
.merch__figure img{width:100%;height:100%;object-fit:cover}
.merch__name{font:600 14px/1.2 var(--font-display);text-transform:uppercase;margin:12px 0 6px}
.merch__meta{font:500 11px/1 var(--font-body);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}

/* ---- status pill ---- */
.status{display:inline-block;font:600 10px/1 var(--font-display);letter-spacing:.12em;text-transform:uppercase;padding:6px 11px;border-radius:999px}
.status--in{background:#e6efdc;color:#3f5c17}
.status--low{background:#fbeecb;color:#8a6a12}
.status--out{background:#eceae4;color:#8a8a8a}

/* ---- footer ---- */
.site-footer{background:var(--ink);color:var(--white)}
.site-footer__in{max-width:var(--wrap);margin:0 auto;padding:40px var(--pad);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.site-footer img.brand-lockup{width:130px;filter:invert(1)}
.footer-nav{display:flex;gap:22px;flex-wrap:wrap}
.footer-nav a{font:500 11px/1 var(--font-body);letter-spacing:.12em;text-transform:uppercase;color:#cfccc3;transition:color .2s}
.footer-nav a:hover{color:var(--white)}
.footer-social{display:flex;gap:12px}
.footer-social a{width:34px;height:34px;border-radius:50%;background:var(--white);display:grid;place-items:center}
.footer-social img{width:18px;height:18px}
.footer-copy{border-top:1px solid #2a2a2a;padding:16px var(--pad);text-align:center;font-size:11px;color:#8a8a8a;letter-spacing:.04em}

/* ---- scroll reveal ---- */
.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
.reveal.in{opacity:1;transform:none}

/* ---- responsive ---- */
@media(max-width:980px){
  .merch-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:760px){
  .hero,.farm,.shop-feature,.hops-grid,.shop-hops,.merch-grid{grid-template-columns:1fr}
  .hero__media{min-height:46vh}
  .farm__media{min-height:260px}
  .nav-toggle{display:block}
  .nav-links{position:fixed;inset:55px 0 auto 0;background:var(--white);flex-direction:column;gap:0;border-bottom:1px solid var(--hair);transform:translateY(-130%);transition:transform .28s;padding:8px var(--pad) 16px}
  .nav-links.open{transform:none}
  .nav-links a{padding:14px 0;border-bottom:1px solid var(--hair)}
}
```

- [ ] **Step 2: Replace `index.html` with the shell (nav + empty main + footer)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Battle House Hops | Fresh. Local. Ontario Hops.</title>
    <meta name="description" content="Fresh, local Ontario hops. Grown, harvested, and packed on our farm in Almonte.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="icon" type="image/png" href="images/favicon.png">
</head>
<body>
    <header class="site-nav">
        <div class="site-nav__in">
            <a href="index.html" class="brand">
                <img src="images/crest.png" alt="">
                <span class="brand__wm">Battle House Hops</span>
            </a>
            <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span></button>
            <ul class="nav-links">
                <li><a href="index.html" class="active">Home</a></li>
                <li><a href="shop.html">Shop</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </header>

    <main>
        <!-- sections added in Tasks 2-4 -->
    </main>

    <footer class="site-footer">
        <div class="site-footer__in">
            <img class="brand-lockup" src="images/name.png" alt="Battle House Hops">
            <nav class="footer-nav">
                <a href="index.html">Home</a>
                <a href="shop.html">Shop</a>
                <a href="#contact">Contact</a>
            </nav>
            <div class="footer-social">
                <a href="https://www.instagram.com/battlehousehops/" target="_blank" rel="noopener noreferrer"><img src="images/instagram.png" alt="Instagram"></a>
                <a href="https://www.facebook.com/battlehousehops" target="_blank" rel="noopener noreferrer"><img src="images/facebook.png" alt="Facebook"></a>
            </div>
        </div>
        <div class="footer-copy">&copy; 2026 Battle House Hops. All rights reserved.</div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify shell renders and assets resolve**

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 & echo $! > /tmp/bhh-serve.pid; sleep 1
check_assets(){ grep -oE '(src|href)="[^":#]+\.(png|jpg|jpeg|svg|css|js)"' "$1" | sed -E 's/.*="([^"]+)"/\1/' | sort -u | while read -r a; do [ -f "$a" ] || echo "MISSING: $a"; done; }
check_assets index.html
curl -s http://localhost:8080/index.html | grep -c 'brand__wm'
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Expected: `check_assets` prints nothing (all of crest/name/instagram/facebook/favicon/styles/main exist). The grep prints `1`. Manually: open `npm run dev` → nav shows crest + wordmark in Space Grotesk, dark footer shows the inverted white lockup, fonts are the new pair (not serif).

- [ ] **Step 4: Commit**

```bash
git add css/styles.css index.html
git commit -m "feat: add Fresh Cut design system and rebuild home shell"
```

---

## Task 2: Home hero (split)

**Files:**
- Modify: `index.html` (replace the `<!-- sections added -->` comment inside `<main>` — this task inserts the hero as the first child of `<main>`).

**Interfaces:**
- Consumes: `.hero`, `.hero__text`, `.hero__media`, `.kicker`, `.rule`, `.link-accent` (Task 1).

- [ ] **Step 1: Insert the hero as the first element inside `<main>`**

```html
        <section class="hero">
            <div class="hero__text">
                <span class="kicker">Fresh · Local · Ontario</span>
                <span class="rule"></span>
                <h1>Hops,<br>grown right.</h1>
                <a href="shop.html" class="link-accent">Shop the harvest →</a>
            </div>
            <div class="hero__media" style="background-image:url('images/hops-field.jpg')" role="img" aria-label="Sun over the Battle House hop trellis"></div>
        </section>
```

- [ ] **Step 2: Verify**

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 & echo $! > /tmp/bhh-serve.pid; sleep 1
curl -s http://localhost:8080/index.html | grep -c 'hero__media'
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Expected: prints `1`. Manually: hero is a two-column split — headline left, sun-flare trellis photo right; collapses to stacked on a narrow window.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add home hero"
```

---

## Task 3: Home "Our Hops" section

Three variety cards with auto-upgrading image placeholders and the testing numbers.

**Files:**
- Modify: `index.html` (insert after the `</section>` closing the hero, inside `<main>`).

**Interfaces:**
- Consumes: `.section`, `.wrap`, `.section-head`, `.hops-grid`, `.hop`, `.hop__figure`, `.hop__name`, `.hop__flavor`, `.nums`, `.num__k`, `.num__v` (Task 1).
- Note: the `<img>` inside `.hop__figure` uses `onerror="this.style.display='none'"` so a missing `images/hop-*.jpg` falls back to the CSS placeholder (crest watermark + variety name from `data-variety`). When the real photo is dropped in, it loads and covers the placeholder — no markup change needed.

- [ ] **Step 1: Insert the hops section**

```html
        <section class="section" id="hops">
            <div class="wrap">
                <div class="section-head">
                    <h2>Our Hops</h2>
                    <span>3 varieties · tested yearly</span>
                </div>
                <div class="hops-grid">
                    <a class="hop" href="shop.html#cascade">
                        <div class="hop__figure" data-variety="Valley Cascade">
                            <img src="images/hop-cascade.jpg" alt="Valley Cascade hops" onerror="this.style.display='none'">
                        </div>
                        <h3 class="hop__name">Valley Cascade</h3>
                        <p class="hop__flavor">Bright citrus and grapefruit — the hop that defined American Pale Ale.</p>
                        <div class="nums">
                            <div><span class="num__k">Alpha</span><span class="num__v">4.9</span></div>
                            <div><span class="num__k">Beta</span><span class="num__v">6.4</span></div>
                            <div><span class="num__k">HSI</span><span class="num__v">0.13</span></div>
                        </div>
                    </a>
                    <a class="hop" href="shop.html#centennial">
                        <div class="hop__figure" data-variety="Lanark Centennial">
                            <img src="images/hop-centennial.jpg" alt="Lanark Centennial hops" onerror="this.style.display='none'">
                        </div>
                        <h3 class="hop__name">Lanark Centennial</h3>
                        <p class="hop__flavor">Piney citrus "Super Cascade" — bold, well-rounded, built for IPAs.</p>
                        <div class="nums">
                            <div><span class="num__k">Alpha</span><span class="num__v">10.9</span></div>
                            <div><span class="num__k">Beta</span><span class="num__v">3.2</span></div>
                            <div><span class="num__k">HSI</span><span class="num__v">0.22</span></div>
                        </div>
                    </a>
                    <a class="hop" href="shop.html#galena">
                        <div class="hop__figure" data-variety="Northern Galena">
                            <img src="images/hop-galena.jpg" alt="Northern Galena hops" onerror="this.style.display='none'">
                        </div>
                        <h3 class="hop__name">Northern Galena</h3>
                        <p class="hop__flavor">Clean, high-alpha bittering with sweet fruit and blackcurrant.</p>
                        <div class="nums">
                            <div><span class="num__k">Alpha</span><span class="num__v">9.8</span></div>
                            <div><span class="num__k">Beta</span><span class="num__v">7.6</span></div>
                            <div><span class="num__k">HSI</span><span class="num__v">0.17</span></div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Verify**

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 & echo $! > /tmp/bhh-serve.pid; sleep 1
curl -s http://localhost:8080/index.html | grep -oE 'num__v">[0-9.]+' | wc -l   # expect 9 numbers
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Expected: prints `9`. Manually: three cards in a row; because `images/hop-*.jpg` don't exist yet, each figure shows the faint crest watermark + variety name placeholder (intentional). Numbers render under each.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add home hops section with variety image slots"
```

---

## Task 4: Home farm band + shop CTA + contact

**Files:**
- Modify: `index.html` (insert after the hops `</section>`, before `</main>`).

**Interfaces:**
- Consumes: `.farm`, `.farm__media`, `.farm__body`, `.kicker`, `.stats`, `.stat__n`, `.stat__l`, `.cta`, `.btn--solid`, `.contact`, `.socials`, `.wrap` (Task 1).

- [ ] **Step 1: Insert the farm band, CTA, and contact sections**

```html
        <section class="farm" id="farm">
            <div class="farm__media" style="background-image:url('images/battle-house.jpg')" role="img" aria-label="The Battle House at dusk"></div>
            <div class="farm__body">
                <span class="kicker">The Farm</span>
                <h2>From farm<br>to tap.</h2>
                <p>A 20-acre plot in Almonte with a storied past — a former RCMP training ground, now our hop yard. We grow, harvest, and pack every cone right here.</p>
                <div class="stats">
                    <div><div class="stat__n">1,200</div><span class="stat__l">Strings / yr</span></div>
                    <div><div class="stat__n">20</div><span class="stat__l">Acres</span></div>
                    <div><div class="stat__n">2021</div><span class="stat__l">Established</span></div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="wrap">
                <h2>Shop our hops &amp; merch</h2>
                <p>Fresh Ontario hops and Battle House gear — all on one page.</p>
                <a href="shop.html" class="btn btn--solid">Visit the shop</a>
            </div>
        </section>

        <section class="contact" id="contact">
            <div class="wrap">
                <h2>Get in touch</h2>
                <p>Questions about our hops? We'd love to hear from you.</p>
                <a href="mailto:ian@battlehousehops.ca" class="btn">Email us</a>
                <div class="socials">
                    <a href="https://www.instagram.com/battlehousehops/" target="_blank" rel="noopener noreferrer"><img src="images/instagram.png" alt="Instagram"></a>
                    <a href="https://www.facebook.com/battlehousehops" target="_blank" rel="noopener noreferrer"><img src="images/facebook.png" alt="Facebook"></a>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Verify**

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 & echo $! > /tmp/bhh-serve.pid; sleep 1
check_assets(){ grep -oE '(src|href)="[^":#]+\.(png|jpg|jpeg|svg|css|js)"' "$1" | sed -E 's/.*="([^"]+)"/\1/' | sort -u | while read -r a; do [ -f "$a" ] || echo "MISSING: $a"; done; }
check_assets index.html
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Expected: `check_assets` prints only the three known-pending `images/hop-*.jpg` lines (everything else resolves). Manually: dark farm band with barn photo + 3 stats; centered CTA with solid button; contact with email button + social icons.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add home farm band, shop CTA, and contact"
```

---

## Task 5: JavaScript — mobile menu + scroll reveal

**Files:**
- Modify (replace contents): `js/main.js`
- Modify: `index.html` (add `reveal` class to sections that should animate in)

**Interfaces:**
- Consumes: `.nav-toggle`, `.nav-links` (toggles `.open`), `.reveal` → `.reveal.in` (Task 1 CSS).

- [ ] **Step 1: Replace `js/main.js`**

```javascript
/* Battle House Hops — nav + scroll reveal */
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }
});
```

- [ ] **Step 2: Add `reveal` to animating sections in `index.html`**

Change the opening tags of the hops, farm, cta, and contact sections to include the `reveal` class (do NOT add it to `.hero` — it's above the fold):
- `<section class="section" id="hops">` → `<section class="section reveal" id="hops">`
- `<section class="farm" id="farm">` → `<section class="farm reveal" id="farm">`
- `<section class="cta">` → `<section class="cta reveal">`
- `<section class="contact" id="contact">` → `<section class="contact reveal" id="contact">`

- [ ] **Step 3: Verify**

```bash
node -e "new Function(require('fs').readFileSync('js/main.js','utf8')); console.log('JS parses OK')"
grep -c 'reveal' index.html   # expect >= 4
```

Expected: "JS parses OK"; grep ≥ 4. Manually (`npm run dev`): narrow the window < 760px → hamburger appears, tapping toggles the menu; scrolling down fades sections in.

- [ ] **Step 4: Commit**

```bash
git add js/main.js index.html
git commit -m "feat: add mobile menu and scroll reveal, wire reveal into home"
```

---

## Task 6: Shop page — shell, feature, and Fresh Hops

**Files:**
- Modify (replace contents): `shop.html`

**Interfaces:**
- Consumes: the Task 1 nav/footer markup (copied verbatim, but with the Shop link marked `active`), plus `.announce`, `.page-head`, `.shop-feature`, `.shop-hops`, `.hop__figure`, `.shop-hop__top`, `.shop-hop__name`, `.status`/`.status--out`, `.nums`, `.detail`, `.link-accent`, `.btn--solid`.
- Produces: anchor targets `#cascade`, `#centennial`, `#galena` (linked from the home hops cards in Task 3) and `#apparel` (used in Task 7).

- [ ] **Step 1: Write `shop.html` (nav → feature → fresh hops; apparel added in Task 7)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop | Battle House Hops</title>
    <meta name="description" content="Shop fresh Ontario hops — Valley Cascade, Lanark Centennial, Northern Galena — plus Battle House apparel and accessories.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="icon" type="image/png" href="images/favicon.png">
</head>
<body>
    <header class="site-nav">
        <div class="site-nav__in">
            <a href="index.html" class="brand">
                <img src="images/crest.png" alt="">
                <span class="brand__wm">Battle House Hops</span>
            </a>
            <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span></button>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="shop.html" class="active">Shop</a></li>
                <li><a href="index.html#contact">Contact</a></li>
            </ul>
        </div>
    </header>

    <div class="announce">2025 harvest — sold out. Thank you for the support.</div>

    <main>
        <section class="page-head">
            <div class="wrap"><h1>Shop</h1></div>
        </section>

        <section class="section reveal">
            <div class="wrap">
                <div class="shop-feature">
                    <div class="shop-feature__pic"><img src="images/product.png" alt="Battle House Hops packaging"></div>
                    <div class="shop-feature__body">
                        <span class="kicker">Grown in Ontario</span>
                        <h2>Fresh hops, packed on the farm.</h2>
                        <p>Wet, pellet, and whole-leaf — grown, harvested, and packaged in Almonte. Watch this space for the 2026 harvest.</p>
                        <a href="#hops" class="link-accent">See the varieties →</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="section reveal" id="hops">
            <div class="wrap">
                <div class="section-head">
                    <h2>Fresh Hops</h2>
                    <span>Tested yearly · adjusted to 10% moisture</span>
                </div>
                <div class="shop-hops">
                    <article class="hop" id="cascade">
                        <div class="hop__figure" data-variety="Valley Cascade">
                            <img src="images/hop-cascade.jpg" alt="Valley Cascade hops" onerror="this.style.display='none'">
                        </div>
                        <div class="shop-hop__top">
                            <h3 class="shop-hop__name">Valley Cascade</h3>
                            <span class="status status--out">Sold Out</span>
                        </div>
                        <div class="nums">
                            <div><span class="num__k">Alpha</span><span class="num__v">4.9</span></div>
                            <div><span class="num__k">Beta</span><span class="num__v">6.4</span></div>
                            <div><span class="num__k">HSI</span><span class="num__v">0.13</span></div>
                        </div>
                        <div class="detail">
                            <div class="detail__row"><b>Aroma</b>Citrus (grapefruit) and floral</div>
                            <div class="detail__row"><b>Use</b>Dual-purpose — mostly aroma, some bittering</div>
                            <div class="detail__row"><b>Available as</b>Wet hop, pellet, or whole leaf</div>
                        </div>
                    </article>

                    <article class="hop" id="centennial">
                        <div class="hop__figure" data-variety="Lanark Centennial">
                            <img src="images/hop-centennial.jpg" alt="Lanark Centennial hops" onerror="this.style.display='none'">
                        </div>
                        <div class="shop-hop__top">
                            <h3 class="shop-hop__name">Lanark Centennial</h3>
                            <span class="status status--out">Sold Out</span>
                        </div>
                        <div class="nums">
                            <div><span class="num__k">Alpha</span><span class="num__v">10.9</span></div>
                            <div><span class="num__k">Beta</span><span class="num__v">3.2</span></div>
                            <div><span class="num__k">HSI</span><span class="num__v">0.22</span></div>
                        </div>
                        <div class="detail">
                            <div class="detail__row"><b>Aroma</b>Pine, mild citrus, and floral</div>
                            <div class="detail__row"><b>Use</b>Dual-purpose, high alpha — great for dry hopping</div>
                            <div class="detail__row"><b>Available as</b>Wet hop, pellet, or whole leaf</div>
                        </div>
                    </article>

                    <article class="hop" id="galena">
                        <div class="hop__figure" data-variety="Northern Galena">
                            <img src="images/hop-galena.jpg" alt="Northern Galena hops" onerror="this.style.display='none'">
                        </div>
                        <div class="shop-hop__top">
                            <h3 class="shop-hop__name">Northern Galena</h3>
                            <span class="status status--out">Sold Out</span>
                        </div>
                        <div class="nums">
                            <div><span class="num__k">Alpha</span><span class="num__v">9.8</span></div>
                            <div><span class="num__k">Beta</span><span class="num__v">7.6</span></div>
                            <div><span class="num__k">HSI</span><span class="num__v">0.17</span></div>
                        </div>
                        <div class="detail">
                            <div class="detail__row"><b>Aroma</b>Peach, pear, citrus, blackcurrant</div>
                            <div class="detail__row"><b>Use</b>Clean high-alpha bittering — early addition</div>
                            <div class="detail__row"><b>Available as</b>Wet hop, pellet, or whole leaf</div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- Apparel & Accessories added in Task 7 -->
    </main>

    <footer class="site-footer">
        <div class="site-footer__in">
            <img class="brand-lockup" src="images/name.png" alt="Battle House Hops">
            <nav class="footer-nav">
                <a href="index.html">Home</a>
                <a href="shop.html">Shop</a>
                <a href="index.html#contact">Contact</a>
            </nav>
            <div class="footer-social">
                <a href="https://www.instagram.com/battlehousehops/" target="_blank" rel="noopener noreferrer"><img src="images/instagram.png" alt="Instagram"></a>
                <a href="https://www.facebook.com/battlehousehops" target="_blank" rel="noopener noreferrer"><img src="images/facebook.png" alt="Facebook"></a>
            </div>
        </div>
        <div class="footer-copy">&copy; 2026 Battle House Hops. All rights reserved.</div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 & echo $! > /tmp/bhh-serve.pid; sleep 1
check_assets(){ grep -oE '(src|href)="[^":#]+\.(png|jpg|jpeg|svg|css|js)"' "$1" | sed -E 's/.*="([^"]+)"/\1/' | sort -u | while read -r a; do [ -f "$a" ] || echo "MISSING: $a"; done; }
check_assets shop.html
for id in cascade centennial galena; do curl -s http://localhost:8080/shop.html | grep -c "id=\"$id\""; done  # each expect 1
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Expected: `check_assets` prints only the three pending `images/hop-*.jpg` lines; each anchor id count is `1`. Manually: shop nav marks Shop active; announce bar; product.png feature; three hop cards with Sold Out pills, numbers, and inline detail.

- [ ] **Step 3: Commit**

```bash
git add shop.html
git commit -m "feat: rebuild shop page shell, feature, and fresh hops"
```

---

## Task 7: Shop page — Apparel & Accessories

**Files:**
- Modify: `shop.html` (replace the `<!-- Apparel & Accessories added in Task 7 -->` comment).

**Interfaces:**
- Consumes: `.section`, `.section-head`, `.merch-grid`, `.merch`, `.merch__figure`, `.merch__name`, `.merch__meta` (Task 1). Produces anchor `#apparel`.
- Note: uses existing merch images. No detail pages and no external store exists yet, so cards are informational (meta = "View in store soon").

- [ ] **Step 1: Insert the apparel section**

```html
        <section class="section reveal" id="apparel">
            <div class="wrap">
                <div class="section-head">
                    <h2>Apparel &amp; Accessories</h2>
                    <span>Online store coming soon</span>
                </div>
                <div class="merch-grid">
                    <article class="merch">
                        <div class="merch__figure"><img src="images/shop-shirt.png" alt="Battle House Hops shirt"></div>
                        <h3 class="merch__name">Shirt</h3>
                        <span class="merch__meta">Coming soon</span>
                    </article>
                    <article class="merch">
                        <div class="merch__figure"><img src="images/shop-dept-shirt.png" alt="Department shirt"></div>
                        <h3 class="merch__name">Department Shirt</h3>
                        <span class="merch__meta">Coming soon</span>
                    </article>
                    <article class="merch">
                        <div class="merch__figure"><img src="images/shop-artist-shirt.png" alt="Artist Series shirt"></div>
                        <h3 class="merch__name">Artist Series: Shirt</h3>
                        <span class="merch__meta">Coming soon</span>
                    </article>
                    <article class="merch">
                        <div class="merch__figure"><img src="images/shop-magnet.png" alt="Battle House Hops magnet"></div>
                        <h3 class="merch__name">Magnet</h3>
                        <span class="merch__meta">Coming soon</span>
                    </article>
                    <article class="merch">
                        <div class="merch__figure"><img src="images/shop-stickers.png" alt="Artist Series stickers"></div>
                        <h3 class="merch__name">Artist Series: Stickers</h3>
                        <span class="merch__meta">Coming soon</span>
                    </article>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Verify**

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 & echo $! > /tmp/bhh-serve.pid; sleep 1
check_assets(){ grep -oE '(src|href)="[^":#]+\.(png|jpg|jpeg|svg|css|js)"' "$1" | sed -E 's/.*="([^"]+)"/\1/' | sort -u | while read -r a; do [ -f "$a" ] || echo "MISSING: $a"; done; }
check_assets shop.html
curl -s http://localhost:8080/shop.html | grep -c 'merch__name'   # expect 5
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Expected: only the three pending `images/hop-*.jpg` lines from `check_assets`; `merch__name` count `5`. Manually: 5 merch tiles (3-up desktop, 2-up tablet, 1-up mobile).

- [ ] **Step 3: Commit**

```bash
git add shop.html
git commit -m "feat: add shop apparel and accessories grid"
```

---

## Task 8: Delete removed pages and stray file; confirm no dangling links

**Files:**
- Delete: `hops.html`, `farm.html`, `products/` (all 8 files), `css/Untitled`

- [ ] **Step 1: Delete the files**

```bash
git rm hops.html farm.html "css/Untitled"
git rm -r products
```

- [ ] **Step 2: Verify no surviving references to deleted pages**

```bash
grep -rniE 'hops\.html|farm\.html|products/|css/Untitled' index.html shop.html brewers.html css js 2>/dev/null && echo "FOUND REFERENCES (fix them)" || echo "clean: no dangling references"
```

Expected: `clean: no dangling references`. (`brewers.html` is scanned but intentionally left otherwise unmodified — if it references `hops.html`/`farm.html` in its own nav, that is pre-existing and out of scope per the spec; note it but do not edit brewers.html.) If `index.html`/`shop.html` show hits, repoint them to `index.html`/`shop.html` anchors and re-run.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old hops/farm/product pages and stray css/Untitled"
```

---

## Task 9: README update + final full-site verification

**Files:**
- Modify: `README.md` (Project Structure + Features + Hop Varieties sections)

- [ ] **Step 1: Update the "Project Structure" block in `README.md`**

Replace the existing fenced `Project Structure` tree (the block starting with ```` ```cursor2/ ```` and its file list) with:

```
battlehousehops/
├── index.html          # Single-scroll home (hero, hops, farm, contact)
├── shop.html           # Self-contained shop (fresh hops + apparel)
├── brewers.html        # Standalone brewers page (unlinked)
├── css/
│   └── styles.css      # "Fresh Cut" design system
├── js/
│   └── main.js         # Mobile menu + scroll reveal
├── images/             # Logo, photos, product & merch images
├── CNAME               # Custom domain (battlehousehops.ca)
├── package.json        # Dev-server helpers
└── README.md
```

- [ ] **Step 2: Fix the stale "Features"/structure copy**

In `README.md`, ensure no lingering mention of `.svg` assets or removed pages. The "Hop Varieties" list (Valley Cascade / Lanark Centennial / Northern Galena) stays accurate — leave it. Remove the "Contact Form" bullet from Features (there is no form now); it should read the remaining true bullets only.

- [ ] **Step 3: Full-site verification**

```bash
python3 -m http.server 8080 >/tmp/bhh-serve.log 2>&1 & echo $! > /tmp/bhh-serve.pid; sleep 1
check_assets(){ grep -oE '(src|href)="[^":#]+\.(png|jpg|jpeg|svg|css|js)"' "$1" | sed -E 's/.*="([^"]+)"/\1/' | sort -u | while read -r a; do [ -f "$a" ] || echo "MISSING: $a"; done; }
echo "== index =="; check_assets index.html
echo "== shop =="; check_assets shop.html
node -e "new Function(require('fs').readFileSync('js/main.js','utf8')); console.log('JS OK')"
for p in index.html shop.html; do echo "$p -> HTTP $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/$p)"; done
kill "$(cat /tmp/bhh-serve.pid)" 2>/dev/null
```

Expected: both `check_assets` print only the three known-pending `images/hop-*.jpg` slot lines; `JS OK`; both pages return `HTTP 200`. Manually (`npm run dev`): walk both pages on desktop and a <760px viewport — nav/hamburger, hero, hops numbers, farm band, CTA, contact, shop pills + detail, merch grid, footer. Confirm the Space Grotesk/Inter type, warm-white/charcoal/green palette, and that the hop cards show the placeholder (crest + name) since photos aren't in yet.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: update README for the simplified two-page structure"
```

---

## Post-implementation (for the user, not a task)

- **Generate the three variety photos** with the prompts in the design spec (§5), save as `images/hop-cascade.jpg`, `images/hop-centennial.jpg`, `images/hop-galena.jpg` (1:1). They auto-appear — no code change.
- **Merge & deploy:** when satisfied, merge `redesign/simplify-fresh-cut` into `main`. The push to `main` triggers the GitHub Pages deploy.
- **Optional later:** normalize inconsistent merch image backgrounds; wire a real store/purchase links when the shop opens (swap the `Coming soon` meta + `Sold Out` pills).

---

## Self-Review

**Spec coverage:**
- IA collapse to 2 pages → Tasks 2–7 build home + shop; Task 8 deletes `hops.html`/`farm.html`/`products/`. ✓
- Brewers untouched/orphaned → not modified in any task; Task 8 explicitly avoids editing it. ✓
- Fresh Cut style (type/color/components) → Task 1 CSS. ✓
- Numbers on both pages → Task 3 (home) + Task 6 (shop). ✓
- Real assets (logo/hero/farm/product/merch) → Tasks 1,2,4,6,7. ✓
- Live status pills, not baked-in → Task 6 uses `.status--out`; constraint bars reuse of baked PNGs. ✓
- Variety image gap → auto-upgrading slot + placeholder (Tasks 3,6); prompts live in the spec, referenced in Post-implementation. ✓
- Housekeeping (css/Untitled, README) → Tasks 8, 9. ✓
- Content trim (cut essays/brewery lists/style tags) → new markup simply omits them; only trimmed copy is included. ✓

**Placeholder scan:** No "TBD"/"handle edge cases"/vague steps — every code step has complete code; every verify step has a command + expected output. ✓

**Type/name consistency:** CSS class names used in Tasks 2–7 are all defined in Task 1's stylesheet (`.hero__media`, `.hop__figure`, `.nums`, `.num__k/__v`, `.status--out`, `.merch__*`, `.shop-feature__*`, `.farm__*`, `.brand-lockup`, `.reveal`). Anchor ids `#cascade/#centennial/#galena` produced in Task 6 match the hrefs emitted in Task 3. Nav/footer markup in Task 6 matches Task 1. ✓
