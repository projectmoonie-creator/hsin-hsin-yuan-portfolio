import { existsSync } from "node:fs";
import { resolve } from "node:path";

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
    if (!/^\d{1,3}% \d{1,3}%$/.test(hero[field] || "")) {
      throw new Error(`hero.${field} must use X% Y%`);
    }
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
