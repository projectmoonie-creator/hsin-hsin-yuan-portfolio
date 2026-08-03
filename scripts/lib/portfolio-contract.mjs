export const PRESENTATION_VARIANTS = Object.freeze({
  featured: Object.freeze({
    desktopMediaVariant: Object.freeze(["fill-card", "centered-16x9"]),
    mobileMediaAspect: Object.freeze(["16:9"]),
    siteTitleOverlay: Object.freeze(["none"]),
    sourceArtworkTitle: Object.freeze(["present", "absent"]),
  }),
  archive: Object.freeze({
    cardVariant: Object.freeze(["standard"]),
    mediaCapability: Object.freeze(["poster", "index-fallback"]),
  }),
  press: Object.freeze({
    work: Object.freeze(["thumbnail-card"]),
    global: Object.freeze(["text-note"]),
  }),
});

export const FIELD_CLASSIFICATION = Object.freeze({
  featured: Object.freeze({
    requiredRendered: Object.freeze([
      "slug", "featured", "order", "status", "year", "title", "role",
      "platform", "tagline", "description", "presentation",
    ]),
    optionalRendered: Object.freeze([
      "accent", "featuredReelMode", "featuredReelPoster", "featuredReelUrl",
      "figmaPosterImage", "metrics", "metricsContext", "posterAlt", "posterFit",
      "posterImage", "press", "showWatchCta", "statusLabel", "tags",
      "videoEmbedUrl", "watchLabel", "watchLoopTarget", "watchMode", "watchUrl",
      "mediaWatchUrl", "mediaTitleLines",
    ]),
    evidenceOnly: Object.freeze([
      "focalPoint", "metricsCheckedAt", "metricsSourceUrl", "posterDimensions",
      "posterFocalPoint", "posterRightsStatus", "posterSourceSha256",
      "posterSourceTimecode", "posterSourceUrl", "posterVariant", "sourceNote",
    ]),
    retired: Object.freeze(["hideMediaLabel", "featuredMediaAspect"]),
  }),
  archive: Object.freeze({
    requiredRendered: Object.freeze(["slug", "order", "year", "title", "role"]),
    optionalRendered: Object.freeze([
      "cardReelDuration", "cardReelMode", "cardReelPoster", "cardReelUrl",
      "creditLabel", "creditUrl", "imageAlt", "posterFit", "posterImage",
      "watchLabel", "watchUrl",
    ]),
    evidenceOnly: Object.freeze([
      "cardReelRightsStatus", "metrics", "officialSourceStatus",
      "officialSourceUrl", "platform", "posterDimensions", "posterFocalPoint",
      "posterRightsStatus", "posterSourceTimecode", "posterSourceUrl", "sourceNote",
      "summary",
    ]),
    retired: Object.freeze([]),
  }),
  workPress: Object.freeze({
    requiredRendered: Object.freeze(["type", "title", "source", "canonicalUrl"]),
    optionalRendered: Object.freeze(["image", "url"]),
    evidenceOnly: Object.freeze(["titleSource", "imageSource", "metadataCheckedAt"]),
    retired: Object.freeze([]),
  }),
  globalPress: Object.freeze({
    requiredRendered: Object.freeze([
      "id", "order", "year", "part", "title", "source", "canonicalUrl",
    ]),
    optionalRendered: Object.freeze(["url"]),
    evidenceOnly: Object.freeze([
      "imageSource", "metadataCheckedAt", "participationStatus", "rightsStatus",
      "sourcePageUrl", "titleSource",
    ]),
    retired: Object.freeze([]),
  }),
});

function labelFor(source, fallback) {
  return source?.slug || source?.id || fallback;
}

function requireField(source, field, kind) {
  if (!Object.hasOwn(source, field) || source[field] === "" || source[field] == null) {
    throw new Error(`${kind} ${labelFor(source, "<unknown>")} is missing ${field}`);
  }
}

function requireInteger(source, field, kind) {
  requireField(source, field, kind);
  if (!Number.isInteger(source[field])) {
    throw new Error(`${kind} ${labelFor(source, "<unknown>")} ${field} must be an integer`);
  }
}

function requireLocalized(source, field, kind) {
  requireField(source, field, kind);
  const value = source[field];
  if (!value || typeof value !== "object" || Array.isArray(value)
    || typeof value.en !== "string" || !value.en.trim()
    || typeof value.zh !== "string" || !value.zh.trim()) {
    throw new Error(`${kind} ${labelFor(source, "<unknown>")} requires bilingual ${field}`);
  }
}

function requireLocalizable(source, field, kind) {
  requireField(source, field, kind);
  if (typeof source[field] === "string" && source[field].trim()) return;
  requireLocalized(source, field, kind);
}

function requireOneOf(source, field, allowed, kind) {
  requireField(source, field, kind);
  if (!allowed.includes(source[field])) {
    throw new Error(`${kind} ${labelFor(source, "<unknown>")} ${field} must be one of: ${allowed.join(", ")}`);
  }
}

function pick(source, fields) {
  const result = {};
  for (const field of fields) {
    if (Object.hasOwn(source, field)) result[field] = source[field];
  }
  return result;
}

function contractFor(kind, source, classification, presentation) {
  return {
    kind,
    public: {
      ...pick(source, classification.requiredRendered),
      ...pick(source, classification.optionalRendered),
      presentation,
    },
    evidence: pick(source, classification.evidenceOnly),
  };
}

function validatePresentation(presentation, workLabel) {
  if (!presentation || typeof presentation !== "object" || Array.isArray(presentation)) {
    throw new Error(`Featured work ${workLabel} is missing presentation`);
  }
  const kind = `Featured work ${workLabel} presentation`;
  requireOneOf(
    presentation,
    "desktopMediaVariant",
    PRESENTATION_VARIANTS.featured.desktopMediaVariant,
    kind,
  );
  requireOneOf(
    presentation,
    "mobileMediaAspect",
    PRESENTATION_VARIANTS.featured.mobileMediaAspect,
    kind,
  );
  requireOneOf(
    presentation,
    "siteTitleOverlay",
    PRESENTATION_VARIANTS.featured.siteTitleOverlay,
    kind,
  );
  requireOneOf(
    presentation,
    "sourceArtworkTitle",
    PRESENTATION_VARIANTS.featured.sourceArtworkTitle,
    kind,
  );
}

export function normalizeWorkPressItem(source) {
  const kind = "Work Press item";
  requireLocalized(source, "type", kind);
  requireLocalized(source, "title", kind);
  requireLocalizable(source, "source", kind);
  for (const field of ["canonicalUrl", "titleSource", "imageSource", "metadataCheckedAt"]) {
    requireField(source, field, kind);
  }
  const presentation = { cardVariant: "thumbnail-card" };
  const normalized = { ...source, presentation };
  normalized.contract = contractFor(
    "work-press",
    normalized,
    FIELD_CLASSIFICATION.workPress,
    presentation,
  );
  return normalized;
}

export function normalizeGlobalPressItem(source) {
  const kind = "Global Press item";
  for (const field of ["id", "year", "canonicalUrl", "titleSource", "imageSource", "metadataCheckedAt"]) {
    requireField(source, field, kind);
  }
  requireInteger(source, "order", kind);
  requireLocalized(source, "part", kind);
  requireLocalized(source, "title", kind);
  requireLocalizable(source, "source", kind);
  const presentation = { cardVariant: "text-note" };
  const normalized = { ...source, presentation };
  normalized.contract = contractFor(
    "global-press",
    normalized,
    FIELD_CLASSIFICATION.globalPress,
    presentation,
  );
  return normalized;
}

export function normalizeFeaturedWork(source) {
  const kind = "Featured work";
  for (const field of ["slug", "featured", "status", "year", "platform"]) {
    requireField(source, field, kind);
  }
  requireInteger(source, "order", kind);
  for (const field of ["title", "role", "tagline", "description"]) {
    requireLocalized(source, field, kind);
  }
  requireLocalizable(source, "platform", kind);
  requireField(source, "presentation", kind);
  validatePresentation(source.presentation, source.slug);

  const presentation = { ...source.presentation };
  const normalized = {
    ...source,
    press: (source.press || []).map(normalizeWorkPressItem),
    presentation,
  };

  delete normalized.hideMediaLabel;
  delete normalized.featuredMediaAspect;
  normalized.hideMediaLabel = presentation.siteTitleOverlay === "none";
  if (presentation.desktopMediaVariant === "centered-16x9") {
    normalized.featuredMediaAspect = "16:9";
  }
  normalized.contract = contractFor(
    "featured-work",
    normalized,
    FIELD_CLASSIFICATION.featured,
    presentation,
  );
  return normalized;
}

export function normalizeArchiveItem(source) {
  const kind = "Archive item";
  for (const field of ["slug", "year"]) requireField(source, field, kind);
  requireInteger(source, "order", kind);
  requireLocalized(source, "title", kind);
  requireLocalized(source, "role", kind);
  const presentation = {
    cardVariant: "standard",
    mediaCapability: source.posterImage ? "poster" : "index-fallback",
  };
  const normalized = { ...source, presentation };
  normalized.contract = contractFor(
    "archive-item",
    normalized,
    FIELD_CLASSIFICATION.archive,
    presentation,
  );
  return normalized;
}

function assertUnique(records, identityField, orderField, label) {
  const identities = new Set();
  const orders = new Set();
  for (const record of records) {
    if (identities.has(record[identityField])) {
      throw new Error(`${label} ${identityField} must be unique: ${record[identityField]}`);
    }
    if (orders.has(record[orderField])) {
      throw new Error(`${label} ${orderField} must be unique: ${record[orderField]}`);
    }
    identities.add(record[identityField]);
    orders.add(record[orderField]);
  }
}

export function validatePortfolioCollections({ works = [], archive = [], press = [] }) {
  const normalizedWorks = works.map(normalizeFeaturedWork);
  const normalizedArchive = archive.map(normalizeArchiveItem);
  const normalizedPress = press.map(normalizeGlobalPressItem);
  assertUnique(normalizedWorks, "slug", "order", "Featured work");
  assertUnique(normalizedArchive, "slug", "order", "Archive");
  assertUnique(normalizedPress, "id", "order", "Global Press");
  return {
    works: normalizedWorks,
    archive: normalizedArchive,
    press: normalizedPress,
  };
}
