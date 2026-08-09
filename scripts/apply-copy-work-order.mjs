#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { applyCopyWorkOrder } from "./lib/copy-work-order.mjs";

function parseArgs(argv) {
  const options = { write: false };
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!["--work-order", "--priority", "--write"].includes(argument)) {
      throw new Error(`Unknown option: ${argument}`);
    }
    if (seen.has(argument)) throw new Error(`Repeated option: ${argument}`);
    seen.add(argument);
    if (argument === "--write") {
      options.write = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
    index += 1;
    if (argument === "--work-order") options.workOrderPath = value;
    if (argument === "--priority") options.priority = value;
  }
  if (!options.workOrderPath) throw new Error("--work-order is required");
  if (options.priority && !["P0", "P1"].includes(options.priority)) throw new Error("--priority must be P0 or P1");
  if (options.write && !options.priority) throw new Error("--write requires --priority");
  return options;
}

try {
  const options = parseArgs(process.argv.slice(2));
  const workOrder = JSON.parse(readFileSync(resolve(options.workOrderPath), "utf8"));
  const summary = applyCopyWorkOrder({
    repoRoot: process.cwd(),
    workOrder,
    priority: options.priority,
    write: options.write,
  });
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
