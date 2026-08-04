#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { applyArchiveMediaPackage } from "./lib/media-package-apply.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const allowedOptions = new Set(["plan", "reel", "poster", "confirm"]);

function parseArguments(args) {
  if (args.length % 2 !== 0) throw new Error("every option requires one value");
  const values = {};
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    const name = option.startsWith("--") ? option.slice(2) : "";
    if (!allowedOptions.has(name)) throw new Error("unknown or positional option");
    if (Object.hasOwn(values, name)) throw new Error("duplicate option");
    if (!value) throw new Error("every option requires one value");
    values[name] = value;
  }
  for (const name of allowedOptions) {
    if (!Object.hasOwn(values, name)) throw new Error("all apply options are required");
  }
  return values;
}

try {
  const values = parseArguments(process.argv.slice(2));
  let approvedPlanText;
  try {
    approvedPlanText = readFileSync(values.plan, "utf8");
  } catch {
    throw new Error("approved plan could not be read");
  }
  const result = applyArchiveMediaPackage({
    approvedPlanText,
    reelPath: values.reel,
    posterPath: values.poster,
    confirmSlug: values.confirm,
  }, { repoRoot });
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  process.stderr.write(`media:apply: ${error?.message || "failed"}\n`);
  process.exitCode = 1;
}
