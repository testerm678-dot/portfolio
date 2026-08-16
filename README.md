# Tuhin Hossain — Software QA Engineer · Portfolio

A fast, responsive, single-page portfolio site. Pure HTML/CSS/JavaScript — **no build step, no dependencies**, so it can be hosted anywhere for free.

```
Portfolio/
├── index.html                 # all content lives here
├── assets/
│   ├── css/styles.css         # design tokens + all styling (light & dark themes)
│   ├── js/main.js             # nav, theme, reveal, counters, filters, terminal, form
│   ├── img/tuhin.jpg          # profile photo (extracted from the CV)
│   ├── img/favicon.svg        # tab icon
│   └── docs/                  # downloadable CV PDFs
├── robots.txt
└── sitemap.xml
```

---

## Run it locally

Double-click `index.html`, or serve it (recommended, so paths behave exactly like production):

```bash
npx serve .
# or:  python -m http.server 8000
```

---

## Publish it (pick one — all free)

### Option A — GitHub Pages (recommended, gives `tuhingits.github.io`)
1. Create a repo named **`Tuhingits.github.io`** on GitHub.
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/Tuhingits/Tuhingits.github.io.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages → Source: `main` / root**. Live in ~1 minute at
   `https://tuhingits.github.io`.

### Option B — Netlify (drag & drop)
Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this whole folder in. Instant URL; rename it in Site settings.

### Option C — Vercel
`npx vercel` in this folder, accept the defaults.

**After publishing:** put the live URL in the LinkedIn *Website* field, in the CV header, and in the email signature.

---

## Things to update

| What | Where |
|---|---|
| Live site URL (for SEO/schema) | `index.html` → JSON-LD `"url"`, and `sitemap.xml` |
| Profile photo | replace `assets/img/tuhin.jpg` (square crop, 600×600 or larger looks best) |
| CV file | replace the PDF in `assets/docs/` (keep the same filename, or update the link in the hero) |
| Availability badge | `index.html` → the `.badge` line in the hero |

### Linking a project card

Every project card is **clickable as a whole** — the title carries an invisible overlay that
covers the card, so clicking anywhere on it opens the live site in a new tab.

All 10 cards are linked. When you add a **new** project card, give its title the same shape:

```html
<h3><a class="stretch" href="https://YOUR-URL-HERE" target="_blank" rel="noopener">Project Name <span class="ext" aria-hidden="true">↗</span></a></h3>
```

and add a visible link row just before the card's closing `</article>`:

```html
<div class="pcard__links"><a href="https://YOUR-URL-HERE" target="_blank" rel="noopener">Live site ↗</a></div>
```

Set the card's `data-cat` to `product`, `client` or `practice` so the filter buttons pick it up.

---

## Making the contact form send real email

Right now the form validates input and opens the visitor's mail client (`mailto:`) — it works everywhere with zero setup, but some visitors have no mail client configured. To receive submissions directly:

1. Sign up at [formspree.io](https://formspree.io) (free tier) and copy the form endpoint.
2. In `index.html`, change:
   ```html
   <form class="contact__form" id="contactForm" novalidate>
   ```
   to
   ```html
   <form class="contact__form" id="contactForm" action="https://formspree.io/f/XXXXXXX" method="POST">
   ```
3. In `assets/js/main.js`, delete the `e.preventDefault();` line inside the submit handler (keep the validation block above it, so invalid submissions still get caught).

---

## Features built in

- **Dark / light theme** with system-preference detection and `localStorage` persistence
- **Fully responsive** — 5-column stats down to a single-column mobile layout
- **Animated hero terminal** that "runs" a regression suite, typed line by line
- **Animated stat counters** that fire when scrolled into view
- **Filterable project grid** — SaaS products / client work / automation repos
- **Scroll-spy navigation**, scroll progress bar, back-to-top button
- **Accessibility** — skip link, focus-visible rings, ARIA on nav/tabs/status, `prefers-reduced-motion` support
- **SEO** — meta description, Open Graph + Twitter cards, JSON-LD `Person` schema, sitemap, robots.txt
- **Print stylesheet** — the page prints cleanly as a summary sheet

---

## Notes

- Privacy: referees' names, emails and phone numbers from the CV are **deliberately not published** on the site — it shows "references available on request" instead. Publishing them exposes their personal contact details to scrapers.
- The site uses Google Fonts (Sora, Inter, JetBrains Mono). If offline or blocked, it falls back to system fonts and still looks correct.
