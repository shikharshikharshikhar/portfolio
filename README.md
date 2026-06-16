# Shikhar Gurung — Portfolio

A single-page personal portfolio. Plain static **HTML / CSS / JS** — no framework,
no build step, no dependencies. Recreated pixel-for-pixel from the original
Claude Design prototype.

## Structure

```
site/
├── index.html      # markup
├── styles.css      # all styles
├── main.js         # interactions (theme toggle, cursor, marquee, reveals, count-up)
├── favicon.svg
├── vercel.json     # static deploy config (clean URLs, security + cache headers)
└── assets/         # optimized WebP images
    ├── portrait.webp   # hero headshot
    ├── eagle1.webp     # /01 — Teaching
    ├── eagle2.webp     # /02 — The school
    └── eagle3.webp     # /03 — On-site
```

## Run locally

No build needed — just serve the folder over HTTP (opening `index.html` via
`file://` works too, but a server matches production behavior):

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed URL (e.g. http://localhost:8000).

## Deploy to Vercel

This is a pure static site, so no framework preset is required.

**Option A — Vercel CLI**
```bash
npm i -g vercel       # once
cd site
vercel                # preview deploy
vercel --prod         # production deploy
```

**Option B — Git integration**
1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, "Add New → Project" and import the repo.
3. Set the **Root Directory** to `site/`. Framework preset: **Other**. No build
   command, no output directory.

### Custom domain
In the Vercel project → **Settings → Domains**, add `shikhargurung.com` and follow
the DNS instructions. After it's live, the absolute URLs in `index.html`
(`canonical`, `og:url`, `og:image`) already point at `https://shikhargurung.com/` —
update them if you deploy under a different domain.

## Notes

- **Portrait resolution:** `assets/portrait.webp` is 400×400 (the only headshot
  source available). It's fine on most screens but can look soft as the
  full-height hero on large displays — drop in a ≥1200px-tall headshot at the same
  path to sharpen it.
- The original prototype's `<image-slot>` drag-and-drop component was a design-tool
  feature and is intentionally **not** part of the production site; images are baked
  in as real files.
- Fonts (Bricolage Grotesque, Newsreader, IBM Plex Mono) load from Google Fonts.
  To go fully self-hosted/offline, download the families into `assets/fonts/` and
  swap the `<link>` for local `@font-face` rules.
