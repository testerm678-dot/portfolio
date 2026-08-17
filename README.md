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

## The contact form

Submissions POST to [Web3Forms](https://web3forms.com), which forwards each message to
the address its access key is registered to. The visitor never leaves the page and no
mail client is involved.

What happens on submit:

| Outcome | What the visitor sees |
| --- | --- |
| Invalid fields | Fields highlight, inline message under the button, focus jumps to the first problem |
| Sending | Button disables, label reads "Sending…", spinner replaces the send icon |
| Delivered | Green toast — "Message sent", greeted by first name; the form clears |
| Endpoint or network failure | Red toast, the typed message is **left in the form**, plus a `mailto:` link as a fallback |
| No valid key configured | Falls back to opening the visitor's mail client — it never claims a message was sent when it wasn't |

Toasts stack (max 3), auto-dismiss on a countdown bar, and pause that countdown
while hovered or keyboard-focused so a fallback address is never pulled away mid-read.

**Setup / changing the destination** — go to [web3forms.com](https://web3forms.com),
enter **the mailbox you actually read**, and they email back an access key. Paste it
into `ACCESS_KEY` in `assets/js/main.js`:

```js
var ACCESS_KEY = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

The key is publishable by design — it only ever routes mail to the address it was
created with, so it is safe in client-side code. Anything that is not a valid UUID,
including the shipped `PASTE-YOUR-WEB3FORMS-ACCESS-KEY` placeholder, switches the form
back to the `mailto:` fallback automatically, so the site can never show a success
toast for a message that went nowhere.

**Spam** — an off-screen honeypot field (`#cf-company`, `tabindex="-1"`,
`aria-hidden`) catches naive bots. It is named `botcheck`, Web3Forms' own honeypot
convention, so it is filtered server-side too; client-side, a filled honeypot is dropped
with no network request while still showing the bot the success toast it expects. The
free plan covers 250 submissions/month.

> **Verify delivery, not the response.** The free plan keeps no copy of submissions, so
> the registered address is the only record. A key created against the wrong mailbox
> sends every message into a void while the API still answers `success: true` — that
> happened on this site. After changing the key, always send a real submission and
> confirm it arrives.

> Note: Web3Forms rejects server-side calls on the free plan, so the form only works
> from a browser — `curl` tests need an `Origin` header to succeed.

---

## Features built in

- **Dark / light theme** with system-preference detection and `localStorage` persistence
- **Fully responsive** — 5-column stats down to a single-column mobile layout
- **Animated hero terminal** that "runs" a regression suite, typed line by line
- **Animated stat counters** that fire when scrolled into view
- **Filterable project grid** — SaaS products / client work / automation repos
- **Scroll-spy navigation**, scroll progress bar, back-to-top button
- **Custom cursor** — an SVG arrow (and pointing hand over anything clickable) set as a
  native CSS cursor, so it has zero tracking lag; behind it a wide aurora eases along,
  and every click pushes out two expanding ripples. Fine pointers only, and the whole
  thing is skipped under `prefers-reduced-motion`
- **Accessibility** — skip link, focus-visible rings, ARIA on nav/tabs/status, `prefers-reduced-motion` support
- **SEO** — meta description, Open Graph + Twitter cards, JSON-LD `Person` schema, sitemap, robots.txt
- **Print stylesheet** — the page prints cleanly as a summary sheet

---

## Notes

- Privacy: referees' names, emails and phone numbers from the CV are **deliberately not published** on the site — it shows "references available on request" instead. Publishing them exposes their personal contact details to scrapers.
- The site uses Google Fonts (Sora, Inter, JetBrains Mono). If offline or blocked, it falls back to system fonts and still looks correct.
