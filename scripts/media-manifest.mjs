import { existsSync } from "node:fs";
import { resolve } from "node:path";

const FOCAL_POINT = /^\d{1,3}% \d{1,3}%$/;

function requireFocalPoint(value, field) {
  if (!FOCAL_POINT.test(value || "")) throw new Error(`${field} must use X% Y%`);
}

function requireDimensions(value, field) {
  if (!(value?.width > 0) || !(value?.height > 0)) {
    throw new Error(`${field} must contain positive width and height`);
  }
}

function requireLocalizedAlt(value, field) {
  for (const lang of ["en", "zh"]) {
    if (!value?.[lang]?.trim()) throw new Error(`${field}.${lang} is required`);
  }
}

export function validateMediaManifest(manifest, publicDir = "public") {
  const hero = manifest?.hero;
  if (hero?.treatment !== "split-showreel") {
    throw new Error("hero.treatment must be split-showreel");
  }
  if (!hero.poster || !hero.video) {
    throw new Error("split-showreel requires hero.poster and hero.video");
  }
  if (!(hero.dimensions?.width > 0) || !(hero.dimensions?.height > 0)) {
    throw new Error("split-showreel requires positive hero.dimensions");
  }
  for (const field of ["desktopFocalPoint", "mobileFocalPoint"]) {
    requireFocalPoint(hero[field], `hero.${field}`);
  }
  for (const lang of ["en", "zh"]) {
    if (!hero.alt?.[lang]?.trim()) throw new Error(`hero.alt.${lang} is required`);
  }
  for (const [role, asset] of [
    ["poster", hero.poster],
    ["video", hero.video],
  ]) {
    if (/^https?:/.test(asset)) continue;
    const localPath = resolve(publicDir, asset.replace(/^\//, ""));
    if (!existsSync(localPath)) throw new Error(`hero.${role} does not exist: ${localPath}`);
  }
}

export function validateWorkMediaContract(works) {
  if (!Array.isArray(works)) throw new Error("works must be an array");

  for (const work of works) {
    const role = work?.slug || "work";
    requireFocalPoint(work?.focalPoint, `${role}.focalPoint`);
    requireFocalPoint(work?.mobileFocalPoint, `${role}.mobileFocalPoint`);

    if (work?.posterImage) {
      requireLocalizedAlt(work.posterAlt, `${role}.posterAlt`);
      requireDimensions(work.posterDimensions, `${role}.posterDimensions`);
    }

    for (const [index, image] of (work?.supportingImages || []).entries()) {
      const imageRole = `${role}.supportingImages[${index}]`;
      if (!image?.src) throw new Error(`${imageRole}.src is required`);
      requireLocalizedAlt(image.alt, `${imageRole}.alt`);
      requireFocalPoint(image.focalPoint, `${imageRole}.focalPoint`);
      requireFocalPoint(image.mobileFocalPoint, `${imageRole}.mobileFocalPoint`);
      requireDimensions(image.dimensions, `${imageRole}.dimensions`);
    }
  }
}
