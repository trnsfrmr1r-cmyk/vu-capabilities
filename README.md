# Vu Tran · AI capability portfolio

A running record of what I can build with AI, each build graded by its evidence. Built from one data file, deployed on Vercel. Every push to `main` redeploys the site.

## Updating it

Everything on the page comes from `data/portfolio.json`. To add to it:

| Change | Where in the data file |
|---|---|
| Shipped something new | Add an object to `builds` (name, capability, level, date, summary, proof, stack) |
| Something moved up a level (built to running, running to in others' hands) | Change that build's `level` and add a `log` line saying so |
| Learned or proved something worth noting | Add a line to the top of `log` |
| Wrote a new skill | Bump `person.skillsAuthored`; add it to the right capability's `skills` |
| Sharing a new skill publicly | Put a scrubbed copy in `public/skills/<slug>.md` and add it to `shared` |
| Add a site | Screenshot the home page at 1440×900, save an 800×500 JPEG to `public/sites/`, and add an entry to `sites` (name, url, img, kind, date, what). Kind is `My site`, `Spec build` or `Client` |
| Bump the date | `updated` (YYYY-MM-DD) |

Then preview locally with `node build.mjs` (writes `dist/`), commit and push. Vercel builds it in about a minute.

### Evidence levels

| Level | Means |
|---|---|
| `spec` | Designed and written down, not built |
| `built` | Works, demonstrated end to end |
| `running` | Live and in regular use, with dates |
| `others` | Used by someone other than me |
| `paid` | Delivered for a client or employer |

`others` and `paid` are marked `"hidden": true` in `levels` for now. A hidden level appears on the page automatically the first time a build reaches it, so no level ever shows a zero.

### Rules for entries

- Never log a build that didn't happen, and never grade one above its evidence.
- Proof lines are numbers or checkable facts, not adjectives.
- No client or prospect names without their OK. No private data in `public/skills/`.

## What gets built

- `dist/index.html` — the page
- `dist/portfolio.json` — the same data, machine-readable
- `dist/llms.txt` — a plain-text version for AI assistants and recruiting tools
- `dist/robots.txt`, `dist/sitemap.xml` — when `SITE_URL` or Vercel's production URL is known

Set a `SITE_URL` environment variable in Vercel once there's a custom domain, so share links and the sitemap use it.

## Brand

VTDO design system: Archivo (SIL OFL, licence in `public/fonts/`), warm neutrals, one Signal Lime accent. Logo files in `public/brand/` are the approved masters; don't redraw them.
