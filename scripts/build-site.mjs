import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  normalizeArchiveItem,
  normalizeFeaturedWork,
  normalizeGlobalPressItem,
} from "./lib/portfolio-contract.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://hsin-hsin-yuan-portfolio.vercel.app").replace(/\/+$/, "");
const ASSET_VERSION = createHash("sha256")
  .update(readFileSync(join(root, "src/styles.css")))
  .update(readFileSync(join(root, "src/main.js")))
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
    .map(normalizeFeaturedWork)
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
  return {
    site: JSON.parse(readFileSync(join(baseDir, "data/site.json"), "utf8")),
    collaborations: JSON.parse(readFileSync(join(baseDir, "data/collaborations.json"), "utf8")),
    archive: loadMarkdownCollection(join(baseDir, "content/archive"))
      .map(normalizeArchiveItem),
    press: JSON.parse(readFileSync(join(baseDir, "data/press.json"), "utf8"))
      .map(normalizeGlobalPressItem)
      .sort((a, b) => a.order - b.order),
  };
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

function escapeCssUrl(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll("\n", "\\A ")
    .replaceAll("\r", "\\A ");
}

function cssUrl(value) {
  return `url(&quot;${escapeHtml(escapeCssUrl(value))}&quot;)`;
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

function renderAvailabilityPills(items = []) {
  return items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
}

function renderMetrics(metrics = [], lang, context = "") {
  if (!metrics.length) return "";

  return `
    ${context ? `<p class="mini-metrics-context">${escapeHtml(context)}</p>` : ""}
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

function renderPress(items = [], lang) {
  if (!items.length) return "";

  const label = lang === "en" ? "Press & Interviews" : "媒體報導與訪談";

  return `
    <div class="press-preview">
      <p class="press-preview-title">${escapeHtml(label)}</p>
      <div class="press-preview-grid">
        ${items
          .map((item) => {
            const image = item.image
              ? `<span class="press-preview-image"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.remove()"></span>`
              : "";
            const body = `
              ${image}
              <span class="press-preview-copy">
                <span class="press-preview-type">${escapeHtml(localize(item.type, lang))}</span>
                <strong>${escapeHtml(localize(item.title, lang))}</strong>
                <span>${escapeHtml(localize(item.source, lang))}</span>
              </span>
            `;
            const auditAttrs = [
              item.metadataCheckedAt ? ` data-metadata-checked-at="${escapeHtml(item.metadataCheckedAt)}"` : "",
              item.titleSource ? ` data-title-source="${escapeHtml(item.titleSource)}"` : "",
              item.imageSource ? ` data-image-source="${escapeHtml(item.imageSource)}"` : "",
            ].join("");

            if (item.url) {
              return `<a class="press-preview-card" href="${escapeHtml(item.canonicalUrl || item.url)}" target="_blank" rel="noreferrer"${auditAttrs}>${body}</a>`;
            }

            return `<div class="press-preview-card press-preview-card-muted"${auditAttrs}>${body}</div>`;
          })
          .join("")}
      </div>
    </div>
  `;
}

function mediaFrameContainer({ work, lang, className, style = "", content }) {
  const mediaWatchUrl = work.mediaWatchUrl || work.watchUrl;
  const styleAttr = style ? ` style="${style}"` : "";

  if (!mediaWatchUrl) {
    return `<div class="${className}"${styleAttr}>${content}</div>`;
  }

  const title = localize(work.title, lang);
  const playLabel = lang === "en" ? `Play video: ${title}` : `播放影片：${title}`;

  return `
    <a class="${className} media-frame-link" href="${escapeHtml(mediaWatchUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(playLabel)}"${styleAttr}>
      ${content}
      <span class="work-media-play" aria-hidden="true"><span></span></span>
    </a>
  `;
}

function renderFeaturedReel(work) {
  const hasApprovedFeaturedReel =
    work.featuredReelMode === "after-hold" &&
    work.featuredReelUrl &&
    work.featuredReelPoster;

  if (!hasApprovedFeaturedReel) return "";

  return `
    <video
      class="featured-reel-video"
      data-featured-reel-video
      data-featured-reel-mode="after-hold"
      muted
      loop
      playsinline
      webkit-playsinline
      preload="none"
      poster="${escapeHtml(work.featuredReelPoster)}"
      aria-hidden="true"
      tabindex="-1"
    >
      <source src="${escapeHtml(work.featuredReelUrl)}" type="video/mp4">
    </video>
  `;
}

function mediaFrame(work, lang, copy) {
  const mediaLabel = work.hideMediaLabel
    ? ""
    : Array.isArray(work.mediaTitleLines) && work.mediaTitleLines.length
      ? `<div class="media-label media-label-lines">${work.mediaTitleLines
          .map((line) => `<span>${escapeHtml(line)}</span>`)
          .join("")}</div>`
      : `<div class="media-label">${escapeHtml(work.title.en)}</div>`;
  const mediaClasses = ["media-frame"];
  if (work.featuredMediaAspect === "16:9") {
    mediaClasses.push("media-frame-wide");
  }
  if (work.hideMediaLabel) {
    mediaClasses.push("media-frame-unlabeled");
  }

  if (work.status === "available" && work.videoEmbedUrl) {
    return `
      <div class="${mediaClasses.join(" ")}">
        <iframe src="${escapeHtml(work.videoEmbedUrl)}" title="${escapeHtml(work.title.en)}" allowfullscreen loading="lazy"></iframe>
      </div>
    `;
  }

  if (work.posterImage) {
    const posterFit = work.posterFit === "contain" ? "contain" : "cover";
    const posterGradient = work.hideMediaLabel
      ? "linear-gradient(180deg, rgba(9,9,10,.04), rgba(9,9,10,.26))"
      : "linear-gradient(135deg, rgba(9,9,10,.2), rgba(9,9,10,.78))";

    return mediaFrameContainer({
      work,
      lang,
      className: mediaClasses.join(" "),
      style: `background-image: ${posterGradient}, ${cssUrl(work.posterImage)}; background-size: cover, ${posterFit}; background-position: center, center; background-repeat: no-repeat; background-color: #0b0b0c;`,
      content: `${renderFeaturedReel(work)}${mediaLabel}`,
    });
  }

  const label = work.status === "coming-soon" ? copy.comingLabel : work.title.en;
  return mediaFrameContainer({
    work,
    lang,
    className: [...mediaClasses, `media-${escapeHtml(work.accent || "default")}`].join(" "),
    content: Array.isArray(work.mediaTitleLines) && work.mediaTitleLines.length
      ? mediaLabel
      : `<div class="media-label">${escapeHtml(label)}</div>`,
  });
}

function noWatchStatusLabel(work, lang, copy) {
  const label = localize(work.statusLabel, lang);
  if (label) return label;
  if (work.status === "coming-soon") return copy.comingLabel;
  return "";
}

function renderWork(work, lang, copy) {
  const title = work.title[lang];
  const tagline = work.tagline[lang];
  const description = work.description[lang];
  const role = work.role[lang];
  const platform = localize(work.platform, lang);
  const statusLabel = noWatchStatusLabel(work, lang, copy);
  const watchLabel = localize(work.watchLabel, lang) || (lang === "en" ? "Watch the full series" : "觀看完整系列");
  const watchAction = work.showWatchCta && work.watchUrl
    ? `<a class="button-link" href="${escapeHtml(work.watchUrl)}" target="_blank" rel="noreferrer">${escapeHtml(watchLabel)}</a>`
    : "";
  const statusAction = statusLabel
    ? `<span class="status-badge">${escapeHtml(statusLabel)}</span>`
    : "";
  const action = watchAction || statusAction
    ? `<div class="work-actions">${statusAction}${watchAction}</div>`
    : "";
  const panelClass = work.featuredMediaAspect === "16:9"
    ? "work-panel work-panel-wide-media"
    : "work-panel";

  return `
    <article class="${panelClass}" id="${escapeHtml(work.slug)}">
      ${mediaFrame(work, lang, copy)}
      <div class="work-copy">
        <div class="work-meta">${escapeHtml(work.year)} / ${escapeHtml(role)} / ${escapeHtml(platform)}</div>
        <h3>${escapeHtml(title)}</h3>
        <p class="work-tagline">${escapeHtml(tagline)}</p>
        <p class="work-description">${escapeHtml(description)}</p>
        ${renderTags(work.tags)}
        ${renderMetrics(work.metrics, lang, localize(work.metricsContext, lang))}
        ${renderPress(work.press, lang)}
        ${action}
      </div>
    </article>
  `;
}

function renderWatchLoopItem(work, lang, copy) {
  const title = localize(work.title, lang);
  const role = localize(work.role, lang);
  const tagline = localize(work.tagline, lang);
  const platform = localize(work.platform, lang);
  const opensWatchUrl = work.watchLoopTarget === "watch" && work.watchUrl;
  const href = opensWatchUrl ? work.watchUrl : `#${work.slug}`;
  const linkAttrs = opensWatchUrl ? ' target="_blank" rel="noreferrer"' : "";
  const poster = work.posterImage;
  const image = poster
    ? `style="background-image: ${cssUrl(poster)}"`
    : "";
  const cardClass = poster
    ? "watch-loop-card"
    : "watch-loop-card watch-loop-card-plain";

  return `
    <a class="${cardClass}" href="${escapeHtml(href)}"${linkAttrs} ${image}>
      <span class="watch-loop-scrim" aria-hidden="true"></span>
      <span class="watch-loop-meta">${escapeHtml(platform)} / ${escapeHtml(work.year)}</span>
      <strong>${escapeHtml(title)}</strong>
      <span class="watch-loop-role">${escapeHtml(role)}</span>
      <span class="watch-loop-tagline">${escapeHtml(tagline)}</span>
    </a>
  `;
}

function renderWatchLoop(works, lang, copy) {
  const watchableWorks = works.filter(
    (work) => work.posterImage || work.watchUrl || work.status === "external-only",
  );
  if (!watchableWorks.length) return "";

  return `
    <section class="section watch-loop-section watch-loop" data-watch-loop data-speed="34" aria-label="${escapeHtml(copy.watchShelfAria)}">
      <div class="watch-loop-frame">
        <div class="watch-loop-viewport">
          <div class="watch-loop-track" data-watch-loop-track>
            <div class="watch-loop-sequence" data-watch-loop-sequence>
              ${watchableWorks.map((work) => renderWatchLoopItem(work, lang, copy)).join("")}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderArchiveCard(item, lang) {
  const title = localize(item.title, lang);
  const role = localize(item.role, lang);
  const watchLabel = localize(item.watchLabel, lang);
  const creditLabel = localize(item.creditLabel, lang);
  const hasWatch = Boolean(item.watchUrl && watchLabel);
  const hasCredit = Boolean(item.creditUrl && creditLabel);
  const hasPoster = Boolean(item.posterImage);
  const indexLabel = String(item.order).padStart(2, "0");
  const focalPoint = item.posterFocalPoint;
  const focalStyle = focalPoint
    ? ` style="object-position: ${Number(focalPoint.x) * 100}% ${Number(focalPoint.y) * 100}%"`
    : "";
  const hasApprovedCardReel =
    item.cardReelMode === "after-hold" &&
    item.cardReelUrl &&
    item.cardReelPoster;
  const imageClass = item.posterFit === "contain"
    ? "archive-card-image archive-card-image-contain"
    : "archive-card-image";
  const image = hasPoster
    ? `<img class="${imageClass}" src="${escapeHtml(item.posterImage)}" alt="${escapeHtml(localize(item.imageAlt, lang))}" loading="lazy" decoding="async" onerror="this.remove()"${focalStyle}>`
    : "";
  const reel = hasApprovedCardReel
    ? `<video class="archive-card-reel" data-archive-reel-video data-archive-reel-mode="after-hold" muted loop playsinline webkit-playsinline preload="none" poster="${escapeHtml(item.cardReelPoster)}" aria-hidden="true" tabindex="-1"${focalStyle}><source src="${escapeHtml(item.cardReelUrl)}" type="video/mp4"></video>`
    : "";
  const watchAction = hasWatch
    ? hasCredit
      ? `<a class="archive-card-action" href="${escapeHtml(item.watchUrl)}" target="_blank" rel="noreferrer">${escapeHtml(watchLabel)}</a>`
      : `<span class="archive-card-action">${escapeHtml(watchLabel)}</span>`
    : "";
  const creditAction = hasCredit
    ? `<a class="archive-card-action archive-card-action-secondary" href="${escapeHtml(item.creditUrl)}" target="_blank" rel="noreferrer">${escapeHtml(creditLabel)}</a>`
    : "";
  const actions = watchAction || creditAction
    ? hasCredit
      ? `<span class="archive-card-actions">${watchAction}${creditAction}</span>`
      : watchAction
    : "";
  const tag = hasCredit ? "article" : hasWatch ? "a" : "article";
  const linkAttrs = hasWatch && !hasCredit
    ? ` href="${escapeHtml(item.watchUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${watchLabel}: ${title}`)}"`
    : "";
  const cardClass = hasCredit
    ? "archive-card archive-card-with-actions"
    : "archive-card";
  const mediaClass = hasPoster
    ? "archive-card-media"
    : "archive-card-media archive-card-media-placeholder";
  const mediaTag = hasCredit && hasWatch ? "a" : "span";
  const mediaLinkClass = hasCredit && hasWatch
    ? `${mediaClass} archive-card-media-link`
    : mediaClass;
  const mediaLinkAttrs = hasCredit && hasWatch
    ? ` href="${escapeHtml(item.watchUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${watchLabel}: ${title}`)}"`
    : "";

  return `
    <${tag} class="${cardClass}"${linkAttrs}>
      <span class="archive-card-copy">
        <span class="work-meta">${escapeHtml(item.year)} / ${escapeHtml(role)}</span>
        <strong>${escapeHtml(title)}</strong>
        ${actions}
      </span>
      <${mediaTag} class="${mediaLinkClass}"${mediaLinkAttrs}>
        <span class="archive-card-index" aria-hidden="true">${indexLabel}</span>
        ${image}
        ${reel}
      </${mediaTag}>
    </${tag}>
  `;
}

function renderArchive(archive, lang) {
  return `
    <div class="archive-chronology">
      ${archive.map((item) => renderArchiveCard(item, lang)).join("")}
    </div>
  `;
}

function renderPressNotes(items = [], lang, copy) {
  if (!items.length) return "";

  const notes = items
    .map((item) => {
      const url = item.canonicalUrl || item.url;

      return `
        <a class="press-note-card" href="${escapeHtml(url)}" target="_blank" rel="noreferrer" data-metadata-checked-at="${escapeHtml(item.metadataCheckedAt)}" data-title-source="${escapeHtml(item.titleSource)}" data-image-source="${escapeHtml(item.imageSource)}" data-source-page-url="${escapeHtml(item.sourcePageUrl)}">
          <span class="press-note-part">${escapeHtml(localize(item.part, lang))}</span>
          <span class="press-note-main">
            <span class="press-note-kicker">${escapeHtml(item.year)}</span>
            <strong>${escapeHtml(localize(item.title, lang))}</strong>
            <span class="press-note-meta">${escapeHtml(localize(item.source, lang))}</span>
          </span>
        </a>
      `;
    })
    .join("");

  return `
    <section class="section press-notes-section">
      <div class="press-notes-layout">
        <div class="press-notes-intro">
          <h2 class="section-title">${escapeHtml(copy.pressNotesTitle)}</h2>
        </div>
        <div class="press-note-list">
          ${notes}
        </div>
      </div>
    </section>
  `;
}

function renderCollaborations(items = [], lang) {
  return items
    .map((item) => {
      const name = localize(item.name, lang);
      const label = localize(item.label, lang) || name;
      const content = item.logo
        ? `<img class="partner-logo" src="${escapeHtml(item.logo)}" alt="${escapeHtml(name)} logo" loading="lazy">`
        : `<span class="partner-wordmark">${escapeHtml(label)}</span>`;
      const tag = item.url ? "a" : "div";
      const href = item.url ? ` href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : "";

      return `
        <${tag} class="collab-item"${href} aria-label="${escapeHtml(name)}">
          ${content}
          <span class="partner-name">${escapeHtml(name)}</span>
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

function renderContactHeading(copy) {
  const bridge = copy.contactTitleBridge
    ? `<span class="contact-title-bridge">${escapeHtml(copy.contactTitleBridge)} </span>`
    : "";

  return `<h2 class="contact-title"><span class="contact-title-line">${escapeHtml(copy.contactTitleLead)}</span><span class="contact-title-line">${bridge}<span class="contact-title-accent">${escapeHtml(copy.contactTitleAccent)}</span></span></h2>`;
}

function renderHeroRoleLine(role) {
  return escapeHtml(role).replaceAll("/", `<span class="role-slash">/</span>`);
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
      <button class="button-link contact-submit" type="submit">${escapeHtml(form.submit)}</button>
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
  const switchLang = otherLang(lang);
  const heroTitleLines = (copy.heroTitleLines || [copy.heroTitle]).map((line) => `<span>${escapeHtml(line)}</span>`).join("");
  const heroRoles = (copy.heroRoleLines || copy.heroRoles).map((role) => `<span>${renderHeroRoleLine(role)}</span>`).join("");
  const navItems = [
    { href: "#available", label: copy.availabilityLabel },
    { href: "#works", label: lang === "en" ? "Works" : "作品" },
    { href: "#contact", label: lang === "en" ? "Contact" : "聯絡", className: "nav-contact" },
  ];
  const collaborations = renderCollaborations(site.collaborations, lang);

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
    <link rel="preload" as="image" href="/assets/portfolio/hsin-working-white-space.jpg">
    <link rel="stylesheet" href="/styles.css?v=${ASSET_VERSION}">
    <script type="module" src="/main.js?v=${ASSET_VERSION}"></script>
  </head>
  <body>
    <div class="site-shell">
      <header class="topbar">
        <div class="brand"><span class="brand-desktop">${escapeHtml(copy.navName)}</span><span class="brand-mobile">${escapeHtml(copy.navMobileName || copy.navName)}</span></div>
        <nav class="nav-links" aria-label="Primary">
          ${navItems.map((item) => `<a${item.className ? ` class="${escapeHtml(item.className)}"` : ""} href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}
          <a class="language-switch" href="/${switchLang}/">${switchLang === "en" ? "EN" : "中"}</a>
        </nav>
      </header>

      <main>
        <section class="hero">
          <div class="hero-media" id="showreel">
            <video
              class="hero-showreel-video"
              data-showreel-video
              muted
              playsinline
              webkit-playsinline
              preload="none"
              aria-label="${escapeHtml(copy.showreelTitle)}"
            >
              <source src="/assets/showreel/website-visual-reel.mp4" type="video/mp4">
            </video>
            <button class="hero-play-button" type="button" data-showreel-play aria-label="${escapeHtml(copy.showreelCta)}">
              <span class="hero-play-icon"></span>
            </button>
          </div>
          <div class="hero-content">
            <p class="eyebrow">${escapeHtml(copy.heroEyebrow)}</p>
            <h1 aria-label="${escapeHtml(copy.heroTitle)}">${heroTitleLines}</h1>
            <div class="hero-roles">${heroRoles}</div>
            <p class="hero-subcopy">${escapeHtml(copy.heroSubcopy)}</p>
          </div>
        </section>

        <section class="section collab-section collab-section-early">
          <h2 class="section-title">${escapeHtml(copy.collabTitle)}</h2>
          <div class="collab-grid">${collaborations}</div>
        </section>

        ${renderWatchLoop(works, lang, copy)}

        <section class="section available-section" id="available">
          <div class="available-simple">
            <h2 class="section-title">${escapeHtml(copy.availabilityLabel)}</h2>
            <div class="section-intro">
              <p>${escapeHtml(copy.availabilityIntro)}</p>
            </div>
            <div class="available-pill-list">
              ${renderAvailabilityPills(copy.availability)}
            </div>
          </div>
        </section>

        <section class="section works-section" id="works">
          <div class="works-head">
            <h2 class="section-title">${escapeHtml(copy.worksLabel)}</h2>
            ${copy.worksHint ? `<div class="works-hint">${escapeHtml(copy.worksHint)}</div>` : ""}
          </div>
          <div class="works-stack" data-scroll-stack>
            ${works.map((work) => renderWork(work, lang, copy)).join("")}
          </div>
        </section>

        <section class="section archive-section">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.archiveTitle)}</h2>
            ${copy.archiveSubcopy ? `<p>${escapeHtml(copy.archiveSubcopy)}</p>` : ""}
          </div>
          ${renderArchive(site.archive, lang)}
        </section>

        ${renderPressNotes(site.press, lang, copy)}

        <section class="section contact" id="contact">
          <div class="contact-content">
            ${renderContactHeading(copy)}
            <p>${escapeHtml(copy.contactSubcopy)}</p>
            ${renderContactForm(copy)}
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

  writeFileSync(join(dist, "robots.txt"), renderRobots());
  writeFileSync(join(dist, "sitemap.xml"), renderSitemap());
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build();
}
