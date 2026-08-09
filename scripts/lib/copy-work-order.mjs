import {
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join, normalize, relative, sep } from "node:path";

const ALLOWED_LOCALES = ["en", "zh"];
const ALLOWED_PRIORITIES = ["P0", "P1"];
const ALLOWED_OPERATIONS = new Set(["replace", "keep"]);

function fail(message) {
  throw new Error(`Copy work order: ${message}`);
}

function assertExactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) fail(`${label} has unknown field ${key}`);
  }
}

function assertNonemptyString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    fail(`${label} must be a non-empty string`);
  }
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateStableTarget(entry, index) {
  if (entry.stableKey.startsWith("site.")) {
    if (entry.sourceFile !== "data/site.json") {
      fail(`entry ${index} site stable key must use data/site.json`);
    }
    return;
  }

  const featured = entry.stableKey.match(/^featured\.([a-z0-9]+(?:-[a-z0-9]+)*)\.(.+)$/);
  if (!featured) fail(`entry ${index} uses an unsupported stable key family`);
  if (entry.sourceFile !== `content/works/${featured[1]}.md`) {
    fail(`entry ${index} featured stable key and source file disagree`);
  }
}

export function validateCopyWorkOrder(input) {
  const value = clone(input);
  assertExactKeys(value, [
    "schemaVersion",
    "batchId",
    "baselineCommit",
    "sourceArtifacts",
    "localeScope",
    "priorityOrder",
    "entries",
  ], "root");
  if (value.schemaVersion !== 1) fail("schemaVersion must be 1");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.batchId || "")) fail("batchId must use kebab-case");
  if (!/^[a-f0-9]{40}$/.test(value.baselineCommit || "")) fail("baselineCommit must be a lowercase commit SHA");
  if (!Array.isArray(value.sourceArtifacts) || value.sourceArtifacts.length === 0) fail("sourceArtifacts must not be empty");
  for (const [index, artifact] of value.sourceArtifacts.entries()) {
    assertExactKeys(artifact, ["name", "sha256"], `sourceArtifacts[${index}]`);
    if (!/^[^/\\]+$/.test(artifact.name || "")) fail(`sourceArtifacts[${index}].name must be a basename`);
    if (!/^[a-f0-9]{64}$/.test(artifact.sha256 || "")) fail(`sourceArtifacts[${index}].sha256 must be lowercase SHA-256`);
  }
  if (JSON.stringify(value.localeScope) !== JSON.stringify(ALLOWED_LOCALES)) fail("localeScope must be paired en, zh");
  if (JSON.stringify(value.priorityOrder) !== JSON.stringify(ALLOWED_PRIORITIES)) fail("priorityOrder must be P0, P1");
  if (!Array.isArray(value.entries) || value.entries.length === 0) fail("entries must not be empty");

  const stableKeys = new Set();
  for (const [index, entry] of value.entries.entries()) {
    assertExactKeys(entry, ["priority", "sourceFile", "stableKey", "changes"], `entries[${index}]`);
    if (!ALLOWED_PRIORITIES.includes(entry.priority)) fail(`entry ${index} has unsupported priority`);
    assertNonemptyString(entry.sourceFile, `entries[${index}].sourceFile`);
    if (isAbsolute(entry.sourceFile) || normalize(entry.sourceFile) !== entry.sourceFile || entry.sourceFile.includes("..")) {
      fail(`entry ${index} sourceFile must be a normalized relative path`);
    }
    assertNonemptyString(entry.stableKey, `entries[${index}].stableKey`);
    validateStableTarget(entry, index);
    if (stableKeys.has(entry.stableKey)) fail(`stable key must be unique: ${entry.stableKey}`);
    stableKeys.add(entry.stableKey);
    assertExactKeys(entry.changes, ALLOWED_LOCALES, `entries[${index}].changes`);

    for (const locale of ALLOWED_LOCALES) {
      const change = entry.changes[locale];
      assertExactKeys(change, ["op", "expected", "value"], `${entry.stableKey}.${locale}`);
      if (!ALLOWED_OPERATIONS.has(change.op)) fail(`${entry.stableKey}.${locale} has unsupported operation`);
      assertNonemptyString(change.expected, `${entry.stableKey}.${locale}.expected`);
      if (change.op === "replace") {
        assertNonemptyString(change.value, `${entry.stableKey}.${locale}.value`);
        if (change.value === change.expected) fail(`${entry.stableKey}.${locale} replace must change the value`);
      } else if (Object.hasOwn(change, "value")) {
        fail(`${entry.stableKey}.${locale} keep must not declare value`);
      }
    }
  }

  return deepFreeze(value);
}

function parseSource(sourceFile, source) {
  if (sourceFile === "data/site.json") return JSON.parse(source);
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) fail(`${sourceFile} is missing JSON frontmatter`);
  return JSON.parse(match[1]);
}

function extractJsonDocument(sourceFile, source) {
  if (sourceFile === "data/site.json") return { source, offset: 0 };
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) fail(`${sourceFile} is missing JSON frontmatter`);
  return { source: match[1], offset: source.indexOf(match[1]) };
}

function parsePropertyPath(path) {
  const tokens = [];
  for (const part of path.split(".")) {
    const match = part.match(/^([A-Za-z][A-Za-z0-9]*)(?:\[(\d+)\])?$/);
    if (!match) fail(`unsupported property path ${path}`);
    tokens.push(match[1]);
    if (match[2] !== undefined) tokens.push(Number(match[2]));
  }
  return tokens;
}

function resolveValue(root, tokens, stableKey, locale) {
  let current = root;
  for (const token of tokens) {
    if (current == null || !Object.hasOwn(current, token)) {
      fail(`${stableKey}.${locale} does not resolve`);
    }
    current = current[token];
  }
  if (typeof current !== "string") fail(`${stableKey}.${locale} must resolve to a string`);
  return current;
}

function targetTokens(entry, locale, parsed) {
  if (entry.stableKey.startsWith("site.")) {
    const tokens = parsePropertyPath(entry.stableKey.slice("site.".length));
    return { root: parsed[locale], tokens, documentTokens: [locale, ...tokens] };
  }
  const [, slug, propertyPath] = entry.stableKey.match(/^featured\.([a-z0-9-]+)\.(.+)$/);
  if (parsed.slug !== slug) fail(`${entry.stableKey} does not match frontmatter slug`);
  const tokens = [...parsePropertyPath(propertyPath), locale];
  return { root: parsed, tokens, documentTokens: tokens };
}

function readSources(repoRoot, entries) {
  const sources = new Map();
  for (const entry of entries) {
    if (sources.has(entry.sourceFile)) continue;
    const path = safeSourcePath(repoRoot, entry.sourceFile);
    const source = readFileSync(path, "utf8");
    sources.set(entry.sourceFile, {
      path,
      source,
      parsed: parseSource(entry.sourceFile, source),
      document: extractJsonDocument(entry.sourceFile, source),
    });
  }
  return sources;
}

function assertPredecessorsApplied({ validated, priority, sources }) {
  if (priority === undefined) return;
  const priorityIndex = validated.priorityOrder.indexOf(priority);
  for (const entry of validated.entries) {
    if (validated.priorityOrder.indexOf(entry.priority) >= priorityIndex) continue;
    const record = sources.get(entry.sourceFile);
    for (const locale of validated.localeScope) {
      const change = entry.changes[locale];
      const target = targetTokens(entry, locale, record.parsed);
      const current = resolveValue(target.root, target.tokens, entry.stableKey, locale);
      const required = change.op === "replace" ? change.value : change.expected;
      if (current !== required) fail(`${priority} requires ${entry.priority} to be applied first`);
    }
  }
}

function locateJsonStringSpan({ document, tokens, expected, stableKey, locale }) {
  const source = document.source;
  const matches = [];
  let index = 0;
  const skipWhitespace = () => {
    while (/\s/.test(source[index] || "")) index += 1;
  };
  const parseString = () => {
    skipWhitespace();
    const start = index;
    if (source[index] !== '"') fail(`${stableKey}.${locale} has invalid JSON source`);
    index += 1;
    while (index < source.length) {
      if (source[index] === "\\") {
        index += 2;
        continue;
      }
      if (source[index] === '"') {
        index += 1;
        const end = index;
        return { start, end, value: JSON.parse(source.slice(start, end)) };
      }
      index += 1;
    }
    fail(`${stableKey}.${locale} has an unterminated JSON string`);
  };
  const pathMatches = (path) => path.length === tokens.length
    && path.every((token, tokenIndex) => token === tokens[tokenIndex]);
  const parseValue = (path) => {
    skipWhitespace();
    if (source[index] === '"') {
      const string = parseString();
      if (pathMatches(path)) matches.push(string);
      return;
    }
    if (source[index] === "{") {
      index += 1;
      skipWhitespace();
      if (source[index] === "}") {
        index += 1;
        return;
      }
      while (index < source.length) {
        const key = parseString().value;
        skipWhitespace();
        if (source[index] !== ":") fail(`${stableKey}.${locale} has invalid JSON object syntax`);
        index += 1;
        parseValue([...path, key]);
        skipWhitespace();
        if (source[index] === "}") {
          index += 1;
          return;
        }
        if (source[index] !== ",") fail(`${stableKey}.${locale} has invalid JSON object separator`);
        index += 1;
      }
    }
    if (source[index] === "[") {
      index += 1;
      skipWhitespace();
      if (source[index] === "]") {
        index += 1;
        return;
      }
      let itemIndex = 0;
      while (index < source.length) {
        parseValue([...path, itemIndex]);
        itemIndex += 1;
        skipWhitespace();
        if (source[index] === "]") {
          index += 1;
          return;
        }
        if (source[index] !== ",") fail(`${stableKey}.${locale} has invalid JSON array separator`);
        index += 1;
      }
    }
    const primitiveStart = index;
    while (index < source.length && !/[\s,\]}]/.test(source[index])) index += 1;
    if (primitiveStart === index) fail(`${stableKey}.${locale} has invalid JSON value`);
  };

  parseValue([]);
  if (matches.length !== 1) fail(`${stableKey}.${locale} must have one structural string token`);
  if (matches[0].value !== expected) fail(`${stableKey}.${locale} structural token does not match expected current value`);
  return {
    start: document.offset + matches[0].start,
    end: document.offset + matches[0].end,
  };
}

function safeSourcePath(repoRoot, sourceFile) {
  const path = join(repoRoot, sourceFile);
  const fromRoot = relative(repoRoot, path);
  if (fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) fail(`unsafe source file ${sourceFile}`);
  return path;
}

export function planCopyWorkOrder({ repoRoot, workOrder, priority }) {
  assertNonemptyString(repoRoot, "repoRoot");
  const validated = validateCopyWorkOrder(workOrder);
  if (priority !== undefined && !validated.priorityOrder.includes(priority)) fail(`unsupported priority ${priority}`);
  const selected = validated.entries.filter((entry) => priority === undefined || entry.priority === priority);
  const predecessors = priority === undefined
    ? []
    : validated.entries.filter((entry) => validated.priorityOrder.indexOf(entry.priority) < validated.priorityOrder.indexOf(priority));
  const sources = readSources(repoRoot, [...predecessors, ...selected]);
  assertPredecessorsApplied({ validated, priority, sources });
  const replacements = [];
  let keeps = 0;

  for (const entry of selected) {
    const record = sources.get(entry.sourceFile);
    for (const locale of validated.localeScope) {
      const change = entry.changes[locale];
      const target = targetTokens(entry, locale, record.parsed);
      const current = resolveValue(target.root, target.tokens, entry.stableKey, locale);
      if (current !== change.expected) {
        fail(`${entry.stableKey}.${locale} does not match the expected current value`);
      }
      if (change.op === "keep") {
        keeps += 1;
        continue;
      }
      const span = locateJsonStringSpan({
        document: record.document,
        tokens: target.documentTokens,
        expected: change.expected,
        stableKey: entry.stableKey,
        locale,
      });
      replacements.push({
        sourceFile: entry.sourceFile,
        stableKey: entry.stableKey,
        locale,
        valueToken: JSON.stringify(change.value),
        start: span.start,
        end: span.end,
      });
    }
  }

  return {
    summary: {
      schemaVersion: 1,
      mode: "dry-run",
      priority: priority || "all",
      entries: selected.length,
      replacements: replacements.length,
      keeps,
      conflicts: 0,
      files: [...new Set(selected.map((entry) => entry.sourceFile))].sort(),
      writesFiles: false,
    },
    replacements,
    sources,
  };
}

export function applyCopyWorkOrder(options) {
  const plan = planCopyWorkOrder(options);
  if (options.write !== true) return plan.summary;
  if (!options.priority) fail("write mode requires one priority");

  const beforeReplace = options.beforeReplace || (() => {});
  const nonce = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const targets = plan.summary.files.map((sourceFile) => {
    const record = plan.sources.get(sourceFile);
    const patches = plan.replacements
      .filter((replacement) => replacement.sourceFile === sourceFile)
      .sort((left, right) => right.start - left.start);
    let nextSource = record.source;
    for (const replacement of patches) {
      nextSource = `${nextSource.slice(0, replacement.start)}${replacement.valueToken}${nextSource.slice(replacement.end)}`;
    }
    return {
      sourceFile,
      target: record.path,
      stage: `${record.path}.copy-work-order-${nonce}.next`,
      backup: `${record.path}.copy-work-order-${nonce}.backup`,
      nextSource,
      state: "planned",
    };
  });

  try {
    for (const target of targets) {
      writeFileSync(target.stage, target.nextSource, { encoding: "utf8", flag: "wx" });
      target.state = "staged";
    }
    for (const [index, target] of targets.entries()) {
      beforeReplace({ index, target: target.sourceFile });
      renameSync(target.target, target.backup);
      target.state = "backed-up";
      renameSync(target.stage, target.target);
      target.state = "replaced";
    }
    for (const target of targets) {
      unlinkSync(target.backup);
      target.state = "complete";
    }
  } catch (error) {
    const restorationErrors = [];
    for (const target of [...targets].reverse()) {
      if (!existsSync(target.backup)) continue;
      try {
        if (existsSync(target.target)) unlinkSync(target.target);
        renameSync(target.backup, target.target);
        target.state = "restored";
      } catch (restorationError) {
        restorationErrors.push(`${target.sourceFile}: ${restorationError.message}`);
      }
    }
    if (restorationErrors.length > 0) {
      throw new Error(`${error.message}; rollback failed: ${restorationErrors.join("; ")}`);
    }
    throw error;
  } finally {
    for (const target of targets) {
      if (existsSync(target.stage)) unlinkSync(target.stage);
      if (target.state === "restored" && existsSync(target.backup)) unlinkSync(target.backup);
    }
  }

  return {
    ...plan.summary,
    mode: "write",
    writesFiles: true,
  };
}
