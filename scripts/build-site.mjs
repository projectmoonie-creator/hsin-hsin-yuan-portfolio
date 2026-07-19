import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://hsin-hsin-yuan-portfolio.vercel.app").replace(/\/+$/, "");
const ASSET_VERSION = createHash("sha256")
  .update(readFileSync(join(root, "src/styles.css")))
  .update(readFileSync(join(root, "src/main.js")))
  .update(readFileSync(join(root, "src/scene-state.js")))
  .digest("hex")
  .slice(0, 12);

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

export function loadSiteData(baseDir = root) {
  const media = JSON.parse(readFileSync(join(baseDir, "data/media.json"), "utf8"));
  validateMediaManifest(media, join(baseDir, "public"));
  return {
    site: JSON.parse(readFileSync(join(baseDir, "data/site.json"), "utf8")),
    media,
    collaborations: JSON.parse(readFileSync(join(baseDir, "data/collaborations.json"), "utf8")),
    archive: loadMarkdownCollection(join(baseDir, "content/archive")),
    lab: loadMarkdownCollection(join(baseDir, "content/lab")),
  };
}

export function validateMediaManifest(media, publicDir = "") {
  const hero = media?.hero;
  if (!hero || typeof hero !== "object") throw new Error("media.hero is required");
  if (typeof hero.background !== "string" || !hero.background) throw new Error("media.hero.background is required");
  if (typeof hero.foregroundCutout !== "string") throw new Error("media.hero.foregroundCutout must be a string");
  if (hero.treatment === "portrait-carrier" && !hero.foregroundCutout) {
    throw new Error("media.hero.foregroundCutout is required for portrait-carrier");
  }
  if (typeof hero.abstractLayer !== "string" || !hero.abstractLayer) throw new Error("media.hero.abstractLayer is required");
  if (!Array.isArray(hero.alternatePortraits)) throw new Error("media.hero.alternatePortraits must be an array");
  if (!/^\d{1,3}% \d{1,3}%$/.test(hero.desktopFocalPoint || "")) {
    throw new Error("media.hero.desktopFocalPoint must use X% Y%");
  }
  if (!/^\d{1,3}% \d{1,3}%$/.test(hero.mobileFocalPoint || "")) {
    throw new Error("media.hero.mobileFocalPoint must use X% Y%");
  }
  if (typeof hero.alt?.en !== "string" || !hero.alt.en.trim()) throw new Error("media.hero.alt.en is required");
  if (typeof hero.alt?.zh !== "string" || !hero.alt.zh.trim()) throw new Error("media.hero.alt.zh is required");
  if (typeof hero.treatment !== "string" || !hero.treatment) throw new Error("media.hero.treatment is required");

  const practiceModes = media?.practiceModes;
  if (!Array.isArray(practiceModes) || practiceModes.length !== 3) {
    throw new Error("media.practiceModes must contain exactly three modes");
  }
  const expectedModes = ["documentary", "cross-cultural", "editorial-systems"];
  for (const [index, mode] of practiceModes.entries()) {
    if (mode?.id !== expectedModes[index]) throw new Error(`media.practiceModes[${index}].id must be ${expectedModes[index]}`);
    if (typeof mode.primary !== "string" || !mode.primary) throw new Error(`media.practiceModes[${index}].primary is required`);
    if (typeof mode.supporting !== "string" || !mode.supporting) throw new Error(`media.practiceModes[${index}].supporting is required`);
  }

  if (publicDir) {
    const assets = [
      ["hero.background", hero.background],
      ["hero.foregroundCutout", hero.foregroundCutout],
      ["hero.abstractLayer", hero.abstractLayer],
      ...hero.alternatePortraits.map((asset, index) => [`hero.alternatePortraits[${index}]`, asset]),
      ...practiceModes.flatMap((mode, index) => [
        [`practiceModes[${index}].primary`, mode.primary],
        [`practiceModes[${index}].supporting`, mode.supporting],
      ]),
    ];
    for (const [role, asset] of assets) {
      if (!asset || /^https?:/.test(asset)) continue;
      const localPath = join(publicDir, asset.replace(/^\//, ""));
      if (!existsSync(localPath)) throw new Error(`media.${role} does not exist: ${localPath}`);
    }
  }
  return media;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
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

function renderProof(metrics = [], lang) {
  if (!metrics.length) return "";

  return `
    <div class="work-proof">
      ${metrics
        .map(
          (metric) => `
            <div class="work-proof-item">
              <strong>${escapeHtml(metric.value)}</strong>
              <span>${escapeHtml(localize(metric.label, lang))}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function noWatchStatusLabel(work, lang, copy) {
  const label = localize(work.statusLabel, lang);
  if (label) return label;
  if (work.status === "coming-soon") return copy.comingLabel;
  return "";
}

function watchActionLabel(work, lang, copy) {
  if (!work.watchUrl) return noWatchStatusLabel(work, lang, copy);

  const labels = {
    single: { en: "Watch the full episode", zh: "觀看完整單集" },
    series: { en: "Watch the series", zh: "觀看完整系列" },
    collection: { en: "Watch selected films", zh: "觀看精選影片" },
    sample: { en: "Watch representative segment", zh: "觀看代表片段" },
  };

  return labels[work.watchMode]?.[lang] ?? copy.watchLabel;
}

function renderWorkMedia(work, lang, copy) {
  const title = localize(work.title, lang);
  if (!work.posterImage) {
    const textLabel = noWatchStatusLabel(work, lang, copy) || (lang === "en" ? "Image in development" : "影像整理中");
    return `
      <div class="work-scene-media work-scene-media-text" data-text-led>
        <span>${escapeHtml(title)}</span>
        <em>${escapeHtml(textLabel)}</em>
      </div>
    `;
  }

  const supporting = (work.supportingImages || [])
    .slice(0, 2)
    .map(
      (image, index) => `
        <figure class="work-supporting work-supporting-${index + 1}">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(localize(image.alt, lang))}" loading="lazy" decoding="async">
        </figure>
      `,
    )
    .join("");

  return `
    <div class="work-scene-media" style="--work-focal-point:${escapeHtml(work.focalPoint || "50% 50%")}" data-image-led>
      <figure class="work-primary">
        <img src="${escapeHtml(work.posterImage)}" alt="${escapeHtml(localize(work.posterAlt, lang) || title)}" loading="lazy" decoding="async">
      </figure>
      ${supporting}
    </div>
  `;
}

function renderWorkScene(work, lang, copy, index) {
  const title = localize(work.title, lang);
  const tagline = localize(work.tagline, lang);
  const description = localize(work.description, lang);
  const role = localize(work.role, lang);
  const actionLabel = watchActionLabel(work, lang, copy);
  const action = work.watchUrl
    ? `<a class="work-scene-action" href="${escapeHtml(work.watchUrl)}" target="_blank" rel="noreferrer">${escapeHtml(actionLabel)} <span aria-hidden="true">↗</span></a>`
    : actionLabel
      ? `<span class="work-scene-status">${escapeHtml(actionLabel)}</span>`
      : "";

  return `
    <article class="work-scene" id="${escapeHtml(work.slug)}" data-work-scene data-scene-index="${index}">
      <div class="work-scene-canvas">
        <span class="work-scene-ghost" aria-hidden="true">${escapeHtml(title)}</span>
        ${renderWorkMedia(work, lang, copy)}
      </div>
      <div class="work-scene-copy">
        <p class="work-scene-meta">${escapeHtml(work.year)} · ${escapeHtml(role)} · ${escapeHtml(work.platform)}</p>
        <h3>${escapeHtml(title)}</h3>
        <p class="work-scene-tagline">${escapeHtml(tagline)}</p>
        <p class="work-scene-description">${escapeHtml(description)}</p>
        ${renderProof(work.metrics, lang)}
        ${action}
      </div>
    </article>
  `;
}

function renderPracticeModes(copy, media, lang) {
  const buttons = copy.practiceModes
    .map(
      (mode, index) => `
        <button class="practice-mode${index === 0 ? " is-active" : ""}" type="button" data-practice-mode="${escapeHtml(mode.id)}" aria-pressed="${index === 0 ? "true" : "false"}">
          <span>${escapeHtml(mode.verb)}</span>
          ${escapeHtml(mode.label)}
        </button>
      `,
    )
    .join("");

  const scenes = copy.practiceModes
    .map((mode, index) => {
      const modeMedia = media.practiceModes[index];
      return `
        <article class="practice-scene${index === 0 ? " is-active" : ""}" data-practice-scene="${escapeHtml(mode.id)}" data-signal="${escapeHtml(modeMedia.signal)}">
          <div class="practice-scene-copy">
            <span>${escapeHtml(mode.verb)}</span>
            <h2>${escapeHtml(mode.title)}</h2>
            <p>${escapeHtml(mode.body)}</p>
          </div>
          <figure class="practice-scene-image practice-scene-image-primary">
            <img src="${escapeHtml(modeMedia.primary)}" alt="" loading="lazy" decoding="async">
          </figure>
          <figure class="practice-scene-image practice-scene-image-supporting">
            <img src="${escapeHtml(modeMedia.supporting)}" alt="" loading="lazy" decoding="async">
          </figure>
        </article>
      `;
    })
    .join("");

  return `
    <div class="practice-rail" role="group" aria-label="${escapeHtml(copy.practiceRailAria)}">${buttons}</div>
    <div class="practice-scenes">${scenes}</div>
  `;
}

function renderArchive(archive, lang) {
  return archive
    .map(
      (item) => `
        <article class="history-row">
          <div>
            <p class="history-meta">${escapeHtml(item.year)} · ${escapeHtml(localize(item.role, lang))} · ${escapeHtml(item.platform)}</p>
            <h3>${escapeHtml(localize(item.title, lang))}</h3>
            ${item.body ? `<p class="history-body">${escapeHtml(item.body)}</p>` : ""}
          </div>
          ${renderProof(item.metrics, lang)}
        </article>
      `,
    )
    .join("");
}

function renderCollaborations(items = []) {
  return items
    .map((item) => {
      const content = item.logo
        ? `<img class="collaboration-logo" src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.name)} logo" loading="lazy">`
        : `<span class="collaboration-wordmark">${escapeHtml(item.label || item.name)}</span>`;
      const tag = item.url ? "a" : "div";
      const href = item.url ? ` href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : "";

      return `
        <${tag} class="collaboration-mark"${href} aria-label="${escapeHtml(item.name)}">
          ${content}
          <span class="collaboration-name">${escapeHtml(item.name)}</span>
        </${tag}>
      `;
    })
    .join("");
}

function renderContactLinks(links = []) {
  return links
    .map((link) => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
    .join("");
}

function renderContactForm(copy) {
  const form = copy.contactForm;

  return `
    <form class="contact-form" action="/api/contact" method="post" data-contact-form>
      <input type="hidden" name="startedAt" value="" data-contact-started-at>
      <label class="contact-field contact-field-hidden" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabindex="-1" autocomplete="off">
      </label>
      <label class="contact-field">
        <span>${escapeHtml(form.name)}</span>
        <input name="name" type="text" autocomplete="name" required>
      </label>
      <label class="contact-field">
        <span>${escapeHtml(form.email)}</span>
        <input name="email" type="email" autocomplete="email" required>
      </label>
      <label class="contact-field">
        <span>${escapeHtml(form.projectType)}</span>
        <input name="projectType" type="text" required>
      </label>
      <label class="contact-field">
        <span>${escapeHtml(form.link)}</span>
        <input name="link" type="url" inputmode="url">
      </label>
      <label class="contact-field contact-field-wide">
        <span>${escapeHtml(form.message)}</span>
        <textarea name="message" rows="6" required></textarea>
      </label>
      <button class="contact-submit" type="submit">${escapeHtml(form.submit)} <span aria-hidden="true">↗</span></button>
      <p class="contact-status" data-contact-status aria-live="polite" data-success="${escapeHtml(form.success)}" data-error="${escapeHtml(form.error)}"></p>
    </form>
  `;
}

function renderPersonJsonLd(site) {
  const en = site.site.en;
  const sameAs = Array.from(
    new Set([
      ...(en.contactLinks || []).map((link) => link.href),
      "https://www.taiwanplus.com/shows/documentary/arts/410/my-art-my-voice/250220001/whats-the-vibe-in-taiwan-my-art-my-voice",
      "https://www.mirrormedia.mg/story/20250224insight002",
      "https://www.verymulan.com/story/真誠地往前走，走進創作的大海：專訪巴黎文化奧運紀錄片導演袁欣欣-15241.html",
    ]),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hsin-Hsin Yuan",
    alternateName: "袁欣欣",
    url: SITE_ORIGIN,
    jobTitle: ["Documentary Director", "Writer", "Producer", "Cross-Cultural Storyteller"],
    description: en.metaDescription,
    sameAs,
  };
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}

function renderSitemap(lastmod = new Date().toISOString().slice(0, 10)) {
  const alternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_ORIGIN}/en/"/>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="${SITE_ORIGIN}/zh/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/en/"/>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_ORIGIN}/en/</loc>
    <lastmod>${lastmod}</lastmod>${alternates}
  </url>
  <url>
    <loc>${SITE_ORIGIN}/zh/</loc>
    <lastmod>${lastmod}</lastmod>${alternates}
  </url>
</urlset>
`;
}

export function renderPage({ lang, site, works }) {
  const copy = site.site[lang];
  const heroMedia = site.media.hero;
  const featuredWorks = works.slice(0, 3);
  const switchLang = otherLang(lang);
  const navItems = [
    { href: "#works", label: lang === "en" ? "Works" : "作品" },
    { href: "#practice", label: lang === "en" ? "Practice" : "實踐" },
    { href: "#contact", label: lang === "en" ? "Contact" : "聯絡" },
  ];
  const collaborations = renderCollaborations(site.collaborations);
  const portraitStatement = copy.portraitStatement;

  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(copy.metaDescription)}">
    <title>${escapeHtml(copy.metaTitle)}</title>
    <link rel="canonical" href="${SITE_ORIGIN}/${lang}/">
    <link rel="alternate" hreflang="en" href="${SITE_ORIGIN}/en/">
    <link rel="alternate" hreflang="zh-Hant" href="${SITE_ORIGIN}/zh/">
    <link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/en/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Hsin-Hsin Yuan">
    <meta property="og:title" content="${escapeHtml(copy.metaTitle)}">
    <meta property="og:description" content="${escapeHtml(copy.metaDescription)}">
    <meta property="og:url" content="${SITE_ORIGIN}/${lang}/">
    <meta property="og:image" content="${SITE_ORIGIN}/assets/og-image.jpg">
    <meta property="og:locale" content="${lang === "en" ? "en_US" : "zh_TW"}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${escapeJsonForHtml(renderPersonJsonLd(site))}</script>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preload" as="image" href="${escapeHtml(heroMedia.background)}">
    <link rel="stylesheet" href="/styles.css?v=${ASSET_VERSION}">
    <script type="module" src="/main.js?v=${ASSET_VERSION}"></script>
  </head>
  <body>
    <div class="site-shell">
      <header class="topbar">
        <a class="brand" href="#top" aria-label="${escapeHtml(copy.name)}">${escapeHtml(copy.name)}</a>
        <nav class="nav-links" aria-label="Primary">
          ${navItems.map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}
          <a class="language-switch" href="/${switchLang}/">${switchLang === "en" ? "EN" : "中"}</a>
        </nav>
      </header>

      <main id="top">
        <section class="portrait-carrier" data-portrait-carrier data-phase="opening">
          <div class="portrait-sticky">
            <div class="portrait-signal" aria-hidden="true"></div>
            <div class="portrait-frame" id="showreel">
              <img class="portrait-frame-art" src="${escapeHtml(heroMedia.abstractLayer)}" alt="" aria-hidden="true">
              <video
                class="portrait-showreel-video"
                data-showreel-video
                muted
                playsinline
                webkit-playsinline
                preload="none"
                aria-label="${escapeHtml(copy.showreelTitle)}"
              >
                <source src="/assets/showreel/website-visual-reel.mp4" type="video/mp4">
              </video>
              <button class="portrait-play" type="button" data-showreel-play aria-label="${escapeHtml(copy.showreelCta)}">
                <span aria-hidden="true">▶</span>
                ${escapeHtml(copy.showreelCta)}
              </button>
            </div>
            <img
              class="portrait-foreground"
              src="${escapeHtml(heroMedia.foregroundCutout)}"
              alt="${escapeHtml(localize(heroMedia.alt, lang))}"
              style="--portrait-desktop-focal:${escapeHtml(heroMedia.desktopFocalPoint)};--portrait-mobile-focal:${escapeHtml(heroMedia.mobileFocalPoint)}"
            >
            <div class="portrait-intro">
              <p class="portrait-kicker">${lang === "en" ? "Director · Writer · Story partner" : "導演 · 編劇 · 故事夥伴"}</p>
              <h1>${escapeHtml(copy.name)}</h1>
              <p class="portrait-role">${escapeHtml(copy.portraitRole)}</p>
              <p class="portrait-statement">${escapeHtml(portraitStatement)} <em>${escapeHtml(copy.portraitAccent)}</em>.</p>
              <div class="portrait-actions">
                <button type="button" data-showreel-trigger>${escapeHtml(copy.showreelCta)}</button>
                <a href="#contact">${escapeHtml(copy.portraitContactCta)}</a>
              </div>
            </div>
            ${renderPracticeModes(copy, site.media, lang)}
            <div class="portrait-scroll-cue" aria-hidden="true"><span></span>${lang === "en" ? "Scroll to enter" : "向下進入"}</div>
          </div>
        </section>

        <section class="work-theatre" id="works" data-work-theatre>
          <div class="work-theatre-sticky">
            <header class="work-theatre-head">
              <p>${escapeHtml(copy.workTheatreKicker)}</p>
              <h2>${escapeHtml(copy.workTheatreTitle)}</h2>
              <div class="work-theatre-count" aria-live="polite"><span data-work-current>01</span><i></i><span>03</span></div>
            </header>
            <div class="work-scenes">
              ${featuredWorks.map((work, index) => renderWorkScene(work, lang, copy, index)).join("")}
            </div>
          </div>
        </section>

        <section class="editorial-section practice-summary" id="practice">
          <p class="section-label">${escapeHtml(copy.availabilityLabel)}</p>
          <div class="practice-summary-copy">
            <h2>${escapeHtml(copy.createTitle)}</h2>
            <p>${escapeHtml(copy.createSubcopy)}</p>
            <p>${escapeHtml(copy.availabilityIntro)}</p>
          </div>
        </section>

        <section class="collaboration-band" aria-labelledby="collaboration-title">
          <h2 id="collaboration-title">${escapeHtml(copy.collabTitle)}</h2>
          <div class="collaboration-line">${collaborations}</div>
        </section>

        <section class="editorial-section history-section">
          <div class="history-intro">
            <p class="section-label">${escapeHtml(copy.archiveTitle)}</p>
            <p>${escapeHtml(copy.archiveSubcopy)}</p>
          </div>
          <div class="history-list">${renderArchive(site.archive, lang)}</div>
        </section>

        <section class="contact" id="contact">
          <div class="contact-content">
            <p class="section-label">${lang === "en" ? "Contact" : "聯絡"}</p>
            <h2>${escapeHtml(copy.contactTitle)}</h2>
            <p>${escapeHtml(copy.contactSubcopy)}</p>
            ${renderContactForm(copy)}
            <div class="contact-links">${renderContactLinks(copy.contactLinks)}</div>
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <p>${escapeHtml(copy.name)}</p>
        <p>${escapeHtml(copy.portraitRole)}</p>
        <a href="#top">${lang === "en" ? "Back to top" : "回到頁首"} ↑</a>
      </footer>
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
  cpSync(join(root, "src/scene-state.js"), join(dist, "scene-state.js"));

  if (existsSync(join(root, "public"))) {
    cpSync(join(root, "public"), dist, { recursive: true });
  }

  writeFileSync(join(dist, "robots.txt"), renderRobots());
  writeFileSync(join(dist, "sitemap.xml"), renderSitemap());
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build();
}
