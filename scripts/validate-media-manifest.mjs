import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { validateMediaManifest } from "./media-manifest.mjs";

const [manifestArg, publicArg = "public"] = process.argv.slice(2);
if (!manifestArg) {
  throw new Error("Usage: validate-media-manifest.mjs <manifest.json> [public-dir]");
}

const manifest = JSON.parse(readFileSync(resolve(manifestArg), "utf8"));
validateMediaManifest(manifest, publicArg);
console.log("Media manifest is valid.");
