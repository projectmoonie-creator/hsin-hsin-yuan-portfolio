import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const [manifestArg, publicArg = "public"] = process.argv.slice(2);
if (!manifestArg) throw new Error("Usage: validate_media_manifest.mjs <manifest.json> [public-dir]");

const manifest = JSON.parse(readFileSync(resolve(manifestArg), "utf8"));
const hero = manifest?.hero;
if (!hero?.background) throw new Error("hero.background is required");
if (typeof hero.foregroundCutout !== "string") throw new Error("hero.foregroundCutout must be a string");
if (hero.treatment === "portrait-carrier" && !hero.foregroundCutout) {
  throw new Error("hero.foregroundCutout is required for portrait-carrier");
}
if (!hero.abstractLayer) throw new Error("hero.abstractLayer is required");
if (!Array.isArray(hero.alternatePortraits)) throw new Error("hero.alternatePortraits must be an array");
if (!/^\d{1,3}% \d{1,3}%$/.test(hero.desktopFocalPoint || "")) {
  throw new Error("hero.desktopFocalPoint must use X% Y%");
}
if (!/^\d{1,3}% \d{1,3}%$/.test(hero.mobileFocalPoint || "")) {
  throw new Error("hero.mobileFocalPoint must use X% Y%");
}
for (const lang of ["en", "zh"]) {
  if (!hero.alt?.[lang]?.trim()) throw new Error(`hero.alt.${lang} is required`);
}

const expectedModes = ["documentary", "cross-cultural", "editorial-systems"];
if (!Array.isArray(manifest.practiceModes) || manifest.practiceModes.length !== expectedModes.length) {
  throw new Error("practiceModes must contain exactly three modes");
}
for (const [index, mode] of manifest.practiceModes.entries()) {
  if (mode?.id !== expectedModes[index]) throw new Error(`practiceModes[${index}].id must be ${expectedModes[index]}`);
  if (!mode.primary) throw new Error(`practiceModes[${index}].primary is required`);
  if (!mode.supporting) throw new Error(`practiceModes[${index}].supporting is required`);
}

const assets = [
  ["background", hero.background],
  ["foregroundCutout", hero.foregroundCutout],
  ["abstractLayer", hero.abstractLayer],
  ...hero.alternatePortraits.map((asset, index) => [`alternatePortraits[${index}]`, asset]),
  ...manifest.practiceModes.flatMap((mode, index) => [
    [`practiceModes[${index}].primary`, mode.primary],
    [`practiceModes[${index}].supporting`, mode.supporting],
  ]),
];

for (const [role, asset] of assets) {
  if (!asset || /^https?:/.test(asset)) continue;
  const localPath = resolve(publicArg, asset.replace(/^\//, ""));
  if (!existsSync(localPath)) throw new Error(`hero.${role} does not exist: ${localPath}`);
}

console.log("Media manifest is valid.");
