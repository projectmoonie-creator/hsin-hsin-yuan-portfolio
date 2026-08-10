import { deriveHeroDelivery } from "./hero-image-delivery.mjs";

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

export const FEATURED_REEL_MODES = Object.freeze(["after-hold"]);
export const FEATURED_REEL_PUBLIC_FIELDS = Object.freeze([
  "featuredReelMode",
  "featuredReelUrl",
  "featuredReelPoster",
]);
export const FEATURED_REEL_EVIDENCE_FIELDS = Object.freeze([
  "featuredReelSourceFilename",
  "featuredReelSourceSha256",
  "featuredReelSourceDuration",
  "featuredReelSourceDimensions",
  "featuredReelRightsStatus",
]);

export const HERO_MEDIA_MOTIONS = Object.freeze(["slow-push"]);
export const HERO_MEDIA_MOTION_PROFILES = Object.freeze({
  "slow-push": Object.freeze({ startScale: 1.4, endScale: 1.48 }),
});
export const HERO_MEDIA_RIGHTS_STATUSES = Object.freeze([
  "user-supplied-local-source",
]);

export const COLLABORATION_LOGO_OPTICAL_TOKENS = Object.freeze({
  compact: Object.freeze({ height: 40, maxWidth: 116 }),
  standard: Object.freeze({ height: 34, maxWidth: 142 }),
  wide: Object.freeze({ height: 28, maxWidth: 164 }),
});
export const COLLABORATION_LOGO_SOURCE_TREATMENTS = Object.freeze([
  "remove-background-rects",
]);

export const FIELD_CLASSIFICATION = Object.freeze({
  featured: Object.freeze({
    requiredRendered: Object.freeze([
      "slug", "featured", "order", "status", "year", "title", "role",
      "platform", "tagline", "description", "presentation",
    ]),
    optionalRendered: Object.freeze([
      "accent", ...FEATURED_REEL_PUBLIC_FIELDS,
      "figmaPosterImage", "metrics", "metricsContext", "posterAlt", "posterFit",
      "posterImage", "press", "showWatchCta", "statusLabel", "tags",
      "videoEmbedUrl", "watchLabel", "watchLoopTarget", "watchMode", "watchUrl",
      "mediaWatchUrl", "mediaTitleLines",
    ]),
    evidenceOnly: Object.freeze([
      ...FEATURED_REEL_EVIDENCE_FIELDS,
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

function requireLocalized(source, field, kind, { allowBlank = false } = {}) {
  requireField(source, field, kind);
  const value = source[field];
  const localeIsValid = (localeValue) => typeof localeValue === "string"
    && (localeValue === "" ? allowBlank : Boolean(localeValue.trim()));
  if (!value || typeof value !== "object" || Array.isArray(value)
    || !localeIsValid(value.en)
    || !localeIsValid(value.zh)) {
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

function requireObject(value, kind) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${kind} must be an object`);
  }
}

function rejectUnknownFields(source, allowedFields, kind) {
  for (const field of Object.keys(source)) {
    if (!allowedFields.includes(field)) {
      throw new Error(`${kind} has unknown field ${field}`);
    }
  }
}

function freezeDeep(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) freezeDeep(nested);
  return Object.freeze(value);
}

export function validateSiteCopy(source) {
  const kind = "Site copy";
  requireObject(source, kind);
  const availabilityByLocale = {};
  for (const locale of ["en", "zh"]) {
    requireObject(source[locale], `${kind} ${locale}`);
    if (typeof source[locale].navPrimaryAria !== "string" || !source[locale].navPrimaryAria.trim()) {
      throw new Error(`${kind} ${locale} requires navPrimaryAria`);
    }
    const availability = source[locale].availability;
    if (!Array.isArray(availability) || availability.length === 0) {
      throw new Error(`${kind} ${locale} availability must be a non-empty array`);
    }
    for (const [index, item] of availability.entries()) {
      if (typeof item !== "string" || (item !== "" && !item.trim())) {
        throw new Error(`${kind} ${locale} availability[${index}] must be content or an intentional empty string`);
      }
    }
    availabilityByLocale[locale] = availability;
  }
  if (availabilityByLocale.en.length !== availabilityByLocale.zh.length) {
    throw new Error(`${kind} locales must keep a matching availability shape`);
  }
  return source;
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

export function normalizeCollaboration(source) {
  const kind = "CollaborationMark";
  requireObject(source, kind);
  rejectUnknownFields(source, ["id", "name", "label", "url", "logo"], kind);
  for (const field of ["id", "name", "label"]) requireField(source, field, kind);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id)) {
    throw new Error(`${kind} id must use lowercase kebab-case`);
  }
  requireLocalizable(source, "name", kind);
  requireLocalizable(source, "label", kind);
  if (source.url && !isHttpsUrl(source.url)) {
    throw new Error(`${kind} ${source.id} url must be an HTTPS URL`);
  }

  let logo = null;
  let logoEvidence = null;
  if (source.logo) {
    requireObject(source.logo, `${kind} ${source.id} logo`);
    rejectUnknownFields(
      source.logo,
      [
        "src", "sourceFile", "dimensions", "opticalSize", "sourceUrl",
        "sourceSha256", "sourceCheckedAt", "rightsStatus", "sourceTreatment",
      ],
      `${kind} ${source.id} logo`,
    );
    for (const field of [
      "src", "sourceFile", "dimensions", "opticalSize", "sourceUrl",
      "sourceSha256", "sourceCheckedAt", "rightsStatus",
    ]) {
      requireField(source.logo, field, `${kind} ${source.id} logo`);
    }
    const publicPathSegments = String(source.logo.src).split("/");
    if (!/^\/assets\/logos\/[a-z0-9-]+-mono\.svg$/.test(source.logo.src)
      || source.logo.src.includes("\\")
      || source.logo.src.includes("//")
      || publicPathSegments.some((segment) => segment === "." || segment === "..")) {
      throw new Error(`${kind} ${source.id} logo src must be a normalized local logo asset`);
    }
    if (!/^assets\/collaboration-logos\/sources\/[a-z0-9-]+\.(?:png|svg)$/.test(source.logo.sourceFile)
      || source.logo.sourceFile.includes("\\")
      || source.logo.sourceFile.includes("//")) {
      throw new Error(`${kind} ${source.id} logo sourceFile must be a normalized collaboration source asset`);
    }
    requireObject(source.logo.dimensions, `${kind} ${source.id} logo dimensions`);
    rejectUnknownFields(source.logo.dimensions, ["width", "height"], `${kind} ${source.id} logo dimensions`);
    for (const field of ["width", "height"]) {
      if (!Number.isInteger(source.logo.dimensions[field]) || source.logo.dimensions[field] <= 0) {
        throw new Error(`${kind} ${source.id} logo dimensions ${field} must be a positive integer`);
      }
    }
    const token = COLLABORATION_LOGO_OPTICAL_TOKENS[source.logo.opticalSize];
    if (!token) {
      throw new Error(`${kind} ${source.id} logo opticalSize must be one of: ${Object.keys(COLLABORATION_LOGO_OPTICAL_TOKENS).join(", ")}`);
    }
    if (!isHttpsUrl(source.logo.sourceUrl)) {
      throw new Error(`${kind} ${source.id} logo sourceUrl must be an HTTPS URL`);
    }
    if (!/^[0-9a-f]{64}$/.test(source.logo.sourceSha256)) {
      throw new Error(`${kind} ${source.id} logo sourceSha256 must be a lowercase SHA-256`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.logo.sourceCheckedAt)) {
      throw new Error(`${kind} ${source.id} logo sourceCheckedAt must use YYYY-MM-DD`);
    }
    if (source.logo.rightsStatus !== "official-mark-nominative-use") {
      throw new Error(`${kind} ${source.id} logo rightsStatus must be official-mark-nominative-use`);
    }
    if (source.logo.sourceTreatment
      && !COLLABORATION_LOGO_SOURCE_TREATMENTS.includes(source.logo.sourceTreatment)) {
      throw new Error(`${kind} ${source.id} logo sourceTreatment must be one of: ${COLLABORATION_LOGO_SOURCE_TREATMENTS.join(", ")}`);
    }
    if (source.logo.sourceTreatment && !source.logo.sourceFile.endsWith(".svg")) {
      throw new Error(`${kind} ${source.id} logo sourceTreatment requires an SVG source`);
    }
    logo = {
      src: source.logo.src,
      dimensions: { ...source.logo.dimensions },
      opticalSize: source.logo.opticalSize,
      opticalToken: { ...token },
    };
    logoEvidence = {
      sourceFile: source.logo.sourceFile,
      sourceUrl: source.logo.sourceUrl,
      sourceSha256: source.logo.sourceSha256,
      sourceCheckedAt: source.logo.sourceCheckedAt,
      rightsStatus: source.logo.rightsStatus,
      ...(source.logo.sourceTreatment ? { sourceTreatment: source.logo.sourceTreatment } : {}),
    };
  }

  const publicFields = {
    id: source.id,
    name: typeof source.name === "object" ? { ...source.name } : source.name,
    label: typeof source.label === "object" ? { ...source.label } : source.label,
    ...(source.url ? { url: source.url } : {}),
    logo,
  };
  return freezeDeep({
    ...publicFields,
    contract: {
      kind: "collaboration-mark",
      public: publicFields,
      evidence: { logo: logoEvidence },
    },
  });
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeCollaborations(items) {
  if (!Array.isArray(items)) throw new Error("CollaborationMark collection must be an array");
  const ids = new Set();
  return items.map((item) => {
    const normalized = normalizeCollaboration(item);
    if (ids.has(normalized.id)) {
      throw new Error(`CollaborationMark id must be unique: ${normalized.id}`);
    }
    ids.add(normalized.id);
    return normalized;
  });
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

function validateFeaturedReel(source) {
  const kind = `Featured work ${labelFor(source, "<unknown>")}`;
  const presentPublicFields = FEATURED_REEL_PUBLIC_FIELDS.filter((field) => Object.hasOwn(source, field));
  if (presentPublicFields.length > 0 && presentPublicFields.length < FEATURED_REEL_PUBLIC_FIELDS.length) {
    throw new Error(`${kind} requires a complete featured reel triplet`);
  }
  if (presentPublicFields.length === FEATURED_REEL_PUBLIC_FIELDS.length) {
    if (!FEATURED_REEL_MODES.includes(source.featuredReelMode)) {
      throw new Error(`${kind} featuredReelMode must be one of: ${FEATURED_REEL_MODES.join(", ")}`);
    }
    for (const field of ["featuredReelUrl", "featuredReelPoster"]) {
      if (typeof source[field] !== "string" || !source[field].trim()) {
        throw new Error(`${kind} ${field} must be non-empty`);
      }
    }
  }

  const presentProvenanceFields = FEATURED_REEL_EVIDENCE_FIELDS.filter((field) => Object.hasOwn(source, field));
  if (presentProvenanceFields.length > 0
    && presentProvenanceFields.length < FEATURED_REEL_EVIDENCE_FIELDS.length) {
    throw new Error(`${kind} requires complete featured reel provenance`);
  }
  if (presentProvenanceFields.length !== FEATURED_REEL_EVIDENCE_FIELDS.length) return;

  for (const field of ["featuredReelSourceFilename", "featuredReelRightsStatus"]) {
    if (typeof source[field] !== "string" || !source[field].trim()) {
      throw new Error(`${kind} ${field} must be non-empty`);
    }
  }
  if (!/^[0-9a-f]{64}$/.test(source.featuredReelSourceSha256)) {
    throw new Error(`${kind} featuredReelSourceSha256 must be a lowercase SHA-256`);
  }
  if (typeof source.featuredReelSourceDuration !== "number"
    || !Number.isFinite(source.featuredReelSourceDuration)
    || source.featuredReelSourceDuration <= 0) {
    throw new Error(`${kind} featuredReelSourceDuration must be a positive number`);
  }
  const dimensions = source.featuredReelSourceDimensions;
  if (!dimensions || typeof dimensions !== "object" || Array.isArray(dimensions)
    || typeof dimensions.width !== "number" || !Number.isFinite(dimensions.width) || dimensions.width <= 0
    || typeof dimensions.height !== "number" || !Number.isFinite(dimensions.height) || dimensions.height <= 0) {
    throw new Error(`${kind} featuredReelSourceDimensions must contain positive numbers`);
  }
}

export function normalizeHeroMedia(source) {
  const kind = "HeroMedia";
  requireObject(source, kind);
  rejectUnknownFields(
    source,
    ["id", "src", "alt", "dimensions", "focalPoint", "motion", "motionProfile", "sourceSha256", "delivery", "rightsStatus"],
    kind,
  );
  for (const field of ["id", "src", "alt", "dimensions", "focalPoint", "motion", "sourceSha256", "delivery"]) {
    requireField(source, field, kind);
  }
  if (source.id !== "site.hero") {
    throw new Error(`${kind} id must be site.hero`);
  }

  const srcSegments = String(source.src).split("/");
  if (!/^\/assets\/portfolio\/[^?#]+$/.test(source.src)
    || !/\.jpe?g$/i.test(source.src)
    || source.src.includes("\\")
    || source.src.includes("//")
    || srcSegments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(`${kind} src must be a normalized local portfolio asset`);
  }

  requireObject(source.alt, `${kind} alt`);
  rejectUnknownFields(source.alt, ["en", "zh"], `${kind} alt`);
  requireLocalized(source, "alt", kind);

  requireObject(source.dimensions, `${kind} dimensions`);
  rejectUnknownFields(source.dimensions, ["width", "height"], `${kind} dimensions`);
  for (const field of ["width", "height"]) {
    if (!Number.isInteger(source.dimensions[field]) || source.dimensions[field] <= 0) {
      throw new Error(`${kind} dimensions ${field} must be a positive integer`);
    }
  }

  requireObject(source.focalPoint, `${kind} focalPoint`);
  rejectUnknownFields(source.focalPoint, ["wide", "stacked", "mobile"], `${kind} focalPoint`);
  for (const layout of ["wide", "stacked", "mobile"]) {
    if (!Object.hasOwn(source.focalPoint, layout)) {
      throw new Error(`${kind} focalPoint is missing ${layout}`);
    }
    const focal = source.focalPoint[layout];
    requireObject(focal, `${kind} focalPoint ${layout}`);
    rejectUnknownFields(focal, ["x", "y"], `${kind} focalPoint ${layout}`);
    for (const axis of ["x", "y"]) {
      if (!Number.isFinite(focal[axis]) || focal[axis] < 0 || focal[axis] > 1) {
        throw new Error(`${kind} focalPoint ${layout} ${axis} must be between 0 and 1`);
      }
    }
  }

  if (!HERO_MEDIA_MOTIONS.includes(source.motion)) {
    throw new Error(`${kind} motion must be one of: ${HERO_MEDIA_MOTIONS.join(", ")}`);
  }
  const motionProfile = HERO_MEDIA_MOTION_PROFILES[source.motion];
  if (Object.hasOwn(source, "motionProfile")) {
    requireObject(source.motionProfile, `${kind} motionProfile`);
    rejectUnknownFields(source.motionProfile, ["startScale", "endScale"], `${kind} motionProfile`);
    if (source.motionProfile.startScale !== motionProfile.startScale
      || source.motionProfile.endScale !== motionProfile.endScale) {
      throw new Error(`${kind} motionProfile must match motion ${source.motion}`);
    }
  }
  if (!/^[0-9a-f]{64}$/.test(source.sourceSha256)) {
    throw new Error(`${kind} sourceSha256 must be a lowercase SHA-256`);
  }

  requireObject(source.delivery, `${kind} delivery`);
  rejectUnknownFields(source.delivery, ["directory", "formats", "profiles"], `${kind} delivery`);
  for (const field of ["directory", "formats", "profiles"]) {
    requireField(source.delivery, field, `${kind} delivery`);
  }
  const deliverySegments = String(source.delivery.directory).split("/");
  if (!/^\/assets\/portfolio\/[a-z0-9/-]+$/.test(source.delivery.directory)
    || source.delivery.directory.endsWith("/")
    || source.delivery.directory.includes("//")
    || deliverySegments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(`${kind} delivery directory must be a normalized local portfolio directory`);
  }
  requireObject(source.delivery.formats, `${kind} delivery formats`);
  rejectUnknownFields(source.delivery.formats, ["avif", "webp", "jpeg"], `${kind} delivery formats`);
  for (const format of ["avif", "webp", "jpeg"]) {
    requireField(source.delivery.formats, format, `${kind} delivery formats`);
    requireObject(source.delivery.formats[format], `${kind} delivery formats ${format}`);
    rejectUnknownFields(source.delivery.formats[format], ["quality"], `${kind} delivery formats ${format}`);
    const quality = source.delivery.formats[format].quality;
    if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
      throw new Error(`${kind} delivery formats ${format} quality must be an integer between 1 and 100`);
    }
  }
  requireObject(source.delivery.profiles, `${kind} delivery profiles`);
  rejectUnknownFields(source.delivery.profiles, ["mobile", "desktop"], `${kind} delivery profiles`);
  for (const profileName of ["mobile", "desktop"]) {
    requireField(source.delivery.profiles, profileName, `${kind} delivery profiles`);
    const profile = source.delivery.profiles[profileName];
    requireObject(profile, `${kind} delivery profiles ${profileName}`);
    rejectUnknownFields(profile, ["media", "sizes", "widths", "preloadWidth"], `${kind} delivery profiles ${profileName}`);
    for (const field of ["media", "sizes", "widths", "preloadWidth"]) {
      requireField(profile, field, `${kind} delivery profiles ${profileName}`);
    }
    if (typeof profile.media !== "string" || !/^\((?:min|max)-width: \d+px\)$/.test(profile.media)) {
      throw new Error(`${kind} delivery profiles ${profileName} media must be one simple width query`);
    }
    if (typeof profile.sizes !== "string" || !profile.sizes.trim() || /[<>"']/.test(profile.sizes)) {
      throw new Error(`${kind} delivery profiles ${profileName} sizes must be a safe non-empty string`);
    }
    if (!Array.isArray(profile.widths) || profile.widths.length === 0
      || profile.widths.some((width) => !Number.isInteger(width) || width <= 0 || width > source.dimensions.width)
      || new Set(profile.widths).size !== profile.widths.length
      || profile.widths.some((width, index) => index > 0 && width <= profile.widths[index - 1])) {
      throw new Error(`${kind} delivery profiles ${profileName} widths must be unique increasing positive integers within source width`);
    }
    if (!profile.widths.includes(profile.preloadWidth)) {
      throw new Error(`${kind} delivery profiles ${profileName} preloadWidth must occur in widths`);
    }
  }
  if (!HERO_MEDIA_RIGHTS_STATUSES.includes(source.rightsStatus)) {
    throw new Error(`${kind} rightsStatus must be one of: ${HERO_MEDIA_RIGHTS_STATUSES.join(", ")}`);
  }

  const publicFields = {
    id: source.id,
    src: source.src,
    alt: { ...source.alt },
    dimensions: { ...source.dimensions },
    focalPoint: Object.fromEntries(
      Object.entries(source.focalPoint).map(([layout, focal]) => [layout, { ...focal }]),
    ),
    motion: source.motion,
    motionProfile: { ...motionProfile },
    delivery: deriveHeroDelivery({ src: source.src, delivery: source.delivery }),
  };
  return freezeDeep({
    ...publicFields,
    rightsStatus: source.rightsStatus,
    contract: {
      kind: "hero-media",
      public: publicFields,
      evidence: {
        rightsStatus: source.rightsStatus,
        delivery: {
          sourceSha256: source.sourceSha256,
          formats: Object.fromEntries(
            Object.entries(source.delivery.formats).map(([format, settings]) => [format, { ...settings }]),
          ),
        },
      },
    },
  });
}

export function normalizeWorkPressItem(source) {
  const kind = "Work Press item";
  requireLocalized(source, "type", kind);
  requireLocalized(source, "title", kind, { allowBlank: true });
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
  for (const field of ["title", "role", "description"]) {
    requireLocalized(source, field, kind);
  }
  requireLocalized(source, "tagline", kind, { allowBlank: true });
  requireLocalizable(source, "platform", kind);
  requireField(source, "presentation", kind);
  validatePresentation(source.presentation, source.slug);
  validateFeaturedReel(source);

  const presentation = { ...source.presentation };
  const normalized = {
    ...source,
    press: (source.press || []).map(normalizeWorkPressItem),
    presentation,
  };

  // Transitional compatibility adapter: the current renderer still reads
  // these flattened aliases. Remove them only after it consumes
  // contract.public directly and the frozen public-output hashes still match.
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
