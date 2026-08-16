# Tuhin Hossain — Software QA Engineer · Portfolio

Live: **https://tuhin-hossain.vercel.app**

## TQMS — the concept

The portfolio is built as **TQMS (Tuhin Quality Management System)** — a test management
application rather than a scrolling page. It boots, then presents seven modules inside an
app shell with a left rail, title bar and live status bar.

| Module | What it holds |
|---|---|
| Dashboard | KPI tiles + a regression run that types itself out |
| Test Suites | Skills as expandable suites with pass bars |
| Systems Under Test | 10 projects as a table; a row opens a detail drawer |
| Triage Reference | The S1–S4 severity ladder and defect-report standard |
| Release History | Career as versioned releases |
| Toolchain | Tools tagged CORE / PATTERN / CLOUD |
| Contact | Direct links |

Pure HTML/CSS/JavaScript — **no build step, no dependencies** — so it hosts anywhere for free.

```
Portfolio/
├── index.html                 # app shell + all seven module views
├── assets/
│   ├── css/styles.css         # design tokens + all styling
│   ├── js/main.js             # boot, routing, drawer, palette, cursor, project data
│   ├── img/tuhin.jpg          # profile photo (extracted from the CV)
│   ├── img/favicon.svg        # tab icon
│   └── docs/                  # downloadable CV PDFs
├── robots.txt
└── sitemap.xml
```

---

## Run it locally

Serve it (recommended, so paths behave exactly like production):

```bash
npx serve .
# or:  python -m http.server 8000
```

---

## Deploying

Already connected: **GitHub `testerm678-dot/portfolio` → Vercel**.
Every push to `main` auto-deploys to https://tuhin-hossain.vercel.app in about 30 seconds.

```bash
git add -A
git commit -m "Describe the change"
git push
```

---

## Things to update

| What | Where |
|---|---|
| Projects | `assets/js/main.js` → the `SYS` array (see below) |
| KPI numbers | `index.html` → the `.kpis` block on the Dashboard |
| Availability | `index.html` → sidebar footer, status bar, and the Contact module |
| Profile photo | replace `assets/img/tuhin.jpg` (square crop, 600×600 or larger) |
| CV file | replace the PDF in `assets/docs/` (keep the filename, or update the links to it) |
| Live URL for SEO | `index.html` → canonical, Open Graph and JSON-LD; plus `sitemap.xml` |

### Adding a project

Projects are **data, not markup**. Add an entry to the `SYS` array near the top of
`assets/js/main.js` and both the table row and its detail drawer are generated for you:

```js
{id:'SUT-11', nm:'Project Name',
 desc:'One or two lines on the system and what you owned.',
 plat:'Web · Android', scale:'2,000 users', cls:'Client', t:'t-cli',
 url:'https://example.com/',
 role:['What you tested','Another responsibility']}
```

Class tags: `t-live` (green, shipped and running), `t-mvp` (amber, MVP stage),
`t-cli` (blue, client delivery), `t-src` (purple, links to source code).

### Editing the boot sequence or run log

Both are arrays in `assets/js/main.js` — `BOOT` and `LOG`. Keep the inline
`<span class="p">` / `f` / `d` / `b` / `w` classes for pass, fail, dim, blue and warn colours.

---

## Features built in

- **Boot sequence** on load, replayable any time from the title bar
- **Seven modules**, no page reloads; deep-linkable via `#dashboard`, `#systems`, `#triage`, …
- **Command palette** — Ctrl/Cmd+K, arrow keys to move, Enter to jump, Escape to close
- **Detail drawer** — click any system row for platform, scale and your role on it
- **Custom inspector cursor** — reticle with a lagging ring and a live readout naming the
  action under the pointer (Inspect / Open / Compose / Download / Type)
- **Motion on every module entry** — counters count up, pass bars fill, rows cascade in
- **Live status bar** — Dhaka clock, heartbeat pulse, "last run" timer
- **Accessibility** — ARIA tabs, keyboard navigation, native caret preserved inside form
  fields, and full `prefers-reduced-motion` support (boot, typing, cursor lag and stagger
  all disable together)
- **SEO** — meta description, canonical, Open Graph + Twitter cards, JSON-LD `Person`
  schema, sitemap and robots.txt
- **Touch devices** keep native cursor behaviour; the rail collapses to a scrollable top bar

---

## Notes

- **Privacy:** referees' names, emails and phone numbers from the CV are deliberately **not**
  published — the Contact module says "Senior QA — on request" instead. Publishing them would
  expose their personal contact details to scrapers.
- The site uses Google Fonts (Inter, JetBrains Mono). If offline or blocked, it falls back to
  system fonts and still reads correctly.
- **Triage Reference** was written from standard QA practice and the CV. Read it and adjust the
  wording so it matches how you actually triage — it should be your process, in your words.
