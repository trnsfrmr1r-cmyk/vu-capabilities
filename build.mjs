// Builds the capability portfolio from data/portfolio.json into dist/.
// No dependencies. Run: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";

const data = JSON.parse(readFileSync("data/portfolio.json", "utf8"));
const { person, levels, capabilities, builds, log, shared, history } = data;

const SITE_URL = (process.env.SITE_URL
  || data.siteUrl
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
).replace(/\/$/, "");

// ---------- helpers ----------
const esc = (s = "") => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-").map(Number);
  if (!m) return String(y);
  return day ? `${MONTHS[m - 1]} ${day}, ${y}` : `${MONTHS[m - 1]} ${y}`;
}
const levelIndex = Object.fromEntries(levels.map((l, i) => [l.id, i]));
const levelLabel = Object.fromEntries(levels.map((l) => [l.id, l.label]));
const sharedSlugs = new Set(shared.map((s) => s.slug));
const slugToName = Object.fromEntries(shared.map((s) => [s.slug, s.name]));

function meter(level) {
  const n = levelIndex[level];
  const pips = levels.map((l, i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("");
  return `<span class="meter" aria-hidden="true">${pips}</span>`;
}
function levelChip(level) {
  return `<span class="lvl">${meter(level)}<span class="lvl-t">${esc(levelLabel[level])}</span></span>`;
}

// sort builds: highest level first, then newest
const byStrength = (a, b) =>
  (levelIndex[b.level] - levelIndex[a.level]) || String(b.date).localeCompare(String(a.date));

// ---------- tallies ----------
const counts = Object.fromEntries(levels.map((l) => [l.id, builds.filter((b) => b.level === l.id).length]));
const daysBuilding = Math.round((new Date(data.updated) - new Date(person.skillsSince)) / 86400000);
const tally = [
  { n: builds.length, k: "Builds logged" },
  { n: counts.running + (counts.others || 0) + (counts.paid || 0), k: "Running now" },
  { n: capabilities.length, k: "Capabilities" },
  { n: person.skillsAuthored, k: "Skills written" },
  { n: daysBuilding, k: "Days since skill #1" },
];

// ---------- sections ----------
const capIndex = capabilities.map((c) => {
  const bs = builds.filter((b) => b.capability === c.id);
  const top = bs.slice().sort(byStrength)[0];
  return `<li><a href="#${c.id}"><span class="ci-name">${esc(c.name)}</span>
    <span class="ci-meta">${top ? levelChip(top.level) : ""}<span class="ci-n">${bs.length} ${bs.length === 1 ? "build" : "builds"}</span></span></a></li>`;
}).join("");

// Paid work so far lives in the history list, so it counts toward the Paid level.
const keyCount = (id) => counts[id] + (id === "paid" ? history.length : 0);
const levelKey = levels.map((l) => {
  const n = keyCount(l.id);
  return `
  <button type="button" class="key" data-level="${l.id}" aria-pressed="false">
    <span class="key-top">${meter(l.id)}${n ? `<span class="key-n">${n}</span>` : ""}</span>
    <span class="key-t"><b>${esc(l.label)}</b><span>${esc(l.desc)}</span></span>
  </button>`;
}).join("");

function buildCard(b) {
  const proof = b.proof?.length ? `<ul class="proof">${b.proof.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : "";
  const stack = b.stack?.length ? `<p class="stack">${b.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</p>` : "";
  const link = b.link ? `<a class="more" href="${esc(b.link)}" target="_blank" rel="noopener">Read it</a>` : "";
  return `<article class="build" data-level="${b.level}">
    <header>${levelChip(b.level)}${b.date ? `<time>${esc(fmtDate(b.date))}</time>` : ""}</header>
    <h3>${esc(b.name)}</h3>
    <p class="sum">${esc(b.summary)}</p>
    ${proof}${stack}${link}
  </article>`;
}

const capSections = capabilities.map((c) => {
  const bs = builds.filter((b) => b.capability === c.id).sort(byStrength);
  const skills = c.skills.length
    ? `<div class="skills"><span class="eyebrow">Skills that encode it</span><p>${c.skills.map((s) =>
        sharedSlugs.has(s)
          ? `<button type="button" class="tag tag-open" data-skill="${s}">${esc(s)}</button>`
          : `<span class="tag">${esc(s)}</span>`).join("")}</p></div>`
    : `<div class="skills"><span class="eyebrow">Skills that encode it</span><p class="none">None written yet.</p></div>`;
  return `<section class="cap" id="${c.id}" aria-labelledby="${c.id}-h">
    <div class="cap-head">
      <p class="eyebrow">${bs.length} ${bs.length === 1 ? "build" : "builds"} · ${c.skills.length} ${c.skills.length === 1 ? "skill" : "skills"}</p>
      <h2 id="${c.id}-h">${esc(c.name)}</h2>
      <p class="claim">${esc(c.claim)}</p>
    </div>
    <div class="builds">${bs.map(buildCard).join("")}</div>
    <div class="cap-foot">
      <figure class="rule">
        <span class="eyebrow">A rule I work by</span>
        <blockquote>${esc(c.rule)}</blockquote>
        <figcaption><b>Where it came from.</b> ${esc(c.origin)}</figcaption>
      </figure>
      ${skills}
    </div>
  </section>`;
}).join("");

const logList = log.map((l) => `<li><time>${esc(fmtDate(l.date))}</time><p>${esc(l.text)}</p></li>`).join("");

const sharedCards = shared.map((s) => `
  <article class="sk">
    <h3>${esc(s.name)}</h3>
    <p>${esc(s.what)}</p>
    <p class="sk-actions">
      <button type="button" class="btn tag-open" data-skill="${s.slug}">Read the skill</button>
      <a class="btn ghost" href="/skills/${s.slug}.md" download>Download .md</a>
    </p>
  </article>`).join("");

const historyList = history.map((h) => `
  <li><span class="h-when">${esc(h.when)}</span>
    <div><h3>${esc(h.what)}</h3><p>${esc(h.detail)}</p></div>
    <span class="h-lvl">${levelChip("paid")}</span></li>`).join("");

// ---------- head ----------
const title = `${person.name} · ${person.title}`;
const description = `${person.name}, ${person.title} in ${person.location}. ${builds.length} AI builds across ${capabilities.length} capabilities, each graded by its evidence, plus ${person.skillsAuthored} written skills. Updated ${fmtDate(data.updated)}.`;
const ogImage = SITE_URL ? `${SITE_URL}/og.png` : "/og.png";
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.title,
  email: `mailto:${person.email}`,
  address: { "@type": "PostalAddress", addressRegion: "CA", addressLocality: "Orange County" },
  url: SITE_URL || undefined,
  sameAs: [`https://${person.linkedin}`, `https://${person.site}`],
  knowsAbout: capabilities.map((c) => c.name),
};

const css = readFileSync("src/styles.css", "utf8");
const js = readFileSync("src/app.js", "utf8");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
${SITE_URL ? `<meta property="og:url" content="${SITE_URL}/">\n<link rel="canonical" href="${SITE_URL}/">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="/brand/icon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/Archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="alternate" type="application/json" href="/portfolio.json" title="Machine-readable portfolio">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${css}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="rail topbar-in">
  <a class="logo" href="https://${esc(person.site)}" aria-label="VT Digital Operator">
    <picture>
      <source srcset="/brand/logo-h-rev.svg" media="(prefers-color-scheme: dark)">
      <img src="/brand/logo-h-pos.svg" alt="VT Digital Operator" width="180" height="32">
    </picture>
  </a>
  <span class="updated">Updated <time datetime="${esc(data.updated)}">${esc(fmtDate(data.updated))}</time></span>
</div></div>

<header class="hero"><div class="rail">
  <span class="bar" aria-hidden="true"></span>
  <p class="eyebrow">${esc(person.title)} · ${esc(person.location)}</p>
  <h1>${esc(person.name)}</h1>
  <p class="headline">${esc(person.headline)}</p>
  <p class="intro">${esc(person.intro)}</p>
  <dl class="tally">${tally.map((t) => `<div><dt>${esc(t.k)}</dt><dd>${t.n}</dd></div>`).join("")}</dl>
  <div class="contact">
    <button type="button" class="cta" id="copy-email" data-email="${esc(person.email)}">Copy email</button>
    <span class="c-item sel">${esc(person.email)}</span>
    <span class="c-item sel">${esc(person.phone)}</span>
    <a class="c-item" href="https://${esc(person.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
    <a class="c-item" href="https://${esc(person.site)}" target="_blank" rel="noopener">${esc(person.site)}</a>
    <span class="toast" id="toast" role="status" aria-live="polite"></span>
  </div>
</div></header>

<section class="keyband" aria-label="Evidence key"><div class="rail">
  <p class="eyebrow">Evidence key · tap a level to filter the builds</p>
  <div class="keys">${levelKey}</div>
</div></section>

<div class="rail layout">
  <aside class="side" aria-label="Capabilities">
    <div class="side-in">
      <p class="eyebrow">Capabilities</p>
      <ol class="cap-index">${capIndex}</ol>
      <p class="eyebrow side-gap">Also on this page</p>
      <ul class="side-links"><li><a href="#log">Running log</a></li><li><a href="#skills">Take my skills</a></li><li><a href="#before">Before AI</a></li></ul>
    </div>
  </aside>

  <main id="main">
    <p class="filter-note" id="filter-note" hidden></p>
    ${capSections}

    <section class="block" id="log" aria-labelledby="log-h">
      <p class="eyebrow">Newest first</p>
      <h2 id="log-h">Running log</h2>
      <p class="lede">What I learned to do, and when. Every new build or skill adds a line.</p>
      <ol class="log">${logList}</ol>
    </section>

    <section class="block" id="skills" aria-labelledby="skills-h">
      <p class="eyebrow">${shared.length} of ${person.skillsAuthored} · free to use</p>
      <h2 id="skills-h">Take my skills</h2>
      <p class="lede">These are working skill files from my library, the same ones my agents run. Client and prospect names are removed; nothing else is changed. Drop one into Claude and it works.</p>
      <div class="sk-grid">${sharedCards}</div>
    </section>

    <section class="block" id="before" aria-labelledby="before-h">
      <p class="eyebrow">25+ years</p>
      <h2 id="before-h">Before AI</h2>
      <p class="lede">The tools changed. The work didn't: design the thing, wire it into the business, make sure a real person can run it.</p>
      <ol class="history">${historyList}</ol>
      <p class="creds">${esc(data.credentials)}</p>
    </section>

    <section class="block note" aria-label="Scale note">
      <p>${esc(data.scaleNote)}</p>
    </section>
  </main>
</div>

<footer class="foot"><div class="rail foot-in">
  <p>${esc(person.name)} · ${esc(person.title)} · ${esc(person.location)}</p>
  <p>Built by directing AI and updated from a single data file. Every update is a dated commit in the <a href="${esc(data.repo)}" target="_blank" rel="noopener">public repo</a>.</p>
  <p>For agents and recruiting tools: <a href="/portfolio.json">portfolio.json</a> · <a href="/llms.txt">llms.txt</a></p>
</div></footer>

<dialog id="skill-dialog" aria-labelledby="sd-title">
  <div class="sd-head">
    <h2 id="sd-title">Skill</h2>
    <div class="sd-actions">
      <button type="button" class="btn" id="sd-copy">Copy</button>
      <a class="btn ghost" id="sd-dl" href="#" download>Download</a>
      <button type="button" class="btn ghost" id="sd-close">Close</button>
    </div>
  </div>
  <pre id="sd-body">Loading…</pre>
</dialog>
<script>window.__SKILLS__=${JSON.stringify(slugToName)};</script>
<script>${js}</script>
</body>
</html>`;

// ---------- llms.txt ----------
const llms = [
  `# ${person.name} — ${person.title}`,
  "",
  `> ${person.location}. ${person.intro}`,
  "",
  `Contact: ${person.email} · ${person.phone} · https://${person.linkedin}`,
  `Updated: ${data.updated}`,
  "",
  "## Evidence levels",
  ...levels.map((l) => `- ${l.label}: ${l.desc}`),
  "",
  ...capabilities.flatMap((c) => [
    `## ${c.name}`,
    c.claim,
    ...builds.filter((b) => b.capability === c.id).sort(byStrength)
      .map((b) => `- ${b.name} [${levelLabel[b.level]}${b.date ? `, ${b.date}` : ""}]: ${b.summary} Proof: ${(b.proof || []).join("; ")}.`),
    `Rule: ${c.rule} (Origin: ${c.origin})`,
    "",
  ]),
  "## Shared skills",
  ...shared.map((s) => `- ${s.name}: ${SITE_URL}/skills/${s.slug}.md — ${s.what}`),
  "",
  "## Before AI",
  ...history.map((h) => `- ${h.when}: ${h.what}. ${h.detail}`),
  "",
].join("\n");

// ---------- write ----------
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
cpSync("public", "dist", { recursive: true });
writeFileSync("dist/index.html", html);
writeFileSync("dist/portfolio.json", JSON.stringify({ ...data, site: SITE_URL || null }, null, 2));
writeFileSync("dist/llms.txt", llms);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ""}`);
if (SITE_URL) writeFileSync("dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc><lastmod>${data.updated}</lastmod></url></urlset>\n`);
console.log(`built dist/ — ${builds.length} builds, ${capabilities.length} capabilities, ${log.length} log entries${SITE_URL ? `, site ${SITE_URL}` : ""}`);
