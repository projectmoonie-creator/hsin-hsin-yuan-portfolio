import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

export function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Markdown file is missing JSON frontmatter");
  }

  return {
    data: JSON.parse(match[1]),
    body: match[2],
  };
}

export function loadWorks(dir) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = readFileSync(join(dir, file), "utf8");
      const parsed = parseFrontmatter(source);
      return {
        ...parsed.data,
        body: parsed.body.trim(),
      };
    })
    .filter((work) => work.featured)
    .sort((a, b) => a.order - b.order);
}

export function loadMarkdownCollection(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = readFileSync(join(dir, file), "utf8");
      const parsed = parseFrontmatter(source);
      return {
        ...parsed.data,
        body: parsed.body.trim(),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function loadImpact(file) {
  return JSON.parse(readFileSync(file, "utf8")).sort((a, b) => a.order - b.order);
}

export function loadSiteData(baseDir = root) {
  return {
    site: JSON.parse(readFileSync(join(baseDir, "data/site.json"), "utf8")),
    collaborations: JSON.parse(readFileSync(join(baseDir, "data/collaborations.json"), "utf8")),
    impact: loadImpact(join(baseDir, "data/impact.json")),
    archive: loadMarkdownCollection(join(baseDir, "content/archive")),
    lab: loadMarkdownCollection(join(baseDir, "content/lab")),
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function otherLang(lang) {
  return lang === "en" ? "zh" : "en";
}

function localize(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] ?? value.en ?? "";
  }
  return value ?? "";
}

function cleanHtml(html) {
  return html.replace(/[ \t]+$/gm, "");
}

function renderTags(tags = []) {
  return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
}

function renderPills(items = []) {
  return items.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("");
}

function renderMetrics(metrics = [], lang) {
  if (!metrics.length) return "";

  return `
    <div class="mini-metrics">
      ${metrics
        .map(
          (metric) => `
            <div class="mini-metric">
              <strong>${escapeHtml(metric.value)}</strong>
              <span>${escapeHtml(localize(metric.label, lang))}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCaseStudy(items = [], lang) {
  if (!items.length) return "";

  return `
    <div class="case-study">
      ${items
        .map(
          (item) => `
            <div class="case-study-item">
              <span>${escapeHtml(localize(item.label, lang))}</span>
              <p>${escapeHtml(localize(item.text, lang))}</p>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function mediaFrame(work, copy) {
  if (work.status === "available" && work.videoEmbedUrl) {
    return `
      <div class="media-frame">
        <iframe src="${escapeHtml(work.videoEmbedUrl)}" title="${escapeHtml(work.title.en)}" allowfullscreen loading="lazy"></iframe>
      </div>
    `;
  }

  if (work.posterImage) {
    return `
      <div class="media-frame" style="background-image: linear-gradient(135deg, rgba(9,9,10,.2), rgba(9,9,10,.78)), url('${escapeHtml(work.posterImage)}'); background-size: cover; background-position: center;">
        <div class="media-label">${escapeHtml(work.title.en)}</div>
      </div>
    `;
  }

  const label = work.status === "coming-soon" ? copy.comingLabel : work.title.en;
  return `
    <div class="media-frame media-${escapeHtml(work.accent || "default")}">
      <div class="media-label">${escapeHtml(label)}</div>
    </div>
  `;
}

function renderWork(work, lang, copy) {
  const title = work.title[lang];
  const tagline = work.tagline[lang];
  const description = work.description[lang];
  const role = work.role[lang];
  const action = work.watchUrl
    ? `<a class="button-link" href="${escapeHtml(work.watchUrl)}" target="_blank" rel="noreferrer">${escapeHtml(copy.watchLabel)}</a>`
    : `<span class="status-badge">${escapeHtml(copy.comingLabel)}</span>`;

  return `
    <article class="work-panel" id="${escapeHtml(work.slug)}">
      ${mediaFrame(work, copy)}
      <div class="work-copy">
        <div class="work-meta">${escapeHtml(work.year)} / ${escapeHtml(role)} / ${escapeHtml(work.platform)}</div>
        <h3>${escapeHtml(title)}</h3>
        <p class="work-tagline">${escapeHtml(tagline)}</p>
        <p class="work-description">${escapeHtml(description)}</p>
        ${renderTags(work.tags)}
        ${renderMetrics(work.metrics, lang)}
        ${renderCaseStudy(work.caseStudy, lang)}
        ${action}
      </div>
    </article>
  `;
}

function renderImpact(impact, lang) {
  return impact
    .map(
      (item) => `
        <article class="impact-item">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(localize(item.label, lang))}</span>
          <p>${escapeHtml(localize(item.detail, lang))}</p>
        </article>
      `,
    )
    .join("");
}

function renderLab(lab, lang) {
  return lab
    .map(
      (item) => `
        <article class="lab-card">
          <p class="card-kicker">${escapeHtml(localize(item.kicker, lang))}</p>
          <h3>${escapeHtml(localize(item.title, lang))}</h3>
          <p>${escapeHtml(localize(item.summary, lang))}</p>
        </article>
      `,
    )
    .join("");
}

function renderArchive(archive, lang) {
  return archive
    .map(
      (item) => `
        <article class="archive-item">
          <div>
            <p class="work-meta">${escapeHtml(item.year)} / ${escapeHtml(localize(item.role, lang))} / ${escapeHtml(item.platform)}</p>
            <h3>${escapeHtml(localize(item.title, lang))}</h3>
          </div>
          ${renderMetrics(item.metrics, lang)}
        </article>
      `,
    )
    .join("");
}

function renderInfoCards(items = []) {
  return items
    .map(
      (item) => `
        <article class="service-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.line)}</p>
        </article>
      `,
    )
    .join("");
}

function renderCollaborations(items = []) {
  return items
    .map((item) => {
      const content = item.logo
        ? `<img class="partner-logo" src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.name)} logo" loading="lazy">`
        : `<span class="partner-wordmark">${escapeHtml(item.label || item.name)}</span>`;
      const tag = item.url ? "a" : "div";
      const href = item.url ? ` href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : "";

      return `
        <${tag} class="collab-item"${href} aria-label="${escapeHtml(item.name)}">
          ${content}
          <span class="partner-name">${escapeHtml(item.name)}</span>
        </${tag}>
      `;
    })
    .join("");
}

function renderContactLinks(links = []) {
  return links
    .map((link) => `<a href="${escapeHtml(link.href)}" target="${link.href.startsWith("mailto:") ? "_self" : "_blank"}" rel="noreferrer">${escapeHtml(link.label)}</a>`)
    .join("");
}

export function renderPage({ lang, site, works }) {
  const copy = site.site[lang];
  const switchLang = otherLang(lang);
  const heroRoles = copy.heroRoles.map((role) => `<span>${escapeHtml(role)}</span>`).join('<span class="slash">/</span>');
  const navItems = [
    { href: "#about", label: copy.aboutTitle },
    { href: "#works", label: lang === "en" ? "Works" : "作品" },
    { href: "#contact", label: lang === "en" ? "Contact" : "聯絡" },
  ];
  const services = renderInfoCards(copy.services);
  const workModes = renderInfoCards(copy.workModes);
  const collaborations = renderCollaborations(site.collaborations);

  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(copy.metaDescription)}">
    <title>${escapeHtml(copy.metaTitle)}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/styles.css">
    <script type="module" src="/main.js"></script>
  </head>
  <body>
    <div class="site-shell">
      <header class="topbar">
        <div class="brand">${escapeHtml(copy.navName)}</div>
        <nav class="nav-links" aria-label="Primary">
          ${navItems.map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}
          <a class="language-switch" href="/${switchLang}/">${switchLang === "en" ? "EN" : "中"}</a>
        </nav>
      </header>

      <main>
        <section class="hero">
          <div class="hero-media" aria-hidden="true"></div>
          <div class="hero-content">
            <p class="eyebrow">${escapeHtml(copy.heroEyebrow)}</p>
            <h1>${escapeHtml(copy.heroTitle)}</h1>
            <div class="hero-roles">${heroRoles}</div>
            <p class="hero-subcopy">${escapeHtml(copy.heroSubcopy)}</p>
            <div class="hero-actions">
              <a class="button-link" href="mailto:${escapeHtml(copy.email)}">${escapeHtml(copy.heroPrimaryCta)}</a>
              <a class="button-link button-link-muted" href="#works">${escapeHtml(copy.heroSecondaryCta)}</a>
            </div>
          </div>
        </section>

        <section class="section about-section" id="about">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.aboutTitle)}</h2>
            <p>${escapeHtml(copy.aboutLead)}</p>
          </div>
          <div class="about-grid">
            <div class="about-copy">
              <p>${escapeHtml(copy.aboutBody)}</p>
              <ul>
                ${copy.aboutNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
              </ul>
            </div>
            <aside class="availability-card">
              <p class="card-kicker">${escapeHtml(copy.availabilityLabel)}</p>
              <div class="pill-row">${renderPills(copy.availability)}</div>
            </aside>
          </div>
        </section>

        <section class="section impact-section">
          <h2 class="section-title">${escapeHtml(copy.impactLabel)}</h2>
          <div class="impact-grid">${renderImpact(site.impact, lang)}</div>
        </section>

        <section class="section works-section" id="works" data-horizontal-scroll>
          <div class="works-head">
            <h2 class="section-title">${escapeHtml(copy.worksLabel)}</h2>
            <div class="works-hint">${escapeHtml(copy.worksHint)}</div>
          </div>
          <div class="works-track">
            ${works.map((work) => renderWork(work, lang, copy)).join("")}
          </div>
        </section>

        <section class="section">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.createTitle)}</h2>
            <p>${escapeHtml(copy.createSubcopy)}</p>
          </div>
          <div class="services-grid">${services}</div>
        </section>

        <section class="section work-with-me">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.workWithMeTitle)}</h2>
            <p>${escapeHtml(copy.workWithMeSubcopy)}</p>
          </div>
          <div class="services-grid">${workModes}</div>
        </section>

        <section class="section lab-section">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.labTitle)}</h2>
            <p>${escapeHtml(copy.labSubcopy)}</p>
          </div>
          <div class="lab-grid">${renderLab(site.lab, lang)}</div>
        </section>

        <section class="section archive-section">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.archiveTitle)}</h2>
            <p>${escapeHtml(copy.archiveSubcopy)}</p>
          </div>
          <div class="archive-list">${renderArchive(site.archive, lang)}</div>
        </section>

        <section class="section">
          <h2 class="section-title">${escapeHtml(copy.collabTitle)}</h2>
          <div class="collab-grid">${collaborations}</div>
        </section>

        <section class="section contact" id="contact">
          <div class="contact-content">
            <h2>${escapeHtml(copy.contactTitle)}</h2>
            <p>${escapeHtml(copy.contactSubcopy)}</p>
            <a class="button-link" href="mailto:${escapeHtml(copy.email)}">${escapeHtml(copy.contactCta)}</a>
            <div class="contact-links">${renderContactLinks(copy.contactLinks)}</div>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>`;
}

function build() {
  const dist = join(root, "dist");
  rmSync(dist, { force: true, recursive: true });
  mkdirSync(join(dist, "en"), { recursive: true });
  mkdirSync(join(dist, "zh"), { recursive: true });

  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));

  writeFileSync(join(dist, "en/index.html"), cleanHtml(renderPage({ lang: "en", site, works })));
  writeFileSync(join(dist, "zh/index.html"), cleanHtml(renderPage({ lang: "zh", site, works })));
  writeFileSync(join(dist, "index.html"), '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/en/">');
  cpSync(join(root, "src/styles.css"), join(dist, "styles.css"));
  cpSync(join(root, "src/main.js"), join(dist, "main.js"));

  if (existsSync(join(root, "public"))) {
    cpSync(join(root, "public"), dist, { recursive: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build();
}
