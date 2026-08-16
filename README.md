# Tuhin Hossain — Software QA Engineer · Portfolio

Live: **https://tuhin-hossain.vercel.app**

A fast, responsive, single-page portfolio site. Pure HTML/CSS/JavaScript — **no build step, no dependencies**, so it can be hosted anywhere for free.

## Design

"**Console**" — a technical, document-like dark design, deliberately avoiding the
generic portfolio-template look (gradients, glassmorphism, glowing blobs, fading
cards). The rules it follows:

- **No gradients, no shadows, no border-radius.** Structure comes from 1px hairline rules.
- **One signal colour** (`--sig: #FFB000`) against near-black and warm off-white. Green and red appear only as status.
- **Typography does the work** — Archivo at heavy weights for display, JetBrains Mono for every label and piece of metadata.
- **Dense over airy.** Projects are a data table, not cards. Hovering a row inverts it.
- **No scroll-reveal animation.** Content is present immediately; only the tool ticker moves.

Dark only by design — there is no light theme, and the colour scheme does not follow the OS setting.

```
Portfolio/
├── index.html                 # all content lives here
├── assets/
│   ├── css/styles.css         # design tokens + all styling
│   ├── js/main.js             # scroll-spy, contact form, footer year
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
| Availability / stats | `index.html` → the `.hero__sub` list, and the `◆ Available` line in the rail |

### Adding a project to the Systems table

Each row is a single `<a>` — the whole row is the link. Copy this into the `.sys` block,
keeping the ID sequence (`S-11`, `S-12`, …):

```html
<a class="sys__row" href="https://YOUR-URL-HERE" target="_blank" rel="noopener">
  <span class="sys__id">S-11</span>
  <span class="sys__nm"><b>Project Name</b><span>One line on what you tested.</span></span>
  <span class="sys__meta">Web · Android</span>
  <span class="sys__meta">Scale or users</span>
  <span><span class="badge b-cli">Client</span></span>
</a>
```

Badge classes: `b-live` (green — shipped and running), `b-mvp` (amber — MVP stage),
`b-cli` (client delivery), `b-src` (links to source code).

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

- **Fixed index rail** with portrait, section numbers and scroll-spy highlighting (collapses to a top bar on mobile)
- **Systems table** — 10 shipped products as dense, hoverable rows, each linking to the live site or repo
- **Contact form** with client-side validation (falls back to a pre-filled email — see below)
- **Fully responsive** — rail layout down to single column
- **Accessibility** — skip link, focus-visible rings, ARIA live status, `prefers-reduced-motion` support
- **SEO** — meta description, canonical, Open Graph + Twitter cards, JSON-LD `Person` schema, sitemap, robots.txt
- **Print stylesheet** — the page prints cleanly as a summary sheet

---

## Notes

- Privacy: referees' names, emails and phone numbers from the CV are **deliberately not published** on the site — it shows "references available on request" instead. Publishing them exposes their personal contact details to scrapers.
- The site uses Google Fonts (Sora, Inter, JetBrains Mono). If offline or blocked, it falls back to system fonts and still looks correct.
