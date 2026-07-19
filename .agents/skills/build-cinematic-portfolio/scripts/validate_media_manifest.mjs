import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const [manifestArg, publicArg = "public"] = process.argv.slice(2);
if (!manifestArg) throw new Error("Usage: validate_media_manifest.mjs <manifest.json> [public-dir]");

const manifest = JSON.parse(readFileSync(resolve(manifestArg), "utf8"));
const hero = manifest?.hero;
if (!hero?.background) throw new Error("hero.background is required");
if (typeof hero.foreground !== "string") throw new Error("hero.foreground must be a string");
if (!/^\d{1,3}% \d{1,3}%$/.test(hero.focalPoint || "")) throw new Error("hero.focalPoint must use X% Y%");
for (const lang of ["en", "zh"]) {
  if (!hero.alt?.[lang]?.trim()) throw new Error(`hero.alt.${lang} is required`);
}

for (const [role, asset] of [["background", hero.background], ["foreground", hero.foreground]]) {
  if (!asset || /^https?:/.test(asset)) continue;
  const localPath = resolve(publicArg, asset.replace(/^\//, ""));
  if (!existsSync(localPath)) throw new Error(`hero.${role} does not exist: ${localPath}`);
}

console.log("Media manifest is valid.");
