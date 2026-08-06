#!/usr/bin/env node

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createArchiveMediaPackagePlan } from "./lib/media-package-plan.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const allowedOptions = new Set([
  "slug",
  "reel",
  "poster",
  "poster-source-kind",
  "rights",
  "timecode",
  "alt-en",
  "alt-zh",
  "focal-x",
  "focal-y",
]);

function parseArguments(args) {
  if (args.length % 2 !== 0) throw new Error("Every option requires one value");
  const values = {};
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!option.startsWith("--") || !allowedOptions.has(option.slice(2))) {
      throw new Error(`Unknown option: ${option}`);
    }
    values[option.slice(2)] = value;
  }
  return values;
}

const values = parseArguments(process.argv.slice(2));
const plan = createArchiveMediaPackagePlan({
  slug: values.slug,
  reelPath: values.reel,
  posterPath: values.poster,
  posterSourceKind: values["poster-source-kind"] || "video-frame",
  rightsStatus: values.rights,
  posterSourceTimecode: values.timecode,
  imageAlt: { en: values["alt-en"], zh: values["alt-zh"] },
  posterFocalPoint: { x: Number(values["focal-x"]), y: Number(values["focal-y"]) },
}, { repoRoot });

process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
